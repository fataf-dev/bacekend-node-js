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

    // Vérifier la présence des champs requis
    if (!title || !difficulty || !domain || !questions) {
      return res.status(400).json({ message: 'Champs manquants' });
    }

    // Vérifier que le domaine est valide
    const domaineTrouve = domaines.find(d => d.name === domain);
    if (!domaineTrouve) {
      return res.status(400).json({ message: 'Domaine invalide' });
    }

    // Créer le quiz avec le nom du domaine et l'icône associée
    const quiz = await Quiz.create({
      title,
      difficulty,
      domain: domaineTrouve.name,
      icon: domaineTrouve.icon // Nécessite que ton modèle Quiz ait un champ `icon`
    });

    // Créer les questions et les options
    for (const q of questions) {
      const question = await Question.create({
        text: q.text,
        correct: q.correct,
        QuizId: quiz.id
      });

      for (const opt of q.options) {
        await Option.create({
          label: opt.label,
          value: opt.value,
          QuestionId: question.id
        });
      }
    }

    res.status(201).json({ message: 'Quiz créé avec succès !', quizId: quiz.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
