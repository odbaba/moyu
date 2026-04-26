import React, { useCallback, useEffect, useRef, useState } from 'react';

/**
 * 战斗组件 - Battle.tsx
 *
 * 本组件实现回合制战斗系统，包含以下核心功能：
 * 1. 玩家与敌人的回合制战斗
 * 2. 幻兽系统支持（最多2只幻兽同时出战）
 * 3. 合体幻兽机制（幻兽合体后属性加成到玩家）
 * 4. 幻兽保留1血机制（集成人物幸运值和爱的力量技能）
 *
 * ========== 幻兽保留1血机制说明 ==========
 *
 * 【触发条件】
 * - 只有合体状态的幻兽才会触发保留1血机制
 * - 当合体幻兽血量降为0或以下时，触发保留1血机制
 *
 * 【保留1血效果】
 *
 * 1. 幻兽保留1血
 *    - 幻兽血量保留为1，不会阵亡，继续存活
 *    - 幻兽保持合体状态，不会解除合体
 *
 * 2. 人物幸运值降低
 *    - 人物幸运值降低10点（确保不低于0）
 *    - 战斗日志记录："{幻兽名称} 受到致命伤害，人物幸运值降低10点！当前幸运值：{新幸运值}"
 *
 * 3. 爱的力量技能检查
 *    - 检查是否触发"爱的力量"技能（使用 checkLovePower 函数）
 *    - 技能等级1：20%概率触发，幸运值+10，幻兽满血复活
 *    - 技能等级2：25%概率触发，幸运值+20，幻兽满血复活
 *
 * 4. 爱的力量触发效果
 *    - 人物幸运值增加（根据技能等级）
 *    - 幻兽满血复活（currentHp = maxHp）
 *    - 战斗日志记录：技能描述消息
 *
 * 5. 爱的力量未触发效果
 *    - 幻兽保留1血继续存活
 *    - 幻兽保持合体状态
 *
 * 6. 人物幸运值为0时退出战斗
 *    - 当人物幸运值降为0时，自动退出战斗
 *    - 战斗日志记录："{玩家名称} 幸运值耗尽，自动退出战斗！"
 *    - 战斗结果设置为敌方胜利
 *
 * 【注意事项】
 * - 只有合体状态的幻兽才会触发保留1血机制
 * - 非合体幻兽受到致命伤害会直接阵亡
 * - 人物幸运值为0时自动退出战斗
 * - 幻兽保留1血后，下次受到伤害会再次触发保留1血机制
 *
 * 【相关文件】
 * - 类型定义：src/types/index.ts（Pet接口、BattlePet接口）
 * - 战斗计算：src/utils/battleCalculator.ts（checkCritical函数）
 * - 爱的力量技能：src/utils/lovePowerSkill.ts（checkLovePower函数）
 * - 文档说明：src/components/battle/README.md
 */
// 导入战斗数据
import { createEnemiesForBattle } from '../../data/battleData';
// 导入新的类型定义
import type {
  BattleCharacter, BattleLogEntry, BattlePet,
  BattleResult, BattleSkill,
  BattleState, Buff, CharacterData, DamageResult, EnemyData, GridPosition, Pet, SkillDetail} from '../../types';
import { WarSoulType } from '../../types';
// 导入角色属性计算函数
import { calculateTotalCharacterAttributes } from '../../utils/attributeCalculator';
// 导入战斗适配器工具
import {
  characterToBattleCharacter,
  createEnemyFromEnemyData,
  petToBattlePet
} from '../../utils/battleAdapter';
// 导入战斗计算工具
import {
  executeSkill,
  generateLogId,
  removeExpiredBuffs} from '../../utils/battleCalculator';
// 导入战斗力计算函数
import { calculateTotalCombatPower, checkWarSoulSet, type WarSoulSetInfo } from '../../utils/combatPower';
// 导入爱的力量技能检查函数
import { checkLovePower } from '../../utils/lovePowerSkill';
import PetDetailModal from '../pet/PetDetailModal';
import ActionButtons from './ActionButtons';
import BattleLog from './BattleLog';
import CharacterCard from './CharacterCard';
// 导入详情弹窗组件
import CharacterDetailModal from './CharacterDetailModal';
import EnemyDetailModal from './EnemyDetailModal';

/**
 * 战斗组件属性接口
 * 接收玩家数据、技能数据、敌人配置等信息
 */
interface BattleProps {
  playerData: CharacterData; // 玩家角色数据
  playerSkills: SkillDetail[]; // 玩家技能数据
  enemyTemplateId?: string; // 敌人模板ID（可选，优先使用 enemiesData）
  enemyLevel?: number; // 敌人等级（可选）
  enemyCount?: number; // 敌人数量（可选）
  enemiesData?: EnemyData[]; // 敌人数据列表（优先使用）
  deployedPets?: Pet[]; // 出战幻兽列表（可选，最多2只）
  /**
   * 敌人阵亡回调函数
   * 单个敌人阵亡时立即调用，用于分配经验
   * @param enemy 阵亡的敌人数据
   */
  onEnemyDeath?: (enemy: BattleCharacter) => void;
  /**
   * 战斗结束回调函数
   * @param result 战斗结果（玩家胜利/敌方胜利）
   * @param finalPlayerState 战斗结束时的玩家状态（包含HP、MP、体力等）
   * @param finalDeployedPets 战斗结束时的幻兽状态列表（包含petId和currentHp）
   */
  onBattleEnd: (result: BattleResult, finalPlayerState?: BattleCharacter, finalDeployedPets?: BattlePet[]) => void;
  /**
   * 离开战斗回调函数
   * 玩家主动离开战斗，消耗时间单位
   * @param finalPlayerState 离开战斗时的玩家状态（包含HP、MP、体力等）
   * @param finalDeployedPets 离开战斗时的幻兽状态列表（包含petId和currentHp）
   */
  onLeaveBattle?: (finalPlayerState?: BattleCharacter, finalDeployedPets?: BattlePet[]) => void;
}

/**
 * 伤害数字显示接口
 * 用于在战斗中显示飘动的伤害数字
 */
interface DamageNumber {
  id: number;
  value: number;
  targetId: string;
}

/**
 * 战斗组件
 * 实现玩家与敌人之间的完整战斗系统
 * 包括回合制逻辑、技能系统、伤害计算、目标选择、增益效果等
 */
const Battle: React.FC<BattleProps> = ({
  playerData,
  playerSkills,
  enemyTemplateId = 'soldier',
  enemyLevel = 1,
  enemyCount = 1,
  enemiesData,
  deployedPets = [], // 出战幻兽列表，默认为空数组
  onEnemyDeath,
  onBattleEnd,
  onLeaveBattle
}) => {
  // 伤害数字ID计数器（使用 useRef 避免 StrictMode 下的重复问题）
  const damageIdCounterRef = useRef(0);
  // 伤害数字显示状态
  const [damageNumbers, setDamageNumbers] = useState<DamageNumber[]>([]);
  // 攻击动画状态
  const [attackingCharacterId, setAttackingCharacterId] = useState<string | null>(null);

  // ========== 详情弹窗状态管理 ==========
  // 详情弹窗显示状态
  const [showDetailModal, setShowDetailModal] = useState(false);
  // 选中的角色（用于角色详情和敌人详情）
  const [selectedCharacter, setSelectedCharacter] = useState<BattleCharacter | null>(null);
  // 选中的幻兽（用于幻兽详情）
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  // 详情类型：'character' | 'pet' | 'enemy'
  const [detailType, setDetailType] = useState<'character' | 'pet' | 'enemy' | null>(null);

  // 战魂套装信息状态，用于对怪物属性压制和传递给敌人详情弹窗
  const [warSoulSetInfo, setWarSoulSetInfo] = useState<WarSoulSetInfo | null>(null);

  // 监听装备变化，更新战魂套装信息
  useEffect(() => {
    const setInfo = checkWarSoulSet(playerData.equipment);
    setWarSoulSetInfo(setInfo);
  }, [playerData.equipment]);

  /**
   * 获取九宫格上方位置坐标数组
   * @param count - 需要的位置数量（1-9）
   * @returns 位置坐标数组
   */
  const getGridPositions = (count: number): GridPosition[] => {
    const positionMap: GridPosition[] = [
      { x: 0, y: 0 }, // 左上
      { x: 2, y: 0 }, // 右上
      { x: 0, y: 2 }, // 左下
      { x: 2, y: 2 }, // 右下
      { x: 1, y: 0 }, // 上中
      { x: 1, y: 2 }, // 下中
      { x: 0, y: 1 }, // 左中
      { x: 2, y: 1 }, // 右中
      { x: 1, y: 1 } // 中间（备用，但玩家在这里）
    ];

    return positionMap.slice(0, Math.min(count, 8)); // 最多8个位置，避免与玩家位置冲突
  };

  /**
   * 初始化战斗状态
   * 使用新的适配器和工具函数创建玩家和敌人数据
   * 同时处理出战幻兽的初始化
   */
  const initializeBattleState = useCallback((): BattleState => {
    // 使用 characterToBattleCharacter 创建玩家战斗角色
    // 玩家位置固定在九宫格中心 (1, 1)
    // 传入出战幻兽数组用于计算幻兽战斗力加成
    const player = characterToBattleCharacter(
      playerData,
      playerSkills,
      true,
      { x: 1, y: 1 },
      deployedPets
    );

    // 检查战魂套装状态，用于对怪物属性压制
    const currentWarSoulSetInfo = checkWarSoulSet(playerData.equipment);

    let enemies: BattleCharacter[] = [];

    // 优先使用 enemiesData 创建敌人（怪物系统）
    if (enemiesData && enemiesData.length > 0) {
      const positions = getGridPositions(enemiesData.length);
      enemies = enemiesData.map((enemyData, index) => {
        return createEnemyFromEnemyData(enemyData, index, positions[index] || { x: 0, y: 0 }, currentWarSoulSetInfo);
      });
    } else {
      // 使用模板创建敌人（原有逻辑）
      enemies = createEnemiesForBattle(enemyTemplateId, enemyLevel, enemyCount);
      // createEnemiesForBattle 不经过 battleAdapter，需要手动应用战魂套装压制效果
      if (currentWarSoulSetInfo.isActive) {
        enemies = enemies.map(enemy => {
          const suppressedEnemy = { ...enemy };
          if (currentWarSoulSetInfo.setType === WarSoulType.TIAN_HUN) {
            // 天魂套装：降低怪物战斗力（套装等级×2%，最大10%）
            const suppressionRate = Math.min(currentWarSoulSetInfo.setLevel * 0.02, 0.10);
            suppressedEnemy.originalCombatPower = enemy.combatPower;
            suppressedEnemy.combatPower = Math.round(enemy.combatPower * (1 - suppressionRate));
            suppressedEnemy.warSoulSuppression = { type: 'combatPower', percentage: suppressionRate };
          } else if (currentWarSoulSetInfo.setType === WarSoulType.DI_HUN) {
            // 地魂套装：降低怪物生命值（套装等级×5%，最大25%）
            const suppressionRate = Math.min(currentWarSoulSetInfo.setLevel * 0.05, 0.25);
            suppressedEnemy.originalMaxHp = enemy.maxHp;
            suppressedEnemy.maxHp = Math.round(enemy.maxHp * (1 - suppressionRate));
            suppressedEnemy.currentHp = suppressedEnemy.maxHp;
            // 设置战魂套装压制信息，用于UI展示
            suppressedEnemy.warSoulSuppression = { type: 'hp', percentage: suppressionRate };
          }

          return suppressedEnemy;
        });
      }
    }

    // ========== 幻兽初始化逻辑 ==========
    // 处理出战幻兽，将其转换为战斗幻兽数据并分配位置
    // 最多支持2只出战幻兽
    const battlePets: BattlePet[] = [];

    if (deployedPets && deployedPets.length > 0) {
      // 遍历出战幻兽列表，最多处理2只
      deployedPets.slice(0, 2).forEach((pet, index) => {
        // 幻兽位置分配规则：
        // - 第一只幻兽：九宫格左下角 {x: 0, y: 2}
        // - 第二只幻兽：九宫格右下角 {x: 2, y: 2}
        // 这样可以避免与玩家位置（中心 {x: 1, y: 1}）冲突
        let petPosition: GridPosition;

        if (index === 0) {
          // 第一只幻兽放置在左下角
          petPosition = { x: 0, y: 2 };
        } else {
          // 第二只幻兽放置在右下角
          petPosition = { x: 2, y: 2 };
        }

        // 使用 petToBattlePet 函数将幻兽数据转换为战斗幻兽数据
        const battlePet = petToBattlePet(pet, petPosition);
        battlePets.push(battlePet);
      });
    }

    // 添加战魂套装压制提示日志
    const initialLogs: BattleLogEntry[] = [];
    if (currentWarSoulSetInfo.isActive) {
      if (currentWarSoulSetInfo.setType === WarSoulType.TIAN_HUN) {
        // 天魂套装压制提示
        const suppressionPercent = Math.min(currentWarSoulSetInfo.setLevel * 2, 10);
        initialLogs.push({
          id: generateLogId(),
          round: 0,
          actor: '战魂套装',
          actorId: 'war_soul_set',
          action: `在天魂战魂的神圣力量下，所有敌人的战斗力下降${suppressionPercent}%。`,
          actionType: 'buff',
          damage: 0,
          target: '所有敌人',
          targetId: 'all_enemies'
        });
      } else if (currentWarSoulSetInfo.setType === WarSoulType.DI_HUN) {
        // 地魂套装压制提示
        const suppressionPercent = Math.min(currentWarSoulSetInfo.setLevel * 5, 25);
        initialLogs.push({
          id: generateLogId(),
          round: 0,
          actor: '战魂套装',
          actorId: 'war_soul_set',
          action: `在地魂战魂的神圣力量下，所有敌人的生命值减少${suppressionPercent}%。`,
          actionType: 'buff',
          damage: 0,
          target: '所有敌人',
          targetId: 'all_enemies'
        });
      }
    }

    // 返回初始战斗状态
    return {
      player,
      enemies,
      deployedPets: battlePets, // 将转换后的幻兽数据添加到战斗状态
      currentTurn: 'player',
      isPlayerTurn: true,
      battleLogs: initialLogs, // 使用包含战魂套装提示的日志
      round: 1,
      selectedAction: null,
      targetEnemy: null,
      battleResult: 'in_progress',
      logIdCounter: initialLogs.length, // 从初始日志数量开始计数
      currentEnemyActionIndex: 0 // 初始化敌人行动索引
    };
  }, [playerData, playerSkills, enemyTemplateId, enemyLevel, enemyCount, enemiesData, deployedPets]);

  // 战斗状态
  const [battleState, setBattleState] = useState<BattleState>(initializeBattleState);

  // 使用 ref 存储最新的敌人列表，避免依赖 battleState.enemies 导致重复触发
  const enemiesRef = useRef(battleState.enemies);

  // 更新 enemiesRef
  useEffect(() => {
    enemiesRef.current = battleState.enemies;
  }, [battleState.enemies]);

  /**
   * 监听props变化，更新战斗状态中的玩家和幻兽数据
   * 当角色或幻兽在战斗中升级时，需要更新战斗状态中的属性
   */
  useEffect(() => {
    setBattleState(prev => {
      // 使用calculateTotalCharacterAttributes计算角色总属性
      // 包含：基础属性 + 装备加成 + 幻兽加成 + 战魂加成
      const totalAttributes = calculateTotalCharacterAttributes(playerData);

      // 检查玩家是否升级（最大生命值增加）
      const playerLeveledUp = totalAttributes.maxHp > prev.player.maxHp;

      // 更新玩家数据（使用总属性）
      const updatedPlayer: BattleCharacter = {
        ...prev.player,
        level: playerData.level,
        maxHp: totalAttributes.maxHp, // 使用总生命值
        maxStamina: totalAttributes.maxStamina, // 使用总体力值
        attackMin: totalAttributes.attackMin, // 使用总最小攻击力
        attackMax: totalAttributes.attackMax, // 使用总最大攻击力
        defense: totalAttributes.defense, // 使用总防御力
        combatPower: calculateTotalCombatPower(playerData, deployedPets, playerSkills), // 使用完整的战斗力计算（包含斗志昂扬加成）
        dodgeRate: totalAttributes.dodgeRate, // 使用总闪避率
        // 如果升级了，恢复满血；否则保持当前HP
        currentHp: playerLeveledUp ? totalAttributes.maxHp : prev.player.currentHp,
        // 如果升级了，使用playerData.currentStamina（升级恢复的体力）；否则保持战斗中消耗后的体力
        currentStamina: playerLeveledUp ? playerData.currentStamina : prev.player.currentStamina,
      };

      // 更新幻兽数据
      const updatedPets = prev.deployedPets.map(battlePet => {
        // 在deployedPets中找到对应的幻兽
        const pet = deployedPets.find(p => p.id === battlePet.petId);
        if (!pet) return battlePet;

        // 检查幻兽是否升级（最大生命值增加）
        const petLeveledUp = pet.mhp > battlePet.maxHp;

        // 更新幻兽属性
        return {
          ...battlePet,
          level: pet.dj,
          maxHp: pet.mhp,
          attackMin: pet.xgj,
          attackMax: pet.dgj,
          defense: pet.fy,
          // 如果升级了，恢复满血；否则保持当前HP
          currentHp: petLeveledUp ? pet.mhp : battlePet.currentHp,
        };
      });

      return {
        ...prev,
        player: updatedPlayer,
        deployedPets: updatedPets,
      };
    });
  }, [playerData, deployedPets]);

  /**
   * 添加伤害数字显示
   * @param damage 伤害数值
   * @param targetId 目标ID
   */
  const addDamageNumber = useCallback((damage: number, targetId: string) => {
    const newId = damageIdCounterRef.current + 1;
    damageIdCounterRef.current = newId;
    setDamageNumbers(prev => [...prev, { id: newId, value: damage, targetId }]);

    // 1.5秒后移除伤害数字
    setTimeout(() => {
      setDamageNumbers(prev => prev.filter(d => d.id !== newId));
    }, 1500);
  }, []);

  /**
   * 添加战斗日志
   * @param logEntry 战斗日志条目
   */
  const addBattleLog = (logEntry: BattleLogEntry) => {
    setBattleState(prev => ({
      ...prev,
      battleLogs: [...prev.battleLogs, logEntry],
      logIdCounter: prev.logIdCounter + 1
    }));
  };

  // 使用ref跟踪已经处理过的阵亡敌人ID，避免重复调用回调
  const processedDeadEnemiesRef = useRef<Set<string>>(new Set());

  /**
   * 监听敌人阵亡，调用回调函数
   * 使用useEffect延迟调用，避免在渲染过程中更新父组件状态
   */
  useEffect(() => {
    if (!onEnemyDeath) return;

    // 检查每个敌人的生命值
    battleState.enemies.forEach(enemy => {
      // 如果敌人阵亡且还没有处理过
      if (enemy.currentHp <= 0 && !processedDeadEnemiesRef.current.has(enemy.id)) {
        // 标记为已处理
        processedDeadEnemiesRef.current.add(enemy.id);

        // 延迟调用回调，避免在渲染过程中更新父组件状态
        setTimeout(() => {
          onEnemyDeath(enemy);
        }, 0);
      }
    });
  }, [battleState.enemies, onEnemyDeath]);

  /**
   * 检查战斗是否结束
   * @param currentState 当前战斗状态
   * @returns 战斗结果
   */
  const checkBattleEnd = (currentState: BattleState): BattleResult => {
    // 检查玩家是否死亡
    if (currentState.player.currentHp <= 0) {
      return 'enemy_win';
    }
    // 检查敌人是否全部死亡
    const allEnemiesDead = currentState.enemies.every(enemy => enemy.currentHp <= 0);
    if (allEnemiesDead) {
      return 'player_win';
    }

    return 'in_progress';
  };

  /**
   * 更新角色体力
   * @param character 战斗角色
   * @param skill 使用的技能
   * @returns 更新后的角色
   */
  const updateCharacterResources = (
    character: BattleCharacter,
    skill: BattleSkill
  ): BattleCharacter => {
    return {
      ...character,
      currentStamina: character.currentStamina - skill.staminaCost
    };
  };

  /**
   * 处理单体攻击结果
   * 支持更新玩家角色或幻兽的生命值
   * 当幻兽血量降为0时，添加阵亡战斗日志
   *
   * 合体幻兽伤害扣除逻辑：
   * - 优先从幻兽血条扣除
   * - 如果幻兽血量不足，将幻兽血量清零，溢出伤害消失，不再扣除主角血量
   *
   * @param result 攻击结果
   * @param attacker 攻击者
   * @param skill 使用的技能
   */
  const handleSingleAttackResult = (
    result: { defender: BattleCharacter; damageResult: DamageResult; logEntry: BattleLogEntry },
    attacker: BattleCharacter,
    skill: BattleSkill
  ) => {
    // 播放攻击动画
    setAttackingCharacterId(attacker.id);

    // 添加伤害数字
    if (result.damageResult.damage > 0) {
      addDamageNumber(result.damageResult.damage, result.defender.id);
    }

    // 添加战斗日志
    addBattleLog(result.logEntry);

    // 更新状态
    setBattleState(prev => {
      const newState = { ...prev };

      // 更新攻击者资源
      if (attacker.isPlayer) {
        newState.player = updateCharacterResources(newState.player, skill);
      } else {
        newState.enemies = newState.enemies.map(enemy =>
          enemy.id === attacker.id ? updateCharacterResources(enemy, skill) : enemy
        );
      }

      // ========== 合体幻兽伤害扣除逻辑 ==========
      // 检查是否有合体幻兽
      const mergedPet = newState.deployedPets.find(pet => pet.isMerged && pet.currentHp > 0);

      if (mergedPet && result.defender.isPlayer) {
        // 有合体幻兽，优先从幻兽血条扣除
        const damage = result.damageResult.damage;
        const newHp = mergedPet.currentHp - damage;

        // 检查幻兽是否受到致命伤害（血量降为0或以下）
        if (newHp <= 0) {
          // ========== 幻兽保留1血机制 ==========
          // 幻兽阵亡时不会解除合体状态，而是保留1的最低血量继续存活
          // 但是降低人物10幸运值，同时判断是否触发爱的力量技能

            // 1. 降低人物幸运值10点（确保不低于0）
            newState.player.luck = Math.max(0, newState.player.luck - 10);

            // 2. 添加战斗日志：记录人物幸运值降低
            const luckDownLogEntry: BattleLogEntry = {
              id: generateLogId(),
              round: newState.round,
              actor: mergedPet.name,
              actorId: mergedPet.id,
              action: `${mergedPet.name} 受到致命伤害，人物幸运值降低10点！当前幸运值：${newState.player.luck}`,
              actionType: 'damage',
              damage: damage,
              target: mergedPet.name,
              targetId: mergedPet.id
            };
            newState.battleLogs = [...newState.battleLogs, luckDownLogEntry];

            // 3. 检查是否触发"爱的力量"技能
            const lovePowerResult = checkLovePower(playerSkills);

            if (lovePowerResult.triggered) {
              // 4. 触发爱的力量：人物幸运值+10或+20（根据技能等级），幻兽满血复活
              newState.player.luck = newState.player.luck + lovePowerResult.luckBonus;

              // 幻兽满血复活
              newState.deployedPets = newState.deployedPets.map(pet => {
                if (pet.id === mergedPet.id) {
                  return {
                    ...pet,
                    currentHp: pet.maxHp
                  };
                }

                return pet;
              });

              // 添加战斗日志：记录爱的力量触发
              const lovePowerLogEntry: BattleLogEntry = {
                id: generateLogId(),
                round: newState.round,
                actor: mergedPet.name,
                actorId: mergedPet.id,
                action: lovePowerResult.message,
                actionType: 'skill',
                damage: 0,
                target: mergedPet.name,
                targetId: mergedPet.id
              };
              newState.battleLogs = [...newState.battleLogs, lovePowerLogEntry];
            } else {
              // 5. 未触发爱的力量：幻兽保留1血继续存活
              newState.deployedPets = newState.deployedPets.map(pet => {
                if (pet.id === mergedPet.id) {
                  return {
                    ...pet,
                    currentHp: 1
                  };
                }

                return pet;
              });
            }

            // 6. 检查人物幸运值是否为0，如果为0则自动退出战斗
            if (newState.player.luck === 0) {
              // 添加战斗日志：记录人物幸运值耗尽
              const luckExhaustedLogEntry: BattleLogEntry = {
                id: generateLogId(),
                round: newState.round,
                actor: newState.player.name,
                actorId: newState.player.id,
                action: `${newState.player.name} 幸运值耗尽，自动退出战斗！`,
                actionType: 'death',
                damage: 0,
                target: newState.player.name,
                targetId: newState.player.id
              };
              newState.battleLogs = [...newState.battleLogs, luckExhaustedLogEntry];

              // 设置战斗结果为敌方胜利
              newState.battleResult = 'enemy_win';
            }
        } else {
          // 幻兽血量足够，正常扣除幻兽血量
          newState.deployedPets = newState.deployedPets.map(pet => {
            if (pet.id === mergedPet.id) {
              return {
                ...pet,
                currentHp: newHp
              };
            }

            return pet;
          });
        }
      } else {
        // 没有合体幻兽，直接扣除主角血量
        if (result.defender.isPlayer) {
          newState.player = result.defender;
        } else {
          // 防御者是敌人，更新敌人列表
          newState.enemies = newState.enemies.map(enemy =>
            enemy.id === result.defender.id ? result.defender : enemy
          );

          // 检查敌人是否阵亡，添加阵亡日志
          if (result.defender.currentHp <= 0) {
            const deathLogEntry: BattleLogEntry = {
              id: generateLogId(),
              round: newState.round,
              actor: result.defender.name,
              actorId: result.defender.id,
              action: `${result.defender.name} 阵亡了！`,
              actionType: 'death',
              damage: 0,
              target: result.defender.name,
              targetId: result.defender.id
            };
            newState.battleLogs = [...newState.battleLogs, deathLogEntry];
          }
        }
      }

      // 检查战斗是否结束（如果战斗结果尚未设置）
      if (newState.battleResult === 'in_progress') {
        newState.battleResult = checkBattleEnd(newState);
      }

      return newState;
    });

    // 攻击动画结束
    setTimeout(() => {
      setAttackingCharacterId(null);
    }, 500);
  };

  /**
   * 处理群体攻击结果
   * @param result 攻击结果
   * @param attacker 攻击者
   * @param skill 使用的技能
   */
  const handleAoeAttackResult = (
    result: {
      enemies: BattleCharacter[];
      results: Array<{ defender: BattleCharacter; damageResult: DamageResult; logEntry: BattleLogEntry }>
    },
    attacker: BattleCharacter,
    skill: BattleSkill
  ) => {
    // 播放攻击动画
    setAttackingCharacterId(attacker.id);

    // 添加所有伤害数字和日志
    result.results.forEach(res => {
      if (res.damageResult.damage > 0) {
        addDamageNumber(res.damageResult.damage, res.defender.id);
      }
      addBattleLog(res.logEntry);
    });

    // 更新状态
    setBattleState(prev => {
      const newState = { ...prev };

      // 更新攻击者资源
      if (attacker.isPlayer) {
        newState.player = updateCharacterResources(newState.player, skill);
      } else {
        newState.enemies = newState.enemies.map(enemy =>
          enemy.id === attacker.id ? updateCharacterResources(enemy, skill) : enemy
        );
      }

      // 更新敌人列表
      newState.enemies = result.enemies;

      // 检查是否有敌人阵亡，添加阵亡日志
      result.results.forEach(res => {
        if (res.defender.currentHp <= 0) {
          const deathLogEntry: BattleLogEntry = {
            id: generateLogId(),
            round: newState.round,
            actor: res.defender.name,
            actorId: res.defender.id,
            action: `${res.defender.name} 阵亡了！`,
            actionType: 'death',
            damage: 0,
            target: res.defender.name,
            targetId: res.defender.id
          };
          newState.battleLogs = [...newState.battleLogs, deathLogEntry];
        }
      });

      // 检查战斗是否结束
      newState.battleResult = checkBattleEnd(newState);

      return newState;
    });

    // 攻击动画结束
    setTimeout(() => {
      setAttackingCharacterId(null);
    }, 500);
  };

  /**
   * 处理多段攻击结果
   * 优化为连续攻击动画效果，每次攻击独立播放动画和显示伤害数字
   * 当目标阵亡后，自动切换到血量最低的敌人继续攻击
   * @param result 攻击结果
   * @param attacker 攻击者
   * @param skill 使用的技能
   * @param onComplete 所有攻击完成后的回调函数
   */
  const handleMultiAttackResult = (
    result: { defender: BattleCharacter; damageResults: DamageResult[]; logEntries: BattleLogEntry[] },
    attacker: BattleCharacter,
    skill: BattleSkill,
    onComplete?: () => void
  ) => {
    // 逐次播放每次攻击的动画和伤害
    const attackCount = result.damageResults.length;
    const attackDelay = 400; // 每次攻击之间的延迟（毫秒）

    // 更新攻击者资源（只更新一次）
    setBattleState(prev => {
      const newState = { ...prev };

      // 更新攻击者资源
      if (attacker.isPlayer) {
        newState.player = updateCharacterResources(newState.player, skill);
      } else {
        newState.enemies = newState.enemies.map(enemy =>
          enemy.id === attacker.id ? updateCharacterResources(enemy, skill) : enemy
        );
      }

      return newState;
    });

    // 逐次播放每次攻击
    result.damageResults.forEach((damageResult, index) => {
      setTimeout(() => {
        // 播放攻击动画
        setAttackingCharacterId(attacker.id);

        // 查找当前目标（检查是否存活）
        let currentTargetId = result.defender.id;
        let isNewTarget = false;
        let switchLogEntry: BattleLogEntry | null = null;
        let attackLogEntry: BattleLogEntry | null = null;
        let deathLogEntry: BattleLogEntry | null = null;

        setBattleState(prev => {
          const newState = { ...prev };

          // 获取当前目标
          let currentDefender = newState.enemies.find(e => e.id === currentTargetId) ||
                                 (newState.player.id === currentTargetId ? newState.player : null);

          // 检查目标是否存活
          if (!currentDefender || currentDefender.currentHp <= 0) {
            // 目标已阵亡，寻找血量最低的存活敌人
            const aliveEnemies = newState.enemies.filter(e => e.currentHp > 0);

            if (aliveEnemies.length > 0) {
              // 找到血量最低的敌人
              const lowestHpEnemy = aliveEnemies.reduce((lowest, enemy) =>
                enemy.currentHp < lowest.currentHp ? enemy : lowest
              );

              currentDefender = lowestHpEnemy;
              currentTargetId = lowestHpEnemy.id;
              isNewTarget = true;

              // 创建目标切换日志
              switchLogEntry = {
                id: generateLogId(),
                round: newState.round,
                actor: attacker.name,
                actorId: attacker.id,
                action: `目标已阵亡，自动切换攻击 ${lowestHpEnemy.name}`,
                actionType: 'skill',
                damage: 0,
                target: lowestHpEnemy.name,
                targetId: lowestHpEnemy.id,
                skillName: skill.name
              };
            }
          }

          // 如果找到了有效目标，执行攻击
          if (currentDefender && currentDefender.currentHp > 0) {
            // 添加伤害数字
            if (damageResult.damage > 0) {
              addDamageNumber(damageResult.damage, currentDefender.id);
            }

            // 创建战斗日志（如果是新目标，需要修改日志内容）
            attackLogEntry = isNewTarget ? {
              ...result.logEntries[index],
              id: generateLogId(),
              target: currentDefender.name,
              targetId: currentDefender.id,
              action: `使用 ${skill.name} 第 ${index + 1} 击攻击 ${currentDefender.name}`
            } : result.logEntries[index];

            // ========== 合体幻兽伤害扣除逻辑（多段攻击） ==========
            // 检查是否有合体幻兽
            const mergedPetForMulti = newState.deployedPets.find(pet => pet.isMerged && pet.currentHp > 0);

            // 更新防御者
            if (currentDefender.isPlayer) {
              // 玩家受到伤害，检查是否有合体幻兽
              if (mergedPetForMulti) {
                // 有合体幻兽，优先从幻兽血条扣除
                const damage = damageResult.damage;
                const newHp = mergedPetForMulti.currentHp - damage;

                // 检查幻兽是否受到致命伤害（血量降为0或以下）
                if (newHp <= 0) {
                  // ========== 幻兽保留1血机制（多段攻击） ==========
                  // 幻兽阵亡时不会解除合体状态，而是保留1的最低血量继续存活
                  // 但是降低人物10幸运值，同时判断是否触发爱的力量技能

                    // 1. 降低人物幸运值10点（确保不低于0）
                    newState.player.luck = Math.max(0, newState.player.luck - 10);

                    // 2. 添加战斗日志：记录人物幸运值降低
                    const luckDownLogEntry: BattleLogEntry = {
                      id: generateLogId(),
                      round: newState.round,
                      actor: mergedPetForMulti.name,
                      actorId: mergedPetForMulti.id,
                      action: `${mergedPetForMulti.name} 受到致命伤害，人物幸运值降低10点！当前幸运值：${newState.player.luck}`,
                      actionType: 'damage',
                      damage: damage,
                      target: mergedPetForMulti.name,
                      targetId: mergedPetForMulti.id
                    };
                    newState.battleLogs = [...newState.battleLogs, luckDownLogEntry];

                    // 3. 检查是否触发"爱的力量"技能
                    const lovePowerResult = checkLovePower(playerSkills);

                    if (lovePowerResult.triggered) {
                      // 4. 触发爱的力量：人物幸运值+10或+20（根据技能等级），幻兽满血复活
                      newState.player.luck = newState.player.luck + lovePowerResult.luckBonus;

                      // 幻兽满血复活
                      newState.deployedPets = newState.deployedPets.map(pet => {
                        if (pet.id === mergedPetForMulti.id) {
                          return {
                            ...pet,
                            currentHp: pet.maxHp
                          };
                        }

                        return pet;
                      });

                      // 添加战斗日志：记录爱的力量触发
                      const lovePowerLogEntry: BattleLogEntry = {
                        id: generateLogId(),
                        round: newState.round,
                        actor: mergedPetForMulti.name,
                        actorId: mergedPetForMulti.id,
                        action: lovePowerResult.message,
                        actionType: 'skill',
                        damage: 0,
                        target: mergedPetForMulti.name,
                        targetId: mergedPetForMulti.id
                      };
                      newState.battleLogs = [...newState.battleLogs, lovePowerLogEntry];
                    } else {
                      // 5. 未触发爱的力量：幻兽保留1血继续存活
                      newState.deployedPets = newState.deployedPets.map(pet => {
                        if (pet.id === mergedPetForMulti.id) {
                          return {
                            ...pet,
                            currentHp: 1
                          };
                        }

                        return pet;
                      });
                    }

                    // 6. 检查人物幸运值是否为0，如果为0则自动退出战斗
                    if (newState.player.luck === 0) {
                      // 添加战斗日志：记录人物幸运值耗尽
                      const luckExhaustedLogEntry: BattleLogEntry = {
                        id: generateLogId(),
                        round: newState.round,
                        actor: newState.player.name,
                        actorId: newState.player.id,
                        action: `${newState.player.name} 幸运值耗尽，自动退出战斗！`,
                        actionType: 'death',
                        damage: 0,
                        target: newState.player.name,
                        targetId: newState.player.id
                      };
                      newState.battleLogs = [...newState.battleLogs, luckExhaustedLogEntry];

                      // 设置战斗结果为敌方胜利
                      newState.battleResult = 'enemy_win';
                    }
                } else {
                  // 幻兽血量足够，正常扣除幻兽血量
                  newState.deployedPets = newState.deployedPets.map(pet => {
                    if (pet.id === mergedPetForMulti.id) {
                      return {
                        ...pet,
                        currentHp: newHp
                      };
                    }

                    return pet;
                  });
                }
              } else {
                // 没有合体幻兽，直接扣除玩家血量
                newState.player = {
                  ...currentDefender,
                  currentHp: Math.max(0, currentDefender.currentHp - damageResult.damage)
                };
              }
            } else {
              // 敌人受到伤害，直接扣除敌人血量
              const updatedDefender = {
                ...currentDefender,
                currentHp: Math.max(0, currentDefender.currentHp - damageResult.damage)
              };

              newState.enemies = newState.enemies.map(enemy =>
                enemy.id === updatedDefender.id ? updatedDefender : enemy
              );

              // 检查敌人是否阵亡
              if (updatedDefender.currentHp <= 0) {
                deathLogEntry = {
                  id: generateLogId(),
                  round: newState.round,
                  actor: updatedDefender.name,
                  actorId: updatedDefender.id,
                  action: `${updatedDefender.name} 阵亡了！`,
                  actionType: 'death',
                  damage: 0,
                  target: updatedDefender.name,
                  targetId: updatedDefender.id
                };
              }
            }
          }

          // 添加所有日志到状态
          const newLogs: BattleLogEntry[] = [];
          if (switchLogEntry) newLogs.push(switchLogEntry);
          if (attackLogEntry) newLogs.push(attackLogEntry);
          if (deathLogEntry) newLogs.push(deathLogEntry);

          if (newLogs.length > 0) {
            newState.battleLogs = [...newState.battleLogs, ...newLogs];
          }

          // 检查战斗是否结束（只在最后一次攻击后检查，且战斗结果尚未设置）
          if (index === attackCount - 1 && newState.battleResult === 'in_progress') {
            newState.battleResult = checkBattleEnd(newState);
          }

          return newState;
        });

        // 攻击动画结束
        setTimeout(() => {
          setAttackingCharacterId(null);
        }, 300);

        // 如果是最后一次攻击，调用回调函数
        if (index === attackCount - 1 && onComplete) {
          setTimeout(() => {
            onComplete();
          }, 350);
        }
      }, index * attackDelay);
    });
  };

  /**
   * 处理增益技能结果
   * @param result 增益结果
   * @param attacker 攻击者
   * @param skill 使用的技能
   */
  const handleBuffResult = (
    result: { attacker: BattleCharacter; buff: Buff; logEntry: BattleLogEntry },
    attacker: BattleCharacter,
    skill: BattleSkill
  ) => {
    // 添加战斗日志
    addBattleLog(result.logEntry);

    // 更新状态
    setBattleState(prev => {
      const newState = { ...prev };

      // 更新攻击者（包含增益效果）
      if (attacker.isPlayer) {
        newState.player = updateCharacterResources(result.attacker, skill);
      } else {
        newState.enemies = newState.enemies.map(enemy =>
          enemy.id === attacker.id ? updateCharacterResources(result.attacker, skill) : enemy
        );
      }

      return newState;
    });
  };

  /**
   * 获取敌方攻击目标
   * 怪物始终攻击主角，不直接攻击幻兽
   *
   * 攻击逻辑：
   * - 怪物攻击主角
   * - 主角的防御力已经包含了幻兽的防御加成（在 characterToBattleCharacter 中计算）
   * - 扣除生命值时，优先从幻兽血条扣除（在 handleSingleAttackResult 中处理）
   *
   * @param currentState 当前战斗状态
   * @returns 攻击目标（玩家角色）
   */
  const getAttackTarget = (currentState: BattleState): BattleCharacter => {
    // 怪物始终攻击主角，不直接攻击幻兽
    // 即使有合体幻兽，攻击目标也是主角
    // 主角的防御力已经包含了幻兽的防御加成（在 characterToBattleCharacter 中计算）
    return currentState.player;
  };

  /**
   * 执行技能攻击
   * 根据技能类型调用不同的执行函数
   *
   * 使用场景：
   * 1. 玩家攻击敌人：defender 是敌人（isPlayer = false）
   * 2. 怪物攻击主角：defender 是主角（isPlayer = true）
   *
   * 注意：
   * - 怪物攻击时，主角的防御力已经包含了幻兽的防御加成
   * - 扣除生命值时，优先从幻兽血条扣除（在 handleSingleAttackResult 中处理）
   *
   * @param attacker 攻击者
   * @param defender 防御者（可以是主角或敌人）
   * @param skill 使用的技能
   * @param onComplete 攻击完成后的回调函数（用于多段攻击）
   */
  const executeSkillAttack = (
    attacker: BattleCharacter,
    defender: BattleCharacter | BattlePet | null,
    skill: BattleSkill,
    onComplete?: () => void
  ) => {
    // 如果防御者是幻兽（BattlePet），需要转换为 BattleCharacter 格式
    // 这种情况不应该发生，因为怪物始终攻击主角
    let targetDefender: BattleCharacter | null = null;

    if (defender) {
      // 检查是否是幻兽（通过判断是否有 isMerged 属性来区分）
      if ('isMerged' in defender) {
        // 这是幻兽，理论上不应该发生
        // 但为了兼容性，还是转换为 BattleCharacter 格式
        const petDefender = defender as BattlePet;
        targetDefender = {
          id: petDefender.id,
          name: petDefender.name,
          level: petDefender.level,
          maxHp: petDefender.maxHp,
          currentHp: petDefender.currentHp,
          maxStamina: 0,
          currentStamina: 0,
          attackMin: petDefender.attackMin,
          attackMax: petDefender.attackMax,
          defense: petDefender.defense,
          combatPower: 0,
          dodgeRate: 0,
          luck: 0,
          skills: [],
          buffs: [],
          isPlayer: false,
          gridPosition: petDefender.gridPosition
        };
      } else {
        // 这是主角或敌人，直接使用
        targetDefender = defender as BattleCharacter;
      }
    }

    // 使用统一的 executeSkill 函数
    const result = executeSkill(attacker, targetDefender, battleState.enemies, skill, battleState.round);

    // 根据技能类型处理结果
    switch (result.type) {
      case 'single':
        handleSingleAttackResult(result, attacker, skill);
        if (onComplete) onComplete();
        break;
      case 'aoe':
        handleAoeAttackResult(result, attacker, skill);
        if (onComplete) onComplete();
        break;
      case 'multi':
        handleMultiAttackResult(result, attacker, skill, onComplete);
        break;
      case 'buff':
        handleBuffResult(result, attacker, skill);
        if (onComplete) onComplete();
        break;
      case 'special':
        handleSingleAttackResult(result, attacker, skill);
        if (onComplete) onComplete();
        break;
    }
  };

  /**
   * 玩家选择行动
   * @param skillId 技能ID
   */
  const handleActionSelect = (skillId: string) => {
    setBattleState(prev => ({
      ...prev,
      selectedAction: skillId
    }));
  };

  /**
   * 玩家选择目标
   * @param enemyId 敌人ID
   */
  const handleTargetSelect = (enemyId: string) => {
    if (!battleState.selectedAction) return;

    // 找到选中的技能
    const skill = battleState.player.skills.find(s => s.id === battleState.selectedAction);
    if (!skill) return;

    // 增益技能不需要选择目标
    if (skill.attackType === 'buff') {
      executeSkillAttack(battleState.player, null, skill, () => {
        // 清除选择并切换到敌人回合，重置敌人行动索引
        setBattleState(prev => ({
          ...prev,
          selectedAction: null,
          targetEnemy: null,
          isPlayerTurn: false,
          currentEnemyActionIndex: 0 // 重置敌人行动索引
        }));
      });

      return;
    }

    // 找到目标敌人
    const targetEnemy = battleState.enemies.find(e => e.id === enemyId && e.currentHp > 0);
    if (!targetEnemy) return;

    // 执行攻击，传入回调函数在攻击完成后切换回合
    executeSkillAttack(battleState.player, targetEnemy, skill, () => {
      // 清除选择并切换到敌人回合，重置敌人行动索引
      setBattleState(prev => ({
        ...prev,
        selectedAction: null,
        targetEnemy: null,
        isPlayerTurn: false,
        currentEnemyActionIndex: 0 // 重置敌人行动索引
      }));
    });
  };

  /**
   * 敌人回合处理
   * 使用状态机方式，通过 currentEnemyActionIndex 追踪当前行动的敌人
   */
  useEffect(() => {
    // 如果是玩家回合或战斗已结束，不执行
    if (battleState.isPlayerTurn || battleState.battleResult !== 'in_progress') {
      return;
    }

    // 使用 ref 获取最新的敌人列表，避免依赖 battleState.enemies 导致重复触发
    const aliveEnemies = enemiesRef.current.filter(enemy => enemy.currentHp > 0);

    // 如果没有存活的敌人，直接切换回玩家回合
    if (aliveEnemies.length === 0) {
      setBattleState(prev => ({
        ...prev,
        isPlayerTurn: true,
        round: prev.round + 1,
        currentEnemyActionIndex: 0
      }));

      return;
    }

    // 检查是否所有敌人都已行动
    if (battleState.currentEnemyActionIndex >= aliveEnemies.length) {
      // 所有敌人行动完毕，切换回玩家回合
      setBattleState(prev => {
        // 移除过期的增益效果
        const updatedPlayer = removeExpiredBuffs(prev.player);
        const updatedEnemies = prev.enemies.map(enemy => removeExpiredBuffs(enemy));

        return {
          ...prev,
          player: updatedPlayer,
          enemies: updatedEnemies,
          isPlayerTurn: true,
          round: prev.round + 1,
          currentEnemyActionIndex: 0
        };
      });

      return;
    }

    // 执行当前敌人的行动
    const currentEnemy = aliveEnemies[battleState.currentEnemyActionIndex];

    // 延迟执行，让玩家看到行动过程
    const timer = setTimeout(() => {
      // 先检查战斗状态
      if (battleState.battleResult !== 'in_progress') {
        return;
      }

      // 获取最新的敌人状态
      const enemy = battleState.enemies.find(e => e.id === currentEnemy.id);
      if (!enemy || enemy.currentHp <= 0) {
        // 敌人已死亡，跳到下一个敌人
        setBattleState(prev => ({
          ...prev,
          currentEnemyActionIndex: prev.currentEnemyActionIndex + 1
        }));

        return;
      }

      // 简单AI：选择技能
      const availableSkills = enemy.skills.filter(s => s.isAvailable);
      let selectedSkill = availableSkills[0];

      if (availableSkills.length > 1) {
        const aoeSkill = availableSkills.find(s => s.attackType === 'aoe');
        if (aoeSkill && enemy.currentStamina >= aoeSkill.staminaCost) {
          selectedSkill = aoeSkill;
        } else {
          const randomIndex = Math.floor(Math.random() * availableSkills.length);
          selectedSkill = availableSkills[randomIndex];
        }
      }

      // 获取攻击目标（优先攻击合体幻兽）
      // 使用 getAttackTarget 函数实现优先攻击合体幻兽的逻辑
      const attackTarget = getAttackTarget(battleState);

      // 执行技能攻击（在 setBattleState 外部调用，避免嵌套状态更新）
      executeSkillAttack(enemy, attackTarget, selectedSkill);

      // 移动到下一个敌人
      setBattleState(prev => ({
        ...prev,
        currentEnemyActionIndex: prev.currentEnemyActionIndex + 1
      }));
    }, 800); // 每个敌人行动间隔800ms

    return () => clearTimeout(timer);
  }, [battleState.isPlayerTurn, battleState.battleResult, battleState.currentEnemyActionIndex]); // 不依赖 battleState.enemies，使用 ref 避免重复触发

  /**
   * 监听战斗结果
   * 当战斗结束时，延迟2秒后通知父组件
   * 同时传递玩家和幻兽的最终状态，用于同步回全局状态
   */
  useEffect(() => {
    if (battleState.battleResult !== 'in_progress') {
      // 延迟2秒后通知战斗结束，让玩家看到结果
      const timer = setTimeout(() => {
        // ========== 战斗结束状态同步 ==========
        // 传递战斗结束时的玩家状态（包含HP、MP、体力等）
        // 传递战斗结束时的幻兽状态列表（包含petId和currentHp）
        // 这些状态将同步回全局状态，确保幻兽血量在战斗后正确保存
        onBattleEnd(battleState.battleResult, battleState.player, battleState.deployedPets);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [battleState.battleResult, battleState.player, battleState.deployedPets, onBattleEnd]);

  /**
   * 显示角色/幻兽/敌人详情弹窗
   * 根据角色类型显示对应的详情弹窗
   * @param character 角色或幻兽数据
   * @param isEnemy 是否是敌人
   */
  const showCharacterDetail = useCallback((
    character: BattleCharacter | BattlePet,
    isEnemy: boolean
  ) => {
    // 判断是否是幻兽类型（通过 isMerged 属性判断）
    const isPet = 'isMerged' in character;

    if (isPet) {
      // 幻兽详情：通过 petId 在 deployedPets 中查找原始幻兽数据
      const pet = deployedPets.find(p => p.id === (character as BattlePet).petId);
      if (pet) {
        setSelectedPet(pet);
        setSelectedCharacter(null);
        setDetailType('pet');
        setShowDetailModal(true);
      }
    } else if (isEnemy) {
      // 敌人详情：直接使用 BattleCharacter 数据
      setSelectedCharacter(character as BattleCharacter);
      setSelectedPet(null);
      setDetailType('enemy');
      setShowDetailModal(true);
    } else {
      // 玩家角色详情：直接使用 BattleCharacter 数据
      setSelectedCharacter(character as BattleCharacter);
      setSelectedPet(null);
      setDetailType('character');
      setShowDetailModal(true);
    }
  }, [deployedPets]);

  /**
   * 处理九宫格中角色/幻兽/敌人的点击事件
   * 区分"选择攻击目标"和"查看详情"两种情况
   * @param character 角色或幻兽数据
   * @param isEnemy 是否是敌人
   */
  const handleCharacterClick = useCallback((
    character: BattleCharacter | BattlePet,
    isEnemy: boolean
  ) => {
    // 如果是玩家回合且已选择技能，且点击的是敌人
    if (battleState.isPlayerTurn && battleState.selectedAction && isEnemy) {
      // 执行选择攻击目标的逻辑（现有逻辑）
      handleTargetSelect(character.id);
    } else {
      // 显示详情弹窗
      showCharacterDetail(character, isEnemy);
    }
  }, [battleState.isPlayerTurn, battleState.selectedAction, handleTargetSelect, showCharacterDetail]);

  /**
   * 关闭详情弹窗
   */
  const handleCloseDetailModal = useCallback(() => {
    setShowDetailModal(false);
    setSelectedCharacter(null);
    setSelectedPet(null);
    setDetailType(null);
  }, []);

  /**
   * 渲染九宫格占位
   * 根据角色阵营渲染不同的九宫格布局
   * 敌人阵营：渲染敌人列表
   * 我方阵营：渲染玩家角色 + 出战幻兽
   *
   * 幻兽阵亡显示逻辑：
   * - 当幻兽的 currentHp <= 0 时，该位置显示"已阵亡"状态
   * - 阵亡的幻兽不再显示角色卡片，只显示占位符
   * - 敌人阵亡时同样显示"已阵亡"状态
   *
   * @param isEnemy 是否是敌人阵营的九宫格
   * @returns 九宫格 JSX 元素
   */
  const renderGrid = (isEnemy: boolean) => {
    const gridCells: React.ReactNode[] = [];

    // 根据阵营获取要渲染的角色列表
    // 敌人阵营：渲染敌人列表
    // 我方阵营：渲染玩家 + 出战幻兽
    const characters = isEnemy
      ? battleState.enemies
      : [battleState.player, ...battleState.deployedPets];

    // 生成 3x3 共 9 个格子
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
        // 查找在该位置的角色（玩家、幻兽或敌人）
        const character = characters.find(
          (char) => char.gridPosition.x === x && char.gridPosition.y === y
        );

        // 判断是否可以选择这个角色作为目标
        // 只有敌人阵营的角色可以被选择，且必须存活、已选择技能、玩家回合
        const isSelectable = isEnemy &&
          character &&
          character.currentHp > 0 &&
          battleState.selectedAction &&
          battleState.isPlayerTurn;

        // 判断这个角色是否有伤害数字
        const characterDamageNumbers = character
          ? damageNumbers.filter(d => d.targetId === character.id)
          : [];

        gridCells.push(
          <div
            key={`${isEnemy ? 'enemy' : 'player'}-${x}-${y}`}
            className={`grid-cell ${character ? 'occupied' : ''} ${isSelectable ? 'selectable' : ''} ${character && character.currentHp > 0 ? 'clickable' : ''} ${attackingCharacterId === character?.id ? 'attacking' : ''}`}
            onClick={() => {
              // 如果有角色且存活，处理点击事件
              if (character && character.currentHp > 0) {
                handleCharacterClick(character, isEnemy);
              }
            }}
          >
            {/* 角色存活时显示角色卡片 */}
            {character && character.currentHp > 0 ? (
              <div className="character-wrapper">
                <CharacterCard character={character} />
                {/* 渲染伤害数字 */}
                {characterDamageNumbers.map(dn => (
                  <div key={dn.id} className="damage-number">
                    -{dn.value}
                  </div>
                ))}
              </div>
            ) : (
              /* 角色阵亡或空位置时显示占位符 */
              /* 幻兽阵亡：显示"已阵亡"文本 */
              /* 空位置：显示"空位置"文本 */
              <div className="empty-placeholder">
                {character && character.currentHp <= 0 ? '已阵亡' : '空位置'}
              </div>
            )}
          </div>
        );
      }
    }

    return (
      <div className={`grid-container ${isEnemy ? 'enemy-grid' : 'player-grid'}`}>
        {gridCells}
      </div>
    );
  };

  return (
    <div className="battle-container">
      {/* 顶部占位框 */}
      <div className="page-top-placeholder"></div>

      <div className="battle-header">
        <h2>战斗界面 - 第 {battleState.round} 回合</h2>
        {/* 离开战斗按钮 - 战斗进行中时显示 */}
        {battleState.battleResult === 'in_progress' && onLeaveBattle && (
          <button
            className="game-btn"
            onClick={() => onLeaveBattle(battleState.player, battleState.deployedPets)}
          >
            离开战斗
          </button>
        )}
        {battleState.battleResult === 'player_win' && (
          <div className="battle-result victory">战斗胜利！</div>
        )}
        {battleState.battleResult === 'enemy_win' && (
          <div className="battle-result defeat">战斗失败...</div>
        )}
      </div>

      <div className="enemy-section">
        {renderGrid(true)}
      </div>

      <div className="player-section">
        {renderGrid(false)}
      </div>

      {/* 行动按钮区域 - 固定显示 */}
      <div className="action-section">
        {battleState.isPlayerTurn && battleState.battleResult === 'in_progress' ? (
          <>
            <ActionButtons
              skills={battleState.player.skills.filter(skill => skill.type !== 'passive')}
              currentStamina={battleState.player.currentStamina}
              onActionSelect={handleActionSelect}
              disabled={!battleState.isPlayerTurn || battleState.battleResult !== 'in_progress'}
            />
            {battleState.selectedAction && (
              <div className="target-hint">请点击要攻击的敌人</div>
            )}
          </>
        ) : battleState.battleResult === 'in_progress' ? (
          <div className="enemy-action-hint">敌方行动中...</div>
        ) : null}
      </div>

      {/* 战斗日志区域 - 永远显示，参考首页交互日志 */}
      <div className="battle-log-section">
        <BattleLog logs={battleState.battleLogs} />
      </div>

      {/* ========== 详情弹窗区域 ========== */}
      {/* 角色详情弹窗 */}
      <CharacterDetailModal
        isVisible={showDetailModal && detailType === 'character'}
        onClose={handleCloseDetailModal}
        character={selectedCharacter}
      />

      {/* 幻兽详情弹窗 */}
      <PetDetailModal
        isVisible={showDetailModal && detailType === 'pet'}
        onClose={handleCloseDetailModal}
        pet={selectedPet}
        canDeploy={false}
      />

      {/* 敌人详情弹窗 */}
      <EnemyDetailModal
        isVisible={showDetailModal && detailType === 'enemy'}
        onClose={handleCloseDetailModal}
        enemy={selectedCharacter}
        warSoulSetInfo={warSoulSetInfo || undefined}
      />
    </div>
  );
};

export default Battle;
