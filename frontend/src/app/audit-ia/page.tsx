'use client';

import { useState, useEffect, useRef } from 'react';
import { ShimmerButton } from '@/components/ui/ShimmerButton';
import GlowingCard from '@/components/layout/GlowingCard';
import { NumberTicker } from '@/components/ui/NumberTicker';
import { Particles } from '@/components/ui/Particles';

// Type Definitions
type Step = 'hero' | 'questions' | 'analyzing' | 'report';

interface Question {
  id: string;
  category: string;
  title: string;
  description: string;
  type: 'select' | 'text' | 'number';
  options?: { value: string; label: string; icon?: string }[];
  placeholder?: string;
}

const QUESTIONS: Question[] = [
  {
    id: 'businessName',
    category: 'Entreprise',
    title: 'Quel est le nom de votre entreprise ?',
    description: 'Cela nous permet de personnaliser l\'ensemble de votre rapport d\'audit.',
    type: 'text',
    placeholder: 'Ex: Nonalix SARL'
  },
  {
    id: 'industry',
    category: 'Entreprise',
    title: 'Quel est votre secteur d\'activité ?',
    description: 'L\'IA adaptera ses recommandations et ses opportunités à votre marché.',
    type: 'select',
    options: [
      { value: 'services', label: 'Services aux entreprises & Conseil', icon: '💼' },
      { value: 'commerce', label: 'Commerce physique / E-commerce', icon: '🛒' },
      { value: 'btp', label: 'BTP, Construction & Immobilier', icon: '🏗️' },
      { value: 'sante', label: 'Santé, Médical & Bien-être', icon: '🏥' },
      { value: 'education', label: 'Éducation, Formation & E-learning', icon: '🎓' },
      { value: 'industrie', label: 'Industrie & Secteur manufacturier', icon: '🏭' },
      { value: 'autre', label: 'Autre secteur', icon: '✨' }
    ]
  },
  {
    id: 'country',
    category: 'Entreprise',
    title: 'Dans quel pays opérez-vous principalement ?',
    description: 'Utile pour adapter le contexte fiscal, monétaire (FCFA/EUR) et digital.',
    type: 'select',
    options: [
      { value: 'ci', label: 'Côte d\'Ivoire (Abidjan...)', icon: '🇨🇮' },
      { value: 'sn', label: 'Sénégal (Dakar...)', icon: '🇸🇳' },
      { value: 'ml', label: 'Mali (Bamako...)', icon: '🇲🇱' },
      { value: 'bf', label: 'Burkina Faso (Ouagadougou...)', icon: '🇧🇫' },
      { value: 'tg', label: 'Togo (Lomé...)', icon: '🇹🇬' },
      { value: 'bj', label: 'Bénin (Cotonou...)', icon: '🇧🇯' },
      { value: 'fr', label: 'France / Europe', icon: '🇪🇺' },
      { value: 'autre', label: 'Autre pays', icon: '🌍' }
    ]
  },
  {
    id: 'employees',
    category: 'Entreprise',
    title: 'Combien de collaborateurs compte votre entreprise ?',
    description: 'Sert à calculer le volume d\'heures perdues global et le coût salarial associé.',
    type: 'select',
    options: [
      { value: '1-5', label: '1 à 5 employés', icon: '👥' },
      { value: '6-20', label: '6 à 20 employés', icon: '🏢' },
      { value: '21-50', label: '21 à 50 employés', icon: '🏭' },
      { value: '51-200', label: '51 à 200 employés', icon: '🏰' },
      { value: '200+', label: 'Plus de 200 employés', icon: '🚀' }
    ]
  },
  {
    id: 'website',
    category: 'Entreprise',
    title: 'Avez-vous un site internet ?',
    description: 'Si oui, indiquez l\'adresse (URL) pour évaluer votre présence en ligne.',
    type: 'text',
    placeholder: 'Ex: www.monentreprise.ci (optionnel)'
  },
  {
    id: 'hasCrm',
    category: 'Processus',
    title: 'Utilisez-vous un CRM pour gérer vos clients et prospects ?',
    description: 'Un CRM permet de centraliser vos prospects et d\'éviter les oublis de relance.',
    type: 'select',
    options: [
      { value: 'yes', label: 'Oui (HubSpot, Salesforce, Zoho, etc.)', icon: '✅' },
      { value: 'no', label: 'Non (nous utilisons Excel, WhatsApp ou e-mails)', icon: '❌' }
    ]
  },
  {
    id: 'hasWhatsappBusiness',
    category: 'Processus',
    title: 'Utilisez-vous WhatsApp Business pour communiquer avec vos clients ?',
    description: 'WhatsApp est le canal de communication n°1 en Afrique de l\'Ouest.',
    type: 'select',
    options: [
      { value: 'yes', label: 'Oui, nous l\'utilisons activement', icon: '💬' },
      { value: 'no', label: 'Non, ou uniquement à titre personnel', icon: '⚪' }
    ]
  },
  {
    id: 'calendarMode',
    category: 'Processus',
    title: 'Comment gérez-vous la prise de rendez-vous avec vos clients ?',
    description: 'L\'automatisation des rendez-vous élimine les échanges d\'e-mails sans fin.',
    type: 'select',
    options: [
      { value: 'manual', label: 'Manuellement (par téléphone, e-mail, WhatsApp)', icon: '📞' },
      { value: 'automated', label: 'Automatisé (via un lien Cal.com, Calendly...)', icon: '⚡' },
      { value: 'none', label: 'Non applicable à notre activité', icon: '🚫' }
    ]
  },
  {
    id: 'customerService',
    category: 'Processus',
    title: 'Comment est structuré votre support / service client ?',
    description: 'L\'IA peut traiter instantanément 80% des questions fréquentes des clients.',
    type: 'select',
    options: [
      { value: 'human', label: 'Entièrement manuel (des humains répondent à chaque fois)', icon: '👱' },
      { value: 'auto-reply', label: 'Quelques messages d\'absence ou réponses automatiques', icon: '🤖' },
      { value: 'chatbot', label: 'Chatbot intelligent connecté à notre FAQ/Base de données', icon: '💡' },
      { value: 'none', label: 'Aucun support client structuré actuellement', icon: '⚠️' }
    ]
  },
  {
    id: 'hoursLostPerWeek',
    category: 'Efficacité',
    title: 'Combien d\'heures par collaborateur sont perdues par semaine ?',
    description: 'Temps passé sur des tâches répétitives (facturation, copier-coller Excel, relances, tri d\'emails).',
    type: 'select',
    options: [
      { value: 'under-2', label: 'Moins de 2 heures par semaine', icon: '⏳' },
      { value: '2-5', label: 'Entre 2 et 5 heures par semaine', icon: '🕒' },
      { value: '5-10', label: 'Entre 5 et 10 heures par semaine', icon: '🚀' },
      { value: '10plus', label: 'Plus de 10 heures par semaine', icon: '🔥' }
    ]
  },
  {
    id: 'averageSalary',
    category: 'Efficacité',
    title: 'Quel est le salaire mensuel moyen estimé de vos collaborateurs ?',
    description: 'Sert uniquement à calculer le coût financier des heures perdues (estimé en FCFA).',
    type: 'select',
    options: [
      { value: '150k', label: '100 000 - 250 000 FCFA (ex: Agent d\'accueil, Standardiste)', icon: '💵' },
      { value: '300k', label: '250 000 - 500 000 FCFA (ex: Commercial, Administratif)', icon: '💳' },
      { value: '600k', label: '500 000 - 1 000 000 FCFA (ex: Manager, Cadre)', icon: '💰' },
      { value: '1500k', label: 'Plus de 1 000 000 FCFA (ex: Direction, Expert)', icon: '👑' }
    ]
  },
  {
    id: 'acquisitionStrategy',
    category: 'Acquisition',
    title: 'Quelle est votre principale stratégie pour trouver des clients ?',
    description: 'Une stratégie d\'acquisition automatisée garantit un flux régulier de leads.',
    type: 'select',
    options: [
      { value: 'referral', label: 'Bouche-à-oreille et réseau personnel uniquement', icon: '🗣️' },
      { value: 'social', label: 'Réseaux sociaux (publications manuelles)', icon: '📱' },
      { value: 'ads', label: 'Publicité payante (Google Ads, Meta Ads, etc.)', icon: '📣' },
      { value: 'seo-content', label: 'Référencement naturel (SEO) et création de contenu', icon: '📈' }
    ]
  },
  {
    id: 'digitalBudget',
    category: 'Acquisition',
    title: 'Quel est votre budget digital / marketing mensuel ?',
    description: 'Investissement dans les outils, les campagnes de pub ou le référencement.',
    type: 'select',
    options: [
      { value: 'under-100k', label: 'Moins de 100 000 FCFA / mois', icon: '📉' },
      { value: '100k-500k', label: '100 000 à 500 000 FCFA / mois', icon: '📊' },
      { value: '500k-2m', label: '500 000 à 2 000 000 FCFA / mois', icon: '🚀' },
      { value: '2mplus', label: 'Plus de 2 000 000 FCFA / mois', icon: '💎' }
    ]
  },
  {
    id: 'iaMaturity',
    category: 'Maturité IA',
    title: 'Quelle est l\'utilisation actuelle de l\'IA dans votre entreprise ?',
    description: 'ChatGPT, Claude, Midjourney ou des automatisations internes.',
    type: 'select',
    options: [
      { value: 'none', label: 'Pas du tout (nous ne l\'utilisons pas)', icon: '❌' },
      { value: 'rarely', label: 'Rarement (quelques recherches ou traductions occasionnelles)', icon: '🔍' },
      { value: 'regular', label: 'Régulièrement (rédaction de mails, génération de textes/idées)', icon: '💡' },
      { value: 'integrated', label: 'Intégrée (outils connectés via API, automatisations en place)', icon: '⚙️' }
    ]
  },
  {
    id: 'mainGoal',
    category: 'Maturité IA',
    title: 'Quel est votre objectif prioritaire pour les 6 prochains mois ?',
    description: 'L\'IA construira la feuille de route pour atteindre cet objectif spécifique.',
    type: 'select',
    options: [
      { value: 'reduce-costs', label: 'Réduire nos coûts opérationnels et de main-d\'œuvre', icon: '📉' },
      { value: 'save-time', label: 'Gagner du temps pour me concentrer sur mon cœur de métier', icon: '⏳' },
      { value: 'increase-sales', label: 'Augmenter le volume de leads qualifiés et de ventes', icon: '📈' },
      { value: 'customer-satisfaction', label: 'Améliorer la réactivité et la satisfaction de nos clients', icon: '❤️' }
    ]
  }
];

const ANALYZING_STEPS = [
  "Initialisation du scanner cognitif Nonalix...",
  "Analyse de la maturité technologique de l'entreprise...",
  "Identification des tâches répétitives automatisables...",
  "Calcul du coût financier lié aux processus inefficaces...",
  "Simulations de gain de temps et de ROI avec n8n & agents IA...",
  "Génération du plan d'action stratégique personnalisé..."
];

export default function AuditIAPage() {
  const [step, setStep] = useState<Step>('hero');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [analyzingStepIndex, setAnalyzingStepIndex] = useState(0);
  
  // Formulaire de prospect final
  const [leadForm, setLeadForm] = useState({
    contactName: '',
    email: '',
    phone: '',
    consent: false,
    honeypot: '', // Anti-bot : doit rester vide (champ masqué pour les humains)
  });
  const [leadErrors, setLeadErrors] = useState<Record<string, string>>({});
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [isLeadSubmitted, setIsLeadSubmitted] = useState(false);
  const [backendResult, setBackendResult] = useState<any>(null);

  // Pour l'animation des scores côté client (affichés avant la capture de lead)
  const [animatedClientScores, setAnimatedClientScores] = useState({
    globalScore: 0,
    automation: 0,
    digitalMaturity: 0,
    roiPotential: 450
  });

  // Gestion de la simulation d'IA
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'analyzing') {
      setAnalyzingStepIndex(0);
      interval = setInterval(() => {
        setAnalyzingStepIndex((prev) => {
          if (prev < ANALYZING_STEPS.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            // Transition vers le rapport
            calculateClientScores();
            setStep('report');
            return prev;
          }
        });
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [step]);

  // Calculer des scores approximatifs côté client pour affichage immédiat
  const calculateClientScores = () => {
    // 1. Automatisation
    let auto = 20;
    if (answers['hasCrm'] === 'yes') auto += 20;
    if (answers['hasWhatsappBusiness'] === 'yes') auto += 15;
    if (answers['calendarMode'] === 'automated') auto += 20;
    if (answers['customerService'] === 'chatbot') auto += 25;
    else if (answers['customerService'] === 'auto-reply') auto += 10;

    // 2. Maturité
    let mat = 15;
    if (answers['iaMaturity'] === 'regular' || answers['iaMaturity'] === 'integrated') mat += 30;
    else if (answers['iaMaturity'] === 'rarely') mat += 15;
    if (answers['digitalBudget'] === '500k-2m' || answers['digitalBudget'] === '2mplus') mat += 25;
    if (answers['acquisitionStrategy'] === 'seo-content' || answers['acquisitionStrategy'] === 'ads') mat += 30;

    const global = Math.round((auto * 0.5) + (mat * 0.5));
    
    setAnimatedClientScores({
      globalScore: Math.min(Math.max(global, 15), 96),
      automation: Math.min(Math.max(auto, 15), 96),
      digitalMaturity: Math.min(Math.max(mat, 15), 96),
      roiPotential: 450
    });
  };

  const handleStart = () => {
    setStep('questions');
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const handleAnswerSelect = (value: string) => {
    const question = QUESTIONS[currentQuestionIndex];
    setAnswers((prev) => ({ ...prev, [question.id]: value }));

    // Auto-advance for select questions
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 300);
    } else {
      setTimeout(() => {
        setStep('analyzing');
      }, 400);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const question = QUESTIONS[currentQuestionIndex];
    const val = answers[question.id] || '';

    // Si c'est le nom de l'entreprise, on exige au moins 2 caractères
    if (question.id === 'businessName' && val.trim().length < 2) {
      alert("Veuillez renseigner le nom de votre entreprise.");
      return;
    }

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setStep('analyzing');
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      setStep('hero');
    }
  };

  const validateLead = () => {
    const errors: Record<string, string> = {};
    if (!leadForm.contactName.trim()) {
      errors.contactName = "Votre nom est requis.";
    }
    if (!leadForm.email.trim()) {
      errors.email = "Votre e-mail est requis.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadForm.email)) {
      errors.email = "Veuillez entrer une adresse e-mail valide.";
    }
    if (!leadForm.phone.trim()) {
      errors.phone = "Votre numéro WhatsApp / Téléphone est requis.";
    } else if (leadForm.phone.replace(/\s/g, '').length < 8) {
      errors.phone = "Veuillez entrer un numéro de téléphone valide.";
    }
    if (!leadForm.consent) {
      errors.consent = "Vous devez accepter le traitement de vos données.";
    }
    setLeadErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLead()) return;

    setIsSubmittingLead(true);
    try {
      const payload = {
        ...answers,
        businessName: answers['businessName'] || 'Mon Entreprise',
        industry: answers['industry'] || 'services',
        country: answers['country'] || 'ci',
        employees: answers['employees'] || '1-5',
        website: answers['website'] || '',
        hasCrm: answers['hasCrm'] || 'no',
        hasWhatsappBusiness: answers['hasWhatsappBusiness'] || 'no',
        calendarMode: answers['calendarMode'] || 'manual',
        customerService: answers['customerService'] || 'human',
        hoursLostPerWeek: answers['hoursLostPerWeek'] || '2-5',
        averageSalary: answers['averageSalary'] || '300k',
        acquisitionStrategy: answers['acquisitionStrategy'] || 'referral',
        digitalBudget: answers['digitalBudget'] || 'under-100k',
        iaMaturity: answers['iaMaturity'] || 'none',
        mainGoal: answers['mainGoal'] || 'save-time',
        contactName: leadForm.contactName,
        email: leadForm.email,
        phone: leadForm.phone,
        consent: leadForm.consent,
        honeypot: leadForm.honeypot,
      };

      const res = await fetch('/api/audit-ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setBackendResult(data);
        setIsLeadSubmitted(true);
      } else {
        alert(data.error || "Une erreur est survenue lors de l'enregistrement.");
      }
    } catch (err) {
      console.error(err);
      alert("Une erreur de réseau est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmittingLead(false);
    }
  };

  // Déclencher l'impression PDF via window.print()
  const handlePrint = () => {
    window.print();
  };

  // Questions / Catégories helpers
  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const progressPercent = Math.round((currentQuestionIndex / QUESTIONS.length) * 100);

  // Mappage de calcul local pour le rendu visuel immédiat dans le rapport
  const displayMetrics = backendResult?.metrics || {
    financials: {
      weeklyHoursLost: (answers['employees'] === '6-20' ? 13 : answers['employees'] === '21-50' ? 35 : answers['employees'] === '51-200' ? 125 : answers['employees'] === '200+' ? 300 : 3) * (answers['hoursLostPerWeek'] === 'under-2' ? 1 : answers['hoursLostPerWeek'] === '5-10' ? 7.5 : answers['hoursLostPerWeek'] === '10plus' ? 12 : 3.5),
      monthlyHoursLost: 0,
      annualHoursLost: (answers['employees'] === '6-20' ? 13 : answers['employees'] === '21-50' ? 35 : answers['employees'] === '51-200' ? 125 : answers['employees'] === '200+' ? 300 : 3) * (answers['hoursLostPerWeek'] === 'under-2' ? 1 : answers['hoursLostPerWeek'] === '5-10' ? 7.5 : answers['hoursLostPerWeek'] === '10plus' ? 12 : 3.5) * 52,
      monthlyCostLost: 0,
      annualCostLost: (answers['employees'] === '6-20' ? 13 : answers['employees'] === '21-50' ? 35 : answers['employees'] === '51-200' ? 125 : answers['employees'] === '200+' ? 300 : 3) * (answers['hoursLostPerWeek'] === 'under-2' ? 1 : answers['hoursLostPerWeek'] === '5-10' ? 7.5 : answers['hoursLostPerWeek'] === '10plus' ? 12 : 3.5) * 52 * ((answers['averageSalary'] === '150k' ? 150000 : answers['averageSalary'] === '600k' ? 600000 : answers['averageSalary'] === '1500k' ? 1500000 : 300000) / 160),
      annualHoursRecoverable: 0,
      annualSavingsPotential: 0,
      roiPotential: 450
    },
    scores: {
      globalScore: animatedClientScores.globalScore,
      digitalMaturity: animatedClientScores.digitalMaturity,
      automation: animatedClientScores.automation,
      seo: answers['website'] ? 65 : 20,
      marketing: animatedClientScores.digitalMaturity + 5,
      commercial: answers['hasCrm'] === 'yes' ? 75 : 35,
      security: answers['hasCrm'] === 'yes' ? 80 : 50,
      productivity: answers['hoursLostPerWeek'] === 'under-2' ? 95 : answers['hoursLostPerWeek'] === '2-5' ? 80 : 50,
      customerSatisfaction: answers['customerService'] === 'chatbot' ? 90 : 50
    }
  };

  // Compléter les valeurs dérivées manquantes si non soumises au backend
  if (!backendResult) {
    displayMetrics.financials.monthlyHoursLost = Math.round(displayMetrics.financials.weeklyHoursLost * 4.33);
    displayMetrics.financials.monthlyCostLost = Math.round(displayMetrics.financials.monthlyHoursLost * ((answers['averageSalary'] === '150k' ? 150000 : answers['averageSalary'] === '600k' ? 600000 : answers['averageSalary'] === '1500k' ? 1500000 : 300000) / 160));
    displayMetrics.financials.annualHoursRecoverable = Math.round(displayMetrics.financials.annualHoursLost * 0.75);
    displayMetrics.financials.annualSavingsPotential = Math.round(displayMetrics.financials.annualCostLost * 0.75);
  }

  const aiReportText = backendResult?.aiAnalysis || {
    summary: `Sur la base de vos réponses, l'entreprise ${answers['businessName'] || 'votre structure'} présente un fort potentiel de croissance grâce à la transformation technologique. Vos processus administratifs actuels absorbent une part significative de votre force de travail, ce qui engendre des pertes financières invisibles mais réelles qui ralentissent votre expansion sur le marché local.`,
    recommendations: [
      {
        title: answers['hasCrm'] === 'no' ? "Mise en place d'un CRM moderne automatisé" : "Interconnexion des outils existants",
        description: answers['hasCrm'] === 'no' 
          ? "Déployez un CRM centralisé pour suivre vos prospects et automatiser la distribution des fiches clients." 
          : "Connectez votre CRM à vos autres applications via des webhooks n8n.",
        priority: "haute",
        implementationTime: "30 jours"
      },
      {
        title: answers['customerService'] !== 'chatbot' ? "Intégration d'un chatbot WhatsApp intelligent" : "Optimisation de votre automatisation WhatsApp",
        description: answers['customerService'] !== 'chatbot'
          ? "Mettez en place un agent IA 24/7 sur WhatsApp Business pour répondre instantanément et qualifier vos prospects."
          : "Connectez votre chatbot WhatsApp à votre CRM pour créer automatiquement des opportunités de vente.",
        priority: "haute",
        implementationTime: "60 jours"
      },
      {
        title: "Automatisation de la prise de rendez-vous",
        description: "Synchronisez votre agenda (Calendly/Cal.com) avec des relances automatiques par SMS/WhatsApp.",
        priority: "moyenne",
        implementationTime: "30 jours"
      }
    ],
    marketInsight: `Le marché digital local est en pleine accélération. Les entreprises qui intègrent les technologies d'automatisation et de communication immédiate (comme WhatsApp Business IA) doublent leur taux d'acquisition client.`,
    risks: [
      "Perte d'efficacité opérationnelle par rapport aux concurrents digitalisés.",
      "Lenteur de traitement des e-mails et leads causant des opportunités manquées.",
      "Surcharges récurrentes de travail administratif pour les managers."
    ],
    gains: [
      "Réduction de 70% du temps consacré aux tâches administratives.",
      "Amélioration de 30% du taux de signature grâce à des relances instantanées.",
      "Image de marque résolument moderne et technologique auprès de vos clients."
    ]
  };

  return (
    <main className="audit-page-container" style={{ 
      minHeight: '100vh', 
      background: '#0F1012', 
      color: '#FAFAFA', 
      fontFamily: 'var(--font-body)', 
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Particles effect for background */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        <Particles quantity={40} color="#e7ad05" />
      </div>

      {/* JSON-LD Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebApplication",
                "@id": "https://nonalix-ci.com/audit-ia/#webapp",
                "name": "Outil d'Audit IA Gratuit — Score d'Automatisation & ROI | NONALIX CI",
                "url": "https://nonalix-ci.com/audit-ia",
                "description": "Faites auditer gratuitement votre entreprise par notre Intelligence Artificielle en 5 minutes. Obtenez votre score d'automatisation, vos pertes financières et votre plan d'action d'automatisation.",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "All",
                "browserRequirements": "Requires HTML5",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "XOF"
                }
              },
              {
                "@type": "FAQPage",
                "@id": "https://nonalix-ci.com/audit-ia/#faq",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "Comment le score d'automatisation est-il calculé ?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Notre outil évalue l'utilisation de vos logiciels métier (comme les CRM), vos méthodes de communication client (notamment WhatsApp) et le degré d'intervention humaine dans la prise de rendez-vous ou le service client. Plus vos flux sont intégrés, plus votre score est élevé."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "D'où proviennent les estimations financières de pertes ?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Elles sont basées sur le nombre de collaborateurs de votre structure, le temps hebdomadaire moyen estimé passé sur des tâches non productives (copier-coller Excel, relances, tri de mails) et le salaire de référence de votre marché."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Comment mettre en œuvre la feuille de route recommandée ?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Nonalix CI vous accompagne de A à Z. Nos ingénieurs conçoivent et déploient vos workflows sur n8n, intègrent des agents IA conversationnels WhatsApp personnalisés et configurent vos CRM. Contactez-nous par WhatsApp ou téléphone pour en discuter gratuitement."
                    }
                  }
                ]
              }
            ]
          })
        }}
      />



      {/* ────────────────────────────────────────────────────────
          Étape 1 : HERO SECTION
          ──────────────────────────────────────────────────────── */}
      {step === 'hero' && (
        <section className="audit-hero-section" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '5rem var(--content-padding)',
          maxWidth: '800px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 5
        }}>
          <h1 style={{
            fontSize: 'clamp(2.25rem, 5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-heading)',
            letterSpacing: '-0.02em',
            background: 'linear-gradient(to right, #ffffff, #94a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginTop: '2rem'
          }}>
            Audit IA Gratuit de votre entreprise
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            lineHeight: 1.6,
            color: 'var(--color-text-secondary)',
            marginBottom: '3rem',
            maxWidth: '650px'
          }}>
            Découvrez en moins de 5 minutes comment l'Intelligence Artificielle et l'automatisation de processus peuvent éliminer vos tâches répétitives, réduire vos coûts de 75% et accélérer votre croissance.
          </p>

          <ShimmerButton as="button" onClick={handleStart} className="audit-cta-btn" style={{ fontSize: '1.1rem', padding: '16px 36px', borderRadius: '12px' }}>
            Commencer mon audit gratuit
          </ShimmerButton>

          {/* Micro-features */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '2rem',
            marginTop: '4rem',
            fontSize: '0.85rem',
            color: 'var(--color-text-muted)'
          }}>
            <span>⚡ Gratuit & sans engagement</span>
            <span>🕒 Moins de 5 minutes</span>
            <span>📊 Rapport financier & ROI en FCFA</span>
            <span>📋 Feuille de route incluse</span>
          </div>
        </section>
      )}

      {/* ────────────────────────────────────────────────────────
          Étape 2 : QUESTIONNAIRE INTERACTIF
          ──────────────────────────────────────────────────────── */}
      {step === 'questions' && (
        <section className="audit-questionnaire-section" style={{
          maxWidth: '700px',
          margin: '0 auto',
          padding: '3rem var(--content-padding)',
          position: 'relative',
          zIndex: 5
        }}>
          {/* Progress Bar Container */}
          <div style={{
            width: '100%',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '99px',
            marginBottom: '3rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #e7ad05 0%, #10B981 100%)',
              transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }} />
          </div>

          {/* Form wrapper with animations */}
          <div key={currentQuestionIndex} className="animate-fade-in" style={{
            animation: 'fadeIn 0.5s ease-out'
          }}>
            {/* Category and progress badge */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.75rem'
            }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: '#e7ad05',
                letterSpacing: '0.1em'
              }}>
                {currentQuestion.category}
              </span>
              <span style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-secondary)',
                fontWeight: 500
              }}>
                Question {currentQuestionIndex + 1} sur {QUESTIONS.length}
              </span>
            </div>

            <h2 style={{
              fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: '0.5rem',
              color: 'var(--color-text)'
            }}>
              {currentQuestion.title}
            </h2>

            <p style={{
              fontSize: '0.95rem',
              color: 'var(--color-text-secondary)',
              marginBottom: '2.5rem',
              lineHeight: 1.5
            }}>
              {currentQuestion.description}
            </p>

            {/* Select type questions */}
            {currentQuestion.type === 'select' && currentQuestion.options && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleAnswerSelect(option.value)}
                    style={{
                      width: '100%',
                      background: answers[currentQuestion.id] === option.value ? 'rgba(231, 173, 5, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                      border: answers[currentQuestion.id] === option.value ? '1px solid #e7ad05' : '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      boxShadow: answers[currentQuestion.id] === option.value ? '0 0 15px rgba(231, 173, 5, 0.15)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (answers[currentQuestion.id] !== option.value) {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (answers[currentQuestion.id] !== option.value) {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                      }
                    }}
                  >
                    <span style={{ fontSize: '1.5rem' }}>{option.icon}</span>
                    <span style={{ fontSize: '1rem', fontWeight: 500, color: answers[currentQuestion.id] === option.value ? '#ffffff' : 'var(--color-text-secondary)' }}>
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Text type questions */}
            {currentQuestion.type === 'text' && (
              <form onSubmit={handleTextSubmit}>
                <input
                  type="text"
                  required={currentQuestion.id === 'businessName'}
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                  placeholder={currentQuestion.placeholder}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '1.25rem 1.5rem',
                    fontSize: '1.1rem',
                    color: '#ffffff',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    marginBottom: '2rem'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#e7ad05'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
                  autoFocus
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '1.1rem',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: '#e7ad05',
                    border: 'none',
                    color: '#ffffff',
                    boxShadow: '0 4px 14px rgba(231, 173, 5, 0.3)'
                  }}
                >
                  Continuer
                </button>
              </form>
            )}
          </div>

          {/* Navigation boutons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '3rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            paddingTop: '1.5rem'
          }}>
            <button
              type="button"
              onClick={handlePrev}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              ← Précédent
            </button>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}>
              Nonalix CI
            </div>
          </div>
        </section>
      )}

      {/* ────────────────────────────────────────────────────────
          Étape 3 : ÉCRAN D'ANALYSE IA EN COURS (SIMULATION)
          ──────────────────────────────────────────────────────── */}
      {step === 'analyzing' && (
        <section className="audit-analyzing-section" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          textAlign: 'center',
          padding: '3rem var(--content-padding)',
          maxWidth: '600px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 5
        }}>
          {/* Animated Spinner with multiple rings */}
          <div style={{
            position: 'relative',
            width: '120px',
            height: '120px',
            marginBottom: '3rem'
          }}>
            {/* Outer ring */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '3px solid transparent',
              borderTopColor: '#e7ad05',
              animation: 'spin 1.5s linear infinite'
            }} />
            {/* Middle ring */}
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              right: '10px',
              bottom: '10px',
              borderRadius: '50%',
              border: '3px solid transparent',
              borderBottomColor: '#10B981',
              animation: 'spin 1.2s linear infinite reverse'
            }} />
            {/* Center dot with neon pulse */}
            <div style={{
              position: 'absolute',
              top: '40px',
              left: '40px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #e7ad05 0%, #b8860b 100%)',
              boxShadow: '0 0 20px #e7ad05',
              animation: 'pulse 1s ease-in-out infinite'
            }} />
          </div>

          <h3 style={{
            fontSize: '1.5rem',
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            marginBottom: '1rem',
            color: '#ffffff'
          }}>
            Analyse intelligente en cours
          </h3>

          {/* Steps dynamic display */}
          <div style={{
            height: '60px',
            overflow: 'hidden',
            position: 'relative',
            width: '100%'
          }}>
            {ANALYZING_STEPS.map((stepText, index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  width: '100%',
                  textAlign: 'center',
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: index === analyzingStepIndex ? '#10B981' : 'var(--color-text-muted)',
                  opacity: index === analyzingStepIndex ? 1 : 0,
                  transform: index === analyzingStepIndex ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.4s ease-in-out',
                  pointerEvents: 'none'
                }}
              >
                {stepText}
              </div>
            ))}
          </div>

          {/* Loader bar */}
          <div style={{
            width: '100%',
            height: '2px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '99px',
            marginTop: '2rem',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${((analyzingStepIndex + 1) / ANALYZING_STEPS.length) * 100}%`,
              background: '#e7ad05',
              transition: 'width 1.5s linear'
            }} />
          </div>
        </section>
      )}

      {/* ────────────────────────────────────────────────────────
          Étape 4 : LE RAPPORT D'AUDIT PREMIUM (DASHBOARD)
          ──────────────────────────────────────────────────────── */}
      {step === 'report' && (
        <section className="audit-report-section printable-report" style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '3rem var(--content-padding) 6rem var(--content-padding)',
          position: 'relative',
          zIndex: 5
        }}>
          {/* En-tête du rapport (invisible sur le site, visible à l'impression PDF) */}
          <div className="print-only-header" style={{ display: 'none', marginBottom: '2rem', borderBottom: '2px solid #000', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h1 style={{ fontSize: '1.8rem', color: '#000', fontWeight: 'bold', margin: 0 }}>NONALIX CI</h1>
                <p style={{ fontSize: '0.8rem', color: '#666', margin: '4px 0 0 0' }}>Rapport d'Audit de Maturité IA & Automatisation</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 'bold', margin: 0 }}>Destinataire : {leadForm.contactName || answers['businessName']}</p>
                <p style={{ fontSize: '0.75rem', color: '#666', margin: '2px 0 0 0' }}>Généré le : {new Date().toLocaleDateString('fr-CI')}</p>
              </div>
            </div>
          </div>

          {/* Section Introduction */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '3rem'
          }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e7ad05', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Rapport d'audit IA généré pour
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1.5rem' }}>
              <h2 style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                color: '#ffffff',
                letterSpacing: '-0.02em',
                margin: 0
              }}>
                {answers['businessName']}
              </h2>
              
              {/* PDF Button */}
              {isLeadSubmitted && (
                <button
                  onClick={handlePrint}
                  className="no-print btn-download-pdf"
                  style={{
                    background: 'rgba(231, 173, 5, 0.1)',
                    border: '1px solid rgba(231, 173, 5, 0.2)',
                    color: '#e7ad05',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(231, 173, 5, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(231, 173, 5, 0.1)';
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Télécharger le rapport PDF
                </button>
              )}
            </div>
          </div>

          {/* Grille principale : Score Global & Jauges */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            {/* Score global */}
            <GlowingCard style={{
              background: 'rgba(255, 255, 255, 0.01)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              borderRadius: '20px',
              padding: '2.5rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              minHeight: '340px'
            }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
                Score Global IA
              </span>
              
              <div style={{
                position: 'relative',
                width: '160px',
                height: '160px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                {/* SVG Circular Gauge */}
                <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="none" />
                  <circle cx="50" cy="50" r="42" stroke={displayMetrics.scores.globalScore > 75 ? '#10B981' : displayMetrics.scores.globalScore > 50 ? '#e7ad05' : '#EF4444'} strokeWidth="8" fill="none" strokeDasharray="264" strokeDashoffset={264 - (264 * displayMetrics.scores.globalScore) / 100} style={{ transition: 'stroke-dashoffset 2s ease-out' }} />
                </svg>
                <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#ffffff' }}>
                    {displayMetrics.scores.globalScore}%
                  </span>
                </div>
              </div>

              <span style={{
                fontSize: '0.85rem',
                background: displayMetrics.scores.globalScore > 75 ? 'rgba(16, 185, 129, 0.1)' : displayMetrics.scores.globalScore > 50 ? 'rgba(231, 173, 5, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: displayMetrics.scores.globalScore > 75 ? '#10B981' : displayMetrics.scores.globalScore > 50 ? '#e7ad05' : '#EF4444',
                padding: '4px 12px',
                borderRadius: '99px',
                fontWeight: 600
              }}>
                {displayMetrics.scores.globalScore > 75 ? 'Maturité Avancée' : displayMetrics.scores.globalScore > 50 ? 'Maturité Intermédiaire' : 'Maturité Initiale'}
              </span>
            </GlowingCard>

            {/* Jauges secondaires */}
            <GlowingCard style={{
              background: 'rgba(255, 255, 255, 0.01)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              borderRadius: '20px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '1.25rem'
            }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--color-text)', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem', marginBottom: '0.25rem' }}>
                Détail de l'évaluation
              </h3>

              {/* Jauge 1 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Maturité Digitale</span>
                  <span style={{ fontWeight: 'bold' }}>{displayMetrics.scores.digitalMaturity}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${displayMetrics.scores.digitalMaturity}%`, background: '#e7ad05', borderRadius: '99px' }} />
                </div>
              </div>

              {/* Jauge 2 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Potentiel d'Automatisation</span>
                  <span style={{ fontWeight: 'bold' }}>{displayMetrics.scores.automation}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${displayMetrics.scores.automation}%`, background: '#10B981', borderRadius: '99px' }} />
                </div>
              </div>

              {/* Jauge SEO */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Audit SEO / Visibilité Web</span>
                  <span style={{ fontWeight: 'bold' }}>{displayMetrics.scores.seo}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${displayMetrics.scores.seo}%`, background: '#18FFFF', borderRadius: '99px' }} />
                </div>
              </div>

              {/* Jauge 3 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Efficacité Commerciale & CRM</span>
                  <span style={{ fontWeight: 'bold' }}>{displayMetrics.scores.commercial}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${displayMetrics.scores.commercial}%`, background: '#f59e0b', borderRadius: '99px' }} />
                </div>
              </div>

              {/* Jauge 4 */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>Satisfaction Client & Support</span>
                  <span style={{ fontWeight: 'bold' }}>{displayMetrics.scores.customerSatisfaction}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${displayMetrics.scores.customerSatisfaction}%`, background: '#8b5cf6', borderRadius: '99px' }} />
                </div>
              </div>
            </GlowingCard>
          </div>

          {/* Section Estimation Financière & ROI */}
          <div style={{ marginBottom: '4rem' }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              marginBottom: '1.5rem',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              📊 Évaluation Financière des pertes
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem'
            }}>
              {/* Carte 1 : Temps perdu */}
              <div style={{
                background: 'rgba(239, 68, 68, 0.02)',
                border: '1px solid rgba(239, 68, 68, 0.15)',
                borderRadius: '16px',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <span style={{ fontSize: '0.8rem', color: '#EF4444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                  Temps perdu estimé
                </span>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '5px', fontFamily: 'var(--font-heading)' }}>
                  <NumberTicker value={displayMetrics.financials.annualHoursLost} suffix=" h" />
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  gâchées par an par l'ensemble des équipes
                </span>
              </div>

              {/* Carte 2 : Coût financier perdu */}
              <div style={{
                background: 'rgba(239, 68, 68, 0.02)',
                border: '1px solid rgba(239, 68, 68, 0.15)',
                borderRadius: '16px',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <span style={{ fontSize: '0.8rem', color: '#EF4444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                  Perte Financière
                </span>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '5px', fontFamily: 'var(--font-heading)' }}>
                  <NumberTicker value={displayMetrics.financials.annualCostLost} suffix=" FCFA" />
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  de salaire dépensés en tâches répétitives / an
                </span>
              </div>

              {/* Carte 3 : Économies potentielles */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.02)',
                border: '1px solid rgba(16, 185, 129, 0.15)',
                borderRadius: '16px',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <span style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                  Économies Récupérables
                </span>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '5px', fontFamily: 'var(--font-heading)' }}>
                  <NumberTicker value={displayMetrics.financials.annualSavingsPotential} suffix=" FCFA" />
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  de budget récupérable par l'automatisation / an
                </span>
              </div>

              {/* Carte 4 : ROI */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.02)',
                border: '1px solid rgba(16, 185, 129, 0.15)',
                borderRadius: '16px',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <span style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                  ROI Potentiel
                </span>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '5px', fontFamily: 'var(--font-heading)' }}>
                  +{displayMetrics.financials.roiPotential}%
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  de retour sur investissement moyen estimé
                </span>
              </div>
            </div>
          </div>

          {/* Section Comparatif Avant / Après (CSS graphs) */}
          <div style={{ marginBottom: '4rem' }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              marginBottom: '1.5rem',
              color: '#ffffff'
            }}>
              ⚖️ Comparaison : Temps passé par vos collaborateurs
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem'
            }}>
              {/* Avant Nonalix */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.01)',
                border: '1px solid rgba(255, 255, 255, 0.03)',
                borderRadius: '16px',
                padding: '1.75rem'
              }}>
                <h4 style={{ color: '#EF4444', fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Avant Nonalix CI</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Tâches administratives répétitives</span>
                      <span style={{ color: '#EF4444', fontWeight: 'bold' }}>75%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '75%', background: '#EF4444', borderRadius: '99px' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Concentration sur la croissance / Vente</span>
                      <span style={{ color: 'var(--color-text-muted)', fontWeight: 'bold' }}>25%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '25%', background: 'var(--color-text-muted)', borderRadius: '99px' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Après Nonalix */}
              <div style={{
                background: 'rgba(231, 173, 5, 0.02)',
                border: '1px solid rgba(231, 173, 5, 0.1)',
                borderRadius: '16px',
                padding: '1.75rem'
              }}>
                <h4 style={{ color: '#10B981', fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Après Nonalix CI</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Tâches administratives répétitives</span>
                      <span style={{ color: 'var(--color-text-muted)', fontWeight: 'bold' }}>15%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '15%', background: 'var(--color-text-muted)', borderRadius: '99px' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>Concentration sur la croissance / Vente</span>
                      <span style={{ color: '#10B981', fontWeight: 'bold' }}>85%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '85%', background: '#10B981', borderRadius: '99px' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Opportunités IA */}
          <div style={{ marginBottom: '4rem' }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              marginBottom: '1.5rem',
              color: '#ffffff'
            }}>
              💡 Opportunités d'Automatisation Prioritaires
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
              gap: '1.5rem'
            }}>
              {aiReportText.recommendations.map((opp: any, idx: number) => {
                const isHigh = opp.priority === 'haute';
                return (
                  <div key={idx} style={{
                    background: 'rgba(255, 255, 255, 0.01)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Glow effect for high priority */}
                    {isHigh && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '80px',
                        height: '80px',
                        background: 'radial-gradient(circle, rgba(231, 173, 5, 0.15) 0%, transparent 70%)',
                        pointerEvents: 'none'
                      }} />
                    )}

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{
                          fontSize: '0.7rem',
                          background: isHigh ? 'rgba(239, 68, 68, 0.1)' : 'rgba(231, 173, 5, 0.1)',
                          color: isHigh ? '#EF4444' : '#e7ad05',
                          border: isHigh ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(231, 173, 5, 0.2)',
                          padding: '2px 10px',
                          borderRadius: '99px',
                          fontWeight: 700,
                          textTransform: 'uppercase'
                        }}>
                          Priorité {opp.priority}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                          ⏱️ {opp.implementationTime}
                        </span>
                      </div>

                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem', color: '#ffffff' }}>
                        {opp.title}
                      </h4>

                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                        {opp.description}
                      </p>
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '15px',
                      fontSize: '0.75rem',
                      color: 'var(--color-text-muted)',
                      borderTop: '1px solid rgba(255,255,255,0.03)',
                      paddingTop: '10px'
                    }}>
                      <span>📈 Impact: <strong style={{ color: '#10B981' }}>Élevé</strong></span>
                      <span>⚙️ Effort: <strong style={{ color: '#e7ad05' }}>Modéré</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section Roadmap */}
          <div style={{ marginBottom: '4rem' }} className="page-break">
            <h3 style={{
              fontSize: '1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              marginBottom: '2rem',
              color: '#ffffff'
            }}>
              📅 Feuille de route d'implémentation IA
            </h3>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              position: 'relative',
              paddingLeft: '1.5rem',
              borderLeft: '2px solid rgba(255, 255, 255, 0.05)'
            }}>
              {/* Point 1 */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: 'calc(-1.5rem - 6px)',
                  top: '4px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#e7ad05',
                  boxShadow: '0 0 8px #e7ad05'
                }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>Jour 1 à 30 : Fondations & automatisation CRM</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  Mise en place d'un CRM structuré (ou connexion de l'existant) et automatisation des premiers formulaires de contact entrants via n8n pour supprimer la saisie manuelle.
                </p>
              </div>

              {/* Point 2 */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: 'calc(-1.5rem - 6px)',
                  top: '4px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#10B981',
                  boxShadow: '0 0 8px #10B981'
                }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>Jour 30 à 60 : Agent conversationnel WhatsApp & Web</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  Déploiement d'un agent IA intelligent entraîné sur votre catalogue de services pour qualifier les prospects et répondre à 80% des requêtes courantes 24h/24.
                </p>
              </div>

              {/* Point 3 */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: 'calc(-1.5rem - 6px)',
                  top: '4px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#f59e0b',
                  boxShadow: '0 0 8px #f59e0b'
                }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>Jour 60 à 90 : Synchronisation de la prise de RDV</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  Lien de prise de rendez-vous automatique intégré dans les conversations et formulaires, avec rappels de rappel par SMS / WhatsApp pour éliminer les absences.
                </p>
              </div>

              {/* Point 4 */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: 'calc(-1.5rem - 6px)',
                  top: '4px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#8b5cf6',
                  boxShadow: '0 0 8px #8b5cf6'
                }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>Au-delà de 3 mois : Automatisation documentaire & IA marketing</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  Automatisation de la génération de factures/devis, création de contenu assistée par IA et campagnes publicitaires intelligentes.
                </p>
              </div>
            </div>
          </div>

          {/* Section Recommandations écrites IA */}
          <div style={{ marginBottom: '4rem' }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              marginBottom: '1.5rem',
              color: '#ffffff'
            }}>
              ✍️ Recommandations & Analyse de l'IA
            </h3>

            <div style={{
              background: 'rgba(255, 255, 255, 0.01)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              borderRadius: '16px',
              padding: '2rem'
            }}>
              <p style={{ fontSize: '1rem', color: '#ffffff', fontStyle: 'italic', lineHeight: 1.6, marginBottom: '2rem' }}>
                "{aiReportText.summary}"
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '2rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                paddingTop: '2rem'
              }}>
                {/* Risques */}
                <div>
                  <h4 style={{ color: '#EF4444', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Risques liés au statu quo
                  </h4>
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {aiReportText.risks.map((risk: string, i: number) => (
                      <li key={i}>{risk}</li>
                    ))}
                  </ul>
                </div>

                {/* Gains */}
                <div>
                  <h4 style={{ color: '#10B981', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Gains d'efficacité attendus
                  </h4>
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {aiReportText.gains.map((gain: string, i: number) => (
                      <li key={i}>{gain}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────
              Étape 5 : COLLECTE DE PROSPECTS ET OBTENTION DU PDF
              ──────────────────────────────────────────────────────── */}
          <div className="no-print" style={{
            marginTop: '5rem',
            background: 'linear-gradient(135deg, rgba(231, 173, 5, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%)',
            border: '1px solid rgba(231, 173, 5, 0.15)',
            borderRadius: '24px',
            padding: '3rem var(--content-padding)',
            textAlign: 'center'
          }}>
            {!isLeadSubmitted ? (
              <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <span style={{ fontSize: '2rem', marginBottom: '1rem', display: 'block' }}>📄</span>
                <h3 style={{
                  fontSize: '1.75rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  marginBottom: '10px',
                  color: '#ffffff'
                }}>
                  Téléchargez votre Rapport d'Audit Complet PDF
                </h3>
                <p style={{
                  fontSize: '0.95rem',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '2.5rem',
                  lineHeight: 1.6
                }}>
                  Saisissez vos coordonnées pour recevoir votre plan d'action d'automatisation détaillé par e-mail, débloquer le téléchargement PDF immédiat et planifier un appel stratégique offert de 15 min avec un expert Nonalix CI.
                </p>

                <form onSubmit={handleLeadSubmit} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  textAlign: 'left'
                }}>
                  {/* Honeypot anti-bot : invisible et inatteignable au clavier pour un humain */}
                  <div style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
                    <label htmlFor="audit-ia-honeypot">Ne pas remplir</label>
                    <input
                      id="audit-ia-honeypot"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={leadForm.honeypot}
                      onChange={(e) => setLeadForm((prev) => ({ ...prev, honeypot: e.target.value }))}
                    />
                  </div>

                  {/* Nom complet */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                      Votre Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Kouamé Koffi"
                      value={leadForm.contactName}
                      onChange={(e) => setLeadForm((prev) => ({ ...prev, contactName: e.target.value }))}
                      style={{
                        width: '100%',
                        background: 'rgba(0, 0, 0, 0.2)',
                        border: leadErrors.contactName ? '1px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        fontSize: '0.95rem',
                        color: '#ffffff',
                        outline: 'none'
                      }}
                    />
                    {leadErrors.contactName && <span style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{leadErrors.contactName}</span>}
                  </div>

                  {/* Email */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                      Votre Adresse e-mail *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Ex: kouame@entreprise.ci"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm((prev) => ({ ...prev, email: e.target.value }))}
                      style={{
                        width: '100%',
                        background: 'rgba(0, 0, 0, 0.2)',
                        border: leadErrors.email ? '1px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        fontSize: '0.95rem',
                        color: '#ffffff',
                        outline: 'none'
                      }}
                    />
                    {leadErrors.email && <span style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{leadErrors.email}</span>}
                  </div>

                  {/* Téléphone WhatsApp */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                      Numéro WhatsApp / Téléphone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: 07 07 07 07 07"
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm((prev) => ({ ...prev, phone: e.target.value }))}
                      style={{
                        width: '100%',
                        background: 'rgba(0, 0, 0, 0.2)',
                        border: leadErrors.phone ? '1px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        fontSize: '0.95rem',
                        color: '#ffffff',
                        outline: 'none'
                      }}
                    />
                    {leadErrors.phone && <span style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>{leadErrors.phone}</span>}
                  </div>

                  {/* RGPD Consent */}
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginTop: '10px' }}>
                    <input
                      type="checkbox"
                      id="consent"
                      checked={leadForm.consent}
                      onChange={(e) => setLeadForm((prev) => ({ ...prev, consent: e.target.checked }))}
                      style={{ marginTop: '4px', width: '16px', height: '16px' }}
                    />
                    <label htmlFor="consent" style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.4, cursor: 'pointer' }}>
                      J'accepte que Nonalix CI traite mes données afin de générer cet audit et me recontacte pour m'accompagner dans mes projets d'automatisation et de développement. *
                    </label>
                  </div>
                  {leadErrors.consent && <span style={{ color: '#EF4444', fontSize: '0.75rem', display: 'block' }}>{leadErrors.consent}</span>}

                  <ShimmerButton
                    type="submit"
                    as="button"
                    className="lead-submit-btn"
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: 700,
                      marginTop: '1.5rem'
                    }}
                  >
                    {isSubmittingLead ? "Génération du rapport en cours..." : "Télécharger mon plan d'action d'automatisation IA"}
                  </ShimmerButton>
                </form>
              </div>
            ) : (
              <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <span style={{ fontSize: '3rem', marginBottom: '1.5rem', display: 'block' }}>🎉</span>
                <h3 style={{
                  fontSize: '1.75rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  marginBottom: '10px',
                  color: '#10B981'
                }}>
                  Votre audit a été envoyé avec succès !
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '2.5rem',
                  lineHeight: 1.6
                }}>
                  Un email contenant l'ensemble de votre rapport d'audit et votre plan d'action d'automatisation personnalisé a été envoyé à l'adresse <strong>{leadForm.email}</strong>.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '15px' }}>
                  <button
                    onClick={handlePrint}
                    style={{
                      background: '#e7ad05',
                      border: 'none',
                      color: '#ffffff',
                      padding: '12px 28px',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(231, 173, 5, 0.3)'
                    }}
                  >
                    🖨️ Imprimer / Enregistrer en PDF
                  </button>

                  <a
                    href={`https://wa.me/2250706906930?text=Bonjour%20NONALIX%20CI,%20je%20viens%20de%20recevoir%20mon%20rapport%20d'audit%20IA%20(Score:%20${displayMetrics.scores.globalScore}/100)%20pour%20mon%20entreprise%20${answers['businessName']}%20et%20j'aimerais%20en%20discuter.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: '#10B981',
                      color: '#ffffff',
                      padding: '12px 28px',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    💬 Discuter sur WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Section FAQ SEO en fin de page */}
          <div className="no-print" style={{ marginTop: '6rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '4rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '2rem', textAlign: 'center' }}>
              ❓ Questions Fréquentes sur l'Audit IA
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>Comment le score d'automatisation est-il calculé ?</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  Notre outil évalue l'utilisation de vos logiciels métier (comme les CRM), vos méthodes de communication client (notamment WhatsApp) et le degré d'intervention humaine dans la prise de rendez-vous ou le service client. Plus vos flux sont intégrés, plus votre score est élevé.
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>D'où proviennent les estimations financières de pertes ?</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  Elles sont basées sur le nombre de collaborateurs de votre structure, le temps hebdomadaire moyen estimé passé sur des tâches non productives (copier-coller Excel, relances, tri de mails) et le salaire de référence de votre marché.
                </p>
              </div>

              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>Comment mettre en œuvre la feuille de route recommandée ?</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                  Nonalix CI vous accompagne de A à Z. Nos ingénieurs conçoivent et déploient vos workflows sur n8n, intègrent des agents IA conversationnels WhatsApp personnalisés et configurent vos CRM. Contactez-nous par WhatsApp ou téléphone pour en discuter gratuitement.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ────────────────────────────────────────────────────────
          STYLES CSS SPECIFIQUES (Transitions & Impression PDF)
          ──────────────────────────────────────────────────────── */}
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(0.97); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Styles CSS spécifiques pour l'impression du PDF */
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          
          /* Cacher les éléments non imprimables */
          .no-print, 
          header, 
          footer,
          .absolute,
          .particles-container {
            display: none !important;
          }
          
          .printable-report {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            background: #ffffff !important;
            color: #000000 !important;
          }

          /* Forcer le texte noir et enlever les gradients sur fond sombre */
          .printable-report h2,
          .printable-report h3,
          .printable-report h4,
          .printable-report span,
          .printable-report p,
          .printable-report li,
          .printable-report strong {
            color: #000000 !important;
            background: none !important;
            -webkit-text-fill-color: initial !important;
          }

          /* Forcer les bordures et fonds clairs pour l'impression */
          .glowing-card, 
          .printable-report div[style*="background"] {
            background: #f8fafc !important;
            border: 1px solid #cbd5e1 !important;
            box-shadow: none !important;
            color: #000000 !important;
          }

          /* En-tête imprimable */
          .print-only-header {
            display: block !important;
          }
          
          /* Sauts de page propres */
          .page-break {
            page-break-before: always;
            margin-top: 2cm;
          }
          
          /* Ajustements des grilles pour l'impression A4 portrait */
          .printable-report div[style*="grid-template-columns"] {
            grid-template-columns: 1fr 1fr !important;
            gap: 1cm !important;
          }
        }
      `}</style>
    </main>
  );
}
