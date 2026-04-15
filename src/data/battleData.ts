import type { BattleCharacter, BattleSkill, EnemyTemplate, GridPosition } from '../types';

/**
 * 敌人模板数据
 * 包含小兵、精英、BOSS三种模板
 */
export const enemyTemplates: Record<string, EnemyTemplate> = {
  // 小兵模板
  soldier: {
    id: 'enemy_soldier',
    name: '小兵',
    baseHp: 50,
    growthHp: 10,
    baseAttackMin: 8,
    growthAttackMin: 2,
    baseAttackMax: 12,
    growthAttackMax: 3,
    baseDefense: 2,
    growthDefense: 1,
    baseCombatPower: 5,
    growthCombatPower: 2,
    skillIds: ['normal_attack'],
    icon: '👤',
    description: '普通士兵，实力一般',
  },
  // 精英模板
  elite: {
    id: 'enemy_elite',
    name: '精英士兵',
    baseHp: 80,
    growthHp: 15,
    baseAttackMin: 12,
    growthAttackMin: 3,
    baseAttackMax: 18,
    growthAttackMax: 4,
    baseDefense: 5,
    growthDefense: 2,
    baseCombatPower: 10,
    growthCombatPower: 3,
    skillIds: ['normal_attack', 'skill_poison'],
    icon: '⚔️',
    description: '精英士兵，实力较强',
  },
  // BOSS模板
  boss: {
    id: 'enemy_boss',
    name: 'BOSS',
    baseHp: 200,
    growthHp: 50,
    baseAttackMin: 20,
    growthAttackMin: 5,
    baseAttackMax: 30,
    growthAttackMax: 8,
    baseDefense: 10,
    growthDefense: 3,
    baseCombatPower: 30,
    growthCombatPower: 10,
    skillIds: ['normal_attack', 'skill_aoe'],
    icon: '👹',
    description: '强大的BOSS，小心应对',
  },
};

/**
 * 敌人技能模板数据
 * 包含普通攻击、毒刃、群体攻击三种技能
 */
export const enemySkillTemplates: Record<string, BattleSkill> = {
  // 普通攻击技能
  normal_attack: {
    id: 'normal_attack',
    skillIndex: 0,
    name: '普通攻击',
    icon: '⚔️',
    attackType: 'single',
    level: 1,
    damagePercent: 100,
    mpCost: 0,
    staminaCost: 0,
    cooldown: 0,
    currentCooldown: 0,
    hitCount: 1,
    breakDefenseHits: 0,
    battlePowerBonus: 0,
    buffDuration: 0,
    isAvailable: true,
  },
  // 毒刃技能
  skill_poison: {
    id: 'skill_poison',
    skillIndex: 1,
    name: '毒刃',
    icon: '🗡️',
    attackType: 'single',
    level: 1,
    damagePercent: 130,
    mpCost: 10,
    staminaCost: 0,
    cooldown: 2,
    currentCooldown: 0,
    hitCount: 1,
    breakDefenseHits: 0,
    battlePowerBonus: 0,
    buffDuration: 0,
    isAvailable: true,
  },
  // 群体攻击技能
  skill_aoe: {
    id: 'skill_aoe',
    skillIndex: 2,
    name: '群体攻击',
    icon: '💥',
    attackType: 'aoe',
    level: 1,
    damagePercent: 80,
    mpCost: 20,
    staminaCost: 0,
    cooldown: 3,
    currentCooldown: 0,
    hitCount: 1,
    breakDefenseHits: 0,
    battlePowerBonus: 0,
    buffDuration: 0,
    isAvailable: true,
  },
};

/**
 * 根据模板创建敌人角色
 * @param templateId - 模板ID（soldier/elite/boss）
 * @param level - 敌人等级
 * @param index - 敌人索引（用于生成唯一ID）
 * @param gridPosition - 九宫格位置
 * @returns 战斗角色数据
 */
export function createEnemyFromTemplate(
  templateId: string,
  level: number,
  index: number,
  gridPosition: GridPosition
): BattleCharacter {
  // 获取敌人模板
  const template = enemyTemplates[templateId];
  if (!template) {
    throw new Error(`未找到敌人模板: ${templateId}`);
  }

  // 根据等级计算属性
  const maxHp = template.baseHp + template.growthHp * (level - 1);
  const attackMin = template.baseAttackMin + template.growthAttackMin * (level - 1);
  const attackMax = template.baseAttackMax + template.growthAttackMax * (level - 1);
  const defense = template.baseDefense + template.growthDefense * (level - 1);
  const combatPower = template.baseCombatPower + template.growthCombatPower * (level - 1);

  // 从技能模板获取技能列表
  const skills: BattleSkill[] = template.skillIds.map((skillId) => {
    const skill = enemySkillTemplates[skillId];
    if (!skill) {
      throw new Error(`未找到敌人技能模板: ${skillId}`);
    }

    return { ...skill };
  });

  // 返回战斗角色数据
  return {
    id: `enemy_${templateId}_${index}`,
    name: template.name,
    level,
    maxHp,
    currentHp: maxHp,
    maxMp: 100,
    currentMp: 100,
    maxStamina: 100,
    currentStamina: 100,
    attackMin,
    attackMax,
    defense,
    combatPower,
    dodgeRate: 5,
    luck: 10,
    skills,
    buffs: [],
    isPlayer: false,
    gridPosition,
  };
}

/**
 * 获取九宫格上方位置坐标数组
 * @param count - 需要的位置数量（1-6）
 * @returns 位置坐标数组
 */
export function getGridPositions(count: number): GridPosition[] {
  // 九宫格上方位置映射表
  const positionMap: GridPosition[] = [
    { x: 0, y: 0 }, // 左上
    { x: 1, y: 0 }, // 上中
    { x: 2, y: 0 }, // 右上
    { x: 0, y: 1 }, // 左中
    { x: 1, y: 1 }, // 中中
    { x: 2, y: 1 }, // 右中
  ];

  // 返回指定数量的位置
  return positionMap.slice(0, Math.min(count, 6));
}

/**
 * 为战斗创建敌人列表
 * @param templateId - 模板ID（soldier/elite/boss）
 * @param level - 敌人等级
 * @param count - 敌人数量
 * @returns 敌人角色数组
 */
export function createEnemiesForBattle(
  templateId: string,
  level: number,
  count: number
): BattleCharacter[] {
  // 获取九宫格位置
  const positions = getGridPositions(count);

  // 为每个敌人调用 createEnemyFromTemplate
  const enemies: BattleCharacter[] = positions.map((position, index) => {
    return createEnemyFromTemplate(templateId, level, index + 1, position);
  });

  return enemies;
}
