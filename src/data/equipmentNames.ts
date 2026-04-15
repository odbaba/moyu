/**
 * 装备名称映射配置文件
 * 根据装备类型和使用等级确定装备名称
 * 参考文档：reference/docs/project_docs/07_全等级装备名称列表.md
 */

import type { EquipmentSlotType } from '../types';

/**
 * 装备等级列表
 * 装备等级只有特定的几个等级
 */
export const EQUIPMENT_LEVELS = [1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 125] as const;

/**
 * 武器名称映射表
 * 等级 -> 武器名称
 */
const WEAPON_NAMES: Record<number, string> = {
  1: '重剑',
  10: '精锻剑',
  20: '锻玉剑',
  30: '精灵咒剑',
  40: '寒月',
  50: '圣影剑',
  60: '绯红圣言',
  70: '冥河剑',
  80: '血咒剑',
  90: '燃烧巨剑',
  100: '月神之光',
  110: '魔吟神剑',
  125: '魔吟神剑', // 125级使用110级名称
};

/**
 * 头盔名称映射表
 * 等级 -> 头盔名称
 */
const HELMET_NAMES: Record<number, string> = {
  1: '九耀御雷',
  10: '蓝色深邃',
  20: '安刺轻钢',
  30: '冥虹镜芒',
  40: '龙翼圣痕',
  50: '斗战迷惘',
  60: '黄金宿印',
  70: '狂热暴君',
  80: '恐惧首级',
  90: '噩梦之首',
  100: '凌霄翼盔',
  110: '武神宝盔',
  125: '武神宝盔', // 125级使用110级名称
};

/**
 * 衣服名称映射表
 * 等级 -> 衣服名称
 */
const CLOTHES_NAMES: Record<number, string> = {
  1: '锁环甲',
  10: '轻钢甲',
  20: '卡兰胸甲',
  30: '骑士钢甲',
  40: '哥德战甲',
  50: '守护之铠',
  60: '精锐之铠',
  70: '镜芒铠',
  80: '虹冥铠',
  90: '圣痕之铠',
  100: '奇迹庇佑',
  110: '夜魔战甲',
  125: '夜魔战甲', // 125级使用110级名称
};

/**
 * 战鞋名称映射表
 * 等级 -> 战鞋名称
 */
const SHOES_NAMES: Record<number, string> = {
  1: '辉煌战靴',
  10: '神明战靴',
  20: '钢铁承诺',
  30: '寒光战靴',
  40: '野蛮行径',
  50: '破冰护胫',
  60: '火纹战靴',
  70: '光辉奇迹',
  80: '金色梦想',
  90: '护卫使命',
  100: '银澜月华',
  110: '龙神御风',
  125: '龙神御风', // 125级使用110级名称
};

/**
 * 手镯名称映射表
 * 等级 -> 手镯名称
 */
const BRACELET_NAMES: Record<number, string> = {
  1: '缠绕手镯',
  10: '鹰眼手镯',
  20: '虔敬手镯',
  30: '辉煌手镯',
  40: '飞煌手镯',
  50: '刹那光华',
  60: '精钢手镯',
  70: '庇护手镯',
  80: '烈焰永恒',
  90: '紫电风暴',
  100: '光明天兆',
  110: '武神手镯',
  125: '武神手镯', // 125级使用110级名称
};

/**
 * 项链名称映射表
 * 等级 -> 项链名称
 */
const NECKLACE_NAMES: Record<number, string> = {
  1: '撼雷战符',
  10: '水神战符',
  20: '真理战符',
  30: '寒冰战符',
  40: '火瞳战符',
  50: '封印战符',
  60: '白热战符',
  70: '赤心战符',
  80: '炙日战符',
  90: '黑月战符',
  100: '辉煌战符',
  110: '怒雷战符',
  125: '怒雷战符', // 125级使用110级名称
};

/**
 * 装备类型到名称映射表的映射
 */
const EQUIPMENT_NAME_MAPS: Record<EquipmentSlotType, Record<number, string>> = {
  weapon: WEAPON_NAMES,
  helmet: HELMET_NAMES,
  clothes: CLOTHES_NAMES,
  shoes: SHOES_NAMES,
  bracelet: BRACELET_NAMES,
  necklace: NECKLACE_NAMES,
};

/**
 * 获取装备名称
 * 根据装备类型和使用等级获取对应的装备名称
 * @param equipmentType - 装备类型
 * @param useLevel - 使用等级
 * @returns 装备名称
 */
export function getEquipmentName(
  equipmentType: EquipmentSlotType,
  useLevel: number
): string {
  const nameMap = EQUIPMENT_NAME_MAPS[equipmentType];
  
  if (!nameMap) {
    return '未知装备';
  }
  
  // 找到小于等于当前等级的最大等级
  let targetLevel = 1;
  for (const level of EQUIPMENT_LEVELS) {
    if (level <= useLevel) {
      targetLevel = level;
    } else {
      break;
    }
  }
  
  return nameMap[targetLevel] || nameMap[1] || '未知装备';
}

/**
 * 获取装备的基础等级
 * 根据使用等级获取装备的基础等级（用于名称和属性计算）
 * 例如：useLevel=15 -> baseLevel=10
 * @param useLevel - 使用等级
 * @returns 基础等级
 */
export function getEquipmentBaseLevel(useLevel: number): number {
  let targetLevel = 1;
  for (const level of EQUIPMENT_LEVELS) {
    if (level <= useLevel) {
      targetLevel = level;
    } else {
      break;
    }
  }
  return targetLevel;
}

/**
 * 计算装备基础属性
 * 根据装备类型和使用等级计算基础属性
 * @param equipmentType - 装备类型
 * @param useLevel - 使用等级
 * @returns 基础属性对象
 */
export function calculateEquipmentBaseAttributes(
  equipmentType: EquipmentSlotType,
  useLevel: number
): {
  attackMin?: number;
  attackMax?: number;
  defense?: number;
} {
  const baseLevel = getEquipmentBaseLevel(useLevel);
  
  switch (equipmentType) {
    case 'weapon':
      // 武器：基础最小攻击 = 10 × dj，基础最大攻击 = 30 × dj
      return {
        attackMin: 10 * baseLevel,
        attackMax: 30 * baseLevel,
      };
    
    case 'helmet':
      // 头盔：基础防御 = 6 × dj
      return {
        defense: 6 * baseLevel,
      };
    
    case 'clothes':
      // 衣服：基础防御 = 8 × dj
      return {
        defense: 8 * baseLevel,
      };
    
    case 'shoes':
      // 战鞋：基础防御 = 4 × dj
      return {
        defense: 4 * baseLevel,
      };
    
    case 'bracelet':
      // 手镯：基础最小攻击 = 5 × dj，基础最大攻击 = 15 × dj
      return {
        attackMin: 5 * baseLevel,
        attackMax: 15 * baseLevel,
      };
    
    case 'necklace':
      // 项链：基础最小攻击 = 8 × dj，基础最大攻击 = 20 × dj
      return {
        attackMin: 8 * baseLevel,
        attackMax: 20 * baseLevel,
      };
    
    default:
      return {};
  }
}
