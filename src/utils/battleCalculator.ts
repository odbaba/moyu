import type { BattleCharacter, BattleLogEntry, BattleSkill, Buff, BuffType, DamageResult } from '../types';

/**
 * 计算战斗力修正系数
 * 根据攻击者和防御者的战斗力差距计算伤害修正
 * @param attackerCombatPower 攻击者战斗力
 * @param defenderCombatPower 防御者战斗力
 * @returns 修正系数（1.0 表示无修正，范围 0.5-2.0）
 */
export function calculateCombatPowerModifier(
  attackerCombatPower: number,
  defenderCombatPower: number
): number {
  // 如果攻击者战斗力高
  if (attackerCombatPower > defenderCombatPower) {
    const gap = attackerCombatPower - defenderCombatPower;

    // 修正 = 1 + Math.min(差距, 20) * 0.05（最多 +100%，即系数 2.0）
    return 1 + Math.min(gap, 20) * 0.05;
  }

  // 如果防御者战斗力高
  if (defenderCombatPower > attackerCombatPower) {
    const gap = defenderCombatPower - attackerCombatPower;

    // 修正 = 1 - Math.min(差距, 50) * 0.01（最多 -50%，即系数 0.5）
    return 1 - Math.min(gap, 50) * 0.01;
  }

  // 如果相等，修正 = 1.0
  return 1.0;
}

/**
 * 检查是否闪避成功
 * 根据闪避率判断是否成功闪避攻击
 * @param dodgeRate 闪避率（百分比，0-100）
 * @returns 是否闪避成功
 */
export function checkDodge(dodgeRate: number): boolean {
  // 生成 0-99 的随机数
  const random = Math.floor(Math.random() * 100);

  // 如果随机数 < dodgeRate，返回 true（闪避成功）
  return random < dodgeRate;
}

/**
 * 计算基础伤害
 * 在最小攻击力和最大攻击力之间随机生成伤害值
 * @param attackMin 最小攻击力
 * @param attackMax 最大攻击力
 * @returns 基础伤害值
 */
export function calculateBaseDamage(attackMin: number, attackMax: number): number {
  // 生成 attackMin 到 attackMax 之间的随机数
  return attackMin + Math.floor(Math.random() * (attackMax - attackMin + 1));
}

/**
 * 检查是否暴击
 * 根据幸运值判断是否暴击
 * @param luck 幸运值
 * @returns 是否暴击
 */
export function checkCritical(luck: number): boolean {
  // 基础暴击率 = 幸运值 / 100，最大 50%
  const criticalRate = Math.min(luck / 100, 50);
  // 生成 0-99 的随机数
  const random = Math.floor(Math.random() * 100);

  // 如果随机数 < 暴击率，返回 true（暴击成功）
  return random < criticalRate;
}

/**
 * 计算最终伤害
 * 综合考虑闪避、暴击、战斗力修正、防御力等因素计算最终伤害
 * @param attacker 攻击者战斗角色数据
 * @param defender 防御者战斗角色数据
 * @param skill 使用的战斗技能
 * @param isBreakDefense 是否为破防攻击
 * @returns 伤害计算结果
 */
export function calculateDamage(
  attacker: BattleCharacter,
  defender: BattleCharacter,
  skill: BattleSkill,
  isBreakDefense: boolean
): DamageResult {
  // 1. 检查闪避
  const isDodged = checkDodge(defender.dodgeRate);

  // 2. 如果闪避成功，返回伤害为0
  if (isDodged) {
    return {
      damage: 0,
      isDodged: true,
      isBreakDefense: false,
      combatPowerModifier: 1,
      isCritical: false
    };
  }

  // 3. 检查暴击
  const isCritical = checkCritical(attacker.luck);

  // 4. 计算基础伤害
  let damage = calculateBaseDamage(attacker.attackMin, attacker.attackMax);

  // 5. 应用技能倍率：baseDamage * (skill.damagePercent / 100)
  damage = damage * (skill.damagePercent / 100);

  // 6. 如果暴击，伤害翻倍
  if (isCritical) {
    damage = damage * 2;
  }

  // 7. 计算战斗力修正
  const combatPowerModifier = calculateCombatPowerModifier(attacker.combatPower, defender.combatPower);

  // 8. 应用战斗力修正：damage * combatPowerModifier
  damage = damage * combatPowerModifier;

  // 9. 如果不是破防攻击，减去防御力：damage - defender.defense
  if (!isBreakDefense) {
    damage = damage - defender.defense;
  }

  // 10. 最小伤害为 1
  damage = Math.max(1, Math.floor(damage));

  // 11. 返回结果
  return {
    damage,
    isDodged: false,
    isBreakDefense,
    combatPowerModifier,
    isCritical
  };
}

/**
 * 应用增益效果
 * 将增益效果添加到角色的增益列表中
 * @param character 战斗角色数据
 * @param buff 要添加的增益效果
 * @returns 新的角色对象（包含新的增益效果）
 */
export function applyBuff(character: BattleCharacter, buff: Buff): BattleCharacter {
  // 将 buff 添加到 character.buffs 数组
  const newBuffs = [...character.buffs, buff];

  // 返回新的角色对象
  return {
    ...character,
    buffs: newBuffs
  };
}

/**
 * 移除过期的增益效果
 * 过滤掉持续时间为0的增益，并将剩余增益的持续时间减1
 * @param character 战斗角色数据
 * @returns 新的角色对象（更新后的增益列表）
 */
export function removeExpiredBuffs(character: BattleCharacter): BattleCharacter {
  // 过滤掉 duration <= 0 的 buff，并将剩余 buff 的 duration 减 1
  const updatedBuffs = character.buffs
    .filter(buff => buff.duration > 0)
    .map(buff => ({
      ...buff,
      duration: buff.duration - 1
    }));

  // 返回新的角色对象
  return {
    ...character,
    buffs: updatedBuffs
  };
}

/**
 * 生成战斗日志唯一ID
 * 使用时间戳和随机字符串组合生成唯一标识
 * @returns 日志唯一ID字符串
 */
export function generateLogId(): string {
  // 返回格式：log_时间戳_随机字符串
  return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 执行单体攻击
 * 对单个目标进行攻击并计算伤害
 * @param attacker 攻击者战斗角色数据
 * @param defender 防御者战斗角色数据
 * @param skill 使用的战斗技能
 * @param round 当前回合数
 * @returns 包含更新后的防御者、伤害结果和战斗日志的对象
 */
export function executeSingleAttack(
  attacker: BattleCharacter,
  defender: BattleCharacter,
  skill: BattleSkill,
  round: number
): { defender: BattleCharacter; damageResult: DamageResult; logEntry: BattleLogEntry } {
  // 调用 calculateDamage 计算伤害
  const damageResult = calculateDamage(attacker, defender, skill, false);

  // 更新防御者 currentHp：Math.max(0, currentHp - damageResult.damage)
  const updatedDefender: BattleCharacter = {
    ...defender,
    currentHp: Math.max(0, defender.currentHp - damageResult.damage)
  };

  // 创建战斗日志条目
  const logEntry: BattleLogEntry = {
    id: generateLogId(),
    round,
    actor: attacker.name,
    actorId: attacker.id,
    action: `使用 ${skill.name} 攻击 ${defender.name}`,
    actionType: 'skill',
    damage: damageResult.damage,
    target: defender.name,
    targetId: defender.id,
    skillName: skill.name,
    isCritical: damageResult.isCritical,
    isDodged: damageResult.isDodged,
    isBreakDefense: damageResult.isBreakDefense
  };

  // 返回结果
  return {
    defender: updatedDefender,
    damageResult,
    logEntry
  };
}

/**
 * 执行群体攻击
 * 对所有存活的敌人进行攻击并计算伤害
 * @param attacker 攻击者战斗角色数据
 * @param enemies 敌人列表
 * @param skill 使用的战斗技能
 * @param round 当前回合数
 * @returns 包含更新后的敌人列表和每个敌人的攻击结果
 */
export function executeAoeAttack(
  attacker: BattleCharacter,
  enemies: BattleCharacter[],
  skill: BattleSkill,
  round: number
): {
  enemies: BattleCharacter[];
  results: Array<{
    defender: BattleCharacter;
    damageResult: DamageResult;
    logEntry: BattleLogEntry;
  }>;
} {
  // 存储每个敌人的攻击结果
  const results: Array<{
    defender: BattleCharacter;
    damageResult: DamageResult;
    logEntry: BattleLogEntry;
  }> = [];

  // 遍历所有存活的敌人
  const updatedEnemies = enemies.map(enemy => {
    // 跳过已死亡的敌人
    if (enemy.currentHp <= 0) {
      return enemy;
    }

    // 对每个敌人调用 calculateDamage
    const damageResult = calculateDamage(attacker, enemy, skill, false);

    // 更新敌人的 currentHp
    const updatedEnemy: BattleCharacter = {
      ...enemy,
      currentHp: Math.max(0, enemy.currentHp - damageResult.damage)
    };

    // 创建战斗日志条目
    const logEntry: BattleLogEntry = {
      id: generateLogId(),
      round,
      actor: attacker.name,
      actorId: attacker.id,
      action: `使用 ${skill.name} 攻击 ${enemy.name}`,
      actionType: 'skill',
      damage: damageResult.damage,
      target: enemy.name,
      targetId: enemy.id,
      skillName: skill.name,
      isCritical: damageResult.isCritical,
      isDodged: damageResult.isDodged,
      isBreakDefense: damageResult.isBreakDefense
    };

    // 存储结果
    results.push({
      defender: updatedEnemy,
      damageResult,
      logEntry
    });

    return updatedEnemy;
  });

  // 返回结果
  return {
    enemies: updatedEnemies,
    results
  };
}

/**
 * 执行多段攻击
 * 对单个目标进行多次攻击（如四连击）
 * @param attacker 攻击者战斗角色数据
 * @param defender 防御者战斗角色数据
 * @param skill 使用的战斗技能
 * @param round 当前回合数
 * @returns 包含更新后的防御者、伤害结果列表和战斗日志列表
 */
export function executeMultiAttack(
  attacker: BattleCharacter,
  defender: BattleCharacter,
  skill: BattleSkill,
  round: number
): {
  defender: BattleCharacter;
  damageResults: DamageResult[];
  logEntries: BattleLogEntry[];
} {
  // 根据 skill.hitCount 确定攻击次数（默认 4 次）
  const hitCount = skill.hitCount || 4;

  // 根据 skill.breakDefenseHits 确定破防攻击次数（默认 0）
  const breakDefenseHits = skill.breakDefenseHits || 0;

  // 存储每次攻击的伤害结果和日志
  const damageResults: DamageResult[] = [];
  const logEntries: BattleLogEntry[] = [];

  // 累计伤害
  let totalDamage = 0;

  // 对每次攻击进行计算
  for (let i = 0; i < hitCount; i++) {
    // 判断是否为破防攻击（前 breakDefenseHits 次为破防攻击）
    const isBreakDefense = i < breakDefenseHits;

    // 调用 calculateDamage 计算伤害
    const damageResult = calculateDamage(attacker, defender, skill, isBreakDefense);

    // 累计伤害
    totalDamage += damageResult.damage;

    // 存储伤害结果
    damageResults.push(damageResult);

    // 创建战斗日志条目
    const logEntry: BattleLogEntry = {
      id: generateLogId(),
      round,
      actor: attacker.name,
      actorId: attacker.id,
      action: `使用 ${skill.name} 第 ${i + 1} 击攻击 ${defender.name}`,
      actionType: 'skill',
      damage: damageResult.damage,
      target: defender.name,
      targetId: defender.id,
      skillName: skill.name,
      isCritical: damageResult.isCritical,
      isDodged: damageResult.isDodged,
      isBreakDefense: damageResult.isBreakDefense
    };

    logEntries.push(logEntry);
  }

  // 更新防御者 currentHp（累计伤害）
  const updatedDefender: BattleCharacter = {
    ...defender,
    currentHp: Math.max(0, defender.currentHp - totalDamage)
  };

  // 返回结果
  return {
    defender: updatedDefender,
    damageResults,
    logEntries
  };
}

/**
 * 执行增益技能
 * 为攻击者添加增益效果
 * @param attacker 攻击者战斗角色数据
 * @param skill 使用的战斗技能
 * @param round 当前回合数
 * @returns 包含更新后的攻击者、增益效果和战斗日志的对象
 */
export function executeBuffSkill(
  attacker: BattleCharacter,
  skill: BattleSkill,
  round: number
): { attacker: BattleCharacter; buff: Buff; logEntry: BattleLogEntry } {
  // 创建 Buff 对象
  const buff: Buff = {
    id: `buff_${skill.id}_${Date.now()}`,
    name: skill.name,
    type: 'combat_power' as BuffType, // 斗志昂扬类型
    value: skill.battlePowerBonus,
    duration: skill.buffDuration,
    source: skill.id
  };

  // 调用 applyBuff 应用增益
  const updatedAttacker = applyBuff(attacker, buff);

  // 创建战斗日志条目（类型为 'buff'）
  const logEntry: BattleLogEntry = {
    id: generateLogId(),
    round,
    actor: attacker.name,
    actorId: attacker.id,
    action: `使用 ${skill.name} 提升战斗力`,
    actionType: 'buff',
    damage: 0,
    target: attacker.name,
    targetId: attacker.id,
    skillName: skill.name
  };

  // 返回结果
  return {
    attacker: updatedAttacker,
    buff,
    logEntry
  };
}

/**
 * 执行技能（统一入口）
 * 根据技能类型调用对应的处理函数
 * @param attacker 攻击者战斗角色数据
 * @param defender 防御者战斗角色数据（可为 null，如增益技能）
 * @param enemies 敌人列表
 * @param skill 使用的战斗技能
 * @param round 当前回合数
 * @returns 根据技能类型返回不同的结果
 */
export function executeSkill(
  attacker: BattleCharacter,
  defender: BattleCharacter | null,
  enemies: BattleCharacter[],
  skill: BattleSkill,
  round: number
):
  | { type: 'single'; defender: BattleCharacter; damageResult: DamageResult; logEntry: BattleLogEntry }
  | { type: 'aoe'; enemies: BattleCharacter[]; results: Array<{ defender: BattleCharacter; damageResult: DamageResult; logEntry: BattleLogEntry }> }
  | { type: 'multi'; defender: BattleCharacter; damageResults: DamageResult[]; logEntries: BattleLogEntry[] }
  | { type: 'buff'; attacker: BattleCharacter; buff: Buff; logEntry: BattleLogEntry }
  | { type: 'special'; defender: BattleCharacter; damageResult: DamageResult; logEntry: BattleLogEntry } {

  // 根据 skill.attackType 调用对应的处理函数
  switch (skill.attackType) {
    case 'single':
      // 单体攻击
      if (!defender) {
        throw new Error('单体攻击需要指定防御者');
      }
      const singleResult = executeSingleAttack(attacker, defender, skill, round);

      return {
        type: 'single',
        ...singleResult
      };

    case 'aoe':
      // 群体攻击
      const aoeResult = executeAoeAttack(attacker, enemies, skill, round);

      return {
        type: 'aoe',
        ...aoeResult
      };

    case 'multi':
      // 多段攻击
      if (!defender) {
        throw new Error('多段攻击需要指定防御者');
      }
      const multiResult = executeMultiAttack(attacker, defender, skill, round);

      return {
        type: 'multi',
        ...multiResult
      };

    case 'buff':
      // 增益技能
      const buffResult = executeBuffSkill(attacker, skill, round);

      return {
        type: 'buff',
        ...buffResult
      };

    case 'special':
      // 特殊技能（暂按单体处理）
      if (!defender) {
        throw new Error('特殊技能需要指定防御者');
      }
      const specialResult = executeSingleAttack(attacker, defender, skill, round);

      return {
        type: 'special',
        ...specialResult
      };

    default:
      throw new Error(`未知的技能攻击类型: ${skill.attackType}`);
  }
}
