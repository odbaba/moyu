import './inventory.css';

import React, { useMemo, useState } from 'react';

import { exampleItems, exampleResources } from '../../data/inventoryData';
import type { EquipmentItem, InventoryItem, ItemType, PlayerResources } from '../../types';
import { equipmentItemToDetail } from '../../utils/equipmentConverter';
import EquipmentDetailModal from '../common/EquipmentDetailModal';
import { isEquipmentItem } from '../common/utils';
import ItemDetailModal from './ItemDetailModal';
import ItemGrid from './ItemGrid';
import ResourceDisplay from './ResourceDisplay';

/**
 * 物品类型中文名称映射
 */
const ITEM_TYPE_NAMES: Record<ItemType, string> = {
  'consumable': '消耗品',
  'material': '材料',
  'equipment': '装备',
  'quest': '任务物品',
  'other': '其他',
  'skillBook': '技能书',
  'gem': '宝石',
  'special': '特殊道具',
  'pet': '幻兽'
};

/**
 * 所有物品类型列表
 */
const ALL_ITEM_TYPES: ItemType[] = [
  'consumable', 'material', 'equipment', 'quest', 'other', 'skillBook', 'gem', 'special'
];

/**
 * 背包主页面组件属性接口
 * 定义组件接收的参数类型
 */
interface InventoryPageProps {
  /**
   * 是否显示页面
   */
  isVisible: boolean;
  /**
   * 物品数据数组，默认为 exampleItems
   */
  items?: InventoryItem[];
  /**
   * 玩家资源数据，默认为 exampleResources
   */
  resources?: PlayerResources;
  /**
   * 角色等级（用于装备等级限制检查）
   */
  characterLevel?: number;
  /**
   * 关闭按钮点击回调
   */
  onClose: () => void;
  /**
   * 使用物品回调
   */
  onUseItem?: (item: InventoryItem) => void;
  /**
   * 装备物品回调（用于装备详情弹窗）
   */
  onEquipItem?: (item: EquipmentItem) => void;
  /**
   * 出售物品回调
   * @param itemId 物品ID
   * @param quantity 出售数量
   * @param goldEarned 获得的金币
   * @param magicStoneEarned 获得的魔石
   * @param itemName 物品名称（可选，用于日志显示）
   */
  onSell?: (itemId: string, quantity: number, goldEarned: number, magicStoneEarned?: number, itemName?: string) => void;
}

/**
 * 背包主页面组件
 * 整合资源信息展示、物品网格展示和物品详情弹窗等功能
 * 作为独立的全屏页面显示
 * 移动端布局：资源信息 + 物品网格上下布局
 */
const InventoryPage: React.FC<InventoryPageProps> = ({
  isVisible,
  items = exampleItems,
  resources = exampleResources,
  characterLevel,
  onClose,
  onUseItem,
  onEquipItem,
  onSell
}) => {
  /**
   * 物品详情弹窗显示状态
   */
  const [showItemDetailModal, setShowItemDetailModal] = useState(false);

  /**
   * 当前选中的物品
   */
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  /**
   * 选中的物品分类（多选）
   * 默认全选，所有分类都显示
   */
  const [selectedCategories, setSelectedCategories] = useState<ItemType[]>(ALL_ITEM_TYPES);

  /**
   * 切换分类选中状态
   * @param category 要切换的分类
   */
  const toggleCategory = (category: ItemType) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  /**
   * 全选/取消全选所有分类
   */
  const toggleAllCategories = () => {
    if (selectedCategories.length === ALL_ITEM_TYPES.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([...ALL_ITEM_TYPES]);
    }
  };

  /**
   * 根据选中的分类过滤物品
   */
  const filteredItems = useMemo(() => {
    if (selectedCategories.length === 0) {
      return [];
    }

    return items.filter(item => selectedCategories.includes(item.type));
  }, [items, selectedCategories]);

  /**
   * 获取所有普通品装备
   * 用于一键售出功能
   */
  const commonEquipments = useMemo(() => {
    return items.filter(item =>
      isEquipmentItem(item) && item.equipmentQuality === '普通品'
    ) as EquipmentItem[];
  }, [items]);

  /**
   * 计算普通品装备的总金币价值
   */
  const commonEquipmentsTotalGold = useMemo(() => {
    return commonEquipments.reduce((total, item) => {
      // 金币价值公式：100 * useLevel * (equipmentQuality + 1) + 100 * magicSoulLevel + 10000 * holeCount³
      // 普通品 equipmentQuality = 0
      const useLevel = item.useLevel || 1;
      const magicSoulLevel = item.magicSoulLevel || 0;
      const holeCount = item.holeCount || 0;
      const goldValue = 100 * useLevel * 1 + 100 * magicSoulLevel + 10000 * Math.pow(holeCount, 3);

      return total + goldValue;
    }, 0);
  }, [commonEquipments]);

  /**
   * 处理一键售出普通品装备
   */
  const handleSellCommonEquipments = () => {
    if (!onSell || commonEquipments.length === 0) return;

    // 逐个出售普通品装备
    commonEquipments.forEach(item => {
      const useLevel = item.useLevel || 1;
      const magicSoulLevel = item.magicSoulLevel || 0;
      const holeCount = item.holeCount || 0;
      const goldValue = 100 * useLevel * 1 + 100 * magicSoulLevel + 10000 * Math.pow(holeCount, 3);
      onSell(item.id, 1, goldValue, 0, item.name);
    });
  };

  /**
   * 处理物品点击事件
   * 点击物品时打开物品详情弹窗
   * @param item 被点击的物品对象
   */
  const handleItemClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowItemDetailModal(true);
  };

  /**
   * 关闭物品详情弹窗
   */
  const handleCloseItemDetailModal = () => {
    setShowItemDetailModal(false);
    setSelectedItem(null);
  };

  /**
   * 处理覆盖层点击事件
   * 点击覆盖层（非内容区域）关闭页面
   */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /**
   * 处理装备物品（从装备详情弹窗）
   */
  const handleEquipItem = () => {
    if (selectedItem && isEquipmentItem(selectedItem) && onEquipItem) {
      onEquipItem(selectedItem);
    }
    handleCloseItemDetailModal();
  };

  // 如果不可见，不渲染任何内容
  if (!isVisible) return null;

  // 判断选中的物品是否是装备类型
  const isSelectedEquipment = selectedItem && isEquipmentItem(selectedItem);
  const selectedEquipmentItem = isSelectedEquipment ? selectedItem as EquipmentItem : null;

  return (
    <div className="inventory-page-overlay" onClick={handleOverlayClick}>
      <div className="inventory-page-container">
        {/* 顶部占位框 */}
        <div className="page-top-placeholder"></div>

        {/* 页面顶部关闭按钮 */}
        <div className="inventory-page-header">
          <h2 className="inventory-page-title">背包</h2>
          {/* 一键售出白品装备按钮 */}
          {onSell && commonEquipments.length > 0 && (
            <button
              className="game-btn"
              onClick={handleSellCommonEquipments}
              title={`售出 ${commonEquipments.length} 件白品装备，获得 ${commonEquipmentsTotalGold.toLocaleString()} 金币`}
            >
              售出白品装备 ({commonEquipments.length})
            </button>
          )}
          <button
            className="inventory-page-close-button"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* 主要内容区域 - 移动端上下布局 */}
        <div className="inventory-page-content">
          {/* 上部：资源信息展示区域 */}
          <div className="inventory-page-top">
            <ResourceDisplay resources={resources} />
          </div>

          {/* 下部：物品网格展示区域 */}
          <div className="inventory-page-bottom">
            {/* 分类筛选区域 - 固定在顶部 */}
            <div className="inventory-category-wrapper">
              <div className="inventory-category-filter">
                <label
                  className={`category-checkbox ${selectedCategories.length === ALL_ITEM_TYPES.length ? 'selected' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.length === ALL_ITEM_TYPES.length}
                    onChange={toggleAllCategories}
                  />
                  全选
                </label>
                {ALL_ITEM_TYPES.map(category => (
                  <label
                    key={category}
                    className={`category-checkbox ${selectedCategories.includes(category) ? 'selected' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                    />
                    {ITEM_TYPE_NAMES[category]}
                  </label>
                ))}
              </div>

              {/* 物品数量提示 */}
              <div className="inventory-filter-info">
                显示 {filteredItems.length} / {items.length} 个物品
              </div>
            </div>

            <ItemGrid
              items={filteredItems}
              onItemClick={handleItemClick}
            />
          </div>
        </div>

        {/* 装备类型使用统一的装备详情弹窗 */}
        {isSelectedEquipment && selectedEquipmentItem ? (
          <EquipmentDetailModal
            isVisible={showItemDetailModal}
            equipment={equipmentItemToDetail(selectedEquipmentItem)}
            characterLevel={characterLevel}
            onClose={handleCloseItemDetailModal}
            onEquip={onEquipItem ? handleEquipItem : undefined}
          />
        ) : (
          /* 其他类型使用通用物品详情弹窗 */
          <ItemDetailModal
            isVisible={showItemDetailModal}
            onClose={handleCloseItemDetailModal}
            item={selectedItem}
            onUseItem={onUseItem}
          />
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
