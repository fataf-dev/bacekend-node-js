require('dotenv').config();
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { exec } = require('child_process');
require('dotenv').config();

// Stockage Multer en mémoire (buffer)
const storage = multer.memoryStorage();

// FileFilter Multer avec log mimetype
const fileFilter = (req, file, cb) => {
  console.log('MimeType reçu :', file.mimetype);
  const allowed = ['video/mp4', 'video/mkv', 'video/quicktime'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Seuls les fichiers vidéo sont autorisés'), false);
};

const upload = multer({ storage, fileFilter });

// Client S3 (Storj)
const s3 = new S3Client({
  region: 'us-east-1',
  endpoint: process.env.STORJ_ENDPOINT,
  credentials: {
    accessKeyId: process.env.STORJ_ACCESS_KEY,
    secretAccessKey: process.env.STORJ_SECRET_KEY,
  },
  forcePathStyle: true,
});

// Upload vers Storj + génération lien public
async function uploadToStorj(fileBuffer, originalName) {
  const bucket = process.env.STORJ_BUCKET_NAME;
  const fileName = `${Date.now()}-${originalName.replace(/\s+/g, '_')}`;

  try {
    console.log(`Début upload vers Storj : ${fileName}`);

    await s3.send(new PutObjectCommand({
      Bucket: bucket,
      Key: fileName,
      Body: fileBuffer,
      ContentType: 'video/mp4',
      ContentLength: fileBuffer.length,
    }));

    console.log(`Upload terminé, génération du lien public...`);

    return new Promise((resolve, reject) => {
      const command = `uplink share --url --not-after=none sj://${bucket}/${fileName}`;
      exec(command, (err, stdout) => {
        if (err) {
          console.error('Erreur uplink share:', err);
          return reject(err);
        }
        const match = stdout.match(/https:\/\/link\.storjshare\.io\/s\/[^\s]+/);
        if (match) {
          console.log('Lien public généré :', match[0]);
          resolve({ publicUrl: match[0], fileName });
        } else {
          reject(new Error("Lien public introuvable dans la sortie uplink"));
        }
      });
    });

  } catch (err) {
    console.error('Erreur uploadToStorj:', err);
    throw err;
  }
}

module.exports = { upload, uploadToStorj };
