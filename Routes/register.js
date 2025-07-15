const router = require('express').Router();
const { User } = require('../models'); // Depuis index.js
const bcrypt = require('bcryptjs');

// Route d'inscription
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Vérifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role // exemple : 'student', 'admin', 'instructor'
    });

    res.status(201).json({
      message: 'Utilisateur inscrit avec succès',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

module.exports = router;
