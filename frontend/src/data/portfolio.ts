// NONALIX CI — Données du Portfolio des projets réalisés

export interface Project {
  id: string;
  title: string;
  category: 'web' | 'ecommerce' | 'ia-automation' | 'seo-marketing';
  categoryLabel: string;
  description: string;
  image: string;
  tags: string[];
  badge: string;
  featured: boolean;
  link: string;
}

export const PORTFOLIO_PROJECTS: Project[] = [
  {
    id: 'proj_001',
    title: 'Global Building Service SARL',
    category: 'web',
    categoryLabel: 'Site Web Institutionnel',
    description: 'Création d\'une plateforme web institutionnelle complète pour une entreprise leader dans le BTP, la construction et le génie civil en Côte d\'Ivoire.',
    image: '/images/products/globalbuildingsarl.png',
    tags: ['React', 'Laravel', 'Tailwind CSS', 'Inertia.js'],
    badge: 'Site Web',
    featured: true,
    link: '#',
  },
  {
    id: 'proj_002',
    title: 'Black Wolf CNC',
    category: 'web',
    categoryLabel: 'Plateforme Web & Reporting',
    description: 'Plateforme web sur mesure pour un studio de photographie industrielle et une agence de reporting basée au Canada, offrant une galerie interactive et un module de commande sécurisé.',
    image: '/images/products/blackwolfcnc.png',
    tags: ['React', 'Tailwind CSS', 'Laravel'],
    badge: 'Site Web',
    featured: true,
    link: '#',
  },
  {
    id: 'proj_003',
    title: 'Global Building Ltd (Canada)',
    category: 'web',
    categoryLabel: 'Site Vitrine Professionnel',
    description: 'Site institutionnel haut de gamme spécialisé en détection et retrait d\'amiante pour le marché canadien, conçu avec un design épuré pour maximiser la conversion B2B.',
    image: '/images/products/globalbuildingltd.png',
    tags: ['React', 'Laravel', 'Tailwind CSS'],
    badge: 'Site Web',
    featured: true,
    link: '#',
  },
  {
    id: 'proj_004',
    title: 'AfriShop — E-commerce & Paiement Mobile Money',
    category: 'ecommerce',
    categoryLabel: 'E-commerce & Paiement Local',
    description: 'Une boutique e-commerce moderne conçue pour le marché ivoirien, avec intégration des API de paiement locaux (Wave, Orange Money, MTN MoMo) et un système de livraison autonome pour Abidjan et l\'intérieur.',
    image: '/images/products/ecommerce-site.png',
    tags: ['Next.js', 'PostgreSQL', 'Orange Money / Wave / MTN'],
    badge: 'E-commerce',
    featured: false,
    link: '#',
  },
  {
    id: 'proj_005',
    title: 'Chatbot IA Conversationnel WhatsApp',
    category: 'ia-automation',
    categoryLabel: 'Intelligence Artificielle',
    description: 'Déploiement d\'un agent conversationnel IA intelligent sur WhatsApp Business, capable de comprendre le français et le nouchi (argot ivoirien) pour qualifier les leads et répondre aux clients 24h/24.',
    image: '/images/products/chatbot-ia.png',
    tags: ['FastAPI', 'OpenAI API', 'WhatsApp Cloud API'],
    badge: 'Chatbot IA',
    featured: false,
    link: '#',
  },
  {
    id: 'proj_006',
    title: 'Automatisation de Processus Métier & CRM',
    category: 'ia-automation',
    categoryLabel: 'Automatisation',
    description: 'Automatisation complète du tunnel de vente et de gestion des clients avec n8n et CRM pour une agence immobilière à Abidjan (Cocody), réduisant de 80% le temps de réponse aux clients.',
    image: '/images/products/automation.png',
    tags: ['n8n', 'Make', 'Zapier', 'CRM Hubspot'],
    badge: 'Automatisation',
    featured: false,
    link: '#',
  },
  {
    id: 'proj_007',
    title: 'Campagne SEO Locale Clinique Médicale Cocody',
    category: 'seo-marketing',
    categoryLabel: 'SEO & Visibilité Google',
    description: 'Optimisation SEO complète et référencement Google Maps (Fiche Établissement) pour un groupe médical à Abidjan, augmentant les appels et visites physiques en clinique de 150% en 4 mois.',
    image: '/images/products/seo-audit.png',
    tags: ['SEO Technique', 'Google Maps', 'Marketing de Contenu'],
    badge: 'SEO',
    featured: false,
    link: '#',
  },
  {
    id: 'proj_008',
    title: 'Plateforme E-learning & Formations Digitales',
    category: 'ecommerce',
    categoryLabel: 'E-learning',
    description: 'Création d\'un portail d\'apprentissage en ligne proposant des cours vidéo et des ressources téléchargeables, optimisé pour les paiements locaux en Afrique de l\'Ouest.',
    image: '/images/products/formation.png',
    tags: ['React', 'Next.js', 'Vimeo API', 'Paiement Mobile'],
    badge: 'Formation',
    featured: false,
    link: '#',
  },
  {
    id: 'proj_009',
    title: 'Gestion de Communauté & Social Media',
    category: 'seo-marketing',
    categoryLabel: 'Community Management',
    description: 'Stratégie de contenu de marque et gestion des réseaux sociaux (Facebook, TikTok, Instagram) pour une marque de cosmétiques ivoirienne, générant +50K abonnés qualifiés.',
    image: '/images/products/community.png',
    tags: ['Création Visuelle', 'TikTok Ads', 'Meta Ads'],
    badge: 'Social Media',
    featured: false,
    link: '#',
  },
];
