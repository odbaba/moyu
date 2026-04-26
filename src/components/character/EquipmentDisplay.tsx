import './character.css';

import React, { useMemo, useState } from 'react';

import type { EquipmentDetail, EquipmentSlotType } from '../../types';
import { ALL_EQUIPMENT_SLOTS, getEquipmentDisplayName, getEquipmentSlotName } from '../../utils/equipmentConverter';
import {
  calculateTianHunSetSuppression,
  calculateWarSoulSetCombatPowerBonus,
  calculateWarSoulSetCombatPowerPercent,
  checkWarSoulSet
} from '../../utils/combatPower';
import { getEquipmentIcon, getEquipmentQualityColor } from '../common/utils';

/**
 * 套装类型枚举
 * 用于区分不同类型的战魂套装
 */
type SetType = 'warSoul' | 'tianHun' | 'diHun';

/**
 * 套装图标信息接口
 * 定义单个套装图标的显示信息
 */
interface SetIconInfo {
  type: SetType;
  level: number;
  icon: string;
  color: string;
  tooltipLines: string[];
}

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
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

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

  return (
    <span className="equipment-emoji-compact">
      {equipment.icon || getEquipmentIcon(slotType)}
    </span>
  );
};

/**
 * 战魂套装图标组件属性接口
 */
interface WarSoulSetIconProps {
  setInfo: SetIconInfo;
}

/**
 * 战魂套装图标组件
 * 显示单个套装图标，点击显示悬浮提示
 */
const WarSoulSetIcon: React.FC<WarSoulSetIconProps> = ({ setInfo }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div
      className="war-soul-set-icon-wrapper"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => setShowTooltip(!showTooltip)}
    >
      <span
        className="war-soul-set-icon"
        style={{ color: setInfo.color }}
      >
        {setInfo.icon}
      </span>
      {showTooltip && (
        <div className="war-soul-set-tooltip">
          {setInfo.tooltipLines.map((line, index) => (
            <div key={index} className="war-soul-set-tooltip-line">
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * 检测所有激活的套装
 * @param equippedItems 装备数据
 * @param baseCombatPower 基础战斗力（用于计算战魂套装加成）
 * @returns 激活的套装图标信息数组
 */
function detectActiveSets(
  equippedItems: Record<EquipmentSlotType, EquipmentDetail | null> | undefined,
  baseCombatPower: number
): SetIconInfo[] {
  if (!equippedItems) return [];

  const activeSets: SetIconInfo[] = [];

  // 将装备数据转换为combatPower函数需要的格式
  const equipment = {
    weapon: equippedItems.weapon,
    helmet: equippedItems.helmet,
    clothes: equippedItems.clothes,
    shoes: equippedItems.shoes,
    bracelet: equippedItems.bracelet,
    necklace: equippedItems.necklace
  };

  // 检查战魂套装状态
  const setInfo = checkWarSoulSet(equipment);

  // 如果没有激活任何套装，返回空数组
  if (!setInfo.isActive) return [];

  // 天魂套装（setType = 1）
  if (setInfo.setType === 1) {
    // 计算天魂套装压制百分比
    const suppressionPercent = Math.round(calculateTianHunSetSuppression(equipment) * 100);

    // 添加天魂套装图标
    activeSets.push({
      type: 'tianHun',
      level: setInfo.setLevel,
      icon: '💠',
      color: '#4fc3f7',
      tooltipLines: [
        `天魂套装${setInfo.setLevel}级`,
        `全身装备都有天魂战魂而产生的神圣力量，`,
        `使得战斗中所有敌人的战斗力下降${suppressionPercent}%`
      ]
    });

    // 同时添加战魂套装图标（因为天魂套装也满足战魂套装条件）
    const combatPowerPercent = Math.round(calculateWarSoulSetCombatPowerPercent(equipment) * 100);
    const combatPowerBonus = calculateWarSoulSetCombatPowerBonus(equipment, baseCombatPower);

    activeSets.push({
      type: 'warSoul',
      level: setInfo.setLevel,
      icon: '✨',
      color: '#ffd700',
      tooltipLines: [
        `战魂套装${setInfo.setLevel}级`,
        `全身装备都有战魂属性所激发出来的强大力量，`,
        `使得人物战斗力提高${combatPowerPercent}%。当前提高${combatPowerBonus}战斗力`
      ]
    });
  }
  // 地魂套装（setType = 2）
  else if (setInfo.setType === 2) {
    // 计算地魂套装压制百分比
    const suppressionPercent = Math.round(calculateDiHunSetSuppression(equipment) * 100);

    // 添加地魂套装图标
    activeSets.push({
      type: 'diHun',
      level: setInfo.setLevel,
      icon: '🔮',
      color: '#9575cd',
      tooltipLines: [
        `地魂套装${setInfo.setLevel}级`,
        `全身装备都有地魂战魂而产生的神圣力量，`,
        `使得战斗中所有敌人的生命值减少${suppressionPercent}%`
      ]
    });

    // 同时添加战魂套装图标（因为地魂套装也满足战魂套装条件）
    const combatPowerPercent = Math.round(calculateWarSoulSetCombatPowerPercent(equipment) * 100);
    const combatPowerBonus = calculateWarSoulSetCombatPowerBonus(equipment, baseCombatPower);

    activeSets.push({
      type: 'warSoul',
      level: setInfo.setLevel,
      icon: '✨',
      color: '#ffd700',
      tooltipLines: [
        `战魂套装${setInfo.setLevel}级`,
        `全身装备都有战魂属性所激发出来的强大力量，`,
        `使得人物战斗力提高${combatPowerPercent}%。当前提高${combatPowerBonus}战斗力`
      ]
    });
  }
  // 普通战魂套装（混合类型，只有战魂套装效果）
  else if (setInfo.setType === 0) {
    // 检查是否所有装备都有战魂（但类型不一致）
    const slots: (keyof typeof equipment)[] = ['weapon', 'helmet', 'clothes', 'shoes', 'bracelet', 'necklace'];
    const equippedItemsList: EquipmentDetail[] = [];
    slots.forEach(slot => {
      const item = equipment[slot];
      if (item) {
        equippedItemsList.push(item);
      }
    });

    // 检查是否有6件装备且都有战魂
    if (equippedItemsList.length === 6) {
      const allHaveSoul = equippedItemsList.every(item => item.soulType && item.soulType > 0 && item.soulLevel);
      if (allHaveSoul) {
        const combatPowerPercent = Math.round(calculateWarSoulSetCombatPowerPercent(equipment) * 100);
        const combatPowerBonus = calculateWarSoulSetCombatPowerBonus(equipment, baseCombatPower);

        activeSets.push({
          type: 'warSoul',
          level: setInfo.setLevel,
          icon: '✨',
          color: '#ffd700',
          tooltipLines: [
            `战魂套装${setInfo.setLevel}级`,
            `全身装备都有战魂属性所激发出来的强大力量，`,
            `使得人物战斗力提高${combatPowerPercent}%。当前提高${combatPowerBonus}战斗力`
          ]
        });
      }
    }
  }

  return activeSets;
}

/**
 * 计算地魂套装对怪物的生命值压制百分比
 * @param equipment 角色装备对象
 * @returns 怪物生命值压制百分比（0~0.25）
 */
function calculateDiHunSetSuppression(equipment: {
  weapon: EquipmentDetail | null;
  helmet: EquipmentDetail | null;
  clothes: EquipmentDetail | null;
  shoes: EquipmentDetail | null;
  bracelet: EquipmentDetail | null;
  necklace: EquipmentDetail | null;
}): number {
  const setInfo = checkWarSoulSet(equipment);

  if (!setInfo.isActive || setInfo.setType !== 2) {
    return 0;
  }

  return Math.min(setInfo.setLevel * 0.05, 0.25);
}

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
  // 计算基础战斗力（简化版本，用于战魂套装加成计算）
  const baseCombatPower = useMemo(() => {
    if (!equippedItems) return 0;

    let power = 0;
    const slots = Object.values(equippedItems);
    slots.forEach(item => {
      if (item) {
        power += item.combatPower || 0;
        power += item.soulLevel || 0;
      }
    });

    return power;
  }, [equippedItems]);

  // 检测激活的套装
  const activeSets = useMemo(() => {
    return detectActiveSets(equippedItems, baseCombatPower);
  }, [equippedItems, baseCombatPower]);

  /**
   * 渲染单个装备槽
   */
  const renderEquipmentSlot = (slotType: EquipmentSlotType) => {
    const equipment = equippedItems?.[slotType];

    if (equipment) {
      const displayName = getEquipmentDisplayName(equipment.name, equipment.quality, equipment.magicSoulLevel);

      return (
        <div
          key={slotType}
          className="equipment-card-compact equipment-slot-filled"
          onClick={() => onEquipmentClick && onEquipmentClick(equipment)}
        >
          <div className="equipment-icon-compact">
            <EquipmentIcon equipment={equipment} slotType={slotType} />
          </div>

          <div className="equipment-info-compact">
            <div
              className="equipment-name-compact"
              style={{ color: getEquipmentQualityColor(equipment.quality) }}
            >
              {displayName}
            </div>

            <div className="equipment-level-compact">
              Lv.{equipment.useLevel}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        key={slotType}
        className="equipment-card-compact equipment-slot-empty"
        onClick={() => onEmptySlotClick && onEmptySlotClick(slotType)}
      >
        <div className="equipment-info-compact empty-info">
          <div className="equipment-type-compact">
            {getEquipmentSlotName(slotType)}
          </div>

          <div className="equipment-empty-text">
            空
          </div>

          <div className="equipment-empty-hint">
            点击装备
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="equipment-display-compact">
      {/* 套装图标容器 - 右上角显示 */}
      {activeSets.length > 0 && (
        <div className="war-soul-set-icons-container">
          {activeSets.map((set, index) => (
            <WarSoulSetIcon key={`${set.type}-${index}`} setInfo={set} />
          ))}
        </div>
      )}

      {/* 装备网格布局 - 2行3列 */}
      <div className="equipment-grid-compact">
        {ALL_EQUIPMENT_SLOTS.map(renderEquipmentSlot)}
      </div>
    </div>
  );
};

export default EquipmentDisplay;
