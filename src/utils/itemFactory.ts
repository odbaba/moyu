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
  zhanHunZhiXin,
} from '../data/inventoryData';
import type {
  EquipmentItem,
  EquipmentSlotType,
  InventoryItem,
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
 * 创建消耗品物品
 * 从 inventoryData.ts 获取模板并复制，生成新的唯一ID
 *
 * @param config 消耗品配置
 * @param config.id 消耗品ID（用于查找模板）
 * @param config.name 消耗品名称
 * @param config.quantity 数量（默认1）
 * @returns 消耗品物品
 */
export function createConsumableItem(config: {
  id: string;
  name: string;
  quantity?: number;
}): InventoryItem {
  const { id, name, quantity = 1 } = config;

  // 从 inventoryData 查找对应的消耗品模板
  const template = findItemByName(name);

  if (template && template.type === 'consumable') {
    // 找到模板，复制并生成新ID
    return {
      ...template,
      id: generateItemId('consumable', id),
      quantity,
    };
  }

  // 如果找不到模板，创建基础的消耗品
  return {
    id: generateItemId('consumable', id),
    name,
    icon: '📦',
    quantity,
    type: 'consumable',
    rarity: 'common',
    source: '游戏获取',
    description: `${name}，一种消耗品。`,
    maxStack: 99,
    usable: true,
    equippable: false,
    goldValue: 0,
    magicStoneValue: 0,
    imagePath: `/images/items/consumable/${id}.png`,
  };
}

// ==================== 宝石创建工厂 ====================

/**
 * 创建宝石物品
 * 从 inventoryData.ts 获取模板并复制，生成新的唯一ID
 *
 * @param config 宝石配置
 * @param config.id 宝石ID（用于查找模板）
 * @param config.name 宝石名称
 * @param config.quantity 数量（默认1）
 * @returns 宝石物品
 */
export function createGemItem(config: {
  id: string;
  name: string;
  quantity?: number;
}): InventoryItem {
  const { id, name, quantity = 1 } = config;

  // 从 inventoryData 查找对应的宝石模板
  const template = findItemByName(name);

  if (template && template.type === 'gem') {
    // 找到模板，复制并生成新ID
    return {
      ...template,
      id: generateItemId('gem', id),
      quantity,
    };
  }

  // 如果找不到模板，创建基础的宝石
  return {
    id: generateItemId('gem', id),
    name,
    icon: '💎',
    quantity,
    type: 'gem',
    rarity: 'rare',
    source: '游戏获取',
    description: `${name}，一种珍贵的宝石。`,
    maxStack: 99,
    usable: false,
    equippable: false,
    goldValue: 0,
    magicStoneValue: 0,
    imagePath: `/images/items/gem/${id}.png`,
  };
}

// ==================== 特殊道具创建工厂 ====================

/**
 * 创建特殊道具
 * 从 inventoryData.ts 获取模板并复制，保留原始ID以支持堆叠
 *
 * @param config 特殊道具配置
 * @param config.id 特殊道具ID（用于查找模板）
 * @param config.name 特殊道具名称
 * @param config.quantity 数量（默认1）
 * @returns 特殊道具物品
 */
export function createSpecialItem(config: {
  id: string;
  name: string;
  quantity?: number;
}): InventoryItem {
  const { id, name, quantity = 1 } = config;

  // 从 inventoryData 查找对应的特殊道具模板
  const template = findItemByName(name);

  if (template) {
    // 找到模板，复制并保留原始ID（支持堆叠）
    return {
      ...template,
      quantity,
    };
  }

  // 如果找不到模板，创建基础的特殊道具
  return {
    id: `special_${id}`,
    name,
    icon: '🎁',
    quantity,
    type: 'special',
    rarity: 'epic',
    source: '游戏获取',
    description: `${name}，一种特殊的道具。`,
    maxStack: 99,
    usable: true,
    equippable: false,
    goldValue: 0,
    magicStoneValue: 0,
    imagePath: `/images/items/special/${id}.png`,
  };
}

/**
 * 从模板创建物品
 * 根据物品名称查找模板并创建实例
 * 不可堆叠物品（maxStack <= 1）生成唯一ID，避免背包中出现重复key
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
    // 判断是否为可堆叠物品
    const isStackable = template.stackable === true || (template.maxStack && template.maxStack > 1);

    if (isStackable) {
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
  // 判断是否为可堆叠物品
  const isStackable = item.stackable === true || (item.maxStack && item.maxStack > 1);

  if (isStackable) {
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
  // 判断是否为可堆叠物品
  const isStackable = newItem.stackable === true || (newItem.maxStack && newItem.maxStack > 1);

  if (isStackable) {
    // 可堆叠物品：查找背包中是否有相同ID的物品
    const existingItemIndex = inventory.findIndex(item => item.id === newItem.id);

    if (existingItemIndex !== -1) {
      // 找到相同ID的物品，合并数量
      const existingItem = inventory[existingItemIndex];
      const newQuantity = existingItem.quantity + newItem.quantity;

      // 检查是否超过最大堆叠数量
      const maxStack = existingItem.maxStack || 99;
      const finalQuantity = Math.min(newQuantity, maxStack);

      // 更新物品数量
      const updatedInventory = [...inventory];
      updatedInventory[existingItemIndex] = {
        ...existingItem,
        quantity: finalQuantity,
      };

      // 如果数量超过最大堆叠，创建新的物品实例
      if (newQuantity > maxStack) {
        const overflowQuantity = newQuantity - maxStack;
        const overflowItem = {
          ...newItem,
          quantity: overflowQuantity,
        };
        updatedInventory.push(overflowItem);
      }

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
