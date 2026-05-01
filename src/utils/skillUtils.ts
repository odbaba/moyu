/**
 * 技能系统工具函数
 * 提供技能相关辅助功能
 */

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
