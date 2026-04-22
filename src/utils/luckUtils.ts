/**
 * 幸运值系统工具函数
 * 提供幸运值的增加、减少、暴率计算等功能
 * 参考文档：reference/docs/幸运值系统完整文档.md
 */

// 幸运值常量
export const LUCK_CONSTANTS = {
  MIN: 0, // 最小幸运值
  MAX: 100, // 最大幸运值
  INITIAL: 50, // 初始幸运值
  DEATH_PENALTY: 10, // 死亡惩罚
};

/**
 * 增加幸运值
 * 幸运值上限为100
 *
 * @param currentLuck 当前幸运值
 * @param amount 增加的数量
 * @returns 增加后的幸运值（不超过上限）
 */
export function increaseLuck(currentLuck: number, amount: number): number {
  return Math.min(LUCK_CONSTANTS.MAX, currentLuck + amount);
}

/**
 * 减少幸运值
 * 幸运值下限为0
 *
 * @param currentLuck 当前幸运值
 * @param amount 减少的数量
 * @returns 减少后的幸运值（不低于下限）
 */
export function decreaseLuck(currentLuck: number, amount: number): number {
  return Math.max(LUCK_CONSTANTS.MIN, currentLuck - amount);
}

/**
 * 计算暴率系数
 * 公式：baoli = 1 + (xy + 1) / 100
 * 参考代码：reference/scripts/DefineSprite_443/frame_1/DoAction.as 第4行
 *
 * @param luckValue 幸运值
 * @returns 暴率系数
 */
export function calculateDropRate(luckValue: number): number {
  return 1 + (luckValue + 1) / 100;
}

/**
 * 检查幸运值是否为零
 *
 * @param luckValue 幸运值
 * @returns 是否为零
 */
export function isLuckZero(luckValue: number): boolean {
  return luckValue <= LUCK_CONSTANTS.MIN;
}

/**
 * 获取幸运值等级描述
 * 根据幸运值范围返回对应的描述
 *
 * @param luckValue 幸运值
 * @returns 幸运值等级描述
 */
export function getLuckLevelDescription(luckValue: number): string {
  if (luckValue >= 90) return '极佳';
  if (luckValue >= 70) return '很好';
  if (luckValue >= 50) return '普通';
  if (luckValue >= 30) return '较差';
  if (luckValue >= 10) return '很差';

  return '极差';
}
