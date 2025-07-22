const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const ImageKit = require('imagekit');

const imagekit = new ImageKit({
  publicKey: "public_vrGVOZUGssV13HmG7x23Q4FOPYU=",
  privateKey: "private_K35V1sH6NTdk0N+8RRA8YvzPMVE=",
  urlEndpoint: "https://ik.imagekit.io/sdd9ub8ii"
});
const inputPath = "/home/fataf/Téléchargements/Optique.mp4";

const compressedPath = inputPath.replace(/\.mp4$/, '_compressed.mp4');

console.log("⚙️ Compression vidéo en cours...");

const ffmpegCommand = `ffmpeg -i "${inputPath}" -vcodec libx264 -crf 28 -preset fast -y "${compressedPath}"`;

exec(ffmpegCommand, (error, stdout, stderr) => {
  if (error) {
    console.error("❌ Erreur FFmpeg :", error.message);
    return;
  }

  console.log("✅ Compression terminée !");
  console.log("📤 Upload vers ImageKit...");

  const stream = fs.createReadStream(compressedPath);
  const fileName = path.basename(compressedPath);

  imagekit.upload({
    file: stream,
    fileName: fileName,
    useUniqueFileName: true,
  }, (err, result) => {
    if (err) {
      console.error("❌ Erreur upload :", err);
    } else {
      console.log("✅ Upload réussi !");
      console.log("🔗 URL de la vidéo :", result.url);
    }

    // Supprimer les fichiers si tu veux
    try {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(compressedPath);
    } catch (e) {
      console.warn("⚠️ Impossible de supprimer les fichiers :", e.message);
    }
  });
});
