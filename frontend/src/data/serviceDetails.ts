// Rich content for each service detail page, optimized for Côte d'Ivoire
// Used by [slug]/page.tsx to render the full service page

export interface ServiceDetailContent {
  slug: string;
  badge: string;
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  features: { icon: string; title: string; description: string }[];
  process: { step: number; title: string; description: string }[];
  stats: { value: string; label: string }[];
  faq: { question: string; answer: string }[];
  ctaTitle: string;
  ctaDescription: string;
}

const serviceDetails: Record<string, ServiceDetailContent> = {
  'design-web-ui-ux': {
    slug: 'design-web-ui-ux',
    badge: '🎨 Design Premium',
    heroTitle: 'Un design web qui',
    heroHighlight: 'convertit vos visiteurs en clients',
    heroDescription: "À l'ère du mobile-first, la grande majorité des internautes naviguent sur smartphone. Nos designs UI/UX sont pensés mobile-first pour capter l'attention de vos clients dès la première seconde et les guider naturellement vers l'achat.",
    features: [
      { icon: 'layout', title: 'Maquettes sur-mesure', description: "Design unique adapté à votre identité de marque et aux goûts de votre marché cible. Pas de templates génériques." },
      { icon: 'smartphone', title: 'Mobile-First', description: "Chaque pixel est optimisé pour les écrans de smartphones les plus utilisés (Samsung, iPhone, Tecno, Infinix, etc.)." },
      { icon: 'figma', title: 'Prototypes interactifs', description: "Visualisez et testez votre site avant le développement. Validez chaque écran avec votre équipe en temps réel." },
      { icon: 'zap', title: 'UX optimisé conversions', description: "Parcours utilisateur étudié pour maximiser les demandes de devis, appels WhatsApp et achats en ligne." },
      { icon: 'palette', title: 'Charte graphique cohérente', description: "Couleurs, typographies et composants réutilisables pour une image professionnelle sur tous vos supports." },
      { icon: 'refresh', title: 'Itérations illimitées', description: "On retravaille les maquettes jusqu'à votre satisfaction totale. Votre vision, notre expertise." }
    ],
    process: [
      { step: 1, title: 'Brief créatif', description: "On échange sur WhatsApp, en visioconférence ou en personne pour comprendre votre marque, vos objectifs et votre clientèle cible." },
      { step: 2, title: 'Recherche & Moodboard', description: "Analyse de vos concurrents locaux et internationaux, création d'un moodboard visuel pour valider la direction artistique." },
      { step: 3, title: 'Design & Prototypage', description: "Création des maquettes haute fidélité sur Figma avec prototype interactif que vous pouvez tester sur votre téléphone." },
      { step: 4, title: 'Livraison & Handoff', description: "Fichiers source complets, guide de style et handoff développeur pour une intégration pixel-perfect." }
    ],
    stats: [
      { value: '+150', label: 'Maquettes livrées' },
      { value: '98%', label: 'Satisfaction client' },
      { value: '3x', label: 'Taux de conversion moyen' },
      { value: '48h', label: 'Première proposition' }
    ],
    faq: [
      { question: "Combien de temps faut-il pour réaliser un design complet ?", answer: "En général, 5 à 10 jours ouvrables selon la complexité du projet. Un site vitrine simple peut être maquetté en 3-5 jours, tandis qu'une plateforme e-commerce nécessite 7-14 jours." },
      { question: "Est-ce que je peux demander des modifications ?", answer: "Absolument ! Nos formules incluent des révisions illimitées. On retravaille jusqu'à ce que vous soyez 100% satisfait du résultat." },
      { question: "Quel outil utilisez-vous pour le design ?", answer: "Nous travaillons principalement sur Figma, un outil professionnel qui vous permet de visualiser et commenter les maquettes en temps réel depuis votre navigateur." },
      { question: "Le design sera-t-il adapté aux mobiles ?", answer: "Oui, c'est notre priorité absolue. La grande majorité du trafic web mondial provient du mobile. Chaque design est pensé et testé mobile-first." }
    ],
    ctaTitle: "Prêt à avoir un site qui impressionne vos clients ?",
    ctaDescription: "Discutons de votre projet et recevez une première maquette en 48h."
  },

  'developpement-web': {
    slug: 'developpement-web',
    badge: '💻 Développement',
    heroTitle: 'Des sites web ultra-rapides',
    heroHighlight: 'même sur la 3G ivoirienne',
    heroDescription: "Nous développons des sites web modernes en Next.js qui se chargent en moins de 2 secondes, même sur les connexions mobiles courantes. Performance, sécurité et SEO intégrés dès la base.",
    features: [
      { icon: 'code', title: 'Next.js & React', description: "Technologies modernes utilisées par Google, Netflix et Jumia. Votre site bénéficie des mêmes standards de qualité." },
      { icon: 'zap', title: 'Chargement ultra-rapide', description: "Optimisation du poids des pages pour économiser la data de vos utilisateurs et se charger en un clin d'œil." },
      { icon: 'shield', title: 'Sécurité renforcée', description: "Protection HTTPS, headers de sécurité et mises à jour régulières contre les cyberattaques." },
      { icon: 'database', title: 'Admin intuitif', description: "Mettez à jour vos contenus, produits et images en toute autonomie depuis un tableau de bord simple." },
      { icon: 'globe', title: 'SEO intégré', description: "Chaque page est optimisée pour les moteurs de recherche dès le développement. Pas besoin de refaire le travail après." },
      { icon: 'server', title: 'Hébergement fiable', description: "Serveurs performants avec uptime 99.9%, CDN mondial pour un accès ultra-rapide partout dans le monde." }
    ],
    process: [
      { step: 1, title: 'Cahier des charges', description: "Définition précise de vos besoins, fonctionnalités et objectifs business." },
      { step: 2, title: 'Design & Validation', description: "Maquettes interactives validées par votre équipe avant toute ligne de code." },
      { step: 3, title: 'Développement', description: "Développement itératif avec démos régulières. Vous voyez l'avancement chaque semaine." },
      { step: 4, title: 'Tests & Lancement', description: "Tests complets sur mobile, SEO et performance avant la mise en ligne. Formation de votre équipe incluse." }
    ],
    stats: [
      { value: '+80', label: 'Sites développés' },
      { value: '<2s', label: 'Temps de chargement' },
      { value: '99.9%', label: 'Uptime garanti' },
      { value: 'A+', label: 'Score sécurité' }
    ],
    faq: [
      { question: "Pourquoi Next.js plutôt que WordPress ?", answer: "Next.js est 5 à 10 fois plus rapide que WordPress, ce qui est crucial sur les réseaux mobiles parfois lents et permet d'économiser la data des utilisateurs. De plus, il offre une sécurité bien supérieure et un meilleur référencement Google." },
      { question: "Combien coûte un site web ?", answer: "Un site vitrine démarre à partir de 530 € / 350 000 FCFA, un site e-commerce à partir de 1 150 € / 750 000 FCFA. Contactez-nous pour un devis personnalisé." },
      { question: "Est-ce que je pourrai modifier mon site moi-même ?", answer: "Oui, nous intégrons un système d'administration simple et intuitif. Nous vous formons aussi à son utilisation." },
      { question: "Quel est le délai de livraison ?", answer: "Un site vitrine est généralement livré en 2-3 semaines. Un projet e-commerce complet prend 4-6 semaines." }
    ],
    ctaTitle: "Lancez votre site web performant dès aujourd'hui",
    ctaDescription: "Recevez un devis gratuit sous 24h et démarrez votre projet."
  },

  'automatisation-business': {
    slug: 'automatisation-business',
    badge: 'Automatisation',
    heroTitle: 'Automatisez votre business,',
    heroHighlight: 'modernisez votre croissance',
    heroDescription: "Nous concevons des tunnels de vente (funnels) performants, des systèmes de conversion intelligents et des automatisations marketing pour structurer votre business et multiplier vos revenus de manière autonome, où que vous soyez.",
    features: [
      { icon: 'layout', title: 'Funnels de vente', description: "Création de tunnels complets (pages de capture, pages de vente, formulaires, tunnels de checkout) optimisés pour la conversion." },
      { icon: 'mail', title: 'Relances automatiques', description: "Séquences d'emails et de SMS automatiques pour relancer vos prospects et maximiser vos ventes sans intervention manuelle." },
      { icon: 'zap', title: 'Intégrations No-Code', description: "Connexion de tous vos outils digitaux (CRM HubSpot, ActiveCampaign, bases de données) avec n8n, Make ou Zapier." },
      { icon: 'credit-card', title: 'Paiements multicanaux', description: "Intégration de Stripe, PayPal et des solutions Mobile Money (Orange Money, Wave, MTN) pour permettre à tous vos clients de payer en toute simplicité." },
      { icon: 'cpu', title: 'Intelligence Artificielle', description: "Intégration d'agents conversationnels IA (holographiques, textuels) sur votre site et WhatsApp pour qualifier les prospects 24h/24." },
      { icon: 'bar-chart', title: 'Statistiques & KPI', description: "Suivi analytique en direct de vos taux de conversion, visites et chiffres d'affaires générés." }
    ],
    process: [
      { step: 1, title: 'Audit & Stratégie', description: "Analyse de votre business modèle, définition de votre offre et dessin de l'architecture de votre tunnel." },
      { step: 2, title: 'Copywriting & Design', description: "Rédaction persuasive orientée vente et design haut de gamme en mode sombre de vos pages de conversion." },
      { step: 3, title: 'Développement & Connexions', description: "Intégration technique des pages de vente, branchement des emails et configuration des webhooks de paiement locaux." },
      { step: 4, title: 'Lancement & Suivi', description: "Mise en ligne, tests réels et suivi analytique pour ajuster les performances et rentabiliser votre tunnel." }
    ],
    stats: [
      { value: '+200%', label: 'Augmentation des ventes' },
      { value: '0h', label: 'Tâches répétitives manuelles' },
      { value: '24h/7', label: 'Business actif non-stop' },
      { value: '100%', label: 'Autonomie de gestion' }
    ],
    faq: [
      { question: "Qu'est-ce qu'un tunnel de vente (funnel) ?", answer: "C'est une série de pages web stratégiquement ordonnées qui guident un visiteur qualifié vers une action précise (inscription à une newsletter, achat d'un produit/formation, réservation d'un appel)." },
      { question: "À qui s'adresse ce service ?", answer: "Ce service est idéal pour les coachs, formateurs, consultants, PME et infopreneurs basés en Afrique et à l'international qui souhaitent cesser de travailler manuellement et structurer leur croissance." },
      { question: "Quels outils utilisez-vous pour l'automatisation ?", answer: "Nous utilisons principalement n8n, Make et Zapier pour connecter vos applications, ainsi que des plateformes d'emailing comme ActiveCampaign, Brevo ou Mailchimp." },
      { question: "Est-il possible d'intégrer les paiements locaux (Mobile Money) et internationaux ?", answer: "Oui, nous intégrons nativement les Mobile Money (Orange, Wave, MTN) pour le marché africain, ainsi que Stripe ou PayPal pour l'international. Vos clients paient avec la méthode la plus adaptée." }
    ],
    ctaTitle: "Prêt à faire travailler l'automatisation pour vous ?",
    ctaDescription: "Planifiez un appel stratégique de 30 minutes et découvrez notre plan d'action personnalisé pour votre business."
  },

  'optimisation-seo': {
    slug: 'optimisation-seo',
    badge: '🔍 SEO',
    heroTitle: 'Dominez Google',
    heroHighlight: 'et votre marché cible',
    heroDescription: "Positionnez votre entreprise en tête des résultats de recherche Google locaux et nationaux. Attirez des milliers de visiteurs qualifiés chaque mois sans payer un franc de publicité.",
    features: [
      { icon: 'search', title: 'Audit SEO complet', description: "Analyse de +50 critères techniques, contenu et backlinks pour identifier toutes les opportunités de classement." },
      { icon: 'key', title: 'Mots-clés ciblés', description: "Recherche des termes les plus recherchés par vos clients potentiels sur vos zones cibles locales et internationales." },
      { icon: 'code', title: 'SEO technique', description: "Optimisation de la vitesse, structure HTML, balisage Schema.org et correction de toutes les erreurs techniques." },
      { icon: 'file-text', title: 'Contenu optimisé', description: "Rédaction d'articles de blog et pages de service optimisés pour vos mots-clés cibles." },
      { icon: 'link', title: 'Netlinking', description: "Stratégie d'acquisition de liens de qualité auprès de sites d'autorité francophones et internationaux." },
      { icon: 'bar-chart', title: 'Suivi mensuel', description: "Rapport détaillé chaque mois avec l'évolution de vos positions, trafic organique et recommandations." }
    ],
    process: [
      { step: 1, title: 'Audit initial', description: "Analyse complète de votre site et de vos concurrents sur les moteurs de recherche pour identifier les opportunités." },
      { step: 2, title: 'Stratégie SEO', description: "Définition des mots-clés prioritaires et plan d'action sur 6-12 mois." },
      { step: 3, title: 'Optimisation', description: "Corrections techniques, optimisation du contenu existant et création de nouvelles pages." },
      { step: 4, title: 'Suivi & Ajustement', description: "Monitoring continu des positions et ajustement de la stratégie selon les résultats." }
    ],
    stats: [
      { value: '+500%', label: 'Trafic moyen gagné' },
      { value: 'Top 3', label: 'Positions Google' },
      { value: '+50', label: 'Critères analysés' },
      { value: '6 mois', label: 'Résultats visibles' }
    ],
    faq: [
      { question: "Combien de temps faut-il pour voir des résultats en SEO ?", answer: "Le SEO est un investissement à moyen terme. Les premiers résultats apparaissent généralement entre 3 et 6 mois, avec une croissance continue sur 12 mois et au-delà." },
      { question: "Le SEO est-il efficace pour mon secteur ?", answer: "Absolument ! La majorité des décisions d'achat commencent par une recherche Google. Se positionner en tête sur des mots-clés stratégiques vous permet de capter des intentions d'achat en continu." },
      { question: "SEO ou publicité Google, que choisir ?", answer: "Le SEO génère du trafic gratuit et durable. La publicité donne des résultats immédiats mais coûte de l'argent en continu. L'idéal est de combiner les deux pour un maximum d'impact." },
      { question: "Que comprend le suivi mensuel ?", answer: "Un rapport complet avec vos positions sur Google, le trafic organique, les mots-clés qui progressent, et nos recommandations pour le mois suivant." }
    ],
    ctaTitle: "Apparaissez en premier sur Google",
    ctaDescription: "Lancez votre audit SEO gratuit et découvrez votre potentiel de croissance."
  },

  'campagnes-publicitaires-ppc': {
    slug: 'campagnes-publicitaires-ppc',
    badge: '🎯 Publicité',
    heroTitle: 'Des campagnes publicitaires',
    heroHighlight: 'qui génèrent des clients',
    heroDescription: "Publicité ultra-ciblée sur Google, Facebook, Instagram et TikTok pour toucher vos clients idéaux sur vos marchés cibles régionaux et mondiaux. Chaque budget investi est optimisé.",
    features: [
      { icon: 'target', title: 'Ciblage géographique', description: "Touchez précisément vos clients selon leur pays, ville ou quartier ciblé dans le monde." },
      { icon: 'trending-up', title: 'ROI optimisé', description: "Optimisation continue du coût par clic et par acquisition pour maximiser votre retour sur investissement." },
      { icon: 'image', title: 'Créations visuelles', description: "Visuels et vidéos publicitaires percutants, adaptés aux tendances et codes visuels locaux." },
      { icon: 'refresh', title: 'A/B Testing', description: "Tests systématiques des accroches, visuels et audiences pour ne garder que ce qui performe." },
      { icon: 'bar-chart', title: 'Rapports détaillés', description: "Dashboard en temps réel avec impressions, clics, conversions et coût par résultat." },
      { icon: 'users', title: 'Remarketing', description: "Reciblez les visiteurs de votre site qui n'ont pas encore acheté pour les convertir." }
    ],
    process: [
      { step: 1, title: 'Stratégie', description: "Analyse de votre marché, définition des objectifs et du budget publicitaire optimal." },
      { step: 2, title: 'Création', description: "Conception des visuels, rédaction des accroches et paramétrage des audiences." },
      { step: 3, title: 'Lancement & Test', description: "Mise en ligne des campagnes avec A/B testing intensif les 2 premières semaines." },
      { step: 4, title: 'Optimisation', description: "Ajustement continu des enchères, audiences et créatifs selon les performances réelles." }
    ],
    stats: [
      { value: '7 500 €+', label: 'Budget géré en ads' },
      { value: '3.5x', label: 'ROAS moyen' },
      { value: '-40%', label: 'Coût par lead' },
      { value: '24h', label: 'Premiers résultats' }
    ],
    faq: [
      { question: "Quel budget minimum faut-il pour commencer ?", answer: "Nous adaptons le budget à vos objectifs. À titre d'exemple, on peut démarrer des campagnes à partir de 150 € / 100 000 FCFA par mois." },
      { question: "Sur quelles plateformes faites-vous de la publicité ?", answer: "Google Ads, Facebook, Instagram, TikTok et LinkedIn. Nous recommandons les plateformes les plus pertinentes selon votre activité et votre cible." },
      { question: "Combien de temps faut-il pour avoir des résultats ?", answer: "Les premières leads arrivent généralement dans les 24-48 heures après le lancement. L'optimisation complète prend 2-4 semaines." },
      { question: "Est-ce que je garde le contrôle du budget ?", answer: "Oui, vous définissez votre budget maximal et nous ne le dépassons jamais. Vous recevez un rapport transparent chaque semaine." }
    ],
    ctaTitle: "Lancez votre première campagne rentable",
    ctaDescription: "Audit gratuit de votre potentiel publicitaire en 24h."
  },

  'boutiques-shopify': {
    slug: 'boutiques-shopify',
    badge: '🛒 E-commerce',
    heroTitle: 'Votre boutique Shopify',
    heroHighlight: 'clé en main',
    heroDescription: "Lancez votre boutique en ligne professionnelle en moins de 2 semaines. Design premium, paiements Mobile Money intégrés et formation complète pour gérer vos ventes en autonomie.",
    features: [
      { icon: 'shopping-bag', title: 'Boutique complète', description: "Configuration de A à Z : produits, collections, pages, menus de navigation et paramètres de livraison." },
      { icon: 'palette', title: 'Design premium', description: "Thème personnalisé aux couleurs de votre marque, responsive et optimisé pour la conversion." },
      { icon: 'credit-card', title: 'Paiements simplifiés', description: "Intégration de Stripe, PayPal et des Mobile Money (Orange Money, Wave, MTN) pour faciliter l'achat de tous vos clients." },
      { icon: 'package', title: 'Gestion des livraisons', description: "Configuration des zones de livraison locales, nationales et internationales avec tarifs automatiques." },
      { icon: 'tool', title: 'Apps essentielles', description: "Installation des applications Shopify indispensables : upsell, avis clients, abandons de panier, SEO." },
      { icon: 'book', title: 'Formation complète', description: "2h de formation vidéo + guide PDF pour gérer vos commandes, stocks et promotions en toute autonomie." }
    ],
    process: [
      { step: 1, title: 'Catalogue produits', description: "Envoyez-nous vos produits, photos et prix. Nous structurons votre catalogue en collections attractives." },
      { step: 2, title: 'Design & Config', description: "Personnalisation du thème, création des pages et configuration de tous les paramètres de la boutique." },
      { step: 3, title: 'Paiements & Livraison', description: "Intégration des solutions de paiement Mobile Money et paramétrage des zones et frais de livraison." },
      { step: 4, title: 'Formation & Lancement', description: "Session de formation individuelle et lancement officiel de votre boutique en ligne." }
    ],
    stats: [
      { value: '+40', label: 'Boutiques créées' },
      { value: '14j', label: 'Délai de livraison' },
      { value: '100%', label: 'Paiements sécurisés' },
      { value: '2h', label: 'Formation incluse' }
    ],
    faq: [
      { question: "Pourquoi Shopify et pas WooCommerce ?", answer: "Shopify est plus fiable, plus sécurisé et plus simple à gérer au quotidien. Pas besoin de mises à jour techniques ni de risques de bugs. Idéal pour se concentrer sur vos ventes." },
      { question: "Quels moyens de paiement puis-je proposer ?", answer: "Vous pouvez proposer les paiements par carte bancaire (Visa/Mastercard via Stripe/PayPal), ainsi que les Mobile Money (Orange Money, Wave, MTN) pour l'Afrique." },
      { question: "Combien coûte l'abonnement Shopify ?", answer: "Le plan Basic Shopify coûte environ 32$ / 20 000 FCFA par mois. C'est un investissement minime comparé au chiffre d'affaires potentiel." },
      { question: "Puis-je vendre à l'international ?", answer: "Absolument ! Shopify gère nativement les multidevises, les langues et les frais de livraison internationaux. Vous pouvez vendre dans le monde entier." }
    ],
    ctaTitle: "Ouvrez votre boutique en ligne en 2 semaines",
    ctaDescription: "Devis gratuit et accompagnement personnalisé inclus."
  },

  'marketing-digital': {
    slug: 'marketing-digital',
    badge: '📈 Marketing',
    heroTitle: 'Une stratégie marketing',
    heroHighlight: 'qui propulse votre croissance',
    heroDescription: "Stratégie globale d'acquisition et de fidélisation adaptée à vos marchés cibles. Réseaux sociaux, emailing, content marketing — on pilote tout pour transformer vos visiteurs en clients fidèles.",
    features: [
      { icon: 'map', title: 'Plan marketing annuel', description: "Stratégie structurée avec objectifs, canaux prioritaires et calendrier éditorial adapté aux événements locaux." },
      { icon: 'users', title: 'Community management', description: "Animation quotidienne de vos pages Facebook, Instagram et TikTok avec du contenu engageant." },
      { icon: 'mail', title: 'Email marketing', description: "Campagnes d'emailing et newsletters automatisées pour fidéliser et faire revenir vos clients." },
      { icon: 'trending-up', title: 'Growth hacking', description: "Techniques d'acquisition innovantes pour maximiser votre croissance avec un budget limité." },
      { icon: 'pie-chart', title: 'Analyse concurrentielle', description: "Veille permanente sur vos concurrents locaux et identification des opportunités de marché." },
      { icon: 'bar-chart', title: 'Rapports mensuels', description: "Suivi des KPIs, analyse des performances et recommandations stratégiques chaque mois." }
    ],
    process: [
      { step: 1, title: 'Audit marketing', description: "Analyse de votre présence digitale actuelle, de vos concurrents et de votre marché cible." },
      { step: 2, title: 'Stratégie', description: "Définition des objectifs SMART, choix des canaux et création du plan d'action détaillé." },
      { step: 3, title: 'Exécution', description: "Mise en œuvre du plan : création de contenu, campagnes, gestion des réseaux sociaux." },
      { step: 4, title: 'Optimisation', description: "Analyse des résultats, ajustement de la stratégie et scaling de ce qui fonctionne." }
    ],
    stats: [
      { value: '+300%', label: 'Croissance moyenne' },
      { value: '50+', label: 'Entreprises accompagnées' },
      { value: '12', label: 'Mois d\'accompagnement' },
      { value: '5', label: 'Canaux gérés' }
    ],
    faq: [
      { question: "Quels réseaux sociaux privilégier ?", answer: "Facebook, Instagram, TikTok et LinkedIn ont chacun des forces uniques selon votre cible (B2B ou B2C) et votre zone géographique. Nous vous conseillons les plateformes les plus adaptées." },
      { question: "Est-ce que le marketing digital fonctionne pour les petites entreprises ?", answer: "Oui, c'est même là que le digital est le plus puissant ! Avec un budget maîtrisé, vous pouvez toucher des milliers de clients potentiels ciblés." },
      { question: "Quelle est la différence avec un community manager freelance ?", answer: "Nous offrons une stratégie globale intégrée (contenu + pub + SEO + email), pas juste des posts sur les réseaux. Chaque action est liée à vos objectifs business." },
      { question: "Quel budget prévoir ?", answer: "Nos accompagnements marketing démarrent à 380 € / 250 000 FCFA par mois. Le budget publicitaire est en supplément et adapté à vos objectifs." }
    ],
    ctaTitle: "Boostez votre croissance digitale",
    ctaDescription: "Audit marketing gratuit de votre présence en ligne."
  },

  'audit-ux-ui': {
    slug: 'audit-ux-ui',
    badge: '🔬 Audit',
    heroTitle: 'Identifiez ce qui empêche',
    heroHighlight: 'vos visiteurs d\'acheter',
    heroDescription: "Votre site a du trafic mais peu de ventes ? Notre audit UX/UI analyse en profondeur le parcours de vos utilisateurs pour identifier les freins et doubler votre taux de conversion.",
    features: [
      { icon: 'eye', title: 'Cartes de chaleur', description: "Visualisez exactement où cliquent, scrollent et s'arrêtent vos visiteurs sur chaque page." },
      { icon: 'video', title: 'Enregistrements sessions', description: "Regardez de vrais utilisateurs naviguer sur votre site pour comprendre leurs frustrations." },
      { icon: 'smartphone', title: 'Test mobile', description: "Analyse approfondie de l'expérience sur les smartphones les plus utilisés par votre cible." },
      { icon: 'zap', title: 'Audit vitesse', description: "Mesure et optimisation du temps de chargement sur les connexions mobiles." },
      { icon: 'check-circle', title: 'Accessibilité', description: "Vérification de la conformité aux standards d'accessibilité web (WCAG)." },
      { icon: 'file-text', title: 'Plan d\'action', description: "Rapport complet avec recommandations priorisées par impact et facilité de mise en œuvre." }
    ],
    process: [
      { step: 1, title: 'Installation tracking', description: "Mise en place des outils d'analyse de comportement (Hotjar, Google Analytics) sur votre site." },
      { step: 2, title: 'Collecte de données', description: "1 à 2 semaines de collecte de données réelles sur le comportement de vos visiteurs." },
      { step: 3, title: 'Analyse experte', description: "Revue complète par notre équipe UX : parcours utilisateur, design, performance, contenu." },
      { step: 4, title: 'Rapport & Plan d\'action', description: "Livraison d'un rapport détaillé avec chaque recommandation illustrée et priorisée." }
    ],
    stats: [
      { value: '+50', label: 'Points analysés' },
      { value: '2x', label: 'Conversions en moyenne' },
      { value: '72h', label: 'Délai du rapport' },
      { value: '100%', label: 'Actionnable' }
    ],
    faq: [
      { question: "C'est quoi exactement un audit UX/UI ?", answer: "C'est une analyse complète de votre site web du point de vue de l'utilisateur. On identifie tout ce qui freine les visiteurs : navigation confuse, boutons mal placés, formulaires trop longs, pages lentes, etc." },
      { question: "Est-ce que l'audit inclut les corrections ?", answer: "L'audit livre un rapport de recommandations. Les corrections peuvent être réalisées par votre équipe ou par nos développeurs (sur devis séparé)." },
      { question: "Mon site est récent, ai-je besoin d'un audit ?", answer: "Oui ! Même un site récent peut avoir des problèmes d'ergonomie invisibles. Un audit précoce permet de corriger avant de perdre des clients." },
      { question: "Combien ça coûte ?", answer: "Un audit UX/UI complet coûte à partir de 300 € / 200 000 FCFA. C'est un investissement rapidement rentabilisé par l'augmentation des conversions." }
    ],
    ctaTitle: "Découvrez pourquoi vos visiteurs ne convertissent pas",
    ctaDescription: "Recevez un pré-audit gratuit de votre site en 48h."
  },

  'solutions-ecommerce-sur-mesure': {
    slug: 'solutions-ecommerce-sur-mesure',
    badge: '🏪 E-commerce',
    heroTitle: 'Votre plateforme e-commerce',
    heroHighlight: 'adaptée à vos marchés',
    heroDescription: "Plateformes e-commerce robustes et sur-mesure avec intégration native des paiements internationaux (Stripe, PayPal) et africains (Orange Money, Wave, MTN). Vendez partout dans le monde ou sur vos marchés locaux.",
    features: [
      { icon: 'credit-card', title: 'Paiements natifs', description: "Stripe, PayPal, Orange Money, Wave et MTN Money intégrés nativement pour faciliter l'achat mondial et local." },
      { icon: 'truck', title: 'Livraison optimisée', description: "Gestion des zones de livraison locales, nationales et internationales avec calcul automatique des frais." },
      { icon: 'bell', title: 'Notifications SMS', description: "Alertes automatiques par SMS à chaque étape : confirmation, préparation, expédition, livraison." },
      { icon: 'shopping-cart', title: 'Tunnel d\'achat simplifié', description: "Processus de commande en 3 clics maximum pour réduire les abandons de panier." },
      { icon: 'database', title: 'Gestion des stocks', description: "Suivi en temps réel des stocks, alertes de rupture et rapports de ventes détaillés." },
      { icon: 'shield', title: 'Sécurité transactions', description: "Paiements sécurisés, protection des données clients et conformité aux normes locales et internationales." }
    ],
    process: [
      { step: 1, title: 'Analyse métier', description: "Compréhension de votre activité, catalogue produits et spécificités logistiques." },
      { step: 2, title: 'Architecture', description: "Conception de la structure du site, du tunnel d'achat et des intégrations techniques." },
      { step: 3, title: 'Développement', description: "Développement sur-mesure avec intégration des APIs de paiement et de livraison de votre choix." },
      { step: 4, title: 'Lancement', description: "Tests complets, formation de votre équipe et lancement accompagné." }
    ],
    stats: [
      { value: '+25', label: 'Plateformes livrées' },
      { value: '3', label: 'Moyens de paiement' },
      { value: '-60%', label: 'Abandons de panier' },
      { value: '24/7', label: 'Ventes automatiques' }
    ],
    faq: [
      { question: "Pourquoi du sur-mesure plutôt que Shopify ?", answer: "Le sur-mesure permet d'intégrer parfaitement des fonctionnalités spécifiques (APIs de livraison, abonnements personnalisés) et d'adapter le tunnel d'achat aux processus métiers complexes de votre entreprise." },
      { question: "Quels moyens de paiement sont intégrés ?", answer: "Orange Money, Wave, MTN Money, cartes bancaires (Visa/Mastercard) et paiement à la livraison. Nous pouvons ajouter d'autres solutions selon vos besoins." },
      { question: "Comment gérez-vous les livraisons ?", answer: "Nous intégrons les partenaires de livraison locaux (livreurs à Abidjan) et configurons des zones avec des tarifs automatiques." },
      { question: "Quel est le coût d'une plateforme e-commerce sur-mesure ?", answer: "Les projets e-commerce sur-mesure démarrent à partir de 2 300 € / 1 500 000 FCFA selon la complexité. Contactez-nous pour un devis détaillé." }
    ],
    ctaTitle: "Lancez votre boutique en ligne sur-mesure",
    ctaDescription: "Devis gratuit et étude de faisabilité sous 48h."
  },

  'optimisation-conversion-par-ia': {
    slug: 'optimisation-conversion-par-ia',
    badge: 'Intelligence Artificielle',
    heroTitle: "L'IA qui optimise",
    heroHighlight: 'vos ventes automatiquement',
    heroDescription: "Notre intelligence artificielle teste en continu des variantes de vos pages, titres et boutons pour identifier ce qui convertit le mieux. Plus de devinettes — que des données.",
    features: [
      { icon: 'cpu', title: 'Tests A/B automatisés', description: "L'IA crée et teste des variantes de vos pages pour trouver la combinaison qui génère le plus de ventes." },
      { icon: 'users', title: 'Personnalisation dynamique', description: "Adaptation du contenu en temps réel selon le profil, la localisation et le comportement du visiteur." },
      { icon: 'trending-up', title: 'Insights IA', description: "Recommandations data-driven générées par notre IA pour orienter vos décisions marketing." },
      { icon: 'bar-chart', title: 'Analytics avancés', description: "Tableaux de bord intelligents avec prédictions de revenus et détection d'anomalies." },
      { icon: 'message-circle', title: 'Chatbot IA', description: "Assistant virtuel intelligent pour qualifier vos leads et répondre aux questions 24h/24." },
      { icon: 'repeat', title: 'Amélioration continue', description: "L'algorithme apprend et s'améliore chaque jour grâce aux données de vos visiteurs." }
    ],
    process: [
      { step: 1, title: 'Audit & Intégration', description: "Installation de notre SDK sur votre site et collecte des données de comportement initiales." },
      { step: 2, title: 'Configuration IA', description: "Paramétrage des objectifs de conversion, des zones à tester et des règles de personnalisation." },
      { step: 3, title: 'Apprentissage', description: "L'IA commence à tester des variantes et apprend ce qui fonctionne le mieux pour votre audience." },
      { step: 4, title: 'Optimisation continue', description: "Déploiement automatique des meilleures variantes et rapports de performance hebdomadaires." }
    ],
    stats: [
      { value: '+35%', label: 'Conversions en moyenne' },
      { value: '1000+', label: 'Tests par mois' },
      { value: '24/7', label: 'Optimisation continue' },
      { value: '2 sem', label: 'Premiers résultats' }
    ],
    faq: [
      { question: "C'est quoi exactement l'optimisation par IA ?", answer: "C'est l'utilisation d'algorithmes d'intelligence artificielle pour tester automatiquement des variantes de vos pages web (titres, images, boutons, textes) et déployer celles qui convertissent le mieux." },
      { question: "Mon site a besoin de beaucoup de trafic pour que ça fonctionne ?", answer: "Nous recommandons un minimum de 1 000 visiteurs/mois pour que l'IA ait suffisamment de données pour des résultats significatifs. Plus de trafic = résultats plus rapides." },
      { question: "Est-ce compatible avec mon site actuel ?", answer: "Oui, notre solution s'intègre sur tout type de site via un simple script. Compatible avec WordPress, Shopify, Next.js et tout site web." },
      { question: "Quel ROI puis-je attendre ?", answer: "Nos clients constatent en moyenne une augmentation de 35% des conversions en 3 mois. Sur un site e-commerce, cela représente des gains de revenus additionnels majeurs." }
    ],
    ctaTitle: "Laissez l'IA booster vos ventes",
    ctaDescription: "Démonstration gratuite et estimation de votre potentiel de croissance."
  }
};

export default serviceDetails;
