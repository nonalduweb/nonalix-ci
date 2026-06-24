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
    image: '/images/products/portfolio/globalbuildingsarl.png',
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
    image: '/images/products/portfolio/blackwolfcnc.png',
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
    image: '/images/products/portfolio/globalbuildingltd.png',
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

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  sector: 'immobilier' | 'ecommerce' | 'services' | 'education' | 'sante';
  sectorLabel: string;
  description: string;
  image: string;
  featured: boolean;
  metrics: {
    value: string;
    label: string;
  }[];
  solutions: string[];
  link: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'case_001',
    title: 'AFRICA IMMO+',
    subtitle: 'Plateforme + Agent IA',
    sector: 'immobilier',
    sectorLabel: 'Immobilier',
    description: 'Plateforme immobilière avec automatisation des leads, qualification des demandes et prise de rendez-vous.',
    image: '/images/products/automation.png',
    featured: false,
    metrics: [
      { value: '+178%', label: 'Leads qualifiés' },
      { value: '-62%', label: 'Coûts acquisition' },
      { value: '+230%', label: 'Rendez-vous' },
      { value: '24/7', label: 'Réponse IA' }
    ],
    solutions: [
      'Agent IA de qualification des demandes',
      'Automatisation WhatsApp et email',
      'Prise de rendez-vous intelligente',
      'Dashboard de suivi commercial'
    ],
    link: '#'
  },
  {
    id: 'case_002',
    title: 'SOUND LIGHT PRO',
    subtitle: 'E-commerce B2B/B2C',
    sector: 'ecommerce',
    sectorLabel: 'E-commerce',
    description: 'Solution e-commerce B2B/B2C avec devis automatisés, paiement en ligne, espace client et suivi intelligent.',
    image: '/images/products/portfolio/sound_light_pro.png',
    featured: true,
    metrics: [
      { value: '+312%', label: 'Ventes en ligne' },
      { value: '+85%', label: 'Panier moyen' },
      { value: '-70%', label: 'Tâches manuelles' },
      { value: '+24h', label: 'Productivité' }
    ],
    solutions: [
      'Génération automatique de devis',
      'Paiement en ligne et relances',
      'Dashboard administrateur',
      'Automatisation du parcours client'
    ],
    link: '#'
  },
  {
    id: 'case_003',
    title: 'BTP SOLUTIONS CI',
    subtitle: 'Leads B2B automatisés',
    sector: 'services',
    sectorLabel: 'Services',
    description: 'Génération de leads B2B automatisée via IA, campagnes intelligentes et suivi commercial en temps réel.',
    image: '/images/products/portfolio/btp_solutions.png',
    featured: false,
    metrics: [
      { value: '+241%', label: 'Leads B2B' },
      { value: '+190%', label: 'Conversions' },
      { value: '-80%', label: 'Temps de suivi' },
      { value: '+65%', label: 'CA généré' }
    ],
    solutions: [
      'Agent IA commercial',
      'CRM intelligent et relances',
      'Scoring automatique des prospects',
      'Reporting de performance'
    ],
    link: '#'
  }
];

