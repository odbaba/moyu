/**
 * 日常任务系统工具函数
 * 提供日常任务的查询、检查、奖励等功能
 * 参考文档：reference/docs/scripts_analysis/14_NPC系统.md
 */

// 导入日常任务相关类型
// 导入日常任务配置数据
import {
  dailyTaskConfig,
  dailyTasksByWeekday,
  getPetTrainingReward,
} from '../data/dailyTaskData';
import type {
  DailyTask,
  DailyTaskCompletionResult,
  DailyTaskReward,
  DailyTaskStatus,
  InventoryItem,
  Pet,
} from '../types';
import { getExperienceMultiplier } from './developerMode';

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
    inventory?: InventoryItem[]; // 玩家背包
    pets?: Pet[]; // 玩家幻兽列表
    defeatedEnemies?: string[]; // 已击败的敌人列表
    completedDungeons?: string[]; // 已完成的地下城列表
    participatedPK?: boolean; // 是否参加了PK赛
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
  const finalReward: DailyTaskReward = { ...task.reward };

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

// ==================== 突袭任务专用函数 ====================

/**
 * 获取突袭任务的详细描述
 * 参考文档：reference/docs/日常任务官交互逻辑文档.md 第214-240行
 * @param isKingRescued 国王是否已救出
 * @returns 任务描述文本
 */
export function getRaidTaskDescription(isKingRescued: boolean): string {
  const lines: string[] = [];
  lines.push('【突袭任务】');
  lines.push('');

  if (isKingRescued) {
    // 已救出国王的任务描述
    lines.push('任务描述：');
    lines.push('虽然雪域边境已经是我们收复的领地了，但还不时有魔族军队侵扰，');
    lines.push('我们要趁着敌人还没有发觉时派遣轻骑兵前往袭击敌人，');
    lines.push('敌人不是很多，但都是精捍部队，勇士一定要小心。');
  } else {
    // 未救出国王的任务描述
    lines.push('任务描述：');
    lines.push('据探子回报，魔族大军部分已经进入到了雪域边境，');
    lines.push('趁着敌人还未站稳脚人类军队要派遣轻骑兵前往袭击敌人。');
    lines.push('不过敌人的战斗力还是非常强，战斗肯定会非常艰苦和危险，');
    lines.push('你是否愿意前往杀敌？');
  }

  lines.push('');
  lines.push('任务要求：');
  lines.push('  从冰宫进入雪域边境');
  lines.push('  消灭冰雪巨人');
  lines.push('');
  lines.push('任务奖励：');
  lines.push('  消灭每个冰雪巨人获得大量战功');

  return lines.join('\n');
}

// ==================== PK赛任务专用函数 ====================

/**
 * 获取PK赛任务的详细描述
 * 参考文档：reference/docs/日常任务官交互逻辑文档.md 第260-287行
 * @returns 任务描述文本
 */
export function getPKTaskDescription(): string {
  const lines: string[] = [];
  lines.push('【PK赛任务】');
  lines.push('');
  lines.push('任务描述：');
  lines.push('今天任务：PK赛');
  lines.push('请到[皇宫][周赛PK报名官]那里报名参加比赛。');
  lines.push('');
  lines.push('任务要求：');
  lines.push('  前往皇宫');
  lines.push('  找PK赛报名官报名参加比赛');
  lines.push('');
  lines.push('PK赛奖励：');
  lines.push('  60级组：高级飞天连斩、大量经验、魔石');
  lines.push('  100级组：高级飞天连斩、大量经验、魔石、月光宝盒加强版');
  lines.push('  100级以上组：高级斗志昂扬、大量经验、魔石、月光宝盒加强版、电浆药水、999朵白玫瑰');
  lines.push('');
  lines.push('注意事项：');
  lines.push('  - PK赛只在周六开放');
  lines.push('  - 需要到皇宫找PK赛报名官报名');

  return lines.join('\n');
}

// ==================== 地下城任务专用函数 ====================

/**
 * 获取地下城任务的详细描述
 * 参考文档：reference/docs/日常任务官交互逻辑文档.md 第290-348行
 * @param isKingRescued 国王是否已救出
 * @returns 任务描述文本
 */
export function getDungeonTaskDescription(isKingRescued: boolean): string {
  const lines: string[] = [];
  lines.push('【地下城任务】');
  lines.push('');

  if (isKingRescued) {
    // 已救出国王的任务描述
    lines.push('任务描述：');
    lines.push('探子来报说，今天在魔族将领某个地下城里举行了军事会议，');
    lines.push('国王已经发布悬赏任务招募勇士前去破坏魔族会议和消灭魔族将领。');
  } else {
    // 未救出国王的任务描述
    lines.push('任务描述：');
    lines.push('探子来报说，今天在魔族将领某个地下城里举行了军事会议，');
    lines.push('国家军事指挥部并打听国王下落。地下城共有三层，');
    lines.push('只有消灭门口那队怪物后才能进入下一层，进入到每一层都会有奖励。');
  }

  lines.push('');
  lines.push('任务要求：');
  lines.push('  前往地下城');
  lines.push('  消灭各层怪物');
  lines.push('  破坏魔族会议');
  lines.push('');
  lines.push('任务奖励：');
  lines.push('  消灭怪物越多，获得功勋值越高');
  lines.push('  每层都有奖励');
  lines.push('');
  lines.push('注意事项：');

  if (isKingRescued) {
    lines.push('  - 已救出国王：直接传送到地下城3层');
  } else {
    lines.push('  - 未救出国王：从地下城1层开始');
  }

  lines.push('  - 地下城怪物在周六刷新');

  return lines.join('\n');
}

// ==================== 任务通用函数 ====================

/**
 * 根据当前星期获取任务描述
 * @param weekday 星期几（0=周日, 1=周一, ..., 6=周六）
 * @param playerLevel 玩家等级
 * @param isKingRescued 国王是否已救出
 * @returns 任务描述文本
 */
export function getDailyTaskDescriptionByWeekday(
  weekday: number,
  playerLevel: number,
  isKingRescued: boolean
): string {
  switch (weekday) {
    case 1: // 周一
    case 2: // 周二
      return getGemTaskDescription(playerLevel);

    case 3: // 周三
    case 4: // 周四
      return getPetTrainingTaskDescription();

    case 5: // 周五
      return getRaidTaskDescription(isKingRescued);

    case 6: // 周六
      return getPKTaskDescription();

    case 0: // 周日
      return getDungeonTaskDescription(isKingRescued);

    default:
      return '今天没有可接受的任务';
  }
}

/**
 * 获取任务传送目标地点
 * @param weekday 星期几
 * @returns 传送目标地点ID，如果不需要传送则返回null
 */
export function getTaskTeleportLocation(weekday: number): string | null {
  switch (weekday) {
    case 5: // 周五：传送到雪域边境
      return 'xueyu-bianjing';

    case 6: // 周六：传送到皇宫
      return 'huanggong';

    case 0: // 周日：传送到地下城
      return 'dixiacheng-1'; // 地下城1层

    default:
      return null;
  }
}

// ==================== 训练幻兽任务专用函数 ====================

/**
 * 检查幻兽是否符合训练任务的要求
 * 参考文档：reference/docs/日常任务官交互逻辑文档.md 第173-175行
 * @param pet 幻兽对象
 * @returns 是否符合要求
 */
export function checkPetRequirement(pet: Pet): boolean {
  // 检查是否为攻防型幻兽
  if (pet.hs_name !== '攻防型') {
    return false;
  }

  // 检查品质（品质分 >= 500，约等于极品10星）
  // 参考文档：品质分 ≥ 500 对应极品10星以上
  if (pet.pz < 500) {
    return false;
  }

  return true;
}

/**
 * 根据幻兽品质计算奖励魔石数量
 * 参考文档：reference/docs/日常任务官交互逻辑文档.md 第178-183行
 * @param petQuality 幻兽品质分
 * @returns 奖励魔石数量
 */
export function calculatePetRewardByQuality(petQuality: number): {
  magicStone: number;
  starLevel: string;
} {
  // 根据品质分估算星级
  // 品质分 1000-1499：极品10星
  // 品质分 1500-2999：极品15星
  // 品质分 >= 3000：极品30星
  if (petQuality >= 3000) {
    return {
      magicStone: 50000,
      starLevel: '极品30星',
    };
  } else if (petQuality >= 1500) {
    return {
      magicStone: 10000,
      starLevel: '极品15星',
    };
  } else if (petQuality >= 1000) {
    return {
      magicStone: 5000,
      starLevel: '极品10星',
    };
  } else {
    // 品质分 500-999：极品（低于10星）
    return {
      magicStone: 5000,
      starLevel: '极品',
    };
  }
}

/**
 * 获取训练幻兽任务的详细描述
 * @returns 任务描述文本
 */
export function getPetTrainingTaskDescription(): string {
  const lines: string[] = [];
  lines.push('【训练幻兽任务】');
  lines.push('');
  lines.push('任务描述：');
  lines.push('为了组织强大的军队与魔族战斗，国家军队需要扩编一支战斗力强悍幻兽队伍，');
  lines.push('国家出了很高价钱来招收符合要求的幻兽。');
  lines.push('');
  lines.push('任务要求：');
  lines.push('  幻兽类型：攻防型');
  lines.push('  幻兽品质：极品10星以上（品质分 ≥ 500）');
  lines.push('');
  lines.push('任务奖励：');
  lines.push('  极品10星（品质分 1000-1499）：5,000魔石 + 1,000战功');
  lines.push('  极品15星（品质分 1500-2999）：10,000魔石 + 1,000战功');
  lines.push('  极品30星（品质分 ≥ 3000）：50,000魔石 + 1,000战功');
  lines.push('');
  lines.push('注意事项：');
  lines.push('  - 上交的幻兽会被消耗，请谨慎选择');
  lines.push('  - 品质分越高，获得的魔石奖励越多');

  return lines.join('\n');
}

/**
 * 从幻兽列表中移除指定的幻兽
 * @param pets 幻兽列表
 * @param petId 要移除的幻兽ID
 * @returns 更新后的幻兽列表
 */
export function removePetFromList(pets: Pet[], petId: string): Pet[] {
  return pets.filter(pet => pet.id !== petId);
}

/**
 * 获取符合训练任务要求的幻兽列表
 * @param pets 玩家幻兽列表
 * @returns 符合要求的幻兽列表
 */
export function getValidPetsForTraining(pets: Pet[]): Pet[] {
  return pets.filter(pet => checkPetRequirement(pet));
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
function checkTrainTask(_task: DailyTask, pets: Pet[]): boolean {
  // 查找符合要求的幻兽（攻防型）
  const validPet = pets.find(pet => {
    // 检查是否为攻防型幻兽
    if (pet.hs_name !== '攻防型') {
      return false;
    }

    // 检查品质是否为极品（品质称号包含"极品"）
    if (!pet.qualityTitle.includes('极品')) {
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
function checkDungeonTask(_task: DailyTask, completedDungeons: string[]): boolean {
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
    return pet.hs_name === '攻防型' && pet.qualityTitle.includes('极品');
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

// ==================== 收集宝石任务专用函数 ====================

/**
 * 根据玩家等级计算收集宝石任务的需求
 * 参考文档：reference/docs/日常任务官交互逻辑文档.md 第109-116行
 * @param playerLevel 玩家等级
 * @returns 需求配置（物品类型和数量）
 */
export function calculateGemRequirement(playerLevel: number): {
  type: '灵魂晶石' | '灵魂王';
  quantity: number;
  description: string;
} {
  if (playerLevel < 100) {
    // 100级以下：收集灵魂晶石
    const quantity = Math.floor((playerLevel + 10) / 10);

    return {
      type: '灵魂晶石',
      quantity,
      description: `收集${quantity}个灵魂晶石`,
    };
  } else if (playerLevel < 110) {
    // 100-109级：收集灵魂王 2个
    return {
      type: '灵魂王',
      quantity: 2,
      description: '收集2个灵魂王',
    };
  } else if (playerLevel < 120) {
    // 110-119级：收集灵魂王 5个
    return {
      type: '灵魂王',
      quantity: 5,
      description: '收集5个灵魂王',
    };
  } else {
    // 120级及以上：收集灵魂王 10个
    return {
      type: '灵魂王',
      quantity: 10,
      description: '收集10个灵魂王',
    };
  }
}

/**
 * 计算收集宝石任务的奖励（根据开发者模式调整经验）
 * 参考文档：reference/docs/日常任务官交互逻辑文档.md 第118-126行
 * @param itemType 物品类型（'灵魂晶石' 或 '灵魂王'）
 * @param quantity 物品数量
 * @returns 奖励配置
 */
export function calculateGemReward(
  itemType: string,
  quantity: number
): DailyTaskReward {
  const multiplier = getExperienceMultiplier();

  if (itemType === '灵魂晶石') {
    // 收集灵魂晶石：经验 = 30000 × 数量，功勋 = 500
    const exp = Math.floor(30000 * quantity * multiplier);

    return {
      exp,
      merit: 500,
      description: `${exp}经验 + 500功勋`,
    };
  } else {
    // 收集灵魂王：经验 = 210000 × 数量，功勋 = 2000
    const exp = Math.floor(210000 * quantity * multiplier);

    return {
      exp,
      merit: 2000,
      description: `${exp}经验 + 2000功勋`,
    };
  }
}

/**
 * 检查背包中是否有足够的宝石物品
 * @param inventory 玩家背包
 * @param itemType 物品类型
 * @param quantity 所需数量
 * @returns 是否有足够的物品
 */
export function checkGemInInventory(
  inventory: InventoryItem[],
  itemType: string,
  quantity: number
): boolean {
  const item = inventory.find(item => item.name === itemType);

  return item !== undefined && item.quantity >= quantity;
}

/**
 * 从背包中消耗宝石物品
 * @param inventory 玩家背包
 * @param itemType 物品类型
 * @param quantity 消耗数量
 * @returns 更新后的背包
 */
export function consumeGemFromInventory(
  inventory: InventoryItem[],
  itemType: string,
  quantity: number
): InventoryItem[] {
  return inventory.map(item => {
    if (item.name === itemType && item.quantity >= quantity) {
      return {
        ...item,
        quantity: item.quantity - quantity,
      };
    }

    return item;
  }).filter(item => item.quantity > 0); // 移除数量为0的物品
}

/**
 * 获取收集宝石任务的详细描述
 * 根据玩家等级动态生成任务描述
 * @param playerLevel 玩家等级
 * @returns 任务描述文本
 */
export function getGemTaskDescription(playerLevel: number): string {
  const requirement = calculateGemRequirement(playerLevel);
  const reward = calculateGemReward(requirement.type, requirement.quantity);

  const lines: string[] = [];
  lines.push('【收集宝石任务】');
  lines.push('');
  lines.push('任务描述：');
  lines.push('据说灵魂晶石里蕴含着强大的能量，还可以用于精练武器装备以提升品质，');
  lines.push('所以国家正在大量收集灵魂晶石。你是否愿意帮助收集一些灵魂晶石？');
  lines.push('');
  lines.push('任务要求：');
  lines.push(`  ${requirement.description}`);
  lines.push('');
  lines.push('任务奖励：');
  lines.push(`  ${reward.description}`);

  return lines.join('\n');
}
