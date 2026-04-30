/**
 * 帮助信息工具函数
 * 用于生成各类游戏系统的帮助提示文本
 */

import type { CharacterData } from '../types';

/**
 * 计算装备使用等级提升后的下一级等级
 * 规则参考 equipmentRefine.ts 中的 calculateNewLevel：
 * - 1级 → 10级
 * - < 100级 → 当前等级+10
 * - < 125级 → 125级
 * - >= 125级 → 保持当前等级
 * @param currentLevel - 当前使用等级
 * @returns 升级后的等级
 */
function calculateNextUseLevel(currentLevel: number): number {
  if (currentLevel === 1) {
    return 10;
  } else if (currentLevel < 100) {
    return currentLevel + 10;
  } else if (currentLevel < 125) {
    return 125;
  }
  return currentLevel;
}

/**
 * 装备槽位列表
 * 用于遍历六件装备
 */
const EQUIPMENT_SLOTS: (keyof CharacterData['equipment'])[] = [
  'weapon', 'helmet', 'clothes', 'shoes', 'bracelet', 'necklace'
];

/**
 * 获取等级帮助文本
 * 等级 < 132时返回升级提示，>= 132时返回 null
 * @param level - 角色等级
 * @returns 帮助文本或 null
 */
export function getLevelHelpText(level: number): string | null {
  if (level < 132) {
    return '日常任务，幻兽研究所任务、战斗和使用满经验球都可快速升级，可以在经验导师处兑换经验球';
  }
  return null;
}

/**
 * 获取装备品质帮助文本
 * 检查六件装备是否都达到极品品质
 * @param equipment - 角色装备对象
 * @returns 帮助文本或 null
 */
export function getEquipmentQualityHelpText(equipment: CharacterData['equipment']): string | null {
  // 遍历所有装备槽位，检查是否有装备未达极品
  for (const slot of EQUIPMENT_SLOTS) {
    const item = equipment[slot];
    // 如果装备存在且品质不是极品，返回帮助文本
    if (item && item.quality !== '极品') {
      return '你有装备可以提升品质';
    }
  }
  // 所有装备都是极品或无装备，返回 null
  return null;
}

/**
 * 获取装备魔魂等级帮助文本
 * 检查六件装备的魔魂等级是否都达到12级
 * @param equipment - 角色装备对象
 * @returns 帮助文本或 null
 */
export function getEquipmentMagicSoulHelpText(equipment: CharacterData['equipment']): string | null {
  // 遍历所有装备槽位，检查是否有装备魔魂等级 < 12
  for (const slot of EQUIPMENT_SLOTS) {
    const item = equipment[slot];
    // 如果装备存在且魔魂等级 < 12，返回帮助文本
    if (item && item.magicSoulLevel < 12) {
      return '你有装备可以提升魔魂等级';
    }
  }
  // 所有装备魔魂等级都是12级或无装备，返回 null
  return null;
}

/**
 * 获取装备使用等级帮助文本
 * 检查六件装备提升使用等级后是否会超过角色等级
 * @param equipment - 角色装备对象
 * @param playerLevel - 角色等级
 * @returns 帮助文本或 null
 */
export function getEquipmentUseLevelHelpText(
  equipment: CharacterData['equipment'],
  playerLevel: number
): string | null {
  // 遍历所有装备槽位，检查是否有装备可以提升使用等级且不会超过角色等级
  for (const slot of EQUIPMENT_SLOTS) {
    const item = equipment[slot];
    if (!item) continue;
    // 已达到最高使用等级（125级），无法继续提升
    if (item.useLevel >= 125) continue;
    // 计算提升后的下一级使用等级
    const nextUseLevel = calculateNextUseLevel(item.useLevel);
    // 如果下一级使用等级不超过角色等级，说明可以提升
    if (nextUseLevel <= playerLevel) {
      return '你有装备可以提升使用等级';
    }
  }
  // 所有装备提升后都会超过角色等级，或已满级，返回 null
  return null;
}

/**
 * 获取装备战魂等级帮助文本
 * 检查六件装备的战魂等级是否都达到5级
 * @param equipment - 角色装备对象
 * @param warSoulSystemEnabled - 战魂系统是否开启
 * @returns 帮助文本或 null
 */
export function getEquipmentSoulLevelHelpText(
  equipment: CharacterData['equipment'],
  warSoulSystemEnabled: boolean
): string | null {
  // 如果战魂系统未开启，返回 null
  if (!warSoulSystemEnabled) {
    return null;
  }

  // 遍历所有装备槽位，检查是否有装备战魂等级 < 5
  for (const slot of EQUIPMENT_SLOTS) {
    const item = equipment[slot];
    // 如果装备存在且战魂等级 < 5，返回帮助文本
    if (item && (item.soulLevel === undefined || item.soulLevel < 5)) {
      return '你有装备可以提升战魂等级';
    }
  }
  // 所有装备战魂等级都是5级或无装备，返回 null
  return null;
}

/**
 * 获取装备战魂套装帮助文本
 * 检查六件装备的战魂类型是否一致
 * @param equipment - 角色装备对象
 * @param warSoulSystemEnabled - 战魂系统是否开启
 * @returns 帮助文本或 null
 */
export function getEquipmentSoulSetHelpText(
  equipment: CharacterData['equipment'],
  warSoulSystemEnabled: boolean
): string | null {
  // 如果战魂系统未开启，返回 null
  if (!warSoulSystemEnabled) {
    return null;
  }

  // 获取所有装备的战魂类型
  const soulTypes: number[] = [];
  for (const slot of EQUIPMENT_SLOTS) {
    const item = equipment[slot];
    // 如果装备存在且有战魂类型，记录战魂类型
    if (item && item.soulType !== undefined && item.soulType > 0) {
      soulTypes.push(item.soulType);
    }
  }

  // 如果没有装备有战魂，返回 null
  if (soulTypes.length === 0) {
    return null;
  }

  // 检查战魂类型是否一致
  const firstSoulType = soulTypes[0];
  const allSameType = soulTypes.every(type => type === firstSoulType);

  // 如果战魂类型不一致，返回帮助文本
  if (!allSameType) {
    return '你的装备可以集齐战魂套装';
  }

  // 战魂类型一致，返回 null
  return null;
}

/**
 * 获取幻兽帮助文本
 * 始终返回幻化提示
 * @returns 帮助文本
 */
export function getPetHelpText(): string {
  return '可以继续幻化幻兽';
}

/**
 * 获取军衔帮助文本
 * 军衔等级 < 11（元帅）时返回提升提示
 * @param militaryRankLevel - 军衔等级
 * @returns 帮助文本或 null
 */
export function getMilitaryRankHelpText(militaryRankLevel: number): string | null {
  if (militaryRankLevel < 11) {
    return '获得战功来提高军衔和战斗力';
  }
  return null;
}

/**
 * 获取爵位帮助文本
 * 爵位等级 < 6（王）时返回提升提示
 * @param nobleRankLevel - 爵位等级
 * @returns 帮助文本或 null
 */
export function getNobleRankHelpText(nobleRankLevel: number): string | null {
  if (nobleRankLevel < 6) {
    return '获得功勋来提高爵位和战斗力';
  }
  return null;
}

/**
 * 获取公主关系帮助文本
 * 关系等级 < 6（亲密恋人）时返回提升提示
 * @param relationshipLevel - 关系等级
 * @returns 帮助文本或 null
 */
export function getPrincessRelationHelpText(relationshipLevel: number): string | null {
  if (relationshipLevel < 6) {
    return '每周日给公主赠送礼物，每天和公主聊天，均可提升亲密度';
  }
  return null;
}

/**
 * 获取财富帮助文本
 * 始终返回抽奖提示
 * @returns 帮助文本
 */
export function getWealthHelpText(): string {
  return '抽奖可获取大量物品';
}
