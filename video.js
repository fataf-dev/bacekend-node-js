// 1. Installation du package
// npm install cloudinary

// 2. Configuration
const cloudinary = require('cloudinary').v2;

// Configuration avec VOS paramètres
cloudinary.config({ 
  
});

// 3. Upload de votre vidéo videoMins.mp4 (SOLUTION POUR GROS FICHIERS)
console.log("🎬 Début de l'upload de videoMins.mp4...");

// SOLUTION 1: Upload avec eager_async pour gros fichiers
cloudinary.uploader
  .upload("/home/fataf/Téléchargements/tawḥid.mp4", {
    resource_type: "video",
    public_id: "videoMins",
    quality: "auto",
    eager_async: true,
    eager: [
      { quality: "auto", format: "mp4" }
    ]
  })
  .then(result => {
    console.log("✅ Upload réussi (traitement asynchrone) !");
    console.log("📹 URL de la vidéo:", result.secure_url);
    console.log("🆔 Public ID:", result.public_id);
    console.log("📊 Format:", result.format);
    console.log("⏱️ Durée:", result.duration || "En cours de traitement", "secondes");
    console.log("📏 Dimensions:", (result.width || "?") + "x" + (result.height || "?"));
    console.log("💾 Taille:", Math.round((result.bytes || 0) / 1024 / 1024 * 100) / 100, "MB");
    console.log("⚠️ Note: Les transformations se font en arrière-plan");
  })
  .catch(error => {
    console.error("❌ Erreur upload:", error.message);
  });

// 4. SOLUTION 2: Upload_large pour gros fichiers (RECOMMANDÉ)
async function uploadVideoMins() {
  try {
    console.log("🔄 Upload large en cours (chunked upload)...");
    
    const result = await cloudinary.uploader.upload_large("/home/fataf/Téléchargements/tawḥid.mp4", {
      resource_type: "video",
      public_id: "videoMins_large",
      chunk_size: 6000000, // 6MB par chunk
      quality: "auto",
      format: "mp4",
      eager_async: true,
      eager: [
        { quality: "auto:good", format: "mp4" }
      ]
    });
    
    console.log("🎉 Vidéo uploadée avec succès (chunked) !");
    console.log("🔗 Lien:", result.secure_url);
    console.log("📊 Taille du fichier:", Math.round(result.bytes / 1024 / 1024), "MB");
    
    return result;
  } catch (error) {
    console.error("💥 Erreur upload_large:", error.message);
    throw error;
  }
}

// 5. Upload avec options avancées
async function uploadVideoAvecOptions() {
  try {
    const result = await cloudinary.uploader.upload("/home/fataf/Téléchargements/tawḥid.mp4", {
      resource_type: "video",
      public_id: "ma_video_mins",
      overwrite: true,
      folder: "mes_videos",
      tags: ["mins", "telechargements", "demo"],
      quality: "auto",
      format: "mp4"
    });
    
    console.log("📂 Vidéo sauvée dans le dossier 'mes_videos'");
    console.log("🏷️ Tags ajoutés:", result.tags);
    console.log("🔗 URL finale:", result.secure_url);
    
    return result;
  } catch (error) {
    console.error("Erreur:", error);
  }
}

// 6. Pour les gros fichiers (si videoMins.mp4 est volumineux)
async function uploadGrosseVideo() {
  try {
    console.log("📤 Upload d'un gros fichier...");
    
    const result = await cloudinary.uploader.upload_large("/home/fataf/Téléchargements/tawḥid.mp4", {
      resource_type: "video",
      public_id: "videoMins_large",
      chunk_size: 6000000, // 6MB par chunk
      quality: "auto"
    });
    
    console.log("✅ Gros fichier uploadé:", result.secure_url);
    return result;
  } catch (error) {
    console.error("Erreur upload gros fichier:", error);
  }
}

// 7. Exécution - Pour gros fichiers, utilisez ces options
console.log("🚀 Démarrage de l'upload...");

// SOLUTION RECOMMANDÉE pour votre gros fichier:
// Décommentez cette ligne pour utiliser upload_large
uploadVideoMins();

// Ou gardez l'upload normal avec eager_async (déjà activé ci-dessus)