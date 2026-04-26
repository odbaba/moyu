import './EquipmentRefineModal.css';

import React, { useEffect, useMemo, useState } from 'react';

import type { EquipmentDetail, EquipmentItem, EquipmentSlotType, GemItem, InventoryItem, RefineResult } from '../../types';
import { equipmentDetailToItem, getEquipmentDisplayName } from '../../utils/equipmentConverter';
import {
  activateSoul,
  embedGem,
  refineMagicSoul,
  refineOpenHole,
  refineQuality,
  refineUseLevel,
  removeGem} from '../../utils/equipmentRefine';
import ItemGrid from '../inventory/ItemGrid';
import { getEquipmentQualityColor } from './utils';

/**
 * 装备精炼模态窗口组件属性接口
 * 定义组件接收的参数类型
 */
interface EquipmentRefineModalProps {
  /** 是否显示模态窗口 */
  isVisible: boolean;
  /** 关闭模态窗口的回调函数 */
  onClose: () => void;
  /** 当前选中的装备 */
  equipment: EquipmentItem | null;
  /** 当前选中的宝石 */
  gem: GemItem | null;
  /** 装备变更回调函数 */
  onEquipmentChange: (equipment: EquipmentItem | null) => void;
  /** 宝石变更回调函数 */
  onGemChange: (gem: GemItem | null) => void;
  /** 精炼回调函数 */
  onRefine: (result: RefineResult) => void;
  /** 玩家等级 */
  playerLevel: number;
  /** 背包中的所有装备物品列表 */
  inventoryEquipments: EquipmentItem[];
  /** 背包中的所有宝石物品列表 */
  inventoryGems: GemItem[];
  /** 角色身上已装备的装备列表 */
  equippedItems: Record<EquipmentSlotType, EquipmentDetail | null>;
  /** 战魂系统是否已开启，用于精炼函数判断是否激活战魂 */
  warSoulSystemEnabled: boolean;
}

/**
 * 装备精炼模态窗口组件
 * 用于装备精炼操作，支持选择装备和宝石进行精炼
 * 移动端优化：全屏布局，一屏显示所有信息
 */
const EquipmentRefineModal: React.FC<EquipmentRefineModalProps> = ({
  isVisible,
  onClose,
  equipment,
  gem,
  onEquipmentChange,
  onGemChange,
  onRefine,
  playerLevel,
  inventoryEquipments,
  inventoryGems,
  equippedItems,
  warSoulSystemEnabled
}) => {
  // 当前选择的标签页：'equipment' 或 'gem'
  const [activeTab, setActiveTab] = useState<'equipment' | 'gem'>('equipment');

  // 精炼结果反馈状态
  const [refineResult, setRefineResult] = useState<RefineResult | null>(null);

  // 是否显示选择列表
  const [showSelection, setShowSelection] = useState(false);

  // 图片加载失败状态
  const [equipImageError, setEquipImageError] = useState(false);
  const [gemImageError, setGemImageError] = useState(false);

  // 每次装备或宝石切换时重置图片错误状态
  useEffect(() => {
    setEquipImageError(false);
  }, [equipment?.id]);

  useEffect(() => {
    setGemImageError(false);
  }, [gem?.id]);

  /**
   * 渲染物品图标（优先显示图片，加载失败回退到emoji）
   */
  const renderItemIcon = (item: { icon: string; imagePath?: string }, isImageError: boolean, onError: () => void) => {
    if (item.imagePath && !isImageError) {
      return (
        <img
          src={item.imagePath}
          alt={item.icon}
          className="refine-slot-image"
          onError={onError}
        />
      );
    }

    return <span className="refine-slot-icon">{item.icon}</span>;
  };

  /**
   * 合并背包装备和角色装备
   * 将角色装备转换为 EquipmentItem 类型后与背包装备合并
   */
  const allEquipments = useMemo(() => {
    // 从角色装备中提取非空装备，转换为 EquipmentItem 类型
    const equippedList: EquipmentItem[] = Object.values(equippedItems)
      .filter((item): item is EquipmentDetail => item !== null)
      .map(detail => equipmentDetailToItem(detail));

    // 合并背包装备和角色装备
    return [...inventoryEquipments, ...equippedList];
  }, [inventoryEquipments, equippedItems]);

  /**
   * 过滤出可精炼的装备
   * 只显示玩家等级可使用的装备
   */
  const availableEquipments = useMemo(() => {
    return allEquipments.filter(item => item.useLevel <= playerLevel);
  }, [allEquipments, playerLevel]);

  /**
   * 过滤出可用的宝石
   * 显示强化类宝石和镶嵌类宝石
   */
  const availableGems = useMemo(() => {
    return inventoryGems.filter(item =>
      item.gemType === 'enhance' || item.gemType === 'embed' ||
      item.gemSubType === 'openHole' || item.gemSubType === 'soul' || item.gemSubType === 'embed'
    );
  }, [inventoryGems]);

  /**
   * 处理遮罩层点击事件
   * 点击遮罩层（非内容区域）关闭模态窗口
   */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /**
   * 处理装备槽点击事件
   * 打开装备选择列表
   */
  const handleEquipmentSlotClick = () => {
    setActiveTab('equipment');
    setShowSelection(true);
  };

  /**
   * 处理宝石槽点击事件
   * 打开宝石选择列表
   */
  const handleGemSlotClick = () => {
    setActiveTab('gem');
    setShowSelection(true);
  };

  /**
   * 处理装备选择事件
   * @param item 选中的装备物品
   */
  const handleEquipmentSelect = (item: InventoryItem) => {
    onEquipmentChange(item as EquipmentItem);
    setShowSelection(false);
    // 换装备时清空精炼结果提示
    setRefineResult(null);
  };

  /**
   * 处理宝石选择事件
   * @param item 选中的宝石物品
   */
  const handleGemSelect = (item: InventoryItem) => {
    onGemChange(item as GemItem);
    setShowSelection(false);
    // 换宝石时清空精炼结果提示
    setRefineResult(null);
  };

  /**
   * 处理移除装备事件
   */
  const handleRemoveEquipment = () => {
    onEquipmentChange(null);
    // 移除装备时清空精炼结果提示
    setRefineResult(null);
  };

  /**
   * 处理移除宝石事件
   */
  const handleRemoveGem = () => {
    onGemChange(null);
    // 移除宝石时清空精炼结果提示
    setRefineResult(null);
  };

  /**
   * 处理摘除已镶嵌宝石事件
   * 调用 removeGem 函数摘除装备上指定位置的宝石
   * @param gemIndex 要摘除的宝石索引
   */
  const handleRemoveEmbeddedGem = (gemIndex: number) => {
    if (!equipment) return;

    const result = removeGem(equipment, gemIndex);

    // 更新装备状态
    if (result.success) {
      onEquipmentChange({ ...equipment });
    }

    // 调用回调
    onRefine(result);

    // 显示结果
    setRefineResult(result);

    // 5秒后自动清除结果
    setTimeout(() => {
      setRefineResult(null);
    }, 5000);
  };

  /**
   * 处理开始精炼事件
   * 检查装备和宝石是否都已选择，执行精炼逻辑
   */
  const handleRefine = () => {
    if (!equipment || !gem) {
      setRefineResult({
        success: false,
        message: '请先选择装备和宝石！'
      });

      return;
    }

    let result: RefineResult;

    // 根据宝石类型调用对应的精炼函数
    // 优先使用 refineType，不匹配时根据 gemSubType 和宝石名称判断
    const embedGemNames = ['中级战斗力石', '高级战斗力石', '中级经验石', '高级经验石'];
    const isEmbedGem = gem.refineType === 'embed' || gem.gemSubType === 'embed' || embedGemNames.includes(gem.name);

    if (gem.refineType === 'quality') {
      result = refineQuality(equipment, gem, warSoulSystemEnabled);
    } else if (gem.refineType === 'magicSoul') {
      result = refineMagicSoul(equipment, gem, warSoulSystemEnabled);
    } else if (gem.refineType === 'useLevel') {
      result = refineUseLevel(equipment, gem, playerLevel);
    } else if (gem.refineType === 'openHole') {
      result = refineOpenHole(equipment, gem, warSoulSystemEnabled);
    } else if (isEmbedGem) {
      result = embedGem(equipment, gem);
    } else if (gem.refineType === 'soul' || gem.gemSubType === 'soul') {
      result = activateSoul(equipment, gem, warSoulSystemEnabled);
    } else {
      result = {
        success: false,
        message: '未知的精炼类型'
      };
    }

    // 更新装备状态
    if (result.success) {
      onEquipmentChange({ ...equipment });
    }

    // 调用回调
    onRefine(result);

    // 显示结果
    setRefineResult(result);

    // 5秒后自动清除结果
    setTimeout(() => {
      setRefineResult(null);
    }, 5000);
  };

  /**
   * 关闭选择列表
   */
  const handleCloseSelection = () => {
    setShowSelection(false);
  };

  /**
   * 检查是否可以精炼
   * 装备和宝石都已选择时返回 true
   */
  const canRefine = equipment && gem;

  // 如果不可见，不渲染任何内容
  if (!isVisible) return null;

  return (
    <div className="refine-modal-overlay" onClick={handleOverlayClick}>
      <div className="refine-modal-content">
        {/* 关闭按钮 */}
        <button className="refine-close-modal" onClick={onClose}>×</button>

        {/* 标题 */}
        <h3 className="refine-modal-title">装备精炼</h3>

        {/* 精炼区域 */}
        <div className="refine-slots-container">
          {/* 装备槽 */}
          <div className="refine-slot-wrapper">
            <div
              className={`refine-slot equipment-slot ${equipment ? 'filled' : ''}`}
              onClick={handleEquipmentSlotClick}
            >
              {equipment ? (
                <div className="slot-content">
                  {renderItemIcon(equipment, equipImageError, () => setEquipImageError(true))}
                  <div
                    className="slot-name"
                    style={{ color: getEquipmentQualityColor(equipment.equipmentQuality) }}
                  >
                    {getEquipmentDisplayName(equipment.name, equipment.equipmentQuality, equipment.magicSoulLevel)}
                  </div>
                  <div className="slot-info">
                    <div>等级: {equipment.useLevel}</div>
                    <div>品质: {equipment.equipmentQuality}</div>
                    {equipment.magicSoulLevel > 0 && <div>魔魂: +{equipment.magicSoulLevel}</div>}
                  </div>
                  {/* 已镶嵌宝石列表，支持点击摘除 */}
                  {equipment.gems && equipment.gems.length > 0 && (
                    <div className="embedded-gems-list">
                      {equipment.gems.map((gemName, index) => (
                        <button
                          key={index}
                          className="embedded-gem-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveEmbeddedGem(index);
                          }}
                          title="点击摘除宝石"
                        >
                          {gemName} ✕
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="slot-placeholder">
                  <div className="placeholder-icon">⚔️</div>
                  <div className="placeholder-text">点击选择装备</div>
                </div>
              )}
            </div>
            {equipment && (
              <button className="remove-button" onClick={handleRemoveEquipment}>
                移除
              </button>
            )}
          </div>

          {/* 精炼按钮 */}
          <div className="refine-button-container">
            <button
              className={`refine-button ${canRefine ? 'active' : ''}`}
              onClick={handleRefine}
              disabled={!canRefine}
            >
              开始精炼
            </button>
          </div>

          {/* 宝石槽 */}
          <div className="refine-slot-wrapper">
            <div
              className={`refine-slot gem-slot ${gem ? 'filled' : ''}`}
              onClick={handleGemSlotClick}
            >
              {gem ? (
                <div className="slot-content">
                  {renderItemIcon(gem, gemImageError, () => setGemImageError(true))}
                  <div className="slot-name">{gem.name}</div>
                  <div className="slot-info">
                    <div>效果: {gem.effect}</div>
                    {gem.successRate && <div>成功率: {gem.successRate}</div>}
                  </div>
                </div>
              ) : (
                <div className="slot-placeholder">
                  <div className="placeholder-icon">💎</div>
                  <div className="placeholder-text">点击选择宝石</div>
                </div>
              )}
            </div>
            {gem && (
              <button className="remove-button" onClick={handleRemoveGem}>
                移除
              </button>
            )}
          </div>
        </div>

        {/* 结果反馈区域 */}
        {refineResult && (
          <div className={`refine-result ${refineResult.success ? 'success' : 'failure'}`}>
            <div className="result-message">{refineResult.message}</div>
          </div>
        )}

        {/* 物品选择列表 */}
        {showSelection && (
          <div className="selection-overlay" onClick={handleCloseSelection}>
            <div className="selection-content" onClick={(e) => e.stopPropagation()}>
              <div className="selection-header">
                <h4>{activeTab === 'equipment' ? '选择装备' : '选择宝石'}</h4>
                <button className="selection-close" onClick={handleCloseSelection}>×</button>
              </div>
              <div className="selection-tabs">
                <button
                  className={`tab-button ${activeTab === 'equipment' ? 'active' : ''}`}
                  onClick={() => setActiveTab('equipment')}
                >
                  装备
                </button>
                <button
                  className={`tab-button ${activeTab === 'gem' ? 'active' : ''}`}
                  onClick={() => setActiveTab('gem')}
                >
                  宝石
                </button>
              </div>
              <div className="selection-list">
                {activeTab === 'equipment' ? (
                  availableEquipments.length > 0 ? (
                    <ItemGrid
                      items={availableEquipments}
                      onItemClick={handleEquipmentSelect}
                    />
                  ) : (
                    <div className="selection-empty">
                      <div className="empty-icon">📦</div>
                      <div className="empty-text">没有可用的装备</div>
                    </div>
                  )
                ) : (
                  availableGems.length > 0 ? (
                    <ItemGrid
                      items={availableGems}
                      onItemClick={handleGemSelect}
                    />
                  ) : (
                    <div className="selection-empty">
                      <div className="empty-icon">💎</div>
                      <div className="empty-text">没有可用的宝石</div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentRefineModal;
