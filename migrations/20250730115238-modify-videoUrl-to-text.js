'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.changeColumn('Courses', 'videoUrl', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.changeColumn('Courses', 'videoUrl', {
      type: Sequelize.STRING(255), // ou la taille d'origine
      allowNull: true,
    });
  }
};
