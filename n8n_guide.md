# Guide d'Automatisation avec n8n (NONALIX CI)

Ce guide décrit comment exploiter **n8n** installé sur votre VPS Ubuntu (`46.202.194.151`) pour automatiser les tâches de votre application (Next.js, FastAPI, MySQL) et connecter vos outils externes (CRM, Webhooks, WhatsApp, Emails).

---

## 🛠️ 1. Ce que n8n peut faire sur votre VPS

n8n est hébergé sur le même réseau Docker que votre application. Cela lui donne un accès direct et rapide à toutes vos ressources internes :

### A. Connexion directe à votre Base de Données MySQL
Puisque n8n est dans le réseau Docker `nonalix_net`, il peut lire et écrire directement dans votre base de données MySQL sans ouvrir de port public.
*   **Hôte** : `db` (le nom du conteneur dans le réseau Docker)
*   **Port** : `3306`
*   **Base de données** : `u402981764_nonalixci`
*   **Utilisateur** : `u402981764_nonalix`
*   **Mot de passe** : `fT2KE0b?E`

*Exemple d'action :* Extraire chaque matin la liste des nouveaux inscrits ou des nouvelles commandes pour générer un rapport de ventes automatique.

### B. Communication avec votre Backend FastAPI
Vous pouvez utiliser le nœud **HTTP Request** de n8n pour interagir avec les endpoints de votre API FastAPI (par exemple pour déclencher des tâches d'intelligence artificielle ou récupérer des analyses de chat).
*   **URL interne** : `http://backend:8000/...` (rapide et sécurisé en interne)
*   **URL externe** : `https://api.nonalix-ci.com/...`

### C. Réception des Webhooks du Frontend Next.js
Votre site frontend Next.js peut envoyer des requêtes HTTP (Webhooks) à n8n lorsqu'un utilisateur effectue une action (ex: soumission d'un formulaire, clic sur un bouton CTA).
*   n8n génère une URL de webhook unique (ex: `https://n8n.nonalix-ci.com/webhook/...`) qu'il vous suffit d'appeler dans votre code Next.js.

---

## 🚀 2. Idées d'Automatisations Spécifiques à votre Application

Voici les flux d'automatisation les plus pertinents et utiles à mettre en place pour **nonalix-ci.com** :

### 1. Tunnel d'Achat & Délivrance automatique (Produits Numériques)
*   **Déclencheur (Trigger)** : Un webhook est envoyé par votre backend de paiement (Wave ou Orange Money) confirmant la réussite d'un paiement.
*   **Étape 2 (n8n)** : n8n vérifie le produit acheté dans la base de données MySQL.
*   **Étape 3 (n8n)** : n8n génère un lien de téléchargement sécurisé.
*   **Étape 4 (n8n)** : Envoi automatique d'un e-mail personnalisé (via Gmail, Outlook ou SMTP Hostinger) contenant la facture PDF et le lien d'accès.

### 2. CRM & Suivi des Prospects (Leads)
*   **Déclencheur (Trigger)** : Un utilisateur remplit le formulaire de la page **Contact** ou demande un **Audit SEO** sur votre site.
*   **Étape 2 (n8n)** : n8n intercepte la demande via un webhook.
*   **Étape 3 (n8n)** : Création ou mise à jour automatique de la fiche prospect dans votre CRM (HubSpot, ActiveCampaign, Salesforce, Pipedrive, etc.).
*   **Étape 4 (n8n)** : Notification immédiate sur votre groupe de travail (Slack, Discord ou Telegram) pour avertir l'équipe : *"Nouveau lead qualifié de [Nom de l'entreprise] !"*

### 3. Support Client Intelligent sur WhatsApp
*   **Déclencheur (Trigger)** : Un client envoie un message sur votre compte WhatsApp Business (via Twilio, 360dialog, ou votre routeur existant).
*   **Étape 2 (n8n)** : n8n reçoit le message et l'envoie au conteneur FastAPI pour analyse (ou l'envoie directement au nœud OpenAI de n8n).
*   **Étape 3 (n8n)** : n8n récupère la réponse de l'IA et formule une réponse structurée en fonction de la base de connaissances de NONALIX CI.
*   **Étape 4 (n8n)** : Renvoi automatique du message au client sur WhatsApp. Si le client demande un conseiller humain, n8n crée un ticket d'assistance dans votre outil de support (ex: Zendesk, Jira).

### 4. Relance de Panier Abandonné
*   **Déclencheur (Trigger)** : n8n scrute la base MySQL toutes les heures pour repérer des paniers créés depuis plus de 2 heures mais non finalisés.
*   **Étape 2 (n8n)** : n8n extrait l'adresse e-mail et le contenu du panier.
*   **Étape 3 (n8n)** : n8n envoie un e-mail de relance contenant un code de réduction temporaire (ex: -10%) pour inciter à la commande.

### 5. Génération automatique de Factures et Comptabilité
*   **Déclencheur (Trigger)** : Une nouvelle commande passe au statut "Payée" dans MySQL.
*   **Étape 2 (n8n)** : n8n génère une facture à l'aide d'un modèle (Google Docs ou outil spécialisé comme Invoice Ninja).
*   **Étape 3 (n8n)** : Enregistrement de la ligne de vente dans votre logiciel comptable (QuickBooks, Pennylane ou Google Sheets).
*   **Étape 4 (n8n)** : Archivage automatique du PDF de la facture dans un dossier partagé Google Drive ou Dropbox.

---

## ⚙️ 3. Commandes de Maintenance de n8n sur le VPS

Vous pouvez gérer n8n directement depuis la console SSH de votre VPS :

*   **Consulter les logs en temps réel** (très utile pour débugger un flux) :
    ```bash
    docker logs -f nonalix_n8n
    ```
*   **Redémarrer le conteneur** :
    ```bash
    docker restart nonalix_n8n
    ```
*   **Mettre à jour n8n vers la dernière version** (sans perdre vos données) :
    ```bash
    cd /root/nonalix-ci
    docker compose pull n8n
    docker compose up -d n8n
    ```
*   **Accéder à l'interface graphique** :
    Rendez-vous sur **[https://n8n.nonalix-ci.com](https://n8n.nonalix-ci.com)** et créez votre compte administrateur lors de votre première connexion.
