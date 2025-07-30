const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { exec } = require('child_process');
const path = require('path');
require('dotenv').config();

// Configuration Multer – stockage en mémoire (RAM)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['video/mp4', 'video/mkv', 'video/quicktime'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Seuls les fichiers vidéo sont autorisés'), false);
};

const upload = multer({ storage, fileFilter });

// Configuration S3 (Storj)
const s3 = new S3Client({
  region: 'us-east-1',
  endpoint: process.env.STORJ_ENDPOINT,
  credentials: {
    accessKeyId: process.env.STORJ_ACCESS_KEY,
    secretAccessKey: process.env.STORJ_SECRET_KEY,
  },
  forcePathStyle: true,
});

// Fonction d’upload + génération de lien public
async function uploadToStorj(fileBuffer, originalName) {
  const bucket = process.env.STORJ_BUCKET_NAME;
  const fileName = `${Date.now()}-${originalName.replace(/\s+/g, '_')}`;

  try {
    // Upload vers Storj
    await s3.send(new PutObjectCommand({
      Bucket: bucket,
      Key: fileName,
      Body: fileBuffer,
      ContentType: 'video/mp4',
      ContentLength: fileBuffer.length,
    }));

    // Générer lien public via uplink
    return new Promise((resolve, reject) => {
      const command = `uplink share --url --not-after=none sj://${bucket}/${fileName}`;
      exec(command, (err, stdout) => {
        if (err) return reject(err);
        const match = stdout.match(/https:\/\/link\.storjshare\.io\/s\/[^\s]+/);
        if (match) resolve({ publicUrl: match[0], fileName });
        else reject(new Error("❌ Lien public introuvable dans la sortie uplink"));
      });
    });

  } catch (err) {
    throw new Error(`❌ Erreur d’upload vers Storj : ${err.message}`);
  }
}

module.exports = { upload, uploadToStorj };
