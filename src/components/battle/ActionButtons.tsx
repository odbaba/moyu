import React from 'react';

import type { BattleSkill } from '../../types';

/**
 * 行动按钮组件属性接口
 */
interface ActionButtonsProps {
  skills: BattleSkill[]; // 技能列表
  currentStamina: number; // 当前体力值
  onActionSelect: (skillId: string) => void; // 技能选择回调
  disabled?: boolean; // 是否禁用所有按钮
}

/**
 * 行动按钮组件
 * 显示普攻和技能按钮
 * 根据体力、冷却时间控制技能按钮状态
 */
const ActionButtons: React.FC<ActionButtonsProps> = ({
  skills,
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
    // 检查体力是否足够
    const hasEnoughStamina = currentStamina >= skill.staminaCost;
    // 检查是否在冷却中
    const notOnCooldown = skill.currentCooldown === 0;
    // 检查是否全局禁用
    const notDisabled = !disabled;

    return hasEnoughStamina && notOnCooldown && notDisabled;
  };

  /**
   * 获取技能禁用原因
   * @param skill 技能对象
   * @returns 禁用原因字符串，如果可用则返回空字符串
   */
  const getDisableReason = (skill: BattleSkill): string => {
    const reasons: string[] = [];

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
            className={`game-btn ${!canUse ? 'disabled' : ''}`}
            onClick={() => canUse && onActionSelect(skill.id)}
            disabled={!canUse}
            title={disableReason || skill.name}
          >
            {/* 只显示技能名称 */}
            {skill.name}

            {/* 显示冷却状态 */}
            {skill.currentCooldown > 0 && (
              <div className="cooldown-overlay">
                <span className="cooldown-text">冷却 {skill.currentCooldown}</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default ActionButtons;
