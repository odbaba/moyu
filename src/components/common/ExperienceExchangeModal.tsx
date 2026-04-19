import './ExperienceExchangeModal.css';

import React, { useMemo, useState } from 'react';

import type { InventoryItem } from '../../types';
import {
  calculateExperienceBalls,
  calculateTotalExperienceBalls,
  filterExchangeableEquipments,
  getExchangeDescription,
} from '../../utils/exchangeUtils';
import { createItemFromTemplate } from '../../utils/itemFactory';

/**
 * 经验交换弹窗组件属性接口
 */
interface ExperienceExchangeModalProps {
  /** 是否显示弹窗 */
  isVisible: boolean;
  /** 关闭弹窗回调 */
  onClose: () => void;
  /** 背包物品列表 */
  inventoryItems: InventoryItem[];
  /** 更新背包回调 */
  onUpdateInventory: (items: InventoryItem[]) => void;
  /** 显示消息回调 */
  onShowMessage: (message: string) => void;
}

/**
 * 经验交换弹窗组件
 * 用于将装备换取满经验球
 */
const ExperienceExchangeModal: React.FC<ExperienceExchangeModalProps> = ({
  isVisible,
  onClose,
  inventoryItems,
  onUpdateInventory,
  onShowMessage,
}) => {
  // 已选中的装备ID集合
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // 从背包中筛选可交换的装备
  const exchangeableEquipments = useMemo(() => {
    return filterExchangeableEquipments(inventoryItems);
  }, [inventoryItems]);

  // 已选中的装备列表
  const selectedEquipments = useMemo(() => {
    return exchangeableEquipments.filter(eq => selectedIds.has(eq.id));
  }, [exchangeableEquipments, selectedIds]);

  // 总经验球数量
  const totalExpBalls = useMemo(() => {
    return calculateTotalExperienceBalls(selectedEquipments);
  }, [selectedEquipments]);

  /**
   * 切换装备选中状态
   */
  const handleToggleSelect = (equipmentId: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(equipmentId)) {
        newSet.delete(equipmentId);
      } else {
        newSet.add(equipmentId);
      }

      return newSet;
    });
  };

  /**
   * 全选/取消全选
   */
  const handleToggleAll = () => {
    if (selectedIds.size === exchangeableEquipments.length) {
      // 已全选，取消全选
      setSelectedIds(new Set());
    } else {
      // 未全选，全选
      setSelectedIds(new Set(exchangeableEquipments.map(eq => eq.id)));
    }
  };

  /**
   * 确认交换
   */
  const handleConfirm = () => {
    if (selectedEquipments.length === 0) {
      onShowMessage('请先选择要交换的装备！');

      return;
    }

    // 从背包中移除已选装备
    const selectedIdSet = new Set(selectedIds);
    const newInventory = inventoryItems.filter(item => !selectedIdSet.has(item.id));

    // 创建满经验球
    const expBallTemplate = createItemFromTemplate('满经验球', totalExpBalls);
    if (expBallTemplate) {
      // 检查背包中是否已有满经验球（堆叠处理）
      const existingIndex = newInventory.findIndex(
        item => item.name === '满经验球' && item.type === 'consumable'
      );

      if (existingIndex !== -1) {
        // 已有满经验球，增加数量
        newInventory[existingIndex] = {
          ...newInventory[existingIndex],
          quantity: (newInventory[existingIndex].quantity || 0) + totalExpBalls,
        };
      } else {
        // 没有满经验球，添加新物品
        newInventory.push(expBallTemplate);
      }
    }

    // 更新背包
    onUpdateInventory(newInventory);

    // 显示成功消息
    onShowMessage(`成功交换！消耗 ${selectedEquipments.length} 件装备，获得 ${totalExpBalls} 个满经验球`);

    // 清空选择并关闭弹窗
    setSelectedIds(new Set());
    onClose();
  };

  /**
   * 关闭弹窗
   */
  const handleClose = () => {
    setSelectedIds(new Set());
    onClose();
  };

  // 处理遮罩点击
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="exp-exchange-overlay" onClick={handleOverlayClick}>
      <div className="exp-exchange-modal">
        {/* 关闭按钮 */}
        <button className="exp-exchange-close" onClick={handleClose}>×</button>

        {/* 标题 */}
        <h3 className="exp-exchange-title">🔮 用装备换经验球</h3>

        {/* 规则说明 */}
        <div className="exp-exchange-rules">
          <p>只有良品以上或有洞的装备才可以提练。</p>
          <p>良品=1个，上品=2个，精品=3个，极品=4个</p>
          <p>一洞+2个，二洞+5个</p>
          <p>魔魂+9=+1个，魔魂+12=+2个</p>
        </div>

        {/* 装备列表 */}
        <div className="exp-exchange-list">
          <div className="exp-exchange-list-header">
            <span className="exp-exchange-select-all" onClick={handleToggleAll}>
              {selectedIds.size === exchangeableEquipments.length && exchangeableEquipments.length > 0
                ? '取消全选'
                : '全选'}
            </span>
            <span className="exp-exchange-count">
              可交换装备: {exchangeableEquipments.length} 件
            </span>
          </div>

          {exchangeableEquipments.length > 0 ? (
            <div className="exp-exchange-items">
              {exchangeableEquipments.map(equipment => {
                const isSelected = selectedIds.has(equipment.id);
                const expBalls = calculateExperienceBalls(equipment);
                const description = getExchangeDescription(equipment);

                return (
                  <div
                    key={equipment.id}
                    className={`exp-exchange-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleToggleSelect(equipment.id)}
                  >
                    {/* 选择框 */}
                    <div className="exp-exchange-checkbox">
                      {isSelected ? '☑' : '☐'}
                    </div>

                    {/* 装备信息 */}
                    <div className="exp-exchange-item-info">
                      <div className="exp-exchange-item-header">
                        <span className="exp-exchange-item-icon">{equipment.icon}</span>
                        <span className={`exp-exchange-item-name rarity-${equipment.rarity}`}>
                          {equipment.name}
                        </span>
                        <span className="exp-exchange-item-quality">
                          {equipment.equipmentQuality}
                        </span>
                      </div>
                      <div className="exp-exchange-item-details">
                        <span>等级: {equipment.useLevel}</span>
                        {equipment.magicSoulLevel > 0 && (
                          <span> | 魔魂+{equipment.magicSoulLevel}</span>
                        )}
                        {equipment.holeCount > 0 && (
                          <span> | {equipment.holeCount}洞</span>
                        )}
                      </div>
                      <div className="exp-exchange-item-desc">{description}</div>
                    </div>

                    {/* 经验球数量 */}
                    <div className="exp-exchange-item-balls">
                      <span className="exp-exchange-balls-count">{expBalls}</span>
                      <span className="exp-exchange-balls-unit">个</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="exp-exchange-empty">
              背包中没有可交换的装备
            </div>
          )}
        </div>

        {/* 底部操作区 */}
        <div className="exp-exchange-footer">
          <div className="exp-exchange-summary">
            已选 <span className="exp-exchange-selected-count">{selectedEquipments.length}</span> 件装备，
            可获得 <span className="exp-exchange-total-balls">{totalExpBalls}</span> 个满经验球
          </div>
          <div className="exp-exchange-buttons">
            <button
              className="exp-exchange-btn confirm"
              onClick={handleConfirm}
              disabled={selectedEquipments.length === 0}
            >
              确认交换
            </button>
            <button className="exp-exchange-btn cancel" onClick={handleClose}>
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceExchangeModal;
