import './cover.css';

import { Capacitor } from '@capacitor/core';
import React from 'react';

import { useTapTapLeaderboard } from '../../hooks/useTapTapLeaderboard';
import { useTapTapLogin } from '../../hooks/useTapTapLogin';
import type { TapTapUserInfo } from '../../plugins/TapTapLogin';

/**
 * 封面页组件属性接口
 * 定义封面页接收的参数类型
 */
interface CoverPageProps {
  /** 开始新游戏回调 */
  onStartGame: () => void;
  /** 继续游戏回调 */
  onContinueGame: () => void;
  /** 是否存在存档数据 */
  hasSaveData: boolean;
  /** 登录成功回调 */
  onLoginSuccess?: (userInfo: TapTapUserInfo) => void;
}

/**
 * 封面页组件
 * 游戏启动时的封面界面，包含标题、TapTap 登录和操作按钮
 * 手机端一屏展示所有内容，无需滚动
 */
const CoverPage: React.FC<CoverPageProps> = ({
  onStartGame,
  onContinueGame,
  hasSaveData,
  onLoginSuccess,
}) => {
  // 检测是否在原生平台运行（Android/iOS）
  // Web 环境下返回 false，原生环境返回 true
  const isNative = Capacitor.isNativePlatform();

  // 使用 TapTap 登录 Hook
  const {
    isLoggedIn,
    userInfo,
    isLoading,
    error,
    login,
    logout,
  } = useTapTapLogin();

  // 使用 TapTap 排行榜 Hook
  const { showLeaderboard, LEADERBOARD_ID_RESCUE_KING, LEADERBOARD_ID_COMBAT_POWER } = useTapTapLeaderboard();

  /**
   * 处理登录按钮点击
   * 调用 TapTap 登录，成功后触发回调
   */
  const handleLogin = async () => {
    const success = await login();
    // 登录成功后触发回调
    if (success && userInfo && onLoginSuccess) {
      onLoginSuccess(userInfo);
    }
  };

  /**
   * 处理退出登录按钮点击
   * 调用 TapTap 登出
   */
  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="cover-page">
      {/* 游戏标题 */}
      <h1 className="cover-title">  魔域v1.03</h1>

      {/* TapTap 登录区域 - 仅在原生平台显示 */}
      {isNative && (
        <div className="taptap-login-section">
          {/* 未登录状态：显示登录按钮 */}
          {!isLoggedIn && (
            <button
              className="taptap-login-btn"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? '登录中...' : 'TapTap 登录'}
            </button>
          )}

          {/* 已登录状态：显示用户信息和退出按钮 */}
          {isLoggedIn && userInfo && (
            <div className="taptap-user-info">
              {/* 用户头像 */}
              {userInfo.avatar && (
                <img
                  className="taptap-avatar"
                  src={userInfo.avatar}
                  alt={userInfo.name}
                />
              )}
              {/* 用户昵称 */}
              <span className="taptap-username">{userInfo.name}</span>
              {/* 退出登录按钮 */}
              <button
                className="taptap-logout-btn"
                onClick={handleLogout}
                disabled={isLoading}
              >
                退出
              </button>
            </div>
          )}

          {/* 错误信息显示 */}
          {error && <div className="taptap-error">{error}</div>}
        </div>
      )}

      {/* 操作按钮区域 */}
      <div className="cover-buttons">
        <button className="game-btn cover-btn" onClick={onStartGame}>
          开始游戏
        </button>
        <button
          className="game-btn cover-btn cover-btn--disabled"
          onClick={onContinueGame}
          disabled={!hasSaveData}
        >
          继续游戏
        </button>
        {/* 排行榜按钮 - 仅在原生平台显示，放在继续游戏下方 */}
        {/* 已登录时按钮亮起可点击，未登录时按钮置灰不可点击 */}
        {isNative && (
          <>
            <button
              className={`game-btn cover-btn ${!isLoggedIn ? 'cover-btn--disabled' : ''}`}
              onClick={isLoggedIn ? () => showLeaderboard(LEADERBOARD_ID_RESCUE_KING) : undefined}
              disabled={!isLoggedIn}
            >
              最快拯救国王榜
            </button>
            <button
              className={`game-btn cover-btn ${!isLoggedIn ? 'cover-btn--disabled' : ''}`}
              onClick={isLoggedIn ? () => showLeaderboard(LEADERBOARD_ID_COMBAT_POWER) : undefined}
              disabled={!isLoggedIn}
            >
              最强战力榜
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CoverPage;
