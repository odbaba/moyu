#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
装备图片批量处理脚本 v2.0
功能：对装备图片进行4倍放大和锐化处理，提高清晰度和美观度
保持原文件名为64x64显示尺寸，但实际像素为256x256
"""

import os
from PIL import Image, ImageEnhance
import glob
import shutil


def enhance_image(image_path, output_path, scale_factor=4):
    """
    增强图片：4倍放大 + 锐化处理
    
    Args:
        image_path: 原始图片路径
        output_path: 输出图片路径
        scale_factor: 放大倍数，默认为4
    """
    # 打开图片
    img = Image.open(image_path)
    
    # 获取原始尺寸
    original_width, original_height = img.size
    
    # 计算新尺寸
    new_width = original_width * scale_factor
    new_height = original_height * scale_factor
    
    # 高质量缩放（使用Lanczos滤镜）
    img_upscaled = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
    
    # 锐化处理
    enhancer = ImageEnhance.Sharpness(img_upscaled)
    img_sharpened = enhancer.enhance(1.8)  # 1.8倍锐化，避免过度
    
    # 轻微的对比度增强
    contrast_enhancer = ImageEnhance.Contrast(img_sharpened)
    img_final = contrast_enhancer.enhance(1.15)  # 1.15倍对比度
    
    # 亮度轻微增强
    brightness_enhancer = ImageEnhance.Brightness(img_final)
    img_final = brightness_enhancer.enhance(1.05)
    
    # 保存处理后的图片，使用最高质量
    img_final.save(output_path, 'PNG', optimize=False, compress_level=0)
    print(f"已处理: {os.path.basename(image_path)} -> {new_width}x{new_height}")


def process_all_equipment_images():
    """
    批量处理所有装备图片
    """
    # 装备图片根目录
    base_dir = r"d:\life\code\moyu\public\images\equipment"
    
    # 装备类型列表
    equipment_types = ['weapon', 'helmet', 'clothes', 'necklace', 'bracelet', 'shoes']
    
    # 确保备份目录存在
    backup_dir = os.path.join(base_dir, "backup")
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
    
    print("=" * 60)
    print("开始处理装备图片...")
    print(f"原始尺寸: 64x64")
    print(f"放大倍数: 4倍 -> 256x256")
    print("=" * 60)
    
    total_processed = 0
    
    for eq_type in equipment_types:
        eq_dir = os.path.join(base_dir, eq_type)
        
        if not os.path.exists(eq_dir):
            continue
        
        print(f"\n处理 {eq_type} 装备图片...")
        
        # 获取该类型下的所有PNG图片
        image_files = glob.glob(os.path.join(eq_dir, "lv*.png"))
        image_files.sort()
        
        # 确保备份存在
        eq_backup_dir = os.path.join(backup_dir, eq_type)
        if not os.path.exists(eq_backup_dir):
            os.makedirs(eq_backup_dir)
        
        for img_path in image_files:
            img_name = os.path.basename(img_path)
            
            # 确认备份存在，不存在则备份
            backup_path = os.path.join(eq_backup_dir, img_name)
            if not os.path.exists(backup_path):
                shutil.copy2(img_path, backup_path)
            
            # 处理图片并覆盖原文件
            enhance_image(img_path, img_path, scale_factor=4)
            total_processed += 1
    
    print("\n" + "=" * 60)
    print(f"处理完成！共处理 {total_processed} 张图片")
    print(f"原图片已备份到: {backup_dir}")
    print("\n注意：图片实际像素已放大到256x256，")
    print("在游戏中需要通过CSS设置width: 64px; height: 64px;来保持显示尺寸")
    print("=" * 60)


if __name__ == "__main__":
    try:
        process_all_equipment_images()
    except Exception as e:
        print(f"处理过程中出错: {e}")
        import traceback
        traceback.print_exc()
