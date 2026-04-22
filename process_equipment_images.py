#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
装备图片批量处理脚本
功能：对装备图片进行4倍放大和锐化处理，提高清晰度和美观度
"""

import os
from PIL import Image, ImageEnhance, ImageFilter
import glob


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
    img_sharpened = enhancer.enhance(2.0)  # 2倍锐化
    
    # 轻微的对比度增强
    contrast_enhancer = ImageEnhance.Contrast(img_sharpened)
    img_final = contrast_enhancer.enhance(1.1)  # 1.1倍对比度
    
    # 保存处理后的图片
    img_final.save(output_path, 'PNG', quality=100)
    print(f"已处理: {os.path.basename(image_path)} -> {os.path.basename(output_path)}")


def process_all_equipment_images():
    """
    批量处理所有装备图片
    """
    # 装备图片根目录
    base_dir = r"d:\life\code\moyu\public\images\equipment"
    
    # 装备类型列表
    equipment_types = ['weapon', 'helmet', 'clothes', 'necklace', 'bracelet', 'shoes']
    
    # 为每种装备类型创建输出目录（备份原图片）
    backup_dir = os.path.join(base_dir, "backup")
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
    
    print("=" * 60)
    print("开始处理装备图片...")
    print(f"放大倍数: 4倍")
    print("=" * 60)
    
    total_processed = 0
    
    for eq_type in equipment_types:
        eq_dir = os.path.join(base_dir, eq_type)
        
        if not os.path.exists(eq_dir):
            continue
        
        print(f"\n处理 {eq_type} 装备图片...")
        
        # 获取该类型下的所有PNG图片
        image_files = glob.glob(os.path.join(eq_dir, "lv*.png"))
        image_files.sort()  # 按文件名排序
        
        # 备份原图片
        eq_backup_dir = os.path.join(backup_dir, eq_type)
        if not os.path.exists(eq_backup_dir):
            os.makedirs(eq_backup_dir)
        
        for img_path in image_files:
            img_name = os.path.basename(img_path)
            
            # 备份原图片
            backup_path = os.path.join(eq_backup_dir, img_name)
            if not os.path.exists(backup_path):
                import shutil
                shutil.copy2(img_path, backup_path)
            
            # 处理图片并覆盖原文件
            enhance_image(img_path, img_path, scale_factor=4)
            total_processed += 1
    
    print("\n" + "=" * 60)
    print(f"处理完成！共处理 {total_processed} 张图片")
    print(f"原图片已备份到: {backup_dir}")
    print("=" * 60)


if __name__ == "__main__":
    try:
        process_all_equipment_images()
    except Exception as e:
        print(f"处理过程中出错: {e}")
        import traceback
        traceback.print_exc()
