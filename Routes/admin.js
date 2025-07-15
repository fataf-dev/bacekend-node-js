

const router = require('express').Router();
const adminController = require('../controllers/adminController');
const isAdmin = require('../middleware/isAdmin');
const isAuthenticated = require('../middleware/authMiddlware'); // si besoin d'auth aussi


// Route pour récupérer tous les cours
router.get('/courses', adminController.getAllCourses);

router.post('/courses', adminController.createCourse); // <-- C'est ça qui manque
router.get('/courses/:category', adminController.getCoursesByCategory);


// Route pour ajouter un cours

// admin.js

router.get('/courses/id/:id', adminController.getCourseById);



router.put('/courses/:id', adminController.updateCourse);

// Route pour supprimer un cours

router.delete('/courses/:id', adminController.deleteCourse);

module.exports = router;
