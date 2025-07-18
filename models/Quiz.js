module.exports = (sequelize, DataTypes) => {
  const Quiz = sequelize.define('Quiz', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    difficulty: {
      type: DataTypes.ENUM('easy', 'medium', 'hard'),
      allowNull: false
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Quiz.associate = (models) => {
    Quiz.hasMany(models.Question, {
      foreignKey: 'QuizId',
      onDelete: 'CASCADE'
    });
  };

  return Quiz;
};


