import './battle.css';

import React from 'react';

import type { BattleCharacter } from '../../types';
import type { WarSoulSetInfo } from '../../utils/combatPower';

/**
 * 敌人详情弹窗组件属性接口
 * 定义组件接收的参数类型
 */
interface EnemyDetailModalProps {
  /**
   * 是否显示弹窗
   */
  isVisible: boolean;
  /**
   * 关闭弹窗的回调函数
   */
  onClose: () => void;
  /**
   * 要显示的敌人对象
   */
  enemy: BattleCharacter | null;
  /**
   * 战魂套装信息（可选），用于显示压制效果
   */
  warSoulSetInfo?: WarSoulSetInfo;
}

/**
 * 敌人详情弹窗组件
 * 用于显示敌人的详细信息，包括基础属性、技能列表等
 * 以表格形式展示各项数据
 */
const EnemyDetailModal: React.FC<EnemyDetailModalProps> = ({
  isVisible,
  onClose,
  enemy,
  warSoulSetInfo
}) => {
  /**
   * 处理点击遮罩层关闭弹窗
   */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /**
   * 计算生命值百分比
   */
  const getHpPercent = (): string => {
    if (!enemy) return '0%';

    return `${Math.round((enemy.currentHp / enemy.maxHp) * 100)}%`;
  };

  /**
   * 计算体力值百分比
   */
  const getStaminaPercent = (): string => {
    if (!enemy) return '0%';

    return `${Math.round((enemy.currentStamina / enemy.maxStamina) * 100)}%`;
  };

  // 如果弹窗不可见或没有敌人数据，则不渲染
  if (!isVisible || !enemy) return null;

  return (
    <div
      className="enemy-detail-modal-overlay"
      onClick={handleOverlayClick}
    >
      <div className="enemy-detail-modal-content">
        {/* 关闭按钮 */}
        <button
          className="enemy-detail-close-button"
          onClick={onClose}
          aria-label="关闭"
        >
          ×
        </button>

        {/* 敌人头部信息：图标和名称 */}
        <div className="enemy-detail-header">
          <div className="enemy-detail-icon-wrapper">
            <span className="enemy-detail-emoji">👹</span>
          </div>
          <h3 className="enemy-detail-name">
            {enemy.name}
          </h3>
        </div>

        {/* 详细信息表格 */}
        <div className="enemy-detail-table">
          {/* 第一行：名字和等级 */}
          <div className="enemy-detail-row">
            <div className="enemy-detail-cell">
              <span className="cell-label">名字</span>
              <span className="cell-value">{enemy.name}</span>
            </div>
            <div className="enemy-detail-cell">
              <span className="cell-label">等级</span>
              <span className="cell-value">Lv.{enemy.level}</span>
            </div>
          </div>

          {/* 第二行：生命值 */}
          <div className="enemy-detail-row">
            <div className="enemy-detail-cell full-width">
              <span className="cell-label">生命值</span>
              <span className="cell-value hp-value">{enemy.currentHp}/{enemy.maxHp}</span>
              {/* 地魂套装压制时显示生命值降低百分比 */}
              {enemy.warSoulSuppression && enemy.warSoulSuppression.type === 'hp' && (
                <span className="suppression-value">（-{Math.round(enemy.warSoulSuppression.percentage * 100)}%）</span>
              )}
              <span className="cell-percent">({getHpPercent()})</span>
            </div>
          </div>

          {/* 第三行：体力值 */}
          <div className="enemy-detail-row">
            <div className="enemy-detail-cell full-width">
              <span className="cell-label">体力值</span>
              <span className="cell-value stamina-value">{enemy.currentStamina}/{enemy.maxStamina}</span>
              <span className="cell-percent">({getStaminaPercent()})</span>
            </div>
          </div>

          {/* 第四行：攻击力 */}
          <div className="enemy-detail-row">
            <div className="enemy-detail-cell full-width">
              <span className="cell-label">攻击力</span>
              <span className="cell-value attack-value">{enemy.attackMin}-{enemy.attackMax}</span>
            </div>
          </div>

          {/* 第五行：防御力和战斗力 */}
          <div className="enemy-detail-row">
            <div className="enemy-detail-cell">
              <span className="cell-label">防御力</span>
              <span className="cell-value defense-value">{enemy.defense}</span>
            </div>
            <div className="enemy-detail-cell">
              <span className="cell-label">战斗力</span>
              <span className="cell-value combat-power-value">
                {enemy.combatPower}
                {/* 天魂套装压制时显示战斗力降低百分比 */}
                {enemy.warSoulSuppression && enemy.warSoulSuppression.type === 'combatPower' && (
                  <span className="suppression-value">（-{Math.round(enemy.warSoulSuppression.percentage * 100)}%）</span>
                )}
              </span>
            </div>
          </div>

          {/* 第六行：闪避率和幸运值 */}
          <div className="enemy-detail-row">
            <div className="enemy-detail-cell">
              <span className="cell-label">闪避率</span>
              <span className="cell-value">{enemy.dodgeRate}%</span>
            </div>
            <div className="enemy-detail-cell">
              <span className="cell-label">幸运值</span>
              <span className="cell-value">{enemy.luck}</span>
            </div>
          </div>

          {/* 战魂套装压制提示 */}
          {warSoulSetInfo && warSoulSetInfo.isActive && (
            <div className="enemy-detail-war-soul-suppression">
              <div className="suppression-label">战魂套装压制</div>
              {/* 天魂套装：降低敌人战斗力 */}
              {warSoulSetInfo.setType === 1 && (
                <div className="suppression-info">
                  天魂套装：敌人战斗力降低{warSoulSetInfo.setLevel * 2}%
                </div>
              )}
              {/* 地魂套装：降低敌人生命值 */}
              {warSoulSetInfo.setType === 2 && (
                <div className="suppression-info">
                  地魂套装：敌人生命值降低{warSoulSetInfo.setLevel * 5}%
                </div>
              )}
            </div>
          )}

          {/* 技能列表 */}
          {enemy.skills && enemy.skills.length > 0 && (
            <div className="enemy-detail-skills">
              <div className="skills-label">技能列表</div>
              <div className="skills-list">
                {enemy.skills.map((skill, index) => (
                  <div key={skill.id || index} className="skill-item">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-info">
                      {skill.attackType === 'single' && '单体攻击'}
                      {skill.attackType === 'aoe' && '群体攻击'}
                      {skill.attackType === 'multi' && `多段攻击(${skill.hitCount}次)`}
                      {skill.attackType === 'buff' && '增益技能'}
                      {skill.staminaCost > 0 && ` | 体力: ${skill.staminaCost}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 增益效果列表 */}
          {enemy.buffs && enemy.buffs.length > 0 && (
            <div className="enemy-detail-buffs">
              <div className="buffs-label">增益效果</div>
              <div className="buffs-list">
                {enemy.buffs.map((buff, index) => (
                  <div key={buff.id || index} className="buff-item">
                    <span className="buff-name">{buff.name}</span>
                    <span className="buff-info">
                      +{buff.value}% ({buff.duration}回合)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnemyDetailModal;
