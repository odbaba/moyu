/**
 * Batch Image Enhancement Script
 * Use Doubao seedream4.5 AI API to enhance image quality
 * Then compress images to reduce file size
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API Configuration
const API_KEY = 'ark-723d46c8-07f1-4084-8750-5d45cb53eae5-c67eb';
const API_URL = 'https://ark.cn-beijing.volces.com/api/v3/images/generations';
const MODEL = 'doubao-seedream-4-5-251128';

// Image directory configuration
const INPUT_DIR = path.join(__dirname, '../public/images/items');
const OUTPUT_DIR = path.join(__dirname, '../public/images/items_enhanced');

// Supported image formats
const SUPPORTED_FORMATS = ['.png', '.jpg', '.jpeg', '.webp'];

// Compression settings
const MAX_WIDTH = 512; // Maximum width
const MAX_HEIGHT = 512; // Maximum height
const JPEG_QUALITY = 80; // JPEG quality (1-100)
const PNG_COMPRESSION_LEVEL = 6; // PNG compression level (0-9)

// Delay function to avoid API rate limiting
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Convert image file to base64 format
 * @param {string} imagePath - Image file path
 * @returns {string} Base64 encoded image data
 */
function imageToBase64(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);
  const base64 = imageBuffer.toString('base64');
  const ext = path.extname(imagePath).toLowerCase();
  
  // Determine MIME type based on file extension
  const mimeTypes = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp'
  };
  
  const mimeType = mimeTypes[ext] || 'image/png';
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Call Doubao API to enhance image
 * @param {string} imageBase64 - Base64 encoded image
 * @param {string} imageName - Image name (for prompt generation)
 * @returns {Promise<string>} Enhanced image URL
 */
async function enhanceImage(imageBase64, imageName) {
  // Generate appropriate prompt based on image name
  const prompt = `Enhance this game item image to be clearer and more refined, maintain original style and details, improve image quality and clarity: ${imageName}`;
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        prompt: prompt,
        image: imageBase64,
        sequential_image_generation: 'disabled',
        response_format: 'url',
        size: '2K',
        stream: false,
        watermark: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    // Check returned data structure
    if (result.data && result.data[0] && result.data[0].url) {
      return result.data[0].url;
    } else if (result.url) {
      return result.url;
    } else {
      throw new Error(`API returned unexpected data format: ${JSON.stringify(result)}`);
    }
  } catch (error) {
    console.error(`Failed to enhance image (${imageName}):`, error.message);
    throw error;
  }
}

/**
 * Download image and save to local
 * @param {string} url - Image URL
 * @returns {Promise<Buffer>} Image buffer
 */
async function downloadImage(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`);
  }
  
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Compress image using sharp
 * @param {Buffer} imageBuffer - Original image buffer
 * @param {string} outputPath - Output file path
 * @returns {Promise<{originalSize: number, compressedSize: number}>}
 */
async function compressImage(imageBuffer, outputPath) {
  const originalSize = imageBuffer.length;
  const ext = path.extname(outputPath).toLowerCase();
  
  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  let sharpInstance = sharp(imageBuffer)
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
  const stats = fs.statSync(outputPath);
  const compressedSize = stats.size;
  
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
 * Main function: Batch process all images
 */
async function main() {
  console.log('========================================');
  console.log('Image Batch Enhancement Script Started');
  console.log('========================================\n');
  
  console.log('Compression Settings:');
  console.log(`  Max Size: ${MAX_WIDTH}x${MAX_HEIGHT}px`);
  console.log(`  JPEG Quality: ${JPEG_QUALITY}`);
  console.log(`  PNG Compression: ${PNG_COMPRESSION_LEVEL}\n`);
  
  // Get all images
  const images = getAllImages();
  console.log(`Found ${images.length} images to process\n`);
  
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
    const imageBase64 = imageToBase64(imagePath);
    
    console.log(`[${i + 1}/${images.length}] Processing: ${category}/${file}`);
    
    try {
      // Call API to enhance image
      const enhancedUrl = await enhanceImage(imageBase64, `${category}/${file}`);
      console.log(`  [OK] API processing successful, downloading...`);
      
      // Download enhanced image
      const imageBuffer = await downloadImage(enhancedUrl);
      
      // Compress and save image
      const outputPath = path.join(OUTPUT_DIR, category, file);
      const { originalSize, compressedSize } = await compressImage(imageBuffer, outputPath);
      
      totalOriginalSize += originalSize;
      totalCompressedSize += compressedSize;
      
      const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);
      console.log(`  [OK] Compressed: ${formatSize(originalSize)} -> ${formatSize(compressedSize)} (${reduction}% reduction)`);
      console.log(`  [OK] Saved to: ${outputPath}\n`);
      
      successCount++;
      
      // Delay 2 seconds to avoid API rate limiting
      if (i < images.length - 1) {
        console.log(`  Waiting 2 seconds...\n`);
        await delay(2000);
      }
      
    } catch (error) {
      console.error(`  [FAIL] Processing failed: ${error.message}\n`);
      failCount++;
      failedImages.push({ category, file, error: error.message });
      
      // Wait longer after failure
      if (i < images.length - 1) {
        console.log(`  Waiting 5 seconds...\n`);
        await delay(5000);
      }
    }
  }
  
  // Output statistics
  console.log('\n========================================');
  console.log('Processing Complete!');
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
  
  console.log(`\nEnhanced images saved to: ${OUTPUT_DIR}`);
}

// Run script
main().catch(console.error);
