const { Quiz, Question, Option } = require('../models');

const domaines = [
  { name: "Deep learning", icon: "🧠", link: "/stats" },
  { name: "Statistique", icon: "📊" },
  { name: "React js", icon: "⚛️" },
  { name: "Vue js", icon: "🖼️" },
  { name: "Angular", icon: "🅰️" },
  { name: "PhP", icon: "🐘" },
  { name: "Science de Données", icon: "📈" },
  { name: "Python", icon: "🐍" },
  { name: "Flutter", icon: "💙" },
  { name: "Kotlin", icon: "🧡" },
  { name: "ChatGPT", icon: "🤖" },
  { name: "Node js", icon: "🌳" },
  { name: "Machine learning", icon: "🤖" },
  { name: "Finance et Comptabilité", icon: "💰" },
  { name: "Informatique et Logiciel", icon: "💻" },
  { name: "Marketing", icon: "📢" }
];

exports.createQuiz = async (req, res) => {
  try {
    console.log('Requête createQuiz:', req.body); // log du body

    const { title, difficulty, domain, questions } = req.body;

    if (!title || !difficulty || !domain || !questions) {
      return res.status(400).json({ message: 'Champs manquants' });
    }

    const domaineTrouve = domaines.find(d => d.name.toLowerCase() === domain.toLowerCase());
    if (!domaineTrouve) {
      return res.status(400).json({ message: 'Domaine invalide' });
    }

    const quiz = await Quiz.create({
      title,
      difficulty,
      domain: domaineTrouve.name,
    });

    for (const q of questions) {
      if (!q.text || !q.correct || !q.options) {
        return res.status(400).json({ message: 'Format de question invalide' });
      }

      await Question.create({
        text: q.text,
        correct: q.correct,
        options: q.options,
        QuizId: quiz.id
      });
    }

    res.status(201).json({ message: 'Quiz créé avec succès !', quizId: quiz.id });
  } catch (err) {
    console.error('❌ Erreur createQuiz:', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.findAll({
      include: [
        {
          model: Question,
          attributes: ['id', 'text', 'correct', 'options']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(quizzes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des quizzes' });
  }
};







exports.getQuizByDomain = async (req, res) => {
  try {
    const domain = req.params.domain;
    const difficulty = req.query.difficulty; // facultatif

    const whereClause = { domain };
    if (difficulty) {
      whereClause.difficulty = difficulty;
    }

    const quizzes = await Quiz.findAll({
      where: whereClause,
      include: [
        {
          model: Question,
          include: [Option] // ✅ ici on inclut les options
        }
      ]
    });

    res.json({ quizzes });
  } catch (error) {
    console.error('❌ Erreur getQuizByDomain:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des quiz' });
  }
};
