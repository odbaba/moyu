/**
 * 技能书物品数据
 * 用于学习新技能或升级现有技能
 */

import type { InventoryItem } from '../types';

/**
 * 技能书物品列表
 */
export const skillBookItems: InventoryItem[] = [
  // 高级风斩技能书（升级书）
  {
    id: 'skillbook_wind_slash_advanced',
    name: '高级风斩',
    icon: '📜',
    type: 'skillBook',
    description: '将风斩升级为高级版本，伤害提升至150%。消耗5点体力。',
    quantity: 1,
    quality: 3,
    price: 1000,
    stackable: false,
    skillId: 'skill_wind_slash',
    isUpgrade: true,
    targetLevel: 2
  },
  
  // 高级裂地爆斩技能书（升级书）
  {
    id: 'skillbook_earth_slash_advanced',
    name: '高级裂地爆斩',
    icon: '📜',
    type: 'skillBook',
    description: '将裂地爆斩升级为高级版本，伤害提升至75%。消耗20点体力。',
    quantity: 1,
    quality: 3,
    price: 10000,
    stackable: false,
    skillId: 'skill_earth_slash',
    isUpgrade: true,
    targetLevel: 2
  },
  
  // 星魔剑技能书
  {
    id: 'skillbook_star_sword',
    name: '星魔剑技能书',
    icon: '📖',
    type: 'skillBook',
    description: '学习星魔剑技能，对所有敌人造成攻击力100%的伤害。消耗30点体力。',
    quantity: 1,
    quality: 3,
    price: 5000,
    stackable: false,
    skillId: 'skill_star_sword'
  },
  // 高级星魔剑技能书
  {
    id: 'skillbook_star_sword_advanced',
    name: '高级星魔剑技能书',
    icon: '📜',
    type: 'skillBook',
    description: '将星魔剑升级为高级版本，伤害提升至150%。消耗50点体力。',
    quantity: 1,
    quality: 4,
    price: 10000,
    stackable: false,
    skillId: 'skill_star_sword',
    isUpgrade: true
  },
  
  // 飞天连斩技能书
  {
    id: 'skillbook_flying_slash',
    name: '飞天连斩技能书',
    icon: '📖',
    type: 'skillBook',
    description: '学习飞天连斩技能，发动四连斩击，其中2次攻击无视防御。消耗30点体力。',
    quantity: 1,
    quality: 4,
    price: 8000,
    stackable: false,
    skillId: 'skill_flying_slash'
  },
  // 高级飞天连斩技能书
  {
    id: 'skillbook_flying_slash_advanced',
    name: '高级飞天连斩技能书',
    icon: '📜',
    type: 'skillBook',
    description: '将飞天连斩升级为高级版本，伤害大幅提升。消耗50点体力。',
    quantity: 1,
    quality: 5,
    price: 15000,
    stackable: false,
    skillId: 'skill_flying_slash',
    isUpgrade: true
  },
  
  // 斗志抑扬技能书（可升级5级）
  {
    id: 'skillbook_fighting_spirit_1',
    name: '斗志抑扬技能书',
    icon: '📖',
    type: 'skillBook',
    description: '学习斗志抑扬技能，提升战斗力5%。',
    quantity: 1,
    quality: 3,
    price: 3000,
    stackable: false,
    skillId: 'skill_fighting_spirit',
    targetLevel: 1
  },
  {
    id: 'skillbook_fighting_spirit_2',
    name: '斗志抑扬进阶卷轴',
    icon: '📜',
    type: 'skillBook',
    description: '将斗志抑扬升级至Lv.2，战斗力加成提升至10%。',
    quantity: 1,
    quality: 3,
    price: 5000,
    stackable: false,
    skillId: 'skill_fighting_spirit',
    isUpgrade: true,
    targetLevel: 2
  },
  {
    id: 'skillbook_fighting_spirit_3',
    name: '斗志抑扬精修卷轴',
    icon: '📜',
    type: 'skillBook',
    description: '将斗志抑扬升级至Lv.3，战斗力加成提升至20%。',
    quantity: 1,
    quality: 4,
    price: 10000,
    stackable: false,
    skillId: 'skill_fighting_spirit',
    isUpgrade: true,
    targetLevel: 3
  },
  {
    id: 'skillbook_fighting_spirit_4',
    name: '斗志抑扬大师卷轴',
    icon: '📜',
    type: 'skillBook',
    description: '将斗志抑扬升级至Lv.4，战斗力加成提升至35%。',
    quantity: 1,
    quality: 4,
    price: 20000,
    stackable: false,
    skillId: 'skill_fighting_spirit',
    isUpgrade: true,
    targetLevel: 4
  },
  {
    id: 'skillbook_fighting_spirit_5',
    name: '斗志抑扬宗师卷轴',
    icon: '📜',
    type: 'skillBook',
    description: '将斗志抑扬升级至最高等级Lv.5，战斗力加成提升至50%。',
    quantity: 1,
    quality: 5,
    price: 50000,
    stackable: false,
    skillId: 'skill_fighting_spirit',
    isUpgrade: true,
    targetLevel: 5
  }
];

/**
 * 根据技能ID获取对应的技能书
 * @param skillId 技能ID
 * @returns 技能书物品数组
 */
export const getSkillBooksBySkillId = (skillId: string): InventoryItem[] => {
  return skillBookItems.filter(item => item.skillId === skillId);
};

/**
 * 获取学习技能所需的技能书
 * @param skillId 技能ID
 * @returns 学习技能书（非升级）
 */
export const getLearnSkillBook = (skillId: string): InventoryItem | undefined => {
  return skillBookItems.find(item => item.skillId === skillId && !item.isUpgrade);
};

/**
 * 获取升级技能所需的技能书
 * @param skillId 技能ID
 * @param currentLevel 当前等级
 * @returns 升级技能书
 */
export const getUpgradeSkillBook = (skillId: string, currentLevel: number): InventoryItem | undefined => {
  return skillBookItems.find(item => 
    item.skillId === skillId && 
    item.isUpgrade && 
    item.targetLevel === currentLevel + 1
  );
};
