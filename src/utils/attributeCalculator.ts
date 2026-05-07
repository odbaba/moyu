import type { CharacterData, EquipmentDetail, EquipmentSlotType } from '../types';
import { WarSoulType } from '../types';
import { increaseLuck } from './luckUtils';

/**
 * 装备基础属性系数配置
 * 根据参考文档定义各类型装备的基础属性计算系数
 * 注意：CharacterData 中使用 'clothes' 作为衣服槽位名称
 */
export const EQUIPMENT_BASE_COEFFICIENTS: Record<EquipmentSlotType, {
  attackMin: number; // 最小攻击系数
  attackMax: number; // 最大攻击系数
  defense: number; // 防御系数
}> = {
  weapon: { attackMin: 20, attackMax: 30, defense: 0 }, // 武器：20×等级 ~ 30×等级
  helmet: { attackMin: 0, attackMax: 0, defense: 12 }, // 头盔：12×等级防御
  clothes: { attackMin: 0, attackMax: 0, defense: 18 }, // 衣服：18×等级防御（使用 clothes 而非 armor）
  shoes: { attackMin: 0, attackMax: 0, defense: 8 }, // 战鞋：8×等级防御
  bracelet: { attackMin: 10, attackMax: 15, defense: 0 }, // 手镯：10×等级 ~ 15×等级
  necklace: { attackMin: 15, attackMax: 20, defense: 0 } // 项链：15×等级 ~ 20×等级
};

/**
 * 角色基础属性常量
 * 根据参考文档定义角色的基础属性
 */
export const CHARACTER_BASE_STATS = {
  baseHp: 500, // 基础生命值
  baseStamina: 100, // 基础体力值
  baseAttackMin: 45, // 基础最小攻击
  baseAttackMax: 45, // 基础最大攻击
  baseDefense: 80 // 基础防御力
};

/**
 * 角色成长系数
 * 根据参考文档定义角色的成长系数
 */
export const CHARACTER_GROWTH_RATES = {
  growthHp: 50, // 生命成长
  growthStamina: 10, // 体力成长
  growthAttackMin: 10, // 最小攻击成长
  growthAttackMax: 10, // 最大攻击成长
  growthDefense: 8 // 防御成长
};

/**
 * 暴击率/暴击伤害率等级成长表
 * 根据策划文档第二章的属性成长表定义
 * 暴击率单位：百分比（如5.0表示5%）
 * 暴击伤害率单位：百分比（如150表示150%，即×1.5）
 * 未列出的等级使用线性插值计算
 */
export const CRITICAL_STATS_TABLE: Map<number, { criticalRate: number; criticalDamageRate: number }> = new Map([
  [1,   { criticalRate: 5.0,  criticalDamageRate: 150 }],
  [5,   { criticalRate: 5.0,  criticalDamageRate: 150 }],
  [10,  { criticalRate: 5.0,  criticalDamageRate: 150 }],
  [15,  { criticalRate: 5.0,  criticalDamageRate: 150 }],
  [20,  { criticalRate: 5.0,  criticalDamageRate: 150 }],
  [25,  { criticalRate: 5.0,  criticalDamageRate: 150 }],
  [30,  { criticalRate: 5.0,  criticalDamageRate: 150 }],
  [35,  { criticalRate: 5.2,  criticalDamageRate: 152 }],
  [40,  { criticalRate: 5.4,  criticalDamageRate: 154 }],
  [45,  { criticalRate: 5.6,  criticalDamageRate: 156 }],
  [50,  { criticalRate: 5.8,  criticalDamageRate: 158 }],
  [55,  { criticalRate: 6.0,  criticalDamageRate: 160 }],
  [60,  { criticalRate: 6.3,  criticalDamageRate: 162 }],
  [65,  { criticalRate: 6.6,  criticalDamageRate: 165 }],
  [70,  { criticalRate: 7.0,  criticalDamageRate: 168 }],
  [75,  { criticalRate: 7.5,  criticalDamageRate: 171 }],
  [80,  { criticalRate: 8.0,  criticalDamageRate: 175 }],
  [85,  { criticalRate: 8.5,  criticalDamageRate: 179 }],
  [90,  { criticalRate: 9.0,  criticalDamageRate: 183 }],
  [95,  { criticalRate: 9.5,  criticalDamageRate: 188 }],
  [100, { criticalRate: 10.0, criticalDamageRate: 193 }],
  [105, { criticalRate: 10.8, criticalDamageRate: 198 }],
  [110, { criticalRate: 11.6, criticalDamageRate: 204 }],
  [115, { criticalRate: 12.5, criticalDamageRate: 210 }],
  [120, { criticalRate: 13.5, criticalDamageRate: 217 }],
  [125, { criticalRate: 14.5, criticalDamageRate: 224 }],
  [130, { criticalRate: 15.5, criticalDamageRate: 232 }],
  [132, { criticalRate: 16.0, criticalDamageRate: 235 }],
]);

/**
 * 根据等级计算暴击率和暴击伤害率
 * 对于成长表中明确列出的等级直接返回，未列出的等级使用线性插值计算
 * @param level 角色等级
 * @returns 暴击率和暴击伤害率对象
 */
export function calculateCriticalStats(level: number): { criticalRate: number; criticalDamageRate: number } {
  // 等级下限保护
  const clampedLevel = Math.max(1, Math.min(level, 132));

  // 如果等级在成长表中，直接返回
  const directValue = CRITICAL_STATS_TABLE.get(clampedLevel);
  if (directValue) {
    return { ...directValue };
  }

  // 查找最近的两个关键等级进行线性插值
  const sortedLevels = Array.from(CRITICAL_STATS_TABLE.keys()).sort((a, b) => a - b);

  // 找到当前等级所在的区间：lowerLevel < clampedLevel < upperLevel
  let lowerLevel = sortedLevels[0];
  let upperLevel = sortedLevels[sortedLevels.length - 1];

  for (let i = 0; i < sortedLevels.length - 1; i++) {
    if (sortedLevels[i] <= clampedLevel && sortedLevels[i + 1] >= clampedLevel) {
      lowerLevel = sortedLevels[i];
      upperLevel = sortedLevels[i + 1];
      break;
    }
  }

  const lowerStats = CRITICAL_STATS_TABLE.get(lowerLevel)!;
  const upperStats = CRITICAL_STATS_TABLE.get(upperLevel)!;

  // 线性插值公式：lower + (upper - lower) * (level - lowerLevel) / (upperLevel - lowerLevel)
  const ratio = (clampedLevel - lowerLevel) / (upperLevel - lowerLevel);
  const criticalRate = lowerStats.criticalRate + (upperStats.criticalRate - lowerStats.criticalRate) * ratio;
  const criticalDamageRate = lowerStats.criticalDamageRate + (upperStats.criticalDamageRate - lowerStats.criticalDamageRate) * ratio;

  // 保留一位小数
  return {
    criticalRate: Math.round(criticalRate * 10) / 10,
    criticalDamageRate: Math.round(criticalDamageRate * 10) / 10,
  };
}

/**
 * 计算单件装备的基础属性
 * 根据装备类型和使用等级计算基础属性
 * @param equipment 装备对象
 * @returns 基础属性对象
 */
export function calculateEquipmentBaseAttributes(equipment: EquipmentDetail): {
  attackMin: number;
  attackMax: number;
  defense: number;
} {
  const coefficients = EQUIPMENT_BASE_COEFFICIENTS[equipment.type];
  const level = equipment.useLevel;

  return {
    attackMin: coefficients.attackMin * level,
    attackMax: coefficients.attackMax * level,
    defense: coefficients.defense * level
  };
}

/**
 * 计算单件装备的追加属性（魔魂加成）
 * 根据魔魂等级计算追加属性
 * @param equipment 装备对象
 * @returns 追加属性对象
 */
export function calculateEquipmentBonusAttributes(equipment: EquipmentDetail): {
  attackMin: number;
  attackMax: number;
  defense: number;
} {
  const baseAttrs = calculateEquipmentBaseAttributes(equipment);
  const mhdj = equipment.magicSoulLevel;

  // 追加属性 = Math.floor(基础属性 / 10) × 魔魂等级
  return {
    attackMin: Math.floor(baseAttrs.attackMin / 10) * mhdj,
    attackMax: Math.floor(baseAttrs.attackMax / 10) * mhdj,
    defense: Math.floor(baseAttrs.defense / 10) * mhdj
  };
}

/**
 * 计算单件装备的总属性
 * @param equipment 装备对象
 * @returns 总属性对象（基础 + 追加）
 */
export function calculateTotalEquipmentAttributes(equipment: EquipmentDetail | null): {
  attackMin: number;
  attackMax: number;
  defense: number;
} {
  if (!equipment) {
    return { attackMin: 0, attackMax: 0, defense: 0 };
  }

  const baseAttrs = calculateEquipmentBaseAttributes(equipment);
  const bonusAttrs = calculateEquipmentBonusAttributes(equipment);

  return {
    attackMin: baseAttrs.attackMin + bonusAttrs.attackMin,
    attackMax: baseAttrs.attackMax + bonusAttrs.attackMax,
    defense: baseAttrs.defense + bonusAttrs.defense
  };
}

/**
 * 计算所有装备的总属性加成
 * @param equipment 角色装备对象
 * @returns 所有装备的总属性加成
 */
export function calculateAllEquipmentBonus(equipment: CharacterData['equipment']): {
  attackMin: number;
  attackMax: number;
  defense: number;
  dodgeRate: number;
} {
  const result = { attackMin: 0, attackMax: 0, defense: 0, dodgeRate: 0 };

  // 遍历所有装备槽位
  const slots: (keyof typeof equipment)[] = ['weapon', 'helmet', 'clothes', 'shoes', 'bracelet', 'necklace'];

  slots.forEach(slot => {
    const item = equipment[slot];
    if (item) {
      const attrs = calculateTotalEquipmentAttributes(item);
      result.attackMin += attrs.attackMin;
      result.attackMax += attrs.attackMax;
      result.defense += attrs.defense;

      // 计算地魂战魂的闪避加成
      if (item.soulType === WarSoulType.DI_HUN && item.soulLevel) {
        result.dodgeRate += item.soulLevel * 2; // 每级地魂提供2%闪避
      }
    }
  });

  return result;
}

/**
 * 计算战魂攻击力百分比加成
 * 天魂战魂提供攻击力百分比加成
 * @param equipment 角色装备对象
 * @returns 攻击力百分比加成（如0.25表示25%）
 */
export function calculateSoulAttackBonus(equipment: CharacterData['equipment']): number {
  let bonus = 0;

  const slots: (keyof typeof equipment)[] = ['weapon', 'helmet', 'clothes', 'shoes', 'bracelet', 'necklace'];

  slots.forEach(slot => {
    const item = equipment[slot];
    // 天魂战魂提供攻击力百分比加成
    if (item && item.soulType === WarSoulType.TIAN_HUN && item.soulLevel) {
      bonus += item.soulLevel * 0.05; // 每级天魂提供5%攻击加成
    }
  });

  return bonus;
}

/**
 * 计算角色基础属性
 * 根据等级计算角色的基础属性（不含装备和幻兽加成）
 * @param level 角色等级
 * @returns 基础属性对象
 */
export function calculateCharacterBaseAttributes(level: number): {
  maxHp: number;
  maxStamina: number;
  attackMin: number;
  attackMax: number;
  defense: number;
  criticalRate: number;
  criticalDamageRate: number;
} {
  // 根据等级获取暴击属性
  const criticalStats = calculateCriticalStats(level);

  return {
    maxHp: CHARACTER_BASE_STATS.baseHp + CHARACTER_GROWTH_RATES.growthHp * level,
    maxStamina: CHARACTER_BASE_STATS.baseStamina + CHARACTER_GROWTH_RATES.growthStamina * level,
    attackMin: CHARACTER_BASE_STATS.baseAttackMin + CHARACTER_GROWTH_RATES.growthAttackMin * level,
    attackMax: CHARACTER_BASE_STATS.baseAttackMax + CHARACTER_GROWTH_RATES.growthAttackMax * level,
    defense: CHARACTER_BASE_STATS.baseDefense + CHARACTER_GROWTH_RATES.growthDefense * level,
    criticalRate: criticalStats.criticalRate,
    criticalDamageRate: criticalStats.criticalDamageRate,
  };
}

/**
 * 计算角色总属性
 * 汇总基础属性、装备加成、幻兽加成
 * @param character 角色数据
 * @returns 总属性对象
 */
export function calculateTotalCharacterAttributes(character: CharacterData): {
  maxHp: number;
  maxStamina: number;
  attackMin: number;
  attackMax: number;
  defense: number;
  dodgeRate: number;
  criticalRate: number;
  criticalDamageRate: number;
} {
  // 基础属性
  const baseAttrs = calculateCharacterBaseAttributes(character.level);

  // 装备加成
  const equipmentBonus = calculateAllEquipmentBonus(character.equipment);

  // 幻兽加成
  const petBonus = character.petBonus || { attackMin: 0, attackMax: 0, defense: 0 };

  // 战魂攻击百分比加成
  const soulAttackBonus = calculateSoulAttackBonus(character.equipment);

  // 计算总攻击力（基础 + 装备 + 幻兽）× (1 + 战魂百分比)
  const totalAttackMin = Math.round((baseAttrs.attackMin + equipmentBonus.attackMin + petBonus.attackMin) * (1 + soulAttackBonus));
  const totalAttackMax = Math.round((baseAttrs.attackMax + equipmentBonus.attackMax + petBonus.attackMax) * (1 + soulAttackBonus));

  return {
    maxHp: baseAttrs.maxHp,
    maxStamina: baseAttrs.maxStamina,
    attackMin: totalAttackMin,
    attackMax: totalAttackMax,
    defense: baseAttrs.defense + equipmentBonus.defense + petBonus.defense,
    dodgeRate: equipmentBonus.dodgeRate,
    // 暴击率和暴击伤害率直接使用角色属性值，不再实时查表
    criticalRate: character.criticalRate,
    criticalDamageRate: character.criticalDamageRate,
  };
}

/**
 * 获取装备品质数值
 * @param quality 品质名称
 * @returns 品质数值 (0-4)
 */
export function getQualityValue(quality: string): number {
  const qualityMap: Record<string, number> = {
    '普通品': 0,
    '良品': 1,
    '上品': 2,
    '精品': 3,
    '极品': 4
  };

  return qualityMap[quality] || 0;
}

/**
 * 预计算所有等级的升级所需经验
 * @param maxLevel 最高等级（默认132）
 * @returns 等级 -> 升级所需经验的映射表
 */
export function preCalculateMaxExpTable(maxLevel: number = 132): Map<number, number> {
  const table = new Map<number, number>();
  let maxExp = 10; // 1级升2级需要10经验
  let hun = 0;

  table.set(1, maxExp);

  for (let level = 2; level <= maxLevel; level++) {
    // 20级前，每次升级所需经验是上一级的1.2倍
    if (level <= 20) {
      maxExp = Math.round(maxExp * 1.2);
    }
    // 20-50级，每次升级所需经验是上一级的1.1倍
    else if (level <= 50) {
      maxExp = Math.round(maxExp * 1.1);
    }
    // 50级以上，每次升级增加固定值
    else {
      // 在51级时计算固定值（50级所需经验的20%）
      if (level === 51) {
        hun = Math.round(maxExp * 0.2);
      }
      maxExp += hun;
    }

    table.set(level, maxExp);
  }

  return table;
}

// 导出预计算表（提高性能）
export const MAX_EXP_TABLE = preCalculateMaxExpTable();

// ==================== 角色经验获取和升级逻辑 ====================

/**
 * 角色获得经验并处理升级的结果接口
 */
export interface CharacterExperienceResult {
  character: CharacterData; // 更新后的角色数据
  leveledUp: boolean; // 是否升级
  levelUpCount: number; // 升级次数
  message?: string; // 提示消息
}

/**
 * 角色获得经验并处理升级
 * 参考幻兽升级逻辑，实现完整的角色升级机制
 *
 * 功能：
 * 1. 检查经验值是否足够升级
 * 2. 升级循环处理（可能连续升级）
 * 3. 升级后更新属性（HP、MP、攻击、防御等）
 * 4. 等级上限检查（最高132级）
 *
 * @param character 角色对象
 * @param expAmount 获得的经验值
 * @returns 更新后的角色数据和升级信息
 */
export function gainCharacterExperience(
  character: CharacterData,
  expAmount: number
): CharacterExperienceResult {
  // 1. 等级上限检查
  if (character.level >= 132) {
    return {
      character: { ...character, exp: 0 },
      leveledUp: false,
      levelUpCount: 0,
      message: '角色等级已满，无法再获得经验值了。'
    };
  }

  // 2. 增加经验值
  let newExp = character.exp + expAmount;
  let newLevel = character.level;
  let newMaxExp = character.maxExp;
  let levelUpCount = 0;
  let leveledUp = false;

  // 3. 升级循环处理
  while (newExp >= newMaxExp && newLevel < 132) {
    newExp -= newMaxExp;
    newLevel++;
    levelUpCount++;
    leveledUp = true;

    // 从预计算表中获取下一级所需经验
    newMaxExp = MAX_EXP_TABLE.get(newLevel) || newMaxExp;
  }

  // 4. 如果升级了，更新属性
  let updatedCharacter: CharacterData;
  if (newLevel !== character.level) {
    // 先更新等级和经验值
    const tempCharacter: CharacterData = {
      ...character,
      level: newLevel,
      exp: newExp,
      maxExp: newMaxExp,
    };

    // 重新计算总属性（基础 + 装备 + 幻兽）
    const totalAttrs = calculateTotalCharacterAttributes(tempCharacter);

    // 升级时增加幸运值（每次升级+1，上限100）
    const newLuck = increaseLuck(character.luck, levelUpCount);

    updatedCharacter = {
      ...tempCharacter,
      luck: newLuck,
      maxHp: totalAttrs.maxHp,
      maxStamina: totalAttrs.maxStamina,
      attackMin: totalAttrs.attackMin,
      attackMax: totalAttrs.attackMax,
      defense: totalAttrs.defense,
      dodgeRate: totalAttrs.dodgeRate,
      // 升级时根据新等级更新暴击率和暴击伤害率
      criticalRate: calculateCriticalStats(newLevel).criticalRate,
      criticalDamageRate: calculateCriticalStats(newLevel).criticalDamageRate,
      // 升级时恢复HP和MP到最大值
      currentHp: totalAttrs.maxHp,
      currentStamina: totalAttrs.maxStamina,
    };
  } else {
    // 没有升级，只更新经验值
    updatedCharacter = {
      ...character,
      exp: newExp,
      maxExp: newMaxExp,
    };
  }

  // 5. 生成提示消息
  let message: string | undefined;
  if (leveledUp) {
    if (levelUpCount === 1) {
      message = `🎉 恭喜升级！等级提升到 ${newLevel} 级！`;
    } else {
      message = `🎉 恭喜连升 ${levelUpCount} 级！等级提升到 ${newLevel} 级！`;
    }
  }

  return {
    character: updatedCharacter,
    leveledUp,
    levelUpCount,
    message,
  };
}
