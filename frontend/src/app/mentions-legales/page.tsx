import React from 'react';
import { SITE_CONFIG, CONTACT_INFO } from '@/lib/constants';

export const metadata = {
  title: 'Mentions Légales',
  description: 'Mentions légales et politique de confidentialité de NONALIX CI.',
};

export default function LegalNoticePage() {
  return (
    <div className="page-content">
      <section className="section" style={{ paddingTop: 'var(--space-4xl)', paddingBottom: 'var(--space-3xl)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          
          <div className="section-header" style={{ marginBottom: 'var(--space-2xl)' }}>
            <span className="badge badge-accent">⚖️ Informations Légales</span>
            <h1 style={{ marginTop: 'var(--space-md)', fontSize: '2.5rem', fontFamily: 'var(--font-heading)' }}>
              Mentions Légales & <span className="text-gradient">Confidentialité</span>
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              En vigueur au {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
            
            {/* Card 1: Éditeur & Hébergement */}
            <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--color-surface-elevated)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-md)', color: 'var(--color-accent-glow)', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                1. Édition du site & Hébergement
              </h2>
              <p style={{ lineHeight: '1.6', fontSize: '0.9375rem' }}>
                Le site internet <strong>{SITE_CONFIG.domain}</strong> est édité par la société <strong>{SITE_CONFIG.fullName}</strong>, 
                Société à Responsabilité Limitée (SARL) au capital social de 1 000 000 FCFA, immatriculée au Registre du Commerce et du Crédit Mobilier d&apos;Abidjan.
              </p>
              <ul style={{ lineHeight: '1.8', fontSize: '0.9375rem', marginTop: 'var(--space-sm)' }}>
                <li><strong>Siège social :</strong> {CONTACT_INFO.address}</li>
                <li><strong>Adresse e-mail :</strong> <a href={`mailto:${CONTACT_INFO.email}`} style={{ color: 'var(--color-accent-glow)' }}>{CONTACT_INFO.email}</a></li>
                <li><strong>Téléphone :</strong> <a href={`tel:${CONTACT_INFO.phone}`} style={{ color: 'var(--color-accent-glow)' }}>{CONTACT_INFO.phoneDisplay}</a></li>
              </ul>
              <p style={{ lineHeight: '1.6', fontSize: '0.9375rem', marginTop: 'var(--space-md)' }}>
                <strong>Hébergement :</strong> Ce site est hébergé localement sur des serveurs sécurisés pour garantir la disponibilité et le respect de la vitesse de chargement sur le réseau ivoirien.
              </p>
            </div>

            {/* Card 2: Protection des données */}
            <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--color-surface-elevated)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-md)', color: 'var(--color-accent-glow)', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                2. Protection des données personnelles (ARTCI & RGPD)
              </h2>
              <p style={{ lineHeight: '1.6', fontSize: '0.9375rem' }}>
                Conformément à la loi n° 2013-450 relative à la protection des données à caractère personnel en Côte d&apos;Ivoire réglementée par l&apos;<strong>ARTCI</strong>, 
                ainsi qu&apos;aux standards internationaux du RGPD, <strong>{SITE_CONFIG.fullName}</strong> s&apos;engage à protéger la confidentialité des données de ses utilisateurs.
              </p>
              <h3 style={{ fontSize: '1rem', marginTop: 'var(--space-md)', marginBottom: 'var(--space-sm)', fontWeight: 600 }}>
                Données collectées :
              </h3>
              <p style={{ lineHeight: '1.6', fontSize: '0.9375rem' }}>
                Nous collectons des informations lors de la soumission de formulaires (Nom complet, e-mail, téléphone, nom d&apos;entreprise, détails du projet) et de commandes (Adresse de livraison, mode de paiement).
              </p>
              <h3 style={{ fontSize: '1rem', marginTop: 'var(--space-md)', marginBottom: 'var(--space-sm)', fontWeight: 600 }}>
                Finalité du traitement :
              </h3>
              <p style={{ lineHeight: '1.6', fontSize: '0.9375rem' }}>
                Ces données sont uniquement traitées pour :
              </p>
              <ul style={{ lineHeight: '1.8', fontSize: '0.9375rem', marginLeft: 'var(--space-md)' }}>
                <li>Répondre à vos demandes de contact ou de devis personnalisé.</li>
                <li>Générer et envoyer les rapports d&apos;audit SEO/IA demandés.</li>
                <li>Gérer, valider et livrer vos commandes sur notre boutique e-commerce.</li>
              </ul>
              <h3 style={{ fontSize: '1rem', marginTop: 'var(--space-md)', marginBottom: 'var(--space-sm)', fontWeight: 600 }}>
                Vos droits :
              </h3>
              <p style={{ lineHeight: '1.6', fontSize: '0.9375rem' }}>
                Vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression et d&apos;opposition au traitement de vos données personnelles. 
                Vous pouvez exercer ce droit à tout moment en écrivant à <a href={`mailto:${CONTACT_INFO.email}`} style={{ color: 'var(--color-accent-glow)' }}>{CONTACT_INFO.email}</a>.
              </p>
            </div>

            {/* Card 3: Politique de Cookies */}
            <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--color-surface-elevated)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-md)', color: 'var(--color-accent-glow)', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                3. Utilisation des cookies & Mesure d&apos;audience
              </h2>
              <p style={{ lineHeight: '1.6', fontSize: '0.9375rem' }}>
                Le site utilise des traceurs (cookies) pour enregistrer le trafic du site, analyser la navigation des utilisateurs et améliorer l&apos;ergonomie. 
                Aucune donnée personnelle sensible n&apos;est stockée dans ces cookies sans votre consentement explicite préalable.
              </p>
              <p style={{ lineHeight: '1.6', fontSize: '0.9375rem', marginTop: 'var(--space-sm)' }}>
                Vous pouvez accepter ou refuser le dépôt de cookies à tout moment via le bandeau de consentement affiché en bas de l&apos;écran. 
                En cas de refus, votre visite ne sera pas enregistrée dans nos outils de statistiques de trafic.
              </p>
            </div>

            {/* Card 4: Propriété Intellectuelle */}
            <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--color-surface-elevated)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-md)', color: 'var(--color-accent-glow)', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                4. Propriété intellectuelle
              </h2>
              <p style={{ lineHeight: '1.6', fontSize: '0.9375rem' }}>
                L&apos;ensemble du contenu de ce site (textes, logos, images, icônes, animations, chartes graphiques) est la propriété exclusive de <strong>{SITE_CONFIG.fullName}</strong>. 
                Toute reproduction, distribution ou modification de ces éléments sans autorisation écrite préalable est strictement interdite et constitue une contrefaçon sanctionnée par la loi.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
