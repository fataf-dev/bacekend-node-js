module.exports = (sequelize, DataTypes) => {
  const Option = sequelize.define('Option', {
    label: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });

  Option.associate = (models) => {
    Option.belongsTo(models.Question, {
      foreignKey: 'QuestionId',
      onDelete: 'CASCADE'
    });
  };

  return Option;
};
