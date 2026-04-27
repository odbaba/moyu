/**
 * 装备精炼核心逻辑模块
 * 实现装备品质提升、魔魂提升、使用等级提升、开洞、镶嵌宝石、战魂激活等功能
 * 参考文档：reference/docs/装备打造师交互逻辑文档.md
 */

import { calculateEquipmentBaseAttributes, getEquipmentName } from '../data/equipmentNames';
import { getEquipmentImagePath } from '../data/equipmentImages';
import type { EquipmentItem, EquipmentQuality, GemItem, RefineResult } from '../types';
import { WarSoulType } from '../types';

/**
 * 装备类型名称列表
 * 用于判断物品是否为装备
 */
const EQUIPMENT_TYPES = ['武器', '头盔', '手镯', '项链', '衣服', '战鞋'];

/**
 * 宝石名称列表
 * 用于判断物品是否为宝石
 */
const GEM_NAMES = [
  '高级经验石', '高级战斗力石', '幻魔晶石', '幻魔之心',
  '灵魂晶石', '灵魂王', '魔魂晶石', '魔魂之心',
  '月光宝盒', '月光宝盒增强版', '中级经验石', '中级战斗力石',
  '战魂晶石', '战魂之心'
];

/**
 * 品质等级映射表
 * 将品质名称转换为数字等级
 */
const QUALITY_LEVELS: Record<EquipmentQuality, number> = {
  '普通品': 0,
  '良品': 1,
  '上品': 2,
  '精品': 3,
  '极品': 4
};

/**
 * 品质名称映射表
 * 将数字等级转换为品质名称
 */
const QUALITY_NAMES: Record<number, EquipmentQuality> = {
  0: '普通品',
  1: '良品',
  2: '上品',
  3: '精品',
  4: '极品'
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
 * 物品识别函数
 * 判断物品是装备、宝石还是其他类型
 * @param item - 待识别的物品
 * @returns 0: 不是装备或宝石, 1: 是装备, 2: 是宝石
 */
export function isWeaponOrStone(item: unknown): 0 | 1 | 2 {
  // 类型守卫：检查 item 是否为对象且包含 name 属性
  if (!item || typeof item !== 'object' || !('name' in item)) {
    return 0;
  }

  const itemObj = item as { name?: string; type?: string };

  // 检查是否为装备类型
  if (EQUIPMENT_TYPES.includes(itemObj.name || '') || itemObj.type === 'equipment') {
    return 1;
  }

  // 检查是否为宝石类型
  if (GEM_NAMES.includes(itemObj.name || '') || itemObj.type === 'gem') {
    return 2;
  }

  return 0;
}

/**
 * 更新装备名称和基础属性
 * 当装备使用等级提升后，更新装备名称、基础属性和图片路径
 * @param equipment - 待更新的装备
 * @param newLevel - 新的使用等级
 */
function updateEquipmentNameAndAttributes(equipment: EquipmentItem, newLevel: number): void {
  // 更新装备名称
  const newName = getEquipmentName(equipment.equipmentType, newLevel);
  equipment.name = newName;

  // 更新装备图片路径
  equipment.imagePath = getEquipmentImagePath(equipment.equipmentType, newLevel);

  // 计算新的基础属性
  const baseAttributes = calculateEquipmentBaseAttributes(equipment.equipmentType, newLevel);

  // 更新基础属性
  if (baseAttributes.attackMin !== undefined) {
    equipment.attackMin = baseAttributes.attackMin;
  }
  if (baseAttributes.attackMax !== undefined) {
    equipment.attackMax = baseAttributes.attackMax;
  }
  if (baseAttributes.defense !== undefined) {
    equipment.defense = baseAttributes.defense;
  }

  // 重新计算追加属性（魔魂追加）
  const magicSoulLevel = equipment.magicSoulLevel || 0;
  if (magicSoulLevel > 0) {
    if (baseAttributes.attackMin !== undefined) {
      equipment.bonusAttackMin = Math.floor(baseAttributes.attackMin / 10) * magicSoulLevel;
    }
    if (baseAttributes.attackMax !== undefined) {
      equipment.bonusAttackMax = Math.floor(baseAttributes.attackMax / 10) * magicSoulLevel;
    }
    if (baseAttributes.defense !== undefined) {
      equipment.bonusDefense = Math.floor(baseAttributes.defense / 10) * magicSoulLevel;
    }
  }
}

/**
 * 品质提升函数
 * 使用灵魂晶石或灵魂王提升装备品质
 * @param equipment - 待提升的装备
 * @param gem - 使用的宝石（灵魂晶石或灵魂王）
 * @returns 精炼结果
 */
export function refineQuality(equipment: EquipmentItem, gem: GemItem, warSoulSystemEnabled?: boolean): RefineResult {
  // 验证装备是否有效
  if (!equipment || equipment.type !== 'equipment') {
    return {
      success: false,
      message: '请放入正确的装备',
      updatedEquipment: equipment ? { ...equipment } : undefined,
      usedGem: gem ? { ...gem } : undefined
    };
  }

  // 验证宝石类型
  if (!gem || (gem.name !== '灵魂晶石' && gem.name !== '灵魂王')) {
    return {
      success: false,
      message: '请使用灵魂晶石或灵魂王',
      updatedEquipment: { ...equipment },
      usedGem: { ...gem }
    };
  }

  // 获取当前品质等级
  const currentQualityLevel = QUALITY_LEVELS[equipment.equipmentQuality];

  // 检查是否已达到最高品质
  if (currentQualityLevel >= 4) {
    return {
      success: false,
      message: '装备已达到最高品质（极品），无法继续提升',
      updatedEquipment: { ...equipment },
      usedGem: { ...gem }
    };
  }

  let success = false;
  let message = '';

  // 灵魂王：100%成功
  if (gem.name === '灵魂王') {
    success = true;
    message = '使用灵魂王精炼成功！';
  }
  // 灵魂晶石：根据当前品质决定成功率
  else if (gem.name === '灵魂晶石') {
    // 白品→良品：100%成功
    if (currentQualityLevel === 0) {
      success = true;
      message = '精炼成功！装备品质提升为良品';
    }
    // 良品→上品：50%成功
    else if (currentQualityLevel === 1) {
      success = Math.random() < 0.5;
      message = success ? '精炼成功！装备品质提升为上品' : '精炼失败，灵魂晶石已消耗';
    }
    // 上品→精品：25%成功
    else if (currentQualityLevel === 2) {
      success = Math.random() < 0.25;
      message = success ? '精炼成功！装备品质提升为精品' : '精炼失败，灵魂晶石已消耗';
    }
    // 精品→极品：25%成功
    else if (currentQualityLevel === 3) {
      success = Math.random() < 0.25;
      message = success ? '精炼成功！装备品质提升为极品！' : '精炼失败，灵魂晶石已消耗';
    }
  }

  // 如果成功，更新装备品质
  if (success) {
    const newQualityLevel = currentQualityLevel + 1;
    equipment.equipmentQuality = QUALITY_NAMES[newQualityLevel];

    // 升极品时战魂逻辑
    let soulLevelChange = 0;
    let soulActivated = false;

    if (newQualityLevel >= 4 && warSoulSystemEnabled) {
      if (equipment.soulType && equipment.soulType > WarSoulType.NONE) {
        // 已有战魂且等级<5，战魂等级+1
        const currentSoulLevel = equipment.soulLevel || 1;
        if (currentSoulLevel < 5) {
          equipment.soulLevel = currentSoulLevel + 1;
          soulLevelChange = 1;
          message += ' 装备品质提升到了极品使得装备能量提升，战魂等级提高一级。';
        }
      } else if (Math.random() < 0.025) {
        // 无战魂，2.5%概率激活战魂
        equipment.soulType = Math.random() < 0.5 ? WarSoulType.TIAN_HUN : WarSoulType.DI_HUN;
        equipment.soulLevel = 1;
        soulActivated = true;
        message += ' 装备在精练中爆发出强大的能量激活了装备战魂！';
      }
    }

    // 计算战斗力变化
    const oldCombatPower = QUALITY_COMBAT_POWER[QUALITY_NAMES[currentQualityLevel]];
    const newCombatPower = QUALITY_COMBAT_POWER[equipment.equipmentQuality];

    return {
      success: true,
      message,
      attributeChanges: {
        qualityLevel: newQualityLevel,
        combatPowerChange: newCombatPower - oldCombatPower,
        soulLevelChange,
        soulActivated: soulActivated ? 1 : 0
      },
      updatedEquipment: { ...equipment },
      usedGem: { ...gem }
    };
  }

  return {
    success: false,
    message,
    updatedEquipment: { ...equipment },
    usedGem: { ...gem }
  };
}

/**
 * 魔魂提升函数
 * 使用魔魂晶石或魔魂之心提升装备魔魂等级
 * @param equipment - 待提升的装备
 * @param gem - 使用的宝石（魔魂晶石或魔魂之心）
 * @returns 精炼结果
 */
export function refineMagicSoul(equipment: EquipmentItem, gem: GemItem, _warSoulSystemEnabled?: boolean): RefineResult {
  // 验证装备是否有效
  if (!equipment || equipment.type !== 'equipment') {
    return {
      success: false,
      message: '请放入正确的装备',
      updatedEquipment: equipment ? { ...equipment } : undefined,
      usedGem: gem ? { ...gem } : undefined
    };
  }

  // 验证宝石类型
  if (!gem || (gem.name !== '魔魂晶石' && gem.name !== '魔魂之心')) {
    return {
      success: false,
      message: '请使用魔魂晶石或魔魂之心',
      updatedEquipment: { ...equipment },
      usedGem: { ...gem }
    };
  }

  // 获取当前魔魂等级
  const currentLevel = equipment.magicSoulLevel || 0;

  // 魔魂之心：100%成功，但只能升级到+9
  if (gem.name === '魔魂之心') {
    // 检查是否已达到魔魂之心的上限（+9）
    if (currentLevel >= 9) {
      return {
        success: false,
        message: '魔魂之心只能将魔魂等级提升到+9，当前等级已达到或超过+9，请使用魔魂晶石继续精炼',
        updatedEquipment: { ...equipment },
        usedGem: { ...gem }
      };
    }

    equipment.magicSoulLevel = currentLevel + 1;

    return {
      success: true,
      message: `使用魔魂之心精炼成功！魔魂等级提升为+${currentLevel + 1}`,
      attributeChanges: {
        magicSoulLevel: currentLevel + 1,
        magicSoulChange: 1,
        soulLevelChange: 0
      },
      updatedEquipment: { ...equipment },
      usedGem: { ...gem }
    };
  }

  // 魔魂晶石：检查是否已达到最高等级（+12）
  if (currentLevel >= 12) {
    return {
      success: false,
      message: '魔魂等级已达到最高等级+12，无法继续精炼',
      updatedEquipment: { ...equipment },
      usedGem: { ...gem }
    };
  }

  // 魔魂晶石：根据等级决定成功率
  let success = false;
  let successRate = 0;

  // +0~+5：90%成功率
  if (currentLevel < 6) {
    successRate = 0.9;
    success = Math.random() < successRate;
  }
  // +6~+8：50%成功率
  else if (currentLevel < 9) {
    successRate = 0.5;
    success = Math.random() < successRate;
  }
  // +9及以上：50%成功率
  else {
    successRate = 0.5;
    success = Math.random() < successRate;
  }

  if (success) {
    equipment.magicSoulLevel = currentLevel + 1;

    return {
      success: true,
      message: `精炼成功！魔魂等级提升为+${currentLevel + 1}`,
      attributeChanges: {
        magicSoulLevel: currentLevel + 1,
        magicSoulChange: 1,
        soulLevelChange: 0
      },
      updatedEquipment: { ...equipment },
      usedGem: { ...gem }
    };
  } else {
    // 失败处理：
    // 如果当前等级等于9，失败不降级
    // 如果当前等级超过9，失败降1级
    // 如果当前等级小于9，失败降1级
    let newLevel: number;
    let message: string;

    if (currentLevel === 9) {
      // 等级等于9时，失败不降级
      newLevel = currentLevel;
      message = `精炼失败，魔魂等级保持+${newLevel}`;
    } else {
      // 其他情况，降1级
      newLevel = Math.max(0, currentLevel - 1);
      equipment.magicSoulLevel = newLevel;
      message = `精炼失败，魔魂等级降为+${newLevel}`;
    }

    return {
      success: false,
      message,
      attributeChanges: {
        magicSoulLevel: newLevel,
        magicSoulChange: newLevel - currentLevel
      },
      updatedEquipment: { ...equipment },
      usedGem: { ...gem }
    };
  }
}

/**
 * 使用等级提升函数
 * 使用幻魔晶石或幻魔之心提升装备使用等级
 * @param equipment - 待提升的装备
 * @param gem - 使用的宝石（幻魔晶石或幻魔之心）
 * @param playerLevel - 玩家当前等级
 * @returns 精炼结果
 */
export function refineUseLevel(
  equipment: EquipmentItem,
  gem: GemItem,
  playerLevel: number
): RefineResult {
  // 验证装备是否有效
  if (!equipment || equipment.type !== 'equipment') {
    return {
      success: false,
      message: '请放入正确的装备',
      updatedEquipment: equipment ? { ...equipment } : undefined,
      usedGem: gem ? { ...gem } : undefined
    };
  }

  // 验证宝石类型
  if (!gem || (gem.name !== '幻魔晶石' && gem.name !== '幻魔之心')) {
    return {
      success: false,
      message: '请使用幻魔晶石或幻魔之心',
      updatedEquipment: { ...equipment },
      usedGem: { ...gem }
    };
  }

  // 获取当前使用等级
  const currentLevel = equipment.useLevel || 1;

  // 检查是否已达到最高等级
  if (currentLevel >= 125) {
    return {
      success: false,
      message: '装备使用等级已达到最高等级（125级），无法继续提升',
      updatedEquipment: { ...equipment },
      usedGem: { ...gem }
    };
  }

  // 计算升级后的等级
  const newLevel = calculateNewLevel(currentLevel);

  // 检查升级后等级是否超过玩家等级
  if (newLevel > playerLevel) {
    return {
      success: false,
      message: `升级后等级（${newLevel}级）将超过您的当前等级（${playerLevel}级），无法升级`,
      updatedEquipment: { ...equipment },
      usedGem: { ...gem }
    };
  }

  // 幻魔之心：100%成功
  if (gem.name === '幻魔之心') {
    equipment.useLevel = newLevel;

    // 更新装备名称和基础属性
    updateEquipmentNameAndAttributes(equipment, newLevel);

    return {
      success: true,
      message: `使用幻魔之心精炼成功！装备使用等级提升为${newLevel}级，装备名称更新为【${equipment.name}】`,
      attributeChanges: {
        useLevel: newLevel,
        useLevelChange: newLevel - currentLevel
      },
      updatedEquipment: { ...equipment },
      usedGem: { ...gem }
    };
  }

  // 幻魔晶石：根据等级决定成功率
  let successRate = 0;

  // 1级→10级：50%成功率
  if (currentLevel < 10) {
    successRate = 0.5;
  }
  // 10级~80级：30%成功率
  else if (currentLevel < 80) {
    successRate = 0.3;
  }
  // 80级~125级：20%成功率
  else {
    successRate = 0.2;
  }

  const success = Math.random() < successRate;

  if (success) {
    equipment.useLevel = newLevel;

    // 更新装备名称和基础属性
    updateEquipmentNameAndAttributes(equipment, newLevel);

    return {
      success: true,
      message: `精炼成功！装备使用等级提升为${newLevel}级，装备名称更新为【${equipment.name}】`,
      attributeChanges: {
        useLevel: newLevel,
        useLevelChange: newLevel - currentLevel
      },
      updatedEquipment: { ...equipment },
      usedGem: { ...gem }
    };
  } else {
    return {
      success: false,
      message: '精炼失败，幻魔晶石已消耗',
      updatedEquipment: { ...equipment },
      usedGem: { ...gem }
    };
  }
}

/**
 * 开洞函数
 * 使用月光宝盒或月光宝盒增强版给装备开洞
 * @param equipment - 待开洞的装备
 * @param gem - 使用的道具（月光宝盒或月光宝盒增强版）
 * @returns 精炼结果
 */
export function refineOpenHole(equipment: EquipmentItem, gem: GemItem, warSoulSystemEnabled?: boolean): RefineResult {
  // 验证装备是否有效
  if (!equipment || equipment.type !== 'equipment') {
    return {
      success: false,
      message: '请放入正确的装备',
      updatedEquipment: equipment ? { ...equipment } : undefined,
      usedGem: gem ? { ...gem } : undefined
    };
  }

  // 验证道具类型
  if (!gem || (gem.name !== '月光宝盒' && gem.name !== '月光宝盒增强版')) {
    return {
      success: false,
      message: '请使用月光宝盒或月光宝盒增强版',
      updatedEquipment: { ...equipment },
      usedGem: { ...gem }
    };
  }

  // 获取当前洞数
  const currentHoles = equipment.holeCount || 0;

  // 月光宝盒：给无洞装备开第一个洞
  if (gem.name === '月光宝盒') {
    if (currentHoles >= 1) {
      return {
        success: false,
        message: '该装备已有洞，请使用月光宝盒增强版开第二个洞',
        updatedEquipment: { ...equipment },
        usedGem: { ...gem }
      };
    }

    equipment.holeCount = 1;

    // 3%概率激活战魂
    const soulActivated = activateSoulInternal(equipment, 0.03, warSoulSystemEnabled);

    let message = '开洞成功！装备获得1个宝石洞';
    if (soulActivated) {
      message += '，并激活了战魂！';
    }

    return {
      success: true,
      message,
      attributeChanges: {
        holeCount: 1,
        soulActivated: soulActivated ? 1 : 0
      },
      updatedEquipment: { ...equipment },
      usedGem: { ...gem }
    };
  }

  // 月光宝盒增强版：给一洞装备开第二个洞
  if (gem.name === '月光宝盒增强版') {
    if (currentHoles === 0) {
      return {
        success: false,
        message: '该装备还没有洞，请先使用月光宝盒开第一个洞',
        updatedEquipment: { ...equipment },
        usedGem: { ...gem }
      };
    }

    if (currentHoles >= 2) {
      return {
        success: false,
        message: '装备已达到最大洞数（2个），无法继续开洞',
        updatedEquipment: { ...equipment },
        usedGem: { ...gem }
      };
    }

    equipment.holeCount = 2;

    // 10%概率激活战魂
    const soulActivated = activateSoulInternal(equipment, 0.1, warSoulSystemEnabled);

    let message = '开洞成功！装备获得第2个宝石洞';
    if (soulActivated) {
      message += '，并激活了战魂！';
    }

    return {
      success: true,
      message,
      attributeChanges: {
        holeCount: 2,
        soulActivated: soulActivated ? 1 : 0
      },
      updatedEquipment: { ...equipment },
      usedGem: { ...gem }
    };
  }

  return {
    success: false,
    message: '开洞失败',
    updatedEquipment: { ...equipment },
    usedGem: { ...gem }
  };
}

/**
 * 宝石镶嵌函数
 * 给有洞的装备镶嵌宝石
 * @param equipment - 待镶嵌的装备
 * @param gem - 待镶嵌的宝石
 * @returns 精炼结果
 */
export function embedGem(equipment: EquipmentItem, gem: GemItem): RefineResult {
  // 验证装备是否有效
  if (!equipment || equipment.type !== 'equipment') {
    return {
      success: false,
      message: '请放入正确的装备',
      updatedEquipment: equipment ? { ...equipment } : undefined,
      usedGem: gem ? { ...gem } : undefined
    };
  }

  // 验证宝石类型（只能镶嵌战斗力石或经验石）
  if (!gem || !['中级战斗力石', '高级战斗力石', '中级经验石', '高级经验石'].includes(gem.name)) {
    return {
      success: false,
      message: '请使用战斗力石或经验石进行镶嵌',
      updatedEquipment: { ...equipment },
      usedGem: { ...gem }
    };
  }

  // 检查装备是否有洞
  const holeCount = equipment.holeCount || 0;
  if (holeCount === 0) {
    return {
      success: false,
      message: '装备没有宝石洞，无法镶嵌宝石',
      updatedEquipment: { ...equipment },
      usedGem: { ...gem }
    };
  }

  // 检查是否还有空洞
  const embeddedGems = equipment.gems || [];
  if (embeddedGems.length >= holeCount) {
    return {
      success: false,
      message: '装备的所有宝石洞都已镶嵌，无法继续镶嵌',
      updatedEquipment: { ...equipment },
      usedGem: { ...gem }
    };
  }

  // 镶嵌宝石
  if (!equipment.gems) {
    equipment.gems = [];
  }
  equipment.gems.push(gem.name);

  // 计算宝石效果
  let combatPowerBonus = 0;
  let expBonus = 0;
  let soulLevelUp = false;

  // 战斗力石
  if (gem.name === '中级战斗力石') {
    combatPowerBonus = 3;
  } else if (gem.name === '高级战斗力石') {
    combatPowerBonus = 5;
    // 高级宝石：如果装备有战魂且战魂等级<5，战魂等级+1
    if (equipment.soulType && equipment.soulType > WarSoulType.NONE) {
      const currentSoulLevel = equipment.soulLevel || 1;
      if (currentSoulLevel < 5) {
        equipment.soulLevel = currentSoulLevel + 1;
        soulLevelUp = true;
      }
    }
  }
  // 经验石
  else if (gem.name === '中级经验石') {
    expBonus = 25;
  } else if (gem.name === '高级经验石') {
    expBonus = 50;
    // 高级宝石：如果装备有战魂且战魂等级<5，战魂等级+1
    if (equipment.soulType && equipment.soulType > WarSoulType.NONE) {
      const currentSoulLevel = equipment.soulLevel || 1;
      if (currentSoulLevel < 5) {
        equipment.soulLevel = currentSoulLevel + 1;
        soulLevelUp = true;
      }
    }
  }

  let message = `成功镶嵌${gem.name}！`;
  if (soulLevelUp) {
    message += ' 高级宝石的镶入使得装备能量提升，战魂等级提高一级。';
  }

  return {
    success: true,
    message,
    attributeChanges: {
      embeddedGem: gem.name,
      combatPowerBonus,
      expBonus,
      soulLevelChange: soulLevelUp ? 1 : 0
    },
    updatedEquipment: { ...equipment },
    usedGem: { ...gem }
  };
}

/**
 * 战魂激活函数
 * 使用战魂晶石或战魂之心激活或改变装备战魂
 * @param equipment - 待激活战魂的装备
 * @param gem - 使用的宝石（战魂晶石或战魂之心）
 * @returns 精炼结果
 */
export function activateSoul(equipment: EquipmentItem, gem: GemItem, warSoulSystemEnabled?: boolean): RefineResult {
  // 验证装备是否有效
  if (!equipment || equipment.type !== 'equipment') {
    return {
      success: false,
      message: '请放入正确的装备',
      updatedEquipment: equipment ? { ...equipment } : undefined,
      usedGem: gem ? { ...gem } : undefined
    };
  }

  // 验证宝石类型
  if (!gem || (gem.name !== '战魂晶石' && gem.name !== '战魂之心')) {
    return {
      success: false,
      message: '请使用战魂晶石或战魂之心',
      updatedEquipment: { ...equipment },
      usedGem: { ...gem }
    };
  }

  // 检查战魂系统是否已开启
  if (!warSoulSystemEnabled) {
    return {
      success: false,
      message: '战魂系统尚未开启，请先击败无名氏开启战魂系统',
      updatedEquipment: { ...equipment },
      usedGem: { ...gem }
    };
  }

  // 战魂之心：100%激活或改变战魂类型
  if (gem.name === '战魂之心') {
    const hadSoul = equipment.soulType && equipment.soulType > WarSoulType.NONE;

    // 战魂类型切换：天魂变地魂，地魂变天魂
    if (hadSoul) {
      equipment.soulType = equipment.soulType === WarSoulType.TIAN_HUN ? WarSoulType.DI_HUN : WarSoulType.TIAN_HUN;
    } else {
      // 无战魂时随机激活天魂或地魂
      equipment.soulType = Math.random() < 0.5 ? WarSoulType.TIAN_HUN : WarSoulType.DI_HUN;
    }
    equipment.soulLevel = 1;

    const soulTypeName = equipment.soulType === WarSoulType.TIAN_HUN ? '天魂' : '地魂';
    const message = hadSoul
      ? `战魂之心激活成功！装备战魂类型改变为${soulTypeName}`
      : `战魂之心激活成功！装备激活了${soulTypeName}`;

    return {
      success: true,
      message,
      attributeChanges: {
        soulType: equipment.soulType,
        soulLevel: 1
      },
      updatedEquipment: { ...equipment },
      usedGem: { ...gem }
    };
  }

  // 战魂晶石：20%概率激活或改变战魂类型
  if (gem.name === '战魂晶石') {
    const success = Math.random() < 0.2;

    if (success) {
      const hadSoul = equipment.soulType && equipment.soulType > WarSoulType.NONE;

      // 随机战魂类型：天魂或地魂
      equipment.soulType = Math.random() < 0.5 ? WarSoulType.TIAN_HUN : WarSoulType.DI_HUN;
      equipment.soulLevel = 1;

      const soulTypeName = equipment.soulType === WarSoulType.TIAN_HUN ? '天魂' : '地魂';
      const message = hadSoul
        ? `战魂晶石激活成功！装备战魂类型改变为${soulTypeName}`
        : `战魂晶石激活成功！装备激活了${soulTypeName}`;

      return {
        success: true,
        message,
        attributeChanges: {
          soulType: equipment.soulType,
          soulLevel: 1
        },
        updatedEquipment: { ...equipment },
        usedGem: { ...gem }
      };
    } else {
      return {
        success: false,
        message: '战魂晶石激活失败，请再接再厉',
        updatedEquipment: { ...equipment },
        usedGem: { ...gem }
      };
    }
  }

  return {
    success: false,
    message: '战魂激活失败',
    updatedEquipment: { ...equipment },
    usedGem: { ...gem }
  };
}

/**
 * 激活战魂（内部函数）
 * 在开洞或升极品时有一定概率激活战魂
 * @param equipment - 装备对象
 * @param probability - 激活概率（0-1）
 * @returns 是否成功激活战魂
 */
function activateSoulInternal(equipment: EquipmentItem, probability: number, warSoulSystemEnabled?: boolean): boolean {
  // 战魂系统未开启时不触发战魂激活
  if (!warSoulSystemEnabled) {
    return false;
  }

  // 随机判断是否激活战魂
  if (Math.random() >= probability) {
    return false;
  }

  // 随机战魂类型：天魂或地魂
  equipment.soulType = Math.random() < 0.5 ? WarSoulType.TIAN_HUN : WarSoulType.DI_HUN;
  equipment.soulLevel = 1;

  return true;
}

/**
 * 摘除宝石函数
 * 从装备上摘除指定位置的宝石
 * 根据参考文档：摘除宝石时，如果装备有战魂且战魂等级>1，战魂等级降为1
 * @param equipment - 装备对象
 * @param gemIndex - 要摘除的宝石索引（0或1）
 * @returns 精炼结果
 */
export function removeGem(equipment: EquipmentItem, gemIndex: number): RefineResult {
  // 验证装备是否有效
  if (!equipment || equipment.type !== 'equipment') {
    return {
      success: false,
      message: '请放入正确的装备'
    };
  }

  // 检查装备是否有宝石洞
  const holeCount = equipment.holeCount || 0;
  if (holeCount === 0) {
    return {
      success: false,
      message: '装备没有宝石洞，无法摘除宝石'
    };
  }

  // 检查是否有已镶嵌的宝石
  const embeddedGems = equipment.gems || [];
  if (embeddedGems.length === 0) {
    return {
      success: false,
      message: '装备没有镶嵌宝石，无法摘除'
    };
  }

  // 检查宝石索引是否有效
  if (gemIndex < 0 || gemIndex >= embeddedGems.length) {
    return {
      success: false,
      message: '无效的宝石索引'
    };
  }

  // 记录摘除的宝石名称
  const removedGemName = embeddedGems[gemIndex];

  // 从装备上移除宝石
  equipment.gems = embeddedGems.filter((_, index) => index !== gemIndex);

  // 检查是否需要降低战魂等级
  let soulLevelChanged = false;
  if (equipment.soulType && equipment.soulType > WarSoulType.NONE) {
    const currentSoulLevel = equipment.soulLevel || 1;
    if (currentSoulLevel > 1) {
      equipment.soulLevel = 1;
      soulLevelChanged = true;
    }
  }

  // 构建结果消息
  let message = `成功摘除${removedGemName}！`;
  if (soulLevelChanged) {
    message += ' 摘除宝石操作使战魂的等级下降为1级';
  }

  return {
    success: true,
    message,
    attributeChanges: {
      removedGem: removedGemName,
      soulLevelChange: soulLevelChanged ? -(equipment.soulLevel || 1) + 1 : 0
    }
  };
}

/**
 * 计算等级提升后的新等级
 * @param currentLevel - 当前等级
 * @returns 提升后的新等级
 */
function calculateNewLevel(currentLevel: number): number {
  // 1级 → 10级
  if (currentLevel === 1) {
    return 10;
  }
  // 10级~90级 → +10级
  else if (currentLevel < 100) {
    return currentLevel + 10;
  }
  // 100级 → 125级
  else if (currentLevel < 125) {
    return 125;
  }

  return currentLevel;
}

/**
 * 品质名称转换
 * 将品质等级转换为品质名称
 * @param quality - 品质等级（0-4）
 * @returns 品质名称
 */
export function getQualityName(quality: number): EquipmentQuality {
  return QUALITY_NAMES[quality] || '普通品';
}

/**
 * 获取品质战斗力加成
 * @param quality - 品质名称
 * @returns 战斗力加成值
 */
export function getQualityCombatPower(quality: EquipmentQuality): number {
  return QUALITY_COMBAT_POWER[quality] || 0;
}

/**
 * 获取战魂类型名称
 * @param soulType - 战魂类型（WarSoulType枚举）
 * @returns 战魂类型名称
 */
export function getSoulTypeName(soulType: WarSoulType | undefined): string {
  if (soulType === WarSoulType.TIAN_HUN) return '天魂';
  if (soulType === WarSoulType.DI_HUN) return '地魂';

  return '无';
}

/**
 * 检查装备是否可以精炼
 * @param equipment - 装备对象
 * @param gem - 宝石对象
 * @returns 是否可以精炼及原因
 */
export function canRefine(
  equipment: EquipmentItem,
  gem: GemItem
): { canRefine: boolean; reason: string } {
  // 检查装备是否有效
  if (!equipment || equipment.type !== 'equipment') {
    return {
      canRefine: false,
      reason: '请放入正确的装备'
    };
  }

  // 检查宝石是否有效
  if (!gem || gem.type !== 'gem') {
    return {
      canRefine: false,
      reason: '请放入正确的宝石'
    };
  }

  // 根据宝石类型检查对应的精炼条件
  const gemName = gem.name;

  // 品质提升
  if (gemName === '灵魂晶石' || gemName === '灵魂王') {
    const qualityLevel = QUALITY_LEVELS[equipment.equipmentQuality];
    if (qualityLevel >= 4) {
      return {
        canRefine: false,
        reason: '装备已达到最高品质（极品）'
      };
    }
  }

  // 魔魂提升
  // 魔魂之心只能升级到+9，魔魂晶石最高可以升级到+12
  if (gemName === '魔魂之心') {
    if (equipment.magicSoulLevel >= 9) {
      return {
        canRefine: false,
        reason: '魔魂之心只能将魔魂等级提升到+9，当前等级已达到或超过+9'
      };
    }
  } else if (gemName === '魔魂晶石') {
    if (equipment.magicSoulLevel >= 12) {
      return {
        canRefine: false,
        reason: '魔魂等级已达到最高等级+12'
      };
    }
  }

  // 使用等级提升
  if (gemName === '幻魔晶石' || gemName === '幻魔之心') {
    if (equipment.useLevel >= 125) {
      return {
        canRefine: false,
        reason: '装备使用等级已达到最高等级（125级）'
      };
    }
  }

  // 开洞
  if (gemName === '月光宝盒') {
    if (equipment.holeCount >= 1) {
      return {
        canRefine: false,
        reason: '装备已有洞，请使用月光宝盒增强版'
      };
    }
  }

  if (gemName === '月光宝盒增强版') {
    if (equipment.holeCount === 0) {
      return {
        canRefine: false,
        reason: '装备还没有洞，请先使用月光宝盒'
      };
    }
    if (equipment.holeCount >= 2) {
      return {
        canRefine: false,
        reason: '装备已达到最大洞数（2个）'
      };
    }
  }

  // 镶嵌宝石
  if (['中级战斗力石', '高级战斗力石', '中级经验石', '高级经验石'].includes(gemName)) {
    if (equipment.holeCount === 0) {
      return {
        canRefine: false,
        reason: '装备没有宝石洞，无法镶嵌'
      };
    }
    const embeddedGems = equipment.gems || [];
    if (embeddedGems.length >= equipment.holeCount) {
      return {
        canRefine: false,
        reason: '装备的所有宝石洞都已镶嵌'
      };
    }
  }

  // 战魂激活
  if (gemName === '战魂晶石' || gemName === '战魂之心') {
    // 战魂物品的精炼条件由 activateSoul 函数内部检查
  }

  return {
    canRefine: true,
    reason: '可以精炼'
  };
}
