/**
 * NPC 配置数据文件
 * 定义游戏中所有可交互 NPC 的配置数据
 * 参考文档：reference/docs/scripts_analysis/14_NPC系统.md
 */

// 导入 NPC 相关类型
import type {
  NPCInteractable,
  NPCInteractionOption,
  NPCInteractionCondition,
} from '../types';

// ==================== 皇宫 NPC 配置 ====================

/**
 * 国王 NPC 配置
 * 功能：提供魔族大军情报查看功能
 * 位置：皇宫
 */
const npc_king: NPCInteractable = {
  id: 'npc_king',
  type: 'npc',
  name: '国王',
  icon: '👑',
  description: '亚特大陆的国王，统治着这片土地。他对魔族大军的动向了如指掌。',
  location: 'huanggong',
  npcType: 'palace',
  options: [
    {
      text: '魔军突击队资料',
      result: '魔军突击队（700级）：使所有魔族军队攻击力提高50%。',
      actionType: 'viewEnemyInfo',
      actionParams: { enemyType: '魔军突击队', level: 700, effect: '攻击力+50%' },
    },
    {
      text: '魔军守卫军资料',
      result: '魔军守卫军（800级）：使所有魔族军队防御提高50%。',
      actionType: 'viewEnemyInfo',
      actionParams: { enemyType: '魔军守卫军', level: 800, effect: '防御+50%' },
    },
    {
      text: '魔军神秘部队资料',
      result: '魔军神秘部队（900级）：使所有魔族军队生命值提高50%。',
      actionType: 'viewEnemyInfo',
      actionParams: { enemyType: '魔军神秘部队', level: 900, effect: '生命值+50%' },
    },
    {
      text: '魔军图腾兽资料',
      result: '魔军图腾兽（1000级）：使所有魔族军队战斗力提高50%。',
      actionType: 'viewEnemyInfo',
      actionParams: { enemyType: '魔军图腾兽', level: 1000, effect: '战斗力+50%' },
    },
    {
      text: '魔的能量资料',
      result: '魔的能量：每天复活所有魔族大军，是魔族的核心力量。',
      actionType: 'viewEnemyInfo',
      actionParams: { enemyType: '魔的能量', effect: '每天复活魔族大军' },
    },
    {
      text: '魔军主帅资料',
      result: '魔军主帅（2000级）：保护魔的能量，是魔族大军的最高统帅。',
      actionType: 'viewEnemyInfo',
      actionParams: { enemyType: '魔军主帅', level: 2000, effect: '保护魔的能量' },
    },
  ],
};

/**
 * 公主 NPC 配置
 * 功能：提供关系系统、送礼系统、幻兽赠送功能
 * 位置：后花园（需要爵位才能进入）
 */
const npc_princess: NPCInteractable = {
  id: 'npc_princess',
  type: 'npc',
  name: '公主',
  icon: '👸',
  description: '国王的女儿，美丽而善良。与她建立良好关系可以获得丰厚的奖励。',
  location: 'houhuayuan',
  npcType: 'palace',
  options: [
    {
      text: '知己的礼物',
      result: '获得超级幻兽年猪！',
      actionType: 'receiveGift',
      actionParams: { giftType: 'yearPig', requirement: 'relationship >= 5' },
      condition: {
        type: 'relationship',
        value: 5,
        operator: 'gte',
      },
    },
    {
      text: '聊天',
      result: '与公主聊天，增加友好度。每天只能聊天一次。',
      actionType: 'chat',
      actionParams: { dailyLimit: true },
    },
    {
      text: '送礼',
      result: '向公主送花，增加友好度。',
      actionType: 'sendGift',
      actionParams: { giftType: 'flowers' },
      condition: {
        type: 'weekday',
        value: '星期日',
      },
    },
    {
      text: '星期天的礼物',
      result: '获得宝石奖励！',
      actionType: 'receiveWeeklyGift',
      actionParams: { giftType: 'gem' },
      condition: {
        type: 'weekday',
        value: '星期日',
      },
    },
  ],
};

/**
 * 元帅 NPC 配置
 * 功能：提供军衔系统、军饷领取、BOSS情报功能
 * 位置：皇宫
 */
const npc_marshal: NPCInteractable = {
  id: 'npc_marshal',
  type: 'npc',
  name: '元帅',
  icon: '🎖️',
  description: '亚特大陆的最高军事统帅，负责军衔晋升和军饷发放。',
  location: 'huanggong',
  npcType: 'palace',
  options: [
    {
      text: '领取军饷',
      result: '领取本周军饷（魔石奖励）。',
      actionType: 'receiveSalary',
      actionParams: { weeklyLimit: true },
      condition: {
        type: 'weekday',
        value: '星期日',
      },
    },
    {
      text: '战功查询',
      result: '查看当前战功和晋升需求。',
      actionType: 'queryBattleExp',
      actionParams: {},
    },
    {
      text: '军情查询',
      result: '查看各等级BOSS位置。',
      actionType: 'queryBossInfo',
      actionParams: {},
    },
    {
      text: '关于军衔',
      result: '查看军衔系统说明。\n\n军衔等级：少尉、中尉、上尉、少校、中校、上校、少将、中将、上将、大将、元帅\n\n战功获取：消灭BOSS获得1000点战功，消灭雪域边境冰雪巨人获得10000点战功。',
      actionType: 'showHelp',
      actionParams: { topic: 'militaryRank' },
    },
  ],
};

/**
 * 首相 NPC 配置
 * 功能：提供爵位系统、交易系统功能
 * 位置：皇宫
 */
const npc_prime_minister: NPCInteractable = {
  id: 'npc_prime_minister',
  type: 'npc',
  name: '首相',
  icon: '🎩',
  description: '亚特大陆的首相，负责爵位晋升和交易系统。',
  location: 'huanggong',
  npcType: 'palace',
  options: [
    {
      text: '关于爵位',
      result: '查看爵位系统说明。\n\n爵位等级：平民、勋爵、子爵、伯爵、公爵、侯爵、王\n\n爵位可以通过积累功勋来提升。',
      actionType: 'showHelp',
      actionParams: { topic: 'nobleRank' },
    },
    {
      text: '交易',
      result: '打开交易界面。',
      actionType: 'openTrade',
      actionParams: {},
    },
    {
      text: '领取奖励',
      result: '领取爵位奖励。',
      actionType: 'receiveNobleReward',
      actionParams: {},
    },
  ],
};

/**
 * 丫环 NPC 配置
 * 功能：提供游戏提示和帮助信息
 * 位置：皇宫
 */
const npc_maid_1: NPCInteractable = {
  id: 'npc_maid_1',
  type: 'npc',
  name: '丫环',
  icon: '👘',
  description: '皇宫中的丫环，热情地为冒险者提供帮助和提示。',
  location: 'huanggong',
  npcType: 'palace',
  options: [
    {
      text: '游戏提示',
      result: '欢迎来到亚特大陆！在这里你可以：\n- 探索各个地图，挑战怪物\n- 与NPC交互，完成任务\n- 提升军衔和爵位\n- 培养幻兽，增强实力',
      actionType: 'showHelp',
      actionParams: { topic: 'gameTips' },
    },
    {
      text: '离开',
      result: '感谢你的访问！',
      actionType: 'close',
      actionParams: {},
    },
  ],
};

/**
 * 丫环2 NPC 配置
 * 功能：提供游戏提示和帮助信息
 * 位置：皇宫
 */
const npc_maid_2: NPCInteractable = {
  id: 'npc_maid_2',
  type: 'npc',
  name: '丫环',
  icon: '👘',
  description: '皇宫中的丫环，热情地为冒险者提供帮助和提示。',
  location: 'huanggong',
  npcType: 'palace',
  options: [
    {
      text: '关于幻兽',
      result: '幻兽是你的忠实伙伴！\n- 幻兽可以合体，增强你的战斗力\n- 通过幻兽研究所可以购买幻兽\n- 完成任务可以获得高品质幻兽',
      actionType: 'showHelp',
      actionParams: { topic: 'petSystem' },
    },
    {
      text: '离开',
      result: '感谢你的访问！',
      actionType: 'close',
      actionParams: {},
    },
  ],
};

// ==================== 功能 NPC 配置 ====================

/**
 * 日常任务官 NPC 配置
 * 功能：提供每日任务系统
 * 位置：树心城（使用雷鸣大陆作为位置）
 */
const npc_daily_task: NPCInteractable = {
  id: 'npc_daily_task',
  type: 'npc',
  name: '日常任务官',
  icon: '📋',
  description: '负责发布每日任务的官员。每天都有不同的任务等待着你！',
  location: 'leiming-dalu',
  npcType: 'function',
  options: [
    {
      text: '接受任务',
      result: '接受当日任务。',
      actionType: 'acceptDailyTask',
      actionParams: {},
    },
    {
      text: '关于日常任务',
      result: '日常任务说明：\n\n周一/周二：收集宝石（收集灵魂晶石/灵魂王）\n奖励：大量经验+500功勋\n\n周三/周四：训练幻兽（上交攻防型幻兽）\n奖励：魔石+1000战功\n\n周五：突袭（消灭雪域边境冰雪巨人）\n奖励：大量战功\n\n周六：PK赛（参加PK比赛）\n奖励：丰厚奖励\n\n周日：地下城（前往地下城破坏魔族会议）\n奖励：功勋值',
      actionType: 'showHelp',
      actionParams: { topic: 'dailyTask' },
    },
    {
      text: '随便问问',
      result: '好的，有问题随时来找我。',
      actionType: 'close',
      actionParams: {},
    },
  ],
};

/**
 * 地图赛报名官 NPC 配置
 * 功能：提供地图挑战系统、保护者奖励
 * 位置：各地图
 */
const npc_map_challenge: NPCInteractable = {
  id: 'npc_map_challenge',
  type: 'npc',
  name: '地图赛报名官',
  icon: '🗺️',
  description: '负责地图挑战系统的官员。成为地图保护者可以获得每日奖励！',
  location: 'leiming-dalu',
  npcType: 'function',
  options: [
    {
      text: '查看保护者每天的奖励',
      result: '查看当前地图保护者奖励。',
      actionType: 'viewProtectorReward',
      actionParams: {},
    },
    {
      text: '我来挑战/领取奖励',
      result: '挑战地图或领取保护者奖励。',
      actionType: 'challengeOrClaim',
      actionParams: {},
    },
    {
      text: '随便看看',
      result: '好的，有需要随时来找我。',
      actionType: 'close',
      actionParams: {},
    },
  ],
};

/**
 * 雷鸣矿洞地图赛报名官 NPC 配置
 * 功能：提供雷鸣矿洞地图挑战系统
 * 位置：雷鸣矿洞
 */
const npc_map_challenge_leiming_kuangdong: NPCInteractable = {
  id: 'npc_map_challenge_leiming_kuangdong',
  type: 'npc',
  name: '地图赛报名官',
  icon: '🗺️',
  description: '负责雷鸣矿洞地图挑战系统的官员。成为地图保护者可以获得每日奖励！',
  location: 'leiming-kuangdong',
  npcType: 'function',
  options: [
    {
      text: '查看保护者每天的奖励',
      result: '查看当前地图保护者奖励。',
      actionType: 'viewProtectorReward',
      actionParams: {},
    },
    {
      text: '我来挑战/领取奖励',
      result: '挑战地图或领取保护者奖励。',
      actionType: 'challengeOrClaim',
      actionParams: {},
    },
    {
      text: '随便看看',
      result: '好的，有需要随时来找我。',
      actionType: 'close',
      actionParams: {},
    },
  ],
};

/**
 * 卡萨诺城地图赛报名官 NPC 配置
 * 功能：提供卡萨诺城地图挑战系统
 * 位置：卡萨诺城
 */
const npc_map_challenge_kasanuocheng: NPCInteractable = {
  id: 'npc_map_challenge_kasanuocheng',
  type: 'npc',
  name: '地图赛报名官',
  icon: '🗺️',
  description: '负责卡萨诺城地图挑战系统的官员。成为地图保护者可以获得每日奖励！',
  location: 'kasanuocheng',
  npcType: 'function',
  options: [
    {
      text: '查看保护者每天的奖励',
      result: '查看当前地图保护者奖励。',
      actionType: 'viewProtectorReward',
      actionParams: {},
    },
    {
      text: '我来挑战/领取奖励',
      result: '挑战地图或领取保护者奖励。',
      actionType: 'challengeOrClaim',
      actionParams: {},
    },
    {
      text: '随便看看',
      result: '好的，有需要随时来找我。',
      actionType: 'close',
      actionParams: {},
    },
  ],
};

/**
 * 亚维特岛地图赛报名官 NPC 配置
 * 功能：提供亚维特岛地图挑战系统
 * 位置：亚维特岛
 */
const npc_map_challenge_yaweite_dao: NPCInteractable = {
  id: 'npc_map_challenge_yaweite_dao',
  type: 'npc',
  name: '地图赛报名官',
  icon: '🗺️',
  description: '负责亚维特岛地图挑战系统的官员。成为地图保护者可以获得每日奖励！',
  location: 'yaweite-dao',
  npcType: 'function',
  options: [
    {
      text: '查看保护者每天的奖励',
      result: '查看当前地图保护者奖励。',
      actionType: 'viewProtectorReward',
      actionParams: {},
    },
    {
      text: '我来挑战/领取奖励',
      result: '挑战地图或领取保护者奖励。',
      actionType: 'challengeOrClaim',
      actionParams: {},
    },
    {
      text: '随便看看',
      result: '好的，有需要随时来找我。',
      actionType: 'close',
      actionParams: {},
    },
  ],
};

/**
 * 火山地图赛报名官 NPC 配置
 * 功能：提供火山地图挑战系统
 * 位置：火山
 */
const npc_map_challenge_huoshan: NPCInteractable = {
  id: 'npc_map_challenge_huoshan',
  type: 'npc',
  name: '地图赛报名官',
  icon: '🗺️',
  description: '负责火山地图挑战系统的官员。成为地图保护者可以获得每日奖励！',
  location: 'huoshan',
  npcType: 'function',
  options: [
    {
      text: '查看保护者每天的奖励',
      result: '查看当前地图保护者奖励。',
      actionType: 'viewProtectorReward',
      actionParams: {},
    },
    {
      text: '我来挑战/领取奖励',
      result: '挑战地图或领取保护者奖励。',
      actionType: 'challengeOrClaim',
      actionParams: {},
    },
    {
      text: '随便看看',
      result: '好的，有需要随时来找我。',
      actionType: 'close',
      actionParams: {},
    },
  ],
};

/**
 * 戈壁地图赛报名官 NPC 配置
 * 功能：提供戈壁地图挑战系统
 * 位置：戈壁
 */
const npc_map_challenge_gebi: NPCInteractable = {
  id: 'npc_map_challenge_gebi',
  type: 'npc',
  name: '地图赛报名官',
  icon: '🗺️',
  description: '负责戈壁地图挑战系统的官员。成为地图保护者可以获得每日奖励！',
  location: 'gebi',
  npcType: 'function',
  options: [
    {
      text: '查看保护者每天的奖励',
      result: '查看当前地图保护者奖励。',
      actionType: 'viewProtectorReward',
      actionParams: {},
    },
    {
      text: '我来挑战/领取奖励',
      result: '挑战地图或领取保护者奖励。',
      actionType: 'challengeOrClaim',
      actionParams: {},
    },
    {
      text: '随便看看',
      result: '好的，有需要随时来找我。',
      actionType: 'close',
      actionParams: {},
    },
  ],
};

/**
 * 深渊迷宫地图赛报名官 NPC 配置
 * 功能：提供深渊迷宫地图挑战系统
 * 位置：深渊迷宫
 */
const npc_map_challenge_shenyuan_migong: NPCInteractable = {
  id: 'npc_map_challenge_shenyuan_migong',
  type: 'npc',
  name: '地图赛报名官',
  icon: '🗺️',
  description: '负责深渊迷宫地图挑战系统的官员。成为地图保护者可以获得每日奖励！',
  location: 'shenyuan-migong',
  npcType: 'function',
  options: [
    {
      text: '查看保护者每天的奖励',
      result: '查看当前地图保护者奖励。',
      actionType: 'viewProtectorReward',
      actionParams: {},
    },
    {
      text: '我来挑战/领取奖励',
      result: '挑战地图或领取保护者奖励。',
      actionType: 'challengeOrClaim',
      actionParams: {},
    },
    {
      text: '随便看看',
      result: '好的，有需要随时来找我。',
      actionType: 'close',
      actionParams: {},
    },
  ],
};

/**
 * 迷梦沼泽地图赛报名官 NPC 配置
 * 功能：提供迷梦沼泽地图挑战系统
 * 位置：迷梦沼泽
 */
const npc_map_challenge_mimeng_zhaozhe: NPCInteractable = {
  id: 'npc_map_challenge_mimeng_zhaozhe',
  type: 'npc',
  name: '地图赛报名官',
  icon: '🗺️',
  description: '负责迷梦沼泽地图挑战系统的官员。成为地图保护者可以获得每日奖励！',
  location: 'mimeng-zhaozhe',
  npcType: 'function',
  options: [
    {
      text: '查看保护者每天的奖励',
      result: '查看当前地图保护者奖励。',
      actionType: 'viewProtectorReward',
      actionParams: {},
    },
    {
      text: '我来挑战/领取奖励',
      result: '挑战地图或领取保护者奖励。',
      actionType: 'challengeOrClaim',
      actionParams: {},
    },
    {
      text: '随便看看',
      result: '好的，有需要随时来找我。',
      actionType: 'close',
      actionParams: {},
    },
  ],
};

/**
 * 冰宫地图赛报名官 NPC 配置
 * 功能：提供冰宫地图挑战系统
 * 位置：冰宫
 */
const npc_map_challenge_binggong: NPCInteractable = {
  id: 'npc_map_challenge_binggong',
  type: 'npc',
  name: '地图赛报名官',
  icon: '🗺️',
  description: '负责冰宫地图挑战系统的官员。成为地图保护者可以获得每日奖励！',
  location: 'binggong',
  npcType: 'function',
  options: [
    {
      text: '查看保护者每天的奖励',
      result: '查看当前地图保护者奖励。',
      actionType: 'viewProtectorReward',
      actionParams: {},
    },
    {
      text: '我来挑战/领取奖励',
      result: '挑战地图或领取保护者奖励。',
      actionType: 'challengeOrClaim',
      actionParams: {},
    },
    {
      text: '随便看看',
      result: '好的，有需要随时来找我。',
      actionType: 'close',
      actionParams: {},
    },
  ],
};

/**
 * 雪域边境地图赛报名官 NPC 配置
 * 功能：提供雪域边境地图挑战系统
 * 位置：雪域边境
 */
const npc_map_challenge_xueyu_bianjing: NPCInteractable = {
  id: 'npc_map_challenge_xueyu_bianjing',
  type: 'npc',
  name: '地图赛报名官',
  icon: '🗺️',
  description: '负责雪域边境地图挑战系统的官员。成为地图保护者可以获得每日奖励！',
  location: 'xueyu-bianjing',
  npcType: 'function',
  options: [
    {
      text: '查看保护者每天的奖励',
      result: '查看当前地图保护者奖励。',
      actionType: 'viewProtectorReward',
      actionParams: {},
    },
    {
      text: '我来挑战/领取奖励',
      result: '挑战地图或领取保护者奖励。',
      actionType: 'challengeOrClaim',
      actionParams: {},
    },
    {
      text: '随便看看',
      result: '好的，有需要随时来找我。',
      actionType: 'close',
      actionParams: {},
    },
  ],
};

/**
 * PK赛报名官 NPC 配置
 * 功能：提供PK比赛报名功能
 * 位置：皇宫
 * 开放时间：周六
 */
const npc_pk_match: NPCInteractable = {
  id: 'npc_pk_match',
  type: 'npc',
  name: 'PK赛报名官',
  icon: '⚔️',
  description: '负责PK比赛报名的官员。周六开放PK赛，丰厚奖励等你来拿！',
  location: 'huanggong',
  npcType: 'function',
  options: [
    {
      text: '查看奖品',
      result: 'PK赛奖励：\n\n60级组：高级飞天连斩、大量经验、魔石\n\n100级组：高级飞天连斩、大量经验、魔石、月光宝盒加强版\n\n100级以上组：高级斗志抑扬、大量经验、魔石、月光宝盒加强版、电浆药水、999朵白玫瑰',
      actionType: 'showHelp',
      actionParams: { topic: 'pkReward' },
    },
    {
      text: '我来报名参加',
      result: '报名参加PK比赛。',
      actionType: 'registerPK',
      actionParams: {},
      condition: {
        type: 'weekday',
        value: '星期六',
      },
    },
    {
      text: '随便看看',
      result: '好的，周六记得来参加PK赛！',
      actionType: 'close',
      actionParams: {},
    },
  ],
};

/**
 * 抽奖官 NPC 配置
 * 功能：提供抽奖系统
 * 位置：卡萨诺城
 */
const npc_lottery: NPCInteractable = {
  id: 'npc_lottery',
  type: 'npc',
  name: '抽奖官',
  icon: '🎰',
  description: '国家为了鼓励勇士们英勇奋战，特别开设一抽奖房。抽奖房里的宝箱有各种各样的好东西，甚至是稀世极品，只要你花上28魔石就能打开一个宝箱，每个宝箱都有可能得到极品的哦。',
  location: 'kasanuocheng',
  npcType: 'function',
  options: [
    {
      text: '好吧，让我来试试我的运气',
      result: '传送到抽奖房。',
      actionType: 'teleportToLottery',
      actionParams: { targetLocation: 'lottery-area' },
    },
    {
      text: '关于抽奖',
      result: '查看抽奖系统说明。',
      actionType: 'showHelp',
      actionParams: { topic: 'lottery' },
    },
    {
      text: '我没什么兴趣',
      result: '好的，有需要再来找我。',
      actionType: 'close',
      actionParams: {},
    },
  ],
};

// ==================== 商店 NPC 配置 ====================

/**
 * 宝石合成师 NPC 配置
 * 功能：提供宝石合成功能
 * 位置：树心城（使用雷鸣大陆作为位置）
 */
const npc_gem_synthesizer: NPCInteractable = {
  id: 'npc_gem_synthesizer',
  type: 'npc',
  name: '宝石合成师',
  icon: '💎',
  description: '精通宝石合成的工匠，可以将低级宝石合成为高级宝石。',
  location: 'leiming-dalu',
  npcType: 'shop',
  options: [
    {
      text: '合成魔魂之心',
      result: '使用5个魔魂晶石合成魔魂之心。',
      actionType: 'synthesize',
      actionParams: { item: '魔魂之心', materials: { '魔魂晶石': 5 } },
    },
    {
      text: '合成幻魔之心',
      result: '使用5个幻魔晶石合成幻魔之心。',
      actionType: 'synthesize',
      actionParams: { item: '幻魔之心', materials: { '幻魔晶石': 5 } },
    },
    {
      text: '合成灵魂王',
      result: '使用20个灵魂晶石合成灵魂王。',
      actionType: 'synthesize',
      actionParams: { item: '灵魂王', materials: { '灵魂晶石': 20 } },
    },
    {
      text: '合成高级经验石',
      result: '使用10个中级经验石合成高级经验石。',
      actionType: 'synthesize',
      actionParams: { item: '高级经验石', materials: { '中级经验石': 10 } },
    },
    {
      text: '合成高级战斗力石',
      result: '使用10个中级战斗力石合成高级战斗力石。',
      actionType: 'synthesize',
      actionParams: { item: '高级战斗力石', materials: { '中级战斗力石': 10 } },
    },
  ],
};

/**
 * 收藏家 NPC 配置
 * 功能：提供物品收藏与交易，高价收购珍稀物品和极品装备
 * 位置：卡萨诺城
 */
const npc_collector: NPCInteractable = {
  id: 'npc_collector',
  type: 'npc',
  name: '收藏家',
  icon: '🏺',
  description: '我们家族是世袭公爵家族，我向来喜欢收藏各种珍稀名贵物品。\n我现在很想收集的是金矿、灵魂王、电浆药水、999朵白玫瑰、月光宝盒和满经验球等等...\n还有我正在收集各种各样的极品装备，只要是极品我都要，如果其它属性很好的话我还会出更高的价钱给你。\n如果你有什么好东西别忘了先找找我吧，我要的东西我会出很高的魔石价钱和你交易的。',
  location: 'kasanuocheng',
  npcType: 'shop',
  options: [
    {
      text: '我有些好东西要卖',
      result: '打开收藏家交易界面。',
      actionType: 'openCollector',
      actionParams: {},
    },
    {
      text: '我没什么想卖的',
      result: '好的，有需要再来找我。',
      actionType: 'close',
      actionParams: {},
    },
  ],
};

/**
 * 幻兽研究所 NPC 配置
 * 功能：提供幻兽购买、VIP系统
 * 位置：树心城（使用雷鸣大陆作为位置）
 */
const npc_pet_institute: NPCInteractable = {
  id: 'npc_pet_institute',
  type: 'npc',
  name: '幻兽研究所',
  icon: '🔬',
  description: '专门研究幻兽培养技术的机构。可以购买幻兽，提升VIP等级享受折扣。',
  location: 'leiming-dalu',
  npcType: 'shop',
  options: [
    {
      text: '进入',
      result: '进入幻兽购买界面。',
      actionType: 'openPetShop',
      actionParams: {},
    },
    {
      text: '研究所的当前信息',
      result: '查看技术等级和库存信息。\n\n技术等级：初始10级，最高120级\n20级以上才能生产幻兽\n\nVIP系统：完成任务提高VIP星级\nVIP星级越高购买折扣越大',
      actionType: 'viewInstituteInfo',
      actionParams: {},
    },
    {
      text: '关于2008奥运使者',
      result: '接受奥运任务。',
      actionType: 'acceptOlympicTask',
      actionParams: {},
    },
    {
      text: '提高产量任务',
      result: '提交灵魂王提高产量，获得大量经验和VIP星级+1。',
      actionType: 'improveProduction',
      actionParams: { requirement: '灵魂王 × (当前产量+1)' },
    },
  ],
};

// ==================== 特殊 NPC 配置 ====================

/**
 * 2008奥运使者 NPC 配置
 * 功能：提供2008奥运活动任务
 * 位置：树心城（使用雷鸣大陆作为位置）
 */
const npc_olympic_envoy: NPCInteractable = {
  id: 'npc_olympic_envoy',
  type: 'npc',
  name: '2008奥运使者',
  icon: '🏅',
  description: '2008年北京奥运会的使者，带来了特殊的奥运任务。',
  location: 'leiming-dalu',
  npcType: 'special',
  options: [
    {
      text: '接受奥运任务',
      result: '帮助幻兽研究所打听幻兽培养技术。完成5个奥运项目任务，可以提升幻兽研究所技术等级上限。',
      actionType: 'acceptOlympicTask',
      actionParams: {},
    },
    {
      text: '查看任务进度',
      result: '查看当前奥运任务完成进度。',
      actionType: 'viewOlympicProgress',
      actionParams: {},
    },
    {
      text: '离开',
      result: '祝你在奥运任务中取得好成绩！',
      actionType: 'close',
      actionParams: {},
    },
  ],
};

/**
 * 探险家 NPC 配置
 * 功能：提供探险任务和奖励
 * 位置：各地图
 */
const npc_explorer: NPCInteractable = {
  id: 'npc_explorer',
  type: 'npc',
  name: '探险家',
  icon: '🧭',
  description: '经验丰富的探险家，在各地图游历，提供探险任务和奖励。',
  location: 'leiming-dalu',
  npcType: 'special',
  options: [
    {
      text: '接受探险任务',
      result: '接受探险任务，探索未知的领域。',
      actionType: 'acceptExploreTask',
      actionParams: {},
    },
    {
      text: '领取探险奖励',
      result: '领取已完成的探险任务奖励。',
      actionType: 'claimExploreReward',
      actionParams: {},
    },
    {
      text: '关于探险',
      result: '探险说明：\n\n探险任务会引导你前往各个地图探索。\n完成探险任务可以获得丰厚奖励。\n\n祝你好运，冒险者！',
      actionType: 'showHelp',
      actionParams: { topic: 'explore' },
    },
  ],
};

// ==================== 商店 NPC 配置 ====================

/**
 * 杂货商 NPC 配置
 * 功能：提供金币购买和出售物品的功能
 * 位置：卡萨诺城
 */
const npc_grocery_merchant: NPCInteractable = {
  id: 'npc_grocery_merchant',
  type: 'npc',
  name: '杂货商',
  icon: '🏪',
  description: '卡萨诺城的杂货商，出售各种消耗品和材料，也收购玩家不需要的物品。',
  location: 'kasanuocheng',
  npcType: 'shop',
  options: [
    {
      text: '购买物品',
      result: '欢迎光临！请随意挑选。',
      actionType: 'openShop',
      actionParams: { shopType: 'gold' },
    },
    {
      text: '出售物品',
      result: '有什么不需要的物品吗？我会以合理的价格收购。',
      actionType: 'openSellMode',
      actionParams: { shopType: 'gold' },
    },
    {
      text: '离开',
      result: '欢迎下次再来！',
      actionType: 'close',
      actionParams: {},
    },
  ],
};

/**
 * 魔石商人 NPC 配置
 * 功能：提供魔石购买珍贵物品和幻兽的功能
 * 位置：卡萨诺城
 */
const npc_magic_stone_merchant: NPCInteractable = {
  id: 'npc_magic_stone_merchant',
  type: 'npc',
  name: '魔石商人',
  icon: '💎',
  description: '神秘的魔石商人，出售珍贵的物品和幻兽，只接受魔石交易。',
  location: 'kasanuocheng',
  npcType: 'shop',
  options: [
    {
      text: '购买物品',
      result: '用魔石可以买到很多珍贵的东西哦！',
      actionType: 'openShop',
      actionParams: { shopType: 'magicStone' },
    },
    {
      text: '出售物品',
      result: '我不收物品，只卖东西哦。',
      actionType: 'showMessage',
      actionParams: { message: '魔石商人不收购物品。' },
    },
    {
      text: '离开',
      result: '期待你的下次光临！',
      actionType: 'close',
      actionParams: {},
    },
  ],
};

/**
 * 装备打造师 NPC 配置
 * 功能：提供装备精炼、魔魂等级提升、品质提升、开洞、镶嵌宝石、战魂功能
 * 位置：卡萨诺城
 */
const npc_equipment_refiner: NPCInteractable = {
  id: 'npc_equipment_refiner',
  type: 'npc',
  name: '装备打造师',
  icon: '⚒️',
  description: '精通装备精炼的工匠，可以提升装备的品质、魔魂等级、开洞和镶嵌宝石。',
  location: 'kasanuocheng',
  npcType: 'shop',
  options: [
    {
      text: '我要精练我的装备',
      result: '打开装备精炼界面。',
      actionType: 'openRefine',
      actionParams: {},
    },
    {
      text: '关于提升魔魂等级',
      result: '提升魔魂等级：魔魂等级最高可以+12，魔魂等级可以追加装备的攻击或防御属性，每一级追加装备基本属性的10%。\n如果全套装备都有魔魂等级还可以加战斗力，比如全套装备都是魔魂等级+9的就加9战斗力。\n魔魂等级可以用[魔魂晶石]或[魔魂之心]来提升，[魔魂之心]在+9之前可以使用，成功率为100%，+9之后只能用[魔魂晶石]追加。\n魔魂等级在升级时如果成功则升一级，如果失败就会降一级，+9之后不会再降低于+9了。',
      actionType: 'showHelp',
      actionParams: { topic: 'soulLevel' },
    },
    {
      text: '关于提升品质',
      result: '提升品质：装备品质有白品、良品、上品、精品、极品五个等级，\n白品加1战斗力、良品加2战斗力、上品加3战斗力、精品加4战斗力、极品加5战斗力。\n装备的品质可以用[灵魂晶石]或[灵魂王]来精练提升等级。',
      actionType: 'showHelp',
      actionParams: { topic: 'quality' },
    },
    {
      text: '关于装备开洞',
      result: '装备开洞：可以用[月光宝盒]或[月光宝盒加强版]给装备开洞，\n开第一个洞时要使用[月光宝盒]，开第二个洞时要使用[月光宝盒加强版]。\n先把装备放上，把月光宝盒放到"宝石"的位置，再点开始。',
      actionType: 'showHelp',
      actionParams: { topic: 'socket' },
    },
    {
      text: '关于镶嵌宝石',
      result: '镶嵌宝石：可以给有[洞]的装备镶嵌宝石，可以镶嵌中级经验石、中级战斗力石、高级经验石和高级战斗力石。\n一个洞只能镶嵌一个宝石。',
      actionType: 'showHelp',
      actionParams: { topic: 'gemInlay' },
    },
    {
      text: '关于战魂',
      result: '谢谢你，年轻的勇士。我已经看懂了你带给我有关战魂的秘密。\n装备在升极品时或都开洞时都可能会使装备激发出战魂，但是机率非常之小。\n在BOSS手中有一种叫做[战魂晶石]的宝石用来激发装备战魂机率较高。\n还有一种叫做[战魂之心]的稀有宝石，可惜不知来源...\n只有在精练装备的时候战魂等级才可能得到提升，所以对于战魂装备来说，越差的装备升级潜力越大。',
      actionType: 'showHelp',
      actionParams: { topic: 'warSoul' },
      condition: {
        type: 'warSoulEnabled',
        value: true,
      },
    },
  ],
};

// ==================== NPC 配置映射表 ====================

/**
 * NPC 配置映射表
 * 将所有 NPC 配置按ID组织，便于快速查找
 */
export const npcConfig: Record<string, NPCInteractable> = {
  // 皇宫 NPC
  npc_king,
  npc_princess,
  npc_marshal,
  npc_prime_minister,
  npc_maid_1,
  npc_maid_2,
  // 功能 NPC
  npc_daily_task,
  npc_map_challenge,
  npc_pk_match,
  npc_lottery,
  // 各地图地图赛报名官 NPC
  npc_map_challenge_leiming_kuangdong,
  npc_map_challenge_kasanuocheng,
  npc_map_challenge_yaweite_dao,
  npc_map_challenge_huoshan,
  npc_map_challenge_gebi,
  npc_map_challenge_shenyuan_migong,
  npc_map_challenge_mimeng_zhaozhe,
  npc_map_challenge_binggong,
  npc_map_challenge_xueyu_bianjing,
  // 商店 NPC
  npc_gem_synthesizer,
  npc_collector,
  npc_pet_institute,
  npc_grocery_merchant,
  npc_magic_stone_merchant,
  npc_equipment_refiner,
  // 特殊 NPC
  npc_olympic_envoy,
  npc_explorer,
};

/**
 * 按类型分组的 NPC 配置
 */
export const npcByType: Record<string, NPCInteractable[]> = {
  palace: [npc_king, npc_princess, npc_marshal, npc_prime_minister, npc_maid_1, npc_maid_2],
  function: [
    npc_daily_task,
    npc_map_challenge,
    npc_pk_match,
    npc_lottery,
    npc_map_challenge_leiming_kuangdong,
    npc_map_challenge_kasanuocheng,
    npc_map_challenge_yaweite_dao,
    npc_map_challenge_huoshan,
    npc_map_challenge_gebi,
    npc_map_challenge_shenyuan_migong,
    npc_map_challenge_mimeng_zhaozhe,
    npc_map_challenge_binggong,
    npc_map_challenge_xueyu_bianjing,
  ],
  shop: [npc_gem_synthesizer, npc_collector, npc_pet_institute, npc_grocery_merchant, npc_magic_stone_merchant, npc_equipment_refiner],
  special: [npc_olympic_envoy, npc_explorer],
};

/**
 * 按位置分组的 NPC 配置
 */
export const npcByLocation: Record<string, NPCInteractable[]> = {
  huanggong: [npc_king, npc_marshal, npc_prime_minister, npc_maid_1, npc_maid_2, npc_pk_match],
  houhuayuan: [npc_princess],
  'leiming-dalu': [npc_daily_task, npc_map_challenge, npc_gem_synthesizer, npc_pet_institute, npc_olympic_envoy, npc_explorer],
  'leiming-kuangdong': [npc_map_challenge_leiming_kuangdong],
  kasanuocheng: [npc_lottery, npc_map_challenge_kasanuocheng, npc_collector, npc_grocery_merchant, npc_magic_stone_merchant, npc_equipment_refiner],
  'yaweite-dao': [npc_map_challenge_yaweite_dao],
  huoshan: [npc_map_challenge_huoshan],
  gebi: [npc_map_challenge_gebi],
  'shenyuan-migong': [npc_map_challenge_shenyuan_migong],
  'mimeng-zhaozhe': [npc_map_challenge_mimeng_zhaozhe],
  binggong: [npc_map_challenge_binggong],
  'xueyu-bianjing': [npc_map_challenge_xueyu_bianjing],
};

/**
 * 获取指定地图的 NPC ID 列表
 * @param locationId 地图ID
 * @returns NPC ID 数组
 */
export function getNpcIdsByLocation(locationId: string): string[] {
  const npcs = npcByLocation[locationId] || [];
  return npcs.map(npc => npc.id);
}

/**
 * 获取指定类型的 NPC ID 列表
 * @param npcType NPC类型
 * @returns NPC ID 数组
 */
export function getNpcIdsByType(npcType: 'palace' | 'function' | 'shop' | 'special'): string[] {
  const npcs = npcByType[npcType] || [];
  return npcs.map(npc => npc.id);
}

/**
 * 检查 NPC 选项是否满足显示条件
 * @param option NPC 交互选项
 * @param gameState 游戏状态（包含星期、关系等级、军衔、爵位等信息）
 * @returns 是否满足条件
 */
export function checkNpcOptionCondition(
  option: NPCInteractionOption,
  gameState: {
    weekday?: string;
    relationship?: number;
    militaryRank?: number;
    nobleRank?: number;
  }
): boolean {
  // 如果没有条件，默认显示
  if (!option.condition) {
    return true;
  }

  const { type, value, operator = 'eq' } = option.condition;

  switch (type) {
    case 'weekday':
      return gameState.weekday === value;
    
    case 'relationship':
      if (gameState.relationship === undefined) return false;
      return compareValues(gameState.relationship, value, operator);
    
    case 'militaryRank':
      if (gameState.militaryRank === undefined) return false;
      return compareValues(gameState.militaryRank, value, operator);
    
    case 'nobleRank':
      if (gameState.nobleRank === undefined) return false;
      return compareValues(gameState.nobleRank, value, operator);
    
    default:
      return true;
  }
}

/**
 * 比较数值的辅助函数
 * @param actual 实际值
 * @param expected 期望值
 * @param operator 比较运算符
 * @returns 比较结果
 */
function compareValues(actual: number, expected: any, operator: string): boolean {
  const expectedNum = Number(expected);
  switch (operator) {
    case 'eq':
      return actual === expectedNum;
    case 'gt':
      return actual > expectedNum;
    case 'gte':
      return actual >= expectedNum;
    case 'lt':
      return actual < expectedNum;
    case 'lte':
      return actual <= expectedNum;
    case 'ne':
      return actual !== expectedNum;
    default:
      return false;
  }
}

/**
 * 获取 NPC 可用的交互选项列表
 * @param npcId NPC ID
 * @param gameState 游戏状态
 * @returns 可用的交互选项列表
 */
export function getAvailableNpcOptions(
  npcId: string,
  gameState: {
    weekday?: string;
    relationship?: number;
    militaryRank?: number;
    nobleRank?: number;
  }
): NPCInteractionOption[] {
  const npc = npcConfig[npcId];
  if (!npc) {
    return [];
  }

  return npc.options.filter(option => checkNpcOptionCondition(option, gameState));
}
