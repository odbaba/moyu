import { WarSoulType } from '../types';
import type { CharacterData, EquipmentDetail, PrincessRelationship } from '../types';
import { CHARACTER_BASE_STATS, CHARACTER_GROWTH_RATES } from '../utils/attributeCalculator';
import { calculateTotalCombatPower } from '../utils/combatPower';
import { examplePets } from './petData';

// 示例装备数据 - 武器
const weapon: EquipmentDetail = {
  id: 'weapon-001',
  name: '魔魂战刃',
  type: 'weapon',
  quality: '极品',
  magicSoulLevel: 12,
  attributes: {
    attackMin: 100,
    attackMax: 150
  },
  holeCount: 3,
  gemAttributes: [
    { attack: 20 },
    { attack: 20 },
    { attack: 20 }
  ],
  useLevel: 100,
  combatPower: 12, // 极品品质: 4 × 3 = 12
  // 战魂属性
  soulType: WarSoulType.TIAN_HUN, // 天魂
  soulLevel: 5 // 5级天魂
};

// 示例装备数据 - 衣服
const clothes: EquipmentDetail = {
  id: 'clothes-001',
  name: '魔魂战甲',
  type: 'clothes',
  quality: '精品',
  magicSoulLevel: 10,
  attributes: {
    defense: 80,
    hp: 500
  },
  holeCount: 2,
  gemAttributes: [
    { defense: 15 },
    { hp: 100 }
  ],
  useLevel: 80,
  combatPower: 9, // 精品品质: 3 × 3 = 9
  // 战魂属性
  soulType: WarSoulType.TIAN_HUN, // 天魂
  soulLevel: 4 // 4级天魂
};

// 示例装备数据 - 战鞋
const shoes: EquipmentDetail = {
  id: 'shoes-001',
  name: '幻影战靴',
  type: 'shoes',
  quality: '上品',
  magicSoulLevel: 8,
  attributes: {
    dodge: 20,
    luck: 5
  },
  holeCount: 2,
  gemAttributes: [
    { dodge: 10 },
    { luck: 3 }
  ],
  useLevel: 60,
  combatPower: 6, // 上品品质: 2 × 3 = 6
  // 战魂属性
  soulType: WarSoulType.DI_HUN, // 地魂
  soulLevel: 3 // 3级地魂
};

// 示例装备数据 - 手镯
const bracelet: EquipmentDetail = {
  id: 'bracelet-001',
  name: '魔灵手镯',
  type: 'bracelet',
  quality: '良品',
  magicSoulLevel: 6,
  attributes: {
    attackMin: 30,
    attackMax: 40
  },
  holeCount: 1,
  gemAttributes: [
    { attack: 10 }
  ],
  useLevel: 40,
  combatPower: 3, // 良品品质: 1 × 3 = 3
  // 战魂属性
  soulType: WarSoulType.NONE, // 无战魂
  soulLevel: 0
};

// 示例装备数据 - 项链
const necklace: EquipmentDetail = {
  id: 'necklace-001',
  name: '魔魂项链',
  type: 'necklace',
  quality: '极品',
  magicSoulLevel: 12,
  attributes: {
    mp: 300,
    luck: 10
  },
  holeCount: 3,
  gemAttributes: [
    { mp: 50 },
    { mp: 50 },
    { luck: 5 }
  ],
  useLevel: 100,
  combatPower: 12, // 极品品质: 4 × 3 = 12
  // 战魂属性
  soulType: WarSoulType.TIAN_HUN, // 天魂
  soulLevel: 5 // 5级天魂
};

// 示例装备数据 - 头盔
const helmet: EquipmentDetail = {
  id: 'helmet-001',
  name: '魔魂战盔',
  type: 'helmet',
  quality: '普通品',
  magicSoulLevel: 0,
  attributes: {
    defense: 20
  },
  holeCount: 1,
  gemAttributes: [],
  useLevel: 1,
  combatPower: 0, // 普通品品质: 0 × 3 = 0
  // 战魂属性
  soulType: WarSoulType.NONE, // 无战魂
  soulLevel: 0
};

// 示例角色数据
const playerCharacter: CharacterData = {
  id: 'player-001',
  playerName: '魔域霸主',
  level: 1,
  title: '亚特之巅',
  // 军衔系统
  militaryRankLevel: 0, // 军衔等级：无
  militaryRankName: '无', // 军衔名称
  battleExp: 0, // 累计战功
  // 爵位系统
  nobleRankLevel: 0, // 爵位等级：平民
  nobleRankName: '平民', // 爵位名称
  merit: 0, // 累计功勋
  maxHp: 550,
  currentHp: 550,
  maxStamina: 110,
  currentStamina: 110,
  exp: 0,
  maxExp: 10,
  attackMin: 55,
  attackMax: 55,
  defense: 88,
  dodgeRate: 30,
  luck: 50,
  equipment: {
    weapon: weapon,
    clothes: clothes,
    shoes: shoes,
    bracelet: bracelet,
    necklace: necklace,
    helmet: helmet
  },
  // 基础属性常量
  baseHp: CHARACTER_BASE_STATS.baseHp,
  baseStamina: CHARACTER_BASE_STATS.baseStamina,
  baseAttackMin: CHARACTER_BASE_STATS.baseAttackMin,
  baseAttackMax: CHARACTER_BASE_STATS.baseAttackMax,
  baseDefense: CHARACTER_BASE_STATS.baseDefense,
  // 成长系数
  growthHp: CHARACTER_GROWTH_RATES.growthHp,
  growthStamina: CHARACTER_GROWTH_RATES.growthStamina,
  growthAttackMin: CHARACTER_GROWTH_RATES.growthAttackMin,
  growthAttackMax: CHARACTER_GROWTH_RATES.growthAttackMax,
  growthDefense: CHARACTER_GROWTH_RATES.growthDefense,
  // 战斗力（初始值，导出时重新计算）
  combatPower: 0
};

// 导出示例角色数据（计算战斗力）
export const exampleCharacter: CharacterData = {
  ...playerCharacter,
  // 使用完整的战斗力计算函数，包含幻兽战斗力加成
  combatPower: calculateTotalCombatPower(playerCharacter, examplePets)
};

// 导出示例装备数据
export const exampleEquipments: EquipmentDetail[] = [
  weapon,
  clothes,
  shoes,
  bracelet,
  necklace,
  helmet
];


// ========== 公主关系系统数据 ==========

/**
 * 示例公主关系数据
 * 初始状态：未认识公主
 */
export const examplePrincessRelationship: PrincessRelationship = {
  level: 0, // 关系等级：未认识
  intimacy: 0, // 亲密度：0
  relationshipName: '未认识', // 关系名称
  canChatToday: true, // 今天可以聊天
  canGiftToday: true, // 今天可以送礼
  canReceiveSundayGift: true, // 本周可以领取周日礼物
  hasReceivedConfidantGift: false // 未领取知己的礼物
};

/**
 * 公主关系数据（已建立关系示例）
 * 关系等级：知己
 */
export const confidantPrincessRelationship: PrincessRelationship = {
  level: 4, // 关系等级：知己
  intimacy: 75, // 亲密度：75
  relationshipName: '知己', // 关系名称
  canChatToday: true, // 今天可以聊天
  canGiftToday: true, // 今天可以送礼
  canReceiveSundayGift: true, // 本周可以领取周日礼物
  hasReceivedConfidantGift: false // 未领取知己的礼物
};

/**
 * 公主关系数据（恋人示例）
 * 关系等级：恋人
 */
export const loverPrincessRelationship: PrincessRelationship = {
  level: 5, // 关系等级：恋人
  intimacy: 150, // 亲密度：150
  relationshipName: '恋人', // 关系名称
  canChatToday: true, // 今天可以聊天
  canGiftToday: true, // 今天可以送礼
  canReceiveSundayGift: true, // 本周可以领取周日礼物
  hasReceivedConfidantGift: true // 已领取知己的礼物
};
