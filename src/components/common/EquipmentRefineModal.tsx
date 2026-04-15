import './EquipmentRefineModal.css';

import React, { useMemo, useState } from 'react';

import type { EquipmentItem, GemItem, InventoryItem, RefineResult } from '../../types';
import { getEquipmentDisplayName } from '../../utils/equipmentConverter';
import {
  activateSoul,
  embedGem,
  refineMagicSoul,
  refineOpenHole,
  refineQuality,
  refineUseLevel} from '../../utils/equipmentRefine';
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
  inventoryGems
}) => {
  // 当前选择的标签页：'equipment' 或 'gem'
  const [activeTab, setActiveTab] = useState<'equipment' | 'gem'>('equipment');

  // 精炼结果反馈状态
  const [refineResult, setRefineResult] = useState<RefineResult | null>(null);

  // 是否显示选择列表
  const [showSelection, setShowSelection] = useState(false);

  /**
   * 过滤出可精炼的装备
   * 只显示玩家等级可使用的装备
   */
  const availableEquipments = useMemo(() => {
    return inventoryEquipments.filter(item => item.useLevel <= playerLevel);
  }, [inventoryEquipments, playerLevel]);

  /**
   * 过滤出可用的宝石
   * 只显示强化类宝石
   */
  const availableGems = useMemo(() => {
    return inventoryGems.filter(item =>
      item.gemType === 'enhance' || item.gemSubType === 'openHole' || item.gemSubType === 'soul'
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
  };

  /**
   * 处理宝石选择事件
   * @param item 选中的宝石物品
   */
  const handleGemSelect = (item: InventoryItem) => {
    onGemChange(item as GemItem);
    setShowSelection(false);
  };

  /**
   * 处理移除装备事件
   */
  const handleRemoveEquipment = () => {
    onEquipmentChange(null);
  };

  /**
   * 处理移除宝石事件
   */
  const handleRemoveGem = () => {
    onGemChange(null);
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

    // 根据宝石的 refineType 调用对应的精炼函数
    switch (gem.refineType) {
      case 'quality':
        result = refineQuality(equipment, gem);
        break;
      case 'magicSoul':
        result = refineMagicSoul(equipment, gem);
        break;
      case 'useLevel':
        result = refineUseLevel(equipment, gem, playerLevel);
        break;
      case 'openHole':
        result = refineOpenHole(equipment, gem);
        break;
      case 'embed':
        result = embedGem(equipment, gem);
        break;
      case 'soul':
        result = activateSoul(equipment, gem);
        break;
      default:
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

    // 3秒后自动清除结果
    setTimeout(() => {
      setRefineResult(null);
    }, 3000);
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
                  <div className="slot-icon">{equipment.icon}</div>
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
                  <div className="slot-icon">{gem.icon}</div>
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
            {refineResult.attributeChanges && (
              <div className="result-changes">
                {Object.entries(refineResult.attributeChanges).map(([key, value]) => {
                  // 属性名称映射表（英文 -> 中文）
                  const attributeNameMap: Record<string, string> = {
                    qualityLevel: '品质等级',
                    combatPowerChange: '战斗力变化',
                    magicSoulLevel: '魔魂等级',
                    magicSoulChange: '魔魂变化',
                    useLevel: '使用等级',
                    useLevelChange: '等级变化',
                    holeCount: '洞数',
                    soulLevel: '战魂等级',
                    soulType: '战魂类型',
                    soulActivated: '战魂激活',
                    attackMinChange: '最小攻击变化',
                    attackMaxChange: '最大攻击变化',
                    defenseChange: '防御变化',
                  };

                  const displayName = attributeNameMap[key] || key;
                  const displayValue = typeof value === 'number' && value > 0 ? `+${value}` : value;

                  return (
                    <div key={key} className="change-item">
                      {displayName}: {displayValue}
                    </div>
                  );
                })}
              </div>
            )}
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
