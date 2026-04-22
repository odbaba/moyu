/**
 * NPC 配置数据文件
 * 定义游戏中所有可交互 NPC 的配置数据
 * 参考文档：reference/docs/scripts_analysis/14_NPC系统.md
 */

// 导入 NPC 相关类型
import type {
  NPCInteractable,
  NPCInteractionOption,
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
 * 关系等级：0-未认识、1-认识、2-普通朋友、3-好朋友、4-知己、5-恋人、6-亲密恋人
 */
const npc_princess: NPCInteractable = {
  id: 'npc_princess',
  type: 'npc',
  name: '公主',
  icon: '👸',
  // 描述中包含关系等级提示，帮助玩家了解当前关系状态
  description: '国王的女儿，美丽而善良。与她建立良好关系可以获得丰厚的奖励。\n【提示】可通过"查看关系"了解当前关系等级和亲密度。',
  location: 'houhuayuan',
  npcType: 'palace',
  options: [
    // 查看关系选项：显示当前关系等级、亲密度和升级需求
    {
      text: '查看关系',
      result: '查看与公主的关系详情。\n显示内容：当前关系等级、亲密度、升级到下一级所需亲密度。',
      actionType: 'viewRelationship',
      actionParams: {},
    },
    // 知己的礼物选项：关系等级达到4（知己）及以上时可领取年猪（一次性）
    {
      text: '知己的礼物',
      result: '获得超级幻兽年猪！',
      actionType: 'receiveConfidantGift',
      actionParams: { giftType: 'yearPig', requirement: 'relationship >= 4' },
      condition: {
        type: 'relationship',
        value: 4,
        operator: 'gte',
      },
    },
    // 聊天选项：每天一次，增加亲密度+1，根据关系等级获得不同幻兽奖励
    {
      text: '聊天',
      result: '与公主聊天，增加友好度。每天只能聊天一次。',
      actionType: 'chat',
      actionParams: { dailyLimit: true },
    },
    // 送礼选项：仅周日可用，送花增加亲密度
    {
      text: '送礼',
      result: '从背包中选择玫瑰花送给公主，增加友好度。',
      actionType: 'sendGift',
      actionParams: { giftType: 'flowers' },
      condition: {
        type: 'weekday',
        value: 0, // 0=周日
      },
    },
    // 周日礼物选项：仅周日可用，根据关系等级获得不同宝石奖励
    {
      text: '星期天的礼物',
      result: '获得宝石奖励！',
      actionType: 'receiveWeeklyGift',
      actionParams: { giftType: 'gem' },
      condition: {
        type: 'weekday',
        value: 0, // 0=周日
      },
    },
  ],
};

/**
 * 元帅 NPC 配置
 * 功能：提供军衔系统、军饷领取、BOSS情报功能
 * 位置：皇宫
 * 参考文档：reference/docs/元帅与首相交互逻辑文档.md
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
      result: '领取本周军饷（魔石奖励）。\n少将以上额外获得"高级斗志抑扬"。',
      actionType: 'receiveSalary',
      actionParams: { weeklyLimit: true },
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
    {
      text: '没事',
      result: '好的，有需要再来找我。',
      actionType: 'close',
      actionParams: {},
    },
  ],
};

/**
 * 首相 NPC 配置
 * 功能：提供爵位系统、捐献金币、功勋查询、国王消息功能
 * 位置：皇宫
 * 参考文档：reference/docs/元帅与首相交互逻辑文档.md
 */
const npc_prime_minister: NPCInteractable = {
  id: 'npc_prime_minister',
  type: 'npc',
  name: '首相',
  icon: '🎩',
  description: '亚特大陆的首相，负责爵位晋升和功勋管理。',
  location: 'huanggong',
  npcType: 'palace',
  options: [
    {
      text: '捐献金币',
      result: '捐献金币获得功勋。\n兑换比例：每750,000金币 = 1功勋',
      actionType: 'donateGold',
      actionParams: {},
    },
    {
      text: '功勋查询',
      result: '查看当前功勋和晋升需求。',
      actionType: 'queryMerit',
      actionParams: {},
    },
    {
      text: '关于国王的消息',
      result: '查看国王当前状态。',
      actionType: 'queryKingStatus',
      actionParams: {},
    },
    {
      text: '关于爵位',
      result: '查看爵位系统说明。\n\n爵位等级：平民、勋爵、子爵、伯爵、公爵、侯爵、王\n\n爵位可以通过积累功勋来提升。',
      actionType: 'showHelp',
      actionParams: { topic: 'nobleRank' },
    },
    {
      text: '没事',
      result: '好的，有需要再来找我。',
      actionType: 'close',
      actionParams: {},
    },
  ],
};

/**
 * 丫环1 NPC 配置（公主侍女）
 * 功能：出售高级战斗力石
 * 位置：后花园（公主所在地）
 * 参考文档：reference/docs/project_docs/10_公主系统.md（侍女1部分）
 */
const npc_maid_1: NPCInteractable = {
  id: 'npc_maid_1',
  type: 'npc',
  name: '丫环',
  icon: '👘',
  // 丫环1的描述：自小跟随公主，与公主有福共享
  description: '我自小跟随公主，公主向来与我们有福共享...',
  location: 'houhuayuan',
  npcType: 'palace',
  options: [
    // 购买高级战斗力石选项：价格2,800魔石，每天限购一个
    {
      text: '购买高级战斗力石（2,800魔石）',
      result: '购买高级战斗力石，镶嵌后战斗力+5%。\n【限制】每天只能购买一个。',
      actionType: 'buyItem',
      actionParams: {
        itemId: 'gaojizhandoushili',
        price: 2800,
        currency: 'magicStone',
        dailyLimit: true,
        limitCount: 1,
      },
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
 * 丫环2 NPC 配置（公主侍女）
 * 功能：出售年猪幻兽
 * 位置：后花园（公主所在地）
 * 参考文档：reference/docs/project_docs/10_公主系统.md（侍女2部分）
 */
const npc_maid_2: NPCInteractable = {
  id: 'npc_maid_2',
  type: 'npc',
  name: '丫环',
  icon: '👘',
  // 丫环2的描述：公主的侍女，公主待她如同姐妹
  description: '我是公主的侍女，公主平时代我如同姐妹一样亲...',
  location: 'houhuayuan',
  npcType: 'palace',
  options: [
    // 购买年猪选项：价格5,888魔石，仅限购买一个（一次性购买）
    {
      text: '购买年猪（5,888魔石）',
      result: '购买超级幻兽年猪！\n【限制】只能购买一个。',
      actionType: 'buyPet',
      actionParams: {
        petType: 'nianzhu',
        price: 5888,
        currency: 'magicStone',
        oneTimeLimit: true,
      },
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
 * 参考文档：reference/docs/日常任务官交互逻辑文档.md
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
 * 地图占领赛报名官 NPC 配置
 * 功能：提供地图挑战系统、保护者奖励
 * 位置：各地图
 */
const npc_map_challenge: NPCInteractable = {
  id: 'npc_map_challenge',
  type: 'npc',
  name: '地图占领赛报名官',
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
 * 卡萨诺城地图占领赛报名官 NPC 配置
 * 功能：提供卡萨诺城地图挑战系统
 * 位置：卡萨诺城
 */
const npc_map_challenge_kasanuocheng: NPCInteractable = {
  id: 'npc_map_challenge_kasanuocheng',
  type: 'npc',
  name: '地图占领赛报名官',
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
 * 亚维特岛地图占领赛报名官 NPC 配置
 * 功能：提供亚维特岛地图挑战系统
 * 位置：亚维特岛
 */
const npc_map_challenge_yaweite_dao: NPCInteractable = {
  id: 'npc_map_challenge_yaweite_dao',
  type: 'npc',
  name: '地图占领赛报名官',
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
 * 戈壁地图占领赛报名官 NPC 配置
 * 功能：提供戈壁地图挑战系统
 * 位置：戈壁
 */
const npc_map_challenge_gebi: NPCInteractable = {
  id: 'npc_map_challenge_gebi',
  type: 'npc',
  name: '地图占领赛报名官',
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
 * 迷梦沼泽地图占领赛报名官 NPC 配置
 * 功能：提供迷梦沼泽地图挑战系统
 * 位置：迷梦沼泽
 */
const npc_map_challenge_mimeng_zhaozhe: NPCInteractable = {
  id: 'npc_map_challenge_mimeng_zhaozhe',
  type: 'npc',
  name: '地图占领赛报名官',
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
 * 冰宫地图占领赛报名官 NPC 配置
 * 功能：提供冰宫地图挑战系统
 * 位置：冰宫
 */
const npc_map_challenge_binggong: NPCInteractable = {
  id: 'npc_map_challenge_binggong',
  type: 'npc',
  name: '地图占领赛报名官',
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

/**
 * 幻兽幻化师 NPC 配置
 * 功能：提供幻兽幻化功能，将副幻兽属性转移给主幻兽
 * 位置：卡萨诺城
 */
const npc_pet_fusion_master: NPCInteractable = {
  id: 'npc_pet_fusion_master',
  type: 'npc',
  name: '幻兽幻化师',
  icon: '🔮',
  description: '精通幻兽幻化之术的大师，可以将副幻兽的属性转移给主幻兽，大幅提升主幻兽的成长率和属性值。',
  location: 'kasanuocheng',
  npcType: 'function',
  options: [
    {
      text: '进行幻化',
      result: '打开幻兽幻化界面。',
      actionType: 'openPetFusion',
      actionParams: {},
    },
    {
      text: '关于幻化',
      result: '幻化系统说明：\n\n【幻化条件】\n- 主幻兽等级必须达到50级\n- 副幻兽类型必须与主幻兽相同或为奇异兽\n- 副幻兽评分需达到要求（主幻兽评分越高，要求越高）\n\n【幻化效果】\n- 主属性幻化：根据幻兽类型获得不同的成长率加成\n- 副属性幻化：继承副幻兽较高的生命和防御成长率（90%）\n- 初始属性幻化：继承副幻兽较高的初始属性（85%）\n\n【评分要求】\n- 主幻兽评分 < 1500：无要求\n- 主幻兽评分 >= 1500：要求 = (主幻兽评分 - 500) / 2\n\n【顿悟机制】\n- 幻化后升级到50级时有概率触发顿悟\n- 顿悟可恢复到幻化前的等级\n\n【注意事项】\n- 副幻兽会被消耗，请谨慎选择\n- 幻化后主幻兽等级重置为1级',
      actionType: 'showHelp',
      actionParams: { topic: 'petFusion' },
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
 * 戈壁探险家 NPC 配置
 * 功能：声称知道战魂秘密，实则是骗局NPC（解锁条件：全身极品装备到达卡萨诺城）
 * 位置：戈壁
 * 参考文档：reference/docs/探险家NPC交互逻辑文档.md
 */
const npc_explorer_gebi: NPCInteractable = {
  id: 'npc_explorer_gebi',
  type: 'npc',
  name: '探险家',
  icon: '🧭',
  description: '　　小伙子，看你东张西望的，是不是在寻找有关战魂的秘密？这里有条路是通往一个地方，我在那里见过一个箱子，也许有关战魂的秘密就在里面......\n　　如果你愿意付给我50,000魔石作路费我可以带你去。\n　　不过，要还看你有没有本事拿得到箱子里的东西。',
  location: 'gebi',
  npcType: 'special',
  options: [
    {
      text: '太好了，那正是我要找的地方',
      result: '支付50,000魔石，让探险家带路。',
      actionType: 'payForExplore',
      actionParams: { cost: 50000 },
    },
    {
      text: '要那么多钱啊。我还是自己找算了',
      result: '好的，有需要再来找我。',
      actionType: 'close',
      actionParams: {},
    },
  ],
};

/**
 * 神秘人 NPC 配置
 * 功能：战魂封印迷宫的前置NPC，点击后消失并出现无名氏敌人
 * 位置：战魂封印迷宫
 * 参考文档：reference/docs/无名氏NPC交互逻辑文档.md
 */
const npc_mysterious_person: NPCInteractable = {
  id: 'npc_mysterious_person',
  type: 'npc',
  name: '神秘人',
  icon: '👤',
  description: '一个神秘的身影，似乎知道战魂的秘密。',
  location: 'zhanhun-fengyin-migong',
  npcType: 'special',
  options: [
    {
      text: '打探战魂的秘密',
      result: '小子，你的装备也不错啊。想有打探有关战魂的秘密吧，先打赢我再说吧。',
      actionType: 'triggerMysteriousPerson',
      actionParams: {},
    },
  ],
};

// ==================== 商店 NPC 配置 ====================

/**
 * 宝石合成师 NPC 配置
 * 功能：提供宝石合成功能
 * 位置：树心城（使用雷鸣大陆作为位置）
 * 参考文档：reference/docs/宝石合成师交互逻辑文档.md
 */
const npc_gem_synthesizer: NPCInteractable = {
  id: 'npc_gem_synthesizer',
  type: 'npc',
  name: '宝石合成师',
  icon: '💎',
  description: '精通宝石合成的工匠，可以将低级宝石合成为高级宝石。合成成功率100%！',
  location: 'leiming-dalu',
  npcType: 'function',
  options: [
    {
      text: '合成魔魂之心（需5个魔魂晶石）',
      result: '使用5个魔魂晶石合成魔魂之心，提升装备魔魂等级（+9前100%成功）。',
      actionType: 'synthesize',
      actionParams: { recipeId: 'mohunzhixin' },
    },
    {
      text: '合成幻魔之心（需5个幻魔晶石）',
      result: '使用5个幻魔晶石合成幻魔之心，提升装备使用等级（100%成功）。',
      actionType: 'synthesize',
      actionParams: { recipeId: 'huanmozhixin' },
    },
    {
      text: '合成灵魂王（需20个灵魂晶石）',
      result: '使用20个灵魂晶石合成灵魂王，提升装备品质等级（100%成功）。',
      actionType: 'synthesize',
      actionParams: { recipeId: 'linghunwang' },
    },
    {
      text: '合成高级经验石（需10个中级经验石）',
      result: '使用10个中级经验石合成高级经验石，镶嵌后经验值+50%。',
      actionType: 'synthesize',
      actionParams: { recipeId: 'gaojijingyanshi' },
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
 * 功能：提供幻兽购买、VIP系统、提高产量任务
 * 位置：树心城（使用雷鸣大陆作为位置）
 * 参考文档：reference/docs/幻兽研究所交互逻辑文档.md
 */
const npc_pet_institute: NPCInteractable = {
  id: 'npc_pet_institute',
  type: 'npc',
  name: '幻兽研究所',
  icon: '🔬',
  description: '专门研究幻兽培养技术的机构。可以购买奇异兽，提升VIP等级享受折扣。',
  location: 'leiming-dalu',
  npcType: 'function',
  options: [
    {
      text: '进入（购买奇异兽）',
      result: '进入幻兽购买界面。',
      actionType: 'openPetInstitute',
      actionParams: {},
    },
    {
      text: '研究所的当前信息',
      result: '查看技术等级、库存、VIP等级等信息。',
      actionType: 'viewInstituteInfo',
      actionParams: {},
    },
    {
      text: '提高产量任务（周日开放）',
      result: '提交灵魂王提高产量，获得大量经验和VIP星级+1。\n\n所需灵魂王数量 = 当前产量 + 1\n经验奖励 = 105000 × (当前产量 + 1)',
      actionType: 'improveProduction',
      actionParams: {},
    },
    {
      text: '关于2008奥运使者',
      result: '完成奥运任务后，幻兽研究所技术等级上限可提升至150级。',
      actionType: 'viewOlympicInfo',
      actionParams: {},
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

/**
 * 经验导师 NPC 配置
 * 功能：提供装备换经验球功能
 * 位置：卡萨诺城
 */
const npc_experience_mentor: NPCInteractable = {
  id: 'npc_experience_mentor',
  type: 'npc',
  name: '经验导师',
  icon: '🔮',
  description: '每一件装备都有都有一股神秘的力量，我可以帮你将其提练出来放到经验球里面。只有良品以上或都有洞的装备才可以提练。\n\n良品可以换1个满的经验球，上品可以换2个，精品可以换3个，极品可以换4个。如果装备有一个洞的话可以多2个经验球，二洞多5个。魔魂等级达到+9的可以多换1，达到+12的多2个。',
  location: 'kasanuocheng',
  npcType: 'function',
  options: [
    {
      text: '用装备换经验球',
      result: '打开装备交换界面。',
      actionType: 'openExperienceExchange',
      actionParams: {},
    },
    {
      text: '哦，知道了',
      result: '好的，有需要再来找我。',
      actionType: 'close',
      actionParams: {},
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
  npc_pet_fusion_master,
  npc_experience_mentor,
  // 各地图地图占领赛报名官 NPC
  npc_map_challenge_kasanuocheng,
  npc_map_challenge_yaweite_dao,
  npc_map_challenge_gebi,
  npc_map_challenge_mimeng_zhaozhe,
  npc_map_challenge_binggong,
  // 商店 NPC
  npc_gem_synthesizer,
  npc_collector,
  npc_pet_institute,
  npc_grocery_merchant,
  npc_magic_stone_merchant,
  npc_equipment_refiner,
  // 特殊 NPC
  npc_olympic_envoy,
  npc_explorer_gebi,
  npc_mysterious_person,
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
    npc_pet_fusion_master,
    npc_experience_mentor,
    npc_map_challenge_kasanuocheng,
    npc_map_challenge_yaweite_dao,
    npc_map_challenge_gebi,
    npc_map_challenge_mimeng_zhaozhe,
    npc_map_challenge_binggong,
  ],
  shop: [npc_gem_synthesizer, npc_collector, npc_pet_institute, npc_grocery_merchant, npc_magic_stone_merchant, npc_equipment_refiner],
  special: [npc_olympic_envoy, npc_explorer_gebi, npc_mysterious_person],
};

/**
 * 按位置分组的 NPC 配置
 */
export const npcByLocation: Record<string, NPCInteractable[]> = {
  // 皇宫NPC：国王、元帅、首相、PK赛报名官
  huanggong: [npc_king, npc_marshal, npc_prime_minister, npc_pk_match],
  // 后花园NPC：公主、丫环1（出售高级战斗力石）、丫环2（出售年猪）
  houhuayuan: [npc_princess, npc_maid_1, npc_maid_2],
  'leiming-dalu': [npc_daily_task, npc_map_challenge, npc_gem_synthesizer, npc_pet_institute, npc_olympic_envoy],
  kasanuocheng: [npc_lottery, npc_pet_fusion_master, npc_map_challenge_kasanuocheng, npc_collector, npc_grocery_merchant, npc_magic_stone_merchant, npc_equipment_refiner, npc_experience_mentor],
  'yaweite-dao': [npc_map_challenge_yaweite_dao],
  gebi: [npc_map_challenge_gebi, npc_explorer_gebi],
  'mimeng-zhaozhe': [npc_map_challenge_mimeng_zhaozhe],
  binggong: [npc_map_challenge_binggong],
  'zhanhun-fengyin-migong': [npc_mysterious_person],
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
