'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/constants';
import type { Product } from '@/types/product';

// High-converting copywriting and marketing metadata for each digital pack to make the product pages detailed and highly convincing
const PRODUCT_MARKETING_COPY: Record<string, {
  forWho: string;
  promise: string;
  benefits: string[];
  duration: string;
  level: string;
  updates: string;
}> = {
  'pack-formations-revolution-ia-chatgpt': {
    forWho: 'Entrepreneurs, freelances, salariés, créateurs de contenu et curieux du digital souhaitant multiplier leur productivité par 10.',
    promise: 'Déléguez vos tâches répétitives, rédigez vos contenus en automatique et automatisez vos processus métiers grâce aux meilleurs modèles d\'intelligence artificielle.',
    benefits: [
      'Maîtrise complète de l\'art du Prompting sur ChatGPT (de débutant à expert).',
      'Création de visuels et d\'images artistiques à couper le souffle avec Midjourney.',
      'Mise en place de bots et d\'automatisations sur-mesure pour gagner plusieurs heures par jour.',
      'Génération automatique d\'articles et de sites WordPress à fort trafic.'
    ],
    duration: '5 Formations Complètes · +15 heures de vidéo de haute qualité',
    level: 'Tous niveaux (Débutant à Avancé)',
    updates: 'Mises à jour mensuelles incluses (accès aux nouveautés ChatGPT 2026/2027)'
  },
  'pack-formations-ecommerce-dropshipping': {
    forWho: 'Toute personne souhaitant lancer une boutique en ligne rentable, importer des marchandises et vendre avec succès en Afrique et à l\'international.',
    promise: 'Apprenez la méthodologie complète pour sourcer des produits gagnants auprès de fournisseurs fiables (Alibaba, Chine), gérer la logistique d\'importation et maximiser vos ventes en ligne.',
    benefits: [
      'Création et optimisation complète d\'une boutique Shopify hautement professionnelle.',
      'Guide d\'importation Chine-Afrique : négociation fournisseurs, transitaires et douanes.',
      'Stratégies de vente adaptées au marché (Cash on Delivery et paiements Mobile Money/Wave).',
      'Lancement de campagnes publicitaires e-commerce ultra-rentables.'
    ],
    duration: '4 Formations Vidéo · Modules pratiques étape par étape',
    level: 'Débutant et Intermédiaire',
    updates: 'Accès aux stratégies de sourcing et transitaires recommandés 2026'
  },
  'pack-business-en-ligne-affiliation-premium': {
    forWho: 'Aspirants infopreneurs, freelances et toute personne cherchant à générer des revenus passifs ou lancer sa propre agence de services digitaux (SMMA).',
    promise: 'Découvrez les clés pour vendre les produits des autres (Affiliation), monétiser votre savoir via un blog/chaîne YouTube, et bâtir une agence de marketing digital à forte rentabilité.',
    benefits: [
      'Plan d\'action complet pour signer vos premiers clients d\'agence SMMA à 1000€/mois.',
      'Secrets de l\'affiliation premium pour générer des revenus passifs récurrents.',
      'Création d\'un blog professionnel optimisé pour le référencement passif.',
      'Méthode d\'écriture persuasive (Copywriting) pour doubler vos taux de conversion.'
    ],
    duration: '7 Formations · Packs de ressources et templates prêts à copier',
    level: 'Tous niveaux',
    updates: 'Mises à jour à vie et ajouts réguliers de nouvelles techniques'
  },
  'pack-marketing-digital-publicite-ultra-ciblee': {
    forWho: 'Chefs d\'entreprise, commerçants, agences et professionnels du marketing désireux d\'attirer des clients qualifiés en continu.',
    promise: 'Dominez le trafic payant et l\'acquisition. Apprenez à concevoir, lancer et optimiser des campagnes publicitaires rentables sur Facebook, Instagram et Google Ads.',
    benefits: [
      'Maîtrise avancée du Business Manager et des techniques de ciblage d\'audience.',
      'Installation et configuration du Pixel Facebook pour le reciblage (Retargeting) dynamique.',
      'Formation complète sur Google Analytics 4 (GA4) pour mesurer précisément le retour sur investissement.',
      'Secrets du Community Management pour animer et fédérer une communauté active.'
    ],
    duration: '5 Formations thématiques · +26 heures de tutoriels approfondis',
    level: 'Intermédiaire à Expert',
    updates: 'Adapté aux dernières modifications de tracking publicitaire'
  },
  'pack-montage-video-professionnel-tiktok': {
    forWho: 'Créateurs de contenu, influenceurs, e-commerçants et passionnés de vidéo voulant briller sur les réseaux sociaux (TikTok, Instagram Reels, YouTube Shorts).',
    promise: 'Maîtrisez les deux meilleurs logiciels de montage vidéo professionnels du marché (Premiere Pro & DaVinci Resolve) et comprenez les algorithmes viraux.',
    benefits: [
      'Prise en main complète et rapide d\'Adobe Premiere Pro 2024.',
      'Montage professionnel et étalonnage des couleurs sur DaVinci Resolve.',
      'Méthode virale "1 Minute Révolution" pour percer sur TikTok en 30 jours.',
      'Création de sous-titres dynamiques et captivants pour retenir l\'attention dès les premières secondes.'
    ],
    duration: '5 Formations Complètes · Templates de sous-titres et effets sonores inclus',
    level: 'Débutant à Intermédiaire',
    updates: 'Mises à jour gratuites selon les versions logicielles'
  },
  'pack-developpement-web-no-code-bureautique': {
    forWho: 'Personnes en reconversion, chefs de projet et professionnels souhaitant acquérir des compétences techniques très prisées et automatiser leurs processus.',
    promise: 'Créez des applications web avancées sans écrire une seule ligne de code avec Bubble, apprenez le langage Python et maîtrisez la suite Microsoft Office.',
    benefits: [
      'Développement d\'une application web dynamique de A à Z avec Bubble.',
      'Apprentissage des bases et logique de programmation en Python (Data & Automations).',
      'Maîtrise avancée d\'Excel et programmation VBA pour automatiser les tâches de bureau.',
      'Sécurisation et défense de vos sites et applications WordPress.'
    ],
    duration: '6 Formations Techniques · Exercices pratiques téléchargeables',
    level: 'Débutant à Avancé',
    updates: 'Ressources et codes sources d\'exercices fournis'
  },
  'super-bibliotheque-2000-ebooks-100-livres-audio': {
    forWho: 'Passionnés de lecture, entrepreneurs, étudiants et toute personne engagée dans son développement personnel et financier.',
    promise: 'Accédez instantanément à une bibliothèque gigantesque contenant des milliers d\'ouvrages majeurs sur la finance personnelle, le marketing, la vente, la psychologie et la motivation.',
    benefits: [
      '2000+ Ebooks soigneusement classés par thématiques d\'affaires et de croissance.',
      '100 Livres Audio lus par des professionnels pour vous former lors de vos déplacements.',
      'Guide étape par étape pour rédiger et publier votre propre livre sur Amazon Kindle en 60 jours.',
      'Format compatible liseuses, tablettes, smartphones et ordinateurs.'
    ],
    duration: '2000+ Livres & 100 Fichiers Audio (Accès Cloud permanent)',
    level: 'Tous publics',
    updates: 'Nouveaux livres ajoutés régulièrement au dossier partagé'
  },
  'pack-langues-finance-developpement-personnel': {
    forWho: 'Professionnels, investisseurs et particuliers désireux de s\'ouvrir à l\'international, de maîtriser leurs finances et d\'acquérir des bases agricoles durables.',
    promise: 'Un pack pluridisciplinaire unique pour booster votre aisance à l\'oral en anglais, comprendre les marchés financiers (Trading) et investir dans l\'agrobusiness.',
    benefits: [
      'Anglais professionnel : méthode accélérée pour négocier et s\'exprimer avec confiance.',
      'Formation complète en Trading et investissement boursier à faible risque.',
      'Clés de la prise de parole en public et de la communication persuasive.',
      'Guide pratique pour lancer une exploitation agropastorale rentable (Élevage et Culture).'
    ],
    duration: '4 Formations complètes · Supports PDF et documents de calcul financiers',
    level: 'Débutant et Intermédiaire',
    updates: 'Mises à jour régulières'
  }
};

const CATEGORY_META: Record<string, { color: string; rgb: string; code: string }> = {
  'IA & ChatGPT':                 { color: '#e7ad05', rgb: '231,173,5',  code: 'AI'  },
  'E-commerce & Dropshipping':    { color: '#e7ad05', rgb: '231,173,5',  code: 'ECO' },
  'Business & Affiliation':       { color: '#e7ad05', rgb: '231,173,5',  code: 'BIZ' },
  'Marketing & Publicité':        { color: '#e7ad05', rgb: '231,173,5',  code: 'MKT' },
  'Montage & Réseaux Sociaux':    { color: '#e7ad05', rgb: '231,173,5',  code: 'VID' },
  'Développement & No-Code':      { color: '#e7ad05', rgb: '231,173,5',  code: 'DEV' },
  'Mindset & Ebooks':             { color: '#e7ad05', rgb: '231,173,5',  code: 'EKB' },
  'Langues, Finance & Dev. Perso':{ color: '#e7ad05', rgb: '231,173,5',  code: 'LFD' },
};
const DEFAULT_META = { color: '#e7ad05', rgb: '231,173,5', code: 'PRO' };

const emojiMap: Record<string, string> = {
  'IA & ChatGPT': '🤖',
  'E-commerce & Dropshipping': '🛒',
  'Business & Affiliation': '📈',
  'Marketing & Publicité': '📊',
  'Montage & Réseaux Sociaux': '🎬',
  'Développement & No-Code': '💻',
  'Mindset & Ebooks': '📚',
  'Langues, Finance & Dev. Perso': '🌍',
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const slug = params?.slug as string;

  useEffect(() => {
    if (!slug) return;
    
    Promise.all([
      fetch(`/api/products?slug=${slug}`).then((res) => (res.ok ? res.json() : null)),
      fetch('/api/products').then((res) => (res.ok ? res.json() : [])),
    ])
      .then(([currentProduct, list]) => {
        setProduct(currentProduct);
        setAllProducts(list);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load product details:', err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="page-content">
        <div className="container section" style={{ paddingTop: 'var(--space-3xl)' }}>
          <div className="skeleton" style={{ width: '150px', height: '20px', marginBottom: 'var(--space-xl)' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-2xl)' }}>
            <div className="skeleton" style={{ aspectRatio: '16/9', borderRadius: 'var(--radius-lg)' }} />
            <div>
              <div className="skeleton" style={{ width: '100px', height: '24px', marginBottom: 'var(--space-md)' }} />
              <div className="skeleton" style={{ width: '250px', height: '40px', marginBottom: 'var(--space-md)' }} />
              <div className="skeleton" style={{ width: '120px', height: '32px', marginBottom: 'var(--space-lg)' }} />
              <div className="skeleton" style={{ width: '100%', height: '80px', marginBottom: 'var(--space-lg)' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-content">
        <div className="container section" style={{ textAlign: 'center' }}>
          <h1>Produit non trouvé</h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 'var(--space-lg) 0' }}>
            Ce produit n&apos;existe pas ou a été retiré.
          </p>
          <Link href="/boutique" className="btn btn-primary">
            Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  const similarProducts = allProducts
    .filter((p) => p.isDigital && p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const copy = PRODUCT_MARKETING_COPY[product.slug] || {
    forWho: 'Toute personne souhaitant se former de manière accélérée et efficace.',
    promise: product.description,
    benefits: [
      'Acquérez des compétences directement applicables en entreprise.',
      'Bénéficiez de guides pratiques et d\'exemples concrets.',
      'Gagnez du temps grâce à un apprentissage structuré.'
    ],
    duration: 'Accès immédiat et illimité',
    level: 'Tous niveaux',
    updates: 'Mises à jour incluses'
  };

  const meta = CATEGORY_META[product.category] || DEFAULT_META;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://nonalix-ci.com' },
      { '@type': 'ListItem', position: 2, name: 'Boutique', item: 'https://nonalix-ci.com/boutique' },
      { '@type': 'ListItem', position: 3, name: product.name, item: `https://nonalix-ci.com/boutique/${product.slug}` },
    ],
  };

  return (
    <div className="page-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <section className="section" style={{ paddingTop: 'var(--space-3xl)' }}>
        <div className="container">
          
          {/* Breadcrumb */}
          <nav style={{ marginBottom: 'var(--space-xl)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            <Link href="/" style={{ color: '#e7ad05' }}>Accueil</Link>
            {' / '}
            <Link href="/boutique" style={{ color: '#e7ad05' }}>Boutique</Link>
            {' / '}
            <span style={{ color: 'var(--color-text)' }}>{product.name}</span>
          </nav>

          {/* Main layout grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-2xl)' }} className="grid-details-layout">
            
            {/* Left Column (Visuals & Course Content Details) */}
            <div>
              {/* Product Cover image */}
              <div
                style={{
                  aspectRatio: '16/9',
                  position: 'relative',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  border: '1px solid var(--color-border)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                  marginBottom: 'var(--space-xl)'
                }}
              >
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                  priority
                />
              </div>

              {/* Pour qui est-ce ? */}
              <div style={{
                marginBottom: 'var(--space-lg)',
                padding: 'var(--space-md) var(--space-lg)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: 'var(--radius-md)',
              }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e7ad05', marginBottom: 'var(--space-xs)', fontFamily: 'var(--font-heading)' }}>
                  À qui s&apos;adresse ce pack ?
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  {copy.forWho}
                </p>
              </div>

              {/* Ce que vous allez accomplir */}
              <div style={{
                marginBottom: 'var(--space-lg)',
                padding: 'var(--space-md) var(--space-lg)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: 'var(--radius-md)',
              }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e7ad05', marginBottom: 'var(--space-md)', fontFamily: 'var(--font-heading)' }}>
                  Compétences clés acquises :
                </h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  {copy.benefits.map((benefit, bIdx) => (
                    <li key={bIdx} style={{ display: 'flex', gap: 'var(--space-sm)', fontSize: '0.875rem', color: 'var(--color-text-secondary)', alignItems: 'flex-start', lineHeight: 1.5 }}>
                      <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Syllabus complet */}
              {product.details && (product.details as string[]).length > 0 && (
                <div style={{
                  marginBottom: 'var(--space-lg)',
                  padding: 'var(--space-md) var(--space-lg)',
                  background: 'var(--color-primary-light)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#e7ad05', marginBottom: 'var(--space-md)', fontFamily: 'var(--font-heading)' }}>
                    Programme détaillé du pack :
                  </h3>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                    {(product.details as string[]).map((detail, idx) => (
                      <li key={idx} style={{ display: 'flex', gap: 'var(--space-sm)', fontSize: '0.875rem', color: 'var(--color-text-secondary)', alignItems: 'flex-start', lineHeight: 1.5 }}>
                        <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>✓</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column (Purchase panel & Convincing parameters) */}
            <div style={{ position: 'sticky', top: '90px', height: 'fit-content' }}>
              
              {/* Product Info Card */}
              <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                
                {/* Category Badge & Trust Score */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
                  <span className="badge" style={{ background: 'rgba(231, 173, 5, 0.08)', border: '1px solid rgba(231, 173, 5, 0.2)', color: '#e7ad05', fontSize: '0.7rem', fontWeight: 700 }}>
                    {product.category}
                  </span>
                  <div style={{ fontSize: '0.75rem', color: '#F59E0B', fontWeight: 700 }}>
                    4.9/5 <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>(120+ avis)</span>
                  </div>
                </div>

                <h1 style={{ fontSize: '1.6rem', marginBottom: 'var(--space-md)', fontWeight: 800, lineHeight: 1.25 }}>
                  {product.name}
                </h1>

                {/* Price block */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: 'var(--space-md)' }}>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--color-highlight)', fontFamily: 'var(--font-heading)' }}>
                    {formatPrice(product.price)}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                    {formatPrice(product.price * 2)}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-success)', background: 'rgba(16, 185, 129, 0.08)', padding: '2px 6px', borderRadius: '3px', fontWeight: 700 }}>
                    -50% OFFRE SPÉCIALE
                  </span>
                </div>

                {/* Core Promise */}
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 'var(--space-lg)', fontSize: '0.9rem' }}>
                  {copy.promise}
                </p>

                {/* Features checklist */}
                <div style={{ borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '12px 0', marginBottom: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  <div><strong>Format :</strong> {copy.duration}</div>
                  <div><strong>Niveau :</strong> {copy.level}</div>
                  <div><strong>Livraison :</strong> Immédiate par e-mail après paiement</div>
                  <div><strong>Accès :</strong> À vie, mises à jour permanentes incluses</div>
                </div>

                {/* CTA Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  <button
                    className="btn btn-highlight btn-lg btn-full"
                    style={{ fontWeight: 800, fontSize: '1rem', minHeight: '48px' }}
                    onClick={() => {
                      addItem(product as Product);
                      router.push('/checkout');
                    }}
                    id="product-buy-now"
                  >
                    ACHAT DIRECT
                  </button>

                  <button
                    className="btn btn-outline btn-lg btn-full"
                    style={{ minHeight: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    onClick={() => addItem(product as Product)}
                    id="product-add-to-cart"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"/>
                      <circle cx="20" cy="21" r="1"/>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                    </svg>
                    Ajouter au panier
                  </button>
                </div>

                {/* Secure payments & Satisfaction guarantee */}
                <div style={{ marginTop: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                  <div>Paiement ultra-sécurisé par Wave ou Orange Money</div>
                  <div>Garantie 100% Satisfait ou Remboursé sous 14 jours</div>
                </div>

              </div>

              {/* Comment ça marche card */}
              <div className="card" style={{ marginTop: 'var(--space-md)', padding: 'var(--space-md) var(--space-lg)', border: '1px solid var(--color-border)', background: 'rgba(255, 255, 255, 0.01)' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px', color: '#e7ad05' }}>Comment se passe la livraison ?</h4>
                <ol style={{ fontSize: '0.75rem', paddingLeft: '15px', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '4px', margin: 0 }}>
                  <li>Remplissez vos coordonnées à l&apos;étape suivante (e-mail requis).</li>
                  <li>Effectuez le paiement en ligne en toute sécurité via Orange Money ou Wave.</li>
                  <li>Recevez instantanément vos liens de téléchargement par e-mail.</li>
                </ol>
              </div>

            </div>

          </div>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div style={{ marginTop: 'var(--space-4xl)' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-xl)', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                Packs similaires recommandés
              </h2>
              <div className="bq-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {similarProducts.map((sp) => {
                  const spMeta = CATEGORY_META[sp.category] || DEFAULT_META;
                  return (
                    <div
                      key={sp.id}
                      className="bq-card"
                      style={{
                        '--c': '#e7ad05',
                        '--rgb': '231,173,5',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      } as React.CSSProperties}
                    >
                      <div>
                        {/* Accent left bar */}
                        <div className="bq-card-bar" />

                        {/* Top row */}
                        <div className="bq-card-head" style={{ padding: '14px 16px 6px 20px' }}>
                          <span className="bq-card-code" style={{ color: '#e7ad05', fontSize: '0.65rem' }}>
                            {spMeta.code}
                          </span>
                          <span className="bq-badge bq-badge-digital" style={{ background: 'rgba(231,173,5,0.1)', borderColor: 'rgba(231,173,5,0.2)', color: '#e7ad05' }}>DIGITAL</span>
                        </div>

                        {/* Body */}
                        <div className="bq-card-body" style={{ padding: '8px 16px 12px 20px' }}>
                          <Link href={`/boutique/${sp.slug}`} className="bq-card-title-link">
                            <h3 className="bq-card-title">{sp.name}</h3>
                          </Link>
                          <p className="bq-card-desc">{sp.description}</p>
                        </div>
                      </div>

                      <div className="bq-card-foot" style={{ borderTop: '1px solid var(--color-border)', padding: '12px 16px 12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="bq-card-price" style={{ color: 'var(--color-highlight)', fontSize: '1rem', fontWeight: 800 }}>
                          {formatPrice(sp.price)}
                        </div>
                        <Link href={`/boutique/${sp.slug}`} className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.75rem', minHeight: '30px' }}>
                          En savoir plus
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Media queries specifically for the responsive layout of this details page */}
      <style jsx global>{`
        @media (max-width: 1024px) {
          .grid-details-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
