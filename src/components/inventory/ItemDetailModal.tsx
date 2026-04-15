import React, { useState } from 'react';
import type { InventoryItem, EquipmentItem } from '../../types';
import { ITEM_TYPE_NAMES, RARITY_CONFIG, EQUIPMENT_SLOT_TYPE_NAMES } from '../common/constants';
import { getRarityColor, getEquipmentQualityColor, isEquipmentItem } from '../common/utils';
import './ItemDetailModal.css';

/**
 * 物品详情弹窗组件 Props 接口
 */
interface ItemDetailModalProps {
  isVisible: boolean;           // 是否显示弹窗
  onClose: () => void;          // 关闭弹窗的回调函数
  item: InventoryItem | null;   // 要显示的物品数据
  onUseItem?: (item: InventoryItem) => void;  // 使用物品的回调函数
}

/**
 * 物品详情弹窗组件
 * 用于显示物品的详细信息，包括名称、图标、属性、获取途径等
 * 支持点击关闭按钮或弹窗外部关闭，带有过渡动画效果
 */
const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ 
  isVisible, 
  onClose, 
  item,
  onUseItem
}) => {
  // 如果弹窗不可见或没有物品数据，则不渲染
  if (!isVisible || !item) return null;

  /**
   * 处理点击遮罩层关闭弹窗
   */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /**
   * 处理使用物品
   */
  const handleUseItem = () => {
    if (onUseItem && item.usable) {
      onUseItem(item);
      onClose();
    }
  };

  /**
   * 渲染装备类物品的详细信息
   * 参考角色页面的装备弹窗格式
   */
  const renderEquipmentDetails = (equip: EquipmentItem) => {
    // 判断装备类型：攻击型还是防御型
    const isAttackType = ['weapon', 'bracelet', 'necklace'].includes(equip.equipmentType);
    const isDefenseType = ['helmet', 'armor', 'shoes'].includes(equip.equipmentType);

    // 计算追加属性（基于魔魂等级）
    const calculateAddAttack = (base: number) => Math.floor(base / 10) * equip.magicSoulLevel;
    const calculateAddDefense = (base: number) => Math.floor(base / 10) * equip.magicSoulLevel;

    return (
      <>
        {/* 装备品质和类型 */}
        <div className="equipment-quality-section">
          <div className="info-item">
            <span className="info-label">品质</span>
            <span 
              className="info-value quality-value"
              style={{ color: getEquipmentQualityColor(equip.equipmentQuality) }}
            >
              {equip.equipmentQuality}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">装备类型</span>
            <span className="info-value">{EQUIPMENT_SLOT_TYPE_NAMES[equip.equipmentType]}</span>
          </div>
        </div>

        {/* 使用等级 */}
        <div className="equipment-use-level-section">
          <span className="use-level-label">使用等级：</span>
          <span className="use-level-value">{equip.useLevel}级</span>
        </div>

        {/* 装备属性 */}
        <div className="equipment-attributes-section">
          <div className="section-title">装备属性</div>
          <div className="equipment-attributes-list">
            {/* 攻击型装备显示攻击力 */}
            {isAttackType && equip.attackMin !== undefined && equip.attackMax !== undefined && (
              <>
                <div className="equipment-attribute">
                  <span className="attribute-label">攻击：</span>
                  <span className="attribute-value attack-value">
                    {equip.attackMin}-{equip.attackMax}
                  </span>
                </div>
                {equip.magicSoulLevel > 0 && (
                  <div className="equipment-attribute">
                    <span className="attribute-label">追加攻击：</span>
                    <span className="attribute-value attack-value">
                      +{calculateAddAttack(equip.attackMin)}-+{calculateAddAttack(equip.attackMax)}
                    </span>
                  </div>
                )}
              </>
            )}

            {/* 防御型装备显示防御力 */}
            {isDefenseType && equip.defense !== undefined && (
              <>
                <div className="equipment-attribute">
                  <span className="attribute-label">防御：</span>
                  <span className="attribute-value defense-value">
                    {equip.defense}
                  </span>
                </div>
                {equip.magicSoulLevel > 0 && (
                  <div className="equipment-attribute">
                    <span className="attribute-label">追加防御：</span>
                    <span className="attribute-value defense-value">
                      +{calculateAddDefense(equip.defense)}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* 魔魂等级 */}
        <div className="equipment-magic-soul-section">
          <span className="magic-soul-label">魔魂等级：</span>
          <span className="magic-soul-value">+{equip.magicSoulLevel}</span>
        </div>

        {/* 宝石洞 */}
        <div className="equipment-hole-section">
          <span className="hole-label">宝石洞：</span>
          <span className="hole-value">{equip.holeCount}个</span>
        </div>

        {/* 价值信息 */}
        <div className="equipment-value-section">
          <div className="section-title">价值</div>
          <div className="value-list">
            {equip.goldValue !== undefined && equip.goldValue > 0 && (
              <div className="value-item">
                <span className="value-label">💰 金币</span>
                <span className="value-value">{equip.goldValue.toLocaleString()}</span>
              </div>
            )}
            {equip.magicStoneValue !== undefined && equip.magicStoneValue > 0 && (
              <div className="value-item">
                <span className="value-label">💎 魔石</span>
                <span className="value-value">{equip.magicStoneValue.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  /**
   * 渲染普通物品属性列表
   */
  const renderAttributes = () => {
    if (!item.attributes) return null;

    const attributesList: React.ReactElement[] = [];

    if (item.attributes.hp !== undefined) {
      attributesList.push(
        <div key="hp" className="item-attribute">
          <span className="attribute-label">生命值</span>
          <span className="attribute-value hp-value">+{item.attributes.hp}</span>
        </div>
      );
    }

    if (item.attributes.mp !== undefined) {
      attributesList.push(
        <div key="mp" className="item-attribute">
          <span className="attribute-label">魔法值</span>
          <span className="attribute-value mp-value">+{item.attributes.mp}</span>
        </div>
      );
    }

    if (item.attributes.attack !== undefined) {
      attributesList.push(
        <div key="attack" className="item-attribute">
          <span className="attribute-label">攻击力</span>
          <span className="attribute-value attack-value">+{item.attributes.attack}</span>
        </div>
      );
    }

    if (item.attributes.defense !== undefined) {
      attributesList.push(
        <div key="defense" className="item-attribute">
          <span className="attribute-label">防御力</span>
          <span className="attribute-value defense-value">+{item.attributes.defense}</span>
        </div>
      );
    }

    if (item.attributes.stamina !== undefined) {
      attributesList.push(
        <div key="stamina" className="item-attribute">
          <span className="attribute-label">体力</span>
          <span className="attribute-value stamina-value">+{item.attributes.stamina}</span>
        </div>
      );
    }

    if (item.attributes.luck !== undefined) {
      attributesList.push(
        <div key="luck" className="item-attribute">
          <span className="attribute-label">幸运值</span>
          <span className="attribute-value luck-value">+{item.attributes.luck}</span>
        </div>
      );
    }

    return attributesList.length > 0 ? (
      <div className="item-attributes-section">
        <div className="section-title">物品属性</div>
        <div className="item-attributes-list">
          {attributesList}
        </div>
      </div>
    ) : null;
  };

  // 检查是否为装备类型
  const isEquipment = isEquipmentItem(item);
  const equipmentItem = isEquipment ? item as EquipmentItem : null;

  // 图片加载失败状态
  const [imageError, setImageError] = useState(false);

  /**
   * 处理图片加载失败
   */
  const handleImageError = () => {
    setImageError(true);
  };

  /**
   * 渲染物品图标
   * 所有物品优先显示图片，加载失败时回退到emoji
   */
  const renderItemIcon = () => {
    // 装备类物品优先使用装备的imagePath
    if (isEquipment && equipmentItem?.imagePath && !imageError) {
      return (
        <img
          src={equipmentItem.imagePath}
          alt={item.name}
          className="item-detail-image"
          onError={handleImageError}
        />
      );
    }
    // 其他物品使用自身的imagePath
    if (item.imagePath && !imageError) {
      return (
        <img
          src={item.imagePath}
          alt={item.name}
          className="item-detail-image"
          onError={handleImageError}
        />
      );
    }
    return <span className="item-icon">{item.icon}</span>;
  };

  // 获取当前物品的稀有度配置
  const currentRarityColor = getRarityColor(item.rarity || 'common');

  return (
    <div 
      className="item-detail-modal-overlay" 
      onClick={handleOverlayClick}
    >
      <div className="item-detail-modal-content">
        {/* 关闭按钮 */}
        <button 
          className="item-detail-close-button" 
          onClick={onClose}
          aria-label="关闭"
        >
          ×
        </button>
        
        {/* 物品头部信息：图标和名称 */}
        <div className="item-detail-header">
          <div className="item-icon-wrapper">
            {renderItemIcon()}
          </div>
          {/* 装备类物品名称使用品质颜色 */}
          <h3 
            className="item-name" 
            style={{ 
              color: isEquipment 
                ? getEquipmentQualityColor((item as EquipmentItem).equipmentQuality) 
                : currentRarityColor 
            }}
          >
            {item.name}
          </h3>
        </div>
        
        {/* 装备类物品显示专门的装备信息 */}
        {isEquipment ? (
          renderEquipmentDetails(item as EquipmentItem)
        ) : (
          <>
            {/* 普通物品基本信息 */}
            <div className="item-basic-info">
              <div className="info-item">
                <span className="info-label">物品类型</span>
                <span className="info-value">{ITEM_TYPE_NAMES[item.type]}</span>
              </div>
              <div className="info-item">
                <span className="info-label">稀有度</span>
                <span 
                  className="info-value rarity-value"
                  style={{ color: currentRarityColor }}
                >
                  {RARITY_CONFIG[item.rarity || 'common']?.name || '普通'}
                </span>
              </div>
            </div>

            {/* 物品数量 */}
            {item.quantity > 1 && (
              <div className="item-quantity-section">
                <span className="quantity-label">持有数量</span>
                <span className="quantity-value">{item.quantity}</span>
              </div>
            )}
            
            {/* 普通物品属性区域 */}
            {renderAttributes()}
          </>
        )}
        
        {/* 获取途径 */}
        {item.source && (
          <div className="item-source-section">
            <div className="section-title">获取途径</div>
            <div className="item-source">{item.source}</div>
          </div>
        )}
        
        {/* 物品描述 */}
        <div className="item-description-section">
          <div className="section-title">物品描述</div>
          <div className="item-description">{item.description}</div>
        </div>

        {/* 物品特性标签 */}
        <div className="item-tags">
          {item.usable && (
            <span className="item-tag usable-tag">可使用</span>
          )}
          {item.equippable && (
            <span className="item-tag equippable-tag">可装备</span>
          )}
          {item.maxStack && item.maxStack > 1 && (
            <span className="item-tag stack-tag">可堆叠×{item.maxStack}</span>
          )}
        </div>

        {/* 使用按钮 */}
        {item.usable && onUseItem && (
          <button className="use-item-button" onClick={handleUseItem}>
            使用物品
          </button>
        )}
      </div>
    </div>
  );
};

export default ItemDetailModal;
