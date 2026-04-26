import './character.css';

import React, { useState } from 'react';

import type { EquipmentDetail, EquipmentSlotType } from '../../types';
import { ALL_EQUIPMENT_SLOTS, getEquipmentDisplayName, getEquipmentSlotName } from '../../utils/equipmentConverter';
import { getEquipmentIcon, getEquipmentQualityColor } from '../common/utils';

/**
 * 装备展示组件属性接口
 * 定义组件接收的参数类型
 */
interface EquipmentDisplayProps {
  /**
   * 装备槽位数据，包含六个槽位的装备（可为空）
   */
  equippedItems?: Record<EquipmentSlotType, EquipmentDetail | null>;
  /**
   * 点击装备时触发的回调函数，传入被点击的装备对象
   */
  onEquipmentClick?: (equipment: EquipmentDetail) => void;
  /**
   * 点击空栏位时触发的回调函数，传入槽位类型
   */
  onEmptySlotClick?: (slotType: EquipmentSlotType) => void;
}

/**
 * 装备图标组件
 * 优先显示装备图片，图片加载失败或无图片时显示emoji图标
 */
interface EquipmentIconProps {
  equipment: EquipmentDetail;
  slotType: EquipmentSlotType;
}

const EquipmentIcon: React.FC<EquipmentIconProps> = ({ equipment, slotType }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  if (equipment.imagePath && !imageError) {
    return (
      <img
        src={equipment.imagePath}
        alt={equipment.name}
        className="equipment-image-compact"
        onError={handleImageError}
      />
    );
  }

  return (
    <span className="equipment-emoji-compact">
      {equipment.icon || getEquipmentIcon(slotType)}
    </span>
  );
};

/**
 * 装备展示组件
 * 展示角色的6种装备槽位：武器、头盔、衣服、战鞋、手镯、项链
 * 支持显示空栏位和已装备状态
 * 移动端优化：占据2/3高度，网格布局展示所有装备
 */
const EquipmentDisplay: React.FC<EquipmentDisplayProps> = ({
  equippedItems,
  onEquipmentClick,
  onEmptySlotClick
}) => {
  /**
   * 渲染单个装备槽
   */
  const renderEquipmentSlot = (slotType: EquipmentSlotType) => {
    const equipment = equippedItems?.[slotType];

    if (equipment) {
      const displayName = getEquipmentDisplayName(equipment.name, equipment.quality, equipment.magicSoulLevel);

      return (
        <div
          key={slotType}
          className="equipment-card-compact equipment-slot-filled"
          onClick={() => onEquipmentClick && onEquipmentClick(equipment)}
        >
          <div className="equipment-icon-compact">
            <EquipmentIcon equipment={equipment} slotType={slotType} />
          </div>

          <div className="equipment-info-compact">
            <div
              className="equipment-name-compact"
              style={{ color: getEquipmentQualityColor(equipment.quality) }}
            >
              {displayName}
            </div>

            <div className="equipment-level-compact">
              Lv.{equipment.useLevel}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        key={slotType}
        className="equipment-card-compact equipment-slot-empty"
        onClick={() => onEmptySlotClick && onEmptySlotClick(slotType)}
      >
        <div className="equipment-info-compact empty-info">
          <div className="equipment-type-compact">
            {getEquipmentSlotName(slotType)}
          </div>

          <div className="equipment-empty-text">
            空
          </div>

          <div className="equipment-empty-hint">
            点击装备
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="equipment-display-compact">
      {/* 装备网格布局 - 2行3列 */}
      <div className="equipment-grid-compact">
        {ALL_EQUIPMENT_SLOTS.map(renderEquipmentSlot)}
      </div>
    </div>
  );
};

export default EquipmentDisplay;
