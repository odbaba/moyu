import React, { useMemo } from 'react';
import type { EquipmentItem, EquipmentSlotType, InventoryItem } from '../../types';
import { getEquipmentSlotName } from '../../utils/equipmentConverter';
import { getEquipmentIcon } from '../common/utils';
import ItemGrid from '../inventory/ItemGrid';
import './character.css';

/**
 * 装备选择弹窗组件属性接口
 */
interface EquipmentSelectModalProps {
  /**
   * 是否显示弹窗
   */
  isVisible: boolean;
  /**
   * 要选择的装备槽位类型
   */
  slotType: EquipmentSlotType;
  /**
   * 背包中所有装备物品列表
   */
  inventoryEquipments: EquipmentItem[];
  /**
   * 关闭弹窗回调
   */
  onClose: () => void;
  /**
   * 选择装备回调（点击装备后打开详情）
   */
  onSelectEquipment: (item: EquipmentItem) => void;
}

/**
 * 装备选择弹窗组件
 * 显示背包中指定类型的装备列表，供用户选择装备
 * 复用背包页的ItemGrid组件
 */
const EquipmentSelectModal: React.FC<EquipmentSelectModalProps> = ({
  isVisible,
  slotType,
  inventoryEquipments,
  onClose,
  onSelectEquipment
}) => {
  // 过滤出对应类型的装备，转换为InventoryItem类型
  const filteredEquipments = useMemo(() => {
    return inventoryEquipments
      .filter(item => item.equipmentType === slotType)
      .map(item => item as InventoryItem);
  }, [inventoryEquipments, slotType]);

  // 点击遮罩层关闭
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 处理物品点击
  const handleItemClick = (item: InventoryItem) => {
    onSelectEquipment(item as EquipmentItem);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="equipment-select-modal-overlay" 
      onClick={handleOverlayClick}
    >
      <div className="equipment-select-modal-content">
        {/* 关闭按钮 */}
        <button className="equipment-select-close-modal" onClick={onClose}>
          ×
        </button>
        
        {/* 标题 */}
        <h3 className="equipment-select-title">
          选择要装备的{getEquipmentSlotName(slotType)}
        </h3>
        
        {/* 装备列表 - 复用背包的ItemGrid组件 */}
        <div className="equipment-select-grid-wrapper">
          {filteredEquipments.length === 0 ? (
            <div className="equipment-select-empty">
              <div className="empty-icon">{getEquipmentIcon(slotType)}</div>
              <div className="empty-text">背包中没有可装备的{getEquipmentSlotName(slotType)}</div>
            </div>
          ) : (
            <ItemGrid
              items={filteredEquipments}
              onItemClick={handleItemClick}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipmentSelectModal;
