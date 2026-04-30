/**
 * 开发者模式配置文件
 * 控制游戏的初始化行为和非战斗经验获取倍率
 */

/**
 * 开发者模式开关
 * true: 开启开发者模式（示例物品、大量资源、正常经验）
 * false: 关闭开发者模式（初始装备、少量资源、经验降为1%）
 */
export const isDeveloperMode: boolean = true;

/**
 * 获取经验倍率
 * 开发者模式开启时返回 1（保持原数值）
 * 开发者模式关闭时返回 0.01（降为1%）
 * @returns 经验倍率
 */
export function getExperienceMultiplier(): number {
  return isDeveloperMode ? 1 : 0.01;
}

/**
 * 获取初始金币
 * 开发者模式开启时返回 12568000000
 * 开发者模式关闭时返回 100000
 * @returns 初始金币数量
 */
export function getInitialGold(): number {
  return isDeveloperMode ? 12568000000 : 100000;
}

/**
 * 获取初始魔石
 * 开发者模式开启时返回 100000000
 * 开发者模式关闭时返回 280
 * @returns 初始魔石数量
 */
export function getInitialMagicStone(): number {
  return isDeveloperMode ? 100000000 : 280;
}

/**
 * 获取挖矿消耗的时间单位
 * 开发者模式开启时返回 15（方便快速测试）
 * 开发者模式关闭时返回 1（正常游戏体验）
 * @returns 挖矿消耗的时间单位
 */
export function getMiningTimeCost(): number {
  return isDeveloperMode ? 15 : 1;
}
