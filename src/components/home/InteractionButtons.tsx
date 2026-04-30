import React from 'react';

import type { Interactable } from '../../types';

/**
 * 交互按钮组件属性接口
 * 定义组件接收的参数类型
 */
interface InteractionButtonsProps {
  /** 交互对象数组 */
  interactables: Interactable[];
  /** 点击交互按钮的回调函数 */
  onInteract: (interactable: Interactable) => void;
}

/**
 * 交互按钮组件
 * 根据交互类型渲染不同样式的按钮
 * 支持三种交互类型：动作(action)、敌人(enemy)、NPC(npc)
 */
const InteractionButtons: React.FC<InteractionButtonsProps> = ({ interactables, onInteract }) => {
  /**
   * 根据交互类型获取按钮样式类名
   * @param type 交互类型
   * @returns 样式类名
   */
  const getButtonClassName = (type: string): string => {
    const baseClass = 'interact-button';
    switch (type) {
      case 'action':
        return `${baseClass} interact-button--action`;
      case 'enemy':
        return `${baseClass} interact-button--enemy`;
      case 'npc':
        return `${baseClass} interact-button--npc`;
      default:
        return baseClass;
    }
  };

  return (
    <div className="interaction-buttons">
      {interactables.map((interactable) => (
        <button
          key={interactable.id}
          className={`game-btn ${getButtonClassName(interactable.type)}`}
          onClick={() => onInteract(interactable)}
          data-interactable-id={interactable.id}
        >
          {/* 只显示名称 */}
          <span className="interact-button__name">{interactable.name}</span>
        </button>
      ))}
    </div>
  );
};

export default InteractionButtons;
