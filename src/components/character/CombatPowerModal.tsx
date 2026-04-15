import React from 'react';

import type { CharacterData, Pet } from '../../types';
import {
  calculateAllEquipmentQualityCombatPower,
  calculateAllGemCombatPower,
  calculateAllHoleCountCombatPower,
  calculateAllPetsCombatPower,
  calculateEquipmentBaseCombatPower,
  calculateFullSetMagicSoulBonusCombatPower,
  calculateLevelCombatPower,
  calculateMilitaryRankCombatPower,
  calculatePetCombatPower,
  calculateSoulCombatPower,
  calculateTitleCombatPower,
  calculateTotalCombatPower} from '../../utils/combatPower';

interface CombatPowerModalProps {
  isVisible: boolean;
  onClose: () => void;
  character: CharacterData;
  pets?: Pet[];
}

const CombatPowerModal: React.FC<CombatPowerModalProps> = ({
  isVisible,
  onClose,
  character,
  pets = []
}) => {
  if (!isVisible) return null;

  const levelPower = calculateLevelCombatPower(character.level);
  const equipmentBasePower = calculateEquipmentBaseCombatPower(character.equipment);
  const equipmentQualityPower = calculateAllEquipmentQualityCombatPower(character.equipment);
  const holeCountPower = calculateAllHoleCountCombatPower(character.equipment);
  const gemPower = calculateAllGemCombatPower(character.equipment);
  const militaryRankPower = calculateMilitaryRankCombatPower(character.militaryRankName);
  const titlePower = calculateTitleCombatPower(character.title);
  const fullSetMagicSoulBonus = calculateFullSetMagicSoulBonusCombatPower(character.equipment);
  const soulPower = calculateSoulCombatPower(character.equipment);

  // 计算幻兽战斗力贡献
  const petsPower = calculateAllPetsCombatPower(pets);
  // 获取出战幻兽列表用于显示详情
  const deployedPets = pets.filter(pet => pet.isDeployed);

  const totalPower = calculateTotalCombatPower(character, pets);

  const combatPowerItems = [
    {
      label: '人物等级贡献',
      value: levelPower,
      description: `等级 ${character.level} × 1`
    },
    {
      label: '装备基础贡献',
      value: equipmentBasePower,
      description: `装备 ${equipmentBasePower} 件 × 1`
    },
    {
      label: '装备品质贡献',
      value: equipmentQualityPower,
      description: '所有装备品质(pz)'
    },
    {
      label: '装备洞数贡献',
      value: holeCountPower,
      description: '所有装备洞数'
    },
    {
      label: '宝石战斗力贡献',
      value: gemPower,
      description: '所有镶嵌宝石战斗力'
    },
    {
      label: '军衔加成',
      value: militaryRankPower,
      description: `${character.militaryRankName} 军衔加成`
    },
    {
      label: '爵位加成',
      value: titlePower,
      description: `${character.title} 爵位加成`
    }
  ];

  // 添加战魂战斗力贡献项
  if (soulPower > 0) {
    combatPowerItems.push({
      label: '战魂战斗力贡献',
      value: soulPower,
      description: '所有装备战魂等级合计'
    });
  }

  // 添加幻兽战斗力贡献项
  if (petsPower > 0) {
    combatPowerItems.push({
      label: '幻兽战斗力贡献',
      value: petsPower,
      description: deployedPets.map(pet =>
        `${pet.othername || pet.hs_name}: ${calculatePetCombatPower(pet)}`
      ).join(' + ')
    });
  }

  if (fullSetMagicSoulBonus > 0) {
    combatPowerItems.push({
      label: '全套魔魂等级额外加成',
      value: fullSetMagicSoulBonus,
      description: `6件装备魔魂等级最低值为 ${fullSetMagicSoulBonus}`
    });
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="combat-power-modal-overlay"
      onClick={handleOverlayClick}
    >
      <div className="combat-power-modal-content">
        <button className="combat-power-close-modal" onClick={onClose}>
          ×
        </button>

        <h3 className="combat-power-title">战斗力详情</h3>

        <div className="combat-power-items">
          {combatPowerItems.map((item, index) => (
            <div key={index} className="combat-power-item">
              <div className="combat-power-item-left">
                <span className="combat-power-item-label">{item.label}</span>
                <span className="combat-power-item-desc">{item.description}</span>
              </div>
              <span className="combat-power-item-value">+{item.value}</span>
            </div>
          ))}
        </div>

        <div className="combat-power-total">
          <span className="combat-power-total-label">综合战斗力</span>
          <span className="combat-power-total-value">{totalPower}</span>
        </div>
      </div>
    </div>
  );
};

export default CombatPowerModal;
