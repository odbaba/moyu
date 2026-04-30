import './help.css';

import React from 'react';

import type { CharacterData, Pet, PlayerResources, PrincessRelationship } from '../../types';
import {
  calculateEquipmentPower,
  calculatePetPower,
  formatNumber
} from '../../utils/gameEndingUtils';
import {
  getEquipmentMagicSoulHelpText,
  getEquipmentQualityHelpText,
  getEquipmentSoulLevelHelpText,
  getEquipmentSoulSetHelpText,
  getEquipmentUseLevelHelpText,
  getLevelHelpText,
  getMilitaryRankHelpText,
  getNobleRankHelpText,
  getPetHelpText,
  getPrincessRelationHelpText,
  getWealthHelpText
} from '../../utils/helpUtils';

/**
 * 帮助页面组件属性接口
 */
interface HelpPageProps {
  /** 角色数据 */
  character: CharacterData;
  /** 幻兽数组 */
  pets: Pet[];
  /** 战魂系统是否开启 */
  warSoulSystemEnabled: boolean;
  /** 公主关系数据 */
  princessRelationship: PrincessRelationship;
  /** 玩家资源数据 */
  resources: PlayerResources;
  /** 关闭回调 */
  onClose: () => void;
}

/**
 * 帮助页面组件
 * 显示完整的角色信息和帮助提示
 * 手机端一屏展示所有内容
 */
const HelpPage: React.FC<HelpPageProps> = ({
  character,
  pets,
  warSoulSystemEnabled,
  princessRelationship,
  resources,
  onClose
}) => {
  // 计算装备战斗力
  const equipmentPower = calculateEquipmentPower(character.equipment);
  // 计算幻兽战斗力
  const petPower = calculatePetPower(pets);

  // 获取各项帮助文本
  const levelHelp = getLevelHelpText(character.level);
  const equipmentQualityHelp = getEquipmentQualityHelpText(character.equipment);
  const equipmentMagicSoulHelp = getEquipmentMagicSoulHelpText(character.equipment);
  const equipmentUseLevelHelp = getEquipmentUseLevelHelpText(character.equipment, character.level);
  const equipmentSoulLevelHelp = getEquipmentSoulLevelHelpText(character.equipment, warSoulSystemEnabled);
  const equipmentSoulSetHelp = getEquipmentSoulSetHelpText(character.equipment, warSoulSystemEnabled);
  const petHelp = getPetHelpText();
  const militaryRankHelp = getMilitaryRankHelpText(character.militaryRankLevel);
  const nobleRankHelp = getNobleRankHelpText(character.nobleRankLevel);
  const princessRelationHelp = getPrincessRelationHelpText(princessRelationship.level);
  const wealthHelp = getWealthHelpText();

  // 渲染单个信息项
  const renderInfoItem = (
    label: string,
    value: string | number,
    helpText: string | null
  ) => {
    return (
      <div className="help-item">
        <span className="help-label">{label}：</span>
        <span className="help-value">{value}</span>
        {helpText && <span className="help-text">{helpText}</span>}
      </div>
    );
  };

  // 渲染装备帮助信息（合并多条帮助）
  const renderEquipmentHelp = () => {
    const helps: string[] = [];
    if (equipmentQualityHelp) helps.push(equipmentQualityHelp);
    if (equipmentMagicSoulHelp) helps.push(equipmentMagicSoulHelp);
    if (equipmentUseLevelHelp) helps.push(equipmentUseLevelHelp);
    if (equipmentSoulLevelHelp) helps.push(equipmentSoulLevelHelp);
    if (equipmentSoulSetHelp) helps.push(equipmentSoulSetHelp);

    if (helps.length === 0) return null;

    return (
      <div className="help-text help-text--multi">
        {helps.map((help, index) => (
          <div key={index}>{help}</div>
        ))}
      </div>
    );
  };

  return (
    <div className="help-page">
      {/* 标题 */}
      <h1 className="help-title">帮助信息</h1>

      {/* 信息列表 */}
      <div className="help-info-list">
        {/* 战斗力 */}
        {renderInfoItem(
          '战斗力',
          formatNumber(character.combatPower),
          null
        )}

        {/* 等级 */}
        {renderInfoItem(
          '等级',
          `${character.level}级`,
          levelHelp
        )}

        {/* 装备战斗力 */}
        <div className="help-item">
          <span className="help-label">装备战斗力：</span>
          <span className="help-value">{equipmentPower}</span>
          {renderEquipmentHelp()}
        </div>

        {/* 幻兽战斗力 */}
        {renderInfoItem(
          '幻兽战斗力',
          petPower,
          petHelp
        )}

        {/* 军衔 */}
        {renderInfoItem(
          '军衔',
          character.militaryRankName,
          militaryRankHelp
        )}

        {/* 爵位 */}
        {renderInfoItem(
          '爵位',
          character.nobleRankName,
          nobleRankHelp
        )}

        {/* 公主关系 */}
        {renderInfoItem(
          '公主关系',
          princessRelationship.relationshipName,
          princessRelationHelp
        )}

        {/* 金钱魔石 */}
        {renderInfoItem(
          '金钱',
          formatNumber(resources.gold),
          null
        )}
        {renderInfoItem(
          '魔石',
          formatNumber(resources.magicStone),
          wealthHelp
        )}
      </div>

      {/* 关闭按钮 */}
      <div className="help-buttons">
        <button className="game-btn help-btn" onClick={onClose}>
          关闭
        </button>
      </div>
    </div>
  );
};

export default HelpPage;
