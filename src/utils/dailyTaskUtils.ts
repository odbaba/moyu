/**
 * 日常任务系统工具函数
 * 提供日常任务的查询、检查、奖励等功能
 * 参考文档：reference/docs/scripts_analysis/14_NPC系统.md
 */

// 导入日常任务相关类型
// 导入日常任务配置数据
import {
  dailyTasksByWeekday,
} from '../data/dailyTaskData';
import type {
  DailyTask,
  DailyTaskReward,
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

// ==================== 其他辅助函数 ====================

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
