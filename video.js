require('dotenv').config();


const bcrypt = require('bcryptjs');
const { User } = require('./models'); // adapte le chemin selon ton projet

async function createAdmin() {
  try {
    const existingAdmin = await User.findOne({ where: { email: 'gandyam@admin.com' } });
    if (existingAdmin) {
      console.log('Admin existe déjà.');
      return;
    }

    const password = 'motDePasseAdmin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name: 'Admin',
      email: 'gandyam@admin.com',  // nouvel email
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Admin créé avec succès !');
  } catch (error) {
    console.error('Erreur lors de la création de l\'admin:', error);
  }
}

createAdmin();
