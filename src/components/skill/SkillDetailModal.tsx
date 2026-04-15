import React, { type JSX } from 'react';
import type { SkillDetail } from '../../types';
import { getAttackTypeName, getLearnMethodName, canUpgradeSkill, getSkillUpgradeCost } from '../../utils/skillUtils';
import { getSkillDisplayName, getSkillDamagePercent, getFightingSpiritBonus } from '../../data/skillData';
import { getRarityClassName, getRarityText } from '../common/utils';
import './skill.css';

/**
 * 技能详情弹窗组件属性接口
 */
interface SkillDetailModalProps {
  /** 是否显示弹窗 */
  isVisible: boolean;
  /** 当前选中的技能数据 */
  skill: SkillDetail | null;
  /** 关闭弹窗的回调函数 */
  onClose: () => void;
  /** 技能升级回调 */
  onUpgrade?: (skillId: string) => void;
  /** 当前金币数量 */
  gold?: number;
}

/**
 * 技能详情弹窗组件
 * 以覆盖层形式展示技能的详细信息
 * 包含技能描述、效果、消耗、冷却时间等完整属性
 */
const SkillDetailModal: React.FC<SkillDetailModalProps> = ({
  isVisible,
  skill,
  onClose,
  onUpgrade,
  gold = 0
}) => {
  // 如果不可见或没有技能数据，不渲染
  if (!isVisible || !skill) return null;

  /** 渲染技能消耗信息 */
  const renderCost = () => {
    const costs: string[] = [];
    if (skill.cost.mp) costs.push(`魔法: ${skill.cost.mp}`);
    if (skill.cost.stamina) costs.push(`体力: ${skill.cost.stamina}`);
    if (skill.cost.hp) costs.push(`生命: ${skill.cost.hp}`);
    if (skill.cost.gold) costs.push(`金币: ${skill.cost.gold}`);
    return costs.length > 0 ? costs.join(' / ') : '无消耗';
  };

  /** 渲染技能效果信息 */
  const renderEffects = () => {
    const effects: JSX.Element[] = [];
    
    // 伤害效果
    if (skill.effect.damagePercent) {
      const actualPercent = getSkillDamagePercent(skill);
      effects.push(
        <li key="damagePercent" className="effect-item damage">
          <span className="effect-label">攻击百分比:</span>
          <span className="effect-value">{actualPercent}%</span>
        </li>
      );
    }
    
    // 多段攻击
    if (skill.effect.hitCount) {
      effects.push(
        <li key="hitCount" className="effect-item damage">
          <span className="effect-label">攻击次数:</span>
          <span className="effect-value">{skill.effect.hitCount}次</span>
        </li>
      );
    }
    
    // 破防攻击
    if (skill.effect.breakDefenseHits) {
      effects.push(
        <li key="breakDefense" className="effect-item buff">
          <span className="effect-label">破防攻击:</span>
          <span className="effect-value">{skill.effect.breakDefenseHits}次无视防御</span>
        </li>
      );
    }
    
    // 战斗力加成（斗志抑扬）
    if (skill.skillIndex === 4 && skill.isLearned) {
      const bonus = getFightingSpiritBonus(skill.level);
      effects.push(
        <li key="battlePower" className="effect-item buff">
          <span className="effect-label">战斗力加成:</span>
          <span className="effect-value">{bonus}%</span>
        </li>
      );
    }
    
    // 增益效果
    if (skill.effect.buff) {
      effects.push(
        <li key="buff" className="effect-item buff">
          <span className="effect-label">增益效果:</span>
          <span className="effect-value">{skill.effect.buff}</span>
        </li>
      );
    }
    
    // 持续时间
    if (skill.effect.duration && skill.effect.duration > 0) {
      effects.push(
        <li key="duration" className="effect-item duration">
          <span className="effect-label">持续时间:</span>
          <span className="effect-value">{skill.effect.duration}回合</span>
        </li>
      );
    }
    
    return effects;
  };

  /** 检查是否可以升级 */
  const canUpgrade = canUpgradeSkill(skill) && skill.isLearned;
  const upgradeCost = getSkillUpgradeCost(skill);
  const canAffordUpgrade = gold >= upgradeCost;

  /** 处理升级按钮点击 */
  const handleUpgradeClick = () => {
    if (canUpgrade && canAffordUpgrade && onUpgrade) {
      onUpgrade(skill.id);
    }
  };

  /** 处理点击覆盖层关闭弹窗 */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="skill-detail-modal-overlay" onClick={handleOverlayClick}>
      <div className="skill-detail-modal-content">
        {/* 关闭按钮 */}
        <button className="skill-detail-close-button" onClick={onClose}>
          ✕
        </button>

        {/* 技能头部信息 */}
        <div className="skill-detail-header">
          <div className="skill-detail-icon">
            {skill.icon}
          </div>
          <div className="skill-detail-title">
            <h3 className={`skill-detail-name ${getRarityClassName(skill.rarity)}`}>
              {getSkillDisplayName(skill)}
            </h3>
            <div className="skill-detail-meta">
              <span className="skill-detail-rarity">
                {getRarityText(skill.rarity)}
              </span>
              <span className="skill-detail-type">
                {getAttackTypeName(skill.attackType)}
              </span>
            </div>
          </div>
          {/* 学习状态标签 */}
          {!skill.isLearned && (
            <div className="skill-learn-status">
              <span className="learn-status-label">{getLearnMethodName(skill.learnMethod)}</span>
            </div>
          )}
        </div>

        {/* 技能等级进度 */}
        <div className="skill-detail-level">
          <div className="level-header">
            <span className="level-label">技能等级</span>
            <span className="level-value">
              Lv.{skill.level} / {skill.maxLevel}
            </span>
          </div>
          <div className="level-progress-bar">
            <div 
              className="level-progress-fill"
              style={{ width: `${(skill.level / skill.maxLevel) * 100}%` }}
            />
          </div>
        </div>

        {/* 技能描述 */}
        <div className="skill-detail-section">
          <h4 className="section-title">技能描述</h4>
          <p className="skill-description">
            {skill.description}
          </p>
        </div>

        {/* 技能效果 */}
        <div className="skill-detail-section">
          <h4 className="section-title">技能效果</h4>
          <ul className="skill-effects-list">
            {renderEffects()}
          </ul>
        </div>

        {/* 技能属性 */}
        <div className="skill-detail-section">
          <h4 className="section-title">技能属性</h4>
          <div className="skill-attributes">
            <div className="attribute-row">
              <span className="attribute-label">消耗:</span>
              <span className="attribute-value">{renderCost()}</span>
            </div>
            <div className="attribute-row">
              <span className="attribute-label">冷却时间:</span>
              <span className="attribute-value">
                {skill.cooldown > 0 ? `${skill.cooldown}回合` : '无冷却'}
              </span>
            </div>
            <div className="attribute-row">
              <span className="attribute-label">技能范围:</span>
              <span className="attribute-value">{skill.range}</span>
            </div>
            <div className="attribute-row">
              <span className="attribute-label">目标类型:</span>
              <span className="attribute-value">{skill.targetType}</span>
            </div>
            <div className="attribute-row">
              <span className="attribute-label">学习方式:</span>
              <span className="attribute-value">{getLearnMethodName(skill.learnMethod)}</span>
            </div>
          </div>
        </div>

        {/* 升级按钮 */}
        {canUpgrade && (
          <div className="skill-upgrade-section">
            <button
              className={`skill-upgrade-button ${canAffordUpgrade ? '' : 'disabled'}`}
              onClick={handleUpgradeClick}
              disabled={!canAffordUpgrade}
            >
              <span className="upgrade-text">升级技能</span>
              <span className="upgrade-cost">{upgradeCost} 金币</span>
            </button>
            {!canAffordUpgrade && (
              <p className="upgrade-warning">金币不足</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillDetailModal;
