/**
 * 地图挑战系统工具函数
 * 提供地图挑战相关的核心功能函数
 * 参考文档：reference/docs/地图占领赛报名官交互逻辑文档.md
 */

import type {
  ChallengerConfig,
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
  if (!config) {
    return false;
  }

  return nobleRank >= config.requiredNobleRank;
}

/**
 * 获取挑战要求不满足的原因
 * @param nobleRank 玩家爵位等级
 * @param locationId 地图ID
 * @returns 不满足的原因描述，如果满足要求则返回 null
 */
export function getChallengeRequirementReason(
  nobleRank: number,
  locationId: string
): string | null {
  const config = getMapChallengeConfig(locationId);
  if (!config) {
    return '该地图暂未开放挑战';
  }
  if (nobleRank < config.requiredNobleRank) {
    return `需要【${config.requiredNobleRankName}】以上爵位才能挑战${config.locationName}`;
  }

  return null;
}

// ========== 挑战者相关函数 ==========

/**
 * 获取挑战者配置
 * @param locationId 地图ID
 * @returns 挑战者配置，如果不存在则返回 null
 */
export function getChallengerConfig(locationId: string): ChallengerConfig | null {
  const config = getMapChallengeConfig(locationId);

  return config ? config.challenger : null;
}

// ========== 地图占领状态管理 ==========

/**
 * 地图挑战状态接口
 */
export interface MapChallengeState {
  /** 当前拥有的地图ID */
  ownerMap: string | null;
  /** 今日奖励是否可领取 */
  mapReward: boolean;
  /** 今日是否可挑战（所有地图共享一次机会） */
  mapRace: boolean;
}

/**
 * 创建初始地图挑战状态
 */
export function createInitialMapChallengeState(): MapChallengeState {
  return {
    ownerMap: null,
    mapReward: false,
    mapRace: true, // 初始可以挑战
  };
}

/**
 * 每日重置地图挑战状态
 * @param state 当前状态
 * @returns 重置后的状态
 */
export function resetMapChallengeDaily(state: MapChallengeState): MapChallengeState {
  return {
    ...state,
    mapReward: state.ownerMap !== null,
    mapRace: true, // 每日重置，开启挑战机会
  };
}

/**
 * 检查今日是否可挑战
 * @param state 地图挑战状态
 * @returns 是否可挑战
 */
export function canChallengeToday(state: MapChallengeState): boolean {
  return state.mapRace;
}

/**
 * 标记今日已挑战
 * @param state 地图挑战状态
 * @returns 更新后的状态
 */
export function markChallengedToday(state: MapChallengeState): MapChallengeState {
  return {
    ...state,
    mapRace: false,
  };
}

/**
 * 设置为地图保护者
 * @param state 地图挑战状态
 * @param locationId 地图ID
 * @returns 更新后的状态
 */
export function setAsMapProtector(state: MapChallengeState, locationId: string): MapChallengeState {
  return {
    ...state,
    ownerMap: locationId,
    mapReward: true,
  };
}

/**
 * 检查是否为当前地图保护者
 * @param state 地图挑战状态
 * @param locationId 地图ID
 * @returns 是否为保护者
 */
export function isMapProtector(state: MapChallengeState, locationId: string): boolean {
  return state.ownerMap === locationId;
}

/**
 * 检查是否有可领取的奖励
 * @param state 地图挑战状态
 * @returns 是否可领取
 */
export function canClaimReward(state: MapChallengeState): boolean {
  return state.mapReward && state.ownerMap !== null;
}

/**
 * 领取保护者奖励
 * @param state 地图挑战状态
 * @returns 更新后的状态
 */
export function claimReward(state: MapChallengeState): MapChallengeState {
  return {
    ...state,
    mapReward: false,
  };
}

// ========== 保护者奖励相关函数 ==========

/**
 * 获取保护者奖励配置
 * @param locationId 地图ID
 * @returns 奖励配置，如果不存在则返回 null
 */
export function getProtectorReward(locationId: string): ProtectorReward | null {
  const config = getMapChallengeConfig(locationId);

  return config ? config.protectorReward : null;
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
    return '该地图暂未开放保护者奖励';
  }
  const reward = config.protectorReward;
  let preview = `【${config.locationName}保护者每日奖励】\n\n`;
  preview += `• 满经验球 × ${reward.expBalls}\n`;
  preview += `• ${reward.soulStoneType} × ${reward.soulStones}\n`;
  if (reward.whiteRoses && reward.roseType) {
    // 玫瑰物品数量固定为1（一个'999朵白玫瑰'物品就代表999朵玫瑰）
    preview += `• ${reward.roseType}白玫瑰 × 1\n`;
  }
  if (reward.skillReward) {
    preview += `• 技能书：${reward.skillReward}\n`;
  }
  if (reward.equipmentReward) {
    preview += `• ${reward.equipmentReward.quality}+${reward.equipmentReward.bonusLevel}装备\n`;
  }
  if (reward.petReward) {
    preview += `• ${reward.petReward.star}星${reward.petReward.petType}\n`;
  }

  return preview;
}

// ========== NPC对话相关函数 ==========

/**
 * 获取NPC对话文本
 * @param state 地图挑战状态
 * @param locationId 当前地图ID
 * @param nobleRank 玩家爵位等级
 * @returns 对话文本
 */
export function getNPCDialog(
  state: MapChallengeState,
  locationId: string,
  _nobleRank: number
): string {
  const config = getMapChallengeConfig(locationId);
  if (!config) {
    return '该地图暂未开放挑战';
  }
  let dialog = '    在魔族大军的威胁下，各个地方都在招募勇士来保护当地人民和财产安全。';
  dialog += '只要你达到一定的爵位就有资格参加挑战，挑战胜利后该地方就属于你的保护地。';
  dialog += '每天该地方都会赠与你一定的财物以助你发展。\n\n';
  dialog += `挑战要求：${config.requiredNobleRankName}以上。\n`;
  if (state.ownerMap === null) {
    dialog += `\n${config.locationName}还没有保护者。`;
  } else if (state.ownerMap === locationId) {
    dialog += `\n${config.locationName}已经属于你的保护地了。`;
  } else {
    const ownerConfig = getMapChallengeConfig(state.ownerMap);
    const ownerMapName = ownerConfig ? ownerConfig.locationName : state.ownerMap;
    dialog += `你是${ownerMapName}的保护者。`;
    dialog += `如果要挑战${config.locationName}你将会放弃${ownerMapName}保护者的资格。`;
  }

  return dialog;
}

/**
 * 获取NPC对话选项
 * @param state 地图挑战状态
 * @param locationId 当前地图ID
 * @returns 选项数组
 */
export function getNPCDialogOptions(
  state: MapChallengeState,
  locationId: string
): Array<{ text: string; actionType: string }> {
  const options: Array<{ text: string; actionType: string }> = [
    {
      text: '查看保护者每天的奖励',
      actionType: 'viewMapProtectorReward',
    },
  ];
  if (isMapProtector(state, locationId)) {
    options.push({
      text: '我来领取今天的奖励',
      actionType: 'claimMapReward',
    });
  } else {
    options.push({
      text: '我来挑战',
      actionType: 'challengeMap',
    });
  }
  options.push({
    text: '随便看看',
    actionType: 'closeNPC',
  });

  return options;
}

// ========== 地图挑战说明生成函数 ==========

/**
 * 获取地图挑战说明
 * @param config 地图挑战配置
 * @returns 地图挑战说明文本
 */
export function getMapChallengeDescription(config: MapChallengeConfig): string {
  let description = `【${config.locationName}地图挑战】\n\n`;
  description += `${config.description}\n\n`;
  description += '【爵位要求】\n';
  description += `需要爵位：${config.requiredNobleRankName}\n\n`;
  description += '【挑战者信息】\n';
  description += `挑战者：${config.challenger.name}\n`;
  description += `等级：${config.challenger.level}\n`;
  description += `战斗力：${config.challenger.combatPower}\n\n`;
  description += '【保护者每日奖励】\n';
  const reward = config.protectorReward;
  description += `• 满经验球 × ${reward.expBalls}\n`;
  description += `• ${reward.soulStoneType} × ${reward.soulStones}\n`;
  if (reward.whiteRoses && reward.roseType) {
    // 玫瑰物品数量固定为1（一个'999朵白玫瑰'物品就代表999朵玫瑰）
    description += `• ${reward.roseType}白玫瑰 × 1\n`;
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
    description += `   挑战者：${config.challenger.name} (Lv.${config.challenger.level})\n`;
    description += `   状态：${status}\n\n`;
  });
  description += `可挑战地图数量：${availableChallenges.length}/${MAP_CHALLENGE_CONFIGS.length}`;

  return description;
}

// ========== 导出所有功能 ==========

export {
  getAvailableMapChallenges,
  getMapChallengeConfigById,
  MAP_CHALLENGE_CONFIGS,
};
