/**
 * 爵位系统工具函数
 * 提供爵位相关的核心功能函数
 * 参考文档：reference/docs/scripts_analysis/14_NPC系统.md
 */

import type { NobleRankConfig, NobleRankReward } from '../data/rankData';
import {
  getLocationAccessConfig,
  getNextNobleRankMerit,
  getNobleRankByLevel,
  LOCATION_ACCESS_CONFIG,
  NOBLE_RANK_REWARDS,
  NOBLE_RANKS,
} from '../data/rankData';

// ========== 爵位基础功能函数 ==========

/**
 * 获取爵位名称
 * @param level 爵位等级 (0-6)
 * @returns 爵位名称
 */
export function getNobleRankName(level: number): string {
  const config = getNobleRankByLevel(level);

  return config.name;
}

/**
 * 获取下一级爵位所需功勋
 * @param level 当前爵位等级
 * @returns 所需功勋，如果已满级返回 null
 */
export function getNextNobleRankRequirement(level: number): number | null {
  return getNextNobleRankMerit(level);
}

/**
 * 判断是否可以晋升爵位
 * @param currentMerit 当前功勋值
 * @param currentLevel 当前爵位等级
 * @returns 是否可以晋升
 */
export function canPromoteNobleRank(currentMerit: number, currentLevel: number): boolean {
  // 如果已满级，无法晋升
  if (currentLevel >= 6) {
    return false;
  }

  // 获取下一级所需功勋
  const nextRequirement = getNextNobleRankRequirement(currentLevel);

  // 如果没有下一级配置，无法晋升
  if (nextRequirement === null) {
    return false;
  }

  // 判断当前功勋是否达到晋升要求
  return currentMerit >= nextRequirement;
}

/**
 * 检查地图进入权限
 * @param nobleRank 当前爵位等级
 * @param locationId 地图ID
 * @returns 是否有权限进入
 */
export function checkLocationAccess(nobleRank: number, locationId: string): boolean {
  // 获取地图权限配置
  const accessConfig = getLocationAccessConfig(locationId);

  // 如果地图没有特殊权限要求，默认可以进入
  if (!accessConfig) {
    return true;
  }

  // 判断爵位是否满足要求
  return nobleRank >= accessConfig.requiredNobleRank;
}

// ========== 爵位系统说明展示 ==========

/**
 * 获取爵位系统说明文本
 * @returns 爵位系统说明
 */
export function getNobleRankSystemDescription(): string {
  return `【爵位系统说明】

爵位等级：
${NOBLE_RANKS.map(rank => `${rank.name}（需要${rank.requiredMerit}功勋）`).join('\n')}

爵位作用：
1. 提升战斗力（爵位越高，战斗力加成越多）
2. 解锁地图权限（部分地图需要特定爵位才能进入）
3. 领取爵位奖励（每周可领取一次）

功勋获取方式：
- 完成日常任务
- 击败BOSS
- 参与特殊活动

提示：积累功勋可以自动晋升爵位！`;
}

/**
 * 获取爵位详细信息
 * @param level 爵位等级
 * @returns 爵位详细信息文本
 */
export function getNobleRankDetail(level: number): string {
  const config = getNobleRankByLevel(level);
  const nextRequirement = getNextNobleRankRequirement(level);

  let detail = `【${config.name}】\n\n`;
  detail += `爵位等级：${config.level}\n`;
  detail += `所需功勋：${config.requiredMerit}\n`;
  detail += `战斗力加成：${config.combatPowerBonus}\n`;

  if (nextRequirement !== null) {
    detail += `\n下一级爵位需要：${nextRequirement} 功勋`;
  } else {
    detail += '\n已达到最高爵位！';
  }

  return detail;
}

// ========== 爵位奖励领取功能 ==========

/**
 * 爵位奖励领取结果接口
 */
export interface NobleRewardClaimResult {
  success: boolean; // 是否成功
  message: string; // 结果消息
  reward?: NobleRankReward; // 奖励详情（成功时）
}

/**
 * 检查是否可以领取爵位奖励
 * @param nobleRank 当前爵位等级
 * @param lastClaimTime 上次领取时间（时间戳）
 * @returns 是否可以领取
 */
export function canClaimNobleReward(nobleRank: number, lastClaimTime: number | null): boolean {
  // 平民没有奖励
  if (nobleRank === 0) {
    return false;
  }

  // 如果从未领取过，可以领取
  if (lastClaimTime === null) {
    return true;
  }

  // 检查是否已经过了7天（每周领取一次）
  const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  return (now - lastClaimTime) >= ONE_WEEK_MS;
}

/**
 * 获取爵位奖励预览
 * @param nobleRank 爵位等级
 * @returns 奖励预览文本
 */
export function getNobleRewardPreview(nobleRank: number): string {
  const reward = NOBLE_RANK_REWARDS.find(r => r.level === nobleRank);

  if (!reward || reward.items.length === 0) {
    return '当前爵位暂无奖励可领取';
  }

  let preview = `【${reward.rewardName}】\n\n`;
  preview += `${reward.description}\n\n`;
  preview += '奖励内容：\n';

  reward.items.forEach(item => {
    preview += `- ${item.itemName} × ${item.quantity}\n`;
  });

  if (reward.magicStone) {
    preview += `- 魔石 × ${reward.magicStone}\n`;
  }

  if (reward.exp) {
    preview += `- 经验 × ${reward.exp}\n`;
  }

  return preview;
}

/**
 * 领取爵位奖励
 * @param nobleRank 当前爵位等级
 * @param lastClaimTime 上次领取时间
 * @returns 领取结果
 */
export function claimNobleReward(nobleRank: number, lastClaimTime: number | null): NobleRewardClaimResult {
  // 检查是否可以领取
  if (!canClaimNobleReward(nobleRank, lastClaimTime)) {
    return {
      success: false,
      message: '奖励领取时间未到，每周只能领取一次爵位奖励',
    };
  }

  // 获取奖励配置
  const reward = NOBLE_RANK_REWARDS.find(r => r.level === nobleRank);

  if (!reward || reward.items.length === 0) {
    return {
      success: false,
      message: '当前爵位暂无奖励可领取',
    };
  }

  // 返回领取成功结果
  return {
    success: true,
    message: `成功领取${reward.rewardName}！`,
    reward: reward,
  };
}

// ========== 交易功能（预留接口） ==========

/**
 * 交易功能状态
 * 当前为预留接口，显示"交易功能开发中..."
 */
export const TRADE_SYSTEM_STATUS = {
  available: false,
  message: '交易功能开发中...',
};

/**
 * 检查交易功能是否可用
 * @returns 交易功能是否可用
 */
export function isTradeSystemAvailable(): boolean {
  return TRADE_SYSTEM_STATUS.available;
}

/**
 * 获取交易系统提示信息
 * @returns 交易系统提示
 */
export function getTradeSystemMessage(): string {
  return TRADE_SYSTEM_STATUS.message;
}

// ========== 爵位晋升相关功能 ==========

/**
 * 计算爵位晋升进度
 * @param currentMerit 当前功勋
 * @param currentLevel 当前爵位等级
 * @returns 晋升进度百分比 (0-100)
 */
export function calculatePromotionProgress(currentMerit: number, currentLevel: number): number {
  // 如果已满级，返回100%
  if (currentLevel >= 6) {
    return 100;
  }

  const currentConfig = getNobleRankByLevel(currentLevel);
  const nextRequirement = getNextNobleRankRequirement(currentLevel);

  if (nextRequirement === null) {
    return 100;
  }

  // 计算进度
  const currentRequirement = currentConfig.requiredMerit;
  const progressRange = nextRequirement - currentRequirement;
  const currentProgress = currentMerit - currentRequirement;

  // 避免除以0
  if (progressRange === 0) {
    return 100;
  }

  const percentage = (currentProgress / progressRange) * 100;

  // 限制在0-100之间
  return Math.min(100, Math.max(0, percentage));
}

/**
 * 获取爵位晋升提示
 * @param currentMerit 当前功勋
 * @param currentLevel 当前爵位等级
 * @returns 晋升提示文本
 */
export function getPromotionHint(currentMerit: number, currentLevel: number): string {
  if (currentLevel >= 6) {
    return '恭喜！您已达到最高爵位【王】！';
  }

  const nextRequirement = getNextNobleRankRequirement(currentLevel);

  if (nextRequirement === null) {
    return '已达到最高爵位！';
  }

  const remaining = nextRequirement - currentMerit;

  if (remaining <= 0) {
    return '功勋已满足晋升条件，请前往首相处晋升爵位！';
  }

  return `距离下一级爵位还需要 ${remaining} 功勋`;
}

// ========== 地图权限检查相关功能 ==========

/**
 * 获取地图权限提示
 * @param nobleRank 当前爵位等级
 * @param locationId 地图ID
 * @returns 权限提示文本
 */
export function getLocationAccessHint(nobleRank: number, locationId: string): string {
  const accessConfig = getLocationAccessConfig(locationId);

  if (!accessConfig) {
    return '该地图对所有玩家开放';
  }

  if (checkLocationAccess(nobleRank, locationId)) {
    return `您的爵位满足进入${accessConfig.locationName}的要求`;
  }

  const requiredRankName = getNobleRankName(accessConfig.requiredNobleRank);

  return `${accessConfig.locationName}需要【${requiredRankName}】以上爵位才能进入`;
}

/**
 * 获取所有地图权限列表
 * @param nobleRank 当前爵位等级
 * @returns 地图权限列表
 */
export function getAllLocationAccessStatus(nobleRank: number): Array<{
  locationId: string;
  locationName: string;
  hasAccess: boolean;
  requiredRank: number;
  requiredRankName: string;
}> {
  return LOCATION_ACCESS_CONFIG.map(config => ({
    locationId: config.locationId,
    locationName: config.locationName,
    hasAccess: nobleRank >= config.requiredNobleRank,
    requiredRank: config.requiredNobleRank,
    requiredRankName: getNobleRankName(config.requiredNobleRank),
  }));
}

// ========== 功勋获取和晋升逻辑 ==========

/**
 * 功勋获取结果接口
 */
export interface MeritGainResult {
  success: boolean; // 是否成功
  message: string; // 结果消息
  newMerit: number; // 新的功勋值
  newNobleRank: number; // 新的爵位等级
  promoted: boolean; // 是否晋升
  promotedRankName?: string; // 晋升后的爵位名称
}

/**
 * 增加功勋并自动晋升爵位
 * 参考文档：reference/docs/元帅与首相交互逻辑文档.md
 * @param currentMerit 当前功勋
 * @param currentNobleRank 当前爵位等级
 * @param gainMerit 获得的功勋
 * @returns 功勋获取结果
 */
export function gainMeritAndPromote(
  currentMerit: number,
  currentNobleRank: number,
  gainMerit: number
): MeritGainResult {
  // 增加功勋
  const newMerit = currentMerit + gainMerit;

  // 计算新的爵位等级
  let newNobleRank = currentNobleRank;
  let promoted = false;
  let promotedRankName: string | undefined;

  // 自动晋升逻辑：根据功勋判断爵位等级
  for (let i = NOBLE_RANKS.length - 1; i >= 0; i--) {
    if (newMerit >= NOBLE_RANKS[i].requiredMerit) {
      newNobleRank = NOBLE_RANKS[i].level;
      break;
    }
  }

  // 判断是否晋升
  if (newNobleRank > currentNobleRank) {
    promoted = true;
    promotedRankName = getNobleRankName(newNobleRank);
  }

  // 构建消息
  let message = `获得 ${gainMerit.toLocaleString()} 点功勋！`;
  if (promoted && promotedRankName) {
    message += `\n恭喜你被授予 ${promotedRankName}！`;
  }

  return {
    success: true,
    message,
    newMerit,
    newNobleRank,
    promoted,
    promotedRankName,
  };
}

/**
 * 捐献金币获得功勋
 * 参考文档：reference/docs/元帅与首相交互逻辑文档.md
 * 每750,000金币 = 1功勋
 * @param currentGold 当前金币
 * @param donateAmount 捐献金额
 * @param currentMerit 当前功勋
 * @param currentNobleRank 当前爵位等级
 * @returns 捐献结果
 */
export function donateGoldForMerit(
  currentGold: number,
  donateAmount: number,
  currentMerit: number,
  currentNobleRank: number
): MeritGainResult & { donatedGold: number } {
  // 检查金币是否足够
  if (currentGold < donateAmount) {
    return {
      success: false,
      message: '金币不足！',
      newMerit: currentMerit,
      newNobleRank: currentNobleRank,
      promoted: false,
      donatedGold: 0,
    };
  }

  // 计算获得的功勋（每750,000金币 = 1功勋）
  const EXCHANGE_RATE = 750000;
  const gainedMerit = Math.floor(donateAmount / EXCHANGE_RATE);

  if (gainedMerit <= 0) {
    return {
      success: false,
      message: '捐献金额不足，至少需要750,000金币才能获得1点功勋！',
      newMerit: currentMerit,
      newNobleRank: currentNobleRank,
      promoted: false,
      donatedGold: 0,
    };
  }

  // 实际消耗的金币
  const donatedGold = gainedMerit * EXCHANGE_RATE;

  // 调用功勋获取函数
  const meritResult = gainMeritAndPromote(currentMerit, currentNobleRank, gainedMerit);

  return {
    ...meritResult,
    donatedGold,
    message: `捐献 ${donatedGold.toLocaleString()} 金币，获得 ${gainedMerit} 点功勋！\n${meritResult.promoted ? meritResult.message.split('\n')[1] : ''}`,
  };
}

// ========== 导出所有功能 ==========

export {
  getLocationAccessConfig,
  getNextNobleRankMerit,
  getNobleRankByLevel,
  LOCATION_ACCESS_CONFIG,
  NOBLE_RANK_REWARDS,
  NOBLE_RANKS,
};

export type { NobleRankConfig, NobleRankReward };
