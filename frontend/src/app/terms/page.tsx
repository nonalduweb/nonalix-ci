import React from 'react';
import type { Metadata } from 'next';
import { SITE_CONFIG, CONTACT_INFO } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Conditions Générales d\'Utilisation (CGU) & Vente (CGV)',
  description: 'Conditions générales d\'utilisation et de vente de NONALIX CI SARL. Prestations de service et vente de produits digitaux.',
  alternates: {
    canonical: '/terms',
  },
  robots: {
    index: true,
    follow: false,
  },
};

export default function TermsPage() {
  return (
    <div className="page-content">
      <section className="section" style={{ paddingTop: 'var(--space-4xl)', paddingBottom: 'var(--space-3xl)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          
          <div className="section-header" style={{ marginBottom: 'var(--space-2xl)' }}>
            <span className="badge badge-accent">Cadre Légal</span>
            <h1 style={{ marginTop: 'var(--space-md)', fontSize: '2.5rem', fontFamily: 'var(--font-heading)' }}>
              Conditions Générales <span className="text-gradient">d&apos;Utilisation</span>
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
            
            {/* Objet */}
            <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--color-surface-elevated)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-md)', color: 'var(--color-accent-glow)', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                1. Objet et acceptation des conditions
              </h2>
              <p style={{ lineHeight: '1.6', fontSize: '0.9375rem' }}>
                Les présentes Conditions Générales d&apos;Utilisation (CGU) et de Vente (CGV) régissent l&apos;utilisation du site <strong>{SITE_CONFIG.domain}</strong> 
                et l&apos;achat de formations ou d&apos;ebooks sur notre boutique en ligne. 
                L&apos;accès au site ou la passation d&apos;une commande implique l&apos;acceptation sans réserve de ces conditions par l&apos;utilisateur.
              </p>
            </div>

            {/* Utilisation de l'assistant virtuel */}
            <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--color-surface-elevated)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-md)', color: 'var(--color-accent-glow)', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                2. Limitation de responsabilité — Assistants Virtuels & IA
              </h2>
              <p style={{ lineHeight: '1.6', fontSize: '0.9375rem' }}>
                Notre site internet propose des assistants de discussion dotés d&apos;intelligence artificielle (Chatbots sectoriels) 
                pour renseigner les prospects et orienter les utilisateurs.
              </p>
              <ul style={{ lineHeight: '1.8', fontSize: '0.9375rem', marginTop: 'var(--space-sm)', marginLeft: 'var(--space-md)' }}>
                <li>Les réponses de l&apos;assistant sont générées automatiquement à des fins d&apos;information et de pré-qualification. Elles n&apos;ont pas de valeur contractuelle absolue.</li>
                <li><strong>Santé & Urgences :</strong> Notre assistant médical virtuel (NONALIX Santé) ne fournit aucun diagnostic ni conseil médical engageant. En cas d&apos;urgence, vous devez contacter immédiatement les numéros de secours locaux (111 / 185 en Côte d&apos;Ivoire).</li>
                <li>L&apos;éditeur du site ne saurait être tenu responsable d&apos;une mauvaise interprétation des informations fournies par les agents conversationnels.</li>
              </ul>
            </div>

            {/* Vente de produits digitaux */}
            <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--color-surface-elevated)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-md)', color: 'var(--color-accent-glow)', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                3. Conditions de Vente des Produits Digitaux
              </h2>
              <p style={{ lineHeight: '1.6', fontSize: '0.9375rem', marginBottom: 'var(--space-sm)' }}>
                Notre boutique en ligne propose des ebooks et des formations sous format numérique.
              </p>
              <ul style={{ lineHeight: '1.8', fontSize: '0.9375rem', marginLeft: 'var(--space-md)' }}>
                <li><strong>Paiement :</strong> Les règlements s&apos;effectuent par Mobile Money (Orange Money, Wave, etc.) ou carte bancaire de manière sécurisée via nos partenaires de paiement agréés.</li>
                <li><strong>Livraison :</strong> Les fichiers numériques ou liens d&apos;accès sécurisés (Mega, Google Drive) sont délivrés de manière instantanée sur votre écran de confirmation de commande et par e-mail après validation du paiement.</li>
                <li><strong>Remboursement :</strong> En raison de la nature numérique des produits livrés instantanément et consommables immédiatement, aucun droit de rétractation ou remboursement n&apos;est applicable après la livraison des liens de téléchargement.</li>
              </ul>
            </div>

            {/* Propriété intellectuelle */}
            <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--color-surface-elevated)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-md)', color: 'var(--color-accent-glow)', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                4. Propriété intellectuelle
              </h2>
              <p style={{ lineHeight: '1.6', fontSize: '0.9375rem' }}>
                Tous les contenus originaux (formations, ebooks, structures, codes du site, designs graphiques) sont la propriété de <strong>{SITE_CONFIG.fullName}</strong>. 
                Toute revente, diffusion gratuite ou copie non autorisée constitue une violation flagrante des droits de propriété intellectuelle passible de poursuites judiciaires.
              </p>
            </div>

            {/* Loi applicable */}
            <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--color-surface-elevated)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-md)', color: 'var(--color-accent-glow)', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                5. Droit applicable et juridiction compétente
              </h2>
              <p style={{ lineHeight: '1.6', fontSize: '0.9375rem' }}>
                Les présentes conditions sont régies et interprétées conformément au droit en vigueur en République de Côte d&apos;Ivoire. 
                Tout litige relatif à l&apos;utilisation du site ou à la vente de produits sera soumis à la compétence exclusive des tribunaux d&apos;Abidjan.
              </p>
              <p style={{ lineHeight: '1.6', fontSize: '0.9375rem', marginTop: 'var(--space-md)' }}>
                Pour toute question ou réclamation, vous pouvez contacter notre service client à l&apos;adresse suivante : 
                <a href={`mailto:${CONTACT_INFO.email}`} style={{ color: 'var(--color-accent-glow)', marginLeft: '4px' }}>{CONTACT_INFO.email}</a>.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
