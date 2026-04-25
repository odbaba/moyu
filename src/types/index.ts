// 位置类型定义
export interface Location {
  description: string;
  adjacentLocations: string[];
  interactables: string[];
}

// 交互选项类型定义
export interface InteractionOption {
  text: string;
  result: string;
}

// 交互对象类型定义
export interface Interaction {
  description: string;
  options: InteractionOption[];
}

// 位置数据类型定义
export interface LocationData {
  [key: string]: Location;
}

// 交互数据类型定义
export interface InteractionData {
  [key: string]: Interaction;
}

// 网格位置类型定义
export interface GridPosition {
  x: number;
  y: number;
}

// 技能接口定义
export interface Skill {
  id: string;
  name: string;
  description: string;
  mpCost: number;
  fixedDamage: number;
  attackPercent: number;
}

// 角色接口定义
export interface Character {
  id: string;
  name: string;
  maxHp: number;
  currentHp: number;
  maxMp: number;
  currentMp: number;
  attack: number;
  defense: number;
  skills: Skill[];
  isPlayer: boolean;
  gridPosition: GridPosition;
}

// 装备类型枚举
export type EquipmentType = 'weapon' | 'armor' | 'accessory';

// 装备接口定义
export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  description: string;
  attack: number;
  defense: number;
  maxHp: number;
  maxMp: number;
}

// 角色装备槽接口定义
export interface CharacterEquipment {
  weapon: Equipment | null;
  armor: Equipment | null;
  accessory: Equipment | null;
}

// 详细角色信息接口定义
export interface CharacterDetail {
  id: string;
  name: string;
  level: number;
  exp: number;
  maxExp: number;
  maxHp: number;
  currentHp: number;
  maxMp: number;
  currentMp: number;
  attack: number;
  defense: number;
  equipment: CharacterEquipment;
  skills: Skill[];
}

// 角色属性总览接口定义
export interface CharacterStats {
  baseAttack: number;
  baseDefense: number;
  baseMaxHp: number;
  baseMaxMp: number;
  equipmentAttack: number;
  equipmentDefense: number;
  equipmentMaxHp: number;
  equipmentMaxMp: number;
  totalAttack: number;
  totalDefense: number;
  totalMaxHp: number;
  totalMaxMp: number;
}

// 装备品质类型（普通品=白品，品质0）
export type EquipmentQuality = '普通品' | '良品' | '上品' | '精品' | '极品';

// 装备详细类型枚举（使用 clothes 而非 armor，与 CharacterData.equipment 保持一致）
export type EquipmentSlotType = 'weapon' | 'helmet' | 'clothes' | 'shoes' | 'bracelet' | 'necklace';

// 装备属性接口
export interface EquipmentAttribute {
  attackMin?: number;
  attackMax?: number;
  defense?: number;
  hp?: number;
  mp?: number;
  dodge?: number;
  luck?: number;
}

// 宝石属性接口
export interface GemAttribute {
  attack?: number;
  defense?: number;
  hp?: number;
  mp?: number;
  dodge?: number;
  luck?: number;
}

// 详细装备接口定义
export interface EquipmentDetail {
  id: string;
  name: string;
  type: EquipmentSlotType;
  quality: EquipmentQuality;
  magicSoulLevel: number;
  attributes: EquipmentAttribute;
  holeCount: number;
  gems?: string[]; // 镶嵌的宝石名称数组
  gemAttributes: GemAttribute[];
  useLevel: number;
  combatPower: number;
  // 战魂属性
  soulType?: WarSoulType | number; // 战魂类型 (0=无, 1=天魂, 2=地魂)
  soulLevel?: number; // 战魂等级 (1-5)
  // 基础属性（根据等级动态计算）
  baseAttackMin?: number; // 基础最小攻击
  baseAttackMax?: number; // 基础最大攻击
  baseDefense?: number; // 基础防御
  // 追加属性（根据魔魂等级计算）
  bonusAttackMin?: number; // 追加最小攻击
  bonusAttackMax?: number; // 追加最大攻击
  bonusDefense?: number; // 追加防御
  // 图标信息（用于保持装备图标的连续性）
  icon?: string; // 装备图标（emoji或图片路径）
  imagePath?: string; // 装备图片路径
}

// 详细角色信息接口定义（扩展版）
export interface CharacterData {
  id: string;
  playerName: string;
  level: number;
  title: string;
  // 军衔系统
  militaryRankLevel: number; // 军衔等级 (0-11)
  militaryRankName: string; // 军衔名称
  battleExp: number; // 累计战功
  // 爵位系统
  nobleRankLevel: number; // 爵位等级 (0-6)
  nobleRankName: string; // 爵位名称
  merit: number; // 累计功勋
  maxHp: number;
  currentHp: number;
  maxStamina: number;
  currentStamina: number;
  exp: number;
  maxExp: number;
  attackMin: number;
  attackMax: number;
  defense: number;
  dodgeRate: number;
  luck: number;
  equipment: {
    weapon: EquipmentDetail | null;
    clothes: EquipmentDetail | null;
    shoes: EquipmentDetail | null;
    bracelet: EquipmentDetail | null;
    necklace: EquipmentDetail | null;
    helmet: EquipmentDetail | null;
  };
  // 基础属性常量
  baseHp?: number; // 基础生命值 = 500
  baseStamina?: number; // 基础体力值 = 100
  baseAttackMin?: number; // 基础最小攻击 = 45
  baseAttackMax?: number; // 基础最大攻击 = 45
  baseDefense?: number; // 基础防御力 = 80
  // 成长系数
  growthHp?: number; // 生命成长 = 50
  growthStamina?: number; // 体力成长 = 10
  growthAttackMin?: number; // 最小攻击成长 = 10
  growthAttackMax?: number; // 最大攻击成长 = 10
  growthDefense?: number; // 防御成长 = 8
  // 装备加成（动态计算）
  equipmentBonus?: {
    attackMin: number; // 装备最小攻击加成
    attackMax: number; // 装备最大攻击加成
    defense: number; // 装备防御加成
    dodgeRate: number; // 装备闪避率加成
  };
  // 幻兽合体属性加成（可选，由幻兽合体状态动态计算）
  petBonus?: {
    attackMin: number; // 幻兽最小攻击力加成
    attackMax: number; // 幻兽最大攻击力加成
    defense: number; // 幻兽防御力加成
  };
  // 战斗力（动态计算，必须有值）
  combatPower: number; // 角色战斗力
}

// ========== 背包系统类型定义 ==========

// 物品类型枚举
export type ItemType = 'consumable' | 'material' | 'equipment' | 'quest' | 'other' | 'skillBook' | 'gem' | 'special' | 'pet';

// 物品稀有度枚举
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

// 宝石类型
export type GemType = 'enhance' | 'embed';

// 宝石子类型枚举
// 定义宝石的具体用途分类
export type GemSubType = 'enhance' | 'embed' | 'openHole' | 'soul';

// 精炼类型枚举
// 定义装备精炼的具体类型
export type RefineType = 'quality' | 'magicSoul' | 'useLevel' | 'openHole' | 'embed' | 'soul';

// 特殊道具类型
export type SpecialType = 'craft' | 'gift' | 'ore';

// 技能书类型
export type SkillBookType = 'attack' | 'buff';

// 物品属性接口
export interface ItemAttribute {
  hp?: number; // 生命值
  mp?: number; // 魔法值
  attack?: number; // 攻击力
  defense?: number; // 防御力
  stamina?: number; // 体力
  luck?: number; // 幸运值
}

// 物品接口
export interface InventoryItem {
  id: string; // 物品唯一ID
  name: string; // 物品名称
  icon: string; // 物品图标（emoji或图片路径）
  quantity: number; // 物品数量
  type: ItemType; // 物品类型
  rarity?: ItemRarity; // 物品稀有度
  attributes?: ItemAttribute; // 物品属性
  source?: string; // 获取途径
  description: string; // 物品描述
  maxStack?: number; // 最大堆叠数量
  usable?: boolean; // 是否可使用
  equippable?: boolean; // 是否可装备
  quality?: number; // 物品品质（1-10）
  goldValue?: number; // 金币价值
  magicStoneValue?: number; // 魔石价值
  imagePath?: string; // 物品图片路径（可选，用于非装备类物品）
  price?: number; // 物品价格
  stackable?: boolean; // 是否可堆叠
  skillId?: string; // 技能书关联的技能ID
  isUpgrade?: boolean; // 是否为升级技能书
  targetLevel?: number; // 升级目标等级
}

// ========== 装备类物品扩展接口 ==========

/**
 * 装备类物品接口
 * 包含装备特有的属性：使用等级、品质、魔魂等级、宝石洞等
 */
export interface EquipmentItem extends InventoryItem {
  type: 'equipment';
  equipmentType: EquipmentSlotType; // 装备槽位类型
  useLevel: number; // 使用等级 (1-125)
  equipmentQuality: EquipmentQuality; // 装备品质 (普通品/良品/上品/精品/极品)
  magicSoulLevel: number; // 魔魂等级 (0-12)
  holeCount: number; // 宝石洞数量 (0-2)
  gems?: string[]; // 镶嵌的宝石名称
  soulType?: WarSoulType | number; // 战魂类型 (0=无, 1=天魂, 2=地魂)
  soulLevel?: number; // 战魂等级 (1-5)
  attackMin?: number; // 最小攻击力
  attackMax?: number; // 最大攻击力
  defense?: number; // 防御力
  bonusAttackMin?: number; // 追加最小攻击（魔魂加成）
  bonusAttackMax?: number; // 追加最大攻击（魔魂加成）
  bonusDefense?: number; // 追加防御（魔魂加成）
  imagePath?: string; // 装备图片路径
}

// ========== 技能书类物品扩展接口 ==========

/**
 * 技能书类物品接口
 * 使用后可学习对应技能
 */
export interface SkillBookItem extends InventoryItem {
  type: 'skillBook';
  skillId: string; // 对应技能ID
  skillName: string; // 技能名称
  skillType: SkillBookType; // 技能类型 (attack/buff)
  skillEffect: string; // 技能效果描述
  damagePercent?: number; // 伤害百分比
  targetCount?: number; // 攻击目标数量
}

// ========== 宝石类物品扩展接口 ==========

/**
 * 宝石类物品接口
 * 分为强化宝石和镶嵌宝石两种
 */
export interface GemItem extends InventoryItem {
  type: 'gem';
  gemType: GemType; // 宝石类型 (enhance=强化, embed=镶嵌)
  gemSubType: GemSubType; // 宝石子类型 (enhance=强化, embed=镶嵌, openHole=开洞, soul=战魂)
  effect: string; // 效果描述
  successRate?: string; // 成功率描述（可选）
  refineType?: RefineType; // 精炼类型（可选）
  combatPower?: number; // 战斗力加成（可选）
  expBonus?: number; // 经验加成百分比（可选）
}

/**
 * 精炼结果接口
 * 定义装备精炼操作的结果
 */
export interface RefineResult {
  success: boolean; // 是否成功
  message: string; // 结果消息
  attributeChanges?: Record<string, string | number | boolean>; // 属性变化（可选）
  updatedEquipment?: EquipmentItem; // 精炼后的装备（可选）
  usedGem?: GemItem; // 使用的宝石（可选）
}

// ========== 特殊道具类物品扩展接口 ==========

/**
 * 特殊道具类物品接口
 * 包含打造道具、礼物、矿石等
 */
export interface SpecialItem extends InventoryItem {
  type: 'special';
  specialType: SpecialType; // 特殊道具类型 (craft/gift/ore)
  effect: string; // 效果描述
  effectValue?: number; // 效果数值
}

// 玩家资源接口
export interface PlayerResources {
  gold: number; // 金币
  magicStone: number; // 魔石
  battleExp: number; // 战功（用于军衔升级）
  merit: number; // 功勋（用于爵位升级）
}

// ========== 技能系统类型定义 ==========

/**
 * 技能索引枚举
 * 对应6个技能槽位，与参考文档保持一致
 */
export type SkillIndex = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * 技能学习方式
 * - initial: 初始技能
 * - skillBook: 技能书学习
 * - intimacy: 公主亲密度解锁
 */
export type SkillLearnMethod = 'initial' | 'skillBook' | 'intimacy';

/**
 * 技能攻击类型
 * - single: 单体攻击
 * - aoe: 群体攻击
 * - multi: 多段攻击（如四连击）
 * - buff: 增益技能
 * - special: 特殊技能
 */
export type SkillAttackType = 'single' | 'aoe' | 'multi' | 'buff' | 'special';

// 技能类型枚举
export type SkillType = 'active' | 'passive' | 'toggle';

// 技能稀有度枚举
export type SkillRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

// 技能消耗接口
export interface SkillCost {
  stamina?: number; // 体力消耗
  hp?: number; // 生命值消耗（血祭类技能）
  gold?: number; // 金币消耗
}

// 技能效果接口
export interface SkillEffect {
  damage?: number; // 固定伤害
  damagePercent?: number; // 攻击力百分比伤害
  heal?: number; // 固定治疗
  healPercent?: number; // 生命值百分比治疗
  buff?: string; // 增益效果描述
  debuff?: string; // 减益效果描述
  duration?: number; // 效果持续时间（回合）
  hitCount?: number; // 攻击次数（如四连击）
  breakDefenseHits?: number; // 破防攻击次数
  battlePowerBonus?: number; // 战斗力加成百分比
}

// 技能详情接口（用于技能展示页面）
export interface SkillDetail {
  id: string; // 技能唯一ID
  skillIndex: SkillIndex; // 技能索引（0-5）
  name: string; // 技能名称
  icon: string; // 技能图标（emoji或图片路径）
  type: SkillType; // 技能类型
  attackType: SkillAttackType; // 攻击类型
  rarity: SkillRarity; // 技能稀有度
  level: number; // 技能等级
  maxLevel: number; // 技能最大等级
  description: string; // 技能描述
  effect: SkillEffect; // 技能效果
  cost: SkillCost; // 技能消耗
  cooldown: number; // 冷却时间（回合）
  currentCooldown: number; // 当前冷却时间
  range: string; // 技能范围描述
  targetType: string; // 目标类型（单体/群体/自身）
  learnMethod: SkillLearnMethod; // 学习方式
  learnLevel: number; // 学习所需等级
  upgradeCost?: number; // 升级消耗（金币）
  isLearned: boolean; // 是否已学习
}

/**
 * 技能学习结果接口
 * 定义技能学习操作的返回结果
 * 统一用于技能书学习和公主关系技能学习
 */
export interface SkillLearnResult {
  success: boolean; // 是否成功学习
  message: string; // 提示消息
  updatedSkills: SkillDetail[]; // 更新后的技能列表
  skillId?: string; // 技能ID（可选，用于公主关系技能学习）
  skillName?: string; // 技能名称（可选，用于公主关系技能学习）
  skillLevel?: number; // 技能等级（可选，用于公主关系技能学习）
}

/**
 * 关系升级结果接口
 * 包含关系更新和技能学习的结果
 * 用于公主关系系统
 */
export interface RelationshipUpgradeResult {
  relationship: PrincessRelationship; // 更新后的关系数据
  skillLearnResult: SkillLearnResult | null; // 技能学习结果（如果有的话）
  upgradeMessage: string; // 升级提示消息
}

// ========== 交互系统类型定义 ==========

/**
 * 交互类型枚举
 * 定义三种标准交互类型
 */
export type InteractableType = 'action' | 'enemy' | 'npc';

/**
 * 动作类型枚举
 * 定义可执行的动作类型
 */
export type ActionType = 'mining' | 'fishing' | 'gathering' | 'crafting' | 'custom';

/**
 * 敌人数据接口
 * 定义单个敌人的属性信息
 * 注意：攻击力有最小值和最大值，发动普通攻击造成伤害时才会在范围内随机取值
 */
export interface EnemyData {
  id: string; // 敌人唯一ID
  name: string; // 敌人名称
  level?: number; // 敌人等级（可选）
  combatPower?: number; // 敌人战斗力（可选）
  maxHp: number; // 最大生命值
  attackMin: number; // 最小攻击力
  attackMax: number; // 最大攻击力
  defense: number; // 防御力
  description?: string; // 敌人描述
}

/**
 * NPC类型枚举
 * 定义NPC的分类类型
 */
export type NPCType = 'palace' | 'function' | 'shop' | 'special';

/**
 * NPC交互条件类型枚举
 * 定义选项显示的条件类型
 */
export type NPCConditionType = 'weekday' | 'relationship' | 'militaryRank' | 'nobleRank' | 'custom' | 'warSoulEnabled';

/**
 * NPC交互条件接口
 * 定义选项显示的条件
 */
export interface NPCInteractionCondition {
  type: NPCConditionType; // 条件类型
  value: any; // 条件值（根据类型不同而不同）
  operator?: 'eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'ne'; // 比较运算符，默认为 eq
}

/**
 * NPC交互选项接口
 * 定义NPC提供的交互选项
 */
export interface NPCInteractionOption {
  text: string; // 选项显示文本
  result: string; // 选项执行结果描述
  actionType?: string; // 可选：执行的动作类型
  actionParams?: Record<string, unknown>; // 可选：动作参数
  condition?: NPCInteractionCondition; // 可选：选项显示条件
}

/**
 * 动作类交互接口
 * 点击后直接执行预设动作
 */
export interface ActionInteractable {
  id: string; // 交互唯一ID
  type: 'action'; // 交互类型标识
  name: string; // 显示名称
  icon: string; // 显示图标（emoji）
  actionType: ActionType; // 动作类型
  actionParams?: Record<string, unknown>; // 动作参数
  description?: string; // 可选描述
}

/**
 * 敌人类交互接口
 * 点击后弹出敌人信息模态窗口
 */
export interface EnemyInteractable {
  id: string; // 交互唯一ID
  type: 'enemy'; // 交互类型标识
  name: string; // 显示名称
  icon: string; // 显示图标（emoji）
  description: string; // 敌人描述文本
  enemies: EnemyData[]; // 敌人列表
}

/**
 * NPC类交互接口
 * 点击后弹出NPC交互模态窗口
 */
export interface NPCInteractable {
  id: string; // 交互唯一ID
  type: 'npc'; // 交互类型标识
  name: string; // 显示名称（NPC名称）
  icon: string; // 显示图标（emoji）
  description: string; // NPC描述文本
  location: string; // NPC所在地图ID
  npcType: NPCType; // NPC类型分类
  options: NPCInteractionOption[]; // 交互选项列表
}

/**
 * 交互联合类型
 * 三种交互类型的联合类型
 */
export type Interactable = ActionInteractable | EnemyInteractable | NPCInteractable;

/**
 * 交互配置映射表类型
 * 用于通过ID快速查找交互配置
 */
export interface InteractableConfig {
  [key: string]: Interactable;
}

// ========== 时间系统类型定义 ==========

/**
 * 时间系统接口
 * 管理游戏内的时间和星期
 */
export interface TimeSystem {
  nowday: number; // 当前天数（第几天），初始值为1
  nowtime: number; // 当天已消耗的时间单位，初始值为0
  onedaytime: number; // 一天的时间单位总数，固定为15
}

/**
 * 星期枚举类型
 */
export type Weekday = '星期一' | '星期二' | '星期三' | '星期四' | '星期五' | '星期六' | '星期日';

// ========== 幻兽系统类型定义 ==========

/**
 * 幻兽类型枚举
 * 定义幻兽的类型，不同类型有不同的基础评分和成长特点
 */
export type PetType = '攻防型' | '调皮猫' | '吉鲁猪' | '奇异兽' | '圣天使' | '守护' | '年猪';

/**
 * 幻兽评分接口
 * 包含各项评分的详细数据
 */
export interface PetRating {
  pzbase: number; // 基础评分（根据幻兽类型固定）
  pz_chp: number; // 初始生命评分
  pz_cxgj: number; // 初始最小攻击评分
  pz_cdgj: number; // 初始最大攻击评分
  pz_cfy: number; // 初始防御评分
  pz_cz_hp: number; // 生命成长评分
  pz_cz_xgj: number; // 最小攻击成长评分
  pz_cz_dgj: number; // 最大攻击成长评分
  pz_cz_fy: number; // 防御成长评分
}

/**
 * 幻兽接口定义
 * 包含幻兽的所有属性数据
 */
export interface Pet {
  id: string; // 幻兽唯一ID
  hs_name: PetType; // 幻兽类型名称
  othername: string; // 显示名称（自定义名称）
  dj: number; // 等级 (1-130)
  hp: number; // 当前生命值
  mhp: number; // 最大生命值
  xgj: number; // 最小攻击力
  dgj: number; // 最大攻击力
  fy: number; // 防御力
  jy: number; // 当前经验值
  mjy: number; // 升级所需经验
  zs: number; // 转世次数（幻化次数）
  pz: number; // 总评分
  qualityTitle: string; // 品质称号（如"极品12星"、"万众瞩目"等）
  isDeployed: boolean; // 是否出战中
  isMerged: boolean; // 是否合体中
  // 初始属性
  chp: number; // 初始生命值 (20-34)
  cxgj: number; // 初始最小攻击 (10-14)
  cdgj: number; // 初始最大攻击 (cxgj 到 29)
  cfy: number; // 初始防御 (5-9)
  // 成长属性
  cz_hp: number; // 生命成长率 (30-41)
  cz_xgj: number; // 最小攻击成长率 (8-11)
  cz_dgj: number; // 最大攻击成长率 (cz_xgj 到 16)
  cz_fy: number; // 防御成长率 (1-6)
  // 评分详情
  rating: PetRating; // 各项评分详情
  // 幻化相关属性
  predj: number; // 幻化前等级（初始值为1）
  premjy: number; // 幻化前升级所需经验（初始值为10）
  prejy: number; // 幻化前当前经验（初始值为0）
  hun: number; // 升级经验递增变量（初始值为1）
}

/**
 * 幻兽研究所状态接口
 * 定义幻兽研究所的技术等级、生产量、VIP等级等状态
 */
export interface PetInstituteState {
  techLevel: number; // 技术等级 (10-120/150)
  techLevelMax: number; // 技术等级上限 (120/150)
  productionRate: number; // 每日生产量 (0-6)
  stock: number; // 当前库存
  vipLevel: number; // VIP星级 (0-10)
  canDoProductionTask: boolean; // 是否可做提高产量任务（周日开启）
}

// ========== 战斗系统类型定义 ==========

/**
 * 增益效果类型枚举
 * 定义战斗中的增益效果类型
 */
export type BuffType = 'combat_power' | 'attack' | 'defense' | 'speed' | 'critical' | 'dodge';

/**
 * 增益效果接口
 * 定义战斗中的增益效果
 */
export interface Buff {
  id: string; // 增益效果唯一ID
  name: string; // 增益效果名称
  type: BuffType; // 增益效果类型
  value: number; // 增益数值（百分比）
  duration: number; // 剩余持续回合数
  source: string; // 来源（技能ID或物品ID）
}

/**
 * 战斗技能接口
 * 从 SkillDetail 转换而来的战斗用技能数据
 */
export interface BattleSkill {
  id: string; // 技能唯一ID
  skillIndex: SkillIndex; // 技能索引（0-5）
  name: string; // 技能名称
  icon: string; // 技能图标
  type: SkillType; // 技能类型（active/passive/toggle）
  attackType: SkillAttackType; // 攻击类型（single/aoe/multi/buff/special）
  level: number; // 技能等级
  damagePercent: number; // 伤害百分比
  staminaCost: number; // 体力消耗
  cooldown: number; // 冷却时间（回合）
  currentCooldown: number; // 当前冷却时间
  hitCount: number; // 攻击次数（多段攻击）
  breakDefenseHits: number; // 破防攻击次数
  battlePowerBonus: number; // 战斗力加成百分比（增益技能）
  buffDuration: number; // 增益持续时间（回合）
  isAvailable: boolean; // 是否可用（考虑冷却和消耗）
}

/**
 * 战斗角色接口
 * 从 CharacterData 转换而来的战斗用角色数据
 */
export interface BattleCharacter {
  id: string; // 角色唯一ID
  name: string; // 角色名称
  level: number; // 角色等级
  maxHp: number; // 最大生命值
  currentHp: number; // 当前生命值
  maxStamina: number; // 最大体力值
  currentStamina: number; // 当前体力值
  attackMin: number; // 最小攻击力
  attackMax: number; // 最大攻击力
  defense: number; // 防御力
  combatPower: number; // 战斗力
  dodgeRate: number; // 闪避率（百分比）
  luck: number; // 幸运值
  skills: BattleSkill[]; // 技能列表
  buffs: Buff[]; // 增益效果列表
  isPlayer: boolean; // 是否是玩家
  gridPosition: GridPosition; // 九宫格位置
  /** 压制前原始战斗力（战魂套装压制前） */
  originalCombatPower?: number;
  /** 压制前原始最大生命值（战魂套装压制前） */
  originalMaxHp?: number;
  /** 战魂套装压制信息 */
  warSoulSuppression?: {
    /** 压制类型：'combatPower' 表示天魂套装降低战斗力，'hp' 表示地魂套装降低生命值 */
    type: 'combatPower' | 'hp';
    /** 压制百分比（如0.06表示6%） */
    percentage: number;
  };
}

/**
 * 战斗幻兽接口
 * 从 Pet 转换而来的战斗用幻兽数据
 * 用于战斗系统中出战的幻兽
 */
export interface BattlePet {
  id: string; // 幻兽唯一ID（战斗中生成的唯一标识）
  name: string; // 幻兽名称（显示名称）
  level: number; // 幻兽等级
  maxHp: number; // 最大生命值
  currentHp: number; // 当前生命值
  attackMin: number; // 最小攻击力
  attackMax: number; // 最大攻击力
  defense: number; // 防御力
  isMerged: boolean; // 是否合体状态（合体时属性加成到玩家）
  isPlayer: boolean; // 固定为 false，表示是幻兽
  gridPosition: GridPosition; // 九宫格位置
  petId: string; // 原始幻兽ID（用于同步状态）
}

/**
 * 战斗日志类型枚举
 */
export type BattleLogType = 'attack' | 'skill' | 'dodge' | 'buff' | 'damage' | 'heal' | 'death';

/**
 * 战斗日志条目接口（扩展版）
 */
export interface BattleLogEntry {
  id: string; // 日志唯一ID
  round: number; // 回合数
  actor: string; // 行动者名称
  actorId: string; // 行动者ID
  action: string; // 行动描述
  actionType: BattleLogType; // 行动类型
  damage: number; // 伤害数值
  target: string; // 目标名称
  targetId: string; // 目标ID
  skillName?: string; // 使用的技能名称
  isDodged?: boolean; // 是否被闪避
  isBreakDefense?: boolean; // 是否破防攻击
  isCritical?: boolean; // 是否暴击
}

/**
 * 战斗结果类型定义
 */
export type BattleResult = 'player_win' | 'enemy_win' | 'in_progress';

/**
 * 战斗状态类型定义（扩展版）
 */
export interface BattleState {
  player: BattleCharacter; // 玩家数据
  enemies: BattleCharacter[]; // 敌人列表
  deployedPets: BattlePet[]; // 出战幻兽列表
  currentTurn: 'player' | 'enemy'; // 当前回合
  isPlayerTurn: boolean; // 是否玩家回合
  battleLogs: BattleLogEntry[]; // 战斗日志
  round: number; // 当前回合数
  selectedAction: string | null; // 选中的行动（技能ID）
  targetEnemy: string | null; // 选中的目标（敌人ID）
  battleResult: BattleResult; // 战斗结果
  logIdCounter: number; // 日志ID计数器
  currentEnemyActionIndex: number; // 当前行动的敌人索引（用于敌人回合依次行动）
}

/**
 * 伤害计算结果接口
 */
export interface DamageResult {
  damage: number; // 最终伤害
  isDodged: boolean; // 是否被闪避
  isBreakDefense: boolean; // 是否破防攻击
  combatPowerModifier: number; // 战斗力修正系数
  isCritical: boolean; // 是否暴击
}

/**
 * 敌人模板接口
 * 用于生成敌人数据
 */
export interface EnemyTemplate {
  id: string; // 模板ID
  name: string; // 敌人名称
  baseHp: number; // 基础生命值
  growthHp: number; // 生命成长
  baseAttackMin: number; // 基础最小攻击
  growthAttackMin: number; // 最小攻击成长
  baseAttackMax: number; // 基础最大攻击
  growthAttackMax: number; // 最大攻击成长
  baseDefense: number; // 基础防御
  growthDefense: number; // 防御成长
  baseCombatPower: number; // 基础战斗力
  growthCombatPower: number; // 战斗力成长
  skillIds: string[]; // 可用技能ID列表
  icon?: string; // 敌人图标
  description?: string; // 敌人描述
}

/**
 * 战斗初始化参数接口
 */
export interface BattleInitParams {
  playerData: CharacterData; // 玩家角色数据
  playerSkills: SkillDetail[]; // 玩家技能数据
  enemyTemplate: EnemyTemplate; // 敌人模板
  enemyLevel: number; // 敌人等级
  enemyCount: number; // 敌人数量
  pets?: Pet[]; // 幻兽数组，用于计算幻兽战斗力加成
}

// ========== 怪物系统类型定义 ==========

/**
 * 怪物类型枚举
 * 定义怪物的类型，不同类型有不同的战斗数量规则
 */
export type MonsterType = 'normal' | 'boss' | 'special' | 'dungeon';

/**
 * 怪物模板接口
 * 定义怪物的基础属性和成长属性，用于生成怪物实例
 * 参考文档：reference/docs/project_docs/04_怪物系统.md
 */
export interface MonsterTemplate {
  id: string; // 怪物模板唯一ID
  name: string; // 怪物名称
  type: MonsterType; // 怪物类型（普通/boss/特殊）
  level: number; // 怪物等级
  combatPower: number; // 战斗力
  location: string; // 所在地图ID
  icon: string; // 怪物图标（emoji）
  description: string; // 怪物描述
  // 基础属性
  baseHp: number; // 基础生命值
  growthHp: number; // 生命成长率
  baseAttackMin: number; // 基础最小攻击
  growthAttackMin: number; // 最小攻击成长率
  baseAttackMax: number; // 基础最大攻击
  growthAttackMax: number; // 最大攻击成长率
  baseDefense: number; // 基础防御
  growthDefense: number; // 防御成长率
  // 可选属性
  skillIds?: string[]; // 可用技能ID列表
  drops?: MonsterDrop[]; // 掉落物品配置
}

/**
 * 怪物掉落配置接口
 * 定义怪物死亡后的掉落物品
 */
export interface MonsterDrop {
  itemId: string; // 物品ID
  dropRate: number; // 掉落概率（0-1）
  quantity?: number; // 掉落数量（默认1）
}

/**
 * 怪物实例接口
 * 从怪物模板生成的实例，包含计算后的属性
 */
export interface Monster {
  id: string; // 怪物实例唯一ID
  templateId: string; // 对应的模板ID
  name: string; // 怪物名称
  type: MonsterType; // 怪物类型
  level: number; // 怪物等级
  combatPower: number; // 战斗力
  location: string; // 所在地图ID
  icon: string; // 怪物图标
  description: string; // 怪物描述
  // 计算后的属性
  maxHp: number; // 最大生命值 = 基础生命 + 生命成长 × 等级
  currentHp: number; // 当前生命值
  attackMin: number; // 最小攻击力 = 基础最小攻击 + 最小攻击成长 × 等级
  attackMax: number; // 最大攻击力 = 基础最大攻击 + 最大攻击成长 × 等级
  defense: number; // 防御力 = 基础防御 + 防御成长 × 等级
  // 可选属性
  skillIds?: string[]; // 可用技能ID列表
  drops?: MonsterDrop[]; // 掉落物品配置
}

/**
 * 怪物刷新配置接口
 * 定义怪物在地图上的刷新配置
 */
export interface MonsterSpawnConfig {
  id: string; // 刷新配置唯一ID
  templateId: string; // 对应的怪物模板ID
  location: string; // 所在地图ID
  spawnVariable: string; // 刷新变量名（用于跟踪刷新状态）
  isSpawned: boolean; // 是否已刷新（是否可交互）
  interactableId: string; // 对应的交互对象ID
}

// ========== BOSS 系统类型定义 ==========

/**
 * BOSS 模板接口
 * 定义 BOSS 的基础属性和刷新概率
 * 参考文档：reference/docs/project_docs/04_怪物系统.md
 */
export interface BossTemplate {
  id: string; // BOSS 模板唯一ID
  name: string; // BOSS 名称
  level: number; // BOSS 等级
  combatPower: number; // 战斗力
  location: string; // 所在地图ID
  locationName: string; // 所在地图名称（用于日志显示）
  icon: string; // BOSS 图标
  description: string; // BOSS 描述
  // 属性范围
  minHp: number; // 最小生命值
  maxHp: number; // 最大生命值
  baseAttackMin: number; // 基础最小攻击
  baseAttackMax: number; // 基础最大攻击
  baseDefense: number; // 基础防御
  // 刷新概率
  spawnChance: number; // 刷新概率（0-100）
}

/**
 * BOSS 刷新配置接口
 * 定义 BOSS 在地图上的刷新配置
 */
export interface BossSpawnConfig {
  id: string; // 刷新配置唯一ID
  bossTemplateId: string; // BOSS 模板ID
  location: string; // 所在地图ID
  interactableId: string; // 交互对象ID
}

// ========== 公主关系系统类型定义 ==========

/**
 * 公主关系等级枚举
 * 定义玩家与公主的关系等级
 */
export type RelationshipLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/**
 * 公主关系数据接口
 * 包含关系等级、亲密度、关系名称等信息
 */
export interface PrincessRelationship {
  level: RelationshipLevel; // 关系等级 (0-6)
  intimacy: number; // 亲密度（经验值）
  relationshipName: string; // 关系名称
  canChatToday: boolean; // 今天是否可以聊天
  canGiftToday: boolean; // 今天是否可以送礼
  canReceiveSundayGift: boolean; // 本周是否可以领取周日礼物
  hasReceivedConfidantGift: boolean; // 是否已领取知己的礼物
  weeklyRoseGiftCount: number; // 本周已赠送的玫瑰花数量（999玫瑰和99玫瑰合计最多12个）
}

/**
 * 关系等级配置接口
 * 定义每个关系等级的详细信息
 */
export interface RelationshipLevelConfig {
  level: RelationshipLevel; // 关系等级
  name: string; // 关系名称
  minIntimacy: number; // 最小亲密度
  maxIntimacy: number; // 最大亲密度
  chatReward?: ChatReward; // 聊天奖励
  sundayGift?: SundayGift; // 周日礼物
  unlockSkill?: { // 解锁技能
    skillId: string;
    skillLevel: number;
  };
}

/**
 * 聊天奖励接口
 * 定义聊天获得的奖励
 */
export interface ChatReward {
  petType: string; // 幻兽类型
  petStar: number; // 幻兽星级
  description: string; // 奖励描述
}

/**
 * 周日礼物接口
 * 定义周日领取的礼物
 */
export interface SundayGift {
  itemId: string; // 物品ID
  itemName: string; // 物品名称
  description: string; // 礼物描述
  condition?: string; // 额外条件描述
}

/**
 * 送礼结果接口
 * 定义送礼后的结果
 */
export interface GiftResult {
  success: boolean; // 是否成功
  intimacyGain: number; // 获得的亲密度
  message: string; // 提示消息
}

/**
 * 魔族大军情报接口
 * 定义魔族军队的信息
 */
export interface DemonArmyInfo {
  id: string; // 魔族ID
  name: string; // 魔族名称
  level: number; // 等级
  effect: string; // 特殊效果
  description: string; // 详细描述
}

// ========== 日常任务系统类型定义 ==========

/**
 * 日常任务类型枚举
 * 定义不同类型的日常任务
 */
export type DailyTaskType = 'collect' | 'train' | 'raid' | 'pk' | 'dungeon';

/**
 * 日常任务奖励接口
 * 定义任务完成后的奖励内容
 */
export interface DailyTaskReward {
  exp?: number; // 经验值奖励
  merit?: number; // 功勋值奖励
  battleExp?: number; // 战功奖励
  magicStone?: number; // 魔石奖励
  items?: string[]; // 物品奖励列表
  description: string; // 奖励描述
}

/**
 * 日常任务需求接口
 * 定义任务完成所需的要求
 */
export interface DailyTaskRequirement {
  type: string; // 需求类型（如 'collect', 'defeat', 'submit'）
  target: string; // 目标名称（如 '灵魂晶石', '冰雪巨人'）
  quantity: number; // 所需数量
  description: string; // 需求描述
}

/**
 * 日常任务接口
 * 定义每日任务的所有属性
 * 参考文档：reference/docs/scripts_analysis/14_NPC系统.md
 */
export interface DailyTask {
  id: string; // 任务唯一ID
  name: string; // 任务名称
  type: DailyTaskType; // 任务类型
  weekday: number; // 星期几（0=周日, 1=周一, ..., 6=周六）
  weekdayName: string; // 星期名称（如 '周一', '周二'）
  description: string; // 任务描述
  requirement: DailyTaskRequirement; // 任务需求
  reward: DailyTaskReward; // 任务奖励
  npcId: string; // 发布任务的NPC ID
  location: string; // 任务地点
  icon: string; // 任务图标
}

/**
 * 日常任务状态接口
 * 定义玩家当前任务的状态
 */
export interface DailyTaskStatus {
  taskId: string; // 任务ID
  isAccepted: boolean; // 是否已接受
  isCompleted: boolean; // 是否已完成
  isRewarded: boolean; // 是否已领取奖励
  progress: number; // 当前进度
  targetProgress: number; // 目标进度
  acceptedAt?: number; // 接受时间戳
  completedAt?: number; // 完成时间戳
}

/**
 * 日常任务完成结果接口
 * 定义任务完成后的结果
 */
export interface DailyTaskCompletionResult {
  success: boolean; // 是否成功
  message: string; // 提示消息
  rewards?: DailyTaskReward; // 获得的奖励
}

/**
 * 训练幻兽任务奖励配置接口
 * 定义不同星级幻兽的奖励
 */
export interface PetTrainingReward {
  starLevel: number; // 幻兽星级
  magicStone: number; // 奖励魔石数量
  description: string; // 奖励描述
}

/**
 * 日常任务状态管理接口
 * 定义日常任务系统的状态，包括任务完成标记和怪物刷新状态
 * 参考文档：reference/docs/日常任务官交互逻辑文档.md
 */
export interface DailyTaskState {
  // 任务完成标记（对应参考文档中的 rw_bs, rw_hs, rw_dxc）
  rw_bs: boolean; // BOSS任务（收集宝石）是否可完成，true表示可以完成任务
  rw_hs: boolean; // 幻兽任务（训练幻兽）是否可完成，true表示可以完成任务
  rw_dxc: boolean; // 地下城任务是否可完成，true表示可以完成任务

  // 地下城怪物状态（对应参考文档中的 rw_gw1_1 等）
  rw_gw1_1: boolean; // 地下城1层怪物1是否存在，true表示存在
  rw_gw1_2: boolean; // 地下城1层怪物2是否存在，true表示存在
  rw_gw1_3: boolean; // 地下城1层怪物3是否存在，true表示存在
  rw_gw2_1: boolean; // 地下城2层怪物1是否存在，true表示存在
  rw_gw2_2: boolean; // 地下城2层怪物2是否存在，true表示存在
  rw_gw3_1: boolean; // 地下城3层怪物是否存在，true表示存在

  // 雪域边境怪物状态（周五任务）
  gw_xybj_1: boolean; // 雪域边境怪物1是否存在，true表示存在
  gw_xybj_2: boolean; // 雪域边境怪物2是否存在，true表示存在
  gw_xybj_3: boolean; // 雪域边境怪物3是否存在，true表示存在
  gw_xybj_4: boolean; // 雪域边境怪物4是否存在，true表示存在
  gw_xybj_5: boolean; // 雪域边境怪物5是否存在，true表示存在

  // 魔族大军状态（魔中军阵地）
  mj_gj: boolean; // 魔军突击队是否存在，true表示存在
  mj_fy: boolean; // 魔军守卫军是否存在，true表示存在
  mj_tt: boolean; // 魔军图腾兽是否存在，true表示存在
  mj_sm: boolean; // 魔军神秘部队是否存在，true表示存在
  mj_zs: boolean; // 魔军主帅是否存在，true表示存在
  mj_nl: boolean; // 魔的能量是否存在，true表示存在

  // 任务进度追踪
  currentTaskId?: string; // 当前接受的任务ID
  taskAcceptedAt?: number; // 任务接受时间戳
  taskProgress: number; // 任务进度（已完成的数量）
}

// ==================== 商店系统类型定义 ====================

/**
 * 商店类型枚举
 * 定义游戏中的商店类型
 */
export type ShopType = 'gold' | 'magicStone';

/**
 * 商店物品类型枚举
 * 定义商店出售的物品类型
 */
export type ShopItemType = 'consumable' | 'gem' | 'skillBook' | 'equipment' | 'pet' | 'special';

/**
 * 商店物品接口
 * 定义商店出售的物品信息
 */
export interface ShopItem {
  id: string; // 物品唯一ID
  name: string; // 物品名称
  type: ShopItemType; // 物品类型
  priceGold: number; // 金币价格
  priceMagicStone: number; // 魔石价格
  description: string; // 物品描述
  icon: string; // 物品图标（emoji）
  imagePath?: string; // 物品图片路径（可选）
  stackable: boolean; // 是否可堆叠
  maxStack: number; // 最大堆叠数量
}

/**
 * 商店配置接口
 * 定义商店的基本信息和物品列表
 */
export interface ShopConfig {
  type: ShopType; // 商店类型
  name: string; // 商店名称
  description: string; // 商店描述
  items: ShopItem[]; // 物品列表
}

/**
 * 购买结果接口
 * 定义购买操作的返回结果
 */
export interface PurchaseResult {
  success: boolean; // 是否成功
  message: string; // 结果消息
  itemId?: string; // 物品ID
  quantity?: number; // 购买数量
  goldSpent?: number; // 花费的金币
  magicStoneSpent?: number; // 花费的魔石
}

/**
 * 出售结果接口
 * 定义出售操作的返回结果
 */
export interface SellResult {
  success: boolean; // 是否成功
  message: string; // 结果消息
  goldEarned?: number; // 获得的金币
  magicStoneEarned?: number; // 获得的魔石
  itemId?: string; // 物品ID
  quantity?: number; // 出售数量
}

// ========== 战魂系统类型定义 ==========

/**
 * 战魂类型枚举
 * 定义装备战魂的类型
 */
export enum WarSoulType {
  /** 无战魂 */
  NONE = 0,
  /** 天魂 */
  TIAN_HUN = 1,
  /** 地魂 */
  DI_HUN = 2
}

/**
 * 战魂物品类型
 * 定义战魂物品的具体类型
 * - zhanHunZhiXin: 战魂之心
 * - zhanHunJingShi: 战魂晶石
 */
export type WarSoulItemType = 'zhanHunZhiXin' | 'zhanHunJingShi';

/**
 * 战魂掉落配置接口
 * 定义怪物掉落战魂物品的配置
 */
export interface WarSoulDropConfig {
  monsterId: string; // 怪物ID
  itemType: WarSoulItemType; // 战魂物品类型（战魂之心/战魂晶石）
  dropRate: number; // 掉落概率（0-1之间）
  requireSystemEnabled: boolean; // 是否需要战魂系统开启才能掉落
}

// ========== 地图挑战系统类型定义 ==========

/**
 * 地图挑战状态接口
 * 从 mapChallengeUtils.ts 重新导出
 */
export interface MapChallengeState {
  /** 当前拥有的地图ID */
  ownerMap: string | null;
  /** 今日奖励是否可领取 */
  mapReward: boolean;
  /** 今日是否可挑战（所有地图共享一次机会） */
  mapRace: boolean;
}

