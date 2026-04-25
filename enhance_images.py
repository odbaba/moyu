# -*- coding: utf-8 -*-
"""
豆包seedream4.5图片增强脚本
批量处理equipment目录下的装备图片，使其更清晰
"""

import os
import base64
import requests
import json
import time
from pathlib import Path

# API配置
API_KEY = "ark-723d46c8-07f1-4084-8750-5d45cb53eae5-c67eb"
API_URL = "https://ark.cn-beijing.volces.com/api/v3/images/generations"
MODEL = "doubao-seedream-4-5-251128"

# 图片目录配置
EQUIPMENT_DIR = r"D:\life\code\moyu\public\images\equipment"
OUTPUT_DIR = r"D:\life\code\moyu\public\images\equipment_enhanced"

# 请求头
HEADERS = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {API_KEY}"
}

def image_to_base64(image_path):
    """
    将图片转换为base64格式
    
    Args:
        image_path: 图片路径
    
    Returns:
        base64编码的图片字符串
    """
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def enhance_image(image_path, output_path, equipment_type, level):
    """
    调用豆包API增强图片清晰度
    
    Args:
        image_path: 输入图片路径
        output_path: 输出图片路径
        equipment_type: 装备类型
        level: 装备等级
    
    Returns:
        bool: 是否成功
    """
    try:
        # 将图片转换为base64
        image_base64 = image_to_base64(image_path)
        
        # 构建提示词，强调清晰度和细节
        prompt = f"高清{equipment_type}装备图标，等级{level}，清晰锐利，细节丰富，游戏装备图标风格，高质量，无水印"
        
        # 构建请求数据
        payload = {
            "model": MODEL,
            "prompt": prompt,
            "image": f"data:image/png;base64,{image_base64}",  # 使用base64格式
            "sequential_image_generation": "disabled",
            "response_format": "url",
            "size": "2K",
            "stream": False,
            "watermark": False
        }
        
        # 发送请求
        response = requests.post(API_URL, headers=HEADERS, json=payload, timeout=60)
        
        # 检查响应状态
        if response.status_code == 200:
            result = response.json()
            
            # 获取生成的图片URL
            if 'data' in result and len(result['data']) > 0:
                image_url = result['data'][0]['url']
                
                # 下载生成的图片
                img_response = requests.get(image_url, timeout=30)
                if img_response.status_code == 200:
                    # 确保输出目录存在
                    os.makedirs(os.path.dirname(output_path), exist_ok=True)
                    
                    # 保存图片
                    with open(output_path, 'wb') as f:
                        f.write(img_response.content)
                    
                    print(f"✓ 成功处理: {equipment_type}/lv{level}")
                    return True
                else:
                    print(f"✗ 下载图片失败: {equipment_type}/lv{level}")
                    return False
            else:
                print(f"✗ API返回数据格式错误: {equipment_type}/lv{level}")
                print(f"  响应: {result}")
                return False
        else:
            print(f"✗ API请求失败: {equipment_type}/lv{level}")
            print(f"  状态码: {response.status_code}")
            print(f"  错误信息: {response.text}")
            return False
            
    except Exception as e:
        print(f"✗ 处理出错: {equipment_type}/lv{level}")
        print(f"  错误: {str(e)}")
        return False

def process_all_images():
    """
    批量处理所有装备图片
    """
    print("=" * 60)
    print("豆包seedream4.5图片增强脚本")
    print("=" * 60)
    print(f"输入目录: {EQUIPMENT_DIR}")
    print(f"输出目录: {OUTPUT_DIR}")
    print("=" * 60)
    
    # 统计信息
    total_count = 0
    success_count = 0
    fail_count = 0
    
    # 装备类型映射（英文转中文）
    equipment_names = {
        "weapon": "武器",
        "helmet": "头盔",
        "clothes": "衣服",
        "shoes": "鞋子",
        "necklace": "项链",
        "bracelet": "手镯"
    }
    
    # 遍历所有装备类型目录
    for equipment_type in os.listdir(EQUIPMENT_DIR):
        type_dir = os.path.join(EQUIPMENT_DIR, equipment_type)
        
        # 跳过非目录文件
        if not os.path.isdir(type_dir):
            continue
        
        print(f"\n处理装备类型: {equipment_names.get(equipment_type, equipment_type)}")
        print("-" * 60)
        
        # 遍历该类型下的所有图片
        for image_file in sorted(os.listdir(type_dir)):
            if not image_file.endswith('.png'):
                continue
            
            # 提取等级信息
            level = image_file.replace('lv', '').replace('.png', '')
            
            # 构建输入输出路径
            input_path = os.path.join(type_dir, image_file)
            output_path = os.path.join(OUTPUT_DIR, equipment_type, image_file)
            
            total_count += 1
            
            # 处理图片
            if enhance_image(input_path, output_path, equipment_names.get(equipment_type, equipment_type), level):
                success_count += 1
            else:
                fail_count += 1
            
            # 添加延迟，避免请求过快
            time.sleep(1)
    
    # 打印统计信息
    print("\n" + "=" * 60)
    print("处理完成!")
    print(f"总计: {total_count} 张图片")
    print(f"成功: {success_count} 张")
    print(f"失败: {fail_count} 张")
    print("=" * 60)

if __name__ == "__main__":
    process_all_images()
