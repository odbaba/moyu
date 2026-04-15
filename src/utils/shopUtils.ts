/**
 * 商店系统工具函数
 * 提供商店购买、出售、物品生成等功能
 * 参考文档：
 * - reference/docs/杂货商交互逻辑文档.md
 * - reference/docs/魔石商人交互逻辑文档.md
 */

import type {
  ShopItem,
  ShopType,
  PurchaseResult,
  SellResult,
  InventoryItem,
  PlayerResources,
  EquipmentItem,
  Pet,
  EquipmentSlotType,
  EquipmentQuality,
} from '../types';
import { getShopItemById } from '../data/shopData';

// ==================== 货币检查函数 ====================

/**
 * 检查玩家是否有足够的货币购买物品
 * @param playerGold 玩家金币数量
 * @param playerMagicStone 玩家魔石数量
 * @param item 物品信息
 * @param quantity 购买数量
 * @param shopType 商店类型
 * @returns 是否能够支付
 */
export function canAffordPurchase(
  playerGold: number,
  playerMagicStone: number,
  item: ShopItem,
  quantity: number,
  shopType: ShopType
): boolean {
  if (shopType === 'gold') {
    // 金币商店：检查金币是否足够
    const totalGold = item.priceGold * quantity;
    return playerGold >= totalGold;
  } else {
    // 魔石商店：检查魔石是否足够
    const totalMagicStone = item.priceMagicStone * quantity;
    return playerMagicStone >= totalMagicStone;
  }
}

// ==================== 背包空间检查函数 ====================

/**
 * 检查背包是否有足够空间
 * @param inventoryItems 当前背包物品列表
 * @param maxSlots 背包最大格子数
 * @param item 要添加的物品
 * @param quantity 数量
 * @returns 是否有足够空间
 */
export function hasInventorySpace(
  inventoryItems: InventoryItem[],
  maxSlots: number,
  item: ShopItem,
  quantity: number
): boolean {
  // 如果物品可堆叠，检查是否已有相同物品
  if (item.stackable) {
    const existingItem = inventoryItems.find(invItem => invItem.id === item.id);
    if (existingItem) {
      // 已有相同物品，检查是否可以堆叠
      const currentStack = existingItem.quantity || 1;
      const maxStack = item.maxStack;
      const canStack = currentStack + quantity <= maxStack;
      if (canStack) {
        return true; // 可以堆叠到现有物品上
      }
    }
  }

  // 检查背包是否有空位
  const usedSlots = inventoryItems.length;
  const hasEmptySlot = usedSlots < maxSlots;
  return hasEmptySlot;
}

// ==================== 出售价格计算函数 ====================

/**
 * 计算物品的出售价格（物品价值的75%）
 * 根据参考文档：
 * - 装备类：金币价值 = 100 * dj * (pz + 1) + 100 * mhdj + 10000 * dong³
 * - 装备类（极品）：魔石价值 = 28 * (dj * 2.5 + 50) + mhdj * 128 + 1500 * dong³
 * - 非装备类：使用 goldValue 和 magicStoneValue 属性
 * @param item 物品信息
 * @returns 出售价格（金币和魔石）
 */
export function calculateSellPrice(item: InventoryItem): { gold: number; magicStone: number } {
  const quantity = item.quantity || 1;
  
  // 装备类物品：根据公式计算价值
  if (item.type === 'equipment') {
    const equipmentItem = item as EquipmentItem;
    const dj = equipmentItem.useLevel || 1;
    // 品质值：普通品=0, 良品=1, 上品=2, 精品=3, 极品=4
    const pzMap: Record<string, number> = {
      '普通品': 0,
      '良品': 1,
      '上品': 2,
      '精品': 3,
      '极品': 4,
    };
    const pz = pzMap[equipmentItem.equipmentQuality] || 0;
    const mhdj = equipmentItem.magicSoulLevel || 0;
    const dong = equipmentItem.holeCount || 0;
    
    // 金币价值 = 100 * dj * (pz + 1) + 100 * mhdj + 10000 * dong³
    const goldValue = 100 * dj * (pz + 1) + 100 * mhdj + 10000 * dong * dong * dong;
    
    // 魔石价值（仅极品 pz=4）
    let magicStoneValue = 0;
    if (pz === 4) {
      magicStoneValue = 28 * (dj * 2.5 + 50) + mhdj * 128 + 1500 * dong * dong * dong;
    }
    
    // 出售价格为75%
    return {
      gold: Math.floor(goldValue * 0.75) * quantity,
      magicStone: Math.floor(magicStoneValue * 0.75) * quantity,
    };
  }
  
  // 非装备类物品：使用 goldValue 和 magicStoneValue 属性
  const goldValue = item.goldValue || 0;
  const magicStoneValue = item.magicStoneValue || 0;
  
  // 出售价格为75%
  return {
    gold: Math.floor(goldValue * 0.75) * quantity,
    magicStone: Math.floor(magicStoneValue * 0.75) * quantity,
  };
}

// ==================== 购买流程函数 ====================

/**
 * 执行购买流程
 * @param item 物品信息
 * @param quantity 购买数量
 * @param shopType 商店类型
 * @param playerResources 玩家资源
 * @param inventoryItems 背包物品列表
 * @param maxSlots 背包最大格子数
 * @returns 购买结果
 */
export function purchaseItem(
  item: ShopItem,
  quantity: number,
  shopType: ShopType,
  playerResources: PlayerResources,
  inventoryItems: InventoryItem[],
  maxSlots: number = 1000
): PurchaseResult {
  // 1. 检查购买数量是否合法
  if (quantity <= 0) {
    return {
      success: false,
      message: '购买数量必须大于0',
    };
  }

  if (quantity > 99) {
    return {
      success: false,
      message: '单次购买数量不能超过99',
    };
  }

  // 2. 检查货币是否足够
  const canAfford = canAffordPurchase(
    playerResources.gold,
    playerResources.magicStone,
    item,
    quantity,
    shopType
  );

  if (!canAfford) {
    const currencyName = shopType === 'gold' ? '金币' : '魔石';
    return {
      success: false,
      message: `${currencyName}不足，无法购买`,
    };
  }

  // 3. 检查背包空间
  const hasSpace = hasInventorySpace(inventoryItems, maxSlots, item, quantity);
  if (!hasSpace) {
    return {
      success: false,
      message: '背包已满，无法购买',
    };
  }

  // 4. 计算花费
  const goldSpent = shopType === 'gold' ? item.priceGold * quantity : 0;
  const magicStoneSpent = shopType === 'magicStone' ? item.priceMagicStone * quantity : 0;

  // 5. 返回购买成功结果
  return {
    success: true,
    message: `成功购买 ${item.name} × ${quantity}`,
    itemId: item.id,
    quantity,
    goldSpent,
    magicStoneSpent,
  };
}

// ==================== 出售流程函数 ====================

/**
 * 执行出售流程
 * @param item 物品信息
 * @param quantity 出售数量
 * @returns 出售结果
 */
export function sellItem(
  item: InventoryItem,
  quantity: number
): SellResult {
  // 1. 检查出售数量是否合法
  if (quantity <= 0) {
    return {
      success: false,
      message: '出售数量必须大于0',
    };
  }

  // 2. 检查物品数量是否足够
  const currentQuantity = item.quantity || 1;
  if (quantity > currentQuantity) {
    return {
      success: false,
      message: '出售数量超过物品数量',
    };
  }

  // 3. 计算出售价格（创建临时物品用于计算单价）
  const tempItem = { ...item, quantity: 1 };
  const unitPrice = calculateSellPrice(tempItem);
  const goldEarned = unitPrice.gold * quantity;
  const magicStoneEarned = unitPrice.magicStone * quantity;

  // 4. 构建结果消息
  let message = `成功出售 ${item.name} × ${quantity}`;
  if (goldEarned > 0 && magicStoneEarned > 0) {
    message += `，获得 ${goldEarned} 金币和 ${magicStoneEarned} 魔石`;
  } else if (goldEarned > 0) {
    message += `，获得 ${goldEarned} 金币`;
  } else if (magicStoneEarned > 0) {
    message += `，获得 ${magicStoneEarned} 魔石`;
  }

  // 5. 返回出售成功结果
  return {
    success: true,
    message,
    goldEarned,
    magicStoneEarned,
    itemId: item.id,
    quantity,
  };
}

// ==================== 随机武器生成函数 ====================

/**
 * 生成随机武器
 * @returns 装备物品数据
 */
export function generateRandomWeapon(): EquipmentItem {
  // 1. 随机装备类型
  const equipmentTypes: EquipmentSlotType[] = ['weapon', 'helmet', 'clothes', 'shoes', 'bracelet', 'necklace'];
  const equipmentType = equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)];

  // 2. 随机品质（普通50%、良好33%、优秀17%）
  const qualityRandom = Math.random() * 100;
  let quality: EquipmentQuality;
  if (qualityRandom < 50) {
    quality = '普通品';
  } else if (qualityRandom < 83) {
    quality = '良品';
  } else {
    quality = '上品';
  }

  // 3. 随机洞数（0.1%概率有1-2个洞）
  let sockets = 0;
  if (Math.random() < 0.001) {
    sockets = Math.floor(Math.random() * 2) + 1; // 1-2个洞
  }

  // 4. 随机魔魂等级（0-3级）
  const magicSoulLevel = Math.floor(Math.random() * 4);

  // 5. 生成装备ID
  const id = `random_${equipmentType}_${Date.now()}`;

  // 6. 根据品质计算属性
  const qualityMultiplier = quality === '普通品' ? 1 : quality === '良品' ? 1.2 : 1.5;

  // 7. 返回装备数据
  return {
    id,
    name: '随机装备',
    type: 'equipment',
    equipmentType,
    level: 1,
    quality,
    attack: Math.floor((10 + Math.random() * 10) * qualityMultiplier),
    defense: Math.floor((5 + Math.random() * 5) * qualityMultiplier),
    maxHp: Math.floor((50 + Math.random() * 50) * qualityMultiplier),
    maxMp: Math.floor((20 + Math.random() * 20) * qualityMultiplier),
    sockets,
    magicSoulLevel,
    icon: '⚔️',
    description: `随机生成的${quality}装备`,
    quantity: 1,
    priceGold: 1000,
    priceMagicStone: 0,
  };
}

// ==================== 幻兽生成函数 ====================

/**
 * 生成幻兽
 * @param petType 幻兽类型
 * @returns 幻兽数据
 */
export function generatePet(petType: string): Pet {
  // 基础品质分数（根据幻兽类型）
  let baseQualityScore = 0;
  switch (petType) {
    case '攻防型':
      baseQualityScore = 0;
      break;
    case '调皮猫':
      baseQualityScore = 280;
      break;
    case '吉鲁猪':
      baseQualityScore = 380;
      break;
    case '奇异兽':
      baseQualityScore = 500;
      break;
    case '守护':
      baseQualityScore = 1200;
      break;
    case '8星奇异兽':
      baseQualityScore = 800;
      break;
    case '12星奇异兽':
      baseQualityScore = 1200;
      break;
    default:
      baseQualityScore = 0;
  }

  // 随机生成初始属性
  const initialAttack = 10 + Math.floor(Math.random() * 20);
  const initialDefense = 5 + Math.floor(Math.random() * 10);
  const initialHp = 20 + Math.floor(Math.random() * 30);

  // 随机生成成长属性
  const growthAttack = 8 + Math.floor(Math.random() * 12);
  const growthDefense = 1 + Math.floor(Math.random() * 6);
  const growthHp = 30 + Math.floor(Math.random() * 20);

  // 计算品质分数
  const qualityScore = baseQualityScore + 
    Math.floor(initialAttack / 10) + 
    Math.floor(initialDefense / 5) + 
    Math.floor(initialHp / 20) +
    Math.floor(growthAttack / 5) +
    Math.floor(growthDefense / 2) +
    Math.floor(growthHp / 10);

  // 确定品质等级
  let quality: '普通' | '良品' | '上品' | '精品' | '极品';
  if (qualityScore >= 1000) {
    quality = '极品';
  } else if (qualityScore >= 800) {
    quality = '精品';
  } else if (qualityScore >= 500) {
    quality = '上品';
  } else if (qualityScore >= 200) {
    quality = '良品';
  } else {
    quality = '普通';
  }

  // 生成幻兽ID
  const id = `pet_${petType}_${Date.now()}`;

  // 返回幻兽数据
  return {
    id,
    name: petType,
    type: petType as any,
    level: 1,
    quality,
    qualityScore,
    initialAttack,
    initialDefense,
    initialHp,
    growthAttack,
    growthDefense,
    growthHp,
    currentAttack: initialAttack,
    currentDefense: initialDefense,
    currentHp: initialHp,
    maxHp: initialHp,
    deployed: false,
    stars: 0,
    icon: '🐾',
  };
}

// ==================== 辅助函数 ====================

/**
 * 格式化货币数量显示
 * @param amount 货币数量
 * @returns 格式化后的字符串
 */
export function formatCurrency(amount: number): string {
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(2)}亿`;
  } else if (amount >= 10000) {
    return `${(amount / 10000).toFixed(2)}万`;
  } else {
    return amount.toString();
  }
}
