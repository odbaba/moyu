import React from 'react';

import type { Weekday } from '../../types';

/**
 * 时间显示组件属性接口
 */
interface TimeDisplayProps {
  /** 当前天数 */
  nowday: number;
  /** 当天已消耗的时间单位 */
  nowtime: number;
  /** 一天的时间单位总数 */
  onedaytime: number;
  /** 保存游戏的回调 */
  onSaveGame: () => void;
}

/**
 * 根据天数计算星期
 * nowday % 7 == 1 -> 星期一
 * nowday % 7 == 2 -> 星期二
 * nowday % 7 == 3 -> 星期三
 * nowday % 7 == 4 -> 星期四
 * nowday % 7 == 5 -> 星期五
 * nowday % 7 == 6 -> 星期六
 * nowday % 7 == 0 -> 星期日
 * @param day 当前天数
 * @returns 星期字符串
 */
export const getWeekday = (day: number): Weekday => {
  const remainder = day % 7;
  switch (remainder) {
    case 1:
      return '星期一';
    case 2:
      return '星期二';
    case 3:
      return '星期三';
    case 4:
      return '星期四';
    case 5:
      return '星期五';
    case 6:
      return '星期六';
    case 0:
      return '星期日';
    default:
      return '星期一';
  }
};

/**
 * 时间显示组件
 * 显示当前天数、星期和时间进度条
 * 包含保存游戏按钮（放在第x天右边）
 * 固定显示在交互日志区的最上方
 */
const TimeDisplay: React.FC<TimeDisplayProps> = ({
  nowday,
  nowtime,
  onedaytime,
  onSaveGame
}) => {
  // 计算当前星期
  const weekday = getWeekday(nowday);

  return (
    <div className="time-display">
      {/* 天数和星期显示 */}
      <div className="time-info">
        <span className="time-day">第{nowday}天</span>
        {/* 保存游戏按钮 - 放在第x天右边 */}
        <button className="time-save-btn game-btn" onClick={onSaveGame}>
          保存游戏
        </button>
        <span className="time-weekday">{weekday}</span>
      </div>

      {/* 时间进度条 */}
      <div className="time-progress">
        {Array.from({ length: onedaytime }, (_, index) => (
          <div
            key={index}
            className={`time-unit ${index < nowtime ? 'time-unit--consumed' : 'time-unit--remaining'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TimeDisplay;
