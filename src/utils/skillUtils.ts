/**
 * 技能系统工具函数
 * 提供技能伤害计算、战斗力加成等功能
 */

import { getFightingSpiritBonus, getSkillDamagePercent } from '../data/skillData';
import type { SkillDetail } from '../types';

/**
 * 计算技能伤害
 * @param skill 技能数据
 * @param attackerAttack 攻击者的攻击力
 * @param defenderDefense 防御者的防御力（可选，用于破防计算）
 * @returns 伤害值数组（多段攻击返回多个值）
 */
export const calculateSkillDamage = (
  skill: SkillDetail,
  attackerAttack: number,
  defenderDefense: number = 0
): number[] => {
  const damages: number[] = [];
  const damagePercent = getSkillDamagePercent(skill);

  // 多段攻击（如飞天连斩）
  if (skill.attackType === 'multi' && skill.effect.hitCount) {
    const hitCount = skill.effect.hitCount;
    const breakDefenseHits = skill.effect.breakDefenseHits || 0;

    for (let i = 0; i < hitCount; i++) {
      const baseDamage = attackerAttack * (skill.effect.damagePercent || 0) / 100;

      // 破防攻击无视防御
      if (i < breakDefenseHits) {
        damages.push(Math.floor(baseDamage));
      } else {
        // 普通攻击需要计算防御减伤
        const damageAfterDefense = Math.max(1, baseDamage - defenderDefense * 0.5);
        damages.push(Math.floor(damageAfterDefense));
      }
    }

    return damages;
  }

  // 单体攻击
  if (skill.attackType === 'single') {
    const baseDamage = attackerAttack * damagePercent / 100;
    const damageAfterDefense = Math.max(1, baseDamage - defenderDefense * 0.3);

    return [Math.floor(damageAfterDefense)];
  }

  // 群体攻击
  if (skill.attackType === 'aoe') {
    const baseDamage = attackerAttack * damagePercent / 100;
    const damageAfterDefense = Math.max(1, baseDamage - defenderDefense * 0.3);

    return [Math.floor(damageAfterDefense)];
  }

  return [0];
};

/**
 * 计算总技能伤害
 * @param skill 技能数据
 * @param attackerAttack 攻击者的攻击力
 * @param defenderDefense 防御者的防御力
 * @returns 总伤害值
 */
export const calculateTotalSkillDamage = (
  skill: SkillDetail,
  attackerAttack: number,
  defenderDefense: number = 0
): number => {
  const damages = calculateSkillDamage(skill, attackerAttack, defenderDefense);

  return damages.reduce((sum, damage) => sum + damage, 0);
};

/**
 * 获取战斗力加成（来自斗志昂扬技能）
 * @param skills 技能列表
 * @returns 战斗力加成百分比
 */
export const getTotalBattlePowerBonus = (skills: SkillDetail[]): number => {
  const fightingSpirit = skills.find(s => s.skillIndex === 4 && s.isLearned);
  if (fightingSpirit) {
    return getFightingSpiritBonus(fightingSpirit.level);
  }

  return 0;
};

/**
 * 计算实际战斗力（考虑技能加成）
 * @param baseBattlePower 基础战斗力
 * @param skills 技能列表
 * @returns 实际战斗力
 */
export const calculateActualBattlePower = (
  baseBattlePower: number,
  skills: SkillDetail[]
): number => {
  const bonus = getTotalBattlePowerBonus(skills);

  return Math.floor(baseBattlePower * (1 + bonus / 100));
};

/**
 * 判断技能是否可以升级
 * @param skill 技能数据
 * @returns 是否可升级
 */
export const canUpgradeSkill = (skill: SkillDetail): boolean => {
  // 斗志昂扬可以升级到5级
  if (skill.skillIndex === 4) {
    return skill.level < 5;
  }

  // 其他技能只能升级到2级
  return skill.level < skill.maxLevel;
};

/**
 * 获取技能升级消耗
 * @param skill 技能数据
 * @returns 升级消耗金币
 */
export const getSkillUpgradeCost = (skill: SkillDetail): number => {
  if (!canUpgradeSkill(skill)) return 0;

  // 斗志昂扬升级消耗递增
  if (skill.skillIndex === 4) {
    const costs = [3000, 5000, 10000, 20000, 50000];

    return costs[skill.level] || 0;
  }

  // 其他技能升级消耗
  return skill.upgradeCost || 0;
};

/**
 * 获取技能体力消耗
 * @param skill 技能数据
 * @returns 体力消耗
 */
export const getSkillStaminaCost = (skill: SkillDetail): number => {
  return skill.cost.stamina || 0;
};

/**
 * 检查是否可以使用技能
 * @param skill 技能数据
 * @param currentStamina 当前体力
 * @returns 是否可以使用
 */
export const canUseSkill = (
  skill: SkillDetail,
  currentStamina: number = 100
): boolean => {
  if (!skill.isLearned) return false;
  if (skill.currentCooldown > 0) return false;

  const staminaCost = skill.cost.stamina || 0;

  return currentStamina >= staminaCost;
};

/**
 * 获取技能类型显示名称
 * @param attackType 攻击类型
 * @returns 显示名称
 */
export const getAttackTypeName = (attackType: string): string => {
  const names: Record<string, string> = {
    single: '单体攻击',
    aoe: '群体攻击',
    multi: '多段攻击',
    buff: '增益技能',
    special: '特殊技能'
  };

  return names[attackType] || '未知';
};

/**
 * 获取学习方式显示名称
 * @param learnMethod 学习方式
 * @returns 显示名称
 */
export const getLearnMethodName = (learnMethod: string): string => {
  const names: Record<string, string> = {
    initial: '初始技能',
    skillBook: '技能书学习',
    intimacy: '亲密度解锁'
  };

  return names[learnMethod] || '未知';
};
