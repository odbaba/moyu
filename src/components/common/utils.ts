/**
 * 组件公共工具函数模块
 * 统一定义各组件共用的工具函数，避免重复定义
 */

import type { EquipmentItem, EquipmentSlotType, InventoryItem, ItemRarity } from '../../types';
import {
  EQUIPMENT_ICON_MAP,
  EQUIPMENT_QUALITY_COLORS,
  PET_QUALITY_COLORS,
  PET_TYPE_EMOJI,
  RARITY_CLASS_NAMES,
  RARITY_CONFIG} from './constants';

/**
 * 根据幻兽品质称号获取对应的颜色
 * @param qualityTitle 幻兽品质称号（如"极品12星"、"万众瞩目"等）
 * @returns 对应的颜色值
 */
export const getPetQualityColor = (qualityTitle: string): string => {
  // 根据品质称号判断颜色
  if (qualityTitle.includes('极品')) {
    return PET_QUALITY_COLORS['极品'];
  } else if (qualityTitle === '万众瞩目') {
    return PET_QUALITY_COLORS['精品'];
  } else if (qualityTitle === '千载难逢') {
    return PET_QUALITY_COLORS['上品'];
  } else if (qualityTitle === '百里挑一') {
    return PET_QUALITY_COLORS['良品'];
  } else {
    return PET_QUALITY_COLORS['普通'];
  }
};

/**
 * 根据装备品质获取对应的颜色
 * @param quality 装备品质
 * @returns 对应的颜色值
 */
export const getEquipmentQualityColor = (quality: string): string => {
  return EQUIPMENT_QUALITY_COLORS[quality] || '#ffffff';
};

/**
 * 根据幻兽类型获取对应的emoji图标
 * @param petType 幻兽类型名称
 * @returns 对应的emoji图标
 */
export const getPetEmoji = (petType: string): string => {
  return PET_TYPE_EMOJI[petType] || '🐾';
};

/**
 * 根据装备槽位类型获取对应的图标
 * @param slotType 装备槽位类型
 * @returns 对应的emoji图标
 */
export const getEquipmentIcon = (slotType: EquipmentSlotType): string => {
  return EQUIPMENT_ICON_MAP[slotType] || '📦';
};

/**
 * 获取物品稀有度对应的CSS类名
 * @param rarity 稀有度
 * @returns CSS类名
 */
export const getRarityClassName = (rarity: string): string => {
  return RARITY_CLASS_NAMES[rarity] || 'rarity-common';
};

/**
 * 获取物品稀有度对应的中文显示
 * @param rarity 稀有度
 * @returns 中文名称
 */
export const getRarityText = (rarity: string): string => {
  return RARITY_CONFIG[rarity as ItemRarity]?.name || '普通';
};

/**
 * 获取物品稀有度对应的颜色
 * @param rarity 稀有度
 * @returns 颜色值
 */
export const getRarityColor = (rarity: string): string => {
  return RARITY_CONFIG[rarity as ItemRarity]?.color || '#9e9e9e';
};

/**
 * 判断物品是否为装备类型
 * 类型守卫函数，用于类型收窄
 * @param item 物品对象
 * @returns 是否为装备类型
 */
export const isEquipmentItem = (item: InventoryItem): item is EquipmentItem => {
  return item.type === 'equipment';
};

/**
 * 格式化数字显示
 * 超过10000的数字显示为 "X.X万" 格式
 * @param num 需要格式化的数字
 * @returns 格式化后的字符串
 */
export const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}万`;
  }

  return num.toLocaleString();
};
