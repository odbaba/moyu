import './game-ending.css';

import React from 'react';
import type { GameEndingResult } from '../../utils/gameEndingUtils';

/**
 * 游戏结算页面组件属性接口
 */
interface GameEndingPageProps {
  /** 结算结果数据 */
  result: GameEndingResult;
  /** 再玩一次回调 */
  onPlayAgain: () => void;
  /** 读取存档回调 */
  onLoadSave: () => void;
  /** 继续游玩回调 - 关闭结算页面，传送到皇宫继续 */
  onContinuePlaying: () => void;
}

/**
 * 游戏结算页面组件
 * 展示游戏结束时的8维度评价和综合评语
 * 手机端一屏展示所有内容
 */
const GameEndingPage: React.FC<GameEndingPageProps> = ({ result, onPlayAgain, onLoadSave, onContinuePlaying }) => {
  // 渲染单个评价项
  const renderEvaluationItem = (
    label: string,
    value: number | string,
    title: string,
    isHighest: boolean,
    suffix?: string
  ) => {
    // 根据是否最高评价决定称号显示格式
    const titleDisplay = isHighest ? `${title}(最高评价)` : title;

    return (
      <div className="ending-item">
        <span className="ending-label">{label}：</span>
        <span className="ending-value">{value}{suffix || ''}</span>
        <span className="ending-title">{titleDisplay}</span>
      </div>
    );
  };

  // 渲染军衔/爵位/公主关系的特殊格式（包含"被称为"）
  const renderSpecialEvaluationItem = (
    label: string,
    name: string,
    title: string,
    isHighest: boolean,
    prefix: string
  ) => {
    const titleDisplay = isHighest ? `${title}(最高评价)` : title;

    return (
      <div className="ending-item">
        <span className="ending-label">{label}：</span>
        <span className="ending-value">{name}</span>
        <span className="ending-title">{prefix}{titleDisplay}</span>
      </div>
    );
  };

  return (
    <div className="game-ending-page">
      {/* 标题 */}
      <h1 className="ending-title">游戏结束</h1>

      {/* 天数描述 */}
      <p className="ending-days">{result.daysPassed}天过去了，</p>

      {/* 8个维度评价 */}
      <div className="ending-evaluations">
        {/* 战斗力 */}
        {renderEvaluationItem(
          result.combatPower.label,
          result.combatPower.value,
          result.combatPower.title,
          result.combatPower.isHighest,
          ' 评价：'
        )}

        {/* 等级 */}
        {renderEvaluationItem(
          result.level.label,
          result.level.value,
          result.level.title,
          result.level.isHighest,
          ' 称号：'
        )}

        {/* 装备 */}
        {renderEvaluationItem(
          result.equipment.label,
          result.equipment.value,
          result.equipment.title,
          result.equipment.isHighest,
          ' 称号：'
        )}

        {/* 幻兽 */}
        {renderEvaluationItem(
          result.pet.label,
          result.pet.value,
          result.pet.title,
          result.pet.isHighest,
          ' 称号：'
        )}

        {/* 军衔 */}
        {renderSpecialEvaluationItem(
          result.militaryRank.label,
          result.militaryRank.name,
          result.militaryRank.title,
          result.militaryRank.isHighest,
          ' 被称为：'
        )}

        {/* 爵位 */}
        {renderSpecialEvaluationItem(
          result.nobleRank.label,
          result.nobleRank.name,
          result.nobleRank.title,
          result.nobleRank.isHighest,
          ' 被称为：'
        )}

        {/* 公主关系 */}
        {renderEvaluationItem(
          result.princessRelation.label,
          result.princessRelation.name,
          result.princessRelation.title,
          result.princessRelation.isHighest,
          ' 被认为：'
        )}

        {/* 财富 */}
        {renderEvaluationItem(
          result.wealth.label,
          result.wealth.value,
          result.wealth.title,
          result.wealth.isHighest,
          ' 称号：'
        )}
      </div>

      {/* 综合评语 */}
      <div className="ending-overall">
        <h2 className="ending-overall-title">综合评语：</h2>
        <p className="ending-overall-content">{result.overall.description}</p>
      </div>

      {/* 操作按钮 */}
      <div className="ending-buttons">
        <button className="game-btn ending-btn ending-btn--continue" onClick={onContinuePlaying}>
          继续游玩
        </button>
        <button className="game-btn ending-btn" onClick={onPlayAgain}>
          再玩一次
        </button>
        <button className="game-btn ending-btn" onClick={onLoadSave}>
          读取存档
        </button>
      </div>
    </div>
  );
};

export default GameEndingPage;
