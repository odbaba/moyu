/**
 * 批量图片增强脚本
 * 使用豆包seedream4.5 AI接口将图片变得更清晰
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API配置
const API_KEY = 'ark-723d46c8-07f1-4084-8750-5d45cb53eae5-c67eb';
const API_URL = 'https://ark.cn-beijing.volces.com/api/v3/images/generations';
const MODEL = 'doubao-seedream-4-5-251128';

// 图片目录配置
const EQUIPMENT_DIR = path.join(__dirname, '../public/images/equipment');
const OUTPUT_DIR = path.join(__dirname, '../public/images/equipment_enhanced');

// 支持的图片格式
const SUPPORTED_FORMATS = ['.png', '.jpg', '.jpeg', '.webp'];

// 延迟函数，避免API调用过快
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 将图片文件转换为base64格式
 * @param {string} imagePath - 图片文件路径
 * @returns {string} base64编码的图片数据
 */
function imageToBase64(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);
  const base64 = imageBuffer.toString('base64');
  const ext = path.extname(imagePath).toLowerCase();
  
  // 根据文件扩展名确定MIME类型
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
 * 调用豆包API增强图片
 * @param {string} imageBase64 - base64编码的图片
 * @param {string} imageName - 图片名称（用于生成prompt）
 * @returns {Promise<string>} 增强后的图片URL
 */
async function enhanceImage(imageBase64, imageName) {
  // 根据图片名称生成合适的prompt
  const prompt = `将这张游戏装备图片变得更清晰、更精致，保持原有风格和细节，提升画质和清晰度：${imageName}`;
  
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
      throw new Error(`API请求失败: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    // 检查返回的数据结构
    if (result.data && result.data[0] && result.data[0].url) {
      return result.data[0].url;
    } else if (result.url) {
      return result.url;
    } else {
      throw new Error(`API返回数据格式异常: ${JSON.stringify(result)}`);
    }
  } catch (error) {
    console.error(`增强图片失败 (${imageName}):`, error.message);
    throw error;
  }
}

/**
 * 下载图片并保存到本地
 * @param {string} url - 图片URL
 * @param {string} outputPath - 输出文件路径
 */
async function downloadImage(url, outputPath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`下载图片失败: ${response.status}`);
  }
  
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  // 确保输出目录存在
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, buffer);
}

/**
 * 获取所有需要处理的图片文件
 * @returns {Array<{category: string, file: string, path: string}>}
 */
function getAllImages() {
  const images = [];
  
  // 读取equipment目录下的所有子目录
  const categories = fs.readdirSync(EQUIPMENT_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  // 遍历每个分类目录
  for (const category of categories) {
    const categoryPath = path.join(EQUIPMENT_DIR, category);
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
 * 主函数：批量处理所有图片
 */
async function main() {
  console.log('========================================');
  console.log('图片批量增强脚本启动');
  console.log('========================================\n');
  
  // 获取所有图片
  const images = getAllImages();
  console.log(`找到 ${images.length} 张图片需要处理\n`);
  
  if (images.length === 0) {
    console.log('没有找到需要处理的图片');
    return;
  }
  
  // 创建输出目录
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  // 统计信息
  let successCount = 0;
  let failCount = 0;
  const failedImages = [];
  
  // 处理每张图片
  for (let i = 0; i < images.length; i++) {
    const { category, file, path: imagePath } = images[i];
    const imageBase64 = imageToBase64(imagePath);
    
    console.log(`[${i + 1}/${images.length}] 正在处理: ${category}/${file}`);
    
    try {
      // 调用API增强图片
      const enhancedUrl = await enhanceImage(imageBase64, `${category}/${file}`);
      console.log(`  ✓ API处理成功，正在下载...`);
      
      // 下载并保存增强后的图片
      const outputPath = path.join(OUTPUT_DIR, category, file);
      await downloadImage(enhancedUrl, outputPath);
      
      console.log(`  ✓ 已保存到: ${outputPath}\n`);
      successCount++;
      
      // 延迟2秒，避免API调用过快
      if (i < images.length - 1) {
        console.log(`  等待2秒后继续...\n`);
        await delay(2000);
      }
      
    } catch (error) {
      console.error(`  ✗ 处理失败: ${error.message}\n`);
      failCount++;
      failedImages.push({ category, file, error: error.message });
      
      // 失败后等待更长时间
      if (i < images.length - 1) {
        console.log(`  等待5秒后继续...\n`);
        await delay(5000);
      }
    }
  }
  
  // 输出统计信息
  console.log('\n========================================');
  console.log('处理完成！');
  console.log('========================================');
  console.log(`总计: ${images.length} 张图片`);
  console.log(`成功: ${successCount} 张`);
  console.log(`失败: ${failCount} 张`);
  
  if (failedImages.length > 0) {
    console.log('\n失败的图片列表:');
    failedImages.forEach(({ category, file, error }) => {
      console.log(`  - ${category}/${file}: ${error}`);
    });
  }
  
  console.log(`\n增强后的图片保存在: ${OUTPUT_DIR}`);
}

// 运行脚本
main().catch(console.error);
