/**
 * 抽奖系统工具函数模块
 * 提供抽奖概率计算、奖品选择、装备生成等功能
 *
 * 抽奖概率分布：
 * - 极品奖励 (0-19): 2%
 * - 高级奖励 (20-69): 5%
 * - 中级奖励 (70-449): 38%
 * - 普通奖励 (450-999): 55%
 */

import type {
  EquipmentItem,
  InventoryItem,
  Pet,
  PetType,
  PlayerResources,
} from '../types';
import {
  createEquipmentItem,
  createItemFromTemplate,
  randomEquipmentType,
  randomMagicSoulLevel
} from './itemFactory';
import { generatePetByType, generateStarStrangePet } from './petGenerator';

// ==================== 类型定义 ====================

/**
 * 奖品等级枚举
 * 定义抽奖的四个奖品等级
 */
export type PrizeLevel = 'legendary' | 'high' | 'medium' | 'common';

/**
 * 奖品等级中文名称映射
 */
export const PRIZE_LEVEL_NAMES: Record<PrizeLevel, string> = {
  legendary: '极品奖励',
  high: '高级奖励',
  medium: '中级奖励',
  common: '普通奖励',
};

/**
 * 抽奖结果接口
 * 定义抽奖的返回结果
 */
export interface LotteryResult {
  success: boolean; // 是否成功
  prizeLevel: PrizeLevel; // 奖品等级
  prizeName: string; // 奖品名称
  prizeItem?: InventoryItem; // 奖品物品（如果是物品）
  prizePet?: Pet; // 奖品幻兽（如果是幻兽）
  message: string; // 结果消息
  magicStoneCost: number; // 消耗的魔石
}

/**
 * 魔石检查结果接口
 */
export interface MagicStoneCheckResult {
  hasEnough: boolean; // 是否有足够魔石
  currentAmount: number; // 当前魔石数量
  requiredAmount: number; // 所需魔石数量
  shortage: number; // 缺少的魔石数量
}

// ==================== 极品奖品配置 ====================

/**
 * 极品奖品列表（6选1）
 * 概率：2% (0-19)
 */
const LEGENDARY_PRIZES = [
  { id: 'nianzhu_pet', name: '年猪幻兽', type: 'pet', petType: '年猪' as PetType },
  { id: 'moon_box_enhanced', name: '月光宝盒增强版', type: 'item' },
  { id: 'plasma_potion', name: '电浆药水', type: 'item' },
  { id: 'high_spirit_scroll', name: '高级斗志抑扬', type: 'item' },
  { id: 'rose_999', name: '999朵白玫瑰', type: 'item' },
  { id: 'legendary_equipment', name: '精品装备', type: 'equipment' },
];

// ==================== 高级奖品配置 ====================

/**
 * 高级奖品列表（7选1）
 * 概率：5% (20-69)
 */
const HIGH_PRIZES = [
  { id: 'saint_angel_pet', name: '圣天使幻兽', type: 'pet', petType: '圣天使' as PetType },
  { id: 'epic_equipment', name: '精品装备', type: 'equipment' },
  { id: 'flying_slash_skill', name: '飞天连斩(2/7)', type: 'item' },
  { id: 'spirit_scroll', name: '斗志抑扬', type: 'item' },
  { id: 'high_star_sword', name: '高级星魔剑', type: 'item' },
  { id: 'soul_king', name: '灵魂王', type: 'item' },
  { id: 'epic_equipment_2', name: '精品装备', type: 'equipment' },
];

// ==================== 中级奖品配置 ====================

/**
 * 中级奖品列表（5选1）
 * 概率：38% (70-449)
 */
const MEDIUM_PRIZES = [
  { id: '8star_pet', name: '8星奇异兽', type: 'pet', petType: '奇异兽' as PetType, starLevel: 8 },
  { id: 'rare_equipment', name: '精品装备', type: 'equipment' },
  { id: '12star_pet', name: '12星奇异兽', type: 'pet', petType: '奇异兽' as PetType, starLevel: 12 },
  { id: 'magic_heart', name: '幻魔之心', type: 'item' },
  { id: 'soul_heart', name: '魔魂之心', type: 'item' },
];

// ==================== 普通奖品配置 ====================

/**
 * 普通奖品列表（4选1）
 * 概率：55% (450-999)
 */
const COMMON_PRIZES = [
  { id: 'exp_orb', name: '满经验球', type: 'item' },
  { id: 'good_equipment', name: '优秀装备', type: 'equipment' },
  { id: 'soul_crystal', name: '灵魂晶石', type: 'item' },
  { id: 'rose_99', name: '99朵白玫瑰', type: 'item' },
];

// ==================== 核心抽奖函数 ====================

/**
 * 生成抽奖随机数
 * 生成0-999的随机整数，用于判定奖品等级
 *
 * @returns 0-999之间的随机整数
 */
export function generateLotteryNumber(): number {
  return Math.floor(Math.random() * 1000);
}

/**
 * 判定奖品等级
 * 根据随机值判定奖品等级
 *
 * @param randomNumber 抽奖随机数 (0-999)
 * @returns 奖品等级
 */
export function determinePrizeLevel(randomNumber: number): PrizeLevel {
  if (randomNumber >= 0 && randomNumber <= 19) {
    return 'legendary';
  } else if (randomNumber >= 20 && randomNumber <= 69) {
    return 'high';
  } else if (randomNumber >= 70 && randomNumber <= 449) {
    return 'medium';
  } else {
    return 'common';
  }
}

// ==================== 奖品选择函数 ====================

/**
 * 随机选择极品奖品
 * 从6个极品奖品中随机选择1个
 *
 * @param playerLevel 玩家等级（用于生成装备）
 * @returns 奖品信息
 */
export function selectLegendaryPrize(playerLevel: number): { name: string; item?: InventoryItem; pet?: Pet } {
  const prizeIndex = Math.floor(Math.random() * LEGENDARY_PRIZES.length);
  const prize = LEGENDARY_PRIZES[prizeIndex];

  if (prize.type === 'pet') {
    // 使用 petGenerator 的 generatePetByType 函数生成年猪幻兽
    return {
      name: prize.name,
      pet: generatePetByType(prize.petType!),
    };
  } else if (prize.type === 'equipment') {
    return {
      name: prize.name,
      item: generateLotteryEquipment(playerLevel, 3),
    };
  } else {
    return {
      name: prize.name,
      item: createLotteryItem(prize.name),
    };
  }
}

/**
 * 随机选择高级奖品
 * 从7个高级奖品中随机选择1个
 *
 * @param playerLevel 玩家等级（用于生成装备）
 * @returns 奖品信息
 */
export function selectHighPrize(playerLevel: number): { name: string; item?: InventoryItem; pet?: Pet } {
  const prizeIndex = Math.floor(Math.random() * HIGH_PRIZES.length);
  const prize = HIGH_PRIZES[prizeIndex];

  if (prize.type === 'pet') {
    // 使用 petGenerator 的 generatePetByType 函数生成圣天使幻兽
    return {
      name: prize.name,
      pet: generatePetByType(prize.petType!),
    };
  } else if (prize.type === 'equipment') {
    return {
      name: prize.name,
      item: generateLotteryEquipment(playerLevel, 3),
    };
  } else {
    return {
      name: prize.name,
      item: createLotteryItem(prize.name),
    };
  }
}

/**
 * 随机选择中级奖品
 * 从5个中级奖品中随机选择1个
 *
 * @param playerLevel 玩家等级（用于生成装备）
 * @returns 奖品信息
 */
export function selectMediumPrize(playerLevel: number): { name: string; item?: InventoryItem; pet?: Pet } {
  const prizeIndex = Math.floor(Math.random() * MEDIUM_PRIZES.length);
  const prize = MEDIUM_PRIZES[prizeIndex];

  if (prize.type === 'pet') {
    // 使用 petGenerator 的 generateStarStrangePet 函数生成指定星级奇异兽
    return {
      name: prize.name,
      pet: generateStarStrangePet(prize.starLevel || 8),
    };
  } else if (prize.type === 'equipment') {
    return {
      name: prize.name,
      item: generateLotteryEquipment(playerLevel, 3),
    };
  } else {
    return {
      name: prize.name,
      item: createLotteryItem(prize.name),
    };
  }
}

/**
 * 随机选择普通奖品
 * 从4个普通奖品中随机选择1个
 *
 * @param playerLevel 玩家等级（用于生成装备）
 * @returns 奖品信息
 */
export function selectCommonPrize(playerLevel: number): { name: string; item?: InventoryItem; pet?: Pet } {
  const prizeIndex = Math.floor(Math.random() * COMMON_PRIZES.length);
  const prize = COMMON_PRIZES[prizeIndex];

  if (prize.type === 'equipment') {
    return {
      name: prize.name,
      item: generateLotteryEquipment(playerLevel, 2),
    };
  } else {
    return {
      name: prize.name,
      item: createLotteryItem(prize.name),
    };
  }
}

// ==================== 装备生成函数 ====================

/**
 * 根据玩家等级生成装备
 * 使用统一的物品工厂模块创建装备
 *
 * 等级规则：
 * - 玩家等级 < 10: 装备等级 = 10
 * - 玩家等级 10-39: 装备等级 = 向下取整到10的倍数
 * - 玩家等级 >= 40: 装备等级 = 50
 *
 * @param playerLevel 玩家等级
 * @param quality 装备品质 (0-4)
 * @returns 装备物品
 */
export function generateLotteryEquipment(playerLevel: number, quality: number = 0): EquipmentItem {
  let equipmentLevel: number;

  if (playerLevel < 10) {
    equipmentLevel = 10;
  } else if (playerLevel >= 10 && playerLevel < 40) {
    equipmentLevel = Math.floor(playerLevel / 10) * 10;
  } else {
    equipmentLevel = 50;
  }

  // 使用统一的物品工厂创建装备
  return createEquipmentItem({
    equipmentType: randomEquipmentType(),
    level: equipmentLevel,
    quality,
    magicSoulLevel: randomMagicSoulLevel(quality),
    gemSlots: Math.random() < 0.1 ? Math.floor(Math.random() * 2) + 1 : 0,
  });
}

// ==================== 特殊物品生成函数 ====================

/**
 * 创建抽奖物品
 * 使用统一的物品工厂模块创建物品，保留原始ID以支持堆叠
 *
 * @param itemName 物品名称
 * @returns 物品数据
 */
function createLotteryItem(itemName: string): InventoryItem {
  // 使用 itemFactory 从模板创建物品，保留原始ID
  const item = createItemFromTemplate(itemName, 1);

  if (item) {
    return item;
  }

  // 如果找不到模板，创建基础物品
  return {
    id: `lottery_item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: itemName,
    icon: '🎁',
    quantity: 1,
    type: 'special',
    rarity: 'epic',
    source: '抽奖获得',
    description: `抽奖获得的${itemName}`,
    maxStack: 99,
    usable: true,
    equippable: false,
    goldValue: 0,
    magicStoneValue: 0,
    imagePath: `./images/items/special/${itemName}.png`,
  };
}

// ==================== 魔石检查和扣除函数 ====================

/**
 * 检查玩家是否有足够的魔石
 *
 * @param playerResources 玩家资源
 * @param requiredAmount 所需魔石数量
 * @returns 检查结果
 */
export function checkMagicStone(
  playerResources: PlayerResources,
  requiredAmount: number
): MagicStoneCheckResult {
  const currentAmount = playerResources.magicStone;
  const hasEnough = currentAmount >= requiredAmount;
  const shortage = hasEnough ? 0 : requiredAmount - currentAmount;

  return {
    hasEnough,
    currentAmount,
    requiredAmount,
    shortage,
  };
}

/**
 * 扣除魔石
 * 返回扣除后的玩家资源（不修改原对象）
 *
 * @param playerResources 玩家资源
 * @param amount 扣除数量
 * @returns 扣除后的玩家资源
 */
export function deductMagicStone(
  playerResources: PlayerResources,
  amount: number
): PlayerResources {
  return {
    ...playerResources,
    magicStone: Math.max(0, playerResources.magicStone - amount),
  };
}

// ==================== 完整抽奖流程函数 ====================

/**
 * 执行完整抽奖流程
 *
 * @param playerResources 玩家资源
 * @param playerLevel 玩家等级
 * @param magicStoneCost 抽奖消耗的魔石数量
 * @returns 抽奖结果
 */
export function executeLottery(
  playerResources: PlayerResources,
  playerLevel: number,
  magicStoneCost: number = 100
): LotteryResult {
  const checkResult = checkMagicStone(playerResources, magicStoneCost);

  if (!checkResult.hasEnough) {
    return {
      success: false,
      prizeLevel: 'common',
      prizeName: '',
      message: `魔石不足！当前魔石: ${checkResult.currentAmount}，需要: ${checkResult.requiredAmount}，缺少: ${checkResult.shortage}`,
      magicStoneCost: 0,
    };
  }

  const randomNumber = generateLotteryNumber();
  const prizeLevel = determinePrizeLevel(randomNumber);

  let prize: { name: string; item?: InventoryItem; pet?: Pet };

  switch (prizeLevel) {
    case 'legendary':
      prize = selectLegendaryPrize(playerLevel);
      break;
    case 'high':
      prize = selectHighPrize(playerLevel);
      break;
    case 'medium':
      prize = selectMediumPrize(playerLevel);
      break;
    case 'common':
    default:
      prize = selectCommonPrize(playerLevel);
      break;
  }

  const levelName = PRIZE_LEVEL_NAMES[prizeLevel];
  const message = `恭喜获得【${levelName}】: ${prize.name}`;

  return {
    success: true,
    prizeLevel,
    prizeName: prize.name,
    prizeItem: prize.item,
    prizePet: prize.pet,
    message,
    magicStoneCost,
  };
}

// ==================== 工具函数 ====================

/**
 * 获取奖品等级概率
 * 返回各奖品等级的概率百分比
 *
 * @returns 概率映射表
 */
export function getPrizeProbabilities(): Record<PrizeLevel, number> {
  return {
    legendary: 2,
    high: 5,
    medium: 38,
    common: 55,
  };
}

/**
 * 格式化抽奖结果消息
 *
 * @param result 抽奖结果
 * @returns 格式化后的消息
 */
export function formatLotteryResult(result: LotteryResult): string {
  if (!result.success) {
    return result.message;
  }

  const levelName = PRIZE_LEVEL_NAMES[result.prizeLevel];
  let message = `【${levelName}】\n`;
  message += `奖品: ${result.prizeName}\n`;
  message += `消耗魔石: ${result.magicStoneCost}`;

  return message;
}
