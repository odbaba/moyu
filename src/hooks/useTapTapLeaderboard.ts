import { Capacitor } from '@capacitor/core';
import { useCallback, useState } from 'react';

import type { ScoreItem } from '../plugins/TapTapLeaderboard';
import TapTapLeaderboard from '../plugins/TapTapLeaderboard';

/** 最快拯救国王排行榜 ID（用 daysPassed 作为分数） */
const LEADERBOARD_ID_RESCUE_KING = 't5b9jle8a16emsex4r';

/** 最强战斗力排行榜 ID（用总战斗力作为分数） */
const LEADERBOARD_ID_COMBAT_POWER = 'rifgw5j8lgdcho1d9s';

/**
 * useTapTapLeaderboard Hook 返回值接口定义
 */
export interface UseTapTapLeaderboardReturn {
  /** 是否正在上传分数 */
  isSubmitting: boolean;
  /** 上传分数错误信息 */
  submitError: string | null;
  /** 上传分数是否成功 */
  submitSuccess: boolean;
  /** 批量提交分数到排行榜（同时提交拯救国王和战斗力两项分数） */
  submitScores: (daysPassed: number, combatPower: number) => Promise<boolean>;
  /** 展示排行榜 UI */
  showLeaderboard: (leaderboardId: string) => Promise<void>;
  /** 清除上传状态 */
  clearSubmitStatus: () => void;
  /** 排行榜 ID 常量 */
  LEADERBOARD_ID_RESCUE_KING: string;
  /** 排行榜 ID 常量 */
  LEADERBOARD_ID_COMBAT_POWER: string;
}

/**
 * TapTap 排行榜 Hook
 *
 * 管理排行榜功能，包括批量上传分数和查看排行榜
 * 支持 Capacitor 原生环境和 Web 环境的差异处理
 *
 * @example
 * ```tsx
 * const {
 *   isSubmitting,
 *   submitError,
 *   submitSuccess,
 *   submitScores,
 *   showLeaderboard,
 *   clearSubmitStatus,
 *   LEADERBOARD_ID_RESCUE_KING,
 *   LEADERBOARD_ID_COMBAT_POWER
 * } = useTapTapLeaderboard();
 *
 * // 批量上传分数（拯救国王天数 + 战斗力）
 * const success = await submitScores(30, 1500);
 *
 * // 查看排行榜
 * await showLeaderboard(LEADERBOARD_ID_RESCUE_KING);
 * ```
 */
export function useTapTapLeaderboard(): UseTapTapLeaderboardReturn {
  // 是否正在上传分数
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // 上传分数错误信息
  const [submitError, setSubmitError] = useState<string | null>(null);
  // 上传分数是否成功
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // 检测是否在原生环境
  const isNative = Capacitor.isNativePlatform();

  /**
   * 批量提交分数到排行榜
   * 同时上传拯救国王天数和战斗力到两个排行榜
   *
   * @param daysPassed 拯救国王天数（用于最快拯救国王排行榜）
   * @param combatPower 总战斗力（用于最强战斗力排行榜）
   * @returns 是否提交成功
   */
  const submitScores = useCallback(async (daysPassed: number, combatPower: number): Promise<boolean> => {
    // 重置状态
    setSubmitError(null);
    setSubmitSuccess(false);
    setIsSubmitting(true);

    try {
      if (isNative) {
        // 原生环境：构建分数项数组，批量提交
        const scores: ScoreItem[] = [
          { leaderboardId: LEADERBOARD_ID_RESCUE_KING, score: daysPassed },
          { leaderboardId: LEADERBOARD_ID_COMBAT_POWER, score: combatPower },
        ];

        // 调用 TapTap SDK 批量提交分数
        const result = await TapTapLeaderboard.submitScores({ scores });

        setSubmitSuccess(result.success);

        return result.success;
      } else {
        // Web 环境：不支持排行榜功能
        setSubmitError('排行榜功能仅在原生环境可用');

        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '上传分数失败，请重试';
      console.error('上传分数失败:', err);
      setSubmitError(errorMessage);

      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [isNative]);

  /**
   * 展示排行榜 UI
   * 在原生环境下调用 TapTap SDK 展示排行榜
   * Web 环境下不做任何操作
   *
   * @param leaderboardId 排行榜 ID
   */
  const showLeaderboard = useCallback(async (leaderboardId: string): Promise<void> => {
    try {
      if (isNative) {
        // 原生环境：调用 TapTap SDK 展示排行榜
        await TapTapLeaderboard.showLeaderboard({ leaderboardId });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '打开排行榜失败';
      console.error('打开排行榜失败:', err);
      setSubmitError(errorMessage);
    }
  }, [isNative]);

  /**
   * 清除上传状态
   * 用于在关闭提示后重置状态
   */
  const clearSubmitStatus = useCallback((): void => {
    setSubmitError(null);
    setSubmitSuccess(false);
  }, []);

  return {
    isSubmitting,
    submitError,
    submitSuccess,
    submitScores,
    showLeaderboard,
    clearSubmitStatus,
    LEADERBOARD_ID_RESCUE_KING,
    LEADERBOARD_ID_COMBAT_POWER,
  };
}
