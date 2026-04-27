/**
 * 存档系统工具函数
 * 用于保存和加载游戏完整状态到 localStorage
 * 参考 Flash 原版存档系统（moyusave.sol），实现完整的游戏进度持久化
 */

import type {
  CharacterData,
  DailyTaskState,
  EquipmentDetail,
  EquipmentSlotType,
  InventoryItem,
  MapChallengeState,
  Pet,
  PetInstituteState,
  PlayerResources,
  PrincessRelationship,
  SkillDetail,
  TimeSystem,
} from '../types';

// 存档版本号，版本不兼容时清除旧存档
const SAVE_VERSION = '1.0.0';

// 存档键名
const SAVE_KEY = 'moyu_save_data';

/**
 * 完整存档数据接口
 * 覆盖所有核心游戏状态，确保"继续游戏"能完全恢复进度
 */
export interface SaveData {
  // 存档版本号，用于兼容性检查
  version: string;
  // 当前所在位置ID
  currentLocation: string;
  // 时间系统（天数、时间）
  timeSystem: TimeSystem;
  // 角色全部属性
  character: CharacterData;
  // 玩家资源（金币、魔石、战功、功勋）
  playerResources: PlayerResources;
  // 6个装备槽位数据
  equippedItems: Record<EquipmentSlotType, EquipmentDetail | null>;
  // 背包物品列表
  inventory: InventoryItem[];
  // 幻兽列表
  pets: Pet[];
  // 技能列表
  skills: SkillDetail[];
  // 军衔等级（0-11）
  militaryRank: number;
  // 累计战功
  battleExp: number;
  // 本周是否已领取军饷
  hasClaimedMilitaryPay: boolean;
  // 爵位等级（0-6）
  nobleRank: number;
  // 公主关系数据
  princessRelationship: PrincessRelationship;
  // 国王是否已救出
  isKingRescued: boolean;
  // 探险家是否已解锁（戈壁探险家）
  explorerUnlocked: boolean;
  // 神秘人是否已触发（战魂封印迷宫）
  mysteriousPersonTriggered: boolean;
  // 无名氏是否已击败
  wumingshiDefeated: boolean;
  // 战魂系统是否已开启
  warSoulSystemEnabled: boolean;
  // 已击杀怪物ID列表（序列化时 Set→Array）
  killedMonsters: string[];
  // 已刷新BOSS ID列表（序列化时 Set→Array）
  spawnedBosses: string[];
  // 已刷新特殊怪物ID列表（序列化时 Set→Array，如蜘蛛、蜘蛛王后艾达）
  spawnedSpecialMonsters: string[];
  // 日常任务状态
  dailyTaskState: DailyTaskState;
  // 地图挑战状态
  mapChallengeState: MapChallengeState;
  // 今日是否已参加PK赛
  hasParticipatedPKToday: boolean;
  // 丫环1今日购买高级战斗力石数量
  maid1DailyPurchaseCount: number;
  // 是否已购买过年猪（一次性）
  hasPurchasedYearPig: boolean;
  // 今日是否已使用电浆药水
  hasUsedDianJiangYaoShuiToday: boolean;
  // 幻兽研究所状态
  petInstituteState: PetInstituteState;
  // 是否击败最终BOSS（通关地下城3层）
  isWin: boolean;
  // 历史最高战斗力记录
  maxCombatPower: number;
}

/**
 * 保存游戏状态到 localStorage
 * 将所有游戏状态序列化并保存，Set 类型需转为 Array
 * @param data 要保存的游戏状态数据
 * @returns 是否保存成功
 */
export const saveGame = (data: SaveData): boolean => {
  try {
    const jsonData = JSON.stringify(data);
    localStorage.setItem(SAVE_KEY, jsonData);

    return true;
  } catch (error) {
    console.error('保存游戏失败:', error);

    return false;
  }
};

/**
 * 从 localStorage 加载游戏状态
 * 读取存档数据并反序列化，Array 类型需转回 Set
 * @returns 加载的游戏状态数据，如果加载失败或版本不兼容则返回 null
 */
export const loadGame = (): SaveData | null => {
  try {
    const jsonData = localStorage.getItem(SAVE_KEY);
    if (!jsonData) {
      return null;
    }
    const data = JSON.parse(jsonData) as SaveData;
    // 版本兼容性检查：版本不匹配则清除存档
    if (data.version !== SAVE_VERSION) {
      deleteSave();

      return null;
    }

    return data;
  } catch (error) {
    console.error('加载游戏失败:', error);

    return null;
  }
};

/**
 * 检查是否存在有效存档
 * 同时检查存档版本兼容性，版本不匹配的存档视为无效
 * @returns 是否存在有效存档
 */
export const hasSaveData = (): boolean => {
  try {
    const jsonData = localStorage.getItem(SAVE_KEY);
    if (!jsonData) {
      return false;
    }
    const data = JSON.parse(jsonData) as SaveData;
    // 版本不兼容视为无存档
    if (data.version !== SAVE_VERSION) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

/**
 * 删除存档
 * @returns 是否删除成功
 */
export const deleteSave = (): boolean => {
  try {
    localStorage.removeItem(SAVE_KEY);

    return true;
  } catch (error) {
    console.error('删除存档失败:', error);

    return false;
  }
};

/**
 * 获取当前存档版本号
 * @returns 存档版本号字符串
 */
export const getSaveVersion = (): string => {
  return SAVE_VERSION;
};

// ========== 音乐设置持久化 ==========

// 音乐设置键名
const MUSIC_SETTINGS_KEY = 'moyu_music_settings';

/**
 * 音乐设置数据结构
 */
export interface MusicSettings {
  /** 音乐是否开启 */
  isMusicEnabled: boolean;
  /** 音乐音量（0-100） */
  musicVolume: number;
}

/**
 * 保存音乐设置到 localStorage
 * @param settings 音乐设置对象
 * @returns 是否保存成功
 */
export const saveMusicSettings = (settings: MusicSettings): boolean => {
  try {
    localStorage.setItem(MUSIC_SETTINGS_KEY, JSON.stringify(settings));

    return true;
  } catch (error) {
    console.error('保存音乐设置失败:', error);

    return false;
  }
};

/**
 * 从 localStorage 加载音乐设置
 * @returns 音乐设置对象，如果不存在则返回默认设置
 */
export const loadMusicSettings = (): MusicSettings => {
  try {
    const jsonData = localStorage.getItem(MUSIC_SETTINGS_KEY);
    if (jsonData) {
      const settings = JSON.parse(jsonData) as MusicSettings;
      // 验证数据格式
      if (typeof settings.isMusicEnabled === 'boolean' && typeof settings.musicVolume === 'number') {
        // 确保音量在有效范围内
        settings.musicVolume = Math.max(0, Math.min(100, settings.musicVolume));

        return settings;
      }
    }
  } catch (error) {
    console.error('加载音乐设置失败:', error);
  }

  // 返回默认设置
  return {
    isMusicEnabled: true,
    musicVolume: 30
  };
};

// ========== 自动战斗设置持久化 ==========

// 自动战斗设置键名
const AUTO_BATTLE_KEY = 'moyu_auto_battle';

/**
 * 保存自动战斗设置到 localStorage
 * @param enabled 是否开启自动战斗
 * @returns 是否保存成功
 */
export const saveAutoBattleSetting = (enabled: boolean): boolean => {
  try {
    localStorage.setItem(AUTO_BATTLE_KEY, JSON.stringify(enabled));

    return true;
  } catch (error) {
    console.error('保存自动战斗设置失败:', error);

    return false;
  }
};

/**
 * 从 localStorage 加载自动战斗设置
 * @returns 是否开启自动战斗，默认关闭
 */
export const loadAutoBattleSetting = (): boolean => {
  try {
    const jsonData = localStorage.getItem(AUTO_BATTLE_KEY);
    if (jsonData !== null) {
      const enabled = JSON.parse(jsonData);
      if (typeof enabled === 'boolean') {
        return enabled;
      }
    }
  } catch (error) {
    console.error('加载自动战斗设置失败:', error);
  }

  // 默认关闭自动战斗
  return false;
};
