/**
 * 军衔和爵位系统数据配置
 * 参考文档：reference/docs/project_docs/01_角色系统.md
 */

// ========== 军衔系统 ==========

/**
 * 军衔等级配置接口
 * 包含军衔的基础信息和奖励配置
 */
export interface MilitaryRankConfig {
  level: number; // 军衔等级 (0-11)
  name: string; // 军衔名称
  requiredBattleExp: number; // 所需战功
  combatPowerBonus: number; // 战斗力加成
  pay: number; // 军饷（魔石），周日可领取
}

/**
 * 军衔等级配置表
 * 等级 0-11，对应不同军衔
 * 军饷奖励：周日可领取的魔石数量
 * 参考文档：reference/docs/scripts_analysis/14_NPC系统.md
 */
export const MILITARY_RANKS: MilitaryRankConfig[] = [
  { level: 0, name: '无', requiredBattleExp: 0, combatPowerBonus: 0, pay: 0 },
  { level: 1, name: '少尉', requiredBattleExp: 1000, combatPowerBonus: 1, pay: 280 },
  { level: 2, name: '中尉', requiredBattleExp: 2000, combatPowerBonus: 2, pay: 540 },
  { level: 3, name: '上尉', requiredBattleExp: 3000, combatPowerBonus: 3, pay: 820 },
  { level: 4, name: '少校', requiredBattleExp: 8000, combatPowerBonus: 5, pay: 2800 },
  { level: 5, name: '中校', requiredBattleExp: 13000, combatPowerBonus: 10, pay: 5600 },
  { level: 6, name: '上校', requiredBattleExp: 18000, combatPowerBonus: 15, pay: 8280 },
  { level: 7, name: '少将', requiredBattleExp: 26000, combatPowerBonus: 20, pay: 10000 },
  { level: 8, name: '中将', requiredBattleExp: 34000, combatPowerBonus: 30, pay: 20000 },
  { level: 9, name: '上将', requiredBattleExp: 44000, combatPowerBonus: 40, pay: 30000 },
  { level: 10, name: '大将', requiredBattleExp: 54000, combatPowerBonus: 50, pay: 40000 },
  { level: 11, name: '元帅', requiredBattleExp: 100000, combatPowerBonus: 60, pay: 50000 },
];

/**
 * 根据军衔等级获取配置
 * @param level 军衔等级
 * @returns 军衔配置
 */
export function getMilitaryRankByLevel(level: number): MilitaryRankConfig {
  return MILITARY_RANKS.find(rank => rank.level === level) || MILITARY_RANKS[0];
}

/**
 * 获取下一级军衔所需战功
 * @param currentLevel 当前军衔等级
 * @returns 所需战功，如果已满级返回 null
 */
export function getNextMilitaryRankExp(currentLevel: number): number | null {
  if (currentLevel >= 11) return null;
  const nextRank = MILITARY_RANKS.find(rank => rank.level === currentLevel + 1);

  return nextRank ? nextRank.requiredBattleExp : null;
}

// ========== 爵位系统 ==========

/**
 * 爵位等级配置接口
 */
export interface NobleRankConfig {
  level: number; // 爵位等级 (0-6)
  name: string; // 爵位名称
  requiredMerit: number; // 所需功勋
  combatPowerBonus: number; // 战斗力加成
}

/**
 * 爵位等级配置表
 * 等级 0-6，对应不同爵位
 */
export const NOBLE_RANKS: NobleRankConfig[] = [
  { level: 0, name: '平民', requiredMerit: 0, combatPowerBonus: 0 },
  { level: 1, name: '勋爵', requiredMerit: 1000, combatPowerBonus: 2 },
  { level: 2, name: '子爵', requiredMerit: 3000, combatPowerBonus: 6 },
  { level: 3, name: '伯爵', requiredMerit: 6000, combatPowerBonus: 12 },
  { level: 4, name: '公爵', requiredMerit: 15000, combatPowerBonus: 20 },
  { level: 5, name: '侯爵', requiredMerit: 30000, combatPowerBonus: 30 },
  { level: 6, name: '王', requiredMerit: 100000, combatPowerBonus: 50 },
];

/**
 * 根据爵位等级获取配置
 * @param level 爵位等级
 * @returns 爵位配置
 */
export function getNobleRankByLevel(level: number): NobleRankConfig {
  return NOBLE_RANKS.find(rank => rank.level === level) || NOBLE_RANKS[0];
}

/**
 * 获取下一级爵位所需功勋
 * @param currentLevel 当前爵位等级
 * @returns 所需功勋，如果已满级返回 null
 */
export function getNextNobleRankMerit(currentLevel: number): number | null {
  if (currentLevel >= 6) return null;
  const nextRank = NOBLE_RANKS.find(rank => rank.level === currentLevel + 1);

  return nextRank ? nextRank.requiredMerit : null;
}

// ========== 爵位奖励配置 ==========

/**
 * 爵位奖励配置接口
 * 定义每个爵位等级可以领取的奖励
 */
export interface NobleRankReward {
  level: number; // 爵位等级
  rewardName: string; // 奖励名称
  description: string; // 奖励描述
  items: NobleRewardItem[]; // 奖励物品列表
  magicStone?: number; // 魔石奖励
  exp?: number; // 经验奖励
}

/**
 * 爵位奖励物品接口
 */
export interface NobleRewardItem {
  itemId: string; // 物品ID
  itemName: string; // 物品名称
  quantity: number; // 数量
}

/**
 * 爵位奖励配置表
 * 每个爵位等级对应的奖励
 * 参考文档：reference/docs/scripts_analysis/14_NPC系统.md
 */
export const NOBLE_RANK_REWARDS: NobleRankReward[] = [
  {
    level: 0,
    rewardName: '平民奖励',
    description: '平民无特殊奖励',
    items: [],
  },
  {
    level: 1,
    rewardName: '勋爵奖励',
    description: '勋爵可领取基础奖励',
    items: [
      { itemId: 'exp-ball-small', itemName: '小型经验球', quantity: 2 },
      { itemId: 'soul-crystal', itemName: '灵魂晶石', quantity: 1 },
    ],
    magicStone: 100,
    exp: 10000,
  },
  {
    level: 2,
    rewardName: '子爵奖励',
    description: '子爵可领取进阶奖励',
    items: [
      { itemId: 'exp-ball-medium', itemName: '中型经验球', quantity: 3 },
      { itemId: 'soul-crystal', itemName: '灵魂晶石', quantity: 2 },
      { itemId: 'flower-99', itemName: '99朵白玫瑰', quantity: 1 },
    ],
    magicStone: 300,
    exp: 30000,
  },
  {
    level: 3,
    rewardName: '伯爵奖励',
    description: '伯爵可领取高级奖励',
    items: [
      { itemId: 'exp-ball-large', itemName: '大型经验球', quantity: 4 },
      { itemId: 'soul-king', itemName: '灵魂王', quantity: 1 },
      { itemId: 'flower-99', itemName: '99朵白玫瑰', quantity: 2 },
    ],
    magicStone: 600,
    exp: 60000,
  },
  {
    level: 4,
    rewardName: '公爵奖励',
    description: '公爵可领取珍贵奖励',
    items: [
      { itemId: 'exp-ball-full', itemName: '满经验球', quantity: 5 },
      { itemId: 'soul-king', itemName: '灵魂王', quantity: 2 },
      { itemId: 'flower-999', itemName: '999朵白玫瑰', quantity: 1 },
    ],
    magicStone: 1000,
    exp: 100000,
  },
  {
    level: 5,
    rewardName: '侯爵奖励',
    description: '侯爵可领取稀有奖励',
    items: [
      { itemId: 'exp-ball-full', itemName: '满经验球', quantity: 8 },
      { itemId: 'soul-king', itemName: '灵魂王', quantity: 3 },
      { itemId: 'flower-999', itemName: '999朵白玫瑰', quantity: 2 },
      { itemId: 'plasma-potion', itemName: '电浆药水', quantity: 1 },
    ],
    magicStone: 2000,
    exp: 200000,
  },
  {
    level: 6,
    rewardName: '王奖励',
    description: '王可领取至尊奖励',
    items: [
      { itemId: 'exp-ball-full', itemName: '满经验球', quantity: 10 },
      { itemId: 'soul-king', itemName: '灵魂王', quantity: 5 },
      { itemId: 'flower-999', itemName: '999朵白玫瑰', quantity: 3 },
      { itemId: 'plasma-potion', itemName: '电浆药水', quantity: 2 },
      { itemId: 'battle-soul-heart', itemName: '战魂之心', quantity: 1 },
    ],
    magicStone: 5000,
    exp: 500000,
  },
];

// ========== 地图权限配置 ==========

/**
 * 地图权限配置接口
 * 定义进入特定地图所需的爵位等级
 */
export interface LocationAccessConfig {
  locationId: string; // 地图ID
  locationName: string; // 地图名称
  requiredNobleRank: number; // 所需爵位等级
  description: string; // 权限描述
}

/**
 * 地图权限配置表
 * 定义各地图的爵位进入要求
 * 参考文档：reference/docs/scripts_analysis/14_NPC系统.md
 * 注意：只有后花园需要爵位限制，其他地点不需要
 */
export const LOCATION_ACCESS_CONFIG: LocationAccessConfig[] = [
  {
    locationId: 'houhuayuan',
    locationName: '后花园',
    requiredNobleRank: 1,
    description: '后花园需要勋爵以上爵位才能进入',
  },
];

/**
 * 获取地图权限配置
 * @param locationId 地图ID
 * @returns 地图权限配置，如果地图没有特殊要求则返回 undefined
 */
export function getLocationAccessConfig(locationId: string): LocationAccessConfig | undefined {
  return LOCATION_ACCESS_CONFIG.find(config => config.locationId === locationId);
}
