/**
 * 幻兽幻化系统
 * 提供幻兽幻化相关的计算和执行功能
 * 参考文档：reference/docs/幻兽幻化师交互逻辑文档.md
 */

import type { Pet, PetType } from '../types';
import { getQualityTitle, upgradePetLevel } from './petGenerator';

// ==================== 评分计算相关函数 ====================

/**
 * 计算最小攻击成长评分
 * 基础值为10，评分规则：0-10分区间每分20分，10分以上每分100分
 *
 * @param pet 幻兽对象
 * @returns 最小攻击成长评分
 */
function calculateMinAttackGrowthScore(pet: Pet): number {
  const base = 10;
  const diff = pet.cz_xgj - base;

  if (diff <= 0) return 0;
  if (diff <= 10) return diff * 20;

  return (diff - 10) * 100 + 200;
}

/**
 * 计算最大攻击成长评分
 * 基础值为15，评分规则：0-10分区间每分20分，10分以上每分100分
 *
 * @param pet 幻兽对象
 * @returns 最大攻击成长评分
 */
function calculateMaxAttackGrowthScore(pet: Pet): number {
  const base = 15;
  const diff = pet.cz_dgj - base;

  if (diff <= 0) return 0;
  if (diff <= 10) return diff * 20;

  return (diff - 10) * 100 + 200;
}

/**
 * 计算防御成长评分
 * 基础值为5，评分规则：0-10分区间每分20分，10分以上每分100分
 *
 * @param pet 幻兽对象
 * @returns 防御成长评分
 */
function calculateDefenseGrowthScore(pet: Pet): number {
  const base = 5;
  const diff = pet.cz_fy - base;

  if (diff <= 0) return 0;
  if (diff <= 10) return diff * 20;

  return (diff - 10) * 100 + 200;
}

/**
 * 计算生命成长评分
 * 基础值为40，评分规则：0-10分区间每分20分，10分以上每分100分
 *
 * @param pet 幻兽对象
 * @returns 生命成长评分
 */
function calculateHpGrowthScore(pet: Pet): number {
  const base = 40;
  const diff = pet.cz_hp - base;

  if (diff <= 0) return 0;
  if (diff <= 10) return diff * 20;

  return (diff - 10) * 100 + 200;
}

/**
 * 根据幻兽类型获取主属性评分
 * 不同幻兽类型有不同的主属性定义
 *
 * @param pet 幻兽对象
 * @returns 主属性总评分
 */
function getMainAttributeScore(pet: Pet): number {
  switch (pet.hs_name) {
    case '攻防型':
    case '调皮鬼':
      // 主属性：最小攻击成长、最大攻击成长、防御成长
      return calculateMinAttackGrowthScore(pet) + calculateMaxAttackGrowthScore(pet) + calculateDefenseGrowthScore(pet);
    case '吉鲁猪':
    case '奇异兽':
    case '守护':
      // 主属性：最小攻击成长、最大攻击成长
      return calculateMinAttackGrowthScore(pet) + calculateMaxAttackGrowthScore(pet);
    case '圣天使':
      // 主属性：最小攻击成长、最大攻击成长、生命成长
      return calculateMinAttackGrowthScore(pet) + calculateMaxAttackGrowthScore(pet) + calculateHpGrowthScore(pet);
    case '年猪':
      // 年猪：全属性都是主属性
      return calculateMinAttackGrowthScore(pet) + calculateMaxAttackGrowthScore(pet) + calculateDefenseGrowthScore(pet) + calculateHpGrowthScore(pet);
    case '噜噜':
      // 噜噜：最小攻击成长、最大攻击成长
      return calculateMinAttackGrowthScore(pet) + calculateMaxAttackGrowthScore(pet);
    default:
      return calculateMinAttackGrowthScore(pet) + calculateMaxAttackGrowthScore(pet);
  }
}

// ==================== 核心幻化函数 ====================

/**
 * 计算副幻兽评分要求
 * 当主幻兽评分较高时，会对副幻兽有评分要求
 *
 * @param mainPetScore 主幻兽评分
 * @returns 副幻兽评分要求（如果主幻兽评分 < 1500，返回0表示无要求）
 */
export function calculateScoreRequirement(mainPetScore: number): number {
  // 评分低于1500时无要求
  if (mainPetScore < 1500) {
    return 0;
  }

  // 评分要求 = (主幻兽评分 - 500) / 2
  return Math.floor((mainPetScore - 500) / 2);
}

/**
 * 计算幻化系数
 * 幻化系数决定了主属性成长加成的幅度
 * 公式：幻化系数 = min(副幻兽品质 / max(主幻兽主属性评分, 20), 2)
 *
 * @param mainPet 主幻兽
 * @param subPet 副幻兽
 * @returns 幻化系数（0-2之间）
 */
export function calculateFusionRatio(mainPet: Pet, subPet: Pet): number {
  // 计算主幻兽的主属性评分
  const mainScore = getMainAttributeScore(mainPet);

  // 确定评分下限（主幻兽评分最低20）
  const scoreMin = Math.max(mainScore, 20);

  // 确定副幻兽品质下限（副幻兽品质最低40）
  const subPz = Math.max(subPet.pz, 40);

  // 计算幻化系数（上限为2）
  const ratio = Math.min(subPz / scoreMin, 2);

  return ratio;
}

/**
 * 根据幻兽类型应用主属性幻化
 * 不同幻兽类型有不同的加成系数
 *
 * @param mainPet 主幻兽
 * @param subPet 副幻兽（用于计算幻化系数）
 * @param ratio 幻化系数
 * @returns 幻化结果描述字符串
 */
export function applyMainAttributeFusion(mainPet: Pet, _subPet: Pet, ratio: number): string {
  let result = '主属性幻化：\n';
  const scoreBefore = getMainAttributeScore(mainPet);

  // 根据幻兽类型应用不同的加成系数
  switch (mainPet.hs_name) {
    case '攻防型':
      // 攻防型：最小攻击成长+ratio*1.0, 最大攻击成长+ratio*1.2, 防御成长+ratio*0.8
      mainPet.cz_xgj = Math.round((mainPet.cz_xgj + ratio * 1.0) * 10) / 10;
      mainPet.cz_dgj = Math.round((mainPet.cz_dgj + ratio * 1.2) * 10) / 10;
      mainPet.cz_fy = Math.round((mainPet.cz_fy + ratio * 0.8) * 10) / 10;
      result += `最小攻击成长+${(ratio * 1.0).toFixed(1)}\n`;
      result += `最大攻击成长+${(ratio * 1.2).toFixed(1)}\n`;
      result += `防御成长+${(ratio * 0.8).toFixed(1)}\n`;
      break;

    case '调皮鬼':
      // 调皮鬼：最小攻击成长+ratio*0.8, 最大攻击成长+ratio*1.4, 防御成长+ratio*0.7
      mainPet.cz_xgj = Math.round((mainPet.cz_xgj + ratio * 0.8) * 10) / 10;
      mainPet.cz_dgj = Math.round((mainPet.cz_dgj + ratio * 1.4) * 10) / 10;
      mainPet.cz_fy = Math.round((mainPet.cz_fy + ratio * 0.7) * 10) / 10;
      result += `最小攻击成长+${(ratio * 0.8).toFixed(1)}\n`;
      result += `最大攻击成长+${(ratio * 1.4).toFixed(1)}\n`;
      result += `防御成长+${(ratio * 0.7).toFixed(1)}\n`;
      break;

    case '吉鲁猪':
      // 吉鲁猪：最小攻击成长+ratio*1.2, 最大攻击成长+ratio*1.6
      mainPet.cz_xgj = Math.round((mainPet.cz_xgj + ratio * 1.2) * 10) / 10;
      mainPet.cz_dgj = Math.round((mainPet.cz_dgj + ratio * 1.6) * 10) / 10;
      result += `最小攻击成长+${(ratio * 1.2).toFixed(1)}\n`;
      result += `最大攻击成长+${(ratio * 1.6).toFixed(1)}\n`;
      break;

    case '奇异兽':
      // 奇异兽：最小攻击成长+ratio*1.3, 最大攻击成长+ratio*1.3
      mainPet.cz_xgj = Math.round((mainPet.cz_xgj + ratio * 1.3) * 10) / 10;
      mainPet.cz_dgj = Math.round((mainPet.cz_dgj + ratio * 1.3) * 10) / 10;
      result += `最小攻击成长+${(ratio * 1.3).toFixed(1)}\n`;
      result += `最大攻击成长+${(ratio * 1.3).toFixed(1)}\n`;
      break;

    case '圣天使':
      // 圣天使：最小攻击成长+ratio*0.5, 最大攻击成长+ratio*0.8, 生命成长+ratio*1.8
      mainPet.cz_xgj = Math.round((mainPet.cz_xgj + ratio * 0.5) * 10) / 10;
      mainPet.cz_dgj = Math.round((mainPet.cz_dgj + ratio * 0.8) * 10) / 10;
      mainPet.cz_hp = Math.round((mainPet.cz_hp + ratio * 1.8) * 10) / 10;
      result += `最小攻击成长+${(ratio * 0.5).toFixed(1)}\n`;
      result += `最大攻击成长+${(ratio * 0.8).toFixed(1)}\n`;
      result += `生命成长+${(ratio * 1.8).toFixed(1)}\n`;
      break;

    case '守护':
      // 守护：最小攻击成长+ratio*1.4, 最大攻击成长+ratio*1.6
      mainPet.cz_xgj = Math.round((mainPet.cz_xgj + ratio * 1.4) * 10) / 10;
      mainPet.cz_dgj = Math.round((mainPet.cz_dgj + ratio * 1.6) * 10) / 10;
      result += `最小攻击成长+${(ratio * 1.4).toFixed(1)}\n`;
      result += `最大攻击成长+${(ratio * 1.6).toFixed(1)}\n`;
      break;

    case '年猪':
      // 年猪：最小攻击成长+ratio*1.1, 最大攻击成长+ratio*1.2, 防御成长+ratio*1.0, 生命成长+ratio*1.5
      mainPet.cz_xgj = Math.round((mainPet.cz_xgj + ratio * 1.1) * 10) / 10;
      mainPet.cz_dgj = Math.round((mainPet.cz_dgj + ratio * 1.2) * 10) / 10;
      mainPet.cz_fy = Math.round((mainPet.cz_fy + ratio * 1.0) * 10) / 10;
      mainPet.cz_hp = Math.round((mainPet.cz_hp + ratio * 1.5) * 10) / 10;
      result += `最小攻击成长+${(ratio * 1.1).toFixed(1)}\n`;
      result += `最大攻击成长+${(ratio * 1.2).toFixed(1)}\n`;
      result += `防御成长+${(ratio * 1.0).toFixed(1)}\n`;
      result += `生命成长+${(ratio * 1.5).toFixed(1)}\n`;
      break;

    case '噜噜':
      // 噜噜：最小攻击成长+ratio*1.0, 最大攻击成长+ratio*1.2
      mainPet.cz_xgj = Math.round((mainPet.cz_xgj + ratio * 1.0) * 10) / 10;
      mainPet.cz_dgj = Math.round((mainPet.cz_dgj + ratio * 1.2) * 10) / 10;
      result += `最小攻击成长+${(ratio * 1.0).toFixed(1)}\n`;
      result += `最大攻击成长+${(ratio * 1.2).toFixed(1)}\n`;
      break;

    default:
      // 默认处理：最小攻击成长+ratio*1.0, 最大攻击成长+ratio*1.2
      mainPet.cz_xgj = Math.round((mainPet.cz_xgj + ratio * 1.0) * 10) / 10;
      mainPet.cz_dgj = Math.round((mainPet.cz_dgj + ratio * 1.2) * 10) / 10;
      result += `最小攻击成长+${(ratio * 1.0).toFixed(1)}\n`;
      result += `最大攻击成长+${(ratio * 1.2).toFixed(1)}\n`;
      break;
  }

  // 确保最小攻击成长不超过最大攻击成长
  if (mainPet.cz_xgj > mainPet.cz_dgj) {
    mainPet.cz_dgj = mainPet.cz_xgj;
  }

  const scoreAfter = getMainAttributeScore(mainPet);
  const scoreGain = scoreAfter - scoreBefore;
  result += `主属性加分：+${scoreGain.toFixed(2)}分\n`;

  return result;
}

/**
 * 应用副属性幻化
 * 副属性（生命成长率和防御成长率）的转移
 * 继承值 = (副幻兽属性 - 主幻兽属性) * 0.9（仅当副幻兽属性更高时）
 *
 * @param mainPet 主幻兽
 * @param subPet 副幻兽
 * @returns 幻化结果描述字符串
 */
export function applySubAttributeFusion(mainPet: Pet, subPet: Pet): string {
  let result = '副属性幻化：\n';
  let hasChange = false;

  // 根据幻兽类型确定哪些是副属性
  // 攻防型、调皮鬼：副属性是生命成长
  // 吉鲁猪、奇异兽、守护：副属性是防御成长和生命成长
  // 圣天使：副属性是防御成长
  // 年猪：无副属性（全属性都是主属性）

  if (mainPet.hs_name === '年猪') {
    return '年猪无副属性幻化\n';
  }

  // 生命成长继承（适用于大部分幻兽类型，除了圣天使和年猪）
  if (mainPet.hs_name !== '圣天使') {
    const hpDiff = subPet.cz_hp - mainPet.cz_hp;
    if (hpDiff > 0) {
      const hpGain = Math.round(hpDiff * 0.9 * 10) / 10;
      mainPet.cz_hp = Math.round((mainPet.cz_hp + hpGain) * 10) / 10;
      result += `生命成长+${hpGain.toFixed(1)}\n`;
      hasChange = true;
    }
  }

  // 防御成长继承（适用于吉鲁猪、奇异兽、守护、圣天使）
  if (mainPet.hs_name === '吉鲁猪' || mainPet.hs_name === '奇异兽' || mainPet.hs_name === '守护' || mainPet.hs_name === '圣天使') {
    const defDiff = subPet.cz_fy - mainPet.cz_fy;
    if (defDiff > 0) {
      const defGain = Math.round(defDiff * 0.9 * 10) / 10;
      mainPet.cz_fy = Math.round((mainPet.cz_fy + defGain) * 10) / 10;
      result += `防御成长+${defGain.toFixed(1)}\n`;
      hasChange = true;
    }
  }

  if (!hasChange) {
    result += '无属性提升\n';
  }

  return result;
}

/**
 * 应用初始属性幻化
 * 初始属性（初始生命、初始最小攻击、初始最大攻击、初始防御）的转移
 * 继承值 = (副幻兽属性 - 主幻兽属性) * 0.85（仅当副幻兽属性更高时）
 * 年猪不进行初始属性幻化
 *
 * @param mainPet 主幻兽
 * @param subPet 副幻兽
 * @returns 幻化结果描述字符串
 */
export function applyInitialAttributeFusion(mainPet: Pet, subPet: Pet): string {
  // 年猪不进行初始属性幻化
  if (mainPet.hs_name === '年猪') {
    return '年猪不进行初始属性幻化\n';
  }

  let result = '初始属性幻化：\n';
  let hasChange = false;

  // 初始最小攻击转移
  const minAtkDiff = subPet.cxgj - mainPet.cxgj;
  if (minAtkDiff > 0) {
    const gain = Math.round(minAtkDiff * 0.85);
    mainPet.cxgj += gain;
    result += `初始最小攻击+${gain}\n`;
    hasChange = true;
  }

  // 初始最大攻击转移
  const maxAtkDiff = subPet.cdgj - mainPet.cdgj;
  if (maxAtkDiff > 0) {
    const gain = Math.round(maxAtkDiff * 0.85);
    mainPet.cdgj += gain;
    result += `初始最大攻击+${gain}\n`;
    hasChange = true;
  }

  // 初始防御转移
  const defDiff = subPet.cfy - mainPet.cfy;
  if (defDiff > 0) {
    const gain = Math.round(defDiff * 0.85);
    mainPet.cfy += gain;
    result += `初始防御+${gain}\n`;
    hasChange = true;
  }

  // 初始生命转移
  const hpDiff = subPet.chp - mainPet.chp;
  if (hpDiff > 0) {
    const gain = Math.round(hpDiff * 0.85);
    mainPet.chp += gain;
    result += `初始生命+${gain}\n`;
    hasChange = true;
  }

  if (!hasChange) {
    result += '无属性提升\n';
  }

  return result;
}

/**
 * 重新计算幻兽评分
 * 幻化后需要重新计算各项评分和总评分
 * 评分保留整数
 *
 * @param pet 幻兽对象
 */
function recalculatePetScore(pet: Pet): void {
  // 计算初始属性评分（保留整数）
  const pz_chp = Math.round(Math.max(0, (pet.chp - 100) * 2));
  const pz_cxgj = Math.round(Math.max(0, (pet.cxgj - 15) * 2));
  const pz_cdgj = Math.round(Math.max(0, (pet.cdgj - 25) * 2));
  const pz_cfy = Math.round(Math.max(0, (pet.cfy - 10) * 2));

  // 计算成长属性评分（保留整数）
  const baseHp = 40;
  const baseXgj = 10;
  const baseDgj = 15;
  const baseFy = 5;

  const calcGrowthScore = (value: number, base: number): number => {
    const diff = value - base;
    if (diff <= 0) return 0;
    if (diff <= 10) return Math.round(diff * 20);

    return Math.round((diff - 10) * 100 + 200);
  };

  const pz_cz_hp = calcGrowthScore(pet.cz_hp, baseHp);
  const pz_cz_xgj = calcGrowthScore(pet.cz_xgj, baseXgj);
  const pz_cz_dgj = calcGrowthScore(pet.cz_dgj, baseDgj);
  const pz_cz_fy = calcGrowthScore(pet.cz_fy, baseFy);

  // 更新 rating 对象
  pet.rating = {
    pzbase: pet.rating.pzbase,
    pz_chp,
    pz_cxgj,
    pz_cdgj,
    pz_cfy,
    pz_cz_hp,
    pz_cz_xgj,
    pz_cz_dgj,
    pz_cz_fy,
  };

  // 计算总评分（保留整数）
  pet.pz = Math.round(pet.rating.pzbase + pz_chp + pz_cxgj + pz_cdgj + pz_cfy + pz_cz_hp + pz_cz_xgj + pz_cz_dgj + pz_cz_fy);

  // 更新品质称号
  pet.qualityTitle = getQualityTitle(pet.pz);
}

/**
 * 执行完整的幻化流程
 * 包括主属性、副属性、初始属性幻化，以及等级重置和转世次数增加
 *
 * @param mainPet 主幻兽
 * @param subPet 副幻兽
 * @returns 幻化结果，包含成功状态、结果描述和更新后的幻兽
 */
export function executeFusion(mainPet: Pet, subPet: Pet): { success: boolean; result: string; updatedPet: Pet } {
  // 保存幻化前等级、经验、升级需求
  mainPet.predj = mainPet.dj;
  mainPet.prejy = mainPet.jy;
  mainPet.premjy = mainPet.mjy;

  // 计算幻化系数
  const ratio = calculateFusionRatio(mainPet, subPet);

  // 构建结果描述
  let result = '——————幻化成功——————\n\n';

  // 应用主属性幻化
  result += applyMainAttributeFusion(mainPet, subPet, ratio);
  result += '\n';

  // 应用副属性幻化
  result += applySubAttributeFusion(mainPet, subPet);
  result += '\n';

  // 应用初始属性幻化
  result += applyInitialAttributeFusion(mainPet, subPet);
  result += '\n';

  // 重置等级为1，经验为0，升级需求为10
  mainPet.dj = 1;
  mainPet.jy = 0;
  mainPet.mjy = 10;

  // 转世次数+1
  mainPet.zs += 1;

  // 重新计算属性值（hp, mhp, xgj, dgj, fy）基于新的等级和成长率
  const recalculatedPet = upgradePetLevel(mainPet, 1);

  // 重新计算评分
  recalculatePetScore(recalculatedPet);

  // 计算星级（评分/100，保留两位小数）
  const starLevel = (recalculatedPet.pz / 100).toFixed(2);

  result += `幻兽的转世次数加1，共转世${recalculatedPet.zs}次\n`;
  result += `幻化后评分：${recalculatedPet.pz}（极品${starLevel}星）\n`;

  return {
    success: true,
    result,
    updatedPet: recalculatedPet,
  };
}

/**
 * 检查幻化条件
 * 验证主幻兽和副幻兽是否满足幻化的所有条件
 * 注意：玩家等级40级的限制仅适用于自动幻化功能，普通幻化无此限制
 *
 * @param mainPet 主幻兽
 * @param subPet 副幻兽
 * @param skipLevelCheck 是否跳过等级检查（当开启自动使用经验球时跳过）
 * @returns 检查结果，包含是否可以幻化和错误信息数组
 */
export function checkFusionConditions(
  mainPet: Pet | null,
  subPet: Pet | null,
  skipLevelCheck: boolean = false
): { canFuse: boolean; errors: string[] } {
  const errors: string[] = [];

  // 检查主幻兽是否存在
  if (!mainPet) {
    errors.push('请放入主幻兽');

    return { canFuse: false, errors };
  }

  // 检查副幻兽是否存在
  if (!subPet) {
    errors.push('请放入副幻兽');

    return { canFuse: false, errors };
  }

  // 检查主幻兽等级是否 >= 50（如果未跳过等级检查）
  if (!skipLevelCheck && mainPet.dj < 50) {
    errors.push(`主幻兽等级不满50级（当前${mainPet.dj}级）`);
  }

  // 检查副幻兽类型是否与主幻兽相同或为奇异兽
  if (subPet.hs_name !== mainPet.hs_name && subPet.hs_name !== '奇异兽') {
    errors.push(`副幻兽类型必须与主幻兽相同或为奇异兽（主幻兽：${mainPet.hs_name}，副幻兽：${subPet.hs_name}）`);
  }

  // 检查副幻兽评分是否满足要求
  const scoreRequirement = calculateScoreRequirement(mainPet.pz);
  if (subPet.pz < scoreRequirement) {
    errors.push(`副幻兽的评分没有达到${scoreRequirement}分（当前${subPet.pz}分）`);
  }

  // 检查主幻兽和副幻兽是否相同
  if (mainPet.id === subPet.id) {
    errors.push('主幻兽和副幻兽不能相同');
  }

  // 注意：玩家等级40级的限制仅适用于自动幻化功能
  // 普通幻化没有等级限制，因此这里不检查玩家等级

  return {
    canFuse: errors.length === 0,
    errors,
  };
}

/**
 * 获取幻兽类型的主属性加成系数配置
 * 用于UI展示幻兽类型的加成特点
 *
 * @param petType 幻兽类型
 * @returns 主属性加成系数配置
 */
export function getFusionCoefficients(petType: PetType): {
  minAttack: number;
  maxAttack: number;
  defense: number;
  hp: number;
} {
  switch (petType) {
    case '攻防型':
      return { minAttack: 1.0, maxAttack: 1.2, defense: 0.8, hp: 0 };
    case '调皮鬼':
      return { minAttack: 0.8, maxAttack: 1.4, defense: 0.7, hp: 0 };
    case '吉鲁猪':
      return { minAttack: 1.2, maxAttack: 1.6, defense: 0, hp: 0 };
    case '奇异兽':
      return { minAttack: 1.3, maxAttack: 1.3, defense: 0, hp: 0 };
    case '圣天使':
      return { minAttack: 0.5, maxAttack: 0.8, defense: 0, hp: 1.8 };
    case '守护':
      return { minAttack: 1.4, maxAttack: 1.6, defense: 0, hp: 0 };
    case '年猪':
      return { minAttack: 1.1, maxAttack: 1.2, defense: 1.0, hp: 1.5 };
    case '噜噜':
      return { minAttack: 1.0, maxAttack: 1.2, defense: 0, hp: 0 };
    default:
      return { minAttack: 1.0, maxAttack: 1.2, defense: 0, hp: 0 };
  }
}
