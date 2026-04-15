import './character.css';

import React from 'react';

import type { EquipmentItem } from '../../types';
import { EQUIPMENT_SLOT_TYPE_NAMES } from '../common/constants';
import { getEquipmentQualityColor } from '../common/utils';

/**
 * 背包装备详情弹窗组件属性接口
 */
interface InventoryEquipmentModalProps {
  /**
   * 是否显示弹窗
   */
  isVisible: boolean;
  /**
   * 装备物品数据
   */
  item: EquipmentItem | null;
  /**
   * 关闭弹窗回调
   */
  onClose: () => void;
  /**
   * 装备按钮点击回调
   */
  onEquip: (item: EquipmentItem) => void;
}

/**
 * 背包装备详情弹窗组件
 * 显示装备详情和装备按钮
 * 使用更高的z-index确保在选择弹窗之上
 */
const InventoryEquipmentModal: React.FC<InventoryEquipmentModalProps> = ({
  isVisible,
  item,
  onClose,
  onEquip
}) => {
  // 处理装备按钮点击
  const handleEquipClick = () => {
    if (item) {
      onEquip(item);
      onClose();
    }
  };

  // 处理遮罩层点击
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isVisible || !item) return null;

  // 判断装备类型
  const isAttackType = ['weapon', 'bracelet', 'necklace'].includes(item.equipmentType);
  const isDefenseType = ['helmet', 'clothes', 'shoes'].includes(item.equipmentType);

  // 计算追加属性
  const calculateAddAttack = (base: number) => Math.floor(base / 10) * (item.magicSoulLevel || 0);
  const calculateAddDefense = (base: number) => Math.floor(base / 10) * (item.magicSoulLevel || 0);

  return (
    <div
      className="inventory-equipment-modal-overlay"
      onClick={handleOverlayClick}
    >
      <div className="inventory-equipment-modal-content">
        {/* 关闭按钮 */}
        <button
          className="inventory-equipment-close-button"
          onClick={onClose}
        >
          ×
        </button>

        {/* 装备名称 */}
        <h3
          className="inventory-equipment-title"
          style={{ color: getEquipmentQualityColor(item.equipmentQuality) }}
        >
          {item.equipmentQuality}{item.name}
        </h3>

        {/* 装备类型 */}
        <div className="inventory-equipment-info-row">
          <span className="info-label">装备类型</span>
          <span className="info-value">{EQUIPMENT_SLOT_TYPE_NAMES[item.equipmentType]}</span>
        </div>

        {/* 使用等级 */}
        <div className="inventory-equipment-info-row">
          <span className="info-label">使用等级</span>
          <span className="info-value">{item.useLevel}级</span>
        </div>

        {/* 装备属性 */}
        <div className="inventory-equipment-attributes">
          {/* 攻击型装备显示攻击力 */}
          {isAttackType && item.attackMin !== undefined && item.attackMax !== undefined && (
            <>
              <div className="attribute-row">
                <span className="attribute-label">攻击：</span>
                <span className="attribute-value attack-value">
                  {item.attackMin}-{item.attackMax}
                </span>
              </div>
              {item.magicSoulLevel > 0 && (
                <div className="attribute-row">
                  <span className="attribute-label">追加攻击：</span>
                  <span className="attribute-value attack-value">
                    +{calculateAddAttack(item.attackMin)}-+{calculateAddAttack(item.attackMax)}
                  </span>
                </div>
              )}
            </>
          )}

          {/* 防御型装备显示防御力 */}
          {isDefenseType && item.defense !== undefined && (
            <>
              <div className="attribute-row">
                <span className="attribute-label">防御：</span>
                <span className="attribute-value defense-value">
                  {item.defense}
                </span>
              </div>
              {item.magicSoulLevel > 0 && (
                <div className="attribute-row">
                  <span className="attribute-label">追加防御：</span>
                  <span className="attribute-value defense-value">
                    +{calculateAddDefense(item.defense)}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* 魔魂等级 */}
        <div className="inventory-equipment-info-row">
          <span className="info-label">魔魂等级</span>
          <span className="info-value">+{item.magicSoulLevel}</span>
        </div>

        {/* 宝石洞 */}
        <div className="inventory-equipment-info-row">
          <span className="info-label">宝石洞</span>
          <span className="info-value">{item.holeCount}个</span>
        </div>

        {/* 战魂属性 */}
        {item.soulType && item.soulType > 0 && (
          <div className="inventory-equipment-info-row">
            <span className="info-label">战魂</span>
            <span className="info-value soul-value">
              {item.soulType === 1 ? `天魂 Lv.${item.soulLevel}` : `地魂 Lv.${item.soulLevel}`}
            </span>
          </div>
        )}

        {/* 装备按钮 - 固定在弹窗底部 */}
        <div className="inventory-equipment-modal-footer">
          <button
            className="inventory-equipment-equip-button"
            onClick={handleEquipClick}
          >
            装备
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryEquipmentModal;
