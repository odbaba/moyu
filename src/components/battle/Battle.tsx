import React, { useState, useEffect, useCallback, useRef } from 'react';
// 导入新的类型定义
import type { 
  BattleState, BattleResult, BattleLogEntry, BattleCharacter, BattleSkill,
  CharacterData, SkillDetail, EnemyTemplate, GridPosition, Buff, DamageResult, EnemyData, Pet, BattlePet
} from '../../types';
// 导入战斗适配器工具
import { 
  characterToBattleCharacter, 
  skillToBattleSkill,
  createEnemyFromTemplate,
  createEnemyFromEnemyData,
  petToBattlePet
} from '../../utils/battleAdapter';
// 导入战斗计算工具
import {
  calculateDamage,
  executeSingleAttack,
  executeAoeAttack,
  executeMultiAttack,
  executeBuffSkill,
  executeSkill,
  removeExpiredBuffs,
  calculateBuffedStats,
  generateLogId
} from '../../utils/battleCalculator';
// 导入战斗数据
import { createEnemiesForBattle, enemyTemplates, enemySkillTemplates } from '../../data/battleData';
import CharacterCard from './CharacterCard';
import BattleLog from './BattleLog';
import ActionButtons from './ActionButtons';

/**
 * 战斗组件属性接口
 * 接收玩家数据、技能数据、敌人配置等信息
 */
interface BattleProps {
  playerData: CharacterData;       // 玩家角色数据
  playerSkills: SkillDetail[];     // 玩家技能数据
  enemyTemplateId?: string;        // 敌人模板ID（可选，优先使用 enemiesData）
  enemyLevel?: number;             // 敌人等级（可选）
  enemyCount?: number;             // 敌人数量（可选）
  enemiesData?: EnemyData[];       // 敌人数据列表（优先使用）
  deployedPets?: Pet[];            // 出战幻兽列表（可选，最多2只）
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
   */
  onLeaveBattle?: () => void;
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
  onBattleEnd,
  onLeaveBattle
}) => {
  // 伤害数字ID计数器（使用 useRef 避免 StrictMode 下的重复问题）
  const damageIdCounterRef = useRef(0);
  // 伤害数字显示状态
  const [damageNumbers, setDamageNumbers] = useState<DamageNumber[]>([]);
  // 攻击动画状态
  const [attackingCharacterId, setAttackingCharacterId] = useState<string | null>(null);
  // 战斗日志展开/收起状态
  const [isBattleLogExpanded, setIsBattleLogExpanded] = useState(false);

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
      { x: 1, y: 1 }  // 中间（备用，但玩家在这里）
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

    let enemies: BattleCharacter[] = [];

    // 优先使用 enemiesData 创建敌人（怪物系统）
    if (enemiesData && enemiesData.length > 0) {
      const positions = getGridPositions(enemiesData.length);
      enemies = enemiesData.map((enemyData, index) => {
        return createEnemyFromEnemyData(enemyData, index, positions[index] || { x: 0, y: 0 });
      });
    } else {
      // 使用模板创建敌人（原有逻辑）
      enemies = createEnemiesForBattle(enemyTemplateId, enemyLevel, enemyCount);
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

    // 返回初始战斗状态
    return {
      player,
      enemies,
      deployedPets: battlePets, // 将转换后的幻兽数据添加到战斗状态
      currentTurn: 'player',
      isPlayerTurn: true,
      battleLogs: [],
      round: 1,
      selectedAction: null,
      targetEnemy: null,
      battleResult: 'in_progress',
      logIdCounter: 0,
      currentEnemyActionIndex: 0  // 初始化敌人行动索引
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
   * 更新角色MP和体力
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
      currentMp: character.currentMp - skill.mpCost,
      currentStamina: character.currentStamina - skill.staminaCost
    };
  };

  /**
   * 处理单体攻击结果
   * 支持更新玩家角色或幻兽的生命值
   * 当幻兽血量降为0时，添加阵亡战斗日志
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
      
      // 更新防御者生命值
      // 需要判断防御者是玩家角色、幻兽还是敌人
      if (result.defender.isPlayer) {
        // 防御者是玩家角色，更新玩家状态
        newState.player = result.defender;
      } else {
        // 检查防御者是否是幻兽（通过 ID 在 deployedPets 中查找）
        const petIndex = newState.deployedPets.findIndex(pet => pet.id === result.defender.id);
        
        if (petIndex !== -1) {
          // 防御者是幻兽，更新幻兽的生命值
          // 注意：result.defender 是 BattleCharacter 类型，需要提取生命值信息
          newState.deployedPets = newState.deployedPets.map((pet, index) => {
            if (index === petIndex) {
              // 更新幻兽的当前生命值
              return {
                ...pet,
                currentHp: result.defender.currentHp
              };
            }
            return pet;
          });
          
          // ========== 幻兽阵亡处理 ==========
          // 检查幻兽是否阵亡（血量降为0或以下）
          // 如果幻兽阵亡，添加战斗日志记录阵亡事件
          if (result.defender.currentHp <= 0) {
            // 获取阵亡幻兽的名称
            const deadPetName = result.defender.name;
            // 创建幻兽阵亡战斗日志
            // 日志格式："[回合数] {幻兽名称} 阵亡了！"
            const deathLogEntry: BattleLogEntry = {
              id: generateLogId(),
              round: newState.round,
              actor: deadPetName,
              actorId: result.defender.id,
              action: `${deadPetName} 阵亡了！`,
              actionType: 'death',
              damage: 0,
              target: deadPetName,
              targetId: result.defender.id
            };
            // 将阵亡日志添加到战斗日志列表
            newState.battleLogs = [...newState.battleLogs, deathLogEntry];
          }
        } else {
          // 防御者是敌人，更新敌人列表
          newState.enemies = newState.enemies.map(enemy => 
            enemy.id === result.defender.id ? result.defender : enemy
          );
        }
      }
      
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
   * @param result 攻击结果
   * @param attacker 攻击者
   * @param skill 使用的技能
   */
  const handleMultiAttackResult = (
    result: { defender: BattleCharacter; damageResults: DamageResult[]; logEntries: BattleLogEntry[] },
    attacker: BattleCharacter,
    skill: BattleSkill
  ) => {
    // 播放攻击动画
    setAttackingCharacterId(attacker.id);
    
    // 添加所有伤害数字和日志
    result.damageResults.forEach((damageResult, index) => {
      if (damageResult.damage > 0) {
        addDamageNumber(damageResult.damage, result.defender.id);
      }
      addBattleLog(result.logEntries[index]);
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
      
      // 更新防御者生命值
      if (result.defender.isPlayer) {
        newState.player = result.defender;
      } else {
        newState.enemies = newState.enemies.map(enemy => 
          enemy.id === result.defender.id ? result.defender : enemy
        );
      }
      
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
   * 实现优先攻击合体幻兽的逻辑
   * 
   * 攻击优先级规则：
   * 1. 首先检查第一出战位幻兽（位置 {x: 0, y: 2}）是否合体且存活
   * 2. 如果第一出战位幻兽不合体或已死亡，检查第二出战位幻兽（位置 {x: 2, y: 2}）
   * 3. 如果没有合体幻兽或合体幻兽已死亡，则攻击玩家角色
   * 
   * 幻兽阵亡处理：
   * - 当幻兽 currentHp <= 0 时，视为已阵亡，不再作为攻击目标
   * - 敌人会自动切换攻击目标到玩家角色或其他存活的合体幻兽
   * - 这确保了幻兽阵亡后战斗逻辑的正确性
   * 
   * @param currentState 当前战斗状态
   * @returns 攻击目标（玩家角色或合体幻兽）
   */
  const getAttackTarget = (currentState: BattleState): BattleCharacter | BattlePet => {
    // 获取出战幻兽列表
    const deployedPets = currentState.deployedPets;
    
    // 检查第一出战位幻兽（位置 {x: 0, y: 2}）
    // 优先级最高：如果第一出战位幻兽合体且存活，则返回该幻兽
    if (deployedPets.length > 0) {
      const firstPet = deployedPets[0];
      // 检查幻兽是否合体（isMerged === true）且存活（currentHp > 0）
      // 幻兽阵亡时 currentHp <= 0，不作为攻击目标
      if (firstPet.isMerged && firstPet.currentHp > 0) {
        // 返回第一出战位的合体幻兽作为攻击目标
        return firstPet;
      }
    }
    
    // 检查第二出战位幻兽（位置 {x: 2, y: 2}）
    // 优先级次之：如果第二出战位幻兽合体且存活，则返回该幻兽
    if (deployedPets.length > 1) {
      const secondPet = deployedPets[1];
      // 检查幻兽是否合体（isMerged === true）且存活（currentHp > 0）
      // 幻兽阵亡时 currentHp <= 0，不作为攻击目标
      if (secondPet.isMerged && secondPet.currentHp > 0) {
        // 返回第二出战位的合体幻兽作为攻击目标
        return secondPet;
      }
    }
    
    // 如果没有合体幻兽或合体幻兽已死亡，则攻击玩家角色
    // 这是默认的攻击目标
    return currentState.player;
  };

  /**
   * 执行技能攻击
   * 根据技能类型调用不同的执行函数
   * 支持攻击玩家角色或幻兽
   * @param attacker 攻击者
   * @param defender 防御者（可为null，可以是玩家角色或幻兽）
   * @param skill 使用的技能
   */
  const executeSkillAttack = (
    attacker: BattleCharacter, 
    defender: BattleCharacter | BattlePet | null, 
    skill: BattleSkill
  ) => {
    // 如果防御者是幻兽（BattlePet），需要转换为 BattleCharacter 格式
    // 因为 executeSkill 函数需要 BattleCharacter 类型的参数
    let targetDefender: BattleCharacter | null = null;
    
    if (defender) {
      // 检查是否是幻兽（通过判断是否有 isMerged 属性来区分）
      if ('isMerged' in defender) {
        // 这是幻兽，需要转换为 BattleCharacter 格式
        // 填充幻兽缺少的属性（MP、体力、战斗力、闪避率、幸运值、技能、增益效果等）
        const petDefender = defender as BattlePet;
        targetDefender = {
          id: petDefender.id,
          name: petDefender.name,
          level: petDefender.level,
          maxHp: petDefender.maxHp,
          currentHp: petDefender.currentHp,
          maxMp: 0,                    // 幻兽没有MP，设为0
          currentMp: 0,                // 幻兽没有MP，设为0
          maxStamina: 0,               // 幻兽没有体力，设为0
          currentStamina: 0,           // 幻兽没有体力，设为0
          attackMin: petDefender.attackMin,
          attackMax: petDefender.attackMax,
          defense: petDefender.defense,
          combatPower: 0,              // 幻兽战斗力暂时设为0，后续可以计算
          dodgeRate: 0,                // 幻兽没有闪避率，设为0
          luck: 0,                     // 幻兽没有幸运值，设为0
          skills: [],                  // 幻兽没有技能列表，设为空数组
          buffs: [],                   // 幻兽没有增益效果，设为空数组
          isPlayer: false,             // 幻兽不是玩家
          gridPosition: petDefender.gridPosition
        };
      } else {
        // 这是玩家角色，直接使用
        targetDefender = defender as BattleCharacter;
      }
    }
    
    // 使用统一的 executeSkill 函数
    const result = executeSkill(attacker, targetDefender, battleState.enemies, skill, battleState.round);
    
    // 根据技能类型处理结果
    switch (result.type) {
      case 'single':
        handleSingleAttackResult(result, attacker, skill);
        break;
      case 'aoe':
        handleAoeAttackResult(result, attacker, skill);
        break;
      case 'multi':
        handleMultiAttackResult(result, attacker, skill);
        break;
      case 'buff':
        handleBuffResult(result, attacker, skill);
        break;
      case 'special':
        handleSingleAttackResult(result, attacker, skill);
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
      executeSkillAttack(battleState.player, null, skill);
      
      // 清除选择并切换到敌人回合，重置敌人行动索引
      setBattleState(prev => ({
        ...prev,
        selectedAction: null,
        targetEnemy: null,
        isPlayerTurn: false,
        currentEnemyActionIndex: 0  // 重置敌人行动索引
      }));
      return;
    }
    
    // 找到目标敌人
    const targetEnemy = battleState.enemies.find(e => e.id === enemyId && e.currentHp > 0);
    if (!targetEnemy) return;
    
    // 执行攻击
    executeSkillAttack(battleState.player, targetEnemy, skill);
    
    // 清除选择并切换到敌人回合，重置敌人行动索引
    setBattleState(prev => ({
      ...prev,
      selectedAction: null,
      targetEnemy: null,
      isPlayerTurn: false,
      currentEnemyActionIndex: 0  // 重置敌人行动索引
    }));
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
        if (aoeSkill && enemy.currentMp >= aoeSkill.mpCost) {
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
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [battleState.battleResult, battleState.player, battleState.deployedPets, onBattleEnd]);

  // 监听回合变化，自动控制战斗日志展开收起
  useEffect(() => {
    if (battleState.isPlayerTurn) {
      // 玩家回合，收起战斗日志
      setIsBattleLogExpanded(false);
    } else {
      // 敌方回合，展开战斗日志
      setIsBattleLogExpanded(true);
    }
  }, [battleState.isPlayerTurn]);

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
            className={`grid-cell ${character ? 'occupied' : ''} ${isSelectable ? 'selectable' : ''} ${attackingCharacterId === character?.id ? 'attacking' : ''}`}
            onClick={() => isSelectable && handleTargetSelect(character!.id)}
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
      <div className="battle-header">
        <h2>战斗界面 - 第 {battleState.round} 回合</h2>
        {/* 离开战斗按钮 - 战斗进行中时显示 */}
        {battleState.battleResult === 'in_progress' && onLeaveBattle && (
          <button 
            className="leave-battle-btn"
            onClick={onLeaveBattle}
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

      {/* 行动按钮区域 - 玩家回合时显示 */}
      {battleState.isPlayerTurn && battleState.battleResult === 'in_progress' && (
        <div className="action-section">
          <ActionButtons
            skills={battleState.player.skills}
            currentMp={battleState.player.currentMp}
            currentStamina={battleState.player.currentStamina}
            onActionSelect={handleActionSelect}
            disabled={!battleState.isPlayerTurn || battleState.battleResult !== 'in_progress'}
          />
          {battleState.selectedAction && (
            <div className="target-hint">请点击要攻击的敌人</div>
          )}
        </div>
      )}

      {/* 战斗日志区域 - 可展开收起 */}
      <div className="battle-log-section">
        <div 
          className="battle-log-toggle"
          onClick={() => setIsBattleLogExpanded(!isBattleLogExpanded)}
        >
          <span className="toggle-icon">{isBattleLogExpanded ? '▼' : '▶'}</span>
          <span className="toggle-text">战斗日志</span>
        </div>
        {isBattleLogExpanded && (
          <BattleLog logs={battleState.battleLogs} />
        )}
      </div>
    </div>
  );
};

export default Battle;
