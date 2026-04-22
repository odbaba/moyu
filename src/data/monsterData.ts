/**
 * 怪物数据文件
 * 定义各地图的怪物模板数据和刷新配置
 * 参考文档：reference/docs/project_docs/04_怪物系统.md
 */

import type { MonsterSpawnConfig, MonsterTemplate } from '../types';

// ========== 怪物模板数据 ==========

/**
 * 怪物模板映射表
 * 以怪物ID为索引，存储所有怪物的模板数据
 */
export const monsterTemplates: Record<string, MonsterTemplate> = {
  // ========== 雷鸣大陆怪物 ==========
  // 龙怪：雷鸣大陆的基础怪物，适合新手玩家
  'long-guai': {
    id: 'long-guai',
    name: '龙怪',
    type: 'normal',
    level: 5,
    combatPower: 5,
    location: 'leiming-dalu',
    icon: '🐉',
    description: '雷鸣大陆最常见的怪物，适合新手练级。',
    baseHp: 300,
    growthHp: 100,
    baseAttackMin: 5,
    growthAttackMin: 20,
    baseAttackMax: 15,
    growthAttackMax: 20,
    baseDefense: 0,
    growthDefense: 20,
  },
  // 巨杰士：雷鸣大陆的中级怪物，比龙怪稍强
  'ju-jieshi': {
    id: 'ju-jieshi',
    name: '巨杰士',
    type: 'normal',
    level: 1,
    combatPower: 1,
    location: 'leiming-dalu',
    icon: '👹',
    description: '雷鸣大陆的中级怪物，攻击力比龙怪更强。',
    baseHp: 300,
    growthHp: 100,
    baseAttackMin: 5,
    growthAttackMin: 25,
    baseAttackMax: 25,
    growthAttackMax: 30,
    baseDefense: 0,
    growthDefense: 20,
  },

  // ========== 戈壁怪物 ==========
  // 冰妖剑士：戈壁的基础怪物，攻击力较高
  'bingyao-jianshi': {
    id: 'bingyao-jianshi',
    name: '冰妖剑士',
    type: 'normal',
    level: 10,
    combatPower: 10,
    location: 'gebi',
    icon: '⚔️',
    description: '戈壁的常见怪物，手持冰剑，攻击力不俗。',
    baseHp: 300,
    growthHp: 200,
    baseAttackMin: 20,
    growthAttackMin: 25,
    baseAttackMax: 100,
    growthAttackMax: 30,
    baseDefense: 0,
    growthDefense: 20,
  },
  // 杰克灯笼：戈壁的中级怪物，攻击力更强
  'jieke-denglong': {
    id: 'jieke-denglong',
    name: '杰克灯笼',
    type: 'normal',
    level: 15,
    combatPower: 15,
    location: 'gebi',
    icon: '🏮',
    description: '戈壁的中级怪物，散发着诡异的光芒。',
    baseHp: 300,
    growthHp: 200,
    baseAttackMin: 50,
    growthAttackMin: 25,
    baseAttackMax: 100,
    growthAttackMax: 30,
    baseDefense: 0,
    growthDefense: 20,
  },
  // 提风：戈壁的高级怪物，有防御力
  'tifeng': {
    id: 'tifeng',
    name: '提风',
    type: 'normal',
    level: 25,
    combatPower: 25,
    location: 'gebi',
    icon: '🌪️',
    description: '戈壁的强力怪物，拥有一定的防御能力。',
    baseHp: 300,
    growthHp: 200,
    baseAttackMin: 100,
    growthAttackMin: 25,
    baseAttackMax: 300,
    growthAttackMax: 30,
    baseDefense: 50,
    growthDefense: 20,
  },

  // ========== 迷梦沼泽怪物 ==========
  // 角蜥：迷梦沼泽的基础怪物
  'jiaoxi': {
    id: 'jiaoxi',
    name: '角蜥',
    type: 'normal',
    level: 35,
    combatPower: 35,
    location: 'mimeng-zhaozhe',
    icon: '🦎',
    description: '迷梦沼泽的常见怪物，行动敏捷。',
    baseHp: 500,
    growthHp: 250,
    baseAttackMin: 100,
    growthAttackMin: 35,
    baseAttackMax: 100,
    growthAttackMax: 55,
    baseDefense: 100,
    growthDefense: 33,
  },
  // 望齿魔人：迷梦沼泽的中级怪物
  'wangchi-moren': {
    id: 'wangchi-moren',
    name: '望齿魔人',
    type: 'normal',
    level: 45,
    combatPower: 45,
    location: 'mimeng-zhaozhe',
    icon: '👺',
    description: '迷梦沼泽的中级怪物，攻击力强大。',
    baseHp: 500,
    growthHp: 250,
    baseAttackMin: 100,
    growthAttackMin: 35,
    baseAttackMax: 100,
    growthAttackMax: 55,
    baseDefense: 100,
    growthDefense: 33,
  },
  // 蜘蛛：迷梦沼泽的特殊怪物，掉落技能书
  'zhizhu': {
    id: 'zhizhu',
    name: '蜘蛛',
    type: 'special',
    level: 45,
    combatPower: 45,
    location: 'mimeng-zhaozhe',
    icon: '🕷️',
    description: '迷梦沼泽的特殊怪物，击杀后有机会获得技能书。',
    baseHp: 500,
    growthHp: 2500,
    baseAttackMin: 100,
    growthAttackMin: 52.5,
    baseAttackMax: 100,
    growthAttackMax: 82.5,
    baseDefense: 100,
    growthDefense: 49.5,
  },

  // ========== 冰宫怪物 ==========
  // 塔亚龙：冰宫的基础怪物
  'taya-long': {
    id: 'taya-long',
    name: '塔亚龙',
    type: 'normal',
    level: 55,
    combatPower: 55,
    location: 'binggong',
    icon: '🐲',
    description: '冰宫的常见怪物，冰霜巨龙的后裔。',
    baseHp: 500,
    growthHp: 250,
    baseAttackMin: 100,
    growthAttackMin: 35,
    baseAttackMax: 100,
    growthAttackMax: 55,
    baseDefense: 100,
    growthDefense: 33,
  },
  // 死亡骑士：冰宫的高级怪物
  'siwang-qishi': {
    id: 'siwang-qishi',
    name: '死亡骑士',
    type: 'normal',
    level: 65,
    combatPower: 65,
    location: 'binggong',
    icon: '💀',
    description: '冰宫的强力怪物，曾经是英勇的骑士。',
    baseHp: 500,
    growthHp: 250,
    baseAttackMin: 100,
    growthAttackMin: 35,
    baseAttackMax: 100,
    growthAttackMax: 55,
    baseDefense: 100,
    growthDefense: 33,
  },

  // ========== 亚维特岛怪物 ==========
  // 鱼妖：亚维特岛的基础怪物
  'yuyao': {
    id: 'yuyao',
    name: '鱼妖',
    type: 'normal',
    level: 70,
    combatPower: 70,
    location: 'yaweite-dao',
    icon: '🐟',
    description: '亚维特岛的常见怪物，来自深海。',
    baseHp: 1000,
    growthHp: 300,
    baseAttackMin: 300,
    growthAttackMin: 50,
    baseAttackMax: 300,
    growthAttackMax: 88,
    baseDefense: 300,
    growthDefense: 45,
  },
  // 恐兽：亚维特岛的中级怪物
  'kongshou': {
    id: 'kongshou',
    name: '恐兽',
    type: 'normal',
    level: 75,
    combatPower: 75,
    location: 'yaweite-dao',
    icon: '🦁',
    description: '亚维特岛的中级怪物，凶猛异常。',
    baseHp: 1000,
    growthHp: 300,
    baseAttackMin: 300,
    growthAttackMin: 50,
    baseAttackMax: 300,
    growthAttackMax: 88,
    baseDefense: 300,
    growthDefense: 45,
  },
  // 巨斧怪：亚维特岛的高级怪物
  'jufu-guai': {
    id: 'jufu-guai',
    name: '巨斧怪',
    type: 'normal',
    level: 80,
    combatPower: 80,
    location: 'yaweite-dao',
    icon: '🪓',
    description: '亚维特岛的强力怪物，手持巨斧。',
    baseHp: 1000,
    growthHp: 300,
    baseAttackMin: 300,
    growthAttackMin: 50,
    baseAttackMax: 300,
    growthAttackMax: 88,
    baseDefense: 300,
    growthDefense: 45,
  },
  // 蜘蛛王后艾达：亚维特岛的特殊怪物，顶级掉落
  'zhizhu-wanghou-aida': {
    id: 'zhizhu-wanghou-aida',
    name: '蜘蛛王后艾达',
    type: 'special',
    level: 80,
    combatPower: 80,
    location: 'yaweite-dao',
    icon: '👸',
    description: '亚维特岛的特殊怪物，击杀后有机会获得稀有装备和技能书。',
    baseHp: 1000,
    growthHp: 4500,
    baseAttackMin: 300,
    growthAttackMin: 75,
    baseAttackMax: 300,
    growthAttackMax: 132,
    baseDefense: 300,
    growthDefense: 67.5,
  },

  // ========== 火山怪物 ==========
  // 蝎怪：火山的基础怪物
  'xieguai': {
    id: 'xieguai',
    name: '蝎怪',
    type: 'normal',
    level: 85,
    combatPower: 85,
    location: 'huoshan',
    icon: '🦂',
    description: '火山的常见怪物，尾部有剧毒。',
    baseHp: 1000,
    growthHp: 300,
    baseAttackMin: 300,
    growthAttackMin: 50,
    baseAttackMax: 300,
    growthAttackMax: 88,
    baseDefense: 300,
    growthDefense: 45,
  },
  // 四牙怪：火山的中级怪物
  'siya-guai': {
    id: 'siya-guai',
    name: '四牙怪',
    type: 'normal',
    level: 90,
    combatPower: 90,
    location: 'huoshan',
    icon: '🦷',
    description: '火山的中级怪物，四颗獠牙锋利无比。',
    baseHp: 1000,
    growthHp: 300,
    baseAttackMin: 300,
    growthAttackMin: 50,
    baseAttackMax: 300,
    growthAttackMax: 88,
    baseDefense: 300,
    growthDefense: 45,
  },
  // 炎女：火山的高级怪物
  'yannu': {
    id: 'yannu',
    name: '炎女',
    type: 'normal',
    level: 95,
    combatPower: 95,
    location: 'huoshan',
    icon: '🔥',
    description: '火山的强力怪物，掌控火焰之力。',
    baseHp: 1000,
    growthHp: 300,
    baseAttackMin: 300,
    growthAttackMin: 50,
    baseAttackMax: 300,
    growthAttackMax: 88,
    baseDefense: 300,
    growthDefense: 45,
  },

  // ========== 深渊迷宫怪物 ==========
  // 暗黑格拉斯：深渊迷宫的基础怪物
  'anhei-gelasi': {
    id: 'anhei-gelasi',
    name: '暗黑格拉斯',
    type: 'normal',
    level: 100,
    combatPower: 100,
    location: 'shenyuan-migong',
    icon: '🌑',
    description: '深渊迷宫的常见怪物，黑暗力量的化身。',
    baseHp: 1000,
    growthHp: 300,
    baseAttackMin: 300,
    growthAttackMin: 50,
    baseAttackMax: 300,
    growthAttackMax: 88,
    baseDefense: 300,
    growthDefense: 45,
  },
  // 叹息骑士：深渊迷宫的中级怪物
  'tanxi-qishi': {
    id: 'tanxi-qishi',
    name: '叹息骑士',
    type: 'normal',
    level: 110,
    combatPower: 110,
    location: 'shenyuan-migong',
    icon: '🗡️',
    description: '深渊迷宫的中级怪物，永远在叹息。',
    baseHp: 10000,
    growthHp: 400,
    baseAttackMin: 500,
    growthAttackMin: 75,
    baseAttackMax: 500,
    growthAttackMax: 112,
    baseDefense: 500,
    growthDefense: 64,
  },
  // 暗黑弥塞亚：深渊迷宫的高级怪物
  'anhei-misaiya': {
    id: 'anhei-misaiya',
    name: '暗黑弥塞亚',
    type: 'normal',
    level: 120,
    combatPower: 120,
    location: 'shenyuan-migong',
    icon: '😈',
    description: '深渊迷宫的强力怪物，黑暗的使者。',
    baseHp: 10000,
    growthHp: 400,
    baseAttackMin: 500,
    growthAttackMin: 75,
    baseAttackMax: 500,
    growthAttackMax: 112,
    baseDefense: 500,
    growthDefense: 64,
  },
  // 骑士亡魂：深渊迷宫的特殊怪物
  'qishi-wanghun': {
    id: 'qishi-wanghun',
    name: '骑士亡魂',
    type: 'special',
    level: 100,
    combatPower: 100,
    location: 'shenyuan-migong',
    icon: '👻',
    description: '深渊迷宫的特殊怪物，战魂系统开启后掉落战魂晶石。',
    baseHp: 1000,
    growthHp: 300,
    baseAttackMin: 300,
    growthAttackMin: 50,
    baseAttackMax: 300,
    growthAttackMax: 88,
    baseDefense: 300,
    growthDefense: 45,
  },

  // ========== 雪域边境怪物 ==========
  // 冰雪巨人士兵：雪域边境的基础怪物，击杀获得500战功
  // 属性来源：reference/scripts/DefineSprite_118_选择怪物/frame_25/DoAction.as
  'bingxue-juren-shibing': {
    id: 'bingxue-juren-shibing',
    name: '冰雪巨人士兵',
    type: 'normal',
    level: 200,
    combatPower: 100,
    location: 'xueyu-bianjing',
    icon: '🧊',
    description: '雪域边境的魔族士兵，击杀后获得500点战功。',
    baseHp: 10000,
    growthHp: 200,
    baseAttackMin: 500,
    growthAttackMin: 55,
    baseAttackMax: 500,
    growthAttackMax: 88,
    baseDefense: 500,
    growthDefense: 40,
  },
  // 冰雪巨人士官：雪域边境的中级怪物，击杀获得2000战功
  // 属性来源：reference/scripts/DefineSprite_118_选择怪物/frame_26/DoAction.as
  'bingxue-juren-shiguan': {
    id: 'bingxue-juren-shiguan',
    name: '冰雪巨人士官',
    type: 'normal',
    level: 400,
    combatPower: 200,
    location: 'xueyu-bianjing',
    icon: '❄️',
    description: '雪域边境的魔族士官，击杀后获得2000点战功，有概率掉落战魂之心。',
    baseHp: 10000,
    growthHp: 200,
    baseAttackMin: 500,
    growthAttackMin: 55,
    baseAttackMax: 500,
    growthAttackMax: 88,
    baseDefense: 500,
    growthDefense: 40,
  },
  // 冰雪巨人军官：雪域边境的高级怪物，击杀获得5000战功
  // 属性来源：reference/scripts/DefineSprite_118_选择怪物/frame_27/DoAction.as
  'bingxue-juren-junguan': {
    id: 'bingxue-juren-junguan',
    name: '冰雪巨人军官',
    type: 'special',
    level: 500,
    combatPower: 500,
    location: 'xueyu-bianjing',
    icon: '👑',
    description: '雪域边境的魔族军官，击杀后获得5000点战功，必定掉落战魂之心。',
    baseHp: 10000,
    growthHp: 200,
    baseAttackMin: 500,
    growthAttackMin: 55,
    baseAttackMax: 500,
    growthAttackMax: 88,
    baseDefense: 500,
    growthDefense: 40,
  },

  // 无名氏：战魂封印迷宫的特殊怪物，击败后获得战魂之心
  // 属性根据玩家等级动态计算：等级=max(玩家等级,50)，生命值=4000×等级，攻击=112.5~168×等级，防御=96×等级
  'wumingshi': {
    id: 'wumingshi',
    name: '无名氏',
    type: 'special',
    level: 50, // 基础等级，实际等级在战斗时动态计算
    combatPower: 150, // 基础战斗力，实际战斗力 = 100 + 等级
    location: 'zhanhun-fengyin-migong',
    icon: '🎭',
    description: '守护战魂秘密的神秘人，击败后将获得战魂之心。\n等级会根据你的等级动态调整，最低50级。',
    baseHp: 0,
    growthHp: 4000, // 生命值 = 4000 × 等级
    baseAttackMin: 0,
    growthAttackMin: 112.5, // 最小攻击 = 112.5 × 等级
    baseAttackMax: 0,
    growthAttackMax: 168, // 最大攻击 = 168 × 等级
    baseDefense: 0,
    growthDefense: 96, // 防御 = 96 × 等级
  },

  // ========== 地下城怪物 ==========
  // 地下城蝎怪：地下城1层怪物，等级动态等于玩家等级，战斗力也等于玩家等级
  // 属性来源：reference/docs/project_docs/04_怪物系统.md
  'dixiacheng-xieguai': {
    id: 'dixiacheng-xieguai',
    name: '地下城蝎怪',
    type: 'dungeon',
    level: 1, // 基础等级，实际等级在战斗时动态计算为玩家等级
    combatPower: 1, // 基础战斗力，实际战斗力在战斗时动态计算为玩家等级
    location: 'dixiacheng-1',
    icon: '🦂',
    description: '地下城1层的守卫蝎怪，等级和战斗力会根据你的等级动态调整。',
    baseHp: 1000,
    growthHp: 300,
    baseAttackMin: 300,
    growthAttackMin: 50,
    baseAttackMax: 300,
    growthAttackMax: 88,
    baseDefense: 300,
    growthDefense: 45,
  },
  // 地下城骑士亡魂：地下城2层怪物，150级，战斗力200
  // 属性来源：reference/docs/project_docs/04_怪物系统.md
  'dixiacheng-qishiwanghun': {
    id: 'dixiacheng-qishiwanghun',
    name: '骑士亡魂',
    type: 'dungeon',
    level: 150,
    combatPower: 200,
    location: 'dixiacheng-2',
    icon: '👻',
    description: '地下城2层的亡魂骑士，曾经是英勇的骑士，死后被魔族操控。特殊掉落：战魂晶石。',
    baseHp: 10000,
    growthHp: 400,
    baseAttackMin: 500,
    growthAttackMin: 75,
    baseAttackMax: 500,
    growthAttackMax: 112,
    baseDefense: 500,
    growthDefense: 64,
  },
  // 呖风火龙兽：地下城3层怪物，800级，游戏中最强怪物之一
  // 属性来源：reference/scripts/frame_30/PlaceObject2_1074_6/CLIPACTIONRECORD onClipEvent(load).as
  'lifeng-huolongshou': {
    id: 'lifeng-huolongshou',
    name: '呖风火龙兽',
    type: 'dungeon',
    level: 800,
    combatPower: 800,
    location: 'dixiacheng-3',
    icon: '🐉',
    description: '地下城3层的终极BOSS，游戏中最强大的怪物之一，击败它可救出国王。',
    baseHp: 10000,
    growthHp: 400,
    baseAttackMin: 500,
    growthAttackMin: 20,
    baseAttackMax: 500,
    growthAttackMax: 30,
    baseDefense: 500,
    growthDefense: 25,
  },

  // ========== 魔中军阵地怪物（魔族大军）==========
  // 魔军突击队：700级，使所有魔族军队攻击力提高50%
  // 属性来源：reference/docs/project_docs/12_国王系统.md
  'mojun-tujidui': {
    id: 'mojun-tujidui',
    name: '魔军突击队',
    type: 'special',
    level: 700,
    combatPower: 700,
    location: 'mozhongjun-zhendi',
    icon: '⚔️',
    description: '魔族大军的先锋部队，700级。特殊效果：存在时所有魔族军队攻击力提高50%。',
    baseHp: 10000,
    growthHp: 400,
    baseAttackMin: 500,
    growthAttackMin: 75,
    baseAttackMax: 500,
    growthAttackMax: 112,
    baseDefense: 500,
    growthDefense: 64,
  },
  // 魔军守卫军：800级，使所有魔族军队防御提高50%
  'mojun-shouweijun': {
    id: 'mojun-shouweijun',
    name: '魔军守卫军',
    type: 'special',
    level: 800,
    combatPower: 800,
    location: 'mozhongjun-zhendi',
    icon: '🛡️',
    description: '魔族大军的防御主力，800级。特殊效果：存在时所有魔族军队防御提高50%。',
    baseHp: 10000,
    growthHp: 400,
    baseAttackMin: 500,
    growthAttackMin: 75,
    baseAttackMax: 500,
    growthAttackMax: 112,
    baseDefense: 500,
    growthDefense: 64,
  },
  // 魔军神秘部队：900级，使所有魔族军队生命值提高50%
  'mojun-shenmibudui': {
    id: 'mojun-shenmibudui',
    name: '魔军神秘部队',
    type: 'special',
    level: 900,
    combatPower: 900,
    location: 'mozhongjun-zhendi',
    icon: '🔮',
    description: '魔族大军的精锐部队，900级，估计大多数由祭师组成。特殊效果：存在时所有魔族军队生命值提高50%。',
    baseHp: 10000,
    growthHp: 400,
    baseAttackMin: 500,
    growthAttackMin: 75,
    baseAttackMax: 500,
    growthAttackMax: 112,
    baseDefense: 500,
    growthDefense: 64,
  },
  // 魔军图腾兽：1000级，使所有魔族军队战斗力提高50%
  'mojun-tutengshou': {
    id: 'mojun-tutengshou',
    name: '魔军图腾兽',
    type: 'special',
    level: 1000,
    combatPower: 1000,
    location: 'mozhongjun-zhendi',
    icon: '🗿',
    description: '魔族大军的图腾象征，1000级。特殊效果：存在时所有魔族军队战斗力提高50%。',
    baseHp: 10000,
    growthHp: 400,
    baseAttackMin: 500,
    growthAttackMin: 75,
    baseAttackMax: 500,
    growthAttackMax: 112,
    baseDefense: 500,
    growthDefense: 64,
  },
  // 魔的能量：魔族大军的力量源泉，每天复活所有魔族大军
  'mojun-nengliang': {
    id: 'mojun-nengliang',
    name: '魔的能量',
    type: 'special',
    level: 1, // 无等级，设置为1
    combatPower: 500,
    location: 'mozhongjun-zhendi',
    icon: '💫',
    description: '魔族大军的力量源泉，是魔族的生命支柱。特殊效果：每天复活所有被消灭的魔族军队。',
    baseHp: 50000,
    growthHp: 0,
    baseAttackMin: 0,
    growthAttackMin: 0,
    baseAttackMax: 0,
    growthAttackMax: 0,
    baseDefense: 1000,
    growthDefense: 0,
  },
  // 魔军主帅：2000级，魔族大军的最高指挥官
  'mojun-shuai': {
    id: 'mojun-shuai',
    name: '魔军主帅',
    type: 'special',
    level: 2000,
    combatPower: 2000,
    location: 'mozhongjun-zhendi',
    icon: '👿',
    description: '魔族大军的最高指挥官，2000级。负责保护魔的能量不被破坏。只有消灭它才能进一步消灭魔的能量。',
    baseHp: 100000,
    growthHp: 500,
    baseAttackMin: 1000,
    growthAttackMin: 100,
    baseAttackMax: 1000,
    growthAttackMax: 150,
    baseDefense: 1000,
    growthDefense: 80,
  },

  // ========== PK赛BOSS ==========
  // PK赛BOSS：周六PK赛专用BOSS，根据玩家等级分组挑战
  // 属性来源：reference/docs/project_docs/11_PK赛系统.md
  // 属性计算公式：生命值=2000×等级，攻击=112.5~168×等级，防御=96×等级

  // 60级PK赛BOSS：60级组冠军挑战BOSS
  'pk-boss-60': {
    id: 'pk-boss-60',
    name: '60级PK赛BOSS',
    type: 'special',
    level: 60,
    combatPower: 201,
    location: 'pk-arena-1',
    icon: '🏆',
    description: 'PK赛60级组冠军挑战BOSS，击败它获得冠军荣誉！',
    baseHp: 0,
    growthHp: 2000, // 生命值 = 2000 × 60 = 120,000
    baseAttackMin: 0,
    growthAttackMin: 112.5, // 最小攻击 = 112.5 × 60 = 6,750
    baseAttackMax: 0,
    growthAttackMax: 168, // 最大攻击 = 168 × 60 = 10,080
    baseDefense: 0,
    growthDefense: 96, // 防御 = 96 × 60 = 5,760
  },

  // 100级PK赛BOSS：100级组冠军挑战BOSS
  'pk-boss-100': {
    id: 'pk-boss-100',
    name: '100级PK赛BOSS',
    type: 'special',
    level: 100,
    combatPower: 284,
    location: 'pk-arena-2',
    icon: '🏆',
    description: 'PK赛100级组冠军挑战BOSS，击败它获得冠军荣誉！',
    baseHp: 0,
    growthHp: 2000, // 生命值 = 2000 × 100 = 200,000
    baseAttackMin: 0,
    growthAttackMin: 112.5, // 最小攻击 = 112.5 × 100 = 11,250
    baseAttackMax: 0,
    growthAttackMax: 168, // 最大攻击 = 168 × 100 = 16,800
    baseDefense: 0,
    growthDefense: 96, // 防御 = 96 × 100 = 9,600
  },

  // 130级PK赛BOSS：100级以上组冠军挑战BOSS
  'pk-boss-130': {
    id: 'pk-boss-130',
    name: '130级PK赛BOSS',
    type: 'special',
    level: 130,
    combatPower: 374,
    location: 'pk-arena-3',
    icon: '🏆',
    description: 'PK赛100级以上组冠军挑战BOSS，击败它获得冠军荣誉！',
    baseHp: 0,
    growthHp: 2000, // 生命值 = 2000 × 130 = 260,000
    baseAttackMin: 0,
    growthAttackMin: 112.5, // 最小攻击 = 112.5 × 130 = 14,625
    baseAttackMax: 0,
    growthAttackMax: 168, // 最大攻击 = 168 × 130 = 21,840
    baseDefense: 0,
    growthDefense: 96, // 防御 = 96 × 130 = 12,480
  },
};

// ========== 怪物刷新配置 ==========

/**
 * 怪物刷新配置列表
 * 定义各地图怪物的刷新配置
 */
export const monsterSpawnConfigs: MonsterSpawnConfig[] = [
  // ========== 雷鸣大陆怪物刷新配置（3个怪物按钮）==========
  // 龙怪
  {
    id: 'spawn-leiming-longguai',
    templateId: 'long-guai',
    location: 'leiming-dalu',
    spawnVariable: 'leiming_longguai',
    isSpawned: true,
    interactableId: 'interact-leiming-longguai',
  },
  // 巨杰士1
  {
    id: 'spawn-leiming-jujieshi-1',
    templateId: 'ju-jieshi',
    location: 'leiming-dalu',
    spawnVariable: 'leiming_jujieshi_1',
    isSpawned: true,
    interactableId: 'interact-leiming-jujieshi-1',
  },
  // 巨杰士2
  {
    id: 'spawn-leiming-jujieshi-2',
    templateId: 'ju-jieshi',
    location: 'leiming-dalu',
    spawnVariable: 'leiming_jujieshi_2',
    isSpawned: true,
    interactableId: 'interact-leiming-jujieshi-2',
  },

  // ========== 戈壁怪物刷新配置（5个怪物按钮）==========
  // 冰妖剑士
  {
    id: 'spawn-gebi-bingyaojianshi',
    templateId: 'bingyao-jianshi',
    location: 'gebi',
    spawnVariable: 'gebi_bingyaojianshi',
    isSpawned: true,
    interactableId: 'interact-gebi-bingyaojianshi',
  },
  // 杰克灯笼
  {
    id: 'spawn-gebi-jiekedenglong',
    templateId: 'jieke-denglong',
    location: 'gebi',
    spawnVariable: 'gebi_jiekedenglong',
    isSpawned: true,
    interactableId: 'interact-gebi-jiekedenglong',
  },
  // 提风
  {
    id: 'spawn-gebi-tifeng',
    templateId: 'tifeng',
    location: 'gebi',
    spawnVariable: 'gebi_tifeng',
    isSpawned: true,
    interactableId: 'interact-gebi-tifeng',
  },
  // 随机怪物1（冰妖剑士）
  {
    id: 'spawn-gebi-random1',
    templateId: 'bingyao-jianshi',
    location: 'gebi',
    spawnVariable: 'gebi_random1',
    isSpawned: true,
    interactableId: 'interact-gebi-random1',
  },
  // 随机怪物2（杰克灯笼）
  {
    id: 'spawn-gebi-random2',
    templateId: 'jieke-denglong',
    location: 'gebi',
    spawnVariable: 'gebi_random2',
    isSpawned: true,
    interactableId: 'interact-gebi-random2',
  },

  // ========== 迷梦沼泽怪物刷新配置（4个怪物按钮）==========
  // 角蜥
  {
    id: 'spawn-mimeng-jiaoxi',
    templateId: 'jiaoxi',
    location: 'mimeng-zhaozhe',
    spawnVariable: 'mimeng_jiaoxi',
    isSpawned: true,
    interactableId: 'interact-mimeng-jiaoxi',
  },
  // 望齿魔人
  {
    id: 'spawn-mimeng-wangchimoren',
    templateId: 'wangchi-moren',
    location: 'mimeng-zhaozhe',
    spawnVariable: 'mimeng_wangchimoren',
    isSpawned: true,
    interactableId: 'interact-mimeng-wangchimoren',
  },
  // 蜘蛛（特殊怪物）
  {
    id: 'spawn-mimeng-zhizhu',
    templateId: 'zhizhu',
    location: 'mimeng-zhaozhe',
    spawnVariable: 'mimeng_zhizhu',
    isSpawned: true,
    interactableId: 'interact-mimeng-zhizhu',
  },
  // 随机怪物（角蜥）
  {
    id: 'spawn-mimeng-random1',
    templateId: 'jiaoxi',
    location: 'mimeng-zhaozhe',
    spawnVariable: 'mimeng_random1',
    isSpawned: true,
    interactableId: 'interact-mimeng-random1',
  },

  // ========== 冰宫怪物刷新配置（4个怪物按钮）==========
  // 塔亚龙
  {
    id: 'spawn-binggong-tayalong',
    templateId: 'taya-long',
    location: 'binggong',
    spawnVariable: 'binggong_tayalong',
    isSpawned: true,
    interactableId: 'interact-binggong-tayalong',
  },
  // 死亡骑士
  {
    id: 'spawn-binggong-siwangqishi',
    templateId: 'siwang-qishi',
    location: 'binggong',
    spawnVariable: 'binggong_siwangqishi',
    isSpawned: true,
    interactableId: 'interact-binggong-siwangqishi',
  },
  // 随机怪物1（塔亚龙）
  {
    id: 'spawn-binggong-random1',
    templateId: 'taya-long',
    location: 'binggong',
    spawnVariable: 'binggong_random1',
    isSpawned: true,
    interactableId: 'interact-binggong-random1',
  },
  // 随机怪物2（死亡骑士）
  {
    id: 'spawn-binggong-random2',
    templateId: 'siwang-qishi',
    location: 'binggong',
    spawnVariable: 'binggong_random2',
    isSpawned: true,
    interactableId: 'interact-binggong-random2',
  },

  // ========== 亚维特岛怪物刷新配置（4个怪物按钮）==========
  // 鱼妖
  {
    id: 'spawn-yaweite-yuyao',
    templateId: 'yuyao',
    location: 'yaweite-dao',
    spawnVariable: 'yaweite_yuyao',
    isSpawned: true,
    interactableId: 'interact-yaweite-yuyao',
  },
  // 恐兽
  {
    id: 'spawn-yaweite-kongshou',
    templateId: 'kongshou',
    location: 'yaweite-dao',
    spawnVariable: 'yaweite_kongshou',
    isSpawned: true,
    interactableId: 'interact-yaweite-kongshou',
  },
  // 巨斧怪
  {
    id: 'spawn-yaweite-jufuguai',
    templateId: 'jufu-guai',
    location: 'yaweite-dao',
    spawnVariable: 'yaweite_jufuguai',
    isSpawned: true,
    interactableId: 'interact-yaweite-jufuguai',
  },
  // 蜘蛛王后艾达（特殊怪物）
  {
    id: 'spawn-yaweite-zhizhuwanghou',
    templateId: 'zhizhu-wanghou-aida',
    location: 'yaweite-dao',
    spawnVariable: 'yaweite_zhizhuwanghou',
    isSpawned: true,
    interactableId: 'interact-yaweite-zhizhuwanghou',
  },

  // ========== 火山怪物刷新配置（5个怪物按钮）==========
  // 蝎怪
  {
    id: 'spawn-huoshan-xieguai',
    templateId: 'xieguai',
    location: 'huoshan',
    spawnVariable: 'huoshan_xieguai',
    isSpawned: true,
    interactableId: 'interact-huoshan-xieguai',
  },
  // 四牙怪
  {
    id: 'spawn-huoshan-siyaguai',
    templateId: 'siya-guai',
    location: 'huoshan',
    spawnVariable: 'huoshan_siyaguai',
    isSpawned: true,
    interactableId: 'interact-huoshan-siyaguai',
  },
  // 炎女
  {
    id: 'spawn-huoshan-yannu',
    templateId: 'yannu',
    location: 'huoshan',
    spawnVariable: 'huoshan_yannu',
    isSpawned: true,
    interactableId: 'interact-huoshan-yannu',
  },
  // 随机怪物1（蝎怪）
  {
    id: 'spawn-huoshan-random1',
    templateId: 'xieguai',
    location: 'huoshan',
    spawnVariable: 'huoshan_random1',
    isSpawned: true,
    interactableId: 'interact-huoshan-random1',
  },
  // 随机怪物2（四牙怪）
  {
    id: 'spawn-huoshan-random2',
    templateId: 'siya-guai',
    location: 'huoshan',
    spawnVariable: 'huoshan_random2',
    isSpawned: true,
    interactableId: 'interact-huoshan-random2',
  },

  // ========== 深渊迷宫怪物刷新配置（6个怪物按钮）==========
  // 暗黑格拉斯
  {
    id: 'spawn-shenyuan-anheigelasi',
    templateId: 'anhei-gelasi',
    location: 'shenyuan-migong',
    spawnVariable: 'shenyuan_anheigelasi',
    isSpawned: true,
    interactableId: 'interact-shenyuan-anheigelasi',
  },
  // 叹息骑士
  {
    id: 'spawn-shenyuan-tanxiqishi',
    templateId: 'tanxi-qishi',
    location: 'shenyuan-migong',
    spawnVariable: 'shenyuan_tanxiqishi',
    isSpawned: true,
    interactableId: 'interact-shenyuan-tanxiqishi',
  },
  // 暗黑弥塞亚
  {
    id: 'spawn-shenyuan-anheimisaiya',
    templateId: 'anhei-misaiya',
    location: 'shenyuan-migong',
    spawnVariable: 'shenyuan_anheimisaiya',
    isSpawned: true,
    interactableId: 'interact-shenyuan-anheimisaiya',
  },
  // 骑士亡魂（特殊怪物）
  {
    id: 'spawn-shenyuan-qishiwanghun',
    templateId: 'qishi-wanghun',
    location: 'shenyuan-migong',
    spawnVariable: 'shenyuan_qishiwanghun',
    isSpawned: true,
    interactableId: 'interact-shenyuan-qishiwanghun',
  },
  // 随机怪物1（暗黑格拉斯）
  {
    id: 'spawn-shenyuan-random1',
    templateId: 'anhei-gelasi',
    location: 'shenyuan-migong',
    spawnVariable: 'shenyuan_random1',
    isSpawned: true,
    interactableId: 'interact-shenyuan-random1',
  },
  // 随机怪物2（叹息骑士）
  {
    id: 'spawn-shenyuan-random2',
    templateId: 'tanxi-qishi',
    location: 'shenyuan-migong',
    spawnVariable: 'shenyuan_random2',
    isSpawned: true,
    interactableId: 'interact-shenyuan-random2',
  },

  // ========== 雪域边境怪物刷新配置（5个怪物按钮）==========
  // 冰雪巨人士兵1（gw_xybj_1，国王救出后隐藏）
  {
    id: 'spawn-xueyu-shibing-1',
    templateId: 'bingxue-juren-shibing',
    location: 'xueyu-bianjing',
    spawnVariable: 'gw_xybj_1',
    isSpawned: true,
    interactableId: 'interact-xueyu-shibing-1',
  },
  // 冰雪巨人士兵2（gw_xybj_2，国王救出后隐藏）
  {
    id: 'spawn-xueyu-shibing-2',
    templateId: 'bingxue-juren-shibing',
    location: 'xueyu-bianjing',
    spawnVariable: 'gw_xybj_2',
    isSpawned: true,
    interactableId: 'interact-xueyu-shibing-2',
  },
  // 冰雪巨人士官1（gw_xybj_3，国王救出后隐藏）
  {
    id: 'spawn-xueyu-shiguan-1',
    templateId: 'bingxue-juren-shiguan',
    location: 'xueyu-bianjing',
    spawnVariable: 'gw_xybj_3',
    isSpawned: true,
    interactableId: 'interact-xueyu-shiguan-1',
  },
  // 冰雪巨人士官2（gw_xybj_5，国王救出后隐藏）
  {
    id: 'spawn-xueyu-shiguan-2',
    templateId: 'bingxue-juren-shiguan',
    location: 'xueyu-bianjing',
    spawnVariable: 'gw_xybj_5',
    isSpawned: true,
    interactableId: 'interact-xueyu-shiguan-2',
  },
  // 冰雪巨人军官（gw_xybj_4，始终可见）
  {
    id: 'spawn-xueyu-junguan',
    templateId: 'bingxue-juren-junguan',
    location: 'xueyu-bianjing',
    spawnVariable: 'gw_xybj_4',
    isSpawned: true,
    interactableId: 'interact-xueyu-junguan',
  },

  // ========== 战魂封印迷宫怪物刷新配置 ==========
  // 无名氏（特殊怪物，击败后获得战魂之心）
  // 注意：此怪物不通过静态配置显示，而是在神秘人NPC交互后动态显示
  {
    id: 'spawn-zhanhun-wumingshi',
    templateId: 'wumingshi',
    location: 'zhanhun-fengyin-migong',
    spawnVariable: 'zhanhun_wumingshi',
    isSpawned: false, // 初始不刷新，通过神秘人NPC触发
    interactableId: 'enemy_wumingshi',
  },

  // ========== 地下城怪物刷新配置 ==========
  // 地下城1层：3个地下城蝎怪
  {
    id: 'spawn-dxc1-xieguai-1',
    templateId: 'dixiacheng-xieguai',
    location: 'dixiacheng-1',
    spawnVariable: 'rw_gw1_1',
    isSpawned: true,
    interactableId: 'interact-dxc1-xieguai-1',
  },
  {
    id: 'spawn-dxc1-xieguai-2',
    templateId: 'dixiacheng-xieguai',
    location: 'dixiacheng-1',
    spawnVariable: 'rw_gw1_2',
    isSpawned: true,
    interactableId: 'interact-dxc1-xieguai-2',
  },
  {
    id: 'spawn-dxc1-xieguai-3',
    templateId: 'dixiacheng-xieguai',
    location: 'dixiacheng-1',
    spawnVariable: 'rw_gw1_3',
    isSpawned: true,
    interactableId: 'interact-dxc1-xieguai-3',
  },
  // 地下城2层：2个骑士亡魂
  {
    id: 'spawn-dxc2-qishiwanghun-1',
    templateId: 'dixiacheng-qishiwanghun',
    location: 'dixiacheng-2',
    spawnVariable: 'rw_gw2_1',
    isSpawned: true,
    interactableId: 'interact-dxc2-qishiwanghun-1',
  },
  {
    id: 'spawn-dxc2-qishiwanghun-2',
    templateId: 'dixiacheng-qishiwanghun',
    location: 'dixiacheng-2',
    spawnVariable: 'rw_gw2_2',
    isSpawned: true,
    interactableId: 'interact-dxc2-qishiwanghun-2',
  },
  // 地下城3层：1个呖风火龙兽
  {
    id: 'spawn-dxc3-huolongshou-1',
    templateId: 'lifeng-huolongshou',
    location: 'dixiacheng-3',
    spawnVariable: 'rw_gw3_1',
    isSpawned: true,
    interactableId: 'interact-dxc3-huolongshou-1',
  },

  // ========== 魔中军阵地怪物刷新配置（魔族大军）==========
  // 魔军突击队（700级）
  {
    id: 'spawn-mojun-tujidui',
    templateId: 'mojun-tujidui',
    location: 'mozhongjun-zhendi',
    spawnVariable: 'mj_gj', // 魔军攻击
    isSpawned: true,
    interactableId: 'interact-mojun-tujidui',
  },
  // 魔军守卫军（800级）
  {
    id: 'spawn-mojun-shouweijun',
    templateId: 'mojun-shouweijun',
    location: 'mozhongjun-zhendi',
    spawnVariable: 'mj_fy', // 魔军防御
    isSpawned: true,
    interactableId: 'interact-mojun-shouweijun',
  },
  // 魔军神秘部队（900级）
  {
    id: 'spawn-mojun-shenmibudui',
    templateId: 'mojun-shenmibudui',
    location: 'mozhongjun-zhendi',
    spawnVariable: 'mj_sm', // 魔军生命
    isSpawned: true,
    interactableId: 'interact-mojun-shenmibudui',
  },
  // 魔军图腾兽（1000级）
  {
    id: 'spawn-mojun-tutengshou',
    templateId: 'mojun-tutengshou',
    location: 'mozhongjun-zhendi',
    spawnVariable: 'mj_tt', // 魔军图腾
    isSpawned: true,
    interactableId: 'interact-mojun-tutengshou',
  },
  // 魔的能量
  {
    id: 'spawn-mojun-nengliang',
    templateId: 'mojun-nengliang',
    location: 'mozhongjun-zhendi',
    spawnVariable: 'mj_nl', // 魔军能量
    isSpawned: true,
    interactableId: 'interact-mojun-nengliang',
  },
  // 魔军主帅（2000级）
  {
    id: 'spawn-mojun-shuai',
    templateId: 'mojun-shuai',
    location: 'mozhongjun-zhendi',
    spawnVariable: 'mj_zs', // 魔军主帅
    isSpawned: true,
    interactableId: 'interact-mojun-shuai',
  },
];

/**
 * 根据地图ID获取该地图的所有怪物模板
 * @param locationId 地图ID
 * @returns 该地图的怪物模板数组
 */
export function getMonstersByLocation(locationId: string): MonsterTemplate[] {
  return Object.values(monsterTemplates).filter(
    (monster) => monster.location === locationId
  );
}

/**
 * 根据地图ID获取该地图的所有怪物刷新配置
 * @param locationId 地图ID
 * @returns 该地图的怪物刷新配置数组
 */
export function getSpawnConfigsByLocation(locationId: string): MonsterSpawnConfig[] {
  return monsterSpawnConfigs.filter((config) => config.location === locationId);
}

/**
 * 根据怪物模板ID获取怪物模板
 * @param templateId 怪物模板ID
 * @returns 怪物模板或undefined
 */
export function getMonsterTemplate(templateId: string): MonsterTemplate | undefined {
  return monsterTemplates[templateId];
}

/**
 * 根据刷新配置ID获取刷新配置
 * @param spawnId 刷新配置ID
 * @returns 刷新配置或undefined
 */
export function getSpawnConfig(spawnId: string): MonsterSpawnConfig | undefined {
  return monsterSpawnConfigs.find((config) => config.id === spawnId);
}
