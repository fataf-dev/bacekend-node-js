const router = require('express').Router();
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {verifyAdmin}=require('../middleware/VerifyToken')

const tokenBlacklist = require('../tokenBlacklist');
// Login

router.post('/login', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Aucun utilisateur trouvé avec cet email." });
    }

    // Supposons que l'on utilise un mot de passe générique pour l'instant, ou qu'il n'y en ait pas
    // Si tu veux réactiver une vérification de mot de passe, tu peux rajouter bcrypt.compare()

    // Génération du token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Redirection dynamique selon le rôle
    let redirectUrl = '/dashboard';
    if (user.role === 'admin') redirectUrl = '/dashboard';
    else if (user.role === 'student') redirectUrl = '/flutter';
    else if (user.role === 'instructor') redirectUrl = '/instructor/panel';

    return res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      },
      redirectUrl
    });

  } catch (error) {
    console.log("Réponse backend:", response.data);

    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});


router.post('/register', async (req, res) => {
  const { name, email } = req.body;

  // Vérification des champs requis
  if (!name || !email) {
    return res.status(400).json({ message: 'Champs requis manquants' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé' });
    }

    const role = 'user';

    const newUser = await User.create({
      name,
      email,
      role
    });

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role, name: newUser.name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'Inscription réussie',
      token,
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



// Récupérer tous les utilisateurs inscrits
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'createdAt']
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});



router.delete('/users/:id', verifyAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    await user.destroy();

    return res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});


// Déconnexion (blacklist le token)
router.post('/logout', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(400).json({ message: "Token manquant dans l'en-tête Authorization" });
  }

  const token = authHeader.split(' ')[1];
  tokenBlacklist.add(token);

  return res.status(200).json({ message: "Déconnexion réussie. Token invalidé." });
});




module.exports = router;
