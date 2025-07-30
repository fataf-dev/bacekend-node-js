

const express = require('express');
const router = express.Router();

const { upload } = require('../Utils/uploadsVideo')



 // le chemin vers ta config multer/cloudinary

const DevelController = require('../controllers/developpement'); // chemin correct

// ✅ Ces deux doivent être bien définies dans ton contrôleur
router.post('/create', upload.single('video'), DevelController.createCourse);


router.get('/all', DevelController.getAllCourses);

 
// Appliquer ce middleware à ta route de création de cours
//router.post('/create', upload.single('video'), DevelController.createCourse);

//router.post('/create', upload.single('video'), DevelController.createCourse);


router.get('/subdomain/:subdomain',DevelController.getCoursesBySubdomain); 
//router.post('/create', upload.single('video'), DevelController.createCourse);

router.get('/by-SousSousDomaine/:SousSousDomaine',DevelController.getCoursesBySousSousDomaine);
router.get('/courses/second-subdomain/:secondSubdomain',DevelController.getCoursesBySecondSubdomain);

 module.exports = router;

 