/**
 * 日常任务状态管理工具函数
 * 提供任务状态的初始化、重置、检查等功能
 * 参考文档：reference/docs/日常任务官交互逻辑文档.md
 */

// 导入日常任务状态类型
import type { DailyTaskState } from '../types';

// ==================== 状态初始化函数 ====================

/**
 * 创建初始的日常任务状态
 * 所有任务标记为可完成，所有怪物设置为存在
 * @returns 初始化的任务状态对象
 */
export function createInitialDailyTaskState(): DailyTaskState {
  return {
    // 任务完成标记 - 初始时所有任务都可以完成
    rw_bs: true, // BOSS任务（收集宝石）可完成
    rw_hs: true, // 幻兽任务（训练幻兽）可完成
    rw_dxc: true, // 地下城任务可完成

    // 地下城怪物状态 - 初始时所有怪物都存在
    rw_gw1_1: true, // 地下城1层怪物1存在
    rw_gw1_2: true, // 地下城1层怪物2存在
    rw_gw1_3: true, // 地下城1层怪物3存在
    rw_gw2_1: true, // 地下城2层怪物1存在
    rw_gw2_2: true, // 地下城2层怪物2存在
    rw_gw3_1: true, // 地下城3层怪物存在

    // 雪域边境怪物状态 - 初始时所有怪物都存在
    gw_xybj_1: true, // 雪域边境怪物1存在
    gw_xybj_2: true, // 雪域边境怪物2存在
    gw_xybj_3: true, // 雪域边境怪物3存在
    gw_xybj_4: true, // 雪域边境怪物4存在
    gw_xybj_5: true, // 雪域边境怪物5存在

    // 魔族大军状态 - 初始时所有魔族大军都存在
    mj_gj: true, // 魔军突击队存在
    mj_fy: true, // 魔军守卫军存在
    mj_tt: true, // 魔军图腾兽存在
    mj_sm: true, // 魔军神秘部队存在
    mj_zs: true, // 魔军主帅存在
    mj_nl: true, // 魔的能量存在

    // 任务进度追踪
    taskProgress: 0, // 初始进度为0
  };
}

// ==================== 状态重置函数 ====================

/**
 * 重置每日任务状态
 * 对应参考文档中的 nextday() 函数
 * 每天重置任务标记，周六和周五有特殊的怪物刷新逻辑
 * @param currentState 当前任务状态
 * @param currentDay 当前天数（从1开始）
 * @returns 重置后的任务状态
 */
export function resetDailyTaskState(
  currentState: DailyTaskState,
  currentDay: number
): DailyTaskState {
  // 创建新状态对象（保留其他字段）
  const newState: DailyTaskState = {
    ...currentState,
    // 重置任务标记 - 所有任务都可以重新完成
    rw_bs: true, // BOSS任务可完成
    rw_hs: true, // 幻兽任务可完成
    rw_dxc: true, // 地下城任务可完成
    // 重置任务进度
    taskProgress: 0,
    currentTaskId: undefined,
    taskAcceptedAt: undefined,
  };

  // 计算星期几（1=周一, 2=周二, ..., 6=周六, 0=周日）
  const weekday = currentDay % 7;

  // 周六特殊重置：地下城怪物刷新
  if (weekday === 6) {
    newState.rw_gw1_1 = true;
    newState.rw_gw1_2 = true;
    newState.rw_gw1_3 = true;
    newState.rw_gw2_1 = true;
    newState.rw_gw2_2 = true;
    newState.rw_gw3_1 = true;
  }

  // 周五特殊重置：雪域边境怪物刷新
  if (weekday === 5) {
    newState.gw_xybj_1 = true;
    newState.gw_xybj_2 = true;
    newState.gw_xybj_3 = true;
    newState.gw_xybj_4 = true;
    newState.gw_xybj_5 = true;
  }

  // 魔族大军每日复活：所有魔族大军每天都会复活
  newState.mj_gj = true;
  newState.mj_fy = true;
  newState.mj_tt = true;
  newState.mj_sm = true;
  newState.mj_zs = true;
  newState.mj_nl = true;

  return newState;
}

/**
 * 标记任务为已完成
 * 根据任务类型设置相应的完成标记为 false
 * @param taskState 当前任务状态
 * @param taskType 任务类型
 * @returns 更新后的任务状态
 */
export function completeTask(
  taskState: DailyTaskState,
  taskType: string
): DailyTaskState {
  const newState = { ...taskState };

  switch (taskType) {
    case 'collect':
      // 收集宝石任务完成，标记为不可再完成
      newState.rw_bs = false;
      break;

    case 'train':
      // 训练幻兽任务完成，标记为不可再完成
      newState.rw_hs = false;
      break;

    case 'dungeon':
      // 地下城任务完成，标记为不可再完成
      newState.rw_dxc = false;
      break;

    case 'raid':
    case 'pk':
      // 突袭和PK赛任务：没有次数限制，不修改状态
      break;
  }

  return newState;
}


