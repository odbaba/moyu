/**
 * 位置类型定义
 * 定义游戏中位置的数据结构
 */
export interface Location {
  /** 位置唯一ID */
  id: string;
  /** 位置名称 */
  name: string;
  /** 位置描述 */
  description: string;
  /** 相邻位置ID列表 */
  adjacentLocations: string[];
  /** 可交互对象ID列表（引用interactableConfig中的ID） */
  interactables: string[];
  /** X坐标 */
  x: number;
  /** Y坐标 */
  y: number;
}

/**
 * 交互选项类型定义（旧版，保留兼容性）
 * @deprecated 请使用 NPCInteractionOption
 */
export interface InteractionOption {
  text: string;
  result: string;
}

/**
 * 交互对象类型定义（旧版，保留兼容性）
 * @deprecated 请使用 NPCInteractable
 */
export interface Interaction {
  description: string;
  options: InteractionOption[];
}

/**
 * 位置数据类型定义
 */
export type LocationData = Location[];

/**
 * 交互数据类型定义（旧版，保留兼容性）
 * @deprecated 请使用 interactableConfig
 */
export interface InteractionData {
  [key: string]: Interaction;
}

/**
 * 位置数据 - 魔域新地图
 * 坐标系统：x从左到右增大，y从上到下增大
 * 北边 = y更小，南边 = y更大
 * 西边 = x更小，东边 = x更大
 * 
 * 怪物交互ID说明：
 * - 雷鸣大陆：1个怪物按钮
 * - 戈壁：5个怪物按钮
 * - 迷梦沼泽：4个怪物按钮
 * - 冰宫：4个怪物按钮
 * - 亚维特岛：4个怪物按钮
 * - 火山：5个怪物按钮
 * - 深渊迷宫：6个怪物按钮
 */
export const locations: LocationData = [
  // y=0 - 第一行
  {
    id: 'leiming-kuangdong',
    name: '雷鸣矿洞',
    description: '雷鸣矿洞是亚特大陆最大的矿区，蕴含着丰富的矿藏。',
    adjacentLocations: ['leiming-dalu'],
    // 雷鸣矿洞：4个采矿按钮 + 地图赛报名官
    interactables: ['mining_1', 'mining_2', 'mining_3', 'mining_4', 'npc_map_challenge_leiming_kuangdong'],
    x: 0,
    y: 0
  },
  {
    id: 'huanggong',
    name: '皇宫',
    description: '皇宫是卡萨诺城的政治中心，富丽堂皇。',
    adjacentLocations: ['houhuayuan', 'kasanuocheng'],
    // 皇宫 NPC：国王、元帅、首相、抽奖官、PK赛报名官
    interactables: ['npc_king', 'npc_marshal', 'npc_prime_minister', 'npc_lottery', 'npc_pk_match'],
    x: 2,
    y: 0
  },
  {
    id: 'houhuayuan',
    name: '后花园',
    description: '后花园是皇宫的后花园，风景秀丽。',
    adjacentLocations: ['huanggong'],
    // 后花园 NPC：公主、丫环1、丫环2
    interactables: ['npc_princess', 'npc_maid_1', 'npc_maid_2'],
    x: 3,
    y: 0
  },

  // y=1 - 第二行
  {
    id: 'leiming-dalu',
    name: '雷鸣大陆',
    description: '雷鸣大陆是亚特大陆的核心区域，连接各方势力交汇之地。',
    adjacentLocations: ['leiming-kuangdong', 'kasanuocheng'],
    // 雷鸣大陆：3个怪物按钮（龙怪x1、巨杰士x2）+ 功能 NPC（日常任务官、地图赛报名官、宝石合成师、幻兽研究所、2008奥运使者、探险家）
    interactables: [
      'interact-leiming-longguai',
      'interact-leiming-jujieshi-1',
      'interact-leiming-jujieshi-2',
      'npc_daily_task',
      'npc_map_challenge',
      'npc_gem_synthesizer',
      'npc_pet_institute',
      'npc_olympic_envoy',
      'npc_explorer'
    ],
    x: 1,
    y: 1
  },
  {
    id: 'kasanuocheng',
    name: '卡萨诺城',
    description: '卡萨诺城是亚特大陆最繁华的城市，商贸云集。',
    adjacentLocations: ['huanggong', 'leiming-dalu', 'yaweite-dao', 'gebi'],
    // 卡萨诺城 NPC：地图赛报名官、收藏家、杂货商、魔石商人、装备打造师
    interactables: ['npc_map_challenge_kasanuocheng', 'npc_collector', 'npc_grocery_merchant', 'npc_magic_stone_merchant', 'npc_equipment_refiner'],
    x: 2,
    y: 1
  },
  {
    id: 'yaweite-dao',
    name: '亚维特岛',
    description: '亚维特岛是一座神秘的岛屿，充满了未知的宝藏。',
    adjacentLocations: ['kasanuocheng', 'binggong', 'huoshan'],
    // 亚维特岛：4个怪物按钮（鱼妖、恐兽、巨斧怪、蜘蛛王后艾达）+ 地图赛报名官
    interactables: [
      'interact-yaweite-yuyao',
      'interact-yaweite-kongshou',
      'interact-yaweite-jufuguai',
      'interact-yaweite-zhizhuwanghou',
      'npc_map_challenge_yaweite_dao'
    ],
    x: 3,
    y: 1
  },
  {
    id: 'huoshan',
    name: '火山',
    description: '火山是一座活火山，熔岩滚滚，危险重重。',
    adjacentLocations: ['yaweite-dao', 'shenyuan-migong'],
    // 火山：5个怪物按钮（蝎怪、四牙怪、炎女、随机怪物x2）+ 地图赛报名官
    interactables: [
      'interact-huoshan-xieguai',
      'interact-huoshan-siyaguai',
      'interact-huoshan-yannu',
      'interact-huoshan-random1',
      'interact-huoshan-random2',
      'npc_map_challenge_huoshan'
    ],
    x: 5,
    y: 1
  },
  {
    // 抽奖区：独立地点，七个宝箱 + 返回按钮
    id: 'lottery-area',
    name: '抽奖区',
    description: '神秘的抽奖房间，七个宝箱等待着幸运的冒险者',
    adjacentLocations: [],
    interactables: [
      'lottery_box_1',
      'lottery_box_2',
      'lottery_box_3',
      'lottery_box_4',
      'lottery_box_5',
      'lottery_box_6',
      'lottery_box_7',
      'lottery_return_button'
    ],
    x: 10,
    y: 1
  },

  // y=2 - 第三行
  {
    id: 'gebi',
    name: '戈壁',
    description: '戈壁是一片荒凉的沙漠地带，风沙漫天。',
    adjacentLocations: ['kasanuocheng', 'mimeng-zhaozhe'],
    // 戈壁：5个怪物按钮（冰妖剑士、杰克灯笼、提风、随机怪物x2）+ 地图赛报名官
    interactables: [
      'interact-gebi-bingyaojianshi',
      'interact-gebi-jiekedenglong',
      'interact-gebi-tifeng',
      'interact-gebi-random1',
      'interact-gebi-random2',
      'npc_map_challenge_gebi'
    ],
    x: 2,
    y: 2
  },
  {
    id: 'shenyuan-migong',
    name: '深渊迷宫',
    description: '深渊迷宫是一座错综复杂的地下迷宫，充满了危险。',
    adjacentLocations: ['huoshan'],
    // 深渊迷宫：6个怪物按钮（暗黑格拉斯、叹息骑士、暗黑弥塞亚、骑士亡魂、随机怪物x2）+ 地图赛报名官
    interactables: [
      'interact-shenyuan-anheigelasi',
      'interact-shenyuan-tanxiqishi',
      'interact-shenyuan-anheimisaiya',
      'interact-shenyuan-qishiwanghun',
      'interact-shenyuan-random1',
      'interact-shenyuan-random2',
      'npc_map_challenge_shenyuan_migong'
    ],
    x: 5,
    y: 2
  },

  // y=3 - 第四行
  {
    id: 'mimeng-zhaozhe',
    name: '迷梦沼泽',
    description: '迷梦沼泽是一片充满迷雾的沼泽地，令人迷失方向。',
    adjacentLocations: ['gebi', 'binggong'],
    // 迷梦沼泽：4个怪物按钮（角蜥、望齿魔人、蜘蛛、随机怪物x1）+ 地图赛报名官
    interactables: [
      'interact-mimeng-jiaoxi',
      'interact-mimeng-wangchimoren',
      'interact-mimeng-zhizhu',
      'interact-mimeng-random1',
      'npc_map_challenge_mimeng_zhaozhe'
    ],
    x: 2,
    y: 3
  },
  {
    id: 'binggong',
    name: '冰宫',
    description: '冰宫是一座由寒冰建造的宫殿，寒冷刺骨。',
    adjacentLocations: ['yaweite-dao', 'mimeng-zhaozhe', 'xueyu-bianjing'],
    // 冰宫：4个怪物按钮（塔亚龙、死亡骑士、随机怪物x2）+ 地图赛报名官
    interactables: [
      'interact-binggong-tayalong',
      'interact-binggong-siwangqishi',
      'interact-binggong-random1',
      'interact-binggong-random2',
      'npc_map_challenge_binggong'
    ],
    x: 3,
    y: 3
  },
  {
    id: 'xueyu-bianjing',
    name: '雪域边境',
    description: '雪域边境是亚特大陆的最北端，终年积雪。',
    adjacentLocations: ['binggong'],
    // 雪域边境：地图赛报名官
    interactables: ['npc_map_challenge_xueyu_bianjing'],
    x: 4,
    y: 3
  }
];

/**
 * 连接关系 - 魔域新地图
 * 定义各位置之间的连接关系
 */
export const connections = [
  // y=0 到 y=1 纵向
  ['leiming-kuangdong', 'leiming-dalu'],
  ['huanggong', 'kasanuocheng'],

  // y=0 横向
  ['huanggong', 'houhuayuan'],

  // y=1 横向
  ['leiming-dalu', 'kasanuocheng'],
  ['kasanuocheng', 'yaweite-dao'],
  ['yaweite-dao', 'huoshan'],

  // y=1 到 y=2 纵向
  ['kasanuocheng', 'gebi'],
  ['huoshan', 'shenyuan-migong'],

  // y=2 到 y=3 纵向
  ['gebi', 'mimeng-zhaozhe'],
  ['yaweite-dao', 'binggong'],

  // y=3 横向
  ['mimeng-zhaozhe', 'binggong'],
  ['binggong', 'xueyu-bianjing']
];

/**
 * 交互数据（旧版，保留兼容性）
 * @deprecated 请使用 interactableConfig
 */
export const interactions: InteractionData = {};
