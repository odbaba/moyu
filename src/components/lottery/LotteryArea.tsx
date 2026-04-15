/**
 * 抽奖区界面组件
 * 提供抽奖功能，包含七个宝箱和返回按钮
 * 支持花费魔石进行抽奖，获得各种奖励
 */

import React, { useState } from 'react';
import type { InventoryItem, Pet, PlayerResources, TimeSystem } from '../../types';
import type { LotteryResult } from '../../utils/lotterySystem';
import {
  executeLottery,
  PRIZE_LEVEL_NAMES,
  getPrizeProbabilities,
} from '../../utils/lotterySystem';
import { TimeDisplay, InteractionLog, Menu } from '../home';
import './lottery.css';

/**
 * 抽奖区组件属性接口
 */
interface LotteryAreaProps {
  /** 是否显示抽奖区界面 */
  isVisible: boolean;
  /** 玩家资源 */
  playerResources: PlayerResources;
  /** 玩家等级 */
  playerLevel: number;
  /** 时间系统数据 */
  timeSystem: TimeSystem;
  /** 交互日志 */
  interactionLog: string[];
  /** 关闭抽奖区回调 */
  onClose: () => void;
  /** 返回卡萨诺城回调 */
  onReturnToCity: () => void;
  /** 添加物品到背包回调 */
  onAddItem?: (item: InventoryItem) => void;
  /** 添加幻兽数据回调 */
  onAddPet?: (pet: Pet) => void;
  /** 更新魔石数量回调 */
  onUpdateMagicStone?: (amount: number) => void;
  /** 消耗时间回调 */
  onConsumeTime?: (amount: number) => void;
  /** 显示大地图回调 */
  onShowMap?: () => void;
  /** 显示角色信息页回调 */
  onShowCharacter?: () => void;
  /** 显示背包页回调 */
  onShowInventory?: () => void;
  /** 显示技能页回调 */
  onShowSkill?: () => void;
}

/**
 * 宝箱状态接口
 */
interface ChestState {
  id: string;
  isOpened: boolean;
  result?: LotteryResult;
}

/**
 * 抽奖区界面组件
 * 实现七个宝箱的抽奖功能，包含回城按钮
 */
const LotteryArea: React.FC<LotteryAreaProps> = ({
  isVisible,
  playerResources,
  playerLevel,
  timeSystem,
  interactionLog,
  onClose,
  onReturnToCity,
  onAddItem,
  onAddPet,
  onUpdateMagicStone,
  onConsumeTime,
  onShowMap,
  onShowCharacter,
  onShowInventory,
  onShowSkill,
}) => {
  // 抽奖消耗的魔石数量
  const MAGIC_STONE_COST = 100;
  // 抽奖消耗的时间数量
  const TIME_COST = 2;

  // 菜单状态
  const [menuOpen, setMenuOpen] = useState(false);

  // 七个宝箱的状态
  const [chests, setChests] = useState<ChestState[]>(() =>
    Array.from({ length: 7 }, (_, i) => ({
      id: `lottery_box_${i + 1}`,
      isOpened: false,
    }))
  );

  // 当前选中的宝箱
  const [selectedChest, setSelectedChest] = useState<string | null>(null);

  // 抽奖结果弹窗
  const [showResultModal, setShowResultModal] = useState(false);

  // 当前抽奖结果
  const [currentResult, setCurrentResult] = useState<LotteryResult | null>(null);

  // 提示消息
  const [message, setMessage] = useState<string | null>(null);

  /**
   * 处理宝箱点击事件
   * 选中宝箱并准备抽奖
   * @param chestId 宝箱ID
   */
  const handleChestClick = (chestId: string) => {
    // 检查宝箱是否已打开
    const chest = chests.find((c) => c.id === chestId);
    if (chest?.isOpened) {
      // 显示已打开宝箱的结果
      if (chest.result) {
        setCurrentResult(chest.result);
        setShowResultModal(true);
      }
      return;
    }

    // 选中宝箱
    setSelectedChest(chestId);
    setMessage(null);
  };

  /**
   * 处理抽奖操作
   * 消耗魔石并执行抽奖
   */
  const handleDraw = () => {
    if (!selectedChest) {
      setMessage('请先选择一个宝箱！');
      return;
    }

    // 检查魔石是否足够
    if (playerResources.magicStone < MAGIC_STONE_COST) {
      setMessage(`魔石不足！需要 ${MAGIC_STONE_COST} 魔石，当前只有 ${playerResources.magicStone} 魔石`);
      return;
    }

    // 执行抽奖
    const result = executeLottery(playerResources, playerLevel, MAGIC_STONE_COST);

    if (!result.success) {
      setMessage(result.message);
      return;
    }

    // 扣除魔石
    if (onUpdateMagicStone) {
      onUpdateMagicStone(playerResources.magicStone - MAGIC_STONE_COST);
    }

    // 消耗时间
    if (onConsumeTime) {
      onConsumeTime(TIME_COST);
    }

    // 添加奖品到背包或幻兽列表
    if (result.prizeItem && onAddItem) {
      onAddItem(result.prizeItem);
    }
    if (result.prizePet && onAddPet) {
      onAddPet(result.prizePet);
    }

    // 更新宝箱状态
    setChests((prev) =>
      prev.map((chest) =>
        chest.id === selectedChest
          ? { ...chest, isOpened: true, result }
          : chest
      )
    );

    // 显示抽奖结果
    setCurrentResult(result);
    setShowResultModal(true);
    setSelectedChest(null);
  };

  /**
   * 处理返回卡萨诺城
   * 调用回调函数，传送玩家至卡萨诺城并关闭抽奖区界面
   */
  const handleReturnToCity = () => {
    // 重置宝箱状态
    setChests(
      Array.from({ length: 7 }, (_, i) => ({
        id: `lottery_box_${i + 1}`,
        isOpened: false,
      }))
    );
    setSelectedChest(null);
    setMessage(null);
    setShowResultModal(false);
    setCurrentResult(null);

    // 调用返回卡萨诺城回调
    onReturnToCity();
  };

  /**
   * 关闭抽奖结果弹窗
   */
  const handleCloseResultModal = () => {
    setShowResultModal(false);
    setCurrentResult(null);
  };

  /**
   * 重置所有宝箱
   */
  const handleResetChests = () => {
    setChests(
      Array.from({ length: 7 }, (_, i) => ({
        id: `lottery_box_${i + 1}`,
        isOpened: false,
      }))
    );
    setSelectedChest(null);
    setMessage(null);
  };

  /**
   * 获取奖品等级对应的CSS类名
   */
  const getPrizeLevelClassName = (level: string): string => {
    const classNames: Record<string, string> = {
      legendary: 'prize-legendary',
      high: 'prize-high',
      medium: 'prize-medium',
      common: 'prize-common',
    };
    return classNames[level] || 'prize-common';
  };

  /**
   * 获取奖品等级对应的颜色
   */
  const getPrizeLevelColor = (level: string): string => {
    const colors: Record<string, string> = {
      legendary: '#ffd700',
      high: '#ff6b6b',
      medium: '#4ecdc4',
      common: '#95a5a6',
    };
    return colors[level] || '#95a5a6';
  };

  // 如果不可见，不渲染组件
  if (!isVisible) {
    return null;
  }

  // 获取奖品概率信息
  const probabilities = getPrizeProbabilities();

  return (
    <div className="lottery-area">
      {/* 头部区域 */}
      <div className="lottery-header">
        <h2>🎰 抽奖区</h2>
        <p className="lottery-description">
          选择一个宝箱，花费 {MAGIC_STONE_COST} 魔石进行抽奖
        </p>
      </div>

      {/* 魔石显示 */}
      <div className="lottery-currency">
        <div className="currency-item">
          <span className="currency-icon">💎</span>
          <span className="currency-label">魔石：</span>
          <span className="currency-value">{playerResources.magicStone}</span>
        </div>
      </div>

      {/* 概率说明 */}
      <div className="lottery-probabilities">
        <span className="prob-item legendary">极品 {probabilities.legendary}%</span>
        <span className="prob-item high">高级 {probabilities.high}%</span>
        <span className="prob-item medium">中级 {probabilities.medium}%</span>
        <span className="prob-item common">普通 {probabilities.common}%</span>
      </div>

      {/* 提示消息 */}
      {message && (
        <div className="lottery-message error">
          {message}
        </div>
      )}

      {/* 宝箱网格 */}
      <div className="lottery-chests-grid">
        {chests.map((chest) => (
          <div
            key={chest.id}
            className={`lottery-chest ${chest.isOpened ? 'opened' : ''} ${
              selectedChest === chest.id ? 'selected' : ''
            }`}
            onClick={() => handleChestClick(chest.id)}
          >
            <div className="chest-icon">
              {chest.isOpened ? '📦' : '🎁'}
            </div>
            <div className="chest-label">
              {chest.isOpened ? '已开启' : `宝箱 ${chest.id.split('_')[2]}`}
            </div>
            {chest.isOpened && chest.result && (
              <div
                className="chest-prize-indicator"
                style={{ backgroundColor: getPrizeLevelColor(chest.result.prizeLevel) }}
              />
            )}
          </div>
        ))}
      </div>

      {/* 操作按钮区域 */}
      <div className="lottery-actions">
        {/* 抽奖按钮 */}
        <button
          className="lottery-draw-button"
          onClick={handleDraw}
          disabled={!selectedChest || playerResources.magicStone < MAGIC_STONE_COST}
        >
          🎲 抽奖 ({MAGIC_STONE_COST} 魔石)
        </button>

        {/* 重置按钮 */}
        <button
          className="lottery-reset-button"
          onClick={handleResetChests}
        >
          🔄 重置宝箱
        </button>

        {/* 回城按钮 - 使用不同颜色区分 */}
        <button
          className="lottery-return-button"
          onClick={handleReturnToCity}
        >
          🏠 返回卡萨诺城
        </button>
      </div>

      {/* 抽奖结果弹窗 */}
      {showResultModal && currentResult && (
        <div className="modal-overlay" onClick={handleCloseResultModal}>
          <div
            className={`modal-content lottery-result-modal ${getPrizeLevelClassName(currentResult.prizeLevel)}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-modal" onClick={handleCloseResultModal}>
              ×
            </button>

            <div className="result-header">
              <h3 style={{ color: getPrizeLevelColor(currentResult.prizeLevel) }}>
                🎉 {PRIZE_LEVEL_NAMES[currentResult.prizeLevel]}
              </h3>
            </div>

            <div className="result-content">
              <div className="result-icon">
                {currentResult.prizePet ? '🐉' : '🎁'}
              </div>
              <div className="result-name" style={{ color: getPrizeLevelColor(currentResult.prizeLevel) }}>
                {currentResult.prizeName}
              </div>
              <div className="result-description">
                {currentResult.message}
              </div>
              <div className="result-cost">
                消耗魔石：{currentResult.magicStoneCost}
              </div>
            </div>

            <button className="result-confirm-button" onClick={handleCloseResultModal}>
              确定
            </button>
          </div>
        </div>
      )}

      {/* 时间显示 - 固定在底部 */}
      <TimeDisplay
        nowday={timeSystem.nowday}
        nowtime={timeSystem.nowtime}
        onedaytime={timeSystem.onedaytime}
      />

      {/* 交互日志 - 固定在底部 */}
      <InteractionLog logs={interactionLog} />

      {/* 右下角菜单 */}
      <Menu
        isOpen={menuOpen}
        onToggle={() => setMenuOpen(!menuOpen)}
        onShowMap={() => {
          setMenuOpen(false);
          onShowMap?.();
        }}
        onShowCharacter={() => {
          setMenuOpen(false);
          onShowCharacter?.();
        }}
        onShowInventory={() => {
          setMenuOpen(false);
          onShowInventory?.();
        }}
        onShowSkill={() => {
          setMenuOpen(false);
          onShowSkill?.();
        }}
      />
    </div>
  );
};

export default LotteryArea;
