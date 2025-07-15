const express = require('express');
const router = express.Router();
const quizController = require('../controllers/QuizController');



// ✅ Créer un quiz
router.post('/add', quizController.createQuiz);

// ✅ Récupérer tous les quizzes avec leurs questions
router.get('/all', quizController.getAllQuizzes);

// (Optionnel) ✅ Récupérer un quiz par ID


// (Optionnel) ✅ Supprim
router.get('/domain/:domain', quizController.getQuizByDomain);


module.exports = router;
