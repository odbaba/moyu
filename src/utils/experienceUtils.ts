/**
 * 经验计算工具函数模块
 * 提供战斗力加成经验计算等功能
 */

/**
 * 计算带战斗力加成的经验值
 *
 * 公式：实际经验 = 基础经验 × (1 + max(0, (playerCombatPower - playerLevel) × 0.05))
 *
 * 说明：
 * - 如果战斗力 >= 等级，获得额外经验加成
 * - 如果战斗力 < 等级，加成为 0（不减少经验）
 * - 此加成适用于：任务经验、战斗经验等
 * - 不适用于：满经验球对玩家使用
 *
 * @param baseExp 基础经验值
 * @param playerCombatPower 玩家战斗力
 * @param playerLevel 玩家等级
 * @returns 加成后的经验值（取整）
 */
export function calculateCombatPowerBonusExp(
  baseExp: number,
  playerCombatPower: number,
  playerLevel: number
): number {
  // 计算战斗力加成：(playerCombatPower - playerLevel) × 0.05
  // 如果战斗力 < 等级，加成为 0
  const combatPowerBonus = Math.max(0, (playerCombatPower - playerLevel) * 0.05);

  // 实际经验 = 基础经验 × (1 + 加成)
  const finalExp = Math.floor(baseExp * (1 + combatPowerBonus));

  return Math.max(1, finalExp); // 最低经验为1
}
