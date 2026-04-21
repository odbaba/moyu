/**
 * 怪物工具函数模块
 * 提供怪物属性计算、实例生成、敌人数量计算等功能
 */

// 导入怪物相关类型定义
import type { EnemyData, Monster, MonsterTemplate, MonsterType } from '../types';

/**
 * 根据怪物模板计算怪物实例的属性
 * 属性计算公式：
 * - 最大生命值 = 基础生命 + 生命成长 × 等级
 * - 最小攻击力 = 基础最小攻击 + 最小攻击成长 × 等级
 * - 最大攻击力 = 基础最大攻击 + 最大攻击成长 × 等级
 * - 防御力 = 基础防御 + 防御成长 × 等级
 *
 * @param template - 怪物模板数据
 * @returns 计算后的怪物实例
 */
export function calculateMonsterStats(template: MonsterTemplate): Monster {
  // 计算最大生命值 = 基础生命 + 生命成长 × 等级
  const maxHp = template.baseHp + template.growthHp * template.level;

  // 计算最小攻击力 = 基础最小攻击 + 最小攻击成长 × 等级
  const attackMin = template.baseAttackMin + template.growthAttackMin * template.level;

  // 计算最大攻击力 = 基础最大攻击 + 最大攻击成长 × 等级
  const attackMax = template.baseAttackMax + template.growthAttackMax * template.level;

  // 计算防御力 = 基础防御 + 防御成长 × 等级
  const defense = template.baseDefense + template.growthDefense * template.level;

  // 返回怪物实例对象
  return {
    id: template.id, // 使用模板ID作为实例ID（后续可覆盖）
    templateId: template.id, // 记录模板ID
    name: template.name, // 怪物名称
    type: template.type, // 怪物类型
    level: template.level, // 怪物等级
    combatPower: template.combatPower, // 战斗力
    location: template.location, // 所在地图ID
    icon: template.icon, // 怪物图标
    description: template.description, // 怪物描述
    maxHp: maxHp, // 计算后的最大生命值
    currentHp: maxHp, // 当前生命值（初始为满血）
    attackMin: attackMin, // 计算后的最小攻击力
    attackMax: attackMax, // 计算后的最大攻击力
    defense: defense, // 计算后的防御力
    skillIds: template.skillIds, // 可用技能列表
    drops: template.drops, // 掉落物品配置
  };
}

/**
 * 根据怪物等级和类型计算战斗时遇到的敌方数量
 * 数量规则：
 * - 等级 <= 25：1-3只（随机）
 * - 等级 > 25 且 <= 65：2-4只（随机）
 * - 等级 > 65 且 <= 100：3-5只（随机）
 * - 等级 > 100：4-6只（随机）
 * - 特殊怪物（boss 或 special）固定返回 1
 *
 * @param monsterLevel - 怪物等级
 * @param monsterType - 怪物类型
 * @returns 敌人数量
 */
export function getEnemyCount(monsterLevel: number, monsterType: MonsterType): number {
  // 特殊怪物（boss 或 special）固定返回 1
  if (isSpecialMonster(monsterType)) {
    return 1;
  }

  // 根据等级范围计算敌人数量
  if (monsterLevel <= 25) {
    // 等级 <= 25：1-3只（随机）
    return Math.floor(Math.random() * 3) + 1; // 1, 2, 3
  } else if (monsterLevel <= 65) {
    // 等级 > 25 且 <= 65：2-4只（随机）
    return Math.floor(Math.random() * 3) + 2; // 2, 3, 4
  } else if (monsterLevel <= 100) {
    // 等级 > 65 且 <= 100：3-5只（随机）
    return Math.floor(Math.random() * 3) + 3; // 3, 4, 5
  } else {
    // 等级 > 100：4-6只（随机）
    return Math.floor(Math.random() * 3) + 4; // 4, 5, 6
  }
}

/**
 * 判断是否为特殊怪物
 * boss 或 special 类型返回 true
 *
 * @param monsterType - 怪物类型
 * @returns 是否为特殊怪物
 */
export function isSpecialMonster(monsterType: MonsterType): boolean {
  // boss、special 或 dungeon 类型为特殊怪物
  return monsterType === 'boss' || monsterType === 'special' || monsterType === 'dungeon';
}


/**
 * 根据怪物生成战斗用的敌人列表
 * 调用 getEnemyCount 获取敌人数量
 * 为每个敌人生成 EnemyData 对象
 * 敌人属性基于怪物属性，略有随机变化（±10%）
 *
 * @param monster - 怪物实例
 * @param spawnId - 刷新配置ID（可选，用于生成唯一敌人ID）
 * @returns 敌人数据数组
 */
export function generateEnemiesForBattle(monster: Monster, spawnId?: string): EnemyData[] {
  // 调用 getEnemyCount 获取敌人数量
  const count = getEnemyCount(monster.level, monster.type);

  // 生成敌人列表
  const enemies: EnemyData[] = [];

  // 使用 spawnId 或 monster.id 作为 ID 前缀
  const idPrefix = spawnId || monster.id;

  for (let i = 0; i < count; i++) {
    // 为每个敌人生成唯一ID（使用 spawnId 确保唯一性）
    const enemyId = `${idPrefix}_enemy_${i + 1}`;

    // 计算随机变化系数（±10%）
    // 生成 0.9 到 1.1 之间的随机数
    const variationFactor = 0.9 + Math.random() * 0.2;

    // 计算敌人的攻击力（取最小和最大攻击的平均值，再乘以变化系数）
    const baseAttack = (monster.attackMin + monster.attackMax) / 2;
    const attack = Math.round(baseAttack * variationFactor);

    // 计算敌人的生命值和防御力（乘以变化系数）
    const maxHp = Math.round(monster.maxHp * variationFactor);
    const defense = Math.round(monster.defense * variationFactor);

    // 生成敌人名称（如果是多只敌人，添加编号）
    const enemyName = count > 1 ? `${monster.name} ${i + 1}` : monster.name;

    // 创建 EnemyData 对象
    const enemy: EnemyData = {
      id: enemyId,
      name: enemyName,
      level: monster.level,
      combatPower: monster.combatPower,
      maxHp: maxHp,
      attack: attack,
      defense: defense,
      description: monster.description,
    };

    enemies.push(enemy);
  }

  return enemies;
}

