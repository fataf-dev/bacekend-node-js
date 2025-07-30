const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const app = express();

// ✅ Configuration Cloudinary en dur (⚠️ temporaire uniquement)
cloudinary.config({
  cloud_name: 'ton_nom_cloud',
  api_key: 'ta_cle_api',
  api_secret: 'ton_secret_api'
});

// Configuration multer (stockage temporaire)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Crée ce dossier s’il n’existe pas
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Route pour uploader la vidéo
app.post('/upload-video', upload.single('video'), async (req, res) => {
  const filePath = req.file.path;

  try {
    const result = await cloudinary.uploader.upload_large(filePath, {
      resource_type: 'video',
      public_id: 'video_' + Date.now(),
      chunk_size: 6000000,
    });

    fs.unlinkSync(filePath); // Nettoyage

    res.json({
      message: 'Vidéo uploadée avec succès',
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error('Erreur d\'upload Cloudinary :', error);
    res.status(500).json({ error: 'Erreur lors de l\'upload de la vidéo.' });
  }
});

// Démarrer le serveur
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
