import React from 'react';
import type { CharacterData, Pet } from '../../types';
import { exampleCharacter } from '../../data/characterData';
import { calculateTotalCombatPower } from '../../utils/combatPower';
import { 
  calculateTotalCharacterAttributes, 
  calculateAllEquipmentBonus, 
  calculateSoulAttackBonus 
} from '../../utils/attributeCalculator';
import './character.css';

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
  onShowDetail 
}) => {
  /**
   * 计算综合战斗力（包含幻兽加成）
   */
  const totalCombatPower = calculateTotalCombatPower(character, pets);

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
   * 判断是否有装备加成
   */
  const hasEquipmentBonus = equipmentBonus.attackMin > 0 || equipmentBonus.attackMax > 0 || equipmentBonus.defense > 0;
  
  /**
   * 判断是否有幻兽合体加成
   */
  const hasPetBonus = petBonus.attackMin > 0 || petBonus.attackMax > 0 || petBonus.defense > 0;
  
  /**
   * 判断是否有战魂加成
   */
  const hasSoulBonus = soulAttackBonus > 0 || equipmentBonus.dodgeRate > 0;

  return (
    <div className="character-info-compact">
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
          <span className="hp-icon">❤️</span>
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
          <span className="stamina-icon">⚡</span>
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
          <span className="exp-icon">📊</span>
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
        <div className="stat-compact attack-compact">
          <span className="stat-icon">⚔️</span>
          <span className="stat-label-compact">攻击</span>
          <span className="stat-value-compact">
            {totalAttributes.attackMin}-{totalAttributes.attackMax}
            {(hasEquipmentBonus || hasPetBonus || hasSoulBonus) && (
              <span className="bonus-text">
                {hasEquipmentBonus && ` (+${equipmentBonus.attackMin}-+${equipmentBonus.attackMax})`}
                {hasSoulBonus && soulAttackBonus > 0 && ` (${Math.round(soulAttackBonus * 100)}%魂)`}
              </span>
            )}
          </span>
        </div>
        <div className="stat-compact defense-compact">
          <span className="stat-icon">🛡️</span>
          <span className="stat-label-compact">防御</span>
          <span className="stat-value-compact">
            {totalAttributes.defense}
            {(hasEquipmentBonus || hasPetBonus) && equipmentBonus.defense > 0 && (
              <span className="bonus-text"> (+{equipmentBonus.defense})</span>
            )}
          </span>
        </div>
        <div className="stat-compact dodge-compact">
          <span className="stat-icon">💨</span>
          <span className="stat-label-compact">闪避</span>
          <span className="stat-value-compact">
            {totalAttributes.dodgeRate}%
            {hasSoulBonus && equipmentBonus.dodgeRate > 0 && (
              <span className="bonus-text"> (+{equipmentBonus.dodgeRate}%)</span>
            )}
          </span>
        </div>
        <div className="stat-compact luck-compact">
          <span className="stat-icon">🍀</span>
          <span className="stat-label-compact">幸运</span>
          <span className="stat-value-compact">{character.luck}</span>
        </div>
      </div>

      {/* 第六行：综合战斗力 */}
      <div className="character-row-5">
        <div className="combat-power-compact">
          <span className="combat-power-label">战斗力</span>
          <span className="combat-power-value">{totalCombatPower}</span>
          {onShowDetail && (
            <button 
              className="detail-button-compact"
              onClick={onShowDetail}
            >
              详细
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterInfo;
