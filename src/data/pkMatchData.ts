/**
 * PK赛配置数据文件
 * 定义PK赛分组、BOSS属性、奖励配置
 * 参考文档：reference/docs/project_docs/11_PK赛系统.md
 */

import type { EnemyData } from '../types';
import { getExperienceMultiplier } from '../utils/developerMode';

// ==================== PK赛分组配置 ====================

/**
 * PK赛分组类型
 */
export type PKMatchGroup = 'level60' | 'level100' | 'level130';

/**
 * PK赛分组配置接口
 */
export interface PKMatchGroupConfig {
  group: PKMatchGroup;
  name: string;
  levelRange: string;
  minLevel: number;
  maxLevel: number;
  bossId: string;
  bossName: string;
  bossLevel: number;
  bossCombatPower: number;
}

/**
 * PK赛分组配置列表
 * 根据玩家等级自动分组
 */
export const pkMatchGroups: PKMatchGroupConfig[] = [
  {
    group: 'level60',
    name: '60级组',
    levelRange: '≤60级',
    minLevel: 1,
    maxLevel: 60,
    bossId: 'pk-boss-60',
    bossName: '60级PK赛BOSS',
    bossLevel: 60,
    bossCombatPower: 201,
  },
  {
    group: 'level100',
    name: '100级组',
    levelRange: '61-100级',
    minLevel: 61,
    maxLevel: 100,
    bossId: 'pk-boss-100',
    bossName: '100级PK赛BOSS',
    bossLevel: 100,
    bossCombatPower: 284,
  },
  {
    group: 'level130',
    name: '100级以上组',
    levelRange: '>100级',
    minLevel: 101,
    maxLevel: 999,
    bossId: 'pk-boss-130',
    bossName: '130级PK赛BOSS',
    bossLevel: 130,
    bossCombatPower: 374,
  },
];

// ==================== PK赛奖励配置 ====================

/**
 * PK赛奖励配置接口
 */
export interface PKMatchReward {
  group: PKMatchGroup;
  magicStone: number;
  exp: number;
  skillBook: string;
  specialItems: string[];
  description: string;
}

/**
 * PK赛奖励配置列表（基础值）
 * 根据分组发放不同奖励
 */
const pkMatchRewardsBase: PKMatchReward[] = [
  {
    group: 'level60',
    magicStone: 27000,
    exp: 40000,
    skillBook: '高级飞天连斩',
    specialItems: [],
    description: '27,000魔石、40,000经验、高级飞天连斩',
  },
  {
    group: 'level100',
    magicStone: 56000,
    exp: 150000,
    skillBook: '高级飞天连斩',
    specialItems: ['月光宝盒增强版'],
    description: '56,000魔石、150,000经验、高级飞天连斩、月光宝盒增强版',
  },
  {
    group: 'level130',
    magicStone: 82800,
    exp: 250000,
    skillBook: '高级斗志昂扬',
    specialItems: ['月光宝盒增强版', '电浆药水', '999朵白玫瑰'],
    description: '82,800魔石、250,000经验、高级斗志昂扬、月光宝盒增强版、电浆药水、999朵白玫瑰',
  },
];

// ==================== PK赛BOSS属性配置 ====================

/**
 * PK赛BOSS属性配置接口
 * 属性计算公式（参考文档）：
 * - 生命值 = 0 + 2000 × 等级
 * - 小攻击 = 0 + 112.5 × 等级
 * - 大攻击 = 0 + 168 × 等级
 * - 防御 = 0 + 96 × 等级
 */
export interface PKBossStats {
  level: number;
  combatPower: number;
  maxHp: number;
  minAttack: number;
  maxAttack: number;
  defense: number;
}

/**
 * PK赛BOSS属性配置
 * 直接使用计算后的固定值，确保属性准确
 */
export const pkBossStats: Record<PKMatchGroup, PKBossStats> = {
  level60: {
    level: 60,
    combatPower: 201,
    maxHp: 120000, // 2000 × 60
    minAttack: 6750, // 112.5 × 60
    maxAttack: 10080, // 168 × 60
    defense: 5760, // 96 × 60
  },
  level100: {
    level: 100,
    combatPower: 284,
    maxHp: 200000, // 2000 × 100
    minAttack: 11250, // 112.5 × 100
    maxAttack: 16800, // 168 × 100
    defense: 9600, // 96 × 100
  },
  level130: {
    level: 130,
    combatPower: 374,
    maxHp: 260000, // 2000 × 130
    minAttack: 14625, // 112.5 × 130
    maxAttack: 21840, // 168 × 130
    defense: 12480, // 96 × 130
  },
};

// ==================== 工具函数 ====================

/**
 * 根据玩家等级获取PK赛分组
 * @param playerLevel 玩家等级
 * @returns PK赛分组配置
 */
export function getPKMatchGroup(playerLevel: number): PKMatchGroupConfig {
  // 按等级从低到高匹配分组
  for (const group of pkMatchGroups) {
    if (playerLevel >= group.minLevel && playerLevel <= group.maxLevel) {
      return group;
    }
  }

  // 默认返回最高级别组
  return pkMatchGroups[pkMatchGroups.length - 1];
}

/**
 * 根据分组获取PK赛奖励（根据开发者模式调整经验）
 * @param group PK赛分组
 * @returns PK赛奖励配置
 */
export function getPKMatchReward(group: PKMatchGroup): PKMatchReward | undefined {
  const baseReward = pkMatchRewardsBase.find(reward => reward.group === group);
  if (!baseReward) return undefined;

  // 根据开发者模式调整经验值
  const multiplier = getExperienceMultiplier();

  return {
    ...baseReward,
    exp: Math.floor(baseReward.exp * multiplier),
    description: multiplier === 1
      ? baseReward.description
      : `${baseReward.magicStone}魔石、${Math.floor(baseReward.exp * multiplier)}经验、${baseReward.skillBook}${baseReward.specialItems.length > 0 ? `、${ baseReward.specialItems.join('、')}` : ''}`,
  };
}

/**
 * 根据分组获取PK赛BOSS属性
 * @param group PK赛分组
 * @returns PK赛BOSS属性
 */
export function getPKBossStats(group: PKMatchGroup): PKBossStats {
  return pkBossStats[group];
}

/**
 * 创建PK赛BOSS敌人数据
 * 用于战斗系统
 * 注意：攻击力保留最小值和最大值范围，战斗时才随机取值
 * @param group PK赛分组
 * @returns 敌人数据
 */
export function createPKBossEnemyData(group: PKMatchGroup): EnemyData {
  const groupConfig = pkMatchGroups.find(g => g.group === group);
  const stats = pkBossStats[group];

  if (!groupConfig || !stats) {
    throw new Error(`无效的PK赛分组: ${group}`);
  }

  return {
    id: groupConfig.bossId,
    name: groupConfig.bossName,
    level: stats.level,
    combatPower: stats.combatPower,
    maxHp: stats.maxHp,
    attackMin: stats.minAttack, // 最小攻击力
    attackMax: stats.maxAttack, // 最大攻击力
    defense: stats.defense,
    description: `PK赛${groupConfig.name}冠军挑战BOSS`,
  };
}

/**
 * 检查是否为周六
 * @param nowday 当前天数（从1开始）
 * @returns 是否为周六
 */
export function isSaturday(nowday: number): boolean {
  // nowday % 7 === 6 表示周六
  return nowday % 7 === 6;
}

/**
 * 获取星期几名称
 * @param nowday 当前天数（从1开始）
 * @returns 星期几名称
 */
export function getWeekdayName(nowday: number): string {
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

  return weekdays[nowday % 7];
}
