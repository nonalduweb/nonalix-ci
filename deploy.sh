#!/bin/bash
# Script de déploiement automatisé pour NONALIX CI sur VPS Ubuntu
# Ce script doit être exécuté sur le VPS

set -e

echo "==============================================="
echo "=== DÉBUT DU DÉPLOIEMENT SUR LE VPS UBUNTU ==="
echo "==============================================="

# 1. Mise à jour du système
echo ">>> [1/7] Mise à jour des paquets système..."
sudo apt-get update -y

# 2. Installation de Docker et Docker Compose
if ! command -v docker &> /dev/null; then
    echo ">>> [2/7] Installation de Docker..."
    sudo apt-get install -y ca-certificates curl gnupg lsb-release
    sudo mkdir -m 0755 -p /etc/apt/keyrings
    
    # Supprimer l'ancienne clé si elle existe
    sudo rm -f /etc/apt/keyrings/docker.gpg
    
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
      
    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    echo "Docker installé avec succès."
else
    echo ">>> [2/7] Docker est déjà installé."
fi

# 3. Installation de Nginx et Certbot
if ! command -v nginx &> /dev/null; then
    echo ">>> [3/7] Installation de Nginx..."
    sudo apt-get install -y nginx
else
    echo ">>> [3/7] Nginx est déjà installé."
fi

if ! command -v certbot &> /dev/null; then
    echo ">>> [3/7] Installation de Certbot..."
    sudo apt-get install -y certbot python3-certbot-nginx
else
    echo ">>> [3/7] Certbot est déjà installé."
fi

# 4. Configuration de Nginx
echo ">>> [4/7] Configuration de Nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/nonalix-ci.com
sudo ln -sf /etc/nginx/sites-available/nonalix-ci.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default || true

echo "Vérification de la configuration Nginx..."
sudo nginx -t
echo "Redémarrage de Nginx..."
sudo systemctl restart nginx

# 5. Démarrage des conteneurs via Docker Compose
echo ">>> [5/7] Démarrage des conteneurs avec Docker Compose (build en cours)..."
docker compose down || true
docker compose up -d --build

# 6. Attente et Migration de la base de données
echo ">>> [6/7] Attente du démarrage de la base de données..."
sleep 15

echo "Exécution des migrations Prisma (Création des tables)..."
docker compose exec -T frontend npx prisma db push --accept-data-loss

echo "Peuplement initial de la base de données (Seeding)..."
docker compose exec -T frontend npx prisma db seed

# 7. Nettoyage de l'espace disque
echo ">>> [7/8] Nettoyage des anciennes images et du cache Docker..."
docker system prune -af

# 8. Finalisation
echo ">>> [8/8] Déploiement terminé avec succès !"
echo "==============================================="
echo "Note : Pour activer le SSL HTTPS, exécutez la commande suivante :"
echo "sudo certbot --nginx -d nonalix-ci.com -d www.nonalix-ci.com -d api.nonalix-ci.com"
echo "==============================================="
