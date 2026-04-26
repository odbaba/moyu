import './App.css';
import './components/home/home.css';
import './components/battle/battle.css';
import './components/common/common.css';
import './components/character/character.css';
import './components/inventory/inventory.css';
import './components/cover/cover.css';
import './components/settings/settings.css';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// 导入组件 - 战斗模块
import { Battle } from './components/battle';
// 导入组件 - 角色模块
import { CharacterPage } from './components/character';
// 导入组件 - 公共模块
import { DonationModal, EnemyModal, NPCModal } from './components/common';
import CollectorModal from './components/common/CollectorModal';
import EquipmentRefineModal from './components/common/EquipmentRefineModal';
import ExperienceExchangeModal from './components/common/ExperienceExchangeModal';
import FloatingTextManager, { type FloatingTextItem } from './components/common/FloatingTextManager';
import GiftSelectModal from './components/common/GiftSelectModal';
import InfoModal from './components/common/InfoModal';
// 导入组件 - 封面页模块
import { CoverPage } from './components/cover';
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
import { getWeekday } from './components/home/TimeDisplay';
// 导入组件 - 背包模块
import InventoryPage from './components/inventory/InventoryPage';
import UseItemTargetModal from './components/inventory/UseItemTargetModal';
// 导入组件 - 抽奖模块
import { LotteryArea } from './components/lottery';
// 导入组件 - 幻兽模块
import { PetFusionModal, PetInstituteModal, PetPage } from './components/pet';
// 导入组件 - 设置模块
import { SettingsPage } from './components/settings';
// 导入组件 - 商店模块
import { ShopPage } from './components/shop';
// 导入组件 - 技能模块
import SkillPage from './components/skill/SkillPage';
import { bossSpawnConfigs, bossTemplates } from './data/bossData';
import { exampleCharacter } from './data/characterData';
// 导入数据
import { locations } from './data/gameData';
import { generateBossInteractables, generateWumingshiInteractable, interactableConfig } from './data/interactableData';
import { exampleItems } from './data/inventoryData';
import { examplePets } from './data/petData';
// 导入PK赛配置数据
import { createPKBossEnemyData, getPKMatchGroup, getPKMatchReward, isSaturday } from './data/pkMatchData';
import { getShopItemById } from './data/shopData';
import { createInitialSkills, getSkillUpgradeCost } from './data/skillData';
import type { ActionInteractable, BattleCharacter, BattlePet, BattleResult, CharacterData, DailyTaskState, EnemyData, EnemyInteractable, EquipmentDetail, EquipmentItem, EquipmentSlotType, GemItem, Interactable, InventoryItem, MapChallengeState, NPCInteractable, Pet, PetInstituteState, PlayerResources, PrincessRelationship, RefineResult, SkillDetail, TimeSystem } from './types';
import { gainCharacterExperience } from './utils/attributeCalculator';
// 导入 BOSS 工具函数
import { rollBossSpawns, rollSpecialMonsterSpawns } from './utils/bossUtils';
import { calculatePetMergeBonus, calculateTotalCombatPower } from './utils/combatPower';
// 导入日常任务状态管理工具函数
import { completeTask, createInitialDailyTaskState, resetDailyTaskState } from './utils/dailyTaskStateUtils';
import {
  calculateGemRequirement,
  calculateGemReward,
  calculatePetRewardByQuality,
  checkGemInInventory,
  consumeGemFromInventory,
  getDailyTask,
  getDailyTaskDescriptionByWeekday,
  getValidPetsForTraining,
  removePetFromList
} from './utils/dailyTaskUtils';
import { equipmentDetailToItem, equipmentItemToDetail } from './utils/equipmentConverter';
// 导入装备检测工具函数
import { canEquipEquipment, checkAllEquipmentLegendary } from './utils/equipmentUtils';
// 导入经验计算工具函数
import { calculateCombatPowerBonusExp } from './utils/experienceUtils';
// 导入宝石合成工具函数
import { consumeMaterials, getRecipeById, performSynthesis } from './utils/gemSynthesisUtils';
// 导入物品工厂工具函数
import { addItemToInventory, cloneItem, createEquipmentItem, createItemFromTemplate, ITEM_TEMPLATES, randomGemSlots } from './utils/itemFactory';
// 导入战利品工具函数
import { calculateLoot, mergeLootResults } from './utils/lootUtils';
// 导入爱的力量技能
import { checkLovePower } from './utils/lovePowerSkill';
// 导入幸运值工具函数
import { decreaseLuck, isLuckZero, LUCK_CONSTANTS } from './utils/luckUtils';
import {
  canChallengeToday,
  canClaimReward,
  checkChallengeRequirement,
  claimReward,
  createInitialMapChallengeState,
  getChallengerConfig,
  getChallengeRequirementReason,
  getMapChallengeConfig,
  getNPCDialog,
  getNPCDialogOptions,
  getProtectorRewardPreview,
  isMapProtector,
  markChallengedToday,
  resetMapChallengeDaily,
  setAsMapProtector,
} from './utils/mapChallengeUtils';
import { claimMilitaryPay, formatMilitaryIntel, gainBattleExpAndPromote, getMilitaryRankDescription, getMilitaryRankName, queryBattleExp, queryMilitaryIntel } from './utils/militaryRankUtils';
import { gainMeritAndPromote, getNextNobleRankMerit, getNobleRankName, getNobleRankSystemDescription } from './utils/nobleRankUtils';
import { findPath } from './utils/pathfinding';
// 导入幻兽生成工具函数
import { gainExperience, generatePetByType, generateStarStrangePet } from './utils/petGenerator';
// 导入幻兽研究所工具函数
import {
  consumeItemFromInventory,
  createInitialPetInstituteState,
  dailyReset,
  getInstituteInfo,
  MAX_PRODUCTION_RATE,
  PRODUCTION_TASK_EXP_REWARD,
  PRODUCTION_TASK_SOUL_KING_COST,
  weeklyReset,
} from './utils/petInstituteUtils';
// 导入 NPC 相关工具函数
import { canGiftRose, getChatDialogue, getDemonArmyDialogue, getNextRelationshipRequirement, getRelationshipName, MAX_WEEKLY_ROSE_GIFT_COUNT, performChat, receiveConfidantGift, receiveSundayGift } from './utils/princessRelationUtils';
// 导入存档系统工具函数
import type { SaveData } from './utils/saveUtils';
import { getSaveVersion, hasSaveData, loadGame, loadMusicSettings, saveGame, saveMusicSettings } from './utils/saveUtils';
// 导入技能学习工具函数
import { learnSkillFromBook } from './utils/skillLearnUtils';
// 导入背景音乐 Hook
import { useBackgroundMusic } from './utils/useBackgroundMusic';
// 导入战魂物品掉落工具函数
import { checkWarSoulDrop } from './utils/warSoulDropUtils';

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
    magicStone: 100000000, // 初始魔石
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

  // 已刷新的特殊怪物交互ID列表（每日重新随机刷新，如蜘蛛、蜘蛛王后艾达）
  const [spawnedSpecialMonsters, setSpawnedSpecialMonsters] = useState<Set<string>>(new Set());

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
    weeklyRoseGiftCount: 0, // 本周已赠送玫瑰花数量
  });

  // 丫环交易状态
  // 丫环1：每日限购高级战斗力石（每天限购1个）
  const [maid1DailyPurchaseCount, setMaid1DailyPurchaseCount] = useState(0); // 今日已购买高级战斗力石数量
  // 丫环2：一次性购买年猪（只能购买1个）
  const [hasPurchasedYearPig, setHasPurchasedYearPig] = useState(false); // 是否已购买过年猪

  // 电浆药水使用状态（每天只能使用一瓶）
  const [hasUsedDianJiangYaoShuiToday, setHasUsedDianJiangYaoShuiToday] = useState(false);

  // 浮动文字状态管理
  const [floatingTexts, setFloatingTexts] = useState<FloatingTextItem[]>([]);
  const floatingTextIdCounterRef = useRef(0);

  // 每日提示状态管理（避免重复提示）
  const [hasShownSaturdayPKTip, setHasShownSaturdayPKTip] = useState(false); // 当天是否已显示星期六PK大赛提示
  const [hasShownSundayMilitaryPayTip, setHasShownSundayMilitaryPayTip] = useState(false); // 当天是否已显示星期日军饷提示
  const [hasShownSundayPrincessGiftTip, setHasShownSundayPrincessGiftTip] = useState(false); // 当天是否已显示星期日公主礼物提示
  const [hasShownSundayPrincessFlowerTip, setHasShownSundayPrincessFlowerTip] = useState(false); // 当天是否已显示星期日公主鲜花提示

  // 军衔和战功状态
  // 注意：setMilitaryRank和setBattleExp将在战斗结束后使用
  const [militaryRank, _setMilitaryRank] = useState(0); // 军衔等级（0-11）
  const [battleExp, _setBattleExp] = useState(0); // 累计战功
  const [hasClaimedMilitaryPay, setHasClaimedMilitaryPay] = useState(false); // 本周是否已领取军饷

  // 爵位和功勋状态
  const [nobleRank, setNobleRank] = useState(0); // 爵位等级（0-6）

  // 国王消息系统状态
  // 注意：setIsKingRescued将在救出国王的任务中使用
  const [isKingRescued, _setIsKingRescued] = useState(false); // 国王是否已救出

  // 探险家解锁状态（戈壁探险家）
  // 当角色全身6件装备都是极品品质时，到达卡萨诺城会触发解锁
  const [explorerUnlocked, setExplorerUnlocked] = useState(false);

  // 神秘人触发状态（战魂封印迷宫）
  // 当玩家与神秘人NPC交互后，神秘人消失，无名氏敌人出现
  const [mysteriousPersonTriggered, setMysteriousPersonTriggered] = useState(false);

  // 封面页显示状态
  // 默认为 true，进入游戏时先显示封面页
  const [showCover, setShowCover] = useState(true);

  // 设置页面状态
  const [showSettingsPage, setShowSettingsPage] = useState(false);

  // 音乐开关状态 - 从 localStorage 加载
  const [isMusicEnabled, setIsMusicEnabled] = useState(() => {
    const saved = loadMusicSettings();

    return saved.isMusicEnabled;
  });

  // 音乐音量状态（0-100）- 从 localStorage 加载
  const [musicVolume, setMusicVolume] = useState(() => {
    const saved = loadMusicSettings();

    return saved.musicVolume;
  });

  // 当音乐设置改变时，保存到 localStorage
  useEffect(() => {
    saveMusicSettings({
      isMusicEnabled,
      musicVolume
    });
  }, [isMusicEnabled, musicVolume]);

  // ========== 背景音乐管理 ==========
  // 使用背景音乐 Hook，设置音乐文件路径和初始音量
  const { play: playBackgroundMusic, pause: pauseBackgroundMusic } = useBackgroundMusic({
    src: '/audio/19_back.mp3',
    autoPlay: false, // 不自动播放，等进入游戏后播放
    volume: musicVolume / 100, // 将 0-100 转换为 0-1
    loop: true // 循环播放
  });

  // 当封面页关闭时，开始播放背景音乐
  useEffect(() => {
    if (!showCover && isMusicEnabled) {
      playBackgroundMusic();
    }
  }, [showCover, playBackgroundMusic, isMusicEnabled]);

  // 当音乐开关状态改变时，控制音乐播放/暂停
  useEffect(() => {
    if (!showCover) {
      if (isMusicEnabled) {
        playBackgroundMusic();
      } else {
        pauseBackgroundMusic();
      }
    }
  }, [isMusicEnabled, showCover, playBackgroundMusic, pauseBackgroundMusic]);

  // 无名氏击败状态（战魂封印迷宫）
  // 当玩家击败无名氏后，获得战魂之心
  // 默认为 false，通过"继续游戏"从存档恢复
  const [wumingshiDefeated, setWumingshiDefeated] = useState(false);

  // 战魂系统开启状态
  // 当玩家击败无名氏后，战魂系统开启，可以与装备打造师讨论战魂
  // 默认为 false，通过"继续游戏"从存档恢复
  const [warSoulSystemEnabled, setWarSoulSystemEnabled] = useState(false);

  // ========== 封面页操作处理 ==========

  /**
   * 处理"开始游戏"
   * 保留存档数据，继续之前的游戏进度
   */
  const handleStartGame = useCallback(() => {
    // 关闭封面页，进入游戏主界面
    setShowCover(false);
  }, []);

  /**
   * 处理"退出游戏"
   * 刷新页面，重新开始游戏
   */
  const handleExitGame = useCallback(() => {
    // 刷新页面
    window.location.reload();
  }, []);

  /**
   * 处理"继续游戏"
   * 从存档读取所有数据，完整恢复游戏状态
   */
  const handleContinueGame = useCallback(() => {
    // 先设置 isInitializedRef，防止第一天初始化的 useEffect 执行
    isInitializedRef.current = true;
    // 从存档读取数据
    const savedData = loadGame();
    if (savedData) {
      // 恢复位置
      setCurrentLocation(savedData.currentLocation ?? 'kasanuocheng');
      // 恢复时间系统
      setTimeSystem(savedData.timeSystem ?? createInitialTimeSystem());
      // 恢复角色数据
      setCharacter(savedData.character);
      // 恢复玩家资源
      setPlayerResources(savedData.playerResources);
      // 恢复装备槽位
      setEquippedItems(savedData.equippedItems);
      // 恢复背包
      setInventory(savedData.inventory);
      // 恢复幻兽
      setPets(savedData.pets);
      // 恢复技能
      setSkills(savedData.skills);
      // 恢复军衔和战功
      _setMilitaryRank(savedData.militaryRank ?? 0);
      _setBattleExp(savedData.battleExp ?? 0);
      setHasClaimedMilitaryPay(savedData.hasClaimedMilitaryPay ?? false);
      // 恢复爵位
      setNobleRank(savedData.nobleRank ?? 0);
      // 恢复公主关系（兼容旧存档，添加 weeklyRoseGiftCount 默认值）
      setPrincessRelationship({
        ...savedData.princessRelationship,
        weeklyRoseGiftCount: savedData.princessRelationship.weeklyRoseGiftCount ?? 0,
      });
      // 恢复国王救出状态
      _setIsKingRescued(savedData.isKingRescued ?? false);
      // 恢复探险家解锁状态
      setExplorerUnlocked(savedData.explorerUnlocked ?? false);
      // 恢复神秘人触发状态
      setMysteriousPersonTriggered(savedData.mysteriousPersonTriggered ?? false);
      // 恢复无名氏击败状态
      setWumingshiDefeated(savedData.wumingshiDefeated ?? false);
      // 恢复战魂系统开启状态
      setWarSoulSystemEnabled(savedData.warSoulSystemEnabled ?? false);
      // 恢复已击杀怪物和已刷新BOSS（Array→Set）
      setKilledMonsters(new Set(savedData.killedMonsters ?? []));
      setSpawnedBosses(new Set(savedData.spawnedBosses ?? []));
      // 恢复已刷新的特殊怪物（Array→Set）
      setSpawnedSpecialMonsters(new Set(savedData.spawnedSpecialMonsters ?? []));
      // 恢复日常任务状态
      setDailyTaskState(savedData.dailyTaskState ?? createInitialDailyTaskState());
      // 恢复地图挑战状态
      setMapChallengeState(savedData.mapChallengeState ?? createInitialMapChallengeState());
      // 恢复PK赛参与状态
      setHasParticipatedPKToday(savedData.hasParticipatedPKToday ?? false);
      // 恢复丫环交易状态
      setMaid1DailyPurchaseCount(savedData.maid1DailyPurchaseCount ?? 0);
      setHasPurchasedYearPig(savedData.hasPurchasedYearPig ?? false);
      // 恢复电浆药水使用状态
      setHasUsedDianJiangYaoShuiToday(savedData.hasUsedDianJiangYaoShuiToday ?? false);
      // 恢复幻兽研究所状态
      setPetInstituteState(savedData.petInstituteState ?? createInitialPetInstituteState());
      // 更新 prevDayRef 为存档中的天数，防止继续游戏时触发每日初始化
      prevDayRef.current = savedData.timeSystem?.nowday ?? 1;
    }
    // 关闭封面页，进入游戏主界面
    setShowCover(false);
  }, []);

  // 日常任务状态
  const [_dailyTaskState, setDailyTaskState] = useState<DailyTaskState>(
    createInitialDailyTaskState()
  );

  // 地图挑战状态
  const [mapChallengeState, setMapChallengeState] = useState<MapChallengeState>(
    createInitialMapChallengeState()
  );

  // 正在挑战的地图ID（用于战斗胜利后处理）
  const [currentChallengingMap, setCurrentChallengingMap] = useState<string | null>(null);

  // PK赛状态
  // 今日是否已参加PK赛（周六开放，每天只能参加一次）
  const [hasParticipatedPKToday, setHasParticipatedPKToday] = useState(false);

  // 当前正在挑战的PK赛分组（用于战斗胜利后发放奖励）
  const [currentPKMatchGroup, setCurrentPKMatchGroup] = useState<string | null>(null);

  // 商店页面状态
  const [showShopPage, setShowShopPage] = useState(false);
  const [currentShopType, setCurrentShopType] = useState<'gold' | 'magicStone'>('gold');
  const [shopInitialMode, setShopInitialMode] = useState<'buy' | 'sell'>('buy');

  // 装备精炼界面状态
  const [showRefineModal, setShowRefineModal] = useState(false);
  const [refineEquipment, setRefineEquipment] = useState<EquipmentItem | null>(null);
  const [refineGem, setRefineGem] = useState<GemItem | null>(null);

  // 收藏架界面状态
  const [showCollectorModal, setShowCollectorModal] = useState(false);

  // 送礼选择界面状态
  const [showGiftSelectModal, setShowGiftSelectModal] = useState(false);

  // 经验交换界面状态
  const [showExperienceExchangeModal, setShowExperienceExchangeModal] = useState(false);

  // 抽奖区界面状态
  const [showLottery, setShowLottery] = useState(false);

  // 幻兽研究所状态
  const [petInstituteState, setPetInstituteState] = useState<PetInstituteState>(createInitialPetInstituteState());
  const [showPetInstituteModal, setShowPetInstituteModal] = useState(false);

  // 幻兽幻化界面状态
  const [showPetFusionModal, setShowPetFusionModal] = useState(false);

  // 信息弹窗状态
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoModalTitle, setInfoModalTitle] = useState('');
  const [infoModalContent, setInfoModalContent] = useState('');
  const [infoModalOnConfirm, setInfoModalOnConfirm] = useState<(() => void) | undefined>(undefined);
  // InfoModal 按钮文本状态
  const [infoModalConfirmText, setInfoModalConfirmText] = useState<string | undefined>(undefined);
  const [infoModalCancelText, setInfoModalCancelText] = useState<string | undefined>(undefined);

  // 捐献金币弹窗状态
  const [showDonationModal, setShowDonationModal] = useState(false);

  // 自动移动状态
  const [isAutoMoving, setIsAutoMoving] = useState(false);
  const [moveQueue, setMoveQueue] = useState<string[]>([]);

  // ========== 功勋和战功统一处理函数 ==========

  /**
   * 处理获得功勋
   * 统一处理功勋获取、爵位晋升和日志打印
   * @param amount 获得的功勋数量
   * @param source 来源描述（可选，用于日志）
   * @returns 功勋获取结果
   */
  const handleGainMerit = (amount: number, source?: string) => {
    // 调用工具函数计算结果
    const result = gainMeritAndPromote(playerResources.merit, nobleRank, amount);

    // 更新功勋
    setPlayerResources(prev => ({
      ...prev,
      merit: result.newMerit,
    }));

    // 如果晋升，更新爵位
    if (result.promoted) {
      setNobleRank(result.newNobleRank);
    }

    // 打印日志
    const logMessages: string[] = [];
    if (source) {
      logMessages.push(`${source}，获得 ${amount.toLocaleString()} 点功勋！`);
    } else {
      logMessages.push(`获得 ${amount.toLocaleString()} 点功勋！`);
    }
    if (result.promoted && result.promotedRankName) {
      logMessages.push(`🎉 恭喜你被授予 ${result.promotedRankName}！`);
    }
    setInteractionLog(prev => [...prev, ...logMessages]);

    return result;
  };

  /**
   * 处理获得战功
   * 统一处理战功获取、军衔晋升和日志打印
   * @param amount 获得的战功数量
   * @param source 来源描述（可选，用于日志）
   * @returns 战功获取结果
   */
  const handleGainBattleExp = (amount: number, source?: string) => {
    // 调用工具函数计算结果
    const result = gainBattleExpAndPromote(battleExp, militaryRank, amount);

    // 更新战功
    _setBattleExp(result.newBattleExp);

    // 如果晋升，更新军衔
    if (result.promoted) {
      _setMilitaryRank(result.newMilitaryRank);
    }

    // 打印日志
    const logMessages: string[] = [];
    if (source) {
      logMessages.push(`${source}，获得 ${amount.toLocaleString()} 点战功！`);
    } else {
      logMessages.push(`获得 ${amount.toLocaleString()} 点战功！`);
    }
    if (result.promoted && result.promotedRankName) {
      logMessages.push(`🎖️ 恭喜你荣升 ${result.promotedRankName}！`);
    }
    setInteractionLog(prev => [...prev, ...logMessages]);

    return result;
  };

  // 用于防止 React StrictMode 导致的重复初始化
  const isInitializedRef = useRef(false);

  // 用于追踪上一次的天数，检测新的一天
  const prevDayRef = useRef(1);

  // currentLocation 引用，用于解决闭包问题
  const currentLocationRef = useRef(currentLocation);

  // 用于防止提高产量任务重复执行
  const productionTaskExecutedRef = useRef(false);

  // 当战魂系统状态或无名氏击败状态或PK赛参与状态或国王救出状态变化时，不再自动保存
  // 改为手动保存（菜单中"保存游戏"按钮触发）

  /**
   * 处理"保存游戏"
   * 收集所有游戏状态并保存到 localStorage
   * @returns 是否保存成功
   */
  const handleSaveGame = useCallback((): boolean => {
    // 收集所有游戏状态，Set 类型需转为 Array 以便 JSON 序列化
    const saveData: SaveData = {
      version: getSaveVersion(),
      currentLocation,
      timeSystem,
      character,
      playerResources,
      equippedItems,
      inventory,
      pets,
      skills,
      militaryRank,
      battleExp,
      hasClaimedMilitaryPay,
      nobleRank,
      princessRelationship,
      isKingRescued,
      explorerUnlocked,
      mysteriousPersonTriggered,
      wumingshiDefeated,
      warSoulSystemEnabled,
      killedMonsters: Array.from(killedMonsters),
      spawnedBosses: Array.from(spawnedBosses),
      spawnedSpecialMonsters: Array.from(spawnedSpecialMonsters),
      dailyTaskState: _dailyTaskState,
      mapChallengeState,
      hasParticipatedPKToday,
      maid1DailyPurchaseCount,
      hasPurchasedYearPig,
      hasUsedDianJiangYaoShuiToday,
      petInstituteState,
    };
    const success = saveGame(saveData);
    // 在交互日志中显示保存结果
    if (success) {
      setInteractionLog(prev => [...prev, '💾 游戏保存成功！']);
    } else {
      setInteractionLog(prev => [...prev, '❌ 游戏保存失败！']);
    }

    return success;
  }, [
    currentLocation, timeSystem, character, playerResources, equippedItems,
    inventory, pets, skills, militaryRank, battleExp, hasClaimedMilitaryPay,
    nobleRank, princessRelationship, isKingRescued, explorerUnlocked,
    mysteriousPersonTriggered, wumingshiDefeated, warSoulSystemEnabled,
    killedMonsters, spawnedBosses, spawnedSpecialMonsters, _dailyTaskState, mapChallengeState,
    hasParticipatedPKToday, maid1DailyPurchaseCount, hasPurchasedYearPig,
    hasUsedDianJiangYaoShuiToday, petInstituteState,
  ]);

  // 游戏初始化时的第一天日志和 BOSS 刷新
  // 只有当封面页关闭且未初始化时才执行
  useEffect(() => {
    // 封面页未关闭时不执行
    if (showCover) return;
    // 防止重复执行
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

    // 第一天随机刷新特殊怪物（蜘蛛、蜘蛛王后艾达）
    const specialMonsterSpawnResults = rollSpecialMonsterSpawns();
    const newSpawnedSpecialMonsterIds = specialMonsterSpawnResults.map(result => result.interactableId);
    setSpawnedSpecialMonsters(new Set(newSpawnedSpecialMonsterIds));

    // 将特殊怪物刷新消息添加到交互日志
    if (specialMonsterSpawnResults.length > 0) {
      const specialMonsterMessages = specialMonsterSpawnResults.map(result => result.message);
      setInteractionLog(logs => [...logs, ...specialMonsterMessages]);
    }
  }, [showCover]); // 监听 showCover 状态变化

  useEffect(() => {
    currentLocationRef.current = currentLocation;
  }, [currentLocation]);

  // 自动同步角色战斗力（当等级或幻兽变化时重新计算）
  useEffect(() => {
    setCharacter(prev => {
      const newCombatPower = calculateTotalCombatPower(prev, pets, skills);
      // 如果战斗力没有变化，不更新状态
      if (prev.combatPower === newCombatPower) {
        return prev;
      }

      return {
        ...prev,
        combatPower: newCombatPower
      };
    });
  }, [character.level, pets]); // 依赖等级和幻兽，当它们变化时重新计算战斗力

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
    // 雪域边境入口限制：国王未救出时，只有周五才能进入
    if (locationId === 'xueyu-bianjing' && !isKingRescued) {
      const weekday = timeSystem.nowday % 7;
      // 周五 = 5 (nowday % 7 === 5)
      if (weekday !== 5) {
        setInteractionLog(prev => [...prev, '该地方十分危险，你没有有任务不能进入雪域边境']);

        return;
      }
    }

    // 魔中军阵地入口限制：国王未救出时不能进入
    if (locationId === 'mozhongjun-zhendi' && !isKingRescued) {
      setInteractionLog(prev => [...prev, '魔中军阵地还未开放，请先救出国王']);

      return;
    }

    // 地下城层间移动条件检查：从低层前往高层时，需清除当前层所有怪物
    const dungeonFloorOrder = ['dixiacheng-1', 'dixiacheng-2', 'dixiacheng-3'];
    const currentFloorIndex = dungeonFloorOrder.indexOf(currentLocation);
    const targetFloorIndex = dungeonFloorOrder.indexOf(locationId);

    // 从低层前往高层时检查怪物清除条件
    if (currentFloorIndex >= 0 && targetFloorIndex > currentFloorIndex) {
      const taskState = _dailyTaskState;
      let canMove = true;

      if (currentLocation === 'dixiacheng-1') {
        // 地下城1层前往2层：检查1层怪物是否全部清除
        canMove = !taskState.rw_gw1_1 && !taskState.rw_gw1_2 && !taskState.rw_gw1_3;
      } else if (currentLocation === 'dixiacheng-2') {
        // 地下城2层前往3层：检查2层怪物是否全部清除
        canMove = !taskState.rw_gw2_1 && !taskState.rw_gw2_2;
      }

      if (!canMove) {
        setInteractionLog(prev => [...prev, '只有消灭完怪物后才能进入下一层']);

        return;
      }
    }

    const location = locations.find(loc => loc.id === locationId);
    if (location) {
      setCurrentLocation(locationId);
      setInteractionLog(prev => [...prev, `你移动到了${location.name}`]);

      // 检测到达卡萨诺城时是否触发探险家解锁
      // 条件：未解锁 + 全身6件装备都是极品品质 + 战魂系统未开启
      if (locationId === 'kasanuocheng' && !explorerUnlocked && !warSoulSystemEnabled) {
        if (checkAllEquipmentLegendary(equippedItems)) {
          // 在日志区打印提示
          setInteractionLog(prev => [...prev, '飞翔：噢，你的全身装备都是极品啊，看来这位你是位不同寻常的人。听装备打造师说从戈壁可以找到有关战魂的秘密...你应该去看一看。']);
          // 显示解锁弹窗
          setInfoModalTitle('飞翔');
          setInfoModalContent('噢，你的全身装备都是极品啊，看来这位你是位不同寻常的人。听装备打造师说从戈壁可以找到有关战魂的秘密...你应该去看一看。');
          setInfoModalOnConfirm(() => {
            setExplorerUnlocked(true);
          });
          setShowInfoModal(true);
        }
      }
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

  /**
   * 添加浮动文字提示
   * @param text 显示的文字内容
   * @param duration 动画持续时间，默认3000ms
   */
  const addFloatingText = useCallback((text: string, duration?: number) => {
    const id = floatingTextIdCounterRef.current + 1;
    floatingTextIdCounterRef.current = id;
    setFloatingTexts(prev => [...prev, { id, text, duration }]);
  }, []);

  /**
   * 移除浮动文字
   * @param id 浮动文字ID
   */
  const removeFloatingText = useCallback((id: number) => {
    setFloatingTexts(prev => prev.filter(t => t.id !== id));
  }, []);

  /**
   * 处理角色升级后的提示
   * @param previousLevel 升级前的等级
   * @param currentLevel 升级后的等级
   */
  const handleCharacterLevelUp = useCallback((previousLevel: number, currentLevel: number) => {
    // 检查是否升级了
    if (currentLevel > previousLevel) {
      // 升级了，显示浮动文字提示
      addFloatingText(`恭喜升级！当前等级：${currentLevel}级`);

      // 检查是否跨过了装备使用等级节点
      const equipmentLevelNodes = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 125];
      
      // 找出所有跨过的装备使用等级节点
      const crossedNodes: number[] = [];
      for (let level = previousLevel + 1; level <= currentLevel; level++) {
        if (equipmentLevelNodes.includes(level)) {
          crossedNodes.push(level);
        }
      }

      // 为每个跨过的节点显示提示（延迟显示，避免重叠）
      crossedNodes.forEach((node, index) => {
        setTimeout(() => {
          addFloatingText(`你已经${node}级了，你可以使用更加高级的装备了，到装备打造师那里把你的装备升级吧。`);
        }, 1500 + index * 2000); // 第一个延迟1.5秒，后续每个延迟2秒
      });
    }
  }, [addFloatingText]);

  /**
   * 处理新的一天的逻辑
   * 统一管理所有每日初始化相关的逻辑
   */
  const handleNewDay = useCallback(() => {
    // 添加新的一天提示到交互日志
    setInteractionLog(logs => [...logs, `新的一天开始了！现在是第${timeSystem.nowday}天`]);

    // 新的一天恢复HP和体力到最大值
    setCharacter(prev => ({
      ...prev,
      currentHp: prev.maxHp,
      currentStamina: prev.maxStamina,
    }));

    // Recover all pets to max HP at the start of a new day
    setPets(prevPets => prevPets.map(pet =>
      pet.hp < pet.mhp
        ? { ...pet, hp: pet.mhp }
        : pet
    ));

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

    // 新的一天随机刷新特殊怪物（蜘蛛、蜘蛛王后艾达）
    const specialMonsterSpawnResults = rollSpecialMonsterSpawns();
    const newSpawnedSpecialMonsterIds = specialMonsterSpawnResults.map(result => result.interactableId);
    setSpawnedSpecialMonsters(new Set(newSpawnedSpecialMonsterIds));

    // 将特殊怪物刷新消息添加到交互日志
    if (specialMonsterSpawnResults.length > 0) {
      const specialMonsterMessages = specialMonsterSpawnResults.map(result => result.message);
      setInteractionLog(logs => [...logs, ...specialMonsterMessages]);
    }

    // 重置日常任务状态（对应参考文档的 nextday() 函数）
    setDailyTaskState(prev => resetDailyTaskState(prev, timeSystem.nowday));

    // 幻兽研究所：每日重置，库存增加（等于生产量）
    setPetInstituteState(prev => dailyReset(prev));

    // 重置地图挑战状态
    setMapChallengeState((prev: MapChallengeState) => resetMapChallengeDaily(prev));

    // 重置丫环1每日购买数量
    setMaid1DailyPurchaseCount(0);

    // 重置电浆药水使用状态（每天可以使用一瓶）
    setHasUsedDianJiangYaoShuiToday(false);

    // 重置公主关系每日状态（每天可以聊天和送礼）
    setPrincessRelationship(prev => ({
      ...prev,
      canChatToday: true,
      canGiftToday: true,
      canReceiveSundayGift: true, // 每天重置，但周日礼物选项只在周日显示
    }));

    // 重置PK赛参与状态（每天重置，周六可以再次参加）
    setHasParticipatedPKToday(false);

    // 魔军复活提示：国王救出后，如果有魔族大军被击败，显示复活提示
    if (isKingRescued) {
      const taskState = _dailyTaskState;
      // 检查是否有魔族大军被击败（状态为 false）
      const hasDefeatedDemonArmy = !taskState.mj_gj || !taskState.mj_fy || !taskState.mj_tt ||
                                     !taskState.mj_sm || !taskState.mj_zs || !taskState.mj_nl;
      if (hasDefeatedDemonArmy) {
        setInteractionLog(logs => [...logs, '黑夜到来时，魔的能量将所有死亡的魔族军队复活了']);
      }
    }

    // 重置每日提示状态
    setHasShownSaturdayPKTip(false);
    setHasShownSundayMilitaryPayTip(false);
    setHasShownSundayPrincessGiftTip(false);
    setHasShownSundayPrincessFlowerTip(false);

    // 检测星期并显示提示
    const weekday = getWeekday(timeSystem.nowday);

    // 幻兽研究所：周日重置，开启提高产量任务
    if (weekday === '星期日') {
      setPetInstituteState(prev => weeklyReset(prev));
    }

    // 星期六PK大赛提示（只在当天第一次显示）
    if (weekday === '星期六' && !hasShownSaturdayPKTip) {
      setTimeout(() => {
        addFloatingText('今天是星期六，PK大赛即将开始，如果要参加比赛请到皇宫周赛PK报名官那里报名吧。');
        setHasShownSaturdayPKTip(true);
      }, 100);
    }

    // 星期日提示（只在当天第一次显示）
    if (weekday === '星期日') {
      // 军饷提示（有军衔时）
      if (militaryRank > 0 && !hasShownSundayMilitaryPayTip) {
        setTimeout(() => {
          addFloatingText('今天是星期天啦，如果你有军衔了就可以去元帅那里领取军饷。');
          setHasShownSundayMilitaryPayTip(true);
        }, 1000);
      }

      // 公主礼物提示（认识公主时）
      if (princessRelationship.level > 0 && !hasShownSundayPrincessGiftTip) {
        setTimeout(() => {
          addFloatingText('今天是星期天啦，如果你认识了公主那今天她会送你一份礼物。');
          setHasShownSundayPrincessGiftTip(true);
        }, 2500);

        // 公主鲜花提示
        if (!hasShownSundayPrincessFlowerTip) {
          setTimeout(() => {
            const relationshipName = princessRelationship.relationshipName;
            addFloatingText(`公主是你的${relationshipName}。星期天了，公主很想收到一束漂亮的鲜花，你是否会给她送上一束呢。`);
            setHasShownSundayPrincessFlowerTip(true);
          }, 4000);
        }
      }
    }
  }, [timeSystem.nowday, addFloatingText, militaryRank, princessRelationship.level, princessRelationship.relationshipName, isKingRescued, _dailyTaskState]);

  // 监听天数变化，处理新的一天的逻辑
  useEffect(() => {
    // 只有当天数发生变化时才执行
    if (timeSystem.nowday !== prevDayRef.current) {
      // 更新追踪的天数
      prevDayRef.current = timeSystem.nowday;
      // 执行新的一天逻辑
      handleNewDay();
    }
  }, [timeSystem.nowday, handleNewDay]);

  /**
   * 挖矿逻辑
   * 挖到金矿概率30%，银矿概率70%，品质1-10概率相等
   * 消耗1个时间单位
   * @param miningName 挖矿类型名称
   */
  const handleMining = (miningName: string) => {
    // TODO：暂时调试消耗15个时间单位，后续改回1个时间单位
    consumeTime(15);

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
    // 地下城蝎怪特殊处理：等级和战斗力动态等于玩家等级
    if (interactable.id.startsWith('interact-dxc1-xieguai-')) {
      // 获取地下城蝎怪的属性模板参数
      const playerLevel = character.level;
      const baseHp = 1000;
      const growthHp = 300;
      const baseAttackMin = 300;
      const growthAttackMin = 50;
      const baseAttackMax = 300;
      const growthAttackMax = 88;
      const baseDefense = 300;
      const growthDefense = 45;

      // 根据玩家等级计算属性
      const maxHp = baseHp + growthHp * playerLevel;
      const attackMin = baseAttackMin + growthAttackMin * playerLevel;
      const attackMax = baseAttackMax + growthAttackMax * playerLevel;
      const defense = baseDefense + growthDefense * playerLevel;

      // 重新生成敌人数据
      const dynamicEnemies: EnemyData[] = interactable.enemies.map((enemy) => {
        // 计算随机变化系数（±10%）
        const variationFactor = 0.9 + Math.random() * 0.2;

        return {
          ...enemy,
          level: playerLevel,
          combatPower: playerLevel,
          maxHp: Math.round(maxHp * variationFactor),
          attack: Math.round(((attackMin + attackMax) / 2) * variationFactor),
          defense: Math.round(defense * variationFactor),
        };
      });

      // 创建更新后的交互对象
      const dynamicInteractable: EnemyInteractable = {
        ...interactable,
        description: `${interactable.name}\n等级: ${playerLevel}（动态） | 战斗力: ${playerLevel}`,
        enemies: dynamicEnemies,
      };

      setCurrentEnemyData(dynamicInteractable);
    } else {
      setCurrentEnemyData(interactable);
    }
    setShowEnemyModal(true);
  };

  /**
   * 处理NPC类交互
   * @param interactable NPC交互数据
   */
  const handleNPCInteract = (interactable: NPCInteractable) => {
    // 如果是日常任务官，动态生成包含当天任务描述的NPC描述
    if (interactable.id === 'npc_daily_task') {
      const weekday = timeSystem.nowday % 7;
      const taskDescription = getDailyTaskDescriptionByWeekday(weekday, character.level, isKingRescued);

      // 创建包含任务描述的NPC数据
      const npcDataWithTask: NPCInteractable = {
        ...interactable,
        description: `${interactable.description}\n\n${taskDescription}`,
      };

      setCurrentNPCData(npcDataWithTask);
    } else if (interactable.id.startsWith('npc_map_challenge')) {
      // 如果是地图赛报名官，动态生成对话和选项
      if (interactable.location) {
        const dialog = getNPCDialog(mapChallengeState, interactable.location, nobleRank);
        const options = getNPCDialogOptions(mapChallengeState, interactable.location);

        // 转换选项格式
        const npcOptions = options.map(opt => ({
          text: opt.text,
          result: opt.text,
          actionType: opt.actionType,
          actionParams: {},
        }));

        // 创建动态NPC数据
        const npcDataDynamic: NPCInteractable = {
          ...interactable,
          description: dialog,
          options: npcOptions,
        };

        setCurrentNPCData(npcDataDynamic);
      } else {
        setCurrentNPCData(interactable);
      }
    } else {
      setCurrentNPCData(interactable);
    }
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
   * 显示信息弹窗的辅助函数
   * @param title 弹窗标题
   * @param content 弹窗内容
   */
  const showInfoModalWithContent = useCallback((title: string, content: string) => {
    setInfoModalTitle(title);
    setInfoModalContent(content);
    setShowInfoModal(true);
  }, []);

  /**
   * 处理确认送礼
   * 从背包移除玫瑰花，增加公主亲密度
   * @param flowers 花朵列表（支持多种花朵）
   */
  const handleConfirmGift = (flowers: Array<{ type: '99朵白玫瑰' | '999朵白玫瑰'; quantity: number }>) => {
    // 计算总赠送数量（999玫瑰和99玫瑰合计）
    const totalQuantity = flowers.reduce((sum, { quantity }) => sum + quantity, 0);

    // 检查每周赠送限制
    const giftCheck = canGiftRose(princessRelationship, totalQuantity);
    if (!giftCheck.canGift) {
      showInfoModalWithContent('赠送限制', giftCheck.message);

      return;
    }

    // 计算总亲密度增加
    let totalIntimacyGain = 0;
    const giftDetails: string[] = [];

    flowers.forEach(({ type, quantity }) => {
      const intimacyGain = type === '99朵白玫瑰'
        ? 5 + (quantity - 1) * 1
        : 25 + (quantity - 1) * 5;

      totalIntimacyGain += intimacyGain;
      giftDetails.push(`${quantity}份${type}`);
    });

    // 从背包移除所有选中的玫瑰花
    setInventory(prev => {
      const newInventory = [...prev];

      flowers.forEach(({ type, quantity }) => {
        const roseIndex = newInventory.findIndex(item => item.name === type);

        if (roseIndex !== -1) {
          const rose = newInventory[roseIndex];
          if (rose.quantity && rose.quantity > quantity) {
            // 数量足够，减少数量
            newInventory[roseIndex] = {
              ...rose,
              quantity: rose.quantity - quantity,
            };
          } else {
            // 数量不足或刚好用完，移除物品
            newInventory.splice(roseIndex, 1);
          }
        }
      });

      return newInventory;
    });

    // 更新公主关系状态（包括每周赠送计数）
    setPrincessRelationship(prev => ({
      ...prev,
      intimacy: prev.intimacy + totalIntimacyGain,
      canGiftToday: false,
      weeklyRoseGiftCount: (prev.weeklyRoseGiftCount || 0) + totalQuantity,
    }));

    // 显示成功消息
    const remainingCount = MAX_WEEKLY_ROSE_GIFT_COUNT - (princessRelationship.weeklyRoseGiftCount || 0) - totalQuantity;
    let message = `公主收下了你的${giftDetails.join('、')}，友好度+${totalIntimacyGain}！`;
    if (remainingCount > 0) {
      message += `\n本周还能赠送${remainingCount}个玫瑰花。`;
    } else {
      message += '\n本周玫瑰花赠送次数已用完。';
    }
    setInteractionLog(prev => [...prev, message]);
    showInfoModalWithContent('送礼成功', message);
  };

  /**
   * 处理 NPC 选项选择
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
      // 如果result包含换行符或文本较长，显示弹窗
      if (result.includes('\n') || result.length > 50) {
        showInfoModalWithContent('信息', result);
      }

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
          // 添加弹窗显示
          showInfoModalWithContent('魔族大军情报', dialogue);
        }
        break;

      // ========== 公主 NPC 功能 ==========
      case 'viewRelationship':
        // 查看与公主的关系
        // 显示当前关系等级、亲密度和升级需求
        {
          // 获取当前关系名称
          const relationshipName = getRelationshipName(princessRelationship.level);
          // 获取升级到下一级所需的亲密度
          const nextRequirement = getNextRelationshipRequirement(princessRelationship.level);
          // 构建关系信息文本
          let relationshipInfo = '【与公主的关系】\n';
          relationshipInfo += `关系等级：${relationshipName}（等级 ${princessRelationship.level}）\n`;
          relationshipInfo += `当前亲密度：${princessRelationship.intimacy}\n`;
          // 判断是否已达最高级
          if (nextRequirement === Infinity) {
            relationshipInfo += '升级需求：已达最高级！';
          } else {
            relationshipInfo += `升级需求：亲密度达到 ${nextRequirement} 可升级`;
          }
          // 显示关系信息
          setInteractionLog(prev => [...prev, relationshipInfo]);
          // 添加弹窗显示
          showInfoModalWithContent('与公主的关系', relationshipInfo);
        }
        break;

      case 'chat':
        // 与公主聊天
        // 显示详细对话内容，根据关系等级和是否已救国王显示不同对话
        {
          const chatResult = performChat(princessRelationship, isKingRescued);
          if (chatResult.success) {
            // 获取详细对话内容
            const dialogue = getChatDialogue(chatResult.newLevel, isKingRescued);
            // 更新公主关系状态
            setPrincessRelationship(prev => ({
              ...prev,
              intimacy: chatResult.newIntimacy,
              level: chatResult.newLevel as any,
              relationshipName: getRelationshipName(chatResult.newLevel),
              canChatToday: false,
            }));
            // 显示对话内容和结果消息
            const chatMessage = `【公主说】\n${dialogue}\n\n${chatResult.message}`;
            setInteractionLog(prev => [...prev, chatMessage]);
            // 添加弹窗显示对话内容
            showInfoModalWithContent('与公主聊天', chatMessage);
          } else {
            setInteractionLog(prev => [...prev, chatResult.message]);
          }
        }
        break;

      case 'sendGift':
        // 送礼给公主 - 打开送礼选择界面
        // 使用游戏时间系统判断是否是周日（nowday % 7 === 0 表示周日）
        {
          const isSunday = timeSystem.nowday % 7 === 0;

          if (!isSunday) {
            const message = '只有在周日才能送花给公主。';
            setInteractionLog(prev => [...prev, message]);
            showInfoModalWithContent('送礼失败', message);
            break;
          }

          if (!princessRelationship.canGiftToday) {
            const message = '今天已经送过礼物了，明天再来吧。';
            setInteractionLog(prev => [...prev, message]);
            showInfoModalWithContent('送礼失败', message);
            break;
          }

          // 打开送礼选择模态窗口
          setShowGiftSelectModal(true);
        }
        break;

      case 'receiveWeeklyGift':
        // 领取周日礼物（公主星期天礼物逻辑）
        // 条件1：检查是否为星期天（nowday % 7 === 0 表示周日）
        // 条件2：检查关系等级是否为6（亲密恋人）
        // 礼物内容根据战魂系统开启状态决定：
        //   - 战魂系统开启：战魂之心
        //   - 战魂系统未开启：电浆药水
        {
          const isSunday = timeSystem.nowday % 7 === 0;
          const sundayGiftResult = receiveSundayGift(princessRelationship, isSunday, warSoulSystemEnabled);

          if (sundayGiftResult.success && sundayGiftResult.gift) {
            // 根据礼物名称创建物品并添加到背包
            // 使用 cloneItem 函数从 ITEM_TEMPLATES 克隆物品
            const giftName = sundayGiftResult.gift.itemName;
            let giftItem: InventoryItem | null = null;

            // 根据礼物名称选择对应的物品模板
            if (giftName === '战魂之心') {
              // 战魂之心：使用 ITEM_TEMPLATES.zhanHunZhiXin
              giftItem = cloneItem(ITEM_TEMPLATES.zhanHunZhiXin);
            } else if (giftName === '电浆药水') {
              // 电浆药水：使用 ITEM_TEMPLATES.dianJiangYaoShui
              giftItem = cloneItem(ITEM_TEMPLATES.dianJiangYaoShui);
            } else {
              // 其他礼物：使用 createItemFromTemplate 从模板创建
              giftItem = createItemFromTemplate(giftName, 1);
            }

            // 将礼物添加到背包
            if (giftItem) {
              // 使用统一的物品添加函数，处理堆叠合并
              setInventory(prev => addItemToInventory(prev, giftItem!));
            }

            // 更新公主关系状态
            setPrincessRelationship(prev => ({
              ...prev,
              canReceiveSundayGift: false,
            }));
            setInteractionLog(prev => [...prev, sundayGiftResult.message]);
          } else {
            setInteractionLog(prev => [...prev, sundayGiftResult.message]);
          }
        }
        break;

      case 'receiveConfidantGift':
        // 领取知己的礼物（年猪）
        // 条件：关系等级达到4（知己）及以上，且未领取过
        {
          const confidantGiftResult = receiveConfidantGift(princessRelationship);

          if (confidantGiftResult.success && confidantGiftResult.gift) {
            // 生成年猪幻兽并添加到幻兽列表
            const yearPig = generatePetByType('年猪');
            setPets(prev => [...prev, yearPig]);
            // 更新公主关系状态
            setPrincessRelationship(prev => ({
              ...prev,
              hasReceivedConfidantGift: true,
            }));
            // 显示领取结果
            const giftMessage = `${confidantGiftResult.message}\n\n年猪已添加到你的幻兽列表！`;
            setInteractionLog(prev => [...prev, giftMessage]);
            // 添加弹窗显示
            showInfoModalWithContent('知己的礼物', giftMessage);
          } else {
            setInteractionLog(prev => [...prev, confidantGiftResult.message]);
          }
        }
        break;

      // ========== 丫环 NPC 功能 ==========
      case 'buyItem':
        // 丫环1：购买高级战斗力石
        // 价格：2,800魔石，每天限购1个
        {
          // 解析购买参数
          const itemId = actionParams?.itemId as string;
          const price = actionParams?.price as number;
          const dailyLimit = actionParams?.dailyLimit as boolean;
          const limitCount = actionParams?.limitCount as number;

          // 检查是否是高级战斗力石
          if (itemId === 'gaojizhandoushili') {
            // 检查每日限购
            if (dailyLimit && maid1DailyPurchaseCount >= limitCount) {
              const limitMessage = '今天已经购买过高级战斗力石了，明天再来吧。';
              setInteractionLog(prev => [...prev, limitMessage]);
              showInfoModalWithContent('购买失败', limitMessage);
              break;
            }

            // 检查魔石是否足够
            if (playerResources.magicStone < price) {
              const noMoneyMessage = `魔石不足！需要 ${price} 魔石，当前只有 ${playerResources.magicStone} 魔石。`;
              setInteractionLog(prev => [...prev, noMoneyMessage]);
              showInfoModalWithContent('购买失败', noMoneyMessage);
              break;
            }

            // 扣除魔石
            setPlayerResources(prev => ({
              ...prev,
              magicStone: prev.magicStone - price,
            }));

            // 创建高级战斗力石物品并添加到背包
            const combatStone = createItemFromTemplate('高级战斗力石', 1);
            if (combatStone) {
              // 使用统一的物品添加函数，处理堆叠合并
              setInventory(prev => addItemToInventory(prev, combatStone));
            }

            // 更新每日购买数量
            setMaid1DailyPurchaseCount(prev => prev + 1);

            // 显示购买成功消息
            const successMessage = `购买成功！\n花费：${price} 魔石\n获得：高级战斗力石 x1\n镶嵌后战斗力+5%`;
            setInteractionLog(prev => [...prev, successMessage]);
            showInfoModalWithContent('购买成功', successMessage);
          }
        }
        break;

      case 'buyPet':
        // 丫环2：购买年猪
        // 价格：5,888魔石，只能购买1个（一次性购买）
        {
          // 解析购买参数
          const petType = actionParams?.petType as string;
          const price = actionParams?.price as number;
          const oneTimeLimit = actionParams?.oneTimeLimit as boolean;

          // 检查是否是年猪
          if (petType === 'nianzhu') {
            // 检查是否已购买过
            if (oneTimeLimit && hasPurchasedYearPig) {
              const limitMessage = '你已经购买过年猪了，每人只能购买一只。';
              setInteractionLog(prev => [...prev, limitMessage]);
              showInfoModalWithContent('购买失败', limitMessage);
              break;
            }

            // 检查魔石是否足够
            if (playerResources.magicStone < price) {
              const noMoneyMessage = `魔石不足！需要 ${price} 魔石，当前只有 ${playerResources.magicStone} 魔石。`;
              setInteractionLog(prev => [...prev, noMoneyMessage]);
              showInfoModalWithContent('购买失败', noMoneyMessage);
              break;
            }

            // 扣除魔石
            setPlayerResources(prev => ({
              ...prev,
              magicStone: prev.magicStone - price,
            }));

            // 生成年猪幻兽并添加到幻兽列表
            const yearPig = generatePetByType('年猪');
            setPets(prev => [...prev, yearPig]);

            // 标记已购买
            setHasPurchasedYearPig(true);

            // 显示购买成功消息
            const successMessage = `购买成功！\n花费：${price} 魔石\n获得：年猪\n\n年猪是超级幻兽，拥有强大的战斗力！`;
            setInteractionLog(prev => [...prev, successMessage]);
            showInfoModalWithContent('购买成功', successMessage);
          }
        }
        break;

      // ========== 元帅 NPC 功能 ==========
      case 'receiveSalary':
        // 领取军饷
        // 使用游戏时间系统获取星期几
        const weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][timeSystem.nowday % 7] as any;
        const payResult = claimMilitaryPay(militaryRank, weekday, hasClaimedMilitaryPay);

        if (payResult.success) {
          // 更新状态
          setHasClaimedMilitaryPay(true);
          setPlayerResources(prev => ({
            ...prev,
            magicStone: prev.magicStone + payResult.magicStone,
          }));
          setInteractionLog(prev => [...prev, payResult.message]);

          // 少将以上额外获得"高级斗志昂扬"
          if (payResult.specialReward) {
            // 创建高级斗志昂扬物品并添加到背包
            const skillBook = {
              id: 'skillbook_gaojidouzhiyiyang',
              name: '高级斗志昂扬',
              icon: '📓',
              quantity: 1,
              type: 'skillBook' as const,
              rarity: 'legendary' as const,
              source: '军饷奖励',
              description: '记载着高级斗志昂扬技能的秘籍，是斗志昂扬的升级版，大幅提升战斗力。',
              maxStack: 1,
              usable: true,
              equippable: false,
              skillId: 'skill_gaojidouzhiyiyang',
              skillName: '高级斗志昂扬',
              skillType: 'buff',
              skillEffect: '大幅提升战斗力',
              goldValue: 82800000,
              magicStoneValue: 25000,
              imagePath: './images/items/skillbook/gaojidouzhiyiyang.png',
            };
            setInventory(prev => [...prev, skillBook]);
            setInteractionLog(prev => [...prev, `额外获得：${payResult.specialReward}`]);
          }
        } else {
          setInteractionLog(prev => [...prev, payResult.message]);
        }
        break;

      case 'queryBattleExp':
        // 查询战功
        const expResult = queryBattleExp(battleExp);
        const expMessage = `当前军衔：${expResult.currentRankName}\n${
          expResult.nextRankName
            ? `当前战功/下一级所需战功：${expResult.currentExp}/${expResult.nextRequirement}\n下一级军衔：${expResult.nextRankName}`
            : `当前战功：${expResult.currentExp}\n已达到最高军衔！`
        }`;
        setInteractionLog(prev => [...prev, expMessage]);
        // 添加弹窗显示
        showInfoModalWithContent('战功查询', expMessage);
        break;

      case 'queryBossInfo':
        // 查询军情（BOSS位置）
        // 根据已刷新的BOSS构建状态映射
        const bossStatus: Record<string, boolean> = {};
        spawnedBosses.forEach(bossId => {
          // 从BOSS ID中提取等级信息（例如：'boss-10-leiming-dalu' -> 'boss10'）
          const match = bossId.match(/boss-(\d+)/);
          if (match) {
            bossStatus[`boss${match[1]}`] = true;
          }
        });

        // 查询军情
        const intelList = queryMilitaryIntel(bossStatus);
        const intelMessage = formatMilitaryIntel(intelList);
        setInteractionLog(prev => [...prev, intelMessage]);
        // 添加弹窗显示
        showInfoModalWithContent('军情查询', intelMessage);
        break;

      case 'showHelp':
        // 显示帮助信息
        if (actionParams?.topic === 'militaryRank') {
          // 显示军衔系统说明
          const rankDesc = getMilitaryRankDescription();
          setInteractionLog(prev => [...prev, rankDesc]);
          // 添加弹窗显示
          showInfoModalWithContent('军衔系统说明', rankDesc);
        } else if (actionParams?.topic === 'nobleRank') {
          // 显示爵位系统说明
          const nobleDesc = getNobleRankSystemDescription();
          setInteractionLog(prev => [...prev, nobleDesc]);
          // 添加弹窗显示
          showInfoModalWithContent('爵位系统说明', nobleDesc);
        } else if (actionParams?.topic === 'dailyTask') {
          // 显示日常任务说明（已在 result 中）
          setInteractionLog(prev => [...prev, result]);
          // 添加弹窗显示
          showInfoModalWithContent('日常任务说明', result);
        } else if (actionParams?.topic === 'gameTips') {
          // 显示游戏提示
          setInteractionLog(prev => [...prev, result]);
          // 添加弹窗显示
          showInfoModalWithContent('游戏提示', result);
        } else if (actionParams?.topic === 'petSystem') {
          // 显示关于幻兽
          setInteractionLog(prev => [...prev, result]);
          // 添加弹窗显示
          showInfoModalWithContent('关于幻兽', result);
        } else if (actionParams?.topic === 'pkReward') {
          // 显示PK赛奖励
          setInteractionLog(prev => [...prev, result]);
          // 添加弹窗显示
          showInfoModalWithContent('PK赛奖励', result);
        } else if (actionParams?.topic === 'lottery') {
          // 显示抽奖系统说明
          setInteractionLog(prev => [...prev, result]);
          // 添加弹窗显示
          showInfoModalWithContent('抽奖系统说明', result);
        } else if (actionParams?.topic === 'petFusion') {
          // 显示幻化系统说明
          setInteractionLog(prev => [...prev, result]);
          // 添加弹窗显示
          showInfoModalWithContent('幻化系统说明', result);
        } else if (actionParams?.topic === 'explore') {
          // 显示探险说明
          setInteractionLog(prev => [...prev, result]);
          // 添加弹窗显示
          showInfoModalWithContent('探险说明', result);
        } else if (actionParams?.topic === 'soulLevel') {
          // 显示提升魔魂等级
          setInteractionLog(prev => [...prev, result]);
          // 添加弹窗显示
          showInfoModalWithContent('提升魔魂等级', result);
        } else if (actionParams?.topic === 'quality') {
          // 显示提升品质
          setInteractionLog(prev => [...prev, result]);
          // 添加弹窗显示
          showInfoModalWithContent('提升品质', result);
        } else if (actionParams?.topic === 'socket') {
          // 显示装备开洞
          setInteractionLog(prev => [...prev, result]);
          // 添加弹窗显示
          showInfoModalWithContent('装备开洞', result);
        } else if (actionParams?.topic === 'gemInlay') {
          // 显示镶嵌宝石
          setInteractionLog(prev => [...prev, result]);
          // 添加弹窗显示
          showInfoModalWithContent('镶嵌宝石', result);
        } else if (actionParams?.topic === 'warSoul') {
          // 显示战魂系统
          setInteractionLog(prev => [...prev, result]);
          // 添加弹窗显示
          showInfoModalWithContent('战魂系统', result);
        } else {
          // 其他帮助信息
          setInteractionLog(prev => [...prev, result]);
          // 添加弹窗显示
          showInfoModalWithContent('帮助信息', result);
        }
        break;

      // ========== 首相 NPC 功能 ==========
      case 'donateGold':
        // 打开捐献金币弹窗
        setShowNPCModal(false); // 关闭NPC对话框
        setShowDonationModal(true);
        break;

      case 'queryMerit':
        // 查询功勋
        const meritMessage = `当前爵位：${getNobleRankName(nobleRank)}\n${
          nobleRank < 6
            ? `当前功勋/下一级所需功勋：${playerResources.merit.toLocaleString()}/${getNextNobleRankMerit(nobleRank)?.toLocaleString()}\n下一级爵位：${getNobleRankName(nobleRank + 1)}`
            : `当前功勋：${playerResources.merit.toLocaleString()}\n已达到最高爵位！`
        }`;
        setInteractionLog(prev => [...prev, meritMessage]);
        // 添加弹窗显示
        showInfoModalWithContent('功勋查询', meritMessage);
        break;

      case 'queryKingStatus':
        // 查询国王消息
        const kingMessage = isKingRescued
          ? '感谢勇士们，我们的国王终于回来了。\n我们的国王智勇双全，看看他有什么对付魔族大军的策略吧。'
          : '人类的国王被前来偷袭的魔族大军先锋部队俘虏了，亚特兰蒂斯大陆已处于群龙无首的地步...\n每一个亚特兰蒂斯的人类都肩负拯救人类的使命。';
        setInteractionLog(prev => [...prev, kingMessage]);
        // 添加弹窗显示
        showInfoModalWithContent('关于国王的消息', kingMessage);
        break;

      // ========== 日常任务官 NPC 功能 ==========
      case 'acceptDailyTask': {
        // 接受日常任务
        // 使用游戏时间系统计算星期几（1=周一, 2=周二, ..., 6=周六, 0=周日）
        const weekday = timeSystem.nowday % 7;
        const task = getDailyTask(weekday);

        if (!task) {
          setInteractionLog(prev => [...prev, '今天没有可接受的任务']);
          break;
        }

        // 根据任务类型执行不同操作
        switch (task.type) {
          case 'collect': {
            // 收集宝石任务
            const requirement = calculateGemRequirement(character.level);
            const reward = calculateGemReward(requirement.type, requirement.quantity);

            // 检查背包中是否有足够的物品
            if (checkGemInInventory(inventory, requirement.type, requirement.quantity)) {
              // 弹出确认弹窗
              setInfoModalTitle('确认提交物品');
              setInfoModalContent(
                `确定要提交 ${requirement.quantity} 个${requirement.type}吗？\n\n` +
                `奖励：${reward.description}`
              );

              // 设置确认回调
              setInfoModalOnConfirm(() => () => {
                // 消耗物品
                const newInventory = consumeGemFromInventory(inventory, requirement.type, requirement.quantity);
                setInventory(newInventory);

                // 发放奖励
                if (reward.exp) {
                  // 计算带战斗力加成的经验值
                  const bonusExp = calculateCombatPowerBonusExp(reward.exp!, character.combatPower, character.level);

                  // 记录升级前的等级
                  const previousLevel = character.level;

                  // 使用统一的升级函数处理角色经验获取（使用加成后的经验）
                  setCharacter(prev => {
                    const result = gainCharacterExperience(prev, bonusExp);

                    // 如果升级了，显示提示消息
                    if (result.message) {
                      setInteractionLog(logs => [...logs, result.message!]);
                    }

                    return result.character;
                  });

                  // 使用setTimeout确保在状态更新后执行
                  setTimeout(() => {
                    setCharacter(prev => {
                      // 检查是否升级了
                      if (prev.level > previousLevel) {
                        handleCharacterLevelUp(previousLevel, prev.level);
                      }
                      return prev;
                    });
                  }, 0);

                  // 给战中幻兽增加相同经验（带加成）
                  setPets(prevPets => {
                    return prevPets.map(pet => {
                      // 只给出战的幻兽分配经验
                      if (!pet.isDeployed) {
                        return pet;
                      }

                      // 使用 gainExperience 函数处理经验获取和升级
                      const result = gainExperience(pet, bonusExp, character.level);

                      // 如果有升级消息，打印到日志
                      if (result.message) {
                        setInteractionLog(logs => [...logs, result.message!]);
                      }

                      return result.pet;
                    });
                  });

                  // 打印战中幻兽获得经验的日志
                  const deployedCount = pets.filter(p => p.isDeployed).length;
                  if (deployedCount > 0) {
                    setInteractionLog(prev => [...prev, `🐉 战中幻兽（${deployedCount}只）各获得了 ${bonusExp.toLocaleString()} 经验！`]);
                  }
                }
                if (reward.merit) {
                  // 使用统一处理函数获取功勋
                  handleGainMerit(reward.merit, '完成收集宝石任务');
                }

                // 标记任务完成
                setDailyTaskState(prev => completeTask(prev, 'collect'));

                setInteractionLog(prev => [...prev, `任务完成！获得奖励：${reward.description}`]);
              });

              setShowInfoModal(true);
            } else {
              setInteractionLog(prev => [...prev,
                `背包中没有足够的${requirement.type}！\n需要：${requirement.quantity}个`
              ]);
            }
            break;
          }

          case 'train': {
            // 训练幻兽任务
            const validPets = getValidPetsForTraining(pets);

            if (validPets.length > 0) {
              // 显示符合条件的幻兽列表
              const petListText = validPets.map((pet, index) =>
                `${index + 1}. ${pet.othername} - ${pet.qualityTitle}（品质分：${pet.pz}）`
              ).join('\n');

              setInfoModalTitle('选择幻兽');
              setInfoModalContent(
                `请选择要上交的幻兽：\n\n${petListText}\n\n` +
                '提示：第一个幻兽将被上交'
              );

              // 设置确认回调（暂时只上交第一个幻兽）
              setInfoModalOnConfirm(() => () => {
                const selectedPet = validPets[0];
                const petReward = calculatePetRewardByQuality(selectedPet.pz);

                // 移除幻兽
                const newPets = removePetFromList(pets, selectedPet.id);
                setPets(newPets);

                // 发放奖励
                setPlayerResources(prev => ({
                  ...prev,
                  magicStone: prev.magicStone + petReward.magicStone,
                }));
                // 使用统一处理函数获取战功
                handleGainBattleExp(1000, '完成训练幻兽任务');

                // 标记任务完成
                setDailyTaskState(prev => completeTask(prev, 'train'));

                setInteractionLog(prev => [...prev,
                  `任务完成！上交了${selectedPet.othername}（${petReward.starLevel}）\n` +
                  `获得奖励：${petReward.magicStone}魔石 + 1000战功`
                ]);
              });

              setShowInfoModal(true);
            } else {
              setInteractionLog(prev => [...prev,
                '没有符合条件的幻兽！\n需要：攻防型幻兽，品质分≥500'
              ]);
            }
            break;
          }

          case 'raid': {
            // 突袭任务：自动寻路到雪域边境
            setShowNPCModal(false); // 关闭NPC对话框
            handleAutoMove('xueyu-bianjing');
            setInteractionLog(prev => [...prev, '正在前往雪域边境...消灭冰雪巨人完成任务！']);
            break;
          }

          case 'pk': {
            // PK赛任务：自动寻路到皇宫
            setShowNPCModal(false); // 关闭NPC对话框
            handleAutoMove('huanggong');
            setInteractionLog(prev => [...prev, '正在前往皇宫...请找PK赛报名官报名参加比赛！']);
            break;
          }

          case 'dungeon': {
            // 地下城任务：根据国王是否已救出，传送到对应地下城层
            setShowNPCModal(false); // 关闭NPC对话框
            if (isKingRescued) {
              // 已救出国王：直接传送到地下城3层
              setCurrentLocation('dixiacheng-3');
              setInteractionLog(prev => [...prev, '你被传送到了地下城3层！消灭呖风火龙兽，破坏魔族会议！']);
            } else {
              // 未救出国王：从地下城1层开始
              setCurrentLocation('dixiacheng-1');
              setInteractionLog(prev => [...prev, '你被传送到了地下城1层！消灭所有怪物才能进入下一层！']);
            }
            break;
          }

          default:
            setInteractionLog(prev => [...prev, '未知的任务类型']);
        }
        break;
      }

      // ========== 地图赛报名官 NPC 功能 ==========
      case 'viewMapProtectorReward':
        // 查看保护者奖励
        if (currentNPCData?.location) {
          const preview = getProtectorRewardPreview(currentNPCData.location);
          setInteractionLog(prev => [...prev, preview]);
          showInfoModalWithContent('保护者奖励', preview);
        }
        break;

      case 'challengeMap':
        // 挑战地图
        if (currentNPCData?.location) {
          const locationId = currentNPCData.location;

          // 检查挑战要求
          const canChallenge = checkChallengeRequirement(nobleRank, locationId);
          if (!canChallenge) {
            const reason = getChallengeRequirementReason(nobleRank, locationId);
            if (reason) {
              setInteractionLog(prev => [...prev, reason]);
              showInfoModalWithContent('挑战失败', reason);
            }
            break;
          }

          // 检查今天是否已经挑战过（所有地图共享一次机会）
          if (!canChallengeToday(mapChallengeState)) {
            const message = '你今天已经挑战过了，明天再来挑战吧！';
            setInteractionLog(prev => [...prev, message]);
            showInfoModalWithContent('今日已挑战', message);
            break;
          }

          // 获取挑战者配置
          const challenger = getChallengerConfig(locationId);
          if (!challenger) {
            setInteractionLog(prev => [...prev, '挑战者配置不存在！']);
            break;
          }

          // 使用属性成长系统计算挑战者属性
          // 公式：属性 = 基础值 + 成长值 × 等级
          // 生命成长是随机值，范围在 hpGrowthMin 和 hpGrowthMax 之间
          const hpGrowth = challenger.hpGrowthMin + Math.random() * (challenger.hpGrowthMax - challenger.hpGrowthMin);
          const maxHp = Math.floor(challenger.baseHp + hpGrowth * challenger.level);
          const minAttack = Math.floor(challenger.baseMinAttack + challenger.minAttackGrowth * challenger.level);
          const maxAttack = Math.floor(challenger.baseMaxAttack + challenger.maxAttackGrowth * challenger.level);
          const defense = Math.floor(challenger.baseDefense + challenger.defenseGrowth * challenger.level);

          // 创建挑战者战斗数据
          const challengerData: EnemyData = {
            id: 'map_challenger',
            name: challenger.name,
            level: challenger.level,
            maxHp: maxHp,
            attackMin: minAttack, // 最小攻击力
            attackMax: maxAttack, // 最大攻击力
            defense: defense,
          };

          // 关闭NPC对话
          setShowNPCModal(false);

          // 保存正在挑战的地图ID
          setCurrentChallengingMap(locationId);

          // 开始战斗
          setBattleParams({
            enemyTemplateId: challenger.isBoss ? 'boss' : 'soldier',
            enemyLevel: challenger.level,
            enemyCount: 1,
            enemiesData: [challengerData],
          });

          setInBattle(true);

          const config = getMapChallengeConfig(locationId);
          if (config) {
            setInteractionLog(prev => [...prev, `开始挑战${config.locationName}的挑战者：${challenger.name}！`]);
          }
        }
        break;

      case 'claimMapReward':
        // 领取保护者奖励
        if (currentNPCData?.location) {
          const locationId = currentNPCData.location;

          // 检查是否是当前地图的保护者
          if (!isMapProtector(mapChallengeState, locationId)) {
            const message = `你不是${locationId}的保护者！`;
            setInteractionLog(prev => [...prev, message]);
            showInfoModalWithContent('领取失败', message);
            break;
          }

          // 检查今天是否已经领取过
          if (!canClaimReward(mapChallengeState)) {
            const message = '你今天已经领取过奖励了，明天再来领取吧！';
            setInteractionLog(prev => [...prev, message]);
            showInfoModalWithContent('今日已领取', message);
            break;
          }

          // 获取奖励配置
          const config = getMapChallengeConfig(locationId);
          if (!config) {
            setInteractionLog(prev => [...prev, '地图配置不存在！']);
            break;
          }

          const reward = config.protectorReward;
          const rewardMessages: string[] = [];

          // 发放满经验球
          if (reward.expBalls > 0) {
            const expBallItem = createItemFromTemplate('满经验球', reward.expBalls);
            if (expBallItem) {
              // 使用统一的物品添加函数，处理堆叠合并
              setInventory(prev => addItemToInventory(prev, expBallItem));
              rewardMessages.push(`• 满经验球 × ${reward.expBalls}`);
            }
          }

          // 发放灵魂晶石或灵魂王
          if (reward.soulStones > 0) {
            const soulStoneItem = createItemFromTemplate(reward.soulStoneType, reward.soulStones);
            if (soulStoneItem) {
              // 使用统一的物品添加函数，处理堆叠合并
              setInventory(prev => addItemToInventory(prev, soulStoneItem));
              rewardMessages.push(`• ${reward.soulStoneType} × ${reward.soulStones}`);
            }
          }

          // 发放白玫瑰
          if (reward.whiteRoses && reward.whiteRoses > 0 && reward.roseType) {
            const roseName = reward.roseType;
            const roseItem = createItemFromTemplate(roseName, reward.whiteRoses);
            if (roseItem) {
              // 使用统一的物品添加函数，处理堆叠合并
              setInventory(prev => addItemToInventory(prev, roseItem));
              rewardMessages.push(`• ${roseName} × ${reward.whiteRoses}`);
            }
          }

          // 发放装备奖励
          if (reward.equipmentReward) {
            const qualityMap: Record<string, number> = {
              '精品': 3,
              '极品': 4
            };
            const quality = qualityMap[reward.equipmentReward.quality] || 3;

            // 根据玩家等级计算装备等级
            // 规则：< 10级 → 10级，10-99级 → 取整到十位，≥ 100级 → 100级
            let equipmentLevel: number;
            if (character.level < 10) {
              equipmentLevel = 10;
            } else if (character.level >= 100) {
              equipmentLevel = 100;
            } else {
              // 取整到十位（例如：35级→30级，78级→70级）
              equipmentLevel = Math.floor(character.level / 10) * 10;
            }

            // 随机选择装备类型
            const equipmentTypes: EquipmentSlotType[] = ['weapon', 'helmet', 'clothes', 'shoes', 'bracelet', 'necklace'];
            const randomType = equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)];

            // 使用 itemFactory 创建装备
            const equipmentItem = createEquipmentItem({
              equipmentType: randomType,
              level: equipmentLevel,
              quality: quality,
              magicSoulLevel: reward.equipmentReward.bonusLevel,
              gemSlots: randomGemSlots(quality)
            });

            setInventory(prev => [...prev, equipmentItem]);
            rewardMessages.push(`• ${reward.equipmentReward.quality}+${reward.equipmentReward.bonusLevel}装备`);
          }

          // 发放幻兽奖励
          if (reward.petReward) {
            // 根据星级选择生成函数
            // 8、12、19星使用 generateStarStrangePet，其他星级使用 generatePetByType
            const validStarLevels = [8, 12, 19];
            let pet;

            if (validStarLevels.includes(reward.petReward.star)) {
              // 生成指定星级的奇异兽
              pet = generateStarStrangePet(reward.petReward.star);
            } else {
              // 生成普通奇异兽
              pet = generatePetByType(reward.petReward.petType);
            }

            setPets(prev => [...prev, pet]);
            rewardMessages.push(`• ${reward.petReward.star}星${reward.petReward.petType}`);
          }

          // 更新状态：标记已领取
          setMapChallengeState((prev: MapChallengeState) => claimReward(prev));

          const rewardMessage = `🎁 领取${config.locationName}保护者奖励：\n${ rewardMessages.join('\n')}`;
          setInteractionLog(prev => [...prev, rewardMessage]);
          showInfoModalWithContent('领取奖励成功', rewardMessage);
        }
        break;

      // ========== 商店 NPC 功能 ==========
      case 'openShop':
        // 打开商店页面
        if (actionParams?.shopType) {
          const shopType = actionParams.shopType as 'gold' | 'magicStone';
          setCurrentShopType(shopType);
          setShopInitialMode('buy');
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
          setShopInitialMode('sell');
          setShowShopPage(true);
          setShowNPCModal(false); // 关闭NPC对话框
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

      // ========== 探险家 NPC 功能 ==========
      case 'payForExplore':
        // 探险家带路功能（传送到战魂封印迷宫）
        {
          const cost = (actionParams?.cost as number) || 50000;
          // 检查魔石是否足够
          if (playerResources.magicStone >= cost) {
            // 扣除魔石
            setPlayerResources(prev => ({
              ...prev,
              magicStone: prev.magicStone - cost,
            }));
            // 消耗15个时间单位（整整一天）
            consumeTime(15);
            // 显示骗局提示
            const scamMessage = '经过了一天的辛苦跋涉，那家伙带你转了一圈沙漠后，又把你带回到原来不远的地方。你还没反应过来，他就跑了......';
            setInteractionLog(prev => [...prev, scamMessage]);
            // 关闭NPC对话框
            setShowNPCModal(false);
            // 显示弹窗提示
            setInfoModalTitle('探险家');
            setInfoModalContent(scamMessage);
            setInfoModalOnConfirm(() => {
              // 传送到战魂封印迷宫
              setCurrentLocation('zhanhun-fengyin-migong');
              setInteractionLog(prev => [...prev, '你到达了战魂封印迷宫。']);
            });
            setShowInfoModal(true);
          } else {
            // 魔石不足
            setInteractionLog(prev => [...prev, '你的魔石不够。']);
            showInfoModalWithContent('提示', '你的魔石不够。');
            setShowNPCModal(false);
          }
        }
        break;

      // ========== 神秘人 NPC 功能 ==========
      case 'triggerMysteriousPerson':
        // 神秘人触发功能（显示对话，然后神秘人消失，无名氏出现）
        {
          const dialogMessage = '小子，你的装备也不错啊。想有打探有关战魂的秘密吧，先打赢我再说吧。';
          setInteractionLog(prev => [...prev, `神秘人：${dialogMessage}`]);
          // 关闭NPC对话框
          setShowNPCModal(false);
          // 显示弹窗提示
          setInfoModalTitle('神秘人');
          setInfoModalContent(dialogMessage);
          setInfoModalOnConfirm(() => {
            // 触发神秘人，神秘人消失，无名氏出现
            setMysteriousPersonTriggered(true);
          });
          setShowInfoModal(true);
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

      // ========== 经验导师 NPC 功能 ==========
      case 'openExperienceExchange':
        // 打开经验交换界面
        setShowExperienceExchangeModal(true);
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

      // ========== 宝石合成师 NPC 功能 ==========
      case 'synthesize':
        // 宝石合成
        if (actionParams?.recipeId) {
          const recipeId = actionParams.recipeId as string;
          const recipe = getRecipeById(recipeId);

          if (recipe) {
            // 执行合成
            const synthesisResult = performSynthesis(inventory, recipeId);

            if (synthesisResult.success && synthesisResult.resultItem) {
              // 消耗材料
              const newInventory = consumeMaterials(inventory, recipe.materials);

              // 检查背包中是否已有相同ID的物品（堆叠处理）
              const existingItemIndex = newInventory.findIndex(
                item => item.id === synthesisResult.resultItem!.id
              );

              if (existingItemIndex !== -1) {
                // 已有相同物品，增加数量
                newInventory[existingItemIndex] = {
                  ...newInventory[existingItemIndex],
                  quantity: newInventory[existingItemIndex].quantity + synthesisResult.resultItem.quantity,
                };
              } else {
                // 没有相同物品，添加新物品
                newInventory.push(synthesisResult.resultItem);
              }

              // 更新背包
              setInventory(newInventory);
              setInteractionLog(prev => [...prev, synthesisResult.message]);
            } else {
              setInteractionLog(prev => [...prev, synthesisResult.message]);
            }
          } else {
            setInteractionLog(prev => [...prev, `未知的合成配方：${recipeId}`]);
          }
        } else {
          setInteractionLog(prev => [...prev, '合成参数错误']);
        }
        break;

      // ========== 幻兽研究所 NPC 功能 ==========
      case 'openPetInstitute':
        // 打开幻兽研究所界面
        setShowPetInstituteModal(true);
        setShowNPCModal(false);
        break;

      case 'viewInstituteInfo':
        // 查看研究所信息
        const instituteInfo = getInstituteInfo(petInstituteState);
        setInteractionLog(prev => [...prev, instituteInfo]);
        // 添加弹窗显示
        showInfoModalWithContent('幻兽研究所信息', instituteInfo);
        break;

      case 'improveProduction':
        // 提高产量任务（每周一次）
        if (petInstituteState.canDoProductionTask && petInstituteState.productionRate < MAX_PRODUCTION_RATE) {
          // 计算所需灵魂王和经验奖励
          const requiredSoulKings = PRODUCTION_TASK_SOUL_KING_COST[petInstituteState.productionRate] || 0;
          const expReward = PRODUCTION_TASK_EXP_REWARD[petInstituteState.productionRate] || 0;
          
          // 构建弹窗内容
          const content = `提高产量任务已开放！\n\n所需灵魂王：${requiredSoulKings} 个\n经验奖励：${expReward}\n完成次数：${petInstituteState.productionRate} / ${MAX_PRODUCTION_RATE}`;
          
          setInfoModalTitle('提高产量任务');
          setInfoModalContent(content);
          setInfoModalConfirmText('接受');
          setInfoModalCancelText('离开');
          // 重置执行标志
          productionTaskExecutedRef.current = false;
          setInfoModalOnConfirm(() => () => {
            // 防止重复执行
            if (productionTaskExecutedRef.current) return;
            productionTaskExecutedRef.current = true;
            
            // 检查灵魂王是否足够（使用最新的 inventory 状态）
            setInventory(prevInventory => {
              const currentSoulKingCount = prevInventory
                .filter(item => item.name === '灵魂王')
                .reduce((sum, item) => sum + item.quantity, 0);
              
              if (currentSoulKingCount < requiredSoulKings) {
                setInteractionLog(prev => [...prev, `灵魂王不足，需要 ${requiredSoulKings} 个，当前 ${currentSoulKingCount} 个`]);
                return prevInventory;
              }
              
              // 执行提高产量任务（使用函数式更新获取最新状态）
              setPetInstituteState(prev => {
                // 再次检查是否可以执行任务
                if (!prev.canDoProductionTask || prev.productionRate >= MAX_PRODUCTION_RATE) {
                  setInteractionLog(prevLog => [...prevLog, '任务已完成或已达上限']);
                  return prev;
                }
                
                // 消耗灵魂王
                const newInventory = consumeItemFromInventory(prevInventory, '灵魂王', requiredSoulKings);
                setInventory(newInventory);
                
                // 计算带战斗力加成的经验值
                setCharacter(prevChar => {
                  const bonusExp = calculateCombatPowerBonusExp(expReward, prevChar.combatPower, prevChar.level);
                  
                  // 更新角色经验
                  const charResult = gainCharacterExperience(prevChar, bonusExp);
                  if (charResult.message) {
                    setInteractionLog(logs => [...logs, charResult.message!]);
                  }
                  
                  // 更新幻兽经验
                  setPets(prevPets => {
                    return prevPets.map(pet => {
                      if (!pet.isDeployed) return pet;
                      const petResult = gainExperience(pet, bonusExp, charResult.character.level);
                      if (petResult.message) {
                        setInteractionLog(logs => [...logs, petResult.message!]);
                      }
                      return petResult.pet;
                    });
                  });
                  
                  setInteractionLog(prevLog => [...prevLog, `完成提高产量任务！生产量+1，获得经验 ${bonusExp.toLocaleString()}，VIP星级 +1`]);
                  
                  return charResult.character;
                });
                
                // 更新研究所状态
                return {
                  ...prev,
                  productionRate: Math.min(prev.productionRate + 1, MAX_PRODUCTION_RATE),
                  vipLevel: Math.min(prev.vipLevel + 1, 10),
                  canDoProductionTask: false
                };
              });
              
              return prevInventory;
            });
          });
          setShowInfoModal(true);
        } else if (!petInstituteState.canDoProductionTask) {
          setInteractionLog(prev => [...prev, '本周提高产量任务已完成！']);
        } else {
          setInteractionLog(prev => [...prev, '生产量已达上限！']);
        }
        break;

      // ========== 幻兽幻化 NPC 功能 ==========
      case 'openPetFusion':
        // 打开幻兽幻化界面
        setShowPetFusionModal(true);
        setShowNPCModal(false);
        break;

      // ========== PK赛报名官 NPC 功能 ==========
      case 'registerPK':
        // 报名参加PK赛
        {
          // 1. 检查是否为周六（nowday % 7 === 6）
          const saturday = isSaturday(timeSystem.nowday);
          if (!saturday) {
            const message = '比赛在星期六才进行，你到那时再来报名吧。';
            setInteractionLog(prev => [...prev, message]);
            showInfoModalWithContent('报名失败', message);
            break;
          }

          // 2. 检查今日是否已参加
          if (hasParticipatedPKToday) {
            const message = '今天的比赛已经结束了，下次再来吧。';
            setInteractionLog(prev => [...prev, message]);
            showInfoModalWithContent('报名失败', message);
            break;
          }

          // 3. 根据等级确定分组
          const groupConfig = getPKMatchGroup(character.level);

          // 4. 创建对应BOSS的敌人数据
          const bossData = createPKBossEnemyData(groupConfig.group);

          // 5. 关闭NPC对话框
          setShowNPCModal(false);

          // 6. 保存当前PK赛分组（用于战斗胜利后发放奖励）
          setCurrentPKMatchGroup(groupConfig.group);

          // 7. 标记今日已参加
          setHasParticipatedPKToday(true);

          // 8. 开始战斗
          setBattleParams({
            enemyTemplateId: 'boss',
            enemyLevel: bossData.level!,
            enemyCount: 1,
            enemiesData: [bossData],
          });
          setInBattle(true);

          // 9. 显示报名成功消息
          const registerMessage = `你报名参加了PK赛${groupConfig.name}！\n正在挑战：${bossData.name}`;
          setInteractionLog(prev => [...prev, registerMessage]);
        }
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
   * 处理购买幻兽
   * 扣除货币并将幻兽添加到幻兽列表
   * @param pet 购买的幻兽
   * @param goldSpent 花费的金币
   * @param magicStoneSpent 花费的魔石
   */
  const handlePurchasePet = (
    pet: Pet,
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

    // 添加幻兽到幻兽列表
    setPets(prev => [...prev, pet]);

    setInteractionLog(prev => [...prev, `购买成功：${pet.othername}（${pet.qualityTitle}）`]);
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
      } else if (firstEnemy.name.includes('精英') || (firstEnemy.attackMax && firstEnemy.attackMax > 15)) {
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
   * 处理单个敌人阵亡
   * 敌人阵亡时立即分配经验给角色和幻兽
   * @param enemy 阵亡的敌人数据
   */
  const handleEnemyDeath = useCallback((enemy: BattleCharacter) => {
    // 计算战利品（主要是经验）
    const isBoss = enemy.name.includes('BOSS') || enemy.name.includes('boss');
    const loot = calculateLoot(
      Math.floor(enemy.maxHp / 100), // 估算等级
      enemy.maxHp,
      isBoss,
      character.luck, // 使用角色的幸运值
      character.combatPower, // 玩家战斗力（用于经验加成）
      character.level, // 玩家等级（用于经验加成）
      0 // 宝石经验加成（暂时为0，宝石系统未实现）
    );

    // ========== 角色获得经验 ==========
    // 记录升级前的等级
    const previousLevel = character.level;

    // 使用统一的升级函数处理角色经验获取
    setCharacter(prev => {
      const result = gainCharacterExperience(prev, loot.experience);

      // 如果升级了，显示提示消息
      if (result.message) {
        setInteractionLog(logs => [...logs, result.message!]);
      }

      return result.character;
    });

    // 使用setTimeout确保在状态更新后执行
    setTimeout(() => {
      setCharacter(prev => {
        // 检查是否升级了
        if (prev.level > previousLevel) {
          handleCharacterLevelUp(previousLevel, prev.level);
        }
        return prev;
      });
    }, 0);

    // ========== 幻兽获得同等经验 ==========
    // 给所有出战的幻兽分配相同的经验
    setPets(prevPets => {
      return prevPets.map(pet => {
        // 只给出战的幻兽分配经验
        if (!pet.isDeployed) {
          return pet;
        }

        // 增加经验值
        let newExp = pet.jy + loot.experience;
        let newLevel = pet.dj;
        let newMaxExp = pet.mjy;
        let newHun = pet.hun;
        let leveledUp = false;

        // 检查是否可以升级（最高130级）
        while (newExp >= newMaxExp && newLevel < 130) {
          newExp -= newMaxExp;
          newLevel++;
          leveledUp = true;

          // 计算下一级所需经验（参考文档：02.1_幻兽升级经验系统.md）
          if (newLevel < 20) {
            // 1-19级：每次乘以1.2
            newMaxExp = Math.round(newMaxExp * 1.2);
          } else if (newLevel <= 50) {
            // 20-50级：每次乘以1.1
            newMaxExp = Math.round(newMaxExp * 1.1);
          } else if (newLevel < 130) {
            // 51-129级：每次加hun值
            // 在50级时计算hun值
            if (newLevel === 51) {
              newHun = Math.round(newMaxExp * 0.2);
            }
            newMaxExp += newHun;
          }
        }

        // 如果升级了，更新幻兽属性
        if (leveledUp) {
          // 添加幻兽升级提示到交互日志
          setInteractionLog(logs => [...logs, `🎉 ${pet.othername}升级了！等级提升到 ${newLevel} 级！`]);

          // 计算新的属性（基于成长率）
          // 公式：初始值 + 成长率 × (等级 - 1)
          const newMaxHp = pet.chp + pet.cz_hp * (newLevel - 1);
          const newAttackMin = pet.cxgj + pet.cz_xgj * (newLevel - 1);
          const newAttackMax = pet.cdgj + pet.cz_dgj * (newLevel - 1);
          const newDefense = pet.cfy + pet.cz_fy * (newLevel - 1);

          return {
            ...pet,
            dj: newLevel,
            jy: newExp,
            mjy: newMaxExp,
            hun: newHun,
            mhp: newMaxHp,
            hp: newMaxHp, // 升级恢复满生命值
            xgj: newAttackMin,
            dgj: newAttackMax,
            fy: newDefense,
          };
        }

        // 没有升级，只更新经验
        return {
          ...pet,
          jy: newExp,
        };
      });
    });

    // 添加经验获得消息到交互日志
    setInteractionLog(prev => [...prev, `击败 ${enemy.name}，获得经验: ${loot.experience}`]);
  }, [character.luck, character.combatPower, character.level]);

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
    // 保存战斗结束后的HP状态（无论胜负都保存）
    // 战斗结束后体力自动恢复至最大值
    if (finalPlayerState) {
      setCharacter(prev => {
        // 检查角色是否升级了
        // 如果角色的最大生命值（maxHp）大于战斗结束时的最大生命值，说明升级了
        // 升级后应该保持满血状态，而不是用战斗中的血量覆盖
        if (prev.maxHp > finalPlayerState.maxHp) {
          // 角色升级了，保持升级后的满血状态
          return {
            ...prev,
            currentHp: prev.maxHp, // 使用升级后的最大生命值作为当前生命值
            currentStamina: prev.maxStamina, // 战斗结束后体力恢复至最大值
          };
        }

        // 没有升级，正常同步战斗中的血量
        return {
          ...prev,
          currentHp: Math.max(1, finalPlayerState.currentHp), // 至少保留1点HP
          currentStamina: prev.maxStamina, // 战斗结束后体力恢复至最大值
        };
      });
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

            // 检查幻兽是否升级了
            // 如果幻兽的最大生命值（mhp）大于战斗结束时的最大生命值，说明升级了
            // 升级后应该保持满血状态，而不是用战斗中的血量覆盖
            if (pet.mhp > battlePet.maxHp) {
              // 幻兽升级了，保持升级后的满血状态
              return {
                ...pet,
                hp: pet.mhp, // 使用升级后的最大生命值作为当前生命值
              };
            }

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

      // ========== 地下城怪物击杀处理 ==========
      // 地下城怪物被击杀后，更新 _dailyTaskState 中对应的 rw_gw 变量为 false
      const dungeonMonsterMap: Record<string, keyof typeof _dailyTaskState> = {
        'interact-dxc1-xieguai-1': 'rw_gw1_1',
        'interact-dxc1-xieguai-2': 'rw_gw1_2',
        'interact-dxc1-xieguai-3': 'rw_gw1_3',
        'interact-dxc2-qishiwanghun-1': 'rw_gw2_1',
        'interact-dxc2-qishiwanghun-2': 'rw_gw2_2',
        'interact-dxc3-huolongshou-1': 'rw_gw3_1',
      };
      // 魔族大军击杀映射
      const demonArmyMap: Record<string, keyof typeof _dailyTaskState> = {
        'interact-mojun-tujidui': 'mj_gj',
        'interact-mojun-shouweijun': 'mj_fy',
        'interact-mojun-shenmibudui': 'mj_sm',
        'interact-mojun-tutengshou': 'mj_tt',
        'interact-mojun-nengliang': 'mj_nl',
        'interact-mojun-shuai': 'mj_zs',
      };
      const dungeonMonsterKey = dungeonMonsterMap[currentBattleInteractableId];
      const demonArmyKey = demonArmyMap[currentBattleInteractableId];
      if (dungeonMonsterKey) {
        // 更新怪物状态为已击杀
        const newTaskState = { ..._dailyTaskState, [dungeonMonsterKey]: false };
        setDailyTaskState(newTaskState);

        // ========== 地下城层级奖励发放 ==========
        // 检查当前层是否所有怪物都已清除，如果是则发放奖励
        // 地下城1层奖励：灵魂王 × 1 + 3,000功勋
        if (!newTaskState.rw_gw1_1 && !newTaskState.rw_gw1_2 && !newTaskState.rw_gw1_3 && currentLocation === 'dixiacheng-1') {
          // 发放灵魂王
          const soulKingItem = createItemFromTemplate('灵魂王', 1);
          if (soulKingItem) {
            // 使用统一的物品添加函数，处理堆叠合并
            setInventory(prev => addItemToInventory(prev, soulKingItem));
          }
          // 发放功勋
          handleGainMerit(3000, '完成地下城1层任务');
          // 弹窗提示
          setInfoModalTitle('地下城1层完成');
          setInfoModalContent('你完成了第一层任务：获得了灵魂王和3,000功勋。\n现在可以进入第二层了。');
          setShowInfoModal(true);
        }
        // 地下城2层奖励：极品一洞+9装备 × 1 + 6,000功勋
        else if (!newTaskState.rw_gw2_1 && !newTaskState.rw_gw2_2 && currentLocation === 'dixiacheng-2') {
          // 随机生成装备类型
          const equipmentTypes: EquipmentSlotType[] = ['weapon', 'helmet', 'necklace', 'clothes', 'bracelet', 'shoes'];
          const randomType = equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)];
          // 计算装备等级（玩家等级向下取整到10的倍数，范围10-100）
          let equipLevel = Math.floor(character.level / 10) * 10;
          if (equipLevel < 10) equipLevel = 10;
          if (equipLevel > 100) equipLevel = 100;
          // 创建极品一洞+9装备
          const equipmentItem = createEquipmentItem({
            equipmentType: randomType,
            level: equipLevel,
            quality: 4, // 极品
            magicSoulLevel: 9,
            gemSlots: 1,
          });
          setInventory(prev => [...prev, equipmentItem]);
          // 发放功勋
          handleGainMerit(6000, '完成地下城2层任务');
          // 弹窗提示
          const equipmentNames: Record<EquipmentSlotType, string> = {
            weapon: '武器', helmet: '头盔', necklace: '项链', clothes: '衣服', bracelet: '手镯', shoes: '战鞋'
          };
          setInfoModalTitle('地下城2层完成');
          setInfoModalContent(`你完成了第二层任务：获得了6,000功勋和极品一洞+9${equipmentNames[randomType]}一件。\n现在可以进入最后一层了。`);
          setShowInfoModal(true);
        }
        // 地下城3层奖励：极品一洞+12装备 × 1 + 12,000功勋 + 特殊道具 + 救出国王
        else if (!newTaskState.rw_gw3_1 && currentLocation === 'dixiacheng-3') {
          // 随机生成装备类型
          const equipmentTypes: EquipmentSlotType[] = ['weapon', 'helmet', 'necklace', 'clothes', 'bracelet', 'shoes'];
          const randomType = equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)];
          // 计算装备等级
          let equipLevel = Math.floor(character.level / 10) * 10;
          if (equipLevel < 10) equipLevel = 10;
          if (equipLevel > 100) equipLevel = 100;
          // 创建极品一洞+12装备
          const equipmentItem = createEquipmentItem({
            equipmentType: randomType,
            level: equipLevel,
            quality: 4, // 极品
            magicSoulLevel: 12,
            gemSlots: 1,
          });
          setInventory(prev => [...prev, equipmentItem]);
          // 发放特殊道具（根据战魂系统状态）
          const specialItemName = warSoulSystemEnabled ? '战魂之心' : '月光宝盒增强版';
          const specialItem = createItemFromTemplate(specialItemName, 1);
          if (specialItem) {
            // 使用统一的物品添加函数，处理堆叠合并
            setInventory(prev => addItemToInventory(prev, specialItem));
          }
          // 发放功勋
          handleGainMerit(12000, '完成地下城3层任务');
          // 救出国王剧情
          const equipmentNames: Record<EquipmentSlotType, string> = {
            weapon: '武器', helmet: '头盔', necklace: '项链', clothes: '衣服', bracelet: '手镯', shoes: '战鞋'
          };
          // 检查国王是否已被救出
          if (!isKingRescued) {
            // 标记国王已救出
            _setIsKingRescued(true);
            // 根据爵位给予不同奖励
            if (nobleRank >= 5) {
              // 爵位 >= 5级：授予王爵位
              setNobleRank(6);
              setInfoModalTitle('🎉 救出国王！');
              setInfoModalContent(
                `${character.playerName}击败魔族的高级军官了，并救出国王...\n` +
                '随着国王的回来，人类军队的士气被激起到了最高点，他们已经准备好与魔族大军决战到底。\n' +
                '因为英勇地救出了国王，你被授与王爵位。\n\n' +
                `奖励：12,000功勋、极品一洞+12${equipmentNames[randomType]}、${specialItemName}`
              );
            } else {
              // 爵位 < 5级：200,000魔石
              setPlayerResources(prev => ({ ...prev, magicStone: prev.magicStone + 200000 }));
              setInfoModalTitle('🎉 救出国王！');
              setInfoModalContent(
                `${character.playerName}击败魔族的高级军官了，并救出国王...\n` +
                '随着国王的回来，人类军队的士气被激起到了最高点，他们已经准备好与魔族大军决战到底。\n' +
                '由于你的英勇作战，你获得了200,000魔石奖励。\n\n' +
                `奖励：12,000功勋、极品一洞+12${equipmentNames[randomType]}、${specialItemName}、200,000魔石`
              );
            }
          } else {
            // 国王已被救出，只发放奖励
            setInfoModalTitle('地下城3层完成');
            setInfoModalContent(`你完成了地下城任务：获得了12,000功勋、极品一洞+12${equipmentNames[randomType]}和${specialItemName}。`);
          }
          setShowInfoModal(true);
        }
      }

      // ========== 魔族大军击杀处理 ==========
      // 魔族大军被击杀后，更新 _dailyTaskState 中对应的 mj_ 变量为 false
      if (demonArmyKey) {
        const newTaskState = { ..._dailyTaskState, [demonArmyKey]: false };
        setDailyTaskState(newTaskState);
      }

      // 计算战利品
      if (battleParams?.enemiesData && battleParams.enemiesData.length > 0) {
        // 计算所有敌人的战利品
        const lootResults = battleParams.enemiesData.map(enemy => {
          // 根据敌人名称判断是否为BOSS
          const isBoss = enemy.name.includes('BOSS') || enemy.name.includes('boss');

          // 计算战利品（使用新的经验值计算公式）
          // 参数：怪物等级、怪物最大生命值、是否BOSS、幸运值、玩家战斗力、玩家等级、宝石经验加成
          return calculateLoot(
            Math.floor(enemy.maxHp / 100), // 估算等级
            enemy.maxHp,
            isBoss,
            character.luck, // 使用角色的幸运值
            character.combatPower, // 玩家战斗力（用于经验加成）
            character.level, // 玩家等级（用于经验加成）
            0 // 宝石经验加成（暂时为0，宝石系统未实现）
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

        // 添加战利品消息到交互日志（经验已经在敌人阵亡时分配）
        const lootMessages = [
          '战斗胜利！你击败了所有敌人。',
          `获得金币: ${totalLoot.gold}`,
          `获得经验: ${totalLoot.experience}`,
          ...totalLoot.messages.filter(msg => !msg.includes('获得金币') && !msg.includes('获得经验'))
        ];
        setInteractionLog(prev => [...prev, ...lootMessages]);

        // ========== 战功和功勋获取 ==========
        // 遍历所有敌人，根据敌人类型给予战功和功勋
        // 参考文档：reference/docs/project_docs/04_怪物系统.md
        // 冰雪巨人士兵：500战功，冰雪巨人士官：2000战功，冰雪巨人军官：5000战功
        battleParams.enemiesData.forEach(enemy => {
          const isBoss = enemy.name.includes('BOSS') || enemy.name.includes('boss');

          // 战功获取
          if (isBoss) {
            // 击败BOSS获得1000战功
            handleGainBattleExp(1000, '击败BOSS');
          } else if (enemy.name === '冰雪巨人军官') {
            // 击败冰雪巨人军官获得5000战功
            handleGainBattleExp(5000, '击败冰雪巨人军官');
          } else if (enemy.name === '冰雪巨人士官') {
            // 击败冰雪巨人士官获得2000战功
            handleGainBattleExp(2000, '击败冰雪巨人士官');
          } else if (enemy.name === '冰雪巨人士兵') {
            // 击败冰雪巨人士兵获得500战功
            handleGainBattleExp(500, '击败冰雪巨人士兵');
          }
        });

        // ========== 战魂物品掉落处理 ==========
        // 遍历所有敌人，检查是否有战魂物品掉落
        // 战魂物品掉落规则：
        // 1. 无名氏：100%掉落战魂之心（不受战魂系统开启状态限制）
        // 2. 其他怪物：需要战魂系统已开启才会掉落
        const warSoulDropMessages: string[] = [];

        battleParams.enemiesData.forEach(enemy => {
          // 调用 checkWarSoulDrop 检查战魂物品掉落
          // 参数：敌人ID、战魂系统开启状态
          const warSoulItems = checkWarSoulDrop(enemy.id, warSoulSystemEnabled);

          // 如果有战魂物品掉落，添加到背包并记录消息
          if (warSoulItems.length > 0) {
            // 添加战魂物品到背包
            setInventory(prev => {
              const newInventory = [...prev];

              for (const warSoulItem of warSoulItems) {
                // 查找背包中是否已有相同ID的可堆叠物品
                const existingIndex = newInventory.findIndex(item =>
                  item.id === warSoulItem.id &&
                  (item.maxStack && item.maxStack > 1)
                );

                if (existingIndex !== -1) {
                  // 已存在，增加数量
                  newInventory[existingIndex] = {
                    ...newInventory[existingIndex],
                    quantity: newInventory[existingIndex].quantity + warSoulItem.quantity,
                  };
                } else {
                  // 不存在，添加新物品
                  newInventory.push(warSoulItem);
                }
              }

              return newInventory;
            });

            // 记录掉落消息
            warSoulItems.forEach(item => {
              warSoulDropMessages.push(`✨ 获得战魂物品: ${item.name}`);
            });
          }
        });

        // 将战魂物品掉落消息添加到交互日志
        if (warSoulDropMessages.length > 0) {
          setInteractionLog(prev => [...prev, ...warSoulDropMessages]);
        }
      } else {
        setInteractionLog(prev => [...prev, '战斗胜利！你击败了所有敌人。']);
      }

      // ========== 无名氏战斗胜利处理 ==========
      // 如果击败无名氏，开启战魂系统，并自动回到戈壁
      // 注意：战魂之心已通过 checkWarSoulDrop 自动掉落，无需手动添加
      if (currentBattleInteractableId === 'enemy_wumingshi') {
        // 标记无名氏已被击败
        setWumingshiDefeated(true);
        // 开启战魂系统
        setWarSoulSystemEnabled(true);
        // 探险家NPC从戈壁消失（任务完成）
        setExplorerUnlocked(false);
        // 显示提示（更新提示信息，告知战魂系统已开启）
        const victoryMessage = '获得了战魂之心。\n终于找到关于战魂的秘密了，快去找装备打造师吧，他知道如何激发装备的战魂。';
        setInteractionLog(prev => [...prev, victoryMessage]);
        // 显示弹窗
        setInfoModalTitle('战魂系统开启');
        setInfoModalContent(victoryMessage);
        setInfoModalOnConfirm(() => {
          // 确认后自动回到戈壁
          setCurrentLocation('gebi');
          setInteractionLog(prev => [...prev, '你回到了戈壁。']);
        });
        setShowInfoModal(true);
      }

      // ========== PK赛BOSS战斗胜利处理 ==========
      // 如果击败PK赛BOSS，发放对应分组的冠军奖励
      if (currentPKMatchGroup) {
        const pkReward = getPKMatchReward(currentPKMatchGroup as any);
        if (pkReward) {
          const rewardMessages: string[] = [];

          // 发放魔石
          if (pkReward.magicStone > 0) {
            setPlayerResources(prev => ({
              ...prev,
              magicStone: prev.magicStone + pkReward.magicStone,
            }));
            rewardMessages.push(`• ${pkReward.magicStone.toLocaleString()} 魔石`);
          }

          // 发放经验
          if (pkReward.exp > 0) {
            // 计算带战斗力加成的经验值
            const bonusExp = calculateCombatPowerBonusExp(pkReward.exp, character.combatPower, character.level);

            // 记录升级前的等级
            const previousLevel = character.level;

            // 使用统一的升级函数处理角色经验获取
            setCharacter(prev => {
              const result = gainCharacterExperience(prev, bonusExp);
              if (result.message) {
                setInteractionLog(logs => [...logs, result.message!]);
              }

              return result.character;
            });

            // 使用setTimeout确保在状态更新后执行
            setTimeout(() => {
              setCharacter(prev => {
                // 检查是否升级了
                if (prev.level > previousLevel) {
                  handleCharacterLevelUp(previousLevel, prev.level);
                }
                return prev;
              });
            }, 0);

            // 给战中幻兽增加相同经验
            setPets(prevPets => {
              return prevPets.map(pet => {
                if (!pet.isDeployed) return pet;
                const result = gainExperience(pet, bonusExp, character.level);
                if (result.message) {
                  setInteractionLog(logs => [...logs, result.message!]);
                }

                return result.pet;
              });
            });
            rewardMessages.push(`• ${bonusExp.toLocaleString()} 经验`);
          }

          // 发放技能书
          if (pkReward.skillBook) {
            const skillBookItem = createItemFromTemplate(pkReward.skillBook, 1);
            if (skillBookItem) {
              setInventory(prev => addItemToInventory(prev, skillBookItem));
              rewardMessages.push(`• ${pkReward.skillBook}`);
            }
          }

          // 发放特殊物品
          if (pkReward.specialItems.length > 0) {
            pkReward.specialItems.forEach(itemName => {
              const item = createItemFromTemplate(itemName, 1);
              if (item) {
                setInventory(prev => addItemToInventory(prev, item));
                rewardMessages.push(`• ${itemName}`);
              }
            });
          }

          // 显示冠军祝贺消息
          const championMessage = `🎉 恭喜你获得了本届PK赛冠军！\n\n你获得了：\n${rewardMessages.join('\n')}`;
          setInteractionLog(prev => [...prev, championMessage]);
          setInfoModalTitle('PK赛冠军');
          setInfoModalContent(championMessage);
          setShowInfoModal(true);

          // 清空PK赛分组状态
          setCurrentPKMatchGroup(null);
        }
      }
    } else {
      // 战斗失败
      // ========== 幸运值减少处理 ==========
      // 角色死亡时幸运值-10，幻兽死亡时幸运值-10
      let luckDecrease = 0;
      const luckDecreaseMessages: string[] = [];

      // 检查角色是否死亡
      if (finalPlayerState && finalPlayerState.currentHp <= 0) {
        luckDecrease += LUCK_CONSTANTS.DEATH_PENALTY;
        luckDecreaseMessages.push('角色死亡，幸运值降低10点');
      }

      // 检查幻兽是否死亡
      if (finalDeployedPets) {
        const deadPets = finalDeployedPets.filter(pet => pet.currentHp <= 0);
        deadPets.forEach(pet => {
          luckDecrease += LUCK_CONSTANTS.DEATH_PENALTY;
          luckDecreaseMessages.push(`${pet.name}死亡，幸运值降低10点`);
        });
      }

      // 尝试触发爱的力量技能
      const lovePowerResult = checkLovePower(skills);
      if (lovePowerResult.triggered) {
        // 爱的力量触发，恢复生命值并增加幸运值
        setInteractionLog(prev => [...prev, `💖 ${lovePowerResult.message}`]);

        // 恢复角色生命值
        if (finalPlayerState) {
          setCharacter(prev => ({
            ...prev,
            currentHp: prev.maxHp,
            luck: Math.min(100, prev.luck + lovePowerResult.luckBonus - luckDecrease),
          }));
        }

        // 恢复幻兽生命值
        if (finalDeployedPets && finalDeployedPets.length > 0) {
          setPets(prevPets => {
            return prevPets.map(pet => {
              const battlePet = finalDeployedPets.find(bp => bp.petId === pet.id);
              if (battlePet) {

                return { ...pet, hp: pet.mhp };
              }

              return pet;
            });
          });
        }

        setInteractionLog(prev => [...prev, '爱的力量使你和你的幻兽生命值回复满！']);
      } else {
        // 爱的力量未触发，正常减少幸运值
        if (luckDecrease > 0) {
          setCharacter(prev => {
            const newLuck = decreaseLuck(prev.luck, luckDecrease);

            return { ...prev, luck: newLuck };
          });
          setInteractionLog(prev => [...prev, ...luckDecreaseMessages]);
        }

        // 检查幸运值是否归零
        const currentLuck = character.luck - luckDecrease;
        if (isLuckZero(currentLuck)) {
          setInteractionLog(prev => [...prev, '你的幸运值没有了！自动退出了战斗。']);
          setInfoModalTitle('幸运值耗尽');
          setInfoModalContent('你的幸运值没有了！自动退出了战斗。');
          setShowInfoModal(true);
        } else {
          setInteractionLog(prev => [...prev, '战斗失败，下次再来挑战吧。']);
        }
      }

      // ========== 无名氏战斗失败处理 ==========
      // 如果是无名氏战斗失败，自动传送到卡萨诺城
      if (currentBattleInteractableId === 'enemy_wumingshi') {
        setInteractionLog(prev => [...prev, '你被无名氏击败了，被传送回了卡萨诺城。']);
        setCurrentLocation('kasanuocheng');
      }
    }

    // ========== 地图挑战胜利处理 ==========
    if (result === 'player_win' && currentChallengingMap) {
      // 标记挑战成功（今日已挑战，所有地图共享）
      setMapChallengeState((prev: MapChallengeState) => {
        let newState = markChallengedToday(prev);
        newState = setAsMapProtector(newState, currentChallengingMap!);

        return newState;
      });

      const config = getMapChallengeConfig(currentChallengingMap);
      if (config) {
        setInteractionLog(prev => [...prev, `🎉 恭喜！你成为了${config.locationName}的保护者！`, '每天可以领取保护者奖励！']);
      }

      // 清空正在挑战的地图
      setCurrentChallengingMap(null);
    }

    // 清空当前战斗交互ID
    setCurrentBattleInteractableId(null);
  };

  /**
   * 离开战斗处理
   * 玩家主动离开战斗，消耗3个时间单位，不获得任何奖励
   */
  /**
   * 离开战斗处理
   * 与正常战斗结束相同，同步角色和幻兽的当前状态
   * @param finalPlayerState 离开战斗时的玩家状态
   * @param finalDeployedPets 离开战斗时的幻兽状态列表
   */
  const handleLeaveBattle = useCallback((finalPlayerState?: BattleCharacter, finalDeployedPets?: BattlePet[]) => {
    setInBattle(false);
    setBattleParams(null);
    setCurrentBattleInteractableId(null);

    // 消耗3个时间单位（与正常战斗结束相同）
    consumeTime(3);

    // ========== 同步角色状态 ==========
    // 战斗结束后体力自动恢复至最大值
    if (finalPlayerState) {
      setCharacter(prev => {
        // 如果角色升级了，保持满血状态
        if (prev.maxHp > finalPlayerState.maxHp) {
          return {
            ...prev,
            currentHp: prev.maxHp,
            currentStamina: prev.maxStamina, // 战斗结束后体力恢复至最大值
          };
        }

        // 正常同步战斗中的血量
        return {
          ...prev,
          currentHp: Math.max(1, finalPlayerState.currentHp),
          currentStamina: prev.maxStamina, // 战斗结束后体力恢复至最大值
        };
      });
    }

    // ========== 同步幻兽状态 ==========
    if (finalDeployedPets && finalDeployedPets.length > 0) {
      setPets(prevPets => {
        return prevPets.map(pet => {
          const battlePet = finalDeployedPets.find(bp => bp.petId === pet.id);
          if (battlePet) {
            const newCurrentHp = Math.max(0, battlePet.currentHp);
            // 如果幻兽升级了，保持满血状态
            if (pet.mhp > battlePet.maxHp) {
              return {
                ...pet,
                hp: pet.mhp,
              };
            }

            return {
              ...pet,
              hp: newCurrentHp,
            };
          }

          return pet;
        });
      });
    }

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
        ? { ...pet, isDeployed: true, isMerged: true } // 出征时自动进入合体状态
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

    // 检查角色等级是否满足装备要求
    if (!canEquipEquipment(item, character.level)) {
      // 显示等级不足提示
      addFloatingText(`等级不足！需要等级 ${item.useLevel} 才能装备此物品`);
      return;
    }

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

    // 先处理背包装备的更新和宝石消耗
    setInventory(prev => {
      let updated = [...prev];

      // 消耗使用的宝石（无论精炼成功与否，只要使用了宝石就消耗）
      if (result.usedGem && refineGem) {
        updated = updated.map(item => {
          if (item.name === result.usedGem!.name && item.quantity > 0) {
            return {
              ...item,
              quantity: item.quantity - 1,
            };
          }

          return item;
        }).filter(item => item.quantity > 0); // 移除数量为0的物品
      }

      // 如果精炼成功，更新背包装备
      if (result.success && result.updatedEquipment) {
        // 检查是否是角色装备
        const isEquipped = Object.values(equippedItems).some(
          item => item?.id === result.updatedEquipment!.id
        );

        if (!isEquipped) {
          // 更新背包装备
          updated = updated.map(item => {
            if (item.id === result.updatedEquipment!.id && item.type === 'equipment') {
              return result.updatedEquipment!;
            }

            return item;
          });
        }
      }

      return updated;
    });

    // 如果精炼成功，更新角色装备（如果是角色装备的话）
    if (result.success && result.updatedEquipment) {
      // 检查是否是角色装备
      const isEquipped = Object.values(equippedItems).some(
        item => item?.id === result.updatedEquipment!.id
      );

      if (isEquipped) {
        // 更新角色装备
        setEquippedItems(prev => {
          const updated = { ...prev };
          const slotType = result.updatedEquipment!.equipmentType;
          if (updated[slotType]) {
            // 将精炼后的装备转换为 EquipmentDetail 并更新
            updated[slotType] = equipmentItemToDetail(result.updatedEquipment!);
          }

          return updated;
        });
      }

      // 更新精炼界面选择的装备为最新状态
      setRefineEquipment({ ...result.updatedEquipment! });
    }

    // 检查背包中是否还有相同的宝石，如果有则保留，否则清空
    if (refineGem && result.usedGem) {
      // 使用 setTimeout 确保我们拿到最新的 inventory 状态
      setTimeout(() => {
        const hasRemainingGem = inventory.some(
          item => item.name === result.usedGem!.name && item.quantity > 0
        );

        if (!hasRemainingGem) {
          setRefineGem(null);
        }
      }, 0);
    }
  };

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
    // 检查是否是技能书
    if (item.type === 'skillBook') {
      const result = learnSkillFromBook(item, skills);

      // 显示结果消息
      setInteractionLog(prev => [...prev, result.message]);

      if (result.success) {
        // 更新技能列表
        setSkills(result.updatedSkills);

        // 消耗技能书
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

      return;
    }

    // 检查是否是满经验球
    if (item.name === '满经验球') {
      setCurrentUseItem(item);

      setShowUseItemTargetModal(true);
    } else if (item.name === '电浆药水') {
      // 电浆药水：幸运值设为100，每天只能使用一瓶
      if (hasUsedDianJiangYaoShuiToday) {
        setInteractionLog(prev => [...prev, '每天只能用一瓶电浆药水哦']);

        return;
      }

      // 设置幸运值为100
      setCharacter(prev => ({ ...prev, luck: 100 }));
      setHasUsedDianJiangYaoShuiToday(true);
      setInteractionLog(prev => [...prev, `使用了 ${item.name}，幸运值提高到了100点`]);

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
  }, [skills]);

  /**
   * 对玩家使用满经验球
   */
  const handleUseItemOnPlayer = useCallback(() => {
    if (!currentUseItem) return;

    // 记录升级前的等级，用于判断是否升级
    const previousLevel = character.level;

    // 使用统一的升级函数处理角色经验获取
    setCharacter(prev => {
      const result = gainCharacterExperience(prev, 2700);

      // 如果升级了，显示提示消息
      if (result.message) {
        setInteractionLog(logs => [...logs, result.message!]);
      }

      return result.character;
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

    // 使用setTimeout确保在状态更新后执行
    setTimeout(() => {
      // 检查是否升级了（通过比较character.level）
      setCharacter(prev => {
        if (prev.level > previousLevel) {
          // 使用统一的升级处理函数
          handleCharacterLevelUp(previousLevel, prev.level);
        }
        return prev;
      });
    }, 0);

    setInteractionLog(prev => [...prev, `对玩家使用了 ${currentUseItem.name}，获得 2700 经验值`]);
    setShowUseItemTargetModal(false);
    setCurrentUseItem(null);
  }, [currentUseItem, character.level, addFloatingText]);

  /**
   * 对幻兽使用满经验球
   * 使用 gainExperience 函数统一处理经验获取和升级逻辑
   */
  const handleUseItemOnPet = useCallback((petId: string) => {
    if (!currentUseItem) return;

    // 记录幻兽升级前的等级
    const pet = pets.find(p => p.id === petId);
    const previousLevel = pet?.dj || 0;

    // 使用 gainExperience 函数处理经验获取和升级
    setPets(prev => prev.map(pet => {
      if (pet.id === petId) {
        // 调用 gainExperience 函数，传入经验值和玩家等级
        const result = gainExperience(pet, 27000, character.level);

        // 显示消息（如果有）
        if (result.message) {
          setInteractionLog(prev => [...prev, result.message!]);
        }

        return result.pet;
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

    // 使用setTimeout确保在状态更新后执行
    setTimeout(() => {
      // 检查幻兽是否升级了
      setPets(prevPets => {
        const updatedPet = prevPets.find(p => p.id === petId);
        if (updatedPet && updatedPet.dj > previousLevel) {
          // 幻兽升级了，显示浮动文字提示
          addFloatingText(`幻兽 ${updatedPet.othername} 升级了！当前等级：${updatedPet.dj}级`);
        }
        return prevPets;
      });
    }, 0);

    setInteractionLog(prev => [...prev, `对幻兽 ${pet?.othername} 使用了 ${currentUseItem.name}，获得 27000 经验值`]);
    setShowUseItemTargetModal(false);
    setCurrentUseItem(null);
  }, [currentUseItem, pets, character.level, addFloatingText]);

  /**
   * 添加幻兽到幻兽栏
   * @param pet 要添加的幻兽
   */
  const handleAddPet = useCallback((pet: Pet) => {
    setPets(prev => [...prev, pet]);

    // 显示添加成功的提示
    setInteractionLog(prev => [...prev, `获得幻兽：${pet.othername}（${pet.hs_name}）品质：${pet.qualityTitle}`]);
  }, []);

  /**
   * 更新幻兽数据
   * 用于幻兽幻化后更新主幻兽的属性
   * @param petId 要更新的幻兽ID
   * @param updatedPet 更新后的幻兽数据
   */
  const handleUpdatePet = useCallback((petId: string, updatedPet: Pet) => {
    setPets(prevPets => prevPets.map(pet =>
      pet.id === petId ? updatedPet : pet
    ));
  }, []);

  /**
   * 移除幻兽数据
   * 用于幻兽幻化后移除副幻兽
   * @param petId 要移除的幻兽ID
   */
  const handleRemovePet = useCallback((petId: string) => {
    setPets(prevPets => prevPets.filter(pet => pet.id !== petId));
  }, []);

  /**
   * 消耗时间
   * 复用已有的 consumeTime 函数
   * @param amount 消耗的时间单位数量
   */
  const handleConsumeTime = useCallback((amount: number) => {
    consumeTime(amount);
  }, [consumeTime]);

  // 获取当前位置数据
  const currentLoc = locations.find(loc => loc.id === currentLocation);

  // 生成 BOSS 交互对象
  const bossInteractables = useMemo(() => {
    return generateBossInteractables(Array.from(spawnedBosses));
  }, [spawnedBosses]);

  // 获取当前位置的交互对象列表（过滤掉已击杀的怪物，添加已刷新的 BOSS）
  const currentInteractables = useMemo(() => {
    // 特殊怪物交互ID列表（有每日刷新概率的特殊怪物）
    const specialMonsterIds = ['interact-mimeng-zhizhu', 'interact-yaweite-zhizhuwanghou'];

    // 获取静态交互对象（怪物、NPC等）
    const staticInteractables = currentLoc?.interactables
      ?.map(id => interactableConfig[id])
      .filter(interactable => {
        // 过滤掉不存在的交互对象
        if (!interactable) {

          return false;
        }
        // 过滤掉已击杀的怪物
        if (killedMonsters.has(interactable.id)) {

          return false;
        }
        // 过滤特殊怪物：只有刷新成功时才显示
        if (specialMonsterIds.includes(interactable.id) && !spawnedSpecialMonsters.has(interactable.id)) {

          return false;
        }
        // 过滤国王NPC：国王未救出时不显示
        if (interactable.id === 'npc_king' && !isKingRescued) {

          return false;
        }
        // 过滤冰雪巨人：国王救出后隐藏（士兵和士官）
        if (['interact-xueyu-shibing-1', 'interact-xueyu-shibing-2', 'interact-xueyu-shiguan-1', 'interact-xueyu-shiguan-2'].includes(interactable.id) && isKingRescued) {

          return false;
        }

        return true;
      })
      // 对地图占领赛报名官 NPC 添加爵位名称前缀
      ?.map(interactable => {
        if (interactable.id.startsWith('npc_map_challenge') && interactable.type === 'npc') {
          const npc = interactable as NPCInteractable;
          const config = getMapChallengeConfig(npc.location);
          if (config) {
            return {
              ...npc,
              name: `[${config.requiredNobleRankName}] ${npc.name}`,
            };
          }
        }

        return interactable;
      }) || [];

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

    // 动态添加戈壁探险家（如果已解锁）
    const dynamicInteractables: (ActionInteractable | EnemyInteractable | NPCInteractable)[] = [];
    if (currentLocation === 'gebi' && explorerUnlocked) {
      const explorerGebi = interactableConfig['npc_explorer_gebi'];
      if (explorerGebi) {
        dynamicInteractables.push(explorerGebi as NPCInteractable);
      }
    }

    // 动态添加战魂封印迷宫的交互对象
    // 根据状态显示神秘人或无名氏
    if (currentLocation === 'zhanhun-fengyin-migong' && !wumingshiDefeated) {
      if (mysteriousPersonTriggered) {
        // 神秘人已触发，动态生成无名氏敌人（等级根据玩家等级计算）
        // 无名氏等级 = max(玩家等级, 50)
        const wumingshi = generateWumingshiInteractable(character.level);
        dynamicInteractables.push(wumingshi);
      } else {
        // 神秘人未触发，显示神秘人NPC
        const mysteriousPerson = interactableConfig['npc_mysterious_person'];
        if (mysteriousPerson) {
          dynamicInteractables.push(mysteriousPerson as NPCInteractable);
        }
      }
    }

    return [...staticInteractables, ...locationBossInteractables.filter(Boolean), ...dynamicInteractables] as (ActionInteractable | EnemyInteractable | NPCInteractable)[];
  }, [currentLoc, killedMonsters, bossInteractables, spawnedBosses, spawnedSpecialMonsters, currentLocation, explorerUnlocked, mysteriousPersonTriggered, wumingshiDefeated, character.level, isKingRescued]);

  // 计算带幻兽合体加成的角色数据
  // 同时使用最新的装备槽位数据作为 equipment 字段
  // 同步爵位和军衔信息
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
      petBonus,
      // 同步爵位和军衔信息
      nobleRankLevel: nobleRank,
      nobleRankName: getNobleRankName(nobleRank),
      militaryRankLevel: militaryRank,
      militaryRankName: getMilitaryRankName(militaryRank),
    };
  }, [pets, character, equippedItems, nobleRank, militaryRank]);

  // 构建 NPC 游戏状态对象
  // 包含战魂系统开启状态，用于NPC选项条件判断
  const npcGameState = useMemo(() => ({
    currentWeekday: timeSystem.nowday % 7, // 当前星期（使用游戏时间系统，0=周日, 1=周一, ..., 6=周六）
    relationshipLevel: princessRelationship.level, // 公主关系等级
    militaryRank, // 军衔等级
    nobleRank, // 爵位等级
    warSoulSystemEnabled, // 战魂系统是否已开启（用于装备打造师"关于战魂"选项的条件显示）
  }), [timeSystem.nowday, princessRelationship.level, militaryRank, nobleRank, warSoulSystemEnabled]);

  // 获取当前位置数据

  return (
    <div className="game-container">
      {showCover ? (
        /* 封面页面 */
        <CoverPage
          onStartGame={handleStartGame}
          onContinueGame={handleContinueGame}
          hasSaveData={hasSaveData()}
        />
      ) : inBattle ? (
        /* 战斗界面 */
        <Battle
          playerData={characterWithPetBonus}
          playerSkills={skills.filter(s => s.isLearned)}
          enemyTemplateId={battleParams?.enemyTemplateId || 'soldier'}
          enemyLevel={battleParams?.enemyLevel || 1}
          enemyCount={battleParams?.enemyCount || 1}
          enemiesData={battleParams?.enemiesData}
          deployedPets={getDeployedPets()}
          onEnemyDeath={handleEnemyDeath}
          onBattleEnd={handleBattleEnd}
          onLeaveBattle={handleLeaveBattle}
        />
      ) : (
        /* 游戏主界面 */
        <>
          {/* 顶部占位框 */}
          <div className="top-placeholder"></div>

          {/* 顶部位置显示 */}
          <LocationHeader
            location={currentLoc?.name || ''}
            onShowCharacter={() => setShowCharacterPage(true)}
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
            onShowPet={() => setShowPetPage(true)}
            onSaveGame={handleSaveGame}
            onShowSettings={() => setShowSettingsPage(true)}
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

          {/* 信息弹窗 */}
          <InfoModal
            isVisible={showInfoModal}
            onClose={() => {
              setShowInfoModal(false);
              setInfoModalOnConfirm(undefined);
              setInfoModalConfirmText(undefined);
              setInfoModalCancelText(undefined);
            }}
            title={infoModalTitle}
            content={infoModalContent}
            onConfirm={infoModalOnConfirm}
            confirmText={infoModalConfirmText}
            cancelText={infoModalCancelText}
          />

          {/* 角色信息页面 */}
          <CharacterPage
            isVisible={showCharacterPage}
            onClose={() => setShowCharacterPage(false)}
            character={characterWithPetBonus}
            equippedItems={equippedItems}
            inventoryEquipments={inventoryEquipments}
            pets={pets}
            skills={skills}
            onEquipItem={handleEquipItem}
            onUnequipItem={handleUnequipItem}
          />

          {/* 背包页面 */}
          <InventoryPage
            isVisible={showInventoryPage}
            items={inventory}
            resources={playerResources}
            characterLevel={character.level}
            onClose={() => setShowInventoryPage(false)}
            onUseItem={handleUseItem}
            onEquipItem={handleEquipItem}
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

          {/* 设置页面 */}
          <SettingsPage
            isVisible={showSettingsPage}
            isMusicEnabled={isMusicEnabled}
            musicVolume={musicVolume}
            onToggleMusic={() => setIsMusicEnabled(!isMusicEnabled)}
            onVolumeChange={setMusicVolume}
            onClose={() => setShowSettingsPage(false)}
            onExitGame={handleExitGame}
          />

          {/* 商店页面 */}
          {showShopPage && (
            <ShopPage
              shopType={currentShopType}
              playerResources={playerResources}
              inventoryItems={inventory}
              maxSlots={1000}
              pets={pets}
              maxPetSlots={100}
              onPurchase={handlePurchaseItem}
              onPurchasePet={handlePurchasePet}
              onSell={handleSellItem}
              onClose={() => setShowShopPage(false)}
              initialMode={shopInitialMode}
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
            equippedItems={equippedItems}
            warSoulSystemEnabled={warSoulSystemEnabled}
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

          {/* 送礼选择界面 */}
          <GiftSelectModal
            isVisible={showGiftSelectModal}
            onClose={() => setShowGiftSelectModal(false)}
            inventoryItems={inventory}
            weeklyRoseGiftCount={princessRelationship.weeklyRoseGiftCount || 0}
            onConfirmGift={handleConfirmGift}
          />

          {/* 经验交换界面 */}
          <ExperienceExchangeModal
            isVisible={showExperienceExchangeModal}
            onClose={() => setShowExperienceExchangeModal(false)}
            inventoryItems={inventory}
            onUpdateInventory={setInventory}
            onShowMessage={(message) => {
              setInteractionLog(prev => [...prev, message]);
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
              setCurrentLocation('huanggong');
              setShowLottery(false);
              setInteractionLog(prev => [...prev, '你返回了皇宫']);
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
            onShowPet={() => setShowPetPage(true)}
            onSaveGame={handleSaveGame}
            onShowSettings={() => setShowSettingsPage(true)}
          />

          {/* 幻兽研究所界面 */}
          <PetInstituteModal
            isVisible={showPetInstituteModal}
            state={petInstituteState}
            resources={playerResources}
            inventory={inventory}
            petCount={pets.length}
            onClose={() => setShowPetInstituteModal(false)}
            onBuyPet={(pet, price) => {
              // 添加幻兽
              setPets(prev => [...prev, pet]);
              // 扣除魔石
              setPlayerResources(prev => ({
                ...prev,
                magicStone: prev.magicStone - price
              }));
              // 减少库存
              setPetInstituteState(prev => ({
                ...prev,
                stock: prev.stock - 1
              }));
              setInteractionLog(prev => [...prev, `成功购买奇异兽！品质分：${pet.pz}，花费：${price} 魔石`]);
            }}
            onDonate={(magicStones, levelsGained) => {
              // 扣除魔石
              setPlayerResources(prev => ({
                ...prev,
                magicStone: prev.magicStone - magicStones
              }));
              // 提升技术等级
              setPetInstituteState(prev => ({
                ...prev,
                techLevel: Math.min(prev.techLevel + levelsGained, prev.techLevelMax)
              }));
              // 日志提示
              setInteractionLog(prev => [...prev, `资助成功！技术等级 +${levelsGained.toFixed(2)}`]);
            }}
          />

          {/* 幻兽幻化界面 */}
          <PetFusionModal
            isVisible={showPetFusionModal}
            onClose={() => setShowPetFusionModal(false)}
            pets={pets}
            deployedPetIds={getDeployedPets().map(p => p.id)}
            playerLevel={character.level}
            inventory={inventory}
            onUpdatePet={handleUpdatePet}
            onRemovePet={handleRemovePet}
            onUpdateInventory={setInventory}
          />

          {/* 捐献金币弹窗 */}
          <DonationModal
            isVisible={showDonationModal}
            onClose={() => setShowDonationModal(false)}
            currentGold={playerResources.gold}
            currentMerit={playerResources.merit}
            currentNobleRank={nobleRank}
            onDonate={(donatedGold, gainedMerit) => {
              // 更新金币
              setPlayerResources(prev => ({
                ...prev,
                gold: prev.gold - donatedGold,
              }));
              // 使用统一处理函数获取功勋
              handleGainMerit(gainedMerit, `捐献 ${donatedGold.toLocaleString()} 金币`);
            }}
          />

          {/* 浮动文字管理器 */}
          <FloatingTextManager
            texts={floatingTexts}
            onRemove={removeFloatingText}
          />
        </>
      )}
    </div>
  );
}

export default App;
