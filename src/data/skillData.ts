/**
 * 技能系统数据
 * 根据参考文档定义6个技能
 * 玩家初始拥有2个技能，其他技能需要通过技能书学习
 */

import type { SkillDetail, SkillIndex } from '../types';

/**
 * 创建初始技能数据
 * @param isLearned 是否已学习
 * @returns 技能数据数组
 */
export const createInitialSkills = (isLearned: boolean = false): SkillDetail[] => [
  // 索引0: 风斩 - 单体攻击，攻击力100%（初始技能，不消耗体力）
  {
    id: 'skill_wind_slash',
    skillIndex: 0 as SkillIndex,
    name: '风斩',
    icon: '🌪️',
    type: 'active',
    attackType: 'single',
    rarity: 'rare',
    level: 1,
    maxLevel: 2,
    description: '凝聚风之力，对单个敌人造成攻击力100%的伤害。不消耗体力。',
    effect: {
      damagePercent: 100
    },
    cost: { stamina: 0 },
    cooldown: 0,
    currentCooldown: 0,
    range: '近战',
    targetType: '单体',
    learnMethod: 'initial',
    learnLevel: 1,
    isLearned: true
  },

  // 索引1: 裂地爆斩 - 群体攻击，攻击力60%（初始技能，消耗10点体力）
  {
    id: 'skill_earth_slash',
    skillIndex: 1 as SkillIndex,
    name: '裂地爆斩',
    icon: '💥',
    type: 'active',
    attackType: 'aoe',
    rarity: 'rare',
    level: 1,
    maxLevel: 2,
    description: '释放地裂之力，对所有敌人造成攻击力60%的伤害。消耗10点体力。',
    effect: {
      damagePercent: 60
    },
    cost: { stamina: 10 },
    cooldown: 0,
    currentCooldown: 0,
    range: '近战',
    targetType: '群体',
    learnMethod: 'initial',
    learnLevel: 1,
    isLearned: true
  },

  // 索引2: 星魔剑 - 群体攻击，攻击力100%/150%（高级）
  {
    id: 'skill_star_sword',
    skillIndex: 2 as SkillIndex,
    name: '星魔剑',
    icon: '⭐',
    type: 'active',
    attackType: 'aoe',
    rarity: 'epic',
    level: 1,
    maxLevel: 2,
    description: '召唤星魔之力，对所有敌人造成攻击力100%的伤害。高级版本伤害提升至150%。消耗30点体力。',
    effect: {
      damagePercent: 100
    },
    cost: { stamina: 30 },
    cooldown: 2,
    currentCooldown: 0,
    range: '中距离',
    targetType: '群体',
    learnMethod: 'skillBook',
    learnLevel: 10,
    upgradeCost: 10000,
    isLearned: isLearned
  },

  // 索引3: 飞天连斩 - 单体四连击，其中2击破防
  {
    id: 'skill_flying_slash',
    skillIndex: 3 as SkillIndex,
    name: '飞天连斩',
    icon: '🗡️',
    type: 'active',
    attackType: 'multi',
    rarity: 'epic',
    level: 1,
    maxLevel: 2,
    description: '发动四连斩击，对单个敌人造成4次伤害，其中2次攻击无视防御。消耗30点体力。',
    effect: {
      damagePercent: 40,
      hitCount: 4,
      breakDefenseHits: 2
    },
    cost: { stamina: 30 },
    cooldown: 3,
    currentCooldown: 0,
    range: '近战',
    targetType: '单体',
    learnMethod: 'skillBook',
    learnLevel: 15,
    upgradeCost: 15000,
    isLearned: isLearned
  },

  // 索引4: 斗志抑扬 - 增益技能，战斗力加成5%-50%，可升级到5级
  {
    id: 'skill_fighting_spirit',
    skillIndex: 4 as SkillIndex,
    name: '斗志抑扬',
    icon: '🔥',
    type: 'active',
    attackType: 'buff',
    rarity: 'legendary',
    level: 0,
    maxLevel: 5,
    description: '激发斗志，提升战斗力。等级越高，战斗力加成越大。最高可提升50%战斗力。',
    effect: {
      battlePowerBonus: 5,
      buff: '战斗力加成',
      duration: 3
    },
    cost: { mp: 25 },
    cooldown: 5,
    currentCooldown: 0,
    range: '自身',
    targetType: '自身',
    learnMethod: 'skillBook',
    learnLevel: 5,
    upgradeCost: 5000,
    isLearned: isLearned
  },

  // 索引5: 爱的力量 - 特殊技能，公主亲密度解锁
  {
    id: 'skill_love_power',
    skillIndex: 5 as SkillIndex,
    name: '爱的力量',
    icon: '💖',
    type: 'active',
    attackType: 'special',
    rarity: 'legendary',
    level: 1,
    maxLevel: 1,
    description: '公主的爱赋予你力量，大幅提升所有属性。需要与公主达到一定亲密度才能解锁。',
    effect: {
      battlePowerBonus: 30,
      buff: '全属性提升',
      duration: 5
    },
    cost: { mp: 0 },
    cooldown: 10,
    currentCooldown: 0,
    range: '自身',
    targetType: '自身',
    learnMethod: 'intimacy',
    learnLevel: 1,
    isLearned: false
  }
];

/**
 * 获取技能名称（根据等级显示高级版本）
 * @param skill 技能数据
 * @returns 技能名称
 */
export const getSkillDisplayName = (skill: SkillDetail): string => {
  // 斗志抑扬特殊处理，显示等级
  if (skill.skillIndex === 4) {
    if (skill.level === 0) {
      return '斗志抑扬（未学习）';
    }

    return `斗志抑扬 Lv.${skill.level}`;
  }

  // 爱的力量特殊处理，显示等级
  if (skill.skillIndex === 5) {
    if (skill.level === 0) {
      return '爱的力量（未解锁）';
    }

    return `爱的力量 Lv.${skill.level}`;
  }

  // 风斩/高级风斩
  if (skill.skillIndex === 0) {
    return skill.level === 2 ? '高级风斩' : '风斩';
  }

  // 裂地爆斩/高级裂地爆斩
  if (skill.skillIndex === 1) {
    return skill.level === 2 ? '高级裂地爆斩' : '裂地爆斩';
  }

  // 星魔剑/高级星魔剑
  if (skill.skillIndex === 2) {
    return skill.level === 2 ? '高级星魔剑' : '星魔剑';
  }

  // 飞天连斩/高级飞天连斩
  if (skill.skillIndex === 3) {
    return skill.level === 2 ? '高级飞天连斩' : '飞天连斩';
  }

  return skill.name;
};

/**
 * 获取斗志抑扬的战斗力加成百分比
 * @param level 技能等级（0-5）
 * @returns 战斗力加成百分比
 */
export const getFightingSpiritBonus = (level: number): number => {
  switch (level) {
    case 1: return 5;
    case 2: return 10;
    case 3: return 20;
    case 4: return 35;
    case 5: return 50;
    default: return 0;
  }
};

/**
 * 获取技能伤害百分比（考虑等级）
 * @param skill 技能数据
 * @returns 伤害百分比
 */
export const getSkillDamagePercent = (skill: SkillDetail): number => {
  // 风斩：等级1=100%，等级2=150%
  if (skill.skillIndex === 0) {
    return skill.level === 2 ? 150 : 100;
  }

  // 裂地爆斩：等级1=60%，等级2=75%
  if (skill.skillIndex === 1) {
    return skill.level === 2 ? 75 : 60;
  }

  // 星魔剑：等级1=100%，等级2=150%
  if (skill.skillIndex === 2) {
    return skill.level === 2 ? 150 : 100;
  }

  // 飞天连斩：等级1和等级2都是100%（每击）
  if (skill.skillIndex === 3) {
    return 100;
  }

  // 其他技能（斗志抑扬、爱的力量）返回基础伤害
  return skill.effect.damagePercent || 0;
};

/**
 * 示例技能数据（用于展示）
 */
export const exampleSkills = createInitialSkills(true);

/**
 * 获取技能升级消耗
 * @param skill 技能数据
 * @returns 升级消耗金币
 */
export const getSkillUpgradeCost = (skill: SkillDetail): number => {
  // 斗志抑扬升级消耗递增
  if (skill.skillIndex === 4) {
    const costs = [3000, 5000, 10000, 20000, 50000];

    return costs[skill.level] || 0;
  }

  // 其他技能升级消耗
  return skill.upgradeCost || 0;
};
