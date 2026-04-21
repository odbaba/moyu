import './cover.css';

import React from 'react';

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
}

/**
 * 封面页组件
 * 游戏启动时的封面界面，包含标题和操作按钮
 * 手机端一屏展示所有内容，无需滚动
 */
const CoverPage: React.FC<CoverPageProps> = ({ onStartGame, onContinueGame, hasSaveData }) => {
  return (
    <div className="cover-page">
      {/* 游戏标题 */}
      <h1 className="cover-title">  魔域v1.03</h1>

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
      </div>
    </div>
  );
};

export default CoverPage;
