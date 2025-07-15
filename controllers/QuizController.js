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
    const { title, difficulty, domain, questions } = req.body;

    if (!title || !difficulty || !domain || !questions) {
      return res.status(400).json({ message: 'Champs manquants' });
    }

    const domaineTrouve = domaines.find(d => d.name === domain);
    if (!domaineTrouve) {
      return res.status(400).json({ message: 'Domaine invalide' });
    }

    const quiz = await Quiz.create({
      title,
      difficulty,
      domain: domaineTrouve.name,
    });

    // Ici on adapte pour tes données envoyées:
    // question = q.question
    // correct = q.correctAnswer
    // options = q.options (tableau de chaînes)
    for (const q of questions) {
      const question = await Question.create({
        text: q.question,
        correct: q.correctAnswer,
        options: q.options,          // options en JSON
        QuizId: quiz.id
      });

      // Si tu ne gères pas les options dans une table séparée, tu peux supprimer ce bloc
      // sinon adapte-le selon ton modèle Option
      /*
      for (const opt of q.options) {
        await Option.create({
          label: opt,       // ici opt est une string
          value: opt,       // ou adapte si tu as une autre structure
          QuestionId: question.id
        });
      }
      */
    }

    res.status(201).json({ message: 'Quiz créé avec succès !', quizId: quiz.id });
  } catch (err) {
    console.error(err);
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
