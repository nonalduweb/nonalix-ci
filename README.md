# NONALIX CI — Site Web Professionnel

## 🏢 À propos

Site web professionnel de **NONALIX CI SARL** — Agence de Marketing Digital, Automatisation par Intelligence Artificielle et Commerce Électronique basée à Abidjan, Côte d'Ivoire.

## 🛠️ Stack Technique

- **Frontend** : Next.js 15 (App Router, TypeScript, SSR/ISR)
- **Backend** : FastAPI (Python) — Phase 2
- **Base de données** : PostgreSQL (via Prisma ORM)
- **Paiements** : Orange Money + Wave (APIs opérateurs directes)

## 📁 Structure

```
nonalix-ci/
├── frontend/          # Application Next.js
│   ├── src/
│   │   ├── app/       # Pages et API Routes
│   │   ├── components/ # Composants React
│   │   ├── lib/       # Utilitaires et logique métier
│   │   ├── data/      # Données de démo
│   │   └── types/     # Types TypeScript
│   └── prisma/        # Schéma de base de données
│
└── backend/           # API FastAPI (Phase 2)
    └── app/           # Application Python
```

## 🚀 Démarrage Rapide

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Le site sera accessible sur `http://localhost:3000`.

### Configuration des paiements

1. Obtenir vos clés marchand Orange Money et/ou Wave
2. Les ajouter dans `frontend/.env.local` :
   ```
   ORANGE_MONEY_API_KEY=votre_cle
   WAVE_API_KEY=votre_cle
   ```
3. Redémarrer le serveur

Sans clés, le site fonctionne en **mode simulation** (les commandes sont enregistrées mais aucun paiement réel n'est effectué).

### Base de données PostgreSQL

```bash
cd frontend
npx prisma migrate dev --name init
npx prisma generate
```

## 📱 Fonctionnalités

- ✅ Site vitrine B2B (Services Agence)
- ✅ Boutique E-commerce B2C
- ✅ Paiement Mobile Money (Orange Money, Wave)
- ✅ Paiement à la livraison
- ✅ Bouton WhatsApp flottant (+225 07 06 90 69 30)
- ✅ Formulaire de contact avec masque téléphone ivoirien
- ✅ Démo IA interactive
- ✅ Footer légal (RCCM, IDU)
- ✅ SEO optimisé (Meta tags, Open Graph, sémantique HTML)
- ✅ Mobile-first, optimisé < 2s sur 3G

## 📞 Contact

- WhatsApp : [+225 07 06 90 69 30](https://wa.me/2250706906930)
- Email : contact@nonalix.ci
- Web : https://nonalix.ci

---

© 2026 NONALIX CI SARL. Tous droits réservés.
