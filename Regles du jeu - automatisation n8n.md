# Règles du Jeu — Automatisation n8n · NONALIX CI

> Document de référence fondateur pour la collaboration sur les automatisations n8n.
> Toute intervention sur un workflow doit être cohérente avec ce document.

**Outils installés et actifs dans ce projet :**
- **n8n MCP Server** (`n8n-mcp` via npx) — configuré dans `.claude/settings.json`
- **n8n Skills** (15 skills) — installées dans `~/.claude/skills/`

---

## 1. Mission et périmètre

Le projet consiste à **créer, corriger et améliorer des automatisations n8n** pour NONALIX CI — agence de Marketing Digital et IA basée à Abidjan.

L'objectif n'est pas de produire des workflows "qui tournent", mais des automatisations :
- **robustes** : gestion des erreurs, retry, alertes
- **lisibles** : noms de nœuds clairs, notes explicatives sur les nœuds complexes
- **maintenables** : logique modulaire, variables centralisées
- **utiles** : chaque workflow doit résoudre un vrai problème métier mesurable

---

## 2. Accès disponibles

| Ressource | Détail |
|---|---|
| Dashboard n8n | `https://n8n.nonalix-ci.com` — accès administrateur complet |
| Tous les projets | Lecture, modification, création, suppression de workflows |
| MySQL (interne Docker) | Host `db`, port `3306`, BDD `u402981764_nonalixci` |
| Backend FastAPI | `http://backend:8000` (interne) · `https://api.nonalix-ci.com` (externe) |
| Webhooks entrants | `https://n8n.nonalix-ci.com/webhook/...` |
| VPS Ubuntu | `46.202.194.151` — réseau Docker `nonalix_net` |

---

## 3. Les deux outils — comment les utiliser ensemble

### n8n MCP Server
Package npm : `n8n-mcp` — installé via `npx` au démarrage de Claude Code.
Config : `.claude/settings.json` → entrée `n8n-mcp`.
Variables d'environnement :
- `N8N_API_URL` = `https://n8n.nonalix-ci.com`
- `N8N_API_KEY` = clé à générer depuis n8n → Settings → API → Create API Key

Connexion directe au dashboard n8n. Permet de :
- Lire les workflows existants (JSON complet)
- Créer et modifier des workflows sans passer par l'interface
- Activer / désactiver des workflows
- Lire les exécutions et les erreurs en cours
- Gérer les credentials et les projets

**Usage** : toujours commencer par lire le workflow existant via MCP avant de proposer une correction. Ne jamais supposer la structure d'un workflow sans l'avoir lu.

**Statut : MCP connecté — clé API configurée dans `.claude/settings.json`.**

### n8n Skills
Repo source : `https://github.com/czlonkowski/n8n-skills`
Installées dans : `~/.claude/skills/`

**15 skills disponibles :**
| Skill | Utilité |
|---|---|
| `n8n-agents` | Construire des agents IA dans n8n |
| `n8n-binary-and-data` | Manipulation de fichiers et données binaires |
| `n8n-code-javascript` | Nœuds Code JS |
| `n8n-code-python` | Nœuds Code Python |
| `n8n-code-tool` | Outils de code avancés |
| `n8n-error-handling` | Patterns de gestion d'erreurs |
| `n8n-expression-syntax` | Syntaxe des expressions n8n |
| `n8n-mcp-tools-expert` | Utilisation optimale du MCP Server |
| `n8n-multi-instance` | Gestion multi-instances n8n |
| `n8n-node-configuration` | Configuration fine des nœuds |
| `n8n-self-hosting` | Administration du serveur n8n |
| `n8n-subworkflows` | Architecture en sous-workflows |
| `n8n-validation-expert` | Validation et tests de workflows |
| `n8n-workflow-patterns` | Patterns et architectures de référence |
| `using-n8n-mcp-skills` | Guide d'utilisation combinée MCP + Skills |

**Usage** : les Skills s'activent automatiquement selon le contexte. Utiliser `n8n-validation-expert` avant toute mise en production et `n8n-error-handling` sur chaque workflow exposé publiquement.

### Règle combinatoire
> **MCP Server** dit "ce qui existe" · **n8n Skills** dit "ce qui est possible et recommandé"
> 
> Chaque proposition doit combiner les deux : lire l'existant via MCP, puis concevoir la solution via Skills, puis appliquer via MCP.

---

## 4. Méthode de travail — le flux standard

### Pour une correction de workflow
1. Lire le workflow via MCP Server (JSON + dernières exécutions)
2. Identifier la cause racine du problème (pas juste le symptôme)
3. Proposer la correction avec explication avant d'appliquer
4. Appliquer via MCP Server
5. Documenter ce qui a été changé et pourquoi

### Pour un nouveau workflow
1. Clarifier le déclencheur (trigger), le résultat attendu et les données disponibles
2. Vérifier si un workflow existant peut être étendu plutôt que recréé
3. Concevoir le flow sur papier (étapes logiques) avant de construire
4. Construire nœud par nœud, tester par palier
5. Ajouter une branche d'erreur systématiquement (nœud Error Trigger ou catch sur HTTP)
6. Nommer tous les nœuds de façon explicite (ex: `GET Commandes Impayées MySQL` pas `MySQL`)

### Pour une amélioration de workflow
1. Lire le workflow et comprendre son intention originale
2. Identifier ce qui ralentit, peut planter ou est difficile à maintenir
3. Proposer les améliorations par ordre de priorité (impact vs effort)
4. Appliquer sans changer l'intention ou le périmètre du workflow sauf accord explicite

---

## 5. Standards de qualité obligatoires

### Nommage
- Workflow : `[Contexte] Action Déclencheur` — ex: `[CRM] Créer Lead depuis Formulaire Contact`
- Nœuds : verbe + objet + source — ex: `Envoyer Email Confirmation Achat`
- Variables : camelCase explicite — ex: `emailClient`, `montantCommande`

### Gestion des erreurs
- Chaque workflow exposé à l'extérieur (webhook, cron) doit avoir une branche d'erreur
- Les erreurs doivent déclencher une notification (email ou Telegram) vers l'équipe
- Les données sensibles ne doivent jamais apparaître dans les messages d'erreur

### Performance
- Éviter les boucles sur de grands volumes sans batching (utiliser `Split In Batches`)
- Les requêtes MySQL doivent être filtrées côté SQL, pas côté n8n
- Les appels API externes doivent avoir un timeout configuré et un retry raisonnable (max 3)

### Sécurité
- Les credentials sont toujours stockés dans le gestionnaire de credentials n8n, jamais en dur
- Les webhooks exposés publiquement doivent avoir une validation (header secret ou signature)
- Ne jamais logger de mots de passe, tokens ou données personnelles dans les exécutions

---

## 6. Priorités métier — workflows à haute valeur

Par ordre de valeur pour NONALIX CI :

| Priorité | Workflow | Impact |
|---|---|---|
| 1 | Délivrance automatique après paiement (Wave / Orange Money) | Revenu direct |
| 2 | Capture et qualification de leads (formulaire Contact + Audit SEO) | Acquisition |
| 3 | Relance panier abandonné (cron MySQL + email) | Récupération CA |
| 4 | Support WhatsApp Business + escalade humaine | Rétention client |
| 5 | Génération et archivage de factures PDF | Comptabilité |
| 6 | Rapport de ventes quotidien (MySQL → Google Sheets / Telegram) | Pilotage |

---

## 7. Contexte technique de l'application

```
NONALIX CI
├── Frontend      Next.js 15 (App Router, TypeScript) — nonalix-ci.com
├── Backend       FastAPI (Python) — api.nonalix-ci.com
├── Base de données  PostgreSQL (production) · MySQL (legacy interne)
├── Paiements     Wave + Orange Money (APIs directes opérateurs)
├── Infra         VPS Ubuntu · Docker Compose · réseau nonalix_net
└── n8n           Conteneur nonalix_n8n · n8n.nonalix-ci.com
```

Appels internes Docker (préférer ces URLs pour la performance et la sécurité) :
- MySQL : `db:3306`
- Backend : `http://backend:8000`
- n8n vers lui-même : `http://n8n:5678`

---

## 8. Ce qu'il ne faut pas faire

- Ne **pas** créer un nouveau workflow si un existant peut être étendu
- Ne **pas** utiliser `Execute Workflow` pour compenser une mauvaise architecture
- Ne **pas** laisser un workflow actif avec une branche d'erreur silencieuse (aucune notification)
- Ne **pas** stocker des données sensibles dans des nœuds `Set` au lieu des credentials
- Ne **pas** appliquer une modification sans avoir lu l'état actuel via MCP Server
- Ne **pas** proposer du contenu générique — chaque proposition doit être adaptée au contexte NONALIX CI

---

## 9. Communication et validation

- Toute modification d'un workflow critique (paiement, lead, facturation) est soumise à validation avant application
- Une explication courte est fournie avec chaque proposition : **quoi, pourquoi, impact attendu**
- Les workflows créés ou modifiés sont documentés dans le nœud `Sticky Note` du canvas n8n
- En cas de doute sur le périmètre d'une demande, clarifier avant d'agir

---

## 10. Règles héritées du projet

- Ne jamais push sur `main` ni déclencher un déploiement sans autorisation explicite
- Ne jamais modifier les pipelines CI/CD sans accord préalable
- Les accès administrateur sont utilisés avec discernement — préférer les actions réversibles

---

*Dernière mise à jour : 2026-07-02*
