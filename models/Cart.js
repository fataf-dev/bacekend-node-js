module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // ✅ DOIT correspondre à `tableName` dans User.js
        key: 'id',
      },
    },
    courses: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  });

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Cart;
};
