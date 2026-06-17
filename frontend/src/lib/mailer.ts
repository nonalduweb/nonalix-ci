import nodemailer from 'nodemailer';

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
