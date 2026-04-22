#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
检查装备图片尺寸
"""

import os
from PIL import Image
import glob


def check_sizes():
    # 装备图片根目录
    base_dir = r"d:\life\code\moyu\public\images\equipment"
    
    # 装备类型列表
    equipment_types = ['weapon', 'helmet', 'clothes']
    
    print("装备图片尺寸检查:")
    print("=" * 60)
    
    for eq_type in equipment_types:
        eq_dir = os.path.join(base_dir, eq_type)
        
        if not os.path.exists(eq_dir):
            continue
        
        print(f"\n{eq_type}:")
        
        # 检查前3张图片
        image_files = glob.glob(os.path.join(eq_dir, "lv*.png"))[:3]
        
        for img_path in image_files:
            img = Image.open(img_path)
            print(f"  {os.path.basename(img_path)}: {img.size[0]} x {img.size[1]}")


if __name__ == "__main__":
    check_sizes()
