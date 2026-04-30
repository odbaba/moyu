import type { EquipmentDetail, EquipmentItem, EquipmentQuality, EquipmentSlotType, GemAttribute } from '../types';
import { WarSoulType } from '../types';
import { calculateEquipmentBaseAttributes, calculateEquipmentBonusAttributes } from './attributeCalculator';

/**
 * 装备品质映射（EquipmentItem 的 equipmentQuality 到 EquipmentDetail 的 quality）
 */
const qualityMap: Record<string, EquipmentQuality> = {
  '普通品': '普通品',
  '良品': '良品',
  '上品': '上品',
  '精品': '精品',
  '极品': '极品'
};

/**
 * 品质战斗力加成映射表
 * 品质战斗力 = pz（白品+0、良品+1、上品+2、精品+3、极品+4）
 */
const QUALITY_COMBAT_POWER: Record<EquipmentQuality, number> = {
  '普通品': 0,
  '良品': 1,
  '上品': 2,
  '精品': 3,
  '极品': 4
};

/**
 * 宝石战斗力加成映射表
 * 中级战斗力石：+3 战斗力
 * 高级战斗力石：+5 战斗力
 */
const GEM_COMBAT_POWER: Record<string, number> = {
  '中级战斗力石': 3,
  '高级战斗力石': 5
};

/**
 * 宝石经验加成映射表
 * 中级经验石：+25% 经验
 * 高级经验石：+50% 经验
 */
const GEM_EXP_BONUS: Record<string, number> = {
  '中级经验石': 25,
  '高级经验石': 50
};

/**
 * 计算宝石属性加成
 * @param gems 镶嵌的宝石名称数组
 * @returns 宝石属性加成对象
 */
export function calculateGemAttributes(gems: string[] | undefined): GemAttribute[] {
  if (!gems || gems.length === 0) {
    return [];
  }

  return gems.map(_gemName => {
    const attribute: GemAttribute = {
      attack: 0,
      defense: 0,
      hp: 0,
      mp: 0,
      dodge: 0,
      luck: 0
    };

    // 战斗力石不提供属性加成，只提供战斗力加成
    // 经验石不提供属性加成，只提供经验加成
    // 这里返回空属性，战斗力加成单独计算

    return attribute;
  });
}

/**
 * 计算宝石战斗力加成
 * @param gems 镶嵌的宝石名称数组
 * @returns 战斗力加成值
 */
export function calculateGemCombatPower(gems: string[] | undefined): number {
  if (!gems || gems.length === 0) {
    return 0;
  }

  let totalCombatPower = 0;
  gems.forEach(gemName => {
    totalCombatPower += GEM_COMBAT_POWER[gemName] || 0;
  });

  return totalCombatPower;
}

/**
 * 计算宝石经验加成
 * @param gems 镶嵌的宝石名称数组
 * @returns 经验加成百分比
 */
export function calculateGemExpBonus(gems: string[] | undefined): number {
  if (!gems || gems.length === 0) {
    return 0;
  }

  let totalExpBonus = 0;
  gems.forEach(gemName => {
    totalExpBonus += GEM_EXP_BONUS[gemName] || 0;
  });

  return totalExpBonus;
}

/**
 * 计算战魂属性加成
 * 根据参考文档：
 * - 天魂（soulType=1）：攻击力 + 战魂等级 × 5%
 * - 地魂（soulType=2）：闪避率 + 战魂等级 × 2%
 * @param soulType 战魂类型（0=无, 1=天魂, 2=地魂）
 * @param soulLevel 战魂等级（1-5）
 * @param baseAttackMin 基础最小攻击
 * @param baseAttackMax 基础最大攻击
 * @returns 战魂属性加成对象
 */
export function calculateSoulBonus(
  soulType: WarSoulType | undefined,
  soulLevel: number | undefined,
  baseAttackMin: number,
  baseAttackMax: number
): { attackMinBonus: number; attackMaxBonus: number; dodgeBonus: number } {
  const result = {
    attackMinBonus: 0,
    attackMaxBonus: 0,
    dodgeBonus: 0
  };

  if (!soulType || soulType <= WarSoulType.NONE || !soulLevel) {
    return result;
  }

  // 天魂：攻击力 + 战魂等级 × 5%
  if (soulType === WarSoulType.TIAN_HUN) {
    const bonusPercent = soulLevel * 0.05;
    result.attackMinBonus = Math.floor(baseAttackMin * bonusPercent);
    result.attackMaxBonus = Math.floor(baseAttackMax * bonusPercent);
  }
  // 地魂：闪避率 + 战魂等级 × 2%
  else if (soulType === WarSoulType.DI_HUN) {
    result.dodgeBonus = soulLevel * 2;
  }

  return result;
}

/**
 * 计算战魂战斗力加成
 * 每级战魂提供1点战斗力
 * @param soulType 战魂类型
 * @param soulLevel 战魂等级
 * @returns 战斗力加成值
 */
export function calculateSoulCombatPower(soulType: WarSoulType | undefined, soulLevel: number | undefined): number {
  if (!soulType || soulType <= WarSoulType.NONE || !soulLevel) {
    return 0;
  }

  return soulLevel;
}

/**
 * 计算单件装备的总战斗力
 * 根据原始代码 DefineSprite_561/frame_1/DoAction.as 和 DefineSprite_932/frame_1/DoAction.as：
 * - 品质战斗力：pz（白品+0、良品+1、上品+2、精品+3、极品+4）
 * - 魔魂等级战斗力：单件装备无加成，只有全套六件装备都有魔魂等级才有加成（取最低值）
 * - 洞数战斗力：洞数本身（不乘系数）
 * - 战魂战斗力：每级+1
 * - 宝石战斗力：中级战斗力石+3、高级战斗力石+5
 * @param equipment 装备详情
 * @returns 总战斗力
 */
export function calculateEquipmentCombatPower(equipment: EquipmentDetail): number {
  let totalCombatPower = 0;

  // 1. 品质战斗力加成（pz）
  totalCombatPower += QUALITY_COMBAT_POWER[equipment.quality] || 0;

  // 2. 魔魂等级战斗力加成：单件装备无加成
  // 只有全套六件装备都有魔魂等级才有战斗力加成，由 combatPower.ts 的 calculateFullSetMagicSoulBonusCombatPower 计算

  // 3. 洞数战斗力加成（洞数本身，不乘系数）
  totalCombatPower += equipment.holeCount || 0;

  // 4. 战魂战斗力加成（每级+1）
  totalCombatPower += calculateSoulCombatPower(equipment.soulType, equipment.soulLevel);

  // 5. 宝石战斗力加成（由外部调用时累加）

  return totalCombatPower;
}

/**
 * 将背包中的装备物品(EquipmentItem)转换为装备槽位的装备详情(EquipmentDetail)
 * @param item 背包中的装备物品
 * @returns 装备槽位的装备详情
 */
export function equipmentItemToDetail(item: EquipmentItem): EquipmentDetail {
  // 构造与 EquipmentDetail 兼容的对象用于属性计算
  const equipLike = {
    type: item.equipmentType,
    useLevel: item.useLevel,
    magicSoulLevel: item.magicSoulLevel || 0
  } as EquipmentDetail;

  // 使用 attributeCalculator 动态计算基础属性和追加属性
  // 与角色面板攻击/防御悬浮弹窗使用相同的计算逻辑
  const baseAttrs = calculateEquipmentBaseAttributes(equipLike);
  const bonusAttrs = calculateEquipmentBonusAttributes(equipLike);

  const baseAttackMin = baseAttrs.attackMin;
  const baseAttackMax = baseAttrs.attackMax;
  const baseDefense = baseAttrs.defense;
  const bonusAttackMin = bonusAttrs.attackMin;
  const bonusAttackMax = bonusAttrs.attackMax;
  const bonusDefense = bonusAttrs.defense;
  const magicSoulLevel = item.magicSoulLevel || 0;

  // 计算战魂属性加成（仅用于角色面板属性计算，不加入装备详情面板的攻击值）
  const soulBonus = calculateSoulBonus(item.soulType, item.soulLevel, baseAttackMin, baseAttackMax);

  // 计算宝石属性
  const gemAttributes = calculateGemAttributes(item.gems);

  // 计算宝石战斗力加成
  const gemCombatPower = calculateGemCombatPower(item.gems);

  // 创建装备详情对象
  // 注意：attributes 中的攻击值不包含天魂加成，天魂加成在角色属性计算时单独处理
  const detail: EquipmentDetail = {
    id: item.id,
    name: item.name,
    type: item.equipmentType,
    quality: qualityMap[item.equipmentQuality] || '普通品',
    magicSoulLevel: magicSoulLevel,
    attributes: {
      attackMin: baseAttackMin + bonusAttackMin,
      attackMax: baseAttackMax + bonusAttackMax,
      defense: baseDefense + bonusDefense,
      hp: item.attributes?.hp,
      mp: item.attributes?.mp,
      dodge: soulBonus.dodgeBonus,
      luck: item.attributes?.luck
    },
    holeCount: item.holeCount,
    gems: item.gems, // 保留宝石名称数组
    gemAttributes: gemAttributes,
    useLevel: item.useLevel,
    combatPower: 0, // 先设为0，后面计算
    soulType: item.soulType,
    soulLevel: item.soulLevel,
    baseAttackMin: baseAttackMin,
    baseAttackMax: baseAttackMax,
    baseDefense: baseDefense,
    bonusAttackMin: bonusAttackMin,
    bonusAttackMax: bonusAttackMax,
    bonusDefense: bonusDefense,
    icon: item.icon, // 保存原始图标
    imagePath: item.imagePath // 保存原始图片路径
  };

  // 计算总战斗力
  detail.combatPower = calculateEquipmentCombatPower(detail) + gemCombatPower;

  return detail;
}

/**
 * 将装备槽位的装备详情(EquipmentDetail)转换为背包中的装备物品(EquipmentItem)
 * @param detail 装备槽位的装备详情
 * @returns 背包中的装备物品
 */
export function equipmentDetailToItem(detail: EquipmentDetail): EquipmentItem {
  // 使用 attributeCalculator 动态计算基础属性和追加属性
  // 不需要从 detail.baseDefense/bonusDefense 等存储字段读取
  const baseAttrs = calculateEquipmentBaseAttributes(detail);
  const bonusAttrs = calculateEquipmentBonusAttributes(detail);

  const baseAttackMin = baseAttrs.attackMin;
  const baseAttackMax = baseAttrs.attackMax;
  const baseDefense = baseAttrs.defense;
  const bonusAttackMin = bonusAttrs.attackMin;
  const bonusAttackMax = bonusAttrs.attackMax;
  const bonusDefense = bonusAttrs.defense;

  return {
    id: detail.id,
    name: detail.name,
    icon: detail.icon || getEquipmentIcon(detail.type), // 优先使用保存的图标，否则使用默认图标
    quantity: 1,
    type: 'equipment',
    rarity: getRarityFromQuality(detail.quality),
    attributes: {
      hp: detail.attributes.hp,
      mp: detail.attributes.mp,
      attack: baseAttackMin || baseAttackMax,
      defense: baseDefense,
      luck: detail.attributes.luck
    },
    source: '装备卸下',
    description: `${detail.quality}${detail.name}`,
    equippable: true,
    quality: getQualityNumber(detail.quality),
    // 装备特有属性
    equipmentType: detail.type,
    useLevel: detail.useLevel,
    equipmentQuality: detail.quality,
    magicSoulLevel: detail.magicSoulLevel,
    holeCount: detail.holeCount,
    gems: detail.gems, // 保留宝石名称数组
    soulType: detail.soulType,
    soulLevel: detail.soulLevel,
    // 基础属性（不包含魔魂追加）
    attackMin: baseAttackMin,
    attackMax: baseAttackMax,
    defense: baseDefense,
    // 追加属性（魔魂加成）
    bonusAttackMin,
    bonusAttackMax,
    bonusDefense,
    imagePath: detail.imagePath // 恢复原始图片路径
  };
}

/**
 * 获取装备图标
 * @param type 装备类型
 * @returns 图标字符串
 */
function getEquipmentIcon(type: EquipmentSlotType): string {
  const iconMap: Record<EquipmentSlotType, string> = {
    weapon: '⚔️',
    helmet: '🪖',
    clothes: '🛡️',
    shoes: '👢',
    bracelet: '💫',
    necklace: '📿'
  };

  return iconMap[type] || '📦';
}

/**
 * 根据品质获取稀有度
 * @param quality 品质
 * @returns 稀有度
 */
function getRarityFromQuality(quality: EquipmentQuality): 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' {
  const rarityMap: Record<EquipmentQuality, 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'> = {
    '普通品': 'common',
    '良品': 'uncommon',
    '上品': 'rare',
    '精品': 'epic',
    '极品': 'legendary'
  };

  return rarityMap[quality] || 'common';
}

/**
 * 获取品质数值
 * @param quality 品质
 * @returns 品质数值(0-4)
 */
function getQualityNumber(quality: EquipmentQuality): number {
  const qualityNumberMap: Record<EquipmentQuality, number> = {
    '普通品': 0,
    '良品': 1,
    '上品': 2,
    '精品': 3,
    '极品': 4
  };

  return qualityNumberMap[quality] || 0;
}

/**
 * 获取装备槽位中文名称
 * @param type 装备类型
 * @returns 中文名称
 */
export function getEquipmentSlotName(type: EquipmentSlotType): string {
  const nameMap: Record<EquipmentSlotType, string> = {
    weapon: '武器',
    helmet: '头盔',
    clothes: '衣服',
    shoes: '战鞋',
    bracelet: '手镯',
    necklace: '项链'
  };

  return nameMap[type] || type;
}

/**
 * 获取所有装备槽位类型列表
 */
export const ALL_EQUIPMENT_SLOTS: EquipmentSlotType[] = [
  'weapon', 'helmet', 'clothes', 'shoes', 'bracelet', 'necklace'
];

/**
 * 获取装备显示名称
 * 根据规则生成装备的显示名称：${装备品质 === 普通品 ? '' : 装备品质}${装备名称}+${装备魔魂等级}
 * @param name 装备基础名称
 * @param quality 装备品质
 * @param magicSoulLevel 魔魂等级
 * @returns 格式化后的显示名称
 */
export function getEquipmentDisplayName(
  name: string,
  quality: EquipmentQuality,
  magicSoulLevel: number
): string {
  // 普通品不显示品质前缀
  const qualityPrefix = quality === '普通品' ? '' : quality;

  // 构建显示名称：品质前缀 + 基础名称 + 魔魂等级
  return `${qualityPrefix}${name}+${magicSoulLevel}`;
}
