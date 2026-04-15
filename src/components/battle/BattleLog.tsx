import React, { useEffect, useRef } from 'react';
import type { BattleLogEntry, BattleLogType } from '../../types';

/**
 * 战斗日志组件属性接口
 */
interface BattleLogProps {
  logs: BattleLogEntry[];
}

/**
 * 获取日志类型对应的图标
 * @param type 日志类型
 * @returns 对应的图标emoji
 */
const getLogIcon = (type: BattleLogType): string => {
  const iconMap: Record<BattleLogType, string> = {
    attack: '⚔️',    // 攻击
    skill: '✨',      // 技能
    dodge: '💨',      // 闪避
    critical: '💥',   // 暴击
    buff: '🔥',       // 增益
    damage: '💔',     // 伤害
    heal: '💚',       // 治疗
    death: '💀',      // 死亡
  };
  return iconMap[type] || '📝';
};

/**
 * 获取日志条目的CSS类名
 * 根据日志类型和特殊事件返回对应的样式类名
 * @param log 日志条目
 * @returns CSS类名字符串
 */
const getLogClassName = (log: BattleLogEntry): string => {
  // 基础类名
  let className = 'battle-log-entry';
  
  // 根据是否闪避添加样式
  if (log.isDodged) {
    className += ' log-dodge';
  }
  // 根据是否暴击添加样式
  else if (log.isCritical) {
    className += ' log-critical';
  }
  // 根据行动类型添加样式
  else {
    switch (log.actionType) {
      case 'buff':
        className += ' log-buff';
        break;
      case 'heal':
        className += ' log-heal';
        break;
      case 'death':
        className += ' log-death';
        break;
      default:
        break;
    }
  }
  
  return className;
};

/**
 * 渲染特殊事件标签
 * 显示闪避、暴击、破防等特殊事件
 * @param log 日志条目
 * @returns 特殊事件标签JSX元素
 */
const renderSpecialEvent = (log: BattleLogEntry): React.ReactNode => {
  const events: React.ReactNode[] = [];
  
  // 闪避事件
  if (log.isDodged) {
    events.push(
      <span key="dodge" className="special-event dodge-event">
        闪避!
      </span>
    );
  }
  
  // 暴击事件
  if (log.isCritical) {
    events.push(
      <span key="critical" className="special-event critical-event">
        暴击!
      </span>
    );
  }
  
  // 破防事件
  if (log.isBreakDefense) {
    events.push(
      <span key="breakDefense" className="special-event break-defense-event">
        破防!
      </span>
    );
  }
  
  return events.length > 0 ? <span className="special-events">{events}</span> : null;
};

/**
 * 格式化伤害值的显示文本
 * @param damage 伤害数值
 * @param isHeal 是否为治疗
 * @returns 格式化后的伤害文本
 */
const formatDamage = (damage: number, isHeal: boolean = false): string => {
  if (isHeal) {
    return `+${Math.abs(damage)} 生命值`;
  }
  if (damage > 0) {
    return `-${damage} 生命值`;
  }
  return '';
};

/**
 * 战斗日志组件
 * 显示战斗过程中的详细日志信息
 * 包括回合数、行动者、行动、伤害、目标等信息
 * 支持特殊事件显示（闪避、暴击、破防、增益）
 * 并自动滚动到底部
 */
const BattleLog: React.FC<BattleLogProps> = ({ logs }) => {
  // 引用日志容器元素，用于自动滚动
  const logContainerRef = useRef<HTMLDivElement>(null);

  /**
   * 自动滚动到底部的效果
   * 当 logs 数组变化时，自动滚动到最新的日志
   */
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="battle-log" ref={logContainerRef}>
      {/* 遍历日志数组，渲染每条战斗日志条目 */}
      {logs.map((log) => (
        <div key={log.id} className={getLogClassName(log)}>
          {/* 日志图标 */}
          <span className="log-icon">
            {getLogIcon(log.actionType)}
          </span>
          
          {/* 回合数显示 */}
          <span className="log-round">
            [第 {log.round} 回合]
          </span>
          
          {/* 行动者显示 */}
          <span className="log-actor">
            {log.actor}
          </span>
          
          {/* 行动描述显示 */}
          <span className="log-action">
            {log.action}
          </span>
          
          {/* 目标显示（如果有目标） */}
          {log.target && (
            <span className="log-target">
              → {log.target}
            </span>
          )}
          
          {/* 特殊事件标签（闪避、暴击、破防） */}
          {renderSpecialEvent(log)}
          
          {/* 伤害/治疗显示 */}
          {log.damage !== 0 && (
            <span className={`log-damage ${log.actionType === 'heal' ? 'damage-heal' : 'damage-positive'}`}>
              {formatDamage(log.damage, log.actionType === 'heal')}
            </span>
          )}
          
          {/* 技能名称显示（如果是技能） */}
          {log.skillName && (
            <span className="log-skill-name">
              [{log.skillName}]
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default BattleLog;
