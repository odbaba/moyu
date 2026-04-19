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
