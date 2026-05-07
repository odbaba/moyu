/**
 * 统一的物品工厂模块
 * 提供统一的物品创建接口和ID生成规则
 * 所有物品来源（抽奖、战利品、商店等）都应使用此模块
 */

import {
  createEquipment,
  dianJiangYaoShui,
  findItemByName,
  kongJingYanQiu,
  lingHunJingShi,
  lingHunWang,
  manJingYanQiu,
  yueGuangBaoHe,
  yueGuangBaoHeZengQiangBan,
  zhanHunJingShi,
  zhanHunZhiXin,
} from '../data/inventoryData';
import type {
  EquipmentItem,
  EquipmentSlotType,
  InventoryItem,
  SpecialItem,
} from '../types';

// ==================== ID生成函数 ====================

/**
 * 生成唯一ID
 * 格式：{type}_{subtype}_{timestamp}_{random}
 *
 * @param type 物品类型（equip, consumable, gem, special等）
 * @param subtype 子类型（可选，如装备类型、物品名称等）
 * @returns 唯一ID字符串
 */
export function generateItemId(type: string, subtype?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);

  return subtype
    ? `${type}_${subtype}_${timestamp}_${random}`
    : `${type}_${timestamp}_${random}`;
}

// ==================== 装备创建工厂 ====================

/**
 * 创建装备物品
 * 统一的装备创建接口，使用 inventoryData.ts 中的 createEquipment 函数
 *
 * @param config 装备配置
 * @param config.equipmentType 装备类型（weapon, helmet, clothes等）
 * @param config.level 装备等级
 * @param config.quality 装备品质（0-4：普通、良品、上品、精品、极品）
 * @param config.magicSoulLevel 魔魂等级（0-12，默认0）
 * @param config.gemSlots 宝石孔数量（0-3，默认0）
 * @returns 装备物品
 */
export function createEquipmentItem(config: {
  equipmentType: EquipmentSlotType;
  level: number;
  quality: number;
  magicSoulLevel?: number;
  gemSlots?: number;
}): EquipmentItem {
  const { equipmentType, level, quality, magicSoulLevel = 0, gemSlots = 0 } = config;

  // 使用 inventoryData.ts 中的 createEquipment 函数创建装备
  const equipment = createEquipment(equipmentType, level, quality, magicSoulLevel, gemSlots);

  // 生成统一的ID
  const id = generateItemId('equip', `${equipmentType}_lv${level}_q${quality}`);

  return {
    ...equipment,
    id,
  };
}

// ==================== 消耗品创建工厂 ====================

/**
 * 从模板创建物品
 * 根据物品名称查找模板并创建实例
 * 不可堆叠物品生成唯一ID，避免背包中出现重复key
 * 可堆叠物品保留原始ID以支持堆叠合并
 *
 * @param name 物品名称
 * @param quantity 数量（默认1）
 * @returns 物品实例
 */
export function createItemFromTemplate(name: string, quantity: number = 1): InventoryItem | null {
  // 从 inventoryData 查找对应的物品模板
  const template = findItemByName(name);

  if (template) {
    // 判断是否为可堆叠物品（stackable === true 或 maxStack > 1）
    if (template.stackable === true || (template.maxStack && template.maxStack > 1)) {
      // 可堆叠物品保留原始ID，支持堆叠合并
      return {
        ...template,
        quantity,
      };
    } else {
      // 不可堆叠物品（如技能书）生成唯一ID，避免背包中重复key
      return {
        ...template,
        id: generateItemId(template.type, template.id),
        quantity,
      };
    }
  }

  // 如果找不到模板，返回null
  console.warn(`未找到物品模板: ${name}`);

  return null;
}

// ==================== 物品复制函数 ====================

/**
 * 复制单个物品模板
 * 用于战利品等场景
 * 不可堆叠物品生成唯一ID，可堆叠物品保留原始ID以支持堆叠合并
 *
 * @param item 原始物品
 * @returns 复制后的单个物品
 */
export function cloneItem(item: InventoryItem): InventoryItem {
  // 判断是否为可堆叠物品（stackable === true 或 maxStack > 1）
  if (item.stackable === true || (item.maxStack && item.maxStack > 1)) {
    // 可堆叠物品保留原始ID，支持堆叠合并
    return {
      ...item,
      quantity: 1,
    };
  } else {
    // 不可堆叠物品生成唯一ID，避免背包中重复key
    return {
      ...item,
      id: generateItemId(item.type, item.id),
      quantity: 1,
    };
  }
}

// ==================== 物品添加与堆叠合并函数 ====================

/**
 * 将物品添加到背包，处理堆叠合并逻辑
 * 可堆叠物品会自动合并到已有物品上，不可堆叠物品会添加为新物品
 *
 * @param inventory 当前背包物品列表
 * @param newItem 要添加的新物品
 * @returns 更新后的背包物品列表
 *
 * @example
 * // 添加可堆叠物品（会合并）
 * const newInventory = addItemToInventory(inventory, combatStone);
 *
 * // 添加不可堆叠物品（会创建新物品）
 * const newInventory = addItemToInventory(inventory, skillBook);
 */
export function addItemToInventory(
  inventory: InventoryItem[],
  newItem: InventoryItem
): InventoryItem[] {
  // 判断是否为可堆叠物品（stackable === true 或 maxStack > 1）
  if (newItem.stackable === true || (newItem.maxStack && newItem.maxStack > 1)) {
    // 可堆叠物品：查找背包中是否有相同ID的物品
    const existingItemIndex = inventory.findIndex(item => item.id === newItem.id);

    if (existingItemIndex !== -1) {
      // 找到相同ID的物品，直接合并数量
      const existingItem = inventory[existingItemIndex];
      const newQuantity = existingItem.quantity + newItem.quantity;

      // 更新物品数量
      const updatedInventory = [...inventory];
      updatedInventory[existingItemIndex] = {
        ...existingItem,
        quantity: newQuantity,
      };

      return updatedInventory;
    }
  }

  // 不可堆叠物品或背包中没有相同ID的可堆叠物品：直接添加
  return [...inventory, newItem];
}

// ==================== 常用物品模板导出 ====================

/**
 * 导出常用物品模板
 * 供其他模块直接使用
 */
export const ITEM_TEMPLATES = {
  // 宝石类
  lingHunJingShi,
  lingHunWang,
  zhanHunJingShi,
  zhanHunZhiXin,

  // 特殊道具类
  yueGuangBaoHe,
  yueGuangBaoHeZengQiangBan,

  // 消耗品类
  manJingYanQiu,
  kongJingYanQiu,
  dianJiangYaoShui,
};

// ==================== 辅助函数 ====================

/**
 * 随机选择装备类型
 * 用于抽奖、战利品等场景
 *
 * @returns 随机装备类型
 */
export function randomEquipmentType(): EquipmentSlotType {
  const types: EquipmentSlotType[] = ['weapon', 'helmet', 'necklace', 'clothes', 'bracelet', 'shoes'];

  return types[Math.floor(Math.random() * types.length)];
}

/**
 * 随机生成魔魂等级
 * 根据品质等级生成合适的魔魂等级
 *
 * @param quality 装备品质（0-4）
 * @returns 魔魂等级（0-12）
 */
export function randomMagicSoulLevel(quality: number): number {
  // 品质越高，魔魂等级范围越大
  if (quality >= 4) {
    // 极品装备：9-12级
    return 9 + Math.floor(Math.random() * 4);
  } else if (quality >= 3) {
    // 精品装备：5-9级
    return 5 + Math.floor(Math.random() * 5);
  } else {
    // 普通装备：0-5级
    return Math.floor(Math.random() * 6);
  }
}

/**
 * 随机生成宝石孔数量
 * 根据品质等级生成合适的宝石孔数量
 *
 * @param quality 装备品质（0-4）
 * @returns 宝石孔数量（0-3）
 */
export function randomGemSlots(quality: number): number {
  // 品质越高，宝石孔概率越大
  if (quality >= 4) {
    // 极品装备：50%概率有宝石孔
    return Math.random() < 0.5 ? Math.floor(Math.random() * 2) + 1 : 0;
  } else if (quality >= 3) {
    // 精品装备：30%概率有宝石孔
    return Math.random() < 0.3 ? Math.floor(Math.random() * 2) + 1 : 0;
  } else {
    // 普通装备：10%概率有宝石孔
    return Math.random() < 0.1 ? 1 : 0;
  }
}

// ==================== 矿石工厂函数 ====================

/**
 * 创建银矿物品
 * 从 inventoryData.ts 迁移，统一由 itemFactory 管理
 *
 * @param quality 矿石品质（1-10）
 * @returns 银矿 SpecialItem
 */
export function createSilverOreItem(quality: number): SpecialItem {
  return {
    id: `silver-ore-${quality}`,
    name: `银矿（品质${quality}）`,
    icon: '🥈',
    quantity: 0,
    type: 'special',
    rarity: quality >= 7 ? 'rare' : quality >= 4 ? 'uncommon' : 'common',
    source: '雷鸣矿洞挖矿获得',
    description: '含有银的矿石，卖给[卡萨诺城]的[杂货商]可以得到不少金币。',
    maxStack: 999,
    usable: false,
    equippable: false,
    specialType: 'ore',
    effect: '出售换金币',
    effectValue: quality * 10000,
    quality: quality,
    goldValue: quality * 10000,
    magicStoneValue: 0,
    imagePath: './images/items/special/yinkuang.png',
  };
}

/**
 * 创建金矿物品
 * 从 inventoryData.ts 迁移，统一由 itemFactory 管理
 *
 * @param quality 矿石品质（1-10）
 * @returns 金矿 SpecialItem
 */
export function createGoldOreItem(quality: number): SpecialItem {
  return {
    id: `gold-ore-${quality}`,
    name: `金矿（品质${quality}）`,
    icon: '🥇',
    quantity: 0,
    type: 'special',
    rarity: quality >= 7 ? 'rare' : quality >= 4 ? 'uncommon' : 'common',
    source: '雷鸣矿洞挖矿获得',
    description: '含有金的矿石，可以卖不菲的价钱，[卡萨诺城]的[收藏家]正在高价收购。',
    maxStack: 999,
    usable: false,
    equippable: false,
    specialType: 'ore',
    effect: '出售换魔石',
    effectValue: quality * 10,
    quality: quality,
    goldValue: 0,
    magicStoneValue: quality * 10,
    imagePath: './images/items/special/jinkuang.png',
  };
}

// ==================== 兜底物品创建函数 ====================

/**
 * 兜底物品创建配置
 * 当物品模板不存在时使用此配置创建基础物品
 */
export interface FallbackItemConfig {
  name: string;
  type: InventoryItem['type'];
  description?: string;
  icon?: string;
  source?: string;
  quantity?: number;
  rarity?: InventoryItem['rarity'];
  goldValue?: number;
  magicStoneValue?: number;
  imagePath?: string;
  maxStack?: number;
  stackable?: boolean;
  usable?: boolean;
  equippable?: boolean;
}

/**
 * 创建兜底物品
 * 当物品模板不存在时，使用此函数创建基础物品实例
 * 自动生成唯一ID，提供合理的默认值
 *
 * @param config 兜底物品配置
 * @returns 合法的 InventoryItem 实例
 */
export function createFallbackItem(config: FallbackItemConfig): InventoryItem {
  return {
    id: generateItemId(config.type, config.name),
    name: config.name,
    icon: config.icon || '🎁',
    quantity: config.quantity || 1,
    type: config.type,
    rarity: config.rarity || 'common',
    source: config.source || '未知来源',
    description: config.description || `${config.name}`,
    maxStack: config.maxStack || 99,
    usable: config.usable ?? false,
    equippable: config.equippable ?? false,
    goldValue: config.goldValue || 0,
    magicStoneValue: config.magicStoneValue || 0,
    imagePath: config.imagePath || `./images/items/${config.type}/${config.name}.png`,
    ...(config.stackable !== undefined ? { stackable: config.stackable } : {}),
  };
}
