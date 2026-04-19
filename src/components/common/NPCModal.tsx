import React, { useMemo } from 'react';

import type { NPCInteractable, NPCInteractionOption, NPCType } from '../../types';
import { checkNPCOptionCondition, type NPCGameState } from '../../utils/npcUtils';

/**
 * NPC模态窗口组件属性接口
 * 定义组件接收的参数类型
 */
interface NPCModalProps {
  /** 是否显示模态窗口 */
  isVisible: boolean;
  /** 关闭模态窗口的回调函数 */
  onClose: () => void;
  /** NPC交互数据 */
  npcData: NPCInteractable;
  /** 选择选项后的回调函数，参数为选项结果文本、动作类型和动作参数 */
  onSelectOption: (result: string, actionType?: string, actionParams?: Record<string, unknown>) => void;
  /** 游戏状态，用于条件判断 */
  gameState: NPCGameState;
}

/**
 * 获取NPC类型的显示名称
 * @param npcType NPC类型
 * @returns 类型显示名称
 */
const getNPCTypeName = (npcType: NPCType): string => {
  const typeNames: Record<NPCType, string> = {
    palace: '皇宫',
    function: '功能',
    shop: '商店',
    special: '特殊'
  };

  return typeNames[npcType] || '未知';
};

/**
 * 获取NPC类型的CSS类名
 * @param npcType NPC类型
 * @returns CSS类名
 */
const getNPCTypeClassName = (npcType: NPCType): string => {
  const classNames: Record<NPCType, string> = {
    palace: 'npc-type-palace',
    function: 'npc-type-function',
    shop: 'npc-type-shop',
    special: 'npc-type-special'
  };

  return classNames[npcType] || 'npc-type-default';
};

/**
 * NPC模态窗口组件
 * 用于显示NPC信息和交互选项
 * 支持条件选项显示、NPC类型和位置信息展示、结果反馈显示
 */
const NPCModal: React.FC<NPCModalProps> = ({
  isVisible,
  onClose,
  npcData,
  onSelectOption,
  gameState
}) => {
  /**
   * 过滤满足条件的选项
   * 使用 useMemo 优化性能，避免每次渲染都重新计算
   */
  const availableOptions = useMemo(() => {
    return npcData.options.filter(option =>
      checkNPCOptionCondition(option.condition, gameState)
    );
  }, [npcData.options, gameState]);

  // 如果不可见，不渲染任何内容
  if (!isVisible) return null;

  /**
   * 处理选项点击事件
   * 直接执行选项，不需要二次确认
   * @param option 选中的选项
   */
  const handleOptionClick = (option: NPCInteractionOption) => {
    // 直接调用回调函数，传递结果、动作类型和动作参数
    onSelectOption(
      option.result,
      option.actionType,
      option.actionParams
    );

    // 关闭模态窗口
    onClose();
  };

  /**
   * 处理关闭按钮点击事件
   * 清理状态并关闭模态窗口
   */
  const handleCloseModal = () => {
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content npc-modal">
        {/* 关闭按钮 */}
        <button className="close-modal" onClick={handleCloseModal}>×</button>

        {/* NPC名称标题 */}
        <h3 className="npc-name">
          {npcData.icon} {npcData.name}
        </h3>

        {/* NPC类型和位置信息 */}
        <div className="npc-meta-info">
          {/* NPC类型标签 */}
          <span className={`npc-type-tag ${getNPCTypeClassName(npcData.npcType)}`}>
            {getNPCTypeName(npcData.npcType)}
          </span>
          {/* NPC位置信息 */}
          <span className="npc-location">📍 {npcData.location}</span>
        </div>

        {/* NPC描述文本区域 */}
        <p className="modal-description">{npcData.description}</p>

        {/* 交互选项列表 - 垂直列表形式 */}
        <div className="modal-options">
          {availableOptions.length > 0 ? (
            availableOptions.map((option, index) => (
              <button
                key={index}
                className="option-button"
                onClick={() => handleOptionClick(option)}
              >
                {option.text}
              </button>
            ))
          ) : (
            /* 无可用选项时的提示信息 */
            <div className="no-options-hint">
              当前没有可用的交互选项
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NPCModal;
