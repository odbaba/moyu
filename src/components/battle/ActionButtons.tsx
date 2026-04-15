import React from 'react';

import type { BattleSkill, SkillAttackType } from '../../types';

/**
 * 行动按钮组件属性接口
 */
interface ActionButtonsProps {
  skills: BattleSkill[]; // 技能列表
  currentMp: number; // 当前MP值
  currentStamina: number; // 当前体力值
  onActionSelect: (skillId: string) => void; // 技能选择回调
  disabled?: boolean; // 是否禁用所有按钮
}

/**
 * 获取技能类型图标
 * @param attackType 攻击类型
 * @returns 对应的图标emoji
 */
const getSkillTypeIcon = (attackType: SkillAttackType): string => {
  const iconMap: Record<SkillAttackType, string> = {
    single: '🎯', // 单体攻击
    aoe: '💥', // 群体攻击
    multi: '⚔️', // 多段攻击
    buff: '🔥', // 增益技能
    special: '⭐' // 特殊技能
  };

  return iconMap[attackType] || '⚔️';
};

/**
 * 获取技能类型名称
 * @param attackType 攻击类型
 * @returns 对应的类型名称
 */
const getSkillTypeName = (attackType: SkillAttackType): string => {
  const nameMap: Record<SkillAttackType, string> = {
    single: '单体',
    aoe: '群体',
    multi: '多段',
    buff: '增益',
    special: '特殊'
  };

  return nameMap[attackType] || '未知';
};

/**
 * 行动按钮组件
 * 显示普攻和技能按钮
 * 根据MP、体力、冷却时间控制技能按钮状态
 */
const ActionButtons: React.FC<ActionButtonsProps> = ({
  skills,
  currentMp,
  currentStamina,
  onActionSelect,
  disabled = false
}) => {
  /**
   * 检查技能是否可以使用
   * @param skill 技能对象
   * @returns 是否可以使用
   */
  const canUseSkill = (skill: BattleSkill): boolean => {
    // 检查MP是否足够
    const hasEnoughMp = currentMp >= skill.mpCost;
    // 检查体力是否足够
    const hasEnoughStamina = currentStamina >= skill.staminaCost;
    // 检查是否在冷却中
    const notOnCooldown = skill.currentCooldown === 0;
    // 检查是否全局禁用
    const notDisabled = !disabled;

    return hasEnoughMp && hasEnoughStamina && notOnCooldown && notDisabled;
  };

  /**
   * 获取技能禁用原因
   * @param skill 技能对象
   * @returns 禁用原因字符串，如果可用则返回空字符串
   */
  const getDisableReason = (skill: BattleSkill): string => {
    const reasons: string[] = [];

    // 检查MP不足
    if (currentMp < skill.mpCost) {
      reasons.push(`MP不足(${skill.mpCost})`);
    }

    // 检查体力不足
    if (currentStamina < skill.staminaCost) {
      reasons.push(`体力不足(${skill.staminaCost})`);
    }

    // 检查冷却中
    if (skill.currentCooldown > 0) {
      reasons.push(`冷却中(${skill.currentCooldown}回合)`);
    }

    return reasons.join('、');
  };

  return (
    <div className="action-buttons">
      {/* 遍历技能数组，渲染每个技能按钮 */}
      {skills.map((skill) => {
        const canUse = canUseSkill(skill);
        const disableReason = getDisableReason(skill);
        const isNormalAttack = skill.id.includes('normal');

        return (
          <button
            key={skill.id}
            className={`action-button ${!canUse ? 'disabled' : ''} ${isNormalAttack ? 'normal-attack' : 'skill'}`}
            onClick={() => canUse && onActionSelect(skill.id)}
            disabled={!canUse}
            title={disableReason || skill.name}
          >
            {/* 技能图标和名称 */}
            <div className="action-button-header">
              <span className="skill-icon">{skill.icon}</span>
              <span className="skill-type-icon">{getSkillTypeIcon(skill.attackType)}</span>
              <div className="action-button-name">{skill.name}</div>
            </div>

            {/* 技能类型标签 */}
            <div className="skill-type-label">
              {getSkillTypeName(skill.attackType)}
              {skill.level > 1 && <span className="skill-level">Lv.{skill.level}</span>}
            </div>

            {/* 显示消耗的MP和体力 */}
            {(skill.mpCost > 0 || skill.staminaCost > 0) && (
              <div className="action-button-cost">
                {skill.mpCost > 0 && (
                  <span className="cost-mp">MP {skill.mpCost}</span>
                )}
                {skill.staminaCost > 0 && (
                  <span className="cost-stamina">体力 {skill.staminaCost}</span>
                )}
              </div>
            )}

            {/* 显示冷却状态 */}
            {skill.currentCooldown > 0 && (
              <div className="cooldown-overlay">
                <span className="cooldown-text">冷却 {skill.currentCooldown}</span>
              </div>
            )}

            {/* 显示禁用原因提示 */}
            {!canUse && disableReason && (
              <div className="disable-reason">
                {disableReason}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ActionButtons;
