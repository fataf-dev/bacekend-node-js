# Étape 1 : Image Node.js officielle
FROM node:18

# Étape 2 : Créer un dossier de travail
WORKDIR /app

# Étape 3 : Copier les fichiers
COPY package*.json ./
RUN npm install
COPY . .

# Étape 4 : Exposer le port
EXPOSE 3000

# Étape 5 : Commande pour démarrer le serveur
CMD [ "node", "src/app.js" ]
