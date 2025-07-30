const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// Configuration S3 pour Storj
const s3 = new S3Client({
  region: 'us-east-1',
  endpoint: 'https://gateway.storjshare.io',
  credentials: {
    accessKeyId: 'jxbrxunuysccjjidu34kvk2x36ya',
    secretAccessKey: 'jy4ai7kk5byysuws6mae56mpi4gh2apdm6fyepaowriel4weawe6m',
  },
  forcePathStyle: true,
});

// ✅ Fonction d'upload avec Buffer
async function uploadVideoWithBuffer(filePath) {
  const fileName = path.basename(filePath);

  try {
    const fileBuffer = fs.readFileSync(filePath);

    const uploadParams = {
      Bucket: 'backend-node',
      Key: fileName,
      Body: fileBuffer,
      ContentType: 'video/mp4',
      ContentLength: fileBuffer.length,
    };

    console.log(`🚀 Upload du fichier "${fileName}" en cours...`);
    const result = await s3.send(new PutObjectCommand(uploadParams));
    console.log("✅ Vidéo uploadée avec succès !");
    console.log(`🔗 Lien (si le bucket est public) : https://gateway.storjshare.io/backend-node/${fileName}`);
    return result;
  } catch (err) {
    console.error(`❌ Erreur lors de l'upload de "${fileName}" :`, err.message);
    throw err;
  }
}

// ✅ Appel de la fonction d'upload
const filePath = '/home/fataf/Téléchargements/Code.mp4';
if (fs.existsSync(filePath)) {
  uploadVideoWithBuffer(filePath);
} else {
  console.error(`❌ Le fichier "${filePath}" n'existe pas. Vérifie le chemin.`);
}
