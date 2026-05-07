/**
 * 战斗适配器工具
 * 提供角色数据、技能数据到战斗数据的转换功能
 */

// 导入技能伤害计算函数
import { getBreakDefenseHits, getSkillDamagePercent, getSkillDisplayName } from '../data/skillData';
import type {
  BattleCharacter,
  BattlePet,
  BattleSkill,
  CharacterData,
  EnemyData,
  GridPosition,
  Pet,
  SkillDetail,
} from '../types';
import { WarSoulType } from '../types';
// 导入角色属性计算函数
import { calculateTotalCharacterAttributes } from './attributeCalculator';
// 导入战斗力计算函数
import { calculateTotalCombatPower, type WarSoulSetInfo } from './combatPower';

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

  // 获取根据等级显示的技能名称（如"高级风斩"）
  const displayName = getSkillDisplayName(skill);

  return {
    id: skill.id,
    skillIndex: skill.skillIndex,
    name: displayName,
    icon: skill.icon,
    type: skill.type,
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
    criticalRate: characterData.criticalRate, // 直接使用角色暴击率属性
    criticalDamageRate: characterData.criticalDamageRate, // 直接使用角色暴击伤害率属性
    luck: characterData.luck,
    skills: battleSkills,
    buffs: [], // 初始无增益效果
    isPlayer: isPlayer,
    gridPosition: gridPosition
  };

  // 使用统一的战斗力计算函数（包含幻兽战斗力加成和斗志昂扬加成）
  battleCharacter.combatPower = calculateTotalCombatPower(characterData, pets, skills);

  return battleCharacter;
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
  gridPosition: GridPosition,
  warSoulSetInfo?: WarSoulSetInfo
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
    type: 'active',
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
    attackMin: enemyData.attackMin, // 使用最小攻击力
    attackMax: enemyData.attackMax, // 使用最大攻击力
    defense: enemyData.defense,
    combatPower: calculateCombatPowerFromEnemyData(enemyData),
    dodgeRate: 0, // 敌人默认无闪避
    criticalRate: 0, // 敌人默认无暴击率（暴击率由怪物模板单独配置，当前暂设为0）
    criticalDamageRate: 150, // 敌人默认暴击伤害率150%
    luck: 0, // 敌人默认无幸运
    skills: [defaultSkill], // 为敌人添加默认普通攻击技能
    buffs: [], // 初始无增益效果
    isPlayer: false,
    gridPosition: gridPosition
  };

  // 应用战魂套装压制效果
  if (warSoulSetInfo && warSoulSetInfo.isActive) {
    if (warSoulSetInfo.setType === WarSoulType.TIAN_HUN) {
      // 天魂套装：降低怪物战斗力（套装等级×2%，最大10%）
      const suppressionRate = Math.min(warSoulSetInfo.setLevel * 0.02, 0.10);
      enemy.originalCombatPower = enemy.combatPower; // 保存原始值
      enemy.combatPower = Math.round(enemy.combatPower * (1 - suppressionRate));
      enemy.warSoulSuppression = {
        type: 'combatPower',
        percentage: suppressionRate
      };
    } else if (warSoulSetInfo.setType === WarSoulType.DI_HUN) {
      // 地魂套装：降低怪物生命值（套装等级×5%，最大25%）
      const suppressionRate = Math.min(warSoulSetInfo.setLevel * 0.05, 0.25);
      enemy.originalMaxHp = enemy.maxHp; // 保存原始值
      enemy.maxHp = Math.round(enemy.maxHp * (1 - suppressionRate));
      enemy.currentHp = enemy.maxHp; // 当前生命值也同步调整
      // 设置战魂套装压制信息，用于UI展示
      enemy.warSoulSuppression = {
        type: 'hp',
        percentage: suppressionRate
      };
    }
  }

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

