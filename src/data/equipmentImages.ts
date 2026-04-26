/**
 * 装备图片映射配置文件
 * 定义装备类型、等级与图片路径的映射关系
 */

import type { EquipmentItem } from '../types';

/**
 * 装备类型与DefineSprite编号映射
 */
export const EQUIPMENT_SPRITE_MAP: Record<EquipmentItem['equipmentType'], number> = {
  weapon: 164, // 武器
  helmet: 189, // 头盔
  bracelet: 214, // 手镯
  necklace: 239, // 项链
  clothes: 264, // 衣服
  shoes: 289, // 战鞋
};

/**
 * 装备等级与背包图片帧号映射
 * 根据文档，每个等级的装备在背包中显示对应的帧图片
 * 使用背包帧的第一帧作为图标
 */
export const EQUIPMENT_LEVEL_FRAME_MAP: Record<number, number> = {
  1: 5, // 1级装备使用5.png（背包帧5-7的第一帧）
  10: 11, // 10级装备使用11.png（背包帧11-13的第一帧）
  20: 17, // 20级装备使用17.png
  30: 23, // 30级装备使用23.png
  40: 29, // 40级装备使用29.png
  50: 35, // 50级装备使用35.png
  60: 41, // 60级装备使用41.png
  70: 47, // 70级装备使用47.png
  80: 53, // 80级装备使用53.png
  90: 59, // 90级装备使用59.png
  100: 66, // 100级装备使用66.png
  125: 74, // 125级装备使用74.png
};

/**
 * 获取装备图片路径
 * @param equipmentType 装备类型
 * @param useLevel 使用等级
 * @returns 图片路径（相对于public目录）
 */
export const getEquipmentImagePath = (
  equipmentType: EquipmentItem['equipmentType'],
  useLevel: number
): string => {
  // 返回public目录下的图片路径
  return `./images/equipment/${equipmentType}/lv${useLevel}.png`;
};

/**
 * 装备类型对应的emoji回退图标
 */
export const EQUIPMENT_FALLBACK_ICONS: Record<EquipmentItem['equipmentType'], string> = {
  weapon: '⚔️',
  helmet: '🪖',
  clothes: '🛡️',
  shoes: '👢',
  bracelet: '💫',
  necklace: '📿',
};

/**
 * 获取装备回退emoji图标
 * @param equipmentType 装备类型
 * @returns emoji图标
 */
export const getEquipmentFallbackIcon = (equipmentType: EquipmentItem['equipmentType']): string => {
  return EQUIPMENT_FALLBACK_ICONS[equipmentType];
};
