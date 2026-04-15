import './character.css';

import React from 'react';

import type { EquipmentDetail, EquipmentSlotType } from '../../types';
import { getEquipmentDisplayName, getEquipmentSlotName } from '../../utils/equipmentConverter';
import { getEquipmentIcon, getEquipmentQualityColor } from '../common/utils';

/**
 * 装备详情弹窗组件属性接口
 */
interface EquipmentModalProps {
  /**
   * 是否显示弹窗
   */
  isVisible: boolean;
  /**
   * 装备详情数据
   */
  equipment: EquipmentDetail | null;
  /**
   * 关闭弹窗回调
   */
  onClose: () => void;
  /**
   * 卸下装备回调
   */
  onUnequip?: (slotType: EquipmentSlotType) => void;
  /**
   * 替换装备回调（打开装备选择弹窗）
   */
  onReplace?: (slotType: EquipmentSlotType) => void;
}

/**
 * 装备详情弹窗组件
 * 显示已装备物品的详细信息，有"替换"和"卸下"按钮
 */
const EquipmentModal: React.FC<EquipmentModalProps> = ({
  isVisible,
  equipment,
  onClose,
  onUnequip,
  onReplace
}) => {
  // 点击遮罩层关闭
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 处理卸下装备
  const handleUnequip = () => {
    if (equipment && onUnequip) {
      onUnequip(equipment.type);
      onClose();
    }
  };

  // 处理替换装备
  const handleReplace = () => {
    if (equipment && onReplace) {
      onReplace(equipment.type);
      onClose();
    }
  };

  if (!isVisible || !equipment) return null;

  // 使用 getEquipmentDisplayName 函数生成装备显示名称
  const displayName = getEquipmentDisplayName(equipment.name, equipment.quality, equipment.magicSoulLevel);
  const typeName = getEquipmentSlotName(equipment.type);
  const fullDisplayName = `${typeName}·${displayName}`;

  // 判断是攻击型还是防御型装备
  const isAttackType = ['weapon', 'bracelet', 'necklace'].includes(equipment.type);
  const isDefenseType = ['clothes', 'shoes', 'helmet'].includes(equipment.type);

  return (
    <div
      className="equipment-modal-overlay"
      onClick={handleOverlayClick}
    >
      <div className="equipment-modal-content">
        {/* 关闭按钮 */}
        <button className="equipment-close-modal" onClick={onClose}>
          ×
        </button>

        {/* 装备标题 */}
        <h3
          className="equipment-title"
          style={{ color: getEquipmentQualityColor(equipment.quality) }}
        >
          {fullDisplayName}
        </h3>

        {/* 装备图标 */}
        <div className="equipment-modal-icon">
          {getEquipmentIcon(equipment.type)}
        </div>

        {/* 使用等级 */}
        <div className="equipment-use-level">
          <span className="use-level-label">使用等级：</span>
          <span className="use-level-value">{equipment.useLevel}</span>
        </div>

        {/* 装备属性 */}
        <div className="equipment-attributes">
          {/* 攻击型装备属性 */}
          {isAttackType && (
            <>
              {equipment.attributes.attackMin !== undefined && equipment.attributes.attackMax !== undefined && (
                <div className="attribute-item">
                  <span className="attribute-label">攻击：</span>
                  <span className="attribute-value attack-value">
                    {equipment.attributes.attackMin}-{equipment.attributes.attackMax}
                  </span>
                </div>
              )}
              {equipment.attributes.attackMin !== undefined && equipment.attributes.attackMax !== undefined && equipment.magicSoulLevel > 0 && (
                <div className="attribute-item">
                  <span className="attribute-label">追加攻击：</span>
                  <span className="attribute-value attack-value">
                    +{Math.floor(equipment.attributes.attackMin * 0.1 * equipment.magicSoulLevel)}-+{Math.floor(equipment.attributes.attackMax * 0.1 * equipment.magicSoulLevel)}
                  </span>
                </div>
              )}
            </>
          )}

          {/* 防御型装备属性 */}
          {isDefenseType && (
            <>
              {equipment.attributes.defense !== undefined && (
                <div className="attribute-item">
                  <span className="attribute-label">防御：</span>
                  <span className="attribute-value defense-value">
                    {equipment.attributes.defense}
                  </span>
                </div>
              )}
              {equipment.attributes.defense !== undefined && equipment.magicSoulLevel > 0 && (
                <div className="attribute-item">
                  <span className="attribute-label">追加防御：</span>
                  <span className="attribute-value defense-value">
                    +{Math.floor(equipment.attributes.defense * 0.1 * equipment.magicSoulLevel)}
                  </span>
                </div>
              )}
            </>
          )}

          {/* 其他属性 */}
          {equipment.attributes.hp !== undefined && (
            <div className="attribute-item">
              <span className="attribute-label">生命：</span>
              <span className="attribute-value hp-value">+{equipment.attributes.hp}</span>
            </div>
          )}

          {equipment.attributes.mp !== undefined && (
            <div className="attribute-item">
              <span className="attribute-label">魔法：</span>
              <span className="attribute-value mp-value">+{equipment.attributes.mp}</span>
            </div>
          )}

          {equipment.attributes.dodge !== undefined && (
            <div className="attribute-item">
              <span className="attribute-label">闪避：</span>
              <span className="attribute-value">+{equipment.attributes.dodge}</span>
            </div>
          )}

          {equipment.attributes.luck !== undefined && (
            <div className="attribute-item">
              <span className="attribute-label">幸运：</span>
              <span className="attribute-value">+{equipment.attributes.luck}</span>
            </div>
          )}
        </div>

        {/* 宝石洞 */}
        <div className="equipment-hole-section">
          <div className="hole-count">
            <span className="hole-label">可镶嵌宝石：</span>
            <span className="hole-value">{equipment.holeCount}个</span>
          </div>

          {equipment.gemAttributes && equipment.gemAttributes.length > 0 && (
            <div className="gem-attributes">
              <div className="gem-title">宝石属性：</div>
              {equipment.gemAttributes.map((gem, index) => (
                <div key={index} className="gem-item">
                  {gem.attack !== undefined && (
                    <span className="gem-value attack-value">攻击+{gem.attack}</span>
                  )}
                  {gem.defense !== undefined && (
                    <span className="gem-value defense-value">防御+{gem.defense}</span>
                  )}
                  {gem.hp !== undefined && (
                    <span className="gem-value hp-value">生命+{gem.hp}</span>
                  )}
                  {gem.mp !== undefined && (
                    <span className="gem-value mp-value">魔法+{gem.mp}</span>
                  )}
                  {gem.dodge !== undefined && (
                    <span className="gem-value">闪避+{gem.dodge}</span>
                  )}
                  {gem.luck !== undefined && (
                    <span className="gem-value">幸运+{gem.luck}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 魔魂等级 */}
        <div className="equipment-magic-soul">
          <span className="magic-soul-label">魔魂等级：</span>
          <span className="magic-soul-value">{equipment.magicSoulLevel}</span>
        </div>

        {/* 战魂属性 */}
        {equipment.soulType && equipment.soulType > 0 && (
          <div className="equipment-soul-section">
            <span className="soul-label">战魂：</span>
            <span className="soul-value">
              {equipment.soulType === 1 ? `天魂 Lv.${equipment.soulLevel}` : `地魂 Lv.${equipment.soulLevel}`}
            </span>
          </div>
        )}

        {/* 战斗力 */}
        <div className="equipment-combat-power">
          <span className="combat-power-label">战斗力：</span>
          <span className="combat-power-value">{equipment.combatPower}</span>
        </div>

        {/* 卸下按钮 */}
        <div className="equipment-modal-actions">
          <button className="unequip-button" onClick={handleUnequip}>
            卸下装备
          </button>
          <button className="replace-button-bottom" onClick={handleReplace}>
            替换
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipmentModal;
