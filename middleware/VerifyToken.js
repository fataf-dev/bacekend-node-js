// middleware/VerifyToken.js
const jwt = require('jsonwebtoken');
const tokenBlacklist = require('../tokenBlacklist');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token manquant' });

  const token = authHeader.split(' ')[1];

  // Vérifie si le token a été invalidé
  if (tokenBlacklist.has(token)) {
    return res.status(403).json({ message: 'Token expiré ou invalide (déconnecté)' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token invalide' });
  }
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé : réservé aux administrateurs' });
    }
    next();
  });
};

module.exports = { verifyToken, verifyAdmin };



