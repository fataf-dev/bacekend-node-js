require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,  // ✅ Le port doit être ici
    dialect: process.env.DB_DIALECT,
    logging: false                      // Optionnel : pour désactiver les logs Sequelize
  }
);

sequelize.authenticate()
  .then(() => console.log('✅ Connexion à MySQL réussie'))
  .catch(err => console.error('❌ Connexion échouée :', err));

module.exports = sequelize;
