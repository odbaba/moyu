/**
 * 交互配置模板文件
 * 提供创建敌人、NPC、动作交互配置的工厂函数
 * 用于快速生成标准化的交互对象配置
 */

// 导入交互系统相关类型
import type {
  ActionInteractable,
  ActionType,
  EnemyData,
  EnemyInteractable,
  NPCInteractable,
  NPCInteractionOption,
  NPCType,
} from '../../types';

// ==================== 敌人配置模板 ====================

/**
 * 创建敌人交互配置
 * 用于生成完整的EnemyInteractable对象
 *
 * @param id - 交互唯一标识符，用于系统内部查找
 * @param name - 敌人组显示名称，展示给玩家
 * @param icon - 显示图标，使用emoji格式
 * @param description - 敌人描述文本，展示在弹窗中
 * @param enemies - 敌人数据数组，包含每个敌人的详细属性
 * @returns 完整的EnemyInteractable对象
 *
 * @example
 * const bandits = createEnemyInteractable(
 *   'forest_bandits',
 *   '森林强盗',
 *   '🗡️',
 *   '一群凶恶的强盗正在森林中游荡...',
 *   [
 *     { id: 'bandit_1', name: '强盗头目', maxHp: 100, attack: 20, defense: 5 },
 *     { id: 'bandit_2', name: '强盗喽啰', maxHp: 50, attack: 10, defense: 2 }
 *   ]
 * );
 */
export function createEnemyInteractable(
  id: string,
  name: string,
  icon: string,
  description: string,
  enemies: EnemyData[]
): EnemyInteractable {
  return {
    id, // 交互唯一ID，用于系统识别
    type: 'enemy', // 类型标识，固定为'enemy'
    name, // 显示名称
    icon, // 显示图标
    description, // 敌人描述文本
    enemies, // 敌人列表数据
  };
}

// ==================== NPC配置模板 ====================

/**
 * 创建NPC交互配置
 * 用于生成完整的NPCInteractable对象
 *
 * @param id - 交互唯一标识符，用于系统内部查找
 * @param name - NPC名称，展示给玩家
 * @param icon - 显示图标，使用emoji格式
 * @param description - NPC描述文本，展示NPC的背景和功能
 * @param location - NPC所在地图ID
 * @param npcType - NPC类型（皇宫、功能、商店、特殊）
 * @param options - 交互选项列表，定义玩家可以进行的交互
 * @returns 完整的NPCInteractable对象
 *
 * @example
 * const merchant = createNPCInteractable(
 *   'merchant_001',
 *   '商人',
 *   '🧑‍💼',
 *   '一位来自远方的商人，正在兜售他的商品。',
 *   'leiming-dalu',
 *   'shop',
 *   [
 *     { text: '购买商品', result: '你浏览了商人的商品...' },
 *     { text: '出售物品', result: '你向商人出售了一些物品...' },
 *   ]
 * );
 */
export function createNPCInteractable(
  id: string,
  name: string,
  icon: string,
  description: string,
  location: string,
  npcType: NPCType,
  options: NPCInteractionOption[]
): NPCInteractable {
  return {
    id, // 交互唯一ID，用于系统识别
    type: 'npc', // 类型标识，固定为'npc'
    name, // NPC名称
    icon, // 显示图标
    description, // NPC描述文本
    location, // NPC所在地图ID
    npcType, // NPC类型
    options, // 交互选项列表
  };
}

// ==================== 动作配置模板 ====================

/**
 * 创建动作交互配置
 * 用于生成完整的ActionInteractable对象
 *
 * @param id - 交互唯一标识符，用于系统内部查找
 * @param name - 动作显示名称，展示给玩家
 * @param icon - 显示图标，使用emoji格式
 * @param actionType - 动作类型，如'mining'、'fishing'、'gathering'等
 * @param actionParams - 动作参数，可选，用于传递额外配置
 * @param description - 动作描述文本，可选
 * @returns 完整的ActionInteractable对象
 *
 * @example
 * const fishingSpot = createActionInteractable(
 *   'river_fishing',
 *   '河边钓鱼',
 *   '🎣',
 *   'fishing',
 *   { difficulty: 'easy', rewards: ['小鱼', '虾'] },
 *   '清澈的河流，适合垂钓。'
 * );
 */
export function createActionInteractable(
  id: string,
  name: string,
  icon: string,
  actionType: ActionType,
  actionParams?: Record<string, unknown>,
  description?: string
): ActionInteractable {
  return {
    id, // 交互唯一ID，用于系统识别
    type: 'action', // 类型标识，固定为'action'
    name, // 动作名称
    icon, // 显示图标
    actionType, // 动作类型
    actionParams, // 动作参数（可选）
    description, // 动作描述（可选）
  };
}

// ==================== 示例配置 ====================

/**
 * 敌人配置示例 - 森林狼群
 * 展示如何使用createEnemyInteractable创建敌人交互
 */
export const exampleEnemyInteractable = createEnemyInteractable(
  'forest_wolves', // 唯一ID
  '森林狼群', // 显示名称
  '🐺', // 图标
  '一群饥饿的狼正在森林深处徘徊，它们发现了你的存在...', // 描述
  [ // 敌人列表
    {
      id: 'wolf_alpha',
      name: '狼王',
      maxHp: 150,
      attack: 25,
      defense: 8,
      description: '狼群的首领，体型巨大，眼神凶狠',
    },
    {
      id: 'wolf_1',
      name: '灰狼',
      maxHp: 80,
      attack: 15,
      defense: 5,
      description: '成年的灰狼，动作敏捷',
    },
    {
      id: 'wolf_2',
      name: '灰狼',
      maxHp: 80,
      attack: 15,
      defense: 5,
      description: '成年的灰狼，动作敏捷',
    },
  ]
);

/**
 * NPC配置示例 - 神秘老者
 * 展示如何使用createNPCInteractable创建NPC交互
 */
export const exampleNPCInteractable = createNPCInteractable(
  'mysterious_elder', // 唯一ID
  '神秘老者', // 显示名称
  '🧙', // 图标
  '一位白发苍苍的老者，眼中闪烁着智慧的光芒。他似乎知道很多秘密...', // 描述
  'leiming-dalu', // 所在地图ID
  'special', // NPC类型
  [ // 交互选项
    {
      text: '请教武学',
      result: '老者传授了你一套呼吸法，你感到内力有所增长。',
      actionType: 'learn_skill',
      actionParams: { skillId: 'breathing_technique' },
    },
    {
      text: '询问传闻',
      result: '老者低声说道："最近魔族大军似乎有了新的动向..."',
    },
    {
      text: '离开',
      result: '你向老者告别。',
    },
  ]
);

/**
 * 动作配置示例 - 深海捕鱼
 * 展示如何使用createActionInteractable创建动作交互
 */
export const exampleActionInteractable = createActionInteractable(
  'deep_sea_fishing', // 唯一ID
  '深海捕鱼', // 显示名称
  '🎣', // 图标
  'fishing', // 动作类型
  { // 动作参数
    difficulty: 'hard', // 难度等级
    requiredLevel: 10, // 所需等级
    rewards: ['金枪鱼', '鲨鱼', '深海珍珠'], // 可能的奖励
    expReward: 50, // 经验奖励
  },
  '深海区域，可以捕获稀有的深海鱼类，但需要一定的钓鱼技巧。' // 描述
);
