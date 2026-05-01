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

