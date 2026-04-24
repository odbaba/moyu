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
  /** 音乐音量（0-100） */
  musicVolume: number;
  /** 切换音乐开关的回调 */
  onToggleMusic: () => void;
  /** 音量改变的回调 */
  onVolumeChange: (volume: number) => void;
  /** 关闭设置页面的回调 */
  onClose: () => void;
  /** 退出游戏的回调 */
  onExitGame: () => void;
}

/**
 * 设置页面组件
 * 提供游戏设置功能，包括音乐开关、音量调节和退出游戏
 * 手机端一屏展示所有内容，无需滚动
 */
const SettingsPage: React.FC<SettingsPageProps> = ({
  isVisible,
  isMusicEnabled,
  musicVolume,
  onToggleMusic,
  onVolumeChange,
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
              <label className="settings-checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={isMusicEnabled}
                  onChange={onToggleMusic}
                  className="settings-checkbox"
                />
                <span className="settings-checkbox-custom"></span>
              </label>
            </div>

            {/* 音量调节滑动条 */}
            <div className="settings-volume-item">
              <div className="settings-volume-header">
                <span className="settings-label">音量</span>
                <span className="settings-volume-value">{musicVolume}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={musicVolume}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                className="settings-volume-slider"
                disabled={!isMusicEnabled}
              />
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
