/**
 * 幻兽研究所工具函数
 * 提供幻兽研究所的技术等级、生产量、VIP折扣等计算功能
 * 参考文档：reference/docs/幻兽研究所交互逻辑文档.md
 */

import type { InventoryItem, PetInstituteState, PlayerResources } from '../types';
import { getExperienceMultiplier } from './developerMode';

// ==================== 常量定义 ====================

/** 初始技术等级 */
export const INITIAL_TECH_LEVEL = 10;

/** 默认技术等级上限 */
export const DEFAULT_TECH_LEVEL_MAX = 150;

/** 最大生产量（初始1，完成7次任务后达到8） */
export const MAX_PRODUCTION_RATE = 8;

/** 最大VIP等级 */
export const MAX_VIP_LEVEL = 10;

/** 提高产量任务所需灵魂王数量映射（根据当前生产量） */
export const PRODUCTION_TASK_SOUL_KING_COST: Record<number, number> = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
};

/** 提高产量任务经验奖励映射（根据当前生产量）- 基础值 */
const PRODUCTION_TASK_EXP_REWARD_BASE: Record<number, number> = {
  1: 105000,
  2: 210000,
  3: 315000,
  4: 420000,
  5: 525000,
  6: 630000,
  7: 735000,
};

/**
 * 获取提高产量任务经验奖励（根据开发者模式调整）
 * @param productionRate 当前生产量
 * @returns 经验奖励值
 */
export function getProductionTaskExpReward(productionRate: number): number {
  const baseExp = PRODUCTION_TASK_EXP_REWARD_BASE[productionRate] || 0;

  return Math.floor(baseExp * getExperienceMultiplier());
}

// ==================== 初始化函数 ====================

/**
 * 创建初始幻兽研究所状态
 * @returns 初始状态
 */
export function createInitialPetInstituteState(): PetInstituteState {
  return {
    techLevel: INITIAL_TECH_LEVEL,
    techLevelMax: DEFAULT_TECH_LEVEL_MAX,
    productionRate: 1, // 初始每日产量为1
    stock: 0,
    vipLevel: 0,
    canDoProductionTask: true, // 初始可以进行提高产量任务
  };
}

// ==================== 计算函数 ====================

/**
 * 格式化技术等级为两位小数
 * @param techLevel 技术等级
 * @returns 格式化后的字符串
 */
export function formatTechLevel(techLevel: number): string {
  return techLevel.toFixed(2);
}

/**
 * 根据技术等级计算幻兽品质分
 * 公式：品质分 = Math.round(techLevel * 100 * 3 / 4)
 * @param techLevel 技术等级
 * @returns 品质分
 */
export function calculatePetQuality(techLevel: number): number {
  return Math.round(techLevel * 100 * 3 / 4);
}

/**
 * 计算购买价格（含VIP折扣）
 * 公式：基础价格 = Math.round(200 * (品质分 / 100 - 10))
 *      VIP价格 = Math.round((1 - vipLevel / 10) * 基础价格)
 * @param qualityScore 品质分
 * @param vipLevel VIP等级
 * @returns 价格（魔石）
 */
export function calculatePrice(qualityScore: number, vipLevel: number): number {
  const basePrice = Math.round(200 * (qualityScore / 100 - 10));
  const vipPrice = Math.round((1 - vipLevel / 10) * basePrice);

  return Math.max(0, vipPrice);
}

/**
 * 获取VIP折扣描述
 * @param vipLevel VIP等级
 * @returns 折扣描述
 */
export function getVipDiscountDescription(vipLevel: number): string {
  if (vipLevel === 0) {
    return '无折扣';
  }

  if (vipLevel === 10) {
    return '免费';
  }

  return `${(10 - vipLevel) * 10}%折扣`;
}

/**
 * 计算星级
 * 品质分 / 100 = 星级
 * @param qualityScore 品质分
 * @returns 星级
 */
export function calculateStarLevel(qualityScore: number): number {
  return Math.round(qualityScore / 100);
}

// ==================== 检查函数 ====================

/**
 * 检查是否可以购买幻兽
 * @param state 研究所状态
 * @param resources 玩家资源
 * @returns 是否可以购买
 */
export function canBuyPet(
  state: PetInstituteState,
  resources: PlayerResources
): { canBuy: boolean; reason: string } {
  // 检查技术等级是否达到20级
  if (state.techLevel < 20) {
    return { canBuy: false, reason: '技术20级前不能生产幻兽' };
  }

  // 检查库存
  if (state.stock <= 0) {
    return { canBuy: false, reason: '库存不足，请等待每日生产' };
  }

  // 计算价格
  const qualityScore = calculatePetQuality(state.techLevel);
  const price = calculatePrice(qualityScore, state.vipLevel);

  // 检查魔石
  if (resources.magicStone < price) {
    return { canBuy: false, reason: `魔石不足，需要 ${price} 魔石` };
  }

  return { canBuy: true, reason: '' };
}

/**
 * 检查是否可以资助
 * @param state 研究所状态
 * @param magicStones 资助魔石数量
 * @returns 是否可以资助
 */
export function canDonate(
  state: PetInstituteState,
  magicStones: number
): { canDonate: boolean; reason: string } {
  // 检查技术等级是否已满
  if (state.techLevel >= state.techLevelMax) {
    return { canDonate: false, reason: '技术等级已达上限' };
  }

  // 检查魔石数量是否有效
  if (magicStones <= 0) {
    return { canDonate: false, reason: '请输入有效的魔石数量' };
  }

  // 检查最低资助金额（100魔石）
  if (magicStones < 100) {
    return { canDonate: false, reason: '最低资助金额为100魔石' };
  }

  return { canDonate: true, reason: '' };
}

/**
 * 检查是否可以做提高产量任务
 * @param state 研究所状态
 * @param inventory 背包物品
 * @returns 是否可以做任务
 */
export function canImproveProduction(
  state: PetInstituteState,
  inventory: InventoryItem[]
): { canImprove: boolean; reason: string; requiredSoulKings: number } {
  // 检查是否可以完成任务
  if (!state.canDoProductionTask) {
    return { canImprove: false, reason: '本周提高产量任务已完成', requiredSoulKings: 0 };
  }

  // 检查生产量是否已满（最多5次任务，生产量从0到5）
  if (state.productionRate >= MAX_PRODUCTION_RATE) {
    return { canImprove: false, reason: '生产量已达上限', requiredSoulKings: 0 };
  }

  // 获取所需灵魂王数量
  const requiredSoulKings = PRODUCTION_TASK_SOUL_KING_COST[state.productionRate] || 0;

  // 检查背包中灵魂王数量
  const soulKingCount = inventory
    .filter(item => item.name === '灵魂王')
    .reduce((sum, item) => sum + item.quantity, 0);

  if (soulKingCount < requiredSoulKings) {
    return {
      canImprove: false,
      reason: `灵魂王不足，需要 ${requiredSoulKings} 个，当前 ${soulKingCount} 个`,
      requiredSoulKings,
    };
  }

  return { canImprove: true, reason: '', requiredSoulKings };
}

// ==================== 操作函数 ====================

/**
 * 购买幻兽
 * @param state 研究所状态
 * @param resources 玩家资源
 * @returns 购买结果
 */
export function buyPet(
  state: PetInstituteState,
  resources: PlayerResources
): { success: boolean; message: string; qualityScore: number; price: number } {
  const checkResult = canBuyPet(state, resources);

  if (!checkResult.canBuy) {
    return { success: false, message: checkResult.reason, qualityScore: 0, price: 0 };
  }

  const qualityScore = calculatePetQuality(state.techLevel);
  const price = calculatePrice(qualityScore, state.vipLevel);

  return {
    success: true,
    message: `成功购买奇异兽！品质分：${qualityScore}，花费：${price} 魔石`,
    qualityScore,
    price,
  };
}

/**
 * 资助魔石提升技术等级
 * 每100魔石提升0.01级技术等级
 * 技术等级达到20级时，如果生产量为0则自动+1
 * @param state 研究所状态
 * @param magicStones 资助魔石数量
 * @returns 资助结果
 */
export function donate(
  state: PetInstituteState,
  magicStones: number
): { success: boolean; message: string; levelsGained: number; productionRateGained: number } {
  const checkResult = canDonate(state, magicStones);

  if (!checkResult.canDonate) {
    return { success: false, message: checkResult.reason, levelsGained: 0, productionRateGained: 0 };
  }

  // 计算提升等级（每100魔石提升0.01级）
  const levelsGained = magicStones / 100 / 100;

  // 检查是否超过上限
  const newLevel = Math.min(state.techLevel + levelsGained, state.techLevelMax);
  const actualLevelsGained = newLevel - state.techLevel;

  if (actualLevelsGained <= 0) {
    return { success: false, message: '魔石数量不足以提升技术等级', levelsGained: 0, productionRateGained: 0 };
  }

  return {
    success: true,
    message: `成功提升技术等级 ${actualLevelsGained.toFixed(2)} 级！当前等级：${newLevel.toFixed(2)}`,
    levelsGained: actualLevelsGained,
    productionRateGained: 0,
  };
}

/**
 * 完成提高产量任务
 * @param state 研究所状态
 * @param inventory 背包物品
 * @returns 任务结果
 */
export function improveProduction(
  state: PetInstituteState,
  inventory: InventoryItem[]
): {
  success: boolean;
  message: string;
  expGained: number;
  vipGained: number;
  consumedSoulKings: number;
} {
  const checkResult = canImproveProduction(state, inventory);

  if (!checkResult.canImprove) {
    return {
      success: false,
      message: checkResult.reason,
      expGained: 0,
      vipGained: 0,
      consumedSoulKings: 0,
    };
  }

  const expGained = getProductionTaskExpReward(state.productionRate);
  const vipGained = 1;

  return {
    success: true,
    message: `成功完成提高产量任务！生产量+1，获得经验 ${expGained}，VIP星级+1`,
    expGained,
    vipGained,
    consumedSoulKings: checkResult.requiredSoulKings,
  };
}

// ==================== 信息函数 ====================

/**
 * 获取研究所信息文本
 * @param state 研究所状态
 * @returns 信息文本
 */
export function getInstituteInfo(state: PetInstituteState): string {
  const qualityScore = calculatePetQuality(state.techLevel);
  const price = calculatePrice(qualityScore, state.vipLevel);
  const starLevel = calculateStarLevel(qualityScore);
  const discount = getVipDiscountDescription(state.vipLevel);

  let info = '【幻兽研究所信息】\n\n';
  info += `技术等级：${formatTechLevel(state.techLevel)} / ${formatTechLevel(state.techLevelMax)}\n`;
  info += `当前库存：${state.stock}\n`;
  info += `每日产量：${state.productionRate}\n`;
  info += `VIP星级：${state.vipLevel} 星（${discount}）\n\n`;
  info += '【奇异兽品质】\n';
  info += `品质分：${qualityScore}\n`;
  info += `星级：${starLevel} 星\n`;
  info += `价格：${price} 魔石\n`;

  return info;
}

// ==================== 重置函数 ====================

/**
 * 每日重置
 * 库存增加（等于生产量）
 * @param state 研究所状态
 * @returns 新状态
 */
export function dailyReset(state: PetInstituteState): PetInstituteState {
  return {
    ...state,
    stock: state.stock + state.productionRate,
  };
}

/**
 * 周日重置
 * 技术等级提升10%（如果未达上限）
 * 开启提高产量任务
 * @param state 研究所状态
 * @returns 新状态
 */
export function weeklyReset(state: PetInstituteState): PetInstituteState {
  // 计算技术等级提升（10%）
  const techIncrease = Math.max(1, Math.floor(state.techLevel * 0.1));
  const newTechLevel = Math.min(state.techLevel + techIncrease, state.techLevelMax);

  return {
    ...state,
    techLevel: newTechLevel,
    canDoProductionTask: true,
  };
}

/**
 * 关闭提高产量任务
 * 每周日完成任务后调用
 * @param state 研究所状态
 * @returns 新状态
 */
export function closeProductionTask(state: PetInstituteState): PetInstituteState {
  return {
    ...state,
    canDoProductionTask: false,
  };
}

// ==================== 消耗物品函数 ====================

/**
 * 从背包中消耗指定数量的指定物品
 * @param inventory 背包物品列表
 * @param itemName 物品名称
 * @param count 数量
 * @returns 新的背包物品列表
 */
export function consumeItemFromInventory(
  inventory: InventoryItem[],
  itemName: string,
  count: number
): InventoryItem[] {
  const newInventory = [...inventory];
  let remaining = count;

  for (let i = newInventory.length - 1; i >= 0 && remaining > 0; i--) {
    const item = newInventory[i];

    if (item.name === itemName) {
      if (item.quantity <= remaining) {
        remaining -= item.quantity;
        newInventory.splice(i, 1);
      } else {
        item.quantity -= remaining;
        remaining = 0;
      }
    }
  }

  return newInventory;
}
