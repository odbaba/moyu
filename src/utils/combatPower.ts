import { MILITARY_RANKS, NOBLE_RANKS } from '../data/rankData';
import type { CharacterData, EquipmentDetail, EquipmentQuality, Pet, SkillDetail } from '../types';
import { getQualityValue } from './attributeCalculator';
import { calculateGemCombatPower } from './equipmentConverter';

/**
 * 计算斗志昂扬战斗力加成比例
 * 根据斗志昂扬等级返回战斗力加成比例
 * @param skillLevel 斗志昂扬技能等级
 * @returns 战斗力加成比例（0-0.5）
 */
export function getFightingSpiritBonus(skillLevel: number): number {
  switch (skillLevel) {
    case 0:
      return 0; // 未学习
    case 1:
      return 0.05; // 5%
    case 2:
      return 0.1; // 10%
    case 3:
      return 0.2; // 20%
    case 4:
      return 0.35; // 35%
    case 5:
    default:
      return 0.5; // 50%（5级及以上）
  }
}

/**
 * 计算斗志昂扬战斗力加成
 * @param baseCombatPower 基础战斗力
 * @param skillLevel 斗志昂扬技能等级
 * @returns 斗志昂扬加成的战斗力
 */
export function calculateFightingSpiritCombatPower(baseCombatPower: number, skillLevel: number): number {
  const bonus = getFightingSpiritBonus(skillLevel);

  return Math.round(bonus * baseCombatPower);
}

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

// 计算爵位加成战斗力
// 根据爵位等级从 rankData.ts 获取战斗力加成
export function calculateTitleCombatPower(title: string): number {
  // 从爵位名称查找对应的配置
  const rank = NOBLE_RANKS.find(r => r.name === title);

  return rank ? rank.combatPowerBonus : 0;
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
 * 战魂套装信息接口
 */
export interface WarSoulSetInfo {
  isActive: boolean;
  setType: number;
  setLevel: number;
}

/**
 * 检查战魂套装状态
 * 检查所有6件装备是否都有战魂且战魂类型是否一致
 * @param equipment 角色装备对象
 * @returns 套装信息对象（是否激活、套装类型、套装等级）
 */
export function checkWarSoulSet(equipment: CharacterData['equipment']): WarSoulSetInfo {
  const slots: (keyof typeof equipment)[] = ['weapon', 'helmet', 'clothes', 'shoes', 'bracelet', 'necklace'];

  // 获取所有装备
  const equippedItems: EquipmentDetail[] = [];
  slots.forEach(slot => {
    const item = equipment[slot];
    if (item) {
      equippedItems.push(item);
    }
  });

  // 检查是否有6件装备
  if (equippedItems.length < 6) {
    return { isActive: false, setType: 0, setLevel: 0 };
  }

  // 检查所有装备是否都有战魂
  const allHaveSoul = equippedItems.every(item => item.soulType && item.soulType > 0 && item.soulLevel);
  if (!allHaveSoul) {
    return { isActive: false, setType: 0, setLevel: 0 };
  }

  // 检查战魂类型是否一致
  const soulTypes = equippedItems.map(item => item.soulType);
  const firstSoulType = soulTypes[0];
  const allSameType = soulTypes.every(type => type === firstSoulType);

  // 计算套装等级（取最低战魂等级）
  const soulLevels = equippedItems.map(item => item.soulLevel || 0);
  const setLevel = Math.min(...soulLevels);

  // 如果所有装备都有战魂，但类型不一致，返回 isActive: true, setType: 0（混合类型）
  // 这样可以触发战魂套装效果，但不触发天魂/地魂套装效果
  if (!allSameType) {
    return {
      isActive: true,
      setType: 0,
      setLevel
    };
  }

  return {
    isActive: true,
    setType: firstSoulType || 0,
    setLevel
  };
}

/**
 * 计算天魂套装对怪物的战斗力压制百分比
 * 天魂套装激活时：套装等级 × 2% 战斗力压制
 * 最大压制：10%
 * @param equipment 角色装备对象
 * @returns 怪物战斗力压制百分比（0~0.10）
 */
export function calculateTianHunSetSuppression(equipment: CharacterData['equipment']): number {
  // 获取战魂套装信息
  const setInfo = checkWarSoulSet(equipment);

  // 天魂套装未激活时，无压制效果
  if (!setInfo.isActive || setInfo.setType !== 1) {
    return 0;
  }

  // 天魂套装压制 = 套装等级 × 2%，最大10%
  return Math.min(setInfo.setLevel * 0.02, 0.10);
}

/**
 * 计算地魂套装对怪物的生命值压制百分比
 * 地魂套装激活时：套装等级 × 5% 生命值压制
 * 最大压制：25%
 * @param equipment 角色装备对象
 * @returns 怪物生命值压制百分比（0~0.25）
 */
export function calculateDiHunSetSuppression(equipment: CharacterData['equipment']): number {
  // 获取战魂套装信息
  const setInfo = checkWarSoulSet(equipment);

  // 地魂套装未激活时，无压制效果
  if (!setInfo.isActive || setInfo.setType !== 2) {
    return 0;
  }

  // 地魂套装压制 = 套装等级 × 5%，最大25%
  return Math.min(setInfo.setLevel * 0.05, 0.25);
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
    if (item && item.soulType && item.soulType > 0 && item.soulLevel) {
      // 每级战魂提供1点战斗力
      total += item.soulLevel;
    }
  });

  return total;
}

/**
 * 计算战魂套装战斗力百分比加成
 * 当6件装备都有战魂时，取最低战魂等级，每1级提升额外5%的战斗力
 * @param equipment 角色装备对象
 * @returns 战魂套装战斗力百分比加成（如0.05表示5%）
 */
export function calculateWarSoulSetCombatPowerPercent(equipment: CharacterData['equipment']): number {
  const slots: (keyof typeof equipment)[] = ['weapon', 'helmet', 'clothes', 'shoes', 'bracelet', 'necklace'];

  // 获取所有装备
  const equippedItems: EquipmentDetail[] = [];
  slots.forEach(slot => {
    const item = equipment[slot];
    if (item) {
      equippedItems.push(item);
    }
  });

  // 检查是否有6件装备
  if (equippedItems.length < 6) {
    return 0;
  }

  // 检查所有装备是否都有战魂
  const allHaveSoul = equippedItems.every(item => item.soulType && item.soulType > 0 && item.soulLevel);
  if (!allHaveSoul) {
    return 0;
  }

  // 取最低战魂等级
  const soulLevels = equippedItems.map(item => item.soulLevel || 0);
  const minSoulLevel = Math.min(...soulLevels);

  // 每1级提升额外5%的战斗力
  return minSoulLevel * 0.05;
}

/**
 * 计算战魂套装战斗力加成数值
 * 当6件装备都有战魂时，基于基础战斗力计算加成
 * @param equipment 角色装备对象
 * @param baseCombatPower 基础战斗力（不含战魂套装加成）
 * @returns 战魂套装战斗力加成数值
 */
export function calculateWarSoulSetCombatPowerBonus(equipment: CharacterData['equipment'], baseCombatPower: number): number {
  const percent = calculateWarSoulSetCombatPowerPercent(equipment);

  return Math.round(baseCombatPower * percent);
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
export function calculateTotalCombatPower(character: CharacterData, pets?: Pet[], skills?: SkillDetail[]): number {
  const levelPower = calculateLevelCombatPower(character.level);
  const equipmentBasePower = calculateEquipmentBaseCombatPower(character.equipment);
  const equipmentQualityPower = calculateAllEquipmentQualityCombatPower(character.equipment);
  const holeCountPower = calculateAllHoleCountCombatPower(character.equipment);
  const gemPower = calculateAllGemCombatPower(character.equipment);
  const militaryRankPower = calculateMilitaryRankCombatPower(character.militaryRankName);
  const titlePower = calculateTitleCombatPower(character.nobleRankName);
  const fullSetMagicSoulBonus = calculateFullSetMagicSoulBonusCombatPower(character.equipment);
  const soulPower = calculateSoulCombatPower(character.equipment);

  // 计算幻兽战斗力贡献
  const petsPower = pets ? calculateAllPetsCombatPower(pets) : 0;

  // 计算基础战斗力（不含斗志昂扬加成和战魂套装加成）
  const baseCombatPower = levelPower + equipmentBasePower + equipmentQualityPower + holeCountPower + gemPower + militaryRankPower + titlePower + fullSetMagicSoulBonus + soulPower + petsPower;

  // 计算战魂套装战斗力加成（基于基础战斗力）
  const warSoulSetBonus = calculateWarSoulSetCombatPowerBonus(character.equipment, baseCombatPower);

  // 计算包含战魂套装加成的基础战斗力
  const baseCombatPowerWithWarSoulSet = baseCombatPower + warSoulSetBonus;

  // 计算斗志昂扬加成（基于包含战魂套装加成的基础战斗力）
  let fightingSpiritPower = 0;
  if (skills) {
    const fightingSpiritSkill = skills.find(s => s.id === 'skill_fighting_spirit');
    if (fightingSpiritSkill && fightingSpiritSkill.isLearned) {
      fightingSpiritPower = calculateFightingSpiritCombatPower(baseCombatPowerWithWarSoulSet, fightingSpiritSkill.level);
    }
  }

  return baseCombatPowerWithWarSoulSet + fightingSpiritPower;
}
