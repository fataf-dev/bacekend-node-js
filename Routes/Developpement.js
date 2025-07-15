

const express = require('express');
const router = express.Router();
const DevelController = require('../controllers/developpement'); // chemin correct

// ✅ Ces deux doivent être bien définies dans ton contrôleur
router.post('/create', DevelController.createCourse);


router.get('/subdomain/:subdomain',DevelController.getCoursesBySubdomain); 

router.get('/by-soussousdomaine/:soussousdomaine',DevelController.getCoursesBySousSousDomaine);
router.get('/courses/second-subdomain/:secondSubdomain',DevelController.getCoursesBySecondSubdomain);

 module.exports = router;

