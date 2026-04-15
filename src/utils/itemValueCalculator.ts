import type { EquipmentItem, InventoryItem } from '../types';

/**
 * 珍稀材料魔石价值配置
 * 定义各种珍稀材料的基础魔石价值
 */
const RARE_MATERIAL_VALUES: Record<string, number | ((item: InventoryItem) => number)> = {
  金矿: (item: InventoryItem) => (item.quality || 1) * 10,
  灵魂王: 2000,
  月光宝盒: 2700,
  月光宝盒增强版: 8280,
};

/**
 * 特殊道具魔石价值配置
 * 定义各种特殊道具的基础魔石价值
 */
const SPECIAL_ITEM_VALUES: Record<string, number | ((item: InventoryItem) => number)> = {
  电浆药水: 8280,
  '999朵白玫瑰': 4000,
  满经验球: (item: InventoryItem) => 100 * (item.quantity || 1),
};

/**
 * 计算珍稀材料的魔石价值
 * @param item - 物品对象
 * @returns 魔石价值，如果不是珍稀材料则返回0
 */
function calculateRareMaterialValue(item: InventoryItem): number {
  const valueConfig = RARE_MATERIAL_VALUES[item.name];
  if (valueConfig === undefined) {
    return 0;
  }

  if (typeof valueConfig === 'function') {
    return valueConfig(item);
  }

  return valueConfig;
}

/**
 * 计算特殊道具的魔石价值
 * @param item - 物品对象
 * @returns 魔石价值，如果不是特殊道具则返回0
 */
function calculateSpecialItemValue(item: InventoryItem): number {
  const valueConfig = SPECIAL_ITEM_VALUES[item.name];
  if (valueConfig === undefined) {
    return 0;
  }

  if (typeof valueConfig === 'function') {
    return valueConfig(item);
  }

  return valueConfig;
}

/**
 * 判断物品是否为装备类型
 * @param item - 物品对象
 * @returns 是否为装备
 */
function isEquipmentItem(item: InventoryItem): item is EquipmentItem {
  return item.type === 'equipment';
}

/**
 * 计算极品装备的魔石价值
 * 只有极品装备才有魔石价值
 * 公式：魔石价值 = 28 × (装备等级 × 2.5 + 50) + 魔魂等级 × 128 + 1500 × 宝石洞数量³
 * @param item - 装备物品对象
 * @returns 魔石价值，如果不是极品装备则返回0
 */
function calculateEquipmentValue(item: EquipmentItem): number {
  if (item.equipmentQuality !== '极品') {
    return 0;
  }

  const level = item.useLevel || 1;
  const magicSoulLevel = item.magicSoulLevel || 0;
  const holeCount = item.holeCount || 0;

  const baseValue = 28 * (level * 2.5 + 50);
  const magicSoulValue = magicSoulLevel * 128;
  const holeValue = 1500 * Math.pow(holeCount, 3);

  return Math.floor(baseValue + magicSoulValue + holeValue);
}

/**
 * 计算物品的魔石价值
 * @param item - 物品对象
 * @returns 魔石价值（如果物品无法出售给收藏家，返回0）
 */
export function calculateItemMagicStoneValue(item: InventoryItem): number {
  if (!item) {
    return 0;
  }

  let baseValue = 0;

  if (item.magicStoneValue !== undefined && item.magicStoneValue > 0) {
    baseValue = item.magicStoneValue;
  } else {
    const rareMaterialValue = calculateRareMaterialValue(item);
    if (rareMaterialValue > 0) {
      baseValue = rareMaterialValue;
    } else {
      const specialItemValue = calculateSpecialItemValue(item);
      if (specialItemValue > 0) {
        baseValue = specialItemValue;
      } else if (isEquipmentItem(item)) {
        baseValue = calculateEquipmentValue(item);
      }
    }
  }

  // 如果物品可堆叠（有quantity字段），则总价值 = 单个价值 × 数量
  // 装备不可堆叠，所以不需要乘以数量
  if (baseValue > 0 && !isEquipmentItem(item) && item.quantity && item.quantity > 1) {
    return baseValue * item.quantity;
  }

  return baseValue;
}

/**
 * 计算物品列表的总魔石价值
 * @param items - 物品列表
 * @returns 总魔石价值
 */
export function calculateTotalValue(items: InventoryItem[]): number {
  if (!items || items.length === 0) {
    return 0;
  }

  return items.reduce((total, item) => {
    return total + calculateItemMagicStoneValue(item);
  }, 0);
}

/**
 * 计算收购价格（80%）
 * 收藏家以魔石价值的80%收购物品
 * @param value - 物品魔石价值
 * @returns 收购价格
 */
export function calculatePurchasePrice(value: number): number {
  if (value <= 0) {
    return 0;
  }

  return Math.floor(value * 0.8);
}

/**
 * 批量计算收购价格
 * @param items - 物品列表
 * @returns 总收购价格
 */
export function calculateTotalPurchasePrice(items: InventoryItem[]): number {
  const totalValue = calculateTotalValue(items);

  return calculatePurchasePrice(totalValue);
}

/**
 * 格式化魔石数量显示（添加千分位分隔符）
 * @param value - 魔石数量
 * @returns 格式化后的字符串
 */
export function formatMagicStoneValue(value: number): string {
  return value.toLocaleString('zh-CN');
}
