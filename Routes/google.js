require('dotenv').config();

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { User } = require('../models');

const router = express.Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !JWT_SECRET) {
  throw new Error('❌ Variables d’environnement manquantes dans le fichier .env');
}

// Configuration de la stratégie Google OAuth
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const [user] = await User.findOrCreate({
      where: { googleId: profile.id },
      defaults: {
        name: profile.displayName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value,
        role: 'student'
      }
    });
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Démarrer l'auth Google
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// Callback Google
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  (req, res) => {
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
