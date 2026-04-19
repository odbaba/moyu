/**
 * 经验交换工具函数
 * 用于计算装备换取经验球的数量
 */

import type { EquipmentItem } from '../types';

/**
 * 品质对应的经验球基础数量
 * 良品=1, 上品=2, 精品=3, 极品=4
 */
const QUALITY_EXP_BALLS: Record<string, number> = {
  '良品': 1,
  '上品': 2,
  '精品': 3,
  '极品': 4,
};

/**
 * 判断装备是否可以交换经验球
 * 条件：良品以上（品质>=1）或有洞（holeCount>0）
 *
 * @param equipment 装备物品
 * @returns 是否可以交换
 */
export function canExchangeEquipment(equipment: EquipmentItem): boolean {
  // 检查是否为装备类型
  if (equipment.type !== 'equipment') {
    return false;
  }

  // 获取品质数值
  const qualityValue = getQualityValue(equipment.equipmentQuality);

  // 良品以上 或 有洞
  return qualityValue >= 1 || equipment.holeCount > 0;
}

/**
 * 将品质名称转换为数值
 * 普通品=0, 良品=1, 上品=2, 精品=3, 极品=4
 *
 * @param qualityName 品质名称
 * @returns 品质数值
 */
export function getQualityValue(qualityName: string): number {
  const qualityMap: Record<string, number> = {
    '普通品': 0,
    '良品': 1,
    '上品': 2,
    '精品': 3,
    '极品': 4,
  };

  return qualityMap[qualityName] ?? 0;
}

/**
 * 计算单个装备可换取的经验球数量
 * 规则：
 * - 良品：1个
 * - 上品：2个
 * - 精品：3个
 * - 极品：4个
 * - 一洞：+2个
 * - 二洞：+5个
 * - 魔魂+9：+1个
 * - 魔魂+12：+2个
 *
 * @param equipment 装备物品
 * @returns 可换取的经验球数量
 */
export function calculateExperienceBalls(equipment: EquipmentItem): number {
  // 如果不能交换，返回0
  if (!canExchangeEquipment(equipment)) {
    return 0;
  }

  let totalBalls = 0;

  // 1. 根据品质计算基础数量
  const qualityValue = getQualityValue(equipment.equipmentQuality);
  if (qualityValue >= 1) {
    // 良品以上才有基础数量
    totalBalls = QUALITY_EXP_BALLS[equipment.equipmentQuality] || 0;
  }

  // 2. 根据洞数加成
  if (equipment.holeCount === 1) {
    totalBalls += 2;
  } else if (equipment.holeCount >= 2) {
    totalBalls += 5;
  }

  // 3. 根据魔魂等级加成
  if (equipment.magicSoulLevel >= 12) {
    totalBalls += 2;
  } else if (equipment.magicSoulLevel >= 9) {
    totalBalls += 1;
  }

  return totalBalls;
}

/**
 * 计算多个装备的总经验球数量
 *
 * @param equipments 装备物品数组
 * @returns 总经验球数量
 */
export function calculateTotalExperienceBalls(equipments: EquipmentItem[]): number {
  return equipments.reduce((total, equipment) => {
    return total + calculateExperienceBalls(equipment);
  }, 0);
}

/**
 * 获取装备交换的详细信息描述
 *
 * @param equipment 装备物品
 * @returns 交换信息描述
 */
export function getExchangeDescription(equipment: EquipmentItem): string {
  if (!canExchangeEquipment(equipment)) {
    return '该装备不符合交换条件';
  }

  const parts: string[] = [];
  const qualityValue = getQualityValue(equipment.equipmentQuality);

  // 品质加成
  if (qualityValue >= 1) {
    parts.push(`品质(${equipment.equipmentQuality}): ${QUALITY_EXP_BALLS[equipment.equipmentQuality]}个`);
  }

  // 洞数加成
  if (equipment.holeCount === 1) {
    parts.push('一洞: +2个');
  } else if (equipment.holeCount >= 2) {
    parts.push('二洞: +5个');
  }

  // 魔魂加成
  if (equipment.magicSoulLevel >= 12) {
    parts.push('魔魂+12: +2个');
  } else if (equipment.magicSoulLevel >= 9) {
    parts.push('魔魂+9: +1个');
  }

  const totalBalls = calculateExperienceBalls(equipment);

  return `${parts.join(', ')} = ${totalBalls}个经验球`;
}

/**
 * 从背包中筛选可交换的装备
 *
 * @param items 背包物品数组
 * @returns 可交换的装备数组
 */
export function filterExchangeableEquipments(items: import('../types').InventoryItem[]): EquipmentItem[] {
  return items.filter((item): item is EquipmentItem => {
    return item.type === 'equipment' && canExchangeEquipment(item as EquipmentItem);
  });
}
