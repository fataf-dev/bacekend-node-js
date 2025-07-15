const express = require('express');
const { sequelize, User } = require('./models');  // Assure-toi du chemin correct pour ton fichier models
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    const adminExists = await User.findOne({ where: { email: 'admin@example.com' } });
    if (adminExists) {
      console.log('L\'admin existe déjà');
      return;
    }

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('adminpassword', 10),
      role: 'admin'
    });

    console.log('Admin créé:', admin);
  } catch (error) {
    console.error('Erreur lors de la création de l\'admin:', error);
  }
}

async function startServer() {
  try {
    // Connexion à la base de données
    await sequelize.authenticate();
    console.log('✅ Connexion à la base de données réussie');

    // Synchroniser les modèles (sans effacer les données)
    await sequelize.sync({ force: false });

    // Créer l'admin
    await createAdmin();

    // Démarrer le serveur Express
    const app = express();
    app.listen(5000, () => {
      console.log('🚀 Serveur démarré sur le port 5000');
    });

  } catch (error) {
    console.error('❌ Erreur lors de la connexion à la base de données:', error);
  }
}

startServer();
