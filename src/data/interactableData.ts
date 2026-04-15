/**
 * 交互配置数据文件
 * 定义游戏中所有可交互对象的配置数据
 */

// 导入交互系统相关类型
import type {
  ActionInteractable,
  EnemyData,
  EnemyInteractable,
  InteractableConfig,
  NPCInteractable,
} from '../types';
import { generateBossEnemyData } from '../utils/bossUtils';
import { calculateMonsterStats, generateEnemiesForBattle } from '../utils/monsterUtils';
// 导入 BOSS 数据和工具函数
import { bossSpawnConfigs, bossTemplates } from './bossData';
// 导入怪物数据和工具函数
import { monsterSpawnConfigs, monsterTemplates } from './monsterData';
// 导入 NPC 配置数据
import { npcConfig } from './npcData';

// ==================== 挖矿动作交互配置 ====================

/**
 * 挖矿交互配置
 * 普通的挖矿动作
 */
const mining_1: ActionInteractable = {
  id: 'mining_1',
  type: 'action',
  name: '挖矿',
  icon: '⛏️',
  actionType: 'mining',
};

const mining_2: ActionInteractable = {
  id: 'mining_2',
  type: 'action',
  name: '挖矿',
  icon: '⛏️',
  actionType: 'mining',
};

const mining_3: ActionInteractable = {
  id: 'mining_3',
  type: 'action',
  name: '挖矿',
  icon: '⛏️',
  actionType: 'mining',
};

const mining_4: ActionInteractable = {
  id: 'mining_4',
  type: 'action',
  name: '挖矿',
  icon: '⛏️',
  actionType: 'mining',
};

// ==================== 敌人交互配置 ====================

/**
 * 巡逻小兵的敌人数据列表
 * 定义三个城卫小兵的属性
 */
const patrolSoldiersEnemies: EnemyData[] = [
  {
    id: 'soldier_a',
    name: '小兵甲',
    maxHp: 50,
    attack: 10,
    defense: 2,
    description: '手持长枪，神情警惕',
  },
  {
    id: 'soldier_b',
    name: '小兵乙',
    maxHp: 60,
    attack: 12,
    defense: 3,
    description: '腰佩短刀，目光锐利',
  },
  {
    id: 'soldier_c',
    name: '小兵丙',
    maxHp: 45,
    attack: 15,
    defense: 1,
    description: '背负弓箭，身手敏捷',
  },
];

/**
 * 巡逻小兵敌人交互配置
 * 玩家可以挑战的敌人组
 */
const patrol_soldiers: EnemyInteractable = {
  id: 'patrol_soldiers',
  type: 'enemy',
  name: '巡逻小兵',
  icon: '⚔️',
  description: '你看到三个正在巡逻的城卫小兵。⚠️ 他们看起来不太好惹...',
  enemies: patrolSoldiersEnemies,
};

// ==================== NPC交互配置 ====================

/**
 * 商人NPC交互配置
 * 玩家可以与商人进行交易
 */
const merchant_npc: NPCInteractable = {
  id: 'merchant_npc',
  type: 'npc',
  name: '商人',
  icon: '🧑‍💼',
  description: '一位来自远方的商人，正在兜售他的商品。',
  location: 'leiming-dalu',
  npcType: 'shop',
  options: [
    {
      text: '购买商品',
      result: '你浏览了商人的商品...',
    },
    {
      text: '出售物品',
      result: '你向商人出售了一些物品...',
    },
    {
      text: '离开',
      result: '你向商人告别。',
    },
  ],
};

// ==================== 交互配置映射表 ====================

/**
 * 交互配置映射表
 * 将所有交互配置按ID组织，便于快速查找
 */
export const interactableConfig: InteractableConfig = {
  // 挖矿动作交互
  mining_1,
  mining_2,
  mining_3,
  mining_4,
  // 敌人交互
  patrol_soldiers,
  // NPC交互
  merchant_npc,
};

// ==================== NPC 交互配置 ====================

/**
 * 将 NPC 配置合并到交互配置映射表中
 * 所有 NPC 都可以通过 ID 访问
 */
Object.assign(interactableConfig, npcConfig);

// ==================== 怪物交互配置 ====================

/**
 * 根据怪物刷新配置生成怪物交互对象
 * 将怪物模板数据转换为可交互的敌人对象
 */
const generateMonsterInteractables = (): Record<string, EnemyInteractable> => {
  const monsterInteractables: Record<string, EnemyInteractable> = {};

  // 遍历所有怪物刷新配置
  monsterSpawnConfigs.forEach((spawnConfig) => {
    // 获取怪物模板
    const template = monsterTemplates[spawnConfig.templateId];
    if (!template) {
      console.warn(`怪物模板不存在: ${spawnConfig.templateId}`);

      return;
    }

    // 计算怪物属性
    const monsterStats = calculateMonsterStats(template);

    // 生成战斗用的敌人列表（使用 spawnConfig.id 确保敌人 ID 唯一）
    const enemies: EnemyData[] = generateEnemiesForBattle(monsterStats, spawnConfig.id);

    // 创建交互对象
    monsterInteractables[spawnConfig.interactableId] = {
      id: spawnConfig.interactableId,
      type: 'enemy',
      name: template.name,
      icon: template.icon,
      description: `${template.description}\n等级: ${template.level} | 战斗力: ${template.combatPower}`,
      enemies,
    };
  });

  return monsterInteractables;
};

// 生成怪物交互对象
const monsterInteractables = generateMonsterInteractables();

// 将怪物交互对象添加到配置映射表
Object.assign(interactableConfig, monsterInteractables);

/**
 * 获取指定地图的怪物交互ID列表
 * @param locationId 地图ID
 * @returns 交互ID数组
 */
export function getMonsterInteractableIdsByLocation(locationId: string): string[] {
  return monsterSpawnConfigs
    .filter((config) => config.location === locationId)
    .map((config) => config.interactableId);
}

// ==================== BOSS 交互配置 ====================

/**
 * 根据已刷新的 BOSS ID 列表生成 BOSS 交互对象
 * @param spawnedBossInteractableIds 已刷新的 BOSS 交互 ID 列表
 * @returns BOSS 交互对象映射表
 */
export function generateBossInteractables(
  spawnedBossInteractableIds: string[]
): Record<string, EnemyInteractable> {
  const bossInteractables: Record<string, EnemyInteractable> = {};

  // 遍历已刷新的 BOSS 交互 ID
  for (const interactableId of spawnedBossInteractableIds) {
    // 获取对应的刷新配置
    const spawnConfig = bossSpawnConfigs.find(config => config.interactableId === interactableId);
    if (!spawnConfig) {
      console.warn(`BOSS 刷新配置不存在: ${interactableId}`);
      continue;
    }

    // 获取 BOSS 模板
    const bossTemplate = bossTemplates[spawnConfig.bossTemplateId];
    if (!bossTemplate) {
      console.warn(`BOSS 模板不存在: ${spawnConfig.bossTemplateId}`);
      continue;
    }

    // 生成 BOSS 敌人数据
    const enemy = generateBossEnemyData(bossTemplate, spawnConfig.id);

    // 创建交互对象
    bossInteractables[interactableId] = {
      id: interactableId,
      type: 'enemy',
      name: bossTemplate.name,
      icon: bossTemplate.icon,
      description: `${bossTemplate.description}\n等级: ${bossTemplate.level} | 战斗力: ${bossTemplate.combatPower}`,
      enemies: [enemy],
    };
  }

  return bossInteractables;
}

/**
 * 获取所有 BOSS 交互 ID 列表
 * @returns BOSS 交互 ID 数组
 */
export function getAllBossInteractableIds(): string[] {
  return bossSpawnConfigs.map(config => config.interactableId);
}
