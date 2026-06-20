/**
 * NONALIX CI — Utilitaire Webhooks n8n
 * 
 * Ce module centralise l'envoi de webhooks vers les workflows n8n.
 * Les appels sont non-bloquants (fire-and-forget) pour ne pas ralentir
 * les réponses API principales.
 */

const N8N_BASE_URL = process.env.N8N_WEBHOOK_URL || 'https://n8n.nonalix-ci.com';

interface WebhookOptions {
  /** Chemin du webhook n8n (ex: /webhook/new-lead) */
  path: string;
  /** Données à envoyer */
  data: Record<string, unknown>;
}

/**
 * Envoie un webhook à n8n de manière non-bloquante.
 * Les erreurs sont loguées mais ne bloquent jamais le flux principal.
 */
async function sendWebhook({ path, data }: WebhookOptions): Promise<void> {
  const url = `${N8N_BASE_URL}${path}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        _source: 'nonalix-ci-frontend',
        _timestamp: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(5000), // Timeout 5s pour ne pas bloquer
    });
    console.log(`[N8N WEBHOOK] ${path} → ${res.status}`);
  } catch (error: any) {
    // Ne jamais laisser un échec webhook casser le flux principal
    console.error(`[N8N WEBHOOK ERROR] ${path}:`, error.message);
  }
}

// ────────────────────────────────────────────
// Workflow 1 : Nouveau Lead (Contact / Audit / Chat)
// ────────────────────────────────────────────

export interface LeadWebhookData {
  leadId: string;
  firstName: string;
  lastName?: string | null;
  email: string;
  phone: string;
  message: string;
  type: string; // 'contact' | 'audit_seo' | 'audit_business' | 'chat_onboarding' | 'service_request'
  company?: string | null;
  auditScore?: number | null;
  auditUrl?: string | null;
}

/**
 * Webhook 1 : Déclenché quand un nouveau lead est créé
 * (formulaire contact, audit SEO, onboarding chatbot, demande de service)
 */
export function notifyNewLead(data: LeadWebhookData): void {
  // Fire-and-forget : on n'attend pas la résolution
  sendWebhook({
    path: '/webhook/new-lead',
    data: {
      event: 'new_lead',
      lead: data,
    },
  }).catch(() => {}); // Silencieux
}

// ────────────────────────────────────────────
// Workflow 2 : Nouvelle Commande
// ────────────────────────────────────────────

export interface OrderWebhookData {
  orderId: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
  }>;
}

/**
 * Webhook 2 : Déclenché quand une nouvelle commande est passée.
 * n8n peut ensuite :
 *  - Générer une facture PDF
 *  - Envoyer un email de confirmation avec le lien de téléchargement
 *  - Enregistrer la vente dans un CRM ou Google Sheets
 */
export function notifyNewOrder(data: OrderWebhookData): void {
  sendWebhook({
    path: '/webhook/new-order',
    data: {
      event: 'new_order',
      order: data,
    },
  }).catch(() => {});
}

// ────────────────────────────────────────────
// Workflow 3 : Relance Panier Abandonné
// ────────────────────────────────────────────

export interface AbandonedCartWebhookData {
  cartId: string;
  email?: string;
  phone?: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
  totalAmount: number;
  abandonedSince: string; // ISO date
}

/**
 * Webhook 3 : Déclenché par un CRON interne (ou manuellement)
 * quand un panier est resté abandonné depuis plus de 2 heures.
 */
export function notifyAbandonedCart(data: AbandonedCartWebhookData): void {
  sendWebhook({
    path: '/webhook/abandoned-cart',
    data: {
      event: 'abandoned_cart',
      cart: data,
    },
  }).catch(() => {});
}
