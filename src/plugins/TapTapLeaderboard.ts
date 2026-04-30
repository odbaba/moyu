import { registerPlugin } from '@capacitor/core';

/**
 * 提交分数结果
 */
export interface SubmitScoreResult {
  /** 是否提交成功 */
  success: boolean;
}

/**
 * 单个分数项
 * 用于批量提交分数时指定排行榜 ID 和对应分数
 */
export interface ScoreItem {
  /** 排行榜 ID */
  leaderboardId: string;
  /** 分数 */
  score: number;
}

/**
 * TapTap 排行榜插件接口定义
 * 对应 Android 原生层 TapTapLeaderboardPlugin 提供的方法
 */
export interface TapTapLeaderboardPlugin {
  /**
   * 提交分数到排行榜（单个）
   * @param options.leaderboardId 排行榜 ID
   * @param options.score 分数
   * @returns Promise<SubmitScoreResult>
   */
  submitScore(options: { leaderboardId: string; score: number }): Promise<SubmitScoreResult>;

  /**
   * 批量提交分数到多个排行榜
   * @param options.scores 分数项数组，每项包含 leaderboardId 和 score
   * @returns Promise<SubmitScoreResult>
   */
  submitScores(options: { scores: ScoreItem[] }): Promise<SubmitScoreResult>;

  /**
   * 展示排行榜 UI
   * @param options.leaderboardId 排行榜 ID
   * @returns Promise<void>
   */
  showLeaderboard(options: { leaderboardId: string }): Promise<void>;
}

/**
 * TapTap 排行榜插件实例
 * 使用方式：
 *   import TapTapLeaderboard from '../plugins/TapTapLeaderboard';
 *
 *   // 提交单个分数
 *   await TapTapLeaderboard.submitScore({ leaderboardId: 'xxx', score: 100 });
 *
 *   // 批量提交分数
 *   await TapTapLeaderboard.submitScores({ scores: [
 *     { leaderboardId: 'xxx', score: 100 },
 *     { leaderboardId: 'yyy', score: 200 }
 *   ]});
 *
 *   // 查看排行榜
 *   await TapTapLeaderboard.showLeaderboard({ leaderboardId: 'xxx' });
 */
const TapTapLeaderboard = registerPlugin<TapTapLeaderboardPlugin>('TapTapLeaderboard');

export default TapTapLeaderboard;
