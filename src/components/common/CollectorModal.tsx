import './CollectorModal.css';

import React, { useMemo, useState } from 'react';

import type { EquipmentItem, InventoryItem } from '../../types';
import { getEquipmentDisplayName } from '../../utils/equipmentConverter';
import {
  calculateItemMagicStoneValue,
  calculatePurchasePrice,
  formatMagicStoneValue
} from '../../utils/itemValueCalculator';
import { addItemToInventory } from '../../utils/itemFactory';
import { getEquipmentQualityColor, isEquipmentItem } from '../common/utils';

/**
 * 收藏架模态窗口组件属性接口
 * 定义组件接收的参数类型
 */
interface CollectorModalProps {
  /** 是否显示模态窗口 */
  isVisible: boolean;
  /** 关闭模态窗口的回调函数 */
  onClose: () => void;
  /** 背包物品列表 */
  inventoryItems: InventoryItem[];
  /** 更新背包回调函数 */
  onUpdateInventory: (items: InventoryItem[]) => void;
  /** 当前魔石数量 */
  magicStones: number;
  /** 更新魔石回调函数 */
  onUpdateMagicStones: (amount: number) => void;
}

/**
 * 收藏架格子接口
 * 定义每个格子的状态
 */
interface CollectorSlot {
  /** 格子索引（0-11） */
  index: number;
  /** 格子中的物品（可为空） */
  item: InventoryItem | null;
}

/**
 * 数量选择对话框状态
 */
interface QuantitySelectState {
  isVisible: boolean;
  item: InventoryItem | null;
  maxQuantity: number;
  selectedQuantity: number;
}

/**
 * 收藏架交易模态窗口组件
 * 用于将物品出售给收藏家换取魔石
 * 移动端优化：点击操作，无需拖拽
 */
const CollectorModal: React.FC<CollectorModalProps> = ({
  isVisible,
  onClose,
  inventoryItems,
  onUpdateInventory,
  magicStones,
  onUpdateMagicStones
}) => {
  // 收藏架格子状态（8个格子，4列×2行）
  const [collectorSlots, setCollectorSlots] = useState<CollectorSlot[]>(
    Array.from({ length: 8 }, (_, index) => ({ index, item: null }))
  );

  // 提示消息状态
  const [message, setMessage] = useState<string>('');

  // 数量选择对话框状态
  const [quantitySelect, setQuantitySelect] = useState<QuantitySelectState>({
    isVisible: false,
    item: null,
    maxQuantity: 1,
    selectedQuantity: 1
  });

  // 图片加载失败状态管理
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  /**
   * 处理图片加载失败
   */
  const handleImageError = (itemId: string) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  };

  /**
   * 获取物品图片路径
   */
  const getItemImagePath = (item: InventoryItem): string | null => {
    if (isEquipmentItem(item)) {
      const equipItem = item as EquipmentItem;
      if (equipItem.imagePath) return equipItem.imagePath;
    }
    if (item.imagePath) return item.imagePath;

    return null;
  };

  /**
   * 渲染物品图标（与背包展示一致：优先显示图片，加载失败回退到emoji）
   */
  const renderItemIcon = (item: InventoryItem) => {
    const imagePath = getItemImagePath(item);
    if (imagePath && !imageErrors[item.id]) {
      return (
        <img
          src={imagePath}
          alt={item.name}
          className="collector-item-image"
          onError={() => handleImageError(item.id)}
        />
      );
    }

    return <span className="collector-item-icon">{item.icon}</span>;
  };

  /**
   * 获取物品显示名称（装备使用getEquipmentDisplayName格式化）
   */
  const getDisplayName = (item: InventoryItem): string => {
    if (isEquipmentItem(item)) {
      const equipItem = item as EquipmentItem;

      return getEquipmentDisplayName(item.name, equipItem.equipmentQuality, equipItem.magicSoulLevel);
    }

    return item.name;
  };

  /**
   * 获取物品名称样式（装备使用品质颜色）
   */
  const getNameStyle = (item: InventoryItem): React.CSSProperties | undefined => {
    if (isEquipmentItem(item)) {
      const equipItem = item as EquipmentItem;

      return { color: getEquipmentQualityColor(equipItem.equipmentQuality) };
    }

    return undefined;
  };

  /**
   * 计算收藏架中所有物品的总价值（收购价格）
   */
  const totalValue = useMemo(() => {
    const itemsWithValue = collectorSlots
      .filter(slot => slot.item !== null)
      .map(slot => slot.item!);

    const totalMagicStoneValue = itemsWithValue.reduce((total, item) => {
      return total + calculateItemMagicStoneValue(item);
    }, 0);

    return calculatePurchasePrice(totalMagicStoneValue);
  }, [collectorSlots]);

  /**
   * 计算收藏架中的物品数量
   */
  const itemCount = useMemo(() => {
    return collectorSlots.filter(slot => slot.item !== null).length;
  }, [collectorSlots]);

  /**
   * 将收藏架中所有物品放回背包
   * 使用addItemToInventory函数处理堆叠逻辑，确保不可堆叠物品（如装备）不会错误堆叠
   */
  const returnAllItemsToInventory = () => {
    let newInventory = [...inventoryItems];
    
    // 遍历收藏架中的所有物品，使用addItemToInventory添加到背包
    collectorSlots.forEach(slot => {
      if (slot.item) {
        const item = slot.item;
        
        // 恢复原始ID并创建物品副本
        const itemToReturn: InventoryItem = {
          ...item,
          id: item.id.replace('_collector_', '_'), // 恢复原始ID
          quantity: item.quantity || 1
        };
        
        // 使用addItemToInventory处理堆叠逻辑
        // 该函数会根据stackable属性判断是否应该堆叠
        newInventory = addItemToInventory(newInventory, itemToReturn);
      }
    });
    
    onUpdateInventory(newInventory);
    
    // 清空收藏架
    setCollectorSlots(Array.from({ length: 8 }, (_, index) => ({ index, item: null })));
  };

  /**
   * 处理遮罩层点击事件
   * 点击遮罩层（非内容区域）关闭模态窗口
   */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      returnAllItemsToInventory();
      onClose();
    }
  };

  /**
   * 处理关闭按钮点击事件
   */
  const handleCloseClick = () => {
    returnAllItemsToInventory();
    onClose();
  };

  /**
   * 处理背包物品点击
   * 点击背包物品，自动添加到收藏架的第一个空格子
   */
  const handleInventoryItemClick = (item: InventoryItem) => {
    // 检查物品是否有魔石价值
    const itemValue = calculateItemMagicStoneValue(item);
    if (itemValue === 0) {
      setMessage('该物品没有魔石价值，无法放入收藏架！');
      setTimeout(() => setMessage(''), 2000);

      return;
    }

    // 查找第一个空格子
    const emptySlotIndex = collectorSlots.findIndex(slot => slot.item === null);
    if (emptySlotIndex === -1) {
      setMessage('收藏架已满！请先出售或移除物品。');
      setTimeout(() => setMessage(''), 2000);

      return;
    }

    // 如果物品数量大于1，显示数量选择对话框
    if (item.quantity && item.quantity > 1) {
      setQuantitySelect({
        isVisible: true,
        item: item,
        maxQuantity: item.quantity,
        selectedQuantity: 1
      });

      return;
    }

    // 数量为1，直接放入收藏架
    addItemToCollector(item, 1);
  };

  /**
   * 将物品添加到收藏架
   */
  const addItemToCollector = (item: InventoryItem, quantity: number) => {
    // 查找第一个空格子
    const emptySlotIndex = collectorSlots.findIndex(slot => slot.item === null);
    if (emptySlotIndex === -1) {
      setMessage('收藏架已满！请先出售或移除物品。');
      setTimeout(() => setMessage(''), 2000);

      return;
    }

    // 创建物品副本，设置数量
    const itemToAdd: InventoryItem = {
      ...item,
      quantity: quantity,
      id: `${item.id}_collector_${Date.now()}` // 生成新的ID避免冲突
    };

    // 将物品放入收藏架格子
    const newSlots = [...collectorSlots];
    newSlots[emptySlotIndex] = { index: emptySlotIndex, item: itemToAdd };
    setCollectorSlots(newSlots);

    // 从背包减少物品数量
    const newInventory = inventoryItems.map(i => {
      if (i.id === item.id) {
        const newQuantity = (i.quantity || 1) - quantity;
        if (newQuantity <= 0) {
          return null; // 将在filter中移除
        }

        return { ...i, quantity: newQuantity };
      }

      return i;
    }).filter(i => i !== null) as InventoryItem[];

    onUpdateInventory(newInventory);

    setMessage(`已将 ${item.name} x${quantity} 放入收藏架`);
    setTimeout(() => setMessage(''), 2000);
  };

  /**
   * 确认数量选择
   */
  const handleQuantityConfirm = () => {
    if (quantitySelect.item) {
      addItemToCollector(quantitySelect.item, quantitySelect.selectedQuantity);
    }
    setQuantitySelect({
      isVisible: false,
      item: null,
      maxQuantity: 1,
      selectedQuantity: 1
    });
  };

  /**
   * 取消数量选择
   */
  const handleQuantityCancel = () => {
    setQuantitySelect({
      isVisible: false,
      item: null,
      maxQuantity: 1,
      selectedQuantity: 1
    });
  };

  /**
   * 处理收藏架格子点击
   * 点击收藏架物品，自动放回背包
   * 使用addItemToInventory函数处理堆叠逻辑，确保不可堆叠物品（如装备）不会错误堆叠
   */
  const handleSlotClick = (index: number) => {
    const slot = collectorSlots[index];
    if (!slot.item) return;

    const item = slot.item;

    // 恢复原始ID并创建物品副本
    const itemToReturn: InventoryItem = {
      ...item,
      id: item.id.replace('_collector_', '_'), // 恢复原始ID
      quantity: item.quantity || 1
    };

    // 使用addItemToInventory处理堆叠逻辑
    // 该函数会根据stackable属性判断是否应该堆叠
    const newInventory = addItemToInventory(inventoryItems, itemToReturn);

    onUpdateInventory(newInventory);

    // 清空格子
    const newSlots = [...collectorSlots];
    newSlots[index] = { index, item: null };
    setCollectorSlots(newSlots);

    setMessage(`已将 ${item.name} x${itemToReturn.quantity} 放回背包`);
    setTimeout(() => setMessage(''), 2000);
  };

  /**
   * 处理出售按钮点击
   */
  const handleSell = () => {
    if (itemCount === 0) {
      setMessage('收藏架中没有物品！');
      setTimeout(() => setMessage(''), 2000);

      return;
    }

    // 增加魔石
    onUpdateMagicStones(magicStones + totalValue);

    // 清空收藏架
    setCollectorSlots(Array.from({ length: 8 }, (_, index) => ({ index, item: null })));

    setMessage(`出售成功！获得 ${formatMagicStoneValue(totalValue)} 魔石`);
    setTimeout(() => setMessage(''), 3000);
  };

  // 如果不可见，不渲染任何内容
  if (!isVisible) return null;

  return (
    <div className="collector-modal-overlay" onClick={handleOverlayClick}>
      <div className="collector-modal-content">
        {/* 关闭按钮 */}
        <button className="collector-close-modal" onClick={handleCloseClick}>×</button>

        {/* 标题 */}
        <h3 className="collector-modal-title">收藏架</h3>

        {/* 提示信息 */}
        <div className="collector-hint">
          点击背包物品自动放入收藏架，点击收藏架物品放回背包
        </div>

        {/* 收藏架格子区域 */}
        <div className="collector-slots-grid">
          {collectorSlots.map((slot) => (
            <div
              key={slot.index}
              className={`collector-slot ${slot.item ? 'filled' : ''}`}
              onClick={() => handleSlotClick(slot.index)}
            >
              {slot.item ? (
                <div className="collector-slot-content">
                  {renderItemIcon(slot.item)}
                  <div className="collector-item-name" style={getNameStyle(slot.item)}>
                    {getDisplayName(slot.item)}
                    {slot.item.quantity && slot.item.quantity > 1 && ` x${slot.item.quantity}`}
                  </div>
                  <div className="collector-item-value">
                    {formatMagicStoneValue(calculatePurchasePrice(calculateItemMagicStoneValue(slot.item)))} 魔石
                  </div>
                </div>
              ) : (
                <div className="collector-slot-empty">
                  <div className="collector-empty-icon">📦</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 背包物品区域 */}
        <div className="collector-inventory-area">
          <div className="collector-inventory-title">背包物品（点击放入收藏架）</div>
          <div className="collector-inventory-grid">
            {inventoryItems.length > 0 ? (
              inventoryItems.map((item) => {
                // 计算单价（不考虑数量）
                const itemForPrice = { ...item, quantity: 1 };
                const singleItemValue = calculateItemMagicStoneValue(itemForPrice);
                const hasValue = singleItemValue > 0;

                return (
                  <div
                    key={item.id}
                    className={`collector-inventory-item ${hasValue ? 'has-value' : 'no-value'}`}
                    onClick={() => handleInventoryItemClick(item)}
                  >
                    {renderItemIcon(item)}
                    <div className="collector-item-name" style={getNameStyle(item)}>
                      {getDisplayName(item)}
                      {item.quantity && item.quantity > 1 && ` x${item.quantity}`}
                    </div>
                    {hasValue && (
                      <div className="collector-item-value">
                        {formatMagicStoneValue(calculatePurchasePrice(singleItemValue))} 魔石/个
                      </div>
                    )}
                    {!hasValue && (
                      <div className="collector-item-no-value">无价值</div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="collector-inventory-empty">背包中没有物品</div>
            )}
          </div>
        </div>

        {/* 总价值显示区域 */}
        <div className="collector-total-area">
          <div className="collector-total-info">
            <span className="collector-total-label">总价值：</span>
            <span className="collector-total-value">{formatMagicStoneValue(totalValue)} 魔石</span>
            <span className="collector-total-count">（{itemCount} 件物品）</span>
          </div>
          <button
            className="collector-sell-button"
            onClick={handleSell}
            disabled={itemCount === 0}
          >
            出售物品
          </button>
        </div>

        {/* 消息提示 */}
        {message && (
          <div className="collector-message">
            {message}
          </div>
        )}

        {/* 数量选择对话框 */}
        {quantitySelect.isVisible && quantitySelect.item && (
          <div className="quantity-select-overlay" onClick={(e) => e.stopPropagation()}>
            <div className="quantity-select-dialog">
              <h4 className="quantity-select-title">选择数量</h4>
              <div className="quantity-select-item">
                {quantitySelect.item.icon} {quantitySelect.item.name}
              </div>
              <div className="quantity-select-info">
                当前拥有：{quantitySelect.maxQuantity} 个
              </div>
              <div className="quantity-select-controls">
                <button
                  className="quantity-btn"
                  onClick={() => setQuantitySelect({
                    ...quantitySelect,
                    selectedQuantity: Math.max(1, quantitySelect.selectedQuantity - 1)
                  })}
                  disabled={quantitySelect.selectedQuantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  className="quantity-input"
                  value={quantitySelect.selectedQuantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    setQuantitySelect({
                      ...quantitySelect,
                      selectedQuantity: Math.min(Math.max(1, value), quantitySelect.maxQuantity)
                    });
                  }}
                  min={1}
                  max={quantitySelect.maxQuantity}
                />
                <button
                  className="quantity-btn"
                  onClick={() => setQuantitySelect({
                    ...quantitySelect,
                    selectedQuantity: Math.min(quantitySelect.selectedQuantity + 1, quantitySelect.maxQuantity)
                  })}
                  disabled={quantitySelect.selectedQuantity >= quantitySelect.maxQuantity}
                >
                  +
                </button>
              </div>
              <div className="quantity-select-value">
                总价值：{formatMagicStoneValue(
                  calculatePurchasePrice(
                    calculateItemMagicStoneValue({ ...quantitySelect.item, quantity: 1 }) * quantitySelect.selectedQuantity
                  )
                )} 魔石
              </div>
              <div className="quantity-select-buttons">
                <button className="quantity-confirm-btn" onClick={handleQuantityConfirm}>
                  确认
                </button>
                <button className="quantity-cancel-btn" onClick={handleQuantityCancel}>
                  取消
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectorModal;
