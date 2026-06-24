import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendAdminLeadNotification, sendUserAuditNotification } from '@/lib/mailer';
import { getSessionUser } from '@/lib/auth-server';
import { notifyNewLead } from '@/lib/n8n-webhooks';

export const maxDuration = 30; // Permet jusqu'à 30s d'exécution pour l'IA (Vercel/Hostinger)

/**
 * Nettoie une chaîne pour extraire du JSON valide au cas où l'IA renverrait des balises markdown
 */
function cleanJSONResponse(text: string): string {
  let clean = text.trim();
  if (clean.startsWith('```')) {
    clean = clean.replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```$/, '');
  }
  return clean.trim();
}

/**
 * Analyse technique basique d'un site web à partir de son code HTML
 */
async function fetchAndAnalyzeSite(targetUrl: string) {
  const seoData = {
    statusCode: 200,
    responseTimeMs: 0,
    hasTitle: false,
    titleLength: 0,
    titleContent: '',
    hasMetaDescription: false,
    metaDescriptionLength: 0,
    metaDescriptionContent: '',
    h1Count: 0,
    firstH1Content: '',
    hasViewport: false,
    isHttps: targetUrl.startsWith('https://'),
    totalImages: 0,
    imagesWithoutAlt: 0,
  };

  const startTime = Date.now();
  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      next: { revalidate: 0 } // Pas de cache
    });

    seoData.responseTimeMs = Date.now() - startTime;
    seoData.statusCode = response.status;

    if (!response.ok) {
      throw new Error(`Statut HTTP non-OK : ${response.status}`);
    }

    const html = await response.text();

    // 1. Title
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      seoData.hasTitle = true;
      seoData.titleContent = titleMatch[1].trim();
      seoData.titleLength = seoData.titleContent.length;
    }

    // 2. Meta Description
    const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) || 
                      html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
    if (descMatch && descMatch[1]) {
      seoData.hasMetaDescription = true;
      seoData.metaDescriptionContent = descMatch[1].trim();
      seoData.metaDescriptionLength = seoData.metaDescriptionContent.length;
    }

    // 3. Viewport (mobile friendliness)
    seoData.hasViewport = /<meta[^>]+name=["']viewport["']/i.test(html);

    // 4. H1 tag count
    const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
    seoData.h1Count = h1Matches.length;
    const firstH1 = h1Matches[0];
    if (firstH1) {
      // Nettoyer les balises internes du premier H1
      seoData.firstH1Content = firstH1.replace(/<[^>]+>/g, '').trim();
    }

    // 5. Images and Alt attributes
    const imgMatches = html.match(/<img[^>]+>/gi) || [];
    seoData.totalImages = imgMatches.length;
    let missingAlt = 0;
    imgMatches.forEach(img => {
      if (!/alt=["']/i.test(img) || /alt=["']\s*["']/i.test(img)) {
        missingAlt++;
      }
    });
    seoData.imagesWithoutAlt = missingAlt;

  } catch (error: any) {
    console.error(`[AUDIT TECH ERROR] Impossible d'analyser l'URL ${targetUrl}:`, error.message);
    seoData.statusCode = 500;
    seoData.responseTimeMs = Date.now() - startTime;
  }

  return seoData;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, businessName, email, phone, consent, type, sendWhatsApp } = body;

    // Validation des champs
    if (!businessName || !email || !phone || !consent) {
      return NextResponse.json(
        { error: 'Veuillez remplir tous les champs obligatoires' },
        { status: 400 }
      );
    }

    // Validation du format d'email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Adresse e-mail invalide' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\s/g, '');
    const isWebAudit = type === 'audit-site-web';

    // Récupérer l'utilisateur connecté
    const user = await getSessionUser();

    if (!user) {
      // Cas Anonyme : Vérifier si cet email ou téléphone a déjà fait un audit
      const existingLead = await prisma.contactLead.findFirst({
        where: {
          OR: [
            { email: email },
            { phone: cleanPhone }
          ],
          type: {
            in: ['audit-site-web', 'audit-google-business']
          }
        }
      });

      if (existingLead) {
        return NextResponse.json(
          { 
            error: 'LIMIT_REACHED_ANON', 
            message: "Vous avez déjà bénéficié de votre audit gratuit en tant qu'invité. Veuillez créer un compte ou vous connecter, puis souscrire à un abonnement pour continuer." 
          },
          { status: 403 }
        );
      }
    } else {
      // Cas Connecté : Compter le nombre d'audits réalisés par cet utilisateur
      const auditsCount = await prisma.contactLead.count({
        where: {
          email: user.email,
          type: {
            in: ['audit-site-web', 'audit-google-business']
          }
        }
      });

      if (auditsCount >= 1) {
        // Vérifier si l'abonnement est actif
        const isSubscribed = user.isSubscribed && 
                            user.subscriptionExpiresAt && 
                            new Date(user.subscriptionExpiresAt) > new Date();
        
        if (!isSubscribed) {
          return NextResponse.json(
            { 
              error: 'SUBSCRIPTION_REQUIRED', 
              message: "Abonnement requis. Vous avez déjà bénéficié de votre premier audit gratuit. Pour continuer à analyser vos sites en illimité, veuillez activer votre abonnement Premium pour 5 000 FCFA / mois." 
            },
            { status: 403 }
          );
        }
      }
    }

    let targetUrl = url ? url.trim() : '';
    if (isWebAudit && !targetUrl) {
      return NextResponse.json(
        { error: "L'URL de votre site est requise pour cet audit" },
        { status: 400 }
      );
    }

    // Formater l'URL si elle ne commence pas par http
    if (isWebAudit && !/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }

    let auditResult: any = null;

    if (isWebAudit) {
      // 1. Analyse technique réelle
      console.log(`[AUDIT] Analyse technique de ${targetUrl}...`);
      const seoData = await fetchAndAnalyzeSite(targetUrl);

      // 2. Génération IA
      console.log(`[AUDIT] Génération de l'analyse IA pour ${businessName} (${targetUrl})...`);
      
      const prompt = `Tu es un expert en SEO, performance web et stratégie marketing digital local et international.
Analyse les données techniques suivantes pour le site web ${targetUrl} de l'entreprise ${businessName} :
- URL: ${targetUrl}
- HTTPS: ${seoData.isHttps ? 'Oui' : 'Non'}
- Temps de réponse serveur: ${seoData.responseTimeMs} ms (HTTP Status: ${seoData.statusCode})
- Balise Title: ${seoData.hasTitle ? `Oui ("${seoData.titleContent}", ${seoData.titleLength} caractères)` : 'Non (Absente)'}
- Balise Meta Description: ${seoData.hasMetaDescription ? `Oui ("${seoData.metaDescriptionContent}", ${seoData.metaDescriptionLength} caractères)` : 'Non (Absente)'}
- Nombre de H1: ${seoData.h1Count} (Premier H1: "${seoData.firstH1Content}")
- Balise Viewport (Mobile-Friendly): ${seoData.hasViewport ? 'Présente' : 'Absente'}
- Images: ${seoData.totalImages} images au total, dont ${seoData.imagesWithoutAlt} sans attribut 'alt'.

Génère un rapport d'audit SEO & IA de haute qualité, au format JSON brut avec les clés suivantes :
{
  "globalScore": <nombre entier entre 10 et 98 basé sur les résultats techniques>,
  "seoScore": <nombre entier entre 10 et 98>,
  "mobileScore": <nombre entier entre 10 et 98 (pénaliser fortement si la balise viewport est absente)>,
  "speedScore": <nombre entier entre 10 et 98 (pénaliser si le temps de réponse est supérieur à 1500ms)>,
  "securityScore": <nombre entier entre 10 et 98 (pénaliser si HTTPS est absent)>,
  "summary": "<résumé synthétique de l'état actuel et de sa visibilité en ligne (2-3 phrases)>",
  "recommendations": [
    {
      "title": "<titre court en français>",
      "description": "<explication claire et actionnable pour l'améliorer>",
      "priority": "haute" | "moyenne" | "faible"
    }
  ],
  "marketInsight": "<perspective marketing spécifique au marché cible ou au contexte local de cette entreprise>"
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
            messages: [{ role: "user", content: prompt }]
          })
        });

        if (response.ok) {
          const resData = await response.json();
          const rawText = resData.choices[0].message.content;
          const cleanJsonText = cleanJSONResponse(rawText);
          auditResult = JSON.parse(cleanJsonText);
        } else {
          throw new Error(`Erreur OpenAI API : ${response.status}`);
        }
      } catch (err) {
        console.error("[AUDIT LLM FAIL] Utilisation du rapport de secours.", err);
        // Rapport de secours
        auditResult = {
          globalScore: 65,
          seoScore: 70,
          mobileScore: seoData.hasViewport ? 85 : 40,
          speedScore: seoData.responseTimeMs < 1000 ? 90 : 60,
          securityScore: seoData.isHttps ? 95 : 20,
          summary: `L'analyse technique du site ${targetUrl} pour l'entreprise ${businessName} montre des fondations SEO fonctionnelles, mais des opportunités majeures d'optimisation sont décelées pour accroître votre visibilité locale et nationale.`,
          recommendations: [
            {
              title: "Optimiser les balises Meta",
              description: "Ajustez le titre et la description pour cibler les requêtes recherchées par vos prospects.",
              priority: "haute"
            },
            {
              title: "Sécuriser le site en HTTPS",
              description: "Assurez-vous qu'un certificat SSL valide est installé pour éviter la mention 'Non sécurisé'.",
              priority: "haute"
            },
            {
              title: "Améliorer les attributs ALT des images",
              description: "Ajoutez des descriptions alternatives à vos images pour améliorer le référencement sur Google Images.",
              priority: "moyenne"
            }
          ],
          marketInsight: "Le marché digital est très concurrentiel sur mobile. Un site rapide et sécurisé est primordial pour convertir le trafic provenant des différents canaux d'acquisition."
        };
      }
    } else {
      // Audit local Google Business
      console.log(`[AUDIT] Génération de l'audit local pour ${businessName}...`);
      const prompt = `Génère un audit local Google Business réaliste pour l'entreprise "${businessName}".
L'utilisateur a fourni le numéro de téléphone : ${cleanPhone} et l'e-mail : ${email}.

Génère un rapport d'audit au format JSON brut avec les clés suivantes :
{
  "globalScore": <nombre entier réaliste entre 45 et 85>,
  "seoScore": <référencement local score entre 40 et 90>,
  "mobileScore": <optimisation mobile score entre 50 et 90>,
  "speedScore": <score de réactivité/engagement local entre 50 et 85>,
  "securityScore": <confiance client/avis score entre 40 et 90>,
  "summary": "<résumé de la présence locale de l'entreprise et de sa visibilité sur Google Maps (2-3 phrases)>",
  "recommendations": [
    {
      "title": "<titre court en français>",
      "description": "<explication claire et actionnable pour l'optimiser>",
      "priority": "haute" | "moyenne" | "faible"
    }
  ],
  "marketInsight": "<perspective de référencement local et de croissance sur votre marché cible>"
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
            messages: [{ role: "user", content: prompt }]
          })
        });

        if (response.ok) {
          const resData = await response.json();
          const rawText = resData.choices[0].message.content;
          const cleanJsonText = cleanJSONResponse(rawText);
          auditResult = JSON.parse(cleanJsonText);
        } else {
          throw new Error(`Erreur OpenAI API : ${response.status}`);
        }
      } catch (err) {
        console.error("[AUDIT GOOGLE LLM FAIL]", err);
        auditResult = {
          globalScore: 60,
          seoScore: 55,
          mobileScore: 80,
          speedScore: 70,
          securityScore: 65,
          summary: `La présence locale de l'entreprise ${businessName} sur Google Maps et la recherche locale présente un fort potentiel d'amélioration pour capter les requêtes à proximité à Abidjan.`,
          recommendations: [
            {
              title: "Collecter des avis clients régulièrement",
              description: "Demandez activement à vos clients ivoiriens de laisser des avis 5 étoiles pour remonter dans les classements de Google Maps.",
              priority: "haute"
            },
            {
              title: "Compléter les catégories et horaires",
              description: "Vérifiez que toutes les informations (catégories exactes, horaires d'ouverture, numéro de téléphone correct) sont renseignées.",
              priority: "haute"
            },
            {
              title: "Publier des Google Updates",
              description: "Partagez régulièrement vos offres et actualités directement sur votre fiche pour stimuler l'interaction.",
              priority: "moyenne"
            }
          ],
          marketInsight: "Les consommateurs ivoiriens recherchent activement sur Google Maps pour trouver des services à Abidjan (Cocody, Marcory, Yopougon). Une fiche optimisée augmente vos appels directs de plus de 50%."
        };
      }
    }

    // 3. Sauvegarde en base de données réelle (ContactLead) via Prisma
    const leadMessage = `Rapport d'audit ${isWebAudit ? 'Site Web' : 'Google Business'} pour ${businessName}. URL/Cible: ${targetUrl || 'Google Maps'}.
Score Global: ${auditResult.globalScore}/100.
Résumé: ${auditResult.summary}`;

    const lead = await prisma.contactLead.create({
      data: {
        firstName: businessName,
        lastName: isWebAudit ? 'Audit Site Web' : 'Audit Google Business',
        email: email,
        phone: cleanPhone,
        message: leadMessage,
        type: isWebAudit ? 'audit-site-web' : 'audit-google-business',
        company: targetUrl || 'Google Business Profile',
        status: 'new',
      },
    });

    console.log('[AUDIT LEAD SAVED]', lead);

    // 4. Envoyer les notifications e-mails
    // Notification admin
    await sendAdminLeadNotification({
      id: lead.id,
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      message: `${lead.message}\n\nRecommandations:\n${auditResult.recommendations.map((r: any) => `- [${r.priority.toUpperCase()}] ${r.title}: ${r.description}`).join('\n')}`,
      type: lead.type,
      company: lead.company,
    });

    // Notification utilisateur avec le rapport complet
    await sendUserAuditNotification({
      businessName,
      email,
      phone: cleanPhone,
      type: lead.type,
      company: lead.company || targetUrl
    }, auditResult);

    // 🔗 Notifier n8n (non-bloquant)
    notifyNewLead({
      leadId: String(lead.id),
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email || '',
      phone: lead.phone,
      message: lead.message,
      type: lead.type,
      company: lead.company,
      auditScore: auditResult?.globalScore || null,
      auditUrl: isWebAudit ? (targetUrl || null) : null,
    });

    // 5. Intégration WhatsApp (Optionnelle)
    if (sendWhatsApp) {
      const waText = `*NONALIX CI — Votre Audit ${isWebAudit ? 'Site Web' : 'Google Business'}*\n\n` +
        `Bonjour *${businessName}*,\n\n` +
        `Votre audit a été généré avec succès ! 🎉\n\n` +
        `📈 *Score Global : ${auditResult.globalScore}/100*\n` +
        `🔍 SEO: ${auditResult.seoScore}/100 | Vitesse: ${auditResult.speedScore}/100 | Mobile: ${auditResult.mobileScore}/100\n\n` +
        `📝 *Résumé :* ${auditResult.summary}\n\n` +
        `💡 *Recommandation principale :* ${auditResult.recommendations[0]?.title} - ${auditResult.recommendations[0]?.description}\n\n` +
        `Le rapport complet et détaillé vous a été envoyé par email à *${email}*.\n\n` +
        `💬 Vous souhaitez optimiser votre visibilité ? Répondez directement à ce message ou contactez notre expert.`;

      // Log/Simulation d'envoi WhatsApp
      console.log(`[WHATSAPP AUDIT SIMULATION] Envoi du message à ${cleanPhone} :\n${waText}`);
      
      // Essayer d'appeler l'API WhatsApp si configurée dans l'environnement
      if (process.env.WHATSAPP_BUSINESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID) {
        try {
          const apiVersion = "v18.0";
          const waUrl = `https://graph.facebook.com/${apiVersion}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
          await fetch(waUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.WHATSAPP_BUSINESS_TOKEN}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              recipient_type: 'individual',
              to: cleanPhone,
              type: 'text',
              text: { body: waText }
            })
          });
          console.log(`[WHATSAPP AUDIT SUCCESS] Message envoyé à ${cleanPhone}`);
        } catch (waErr) {
          console.error('[WHATSAPP AUDIT SEND ERROR]', waErr);
        }
      }
    }

    return NextResponse.json({
      status: 'success',
      leadId: lead.id,
      auditResult
    });

  } catch (error: any) {
    console.error('[AUDIT ERROR]', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur lors de la génération de l\'audit' },
      { status: 500 }
    );
  }
}
