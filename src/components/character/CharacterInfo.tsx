import './character.css';

import React, { useState } from 'react';

import { exampleCharacter } from '../../data/characterData';
import type { CharacterData, Pet, SkillDetail } from '../../types';
import {
  calculateAllEquipmentBonus,
  calculateCharacterBaseAttributes,
  calculateSoulAttackBonus,
  calculateTotalCharacterAttributes} from '../../utils/attributeCalculator';
import { calculateTotalCombatPower } from '../../utils/combatPower';
import AttributeDetailTooltip, { type AttributeDetailData } from './AttributeDetailTooltip';

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
   * 技能列表，用于计算斗志抑扬加成
   */
  skills?: SkillDetail[];
  /**
   * 点击详细按钮时触发的回调函数
   */
  onShowDetail?: () => void;
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
