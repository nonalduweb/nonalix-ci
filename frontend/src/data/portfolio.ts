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
    image: '/images/portfolio/globalbuildingsarl.png',
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
    image: '/images/portfolio/blackwolfcnc.png',
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
    image: '/images/portfolio/globalbuildingltd.png',
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
    image: '/images/portfolio/chatbot-whatsapp-ui.svg',
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
    image: '/images/portfolio/automation-n8n-workflow.svg',
    tags: ['n8n', 'Make', 'Zapier', 'CRM Hubspot'],
    badge: 'Automatisation',
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
    image: '/images/portfolio/sound-light-pro.png',
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
    image: '/images/portfolio/btp-solutions.png',
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

