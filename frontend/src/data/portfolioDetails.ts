// NONALIX CI — Données enrichies du Portfolio pour les pages de détails (Abidjan, Côte d'Ivoire)

export interface PortfolioDetailContent {
  slug: string;
  badge: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  client: string;
  sector: string;
  duration: string;
  websiteUrl: string;
  image: string;
  overview: string;
  challenge: string;
  solution: string;
  results: string[];
  metrics: { value: string; label: string }[];
  solutions: string[];
  tags: string[];
  process: { step: number; title: string; description: string }[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    company: string;
  };
}

const portfolioDetails: Record<string, PortfolioDetailContent> = {
  'global-building-service': {
    slug: 'global-building-service',
    badge: '🏗️ BTP & Génie Civil',
    heroTitle: 'Une vitrine digitale imposante pour un leader du',
    heroHighlight: 'BTP en Côte d\'Ivoire',
    heroDescription: "Conception et développement d'un portail web sur-mesure pour Global Building Service SARL, mettant en valeur son expertise en grands travaux et sa rigueur technique auprès des partenaires nationaux et internationaux.",
    client: 'Global Building Service SARL',
    sector: 'Bâtiment et Travaux Publics (BTP)',
    duration: '5 semaines',
    websiteUrl: '#',
    image: '/images/portfolio/globalbuildingsarl.png',
    overview: "Global Building Service SARL est une entreprise ivoirienne de premier plan spécialisée dans la construction industrielle, le génie civil et les aménagements d'envergure. Dans le cadre de sa croissance, l'entreprise avait besoin d'asseoir sa crédibilité numérique auprès de grands donneurs d'ordres publics et privés.",
    challenge: "L'ancien site web ne reflétait pas la taille réelle de l'entreprise ni la complexité des chantiers réalisés. Il manquait un catalogue structuré et visuel des réalisations (photos de chantiers en cours, caractéristiques techniques), ainsi qu'un canal optimisé pour capter les demandes de devis complexes et les candidatures de sous-traitants.",
    solution: "Nous avons conçu une interface moderne, robuste et hautement visuelle. Développé en React pour le frontend et Laravel pour l'administration, le site bénéficie d'une vitesse d'affichage optimale sur mobile (essentielle pour les ingénieurs sur chantier). Nous avons structuré un catalogue interactif de réalisations classées par catégories (Génie Civil, Bâtiment, Voiries) et intégré un formulaire de demande de devis B2B étape par étape.",
    results: [
      "Augmentation de 120% des demandes de contact et devis qualifiés en 3 mois.",
      "Temps de chargement réduit à 1,2 seconde sur mobile (divisé par 4).",
      "Valorisation optimale des références chantiers auprès des ministères et promoteurs.",
      "Mise en place d'un espace de recrutement fluide pour les conducteurs de travaux et sous-traitants."
    ],
    metrics: [
      { value: '+120%', label: 'Demandes B2B' },
      { value: '< 1.2s', label: 'Temps chargement' },
      { value: '95%', label: 'Satisfaction client' }
    ],
    solutions: [
      "Design UI/UX premium et responsive",
      "Catalogue de chantiers avec filtres interactifs",
      "Formulaire d'estimation B2B dynamique",
      "Optimisation SEO locale (BTP Abidjan)"
    ],
    tags: ['React', 'Laravel', 'Tailwind CSS', 'SEO Local'],
    process: [
      { step: 1, title: "Immersion & Shooting", description: "Collecte des données sur les chantiers et définition de l'axe de communication technique." },
      { step: 2, title: "Design Figma", description: "Conception de maquettes haute fidélité avec des composants imposants inspirés du secteur industriel." },
      { step: 3, title: "Développement & API", description: "Codage du site avec Next.js/React et intégration du panneau d'administration pour la gestion autonome des projets." },
      { step: 4, title: "Mise en ligne & SEO", description: "Optimisation de la vitesse et référencement naturel pour être visible sur les recherches de chantiers en Côte d'Ivoire." }
    ],
    testimonial: {
      quote: "NONALIX CI a su capturer l'esprit de notre entreprise. Notre nouveau site web inspire la confiance et la solidité, ce qui est crucial dans notre domaine.",
      author: "M. Kouadio",
      role: "Directeur Technique",
      company: "Global Building Service SARL"
    }
  },

  'black-wolf-cnc': {
    slug: 'black-wolf-cnc',
    badge: '📸 Photographie & Reporting',
    heroTitle: 'Plateforme de livraison de médias sécurisée pour l\'industrie',
    heroHighlight: 'au Canada',
    heroDescription: "Conception d'une plateforme d'exposition et de reporting photo HD sécurisée pour une agence spécialisée dans le suivi de chantiers industriels au Canada.",
    client: 'Black Wolf CNC',
    sector: 'Production Médias & Reporting Industriel',
    duration: '6 semaines',
    websiteUrl: '#',
    image: '/images/portfolio/blackwolfcnc.png',
    overview: "Black Wolf CNC is une agence canadienne de pointe fournissant des services de reporting par l'image et de suivi de chantiers pour l'industrie minière et forestière. L'agence avait besoin d'une solution sur-mesure pour diffuser ses livrables.",
    challenge: "L'envoi de milliers de photos haute résolution et de rapports volumineux par des services comme Google Drive ou Dropbox manquait d'une image de marque professionnelle et ne permettait pas de proposer une navigation fluide et interactive pour les clients finaux.",
    solution: "Développement d'un portail web sur-mesure avec une interface sombre ultra-élégante mettant en valeur les clichés industriels. Nous avons intégré un espace membre sécurisé pour chaque client, un système de chargement paresseux des médias pour économiser la bande passante, et un outil automatisé de génération de rapports de chantiers au format PDF.",
    results: [
      "Automatisation de la livraison des photos (gain estimé de 8 heures par semaine pour l'équipe).",
      "Sécurisation complète de l'accès aux photos sensibles des chantiers miniers.",
      "Valorisation exceptionnelle du travail photographique grâce à une visionneuse interactive HD.",
      "Amélioration de la fidélisation des grands comptes grâce à une expérience utilisateur unique."
    ],
    metrics: [
      { value: '8h', label: 'Économisées par semaine' },
      { value: '100%', label: 'Accès sécurisés' },
      { value: '0', label: 'Fichiers perdus' }
    ],
    solutions: [
      "Espace client privé et sécurisé",
      "Visionneuse photo HD ultra-fluide",
      "Générateur automatique de rapports PDF",
      "Hébergement cloud hautement disponible"
    ],
    tags: ['React', 'Laravel', 'Tailwind CSS', 'Cloud Storage'],
    process: [
      { step: 1, title: "Analyse des flux", description: "Spécification de l'arborescence des fichiers et des niveaux de sécurité requis." },
      { step: 2, title: "Prototypage UX", description: "Design d'une galerie interactive épurée, centrée sur la clarté et la rapidité d'affichage." },
      { step: 3, title: "Développement", description: "Intégration React et configuration du stockage sécurisé des fichiers." },
      { step: 4, title: "Optimisations", description: "Implémentation d'algorithmes de compression d'images à la volée pour un affichage rapide." }
    ],
    testimonial: {
      quote: "Nos clients sont impressionnés par la qualité et la rapidité de la plateforme. Cela nous démarque totalement de nos concurrents traditionnels.",
      author: "J. Tremblay",
      role: "Fondateur",
      company: "Black Wolf CNC"
    }
  },

  'global-building-ltd': {
    slug: 'global-building-ltd',
    badge: '🛡️ Sécurité & Décontamination',
    heroTitle: 'Site vitrine B2B optimisé conversion pour le',
    heroHighlight: 'marché canadien',
    heroDescription: "Création d'un site web institutionnel à haute conversion pour une entreprise canadienne spécialisée dans le retrait d'amiante et la décontamination.",
    client: 'Global Building Ltd',
    sector: 'Sécurité Environnementale & Décontamination',
    duration: '4 semaines',
    websiteUrl: '#',
    image: '/images/portfolio/globalbuildingltd.png',
    overview: "Global Building Ltd opère dans le secteur délicat et très réglementé du désamiantage et de la décontamination après sinistre au Canada. L'entreprise cherchait à capter de nouveaux contrats auprès de gestionnaires de parcs immobiliers et de particuliers.",
    challenge: "Le secteur exige d'inspirer une confiance absolue au premier regard. Le site précédent était obsolète et ne permettait pas de soumettre facilement des demandes d'évaluation, ce qui nuisait à l'acquisition de leads digitaux.",
    solution: "Conception d'une interface épurée, rassurante et professionnelle mettant en avant les certifications environnementales et de sécurité. Intégration d'un estimateur de coût en ligne interactif en 3 étapes et mise en place d'une structure SEO technique ultra-performante pour se positionner localement sur Google Canada.",
    results: [
      "Augmentation de 45% du volume des demandes d'estimation en ligne.",
      "Score Google Lighthouse supérieur à 90 en performance mobile.",
      "Clarification complète de l'offre et du protocole de sécurité de l'entreprise.",
      "Diminution du taux de rebond de 55% grâce à une navigation intuitive."
    ],
    metrics: [
      { value: '+45%', label: 'Demandes d\'estimations' },
      { value: '92/100', label: 'Score Lighthouse Mobile' },
      { value: '-55%', label: 'Taux de rebond' }
    ],
    solutions: [
      "Design UI/UX professionnel et sécurisant",
      "Estimateur de devis en ligne intuitif",
      "Optimisation SEO local Canada",
      "Conformité accessibilité et RGPD"
    ],
    tags: ['React', 'Laravel', 'Tailwind CSS', 'SEO Canada'],
    process: [
      { step: 1, title: "Étude sectorielle", description: "Analyse des exigences légales et des attentes des assureurs et gestionnaires." },
      { step: 2, title: "Copywriting & structure", description: "Rédaction des contenus axée sur la transparence et la rassurance." },
      { step: 3, title: "Intégration", description: "Développement propre et léger pour assurer une réactivité instantanée." },
      { step: 4, title: "Lancement", description: "Indexation SEO accélérée et configuration des tags de conversion Google Ads." }
    ],
    testimonial: {
      quote: "NONALIX CI a livré un site qui répond parfaitement à nos exigences réglementaires tout en étant une formidable machine à leads.",
      author: "A. Roy",
      role: "Directeur des Opérations",
      company: "Global Building Ltd"
    }
  },

  'afrishop': {
    slug: 'afrishop',
    badge: '🛍️ E-commerce local',
    heroTitle: 'Plateforme e-commerce optimisée avec paiements',
    heroHighlight: 'Mobile Money ivoiriens',
    heroDescription: "Développement d'un modèle d'e-commerce ultra-rapide intégrant les modes de paiement locaux (Wave, Orange Money, MTN MoMo) et un module logistique spécifique à Abidjan.",
    client: 'AfriShop (Projet Interne)',
    sector: 'E-commerce & Retail local',
    duration: '6 semaines',
    websiteUrl: '#',
    image: '/images/products/ecommerce-site.png',
    overview: "AfriShop est notre démonstrateur technique conçu pour lever les barrières de la vente en ligne en Afrique de l'Ouest. Il montre comment marier des technologies web modernes avec les usages de paiement locaux sans dépendre de solutions tierces occidentales complexes.",
    challenge: "Les solutions classiques comme Shopify souffrent d'un manque d'intégration native des paiements Wave/Orange/MTN sans passer par des passerelles coûteuses. De plus, les tunnels d'achat occidentaux comportant trop d'étapes (codes postaux, adresses complexes) découragent les acheteurs locaux habitués à commander directement par WhatsApp.",
    solution: "Nous avons conçu une architecture Next.js légère et mobile-first reliée directement aux API de paiement Wave et agrégateurs Mobile Money. Le tunnel d'achat a été repensé : l'utilisateur choisit simplement sa commune d'Abidjan (avec calcul automatique des frais de livraison en moto-taxi) et valide son panier. Il peut également finaliser sa commande en un clic via WhatsApp.",
    results: [
      "Paiement Mobile Money direct et sécurisé en moins de 15 secondes.",
      "Frais de transaction réduits au strict minimum des opérateurs locaux (pas de frais de plateforme additionnels).",
      "Amélioration de 60% du taux de complétion des paniers par rapport à une boutique classique.",
      "Alertes automatiques par SMS et WhatsApp lors du changement de statut de livraison."
    ],
    metrics: [
      { value: '3 clics', label: 'Pour commander' },
      { value: '+60%', label: 'Paniers validés' },
      { value: '100%', label: 'Mobile Money direct' }
    ],
    solutions: [
      "Intégration directe Wave, Orange Money et MTN MoMo",
      "Calculateur de livraison par commune d'Abidjan",
      "Commande ultra-rapide One-Click WhatsApp",
      "Système de notifications SMS client"
    ],
    tags: ['Next.js', 'PostgreSQL', 'Wave API', 'Orange Money API'],
    process: [
      { step: 1, title: "Simplification UX", description: "Suppression des champs inutiles (ex: code postal) et focus sur le numéro de téléphone." },
      { step: 2, title: "Raccordement API", description: "Développement des Webhooks de paiement pour automatiser la validation des commandes." },
      { step: 3, title: "Module livraison", description: "Modélisation des zones de livraison d'Abidjan et intégration des tarifs transporteurs." },
      { step: 4, title: "Lancement", description: "Bêta-tests des paiements réels avec des cartes SIM de test locales." }
    ],
    testimonial: {
      quote: "Une véritable révolution pour le commerce ivoirien. Les commandes tombent directement validées avec leur paiement mobile, sans appels de confirmation interminables.",
      author: "K. Traoré",
      role: "Consultant E-commerce",
      company: "AfriShop Demo"
    }
  },

  'chatbot-ia-whatsapp': {
    slug: 'chatbot-ia-whatsapp',
    badge: '🤖 IA conversationnelle',
    heroTitle: 'Agent conversationnel IA intelligent sur WhatsApp supportant le',
    heroHighlight: 'français et le nouchi',
    heroDescription: "Déploiement d'un chatbot basé sur le modèle GPT pour automatiser les ventes, répondre aux questions récurrentes et qualifier les clients 24h/24 en Côte d'Ivoire.",
    client: 'Multi-clients (E-commerce / Immobilier)',
    sector: 'Intelligence Artificielle & Service Client',
    websiteUrl: '#',
    duration: '3 semaines',
    image: '/images/portfolio/chatbot-whatsapp-ui.svg',
    overview: "En Côte d'Ivoire, WhatsApp est le canal commercial numéro un. Les entreprises reçoivent un flot constant de messages mais peinent à y répondre instantanément, ce qui nuit à l'expérience client et réduit considérablement l'efficacité des ventes.",
    challenge: "Les chatbots classiques basés sur des règles rigides (appuyez sur 1, appuyez sur 2) frustrent les utilisateurs. Les clients s'expriment de manière naturelle, en utilisant des expressions locales et de l'argot (nouchi). Le bot devait être capable de comprendre ce langage et de répondre avec précision sur les stocks, les prix et la localisation.",
    solution: "Développement d'un agent IA conversationnel propulsé par FastAPI et l'API OpenAI. Nous l'avons entraîné avec un prompt system localisé et des bases de connaissances spécifiques (catalogue produit, FAQ de l'entreprise). Le chatbot est connecté à l'API officielle WhatsApp Cloud. Il qualifie les prospects et peut transférer les cas complexes à des agents humains sur Slack ou WhatsApp.",
    results: [
      "Temps de réponse moyen réduit de 2 heures à moins de 5 secondes.",
      "100% des leads qualifiés automatiquement pendant la nuit.",
      "Réduction de 70% de la charge de travail du service client.",
      "Augmentation de 30% des ventes grâce à une réactivité immédiate."
    ],
    metrics: [
      { value: '< 5s', label: 'Temps de réponse' },
      { value: '-70%', label: 'Charge support client' },
      { value: '+30%', label: 'Ventes conclues' }
    ],
    solutions: [
      "Entraînement IA avec jargon local (Nouchi)",
      "Intégration officielle WhatsApp Cloud API",
      "Passerelle Slack pour agents humains",
      "Base de connaissances dynamique (FAQ/Prix)"
    ],
    tags: ['FastAPI', 'OpenAI API', 'WhatsApp Cloud API', 'Python'],
    process: [
      { step: 1, title: "Construction du savoir", description: "Modélisation de la base de connaissances et définition des limites de l'IA." },
      { step: 2, title: "Développement API", description: "Déploiement du serveur webhook pour traiter les requêtes WhatsApp entrantes." },
      { step: 3, title: "Entraînement linguistique", description: "Configuration du modèle pour comprendre le français familier et l'argot local." },
      { step: 4, title: "Lancement", description: "Mise en service en mode supervisé pour analyser et corriger les premières interactions." }
    ],
    testimonial: {
      quote: "L'IA gère la majorité des questions de routine. Mon équipe se concentre uniquement sur la finalisation des livraisons chantiers et les gros clients.",
      author: "F. Diabaté",
      role: "Gérante",
      company: "Boutique Mode Abidjan"
    }
  },

  'automatisation-processus-crm': {
    slug: 'automatisation-processus-crm',
    badge: '⚙️ Productivité & n8n',
    heroTitle: 'Workflows d\'automatisation n8n et CRM pour une agence',
    heroHighlight: 'immobilière à Cocody',
    heroDescription: "Mise en place d'un système d'automatisation connectant Facebook Ads, WhatsApp Business et HubSpot CRM pour réduire le temps de réponse commercial à moins de 2 minutes.",
    client: 'Agence Immobilière de Prestige',
    sector: 'Immobilier de Luxe (Cocody)',
    duration: '4 semaines',
    websiteUrl: '#',
    image: '/images/portfolio/automation-n8n-workflow.svg',
    overview: "Une agence immobilière située à Abidjan Cocody génère des leads via des campagnes publicitaires Facebook Ads. Cependant, le traitement manuel de ces leads (téléchargement Excel, saisie CRM, attribution aux commerciaux) ralentissait considérablement la réactivité.",
    challenge: "Les leads immobiliers refroidissent très vite. Si un prospect n'est pas contacté dans les 15 minutes, la probabilité de caler une visite est divisée par 10. L'équipe passait 3 heures par jour sur des tâches administratives répétitives à faible valeur ajoutée.",
    solution: "Nous avons mis en place une instance n8n sécurisée et configuré des flux automatisés. Dès qu'un prospect valide un formulaire publicitaire : son profil est créé dans HubSpot, un commercial est notifié sur Slack avec un lien direct, et un message de bienvenue personnalisé WhatsApp contenant le catalogue PDF de la promotion immobilière est envoyé instantanément.",
    results: [
      "Temps de prise de contact prospect passé de 24 heures à 2 minutes.",
      "80 heures de travail administratif économisées chaque mois.",
      "Taux de conversion leads en visites physiques amélioré de 50%.",
      "Élimination complète des oublis de relance de prospects."
    ],
    metrics: [
      { value: '2 min', label: 'Délai de contact' },
      { value: '80h', label: 'Économisées par mois' },
      { value: '+50%', label: 'Visites bookées' }
    ],
    solutions: [
      "Déploiement de serveurs n8n sécurisés",
      "Intégration bidirectionnelle Facebook Ads & HubSpot",
      "Notifications et alertes d'action Slack",
      "Relances multicanaux automatiques"
    ],
    tags: ['n8n', 'HubSpot CRM', 'Make / Zapier', 'Slack API'],
    process: [
      { step: 1, title: "Audit des workflows", description: "Analyse du parcours client et détection des goulets d'étranglement de saisie." },
      { step: 2, title: "Modélisation n8n", description: "Conception des scénarios d'intégration de données avec gestion des erreurs." },
      { step: 3, title: "Optimisation CRM", description: "Structuration des pipelines HubSpot et création des champs personnalisés." },
      { step: 4, title: "Déploiement & Tests", description: "Simulations de leads réels et ajustement du système d'attribution aux commerciaux." }
    ],
    testimonial: {
      quote: "Nous ne perdons plus aucun client en route. Le système attribue automatiquement les fiches et envoie les fiches techniques de suite.",
      author: "A. Diallo",
      role: "Directrice Générale",
      company: "Prestige Immo CI"
    }
  },

  'africa-immo': {
    slug: 'africa-immo',
    badge: '🏢 Case Study : Immo & IA',
    heroTitle: 'Comment AFRICA IMMO+ a multiplié par 2,7 ses leads',
    heroHighlight: 'qualifiés immobiliers grâce à l\'IA',
    heroDescription: "Étude de cas détaillée sur le déploiement d'un agent de qualification IA connecté à une plateforme web Next.js pour un promoteur immobilier à Bingerville.",
    client: 'AFRICA IMMO+',
    sector: 'Promotion Immobilière',
    duration: '2 mois',
    websiteUrl: '#',
    image: '/images/products/automation.png',
    overview: "AFRICA IMMO+ est un promoteur immobilier ivoirien vendant des duplex et appartements de standing à Bingerville et Grand-Bassam. Face à l'afflux de demandes sur les réseaux sociaux, leur équipe commerciale passait plus de temps à répondre à des curieux qu'à faire visiter des clients solvables.",
    challenge: "Filtrer les centaines de demandes quotidiennes pour extraire les acheteurs réels (ceux disposant d'un apport personnel ou d'un accord de prêt bancaire). Les commerciaux passaient à côté de clients sérieux par manque de réactivité.",
    solution: "NONALIX CI a développé une plateforme vitrine moderne en Next.js affichant les programmes immobiliers de façon immersive. Surtout, nous avons intégré un agent conversationnel IA WhatsApp connecté au CRM. L'IA engage la discussion, présente la brochure, pose des questions discrètes sur le budget et le mode de financement, puis propose automatiquement une réservation de visite aux prospects qualifiés.",
    results: [
      "Augmentation de 178% des dossiers de financement finalisés transmis à l'équipe.",
      "Coûts d'acquisition par lead qualifié réduits de 62% grâce à l'automatisation des relances.",
      "Saisie automatique de 100% des prospects dans le CRM, sans aucune perte de données.",
      "Des commerciaux concentrés à 100% sur la négociation et les visites physiques qualifiées."
    ],
    metrics: [
      { value: '+178%', label: 'Leads qualifiés' },
      { value: '-62%', label: 'Coût acquisition' },
      { value: '230%', label: 'Visites utiles' }
    ],
    solutions: [
      "Plateforme web Next.js ultra-rapide",
      "Agent IA de pré-qualification WhatsApp",
      "Prise de rendez-vous intelligente synchronisée",
      "Intégration CRM avec relance automatique"
    ],
    tags: ['Next.js', 'FastAPI', 'OpenAI API', 'CRM Integration'],
    process: [
      { step: 1, title: "Audit & Stratégie", description: "Définition des critères financiers éliminatoires et modélisation du dialogue de l'IA." },
      { step: 2, title: "Création Plateforme", description: "Design et développement de la plateforme web immobilière avec Next.js." },
      { step: 3, title: "Configuration IA", description: "Programmation du chatbot et raccordement à la base de connaissances des appartements." },
      { step: 4, title: "Lancement & Suivi", description: "Mise en service et monitoring continu pour optimiser le taux de qualification." }
    ],
    testimonial: {
      quote: "L'IA fait le travail de tri en amont. Nos commerciaux rencontrent désormais des acheteurs qui ont le budget validé. Notre taux de vente a explosé.",
      author: "M. Bakayoko",
      role: "Directeur Commercial",
      company: "AFRICA IMMO+"
    }
  },

  'sound-light-pro': {
    slug: 'sound-light-pro',
    badge: '🔊 Case Study : E-commerce B2B',
    heroTitle: 'SOUND LIGHT PRO : Automatisation des devis proforma et',
    heroHighlight: 'croissance e-commerce de 312%',
    heroDescription: "Étude de cas sur la mise en place d'une plateforme de commerce en ligne haut de gamme avec générateur automatique de devis et paiements locaux.",
    client: 'SOUND LIGHT PRO',
    sector: 'Importation Audiovisuelle & Événementiel',
    duration: '7 semaines',
    websiteUrl: '#',
    image: '/images/portfolio/sound-light-pro.png',
    overview: "SOUND LIGHT PRO importe et distribue du matériel de sonorisation et d'éclairage professionnel à Abidjan. Ils s'adressent à une clientèle mixte : des particuliers achetant des accessoires et des structures (B2B, églises, mairies) commandant des installations complexes nécessitant des devis proforma.",
    challenge: "La gestion manuelle des demandes de proforma par téléphone et email prenait un temps considérable à l'équipe commerciale, retardant la signature des contrats. De plus, il n'existait aucun canal pour acheter directement en ligne via Mobile Money.",
    solution: "Nous avons conçu une boutique e-commerce hybride sur-mesure. L'utilisateur peut ajouter des articles au panier et choisir de payer directement (Wave, Orange, MTN) ou de générer instantanément un devis proforma officiel au format PDF signé numériquement par l'entreprise. L'interface offre un design sombre très irréprochable.",
    results: [
      "Hausse de 312% du chiffre d'affaires généré en ligne en 6 mois.",
      "Économie de 14 heures de travail administratif par semaine sur la saisie de factures.",
      "Panier moyen augmenté de 85% grâce à la clarté de l'offre et aux options de paiement fluides.",
      "Amélioration drastique du service client avec un espace membre affichant le suivi de commande."
    ],
    metrics: [
      { value: '+312%', label: 'Ventes en ligne' },
      { value: '+85%', label: 'Panier moyen' },
      { value: '-70%', label: 'Tâches manuelles' }
    ],
    solutions: [
      "Boutique en ligne Next.js premium",
      "Générateur automatique de devis proforma PDF",
      "Agrégateur de paiement Mobile Money local",
      "Dashboard de gestion des stocks et commandes"
    ],
    tags: ['Next.js', 'PostgreSQL', 'PDF Engine', 'Mobile Money'],
    process: [
      { step: 1, title: "Analyse comptable", description: "Alignement du modèle de devis PDF avec les exigences fiscales ivoiriennes." },
      { step: 2, title: "Design Immersif", description: "Création d'un thème sombre et moderne valorisant les produits haut de gamme." },
      { step: 3, title: "Intégration technique", description: "Développement du panier, du moteur de génération PDF et des webhooks de paiement." },
      { step: 4, title: "Lancement", description: "Mise en service, tests d'achat réels et formation du personnel comptable." }
    ],
    testimonial: {
      quote: "Générer un devis proforma officiel en 1 clic a changé la donne pour nos clients professionnels. Les ventes se font beaucoup plus rapidement.",
      author: "E. Konan",
      role: "Responsable Logistique",
      company: "SOUND LIGHT PRO"
    }
  },

  'btp-solutions-ci': {
    slug: 'btp-solutions-ci',
    badge: '🚜 Case Study : Leads B2B & IA',
    heroTitle: 'BTP SOLUTIONS CI : 241% de leads qualifiés en plus sur la',
    heroHighlight: 'location d\'engins lourds',
    heroDescription: "Comment une entreprise de services BTP a automatisé son processus de prospection et de qualification commerciale par IA et CRM à Abidjan.",
    client: 'BTP SOLUTIONS CI',
    sector: 'Location d\'Engins de Chantier',
    duration: '5 semaines',
    websiteUrl: '#',
    image: '/images/portfolio/btp-solutions.png',
    overview: "BTP SOLUTIONS CI loue des pelleteuses, bulldozers et camions de chantier aux entreprises de construction en Côte d'Ivoire. Trouver les décideurs de chantiers au bon moment est un défi commercial de taille.",
    challenge: "Les commerciaux passaient leurs journées à téléphoner au hasard ou à visiter des chantiers sans connaître les décideurs. Le taux d'inactivité commerciale était élevé, et les opportunités de location à court terme étaient souvent manquées.",
    solution: "Mise en place d'un tunnel de prospection automatique. Nous diffusons des publicités très ciblées sur LinkedIn et Facebook à destination des conducteurs de travaux. Dès qu'un lead exprime un intérêt, un workflow n8n déclenche un agent IA commercial sur WhatsApp qui valide la disponibilité requise, le lieu du chantier et le budget, puis réserve un appel téléphonique dans l'agenda du directeur.",
    results: [
      "Augmentation de 241% du nombre de leads B2B qualifiés par mois.",
      "Réduction de 80% du temps de traitement manuel et de relance par l'équipe.",
      "Hausse de 65% du chiffre d'affaires de la division location d'engins en 4 mois.",
      "Suivi parfait de la rentabilité des campagnes grâce au tableau de bord commercial."
    ],
    metrics: [
      { value: '+241%', label: 'Leads B2B' },
      { value: '-80%', label: 'Temps de suivi' },
      { value: '+65%', label: 'CA Location' }
    ],
    solutions: [
      "Tunnel de leads publicitaire ciblé LinkedIn/Meta",
      "Agent IA commercial de qualification technique",
      "Prise de rendez-vous de visite de chantier",
      "Pipeline commercial automatisé"
    ],
    tags: ['n8n Automation', 'FastAPI', 'CRM HubSpot', 'Lead Generation'],
    process: [
      { step: 1, title: "Cible & Stratégie", description: "Cartographie des profils décisionnels dans le secteur de la construction ivoirienne." },
      { step: 2, title: "Publicités ciblées", description: "Lancement des campagnes publicitaires axées sur la réactivité de la flotte." },
      { step: 3, title: "Développement IA", description: "Configuration du bot WhatsApp pour comprendre le vocabulaire technique du bâtiment." },
      { step: 4, title: "Interconnexion", description: "Raccordement des flux à HubSpot et formation du directeur commercial aux relances." }
    ],
    testimonial: {
      quote: "L'IA nous apporte des leads pré-qualifiés directement sur notre téléphone. Nous signons des contrats de location de grues et pelleteuses en un temps record.",
      author: "Y. Sidibé",
      role: "Directeur Commercial",
      company: "BTP SOLUTIONS CI"
    }
  }
};

export default portfolioDetails;
