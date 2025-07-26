const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Définir le stockage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/videos');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
    cb(null, uniqueName);
  }
});

// Filtrer les types de fichiers acceptés (vidéo uniquement)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non supporté'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Route d'upload vidéo
router.post('/video', upload.single('video'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Aucune vidéo envoyée.' });

  const videoUrl = `/uploads/videos/${req.file.filename}`;
  res.status(200).json({ message: 'Vidéo uploadée avec succès.', url: videoUrl });
});

module.exports = router;
