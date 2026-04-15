import './App.css';
import './components/home/home.css';
import './components/battle/battle.css';
import './components/common/common.css';
import './components/character/character.css';
import './components/inventory/inventory.css';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// 导入组件 - 战斗模块
import { Battle } from './components/battle';
// 导入组件 - 角色模块
import { CharacterPage } from './components/character';
// 导入组件 - 公共模块
import { EnemyModal, NPCModal } from './components/common';
import CollectorModal from './components/common/CollectorModal';
import EquipmentRefineModal from './components/common/EquipmentRefineModal';
// 导入组件 - 首页模块
import {
  InteractionButtons,
  InteractionLog,
  LocalMap,
  LocationHeader,
  Menu,
  SceneDescription,
  TimeDisplay,
  WorldMap} from './components/home';
// 导入组件 - 背包模块
import InventoryPage from './components/inventory/InventoryPage';
import UseItemTargetModal from './components/inventory/UseItemTargetModal';
// 导入组件 - 抽奖模块
import { LotteryArea } from './components/lottery';
// 导入组件 - 幻兽模块
import { PetPage } from './components/pet';
// 导入组件 - 商店模块
import { ShopPage } from './components/shop';
// 导入组件 - 技能模块
import SkillPage from './components/skill/SkillPage';
import { bossSpawnConfigs, bossTemplates } from './data/bossData';
import { exampleCharacter } from './data/characterData';
// 导入数据
import { locations } from './data/gameData';
import { generateBossInteractables, interactableConfig } from './data/interactableData';
import { exampleItems } from './data/inventoryData';
import { examplePets } from './data/petData';
import { getShopItemById } from './data/shopData';
import { createInitialSkills, getSkillUpgradeCost } from './data/skillData';
import type { ActionInteractable, BattleCharacter, BattlePet, BattleResult, CharacterData, EnemyData, EnemyInteractable, EquipmentDetail, EquipmentItem, EquipmentSlotType, GemItem, Interactable, InventoryItem, NPCInteractable, Pet, PlayerResources, PrincessRelationship, RefineResult, SkillDetail, TimeSystem } from './types';
import { calculateCharacterBaseAttributes, calculateNextLevelMaxExp } from './utils/attributeCalculator';
// 导入 BOSS 工具函数
import { rollBossSpawns } from './utils/bossUtils';
import { calculatePetMergeBonus } from './utils/combatPower';
import { getDailyTask, getTaskDescription } from './utils/dailyTaskUtils';
import { equipmentDetailToItem, equipmentItemToDetail } from './utils/equipmentConverter';
// 导入战利品工具函数
import { calculateLoot, mergeLootResults } from './utils/lootUtils';
import { checkChallengeRequirement, claimProtectorReward, getMapChallengeConfig, getMapChallengeDescription } from './utils/mapChallengeUtils';
import { claimMilitaryPay, getMilitaryRankDescription, queryBattleExp, queryMilitaryIntel } from './utils/militaryRankUtils';
import { claimNobleReward, getNobleRankSystemDescription, getTradeSystemMessage } from './utils/nobleRankUtils';
import { findPath } from './utils/pathfinding';
// 导入 NPC 相关工具函数
import { getDemonArmyDialogue, performChat, performGift, receiveConfidantGift, receiveSundayGift } from './utils/princessRelationUtils';

// 初始化空装备槽位
const createEmptyEquippedItems = (): Record<EquipmentSlotType, EquipmentDetail | null> => ({
  weapon: null,
  helmet: null,
  clothes: null,
  shoes: null,
  bracelet: null,
  necklace: null
});

// 初始化时间系统
const createInitialTimeSystem = (): TimeSystem => ({
  nowday: 1, // 当前天数，初始为第1天
  nowtime: 0, // 当天已消耗的时间单位，初始为0
  onedaytime: 15 // 一天的时间单位总数，固定为15
});

function App() {
  // 游戏状态管理
  const [currentLocation, setCurrentLocation] = useState('kasanuocheng');
  const [interactionLog, setInteractionLog] = useState<string[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);
  // 时间系统状态
  const [timeSystem, setTimeSystem] = useState<TimeSystem>(createInitialTimeSystem);
  // 玩家资源状态
  const [playerResources, setPlayerResources] = useState<PlayerResources>({
    gold: 12568000000, // 初始金币
    magicStone: 1000, // 初始魔石
    battleExp: 0, // 战功
    merit: 0, // 功勋
  });
  // 角色状态（改为状态管理，支持经验值增加和升级）
  const [character, setCharacter] = useState<CharacterData>(exampleCharacter);
  // 背包状态
  const [inventory, setInventory] = useState<InventoryItem[]>(exampleItems);
  // 装备槽位状态
  const [equippedItems, setEquippedItems] = useState<Record<EquipmentSlotType, EquipmentDetail | null>>(createEmptyEquippedItems);
  // 战斗状态
  const [inBattle, setInBattle] = useState(false);
  // 战斗参数状态
  const [battleParams, setBattleParams] = useState<{
    enemyTemplateId: string;
    enemyLevel: number;
    enemyCount: number;
    enemiesData?: EnemyData[];
  } | null>(null);
  // 角色信息页面状态
  const [showCharacterPage, setShowCharacterPage] = useState(false);
  // 背包页面状态
  const [showInventoryPage, setShowInventoryPage] = useState(false);
  // 使用物品目标选择弹窗状态
  const [showUseItemTargetModal, setShowUseItemTargetModal] = useState(false);
  // 当前要使用的物品
  const [currentUseItem, setCurrentUseItem] = useState<InventoryItem | null>(null);
  // 技能页面状态
  const [showSkillPage, setShowSkillPage] = useState(false);
  // 幻兽页面状态
  const [showPetPage, setShowPetPage] = useState(false);
  // 幻兽数据状态
  const [pets, setPets] = useState<Pet[]>(examplePets);
  // 技能数据状态
  const [skills, setSkills] = useState<SkillDetail[]>(createInitialSkills(false));

  // 敌人模态窗口状态
  const [showEnemyModal, setShowEnemyModal] = useState(false);
  const [currentEnemyData, setCurrentEnemyData] = useState<EnemyInteractable | null>(null);

  // 当前正在战斗的交互ID（用于击杀后从地图移除）
  const [currentBattleInteractableId, setCurrentBattleInteractableId] = useState<string | null>(null);

  // 已击杀的怪物交互ID列表（每日刷新时清空）
  const [killedMonsters, setKilledMonsters] = useState<Set<string>>(new Set());

  // 已刷新的 BOSS 交互ID列表（每日重新随机刷新）
  const [spawnedBosses, setSpawnedBosses] = useState<Set<string>>(new Set());

  // NPC模态窗口状态
  const [showNPCModal, setShowNPCModal] = useState(false);
  const [currentNPCData, setCurrentNPCData] = useState<NPCInteractable | null>(null);

  // 公主关系状态
  const [princessRelationship, setPrincessRelationship] = useState<PrincessRelationship>({
    level: 0, // 初始关系等级：未认识
    intimacy: 0, // 初始亲密度：0
    relationshipName: '未认识', // 初始关系名称
    canChatToday: true, // 今天可以聊天
    canGiftToday: true, // 今天可以送礼
    canReceiveSundayGift: true, // 本周可以领取周日礼物
    hasReceivedConfidantGift: false, // 未领取知己礼物
  });

  // 军衔和战功状态
  const [militaryRank] = useState(0); // 军衔等级（0-11）
  const [battleExp] = useState(0); // 累计战功
  const [hasClaimedMilitaryPay, setHasClaimedMilitaryPay] = useState(false); // 本周是否已领取军饷

  // 爵位和功勋状态
  const [nobleRank] = useState(0); // 爵位等级（0-6）
  const [lastNobleRewardClaimTime, setLastNobleRewardClaimTime] = useState<number | null>(null); // 上次领取爵位奖励的时间

  // 商店页面状态
  const [showShopPage, setShowShopPage] = useState(false);
  const [currentShopType, setCurrentShopType] = useState<'gold' | 'magicStone'>('gold');

  // 装备精炼界面状态
  const [showRefineModal, setShowRefineModal] = useState(false);
  const [refineEquipment, setRefineEquipment] = useState<EquipmentItem | null>(null);
  const [refineGem, setRefineGem] = useState<GemItem | null>(null);

  // 收藏架界面状态
  const [showCollectorModal, setShowCollectorModal] = useState(false);

  // 抽奖区界面状态
  const [showLottery, setShowLottery] = useState(false);

  // 自动移动状态
  const [isAutoMoving, setIsAutoMoving] = useState(false);
  const [moveQueue, setMoveQueue] = useState<string[]>([]);

  // 用于防止 React StrictMode 导致的重复初始化
  const isInitializedRef = useRef(false);

  // 用于追踪上一次的天数，检测新的一天
  const prevDayRef = useRef(1);

  // currentLocation 引用，用于解决闭包问题
  const currentLocationRef = useRef(currentLocation);

  // 游戏初始化时的第一天日志和 BOSS 刷新
  useEffect(() => {
    // 防止 React StrictMode 导致的重复执行
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    // 显示第一天的日志
    setInteractionLog(logs => [...logs, '新的一天开始了！现在是第1天']);

    // 第一天随机刷新 BOSS
    const bossSpawnResults = rollBossSpawns();
    const newSpawnedBossIds = bossSpawnResults.map(result => result.interactableId);
    setSpawnedBosses(new Set(newSpawnedBossIds));

    // 将 BOSS 刷新消息添加到交互日志
    if (bossSpawnResults.length > 0) {
      const bossMessages = bossSpawnResults.map(result => result.message);
      setInteractionLog(logs => [...logs, ...bossMessages]);
    }
  }, []); // 空依赖数组，只在组件挂载时执行一次

  useEffect(() => {
    currentLocationRef.current = currentLocation;
  }, [currentLocation]);

  // 自动移动队列处理
  useEffect(() => {
    if (!isAutoMoving || moveQueue.length === 0) return;

    // 移动到队列中的第一个地点
    const [nextLocation, ...remainingQueue] = moveQueue;

    // 设置定时器，模拟移动延迟
    const timer = setTimeout(() => {
      handleMove(nextLocation);
      setMoveQueue(remainingQueue);

      // 如果队列已空，停止自动移动
      if (remainingQueue.length === 0) {
        setIsAutoMoving(false);
      }
    }, 200); // 每次移动间隔200毫秒

    return () => clearTimeout(timer);
  }, [isAutoMoving, moveQueue]);

  // 处理移动
  const handleMove = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    if (location) {
      setCurrentLocation(locationId);
      setInteractionLog(prev => [...prev, `你移动到了${location.name}`]);
    }
  };

  // 处理自动移动
  const handleAutoMove = useCallback((targetLocationId: string) => {
    const path = findPath(currentLocation, targetLocationId);
    if (path.length > 1) {
      // 移除起点，只保留需要移动的地点
      const movePath = path.slice(1);
      setMoveQueue(movePath);
      setIsAutoMoving(true);
      // 收起菜单
      setMenuOpen(false);
    }
  }, [currentLocation]);

  /**
   * 消耗时间单位
   * 增加已用时间单位，如果超过一天上限则进入下一天
   * @param units 消耗的时间单位数量
   */
  const consumeTime = useCallback((units: number) => {
    setTimeSystem(prev => {
      const newNowtime = prev.nowtime + units;

      // 如果超过一天的时间上限，进入下一天
      if (newNowtime >= prev.onedaytime) {
        return {
          ...prev,
          nowtime: 0,
          nowday: prev.nowday + 1
        };
      }

      return {
        ...prev,
        nowtime: newNowtime
      };
    });
  }, []);

  // 监听天数变化，处理新的一天的逻辑
  useEffect(() => {
    // 只有当天数发生变化时才执行
    if (timeSystem.nowday !== prevDayRef.current) {
      // 更新追踪的天数
      prevDayRef.current = timeSystem.nowday;

      // 添加新的一天提示到交互日志
      setInteractionLog(logs => [...logs, `新的一天开始了！现在是第${timeSystem.nowday}天`]);

      // 新的一天恢复HP和体力到最大值
      setCharacter(prev => ({
        ...prev,
        currentHp: prev.maxHp,
        currentStamina: prev.maxStamina,
      }));

      // 新的一天刷新所有怪物
      setKilledMonsters(new Set());

      // 新的一天随机刷新 BOSS
      const bossSpawnResults = rollBossSpawns();
      const newSpawnedBossIds = bossSpawnResults.map(result => result.interactableId);
      setSpawnedBosses(new Set(newSpawnedBossIds));

      // 将 BOSS 刷新消息添加到交互日志
      if (bossSpawnResults.length > 0) {
        const bossMessages = bossSpawnResults.map(result => result.message);
        setInteractionLog(logs => [...logs, ...bossMessages]);
      }
    }
  }, [timeSystem.nowday]);

  /**
   * 挖矿逻辑
   * 挖到金矿概率30%，银矿概率70%，品质1-10概率相等
   * 消耗1个时间单位
   * @param miningName 挖矿类型名称
   */
  const handleMining = (miningName: string) => {
    // 消耗1个时间单位
    consumeTime(1);

    // 决定矿石类型：30%金矿，70%银矿
    const isGold = Math.random() < 0.3;
    // 决定品质：1-10概率相等
    const quality = Math.floor(Math.random() * 10) + 1;

    // 查找对应的矿石物品
    const oreId = isGold ? `gold-ore-${quality}` : `silver-ore-${quality}`;
    const oreItem = inventory.find(item => item.id === oreId);

    if (oreItem) {
      // 添加矿石到背包
      setInventory(prev => {
        const newInventory = [...prev];
        const existingItem = newInventory.find(item => item.id === oreId);
        if (existingItem) {
          existingItem.quantity++;
        } else {
          newInventory.push({
            ...oreItem,
            quantity: 1
          });
        }

        return newInventory;
      });
    }

    // 记录到交互日志
    const oreName = isGold ? `金矿(品质${quality})` : `银矿(品质${quality})`;
    setInteractionLog(prev => [...prev, `在${miningName}挖到了${oreName}！`]);
  };

  /**
   * 处理动作类交互
   * @param interactable 动作交互数据
   */
  const handleActionInteract = (interactable: Interactable) => {
    if (interactable.type === 'action') {
      // 根据动作类型执行对应逻辑
      switch (interactable.actionType) {
        case 'mining':
          handleMining(interactable.name);
          break;
        // 可扩展其他动作类型
        default:
          setInteractionLog(prev => [...prev, `执行了${interactable.name}`]);
      }
    }
  };

  /**
   * 处理敌人类交互
   * @param interactable 敌人交互数据
   */
  const handleEnemyInteract = (interactable: EnemyInteractable) => {
    setCurrentEnemyData(interactable);
    setShowEnemyModal(true);
  };

  /**
   * 处理NPC类交互
   * @param interactable NPC交互数据
   */
  const handleNPCInteract = (interactable: NPCInteractable) => {
    setCurrentNPCData(interactable);
    setShowNPCModal(true);
  };

  /**
   * 处理交互按钮点击
   * 根据交互类型分发到不同的处理函数
   * @param interactable 交互对象
   */
  const handleInteract = (interactable: Interactable) => {
    switch (interactable.type) {
      case 'action':
        handleActionInteract(interactable);
        break;
      case 'enemy':
        handleEnemyInteract(interactable);
        break;
      case 'npc':
        handleNPCInteract(interactable);
        break;
    }
  };

  /**
   * 处理NPC选项选择
   * 根据选项的 actionType 调用相应的功能函数
   * @param result 选项结果文本
   * @param actionType 动作类型
   * @param actionParams 动作参数
   */
  const handleNPCOptionSelect = (
    result: string,
    actionType?: string,
    actionParams?: Record<string, unknown>
  ) => {
    // 如果没有 actionType，只显示结果文本
    if (!actionType) {
      setInteractionLog(prev => [...prev, result]);

      return;
    }

    // 根据动作类型调用相应的功能函数
    switch (actionType) {
      // ========== 国王 NPC 功能 ==========
      case 'viewEnemyInfo':
        // 查看魔族大军情报
        if (actionParams?.enemyType) {
          const demonId = actionParams.enemyType as string;
          const dialogue = getDemonArmyDialogue(demonId);
          setInteractionLog(prev => [...prev, dialogue]);
        }
        break;

      // ========== 公主 NPC 功能 ==========
      case 'chat':
        // 与公主聊天
        const chatResult = performChat(princessRelationship, false); // TODO: 添加是否已救国王的状态
        if (chatResult.success) {
          // 更新公主关系状态
          setPrincessRelationship(prev => ({
            ...prev,
            intimacy: chatResult.newIntimacy,
            level: chatResult.newLevel as any, // 类型转换为 RelationshipLevel
            relationshipName: chatResult.dialogue,
            canChatToday: false,
          }));
          setInteractionLog(prev => [...prev, chatResult.message]);
        } else {
          setInteractionLog(prev => [...prev, chatResult.message]);
        }
        break;

      case 'sendGift':
        // 送礼给公主
        if (actionParams?.giftType) {
          const giftType = actionParams.giftType as '99朵白玫瑰' | '999朵白玫瑰';
          const isSunday = new Date().getDay() === 0; // 判断是否是周日
          const giftResult = performGift(princessRelationship, giftType, 1, isSunday);

          if (giftResult.success) {
            // 更新公主关系状态
            setPrincessRelationship(prev => ({
              ...prev,
              intimacy: prev.intimacy + giftResult.intimacyGain,
              canGiftToday: false,
            }));
            setInteractionLog(prev => [...prev, giftResult.message]);
          } else {
            setInteractionLog(prev => [...prev, giftResult.message]);
          }
        }
        break;

      case 'receiveWeeklyGift':
        // 领取周日礼物
        const isSunday = new Date().getDay() === 0;
        const sundayGiftResult = receiveSundayGift(princessRelationship, isSunday, false);

        if (sundayGiftResult.success && sundayGiftResult.gift) {
          // 更新公主关系状态
          setPrincessRelationship(prev => ({
            ...prev,
            canReceiveSundayGift: false,
          }));
          setInteractionLog(prev => [...prev, sundayGiftResult.message]);
        } else {
          setInteractionLog(prev => [...prev, sundayGiftResult.message]);
        }
        break;

      case 'receiveGift':
        // 领取知己的礼物
        const confidantGiftResult = receiveConfidantGift(princessRelationship);

        if (confidantGiftResult.success && confidantGiftResult.gift) {
          // 更新公主关系状态
          setPrincessRelationship(prev => ({
            ...prev,
            hasReceivedConfidantGift: true,
          }));
          setInteractionLog(prev => [...prev, confidantGiftResult.message]);
        } else {
          setInteractionLog(prev => [...prev, confidantGiftResult.message]);
        }
        break;

      // ========== 元帅 NPC 功能 ==========
      case 'receiveSalary':
        // 领取军饷
        const weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][new Date().getDay()] as any;
        const payResult = claimMilitaryPay(militaryRank, weekday, hasClaimedMilitaryPay);

        if (payResult.success) {
          // 更新状态
          setHasClaimedMilitaryPay(true);
          setPlayerResources(prev => ({
            ...prev,
            magicStone: prev.magicStone + payResult.magicStone,
          }));
          setInteractionLog(prev => [...prev, payResult.message]);
        } else {
          setInteractionLog(prev => [...prev, payResult.message]);
        }
        break;

      case 'queryBattleExp':
        // 查询战功
        const expResult = queryBattleExp(battleExp);
        const expMessage = `当前军衔：${expResult.currentRankName}\n当前战功：${expResult.currentExp}\n${
          expResult.nextRankName
            ? `下一级军衔：${expResult.nextRankName}\n所需战功：${expResult.nextRequirement}\n晋升进度：${expResult.progress}%`
            : '已达到最高军衔！'
        }`;
        setInteractionLog(prev => [...prev, expMessage]);
        break;

      case 'queryBossInfo':
        // 查询军情（BOSS位置）
        const intelList = queryMilitaryIntel();
        const intelMessage = intelList.map(boss =>
          `【${boss.bossName}】\n位置：${boss.locationName}\n等级：${boss.level}\n战功奖励：${boss.battleExpReward}`
        ).join('\n\n');
        setInteractionLog(prev => [...prev, intelMessage]);
        break;

      case 'showHelp':
        // 显示帮助信息
        if (actionParams?.topic === 'militaryRank') {
          // 显示军衔系统说明
          const rankDesc = getMilitaryRankDescription();
          setInteractionLog(prev => [...prev, rankDesc]);
        } else if (actionParams?.topic === 'nobleRank') {
          // 显示爵位系统说明
          const nobleDesc = getNobleRankSystemDescription();
          setInteractionLog(prev => [...prev, nobleDesc]);
        } else if (actionParams?.topic === 'dailyTask') {
          // 显示日常任务说明（已在 result 中）
          setInteractionLog(prev => [...prev, result]);
        } else {
          // 其他帮助信息
          setInteractionLog(prev => [...prev, result]);
        }
        break;

      // ========== 首相 NPC 功能 ==========
      case 'openTrade':
        // 打开交易界面
        const tradeMessage = getTradeSystemMessage();
        setInteractionLog(prev => [...prev, tradeMessage]);
        break;

      case 'receiveNobleReward':
        // 领取爵位奖励
        const nobleRewardResult = claimNobleReward(nobleRank, lastNobleRewardClaimTime);

        if (nobleRewardResult.success && nobleRewardResult.reward) {
          // 更新领取时间
          setLastNobleRewardClaimTime(Date.now());
          setInteractionLog(prev => [...prev, nobleRewardResult.message]);
        } else {
          setInteractionLog(prev => [...prev, nobleRewardResult.message]);
        }
        break;

      // ========== 日常任务官 NPC 功能 ==========
      case 'acceptDailyTask':
        // 接受日常任务
        const today = new Date().getDay();
        const task = getDailyTask(today);

        if (task) {
          const taskDesc = getTaskDescription(task);
          setInteractionLog(prev => [...prev, taskDesc]);
        } else {
          setInteractionLog(prev => [...prev, '今天没有可接受的任务']);
        }
        break;

      // ========== 地图赛报名官 NPC 功能 ==========
      case 'challengeOrClaim':
        // 挑战地图或领取保护者奖励
        if (currentNPCData?.location) {
          const config = getMapChallengeConfig(currentNPCData.location);

          if (config) {
            // 检查是否满足挑战要求
            const canChallenge = checkChallengeRequirement(nobleRank, currentNPCData.location);

            if (canChallenge) {
              // 尝试领取保护者奖励
              const rewardResult = claimProtectorReward(currentNPCData.location, nobleRank);
              setInteractionLog(prev => [...prev, rewardResult.message]);
            } else {
              setInteractionLog(prev => [...prev, `需要【${config.requiredNobleRankName}】以上爵位才能挑战${config.locationName}`]);
            }
          }
        }
        break;

      case 'viewProtectorReward':
        // 查看保护者奖励
        if (currentNPCData?.location) {
          const config = getMapChallengeConfig(currentNPCData.location);

          if (config) {
            const desc = getMapChallengeDescription(config);
            setInteractionLog(prev => [...prev, desc]);
          }
        }
        break;

      // ========== 商店 NPC 功能 ==========
      case 'openShop':
        // 打开商店页面
        if (actionParams?.shopType) {
          const shopType = actionParams.shopType as 'gold' | 'magicStone';
          setCurrentShopType(shopType);
          setShowShopPage(true);
          setShowNPCModal(false); // 关闭NPC对话框
          setInteractionLog(prev => [...prev, result]);
        }
        break;

      case 'openSellMode':
        // 打开出售物品模式
        if (actionParams?.shopType) {
          const shopType = actionParams.shopType as 'gold' | 'magicStone';
          setCurrentShopType(shopType);
          setShowShopPage(true);
          setShowNPCModal(false); // 关闭NPC对话框
          // TODO: 切换到出售模式
          setInteractionLog(prev => [...prev, result]);
        }
        break;

      case 'showMessage':
        // 显示提示消息
        if (actionParams?.message) {
          setInteractionLog(prev => [...prev, actionParams.message as string]);
        } else {
          setInteractionLog(prev => [...prev, result]);
        }
        break;

      case 'close':
        // 关闭NPC对话框
        setShowNPCModal(false);
        setInteractionLog(prev => [...prev, result]);
        break;

      // ========== 装备打造师 NPC 功能 ==========
      case 'openRefine':
        // 打开装备精炼界面
        setShowRefineModal(true);
        setShowNPCModal(false); // 关闭NPC对话框
        setInteractionLog(prev => [...prev, result]);
        break;

      // ========== 收藏家 NPC 功能 ==========
      case 'openCollector':
        // 打开收藏架界面
        setShowCollectorModal(true);
        setShowNPCModal(false); // 关闭NPC对话框
        setInteractionLog(prev => [...prev, result]);
        break;

      // ========== 抽奖官 NPC 功能 ==========
      case 'teleportToLottery':
        // 传送至抽奖区
        setCurrentLocation('lottery-area');
        setShowLottery(true);
        setShowNPCModal(false); // 关闭NPC对话框
        setInteractionLog(prev => [...prev, '你被传送到了抽奖区！']);
        break;

      // ========== 默认处理 ==========
      default:
        // 未知的动作类型，只显示结果文本
        setInteractionLog(prev => [...prev, result]);
    }
  };

  /**
   * 处理购买物品
   * 扣除货币并将物品添加到背包
   * @param itemId 物品ID
   * @param quantity 购买数量
   * @param goldSpent 花费的金币
   * @param magicStoneSpent 花费的魔石
   */
  const handlePurchaseItem = (
    itemId: string,
    quantity: number,
    goldSpent: number,
    magicStoneSpent: number
  ) => {
    // 扣除货币
    if (goldSpent > 0) {
      setPlayerResources(prev => ({
        ...prev,
        gold: prev.gold - goldSpent,
      }));
    }
    if (magicStoneSpent > 0) {
      setPlayerResources(prev => ({
        ...prev,
        magicStone: prev.magicStone - magicStoneSpent,
      }));
    }

    // 获取商店物品信息
    const shopItem = getShopItemById(itemId);

    if (shopItem) {
      // 将商店物品转换为背包物品格式
      // goldValue 和 magicStoneValue 用于出售时计算价格
      const inventoryItem: InventoryItem = {
        id: itemId,
        name: shopItem.name,
        type: shopItem.type,
        description: shopItem.description,
        icon: shopItem.icon,
        imagePath: shopItem.imagePath,
        quantity: quantity,
        goldValue: shopItem.priceGold, // 金币价值（用于出售）
        magicStoneValue: shopItem.priceMagicStone, // 魔石价值（用于出售）
        stackable: shopItem.stackable,
        maxStack: shopItem.maxStack,
      };

      // 添加物品到背包
      setInventory(prev => {
        // 检查是否已有相同物品（可堆叠物品）
        // 判断是否可堆叠：stackable 为 true 或 maxStack > 1
        const existingItemIndex = prev.findIndex(item => {
          if (item.id !== itemId) return false;
          // 检查是否可堆叠：优先检查 stackable，否则检查 maxStack
          const isStackable = item.stackable === true || (item.maxStack && item.maxStack > 1);

          return isStackable;
        });

        // 判断商店物品是否可堆叠
        const isShopItemStackable = shopItem.stackable === true || (shopItem.maxStack && shopItem.maxStack > 1);

        if (existingItemIndex !== -1 && isShopItemStackable) {
          // 已有相同物品，增加数量
          const newInventory = [...prev];
          newInventory[existingItemIndex] = {
            ...newInventory[existingItemIndex],
            quantity: newInventory[existingItemIndex].quantity + quantity,
          };

          return newInventory;
        } else {
          // 新物品，添加到背包
          return [...prev, inventoryItem];
        }
      });

      setInteractionLog(prev => [...prev, `购买成功：${shopItem.name} × ${quantity}`]);
    } else {
      setInteractionLog(prev => [...prev, `购买成功：${itemId} × ${quantity}`]);
    }
  };

  /**
   * 处理出售物品
   * 增加金币/魔石并从背包移除物品
   * @param itemId 物品ID
   * @param quantity 出售数量
   * @param goldEarned 获得的金币
   * @param magicStoneEarned 获得的魔石
   */
  const handleSellItem = (
    itemId: string,
    quantity: number,
    goldEarned: number,
    magicStoneEarned: number = 0
  ) => {
    // 增加金币
    if (goldEarned > 0) {
      setPlayerResources(prev => ({
        ...prev,
        gold: prev.gold + goldEarned,
      }));
    }

    // 增加魔石
    if (magicStoneEarned > 0) {
      setPlayerResources(prev => ({
        ...prev,
        magicStone: prev.magicStone + magicStoneEarned,
      }));
    }

    // 从背包移除物品
    setInventory(prev => {
      const itemIndex = prev.findIndex(item => item.id === itemId);
      if (itemIndex === -1) return prev;

      const item = prev[itemIndex];
      const newInventory = [...prev];

      if (item.quantity > quantity) {
        // 物品数量大于出售数量，减少数量
        newInventory[itemIndex] = {
          ...item,
          quantity: item.quantity - quantity,
        };
      } else {
        // 物品数量等于或小于出售数量，移除物品
        newInventory.splice(itemIndex, 1);
      }

      return newInventory;
    });

    // 构建日志消息
    let logMessage = `出售成功：${itemId} × ${quantity}`;
    if (goldEarned > 0 && magicStoneEarned > 0) {
      logMessage += `，获得 ${goldEarned} 金币和 ${magicStoneEarned} 魔石`;
    } else if (goldEarned > 0) {
      logMessage += `，获得 ${goldEarned} 金币`;
    } else if (magicStoneEarned > 0) {
      logMessage += `，获得 ${magicStoneEarned} 魔石`;
    }

    setInteractionLog(prev => [...prev, logMessage]);
  };

  /**
   * 开始战斗
   * 从敌人交互数据中提取战斗参数
   */
  const handleStartBattle = () => {
    if (currentEnemyData && currentEnemyData.enemies.length > 0) {
      // 保存当前交互ID（用于战斗胜利后从地图移除）
      setCurrentBattleInteractableId(currentEnemyData.id);

      // 直接使用敌人数据列表
      const enemiesData = currentEnemyData.enemies;

      // 敌人数量
      const enemyCount = enemiesData.length;

      // 根据敌人属性估算等级（用于兼容旧逻辑）
      const firstEnemy = enemiesData[0];
      const estimatedLevel = Math.max(1, Math.floor(firstEnemy.maxHp / 100));

      // 根据敌人名称判断模板类型（用于兼容旧逻辑）
      let templateId = 'soldier'; // 默认小兵
      if (firstEnemy.name.includes('BOSS') || firstEnemy.name.includes('boss')) {
        templateId = 'boss';
      } else if (firstEnemy.name.includes('精英') || firstEnemy.attack > 15) {
        templateId = 'elite';
      }

      setBattleParams({
        enemyTemplateId: templateId,
        enemyLevel: estimatedLevel,
        enemyCount: enemyCount,
        enemiesData: enemiesData // 传递敌人数据列表
      });

      setInBattle(true);
      setShowEnemyModal(false);
    }
  };

  /**
   * 检查并处理角色升级
   * 当经验值达到上限时，升级并恢复HP/MP
   * @param currentExp 当前经验值
   * @param maxExp 升级所需经验值
   * @param currentLevel 当前等级
   * @returns 升级后的数据
   */
  const checkAndLevelUp = useCallback((
    currentExp: number,
    maxExp: number,
    currentLevel: number
  ): { newExp: number; newMaxExp: number; newLevel: number; leveledUp: boolean } => {
    let exp = currentExp;
    let level = currentLevel;
    let currentMaxExp = maxExp;
    let leveledUp = false;

    // 检查是否可以升级（经验值溢出）
    while (exp >= currentMaxExp && level < 125) { // 最高等级125
      exp -= currentMaxExp;
      level++;
      leveledUp = true;

      // 计算下一级所需经验（使用参考代码的逻辑）
      currentMaxExp = calculateNextLevelMaxExp(level - 1, currentMaxExp);
    }

    return { newExp: exp, newMaxExp: currentMaxExp, newLevel: level, leveledUp };
  }, []);

  /**
   * 战斗结束处理
   * 消耗3个时间单位，胜利时获得战利品和经验
   * 同步玩家和幻兽的战斗后状态（HP、MP、体力等）
   * @param result 战斗结果
   * @param finalPlayerState 战斗结束时的玩家状态（包含HP、MP、体力等）
   * @param finalDeployedPets 战斗结束时的幻兽状态列表（包含petId和currentHp）
   */
  const handleBattleEnd = (result: BattleResult, finalPlayerState?: BattleCharacter, finalDeployedPets?: BattlePet[]) => {
    setInBattle(false);
    setBattleParams(null); // 清空战斗参数

    // 消耗3个时间单位
    consumeTime(3);

    // ========== 玩家状态同步 ==========
    // 保存战斗结束后的HP/MP状态（无论胜负都保存）
    if (finalPlayerState) {
      setCharacter(prev => ({
        ...prev,
        currentHp: Math.max(1, finalPlayerState.currentHp), // 至少保留1点HP
        currentStamina: finalPlayerState.currentStamina,
      }));
    }

    // ========== 幻兽状态同步 ==========
    // 将战斗后的幻兽血量同步回幻兽数据
    // 遍历战斗结束时的幻兽列表，根据 petId 找到对应的幻兽并更新血量
    if (finalDeployedPets && finalDeployedPets.length > 0) {
      setPets(prevPets => {
        return prevPets.map(pet => {
          // 在战斗结束的幻兽列表中查找对应的幻兽（通过 petId 匹配）
          const battlePet = finalDeployedPets.find(bp => bp.petId === pet.id);

          if (battlePet) {
            // 找到对应的幻兽，同步战斗后的血量
            // 注意：幻兽血量不能为负数，最小为0
            const newCurrentHp = Math.max(0, battlePet.currentHp);

            // 返回更新后的幻兽数据
            // 如果幻兽在战斗中阵亡（currentHp <= 0），血量会被设为0
            // 下次战斗开始时，幻兽会以满血状态出战（由战斗初始化逻辑处理）
            return {
              ...pet,
              hp: newCurrentHp, // 更新幻兽的当前血量
            };
          }

          // 未找到对应的战斗幻兽，保持原状态不变
          return pet;
        });
      });
    }

    // 如果战斗胜利，处理战利品和经验
    if (result === 'player_win' && currentBattleInteractableId) {
      // 将怪物添加到击杀列表
      setKilledMonsters(prev => new Set(prev).add(currentBattleInteractableId));

      // 计算战利品
      if (battleParams?.enemiesData && battleParams.enemiesData.length > 0) {
        // 计算所有敌人的战利品
        const lootResults = battleParams.enemiesData.map(enemy => {
          // 根据敌人名称判断是否为BOSS
          const isBoss = enemy.name.includes('BOSS') || enemy.name.includes('boss');

          // 使用敌人生命值作为经验值（参考文档：经验值 = 怪物最大生命值）
          return calculateLoot(
            Math.floor(enemy.maxHp / 100), // 估算等级
            enemy.maxHp,
            isBoss,
            character.luck // 使用角色的幸运值
          );
        });

        // 合并战利品
        const totalLoot = mergeLootResults(lootResults);

        // 添加金币到玩家资源
        if (totalLoot.gold > 0) {
          setPlayerResources(prev => ({
            ...prev,
            gold: prev.gold + totalLoot.gold
          }));
        }

        // 添加物品到背包（支持堆叠）
        if (totalLoot.items.length > 0) {
          setInventory(prev => {
            const newInventory = [...prev];

            // 遍历所有战利品物品
            for (const lootItem of totalLoot.items) {
              // 查找背包中是否已有相同ID的可堆叠物品
              const existingIndex = newInventory.findIndex(item =>
                item.id === lootItem.id &&
                (item.stackable === true || (item.maxStack && item.maxStack > 1))
              );

              if (existingIndex !== -1) {
                // 已存在，增加数量
                newInventory[existingIndex] = {
                  ...newInventory[existingIndex],
                  quantity: newInventory[existingIndex].quantity + lootItem.quantity,
                };
              } else {
                // 不存在，添加新物品
                newInventory.push(lootItem);
              }
            }

            return newInventory;
          });
        }

        // 增加经验值并检查升级
        setCharacter(prev => {
          const newExp = prev.exp + totalLoot.experience;
          const { newExp: finalExp, newMaxExp, newLevel, leveledUp } = checkAndLevelUp(
            newExp,
            prev.maxExp,
            prev.level
          );

          // 如果升级了，恢复HP和MP到最大值，并更新属性
          if (leveledUp) {
            const baseAttrs = calculateCharacterBaseAttributes(newLevel);

            // 添加升级提示到交互日志
            setInteractionLog(logs => [...logs, `🎉 恭喜升级！等级提升到 ${newLevel} 级！`]);

            return {
              ...prev,
              level: newLevel,
              exp: finalExp,
              maxExp: newMaxExp,
              maxHp: baseAttrs.maxHp,
              currentHp: baseAttrs.maxHp, // 升级恢复HP
              maxStamina: baseAttrs.maxStamina,
              currentStamina: baseAttrs.maxStamina, // 升级恢复体力
              attackMin: baseAttrs.attackMin,
              attackMax: baseAttrs.attackMax,
              defense: baseAttrs.defense,
            };
          }

          return {
            ...prev,
            exp: finalExp,
            maxExp: newMaxExp,
          };
        });

        // 添加战利品消息到交互日志
        const lootMessages = [
          '战斗胜利！你击败了所有敌人。',
          `获得金币: ${totalLoot.gold}`,
          `获得经验: ${totalLoot.experience}`,
          ...totalLoot.messages.filter(msg => !msg.includes('获得金币') && !msg.includes('获得经验'))
        ];
        setInteractionLog(prev => [...prev, ...lootMessages]);
      } else {
        setInteractionLog(prev => [...prev, '战斗胜利！你击败了所有敌人。']);
      }
    } else {
      // 战斗失败
      setInteractionLog(prev => [...prev, '战斗失败...下次再来挑战吧。']);
    }

    // 清空当前战斗交互ID
    setCurrentBattleInteractableId(null);
  };

  /**
   * 离开战斗处理
   * 玩家主动离开战斗，消耗3个时间单位，不获得任何奖励
   */
  const handleLeaveBattle = useCallback(() => {
    setInBattle(false);
    setBattleParams(null);
    setCurrentBattleInteractableId(null);

    // 消耗3个时间单位（与正常战斗结束相同）
    consumeTime(3);

    // 添加离开战斗消息到交互日志
    setInteractionLog(prev => [...prev, '你离开了战斗。']);
  }, [consumeTime]);

  /**
   * 获取出战幻兽列表
   * 筛选出 isDeployed 为 true 的幻兽
   */
  const getDeployedPets = (): Pet[] => {
    return pets.filter(pet => pet.isDeployed);
  };

  /**
   * 召回幻兽
   * 将幻兽从出战状态切换为休息状态
   * @param petId 要召回的幻兽ID
   */
  const handleRecallPet = (petId: string) => {
    setPets(prev => prev.map(pet =>
      pet.id === petId
        ? { ...pet, isDeployed: false, isMerged: false }
        : pet
    ));
  };

  /**
   * 合体幻兽
   * 将幻兽设置为合体状态（必须先处于出战状态）
   * @param petId 要合体的幻兽ID
   */
  const handleMergePet = (petId: string) => {
    setPets(prev => prev.map(pet =>
      pet.id === petId
        ? { ...pet, isMerged: true }
        : pet
    ));
  };

  /**
   * 解体幻兽
   * 取消幻兽的合体状态
   * @param petId 要解体的幻兽ID
   */
  const handleUnmergePet = (petId: string) => {
    setPets(prev => prev.map(pet =>
      pet.id === petId
        ? { ...pet, isMerged: false }
        : pet
    ));
  };

  /**
   * 出战幻兽
   * 将幻兽设置为出战状态
   * 最多同时出战2只幻兽
   * @param petId 要出战的幻兽ID
   */
  const handleDeployPet = (petId: string) => {
    // 检查当前出战数量
    const currentDeployedCount = pets.filter(p => p.isDeployed).length;
    if (currentDeployedCount >= 2) {
      return; // 已满2只，不能再出战
    }

    setPets(prev => prev.map(pet =>
      pet.id === petId
        ? { ...pet, isDeployed: true }
        : pet
    ));
  };

  /**
   * 装备物品
   * 从背包中移除物品，放入对应装备槽位
   * @param item 要装备的物品
   */
  const handleEquipItem = (item: EquipmentItem) => {
    // 检查物品类型是否为装备
    if (item.type !== 'equipment') return;

    // 获取目标槽位
    const slotType = item.equipmentType;

    // 检查槽位是否已有装备
    const currentEquipment = equippedItems[slotType];

    // 如果槽位已有装备，先卸下
    if (currentEquipment) {
      // 将当前装备转换为背包物品并添加回背包
      const inventoryItem = equipmentDetailToItem(currentEquipment);
      setInventory(prev => [...prev, inventoryItem]);
    }

    // 将新装备转换为 EquipmentDetail 并放入槽位
    const equipmentDetail = equipmentItemToDetail(item);
    setEquippedItems(prev => ({
      ...prev,
      [slotType]: equipmentDetail
    }));

    // 从背包中移除该物品
    setInventory(prev => {
      const itemIndex = prev.findIndex(i => i.id === item.id);
      if (itemIndex === -1) return prev;

      const newInventory = [...prev];
      if (newInventory[itemIndex].quantity > 1) {
        newInventory[itemIndex] = {
          ...newInventory[itemIndex],
          quantity: newInventory[itemIndex].quantity - 1
        };
      } else {
        newInventory.splice(itemIndex, 1);
      }

      return newInventory;
    });

    // 记录到交互日志
    setInteractionLog(prev => [...prev, `装备了${item.equipmentQuality}${item.name}`]);
  };

  /**
   * 卸下装备
   * 从装备槽位移除装备，放回背包
   * @param slotType 要卸下的装备槽位类型
   */
  const handleUnequipItem = (slotType: EquipmentSlotType) => {
    const equipment = equippedItems[slotType];
    if (!equipment) return;

    // 将装备转换为背包物品
    const inventoryItem = equipmentDetailToItem(equipment);

    // 添加回背包
    setInventory(prev => [...prev, inventoryItem]);

    // 清空槽位
    setEquippedItems(prev => ({
      ...prev,
      [slotType]: null
    }));

    // 记录到交互日志
    setInteractionLog(prev => [...prev, `卸下了${equipment.quality}${equipment.name}`]);
  };

  /**
   * 处理技能升级
   * @param skillId 要升级的技能ID
   */
  const handleUpgradeSkill = useCallback((skillId: string) => {
    setSkills(prevSkills => {
      return prevSkills.map(skill => {
        if (skill.id !== skillId) return skill;

        // 检查是否可以升级
        if (skill.level >= skill.maxLevel) return skill;

        // 获取升级消耗
        const upgradeCost = getSkillUpgradeCost(skill);

        // 检查金币是否足够（这里暂时不扣除金币，后续集成金币系统）
        // TODO: 集成金币系统后添加金币扣除逻辑

        // 升级技能
        const newLevel = skill.level + 1;

        // 记录到交互日志
        setInteractionLog(logs => [...logs, `技能${skill.name}升级到Lv.${newLevel}！消耗${upgradeCost}金币`]);

        return {
          ...skill,
          level: newLevel,
          isLearned: true
        };
      });
    });
  }, []);

  /**
   * 获取背包中的所有装备物品
   */
  const inventoryEquipments = useMemo(() => {
    return inventory.filter((item): item is EquipmentItem =>
      item.type === 'equipment'
    );
  }, [inventory]);

  /**
   * 获取背包中的所有宝石物品
   */
  const inventoryGems = useMemo(() => {
    return inventory.filter((item): item is GemItem =>
      item.type === 'gem'
    );
  }, [inventory]);

  /**
   * 处理装备精炼
   * @param result 精炼结果
   */
  const handleRefine = (result: RefineResult) => {
    // 记录到交互日志
    setInteractionLog(prev => [...prev, result.message]);

    // 如果精炼成功，更新装备属性（这里需要根据实际精炼逻辑实现）
    if (result.success && refineEquipment) {
      // TODO: 实现装备属性更新逻辑
      // 例如：更新装备的魔魂等级、品质等
    }

    // 清空选择的装备和宝石
    setRefineEquipment(null);
    setRefineGem(null);
  };

  /**
   * 添加物品到背包
   * 根据物品类型处理不同类型的物品添加逻辑
   * @param item 要添加的物品
   */
  const handleAddItem = useCallback((item: InventoryItem) => {
    setInventory(prev => {
      // 检查是否已有相同物品（可堆叠物品）
      const isStackable = item.stackable === true || (item.maxStack && item.maxStack > 1);
      const existingItemIndex = prev.findIndex(existing =>
        existing.id === item.id && isStackable
      );

      if (existingItemIndex !== -1 && isStackable) {
        // 已有相同物品，增加数量
        const newInventory = [...prev];
        newInventory[existingItemIndex] = {
          ...newInventory[existingItemIndex],
          quantity: newInventory[existingItemIndex].quantity + item.quantity,
        };

        return newInventory;
      } else {
        // 新物品，添加到背包
        return [...prev, item];
      }
    });

    // 显示添加成功的提示
    const itemTypeName = getItemTypeName(item.type);
    setInteractionLog(prev => [...prev, `获得${itemTypeName}：${item.name} × ${item.quantity}`]);
  }, []);

  /**
   * 使用物品
   * 根据物品类型显示目标选择弹窗或直接使用
   * @param item 要使用的物品
   */
  const handleUseItem = useCallback((item: InventoryItem) => {
    // 检查是否是满经验球
    if (item.name === '满经验球') {
      setCurrentUseItem(item);
      setShowUseItemTargetModal(true);
    } else {
      // 其他可使用物品的处理逻辑
      setInteractionLog(prev => [...prev, `使用了 ${item.name}`]);

      // 减少物品数量
      setInventory(prev => {
        const index = prev.findIndex(i => i.id === item.id);
        if (index !== -1) {
          const newInventory = [...prev];
          if (newInventory[index].quantity > 1) {
            newInventory[index] = {
              ...newInventory[index],
              quantity: newInventory[index].quantity - 1,
            };
          } else {
            newInventory.splice(index, 1);
          }

          return newInventory;
        }

        return prev;
      });
    }
  }, []);

  /**
   * 对玩家使用满经验球
   */
  const handleUseItemOnPlayer = useCallback(() => {
    if (!currentUseItem) return;

    // 增加玩家经验 2700
    setCharacter(prev => {
      const newExp = prev.exp + 2700;
      const { newExp: finalExp, newMaxExp, newLevel, leveledUp } = checkAndLevelUp(
        newExp,
        prev.maxExp,
        prev.level
      );

      // 如果升级了，恢复HP和MP到最大值，并更新属性
      if (leveledUp) {
        const baseAttrs = calculateCharacterBaseAttributes(newLevel);

        // 添加升级提示到交互日志
        setInteractionLog(logs => [...logs, `🎉 恭喜升级！等级提升到 ${newLevel} 级！`]);

        return {
          ...prev,
          level: newLevel,
          exp: finalExp,
          maxExp: newMaxExp,
          maxHp: baseAttrs.maxHp,
          currentHp: baseAttrs.maxHp, // 升级恢复HP
          maxStamina: baseAttrs.maxStamina,
          currentStamina: baseAttrs.maxStamina, // 升级恢复体力
          attackMin: baseAttrs.attackMin,
          attackMax: baseAttrs.attackMax,
          defense: baseAttrs.defense,
        };
      }

      return {
        ...prev,
        exp: finalExp,
        maxExp: newMaxExp,
      };
    });

    // 减少物品数量
    setInventory(prev => {
      const index = prev.findIndex(i => i.id === currentUseItem.id);
      if (index !== -1) {
        const newInventory = [...prev];
        if (newInventory[index].quantity > 1) {
          newInventory[index] = {
            ...newInventory[index],
            quantity: newInventory[index].quantity - 1,
          };
        } else {
          newInventory.splice(index, 1);
        }

        return newInventory;
      }

      return prev;
    });

    setInteractionLog(prev => [...prev, `对玩家使用了 ${currentUseItem.name}，获得 2700 经验值`]);
    setShowUseItemTargetModal(false);
    setCurrentUseItem(null);
  }, [currentUseItem]);

  /**
   * 对幻兽使用满经验球
   */
  const handleUseItemOnPet = useCallback((petId: string) => {
    if (!currentUseItem) return;

    // 增加幻兽经验 27000
    setPets(prev => prev.map(pet => {
      if (pet.id === petId) {
        const newExp = pet.jy + 27000;
        let newLevel = pet.dj;
        let newMaxExp = pet.mjy;
        let finalExp = newExp;

        // 检查是否升级
        while (finalExp >= newMaxExp && newLevel < 130) {
          finalExp -= newMaxExp;
          newLevel++;
          newMaxExp = Math.floor(100 * Math.pow(1.2, newLevel - 1));
        }

        return {
          ...pet,
          jy: finalExp,
          dj: newLevel,
          mjy: newMaxExp,
        };
      }

      return pet;
    }));

    // 减少物品数量
    setInventory(prev => {
      const index = prev.findIndex(i => i.id === currentUseItem.id);
      if (index !== -1) {
        const newInventory = [...prev];
        if (newInventory[index].quantity > 1) {
          newInventory[index] = {
            ...newInventory[index],
            quantity: newInventory[index].quantity - 1,
          };
        } else {
          newInventory.splice(index, 1);
        }

        return newInventory;
      }

      return prev;
    });

    const pet = pets.find(p => p.id === petId);
    setInteractionLog(prev => [...prev, `对幻兽 ${pet?.othername} 使用了 ${currentUseItem.name}，获得 27000 经验值`]);
    setShowUseItemTargetModal(false);
    setCurrentUseItem(null);
  }, [currentUseItem, pets]);

  /**
   * 添加幻兽到幻兽栏
   * @param pet 要添加的幻兽
   */
  const handleAddPet = useCallback((pet: Pet) => {
    setPets(prev => [...prev, pet]);

    // 显示添加成功的提示
    setInteractionLog(prev => [...prev, `获得幻兽：${pet.othername}（${pet.hs_name}）品质：${pet.quality}`]);
  }, []);

  /**
   * 消耗时间
   * 复用已有的 consumeTime 函数
   * @param amount 消耗的时间单位数量
   */
  const handleConsumeTime = useCallback((amount: number) => {
    consumeTime(amount);
  }, [consumeTime]);

  /**
   * 获取物品类型的中文名称
   * @param type 物品类型
   * @returns 中文名称
   */
  const getItemTypeName = (type: string): string => {
    const typeNames: Record<string, string> = {
      'equipment': '装备',
      'consumable': '消耗品',
      'material': '材料',
      'gem': '宝石',
      'skillBook': '技能书',
      'quest': '任务物品',
      'special': '特殊物品',
      'other': '物品',
    };

    return typeNames[type] || '物品';
  };

  // 获取当前位置数据
  const currentLoc = locations.find(loc => loc.id === currentLocation);

  // 生成 BOSS 交互对象
  const bossInteractables = useMemo(() => {
    return generateBossInteractables(Array.from(spawnedBosses));
  }, [spawnedBosses]);

  // 获取当前位置的交互对象列表（过滤掉已击杀的怪物，添加已刷新的 BOSS）
  const currentInteractables = useMemo(() => {
    // 获取静态交互对象（怪物、NPC等）
    const staticInteractables = currentLoc?.interactables
      ?.map(id => interactableConfig[id])
      .filter(interactable => interactable && !killedMonsters.has(interactable.id)) || [];

    // 获取当前地图的 BOSS 交互对象（过滤掉已击杀的 BOSS）
    const locationBossInteractables: (EnemyInteractable | undefined)[] = [];
    for (const interactableId of spawnedBosses) {
      // 过滤掉已击杀的 BOSS
      if (killedMonsters.has(interactableId)) continue;

      // 获取刷新配置
      const spawnConfig = bossSpawnConfigs.find(c => c.interactableId === interactableId);
      if (!spawnConfig) continue;

      // 获取 BOSS 模板
      const bossTemplate = bossTemplates[spawnConfig.bossTemplateId];
      if (!bossTemplate) continue;

      // 检查 BOSS 是否属于当前地图
      if (bossTemplate.location === currentLoc?.id) {
        // 获取 BOSS 交互对象
        const bossInteract = bossInteractables[interactableId];
        if (bossInteract) {
          locationBossInteractables.push(bossInteract);
        }
      }
    }

    return [...staticInteractables, ...locationBossInteractables.filter(Boolean)] as (ActionInteractable | EnemyInteractable | NPCInteractable)[];
  }, [currentLoc, killedMonsters, bossInteractables, spawnedBosses]);

  // 计算带幻兽合体加成的角色数据
  // 同时使用最新的装备槽位数据作为 equipment 字段
  const characterWithPetBonus: CharacterData = useMemo(() => {
    const petBonus = calculatePetMergeBonus(pets);

    return {
      ...character,
      equipment: {
        weapon: equippedItems.weapon,
        helmet: equippedItems.helmet,
        clothes: equippedItems.clothes,
        shoes: equippedItems.shoes,
        bracelet: equippedItems.bracelet,
        necklace: equippedItems.necklace
      },
      petBonus
    };
  }, [pets, character, equippedItems]);

  // 构建 NPC 游戏状态对象
  const npcGameState = useMemo(() => ({
    currentWeekday: new Date().getDay(), // 当前星期（0=周日, 1=周一, ..., 6=周六）
    relationshipLevel: princessRelationship.level, // 公主关系等级
    militaryRank, // 军衔等级
    nobleRank, // 爵位等级
  }), [princessRelationship.level, militaryRank, nobleRank]);

  // 获取当前位置数据

  return (
    <div className="game-container">
      {inBattle ? (
        /* 战斗界面 */
        <Battle
          playerData={characterWithPetBonus}
          playerSkills={skills.filter(s => s.isLearned)}
          enemyTemplateId={battleParams?.enemyTemplateId || 'soldier'}
          enemyLevel={battleParams?.enemyLevel || 1}
          enemyCount={battleParams?.enemyCount || 1}
          enemiesData={battleParams?.enemiesData}
          deployedPets={getDeployedPets()}
          onBattleEnd={handleBattleEnd}
          onLeaveBattle={handleLeaveBattle}
        />
      ) : (
        /* 游戏主界面 */
        <>
          {/* 顶部位置显示 */}
          <LocationHeader
            location={currentLoc?.name || ''}
            onShowPet={() => setShowPetPage(true)}
          />

          {/* 场景描述 */}
          <SceneDescription
            description={currentLoc?.description || ''}
          />

          {/* 局部地图 */}
          <LocalMap
            currentLocation={currentLocation}
            onMove={handleMove}
            isAutoMoving={isAutoMoving}
          />

          {/* 交互按钮 */}
          <InteractionButtons
            interactables={currentInteractables}
            onInteract={handleInteract}
          />

          {/* 时间显示 */}
          <TimeDisplay
            nowday={timeSystem.nowday}
            nowtime={timeSystem.nowtime}
            onedaytime={timeSystem.onedaytime}
          />

          {/* 交互日志 */}
          <InteractionLog logs={interactionLog} />

          {/* 右下角菜单 */}
          <Menu
            isOpen={menuOpen}
            onToggle={() => setMenuOpen(!menuOpen)}
            onShowMap={() => setShowMap(true)}
            onShowCharacter={() => setShowCharacterPage(true)}
            onShowInventory={() => setShowInventoryPage(true)}
            onShowSkill={() => setShowSkillPage(true)}
          />

          {/* 大地图 */}
          <WorldMap
            isVisible={showMap}
            onClose={() => setShowMap(false)}
            currentLocation={currentLocation}
            onMove={handleAutoMove}
          />

          {/* 敌人模态窗口 */}
          {currentEnemyData && (
            <EnemyModal
              isVisible={showEnemyModal}
              onClose={() => setShowEnemyModal(false)}
              onAttack={handleStartBattle}
              enemyData={currentEnemyData}
            />
          )}

          {/* NPC模态窗口 */}
          {currentNPCData && (
            <NPCModal
              isVisible={showNPCModal}
              onClose={() => setShowNPCModal(false)}
              npcData={currentNPCData}
              onSelectOption={handleNPCOptionSelect}
              gameState={npcGameState}
            />
          )}

          {/* 角色信息页面 */}
          <CharacterPage
            isVisible={showCharacterPage}
            onClose={() => setShowCharacterPage(false)}
            character={characterWithPetBonus}
            equippedItems={equippedItems}
            inventoryEquipments={inventoryEquipments}
            pets={pets}
            onEquipItem={handleEquipItem}
            onUnequipItem={handleUnequipItem}
          />

          {/* 背包页面 */}
          <InventoryPage
            isVisible={showInventoryPage}
            items={inventory}
            resources={playerResources}
            onClose={() => setShowInventoryPage(false)}
            onUseItem={handleUseItem}
          />

          {/* 技能页面 */}
          <SkillPage
            isVisible={showSkillPage}
            skills={skills}
            onClose={() => setShowSkillPage(false)}
            onUpgradeSkill={handleUpgradeSkill}
            gold={0}
          />

          {/* 幻兽页面 */}
          <PetPage
            isVisible={showPetPage}
            onClose={() => setShowPetPage(false)}
            pets={pets}
            deployedPets={getDeployedPets()}
            onRecall={handleRecallPet}
            onMerge={handleMergePet}
            onUnmerge={handleUnmergePet}
            onDeploy={handleDeployPet}
          />

          {/* 商店页面 */}
          {showShopPage && (
            <ShopPage
              shopType={currentShopType}
              playerResources={playerResources}
              inventoryItems={inventory}
              maxSlots={1000}
              pets={pets}
              maxPetSlots={10}
              onPurchase={handlePurchaseItem}
              onSell={handleSellItem}
              onClose={() => setShowShopPage(false)}
            />
          )}

          {/* 装备精炼界面 */}
          <EquipmentRefineModal
            isVisible={showRefineModal}
            onClose={() => {
              setShowRefineModal(false);
              setRefineEquipment(null);
              setRefineGem(null);
            }}
            equipment={refineEquipment}
            gem={refineGem}
            onEquipmentChange={setRefineEquipment}
            onGemChange={setRefineGem}
            onRefine={handleRefine}
            playerLevel={character.level}
            inventoryEquipments={inventoryEquipments}
            inventoryGems={inventoryGems}
          />

          {/* 收藏架界面 */}
          <CollectorModal
            isVisible={showCollectorModal}
            onClose={() => setShowCollectorModal(false)}
            inventoryItems={inventory}
            onUpdateInventory={setInventory}
            magicStones={playerResources.magicStone}
            onUpdateMagicStones={(amount) => {
              setPlayerResources(prev => ({
                ...prev,
                magicStone: amount
              }));
            }}
          />

          {/* 使用物品目标选择弹窗 */}
          <UseItemTargetModal
            isVisible={showUseItemTargetModal}
            onClose={() => {
              setShowUseItemTargetModal(false);
              setCurrentUseItem(null);
            }}
            itemName={currentUseItem?.name || ''}
            pets={pets}
            onSelectPlayer={handleUseItemOnPlayer}
            onSelectPet={handleUseItemOnPet}
          />

          {/* 抽奖区界面 */}
          <LotteryArea
            isVisible={showLottery}
            playerResources={playerResources}
            playerLevel={character.level}
            timeSystem={timeSystem}
            interactionLog={interactionLog}
            onClose={() => setShowLottery(false)}
            onReturnToCity={() => {
              setCurrentLocation('kasanuocheng');
              setShowLottery(false);
              setInteractionLog(prev => [...prev, '你返回了卡萨诺城']);
            }}
            onAddItem={handleAddItem}
            onAddPet={handleAddPet}
            onConsumeTime={handleConsumeTime}
            onUpdateMagicStone={(amount) => {
              setPlayerResources(prev => ({
                ...prev,
                magicStone: amount
              }));
            }}
            onShowMap={() => setShowMap(true)}
            onShowCharacter={() => setShowCharacterPage(true)}
            onShowInventory={() => setShowInventoryPage(true)}
            onShowSkill={() => setShowSkillPage(true)}
          />
        </>
      )}
    </div>
  );
}

export default App;
