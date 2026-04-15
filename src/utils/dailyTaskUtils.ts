/**
 * 日常任务系统工具函数
 * 提供日常任务的查询、检查、奖励等功能
 * 参考文档：reference/docs/scripts_analysis/14_NPC系统.md
 */

// 导入日常任务相关类型
import type {
  DailyTask,
  DailyTaskStatus,
  DailyTaskReward,
  DailyTaskCompletionResult,
  CharacterData,
  InventoryItem,
  Pet,
} from '../types';

// 导入日常任务配置数据
import {
  dailyTaskConfig,
  dailyTasksByWeekday,
  getPetTrainingReward,
} from '../data/dailyTaskData';

// ==================== 核心功能函数 ====================

/**
 * 获取指定星期的日常任务
 * @param weekday 星期几（0=周日, 1=周一, ..., 6=周六）
 * @returns 日常任务配置，如果不存在则返回null
 * 
 * @example
 * const task = getDailyTask(1); // 获取周一的任务
 * console.log(task.name); // "收集宝石"
 */
export function getDailyTask(weekday: number): DailyTask | null {
  // 验证星期参数有效性
  if (weekday < 0 || weekday > 6) {
    console.error(`无效的星期参数: ${weekday}，应为0-6`);
    return null;
  }
  
  // 从配置中获取对应星期的任务
  return dailyTasksByWeekday[weekday] || null;
}

/**
 * 检查任务是否完成
 * @param taskId 任务ID
 * @param playerData 玩家数据（包含背包、幻兽等信息）
 * @param taskStatus 任务状态（可选，如果提供则直接检查状态）
 * @returns 任务是否完成
 * 
 * @example
 * const isCompleted = checkTaskCompletion('daily_task_monday', playerData);
 */
export function checkTaskCompletion(
  taskId: string,
  playerData: {
    inventory?: InventoryItem[];      // 玩家背包
    pets?: Pet[];                     // 玩家幻兽列表
    defeatedEnemies?: string[];       // 已击败的敌人列表
    completedDungeons?: string[];     // 已完成的地下城列表
    participatedPK?: boolean;         // 是否参加了PK赛
  },
  taskStatus?: DailyTaskStatus
): boolean {
  // 如果提供了任务状态，直接返回完成状态
  if (taskStatus && taskStatus.isCompleted) {
    return true;
  }
  
  // 获取任务配置
  const task = dailyTaskConfig[taskId];
  if (!task) {
    console.error(`任务不存在: ${taskId}`);
    return false;
  }
  
  // 根据任务类型检查完成条件
  switch (task.type) {
    case 'collect':
      // 收集类任务：检查背包中是否有指定物品
      return checkCollectTask(task, playerData.inventory || []);
    
    case 'train':
      // 训练类任务：检查是否有符合要求的幻兽
      return checkTrainTask(task, playerData.pets || []);
    
    case 'raid':
      // 突袭类任务：检查是否击败了指定敌人
      return checkRaidTask(task, playerData.defeatedEnemies || []);
    
    case 'pk':
      // PK赛任务：检查是否参加了PK赛
      return playerData.participatedPK || false;
    
    case 'dungeon':
      // 地下城任务：检查是否完成了地下城
      return checkDungeonTask(task, playerData.completedDungeons || []);
    
    default:
      console.error(`未知的任务类型: ${task.type}`);
      return false;
  }
}

/**
 * 领取任务奖励
 * @param taskId 任务ID
 * @param playerData 玩家数据
 * @returns 奖励领取结果
 * 
 * @example
 * const result = claimTaskReward('daily_task_monday', playerData);
 * if (result.success) {
 *   console.log('奖励已领取:', result.rewards);
 * }
 */
export function claimTaskReward(
  taskId: string,
  playerData: {
    inventory?: InventoryItem[];
    pets?: Pet[];
    defeatedEnemies?: string[];
    completedDungeons?: string[];
    participatedPK?: boolean;
  }
): DailyTaskCompletionResult {
  // 获取任务配置
  const task = dailyTaskConfig[taskId];
  if (!task) {
    return {
      success: false,
      message: '任务不存在',
    };
  }
  
  // 检查任务是否完成
  const isCompleted = checkTaskCompletion(taskId, playerData);
  if (!isCompleted) {
    return {
      success: false,
      message: '任务尚未完成，无法领取奖励',
    };
  }
  
  // 计算奖励（针对训练幻兽任务需要特殊处理）
  let finalReward: DailyTaskReward = { ...task.reward };
  
  if (task.type === 'train' && playerData.pets) {
    // 训练幻兽任务：根据幻兽星级计算魔石奖励
    const petReward = calculatePetTrainingReward(playerData.pets);
    if (petReward) {
      finalReward.magicStone = petReward.magicStone;
      finalReward.description = petReward.description;
    }
  }
  
  // 返回成功结果
  return {
    success: true,
    message: `恭喜完成任务【${task.name}】！获得奖励：${finalReward.description}`,
    rewards: finalReward,
  };
}

/**
 * 获取任务描述
 * @param task 日常任务对象
 * @returns 格式化的任务描述文本
 * 
 * @example
 * const task = getDailyTask(1);
 * const description = getTaskDescription(task);
 * console.log(description);
 */
export function getTaskDescription(task: DailyTask): string {
  // 构建任务描述
  const lines: string[] = [];
  
  // 任务标题
  lines.push(`【${task.name}】`);
  lines.push('');
  
  // 任务基本信息
  lines.push(`📅 时间：${task.weekdayName}`);
  lines.push(`📍 地点：${task.location}`);
  lines.push('');
  
  // 任务描述
  lines.push('📝 任务描述：');
  lines.push(task.description);
  lines.push('');
  
  // 任务要求
  lines.push('🎯 任务要求：');
  lines.push(`  ${task.requirement.description}`);
  if (task.requirement.quantity > 1) {
    lines.push(`  数量：${task.requirement.quantity}`);
  }
  lines.push('');
  
  // 任务奖励
  lines.push('🎁 任务奖励：');
  lines.push(`  ${task.reward.description}`);
  
  // 详细奖励信息
  const rewardDetails: string[] = [];
  if (task.reward.exp) {
    rewardDetails.push(`经验: ${task.reward.exp}`);
  }
  if (task.reward.merit) {
    rewardDetails.push(`功勋: ${task.reward.merit}`);
  }
  if (task.reward.battleExp) {
    rewardDetails.push(`战功: ${task.reward.battleExp}`);
  }
  if (task.reward.magicStone) {
    rewardDetails.push(`魔石: ${task.reward.magicStone}`);
  }
  if (task.reward.items && task.reward.items.length > 0) {
    rewardDetails.push(`物品: ${task.reward.items.join(', ')}`);
  }
  
  if (rewardDetails.length > 0) {
    lines.push(`  (${rewardDetails.join(' | ')})`);
  }
  
  return lines.join('\n');
}

// ==================== 辅助检查函数 ====================

/**
 * 检查收集类任务是否完成
 * @param task 任务配置
 * @param inventory 玩家背包
 * @returns 是否完成
 */
function checkCollectTask(task: DailyTask, inventory: InventoryItem[]): boolean {
  const target = task.requirement.target;
  const quantity = task.requirement.quantity;
  
  // 查找背包中的目标物品
  const item = inventory.find(
    item => item.name === target || 
            item.name === '灵魂晶石' || 
            item.name === '灵魂王'
  );
  
  // 检查数量是否足够
  return item !== undefined && item.quantity >= quantity;
}

/**
 * 检查训练类任务是否完成
 * @param task 任务配置
 * @param pets 玩家幻兽列表
 * @returns 是否完成
 */
function checkTrainTask(task: DailyTask, pets: Pet[]): boolean {
  const target = task.requirement.target;
  
  // 查找符合要求的幻兽（攻防型）
  const validPet = pets.find(pet => {
    // 检查是否为攻防型幻兽
    if (pet.hs_name !== '攻防型') {
      return false;
    }
    
    // 检查品质是否为极品
    if (pet.quality !== '极品') {
      return false;
    }
    
    // 检查星级（至少10星）
    if (pet.pz < 1000) { // 评分1000对应约10星
      return false;
    }
    
    return true;
  });
  
  return validPet !== undefined;
}

/**
 * 检查突袭类任务是否完成
 * @param task 任务配置
 * @param defeatedEnemies 已击败的敌人列表
 * @returns 是否完成
 */
function checkRaidTask(task: DailyTask, defeatedEnemies: string[]): boolean {
  const target = task.requirement.target;
  
  // 检查是否击败了目标敌人
  return defeatedEnemies.some(
    enemy => enemy.includes(target) || enemy === '冰雪巨人'
  );
}

/**
 * 检查地下城任务是否完成
 * @param task 任务配置
 * @param completedDungeons 已完成的地下城列表
 * @returns 是否完成
 */
function checkDungeonTask(task: DailyTask, completedDungeons: string[]): boolean {
  // 检查是否完成了地下城
  return completedDungeons.some(
    dungeon => dungeon.includes('地下城') || dungeon.includes('魔族会议')
  );
}

/**
 * 计算训练幻兽任务的奖励
 * @param pets 玩家幻兽列表
 * @returns 奖励配置
 */
function calculatePetTrainingReward(pets: Pet[]): { magicStone: number; description: string } | null {
  // 找到符合条件的最高星级幻兽
  const validPets = pets.filter(pet => {
    return pet.hs_name === '攻防型' && pet.quality === '极品';
  });
  
  if (validPets.length === 0) {
    return null;
  }
  
  // 按评分排序，取最高的
  const bestPet = validPets.sort((a, b) => b.pz - a.pz)[0];
  
  // 根据评分估算星级（评分/100 ≈ 星级）
  const estimatedStar = Math.floor(bestPet.pz / 100);
  
  // 获取对应的奖励配置
  const rewardConfig = getPetTrainingReward(estimatedStar);
  
  if (rewardConfig) {
    return {
      magicStone: rewardConfig.magicStone,
      description: rewardConfig.description,
    };
  }
  
  // 默认奖励
  return {
    magicStone: 5000,
    description: '极品攻防型幻兽奖励5000魔石',
  };
}

// ==================== 其他辅助函数 ====================

/**
 * 获取当前星期的任务
 * @returns 当前星期的任务配置
 */
export function getCurrentDailyTask(): DailyTask | null {
  // 获取当前星期（0=周日, 1=周一, ..., 6=周六）
  const today = new Date().getDay();
  return getDailyTask(today);
}

/**
 * 获取任务状态描述
 * @param taskStatus 任务状态
 * @returns 状态描述文本
 */
export function getTaskStatusDescription(taskStatus: DailyTaskStatus): string {
  if (taskStatus.isRewarded) {
    return '✅ 已领取奖励';
  }
  
  if (taskStatus.isCompleted) {
    return '🎉 任务完成，可领取奖励';
  }
  
  if (taskStatus.isAccepted) {
    const progress = `${taskStatus.progress}/${taskStatus.targetProgress}`;
    return `🔄 进行中 (${progress})`;
  }
  
  return '⏳ 未接受';
}

/**
 * 验证任务ID是否有效
 * @param taskId 任务ID
 * @returns 是否有效
 */
export function isValidTaskId(taskId: string): boolean {
  return taskId in dailyTaskConfig;
}

/**
 * 获取所有可用的任务ID列表
 * @returns 任务ID数组
 */
export function getAllTaskIds(): string[] {
  return Object.keys(dailyTaskConfig);
}

/**
 * 获取任务进度百分比
 * @param taskStatus 任务状态
 * @returns 进度百分比（0-100）
 */
export function getTaskProgressPercentage(taskStatus: DailyTaskStatus): number {
  if (taskStatus.targetProgress === 0) {
    return 0;
  }
  
  const percentage = (taskStatus.progress / taskStatus.targetProgress) * 100;
  return Math.min(100, Math.max(0, percentage));
}
