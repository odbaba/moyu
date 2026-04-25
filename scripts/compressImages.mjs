/**
 * Image Compression Script
 * Compress existing images to reduce file size
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Image directory configuration
const INPUT_DIR = path.join(__dirname, '../public/images/equipment_enhanced');
const OUTPUT_DIR = path.join(__dirname, '../public/images/equipment_enhanced_compressed');

// Supported image formats
const SUPPORTED_FORMATS = ['.png', '.jpg', '.jpeg', '.webp'];

// Compression settings
const MAX_WIDTH = 512; // Maximum width
const MAX_HEIGHT = 512; // Maximum height
const JPEG_QUALITY = 80; // JPEG quality (1-100)
const PNG_COMPRESSION_LEVEL = 6; // PNG compression level (0-9)

/**
 * Compress image using sharp
 * @param {string} inputPath - Input file path
 * @param {string} outputPath - Output file path
 * @returns {Promise<{originalSize: number, compressedSize: number}>}
 */
async function compressImage(inputPath, outputPath) {
  const stats = fs.statSync(inputPath);
  const originalSize = stats.size;
  const ext = path.extname(outputPath).toLowerCase();
  
  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  let sharpInstance = sharp(inputPath)
    .resize(MAX_WIDTH, MAX_HEIGHT, {
      fit: 'inside', // Maintain aspect ratio
      withoutEnlargement: true // Don't enlarge smaller images
    });
  
  // Apply format-specific compression
  if (ext === '.jpg' || ext === '.jpeg') {
    sharpInstance = sharpInstance.jpeg({ 
      quality: JPEG_QUALITY,
      progressive: true
    });
  } else if (ext === '.png') {
    sharpInstance = sharpInstance.png({ 
      compressionLevel: PNG_COMPRESSION_LEVEL,
      progressive: true
    });
  } else if (ext === '.webp') {
    sharpInstance = sharpInstance.webp({ 
      quality: JPEG_QUALITY
    });
  }
  
  await sharpInstance.toFile(outputPath);
  
  // Get compressed file size
  const compressedStats = fs.statSync(outputPath);
  const compressedSize = compressedStats.size;
  
  return { originalSize, compressedSize };
}

/**
 * Format file size for display
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size string
 */
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Get all images that need to be processed
 * @returns {Array<{category: string, file: string, path: string}>}
 */
function getAllImages() {
  const images = [];
  
  // Read all subdirectories in the input directory
  const categories = fs.readdirSync(INPUT_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  // Traverse each category directory
  for (const category of categories) {
    const categoryPath = path.join(INPUT_DIR, category);
    const files = fs.readdirSync(categoryPath);
    
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (SUPPORTED_FORMATS.includes(ext)) {
        images.push({
          category,
          file,
          path: path.join(categoryPath, file)
        });
      }
    }
  }
  
  return images;
}

/**
 * Main function: Batch compress all images
 */
async function main() {
  console.log('========================================');
  console.log('Image Compression Script Started');
  console.log('========================================\n');
  
  console.log('Compression Settings:');
  console.log(`  Max Size: ${MAX_WIDTH}x${MAX_HEIGHT}px`);
  console.log(`  JPEG Quality: ${JPEG_QUALITY}`);
  console.log(`  PNG Compression: ${PNG_COMPRESSION_LEVEL}\n`);
  
  // Get all images
  const images = getAllImages();
  console.log(`Found ${images.length} images to compress\n`);
  
  if (images.length === 0) {
    console.log('No images found to process');
    return;
  }
  
  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // Statistics
  let successCount = 0;
  let failCount = 0;
  let totalOriginalSize = 0;
  let totalCompressedSize = 0;
  const failedImages = [];
  
  // Process each image
  for (let i = 0; i < images.length; i++) {
    const { category, file, path: imagePath } = images[i];
    
    console.log(`[${i + 1}/${images.length}] Compressing: ${category}/${file}`);
    
    try {
      // Compress image
      const outputPath = path.join(OUTPUT_DIR, category, file);
      const { originalSize, compressedSize } = await compressImage(imagePath, outputPath);
      
      totalOriginalSize += originalSize;
      totalCompressedSize += compressedSize;
      
      const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);
      console.log(`  [OK] ${formatSize(originalSize)} -> ${formatSize(compressedSize)} (${reduction}% reduction)\n`);
      
      successCount++;
      
    } catch (error) {
      console.error(`  [FAIL] Compression failed: ${error.message}\n`);
      failCount++;
      failedImages.push({ category, file, error: error.message });
    }
  }
  
  // Output statistics
  console.log('\n========================================');
  console.log('Compression Complete!');
  console.log('========================================');
  console.log(`Total: ${images.length} images`);
  console.log(`Success: ${successCount} images`);
  console.log(`Failed: ${failCount} images`);
  
  if (successCount > 0) {
    const totalReduction = ((1 - totalCompressedSize / totalOriginalSize) * 100).toFixed(1);
    console.log(`\nCompression Statistics:`);
    console.log(`  Original Total: ${formatSize(totalOriginalSize)}`);
    console.log(`  Compressed Total: ${formatSize(totalCompressedSize)}`);
    console.log(`  Total Reduction: ${totalReduction}%`);
  }
  
  if (failedImages.length > 0) {
    console.log('\nFailed images list:');
    failedImages.forEach(({ category, file, error }) => {
      console.log(`  - ${category}/${file}: ${error}`);
    });
  }
  
  console.log(`\nCompressed images saved to: ${OUTPUT_DIR}`);
}

// Run script
main().catch(console.error);
