/**
 * 地图挑战系统数据配置
 * 定义各地图的挑战要求、挑战者属性和保护者奖励
 * 参考文档：reference/docs/地图占领赛报名官交互逻辑文档.md
 */

import type { PetType } from '../types';

// ========== 地图挑战类型定义 ==========

/**
 * 挑战者配置接口
 * 定义地图挑战者的属性
 * 参考文档：reference/docs/project_docs/04_怪物系统.md
 */
export interface ChallengerConfig {
  /** 挑战者名称 */
  name: string;
  /** 挑战者等级 */
  level: number;
  /** 挑战者战斗力 */
  combatPower: number;
  /** 基础生命值 */
  baseHp: number;
  /** 生命成长（最小值） */
  hpGrowthMin: number;
  /** 生命成长（最大值） */
  hpGrowthMax: number;
  /** 基础最小攻击 */
  baseMinAttack: number;
  /** 最小攻击成长 */
  minAttackGrowth: number;
  /** 基础最大攻击 */
  baseMaxAttack: number;
  /** 最大攻击成长 */
  maxAttackGrowth: number;
  /** 基础防御 */
  baseDefense: number;
  /** 防御成长 */
  defenseGrowth: number;
  /** 是否为BOSS类型 */
  isBoss: boolean;
}

/**
 * 保护者奖励接口
 * 定义地图保护者每日可领取的完整奖励
 */
export interface ProtectorReward {
  /** 满经验球数量 */
  expBalls: number;
  /** 灵魂晶石/灵魂王数量 */
  soulStones: number;
  /** 灵魂石类型：'灵魂晶石' 或 '灵魂王' */
  soulStoneType: '灵魂晶石' | '灵魂王';
  /** 白玫瑰数量（99朵或999朵） */
  whiteRoses?: number;
  /** 白玫瑰类型：99朵或999朵 */
  roseType?: '99朵' | '999朵';
  /** 技能奖励（如飞天连斩） */
  skillReward?: string;
  /** 装备奖励 */
  equipmentReward?: {
    /** 装备品质 */
    quality: '精品' | '极品';
    /** 装备追加等级 */
    bonusLevel: number;
  };
  /** 幻兽奖励 */
  petReward?: {
    /** 幻兽类型 */
    petType: PetType;
    /** 幻兽星级 */
    star: number;
  };
}

/**
 * 地图挑战配置接口
 * 定义单个地图的完整挑战配置
 */
export interface MapChallengeConfig {
  /** 地图ID */
  locationId: string;
  /** 地图名称 */
  locationName: string;
  /** 爵位要求等级 */
  requiredNobleRank: number;
  /** 爵位要求名称 */
  requiredNobleRankName: string;
  /** 挑战者配置 */
  challenger: ChallengerConfig;
  /** 保护者每日奖励 */
  protectorReward: ProtectorReward;
  /** 地图描述 */
  description: string;
}

// ========== 地图挑战配置数据 ==========

/**
 * 地图挑战配置表
 * 定义所有地图的挑战配置
 * 参考文档：reference/docs/地图占领赛报名官交互逻辑文档.md
 */
export const MAP_CHALLENGE_CONFIGS: MapChallengeConfig[] = [
  {
    locationId: 'leiming-dalu',
    locationName: '雷鸣大陆',
    requiredNobleRank: 1,
    requiredNobleRankName: '勋爵',
    challenger: {
      name: '雷鸣大陆挑战者',
      level: 50,
      combatPower: 120,
      baseHp: 0,
      hpGrowthMin: 2000,
      hpGrowthMax: 6400,
      baseMinAttack: 0,
      minAttackGrowth: 112.5,
      baseMaxAttack: 0,
      maxAttackGrowth: 168,
      baseDefense: 0,
      defenseGrowth: 96,
      isBoss: false,
    },
    protectorReward: {
      expBalls: 2,
      soulStones: 2,
      soulStoneType: '灵魂晶石',
      equipmentReward: {
        quality: '精品',
        bonusLevel: 9,
      },
      petReward: {
        petType: '奇异兽',
        star: 1,
      },
    },
    description: '雷鸣大陆是亚特大陆的核心区域，适合新手玩家挑战。',
  },
  {
    locationId: 'gebi',
    locationName: '戈壁',
    requiredNobleRank: 2,
    requiredNobleRankName: '子爵',
    challenger: {
      name: '戈壁挑战者',
      level: 80,
      combatPower: 140,
      baseHp: 0,
      hpGrowthMin: 2000,
      hpGrowthMax: 6400,
      baseMinAttack: 0,
      minAttackGrowth: 112.5,
      baseMaxAttack: 0,
      maxAttackGrowth: 168,
      baseDefense: 0,
      defenseGrowth: 96,
      isBoss: false,
    },
    protectorReward: {
      expBalls: 4,
      soulStones: 2,
      soulStoneType: '灵魂晶石',
      whiteRoses: 99,
      roseType: '99朵',
      equipmentReward: {
        quality: '精品',
        bonusLevel: 9,
      },
      petReward: {
        petType: '奇异兽',
        star: 8,
      },
    },
    description: '戈壁是一片荒凉的沙漠地带，需要子爵以上爵位才能挑战。',
  },
  {
    locationId: 'mimeng-zhaozhe',
    locationName: '迷梦沼泽',
    requiredNobleRank: 2,
    requiredNobleRankName: '子爵',
    challenger: {
      name: '迷梦沼泽挑战者',
      level: 100,
      combatPower: 160,
      baseHp: 0,
      hpGrowthMin: 2000,
      hpGrowthMax: 6400,
      baseMinAttack: 0,
      minAttackGrowth: 112.5,
      baseMaxAttack: 0,
      maxAttackGrowth: 168,
      baseDefense: 0,
      defenseGrowth: 96,
      isBoss: false,
    },
    protectorReward: {
      expBalls: 6,
      soulStones: 2,
      soulStoneType: '灵魂晶石',
      whiteRoses: 99,
      roseType: '99朵',
      skillReward: '飞天连斩',
      petReward: {
        petType: '奇异兽',
        star: 12,
      },
    },
    description: '迷梦沼泽是一片充满迷雾的沼泽地，需要子爵以上爵位才能挑战。',
  },
  {
    locationId: 'binggong',
    locationName: '冰宫',
    requiredNobleRank: 3,
    requiredNobleRankName: '伯爵',
    challenger: {
      name: '冰宫挑战者',
      level: 120,
      combatPower: 200,
      baseHp: 0,
      hpGrowthMin: 2000,
      hpGrowthMax: 6400,
      baseMinAttack: 0,
      minAttackGrowth: 112.5,
      baseMaxAttack: 0,
      maxAttackGrowth: 168,
      baseDefense: 0,
      defenseGrowth: 96,
      isBoss: false,
    },
    protectorReward: {
      expBalls: 8,
      soulStones: 2,
      soulStoneType: '灵魂王',
      whiteRoses: 99,
      roseType: '99朵',
      equipmentReward: {
        quality: '精品',
        bonusLevel: 12,
      },
      petReward: {
        petType: '奇异兽',
        star: 12,
      },
    },
    description: '冰宫是一座由寒冰建造的宫殿，需要伯爵以上爵位才能挑战。',
  },
  {
    locationId: 'yaweite-dao',
    locationName: '亚维特岛',
    requiredNobleRank: 4,
    requiredNobleRankName: '公爵',
    challenger: {
      name: '亚维特岛挑战者',
      level: 120,
      combatPower: 240,
      baseHp: 0,
      hpGrowthMin: 2000,
      hpGrowthMax: 6400,
      baseMinAttack: 0,
      minAttackGrowth: 112.5,
      baseMaxAttack: 0,
      maxAttackGrowth: 168,
      baseDefense: 0,
      defenseGrowth: 96,
      isBoss: false,
    },
    protectorReward: {
      expBalls: 10,
      soulStones: 2,
      soulStoneType: '灵魂王',
      whiteRoses: 999,
      roseType: '999朵',
      equipmentReward: {
        quality: '极品',
        bonusLevel: 9,
      },
      petReward: {
        petType: '奇异兽',
        star: 19,
      },
    },
    description: '亚维特岛是一座神秘的岛屿，需要公爵以上爵位才能挑战。',
  },
  {
    locationId: 'kasanuocheng',
    locationName: '卡萨诺城',
    requiredNobleRank: 5,
    requiredNobleRankName: '侯爵',
    challenger: {
      name: '卡萨诺城挑战者',
      level: 150,
      combatPower: 500,
      baseHp: 0,
      hpGrowthMin: 2000,
      hpGrowthMax: 6400,
      baseMinAttack: 0,
      minAttackGrowth: 112.5,
      baseMaxAttack: 0,
      maxAttackGrowth: 168,
      baseDefense: 0,
      defenseGrowth: 96,
      isBoss: true,
    },
    protectorReward: {
      expBalls: 15,
      soulStones: 2,
      soulStoneType: '灵魂王',
      whiteRoses: 999,
      roseType: '999朵',
      equipmentReward: {
        quality: '极品',
        bonusLevel: 12,
      },
      petReward: {
        petType: '奇异兽',
        star: 19,
      },
    },
    description: '卡萨诺城是亚特大陆最繁华的城市，需要侯爵以上爵位才能挑战。',
  },
];

// ========== 辅助查询函数 ==========

/**
 * 根据地图ID获取地图挑战配置
 * @param locationId 地图ID
 * @returns 地图挑战配置，如果不存在则返回 undefined
 */
export function getMapChallengeConfigById(locationId: string): MapChallengeConfig | undefined {
  return MAP_CHALLENGE_CONFIGS.find(config => config.locationId === locationId);
}

/**
 * 根据爵位等级获取可挑战的地图列表
 * @param nobleRank 爵位等级
 * @returns 可挑战的地图配置列表
 */
export function getAvailableMapChallenges(nobleRank: number): MapChallengeConfig[] {
  return MAP_CHALLENGE_CONFIGS.filter(config => nobleRank >= config.requiredNobleRank);
}

