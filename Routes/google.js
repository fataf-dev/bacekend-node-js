require('dotenv').config();

const express = require('express');
const passport = require('passport');
const Sequelize = require('sequelize');
const { Op } = Sequelize;
const jwt = require('jsonwebtoken');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { User } = require('../models');

const router = express.Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://projet-de-soutenance.netlify.app';

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !JWT_SECRET) {
  throw new Error('❌ Variables d’environnement manquantes dans le fichier .env');
}

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "https://bacekend-node-js-1.onrender.com/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log("👤 Profil Google reçu dans la stratégie :", profile);

    const [user, created] = await User.findOrCreate({
      where: {
        [Op.or]: [
          { googleId: profile.id },
          { email: profile.emails[0].value }
        ]
      },
      defaults: {
        name: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos?.[0]?.value || null,
        role: 'student',
        googleId: profile.id
      }
    });

    return done(null, user);
  } catch (error) {
    console.error('❌ Erreur dans GoogleStrategy:', error);
    return done(error, null);
  }
}));

router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  (req, res) => {
    console.log("✅ Utilisateur connecté via Google :", req.user);

    const payload = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role || 'student',
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.redirect(`${FRONTEND_URL}/callback-google.html?token=${token}`);
    

  }
);

module.exports = router;
