const multer = require('multer');
const path = require('path');

// Configuration stockage (ex : dossier uploads/videos)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads/videos'));
  },
  filename: (req, file, cb) => {
    // Ex: video-123456789.mp4
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // max 500MB, ajuste selon besoin
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if(ext !== '.mp4' && ext !== '.mov' && ext !== '.avi' && ext !== '.mkv') {
      return cb(new Error('Seulement les fichiers vidéo sont autorisés'));
    }
    cb(null, true);
  }
});

module.exports = upload;
