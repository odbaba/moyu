/**
 * 战魂物品掉落工具函数
 * 定义战魂之心和战魂晶石的掉落配置和掉落逻辑
 * 参考文档：reference/docs/战魂系统完整文档.md
 */

// 导入怪物刷新配置，用于从 enemy.id 中提取 templateId
import { monsterSpawnConfigs } from '../data/monsterData';
import type { GemItem, InventoryItem } from '../types';
import { cloneItem, ITEM_TEMPLATES } from './itemFactory';

// ==================== 类型定义 ====================

/**
 * 战魂物品类型
 * - zhanHunZhiXin: 战魂之心（100%成功率）
 * - zhanHunJingShi: 战魂晶石（20%成功率）
 */
export type WarSoulItemType = 'zhanHunZhiXin' | 'zhanHunJingShi';

/**
 * 单个掉落配置
 * @property itemType - 战魂物品类型
 * @property dropRate - 掉落概率（0-100）
 * @property ignoreSystemEnabled - 是否忽略战魂系统开启状态（无名氏专用）
 */
export interface WarSoulDropEntry {
  itemType: WarSoulItemType;
  dropRate: number;
  ignoreSystemEnabled?: boolean;
}

/**
 * 怪物战魂掉落配置
 * @property monsterId - 怪物ID（可以是ID或名称）
 * @property monsterName - 怪物名称（用于显示和匹配）
 * @property drops - 掉落物品列表
 */
export interface WarSoulDropConfig {
  monsterId: string;
  monsterName: string;
  drops: WarSoulDropEntry[];
}

// ==================== 战魂之心掉落配置表 ====================

/**
 * 战魂之心掉落配置表
 * 根据战魂系统完整文档配置各怪物的掉落概率
 *
 * 掉落规则：
 * - 无名氏：100%（不受战魂系统开启状态限制，击败后开启战魂系统）
 * - 魔军主帅：100%（需战魂系统已开启）
 * - 冰雪巨人军官：100%（需战魂系统已开启）
 * - 魔军突击队：25%（需战魂系统已开启）
 * - 魔军守卫军：25%（需战魂系统已开启）
 * - 魔军神秘部队：25%（需战魂系统已开启）
 * - 魔军图腾兽：25%（需战魂系统已开启）
 * - 冰雪巨人士官：25%（需战魂系统已开启）
 * - 雷角风牙兽：50%（需战魂系统已开启）
 */
export const ZHAN_HUN_ZHI_XIN_DROP_CONFIG: WarSoulDropConfig[] = [
  // 无名氏：100%掉落，不受战魂系统开启状态限制
  {
    monsterId: 'wumingshi',
    monsterName: '无名氏',
    drops: [
      {
        itemType: 'zhanHunZhiXin',
        dropRate: 100,
        ignoreSystemEnabled: true,
      },
    ],
  },
  // 魔军主帅：100%掉落
  {
    monsterId: 'mojun-zhushuai',
    monsterName: '魔军主帅',
    drops: [
      {
        itemType: 'zhanHunZhiXin',
        dropRate: 100,
      },
    ],
  },
  // 冰雪巨人军官：100%掉落
  {
    monsterId: 'bingxue-juren-junguan',
    monsterName: '冰雪巨人军官',
    drops: [
      {
        itemType: 'zhanHunZhiXin',
        dropRate: 100,
      },
    ],
  },
  // 魔军突击队：25%掉落
  {
    monsterId: 'mojun-tujidui',
    monsterName: '魔军突击队',
    drops: [
      {
        itemType: 'zhanHunZhiXin',
        dropRate: 25,
      },
    ],
  },
  // 魔军守卫军：25%掉落
  {
    monsterId: 'mojun-shouweijun',
    monsterName: '魔军守卫军',
    drops: [
      {
        itemType: 'zhanHunZhiXin',
        dropRate: 25,
      },
    ],
  },
  // 魔军神秘部队：25%掉落
  {
    monsterId: 'mojun-shenmibudui',
    monsterName: '魔军神秘部队',
    drops: [
      {
        itemType: 'zhanHunZhiXin',
        dropRate: 25,
      },
    ],
  },
  // 魔军图腾兽：25%掉落
  {
    monsterId: 'mojun-tutengshou',
    monsterName: '魔军图腾兽',
    drops: [
      {
        itemType: 'zhanHunZhiXin',
        dropRate: 25,
      },
    ],
  },
  // 冰雪巨人士官：25%掉落
  {
    monsterId: 'bingxue-juren-shiguan',
    monsterName: '冰雪巨人士官',
    drops: [
      {
        itemType: 'zhanHunZhiXin',
        dropRate: 25,
      },
    ],
  },
  // 雷角风牙兽：50%掉落
  {
    monsterId: 'leijiao-fengyashou',
    monsterName: '雷角风牙兽',
    drops: [
      {
        itemType: 'zhanHunZhiXin',
        dropRate: 50,
      },
    ],
  },
];

// ==================== 战魂晶石掉落配置表 ====================

/**
 * 战魂晶石掉落配置表
 * 根据战魂系统完整文档配置各怪物的掉落概率
 *
 * 掉落规则：
 * - 魔军突击队：75%（需战魂系统已开启）
 * - 魔军守卫军：75%（需战魂系统已开启）
 * - 魔军神秘部队：75%（需战魂系统已开启）
 * - 魔军图腾兽：75%（需战魂系统已开启）
 * - 骑士亡魂：100%（需战魂系统已开启）
 * - 冰雪巨人士兵：100%（需战魂系统已开启）
 * - BOSS级怪物：50%（需战魂系统已开启）
 */
export const ZHAN_HUN_JING_SHI_DROP_CONFIG: WarSoulDropConfig[] = [
  // 魔军突击队：75%掉落
  {
    monsterId: 'mojun-tujidui',
    monsterName: '魔军突击队',
    drops: [
      {
        itemType: 'zhanHunJingShi',
        dropRate: 75,
      },
    ],
  },
  // 魔军守卫军：75%掉落
  {
    monsterId: 'mojun-shouweijun',
    monsterName: '魔军守卫军',
    drops: [
      {
        itemType: 'zhanHunJingShi',
        dropRate: 75,
      },
    ],
  },
  // 魔军神秘部队：75%掉落
  {
    monsterId: 'mojun-shenmibudui',
    monsterName: '魔军神秘部队',
    drops: [
      {
        itemType: 'zhanHunJingShi',
        dropRate: 75,
      },
    ],
  },
  // 魔军图腾兽：75%掉落
  {
    monsterId: 'mojun-tutengshou',
    monsterName: '魔军图腾兽',
    drops: [
      {
        itemType: 'zhanHunJingShi',
        dropRate: 75,
      },
    ],
  },
  // 骑士亡魂：100%掉落
  {
    monsterId: 'qishi-wanghun',
    monsterName: '骑士亡魂',
    drops: [
      {
        itemType: 'zhanHunJingShi',
        dropRate: 100,
      },
    ],
  },
  // 冰雪巨人士兵：100%掉落
  {
    monsterId: 'bingxue-juren-shibing',
    monsterName: '冰雪巨人士兵',
    drops: [
      {
        itemType: 'zhanHunJingShi',
        dropRate: 100,
      },
    ],
  },
];

// ==================== 合并的掉落配置表 ====================

/**
 * 完整的战魂物品掉落配置表
 * 合并战魂之心和战魂晶石的配置
 */
export const WAR_SOUL_DROP_CONFIGS: WarSoulDropConfig[] = [
  ...ZHAN_HUN_ZHI_XIN_DROP_CONFIG,
  ...ZHAN_HUN_JING_SHI_DROP_CONFIG,
];

// ==================== BOSS级怪物列表 ====================

/**
 * BOSS级怪物ID列表
 * 这些怪物在战魂系统开启后有50%概率掉落战魂晶石
 */
export const BOSS_MONSTER_IDS: string[] = [
  'zhizhu-wanghou-aida', // 蜘蛛王后艾达
  'mojun-zhushuai', // 魔军主帅
  'bingxue-juren-junguan', // 冰雪巨人军官
  // 可以继续添加其他BOSS级怪物
];

// ==================== 工具函数 ====================

/**
 * 根据战魂物品类型获取物品模板
 * @param itemType 战魂物品类型
 * @returns 物品模板，如果不存在则返回null
 */
function getWarSoulItemTemplate(itemType: WarSoulItemType): GemItem | null {
  switch (itemType) {
    case 'zhanHunZhiXin':
      return ITEM_TEMPLATES.zhanHunZhiXin;
    case 'zhanHunJingShi':
      // 战魂晶石需要从 inventoryData 导入
      // 由于 ITEM_TEMPLATES 中没有导出战魂晶石，需要特殊处理
      return {
        id: 'gem_zhanhunjingshi',
        name: '战魂晶石',
        icon: '⚔️',
        quantity: 1,
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
    default:
      return null;
  }
}

/**
 * 从敌人ID中提取怪物模板ID
 * 敌人ID格式：${spawnId}_enemy_${i+1} 或 ${templateId}_enemy_${i+1}
 * @param enemyId 敌人ID
 * @returns 怪物模板ID，如果无法提取则返回原始ID
 */
function extractTemplateIdFromEnemyId(enemyId: string): string {
  // 尝试从 enemy.id 中提取 spawnId（去掉 '_enemy_X' 后缀）
  const enemyMatch = enemyId.match(/^(.+)_enemy_\d+$/);
  if (enemyMatch) {
    const spawnId = enemyMatch[1];

    // 通过 spawnId 在 monsterSpawnConfigs 中查找 templateId
    const spawnConfig = monsterSpawnConfigs.find(config => config.id === spawnId);
    if (spawnConfig) {
      return spawnConfig.templateId;
    }

    // 如果找不到 spawnConfig，返回 spawnId（可能是 templateId）
    return spawnId;
  }

  // 如果不匹配 enemy.id 格式，直接返回原始ID
  return enemyId;
}

/**
 * 获取怪物的战魂物品掉落配置
 * @param monsterId 怪物ID（可以是 templateId、spawnId 或 enemy.id）
 * @returns 该怪物的战魂物品掉落配置，如果没有配置则返回null
 */
export function getWarSoulDropConfig(monsterId: string): WarSoulDropConfig | null {
  // 从 enemy.id 中提取 templateId
  const templateId = extractTemplateIdFromEnemyId(monsterId);

  // 首先尝试精确匹配怪物模板ID
  const config = WAR_SOUL_DROP_CONFIGS.find((c) => c.monsterId === templateId);
  if (config) {
    return config;
  }

  // 如果没有找到，尝试根据怪物名称匹配
  // 这是为了兼容可能使用不同ID格式的情况
  const configByName = WAR_SOUL_DROP_CONFIGS.find(
    (c) => c.monsterName === templateId || c.monsterId.includes(templateId) || templateId.includes(c.monsterId)
  );

  return configByName || null;
}

/**
 * 检查怪物是否为BOSS级怪物
 * @param monsterId 怪物ID（可以是 templateId、spawnId 或 enemy.id）
 * @returns 是否为BOSS级怪物
 */
export function isBossMonster(monsterId: string): boolean {
  // 从 enemy.id 中提取 templateId
  const templateId = extractTemplateIdFromEnemyId(monsterId);

  return BOSS_MONSTER_IDS.includes(templateId);
}

/**
 * 检查战魂物品掉落
 * 根据怪物ID和战魂系统开启状态，计算掉落的战魂物品
 *
 * @param monsterId 怪物ID（可以是 templateId、spawnId 或 enemy.id）
 * @param warSoulSystemEnabled 战魂系统是否已开启
 * @returns 掉落的战魂物品列表（可能为空）
 *
 * @example
 * // 无名氏击败，必定掉落战魂之心（不受战魂系统状态限制）
 * const drops = checkWarSoulDrop('wumingshi', false);
 * // drops: [{ name: '战魂之心', ... }]
 *
 * @example
 * // 魔军突击队击败，战魂系统已开启
 * const drops = checkWarSoulDrop('mojun-tujidui', true);
 * // drops: 可能为战魂之心（25%概率）或战魂晶石（75%概率）或两者都有或都没有
 *
 * @example
 * // 冰雪巨人军官击败，战魂系统已开启（使用 enemy.id 格式）
 * const drops = checkWarSoulDrop('spawn-xueyu-junguan_enemy_1', true);
 * // drops: [{ name: '战魂之心', ... }]（100%掉落）
 */
export function checkWarSoulDrop(
  monsterId: string,
  warSoulSystemEnabled: boolean
): InventoryItem[] {
  const droppedItems: InventoryItem[] = [];

  // 获取该怪物的掉落配置
  const config = getWarSoulDropConfig(monsterId);

  if (config) {
    // 遍历该怪物的所有掉落配置
    for (const drop of config.drops) {
      // 检查是否需要战魂系统已开启
      // 如果 ignoreSystemEnabled 为 true，则不受战魂系统状态限制
      if (!drop.ignoreSystemEnabled && !warSoulSystemEnabled) {
        continue;
      }

      // 根据概率判断是否掉落
      if (Math.random() * 100 < drop.dropRate) {
        // 获取物品模板
        const template = getWarSoulItemTemplate(drop.itemType);
        if (template) {
          // 使用 cloneItem 克隆物品
          droppedItems.push(cloneItem(template));
        }
      }
    }
  }

  // 检查是否为BOSS级怪物，如果是且战魂系统已开启，额外50%概率掉落战魂晶石
  // 注意：这里需要避免重复掉落（例如魔军主帅已经在上面的配置中处理了）
  if (isBossMonster(monsterId) && warSoulSystemEnabled) {
    // 检查是否已经在配置中处理过战魂晶石掉落
    const hasJingShiDrop = config?.drops.some((d) => d.itemType === 'zhanHunJingShi');

    if (!hasJingShiDrop && Math.random() * 100 < 50) {
      const template = getWarSoulItemTemplate('zhanHunJingShi');
      if (template) {
        droppedItems.push(cloneItem(template));
      }
    }
  }

  return droppedItems;
}

