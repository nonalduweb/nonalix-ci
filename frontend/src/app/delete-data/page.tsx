import React from 'react';
import type { Metadata } from 'next';
import { SITE_CONFIG, CONTACT_INFO } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Demande de Suppression de Données',
  description: 'Formulaire et procédure pour demander la suppression définitive de vos données personnelles et historiques de chat (ARTCI & RGPD).',
  alternates: {
    canonical: '/delete-data',
  },
  robots: {
    index: true,
    follow: false,
  },
};

export default function DeleteDataPage() {
  return (
    <div className="page-content">
      <section className="section" style={{ paddingTop: 'var(--space-4xl)', paddingBottom: 'var(--space-3xl)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          
          <div className="section-header" style={{ marginBottom: 'var(--space-2xl)' }}>
            <span className="badge badge-accent">Vos Droits</span>
            <h1 style={{ marginTop: 'var(--space-md)', fontSize: '2.5rem', fontFamily: 'var(--font-heading)' }}>
              Suppression de <span className="text-gradient">Données</span>
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Conformément à la réglementation sur la protection des données personnelles (ARTCI & RGPD).
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
            
            {/* Explications */}
            <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--color-surface-elevated)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-md)', color: 'var(--color-accent)', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                1. Vos droits de suppression (Droit à l&apos;oubli)
              </h2>
              <p style={{ lineHeight: '1.6', fontSize: '0.9375rem' }}>
                Chez <strong>{SITE_CONFIG.fullName}</strong>, nous respectons votre vie privée. Vous disposez à tout moment du droit de demander 
                la suppression totale, définitive et irréversible de l&apos;ensemble de vos données stockées sur nos serveurs.
              </p>
              <p style={{ lineHeight: '1.6', fontSize: '0.9375rem', marginTop: 'var(--space-sm)' }}>
                Cela inclut :
              </p>
              <ul style={{ lineHeight: '1.8', fontSize: '0.9375rem', marginLeft: 'var(--space-md)', marginTop: 'var(--space-xs)' }}>
                <li>Vos coordonnées personnelles (nom, email, téléphone).</li>
                <li>L&apos;historique complet de vos conversations avec nos assistants IA (Web ou WhatsApp).</li>
                <li>Vos fiches prospects (leads) enregistrées lors de vos interactions.</li>
                <li>Vos comptes clients ou historiques d&apos;audits demandés.</li>
              </ul>
            </div>

            {/* Procédure */}
            <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--color-surface-elevated)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-md)', color: 'var(--color-accent)', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                2. Comment formuler votre demande
              </h2>
              <p style={{ lineHeight: '1.6', fontSize: '0.9375rem' }}>
                La procédure de suppression est simple et entièrement gratuite. Il vous suffit de nous adresser une demande par e-mail en précisant :
              </p>
              
              <div style={{ 
                background: 'rgba(231, 173, 5, 0.05)',
                border: '1px solid var(--color-border)', 
                borderRadius: '8px', 
                padding: 'var(--space-md)', 
                margin: 'var(--space-md) 0',
                lineHeight: '1.8',
                fontSize: '0.9375rem'
              }}>
                <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                  <li>📧 <strong>Envoyer à :</strong> <a href={`mailto:${CONTACT_INFO.email}`} style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>{CONTACT_INFO.email}</a></li>
                  <li>📝 <strong>Objet du mail :</strong> Demande de suppression de données personnelles</li>
                  <li>💬 <strong>Contenu :</strong> Votre nom et le numéro de téléphone ou l&apos;adresse e-mail associé aux données à supprimer.</li>
                </ul>
              </div>

              <p style={{ lineHeight: '1.6', fontSize: '0.9375rem', marginTop: 'var(--space-sm)' }}>
                Une fois votre demande reçue, nos techniciens procéderont à la purge définitive de votre historique sous <strong>48 heures maximum</strong>. 
                Un e-mail de confirmation vous sera renvoyé dès l&apos;opération effectuée.
              </p>
            </div>

            {/* Délais de conservation */}
            <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--color-surface-elevated)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-md)', color: 'var(--color-accent)', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                3. Durée de conservation par défaut
              </h2>
              <p style={{ lineHeight: '1.6', fontSize: '0.9375rem' }}>
                Afin de ne pas conserver inutilement des informations, nous appliquons des politiques de purge automatique par défaut :
              </p>
              <ul style={{ lineHeight: '1.8', fontSize: '0.9375rem', marginLeft: 'var(--space-md)', marginTop: 'var(--space-sm)' }}>
                <li><strong>Sessions de Chat inactives :</strong> Les historiques de conversations des utilisateurs n&apos;ayant pas finalisé de demande ou n&apos;étant pas qualifiés sont nettoyés automatiquement après <strong>30 jours</strong>.</li>
                <li><strong>Prospects qualifiés :</strong> Conservés pendant <strong>12 mois</strong> à des fins de suivi commercial, puis supprimés ou anonymisés en l&apos;absence de nouvelle interaction.</li>
                <li><strong>Données de facturation e-commerce :</strong> Conservées pendant les durées légales requises par le droit commercial ivoirien.</li>
              </ul>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
