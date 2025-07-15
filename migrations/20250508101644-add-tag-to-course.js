'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Ajouter la colonne `tag` dans la table `Courses`
    await queryInterface.addColumn('Courses', 'tag', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'new', // Valeur par défaut 'new'
      validate: {
        isIn: [['popular', 'trending', 'new']] // Liste des tags valides
      }
    });
  },

  async down (queryInterface, Sequelize) {
    // Supprimer la colonne `tag` dans la table `Courses`
    await queryInterface.removeColumn('Courses', 'tag');
  }
};
