import type { CharacterData, EquipmentDetail, PrincessRelationship } from '../types';
import { WarSoulType } from '../types';
import { CHARACTER_BASE_STATS, CHARACTER_GROWTH_RATES } from '../utils/attributeCalculator';
import { calculateTotalCombatPower } from '../utils/combatPower';
import { equipmentItemToDetail } from '../utils/equipmentConverter';
import { createEquipmentItem } from '../utils/itemFactory';
import { examplePets } from './petData';

/**
 * 创建带战魂属性的装备详情
 * 使用公共接口生成装备，并添加战魂属性
 */
function createEquipmentWithSoul(config: {
  equipmentType: 'weapon' | 'helmet' | 'clothes' | 'shoes' | 'bracelet' | 'necklace';
  level: number;
  quality: number;
  magicSoulLevel?: number;
  gemSlots?: number;
  soulType?: WarSoulType;
  soulLevel?: number;
}): EquipmentDetail {
  // 使用公共接口创建装备物品
  const equipmentItem = createEquipmentItem({
    equipmentType: config.equipmentType,
    level: config.level,
    quality: config.quality,
    magicSoulLevel: config.magicSoulLevel || 0,
    gemSlots: config.gemSlots || 0,
  });

  // 转换为装备详情
  const equipmentDetail = equipmentItemToDetail(equipmentItem);

  // 添加战魂属性
  if (config.soulType && config.soulLevel) {
    equipmentDetail.soulType = config.soulType;
    equipmentDetail.soulLevel = config.soulLevel;
  }

  return equipmentDetail;
}

// 示例装备数据 - 武器
// 武器：最小攻击 = 20 × 等级，最大攻击 = 30 × 等级
// 100级武器：基础攻击 2000-3000，魔魂+12追加 2400-3600
const weapon = createEquipmentWithSoul({
  equipmentType: 'weapon',
  level: 100,
  quality: 4, // 极品
  magicSoulLevel: 12,
  gemSlots: 3,
  soulType: WarSoulType.TIAN_HUN,
  soulLevel: 5
});

// 示例装备数据 - 衣服
// 衣服：防御力 = 18 × 等级
// 80级衣服：基础防御 1440，魔魂+10追加 1440
const clothes = createEquipmentWithSoul({
  equipmentType: 'clothes',
  level: 80,
  quality: 3, // 精品
  magicSoulLevel: 10,
  gemSlots: 2,
  soulType: WarSoulType.TIAN_HUN,
  soulLevel: 4
});

// 示例装备数据 - 战鞋
// 战鞋：防御力 = 8 × 等级
// 60级战鞋：基础防御 480，魔魂+8追加 384
const shoes = createEquipmentWithSoul({
  equipmentType: 'shoes',
  level: 60,
  quality: 2, // 上品
  magicSoulLevel: 8,
  gemSlots: 2,
  soulType: WarSoulType.TIAN_HUN,
  soulLevel: 3
});

// 示例装备数据 - 手镯
// 手镯：最小攻击 = 10 × 等级，最大攻击 = 15 × 等级
// 40级手镯：基础攻击 400-600，魔魂+6追加 240-360
const bracelet = createEquipmentWithSoul({
  equipmentType: 'bracelet',
  level: 40,
  quality: 1, // 良品
  magicSoulLevel: 6,
  gemSlots: 1,
  soulType: WarSoulType.TIAN_HUN,
  soulLevel: 3
});

// 示例装备数据 - 项链
// 项链：最小攻击 = 15 × 等级，最大攻击 = 20 × 等级
// 100级项链：基础攻击 1500-2000，魔魂+12追加 1800-2400
const necklace = createEquipmentWithSoul({
  equipmentType: 'necklace',
  level: 100,
  quality: 4, // 极品
  magicSoulLevel: 12,
  gemSlots: 3,
  soulType: WarSoulType.TIAN_HUN,
  soulLevel: 5
});

// 示例装备数据 - 头盔
// 头盔：防御力 = 12 × 等级
// 1级头盔：基础防御 12，无魔魂追加
const helmet = createEquipmentWithSoul({
  equipmentType: 'helmet',
  level: 1,
  quality: 0, // 普通品
  magicSoulLevel: 0,
  gemSlots: 1,
  soulType: WarSoulType.TIAN_HUN,
  soulLevel: 3
});

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
  // 使用完整的战斗力计算函数，包含幻兽战斗力加成和斗志昂扬加成
  combatPower: calculateTotalCombatPower(playerCharacter, examplePets, [])
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
  hasReceivedConfidantGift: false, // 未领取知己的礼物
  canGiftThisWeek: true // 本周可以送礼（一周只能送一次，一次最多12个）
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
  hasReceivedConfidantGift: false, // 未领取知己的礼物
  canGiftThisWeek: true // 本周可以送礼（一周只能送一次，一次最多12个）
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
  hasReceivedConfidantGift: true, // 已领取知己的礼物
  canGiftThisWeek: true // 本周可以送礼（一周只能送一次，一次最多12个）
};
