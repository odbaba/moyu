#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
从备份恢复装备图片
"""

import os
import shutil
import glob


def restore_images():
    """
    从备份目录恢复所有装备图片
    """
    # 装备图片根目录
    base_dir = r"d:\life\code\moyu\public\images\equipment"
    backup_dir = os.path.join(base_dir, "backup")
    
    if not os.path.exists(backup_dir):
        print("备份目录不存在，无法恢复")
        return
    
    # 装备类型列表
    equipment_types = ['weapon', 'helmet', 'clothes', 'necklace', 'bracelet', 'shoes']
    
    print("=" * 60)
    print("开始恢复装备图片...")
    print("=" * 60)
    
    total_restored = 0
    
    for eq_type in equipment_types:
        eq_dir = os.path.join(base_dir, eq_type)
        eq_backup_dir = os.path.join(backup_dir, eq_type)
        
        if not os.path.exists(eq_backup_dir):
            continue
        
        print(f"\n恢复 {eq_type} 装备图片...")
        
        # 获取备份目录下的所有PNG图片
        image_files = glob.glob(os.path.join(eq_backup_dir, "lv*.png"))
        
        for backup_path in image_files:
            img_name = os.path.basename(backup_path)
            target_path = os.path.join(eq_dir, img_name)
            
            # 复制备份图片覆盖原图片
            shutil.copy2(backup_path, target_path)
            print(f"已恢复: {img_name}")
            total_restored += 1
    
    print("\n" + "=" * 60)
    print(f"恢复完成！共恢复 {total_restored} 张图片")
    print("=" * 60)


if __name__ == "__main__":
    restore_images()
