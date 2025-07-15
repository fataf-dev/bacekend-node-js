module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    correct: {
      type: DataTypes.STRING,
      allowNull: false
    },
    options: {
      type: DataTypes.JSON,
      allowNull: false
    }
  });

  Question.associate = (models) => {
    Question.belongsTo(models.Quiz);
    Question.hasMany(models.Option, { onDelete: 'CASCADE' });
  };

  return Question;
};
