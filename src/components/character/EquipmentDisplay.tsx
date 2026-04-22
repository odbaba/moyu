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
  // 图片加载失败状态
  const [imageError, setImageError] = useState(false);

  /**
   * 处理图片加载失败
   */
  const handleImageError = () => {
    setImageError(true);
  };

  // 如果有图片路径且图片未加载失败，显示图片
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

  // 其他情况显示emoji图标
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

    // 如果槽位有装备
    if (equipment) {
      // 使用 getEquipmentDisplayName 函数生成装备显示名称
      const displayName = getEquipmentDisplayName(equipment.name, equipment.quality, equipment.magicSoulLevel);

      return (
        <div
          key={slotType}
          className="equipment-card-compact equipment-slot-filled"
          onClick={() => onEquipmentClick && onEquipmentClick(equipment)}
        >
          {/* 装备图标/图片 */}
          <div className="equipment-icon-compact">
            <EquipmentIcon equipment={equipment} slotType={slotType} />
          </div>

          {/* 装备信息 */}
          <div className="equipment-info-compact">
            {/* 装备名称 */}
            <div
              className="equipment-name-compact"
              style={{ color: getEquipmentQualityColor(equipment.quality) }}
            >
              {displayName}
            </div>

            {/* 装备等级 */}
            <div className="equipment-level-compact">
              Lv.{equipment.useLevel}
            </div>
          </div>
        </div>
      );
    }

    // 如果槽位为空
    return (
      <div
        key={slotType}
        className="equipment-card-compact equipment-slot-empty"
        onClick={() => onEmptySlotClick && onEmptySlotClick(slotType)}
      >
        {/* 空槽位信息 */}
        <div className="equipment-info-compact empty-info">
          {/* 装备类型 */}
          <div className="equipment-type-compact">
            {getEquipmentSlotName(slotType)}
          </div>

          {/* 空提示 */}
          <div className="equipment-empty-text">
            空
          </div>

          {/* 点击提示 */}
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
