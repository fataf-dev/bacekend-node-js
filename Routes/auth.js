const router = require('express').Router();
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {verifyAdmin}=require('../middleware/VerifyToken')

const tokenBlacklist = require('../tokenBlacklist');

const emails=require('../Utils/SendEmail')
// Login

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // 🔐 Validation des champs requis
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Champs requis manquants' });
  }

  try {
    // 🔍 Vérifier si l’email est déjà utilisé
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé' });
    }

    // 🔐 Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔢 Générer un code de vérification à 6 chiffres
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 📦 Créer un nouvel utilisateur
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
      isVerified: false,
      verificationCode,
    });

    // 📤 Envoyer le mail de vérification (avec lien cliquable ou code)
    await emails.sendVerificationEmail(email, verificationCode);

    // 🔐 Générer un token temporaire (utile pour front, si besoin)
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role, name: newUser.name },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // expire dans 15 minutes
    );

    // ✅ Réponse de succès
    return res.status(201).json({
      message: 'Inscription réussie. Un email de vérification vous a été envoyé. Veuillez vérifier votre boîte de réception (ou vos spams).',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });

  } catch (err) {
    // ❌ Gestion des erreurs
    return res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});


// ✅ Vérification par lien cliquable
router.get('/verify-email', async (req, res) => {
  const { email, code } = req.query;

  if (!email || !code) {
    return res.status(400).send('Paramètres manquants dans le lien.');
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).send('Utilisateur non trouvé.');
    }

    if (user.isVerified) {
      return res.send('✅ Votre compte est déjà vérifié.');
    }

    if (user.verificationCode === code) {
      user.isVerified = true;
      user.verificationCode = null;
      await user.save();
      return res.send('✅ Votre compte a été vérifié avec succès !');
    } else {
      return res.status(400).send('❌ Code de vérification incorrect.');
    }

  } catch (err) {
    return res.status(500).send('❌ Erreur serveur : ' + err.message);
  }
});





router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Aucun utilisateur trouvé avec cet email." });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: "Veuillez vérifier votre email avant de vous connecter." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect." });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

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
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
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
