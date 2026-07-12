import React from 'react';
import type { Metadata } from 'next';
import { SITE_CONFIG, CONTACT_INFO } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité',
  description: 'Politique de protection des données personnelles de NONALIX CI. En savoir plus sur la collecte et la protection de vos données (ARTCI & RGPD).',
  alternates: {
    canonical: '/privacy-policy',
  },
  robots: {
    index: true,
    follow: false,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="page-content">
      <section className="section" style={{ paddingTop: 'var(--space-4xl)', paddingBottom: 'var(--space-3xl)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          
          <div className="section-header" style={{ marginBottom: 'var(--space-2xl)' }}>
            <span className="badge badge-accent">Sécurité & Confiance</span>
            <h1 style={{ marginTop: 'var(--space-md)', fontSize: '2.5rem', fontFamily: 'var(--font-heading)' }}>
              Politique de <span className="text-gradient">Confidentialité</span>
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
            
            {/* Introduction */}
            <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--color-surface-elevated)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-md)', color: 'var(--color-accent)', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                Introduction
              </h2>
              <p style={{ lineHeight: '1.6', fontSize: '0.9375rem' }}>
                La présente Politique de Confidentialité a pour but d&apos;informer les utilisateurs du site <strong>{SITE_CONFIG.domain}</strong> 
                sur la manière dont la société <strong>{SITE_CONFIG.fullName}</strong> collecte, stocke, utilise et protège leurs données à caractère personnel, 
                conformément à la loi n° 2013-450 relative à la protection des données personnelles en Côte d&apos;Ivoire (administrée par l&apos;<strong>ARTCI</strong>) 
                et au Règlement Général sur la Protection des Données (<strong>RGPD</strong>).
              </p>
            </div>

            {/* Données collectées */}
            <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--color-surface-elevated)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-md)', color: 'var(--color-accent)', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                1. Données collectées
              </h2>
              <p style={{ lineHeight: '1.6', fontSize: '0.9375rem', marginBottom: 'var(--space-sm)' }}>
                Nous collectons et traitons les informations suivantes selon vos actions sur notre site :
              </p>
              <ul style={{ lineHeight: '1.8', fontSize: '0.9375rem', marginLeft: 'var(--space-md)' }}>
                <li><strong>Données de contact :</strong> Nom, adresse e-mail, numéro de téléphone et détails du message soumis via le formulaire de contact ou les demandes d&apos;audits.</li>
                <li><strong>Données de commande :</strong> Prénom, nom, numéro de téléphone, ville, adresse de livraison et détails de paiement lors de vos achats sur notre boutique e-commerce.</li>
                <li><strong>Données de chat (Assistant IA & WhatsApp) :</strong> Numéro de téléphone ou identifiant de session, historique des messages, et toutes les données sectorielles partagées volontairement avec notre assistant virtuel.</li>
                <li><strong>Données de navigation :</strong> Cookies de session, adresse IP, type de navigateur et parcours utilisateur (via nos outils statistiques internes).</li>
              </ul>
            </div>

            {/* Pourquoi collecter */}
            <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--color-surface-elevated)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-md)', color: 'var(--color-accent)', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                2. Finalités du traitement (Pourquoi nous collectons vos données)
              </h2>
              <p style={{ lineHeight: '1.6', fontSize: '0.9375rem', marginBottom: 'var(--space-sm)' }}>
                Vos données sont utilisées strictement pour les objectifs suivants :
              </p>
              <ul style={{ lineHeight: '1.8', fontSize: '0.9375rem', marginLeft: 'var(--space-md)' }}>
                <li><strong>Service Client :</strong> Répondre à vos demandes de support, de devis personnalisé et de contact.</li>
                <li><strong>Logique du Chatbot :</strong> Permettre à notre assistant commercial virtuel de maintenir le contexte et de vous guider intelligemment.</li>
                <li><strong>Livraison & Commandes :</strong> Valider vos transactions, livrer vos formations et produits, et émettre vos factures de commande.</li>
                <li><strong>Sécurité :</strong> Prévenir la fraude informatique et garantir la stabilité de notre site web.</li>
              </ul>
            </div>

            {/* Protection des données */}
            <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--color-surface-elevated)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-md)', color: 'var(--color-accent)', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                3. Sécurité et Protection de vos données
              </h2>
              <p style={{ lineHeight: '1.6', fontSize: '0.9375rem', marginBottom: 'var(--space-sm)' }}>
                Nous mettons en œuvre toutes les mesures techniques et organisationnelles appropriées pour garantir la sécurité de vos données :
              </p>
              <ul style={{ lineHeight: '1.8', fontSize: '0.9375rem', marginLeft: 'var(--space-md)' }}>
                <li><strong>Chiffrement SSL :</strong> Toutes les données qui transitent entre votre navigateur et nos serveurs sont chiffrées (HTTPS).</li>
                <li><strong>Stockage hermétique :</strong> Les données sont stockées dans une base de données privée MySQL sécurisée. L&apos;accès physique et logique y est restreint aux seuls développeurs et administrateurs autorisés.</li>
                <li><strong>Traitement IA confidentiel :</strong> Les messages envoyés à nos APIs de modèles de langage (ex: OpenAI) sont cryptés. Conformément aux politiques de conformité entreprise de nos fournisseurs, vos messages de discussion ne sont jamais utilisés pour entraîner des modèles publics tiers.</li>
              </ul>
            </div>

            {/* Droits des utilisateurs */}
            <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--color-surface-elevated)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-md)', color: 'var(--color-accent)', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                4. Vos droits et demande de suppression
              </h2>
              <p style={{ lineHeight: '1.6', fontSize: '0.9375rem' }}>
                Vous disposez à tout moment d&apos;un droit d&apos;accès, de rectification, de limitation et de suppression définitive de vos données personnelles et historiques de discussion.
              </p>
              <p style={{ lineHeight: '1.6', fontSize: '0.9375rem', marginTop: 'var(--space-sm)' }}>
                Pour exercer ces droits ou formuler une demande de suppression de données, vous pouvez nous écrire directement à notre adresse e-mail de contact : 
                <a href={`mailto:${CONTACT_INFO.email}`} style={{ color: 'var(--color-accent)', marginLeft: '4px' }}>{CONTACT_INFO.email}</a>. 
                Toutes les demandes de suppression sont traitées dans un délai maximum de 48 heures.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
