


const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController'); // chemin correct

// ✅ Ces deux doivent être bien définies dans ton contrôleur
router.post('/create', courseController.createCourse);


router.get('/domain/:domain', courseController.getCoursesByDomain);






 module.exports = router;
