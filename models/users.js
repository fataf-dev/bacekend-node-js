module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: DataTypes.STRING,
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user',
    },
    googleId: DataTypes.STRING, // ✅ Google OAuth (optionnel)
    avatar: DataTypes.STRING,   // image de profil
    verificationCode: {
      type: DataTypes.STRING,
      allowNull: true, // null une fois validé
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // pas vérifié par défaut
    },
  }, {
    tableName: 'users',
  });

  return User;
};
