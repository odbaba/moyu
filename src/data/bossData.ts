/**
 * BOSS 数据文件
 * 定义各地图的 BOSS 模板数据和刷新配置
 * 参考文档：reference/docs/project_docs/04_怪物系统.md
 */

import type { BossSpawnConfig, BossTemplate } from '../types';

// ========== BOSS 模板数据 ==========

/**
 * BOSS 模板映射表
 * 以 BOSS ID 为索引，存储所有 BOSS 的模板数据
 * 参考文档中的 BOSS 属性和刷新概率
 */
export const bossTemplates: Record<string, BossTemplate> = {
  // 10级BOSS - 雷鸣大陆
  'boss-10': {
    id: 'boss-10',
    name: '10级BOSS',
    level: 10,
    combatPower: 10,
    location: 'leiming-dalu',
    locationName: '雷鸣大陆',
    icon: '👹',
    description: '雷鸣大陆的守护者，拥有强大的力量。',
    minHp: 1000,
    maxHp: 1200,
    baseAttackMin: 50,
    baseAttackMax: 80,
    baseDefense: 30,
    spawnChance: 55, // 55% 刷新概率
  },

  // 20级BOSS - 戈壁
  'boss-20': {
    id: 'boss-20',
    name: '20级BOSS',
    level: 20,
    combatPower: 30,
    location: 'gebi',
    locationName: '戈壁',
    icon: '👹',
    description: '戈壁的霸主，统治着这片荒芜之地。',
    minHp: 1000,
    maxHp: 2200,
    baseAttackMin: 80,
    baseAttackMax: 120,
    baseDefense: 50,
    spawnChance: 45, // 45% 刷新概率
  },

  // 30级BOSS - 迷梦沼泽
  'boss-30': {
    id: 'boss-30',
    name: '30级BOSS',
    level: 30,
    combatPower: 45,
    location: 'mimeng-zhaozhe',
    locationName: '迷梦沼泽',
    icon: '👹',
    description: '迷梦沼泽的梦魇，让人迷失在无尽的幻境中。',
    minHp: 1250,
    maxHp: 2750,
    baseAttackMin: 120,
    baseAttackMax: 180,
    baseDefense: 80,
    spawnChance: 33, // 33% 刷新概率
  },

  // 50级BOSS - 冰宫
  'boss-50': {
    id: 'boss-50',
    name: '50级BOSS',
    level: 50,
    combatPower: 75,
    location: 'binggong',
    locationName: '冰宫',
    icon: '👹',
    description: '冰宫的王者，寒冰之心永不融化。',
    minHp: 1250,
    maxHp: 2750,
    baseAttackMin: 180,
    baseAttackMax: 250,
    baseDefense: 120,
    spawnChance: 23, // 23% 刷新概率
  },

  // 70级BOSS - 亚维特岛
  'boss-70': {
    id: 'boss-70',
    name: '70级BOSS',
    level: 70,
    combatPower: 105,
    location: 'yaweite-dao',
    locationName: '亚维特岛',
    icon: '👹',
    description: '亚维特岛的海神，掌控着海洋的力量。',
    minHp: 1500,
    maxHp: 3300,
    baseAttackMin: 250,
    baseAttackMax: 350,
    baseDefense: 180,
    spawnChance: 33, // 33% 刷新概率
  },

  // 90级BOSS - 火山
  'boss-90': {
    id: 'boss-90',
    name: '90级BOSS',
    level: 90,
    combatPower: 135,
    location: 'huoshan',
    locationName: '火山',
    icon: '👹',
    description: '火山的炎魔，熔岩是它的血液。',
    minHp: 1500,
    maxHp: 3300,
    baseAttackMin: 350,
    baseAttackMax: 450,
    baseDefense: 220,
    spawnChance: 23, // 23% 刷新概率
  },

  // 100级BOSS - 深渊迷宫
  'boss-100': {
    id: 'boss-100',
    name: '100级BOSS',
    level: 100,
    combatPower: 150,
    location: 'shenyuan-migong',
    locationName: '深渊迷宫',
    icon: '👹',
    description: '深渊迷宫的终极守护者，黑暗的化身。',
    minHp: 2000,
    maxHp: 4400,
    baseAttackMin: 450,
    baseAttackMax: 600,
    baseDefense: 300,
    spawnChance: 33, // 33% 刷新概率
  },
};

// ========== BOSS 刷新配置 ==========

/**
 * BOSS 刷新配置列表
 * 定义每个地图的 BOSS 刷新配置
 */
export const bossSpawnConfigs: BossSpawnConfig[] = [
  {
    id: 'spawn-boss-10',
    bossTemplateId: 'boss-10',
    location: 'leiming-dalu',
    interactableId: 'interact-boss-10',
  },
  {
    id: 'spawn-boss-20',
    bossTemplateId: 'boss-20',
    location: 'gebi',
    interactableId: 'interact-boss-20',
  },
  {
    id: 'spawn-boss-30',
    bossTemplateId: 'boss-30',
    location: 'mimeng-zhaozhe',
    interactableId: 'interact-boss-30',
  },
  {
    id: 'spawn-boss-50',
    bossTemplateId: 'boss-50',
    location: 'binggong',
    interactableId: 'interact-boss-50',
  },
  {
    id: 'spawn-boss-70',
    bossTemplateId: 'boss-70',
    location: 'yaweite-dao',
    interactableId: 'interact-boss-70',
  },
  {
    id: 'spawn-boss-90',
    bossTemplateId: 'boss-90',
    location: 'huoshan',
    interactableId: 'interact-boss-90',
  },
  {
    id: 'spawn-boss-100',
    bossTemplateId: 'boss-100',
    location: 'shenyuan-migong',
    interactableId: 'interact-boss-100',
  },
];

// ========== 辅助函数 ==========

/**
 * 根据地图ID获取BOSS模板
 * @param locationId 地图ID
 * @returns BOSS模板或undefined
 */
export function getBossTemplateByLocation(locationId: string): BossTemplate | undefined {
  return Object.values(bossTemplates).find(boss => boss.location === locationId);
}

/**
 * 根据BOSS ID获取刷新配置
 * @param bossId BOSS模板ID
 * @returns 刷新配置或undefined
 */
export function getBossSpawnConfig(bossId: string): BossSpawnConfig | undefined {
  return bossSpawnConfigs.find(config => config.bossTemplateId === bossId);
}

/**
 * 根据交互ID获取刷新配置
 * @param interactableId 交互ID
 * @returns 刷新配置或undefined
 */
export function getBossSpawnConfigByInteractableId(interactableId: string): BossSpawnConfig | undefined {
  return bossSpawnConfigs.find(config => config.interactableId === interactableId);
}
