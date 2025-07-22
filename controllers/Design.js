const bcrypt = require('bcryptjs');
const { User } = require("../models"); // adapte selon ta config Sequelize / ORM

async function createAdmin() {
  try {
    const password = 'motDePasseAdmin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('Admin créé avec succès:', admin);
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la création de l\'admin:', error);
    process.exit(1);
  }
}

createAdmin();
