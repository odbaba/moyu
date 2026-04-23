import './settings.css';

import React from 'react';

/**
 * 设置页面组件属性接口
 * 定义设置页面接收的参数类型
 */
interface SettingsPageProps {
  /** 是否显示页面 */
  isVisible: boolean;
  /** 音乐是否开启 */
  isMusicEnabled: boolean;
  /** 切换音乐开关的回调 */
  onToggleMusic: () => void;
  /** 关闭设置页面的回调 */
  onClose: () => void;
  /** 退出游戏的回调 */
  onExitGame: () => void;
}

/**
 * 设置页面组件
 * 提供游戏设置功能，包括音乐开关和退出游戏
 * 手机端一屏展示所有内容，无需滚动
 */
const SettingsPage: React.FC<SettingsPageProps> = ({
  isVisible,
  isMusicEnabled,
  onToggleMusic,
  onClose,
  onExitGame
}) => {
  /**
   * 处理覆盖层点击事件
   * 点击覆盖层（非内容区域）关闭页面
   */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /**
   * 处理退出游戏点击
   * 先关闭设置页面，再执行退出游戏逻辑
   */
  const handleExitGame = () => {
    onClose();
    onExitGame();
  };

  // 如果不可见，不渲染任何内容
  if (!isVisible) return null;

  return (
    <div className="settings-page-overlay" onClick={handleOverlayClick}>
      <div className="settings-page-container">
        {/* 顶部占位框 */}
        <div className="page-top-placeholder"></div>

        {/* 页面顶部关闭按钮 */}
        <div className="settings-page-header">
          <h2 className="settings-page-title">设置</h2>
          <button
            className="settings-page-close-button"
            onClick={onClose}
            aria-label="关闭"
          >
            ✕
          </button>
        </div>

        {/* 主要内容区域 */}
        <div className="settings-page-content">
          {/* 音乐设置区域 */}
          <div className="settings-section">
            <div className="settings-item">
              <span className="settings-label">背景音乐</span>
              <button
                className={`settings-toggle ${isMusicEnabled ? 'enabled' : 'disabled'}`}
                onClick={onToggleMusic}
              >
                {isMusicEnabled ? '开启' : '关闭'}
              </button>
            </div>
          </div>

          {/* 退出游戏按钮区域 */}
          <div className="settings-section settings-exit-section">
            <button
              className="settings-exit-button"
              onClick={handleExitGame}
            >
              退出游戏
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
