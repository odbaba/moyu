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

// ========== 爵位奖励领取功能 ==========

// ========== 爵位晋升相关功能 ==========

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
