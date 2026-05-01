/**
 * NPC系统工具函数
 * 提供NPC选项条件判断等功能
 */

import type { NPCInteractionCondition } from '../types';

/**
 * 游戏状态接口
 * 用于NPC选项条件判断
 */
export interface NPCGameState {
  currentWeekday: number; // 当前星期（0=周日, 1=周一, ..., 6=周六）
  relationshipLevel: number; // 公主关系等级（0-6）
  militaryRank: number; // 军衔等级（0-11）
  nobleRank: number; // 爵位等级（0-6）
  warSoulSystemEnabled?: boolean; // 战魂系统是否已开启（可选）
  [key: string]: any; // 其他自定义状态
}

/**
 * 比较运算符类型
 */
type CompareOperator = 'eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'ne';

/**
 * 执行比较运算
 * @param a 左操作数
 * @param b 右操作数
 * @param operator 比较运算符
 * @returns 比较结果
 */
const compare = (a: number, b: number, operator: CompareOperator): boolean => {
  switch (operator) {
    case 'eq':
      return a === b;
    case 'gt':
      return a > b;
    case 'gte':
      return a >= b;
    case 'lt':
      return a < b;
    case 'lte':
      return a <= b;
    case 'ne':
      return a !== b;
    default:
      return a === b;
  }
};

/**
 * 检查 NPC 选项是否应该显示
 * @param condition 条件配置
 * @param gameState 游戏状态（包含时间、角色数据等）
 * @returns 是否显示该选项
 *
 * @example
 * // 周日显示
 * checkNPCOptionCondition({ type: 'weekday', value: 0 }, gameState)
 *
 * // 关系等级>=4时显示
 * checkNPCOptionCondition({ type: 'relationship', value: 4, operator: 'gte' }, gameState)
 *
 * // 军衔>5时显示
 * checkNPCOptionCondition({ type: 'militaryRank', value: 5, operator: 'gt' }, gameState)
 */
export const checkNPCOptionCondition = (
  condition: NPCInteractionCondition | undefined,
  gameState: NPCGameState
): boolean => {
  // 如果没有条件配置，默认显示
  if (!condition) {
    return true;
  }

  // 获取比较运算符，默认为等于
  const operator = (condition.operator || 'eq') as CompareOperator;

  switch (condition.type) {
    case 'weekday':
      // 判断当前是否为指定星期（0=周日, 1=周一, ..., 6=周六）
      return compare(gameState.currentWeekday, condition.value as number, operator);

    case 'relationship':
      // 判断公主关系等级是否满足条件（0-6）
      return compare(gameState.relationshipLevel, condition.value as number, operator);

    case 'militaryRank':
      // 判断军衔等级是否满足条件（0-11）
      return compare(gameState.militaryRank, condition.value as number, operator);

    case 'nobleRank':
      // 判断爵位等级是否满足条件（0-6）
      return compare(gameState.nobleRank, condition.value as number, operator);

    case 'warSoulEnabled':
      // 判断战魂系统是否已开启
      // condition.value 为 true 时表示需要战魂系统开启才显示
      // gameState.warSoulSystemEnabled 为 true 表示战魂系统已开启
      if (condition.value === true) {
        return gameState.warSoulSystemEnabled === true;
      }

      // condition.value 为 false 时表示需要战魂系统未开启才显示
      return gameState.warSoulSystemEnabled !== true;

    case 'custom':
      // 自定义条件判断
      // condition.value 应该是一个字符串键，用于在 gameState 中查找对应值
      if (typeof condition.value === 'string') {
        const customValue = gameState[condition.value];
        // 如果 gameState 中存在该键，则进行比较
        if (customValue !== undefined) {
          return compare(customValue, Number(condition.value), operator);
        }
      }
      // 如果 value 是一个函数，则执行该函数
      if (typeof condition.value === 'function') {
        return condition.value(gameState);
      }

      return false;

    default:
      // 未知条件类型，默认显示
      return true;
  }
};

