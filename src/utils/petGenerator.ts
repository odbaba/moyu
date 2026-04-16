/**
 * 幻兽生成工具函数
 * 提供幻兽属性生成、评分计算等功能
 * 参考文档：reference/docs/初始幻兽生成规格文档.md
 */

import type { Pet, PetQuality, PetRating, PetType } from '../types';

// ========== 幻兽类型基础评分映射 ==========
const petTypeBaseScore: Record<PetType, number> = {
  '攻防型': 0,
  '调皮鬼': 280,
  '吉鲁猪': 380,
  '奇异兽': 450,
  '圣天使': 280,
  '守护': 550,
  '年猪': 600,
  '噜噜': 700
};

// ========== 根据评分计算品质 ==========
function getQualityByScore(score: number): PetQuality {
  if (score < 300) return '普通';
  if (score < 500) return '良品';
  if (score < 700) return '上品';
  if (score < 900) return '精品';

  return '极品';
}

// ========== 评分计算函数 ==========
// 参考文档：reference/docs/project_docs/02_幻兽系统.md 第253-309行

/**
 * 计算初始属性评分
 * 基于标准值差值×2
 */
function calculateInitialRating(
  chp: number,
  cxgj: number,
  cdgj: number,
  cfy: number
): { pz_chp: number; pz_cxgj: number; pz_cdgj: number; pz_cfy: number } {
  return {
    pz_chp: Math.max(0, (chp - 100) * 2),
    pz_cxgj: Math.max(0, (cxgj - 15) * 2),
    pz_cdgj: Math.max(0, (cdgj - 25) * 2),
    pz_cfy: Math.max(0, (cfy - 10) * 2)
  };
}

/**
 * 计算成长属性评分
 * 差值≤10时：差值×20
 * 差值>10时：(差值-10)×100 + 200
 */
function calculateGrowthRating(
  cz_hp: number,
  cz_xgj: number,
  cz_dgj: number,
  cz_fy: number
): { pz_cz_hp: number; pz_cz_xgj: number; pz_cz_dgj: number; pz_cz_fy: number } {
  // 标准成长值
  const baseHp = 40;
  const baseXgj = 10;
  const baseDgj = 15;
  const baseFy = 5;

  // 计算差值评分
  const calcScore = (value: number, base: number): number => {
    const diff = value - base;

    if (diff <= 0) return 0;
    if (diff <= 10) return diff * 20;

    return (diff - 10) * 100 + 200;
  };

  return {
    pz_cz_hp: calcScore(cz_hp, baseHp),
    pz_cz_xgj: calcScore(cz_xgj, baseXgj),
    pz_cz_dgj: calcScore(cz_dgj, baseDgj),
    pz_cz_fy: calcScore(cz_fy, baseFy)
  };
}

// ========== 属性计算函数 ==========

/**
 * 计算最大生命值
 * 公式：生命成长率 × (等级-1) + 初始生命值
 */
function calculateMaxHp(cz_hp: number, chp: number, dj: number): number {
  return Math.round(cz_hp * (dj - 1) + chp);
}

/**
 * 计算最小攻击力
 * 公式：最小攻击成长率 × (等级-1) + 初始最小攻击
 */
function calculateMinAttack(cz_xgj: number, cxgj: number, dj: number): number {
  return Math.round(cz_xgj * (dj - 1) + cxgj);
}

/**
 * 计算最大攻击力
 * 公式：最大攻击成长率 × (等级-1) + 初始最大攻击
 */
function calculateMaxAttack(cz_dgj: number, cdgj: number, dj: number): number {
  return Math.round(cz_dgj * (dj - 1) + cdgj);
}

/**
 * 计算防御力
 * 公式：防御成长率 × (等级-1) + 初始防御
 */
function calculateDefense(cz_fy: number, cfy: number, dj: number): number {
  return Math.round(cz_fy * (dj - 1) + cfy);
}

// ========== 幻兽生成函数 ==========

/**
 * 生成初始攻防型幻兽
 * 完全按照文档规范实现随机属性生成
 * 参考文档：reference/docs/初始幻兽生成规格文档.md 第189-252行
 *
 * @param id 幻兽ID
 * @param othername 显示名称
 * @param isDeployed 是否出征
 * @param isMerged 是否合体
 * @returns 生成的幻兽数据
 */
export function generateInitialPet(
  id: string,
  othername: string,
  isDeployed: boolean = false,
  isMerged: boolean = false
): Pet {
  // ========== 基础信息 ==========
  const hs_name: PetType = '攻防型';
  const dj = 1;

  // ========== 随机生成初始属性 ==========
  // 参考文档第197-201行
  let cxgj = Math.floor(Math.random() * 5) + 10;        // 初始最小攻击: 10-14
  let cdgj = Math.floor(Math.random() * (30 - cxgj)) + cxgj; // 初始最大攻击: cxgj ~ 29
  let cfy = Math.floor(Math.random() * 5) + 5;          // 初始防御: 5-9
  let chp = Math.floor(Math.random() * 15) + 20;        // 初始生命: 20-34

  // ========== 随机生成成长属性 ==========
  // 参考文档第203-207行
  let cz_xgj = 8 + Math.floor(Math.random() * 4);       // 最小攻击成长: 8-11
  let cz_dgj = Math.floor(Math.random() * (17 - cz_xgj)) + cz_xgj; // 最大攻击成长: cz_xgj ~ 16
  let cz_fy = 1 + Math.floor(Math.random() * 6);        // 防御成长: 1-6
  let cz_hp = 30 + Math.floor(Math.random() * 12);      // 生命成长: 30-41

  // ========== 随机加成 (12.5%概率触发其中一种) ==========
  // 参考文档第209-223行
  const bonusType = Math.floor(Math.random() * 8);

  switch (bonusType) {
    case 0:
      // 初始最小攻击大加成 (0-99)
      cxgj = Math.floor(Math.random() * 100);
      break;
    case 1:
      // 初始最大攻击大加成 (cxgj ~ 99)
      cdgj = Math.floor(Math.random() * (100 - cxgj)) + cxgj;
      break;
    case 2:
      // 初始防御大加成 (0-99)
      cfy = Math.floor(Math.random() * 100);
      break;
    case 3:
      // 初始生命大加成 (0-290)
      chp = Math.floor(Math.random() * 291);
      break;
    case 4: {
      // 最小攻击成长大加成 (0-20)
      cz_xgj = Math.floor(Math.random() * 21);
      // 确保最大攻击成长 >= 最小攻击成长
      if (cz_dgj < cz_xgj) {
        cz_dgj = cz_xgj;
      }
      break;
    }
    case 5:
      // 最大攻击成长大加成 (cz_xgj ~ 25)
      cz_dgj = Math.floor(Math.random() * (26 - cz_xgj)) + cz_xgj;
      break;
    case 6:
      // 防御成长大加成 (0-15)
      cz_fy = Math.floor(Math.random() * 16);
      break;
    case 7:
      // 生命成长大加成 (0-40)
      cz_hp = Math.floor(Math.random() * 41);
      break;
  }

  // ========== 计算当前属性值 ==========
  const hp = calculateMaxHp(cz_hp, chp, dj);
  const mhp = hp;
  const xgj = calculateMinAttack(cz_xgj, cxgj, dj);
  const dgj = calculateMaxAttack(cz_dgj, cdgj, dj);
  const fy = calculateDefense(cz_fy, cfy, dj);

  // ========== 计算评分 ==========
  const pzbase = petTypeBaseScore[hs_name];
  const initialRating = calculateInitialRating(chp, cxgj, cdgj, cfy);
  const growthRating = calculateGrowthRating(cz_hp, cz_xgj, cz_dgj, cz_fy);

  const rating: PetRating = {
    pzbase,
    ...initialRating,
    ...growthRating
  };

  // 计算总评分
  const pz = rating.pzbase + rating.pz_chp + rating.pz_cxgj + rating.pz_cdgj +
             rating.pz_cfy + rating.pz_cz_hp + rating.pz_cz_xgj + rating.pz_cz_dgj + rating.pz_cz_fy;

  // ========== 返回幻兽数据 ==========
  return {
    id,
    hs_name,
    othername,
    dj,
    hp,
    mhp,
    xgj,
    dgj,
    fy,
    jy: 0,
    mjy: 10,
    zs: 0,
    pz,
    quality: getQualityByScore(pz),
    isDeployed,
    isMerged,
    chp,
    cxgj,
    cdgj,
    cfy,
    cz_hp,
    cz_xgj,
    cz_dgj,
    cz_fy,
    rating
  };
}

/**
 * 生成两只初始攻防型幻兽
 * 新游戏开始时调用，两只幻兽都设置为出征和合体状态
 *
 * @returns 两只初始幻兽数组
 */
export function generateInitialPets(): Pet[] {
  const pet1 = generateInitialPet('initial-pet-001', '攻防型', true, true);
  const pet2 = generateInitialPet('initial-pet-002', '攻防型', true, true);

  return [pet1, pet2];
}

/**
 * 生成奇异兽（幻兽研究所购买）
 * 根据品质分生成对应品质的奇异兽
 * 参考文档：reference/docs/幻兽研究所交互逻辑文档.md
 *
 * @param qualityScore 品质分（由技术等级计算得出）
 * @param id 幻兽ID（可选，默认自动生成）
 * @returns 生成的奇异兽数据
 */
export function generateStrangePet(qualityScore: number, id?: string): Pet {
  const petId = id || `strange-pet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // 根据品质分计算品质
  const quality = getQualityByScore(qualityScore);

  // 奇异兽基础属性（根据品质分计算）
  // 品质分越高，属性越好
  const baseMultiplier = qualityScore / 100;

  // 初始属性
  const chp = Math.round(20 + baseMultiplier * 0.5);
  const cxgj = Math.round(10 + baseMultiplier * 0.3);
  const cdgj = Math.round(cxgj + 5 + baseMultiplier * 0.2);
  const cfy = Math.round(5 + baseMultiplier * 0.2);

  // 成长属性
  const cz_hp = Math.round(30 + baseMultiplier * 0.5);
  const cz_xgj = Math.round(8 + baseMultiplier * 0.2);
  const cz_dgj = Math.round(cz_xgj + 3 + baseMultiplier * 0.1);
  const cz_fy = Math.round(1 + baseMultiplier * 0.1);

  const dj = 1;

  // 计算评分
  const pzbase = petTypeBaseScore['奇异兽'];
  const initialRating = {
    pz_chp: Math.max(0, (chp - 100) * 2),
    pz_cxgj: Math.max(0, (cxgj - 15) * 2),
    pz_cdgj: Math.max(0, (cdgj - 25) * 2),
    pz_cfy: Math.max(0, (cfy - 10) * 2),
  };
  const growthRating = {
    pz_cz_hp: Math.max(0, (cz_hp - 40) * 20),
    pz_cz_xgj: Math.max(0, (cz_xgj - 10) * 20),
    pz_cz_dgj: Math.max(0, (cz_dgj - 15) * 20),
    pz_cz_fy: Math.max(0, (cz_fy - 5) * 20),
  };

  const rating: PetRating = {
    pzbase,
    ...initialRating,
    ...growthRating,
  };

  // 计算当前属性值
  const hp = cz_hp * (dj - 1) + chp;
  const mhp = hp;
  const xgj = cz_xgj * (dj - 1) + cxgj;
  const dgj = cz_dgj * (dj - 1) + cdgj;
  const fy = cz_fy * (dj - 1) + cfy;

  // 总评分（使用传入的品质分）
  const pz = qualityScore;

  return {
    id: petId,
    hs_name: '奇异兽',
    othername: '奇异兽',
    dj,
    hp,
    mhp,
    xgj,
    dgj,
    fy,
    jy: 0,
    mjy: 10,
    zs: 0,
    pz,
    quality,
    isDeployed: false,
    isMerged: false,
    chp,
    cxgj,
    cdgj,
    cfy,
    cz_hp,
    cz_xgj,
    cz_dgj,
    cz_fy,
    rating,
  };
}

// ========== 导出 ==========
export { petTypeBaseScore, getQualityByScore };
export { calculateDefense, calculateMaxAttack, calculateMaxHp, calculateMinAttack };
