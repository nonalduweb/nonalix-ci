import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendAdminLeadNotification, sendUserAuditNotification } from '@/lib/mailer';
import { notifyNewLead } from '@/lib/n8n-webhooks';

export const maxDuration = 30; // Permet jusqu'à 30s d'exécution pour l'IA

function cleanJSONResponse(text: string): string {
  let clean = text.trim();
  if (clean.startsWith('```')) {
    clean = clean.replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```$/, '');
  }
  return clean.trim();
}

// Fonction de calcul de scores déterministes basés sur les réponses
function calculateBaseScores(data: any) {
  const employeesMap: Record<string, number> = {
    '1-5': 3,
    '6-20': 13,
    '21-50': 35,
    '51-200': 125,
    '200+': 300
  };
  const hoursMap: Record<string, number> = {
    'under-2': 1,
    '2-5': 3.5,
    '5-10': 7.5,
    '10plus': 12
  };
  const salaryMap: Record<string, number> = {
    '150k': 150000,
    '300k': 300000,
    '600k': 600000,
    '1500k': 1500000
  };

  const numEmployees = employeesMap[data.employees] || 3;
  const hoursLost = hoursMap[data.hoursLostPerWeek] || 3.5;
  const avgSalary = salaryMap[data.averageSalary] || 300000;

  // Calcul du temps perdu
  const weeklyHoursLost = numEmployees * hoursLost;
  const monthlyHoursLost = weeklyHoursLost * 4.33;
  const annualHoursLost = weeklyHoursLost * 52;

  // Calcul du coût financier (salaire moyen / 160h par mois = coût horaire estimé)
  const hourlyCost = avgSalary / 160;
  const monthlyCostLost = monthlyHoursLost * hourlyCost;
  const annualCostLost = annualHoursLost * hourlyCost;

  // Temps récupérable avec l'automatisation IA Nonalix (75% d'efficacité)
  const annualHoursRecoverable = annualHoursLost * 0.75;
  const annualSavingsPotential = annualCostLost * 0.75;

  // Estimation du ROI (coût estimé de l'implémentation vs économies sur 1 an)
  // ROI moyen estimé à 450%
  const roiPotential = 450;

  // Calcul des scores de maturité (0-100)
  // 1. Automatisation (CRM, Whatsapp, Calendrier, Service Client)
  let automationScore = 20;
  if (data.hasCrm === 'yes') automationScore += 20;
  if (data.hasWhatsappBusiness === 'yes') automationScore += 15;
  if (data.calendarMode === 'automated') automationScore += 20;
  if (data.customerService === 'chatbot') automationScore += 25;
  else if (data.customerService === 'auto-reply') automationScore += 10;

  // 2. Maturité Digitale (IA, Budget, Objectifs)
  let digitalMaturityScore = 15;
  if (data.iaMaturity === 'regular' || data.iaMaturity === 'integrated') digitalMaturityScore += 30;
  else if (data.iaMaturity === 'rarely') digitalMaturityScore += 15;
  
  if (data.digitalBudget === '500k-2m' || data.digitalBudget === '2mplus') digitalMaturityScore += 25;
  else if (data.digitalBudget === '100k-500k') digitalMaturityScore += 15;

  if (data.acquisitionStrategy === 'seo-content' || data.acquisitionStrategy === 'ads') digitalMaturityScore += 30;
  else if (data.acquisitionStrategy === 'social') digitalMaturityScore += 15;

  // 3. Potentiel Commercial & Support
  let commercialScore = 30;
  if (data.hasCrm === 'yes') commercialScore += 25;
  if (data.calendarMode === 'automated') commercialScore += 25;
  if (data.hasWhatsappBusiness === 'yes') commercialScore += 20;

  // 4. Potentiel SEO
  let seoScore = 15;
  if (data.website && data.website.trim() !== '') {
    seoScore = 55;
    if (data.acquisitionStrategy === 'seo-content') seoScore += 30;
    if (data.digitalBudget === '500k-2m' || data.digitalBudget === '2mplus') seoScore += 10;
  }

  // 5. Score Global IA & Automatisation
  const globalScore = Math.round(
    (automationScore * 0.4) + 
    (digitalMaturityScore * 0.3) + 
    (commercialScore * 0.2) + 
    (seoScore * 0.1)
  );

  return {
    financials: {
      weeklyHoursLost: Math.round(weeklyHoursLost),
      monthlyHoursLost: Math.round(monthlyHoursLost),
      annualHoursLost: Math.round(annualHoursLost),
      monthlyCostLost: Math.round(monthlyCostLost),
      annualCostLost: Math.round(annualCostLost),
      annualHoursRecoverable: Math.round(annualHoursRecoverable),
      annualSavingsPotential: Math.round(annualSavingsPotential),
      roiPotential,
    },
    scores: {
      globalScore: Math.min(Math.max(globalScore, 10), 98),
      digitalMaturity: Math.min(Math.max(digitalMaturityScore, 10), 98),
      automation: Math.min(Math.max(automationScore, 10), 98),
      seo: Math.min(Math.max(seoScore, 10), 98),
      marketing: Math.min(Math.max(digitalMaturityScore + 5, 10), 98),
      commercial: Math.min(Math.max(commercialScore, 10), 98),
      security: Math.min(Math.max(automationScore > 60 ? 80 : 50, 10), 98),
      productivity: Math.min(Math.max(100 - (hoursLost * 8), 10), 98),
      customerSatisfaction: Math.min(Math.max(data.customerService === 'chatbot' ? 90 : data.customerService === 'auto-reply' ? 70 : 45, 10), 98),
    }
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      businessName,
      industry,
      country,
      employees,
      website,
      hasCrm,
      hasWhatsappBusiness,
      calendarMode,
      customerService,
      hoursLostPerWeek,
      averageSalary,
      acquisitionStrategy,
      digitalBudget,
      iaMaturity,
      mainGoal,
      contactName,
      email,
      phone,
      consent
    } = body;

    // Validation minimale pour la capture de lead
    if (!contactName || !email || !phone || !businessName || !consent) {
      return NextResponse.json(
        { error: 'Veuillez remplir tous les champs obligatoires et accepter le consentement' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\s/g, '');

    // 1. Calculs financiers et scores de base
    const baseMetrics = calculateBaseScores(body);

    // 2. Génération IA via OpenAI (ou Fallback si clé absente/invalide)
    let aiAnalysis: any = null;

    if (process.env.OPENAI_API_KEY) {
      const prompt = `Tu es un consultant en intelligence artificielle et transformation digitale senior pour Nonalix CI.
Analyse les réponses de l'entreprise "${businessName}" (Secteur: ${industry}, Pays: ${country}, Nombre d'employés: ${employees}, Budget digital: ${digitalBudget}) pour rédiger des recommandations sur-mesure d'automatisation.

Réponses clés fournies :
- Site Web : ${website || 'Aucun'}
- Utilisation de CRM : ${hasCrm}
- WhatsApp Business : ${hasWhatsappBusiness}
- Gestion des rendez-vous : ${calendarMode}
- Support client : ${customerService}
- Tâches répétitives / heures perdues : ${hoursLostPerWeek}
- Budget digital : ${digitalBudget}
- Utilisation actuelle de l'IA : ${iaMaturity}
- Objectif principal : ${mainGoal}

Génère un plan d'action d'automatisation IA au format JSON brut avec les clés suivantes :
{
  "summary": "<un résumé percutant de 3-4 phrases en français sur le retard/potentiel d'automatisation de l'entreprise et la valeur qu'elle perd>",
  "recommendations": [
    {
      "title": "<Titre de l'action conseillée (ex: Intégration d'un chatbot WhatsApp IA, automatisation CRM avec n8n)>",
      "description": "<explication claire et actionnable spécifique à l'entreprise>",
      "priority": "haute" | "moyenne" | "faible",
      "implementationTime": "30 jours" | "60 jours" | "90 jours"
    }
  ],
  "marketInsight": "<un conseil stratégique ancré dans le marché de ${country} et le secteur ${industry} en français (2-3 phrases)>",
  "risks": [
    "<risque d'inaction 1 (ex: perte de parts de marché, coûts de main-d'œuvre élevés)>",
    "<risque d'inaction 2>"
  ],
  "gains": [
    "<gain concret 1 (ex: temps de réponse client divisé par 10)>",
    "<gain concret 2>"
  ]
}

Retourne UNIQUEMENT le JSON brut valide sans aucun code block (pas de \`\`\`json ou de \`\`\`), sans texte avant ou après.`;

      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3
          }),
          signal: AbortSignal.timeout(10000)
        });

        if (response.ok) {
          const resData = await response.json();
          const rawText = resData.choices[0].message.content;
          const cleanJsonText = cleanJSONResponse(rawText);
          aiAnalysis = JSON.parse(cleanJsonText);
        } else {
          throw new Error(`OpenAI API status ${response.status}`);
        }
      } catch (err) {
        console.error("[AUDIT-IA LLM ERROR] Fallback sur les recommandations statiques", err);
      }
    }

    // Fallback si OpenAI a échoué ou n'est pas configuré
    if (!aiAnalysis) {
      aiAnalysis = {
        summary: `L'entreprise ${businessName} évoluant dans le secteur ${industry} présente un potentiel d'automatisation IA très élevé. En optimisant les processus de traitement documentaire, de relation client et de gestion administrative, vous pourriez libérer des centaines d'heures par an pour vous concentrer sur votre croissance à ${country}.`,
        recommendations: [
          {
            title: hasCrm === 'no' ? "Mise en place d'un CRM moderne avec automatisation n8n" : "Optimisation et workflows automatiques sur votre CRM",
            description: hasCrm === 'no' 
              ? "Installez un CRM connecté à vos formulaires web et WhatsApp pour centraliser et attribuer automatiquement chaque lead sans saisie manuelle."
              : "Connectez votre CRM à vos autres outils (facturation, e-mails) via n8n pour éviter les copier-coller répétitifs.",
            priority: "haute",
            implementationTime: "30 jours"
          },
          {
            title: customerService !== 'chatbot' ? "Déploiement d'un agent conversationnel WhatsApp & Web IA 24/7" : "Amélioration de votre chatbot client",
            description: customerService !== 'chatbot'
              ? "Automatisez 80% des requêtes récurrentes (tarifs, horaires, questions fréquentes) avec un chatbot intelligent connecté à votre base de connaissances."
              : "Ajoutez un moteur IA de lead scoring pour classifier automatiquement la valeur de vos contacts WhatsApp.",
            priority: "haute",
            implementationTime: "60 jours"
          },
          {
            title: calendarMode !== 'automated' ? "Automatisation de la prise de rendez-vous commerciale" : "Relances et suivis automatiques post-RDV",
            description: calendarMode !== 'automated'
              ? "Mettez en place un lien de réservation interactif synchronisé avec vos agendas (Cal.com/Calendly) et envoyez des SMS/WhatsApp de rappel automatiques."
              : "Créez une séquence d'e-mails et de messages WhatsApp automatiques pour relancer vos clients après un rendez-vous.",
            priority: "moyenne",
            implementationTime: "30 jours"
          }
        ],
        marketInsight: `Dans le secteur ${industry} en Côte d'Ivoire et Afrique de l'Ouest, les entreprises qui adoptent les agents IA et l'automatisation n8n constatent une réduction de 75% du temps d'administration et une hausse de 35% de leur taux de conversion commercial.`,
        risks: [
          "Temps de réponse client trop long entraînant la perte de prospects qualifiés au profit de concurrents plus réactifs.",
          "Coûts salariaux élevés consacrés à des tâches à faible valeur ajoutée (saisie, relances, factures).",
          "Erreurs humaines récurrentes dans le suivi des dossiers et la mise à jour des fichiers Excel."
        ],
        gains: [
          "Jusqu'à 75% du temps administratif libéré pour vos équipes.",
          "Disponibilité client 24h/24 et 7j/7 sans coût salarial additionnel.",
          "Suivi prospect automatisé pour maximiser le taux de signature commerciale."
        ]
      };
    }

    // 3. Sauvegarde en Base de Données Prisma
    const leadMessage = `Rapport d'audit IA personnalisé pour ${businessName}.
Secteur: ${industry} | Pays: ${country} | Employés: ${employees}
Score Global IA: ${baseMetrics.scores.globalScore}/100
Maturité Digitale: ${baseMetrics.scores.digitalMaturity}/100
Potentiel d'Automatisation: ${baseMetrics.scores.automation}/100
Pertes Financières estimées: ${new Intl.NumberFormat('fr-CI').format(baseMetrics.financials.annualCostLost)} FCFA / an
Économies Potentielles estimées: ${new Intl.NumberFormat('fr-CI').format(baseMetrics.financials.annualSavingsPotential)} FCFA / an
Temps récupérable estimé: ${baseMetrics.financials.annualHoursRecoverable} heures / an
Résumé IA: ${aiAnalysis.summary}`;

    const lead = await prisma.contactLead.create({
      data: {
        firstName: contactName,
        lastName: 'Audit IA Gratuit',
        email: email,
        phone: cleanPhone,
        message: leadMessage,
        type: 'audit-ia',
        company: businessName,
        status: 'new',
      },
    });

    console.log('[AUDIT IA LEAD SAVED]', lead.id);

    // 4. Notification Admin par email
    await sendAdminLeadNotification({
      id: lead.id,
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      message: `${lead.message}\n\nRecommandations:\n${aiAnalysis.recommendations.map((r: any) => `- [${r.priority.toUpperCase()}] ${r.title} (Temps: ${r.implementationTime}): ${r.description}`).join('\n')}\n\nRisques d'inaction:\n${aiAnalysis.risks.map((r: string) => `- ${r}`).join('\n')}\n\nGains attendus:\n${aiAnalysis.gains.map((g: string) => `- ${g}`).join('\n')}`,
      type: lead.type,
      company: lead.company,
    });

    // 5. Notification User par email (Rapport d'audit structuré)
    // On adapte le modèle pour correspondre à la signature de sendUserAuditNotification
    await sendUserAuditNotification(
      {
        businessName: lead.company || 'N/A',
        email: lead.email!,
        phone: lead.phone,
        type: lead.type,
        company: lead.company || 'N/A'
      },
      {
        globalScore: baseMetrics.scores.globalScore,
        seoScore: baseMetrics.scores.seo,
        mobileScore: baseMetrics.scores.automation, // Mappé sur l'automatisation
        speedScore: baseMetrics.scores.digitalMaturity, // Mappé sur la maturité
        securityScore: baseMetrics.scores.security,
        summary: aiAnalysis.summary,
        recommendations: aiAnalysis.recommendations.map((r: any) => ({
          title: r.title,
          description: r.description,
          priority: r.priority
        })),
        marketInsight: `${aiAnalysis.marketInsight}\n\nEstimation de vos pertes actuelles : ${new Intl.NumberFormat('fr-CI').format(baseMetrics.financials.annualCostLost)} FCFA par an (${baseMetrics.financials.annualHoursLost} heures de travail gâchées).\n\nGrâce à l'automatisation par Nonalix CI, vous pouvez économiser jusqu'à ${new Intl.NumberFormat('fr-CI').format(baseMetrics.financials.annualSavingsPotential)} FCFA par an et récupérer ${baseMetrics.financials.annualHoursRecoverable} heures de temps productif.`
      }
    );

    // 6. Webhook n8n non bloquant
    notifyNewLead({
      leadId: lead.id,
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email!,
      phone: lead.phone,
      message: lead.message,
      type: 'audit-ia',
      company: lead.company,
      auditScore: baseMetrics.scores.globalScore,
      auditUrl: website || 'N/A'
    });

    return NextResponse.json({
      status: 'success',
      leadId: lead.id,
      metrics: baseMetrics,
      aiAnalysis
    });

  } catch (error: any) {
    console.error('[API AUDIT IA ERROR]', error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'analyse IA. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
