import React, { useState } from 'react';
import type { InventoryItem, Pet, PlayerResources } from '../../types';
import {
  executeLottery,
  PRIZE_LEVEL_NAMES,
  type LotteryResult,
  type PrizeLevel,
} from '../../utils/lotterySystem';

/**
 * 宝箱按钮组件属性接口
 * 定义组件接收的参数类型
 */
interface LotteryBoxProps {
  /** 宝箱唯一标识 */
  boxId: string;
  /** 当前魔石数量 */
  magicStones: number;
  /** 更新魔石数量的回调函数 */
  onUpdateMagicStones: (amount: number) => void;
  /** 玩家等级 */
  playerLevel: number;
  /** 添加物品到背包的回调函数 */
  onAddItem: (item: InventoryItem) => void;
  /** 添加幻兽的回调函数 */
  onAddPet: (pet: Pet) => void;
  /** 消耗时间的回调函数 */
  onConsumeTime: (amount: number) => void;
  /** 是否禁用按钮 */
  disabled?: boolean;
}

/**
 * 宝箱按钮组件
 * 提供抽奖功能，消耗魔石获取随机奖励
 * 
 * 功能说明：
 * - 点击时检查魔石是否足够（需要28魔石）
 * - 如果不足，显示提示消息
 * - 如果足够，扣除魔石并执行抽奖
 * - 消耗2点时间
 * - 显示抽奖结果，极品奖励有特殊提示
 */
const LotteryBox: React.FC<LotteryBoxProps> = ({
  boxId,
  magicStones,
  onUpdateMagicStones,
  playerLevel,
  onAddItem,
  onAddPet,
  onConsumeTime,
  disabled = false,
}) => {
  /** 抽奖结果消息状态 */
  const [resultMessage, setResultMessage] = useState<string>('');
  /** 是否显示结果状态 */
  const [showResult, setShowResult] = useState<boolean>(false);
  /** 是否正在抽奖状态 */
  const [isLotteryRunning, setIsLotteryRunning] = useState<boolean>(false);

  /** 抽奖消耗的魔石数量 */
  const MAGIC_STONE_COST = 28;
  /** 抽奖消耗的时间数量 */
  const TIME_COST = 2;

  /**
   * 处理抽奖按钮点击事件
   * 检查魔石是否足够，执行抽奖逻辑
   */
  const handleLotteryClick = (): void => {
    // 检查魔石是否足够
    if (magicStones < MAGIC_STONE_COST) {
      setResultMessage('你不够28点魔石了，不能抽奖啦。');
      setShowResult(true);
      return;
    }

    // 开始抽奖
    setIsLotteryRunning(true);
    setShowResult(false);

    // 构建玩家资源对象
    const playerResources: PlayerResources = {
      gold: 0,
      magicStone: magicStones,
      battleExp: 0,
      merit: 0,
    };

    // 执行抽奖
    const result: LotteryResult = executeLottery(
      playerResources,
      playerLevel,
      MAGIC_STONE_COST
    );

    if (result.success) {
      // 扣除魔石
      onUpdateMagicStones(-MAGIC_STONE_COST);

      // 消耗时间
      onConsumeTime(TIME_COST);

      // 添加奖品到背包或幻兽列表
      if (result.prizeItem) {
        onAddItem(result.prizeItem);
      }
      if (result.prizePet) {
        onAddPet(result.prizePet);
      }

      // 根据奖品等级显示不同的消息
      let message: string;
      if (result.prizeLevel === 'legendary') {
        // 极品奖励特殊提示
        message = `恭喜你受到幸运女神的青睐，获得了【${result.prizeName}】！`;
      } else {
        // 其他奖励普通提示
        const levelName = PRIZE_LEVEL_NAMES[result.prizeLevel];
        message = `恭喜获得【${levelName}】: ${result.prizeName}`;
      }

      setResultMessage(message);
      setShowResult(true);
    } else {
      // 抽奖失败（理论上不会发生，因为已经检查过魔石）
      setResultMessage(result.message);
      setShowResult(true);
    }

    setIsLotteryRunning(false);
  };

  /**
   * 关闭结果提示
   */
  const handleCloseResult = (): void => {
    setShowResult(false);
    setResultMessage('');
  };

  return (
    <div className="lottery-box">
      {/* 抽奖按钮 */}
      <button
        className="lottery-box__button"
        onClick={handleLotteryClick}
        disabled={disabled || isLotteryRunning}
        title="点击消耗28魔石进行抽奖"
      >
        {/* 宝箱图标 */}
        <span className="lottery-box__icon">🎁</span>
        {/* 按钮文字 */}
        <span className="lottery-box__text">抽奖（{MAGIC_STONE_COST}魔石）</span>
      </button>

      {/* 抽奖结果提示 */}
      {showResult && (
        <div className="lottery-box__result-overlay" onClick={handleCloseResult}>
          <div className="lottery-box__result-modal" onClick={(e) => e.stopPropagation()}>
            <div className="lottery-box__result-content">
              {resultMessage}
            </div>
            <button
              className="lottery-box__result-close"
              onClick={handleCloseResult}
            >
              确定
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LotteryBox;
