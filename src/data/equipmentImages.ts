/**
 * 装备图片映射配置文件
 * 定义装备类型、等级与图片路径的映射关系
 */

import type { EquipmentItem } from '../types';

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
  return `./images/equipment/${equipmentType}/lv${useLevel}.png`;
};
