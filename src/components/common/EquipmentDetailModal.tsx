import './EquipmentDetailModal.css';

import React, { useState } from 'react';

import type { EquipmentDetail } from '../../types';
import { EQUIPMENT_SLOT_TYPE_NAMES } from '../common/constants';
import { getEquipmentQualityColor } from '../common/utils';

/**
 * 统一装备详情弹窗组件属性接口
 */
interface EquipmentDetailModalProps {
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
   * 装备按钮点击回调（背包来源时显示）
   */
  onEquip?: () => void;
  /**
   * 卸下装备回调（角色面板来源时显示）
   */
  onUnequip?: () => void;
  /**
   * 替换装备回调（角色面板来源时显示）
   */
  onReplace?: () => void;
}

/**
 * 统一装备详情弹窗组件
 * 整合角色面板和背包的装备详情显示
 * 根据来源动态显示操作按钮
 */
const EquipmentDetailModal: React.FC<EquipmentDetailModalProps> = ({
  isVisible,
  equipment,
  onClose,
  onEquip,
  onUnequip,
  onReplace
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
   * 处理遮罩层点击
   */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /**
   * 处理装备按钮点击
   */
  const handleEquipClick = () => {
    if (onEquip) {
      onEquip();
      onClose();
    }
  };

  /**
   * 处理卸下装备点击
   */
  const handleUnequipClick = () => {
    if (onUnequip) {
      onUnequip();
      onClose();
    }
  };

  /**
   * 处理替换装备点击
   */
  const handleReplaceClick = () => {
    if (onReplace) {
      onReplace();
      onClose();
    }
  };

  // 如果不可见或无装备数据，不渲染
  if (!isVisible || !equipment) return null;

  // 判断是攻击型还是防御型装备
  const isAttackType = ['weapon', 'bracelet', 'necklace'].includes(equipment.type);
  const isDefenseType = ['clothes', 'shoes', 'helmet'].includes(equipment.type);

  // 计算追加属性（基于魔魂等级）
  const calculateAddAttack = (base: number) => Math.floor(base / 10) * equipment.magicSoulLevel;
  const calculateAddDefense = (base: number) => Math.floor(base / 10) * equipment.magicSoulLevel;

  // 判断是否为已装备状态（有卸下和替换回调）
  const isEquipped = !!(onUnequip || onReplace);

  // 获取装备名称（品质+名称）
  const displayName = `${equipment.quality}${equipment.name}`;

  return (
    <div
      className="equipment-detail-modal-overlay"
      onClick={handleOverlayClick}
    >
      <div className="equipment-detail-modal-content">
        {/* 关闭按钮 */}
        <button
          className="equipment-detail-close-button"
          onClick={onClose}
        >
          ×
        </button>

        {/* 装备头部：图标和名称 */}
        <div className="equipment-detail-header">
          {/* 装备图标容器 */}
          <div className="equipment-icon-wrapper">
            {/* 优先显示装备图片 */}
            {equipment.imagePath && !imageError ? (
              <img
                src={equipment.imagePath}
                alt={equipment.name}
                className="equipment-detail-image"
                onError={handleImageError}
              />
            ) : (
              // 图片加载失败或无图片时显示emoji
              <span className="equipment-detail-icon">
                {equipment.icon || '⚔️'}
              </span>
            )}
          </div>

          {/* 装备名称 */}
          <h3
            className="equipment-detail-name"
            style={{ color: getEquipmentQualityColor(equipment.quality) }}
          >
            {displayName}
          </h3>
        </div>

        {/* 装备类型 */}
        <div className="equipment-detail-info-row">
          <span className="info-label">装备类型</span>
          <span className="info-value">{EQUIPMENT_SLOT_TYPE_NAMES[equipment.type]}</span>
        </div>

        {/* 使用等级 */}
        <div className="equipment-detail-info-row">
          <span className="info-label">使用等级</span>
          <span className="info-value">{equipment.useLevel}级</span>
        </div>

        {/* 装备属性区域 */}
        <div className="equipment-detail-attributes">
          {/* 攻击型装备显示攻击力 */}
          {isAttackType && equipment.attributes.attackMin !== undefined && equipment.attributes.attackMax !== undefined && (
            <>
              <div className="attribute-row">
                <span className="attribute-label">攻击：</span>
                <span className="attribute-value attack-value">
                  {equipment.attributes.attackMin}-{equipment.attributes.attackMax}
                </span>
              </div>
              {equipment.magicSoulLevel > 0 && (
                <div className="attribute-row">
                  <span className="attribute-label">追加攻击：</span>
                  <span className="attribute-value attack-value">
                    +{calculateAddAttack(equipment.attributes.attackMin)}-+{calculateAddAttack(equipment.attributes.attackMax)}
                  </span>
                </div>
              )}
            </>
          )}

          {/* 防御型装备显示防御力 */}
          {isDefenseType && equipment.attributes.defense !== undefined && (
            <>
              <div className="attribute-row">
                <span className="attribute-label">防御：</span>
                <span className="attribute-value defense-value">
                  {equipment.attributes.defense}
                </span>
              </div>
              {equipment.magicSoulLevel > 0 && (
                <div className="attribute-row">
                  <span className="attribute-label">追加防御：</span>
                  <span className="attribute-value defense-value">
                    +{calculateAddDefense(equipment.attributes.defense)}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        {/* 魔魂等级 */}
        <div className="equipment-detail-info-row">
          <span className="info-label">魔魂等级</span>
          <span className="info-value magic-soul-value">+{equipment.magicSoulLevel}</span>
        </div>

        {/* 宝石洞 */}
        <div className="equipment-detail-info-row">
          <span className="info-label">宝石洞</span>
          <span className="info-value">{equipment.holeCount}个</span>
        </div>

        {/* 宝石属性详情 */}
        {equipment.gemAttributes && equipment.gemAttributes.length > 0 && (
          <div className="gem-attributes-section">
            <div className="gem-title">宝石属性：</div>
            <div className="gem-attributes-list">
              {equipment.gemAttributes.map((gem, index) => (
                <div key={index} className="gem-attribute-item">
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
          </div>
        )}

        {/* 战魂属性 */}
        {equipment.soulType && equipment.soulType > 0 && (
          <div className="equipment-detail-info-row">
            <span className="info-label">战魂</span>
            <span className="info-value soul-value">
              {equipment.soulType === 1 ? `天魂 Lv.${equipment.soulLevel}` : `地魂 Lv.${equipment.soulLevel}`}
            </span>
          </div>
        )}

        {/* 操作按钮区域 */}
        <div className="equipment-detail-footer">
          {/* 已装备状态：显示卸下和替换按钮 */}
          {isEquipped ? (
            <>
              <button
                className="unequip-button"
                onClick={handleUnequipClick}
              >
                卸下装备
              </button>
              <button
                className="replace-button"
                onClick={handleReplaceClick}
              >
                替换
              </button>
            </>
          ) : (
            /* 背包状态：显示装备按钮 */
            <button
              className="equip-button"
              onClick={handleEquipClick}
            >
              装备
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetailModal;
