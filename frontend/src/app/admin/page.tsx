'use client';

import { useState, useEffect } from 'react';
import { formatPrice } from '@/lib/constants';

type Tab = 'dashboard' | 'leads' | 'orders' | 'traffic' | 'settings';

interface Lead {
  id: string;
  firstName: string;
  lastName?: string | null;
  email: string;
  phone: string;
  message: string;
  type: string;
  status: string;
  company?: string | null;
  createdAt: string;
}

interface Order {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  transactionId?: string | null;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    product: {
      name: string;
      category: string;
    };
  }>;
}

interface PageView {
  id: string;
  url: string;
  referrer?: string | null;
  userAgent?: string | null;
  ip?: string | null;
  createdAt: string;
}

interface TrafficStat {
  url: string;
  views: number;
}

interface AdminData {
  stats: {
    totalOrders: number;
    totalRevenue: number;
    totalLeads: number;
    totalPageViews: number;
  };
  leads: Lead[];
  orders: Order[];
  pageViews: PageView[];
  trafficStats: TrafficStat[];
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AdminData | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
  const [updatingMaintenance, setUpdatingMaintenance] = useState<boolean>(false);

  // Charger le mode maintenance au chargement ou à l'authentification
  useEffect(() => {
    if (isAuthenticated) {
      fetchMaintenanceStatus();
    }
  }, [isAuthenticated]);

  const fetchMaintenanceStatus = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const result = await res.json();
        setMaintenanceMode(!!result.maintenanceMode);
      }
    } catch (err) {
      console.error('Failed to fetch maintenance status', err);
    }
  };

  const handleToggleMaintenance = async () => {
    setUpdatingMaintenance(true);
    const newStatus = !maintenanceMode;
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maintenanceMode: newStatus }),
      });
      if (res.ok) {
        setMaintenanceMode(newStatus);
      } else {
        alert('Erreur lors de la mise à jour du mode maintenance.');
      }
    } catch (err) {
      console.error('Failed to toggle maintenance', err);
      alert('Erreur de connexion.');
    } finally {
      setUpdatingMaintenance(false);
    }
  };

  // Verify session on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const result = await res.json();
        setData(result);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        fetchData();
      } else {
        const errData = await res.json();
        setError(errData.error || 'Mot de passe incorrect');
      }
    } catch {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setData(null);
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const handleUpdateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        // Update local state directly
        setData((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            leads: prev.leads.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)),
          };
        });
      }
    } catch (err) {
      console.error('Failed to update lead status', err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, updates: { orderStatus?: string; paymentStatus?: string }) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        // Update local state directly
        setData((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            orders: prev.orders.map((o) => (o.id === orderId ? { ...o, ...updates } : o)),
          };
        });
      }
    } catch (err) {
      console.error('Failed to update order status', err);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', color: 'var(--color-text-secondary)' }}>
        Chargement...
      </div>
    );
  }

  // --- LOGIN SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: 'var(--space-md)' }}>
        <div className="card" style={{ maxWidth: '420px', width: '100%', padding: 'var(--space-xl)', background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', boxShadow: '0 0 30px rgba(231, 173, 5, 0.1)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
            <span style={{ fontSize: '3rem' }}>🔒</span>
            <h1 style={{ fontSize: '1.5rem', marginTop: 'var(--space-sm)', fontFamily: 'var(--font-heading)' }}>
              Accès Administration
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: 'var(--space-xs)' }}>
              Entrez le mot de passe administrateur pour accéder à la console NONALIX CI.
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div className="input-group">
              <label className="input-label" htmlFor="admin-pass">Mot de passe</label>
              <input
                id="admin-pass"
                type="password"
                className={`input ${error ? 'input-error' : ''}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
              {error && <span className="error-text">{error}</span>}
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading} style={{ marginTop: 'var(--space-xs)' }}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- ADMIN DASHBOARD ---
  return (
    <div className="page-content" style={{ paddingBottom: 'var(--space-4xl)' }}>
      <div className="container" style={{ paddingTop: 'var(--space-3xl)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2xl)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
          <div>
            <span className="badge badge-accent">Console SuperAdmin</span>
            <h1 style={{ fontSize: '2rem', marginTop: 'var(--space-xs)', fontFamily: 'var(--font-heading)' }}>
              Tableau de bord <span className="text-gradient">Analytique</span>
            </h1>
          </div>
          <button onClick={handleLogout} className="btn btn-outline btn-sm" style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: 'var(--color-error)' }}>
            Déconnexion
          </button>
        </div>

        {/* Global Statistics Cards */}
        {data && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-2xl)' }}>
            
            <div className="card" style={{ padding: 'var(--space-lg)', background: 'var(--color-surface-elevated)', borderLeft: '4px solid var(--color-success)' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Chiffre d&apos;Affaires</span>
              <h3 style={{ fontSize: '1.75rem', marginTop: 'var(--space-xs)', color: 'var(--color-success)' }}>
                {new Intl.NumberFormat('fr-CI').format(data.stats.totalRevenue)} <span style={{ fontSize: '1rem' }}>FCFA</span>
              </h3>
            </div>

            <div className="card" style={{ padding: 'var(--space-lg)', background: 'var(--color-surface-elevated)', borderLeft: '4px solid var(--color-wave)' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Commandes Boutique</span>
              <h3 style={{ fontSize: '1.75rem', marginTop: 'var(--space-xs)', color: 'var(--color-wave)' }}>
                {data.stats.totalOrders}
              </h3>
            </div>

            <div className="card" style={{ padding: 'var(--space-lg)', background: 'var(--color-surface-elevated)', borderLeft: '4px solid var(--color-accent)' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Leads de Contact</span>
              <h3 style={{ fontSize: '1.75rem', marginTop: 'var(--space-xs)', color: 'var(--color-accent)' }}>
                {data.stats.totalLeads}
              </h3>
            </div>

            <div className="card" style={{ padding: 'var(--space-lg)', background: 'var(--color-surface-elevated)', borderLeft: '4px solid #f59e0b' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Trafic (Pages Vues)</span>
              <h3 style={{ fontSize: '1.75rem', marginTop: 'var(--space-xs)', color: '#f59e0b' }}>
                {data.stats.totalPageViews}
              </h3>
            </div>

          </div>
        )}

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: 'var(--space-xs)', borderBottom: '1px solid var(--color-border)', paddingBottom: '1px', marginBottom: 'var(--space-xl)', overflowX: 'auto' }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{ padding: 'var(--space-sm) var(--space-lg)', background: activeTab === 'dashboard' ? 'rgba(231, 173, 5, 0.1)' : 'transparent', border: 'none', borderBottom: activeTab === 'dashboard' ? '2px solid var(--color-accent)' : 'none', color: activeTab === 'dashboard' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9375rem', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
          >
            📊 Vue générale
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            style={{ padding: 'var(--space-sm) var(--space-lg)', background: activeTab === 'leads' ? 'rgba(231, 173, 5, 0.1)' : 'transparent', border: 'none', borderBottom: activeTab === 'leads' ? '2px solid var(--color-accent)' : 'none', color: activeTab === 'leads' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9375rem', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
          >
            ✉️ Leads ({data?.leads.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            style={{ padding: 'var(--space-sm) var(--space-lg)', background: activeTab === 'orders' ? 'rgba(231, 173, 5, 0.1)' : 'transparent', border: 'none', borderBottom: activeTab === 'orders' ? '2px solid var(--color-accent)' : 'none', color: activeTab === 'orders' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9375rem', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
          >
            🛒 Commandes ({data?.orders.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('traffic')}
            style={{ padding: 'var(--space-sm) var(--space-lg)', background: activeTab === 'traffic' ? 'rgba(231, 173, 5, 0.1)' : 'transparent', border: 'none', borderBottom: activeTab === 'traffic' ? '2px solid var(--color-accent)' : 'none', color: activeTab === 'traffic' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9375rem', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
          >
            🌐 Trafic Cookies ({data?.pageViews.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            style={{ padding: 'var(--space-sm) var(--space-lg)', background: activeTab === 'settings' ? 'rgba(231, 173, 5, 0.1)' : 'transparent', border: 'none', borderBottom: activeTab === 'settings' ? '2px solid var(--color-accent)' : 'none', color: activeTab === 'settings' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9375rem', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
          >
            ⚙️ Réglages
          </button>
        </div>

        {/* --- TAB CONTENT --- */}
        {data && (
          <div>
            
            {/* 1. VIEW GENERAL (DASHBOARD) */}
            {activeTab === 'dashboard' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xl)', alignItems: 'start' }}>
                
                {/* Left: Popular Pages */}
                <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--color-surface-elevated)' }}>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-lg)', fontWeight: 600, color: 'var(--color-accent)' }}>
                    🔥 Top Pages Visités (Cookies Acceptés)
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    {data.trafficStats.slice(0, 8).map((t, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.875rem' }}>
                        <span style={{ fontFamily: 'monospace', color: 'var(--color-text-primary)' }}>{t.url}</span>
                        <span style={{ fontWeight: 600, color: '#f59e0b' }}>{t.views} vues</span>
                      </div>
                    ))}
                    {data.trafficStats.length === 0 && (
                      <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', fontStyle: 'italic' }}>Aucune donnée de trafic disponible.</p>
                    )}
                  </div>
                </div>

                {/* Right: Recent activity logs */}
                <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--color-surface-elevated)' }}>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-lg)', fontWeight: 600, color: 'var(--color-accent)' }}>
                    ⚡ Activité Récente (Leads & Commandes)
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                    {data.leads.slice(0, 4).map((l) => (
                      <div key={l.id} style={{ display: 'flex', gap: 'var(--space-sm)', fontSize: '0.875rem', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <span style={{ fontSize: '1.25rem' }}>✉️</span>
                        <div>
                          <strong>{l.firstName}</strong> a soumis un lead <strong>{l.type}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{new Date(l.createdAt).toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                    {data.orders.slice(0, 4).map((o) => (
                      <div key={o.id} style={{ display: 'flex', gap: 'var(--space-sm)', fontSize: '0.875rem', paddingBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <span style={{ fontSize: '1.25rem' }}>🛒</span>
                        <div>
                          Commande de <strong>{formatPrice(o.totalAmount)}</strong> par <strong>{o.firstName} {o.lastName}</strong> ({o.city})
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{new Date(o.createdAt).toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                    {data.leads.length === 0 && data.orders.length === 0 && (
                      <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', fontStyle: 'italic' }}>Aucune activité récente.</p>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* 2. LEADS MANAGEMENT */}
            {activeTab === 'leads' && (
              <div className="card" style={{ padding: 'var(--space-lg)', background: 'var(--color-surface-elevated)', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border)', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                      <th style={{ padding: '12px 8px' }}>Date</th>
                      <th style={{ padding: '12px 8px' }}>Type</th>
                      <th style={{ padding: '12px 8px' }}>Nom / Entreprise</th>
                      <th style={{ padding: '12px 8px' }}>Contact</th>
                      <th style={{ padding: '12px 8px' }}>Message</th>
                      <th style={{ padding: '12px 8px' }}>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.leads.map((l) => (
                      <tr key={l.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.875rem' }}>
                        <td style={{ padding: '12px 8px', whiteSpace: 'nowrap' }}>{new Date(l.createdAt).toLocaleDateString()}</td>
                        <td style={{ padding: '12px 8px' }}>
                          <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, background: l.type === 'quote_request' ? 'rgba(231, 173, 5, 0.2)' : 'rgba(16, 185, 129, 0.2)', color: l.type === 'quote_request' ? 'var(--color-accent)' : 'var(--color-success)' }}>
                            {l.type}
                          </span>
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <div style={{ fontWeight: 600 }}>{l.firstName} {l.lastName || ''}</div>
                          {l.company && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>{l.company}</div>}
                        </td>
                        <td style={{ padding: '12px 8px', whiteSpace: 'nowrap' }}>
                          <div><a href={`mailto:${l.email}`} style={{ color: 'var(--color-accent)' }}>{l.email}</a></div>
                          <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.8125rem' }}><a href={`tel:${l.phone}`}>{l.phone}</a></div>
                        </td>
                        <td style={{ padding: '12px 8px', maxWidth: '300px', wordBreak: 'break-word' }}>{l.message}</td>
                        <td style={{ padding: '12px 8px' }}>
                          <select
                            value={l.status}
                            onChange={(e) => handleUpdateLeadStatus(l.id, e.target.value)}
                            style={{ padding: '4px 8px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '4px', color: 'var(--color-text-primary)', cursor: 'pointer', fontSize: '0.8125rem' }}
                          >
                            <option value="new">Nouveau 🆕</option>
                            <option value="contacted">Contacté 💬</option>
                            <option value="closed">Fermé 🔒</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {data.leads.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>Aucun lead de contact enregistré.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* 3. ORDERS MANAGEMENT */}
            {activeTab === 'orders' && (
              <div className="card" style={{ padding: 'var(--space-lg)', background: 'var(--color-surface-elevated)', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border)', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                      <th style={{ padding: '12px 8px' }}>ID Commande</th>
                      <th style={{ padding: '12px 8px' }}>Client</th>
                      <th style={{ padding: '12px 8px' }}>Articles</th>
                      <th style={{ padding: '12px 8px' }}>Total</th>
                      <th style={{ padding: '12px 8px' }}>Paiement</th>
                      <th style={{ padding: '12px 8px' }}>Statut Commande</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.orders.map((o) => (
                      <tr key={o.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.875rem' }}>
                        <td style={{ padding: '12px 8px' }}>
                          <div style={{ fontWeight: 600, color: 'var(--color-accent)' }}>{o.id}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{new Date(o.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <div style={{ fontWeight: 600 }}>{o.firstName} {o.lastName}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>{o.city} — <a href={`tel:${o.phone}`}>{o.phone}</a></div>
                        </td>
                        <td style={{ padding: '12px 8px', maxWidth: '250px' }}>
                          {o.items.map((item, idx) => (
                            <div key={idx} style={{ fontSize: '0.8125rem' }}>
                              • {item.product.name} (x{item.quantity})
                            </div>
                          ))}
                        </td>
                        <td style={{ padding: '12px 8px', fontWeight: 600, color: 'var(--color-success)' }}>
                          {formatPrice(o.totalAmount)}
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <div style={{ fontSize: '0.78rem', marginBottom: '4px', textTransform: 'uppercase', fontWeight: 600, color: 'var(--color-text-secondary)' }}>{o.paymentMethod.replace(/_/g, ' ')}</div>
                          <select
                            value={o.paymentStatus}
                            onChange={(e) => handleUpdateOrderStatus(o.id, { paymentStatus: e.target.value })}
                            style={{ padding: '3px 6px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '4px', color: 'var(--color-text-primary)', cursor: 'pointer', fontSize: '0.75rem' }}
                          >
                            <option value="pending">En attente ⏳</option>
                            <option value="completed">Complété ✅</option>
                            <option value="failed">Échoué ❌</option>
                            <option value="pending_delivery">Paiement Livraison 🚚</option>
                          </select>
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <select
                            value={o.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(o.id, { orderStatus: e.target.value })}
                            style={{ padding: '4px 8px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '4px', color: 'var(--color-text-primary)', cursor: 'pointer', fontSize: '0.8125rem' }}
                          >
                            <option value="new">Nouveau 🆕</option>
                            <option value="confirmed">Confirmé 👍</option>
                            <option value="shipped">En cours de livraison 🚚</option>
                            <option value="delivered">Livré 🎁</option>
                            <option value="cancelled">Annulé 🛑</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {data.orders.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>Aucune commande passée.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* 4. TRAFFIC LOGS */}
            {activeTab === 'traffic' && (
              <div className="card" style={{ padding: 'var(--space-lg)', background: 'var(--color-surface-elevated)', overflowX: 'auto' }}>
                <div style={{ display: 'flex', gap: 'var(--space-sm)', color: '#f59e0b', fontSize: '0.85rem', marginBottom: 'var(--space-md)', padding: 'var(--space-xs) var(--space-md)', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '4px', alignItems: 'center' }}>
                  <span>⚠️</span>
                  <span>Ces données n&apos;enregistrent que les visites d&apos;utilisateurs ayant explicitement <strong>Accepté</strong> le bandeau de cookies.</span>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border)', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                      <th style={{ padding: '12px 8px' }}>Date</th>
                      <th style={{ padding: '12px 8px' }}>Adresse IP</th>
                      <th style={{ padding: '12px 8px' }}>Page (URL)</th>
                      <th style={{ padding: '12px 8px' }}>Référent (Referrer)</th>
                      <th style={{ padding: '12px 8px' }}>Navigateur (UserAgent)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.pageViews.map((pv) => (
                      <tr key={pv.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.8125rem' }}>
                        <td style={{ padding: '10px 8px', whiteSpace: 'nowrap' }}>{new Date(pv.createdAt).toLocaleString()}</td>
                        <td style={{ padding: '10px 8px', fontFamily: 'monospace' }}>{pv.ip || '127.0.0.1'}</td>
                        <td style={{ padding: '10px 8px', fontWeight: 600, color: 'var(--color-accent)' }}>{pv.url}</td>
                        <td style={{ padding: '10px 8px', color: 'var(--color-text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pv.referrer || 'Direct / Aucun'}</td>
                        <td style={{ padding: '10px 8px', color: 'var(--color-text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={pv.userAgent || ''}>{pv.userAgent || 'Inconnu'}</td>
                      </tr>
                    ))}
                    {data.pageViews.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>Aucune page vue enregistrée.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* 5. SETTINGS PANEL */}
            {activeTab === 'settings' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-xl)' }}>
                <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--color-surface-elevated)' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-lg)', fontWeight: 600, color: 'var(--color-accent)' }}>
                    ⚙️ Réglages Généraux du Système
                  </h3>
                  
                  <div style={{ padding: 'var(--space-lg)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        🚧 Mode Maintenance {maintenanceMode && <span style={{ fontSize: '0.75rem', background: '#f59e0b', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>ACTIF</span>}
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginTop: '4px', lineHeight: '1.5' }}>
                        Lorsqu&apos;il est activé, le site sera temporairement inaccessible aux visiteurs réguliers (qui verront une page de maintenance). Seuls les administrateurs connectés pourront encore naviguer.
                      </p>
                    </div>
                    <div>
                      <button
                        onClick={handleToggleMaintenance}
                        disabled={updatingMaintenance}
                        style={{
                          padding: '0.625rem 1.25rem',
                          background: maintenanceMode ? '#ef4444' : 'var(--color-accent)',
                          color: '#000',
                          fontWeight: 700,
                          border: 'none',
                          borderRadius: 'var(--radius-md)',
                          cursor: 'pointer',
                          opacity: updatingMaintenance ? 0.6 : 1,
                          transition: 'all 0.2s',
                          fontSize: '0.875rem',
                        }}
                      >
                        {updatingMaintenance ? 'Mise à jour...' : maintenanceMode ? '🔴 Désactiver le Mode Maintenance' : '🟢 Activer le Mode Maintenance'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
