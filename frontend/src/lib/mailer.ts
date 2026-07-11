import nodemailer from 'nodemailer';
import { LEGAL_INFO } from './constants';

const ADMIN_EMAIL = 'contact@nonalix-ci.com';

// Configure SMTP transport if env variables exist
const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });
  }
  return null;
};

/**
 * Sends an email notification to the admin for a new contact lead
 */
export async function sendAdminLeadNotification(lead: {
  id: string;
  firstName: string;
  lastName?: string | null;
  email?: string | null;
  phone: string;
  message: string;
  type: string;
  company?: string | null;
}) {
  const subject = `[NONALIX CI] Nouveau Lead - ${lead.type.toUpperCase()}`;
  const from = process.env.SMTP_FROM || 'no-reply@nonalix-ci.com';

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; color: #1e293b;">
      <h2 style="color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-top: 0;">Nouveau Lead Reçu</h2>
      <p>Un nouveau formulaire a été soumis sur le site <strong>nonalix-ci.com</strong> :</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; width: 140px;">Type :</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #2563eb; font-weight: bold;">${lead.type}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Nom complet :</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${lead.firstName} ${lead.lastName || ''}</td>
        </tr>
        ${lead.company ? `
        <tr>
          <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Entreprise :</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-style: italic;">${lead.company}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Email :</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${lead.email}">${lead.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Téléphone :</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><a href="tel:${lead.phone}">${lead.phone}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Date :</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${new Date().toLocaleString('fr-CI')}</td>
        </tr>
      </table>
      
      <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <h4 style="margin-top: 0; margin-bottom: 8px; color: #475569;">Message :</h4>
        <p style="margin: 0; white-space: pre-wrap; line-height: 1.6; color: #334155;">${lead.message}</p>
      </div>

      <div style="text-align: center; margin-top: 25px;">
        <a href="https://nonalix-ci.com/admin" style="background-color: #3b82f6; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Accéder à la console Admin</a>
      </div>
    </div>
  `;

  const transporter = getTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from,
        to: ADMIN_EMAIL,
        subject,
        html,
      });
      console.log(`[EMAIL SENT] Lead ${lead.id} successfully sent to ${ADMIN_EMAIL}`);
    } catch (err) {
      console.error('[SMTP EMAIL FAIL]', err);
    }
  } else {
    // Fallback console log if no SMTP configured
    console.log(`
=========================================
[ADMIN EMAIL SIMULATION] New Lead Received
To: ${ADMIN_EMAIL}
Subject: ${subject}
-----------------------------------------
Type: ${lead.type}
Nom: ${lead.firstName} ${lead.lastName || ''}
Entreprise: ${lead.company || 'N/A'}
Email: ${lead.email}
Tél: ${lead.phone}
Message: ${lead.message}
=========================================
    `);
  }
}

/**
 * Sends an email notification to the admin for a new boutique order
 */
export async function sendAdminOrderNotification(order: {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone: string;
  city: string;
  totalAmount: number;
  paymentMethod: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
  }>;
}) {
  const subject = `[NONALIX CI] Nouvelle Commande - ${order.id}`;
  const from = process.env.SMTP_FROM || 'no-reply@nonalix-ci.com';

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; color: #1e293b;">
      <h2 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 10px; margin-top: 0;">Nouvelle Commande E-commerce</h2>
      <p>Une nouvelle commande a été passée sur la boutique <strong>nonalix-ci.com</strong> :</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9; width: 140px;">ID Commande :</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #059669; font-weight: bold;">${order.id}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Client :</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${order.firstName} ${order.lastName}</td>
        </tr>
        ${order.email ? `
        <tr>
          <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Email client :</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${order.email}">${order.email}</a></td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Téléphone :</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;"><a href="tel:${order.phone}">${order.phone}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Ville de livraison :</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${order.city}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Mode de paiement :</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">${order.paymentMethod}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; border-bottom: 1px solid #f1f5f9;">Montant Total :</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; color: #10b981; font-weight: bold; font-size: 1.1rem;">${new Intl.NumberFormat('fr-CI').format(order.totalAmount)} FCFA</td>
        </tr>
      </table>

      <h3 style="color: #475569; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">Produits commandés :</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 0.9rem;">
        <thead>
          <tr style="background-color: #f8fafc; text-align: left;">
            <th style="padding: 8px; border-bottom: 1px solid #cbd5e1;">Réf Produit</th>
            <th style="padding: 8px; border-bottom: 1px solid #cbd5e1;">Quantité</th>
            <th style="padding: 8px; border-bottom: 1px solid #cbd5e1;">Prix Unitaire</th>
            <th style="padding: 8px; border-bottom: 1px solid #cbd5e1; text-align: right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${item.productId}</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${item.quantity}</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${new Intl.NumberFormat('fr-CI').format(item.unitPrice)} FCFA</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; text-align: right; font-weight: bold;">${new Intl.NumberFormat('fr-CI').format(item.unitPrice * item.quantity)} FCFA</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div style="text-align: center; margin-top: 25px;">
        <a href="https://nonalix-ci.com/admin" style="background-color: #10b981; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Gérer la commande</a>
      </div>
    </div>
  `;

  const transporter = getTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from,
        to: ADMIN_EMAIL,
        subject,
        html,
      });
      console.log(`[EMAIL SENT] Order ${order.id} notification successfully sent to ${ADMIN_EMAIL}`);
    } catch (err) {
      console.error('[SMTP EMAIL FAIL]', err);
    }
  } else {
    // Fallback console log if no SMTP configured
    console.log(`
=========================================
[ADMIN EMAIL SIMULATION] New Order Received
To: ${ADMIN_EMAIL}
Subject: ${subject}
-----------------------------------------
ID: ${order.id}
Client: ${order.firstName} ${order.lastName}
Tél: ${order.phone}
Ville: ${order.city}
Paiement: ${order.paymentMethod}
Total: ${order.totalAmount} FCFA
Articles: ${JSON.stringify(order.items)}
=========================================
    `);
  }
}

/**
 * Sends a detailed audit report email to the user
 */
export async function sendUserAuditNotification(
  lead: {
    businessName: string;
    email: string;
    phone: string;
    type: string;
    company: string;
  },
  audit: {
    globalScore: number;
    seoScore: number;
    mobileScore: number;
    speedScore: number;
    securityScore: number;
    summary: string;
    recommendations: Array<{ title: string; description: string; priority: string }>;
    marketInsight: string;
  }
) {
  const isWebAudit = lead.type === 'audit-site-web';
  const subject = `[NONALIX CI] Votre rapport d'audit ${isWebAudit ? 'Site Web' : 'Google Business'} - ${audit.globalScore}/100`;
  const from = process.env.SMTP_FROM || 'no-reply@nonalix-ci.com';

  const scoreColor = audit.globalScore >= 80 ? '#10b981' : audit.globalScore >= 50 ? '#f59e0b' : '#ef4444';

  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b; line-height: 1.6;">
      <!-- Header -->
      <div style="text-align: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px; margin-bottom: 25px;">
        <h1 style="color: #4f46e5; margin: 0; font-size: 1.5rem; letter-spacing: 1px;">NONALIX CI</h1>
        <p style="margin: 5px 0 0 0; font-size: 0.9rem; color: #64748b; font-weight: 500;">Agence d'Automatisation IA & Marketing Digital</p>
      </div>

      <!-- Introduction -->
      <h2 style="color: #1e293b; margin-top: 0; font-size: 1.3rem;">Bonjour ${lead.businessName},</h2>
      <p style="font-size: 0.95rem; color: #475569;">
        Merci d'avoir utilisé notre outil d'analyse gratuite. Notre intelligence artificielle a analysé avec succès votre ${isWebAudit ? 'site web' : 'présence Google Business'} (${lead.company}) au regard des exigences du marché ivoirien.
      </p>

      <!-- Score Card -->
      <div style="background-color: #f8fafc; border-radius: 10px; padding: 20px; text-align: center; margin: 25px 0; border: 1px solid #f1f5f9;">
        <span style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 600;">Score Global d'Optimisation</span>
        <div style="font-size: 3.5rem; font-weight: 800; color: ${scoreColor}; margin: 10px 0; line-height: 1;">
          ${audit.globalScore}<span style="font-size: 1.5rem; font-weight: 500; color: #94a3b8;">/100</span>
        </div>
        <p style="margin: 0; font-size: 0.9rem; font-weight: 500; color: #475569;">
          ${audit.globalScore >= 80 ? 'Excellent ! Votre site respecte la majorité des bonnes pratiques.' : audit.globalScore >= 50 ? 'Des améliorations sont nécessaires pour optimiser votre visibilité.' : 'Attention, plusieurs points critiques pénalisent fortement votre business.'}
        </p>
      </div>

      <!-- Category Scores -->
      <h3 style="color: #334155; font-size: 1.1rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-top: 30px;">Détail des performances</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 0.9rem;">
        <tr>
          <td style="padding: 10px 0; font-weight: 600; color: #475569;">Référencement (SEO) :</td>
          <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #1e293b;">${audit.seoScore}/100</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: 600; color: #475569;">Ergonomie Mobile :</td>
          <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #1e293b;">${audit.mobileScore}/100</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: 600; color: #475569;">Vitesse de chargement :</td>
          <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #1e293b;">${audit.speedScore}/100</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: 600; color: #475569;">Sécurité & Confiance :</td>
          <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #1e293b;">${audit.securityScore}/100</td>
        </tr>
      </table>

      <!-- IA Summary -->
      <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 4px; margin: 25px 0;">
        <h4 style="margin: 0 0 8px 0; color: #1e40af; font-size: 0.95rem; font-weight: 700;">Analyse de notre IA :</h4>
        <p style="margin: 0; font-size: 0.9rem; color: #1e3a8a; font-style: italic;">${audit.summary}</p>
      </div>

      <!-- Recommendations -->
      <h3 style="color: #334155; font-size: 1.1rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-top: 30px;">Actions prioritaires recommandées</h3>
      <div style="margin-top: 15px;">
        ${audit.recommendations.map((rec: any, idx: number) => {
          const priorityColor = rec.priority === 'haute' ? '#ef4444' : rec.priority === 'moyenne' ? '#f59e0b' : '#3b82f6';
          return `
            <div style="margin-bottom: 20px; padding: 12px; border: 1px solid #f1f5f9; border-radius: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <span style="font-weight: 700; color: #1e293b; font-size: 0.95rem;">${idx + 1}. ${rec.title}</span>
                <span style="font-size: 0.75rem; font-weight: 700; color: #ffffff; background-color: ${priorityColor}; padding: 2px 8px; border-radius: 20px; text-transform: uppercase;">
                  ${rec.priority}
                </span>
              </div>
              <p style="margin: 0; font-size: 0.85rem; color: #475569;">${rec.description}</p>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Market Insight -->
      <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; border-radius: 4px; margin: 25px 0;">
        <h4 style="margin: 0 0 8px 0; color: #065f46; font-size: 0.95rem; font-weight: 700;">Conseil Stratégique :</h4>
        <p style="margin: 0; font-size: 0.9rem; color: #064e3b;">${audit.marketInsight}</p>
      </div>

      <!-- CTA -->
      <div style="text-align: center; margin-top: 35px; border-top: 1px solid #f1f5f9; padding-top: 25px;">
        <p style="font-size: 0.9rem; color: #475569; margin-bottom: 20px;">
          Vous souhaitez corriger ces points et accélérer la croissance de votre entreprise ?
        </p>
        <a href="https://wa.me/2250706906930?text=Bonjour%20NONALIX%20CI,%20je%20viens%20de%20recevoir%20mon%20rapport%20d'audit%20(Score:%20${audit.globalScore}/100)%20et%20j'aimerais%20en%20discuter." 
           style="background-color: #10b981; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 0.95rem; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);">
          💬 Discuter avec un expert sur WhatsApp
        </a>
        <p style="font-size: 0.85rem; color: #64748b; margin-top: 15px;">
          Ou contactez-nous directement par téléphone au <strong>+225 07 06 90 69 30</strong>.
        </p>
      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 35px; padding-top: 15px; border-top: 1px solid #f1f5f9; font-size: 0.75rem; color: #94a3b8;">
        © ${new Date().getFullYear()} NONALIX CI SARL. Tous droits réservés.<br/>
        RCCM: ${LEGAL_INFO.rccm}
      </div>
    </div>
  `;

  const transporter = getTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from,
        to: lead.email,
        subject,
        html,
      });
      console.log(`[USER EMAIL SENT] Audit report successfully sent to ${lead.email}`);
    } catch (err) {
      console.error('[USER SMTP EMAIL FAIL]', err);
    }
  } else {
    console.log(`
=========================================
[USER EMAIL SIMULATION] Audit Report Sent
To: ${lead.email}
Subject: ${subject}
-----------------------------------------
Score Global: ${audit.globalScore}/100
=========================================
    `);
  }
}

/**
 * Sends digital products download links to the customer
 */
export async function sendDigitalProductsDeliveryEmail(order: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  totalAmount: number;
}, items: Array<{
  product: {
    name: string;
    isDigital: boolean;
    downloadUrl: string | null;
  };
  quantity: number;
}>) {
  const subject = `[NONALIX CI] Vos liens de téléchargement - Commande ${order.id}`;
  const from = process.env.SMTP_FROM || 'no-reply@nonalix-ci.com';

  const digitalItems = items.filter(i => i.product.isDigital && i.product.downloadUrl);

  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #1e293b; line-height: 1.6;">
      <!-- Header -->
      <div style="text-align: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px; margin-bottom: 25px;">
        <h1 style="color: #4f46e5; margin: 0; font-size: 1.5rem; letter-spacing: 1px;">NONALIX CI</h1>
        <p style="margin: 5px 0 0 0; font-size: 0.9rem; color: #64748b; font-weight: 500;">Votre espace de croissance digitale</p>
      </div>

      <!-- Introduction -->
      <h2 style="color: #1e293b; margin-top: 0; font-size: 1.3rem;">Félicitations ${order.firstName},</h2>
      <p style="font-size: 0.95rem; color: #475569;">
        Nous vous remercions pour votre confiance. Votre paiement a été validé et vos packs digitaux sont prêts à être téléchargés.
      </p>

      <!-- Order Details -->
      <div style="background-color: #f8fafc; border-radius: 8px; padding: 15px; margin: 20px 0; border: 1px solid #f1f5f9; font-size: 0.875rem;">
        <div style="margin-bottom: 5px;"><strong>Commande :</strong> ${order.id}</div>
        <div><strong>Date :</strong> ${new Date().toLocaleDateString('fr-FR')}</div>
      </div>

      <!-- Links list -->
      <h3 style="color: #334155; font-size: 1.1rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-top: 25px;">Vos packs de formation & ressources</h3>
      
      <div style="margin-top: 15px;">
        ${digitalItems.map((item, idx) => {
          const isMega = item.product.downloadUrl?.includes('mega.nz');
          const providerName = isMega ? 'MEGA' : 'Google Drive';
          const providerColor = isMega ? '#d92c20' : '#0f9d58';
          const providerIcon = isMega ? '☁️' : '📂';

          return `
            <div style="margin-bottom: 25px; padding: 18px; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #fafafa;">
              <h4 style="margin: 0 0 10px 0; font-size: 1rem; color: #1e293b;">${idx + 1}. ${item.product.name}</h4>
              <p style="margin: 0 0 15px 0; font-size: 0.85rem; color: #64748b;">
                Hébergé de manière sécurisée sur <strong>${providerName}</strong>. Accès à vie et illimité.
              </p>
              <div style="text-align: center;">
                <a href="${item.product.downloadUrl}" target="_blank" 
                   style="background-color: ${providerColor}; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 0.9rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                  ${providerIcon} Accéder au pack (${providerName})
                </a>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- FAQ / Guidelines -->
      <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 4px; margin: 25px 0; font-size: 0.875rem; color: #1e3a8a;">
        <h4 style="margin: 0 0 8px 0; font-weight: 700;">💡 Astuce de téléchargement :</h4>
        <p style="margin: 0 0 6px 0;">Certains packs contiennent des fichiers compressés (formats ZIP/RAR) pour conserver la qualité des vidéos et outils.</p>
        <p style="margin: 0;">Nous vous recommandons de les télécharger depuis un ordinateur pour les extraire plus facilement.</p>
      </div>

      <!-- Support CTA -->
      <div style="text-align: center; margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 20px;">
        <p style="font-size: 0.9rem; color: #475569; margin-bottom: 15px;">
          Un problème pour télécharger vos fichiers ou une question ?
        </p>
        <a href="https://wa.me/2250566360303?text=Bonjour%20NONALIX%20CI,%20j'ai%20besoin%20d'aide%20concernant%20ma%20commande%20${order.id}." 
           style="background-color: #10b981; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 0.85rem;">
          💬 Contacter le Support WhatsApp
        </a>
      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 35px; padding-top: 15px; border-top: 1px solid #f1f5f9; font-size: 0.75rem; color: #94a3b8;">
        © ${new Date().getFullYear()} NONALIX CI. Tous droits réservés.<br/>
        Email : contact@nonalix-ci.com | Téléphone : +225 05 66 36 03 03
      </div>
    </div>
  `;

  const transporter = getTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from,
        to: order.email,
        subject,
        html,
      });
      console.log(`[DIGITAL DELIVERY SENT] Order ${order.id} links successfully sent to ${order.email}`);
    } catch (err) {
      console.error('[SMTP DIGITAL DELIVERY FAIL]', err);
    }
  } else {
    console.log(`
=========================================
[DIGITAL DELIVERY EMAIL SIMULATION] Links Sent
To: ${order.email}
Subject: ${subject}
-----------------------------------------
ID: ${order.id}
Client: ${order.firstName} ${order.lastName}
Links:
${digitalItems.map((item, idx) => `${idx + 1}. ${item.product.name} => ${item.product.downloadUrl}`).join('\n')}
=========================================
    `);
  }
}


