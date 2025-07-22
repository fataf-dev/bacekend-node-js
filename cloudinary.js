// cloudinary.js

require('dotenv').config();

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer'); // N'oubliez pas d'importer multer

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'videos',
    resource_type: 'video',
    format: async () => 'mp4',
    public_id: () => `video-${Date.now()}`,
  },
});

const upload = multer({ storage });

module.exports = upload;
