import { useCallback, useEffect, useMemo, useState } from 'react';

import type { GuideStep } from '../data/guideConfig';
import { GUIDE_STEPS } from '../data/guideConfig';
import { isDeveloperMode } from '../utils/developerMode';

/** localStorage 存储键名 */
const GUIDE_COMPLETED_KEY = 'guide_completed';

/**
 * 引导状态接口定义
 */
export interface GuideState {
  /** 是否激活引导 */
  isActive: boolean;
  /** 当前引导步骤索引 */
  currentStepIndex: number;
  /** 总步骤数 */
  totalSteps: number;
}

/**
 * 引导 Hook 返回值接口定义
 */
export interface UseGuideReturn extends GuideState {
  /** 开始引导 */
  startGuide: () => void;
  /** 切换到下一步 */
  nextStep: () => void;
  /** 跳过引导 */
  skipGuide: () => void;
  /** 完成引导 */
  completeGuide: () => void;
  /** 获取当前步骤配置 */
  getCurrentStep: () => GuideStep | null;
  /** 检测是否首次进入 */
  isFirstTime: () => boolean;
}

/**
 * 检测是否首次进入游戏
 * 通过检查 localStorage 中的 'guide_completed' 标记来判断
 * 开发者模式下始终返回 true，以便测试新手引导
 *
 * @returns 是否首次进入
 */
export function isFirstTime(): boolean {
  // 开发者模式下始终显示新手引导，方便测试
  if (isDeveloperMode) {
    return true;
  }

  const completed = localStorage.getItem(GUIDE_COMPLETED_KEY);

  return completed !== 'true';
}

/**
 * 设置引导已完成标记
 * 将 'guide_completed' 存储到 localStorage
 */
function setGuideCompleted(): void {
  localStorage.setItem(GUIDE_COMPLETED_KEY, 'true');
}

/**
 * 引导状态管理 Hook
 *
 * 用于管理游戏中新手引导的状态和控制逻辑
 * 包含引导的开始、下一步、跳过、完成等功能
 * 支持首次进入检测，使用 localStorage 存储完成状态
 *
 * @returns 引导状态和控制方法
 *
 * @example
 * ```tsx
 * const {
 *   isActive,
 *   currentStepIndex,
 *   totalSteps,
 *   startGuide,
 *   nextStep,
 *   skipGuide,
 *   completeGuide,
 *   getCurrentStep,
 *   isFirstTime
 * } = useGuide();
 *
 * // 首次进入时自动开始引导
 * if (isFirstTime()) {
 *   startGuide();
 * }
 * ```
 */
export function useGuide(): UseGuideReturn {
  // 引导状态
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // 总步骤数
  const totalSteps = useMemo(() => GUIDE_STEPS.length, []);

  /**
   * 开始引导
   * 将引导状态设为激活，重置步骤索引为 0
   */
  const startGuide = useCallback(() => {
    setIsActive(true);
    setCurrentStepIndex(0);
  }, []);

  /**
   * 切换到下一步
   * 如果当前是最后一步，则完成引导
   */
  const nextStep = useCallback(() => {
    setCurrentStepIndex(prev => {
      const nextIndex = prev + 1;

      // 如果已经是最后一步，完成引导
      if (nextIndex >= totalSteps) {
        return totalSteps; // 设置为超出范围的索引，确保 getCurrentStep 返回 null
      }

      return nextIndex;
    });
  }, [totalSteps]);

  /**
   * 监听 currentStepIndex 变化，当超出范围时完成引导
   */
  useEffect(() => {
    if (currentStepIndex >= totalSteps && isActive) {
      setIsActive(false);
      setGuideCompleted();
    }
  }, [currentStepIndex, totalSteps, isActive]);

  /**
   * 跳过引导
   * 直接结束引导并标记为已完成
   */
  const skipGuide = useCallback(() => {
    setIsActive(false);
    setGuideCompleted();
  }, []);

  /**
   * 完成引导
   * 结束引导并标记为已完成
   */
  const completeGuide = useCallback(() => {
    setIsActive(false);
    setGuideCompleted();
  }, []);

  /**
   * 获取当前步骤配置
   *
   * @returns 当前步骤配置，如果引导未激活或索引越界则返回 null
   */
  const getCurrentStep = useCallback((): GuideStep | null => {
    // 如果引导未激活，返回 null
    if (!isActive) {
      return null;
    }

    // 如果索引越界，返回 null
    if (currentStepIndex >= totalSteps) {
      return null;
    }

    // 非开发者模式下，检查是否已完成引导
    if (!isDeveloperMode) {
      const completed = localStorage.getItem(GUIDE_COMPLETED_KEY);
      if (completed === 'true') {
        return null;
      }
    }

    return GUIDE_STEPS[currentStepIndex];
  }, [isActive, currentStepIndex, totalSteps]);

  return {
    isActive,
    currentStepIndex,
    totalSteps,
    startGuide,
    nextStep,
    skipGuide,
    completeGuide,
    getCurrentStep,
    isFirstTime
  };
}
