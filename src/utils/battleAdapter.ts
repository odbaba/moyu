/**
 * 战斗适配器工具
 * 提供角色数据、技能数据到战斗数据的转换功能
 */

// 导入技能伤害计算函数
import { getBreakDefenseHits, getSkillDamagePercent } from '../data/skillData';
import type {
  BattleCharacter,
  BattleInitParams,
  BattlePet,
  BattleSkill,
  BattleState,
  CharacterData,
  EnemyData,
  EnemyTemplate,
  GridPosition,
  Pet,
  SkillDetail} from '../types';
// 导入角色属性计算函数
import { calculateTotalCharacterAttributes } from './attributeCalculator';
// 导入战斗力计算函数
import { calculateTotalCombatPower } from './combatPower';

/**
 * 技能数据转换为战斗技能数据
 * @param skill 技能详情数据
 * @param currentStamina 当前体力值
 * @returns 战斗技能数据
 */
export function skillToBattleSkill(
  skill: SkillDetail,
  currentStamina: number
): BattleSkill {
  // 获取体力消耗，默认为0
  const staminaCost = skill.cost.stamina || 0;
  // 获取当前冷却时间
  const currentCooldown = skill.currentCooldown || 0;

  // 判断技能是否可用（体力足够且冷却时间为0）
  const isAvailable = currentStamina >= staminaCost && currentCooldown === 0;

  // 获取实际伤害百分比（考虑技能等级）
  const damagePercent = getSkillDamagePercent(skill);

  // 获取破防击数（仅对飞天连斩系列有效）
  const breakDefenseHits = getBreakDefenseHits(skill);

  return {
    id: skill.id,
    skillIndex: skill.skillIndex,
    name: skill.name,
    icon: skill.icon,
    attackType: skill.attackType,
    level: skill.level,
    damagePercent: damagePercent,
    staminaCost: staminaCost,
    cooldown: skill.cooldown,
    currentCooldown: currentCooldown,
    hitCount: skill.effect.hitCount || 1,
    breakDefenseHits: breakDefenseHits,
    battlePowerBonus: skill.effect.battlePowerBonus || 0,
    buffDuration: skill.effect.duration || 0,
    isAvailable: isAvailable
  };
}

/**
 * 角色数据转换为战斗角色数据
 * @param characterData 角色数据
 * @param skills 技能列表
 * @param isPlayer 是否为玩家
 * @param gridPosition 九宫格位置
 * @param pets 幻兽数组，用于计算幻兽战斗力加成
 * @returns 战斗角色数据
 */
export function characterToBattleCharacter(
  characterData: CharacterData,
  skills: SkillDetail[],
  isPlayer: boolean,
  gridPosition: GridPosition,
  pets?: Pet[]
): BattleCharacter {
  // 转换所有已学习的技能为战斗技能
  const battleSkills: BattleSkill[] = skills
    .filter(skill => skill.isLearned)
    .map(skill => skillToBattleSkill(skill, characterData.currentStamina));

  // ========== 使用 calculateTotalCharacterAttributes 计算总属性 ==========
  // 复用角色面板的属性计算逻辑，确保战斗中使用的属性与面板一致
  // 包含：基础属性 + 装备加成 + 幻兽加成 + 战魂加成
  const totalAttributes = calculateTotalCharacterAttributes(characterData);

  // 创建战斗角色对象
  const battleCharacter: BattleCharacter = {
    id: characterData.id,
    name: characterData.playerName,
    level: characterData.level,
    maxHp: totalAttributes.maxHp, // 使用总生命值（包含成长加成）
    currentHp: characterData.currentHp, // 保持当前HP，保持战斗结束时的状态
    maxStamina: totalAttributes.maxStamina, // 使用总体力值（包含成长加成）
    currentStamina: characterData.currentStamina, // 保持当前体力，保持战斗结束时的状态
    attackMin: totalAttributes.attackMin, // 使用总最小攻击力（包含装备、幻兽、战魂加成）
    attackMax: totalAttributes.attackMax, // 使用总最大攻击力（包含装备、幻兽、战魂加成）
    defense: totalAttributes.defense, // 使用总防御力（包含装备、幻兽加成）
    combatPower: 0, // 先设为0，后面计算
    dodgeRate: totalAttributes.dodgeRate, // 使用总闪避率（包含地魂战魂加成）
    luck: characterData.luck,
    skills: battleSkills,
    buffs: [], // 初始无增益效果
    isPlayer: isPlayer,
    gridPosition: gridPosition
  };

  // 使用统一的战斗力计算函数（包含幻兽战斗力加成）
  battleCharacter.combatPower = calculateTotalCombatPower(characterData, pets);

  return battleCharacter;
}

/**
 * 从敌人模板创建敌人数据
 * @param template 敌人模板
 * @param level 敌人等级
 * @param index 敌人索引（用于生成唯一ID）
 * @param gridPosition 九宫格位置
 * @returns 战斗角色数据
 */
export function createEnemyFromTemplate(
  template: EnemyTemplate,
  level: number,
  index: number,
  gridPosition: GridPosition
): BattleCharacter {
  // 生成唯一ID
  const id = `${template.id}_${index}`;

  // 计算最大生命值 = 基础生命 + 成长生命 × 等级
  const maxHp = template.baseHp + template.growthHp * level;

  // 计算最大体力 = 50 + 等级 × 5
  const maxStamina = 50 + level * 5;

  // 计算最小攻击力 = 基础最小攻击 + 成长最小攻击 × 等级
  const attackMin = template.baseAttackMin + template.growthAttackMin * level;

  // 计算最大攻击力 = 基础最大攻击 + 成长最大攻击 × 等级
  const attackMax = template.baseAttackMax + template.growthAttackMax * level;

  // 计算防御力 = 基础防御 + 成长防御 × 等级
  const defense = template.baseDefense + template.growthDefense * level;

  // 计算战斗力 = 基础战斗力 + 成长战斗力 × 等级
  const combatPower = template.baseCombatPower + template.growthCombatPower * level;

  // 创建敌人战斗角色对象
  const enemy: BattleCharacter = {
    id: id,
    name: template.name,
    level: level,
    maxHp: maxHp,
    currentHp: maxHp,
    maxStamina: maxStamina,
    currentStamina: maxStamina,
    attackMin: attackMin,
    attackMax: attackMax,
    defense: defense,
    combatPower: combatPower,
    dodgeRate: 0, // 敌人默认无闪避
    luck: 0, // 敌人默认无幸运
    skills: [], // 敌人技能后续处理
    buffs: [], // 初始无增益效果
    isPlayer: false,
    gridPosition: gridPosition
  };

  return enemy;
}

/**
 * 创建战斗状态
 * @param params 战斗初始化参数
 * @returns 战斗状态数据
 */
export function createBattleState(params: BattleInitParams): BattleState {
  const { playerData, playerSkills, enemyTemplate, enemyLevel, enemyCount, pets } = params;

  // 创建玩家战斗角色（玩家位置固定在九宫格中心）
  const player = characterToBattleCharacter(
    playerData,
    playerSkills,
    true,
    { x: 1, y: 1 }, // 九宫格中心位置
    pets
  );

  // 创建敌人列表
  const enemies: BattleCharacter[] = [];

  // 根据敌人数量生成敌人，分布在九宫格的不同位置
  const enemyPositions: GridPosition[] = [
    { x: 0, y: 0 }, // 左上
    { x: 2, y: 0 }, // 右上
    { x: 0, y: 2 }, // 左下
    { x: 2, y: 2 }, // 右下
    { x: 1, y: 0 }, // 上中
    { x: 1, y: 2 }, // 下中
    { x: 0, y: 1 }, // 左中
    { x: 2, y: 1 }, // 右中
    { x: 2, y: 1 } // 备用位置
  ];

  // 生成指定数量的敌人
  for (let i = 0; i < enemyCount && i < enemyPositions.length; i++) {
    const enemy = createEnemyFromTemplate(
      enemyTemplate,
      enemyLevel,
      i,
      enemyPositions[i]
    );
    enemies.push(enemy);
  }

  // 创建初始战斗状态
  const battleState: BattleState = {
    player: player,
    enemies: enemies,
    deployedPets: [], // 初始无出战幻兽
    currentTurn: 'player', // 玩家先手
    isPlayerTurn: true,
    battleLogs: [], // 初始无战斗日志
    round: 1, // 第一回合
    selectedAction: null, // 未选择行动
    targetEnemy: null, // 未选择目标
    battleResult: 'in_progress', // 战斗进行中
    logIdCounter: 0, // 日志ID计数器初始为0
    currentEnemyActionIndex: 0 // 初始化敌人行动索引
  };

  return battleState;
}

/**
 * 幻兽数据转换为战斗幻兽数据
 * 将 Pet 类型转换为 BattlePet 类型，用于战斗系统
 *
 * 转换规则：
 * - id: 生成唯一ID（格式：battle_pet_${petId}_${timestamp}）
 * - name: 使用 Pet 的 othername（显示名称）
 * - level: 使用 Pet 的 dj（等级）
 * - maxHp: 使用 Pet 的 mhp（最大生命值）
 * - currentHp: 使用 Pet 的 hp（当前生命值）
 * - attackMin: 使用 Pet 的 xgj（最小攻击力）
 * - attackMax: 使用 Pet 的 dgj（最大攻击力）
 * - defense: 使用 Pet 的 fy（防御力）
 * - isMerged: 使用 Pet 的 isMerged（是否合体状态）
 * - isPlayer: 固定为 false（表示是幻兽）
 * - gridPosition: 由调用者提供（九宫格位置）
 * - petId: 使用 Pet 的 id（原始幻兽ID，用于同步状态）
 *
 * @param pet 幻兽数据
 * @param gridPosition 九宫格位置
 * @returns 战斗幻兽数据
 */
export function petToBattlePet(
  pet: Pet,
  gridPosition: GridPosition
): BattlePet {
  // 生成战斗中唯一的幻兽ID
  // 格式：battle_pet_${原始幻兽ID}_${时间戳}
  const battlePetId = `battle_pet_${pet.id}_${Date.now()}`;

  // 创建战斗幻兽对象
  const battlePet: BattlePet = {
    id: battlePetId, // 战斗中生成的唯一ID
    name: pet.othername, // 显示名称（自定义名称）
    level: pet.dj, // 幻兽等级
    maxHp: pet.mhp, // 最大生命值
    currentHp: pet.hp, // 当前生命值
    attackMin: pet.xgj, // 最小攻击力
    attackMax: pet.dgj, // 最大攻击力
    defense: pet.fy, // 防御力
    isMerged: pet.isMerged, // 是否合体状态
    isPlayer: false, // 固定为 false，表示是幻兽
    gridPosition: gridPosition, // 九宫格位置
    petId: pet.id // 原始幻兽ID，用于同步状态
  };

  return battlePet;
}

/**
 * 从 EnemyData 创建敌人战斗角色
 * 用于怪物交互系统，将 EnemyData 转换为战斗角色
 *
 * @param enemyData 敌人数据（来自怪物交互配置）
 * @param index 敌人索引（用于生成唯一ID和位置）
 * @param gridPosition 九宫格位置
 * @returns 战斗角色数据
 */
export function createEnemyFromEnemyData(
  enemyData: EnemyData,
  index: number,
  gridPosition: GridPosition
): BattleCharacter {
  // 使用 enemyData.id 作为唯一ID（已经由 generateEnemiesForBattle 生成唯一ID）
  const id = enemyData.id || `enemy_${Date.now()}_${index}`;

  // 使用 enemyData 中的等级，如果没有则基于生命值估算
  const level = enemyData.level || Math.max(1, Math.floor(enemyData.maxHp / 100));

  // 计算最大体力 = 50 + 等级 × 5
  const maxStamina = 50 + level * 5;

  // 为敌人添加默认的普通攻击技能
  const defaultSkill: BattleSkill = {
    id: 'normal_attack',
    skillIndex: 0,
    name: '普通攻击',
    icon: '⚔️',
    attackType: 'single',
    level: 1,
    damagePercent: 100,
    staminaCost: 0,
    cooldown: 0,
    currentCooldown: 0,
    hitCount: 1,
    breakDefenseHits: 0,
    battlePowerBonus: 0,
    buffDuration: 0,
    isAvailable: true,
  };

  // 创建敌人战斗角色对象
  const enemy: BattleCharacter = {
    id: id,
    name: enemyData.name,
    level: level,
    maxHp: enemyData.maxHp,
    currentHp: enemyData.maxHp,
    maxStamina: maxStamina,
    currentStamina: maxStamina,
    attackMin: enemyData.attack, // 使用攻击力作为最小攻击
    attackMax: enemyData.attack, // 使用攻击力作为最大攻击
    defense: enemyData.defense,
    combatPower: calculateCombatPowerFromEnemyData(enemyData),
    dodgeRate: 0, // 敌人默认无闪避
    luck: 0, // 敌人默认无幸运
    skills: [defaultSkill], // 为敌人添加默认普通攻击技能
    buffs: [], // 初始无增益效果
    isPlayer: false,
    gridPosition: gridPosition
  };

  return enemy;
}

/**
 * 从 EnemyData 计算战斗力
 * 根据参考文档 06_地图系统.md：
 * - 普通怪物战斗力 = 等级
 * - BOSS怪物战斗力 = 等级 × 1.5（约）
 *
 * @param enemyData 敌人数据
 * @returns 战斗力数值
 */
export function calculateCombatPowerFromEnemyData(enemyData: EnemyData): number {
  // 如果有 combatPower 字段，直接使用
  if (enemyData.combatPower !== undefined) {
    return enemyData.combatPower;
  }

  // 如果有 level 字段，使用等级作为战斗力
  if (enemyData.level !== undefined) {
    return enemyData.level;
  }

  // 否则基于生命值估算等级，再作为战斗力
  const level = Math.max(1, Math.floor(enemyData.maxHp / 100));

  return level;
}

/**
 * 根据敌人数据列表创建战斗状态
 * 用于怪物交互场景，直接使用敌人数据创建战斗
 *
 * @param playerData 玩家角色数据
 * @param playerSkills 玩家技能列表
 * @param enemiesData 敌人数据列表（来自怪物交互配置）
 * @param pets 幻兽数组，用于计算幻兽战斗力加成
 * @returns 战斗状态数据
 */
export function createBattleStateFromEnemies(
  playerData: CharacterData,
  playerSkills: SkillDetail[],
  enemiesData: EnemyData[],
  pets?: Pet[]
): BattleState {
  // 创建玩家战斗角色（玩家位置固定在九宫格中心）
  const player = characterToBattleCharacter(
    playerData,
    playerSkills,
    true,
    { x: 1, y: 1 }, // 九宫格中心位置
    pets
  );

  // 创建敌人列表
  const enemies: BattleCharacter[] = [];

  // 敌人位置配置（九宫格，排除中心位置）
  const enemyPositions: GridPosition[] = [
    { x: 0, y: 0 }, // 左上
    { x: 2, y: 0 }, // 右上
    { x: 0, y: 2 }, // 左下
    { x: 2, y: 2 }, // 右下
    { x: 1, y: 0 }, // 上中
    { x: 1, y: 2 }, // 下中
    { x: 0, y: 1 }, // 左中
    { x: 2, y: 1 }, // 右中
    { x: 2, y: 1 } // 备用位置
  ];

  // 从敌人数据列表创建敌人
  for (let i = 0; i < enemiesData.length && i < enemyPositions.length; i++) {
    const enemy = createEnemyFromEnemyData(
      enemiesData[i],
      i,
      enemyPositions[i]
    );
    enemies.push(enemy);
  }

  // 创建初始战斗状态
  const battleState: BattleState = {
    player: player,
    enemies: enemies,
    deployedPets: [], // 初始无出战幻兽
    currentTurn: 'player', // 玩家先手
    isPlayerTurn: true,
    battleLogs: [], // 初始无战斗日志
    round: 1, // 第一回合
    selectedAction: null, // 未选择行动
    targetEnemy: null, // 未选择目标
    battleResult: 'in_progress', // 战斗进行中
    logIdCounter: 0, // 日志ID计数器初始为0
    currentEnemyActionIndex: 0 // 初始化敌人行动索引
  };

  return battleState;
}
