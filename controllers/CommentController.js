// controllers/CommentController.js
const { Comment } = require('../models');

exports.addComment = async (req, res) => {
  try {
    const { nom, texte, domain } = req.body;

    if (!nom || !texte) {
      return res.status(400).json({ message: 'Nom et commentaire requis' });
    }

    const nouveau = await Comment.create({ nom, texte, domain });

    res.status(201).json(nouveau);
  } catch (err) {
    console.error('❌ Erreur ajout commentaire :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getCommentsByDomain = async (req, res) => {
  try {
    const { domain } = req.params;
    const commentaires = await Comment.findAll({
      where: { domain },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(commentaires);
  } catch (err) {
    console.error('❌ Erreur récupération commentaires :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
