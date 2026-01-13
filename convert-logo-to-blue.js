import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertLogoToBlue() {
  const inputPath = path.join(__dirname, 'src/assets/swaphub-logo.png');
  const outputPath = path.join(__dirname, 'public/favicon.png');
  const outputPathIco = path.join(__dirname, 'public/favicon.ico');

  try {
    // Logo'yu oku ve mavi renge çevir
    // CSS filter: brightness(0) saturate(100%) invert(59%) sepia(96%) saturate(2086%) hue-rotate(157deg) brightness(103%) contrast(101%)
    // Bu filter'ı Sharp ile uygulayamayız, bunun yerine logo'yu grayscale yapıp mavi tonuna çevirelim
    
    const image = await sharp(inputPath)
      .greyscale() // Önce grayscale yap
      .tint({ r: 0, g: 212, b: 255 }) // Mavi renge boya (#00d4ff)
      .toBuffer();

    // PNG olarak kaydet
    await sharp(image)
      .png()
      .toFile(outputPath);

    // ICO olarak da kaydet (PNG formatında)
    await sharp(image)
      .png()
      .toFile(outputPathIco);

    console.log('✅ Logo mavi renge çevrildi ve favicon olarak kaydedildi!');
  } catch (error) {
    console.error('❌ Hata:', error);
    process.exit(1);
  }
}

convertLogoToBlue();
