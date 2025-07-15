// models/Comment.js
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    texte: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });

  return Comment;
};
