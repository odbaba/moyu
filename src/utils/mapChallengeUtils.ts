/**
 * 地图挑战系统工具函数
 * 提供地图挑战相关的核心功能函数
 * 参考文档：reference/docs/scripts_analysis/14_NPC系统.md（地图赛报名官）
 */

import type {
  ChallengerRequirement,
  MapChallengeConfig,
  ProtectorReward,
} from '../data/mapChallengeData';
import {
  getAvailableMapChallenges,
  getMapChallengeConfigById,
  MAP_CHALLENGE_CONFIGS,
} from '../data/mapChallengeData';

// ========== 地图挑战配置查询函数 ==========

/**
 * 获取地图挑战配置
 * @param locationId 地图ID
 * @returns 地图挑战配置，如果不存在则返回 null
 */
export function getMapChallengeConfig(locationId: string): MapChallengeConfig | null {
  const config = getMapChallengeConfigById(locationId);

  return config || null;
}

/**
 * 检查爵位要求
 * 判断玩家爵位是否满足地图挑战要求
 * @param nobleRank 玩家爵位等级
 * @param locationId 地图ID
 * @returns 是否满足爵位要求
 */
export function checkChallengeRequirement(nobleRank: number, locationId: string): boolean {
  const config = getMapChallengeConfig(locationId);

  // 如果地图配置不存在，默认不满足要求
  if (!config) {
    return false;
  }

  // 判断爵位是否满足要求
  return nobleRank >= config.requiredNobleRank;
}

/**
 * 检查挑战者属性要求
 * 判断玩家等级和战斗力是否满足挑战要求
 * @param playerLevel 玩家等级
 * @param playerCombatPower 玩家战斗力
 * @param locationId 地图ID
 * @returns 是否满足挑战者属性要求
 */
export function checkChallengerAttributes(
  playerLevel: number,
  playerCombatPower: number,
  locationId: string
): boolean {
  const config = getMapChallengeConfig(locationId);

  // 如果地图配置不存在，默认不满足要求
  if (!config) {
    return false;
  }

  const requirement = config.challengerRequirement;

  // 判断等级和战斗力是否满足要求
  return playerLevel >= requirement.level && playerCombatPower >= requirement.combatPower;
}

/**
 * 获取挑战要求不满足的原因
 * @param nobleRank 玩家爵位等级
 * @param playerLevel 玩家等级
 * @param playerCombatPower 玩家战斗力
 * @param locationId 地图ID
 * @returns 不满足的原因描述，如果满足要求则返回 null
 */
export function getChallengeRequirementReason(
  nobleRank: number,
  playerLevel: number,
  playerCombatPower: number,
  locationId: string
): string | null {
  const config = getMapChallengeConfig(locationId);

  // 如果地图配置不存在
  if (!config) {
    return '该地图暂未开放挑战';
  }

  // 检查爵位要求
  if (nobleRank < config.requiredNobleRank) {
    return `需要【${config.requiredNobleRankName}】以上爵位才能挑战${config.locationName}`;
  }

  // 检查等级要求
  if (playerLevel < config.challengerRequirement.level) {
    return `挑战${config.locationName}需要达到 ${config.challengerRequirement.level} 级`;
  }

  // 检查战斗力要求
  if (playerCombatPower < config.challengerRequirement.combatPower) {
    return `挑战${config.locationName}需要战斗力达到 ${config.challengerRequirement.combatPower}`;
  }

  // 满足所有要求
  return null;
}

// ========== 保护者奖励领取功能 ==========

/**
 * 奖励领取结果接口
 */
export interface RewardResult {
  /** 是否成功 */
  success: boolean;
  /** 结果消息 */
  message: string;
  /** 奖励详情（成功时） */
  reward?: ProtectorReward;
}

/**
 * 领取保护者奖励
 * 地图保护者每日可领取一次奖励
 * @param locationId 地图ID
 * @param nobleRank 玩家爵位等级
 * @returns 奖励领取结果
 */
export function claimProtectorReward(locationId: string, nobleRank: number): RewardResult {
  const config = getMapChallengeConfig(locationId);

  // 如果地图配置不存在
  if (!config) {
    return {
      success: false,
      message: '该地图暂无保护者奖励',
    };
  }

  // 检查爵位要求
  if (!checkChallengeRequirement(nobleRank, locationId)) {
    return {
      success: false,
      message: `需要【${config.requiredNobleRankName}】以上爵位才能领取${config.locationName}的保护者奖励`,
    };
  }

  // 返回领取成功结果
  return {
    success: true,
    message: `成功领取${config.locationName}的保护者奖励！`,
    reward: config.protectorReward,
  };
}

/**
 * 检查是否可以领取保护者奖励
 * @param lastClaimTime 上次领取时间（时间戳）
 * @returns 是否可以领取
 */
export function canClaimProtectorReward(lastClaimTime: number | null): boolean {
  // 如果从未领取过，可以领取
  if (lastClaimTime === null) {
    return true;
  }

  // 检查是否已经过了1天（每日领取一次）
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const now = Date.now();

  return (now - lastClaimTime) >= ONE_DAY_MS;
}

/**
 * 获取保护者奖励预览
 * 生成奖励内容的详细描述
 * @param locationId 地图ID
 * @returns 奖励预览文本
 */
export function getProtectorRewardPreview(locationId: string): string {
  const config = getMapChallengeConfig(locationId);

  if (!config) {
    return '该地图暂无保护者奖励';
  }

  const reward = config.protectorReward;
  let preview = `【${config.locationName}保护者每日奖励】\n\n`;

  // 满经验球
  preview += `• 满经验球 × ${reward.expBalls}\n`;

  // 灵魂石
  preview += `• ${reward.soulStoneType} × ${reward.soulStones}\n`;

  // 白玫瑰
  if (reward.whiteRoses && reward.roseType) {
    preview += `• ${reward.roseType}白玫瑰 × ${reward.whiteRoses}\n`;
  }

  // 技能奖励
  if (reward.skillReward) {
    preview += `• 技能：${reward.skillReward}\n`;
  }

  // 装备奖励
  if (reward.equipmentReward) {
    preview += `• ${reward.equipmentReward.quality}+${reward.equipmentReward.bonusLevel}装备\n`;
  }

  // 幻兽奖励
  if (reward.petReward) {
    preview += `• ${reward.petReward.star}星${reward.petReward.petType}\n`;
  }

  return preview;
}

// ========== 地图挑战说明生成函数 ==========

/**
 * 获取地图挑战说明
 * 生成地图挑战的完整说明文本
 * @param config 地图挑战配置
 * @returns 地图挑战说明文本
 */
export function getMapChallengeDescription(config: MapChallengeConfig): string {
  let description = `【${config.locationName}地图挑战】\n\n`;

  // 地图描述
  description += `${config.description}\n\n`;

  // 爵位要求
  description += '【爵位要求】\n';
  description += `需要爵位：${config.requiredNobleRankName}\n\n`;

  // 挑战者属性要求
  description += '【挑战者属性要求】\n';
  description += `等级要求：${config.challengerRequirement.level} 级\n`;
  description += `战斗力要求：${config.challengerRequirement.combatPower}\n\n`;

  // 保护者奖励
  description += '【保护者每日奖励】\n';
  const reward = config.protectorReward;

  description += `• 满经验球 × ${reward.expBalls}\n`;
  description += `• ${reward.soulStoneType} × ${reward.soulStones}\n`;

  if (reward.whiteRoses && reward.roseType) {
    description += `• ${reward.roseType}白玫瑰\n`;
  }

  if (reward.skillReward) {
    description += `• 技能：${reward.skillReward}\n`;
  }

  if (reward.equipmentReward) {
    description += `• ${reward.equipmentReward.quality}+${reward.equipmentReward.bonusLevel}装备\n`;
  }

  if (reward.petReward) {
    description += `• ${reward.petReward.star}星${reward.petReward.petType}\n`;
  }

  return description;
}

/**
 * 获取所有地图挑战列表说明
 * @param nobleRank 玩家爵位等级
 * @returns 地图挑战列表说明
 */
export function getAllMapChallengesDescription(nobleRank: number): string {
  const availableChallenges = getAvailableMapChallenges(nobleRank);

  let description = '【地图挑战系统】\n\n';
  description += '各地图的挑战要求和奖励如下：\n\n';

  MAP_CHALLENGE_CONFIGS.forEach((config, index) => {
    const isAvailable = nobleRank >= config.requiredNobleRank;
    const status = isAvailable ? '✓ 可挑战' : `✗ 需要${config.requiredNobleRankName}`;

    description += `${index + 1}. ${config.locationName}\n`;
    description += `   爵位要求：${config.requiredNobleRankName}\n`;
    description += `   等级要求：${config.challengerRequirement.level} 级\n`;
    description += `   战斗力要求：${config.challengerRequirement.combatPower}\n`;
    description += `   状态：${status}\n\n`;
  });

  description += `当前爵位：${nobleRank === 0 ? '平民' : `爵位等级 ${nobleRank}`}\n`;
  description += `可挑战地图数量：${availableChallenges.length}/${MAP_CHALLENGE_CONFIGS.length}`;

  return description;
}

// ========== 地图挑战状态查询函数 ==========

/**
 * 地图挑战状态接口
 */
export interface MapChallengeStatus {
  /** 地图ID */
  locationId: string;
  /** 地图名称 */
  locationName: string;
  /** 是否满足爵位要求 */
  meetsNobleRankRequirement: boolean;
  /** 是否满足等级要求 */
  meetsLevelRequirement: boolean;
  /** 是否满足战斗力要求 */
  meetsCombatPowerRequirement: boolean;
  /** 是否可以挑战 */
  canChallenge: boolean;
  /** 不满足要求的原因 */
  reason?: string;
}

/**
 * 获取地图挑战状态
 * @param nobleRank 玩家爵位等级
 * @param playerLevel 玩家等级
 * @param playerCombatPower 玩家战斗力
 * @param locationId 地图ID
 * @returns 地图挑战状态
 */
export function getMapChallengeStatus(
  nobleRank: number,
  playerLevel: number,
  playerCombatPower: number,
  locationId: string
): MapChallengeStatus | null {
  const config = getMapChallengeConfig(locationId);

  if (!config) {
    return null;
  }

  const meetsNobleRankRequirement = nobleRank >= config.requiredNobleRank;
  const meetsLevelRequirement = playerLevel >= config.challengerRequirement.level;
  const meetsCombatPowerRequirement = playerCombatPower >= config.challengerRequirement.combatPower;

  const canChallenge = meetsNobleRankRequirement && meetsLevelRequirement && meetsCombatPowerRequirement;

  let reason: string | undefined;
  if (!canChallenge) {
    reason = getChallengeRequirementReason(nobleRank, playerLevel, playerCombatPower, locationId) || undefined;
  }

  return {
    locationId: config.locationId,
    locationName: config.locationName,
    meetsNobleRankRequirement,
    meetsLevelRequirement,
    meetsCombatPowerRequirement,
    canChallenge,
    reason,
  };
}

/**
 * 获取所有地图挑战状态列表
 * @param nobleRank 玩家爵位等级
 * @param playerLevel 玩家等级
 * @param playerCombatPower 玩家战斗力
 * @returns 所有地图挑战状态列表
 */
export function getAllMapChallengeStatus(
  nobleRank: number,
  playerLevel: number,
  playerCombatPower: number
): MapChallengeStatus[] {
  return MAP_CHALLENGE_CONFIGS
    .map(config => getMapChallengeStatus(nobleRank, playerLevel, playerCombatPower, config.locationId))
    .filter((status): status is MapChallengeStatus => status !== null);
}

// ========== 导出所有功能 ==========

export {
  getAvailableMapChallenges,
  getMapChallengeConfigById,
  MAP_CHALLENGE_CONFIGS,
};

export type { ChallengerRequirement, MapChallengeConfig, ProtectorReward };
