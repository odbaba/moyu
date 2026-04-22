/**
 * 爱的力量技能逻辑
 * 当角色或幻兽在战斗中死亡时，有概率触发爱的力量技能
 * 参考文档：reference/docs/幸运值系统完整文档.md
 * 参考代码：reference/scripts/DefineSprite_731/frame_1/DoAction.as 第105-122行
 */

import type { SkillDetail } from '../types';

/**
 * 爱的力量技能触发结果接口
 */
export interface LovePowerResult {
  triggered: boolean; // 是否触发
  luckBonus: number; // 幸运值增加量
  hpRestored: boolean; // 是否恢复生命值
  message: string; // 提示消息
}

/**
 * 爱的力量技能配置
 * 根据技能等级配置触发概率和效果
 */
const LOVE_POWER_CONFIG = {
  1: {
    triggerChance: 20, // 20%概率触发（random(100) > 80）
    luckBonus: 10, // 幸运值+10
    message: '爱的力量使你和你的幻兽生命值回复满，并且幸运值增加10点',
  },
  2: {
    triggerChance: 25, // 25%概率触发（random(100) > 75）
    luckBonus: 20, // 幸运值+20
    message: '爱的力量使你和你的幻兽生命值回复满，并且幸运值增加20点',
  },
};

/**
 * 检查并触发爱的力量技能
 * 当角色或幻兽死亡时调用此函数
 *
 * 技能效果：
 * - 等级1：20%概率触发，生命回满 + 幸运值+10
 * - 等级2：25%概率触发，生命回满 + 幸运值+20
 *
 * 学习条件：
 * - 等级1：与公主关系达到"恋人"（亲密度100+）
 * - 等级2：与公主关系达到"亲密恋人"（亲密度200+）
 *
 * @param skills 技能列表
 * @returns 爱的力量触发结果
 */
export function checkLovePower(skills: SkillDetail[]): LovePowerResult {
  // 查找爱的力量技能（技能索引5）
  const lovePowerSkill = skills.find(skill => skill.skillIndex === 5);

  // 如果没有学习爱的力量技能，不触发
  if (!lovePowerSkill || !lovePowerSkill.isLearned || lovePowerSkill.level === 0) {
    return {
      triggered: false,
      luckBonus: 0,
      hpRestored: false,
      message: '',
    };
  }

  const skillLevel = lovePowerSkill.level;
  const config = LOVE_POWER_CONFIG[skillLevel as keyof typeof LOVE_POWER_CONFIG];

  // 如果没有对应等级的配置，不触发
  if (!config) {
    return {
      triggered: false,
      luckBonus: 0,
      hpRestored: false,
      message: '',
    };
  }

  // 概率判定：random(100) > (100 - triggerChance)
  // 即：triggerChance% 的概率触发
  const roll = Math.floor(Math.random() * 100);
  const threshold = 100 - config.triggerChance;

  if (roll > threshold) {
    return {
      triggered: true,
      luckBonus: config.luckBonus,
      hpRestored: true,
      message: config.message,
    };
  }

  return {
    triggered: false,
    luckBonus: 0,
    hpRestored: false,
    message: '',
  };
}

/**
 * 获取爱的力量技能等级描述
 * @param skillLevel 技能等级
 * @returns 技能等级描述
 */
export function getLovePowerDescription(skillLevel: number): string {
  const config = LOVE_POWER_CONFIG[skillLevel as keyof typeof LOVE_POWER_CONFIG];
  if (!config) {
    return '未学习';
  }

  return `等级${skillLevel}：${config.triggerChance}%概率触发，幸运值+${config.luckBonus}`;
}
