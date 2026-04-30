import './game-ending.css';

import React from 'react';

import { Capacitor } from '@capacitor/core';

import { useTapTapLeaderboard } from '../../hooks/useTapTapLeaderboard';
import { useTapTapLogin } from '../../hooks/useTapTapLogin';
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
  // 检测是否在原生安卓环境
  const isNative = Capacitor.isNativePlatform();

  // TapTap 登录状态
  const { isLoggedIn } = useTapTapLogin();

  // TapTap 排行榜上传分数相关状态和方法
  const { submitScores, isSubmitting, submitSuccess, submitError } = useTapTapLeaderboard();

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

  /**
   * 点击上传分数按钮的处理函数
   * 同时上传拯救国王天数和总战斗力到两个排行榜
   */
  const handleSubmitScore = async () => {
    if (isSubmitting || submitSuccess) return;
    // daysPassed 作为最快拯救国王排行榜的分数
    // combatPower.value（总战斗力）作为最强战斗力排行榜的分数
    const combatPowerValue = typeof result.combatPower.value === 'number'
      ? result.combatPower.value
      : parseInt(String(result.combatPower.value), 10) || 0;
    await submitScores(result.daysPassed, combatPowerValue);
  };

  /**
   * 渲染上传分数按钮
   * 仅在原生环境且已登录时显示
   * 根据上传状态显示不同样式和文字
   */
  const renderSubmitButton = () => {
    // 非原生环境或未登录时不显示按钮
    if (!(isNative && isLoggedIn)) return null;

    // 上传成功后按钮变为已上传状态
    if (submitSuccess) {
      return (
        <>
          <button className="game-btn ending-btn ending-btn--submitted" disabled>
            已上传
          </button>
          <p className="submit-status submit-status--success">上传成功</p>
        </>
      );
    }

    // 上传中状态
    if (isSubmitting) {
      return (
        <button className="game-btn ending-btn ending-btn--submitting" disabled>
          上传中...
        </button>
      );
    }

    // 默认状态：可点击上传
    return (
      <>
        <button className="game-btn ending-btn ending-btn--submit" onClick={handleSubmitScore}>
          上传分数
        </button>
        {/* 上传失败时显示错误信息 */}
        {submitError && (
          <p className="submit-status submit-status--error">{submitError}</p>
        )}
      </>
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
        {/* 上传分数按钮 - 仅在原生环境且已登录时显示 */}
        {renderSubmitButton()}
      </div>
    </div>
  );
};

export default GameEndingPage;
