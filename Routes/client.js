const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

const isAuthenticated=require('../middleware/authMiddlware')

// Routes publiques (accessibles sans authentification)
router.get('/courses', clientController.getAllCourses);
router.get('/courses/:id', clientController.getCourseById);
router.post('/cart/add', clientController.addToCart);
router.delete('/cart/remove/:id', clientController.removeFromCart);

// Route protégée (requiert authentification)
router.post('/cart/checkout', isAuthenticated, clientController.checkout);

module.exports = router;
