import './inventory.css';

import React, { useState } from 'react';

import type { EquipmentItem, InventoryItem } from '../../types';
import { getEquipmentDisplayName } from '../../utils/equipmentConverter';
import { getRarityClassName, isEquipmentItem } from '../common/utils';

/**
 * 物品网格展示组件属性接口
 * 定义组件接收的参数类型
 */
interface ItemGridProps {
  /**
   * 物品数据数组
   */
  items: InventoryItem[];
  /**
   * 点击物品时触发的回调函数，传入被点击的物品对象
   */
  onItemClick?: (item: InventoryItem) => void;
}

/**
 * 物品列表展示组件
 * 使用两列垂直列表布局展示物品，支持滚动和点击交互
 * 移动端优化：装备显示图片，其他物品显示图标
 */
const ItemGrid: React.FC<ItemGridProps> = ({
  items,
  onItemClick
}) => {
  /**
   * 渲染单个物品条目
   * 装备类物品显示图片，其他物品显示emoji图标
   */
  const renderItemSlot = (item: InventoryItem) => {
    // 判断是否为装备类型
    const isEquipment = isEquipmentItem(item);
    const equipmentItem = isEquipment ? item as EquipmentItem : null;

    return (
      <ItemSlotWithImage
        key={item.id}
        item={item}
        isEquipment={isEquipment}
        equipmentItem={equipmentItem}
        rarityClassName={getRarityClassName(item.rarity || 'common')}
        onItemClick={onItemClick}
      />
    );
  };

  if (items.length === 0) {
    return (
      <div className="inventory-empty">
        <div className="inventory-empty-icon">📦</div>
        <div className="inventory-empty-text">该分类下没有物品</div>
      </div>
    );
  }

  return (
    <div className="inventory-list">
      {items.map(renderItemSlot)}
    </div>
  );
};

/**
 * 带图片的物品条目组件
 * 处理物品图片显示和加载失败回退
 */
interface ItemSlotWithImageProps {
  item: InventoryItem;
  isEquipment: boolean;
  equipmentItem: EquipmentItem | null;
  rarityClassName: string;
  onItemClick?: (item: InventoryItem) => void;
}

const ItemSlotWithImage: React.FC<ItemSlotWithImageProps> = ({
  item,
  isEquipment,
  equipmentItem,
  rarityClassName,
  onItemClick
}) => {
  // 图片加载失败状态
  const [imageError, setImageError] = useState(false);

  /**
   * 处理图片加载失败
   */
  const handleImageError = () => {
    setImageError(true);
  };

  /**
   * 获取物品图片路径
   * 优先级：装备imagePath > 物品imagePath > emoji
   */
  const getItemImagePath = (): string | null => {
    // 装备类物品优先使用装备的imagePath
    if (isEquipment && equipmentItem?.imagePath) {
      return equipmentItem.imagePath;
    }
    // 其他物品使用自身的imagePath
    if (item.imagePath) {
      return item.imagePath;
    }

    return null;
  };

  /**
   * 渲染物品图标
   * 有图片路径且图片未加载失败时显示图片，否则显示emoji
   */
  const renderItemIcon = () => {
    const imagePath = getItemImagePath();

    // 如果有图片路径且图片未加载失败
    if (imagePath && !imageError) {
      return (
        <img
          src={imagePath}
          alt={item.name}
          className="item-list-image"
          onError={handleImageError}
        />
      );
    }

    // 其他情况显示emoji图标
    return (
      <span className="item-list-icon">
        {item.icon}
      </span>
    );
  };

  return (
    <div
      className={`inventory-list-item ${rarityClassName}`}
      onClick={() => onItemClick && onItemClick(item)}
    >
      {/* 物品图标/图片 */}
      {renderItemIcon()}

      {/* 物品名称 */}
      <span className="item-list-name">
        {isEquipment && equipmentItem
          ? getEquipmentDisplayName(item.name, equipmentItem.equipmentQuality, equipmentItem.magicSoulLevel)
          : item.name}
      </span>

      {/* 物品数量标签 */}
      {item.quantity > 1 && (
        <span className="item-list-count">
          x{item.quantity}
        </span>
      )}
    </div>
  );
};

export default ItemGrid;
