import pkg from '@api.video/nodejs-sdk';
import fs from 'fs';
import path from 'path';

const { Client } = pkg;
const client = new Client({ apiKey: 'FEwfPn4pWgXuzkgoKBMKzE7fikVyTy7UyCSv5L5RJmU' });

async function uploadVideo() {
  try {
    console.log('🔍 Création de la vidéo...');
    
    // Version minimaliste
    const videoCreation = await client.videos.create({ 
      title: 'Ma video de test'
    });
    
    console.log('✅ Vidéo créée avec l\'ID :', videoCreation.videoId);
    
    const filePath = path.join('.', 'ma_video.mp4');
    if (!fs.existsSync(filePath)) {
      throw new Error(`Le fichier ${filePath} n'existe pas`);
    }
    
    console.log('🔍 Upload du fichier...');
    const stream = fs.createReadStream(filePath);
    const video = await client.videos.upload(videoCreation.videoId, stream);
    
    console.log('✅ Vidéo uploadée :', video.assets.player);
  } catch (err) {
    console.error('❌ Erreur :', err.message);
  }
}

uploadVideo();