import { getMilitaryRankByLevel, getNobleRankByLevel, MILITARY_RANKS, NOBLE_RANKS } from '../data/rankData';
import { WarSoulType } from '../types';
import type { CharacterData, EquipmentDetail, EquipmentQuality, Pet } from '../types';
import { getQualityValue } from './attributeCalculator';
import { calculateGemCombatPower } from './equipmentConverter';

/**
 * 计算单只幻兽的战斗力贡献
 * 幻兽战斗力 = Math.floor(评分 / 100)
 * @param pet 幻兽对象
 * @returns 幻兽战斗力贡献值
 */
export function calculatePetCombatPower(pet: Pet | null | undefined): number {
  // 幻兽不存在或未出战时，战斗力为0
  if (!pet || !pet.isDeployed) {
    return 0;
  }

  // 幻兽战斗力 = 评分 / 100 取整
  return Math.floor(pet.pz / 100);
}

/**
 * 计算所有出战幻兽的总战斗力贡献
 * @param pets 幻兽数组
 * @returns 所有出战幻兽的战斗力总和
 */
export function calculateAllPetsCombatPower(pets: Pet[]): number {
  return pets
    .filter(pet => pet.isDeployed)
    .reduce((total, pet) => total + calculatePetCombatPower(pet), 0);
}

/**
 * 计算幻兽合体属性加成
 * 只有出战且合体的幻兽才提供属性加成
 * @param pets 幻兽数组
 * @returns 属性加成对象 { attackMin, attackMax, defense }
 */
export function calculatePetMergeBonus(pets: Pet[]): { attackMin: number; attackMax: number; defense: number } {
  const bonus = { attackMin: 0, attackMax: 0, defense: 0 };

  pets.forEach(pet => {
    // 只有出战且合体的幻兽才提供属性加成
    if (pet.isDeployed && pet.isMerged) {
      bonus.attackMin += pet.xgj; // 最小攻击力加成
      bonus.attackMax += pet.dgj; // 最大攻击力加成
      bonus.defense += pet.fy; // 防御力加成
    }
  });

  return bonus;
}

// 计算军衔加成战斗力
// 根据军衔等级从 rankData.ts 获取战斗力加成
export function calculateMilitaryRankCombatPower(militaryRankName: string): number {
  // 从军衔名称查找对应的配置
  const rank = MILITARY_RANKS.find(r => r.name === militaryRankName);

  return rank ? rank.combatPowerBonus : 0;
}

// 计算军衔等级加成战斗力（通过等级直接计算）
export function calculateMilitaryRankCombatPowerByLevel(militaryRankLevel: number): number {
  const rank = getMilitaryRankByLevel(militaryRankLevel);

  return rank.combatPowerBonus;
}

// 计算爵位加成战斗力
// 根据爵位等级从 rankData.ts 获取战斗力加成
export function calculateTitleCombatPower(title: string): number {
  // 从爵位名称查找对应的配置
  const rank = NOBLE_RANKS.find(r => r.name === title);

  return rank ? rank.combatPowerBonus : 0;
}

// 计算爵位等级加成战斗力（通过等级直接计算）
export function calculateNobleRankCombatPowerByLevel(nobleRankLevel: number): number {
  const rank = getNobleRankByLevel(nobleRankLevel);

  return rank.combatPowerBonus;
}

// 计算人物等级贡献战斗力
export function calculateLevelCombatPower(level: number): number {
  return level;
}

// 计算装备基础贡献战斗力（装备数量×1）
export function calculateEquipmentBaseCombatPower(equipment: CharacterData['equipment']): number {
  let count = 0;
  if (equipment.weapon) count++;
  if (equipment.clothes) count++;
  if (equipment.shoes) count++;
  if (equipment.bracelet) count++;
  if (equipment.necklace) count++;
  if (equipment.helmet) count++;

  return count;
}

/**
 * 计算单个装备品质贡献战斗力
 * 品质战斗力 = pz（白品+0、良品+1、上品+2、精品+3、极品+4）
 * @param quality 装备品质
 * @returns 战斗力加成值
 */
export function calculateEquipmentQualityCombatPower(quality: EquipmentQuality): number {
  const pz = getQualityValue(quality);

  return pz;
}

// 计算所有装备品质总贡献战斗力
export function calculateAllEquipmentQualityCombatPower(equipment: CharacterData['equipment']): number {
  let total = 0;
  const slots = [equipment.weapon, equipment.clothes, equipment.shoes, equipment.bracelet, equipment.necklace, equipment.helmet];
  slots.forEach(item => {
    if (item) {
      total += calculateEquipmentQualityCombatPower(item.quality);
    }
  });

  return total;
}

/**
 * 计算单个装备洞数贡献战斗力
 * 洞数战斗力 = 洞数本身（不乘系数）
 * @param holeCount 洞数
 * @returns 战斗力加成值
 */
export function calculateHoleCountCombatPower(holeCount: number): number {
  return holeCount;
}

// 计算所有装备洞数总贡献战斗力
export function calculateAllHoleCountCombatPower(equipment: CharacterData['equipment']): number {
  let total = 0;
  const slots = [equipment.weapon, equipment.clothes, equipment.shoes, equipment.bracelet, equipment.necklace, equipment.helmet];
  slots.forEach(item => {
    if (item) {
      total += calculateHoleCountCombatPower(item.holeCount);
    }
  });

  return total;
}

/**
 * 计算全套魔魂等级额外加成战斗力
 * 根据原始代码 DefineSprite_561/frame_1/DoAction.as 的 getmhdj() 函数：
 * - 只有全套六件装备都有魔魂等级（>0）才有战斗力加成
 * - 加成值 = 最低魔魂等级
 * @param equipment 角色装备对象
 * @returns 战斗力加成值
 */
export function calculateFullSetMagicSoulBonusCombatPower(equipment: CharacterData['equipment']): number {
  const slots = [equipment.weapon, equipment.clothes, equipment.shoes, equipment.bracelet, equipment.necklace, equipment.helmet];

  // 检查是否所有装备槽位都有装备
  const equippedItems: EquipmentDetail[] = [];
  slots.forEach(item => {
    if (item) {
      equippedItems.push(item);
    }
  });

  if (equippedItems.length < 6) {
    return 0;
  }

  // 检查是否所有装备都有魔魂等级（>0）
  const magicSoulLevels = equippedItems.map(item => item.magicSoulLevel || 0);
  const allHaveMagicSoul = magicSoulLevels.every(level => level > 0);

  if (!allHaveMagicSoul) {
    return 0;
  }

  // 返回最低魔魂等级
  return Math.min(...magicSoulLevels);
}

/**
 * 计算所有装备宝石战斗力总和
 * @param equipment 角色装备对象
 * @returns 宝石战斗力总和
 */
export function calculateAllGemCombatPower(equipment: CharacterData['equipment']): number {
  let total = 0;
  const slots = [equipment.weapon, equipment.clothes, equipment.shoes, equipment.bracelet, equipment.necklace, equipment.helmet];
  slots.forEach(item => {
    if (item && item.gems) {
      total += calculateGemCombatPower(item.gems);
    }
  });

  return total;
}

/**
 * 计算战魂战斗力加成
 * 根据参考文档：战魂等级提供额外战斗力加成
 * @param equipment 角色装备对象
 * @returns 战魂战斗力加成
 */
export function calculateSoulCombatPower(equipment: CharacterData['equipment']): number {
  let total = 0;
  const slots: (keyof typeof equipment)[] = ['weapon', 'helmet', 'clothes', 'shoes', 'bracelet', 'necklace'];

  slots.forEach(slot => {
    const item = equipment[slot];
    if (item && item.soulType && item.soulType > WarSoulType.NONE && item.soulLevel) {
      // 每级战魂提供1点战斗力
      total += item.soulLevel;
    }
  });

  return total;
}

/**
 * 计算综合战斗力（包含幻兽战斗力加成）
 * 根据原始代码 DefineSprite_932/frame_1/DoAction.as 的 flashzdl() 函数：
 * zdl = jbzdl + jxzdl + jwzdl + hs1zdl + hs2zdl + zbpzzdl + mhdjzdl + dongzdl + bszdl + fixzdl + bestbszdl
 * - jbzdl: 等级战斗力
 * - jxzdl: 军衔战斗力
 * - jwzdl: 爵位战斗力
 * - hs1zdl, hs2zdl: 幻兽战斗力
 * - zbpzzdl: 品质战斗力总和
 * - mhdjzdl: 最低魔魂等级（全套六件装备都有魔魂等级才有）
 * - dongzdl: 洞数总和
 * - bszdl: 宝石战斗力总和
 * - fixzdl: 装备等级匹配数量
 * - bestbszdl: 高级宝石数量
 * @param character 角色数据
 * @param pets 幻兽数组
 * @returns 总战斗力
 */
export function calculateTotalCombatPower(character: CharacterData, pets?: Pet[]): number {
  const levelPower = calculateLevelCombatPower(character.level);
  const equipmentBasePower = calculateEquipmentBaseCombatPower(character.equipment);
  const equipmentQualityPower = calculateAllEquipmentQualityCombatPower(character.equipment);
  const holeCountPower = calculateAllHoleCountCombatPower(character.equipment);
  const gemPower = calculateAllGemCombatPower(character.equipment);
  const militaryRankPower = calculateMilitaryRankCombatPower(character.militaryRankName);
  const titlePower = calculateTitleCombatPower(character.title);
  const fullSetMagicSoulBonus = calculateFullSetMagicSoulBonusCombatPower(character.equipment);
  const soulPower = calculateSoulCombatPower(character.equipment);

  // 计算幻兽战斗力贡献
  const petsPower = pets ? calculateAllPetsCombatPower(pets) : 0;

  return levelPower + equipmentBasePower + equipmentQualityPower + holeCountPower + gemPower + militaryRankPower + titlePower + fullSetMagicSoulBonus + soulPower + petsPower;
}

/**
 * 战魂套装信息接口
 * 定义战魂套装的激活状态和属性
 */
export interface WarSoulSetInfo {
  isActivated: boolean; // 是否激活套装效果
  setType: WarSoulType; // 套装类型（TIAN_HUN或DI_HUN）
  setLevel: number; // 套装等级（所有装备战魂等级最小值）
}

/**
 * 检查战魂套装是否激活
 * 根据参考文档：所有6件装备都拥有战魂属性且类型一致时激活套装效果
 * - 天魂套装：所有装备soulType=1，攻击力加成
 * - 地魂套装：所有装备soulType=2，闪避率加成
 * - 混合套装：无套装效果
 * @param equipment 角色装备对象
 * @returns 战魂套装信息
 */
export function checkWarSoulSet(equipment: CharacterData['equipment']): WarSoulSetInfo {
  // 默认返回：未激活
  const defaultResult: WarSoulSetInfo = {
    isActivated: false,
    setType: WarSoulType.NONE,
    setLevel: 0
  };

  // 获取所有6个装备槽位的装备
  const slots: (keyof typeof equipment)[] = ['weapon', 'helmet', 'clothes', 'shoes', 'bracelet', 'necklace'];
  const equippedItems: EquipmentDetail[] = [];

  for (const slot of slots) {
    const item = equipment[slot];
    if (!item) {
      // 有槽位没有装备，无法激活套装
      return defaultResult;
    }
    equippedItems.push(item);
  }

  // 检查是否所有装备都有战魂
  const allHaveSoul = equippedItems.every(item => item.soulType && item.soulType > WarSoulType.NONE);
  if (!allHaveSoul) {
    return defaultResult;
  }

  // 检查是否所有装备战魂类型一致
  const firstSoulType = equippedItems[0].soulType;
  const allSameType = equippedItems.every(item => item.soulType === firstSoulType);
  if (!allSameType) {
    // 混合战魂，无套装效果
    return defaultResult;
  }

  // 计算套装等级（所有装备战魂等级最小值）
  const setLevel = Math.min(...equippedItems.map(item => item.soulLevel || 1));

  return {
    isActivated: true,
    setType: firstSoulType as WarSoulType,
    setLevel
  };
}

/**
 * 计算天魂套装攻击加成
 * 根据参考文档：每件天魂装备提供 zhdj × 5% 的攻击力加成
 * 最大加成：6件 × 5级 × 5% = 150%
 * @param equipment 角色装备对象
 * @returns 攻击力百分比加成（如0.25表示25%）
 */
export function calculateTianHunSetBonus(equipment: CharacterData['equipment']): number {
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
 * 计算地魂套装闪避加成
 * 根据参考文档：每件地魂装备提供 zhdj × 2% 的闪避率加成
 * 最大加成：6件 × 5级 × 2% = 60%
 * @param equipment 角色装备对象
 * @returns 闪避率百分比加成
 */
export function calculateDiHunSetBonus(equipment: CharacterData['equipment']): number {
  let bonus = 0;
  const slots: (keyof typeof equipment)[] = ['weapon', 'helmet', 'clothes', 'shoes', 'bracelet', 'necklace'];

  slots.forEach(slot => {
    const item = equipment[slot];
    // 地魂战魂提供闪避率加成
    if (item && item.soulType === WarSoulType.DI_HUN && item.soulLevel) {
      bonus += item.soulLevel * 2; // 每级地魂提供2%闪避加成
    }
  });

  return bonus;
}

/**
 * 计算PK赛战魂套装战斗力加成
 * 根据参考文档：套装等级 × 5%
 * @param equipment 角色装备对象
 * @returns PK赛战斗力百分比加成（如0.25表示25%）
 */
export function calculateWarSoulPKCombatPower(equipment: CharacterData['equipment']): number {
  const setInfo = checkWarSoulSet(equipment);

  if (!setInfo.isActivated) {
    return 0;
  }

  // 套装等级 × 5%
  return setInfo.setLevel * 0.05;
}
