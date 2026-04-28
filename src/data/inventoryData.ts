/**
 * 物品数据文件
 * 定义游戏中所有物品的配置数据
 * 物品分为五大类：装备类、消耗品类、技能书类、宝石类、特殊道具类
 */

import type {
  EquipmentItem,
  GemItem,
  InventoryItem,
  PlayerResources,
  SkillBookItem,
  SpecialItem,
} from '../types';

// ==================== 装备类物品 ====================

/**
 * 装备等级列表
 * 游戏中装备分为12个等级档次
 */
export const EQUIPMENT_LEVELS = [1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 125] as const;

/**
 * 装备名称映射表
 * 根据装备类型和使用等级决定装备名称
 */
export const EQUIPMENT_NAMES: Record<EquipmentItem['equipmentType'], Record<number, string>> = {
  weapon: {
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
    125: '魔吟神剑',
  },
  helmet: {
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
    125: '武神宝盔',
  },
  clothes: {
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
    125: '夜魔战甲',
  },
  shoes: {
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
    125: '龙神御风',
  },
  bracelet: {
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
    125: '武神手镯',
  },
  necklace: {
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
    125: '怒雷战符',
  },
};

/**
 * 装备图标映射表
 */
export const EQUIPMENT_ICONS: Record<EquipmentItem['equipmentType'], string> = {
  weapon: '⚔️',
  helmet: '🪖',
  clothes: '🛡️',
  shoes: '👢',
  bracelet: '💫',
  necklace: '📿',
};

/**
 * 品质名称映射表
 */
export const QUALITY_NAMES: Record<number, EquipmentItem['equipmentQuality']> = {
  0: '普通品',
  1: '良品',
  2: '上品',
  3: '精品',
  4: '极品',
};

/**
 * 品质对应的稀有度
 */
export const QUALITY_TO_RARITY: Record<number, EquipmentItem['rarity']> = {
  0: 'common',
  1: 'uncommon',
  2: 'rare',
  3: 'epic',
  4: 'legendary',
};

/**
 * 创建装备物品的工厂函数
 * @param equipmentType 装备类型
 * @param useLevel 使用等级（必须是1,10,20,30,40,50,60,70,80,90,100,110之一）
 * @param equipmentQuality 装备品质（0-4）
 * @param magicSoulLevel 魔魂等级（0-12）
 * @param holeCount 宝石洞数量（0-2）
 */
export const createEquipment = (
  equipmentType: EquipmentItem['equipmentType'],
  useLevel: number,
  equipmentQuality: number,
  magicSoulLevel: number = 0,
  holeCount: number = 0
): EquipmentItem => {
  // 计算基础属性
  let attackMin = 0;
  let attackMax = 0;
  let defense = 0;

  switch (equipmentType) {
    case 'weapon':
      attackMin = 20 * useLevel;
      attackMax = 30 * useLevel;
      break;
    case 'helmet':
      defense = 12 * useLevel;
      break;
    case 'clothes':
      defense = 18 * useLevel;
      break;
    case 'shoes':
      defense = 8 * useLevel;
      break;
    case 'bracelet':
      attackMin = 10 * useLevel;
      attackMax = 15 * useLevel;
      break;
    case 'necklace':
      attackMin = 15 * useLevel;
      attackMax = 20 * useLevel;
      break;
  }

  // 计算魔魂追加属性
  const addAttackMin = Math.floor(attackMin / 10) * magicSoulLevel;
  const addAttackMax = Math.floor(attackMax / 10) * magicSoulLevel;
  const addDefense = Math.floor(defense / 10) * magicSoulLevel;

  // 获取装备名称
  const baseName = EQUIPMENT_NAMES[equipmentType][useLevel] || equipmentType;
  const qualityName = QUALITY_NAMES[equipmentQuality] || '普通品';
  const rarity = QUALITY_TO_RARITY[equipmentQuality] || 'common';

  // 构建描述
  let description = `${useLevel}级${qualityName}${baseName}`;
  if (magicSoulLevel > 0) {
    description += `，魔魂+${magicSoulLevel}`;
  }
  if (holeCount > 0) {
    description += `，${holeCount}洞`;
  }
  description += '。';

  // 物品基础名称（不包含品质和魔魂等级）
  const name = baseName;

  return {
    id: `equipment_${equipmentType}_${useLevel}_${equipmentQuality}_${magicSoulLevel}_${holeCount}`,
    name,
    icon: EQUIPMENT_ICONS[equipmentType],
    quantity: 1,
    type: 'equipment',
    rarity,
    source: '怪物掉落、副本奖励',
    description,
    maxStack: 1,
    usable: false,
    equippable: true,
    equipmentType,
    useLevel,
    equipmentQuality: qualityName,
    magicSoulLevel,
    holeCount,
    // 基础属性（不包含魔魂追加）
    attackMin,
    attackMax,
    defense,
    // 追加属性（魔魂加成）
    bonusAttackMin: addAttackMin,
    bonusAttackMax: addAttackMax,
    bonusDefense: addDefense,
    goldValue: 100 * useLevel * (equipmentQuality + 1) + 100 * magicSoulLevel + 10000 * holeCount * holeCount * holeCount,
    magicStoneValue: equipmentQuality === 4 ? Math.floor(28 * (useLevel * 2.5 + 50) + magicSoulLevel * 128 + 1500 * holeCount * holeCount * holeCount) : 0,
    imagePath: `./images/equipment/${equipmentType}/lv${useLevel}.png`,
  };
};

// ==================== 所有等级装备（普通品）====================

// 1级装备
const weapon_lv1 = createEquipment('weapon', 1, 0, 0, 0);
const helmet_lv1 = createEquipment('helmet', 1, 0, 0, 0);
const armor_lv1 = createEquipment('clothes', 1, 0, 0, 0);
const shoes_lv1 = createEquipment('shoes', 1, 0, 0, 0);
const bracelet_lv1 = createEquipment('bracelet', 1, 0, 0, 0);
const necklace_lv1 = createEquipment('necklace', 1, 0, 0, 0);

// 10级装备
const weapon_lv10 = createEquipment('weapon', 10, 0, 0, 0);
const helmet_lv10 = createEquipment('helmet', 10, 0, 0, 0);
const armor_lv10 = createEquipment('clothes', 10, 0, 0, 0);
const shoes_lv10 = createEquipment('shoes', 10, 0, 0, 0);
const bracelet_lv10 = createEquipment('bracelet', 10, 0, 0, 0);
const necklace_lv10 = createEquipment('necklace', 10, 0, 0, 0);

// 20级装备
const weapon_lv20 = createEquipment('weapon', 20, 0, 0, 0);
const helmet_lv20 = createEquipment('helmet', 20, 0, 0, 0);
const armor_lv20 = createEquipment('clothes', 20, 0, 0, 0);
const shoes_lv20 = createEquipment('shoes', 20, 0, 0, 0);
const bracelet_lv20 = createEquipment('bracelet', 20, 0, 0, 0);
const necklace_lv20 = createEquipment('necklace', 20, 0, 0, 0);

// 30级装备
const weapon_lv30 = createEquipment('weapon', 30, 0, 0, 0);
const helmet_lv30 = createEquipment('helmet', 30, 0, 0, 0);
const armor_lv30 = createEquipment('clothes', 30, 0, 0, 0);
const shoes_lv30 = createEquipment('shoes', 30, 0, 0, 0);
const bracelet_lv30 = createEquipment('bracelet', 30, 0, 0, 0);
const necklace_lv30 = createEquipment('necklace', 30, 0, 0, 0);

// 40级装备
const weapon_lv40 = createEquipment('weapon', 40, 0, 0, 0);
const helmet_lv40 = createEquipment('helmet', 40, 0, 0, 0);
const armor_lv40 = createEquipment('clothes', 40, 0, 0, 0);
const shoes_lv40 = createEquipment('shoes', 40, 0, 0, 0);
const bracelet_lv40 = createEquipment('bracelet', 40, 0, 0, 0);
const necklace_lv40 = createEquipment('necklace', 40, 0, 0, 0);

// 50级装备
const weapon_lv50 = createEquipment('weapon', 50, 0, 0, 0);
const helmet_lv50 = createEquipment('helmet', 50, 0, 0, 0);
const armor_lv50 = createEquipment('clothes', 50, 0, 0, 0);
const shoes_lv50 = createEquipment('shoes', 50, 0, 0, 0);
const bracelet_lv50 = createEquipment('bracelet', 50, 0, 0, 0);
const necklace_lv50 = createEquipment('necklace', 50, 0, 0, 0);

// 60级装备
const weapon_lv60 = createEquipment('weapon', 60, 0, 0, 0);
const helmet_lv60 = createEquipment('helmet', 60, 0, 0, 0);
const armor_lv60 = createEquipment('clothes', 60, 0, 0, 0);
const shoes_lv60 = createEquipment('shoes', 60, 0, 0, 0);
const bracelet_lv60 = createEquipment('bracelet', 60, 0, 0, 0);
const necklace_lv60 = createEquipment('necklace', 60, 0, 0, 0);

// 70级装备
const weapon_lv70 = createEquipment('weapon', 70, 0, 0, 0);
const helmet_lv70 = createEquipment('helmet', 70, 0, 0, 0);
const armor_lv70 = createEquipment('clothes', 70, 0, 0, 0);
const shoes_lv70 = createEquipment('shoes', 70, 0, 0, 0);
const bracelet_lv70 = createEquipment('bracelet', 70, 0, 0, 0);
const necklace_lv70 = createEquipment('necklace', 70, 0, 0, 0);

// 80级装备
const weapon_lv80 = createEquipment('weapon', 80, 0, 0, 0);
const helmet_lv80 = createEquipment('helmet', 80, 0, 0, 0);
const armor_lv80 = createEquipment('clothes', 80, 0, 0, 0);
const shoes_lv80 = createEquipment('shoes', 80, 0, 0, 0);
const bracelet_lv80 = createEquipment('bracelet', 80, 0, 0, 0);
const necklace_lv80 = createEquipment('necklace', 80, 0, 0, 0);

// 90级装备
const weapon_lv90 = createEquipment('weapon', 90, 0, 0, 0);
const helmet_lv90 = createEquipment('helmet', 90, 0, 0, 0);
const armor_lv90 = createEquipment('clothes', 90, 0, 0, 0);
const shoes_lv90 = createEquipment('shoes', 90, 0, 0, 0);
const bracelet_lv90 = createEquipment('bracelet', 90, 0, 0, 0);
const necklace_lv90 = createEquipment('necklace', 90, 0, 0, 0);

// 100级装备
const weapon_lv100 = createEquipment('weapon', 100, 0, 0, 0);
const helmet_lv100 = createEquipment('helmet', 100, 0, 0, 0);
const armor_lv100 = createEquipment('clothes', 100, 0, 0, 0);
const shoes_lv100 = createEquipment('shoes', 100, 0, 0, 0);
const bracelet_lv100 = createEquipment('bracelet', 100, 0, 0, 0);
const necklace_lv100 = createEquipment('necklace', 100, 0, 0, 0);

// 125级装备（最高等级）
const weapon_lv125 = createEquipment('weapon', 125, 0, 0, 0);
const helmet_lv125 = createEquipment('helmet', 125, 0, 0, 0);
const armor_lv125 = createEquipment('clothes', 125, 0, 0, 0);
const shoes_lv125 = createEquipment('shoes', 125, 0, 0, 0);
const bracelet_lv125 = createEquipment('bracelet', 125, 0, 0, 0);
const necklace_lv125 = createEquipment('necklace', 125, 0, 0, 0);

// ==================== 示例高品质装备 ====================

// 极品100级装备（带魔魂和宝石洞）
const weapon_lv100_legendary = createEquipment('weapon', 100, 4, 12, 2);
const helmet_lv100_legendary = createEquipment('helmet', 100, 4, 12, 2);
const armor_lv100_legendary = createEquipment('clothes', 100, 4, 12, 2);
const shoes_lv100_legendary = createEquipment('shoes', 100, 4, 12, 2);
const bracelet_lv100_legendary = createEquipment('bracelet', 100, 4, 12, 2);
const necklace_lv100_legendary = createEquipment('necklace', 100, 4, 12, 2);

// 精品80级装备
const weapon_lv80_epic = createEquipment('weapon', 80, 3, 8, 1);
const armor_lv80_epic = createEquipment('clothes', 80, 3, 8, 1);

// ==================== 消耗品类物品 ====================

/**
 * 体力药 - 回复体力到最大值
 */
const tiLiYao: InventoryItem = {
  id: 'consumable_tiliyao',
  name: '体力药',
  icon: '💊',
  quantity: 10,
  type: 'consumable',
  rarity: 'common',
  source: '商店购买、任务奖励',
  description: '使用后体力值回复到最大值。是冒险者必备的补给品。',
  maxStack: 99,
  usable: true,
  equippable: false,
  goldValue: 1000,
  magicStoneValue: 0,
  imagePath: './images/items/consumable/tiliyao.jpg',
};

/**
 * 果子 - 回复生命到最大值
 */
const guoZi: InventoryItem = {
  id: 'consumable_guozi',
  name: '果子',
  icon: '🍎',
  quantity: 10,
  type: 'consumable',
  rarity: 'common',
  source: '商店购买、怪物掉落',
  description: '使用后生命值回复到最大值。在亚特大陆随处可见的神奇果实。',
  maxStack: 99,
  usable: true,
  equippable: false,
  goldValue: 1000,
  magicStoneValue: 0,
  imagePath: './images/items/consumable/guozi.jpg',
};

/**
 * 满经验球 - 打开经验使用界面
 */
export const manJingYanQiu: InventoryItem = {
  id: 'consumable_manjingyanqiu',
  name: '满经验球',
  icon: '🔮',
  quantity: 555,
  type: 'consumable',
  rarity: 'rare',
  source: 'BOSS掉落、活动奖励',
  description: '使用后打开经验使用界面，可将经验分配给角色或幻兽。人物每天最多使用5个，幻兽无限制。',
  maxStack: 99,
  usable: true,
  equippable: false,
  goldValue: 1000,
  magicStoneValue: 100,
  imagePath: './images/items/consumable/manjingyanqiu.jpg',
};

/**
 * 空经验球 - 存储经验
 */
export const kongJingYanQiu: InventoryItem = {
  id: 'consumable_kongjingyanqiu',
  name: '空经验球',
  icon: '⚪',
  quantity: 5,
  type: 'consumable',
  rarity: 'uncommon',
  source: '商店购买、任务奖励',
  description: '100级以上角色可使用，用于存储打怪获得的经验。当经验值达到270时自动转换为满经验球。',
  maxStack: 99,
  usable: true,
  equippable: false,
  goldValue: 1000,
  magicStoneValue: 0,
  imagePath: './images/items/consumable/kongjingyanqiu.jpg',
};

/**
 * 电浆药水 - 幸运值设为100
 */
export const dianJiangYaoShui: InventoryItem = {
  id: 'consumable_dianjiangyaoshui',
  name: '电浆药水',
  icon: '⚡',
  quantity: 1,
  type: 'consumable',
  rarity: 'legendary',
  source: '商城购买、活动奖励',
  description: '使用后幸运值提高到100点。每天只能使用一瓶。',
  maxStack: 1,
  usable: true,
  equippable: false,
  goldValue: 82800000,
  magicStoneValue: 8280,
  imagePath: './images/items/consumable/dianjiangyaoshui.png',
};

/**
 * 生命药剂 - 恢复100点生命值
 */
const shengMingYaoJi: InventoryItem = {
  id: 'consumable_shengmingyaoji',
  name: '生命药剂',
  icon: '💊',
  quantity: 50,
  type: 'consumable',
  rarity: 'common',
  attributes: { hp: 100 },
  source: '杂货商购买、击败低级怪物掉落',
  description: '亚特大陆最常见的疗伤药剂，能够恢复100点生命值。虽然效果一般，但胜在价格便宜，是冒险者的必备之物。',
  maxStack: 99,
  usable: true,
  equippable: false,
  goldValue: 100,
  magicStoneValue: 0,
  imagePath: './images/items/consumable/tiliyao.jpg',
};

/**
 * 高级生命药剂 - 恢复500点生命值
 */
const gaoJiShengMingYaoJi: InventoryItem = {
  id: 'consumable_gaojishengmingyaoji',
  name: '高级生命药剂',
  icon: '💊',
  quantity: 20,
  type: 'consumable',
  rarity: 'uncommon',
  attributes: { hp: 500 },
  source: '炼金术士制作、副本奖励',
  description: '比普通生命药剂效果更强的疗伤圣药，能够恢复500点生命值。炼制需要多种珍稀草药，价格不菲。',
  maxStack: 99,
  usable: true,
  equippable: false,
  goldValue: 500,
  magicStoneValue: 0,
  imagePath: './images/items/consumable/guozi.jpg',
};

/**
 * 魔力药剂 - 恢复200点魔力
 */
const moLiYaoJi: InventoryItem = {
  id: 'consumable_moliyaoji',
  name: '魔力药剂',
  icon: '🔮',
  quantity: 30,
  type: 'consumable',
  rarity: 'uncommon',
  attributes: { mp: 200 },
  source: '炼金术士制作、军团贡献兑换',
  description: '能够快速恢复魔力的药剂，恢复200点魔力。对于需要频繁使用技能的战士来说，是不可或缺的补给品。',
  maxStack: 99,
  usable: true,
  equippable: false,
  goldValue: 300,
  magicStoneValue: 0,
  imagePath: './images/items/consumable/tiliyao.jpg',
};

/**
 * 精灵之泪 - 恢复1000点生命和500点魔力
 */
const jingLingZhiLei: InventoryItem = {
  id: 'consumable_jinglingzhilei',
  name: '精灵之泪',
  icon: '🌸',
  quantity: 5,
  type: 'consumable',
  rarity: 'epic',
  attributes: { hp: 1000, mp: 500 },
  source: '雷鸣深渊BOSS掉落、限时活动奖励',
  description: '传说中元素精灵凝聚的泪滴，蕴含着强大的生命魔力。服用后可恢复1000点生命值和500点魔力，是亚特大陆最珍贵的疗伤圣物。',
  maxStack: 20,
  usable: true,
  equippable: false,
  goldValue: 5000,
  magicStoneValue: 50,
  imagePath: './images/items/consumable/guozi.jpg',
};

// ==================== 技能书类物品 ====================

/**
 * 星魔剑 - 群体攻击120%
 */
const xingMoJian: SkillBookItem = {
  id: 'skillbook_xingmojian',
  name: '星魔剑',
  icon: '📖',
  quantity: 1,
  type: 'skillBook',
  rarity: 'epic',
  source: '蜘蛛掉落',
  description: '记载着星魔剑技能的秘籍，学习后可施展群体攻击，造成120%伤害。',
  maxStack: 1,
  usable: true,
  equippable: false,
  skillId: 'skill_star_sword',
  skillName: '星魔剑',
  skillType: 'attack',
  skillEffect: '群体攻击，造成120%伤害',
  damagePercent: 120,
  targetCount: 3,
  goldValue: 10000000,
  magicStoneValue: 0,
  imagePath: './images/items/skillbook/xingmojian.png',
};

/**
 * 高级星魔剑 - 群体攻击150%
 */
const gaoJiXingMoJian: SkillBookItem = {
  id: 'skillbook_gaojixingmojian',
  name: '高级星魔剑',
  icon: '📕',
  quantity: 1,
  type: 'skillBook',
  rarity: 'legendary',
  source: '蜘蛛王后艾达掉落',
  description: '记载着高级星魔剑技能的秘籍，学习后可施展强力群体攻击，造成150%伤害。',
  maxStack: 1,
  usable: true,
  equippable: false,
  skillId: 'skill_star_sword',
  skillName: '高级星魔剑',
  skillType: 'attack',
  skillEffect: '群体攻击，造成150%伤害',
  damagePercent: 150,
  targetCount: 3,
  goldValue: 28000000,
  magicStoneValue: 2800,
  imagePath: './images/items/skillbook/gaojixingmojian.png',
  isUpgrade: true,
  targetLevel: 2,
};

/**
 * 高级风斩 - 单体攻击150%（升级书）
 */
const gaoJiFengZhan: SkillBookItem = {
  id: 'skillbook_gaojifengzhan',
  name: '高级风斩',
  icon: '📗',
  quantity: 1,
  type: 'skillBook',
  rarity: 'uncommon',
  source: '商店购买',
  description: '记载着高级风斩技能的秘籍，学习后可施展强力单体攻击，造成150%伤害。消耗5点体力。',
  maxStack: 1,
  usable: true,
  equippable: false,
  skillId: 'skill_wind_slash',
  skillName: '高级风斩',
  skillType: 'attack',
  skillEffect: '单体攻击，造成150%伤害',
  damagePercent: 150,
  targetCount: 1,
  goldValue: 1000,
  magicStoneValue: 0,
  imagePath: './images/items/skillbook/gaojifengzhan.png',
  isUpgrade: true,
  targetLevel: 2,
};

/**
 * 飞天连斩 - 单体四连击
 */
const feiTianLianZhan: SkillBookItem = {
  id: 'skillbook_feitianlianzhan',
  name: '飞天连斩',
  icon: '📘',
  quantity: 1,
  type: 'skillBook',
  rarity: 'epic',
  source: '蜘蛛掉落',
  description: '记载着飞天连斩技能的秘籍，学习后可施展单体四连击攻击。',
  maxStack: 1,
  usable: true,
  equippable: false,
  skillId: 'skill_flying_slash',
  skillName: '飞天连斩',
  skillType: 'attack',
  skillEffect: '单体四连击攻击',
  damagePercent: 100,
  targetCount: 1,
  goldValue: 10000000,
  magicStoneValue: 1000,
  imagePath: './images/items/skillbook/feitianlianzhan.png',
};

/**
 * 高级飞天连斩 - 四连击(2击破防)
 */
const gaoJiFeiTianLianZhan: SkillBookItem = {
  id: 'skillbook_gaojifeitianlianzhan',
  name: '高级飞天连斩',
  icon: '📙',
  quantity: 1,
  type: 'skillBook',
  rarity: 'legendary',
  source: '蜘蛛王后艾达、PK赛奖励',
  description: '记载着高级飞天连斩技能的秘籍，学习后可施展四连击攻击，其中2击可破防。',
  maxStack: 1,
  usable: true,
  equippable: false,
  skillId: 'skill_flying_slash',
  skillName: '高级飞天连斩',
  skillType: 'attack',
  skillEffect: '四连击攻击，2击破防',
  damagePercent: 100,
  targetCount: 1,
  goldValue: 82800000,
  magicStoneValue: 8280,
  imagePath: './images/items/skillbook/gaojifeitianlianzhan.png',
  isUpgrade: true,
  targetLevel: 2,
};

/**
 * 斗志昂扬 - 战斗力加成
 */
const douZhiYiYang: SkillBookItem = {
  id: 'skillbook_douzhiyiyang',
  name: '斗志昂扬',
  icon: '📔',
  quantity: 1,
  type: 'skillBook',
  rarity: 'epic',
  source: '蜘蛛掉落',
  description: '记载着斗志昂扬技能的秘籍，学习后可提升战斗力。',
  maxStack: 1,
  usable: true,
  equippable: false,
  skillId: 'skill_fighting_spirit',
  skillName: '斗志昂扬',
  skillType: 'buff',
  skillEffect: '提升战斗力',
  goldValue: 28000000,
  magicStoneValue: 0,
  imagePath: './images/items/skillbook/douzhiyiyang.png',
  targetLevel: 1,
};

/**
 * 高级斗志昂扬 - 斗志昂扬升级版
 */
const gaoJiDouZhiYiYang: SkillBookItem = {
  id: 'skillbook_gaojidouzhiyiyang',
  name: '高级斗志昂扬',
  icon: '📓',
  quantity: 1,
  type: 'skillBook',
  rarity: 'legendary',
  source: '蜘蛛王后艾达、PK赛奖励',
  description: '记载着高级斗志昂扬技能的秘籍，是斗志昂扬的升级版，大幅提升战斗力。',
  maxStack: 1,
  usable: true,
  equippable: false,
  skillId: 'skill_fighting_spirit',
  skillName: '高级斗志昂扬',
  skillType: 'buff',
  skillEffect: '大幅提升战斗力',
  goldValue: 82800000,
  magicStoneValue: 25000,
  imagePath: './images/items/skillbook/gaojidouzhiyiyang.png',
  isUpgrade: true,
  targetLevel: 2
};

/**
 * 高级裂地爆斩 - 群体攻击75%
 */
const gaoJiDiLieBaoZhan: SkillBookItem = {
  id: 'skillbook_gaojidiliebaozhan',
  name: '高级裂地爆斩',
  icon: '📒',
  quantity: 1,
  type: 'skillBook',
  rarity: 'rare',
  source: '商店购买',
  description: '记载着高级裂地爆斩技能的秘籍，学习后可施展群体攻击，造成75%伤害。消耗20点体力。',
  maxStack: 1,
  usable: true,
  equippable: false,
  skillId: 'skill_earth_slash',
  skillName: '高级裂地爆斩',
  skillType: 'attack',
  skillEffect: '群体攻击，造成75%伤害',
  damagePercent: 75,
  targetCount: 3,
  goldValue: 10000,
  magicStoneValue: 0,
  imagePath: './images/items/skillbook/gaojidiliebaozhan.png',
  isUpgrade: true,
  targetLevel: 2,
};

// ==================== 宝石类物品 ====================

// ---------- 强化宝石 ----------

/**
 * 魔魂晶石 - 提升魔魂等级，成功率20%-50%
 */
const moHunJingShi: GemItem = {
  id: 'gem_mohunjingshi',
  name: '魔魂晶石',
  icon: '💎',
  quantity: 100,
  type: 'gem',
  rarity: 'common',
  source: '矿山采集、杂货商购买',
  description: '强化装备的基础材料，蕴含着微弱的魔力。用于提升装备魔魂等级，成功率20%-50%。',
  maxStack: 999,
  usable: false,
  equippable: false,
  gemType: 'enhance',
  gemSubType: 'enhance',
  effect: '提升魔魂等级',
  successRate: '20%-50%',
  refineType: 'magicSoul',
  goldValue: 50000,
  magicStoneValue: 0,
  imagePath: './images/items/gem/mohunjingshi.png',
};

/**
 * 魔魂之心 - 提升魔魂等级（+9前100%成功）
 */
const moHunZhiXin: GemItem = {
  id: 'gem_mohunzhixin',
  name: '魔魂之心',
  icon: '💜',
  quantity: 10,
  type: 'gem',
  rarity: 'rare',
  source: '5个魔魂晶石合成',
  description: '由5个魔魂晶石凝聚而成的宝石，蕴含纯净的魔力。用于提升装备魔魂等级，+9前100%成功。',
  maxStack: 99,
  usable: false,
  equippable: false,
  gemType: 'enhance',
  gemSubType: 'enhance',
  effect: '提升魔魂等级（+9前100%成功）',
  successRate: '100%（+9前）',
  refineType: 'magicSoul',
  goldValue: 280000,
  magicStoneValue: 0,
  imagePath: './images/items/gem/mohunzhixin.png',
};

/**
 * 灵魂晶石 - 提升品质等级，成功率25%-50%
 */
export const lingHunJingShi: GemItem = {
  id: 'gem_linghunjingshi',
  name: '灵魂晶石',
  icon: '💠',
  quantity: 20,
  type: 'gem',
  rarity: 'rare',
  source: '怪物掉落、BOSS掉落',
  description: '蕴含灵魂之力的宝石。用于提升装备品质等级，成功率25%-50%。',
  maxStack: 99,
  usable: false,
  equippable: false,
  gemType: 'enhance',
  gemSubType: 'enhance',
  effect: '提升品质等级',
  successRate: '25%-50%',
  refineType: 'quality',
  goldValue: 1000000,
  magicStoneValue: 0,
  imagePath: './images/items/gem/linghunjingshi.png',
};

/**
 * 灵魂王 - 提升品质等级，成功率100%
 */
export const lingHunWang: GemItem = {
  id: 'gem_linghunwang',
  name: '灵魂王',
  icon: '👑',
  quantity: 5,
  type: 'gem',
  rarity: 'legendary',
  source: '20个灵魂晶石合成、BOSS掉落',
  description: '由20个灵魂晶石凝聚而成的宝石，蕴含强大的灵魂之力。用于提升装备品质等级，成功率100%。',
  maxStack: 20,
  usable: false,
  equippable: false,
  gemType: 'enhance',
  gemSubType: 'enhance',
  effect: '提升品质等级（100%成功）',
  successRate: '100%',
  refineType: 'quality',
  goldValue: 20000000,
  magicStoneValue: 2000,
  imagePath: './images/items/gem/linghunwang.png',
};

/**
 * 幻魔晶石 - 提升使用等级，成功率20%-50%
 */
const huanMoJingShi: GemItem = {
  id: 'gem_huanmojingshi',
  name: '幻魔晶石',
  icon: '🌀',
  quantity: 20,
  type: 'gem',
  rarity: 'uncommon',
  source: '怪物掉落、副本奖励',
  description: '蕴含幻魔之力的宝石。用于提升装备使用等级，成功率20%-50%。',
  maxStack: 99,
  usable: false,
  equippable: false,
  gemType: 'enhance',
  gemSubType: 'enhance',
  effect: '提升使用等级',
  successRate: '20%-50%',
  refineType: 'useLevel',
  goldValue: 500000,
  magicStoneValue: 0,
  imagePath: './images/items/gem/huanmojingshi.png',
};

/**
 * 幻魔之心 - 提升使用等级，成功率100%
 */
const huanMoZhiXin: GemItem = {
  id: 'gem_huanmozhixin',
  name: '幻魔之心',
  icon: '💜',
  quantity: 5,
  type: 'gem',
  rarity: 'epic',
  source: '5个幻魔晶石合成、BOSS掉落',
  description: '由5个幻魔晶石凝聚而成的宝石，蕴含纯净的幻魔之力。用于提升装备使用等级，成功率100%。',
  maxStack: 20,
  usable: false,
  equippable: false,
  gemType: 'enhance',
  gemSubType: 'enhance',
  effect: '提升使用等级（100%成功）',
  successRate: '100%',
  refineType: 'useLevel',
  goldValue: 2800000,
  magicStoneValue: 0,
  imagePath: './images/items/gem/huanmozhixin.png',
};

/**
 * 战魂晶石 - 激活战魂属性，成功率20%
 */
const zhanHunJingShi: GemItem = {
  id: 'gem_zhanhunjingshi',
  name: '战魂晶石',
  icon: '⚔️',
  quantity: 5,
  type: 'gem',
  rarity: 'legendary',
  source: 'BOSS掉落',
  description: '蕴含战魂之力的宝石。用于激活装备战魂属性，成功率20%。注意：已有战魂会改变种类并降为1级。',
  maxStack: 20,
  usable: false,
  equippable: false,
  gemType: 'enhance',
  gemSubType: 'soul',
  effect: '激活战魂属性',
  successRate: '20%',
  refineType: 'soul',
  goldValue: 28000000,
  magicStoneValue: 2800,
  imagePath: './images/items/gem/zhanhunjingshi.png',
};

/**
 * 战魂之心 - 激活战魂属性，成功率100%
 */
export const zhanHunZhiXin: GemItem = {
  id: 'gem_zhanhunzhixin',
  name: '战魂之心',
  icon: '❤️‍🔥',
  quantity: 200,
  type: 'gem',
  rarity: 'legendary',
  source: '商城购买、活动奖励',
  description: '蕴含纯净战魂之力的宝石。用于激活装备战魂属性，成功率100%。注意：已有战魂会改变种类并降为1级。',
  maxStack: 10,
  usable: false,
  equippable: false,
  gemType: 'enhance',
  gemSubType: 'soul',
  effect: '激活战魂属性（100%成功）',
  successRate: '100%',
  refineType: 'soul',
  goldValue: 82800000,
  magicStoneValue: 12500,
  imagePath: './images/items/gem/zhanhunzhixin.png',
};

// ---------- 镶嵌宝石 ----------

/**
 * 中级战斗力石 - 战斗力+3
 */
const zhongJiZhanDouLiShi: GemItem = {
  id: 'gem_zhongjizhandoulishi',
  name: '中级战斗力石',
  icon: '🔶',
  quantity: 10,
  type: 'gem',
  rarity: 'rare',
  source: '怪物掉落、副本奖励',
  description: '镶嵌后战斗力+3。可镶嵌在带洞装备上。',
  maxStack: 99,
  usable: false,
  equippable: false,
  gemType: 'embed',
  gemSubType: 'embed',
  effect: '战斗力+3',
  combatPower: 3,
  goldValue: 500000,
  magicStoneValue: 0,
  imagePath: './images/items/gem/zhongjizhandoulishi.png',
};

/**
 * 高级战斗力石 - 战斗力+5
 */
const gaoJiZhanDouLiShi: GemItem = {
  id: 'gem_gaojizhandoulishi',
  name: '高级战斗力石',
  icon: '🔷',
  quantity: 5,
  type: 'gem',
  rarity: 'legendary',
  source: '10个中级战斗力石合成、BOSS掉落',
  description: '镶嵌后战斗力+5。可镶嵌在带洞装备上。',
  maxStack: 20,
  usable: false,
  equippable: false,
  gemType: 'embed',
  gemSubType: 'embed',
  effect: '战斗力+5',
  combatPower: 5,
  goldValue: 28000000,
  magicStoneValue: 2500,
  imagePath: './images/items/gem/gaojizhandoulishi.png',
};

/**
 * 中级经验石 - 经验值+25%
 */
const zhongJiJingYanShi: GemItem = {
  id: 'gem_zhongjijingyanshi',
  name: '中级经验石',
  icon: '🟢',
  quantity: 10,
  type: 'gem',
  rarity: 'rare',
  source: '怪物掉落、副本奖励',
  description: '镶嵌后经验值获取+25%。可镶嵌在带洞装备上。',
  maxStack: 99,
  usable: false,
  equippable: false,
  gemType: 'embed',
  gemSubType: 'embed',
  effect: '经验值+25%',
  expBonus: 25,
  goldValue: 500000,
  magicStoneValue: 0,
  imagePath: './images/items/gem/zhongjijingyanshi.png',
};

/**
 * 高级经验石 - 经验值+50%
 */
const gaoJiJingYanShi: GemItem = {
  id: 'gem_gaojijingyanshi',
  name: '高级经验石',
  icon: '🟣',
  quantity: 5,
  type: 'gem',
  rarity: 'epic',
  source: '10个中级经验石合成',
  description: '镶嵌后经验值获取+50%。可镶嵌在带洞装备上。',
  maxStack: 20,
  usable: false,
  equippable: false,
  gemType: 'embed',
  gemSubType: 'embed',
  effect: '经验值+50%',
  expBonus: 50,
  goldValue: 5000000,
  magicStoneValue: 0,
  imagePath: './images/items/gem/gaojijingyanshi.png',
};

// ==================== 特殊道具类物品 ====================

/**
 * 月光宝盒 - 给装备打第一个洞
 */
export const yueGuangBaoHe: GemItem = {
  id: 'gem_yueguangbaohe',
  name: '月光宝盒',
  icon: '📦',
  quantity: 1,
  type: 'gem',
  rarity: 'legendary',
  source: 'BOSS掉落、商城购买',
  description: '在装备打造师处使用，可给装备打第一个洞，用于镶嵌宝石。',
  maxStack: 10,
  usable: true,
  equippable: false,
  gemType: 'enhance',
  gemSubType: 'openHole',
  effect: '给装备打第一个洞',
  successRate: '100%',
  refineType: 'openHole',
  goldValue: 27000000,
  magicStoneValue: 2700,
  imagePath: './images/items/special/yueguangbaohe.png',
};

/**
 * 月光宝盒增强版 - 给装备打第二个洞
 */
export const yueGuangBaoHeZengQiangBan: GemItem = {
  id: 'gem_yueguangbaohezengqiangban',
  name: '月光宝盒增强版',
  icon: '🎁',
  quantity: 100,
  type: 'gem',
  rarity: 'legendary',
  source: 'BOSS掉落、商城购买',
  description: '在装备打造师处使用，可给装备打第二个洞，用于镶嵌宝石。',
  maxStack: 10,
  usable: true,
  equippable: false,
  gemType: 'enhance',
  gemSubType: 'openHole',
  effect: '给装备打第二个洞',
  successRate: '100%',
  refineType: 'openHole',
  goldValue: 82800000,
  magicStoneValue: 8280,
  imagePath: './images/items/special/yueguangbaohezengqiangban.png',
};

/**
 * 银矿 - 出售给杂货商换金币
 */
const yinKuang: SpecialItem = {
  id: 'special_yinkuang',
  name: '银矿',
  icon: '🥈',
  quantity: 0,
  type: 'special',
  rarity: 'common',
  source: '雷鸣矿洞挖矿获得',
  description: '含有银的矿石，卖给[卡萨诺城]的[杂货商]可以得到不少金币。品质越高价值越高。',
  maxStack: 999,
  usable: false,
  equippable: false,
  specialType: 'ore',
  effect: '出售换金币',
  effectValue: 10000,
  quality: 1,
  imagePath: './images/items/special/yinkuang.png',
};

/**
 * 金矿 - 出售给收藏家换魔石
 * magicStoneValue 根据品质计算：品质 × 10
 */
const jinKuang: SpecialItem = {
  id: 'special_jinkuang',
  name: '金矿',
  icon: '🥇',
  quantity: 0,
  type: 'special',
  rarity: 'rare',
  source: '雷鸣矿洞挖矿获得',
  description: '含有金的矿石，可以卖不菲的价钱，[卡萨诺城]的[收藏家]正在高价收购。品质越高价值越高。',
  maxStack: 999,
  usable: false,
  equippable: false,
  specialType: 'ore',
  effect: '出售换魔石',
  effectValue: 10,
  quality: 1,
  goldValue: 0,
  magicStoneValue: 10, // 品质1 × 10 = 10
  imagePath: './images/items/special/jinkuang.png',
};

/**
 * 99朵白玫瑰 - 公主亲密度+50
 */
const baiMeiGui99: SpecialItem = {
  id: 'special_baimeigui99',
  name: '99朵白玫瑰',
  icon: '💐',
  quantity: 1,
  type: 'special',
  rarity: 'epic',
  source: '商城购买、活动奖励',
  description: '送给公主提升亲密度。',
  maxStack: 99,
  usable: true,
  equippable: false,
  specialType: 'gift',
  effect: '公主亲密度+50',
  effectValue: 50,
  goldValue: 500000,
  magicStoneValue: 50,
  imagePath: './images/items/special/baineigui99.png',
};

/**
 * 999朵白玫瑰 - 公主亲密度+4000
 */
const baiMeiGui999: SpecialItem = {
  id: 'special_baimeigui999',
  name: '999朵白玫瑰',
  icon: '🌹',
  quantity: 1,
  type: 'special',
  rarity: 'legendary',
  source: '商城购买、活动奖励',
  description: '送给公主提升亲密度。',
  maxStack: 10,
  usable: true,
  equippable: false,
  specialType: 'gift',
  effect: '公主亲密度+4000',
  effectValue: 4000,
  goldValue: 40000000,
  magicStoneValue: 4000,
  imagePath: './images/items/special/baineigui999.png',
};

// ==================== 材料类物品 ====================

/**
 * 幻兽之魂 - 培养幻兽的稀有材料
 */
const huanShouZhiHun: InventoryItem = {
  id: 'material_huanshouzhihun',
  name: '幻兽之魂',
  icon: '🐉',
  quantity: 3,
  type: 'material',
  rarity: 'legendary',
  source: '击杀远古幻兽、世界BOSS掉落',
  description: '传说中远古幻兽凝聚的灵魂碎片，蕴含着强大的幻兽之力。是培养传说级幻兽的必备材料，千金难求。',
  maxStack: 50,
  usable: false,
  equippable: false,
  goldValue: 1000000,
  magicStoneValue: 1000,
  imagePath: './images/items/special/jinkuang.png',
};

/**
 * 魔灵草 - 炼制药剂的高级材料
 */
const moLingCao: InventoryItem = {
  id: 'material_molingcao',
  name: '魔灵草',
  icon: '🌿',
  quantity: 8,
  type: 'material',
  rarity: 'rare',
  source: '亚特大陆野外采集、拍卖行购买',
  description: '生长在魔力充沛之地的珍贵草药，蕴含着纯净的魔力。是炼制高级药剂的重要材料，也是炼金术士的最爱。',
  maxStack: 99,
  usable: false,
  equippable: false,
  goldValue: 5000,
  magicStoneValue: 0,
  imagePath: './images/items/consumable/guozi.jpg',
};

// ==================== 任务物品类 ====================

/**
 * 神秘卷轴 - 任务道具
 */
const shenMiJuanZhou: InventoryItem = {
  id: 'quest_shenmijuanzhou',
  name: '神秘卷轴',
  icon: '📜',
  quantity: 1,
  type: 'quest',
  rarity: 'uncommon',
  source: '主线任务奖励',
  description: '一卷封印着古老魔法的卷轴，上面刻着神秘的符文。似乎与亚特大陆的重大秘密有关，需要找到智者才能解读其中的奥秘。',
  maxStack: 1,
  usable: false,
  equippable: false,
  imagePath: './images/items/skillbook/xingmojian.png',
};

/**
 * 军团令牌 - 任务道具
 */
const junTuanLingPai: InventoryItem = {
  id: 'quest_juntuanlingpai',
  name: '军团令牌',
  icon: '🏅',
  quantity: 1,
  type: 'quest',
  rarity: 'rare',
  source: '军团任务奖励',
  description: '代表军团身份的信物，持有此令牌可以进入军团密室。令牌上刻有军团徽记，散发着淡淡的魔力光芒。',
  maxStack: 1,
  usable: false,
  equippable: false,
  imagePath: './images/items/gem/mohunjingshi.png',
};

// ==================== 其他类物品 ====================

/**
 * 烟花 - 节日道具
 */
const yanHua: InventoryItem = {
  id: 'other_yanhua',
  name: '烟花',
  icon: '🎆',
  quantity: 10,
  type: 'other',
  rarity: 'common',
  source: '节日活动奖励、杂货商购买',
  description: '绚丽的魔法烟花，燃放后会在空中绽放出美丽的图案。是亚特大陆节日庆典的必备之物，能带来欢乐和祝福。',
  maxStack: 99,
  usable: true,
  equippable: false,
  goldValue: 100,
  magicStoneValue: 0,
  imagePath: './images/items/special/yueguangbaohe.png',
};

/**
 * 传送卷轴 - 功能道具
 */
const chuanSongJuanZhou: InventoryItem = {
  id: 'other_chuansongjuanzhou',
  name: '传送卷轴',
  icon: '✨',
  quantity: 15,
  type: 'other',
  rarity: 'uncommon',
  source: '商城购买、每日签到奖励',
  description: '刻有传送魔法的卷轴，使用后可以瞬间传送到已解锁的地点。对于在亚特大陆冒险的勇士来说，是极为便利的工具。',
  maxStack: 99,
  usable: true,
  equippable: false,
  goldValue: 500,
  magicStoneValue: 10,
  imagePath: './images/items/skillbook/xingmojian.png',
};

// ==================== 生成银矿物品（品质1-10）====================

const createSilverOre = (quality: number): SpecialItem => {
  return {
    id: `silver-ore-${quality}`,
    name: `银矿（品质${quality}）`,
    icon: '🥈',
    quantity: 0,
    type: 'special',
    rarity: quality >= 7 ? 'rare' : quality >= 4 ? 'uncommon' : 'common',
    source: '雷鸣矿洞挖矿获得',
    description: '含有银的矿石，卖给[卡萨诺城]的[杂货商]可以得到不少金币。',
    maxStack: 999,
    usable: false,
    equippable: false,
    specialType: 'ore',
    effect: '出售换金币',
    effectValue: quality * 10000,
    quality: quality,
    goldValue: quality * 10000,
    magicStoneValue: 0,
    imagePath: './images/items/special/yinkuang.png',
  };
};

// ==================== 生成金矿物品（品质1-10）====================

const createGoldOre = (quality: number): SpecialItem => {
  return {
    id: `gold-ore-${quality}`,
    name: `金矿（品质${quality}）`,
    icon: '🥇',
    quantity: 0,
    type: 'special',
    rarity: quality >= 7 ? 'rare' : quality >= 4 ? 'uncommon' : 'common',
    source: '雷鸣矿洞挖矿获得',
    description: '含有金的矿石，可以卖不菲的价钱，[卡萨诺城]的[收藏家]正在高价收购。',
    maxStack: 999,
    usable: false,
    equippable: false,
    specialType: 'ore',
    effect: '出售换魔石',
    effectValue: quality * 10,
    quality: quality,
    goldValue: 0,
    magicStoneValue: quality * 10,
    imagePath: './images/items/special/jinkuang.png',
  };
};

// 银矿（品质1-10）
const silverOre1 = createSilverOre(1);
const silverOre2 = createSilverOre(2);
const silverOre3 = createSilverOre(3);
const silverOre4 = createSilverOre(4);
const silverOre5 = createSilverOre(5);
const silverOre6 = createSilverOre(6);
const silverOre7 = createSilverOre(7);
const silverOre8 = createSilverOre(8);
const silverOre9 = createSilverOre(9);
const silverOre10 = createSilverOre(10);

// 金矿（品质1-10）
const goldOre1 = createGoldOre(1);
const goldOre2 = createGoldOre(2);
const goldOre3 = createGoldOre(3);
const goldOre4 = createGoldOre(4);
const goldOre5 = createGoldOre(5);
const goldOre6 = createGoldOre(6);
const goldOre7 = createGoldOre(7);
const goldOre8 = createGoldOre(8);
const goldOre9 = createGoldOre(9);
const goldOre10 = createGoldOre(10);

// ==================== 物品数据集合 ====================

/**
 * 示例物品数据集合
 * 包含所有类型的物品示例
 */
export const exampleItems: InventoryItem[] = [
  // 装备类 - 所有等级普通品装备
  weapon_lv1, helmet_lv1, armor_lv1, shoes_lv1, bracelet_lv1, necklace_lv1,
  weapon_lv10, helmet_lv10, armor_lv10, shoes_lv10, bracelet_lv10, necklace_lv10,
  weapon_lv20, helmet_lv20, armor_lv20, shoes_lv20, bracelet_lv20, necklace_lv20,
  weapon_lv30, helmet_lv30, armor_lv30, shoes_lv30, bracelet_lv30, necklace_lv30,
  weapon_lv40, helmet_lv40, armor_lv40, shoes_lv40, bracelet_lv40, necklace_lv40,
  weapon_lv50, helmet_lv50, armor_lv50, shoes_lv50, bracelet_lv50, necklace_lv50,
  weapon_lv60, helmet_lv60, armor_lv60, shoes_lv60, bracelet_lv60, necklace_lv60,
  weapon_lv70, helmet_lv70, armor_lv70, shoes_lv70, bracelet_lv70, necklace_lv70,
  weapon_lv80, helmet_lv80, armor_lv80, shoes_lv80, bracelet_lv80, necklace_lv80,
  weapon_lv90, helmet_lv90, armor_lv90, shoes_lv90, bracelet_lv90, necklace_lv90,
  weapon_lv100, helmet_lv100, armor_lv100, shoes_lv100, bracelet_lv100, necklace_lv100,
  weapon_lv125, helmet_lv125, armor_lv125, shoes_lv125, bracelet_lv125, necklace_lv125,

  // 装备类 - 高品质示例
  weapon_lv100_legendary, helmet_lv100_legendary, armor_lv100_legendary,
  shoes_lv100_legendary, bracelet_lv100_legendary, necklace_lv100_legendary,
  weapon_lv80_epic, armor_lv80_epic,

  // 消耗品类
  tiLiYao,
  guoZi,
  manJingYanQiu,
  kongJingYanQiu,
  dianJiangYaoShui,
  shengMingYaoJi,
  gaoJiShengMingYaoJi,
  moLiYaoJi,
  jingLingZhiLei,

  // 技能书类
  xingMoJian,
  gaoJiXingMoJian,
  gaoJiFengZhan,
  feiTianLianZhan,
  gaoJiFeiTianLianZhan,
  douZhiYiYang,
  gaoJiDouZhiYiYang,
  gaoJiDiLieBaoZhan,

  // 宝石类 - 强化宝石
  moHunJingShi,
  moHunZhiXin,
  lingHunJingShi,
  lingHunWang,
  huanMoJingShi,
  huanMoZhiXin,
  zhanHunJingShi,
  zhanHunZhiXin,

  // 宝石类 - 镶嵌宝石
  zhongJiZhanDouLiShi,
  gaoJiZhanDouLiShi,
  zhongJiJingYanShi,
  gaoJiJingYanShi,

  // 特殊道具类
  yueGuangBaoHe,
  yueGuangBaoHeZengQiangBan,
  yinKuang,
  jinKuang,
  baiMeiGui99,
  baiMeiGui999,

  // 材料类
  huanShouZhiHun,
  moLingCao,

  // 任务物品类
  shenMiJuanZhou,
  junTuanLingPai,

  // 其他类
  yanHua,
  chuanSongJuanZhou,

  // 矿石（品质1-10）
  silverOre1,
  silverOre2,
  silverOre3,
  silverOre4,
  silverOre5,
  silverOre6,
  silverOre7,
  silverOre8,
  silverOre9,
  silverOre10,
  goldOre1,
  goldOre2,
  goldOre3,
  goldOre4,
  goldOre5,
  goldOre6,
  goldOre7,
  goldOre8,
  goldOre9,
  goldOre10,
];

// ==================== 玩家资源数据 ====================

export const exampleResources: PlayerResources = {
  gold: 12568000000, // 金币数量
  magicStone: 3520, // 魔石数量
  battleExp: 0, // 战功数量
  merit: 0, // 功勋数量
};

// ==================== 物品查找函数 ====================

/**
 * 根据名称查找物品模板
 * 用于从物品名称查找对应的物品数据
 *
 * @param name 物品名称
 * @returns 物品模板，如果找不到则返回 undefined
 */
export function findItemByName(name: string): InventoryItem | undefined {
  return exampleItems.find(item => item.name === name);
}

/**
 * 根据ID查找物品模板
 * 用于从物品ID查找对应的物品数据
 *
 * @param id 物品ID
 * @returns 物品模板，如果找不到则返回 undefined
 */
export function findItemById(id: string): InventoryItem | undefined {
  return exampleItems.find(item => item.id === id);
}

// ==================== 初始装备生成函数 ====================

/**
 * 创建初始装备（非开发者模式使用）
 * 生成一套1级装备：
 * - 武器：1级、魔魂等级9级、品质精品
 * - 衣服：1级、魔魂等级9级、品质精品
 * - 头盔：1级、魔魂等级0级、品质普通品
 * - 鞋子：1级、魔魂等级0级、品质普通品
 * - 手镯：1级、魔魂等级0级、品质普通品
 * - 项链：1级、魔魂等级0级、品质普通品
 * @returns 初始装备数组
 */
export function createInitialEquipment(): EquipmentItem[] {
  return [
    // 武器：精品、魔魂+9
    createEquipment('weapon', 1, 3, 9, 0),
    // 衣服：精品、魔魂+9
    createEquipment('clothes', 1, 3, 9, 0),
    // 头盔：普通品、魔魂+0
    createEquipment('helmet', 1, 0, 0, 0),
    // 鞋子：普通品、魔魂+0
    createEquipment('shoes', 1, 0, 0, 0),
    // 手镯：普通品、魔魂+0
    createEquipment('bracelet', 1, 0, 0, 0),
    // 项链：普通品、魔魂+0
    createEquipment('necklace', 1, 0, 0, 0),
  ];
}

// ==================== 特殊怪物掉落物品导出 ====================

// 技能书类 - 蜘蛛掉落
export { xingMoJian, gaoJiXingMoJian, feiTianLianZhan, gaoJiFeiTianLianZhan, douZhiYiYang, gaoJiDouZhiYiYang };
// 宝石类 - 蜘蛛王后艾达掉落
export { moHunZhiXin, huanMoZhiXin };
