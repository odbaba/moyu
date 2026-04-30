import type { CharacterData, Pet } from '../types';
import {
  calculateAllEquipmentQualityCombatPower,
  calculateAllHoleCountCombatPower,
  calculateAllGemCombatPower,
  calculateEquipmentBaseCombatPower,
  calculateFullSetMagicSoulBonusCombatPower,
  calculateSoulCombatPower,
  calculateAllPetsCombatPower
} from './combatPower';

// 单个维度的评价结果
export interface EvaluationItem {
  value: number | string; // 显示的数值
  label: string; // 维度名称
  name: string; // 玩家当前名称（如军衔名称"元帅"、爵位名称"王"等）
  title: string; // 获得的称号（如"终极勇士"）
  isHighest: boolean; // 是否获得最高评价
}

// 综合评语结果
export interface OverallEvaluation {
  title: string; // 综合评语标题（如"绝世高手"、"天才游戏玩家"等）
  description: string; // 综合评语内容
  maxPrice: number; // 获得最高评价的数量
}

// 完整结算结果
export interface GameEndingResult {
  isWin: boolean;
  daysPassed: number;
  combatPower: EvaluationItem;
  level: EvaluationItem;
  equipment: EvaluationItem;
  pet: EvaluationItem;
  militaryRank: EvaluationItem;
  nobleRank: EvaluationItem;
  princessRelation: EvaluationItem;
  wealth: EvaluationItem;
  overall: OverallEvaluation;
}

// 游戏结算参数
export interface GameEndingParams {
  isWin: boolean;
  daysPassed: number;
  maxCombatPower: number;
  level: number;
  equipment: CharacterData['equipment'];
  pets: Pet[];
  militaryRankLevel: number;
  militaryRankName: string;
  nobleRankLevel: number;
  nobleRankName: string;
  relationshipLevel: number;
  relationshipName: string;
  gold: number;
  magicStone: number;
}

/**
 * 格式化数字，添加千分位逗号
 * 例如：68367565 → "68,367,565"
 * @param num 需要格式化的数字
 * @returns 格式化后的字符串
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 战斗力评价
 * 根据最大战斗力给出对应称号和是否最高评价
 * @param maxCombatPower 最大战斗力
 * @returns 战斗力维度评价结果
 */
export function evaluateCombatPower(maxCombatPower: number): EvaluationItem {
  let title: string;
  let isHighest: boolean;

  if (maxCombatPower >= 1200) {
    title = '终极勇士';
    isHighest = true;
  } else if (maxCombatPower >= 1000) {
    title = '罕见的';
    isHighest = false;
  } else if (maxCombatPower >= 800) {
    title = '非常利害';
    isHighest = false;
  } else if (maxCombatPower >= 600) {
    title = '很利害';
    isHighest = false;
  } else if (maxCombatPower >= 300) {
    title = '普通';
    isHighest = false;
  } else {
    title = '无';
    isHighest = false;
  }

  return {
    value: maxCombatPower,
    label: '你的战斗力',
    name: '',
    title,
    isHighest
  };
}

/**
 * 等级评价
 * 根据角色等级给出对应称号和是否最高评价
 * @param level 角色等级
 * @returns 等级维度评价结果
 */
export function evaluateLevel(level: number): EvaluationItem {
  let title: string;
  let isHighest: boolean;

  if (level >= 132) {
    title = '冲级能手';
    isHighest = true;
  } else if (level >= 120) {
    title = '练级高手';
    isHighest = false;
  } else if (level >= 100) {
    title = '很会升级';
    isHighest = false;
  } else if (level >= 70) {
    title = '练级还行';
    isHighest = false;
  } else {
    title = '低级菜鸟';
    isHighest = false;
  }

  return {
    value: level + '级',
    label: '你的等级',
    name: '',
    title,
    isHighest
  };
}

/**
 * 装备评价
 * 根据装备战斗力给出对应称号和是否最高评价
 * @param equipmentPower 装备战斗力
 * @returns 装备维度评价结果
 */
export function evaluateEquipment(equipmentPower: number): EvaluationItem {
  let title: string;
  let isHighest: boolean;

  if (equipmentPower >= 126) {
    title = '装备打造宗师';
    isHighest = true;
  } else if (equipmentPower >= 108) {
    title = '装备打造大师';
    isHighest = false;
  } else if (equipmentPower >= 72) {
    title = '装备打造高手';
    isHighest = false;
  } else if (equipmentPower >= 48) {
    title = '装备打造学徒';
    isHighest = false;
  } else {
    title = '装备打造傻鸟';
    isHighest = false;
  }

  return {
    value: equipmentPower + '战斗力',
    label: '你的装备的战斗力',
    name: '',
    title,
    isHighest
  };
}

/**
 * 幻兽评价
 * 根据幻兽战斗力给出对应称号和是否最高评价
 * @param petPower 幻兽战斗力
 * @returns 幻兽维度评价结果
 */
export function evaluatePet(petPower: number): EvaluationItem {
  let title: string;
  let isHighest: boolean;

  if (petPower >= 400) {
    title = '究极幻兽师';
    isHighest = true;
  } else if (petPower >= 320) {
    title = '幻兽培养大师';
    isHighest = false;
  } else if (petPower >= 250) {
    title = '幻兽培养高手';
    isHighest = false;
  } else if (petPower >= 100) {
    title = '善于培养幻兽';
    isHighest = false;
  } else {
    title = '不会培养幻兽';
    isHighest = false;
  }

  return {
    value: petPower + '战斗力',
    label: '你的幻兽的战斗力',
    name: '',
    title,
    isHighest
  };
}

/**
 * 军衔评价
 * 根据军衔等级给出对应称号和是否最高评价
 * @param militaryRankLevel 军衔等级
 * @param militaryRankName 军衔名称
 * @returns 军衔维度评价结果
 */
export function evaluateMilitaryRank(militaryRankLevel: number, militaryRankName: string): EvaluationItem {
  let title: string;
  let isHighest: boolean;

  if (militaryRankLevel >= 11) {
    title = '亚特兰蒂斯战神';
    isHighest = true;
  } else if (militaryRankLevel === 10) {
    title = '亚特兰蒂斯名将';
    isHighest = false;
  } else if (militaryRankLevel >= 7) {
    title = '亚特兰蒂斯高级军官';
    isHighest = false;
  } else if (militaryRankLevel >= 4) {
    title = '亚特兰蒂斯中级军官';
    isHighest = false;
  } else if (militaryRankLevel >= 1) {
    title = '亚特兰蒂斯下级军官';
    isHighest = false;
  } else {
    title = '无名小兵';
    isHighest = false;
  }

  return {
    value: militaryRankName,
    label: '你的军衔',
    name: militaryRankName,
    title,
    isHighest
  };
}

/**
 * 爵位评价
 * 根据爵位等级给出对应称号和是否最高评价
 * @param nobleRankLevel 爵位等级
 * @param nobleRankName 爵位名称
 * @returns 爵位维度评价结果
 */
export function evaluateNobleRank(nobleRankLevel: number, nobleRankName: string): EvaluationItem {
  let title: string;
  let isHighest: boolean;

  if (nobleRankLevel >= 6) {
    title = '人类的骄傲';
    isHighest = true;
  } else if (nobleRankLevel === 5) {
    title = '无尚荣誉的贵族';
    isHighest = false;
  } else if (nobleRankLevel === 4) {
    title = '令人尊敬的贵族';
    isHighest = false;
  } else if (nobleRankLevel >= 2) {
    title = '荣誉贵族';
    isHighest = false;
  } else if (nobleRankLevel === 1) {
    title = '贵族';
    isHighest = false;
  } else {
    title = '平民';
    isHighest = false;
  }

  return {
    value: nobleRankName,
    label: '你的爵位',
    name: nobleRankName,
    title,
    isHighest
  };
}

/**
 * 公主关系评价
 * 根据与公主的关系等级给出对应称号和是否最高评价
 * @param relationshipLevel 关系等级
 * @param relationshipName 关系名称
 * @returns 公主关系维度评价结果
 */
export function evaluatePrincessRelation(relationshipLevel: number, relationshipName: string): EvaluationItem {
  let title: string;
  let isHighest: boolean;

  if (relationshipLevel >= 6) {
    title = '情圣';
    isHighest = true;
  } else if (relationshipLevel === 5) {
    title = '情商过人';
    isHighest = false;
  } else if (relationshipLevel === 4) {
    title = '交际高手';
    isHighest = false;
  } else if (relationshipLevel === 3) {
    title = '善于交往';
    isHighest = false;
  } else {
    title = '不懂交往';
    isHighest = false;
  }

  return {
    value: relationshipName,
    label: '你与公主关系',
    name: relationshipName,
    title,
    isHighest
  };
}

/**
 * 财富评价
 * 根据金钱和魔石数量给出对应称号和是否最高评价
 * 财富值 = Math.floor(金钱 / 10000) + 魔石
 * @param gold 金钱数量
 * @param magicStone 魔石数量
 * @returns 财富维度评价结果
 */
export function evaluateWealth(gold: number, magicStone: number): EvaluationItem {
  // 计算财富值：金钱除以万取整 + 魔石
  const wealth = Math.floor(gold / 10000) + magicStone;

  let title: string;
  let isHighest: boolean;

  if (wealth >= 500000) {
    title = '富可敌国';
    isHighest = true;
  } else if (wealth >= 350000) {
    title = '大富豪';
    isHighest = false;
  } else if (wealth >= 200000) {
    title = '小富商';
    isHighest = false;
  } else if (wealth >= 50000) {
    title = '还能过日子';
    isHighest = false;
  } else {
    title = '贫穷的家伙';
    isHighest = false;
  }

  // 格式化显示的金钱和魔石数值
  const value = `${formatNumber(gold)} 金钱 ${formatNumber(magicStone)} 魔石`;

  return {
    value,
    label: '你的金钱和魔石',
    name: '',
    title,
    isHighest
  };
}

/**
 * 计算装备战斗力
 * 装备战斗力 = 装备基础贡献 + 品质战斗力 + 洞数战斗力 + 宝石战斗力 + 全套魔魂加成 + 战魂战斗力
 * @param equipment 角色装备对象
 * @returns 装备战斗力总值
 */
export function calculateEquipmentPower(equipment: CharacterData['equipment']): number {
  const basePower = calculateEquipmentBaseCombatPower(equipment);
  const qualityPower = calculateAllEquipmentQualityCombatPower(equipment);
  const holeCountPower = calculateAllHoleCountCombatPower(equipment);
  const gemPower = calculateAllGemCombatPower(equipment);
  const fullSetMagicSoulBonus = calculateFullSetMagicSoulBonusCombatPower(equipment);
  const soulPower = calculateSoulCombatPower(equipment);

  return basePower + qualityPower + holeCountPower + gemPower + fullSetMagicSoulBonus + soulPower;
}

/**
 * 计算幻兽战斗力
 * 委托给 combatPower.ts 中的 calculateAllPetsCombatPower
 * @param pets 幻兽数组
 * @returns 幻兽战斗力总值
 */
export function calculatePetPower(pets: Pet[]): number {
  return calculateAllPetsCombatPower(pets);
}

/**
 * 生成综合评语
 * 根据胜利状态、最高评价数量和军衔等级生成综合评语
 * @param evaluations 所有维度的评价结果数组
 * @param militaryRankLevel 军衔等级
 * @param isWin 是否胜利
 * @returns 综合评语结果
 */
export function generateOverallEvaluation(
  evaluations: EvaluationItem[],
  militaryRankLevel: number,
  isWin: boolean
): OverallEvaluation {
  // 失败时返回空评语
  if (!isWin) {
    return {
      title: '无',
      description: '无',
      maxPrice: 0
    };
  }

  // 计算获得最高评价的维度数量
  const maxPrice = evaluations.filter(e => e.isHighest).length;

  let title: string;
  let description: string;

  if (maxPrice === 7) {
    // 全部7个维度都获得最高评价
    title = '绝世高手';
    description = '你能玩到这地步，我无语――绝世高手啊。(最高评价)';
  } else if (maxPrice >= 5) {
    // 5个及以上维度获得最高评价
    title = '天才游戏玩家';
    description = '天啊！你凭着超人的智慧，无比的英勇，击败数不清的（就是未来人类所说的无数个）魔族大军，被人类推举为最高军事领袖之一。看，魔族大军已经溃不成军了，人类已经为胜利准备了盛宴在等待你凯旋。你真不愧是天才游戏玩家。';
  } else if (militaryRankLevel >= 7) {
    // 军衔等级7级及以上
    title = '不败将军';
    description = '你以势如破竹的进攻将魔族大军打得得花流水，魔族大军一谈到你的名字就脸色都变了（就是未来人类所说的谈虎色变）。在你的指挥下的如钢铁般的军队的打击下，魔族大军已经知道它们已是胜利无望了，它们正在做着逃跑的准备了。';
  } else if (militaryRankLevel >= 4) {
    // 军衔等级4级至6级
    title = '神勇战士';
    description = '在这60天里亚特兰蒂斯出现了一个神勇的战士，就是你，你的无畏的勇气打倒一批批的魔族大军，由于你卓越的战功，人们赠与你不败将军的称号，从你身上人类看到了胜利将属于人类的。';
  } else if (militaryRankLevel >= 1) {
    // 军衔等级1级至3级
    title = '英勇战士';
    description = '你在60天的战斗里取得了优异的战绩，亚特兰蒂斯与魔族的战斗还在进行中，你已经是一位英勇的战士，希望你能战斗到胜利！';
  } else {
    // 军衔等级为0
    title = '菜鸟';
    description = '游戏结束了，哎，你在唱着："我是一只菜菜鸟，想要飞呀却飞也飞不高~。"离开了游戏。';
  }

  return {
    title,
    description,
    maxPrice
  };
}

/**
 * 计算游戏结算结果
 * 汇总所有8个维度的评价和综合评语，生成完整的结算结果
 * @param params 游戏结算参数
 * @returns 完整的游戏结算结果
 */
export function calculateGameEnding(params: GameEndingParams): GameEndingResult {
  // 计算装备战斗力
  const equipmentPower = calculateEquipmentPower(params.equipment);
  // 计算幻兽战斗力
  const petPower = calculatePetPower(params.pets);

  // 逐项评价8个维度
  const combatPowerEval = evaluateCombatPower(params.maxCombatPower);
  const levelEval = evaluateLevel(params.level);
  const equipmentEval = evaluateEquipment(equipmentPower);
  const petEval = evaluatePet(petPower);
  const militaryRankEval = evaluateMilitaryRank(params.militaryRankLevel, params.militaryRankName);
  const nobleRankEval = evaluateNobleRank(params.nobleRankLevel, params.nobleRankName);
  const princessRelationEval = evaluatePrincessRelation(params.relationshipLevel, params.relationshipName);
  const wealthEval = evaluateWealth(params.gold, params.magicStone);

  // 收集所有评价维度用于生成综合评语
  const evaluations: EvaluationItem[] = [
    combatPowerEval,
    levelEval,
    equipmentEval,
    petEval,
    militaryRankEval,
    nobleRankEval,
    princessRelationEval,
    wealthEval
  ];

  // 生成综合评语
  const overall = generateOverallEvaluation(evaluations, params.militaryRankLevel, params.isWin);

  return {
    isWin: params.isWin,
    daysPassed: params.daysPassed,
    combatPower: combatPowerEval,
    level: levelEval,
    equipment: equipmentEval,
    pet: petEval,
    militaryRank: militaryRankEval,
    nobleRank: nobleRankEval,
    princessRelation: princessRelationEval,
    wealth: wealthEval,
    overall
  };
}
