/**
 * 组件公共常量模块
 * 统一定义各组件共用的常量，避免重复定义
 */

import type { EquipmentSlotType, ItemRarity, ItemType } from '../../types';

/**
 * 幻兽品质对应的颜色映射
 * 不同品质使用不同颜色显示
 */
export const PET_QUALITY_COLORS: Record<string, string> = {
  '普通': '#9e9e9e',
  '良品': '#4caf50',
  '上品': '#2196f3',
  '精品': '#9c27b0',
  '极品': '#ff9800'
};

/**
 * 装备品质颜色映射表（用于装备详情显示）
 */
export const EQUIPMENT_QUALITY_COLORS: Record<string, string> = {
  '普通品': '#FCFFFF',
  '良品': '#00ff00',
  '上品': '#0000ff',
  '精品': '#ff0000',
  '极品': '#cc00ff'
};

/**
 * 装备图标映射
 * 根据装备槽位类型返回对应的emoji图标
 */
export const EQUIPMENT_ICON_MAP: Record<EquipmentSlotType, string> = {
  weapon: '⚔️',
  helmet: '🪖',
  clothes: '🛡️',
  shoes: '👢',
  bracelet: '💫',
  necklace: '📿'
};

/**
 * 装备槽位类型中文名称映射
 */
export const EQUIPMENT_SLOT_TYPE_NAMES: Record<string, string> = {
  weapon: '武器',
  helmet: '头盔',
  clothes: '衣服',
  shoes: '战鞋',
  bracelet: '手镯',
  necklace: '项链',
  armor: '衣服'
};

/**
 * 幻兽类型对应的emoji图标映射
 * 用于在UI中显示幻兽头像（备用方案）
 */
export const PET_TYPE_EMOJI: Record<string, string> = {
  '攻防型': '🦁',
  '调皮猫': '👹',
  '吉鲁猪': '🐷',
  '奇异兽': '🦄',
  '圣天使': '👼',
  '守护': '🛡️',
  '年猪': '🐗'
};

/**
 * 幻兽类型对应的拼音文件名映射
 * 用于获取幻兽头像图片路径
 */
export const PET_TYPE_PINYIN: Record<string, string> = {
  '攻防型': 'gongfangxing',
  '调皮猫': 'tiaopimao',
  '吉鲁猪': 'jiluzhu',
  '奇异兽': 'qiyishou',
  '圣天使': 'shengtianshi',
  '守护': 'shouhu',
  '年猪': 'nianzhu'
};

/**
 * 物品类型中文名称映射
 */
export const ITEM_TYPE_NAMES: Record<ItemType, string> = {
  'consumable': '消耗品',
  'material': '材料',
  'equipment': '装备',
  'quest': '任务物品',
  'other': '其他',
  'skillBook': '技能书',
  'gem': '宝石',
  'special': '特殊道具',
  'pet': '幻兽'
};

/**
 * 物品稀有度配置
 * 包含中文名称和对应的颜色值
 */
export const RARITY_CONFIG: Record<ItemRarity, { name: string; color: string }> = {
  common: { name: '普通', color: '#9e9e9e' },
  uncommon: { name: '优秀', color: '#4caf50' },
  rare: { name: '稀有', color: '#2196f3' },
  epic: { name: '史诗', color: '#9c27b0' },
  legendary: { name: '传说', color: '#ff9800' }
};

/**
 * 稀有度CSS类名映射
 */
export const RARITY_CLASS_NAMES: Record<string, string> = {
  'common': 'rarity-common',
  'uncommon': 'rarity-uncommon',
  'rare': 'rarity-rare',
  'epic': 'rarity-epic',
  'legendary': 'rarity-legendary'
};
