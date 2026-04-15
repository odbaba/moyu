/**
 * 日常任务数据配置文件
 * 定义每日任务的详细配置
 * 参考文档：reference/docs/scripts_analysis/14_NPC系统.md
 */

// 导入日常任务相关类型
import type {
  DailyTask,
  PetTrainingReward,
} from '../types';

// ==================== 训练幻兽任务奖励配置 ====================

/**
 * 训练幻兽任务奖励配置
 * 根据幻兽星级给予不同数量的魔石奖励
 * 参考文档：14_NPC系统.md 第190-196行
 */
export const petTrainingRewards: PetTrainingReward[] = [
  {
    starLevel: 10, // 极品10星
    magicStone: 5000, // 奖励5000魔石
    description: '极品10星攻防型幻兽奖励5000魔石',
  },
  {
    starLevel: 15, // 极品15星
    magicStone: 10000, // 奖励10000魔石
    description: '极品15星攻防型幻兽奖励10000魔石',
  },
  {
    starLevel: 30, // 极品30星
    magicStone: 50000, // 奖励50000魔石
    description: '极品30星攻防型幻兽奖励50000魔石',
  },
];

// ==================== 每日任务配置 ====================

/**
 * 周一任务：收集宝石
 * 任务要求：收集灵魂晶石/灵魂王
 * 任务奖励：大量经验+500功勋
 */
const dailyTaskMonday: DailyTask = {
  id: 'daily_task_monday',
  name: '收集宝石',
  type: 'collect',
  weekday: 1, // 周一
  weekdayName: '周一',
  description: '收集珍贵的灵魂晶石或灵魂王，为王国贡献宝石资源。',
  requirement: {
    type: 'collect',
    target: '灵魂晶石',
    quantity: 1, // 需要收集1个灵魂晶石或灵魂王
    description: '收集灵魂晶石或灵魂王',
  },
  reward: {
    exp: 10000, // 大量经验
    merit: 500, // 500功勋
    description: '大量经验+500功勋',
  },
  npcId: 'npc_daily_task', // 日常任务官
  location: 'leiming-dalu', // 树心城（雷鸣大陆）
  icon: '💎',
};

/**
 * 周二任务：收集宝石
 * 任务要求：收集灵魂晶石/灵魂王
 * 任务奖励：大量经验+500功勋
 */
const dailyTaskTuesday: DailyTask = {
  id: 'daily_task_tuesday',
  name: '收集宝石',
  type: 'collect',
  weekday: 2, // 周二
  weekdayName: '周二',
  description: '继续收集珍贵的灵魂晶石或灵魂王，为王国贡献宝石资源。',
  requirement: {
    type: 'collect',
    target: '灵魂晶石',
    quantity: 1, // 需要收集1个灵魂晶石或灵魂王
    description: '收集灵魂晶石或灵魂王',
  },
  reward: {
    exp: 10000, // 大量经验
    merit: 500, // 500功勋
    description: '大量经验+500功勋',
  },
  npcId: 'npc_daily_task', // 日常任务官
  location: 'leiming-dalu', // 树心城（雷鸣大陆）
  icon: '💎',
};

/**
 * 周三任务：训练幻兽
 * 任务要求：上交攻防型幻兽
 * 任务奖励：魔石+1000战功（具体魔石数量根据幻兽星级决定）
 */
const dailyTaskWednesday: DailyTask = {
  id: 'daily_task_wednesday',
  name: '训练幻兽',
  type: 'train',
  weekday: 3, // 周三
  weekdayName: '周三',
  description: '训练并上交攻防型幻兽，展示你的幻兽培养能力。',
  requirement: {
    type: 'submit',
    target: '攻防型幻兽',
    quantity: 1, // 需要上交1只攻防型幻兽
    description: '上交攻防型幻兽（星级越高奖励越多）',
  },
  reward: {
    battleExp: 1000, // 1000战功
    magicStone: 5000, // 基础魔石奖励（实际根据幻兽星级决定）
    description: '魔石+1000战功（幻兽星级越高魔石越多）',
  },
  npcId: 'npc_daily_task', // 日常任务官
  location: 'leiming-dalu', // 树心城（雷鸣大陆）
  icon: '🐉',
};

/**
 * 周四任务：训练幻兽
 * 任务要求：上交攻防型幻兽
 * 任务奖励：魔石+1000战功（具体魔石数量根据幻兽星级决定）
 */
const dailyTaskThursday: DailyTask = {
  id: 'daily_task_thursday',
  name: '训练幻兽',
  type: 'train',
  weekday: 4, // 周四
  weekdayName: '周四',
  description: '继续训练并上交攻防型幻兽，展示你的幻兽培养能力。',
  requirement: {
    type: 'submit',
    target: '攻防型幻兽',
    quantity: 1, // 需要上交1只攻防型幻兽
    description: '上交攻防型幻兽（星级越高奖励越多）',
  },
  reward: {
    battleExp: 1000, // 1000战功
    magicStone: 5000, // 基础魔石奖励（实际根据幻兽星级决定）
    description: '魔石+1000战功（幻兽星级越高魔石越多）',
  },
  npcId: 'npc_daily_task', // 日常任务官
  location: 'leiming-dalu', // 树心城（雷鸣大陆）
  icon: '🐉',
};

/**
 * 周五任务：突袭
 * 任务要求：消灭雪域边境冰雪巨人
 * 任务奖励：大量战功
 */
const dailyTaskFriday: DailyTask = {
  id: 'daily_task_friday',
  name: '突袭',
  type: 'raid',
  weekday: 5, // 周五
  weekdayName: '周五',
  description: '前往雪域边境，消灭强大的冰雪巨人，保卫王国的安全。',
  requirement: {
    type: 'defeat',
    target: '冰雪巨人',
    quantity: 1, // 需要消灭1个冰雪巨人
    description: '消灭雪域边境冰雪巨人',
  },
  reward: {
    battleExp: 10000, // 大量战功（10000点）
    description: '大量战功（10000点）',
  },
  npcId: 'npc_daily_task', // 日常任务官
  location: 'leiming-dalu', // 树心城（雷鸣大陆）
  icon: '⚔️',
};

/**
 * 周六任务：PK赛
 * 任务要求：参加PK比赛
 * 任务奖励：丰厚奖励
 */
const dailyTaskSaturday: DailyTask = {
  id: 'daily_task_saturday',
  name: 'PK赛',
  type: 'pk',
  weekday: 6, // 周六
  weekdayName: '周六',
  description: '参加激烈的PK比赛，与其他冒险者一决高下！',
  requirement: {
    type: 'participate',
    target: 'PK比赛',
    quantity: 1, // 需要参加1场PK比赛
    description: '参加PK比赛',
  },
  reward: {
    exp: 5000, // 经验奖励
    magicStone: 1000, // 魔石奖励
    items: ['月光宝盒'], // 物品奖励
    description: '丰厚奖励（经验、魔石、月光宝盒等）',
  },
  npcId: 'npc_pk_match', // PK赛报名官
  location: 'huanggong', // 皇宫
  icon: '🏆',
};

/**
 * 周日任务：地下城
 * 任务要求：前往地下城破坏魔族会议
 * 任务奖励：功勋值
 */
const dailyTaskSunday: DailyTask = {
  id: 'daily_task_sunday',
  name: '地下城',
  type: 'dungeon',
  weekday: 0, // 周日
  weekdayName: '周日',
  description: '前往地下城，破坏魔族的会议，阻止他们的阴谋！',
  requirement: {
    type: 'complete',
    target: '地下城',
    quantity: 1, // 需要完成1次地下城
    description: '前往地下城破坏魔族会议',
  },
  reward: {
    merit: 1000, // 功勋值奖励
    exp: 8000, // 经验奖励
    description: '功勋值（1000点）+经验',
  },
  npcId: 'npc_daily_task', // 日常任务官
  location: 'leiming-dalu', // 树心城（雷鸣大陆）
  icon: '🏰',
};

// ==================== 任务配置映射表 ====================

/**
 * 日常任务配置映射表
 * 按任务ID组织，便于快速查找
 */
export const dailyTaskConfig: Record<string, DailyTask> = {
  daily_task_monday: dailyTaskMonday,
  daily_task_tuesday: dailyTaskTuesday,
  daily_task_wednesday: dailyTaskWednesday,
  daily_task_thursday: dailyTaskThursday,
  daily_task_friday: dailyTaskFriday,
  daily_task_saturday: dailyTaskSaturday,
  daily_task_sunday: dailyTaskSunday,
};

/**
 * 按星期分组的任务配置
 * 索引0=周日，1=周一，...，6=周六
 */
export const dailyTasksByWeekday: Record<number, DailyTask> = {
  0: dailyTaskSunday, // 周日
  1: dailyTaskMonday, // 周一
  2: dailyTaskTuesday, // 周二
  3: dailyTaskWednesday, // 周三
  4: dailyTaskThursday, // 周四
  5: dailyTaskFriday, // 周五
  6: dailyTaskSaturday, // 周六
};

/**
 * 所有日常任务列表
 */
export const allDailyTasks: DailyTask[] = [
  dailyTaskMonday,
  dailyTaskTuesday,
  dailyTaskWednesday,
  dailyTaskThursday,
  dailyTaskFriday,
  dailyTaskSaturday,
  dailyTaskSunday,
];

// ==================== 辅助函数 ====================

/**
 * 根据幻兽星级获取训练任务奖励
 * @param starLevel 幻兽星级
 * @returns 奖励配置，如果没有匹配则返回基础奖励
 */
export function getPetTrainingReward(starLevel: number): PetTrainingReward | null {
  // 查找匹配的奖励配置
  const reward = petTrainingRewards.find(r => r.starLevel === starLevel);

  if (reward) {
    return reward;
  }

  // 如果没有精确匹配，返回最接近的低星级奖励
  const lowerReward = petTrainingRewards
    .filter(r => r.starLevel <= starLevel)
    .sort((a, b) => b.starLevel - a.starLevel)[0];

  return lowerReward || null;
}

/**
 * 获取所有日常任务的简要描述
 * 用于NPC对话显示
 * @returns 任务描述文本
 */
export function getDailyTasksDescription(): string {
  return `日常任务说明：

周一/周二：收集宝石（收集灵魂晶石/灵魂王）
奖励：大量经验+500功勋

周三/周四：训练幻兽（上交攻防型幻兽）
奖励：魔石+1000战功

周五：突袭（消灭雪域边境冰雪巨人）
奖励：大量战功

周六：PK赛（参加PK比赛）
奖励：丰厚奖励

周日：地下城（前往地下城破坏魔族会议）
奖励：功勋值`;
}
