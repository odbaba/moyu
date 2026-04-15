import type { Pet, PetType, PetQuality, PetRating } from '../types';

// ========== 幻兽类型基础评分映射 ==========
// 不同类型的幻兽有不同的基础评分
const petTypeBaseScore: Record<PetType, number> = {
  '攻防型': 0,
  '调皮鬼': 280,
  '吉鲁猪': 380,
  '奇异兽': 450,
  '圣天使': 280,
  '守护': 550,
  '年猪': 600
};

// ========== 根据评分计算品质 ==========
// 品质划分标准：
// - 普通: 评分 < 300
// - 良品: 评分 300-500
// - 上品: 评分 500-700
// - 精品: 评分 700-900
// - 极品: 评分 > 900
function getQualityByScore(score: number): PetQuality {
  if (score < 300) return '普通';
  if (score < 500) return '良品';
  if (score < 700) return '上品';
  if (score < 900) return '精品';
  return '极品';
}

// ========== 根据等级计算属性值 ==========
// 最大生命值 = 生命成长率 × (等级-1) + 初始生命值
function calculateMaxHp(cz_hp: number, chp: number, dj: number): number {
  return Math.round(cz_hp * (dj - 1) + chp);
}

// 最小攻击力 = 最小攻击成长率 × (等级-1) + 初始最小攻击
function calculateMinAttack(cz_xgj: number, cxgj: number, dj: number): number {
  return Math.round(cz_xgj * (dj - 1) + cxgj);
}

// 最大攻击力 = 最大攻击成长率 × (等级-1) + 初始最大攻击
function calculateMaxAttack(cz_dgj: number, cdgj: number, dj: number): number {
  return Math.round(cz_dgj * (dj - 1) + cdgj);
}

// 防御力 = 防御成长率 × (等级-1) + 初始防御
function calculateDefense(cz_fy: number, cfy: number, dj: number): number {
  return Math.round(cz_fy * (dj - 1) + cfy);
}

// ========== 示例幻兽1: 攻防型 - 普通品质 ==========
// 攻防型是均衡型幻兽，攻防兼备，基础评分为0
const pet1: Pet = (() => {
  // 初始属性（范围：生命20-34，最小攻击10-14，最大攻击cxgj到29，防御5-9）
  const chp = 25;      // 初始生命值
  const cxgj = 12;     // 初始最小攻击
  const cdgj = 22;     // 初始最大攻击（比最小攻击大一些）
  const cfy = 7;       // 初始防御

  // 成长属性（范围：生命成长30-41，最小攻击成长8-11，最大攻击成长cz_xgj到16，防御成长1-6）
  const cz_hp = 35;    // 生命成长率
  const cz_xgj = 9;    // 最小攻击成长率
  const cz_dgj = 14;   // 最大攻击成长率
  const cz_fy = 3;     // 防御成长率

  // 等级
  const dj = 15;

  // 计算评分
  const rating: PetRating = {
    pzbase: petTypeBaseScore['攻防型'],
    pz_chp: Math.max(0, (chp - 100) * 2),           // 初始生命评分
    pz_cxgj: Math.max(0, (cxgj - 15) * 2),          // 初始最小攻击评分
    pz_cdgj: Math.max(0, (cdgj - 25) * 2),          // 初始最大攻击评分
    pz_cfy: Math.max(0, (cfy - 10) * 2),            // 初始防御评分
    pz_cz_hp: Math.max(0, (cz_hp - 40) * 20),       // 生命成长评分
    pz_cz_xgj: Math.max(0, (cz_xgj - 10) * 20),     // 最小攻击成长评分
    pz_cz_dgj: Math.max(0, (cz_dgj - 15) * 20),     // 最大攻击成长评分
    pz_cz_fy: Math.max(0, (cz_fy - 5) * 20)         // 防御成长评分
  };

  // 总评分
  const pz = rating.pzbase + rating.pz_chp + rating.pz_cxgj + rating.pz_cdgj + 
             rating.pz_cfy + rating.pz_cz_hp + rating.pz_cz_xgj + rating.pz_cz_dgj + rating.pz_cz_fy;

  return {
    id: 'pet-001',
    hs_name: '攻防型',
    othername: '小攻防',
    dj,
    hp: calculateMaxHp(cz_hp, chp, dj),
    mhp: calculateMaxHp(cz_hp, chp, dj),
    xgj: calculateMinAttack(cz_xgj, cxgj, dj),
    dgj: calculateMaxAttack(cz_dgj, cdgj, dj),
    fy: calculateDefense(cz_fy, cfy, dj),
    jy: 0,
    mjy: 10,
    zs: 0,
    pz,
    quality: getQualityByScore(pz),
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
    rating
  };
})();

// ========== 示例幻兽2: 调皮鬼 - 良品品质 ==========
// 调皮鬼是高攻击型幻兽，最大攻击成长突出，基础评分280
const pet2: Pet = (() => {
  const chp = 28;
  const cxgj = 13;
  const cdgj = 26;
  const cfy = 6;

  const cz_hp = 36;
  const cz_xgj = 10;
  const cz_dgj = 15;   // 调皮鬼最大攻击成长较高
  const cz_fy = 2;

  const dj = 25;

  const rating: PetRating = {
    pzbase: petTypeBaseScore['调皮鬼'],
    pz_chp: Math.max(0, (chp - 100) * 2),
    pz_cxgj: Math.max(0, (cxgj - 15) * 2),
    pz_cdgj: Math.max(0, (cdgj - 25) * 2),
    pz_cfy: Math.max(0, (cfy - 10) * 2),
    pz_cz_hp: Math.max(0, (cz_hp - 40) * 20),
    pz_cz_xgj: Math.max(0, (cz_xgj - 10) * 20),
    pz_cz_dgj: Math.max(0, (cz_dgj - 15) * 20),
    pz_cz_fy: Math.max(0, (cz_fy - 5) * 20)
  };

  const pz = rating.pzbase + rating.pz_chp + rating.pz_cxgj + rating.pz_cdgj + 
             rating.pz_cfy + rating.pz_cz_hp + rating.pz_cz_xgj + rating.pz_cz_dgj + rating.pz_cz_fy;

  return {
    id: 'pet-002',
    hs_name: '调皮鬼',
    othername: '顽皮精灵',
    dj,
    hp: calculateMaxHp(cz_hp, chp, dj),
    mhp: calculateMaxHp(cz_hp, chp, dj),
    xgj: calculateMinAttack(cz_xgj, cxgj, dj),
    dgj: calculateMaxAttack(cz_dgj, cdgj, dj),
    fy: calculateDefense(cz_fy, cfy, dj),
    jy: 500,
    mjy: 1200,
    zs: 0,
    pz,
    quality: getQualityByScore(pz),
    isDeployed: true,    // 出战状态
    isMerged: false,     // 不合体
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
})();

// ========== 示例幻兽3: 吉鲁猪 - 上品品质 ==========
// 吉鲁猪是高攻击型幻兽，攻击成长最高，基础评分380
const pet3: Pet = (() => {
  const chp = 30;
  const cxgj = 14;
  const cdgj = 28;
  const cfy = 5;

  const cz_hp = 38;
  const cz_xgj = 11;    // 吉鲁猪攻击成长最高
  const cz_dgj = 16;
  const cz_fy = 2;

  const dj = 35;

  const rating: PetRating = {
    pzbase: petTypeBaseScore['吉鲁猪'],
    pz_chp: Math.max(0, (chp - 100) * 2),
    pz_cxgj: Math.max(0, (cxgj - 15) * 2),
    pz_cdgj: Math.max(0, (cdgj - 25) * 2),
    pz_cfy: Math.max(0, (cfy - 10) * 2),
    pz_cz_hp: Math.max(0, (cz_hp - 40) * 20),
    pz_cz_xgj: Math.max(0, (cz_xgj - 10) * 20),
    pz_cz_dgj: Math.max(0, (cz_dgj - 15) * 20),
    pz_cz_fy: Math.max(0, (cz_fy - 5) * 20)
  };

  const pz = rating.pzbase + rating.pz_chp + rating.pz_cxgj + rating.pz_cdgj + 
             rating.pz_cfy + rating.pz_cz_hp + rating.pz_cz_xgj + rating.pz_cz_dgj + rating.pz_cz_fy;

  return {
    id: 'pet-003',
    hs_name: '吉鲁猪',
    othername: '狂暴战猪',
    dj,
    hp: calculateMaxHp(cz_hp, chp, dj),
    mhp: calculateMaxHp(cz_hp, chp, dj),
    xgj: calculateMinAttack(cz_xgj, cxgj, dj),
    dgj: calculateMaxAttack(cz_dgj, cdgj, dj),
    fy: calculateDefense(cz_fy, cfy, dj),
    jy: 2000,
    mjy: 3500,
    zs: 1,               // 已幻化1次
    pz,
    quality: getQualityByScore(pz),
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
    predj: 50,           // 幻化前等级
    premjy: 5000,
    prejy: 2500
  };
})();

// ========== 示例幻兽4: 奇异兽 - 精品品质 ==========
// 奇异兽是特殊型幻兽，属性随机范围大，基础评分450
const pet4: Pet = (() => {
  const chp = 32;
  const cxgj = 14;
  const cdgj = 27;
  const cfy = 8;

  const cz_hp = 39;
  const cz_xgj = 10;
  const cz_dgj = 15;
  const cz_fy = 4;

  const dj = 45;

  const rating: PetRating = {
    pzbase: petTypeBaseScore['奇异兽'],
    pz_chp: Math.max(0, (chp - 100) * 2),
    pz_cxgj: Math.max(0, (cxgj - 15) * 2),
    pz_cdgj: Math.max(0, (cdgj - 25) * 2),
    pz_cfy: Math.max(0, (cfy - 10) * 2),
    pz_cz_hp: Math.max(0, (cz_hp - 40) * 20),
    pz_cz_xgj: Math.max(0, (cz_xgj - 10) * 20),
    pz_cz_dgj: Math.max(0, (cz_dgj - 15) * 20),
    pz_cz_fy: Math.max(0, (cz_fy - 5) * 20)
  };

  const pz = rating.pzbase + rating.pz_chp + rating.pz_cxgj + rating.pz_cdgj + 
             rating.pz_cfy + rating.pz_cz_hp + rating.pz_cz_xgj + rating.pz_cz_dgj + rating.pz_cz_fy;

  return {
    id: 'pet-004',
    hs_name: '奇异兽',
    othername: '神秘异兽',
    dj,
    hp: calculateMaxHp(cz_hp, chp, dj),
    mhp: calculateMaxHp(cz_hp, chp, dj),
    xgj: calculateMinAttack(cz_xgj, cxgj, dj),
    dgj: calculateMaxAttack(cz_dgj, cdgj, dj),
    fy: calculateDefense(cz_fy, cfy, dj),
    jy: 5000,
    mjy: 8000,
    zs: 0,
    pz,
    quality: getQualityByScore(pz),
    isDeployed: true,    // 出战状态
    isMerged: true,      // 合体状态
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
})();

// ========== 示例幻兽5: 圣天使 - 极品品质 ==========
// 圣天使是高生命型幻兽，生命成长最高，基础评分280
const pet5: Pet = (() => {
  const chp = 34;        // 较高的初始生命
  const cxgj = 11;
  const cdgj = 24;
  const cfy = 7;

  const cz_hp = 41;      // 圣天使生命成长最高
  const cz_xgj = 9;
  const cz_dgj = 14;
  const cz_fy = 5;

  const dj = 60;

  const rating: PetRating = {
    pzbase: petTypeBaseScore['圣天使'],
    pz_chp: Math.max(0, (chp - 100) * 2),
    pz_cxgj: Math.max(0, (cxgj - 15) * 2),
    pz_cdgj: Math.max(0, (cdgj - 25) * 2),
    pz_cfy: Math.max(0, (cfy - 10) * 2),
    pz_cz_hp: Math.max(0, (cz_hp - 40) * 20),
    pz_cz_xgj: Math.max(0, (cz_xgj - 10) * 20),
    pz_cz_dgj: Math.max(0, (cz_dgj - 15) * 20),
    pz_cz_fy: Math.max(0, (cz_fy - 5) * 20)
  };

  const pz = rating.pzbase + rating.pz_chp + rating.pz_cxgj + rating.pz_cdgj + 
             rating.pz_cfy + rating.pz_cz_hp + rating.pz_cz_xgj + rating.pz_cz_dgj + rating.pz_cz_fy;

  return {
    id: 'pet-005',
    hs_name: '圣天使',
    othername: '神圣守护者',
    dj,
    hp: calculateMaxHp(cz_hp, chp, dj),
    mhp: calculateMaxHp(cz_hp, chp, dj),
    xgj: calculateMinAttack(cz_xgj, cxgj, dj),
    dgj: calculateMaxAttack(cz_dgj, cdgj, dj),
    fy: calculateDefense(cz_fy, cfy, dj),
    jy: 10000,
    mjy: 15000,
    zs: 2,               // 已幻化2次
    pz,
    quality: getQualityByScore(pz),
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
    predj: 80,
    premjy: 20000,
    prejy: 12000
  };
})();

// ========== 示例幻兽6: 守护 - 上品品质 ==========
// 守护是高防御型幻兽，防御成长突出，基础评分550
const pet6: Pet = (() => {
  const chp = 26;
  const cxgj = 12;
  const cdgj = 23;
  const cfy = 9;         // 较高的初始防御

  const cz_hp = 37;
  const cz_xgj = 10;
  const cz_dgj = 15;
  const cz_fy = 6;       // 守护防御成长最高

  const dj = 40;

  const rating: PetRating = {
    pzbase: petTypeBaseScore['守护'],
    pz_chp: Math.max(0, (chp - 100) * 2),
    pz_cxgj: Math.max(0, (cxgj - 15) * 2),
    pz_cdgj: Math.max(0, (cdgj - 25) * 2),
    pz_cfy: Math.max(0, (cfy - 10) * 2),
    pz_cz_hp: Math.max(0, (cz_hp - 40) * 20),
    pz_cz_xgj: Math.max(0, (cz_xgj - 10) * 20),
    pz_cz_dgj: Math.max(0, (cz_dgj - 15) * 20),
    pz_cz_fy: Math.max(0, (cz_fy - 5) * 20)
  };

  const pz = rating.pzbase + rating.pz_chp + rating.pz_cxgj + rating.pz_cdgj + 
             rating.pz_cfy + rating.pz_cz_hp + rating.pz_cz_xgj + rating.pz_cz_dgj + rating.pz_cz_fy;

  return {
    id: 'pet-006',
    hs_name: '守护',
    othername: '钢铁卫士',
    dj,
    hp: calculateMaxHp(cz_hp, chp, dj),
    mhp: calculateMaxHp(cz_hp, chp, dj),
    xgj: calculateMinAttack(cz_xgj, cxgj, dj),
    dgj: calculateMaxAttack(cz_dgj, cdgj, dj),
    fy: calculateDefense(cz_fy, cfy, dj),
    jy: 3000,
    mjy: 6000,
    zs: 0,
    pz,
    quality: getQualityByScore(pz),
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
    rating
  };
})();

// ========== 导出示例幻兽数据数组 ==========
// 包含6只不同类型、不同品质的幻兽
// 其中2只处于出战状态（pet2和pet4），1只处于合体状态（pet4）
export const examplePets: Pet[] = [pet1, pet2, pet3, pet4, pet5, pet6];

// ========== 导出幻兽类型基础评分映射 ==========
export { petTypeBaseScore };

// ========== 导出品质计算函数 ==========
export { getQualityByScore };

// ========== 导出属性计算函数 ==========
export { calculateMaxHp, calculateMinAttack, calculateMaxAttack, calculateDefense };
