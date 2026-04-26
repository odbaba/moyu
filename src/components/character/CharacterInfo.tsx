import './character.css';

import React, { useMemo, useState } from 'react';

import { exampleCharacter } from '../../data/characterData';
import type { CharacterData, Pet, SkillDetail } from '../../types';
import {
  calculateAllEquipmentBonus,
  calculateCharacterBaseAttributes,
  calculateSoulAttackBonus,
  calculateTotalCharacterAttributes} from '../../utils/attributeCalculator';
import {
  calculateDiHunSetSuppression,
  calculateTianHunSetSuppression,
  calculateTotalCombatPower,
  calculateWarSoulSetCombatPowerBonus,
  calculateWarSoulSetCombatPowerPercent,
  checkWarSoulSet
} from '../../utils/combatPower';
import AttributeDetailTooltip, { type AttributeDetailData } from './AttributeDetailTooltip';

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
 * 角色信息组件属性接口
 * 定义组件接收的参数类型
 */
interface CharacterInfoProps {
  /**
   * 角色数据对象，默认为 exampleCharacter
   */
  character?: CharacterData;
  /**
   * 幻兽数组，用于计算幻兽战斗力加成
   */
  pets?: Pet[];
  /**
   * 技能列表，用于计算斗志昂扬加成
   */
  skills?: SkillDetail[];
  /**
   * 点击详细按钮时触发的回调函数
   */
  onShowDetail?: () => void;
}

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
 * @param equipment 装备数据
 * @param baseCombatPower 基础战斗力（用于计算战魂套装加成）
 * @returns 激活的套装图标信息数组
 */
function detectActiveSets(
  equipment: CharacterData['equipment'],
  baseCombatPower: number
): SetIconInfo[] {
  const activeSets: SetIconInfo[] = [];

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
    // checkWarSoulSet 已经确认所有装备都有战魂，直接添加战魂套装图标
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

  return activeSets;
}

/**
 * 角色信息组件
 * 紧凑布局显示角色的核心属性
 * 移动端优化：图标+数值的简洁展示方式
 */
const CharacterInfo: React.FC<CharacterInfoProps> = ({
  character = exampleCharacter,
  pets = [],
  skills = [],
  onShowDetail
}) => {
  /**
   * 属性详情悬浮框状态
   */
  const [tooltipData, setTooltipData] = useState<AttributeDetailData | null>(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  /**
   * 计算综合战斗力（包含幻兽加成）
   */
  const totalCombatPower = calculateTotalCombatPower(character, pets, skills);

  /**
   * 计算经验值百分比
   */
  const expPercentage = Math.max(0, Math.min(100, (character.exp / character.maxExp) * 100));

  /**
   * 计算生命值百分比
   */
  const hpPercentage = Math.max(0, Math.min(100, (character.currentHp / character.maxHp) * 100));

  /**
   * 计算体力值百分比
   */
  const staminaPercentage = Math.max(0, Math.min(100, (character.currentStamina / character.maxStamina) * 100));

  /**
   * 计算动态属性（基础属性 + 装备加成 + 幻兽加成 + 战魂加成）
   */
  const totalAttributes = calculateTotalCharacterAttributes(character);

  /**
   * 获取装备属性加成
   */
  const equipmentBonus = calculateAllEquipmentBonus(character.equipment);

  /**
   * 获取战魂攻击百分比加成
   */
  const soulAttackBonus = calculateSoulAttackBonus(character.equipment);

  /**
   * 获取幻兽属性加成
   */
  const petBonus = character.petBonus || { attackMin: 0, attackMax: 0, defense: 0 };

  /**
   * 获取基础属性
   */
  const baseAttributes = calculateCharacterBaseAttributes(character.level);

  /**
   * 判断是否有战魂加成
   */
  const hasSoulBonus = soulAttackBonus > 0 || equipmentBonus.dodgeRate > 0;

  /**
   * 计算基础战斗力（用于战魂套装加成计算）
   */
  const baseCombatPowerForSet = useMemo(() => {
    let power = 0;
    const slots = Object.values(character.equipment);
    slots.forEach(item => {
      if (item) {
        power += item.combatPower || 0;
        power += item.soulLevel || 0;
      }
    });
    return power;
  }, [character.equipment]);

  /**
   * 检测激活的套装
   */
  const activeSets = useMemo(() => {
    return detectActiveSets(character.equipment, baseCombatPowerForSet);
  }, [character.equipment, baseCombatPowerForSet]);

  /**
   * 处理属性点击事件，显示详细来源
   */
  const handleAttributeClick = (
    event: React.MouseEvent,
    attributeType: 'attack' | 'defense' | 'dodge'
  ) => {
    event.stopPropagation();

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setTooltipPosition({ x: rect.left, y: rect.bottom });

    let data: AttributeDetailData;

    switch (attributeType) {
      case 'attack':
        data = {
          name: '攻击力',
          base: baseAttributes.attackMin,
          baseMax: baseAttributes.attackMax,
          equipment: equipmentBonus.attackMin,
          equipmentMax: equipmentBonus.attackMax,
          pet: petBonus.attackMin,
          petMax: petBonus.attackMax,
          soulPercent: soulAttackBonus,
          total: totalAttributes.attackMin,
          max: totalAttributes.attackMax,
          isRange: true
        };
        break;
      case 'defense':
        data = {
          name: '防御力',
          base: baseAttributes.defense,
          equipment: equipmentBonus.defense,
          pet: petBonus.defense,
          total: totalAttributes.defense
        };
        break;
      case 'dodge':
        data = {
          name: '闪避率',
          base: 0,
          equipment: equipmentBonus.dodgeRate,
          pet: 0,
          total: totalAttributes.dodgeRate,
          unit: '%'
        };
        break;
    }

    setTooltipData(data);
    setTooltipVisible(true);
  };

  /**
   * 关闭属性详情悬浮框
   */
  const handleCloseTooltip = () => {
    setTooltipVisible(false);
    setTooltipData(null);
  };

  return (
    <div className="character-info-compact" onClick={handleCloseTooltip}>
      {/* 第一行：角色名称、等级 */}
      <div className="character-row-1">
        <span className="character-name-compact">{character.playerName}</span>
        <span className="character-level-compact">Lv.{character.level}</span>
      </div>

      {/* 第二行：爵位和军衔 */}
      <div className="character-row-title-rank">
        <div className="title-rank-item">
          <span className="title-rank-label">爵位:</span>
          <span className="title-rank-value">{character.nobleRankName || '平民'}</span>
        </div>
        <div className="title-rank-item">
          <span className="title-rank-label">军衔:</span>
          <span className="title-rank-value">{character.militaryRankName || '无'}</span>
        </div>
      </div>

      {/* 第三行：生命值和体力值进度条 */}
      <div className="character-row-2">
        {/* 生命值 */}
        <div className="hp-container-compact">
          <span className="hp-icon">生命值</span>
          <div className="hp-bar-compact">
            <div
              className="hp-fill-compact"
              style={{ width: `${hpPercentage}%` }}
            />
            <span className="hp-text-compact">{character.currentHp}/{totalAttributes.maxHp}</span>
          </div>
        </div>

        {/* 体力值 */}
        <div className="stamina-container-compact">
          <span className="stamina-icon">体力值</span>
          <div className="stamina-bar-compact">
            <div
              className="stamina-fill-compact"
              style={{ width: `${staminaPercentage}%` }}
            />
            <span className="stamina-text-compact">{character.currentStamina}/{totalAttributes.maxStamina}</span>
          </div>
        </div>
      </div>

      {/* 第四行：经验值进度条 */}
      <div className="character-row-3">
        <div className="exp-container-compact">
          <span className="exp-icon">经验值</span>
          <div className="exp-bar-compact">
            <div
              className="exp-fill-compact"
              style={{ width: `${expPercentage}%` }}
            />
            <span className="exp-text-compact">EXP {character.exp}/{character.maxExp}</span>
          </div>
        </div>
      </div>

      {/* 第五行：属性网格 - 攻击、防御、闪避、幸运 */}
      <div className="character-row-4">
        {/* 攻击力：显示总和 + 天魂百分比加成，点击显示详细来源 */}
        <div
          className="stat-compact attack-compact clickable"
          onClick={(e) => handleAttributeClick(e, 'attack')}
        >
          <span className="stat-label-compact">攻击</span>
          <span className="stat-value-compact">
            {totalAttributes.attackMin}-{totalAttributes.attackMax}
            {hasSoulBonus && soulAttackBonus > 0 && (
              <span className="bonus-text"> ({Math.round(soulAttackBonus * 100)}%魂)</span>
            )}
          </span>
        </div>

        {/* 防御力：显示总和，点击显示详细来源 */}
        <div
          className="stat-compact defense-compact clickable"
          onClick={(e) => handleAttributeClick(e, 'defense')}
        >
          <span className="stat-label-compact">防御</span>
          <span className="stat-value-compact">
            {totalAttributes.defense}
          </span>
        </div>

        {/* 闪避率：显示总和，点击显示详细来源 */}
        <div
          className="stat-compact dodge-compact clickable"
          onClick={(e) => handleAttributeClick(e, 'dodge')}
        >
          <span className="stat-label-compact">闪避</span>
          <span className="stat-value-compact">
            {totalAttributes.dodgeRate}%
          </span>
        </div>

        {/* 幸运：无加成，不可点击 */}
        <div className="stat-compact luck-compact">
          <span className="stat-label-compact">幸运</span>
          <span className="stat-value-compact">{character.luck}</span>
        </div>
      </div>

      {/* 第六行：综合战斗力 */}
      <div className="character-row-5">
        <button
          className="game-btn combat-power-btn"
          onClick={onShowDetail}
        >
          战斗力：{totalCombatPower}
        </button>
      </div>

      {/* 套装图标容器 - 右下角显示，紧邻装备模块 */}
      {activeSets.length > 0 && (
        <div className="war-soul-set-icons-container-bottom">
          {activeSets.map((set, index) => (
            <WarSoulSetIcon key={`${set.type}-${index}`} setInfo={set} />
          ))}
        </div>
      )}

      {/* 属性详情悬浮框 */}
      <AttributeDetailTooltip
        isVisible={tooltipVisible}
        data={tooltipData}
        positionX={tooltipPosition.x}
        positionY={tooltipPosition.y}
      />
    </div>
  );
};

export default CharacterInfo;
