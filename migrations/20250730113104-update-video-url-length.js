'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Courses', 'videoUrl', {
      type: Sequelize.STRING(1000)
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Courses', 'videoUrl', {
      type: Sequelize.STRING(255) // retour à l’ancienne taille
    });
  }
};
