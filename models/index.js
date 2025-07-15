

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import des modèles
db.User = require('./users')(sequelize, DataTypes);
db.Course = require('./course')(sequelize, DataTypes);
db.Cart = require('./Cart')(sequelize, DataTypes);
db.Quiz = require('./Quiz')(sequelize, DataTypes);
db.Question = require('./Question')(sequelize, DataTypes);
db.Option = require('./Option')(sequelize, DataTypes);
db.Comment = require('./Comment')(sequelize, DataTypes);

// Associations
db.Quiz.hasMany(db.Question, { onDelete: 'CASCADE' });
db.Question.belongsTo(db.Quiz);

db.Question.hasMany(db.Option, { onDelete: 'CASCADE' });
db.Option.belongsTo(db.Question);

module.exports = db;
