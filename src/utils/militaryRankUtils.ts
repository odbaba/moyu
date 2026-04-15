/**
 * 军衔系统工具函数
 * 提供军衔系统的核心功能，包括军衔查询、军饷领取、战功查询、军情查询等
 * 参考文档：reference/docs/scripts_analysis/14_NPC系统.md
 */

import {
  getMilitaryRankByLevel,
  getNextMilitaryRankExp,
  MILITARY_RANKS} from '../data/rankData';
import type { Weekday } from '../types';

// ========== 核心工具函数 ==========

/**
 * 获取军衔名称
 * @param level 军衔等级 (0-11)
 * @returns 军衔名称
 */
export function getMilitaryRankName(level: number): string {
  const rank = getMilitaryRankByLevel(level);

  return rank.name;
}

/**
 * 获取军饷数量
 * 根据军衔等级返回周日可领取的魔石数量
 * @param level 军衔等级 (0-11)
 * @returns 军饷数量（魔石）
 */
export function getMilitaryRankPay(level: number): number {
  const rank = getMilitaryRankByLevel(level);

  return rank.pay;
}

/**
 * 获取晋升所需战功
 * @param level 当前军衔等级
 * @returns 晋升到下一级所需战功，如果已满级返回 null
 */
export function getNextRankRequirement(level: number): number | null {
  return getNextMilitaryRankExp(level);
}

/**
 * 判断是否可以晋升军衔
 * @param currentExp 当前累计战功
 * @param currentLevel 当前军衔等级
 * @returns 是否可以晋升
 */
export function canPromoteMilitaryRank(currentExp: number, currentLevel: number): boolean {
  // 已满级，无法晋升
  if (currentLevel >= 11) {
    return false;
  }

  // 获取下一级所需战功
  const nextRequirement = getNextRankRequirement(currentLevel);
  if (nextRequirement === null) {
    return false;
  }

  // 判断战功是否足够
  return currentExp >= nextRequirement;
}

/**
 * 获取军衔战斗力加成
 * @param level 军衔等级
 * @returns 战斗力加成百分比
 */
export function getMilitaryRankCombatPowerBonus(level: number): number {
  const rank = getMilitaryRankByLevel(level);

  return rank.combatPowerBonus;
}

// ========== 军饷领取功能 ==========

/**
 * 军饷领取结果接口
 */
export interface PayClaimResult {
  success: boolean; // 是否成功领取
  message: string; // 结果消息
  magicStone: number; // 获得的魔石数量
  specialReward?: string; // 特殊奖励（少将以上）
}

/**
 * 检查是否可以领取军饷
 * 只有周日才能领取军饷
 * @param weekday 当前星期
 * @returns 是否可以领取
 */
export function canClaimMilitaryPay(weekday: Weekday): boolean {
  return weekday === '星期日';
}

/**
 * 领取军饷
 * 周日根据军衔等级发放魔石奖励
 * 军衔≥7级（少将以上）额外获得"高级斗志抑扬"
 * @param militaryRankLevel 军衔等级
 * @param weekday 当前星期
 * @param hasClaimedToday 今天是否已领取
 * @returns 领取结果
 */
export function claimMilitaryPay(
  militaryRankLevel: number,
  weekday: Weekday,
  hasClaimedToday: boolean
): PayClaimResult {
  // 检查是否是周日
  if (!canClaimMilitaryPay(weekday)) {
    return {
      success: false,
      message: '只有在星期日才能领取军饷！',
      magicStone: 0
    };
  }

  // 检查是否已领取
  if (hasClaimedToday) {
    return {
      success: false,
      message: '你今天已经领取过军饷了！',
      magicStone: 0
    };
  }

  // 检查军衔等级
  if (militaryRankLevel === 0) {
    return {
      success: false,
      message: '你还没有军衔，无法领取军饷！',
      magicStone: 0
    };
  }

  // 计算军饷
  const magicStone = getMilitaryRankPay(militaryRankLevel);
  const rankName = getMilitaryRankName(militaryRankLevel);

  // 少将以上额外奖励
  let specialReward: string | undefined;
  if (militaryRankLevel >= 7) {
    specialReward = '高级斗志抑扬';
  }

  // 构建成功消息
  let message = `恭喜你领取了${rankName}军衔的军饷！\n获得魔石：${magicStone.toLocaleString()}`;
  if (specialReward) {
    message += `\n额外奖励：${specialReward}`;
  }

  return {
    success: true,
    message,
    magicStone,
    specialReward
  };
}

// ========== 战功查询功能 ==========

/**
 * 战功查询结果接口
 */
export interface BattleExpQueryResult {
  currentExp: number; // 当前战功
  currentLevel: number; // 当前军衔等级
  currentRankName: string; // 当前军衔名称
  nextLevel: number | null; // 下一级军衔等级
  nextRankName: string | null; // 下一级军衔名称
  nextRequirement: number | null; // 晋升所需战功
  progress: number; // 晋升进度（百分比）
  canPromote: boolean; // 是否可以晋升
}

/**
 * 查询战功信息
 * 显示当前战功和晋升需求
 * @param currentExp 当前累计战功
 * @returns 战功查询结果
 */
export function queryBattleExp(currentExp: number): BattleExpQueryResult {
  // 获取当前军衔等级
  const currentLevel = getCurrentMilitaryRankLevel(currentExp);
  const currentRankName = getMilitaryRankName(currentLevel);

  // 获取下一级信息
  let nextLevel: number | null = null;
  let nextRankName: string | null = null;
  let nextRequirement: number | null = null;
  let progress = 0;

  if (currentLevel < 11) {
    nextLevel = currentLevel + 1;
    nextRankName = getMilitaryRankName(nextLevel);
    nextRequirement = getNextRankRequirement(currentLevel);

    // 计算晋升进度
    if (nextRequirement !== null) {
      const currentRankExp = MILITARY_RANKS[currentLevel].requiredBattleExp;
      const expNeeded = nextRequirement - currentRankExp;
      const expGained = currentExp - currentRankExp;
      progress = Math.min(100, Math.floor((expGained / expNeeded) * 100));
    }
  }

  // 判断是否可以晋升
  const canPromote = canPromoteMilitaryRank(currentExp, currentLevel);

  return {
    currentExp,
    currentLevel,
    currentRankName,
    nextLevel,
    nextRankName,
    nextRequirement,
    progress,
    canPromote
  };
}

/**
 * 根据战功获取军衔等级
 * @param battleExp 累计战功
 * @returns 军衔等级
 */
function getCurrentMilitaryRankLevel(battleExp: number): number {
  for (let i = MILITARY_RANKS.length - 1; i >= 0; i--) {
    if (battleExp >= MILITARY_RANKS[i].requiredBattleExp) {
      return MILITARY_RANKS[i].level;
    }
  }

  return 0;
}

// ========== 军情查询功能 ==========

/**
 * BOSS 位置信息接口
 */
export interface BossLocationInfo {
  bossName: string; // BOSS 名称
  level: number; // BOSS 等级
  location: string; // 所在地图
  locationName: string; // 地图中文名称
  combatPower: number; // 战斗力
  battleExpReward: number; // 战功奖励
}

/**
 * BOSS 位置配置表
 * 参考文档：reference/docs/project_docs/06_地图系统.md
 */
export const BOSS_LOCATIONS: BossLocationInfo[] = [
  {
    bossName: '10级BOSS',
    level: 10,
    location: 'frame_8',
    locationName: '雷鸣大陆',
    combatPower: 10,
    battleExpReward: 1000
  },
  {
    bossName: '20级BOSS',
    level: 20,
    location: 'frame_16',
    locationName: '戈壁',
    combatPower: 30,
    battleExpReward: 1000
  },
  {
    bossName: '30级BOSS',
    level: 30,
    location: 'frame_17',
    locationName: '迷梦沼泽',
    combatPower: 45,
    battleExpReward: 1000
  },
  {
    bossName: '50级BOSS',
    level: 50,
    location: 'frame_18',
    locationName: '冰宫',
    combatPower: 75,
    battleExpReward: 1000
  },
  {
    bossName: '70级BOSS',
    level: 70,
    location: 'frame_19',
    locationName: '亚维特岛',
    combatPower: 105,
    battleExpReward: 1000
  },
  {
    bossName: '90级BOSS',
    level: 90,
    location: 'frame_20',
    locationName: '火山',
    combatPower: 135,
    battleExpReward: 1000
  },
  {
    bossName: '100级BOSS',
    level: 100,
    location: 'frame_21',
    locationName: '深渊迷宫',
    combatPower: 150,
    battleExpReward: 1000
  }
];

/**
 * 查询军情（BOSS 位置信息）
 * 显示各等级 BOSS 的位置和战功奖励
 * @returns BOSS 位置信息列表
 */
export function queryMilitaryIntel(): BossLocationInfo[] {
  return BOSS_LOCATIONS;
}

/**
 * 格式化军情信息为文本
 * @param bossLocations BOSS 位置信息列表
 * @returns 格式化的文本
 */
export function formatMilitaryIntel(bossLocations: BossLocationInfo[]): string {
  let text = '=== 军情查询 ===\n\n';
  text += '各等级BOSS位置信息：\n\n';

  bossLocations.forEach(boss => {
    text += `【${boss.bossName}】\n`;
    text += `  所在地图：${boss.locationName}\n`;
    text += `  等级：${boss.level}级\n`;
    text += `  战斗力：${boss.combatPower}\n`;
    text += `  战功奖励：${boss.battleExpReward.toLocaleString()}\n\n`;
  });

  text += '提示：消灭BOSS可获得1000点战功！';

  return text;
}

// ========== 军衔系统说明 ==========

/**
 * 获取军衔系统说明
 * @returns 军衔系统说明文本
 */
export function getMilitaryRankDescription(): string {
  let text = '=== 军衔系统说明 ===\n\n';

  text += '【军衔等级】\n';
  text += '军衔共分12个等级：\n';
  text += '无军衔、少尉、中尉、上尉、少校、中校、上校、\n';
  text += '少将、中将、上将、大将、元帅\n\n';

  text += '【战功获取】\n';
  text += '1. 消灭BOSS：获得1000点战功\n';
  text += '2. 消灭雪域边境冰雪巨人：获得10000点战功\n\n';

  text += '【军衔奖励】\n';
  text += '1. 战斗力加成：根据军衔等级获得战斗力加成\n';
  text += '2. 军饷领取：周日可领取魔石奖励\n';
  text += '3. 特殊奖励：少将以上额外获得"高级斗志抑扬"\n\n';

  text += '【军衔等级与军饷对照表】\n';
  MILITARY_RANKS.forEach(rank => {
    if (rank.level > 0) {
      text += `${rank.name}：${rank.pay.toLocaleString()}魔石\n`;
    }
  });

  return text;
}

/**
 * 获取军衔晋升信息
 * @param currentLevel 当前军衔等级
 * @returns 晋升信息文本
 */
export function getPromotionInfo(currentLevel: number): string {
  if (currentLevel >= 11) {
    return '恭喜你已达到最高军衔：元帅！';
  }

  const currentRank = getMilitaryRankByLevel(currentLevel);
  const nextRank = getMilitaryRankByLevel(currentLevel + 1);

  let text = `当前军衔：${currentRank.name}\n`;
  text += `下一级军衔：${nextRank.name}\n`;
  text += `所需战功：${nextRank.requiredBattleExp.toLocaleString()}\n`;
  text += `战斗力加成：${currentRank.combatPowerBonus}% → ${nextRank.combatPowerBonus}%\n`;
  text += `军饷奖励：${currentRank.pay.toLocaleString()} → ${nextRank.pay.toLocaleString()}魔石`;

  return text;
}

// ========== 战功奖励计算 ==========

/**
 * 战功获取来源配置
 * 参考文档：reference/docs/scripts_analysis/14_NPC系统.md
 */
export const BATTLE_EXP_REWARDS = {
  BOSS_KILL: 1000, // 消灭BOSS获得战功
  ICE_GIANT_KILL: 10000, // 消灭雪域边境冰雪巨人获得战功
};

/**
 * 计算战功奖励
 * @param enemyType 敌人类型 ('boss' | 'ice_giant')
 * @returns 战功值
 */
export function calculateBattleExp(enemyType: 'boss' | 'ice_giant'): number {
  switch (enemyType) {
    case 'boss':
      return BATTLE_EXP_REWARDS.BOSS_KILL;
    case 'ice_giant':
      return BATTLE_EXP_REWARDS.ICE_GIANT_KILL;
    default:
      return 0;
  }
}
