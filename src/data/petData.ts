/**
 * 幻兽数据文件
 * 定义示例幻兽数据
 * 参考文档：reference/docs/初始幻兽生成规格文档.md
 */

import type { Pet, PetQuality, PetRating, PetType } from '../types';
import { generateInitialPet } from '../utils/petGenerator';

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

// ========== 根据等级计算属性值 ==========
function calculateMaxHp(cz_hp: number, chp: number, dj: number): number {
  return Math.round(cz_hp * (dj - 1) + chp);
}

function calculateMinAttack(cz_xgj: number, cxgj: number, dj: number): number {
  return Math.round(cz_xgj * (dj - 1) + cxgj);
}

function calculateMaxAttack(cz_dgj: number, cdgj: number, dj: number): number {
  return Math.round(cz_dgj * (dj - 1) + cdgj);
}

function calculateDefense(cz_fy: number, cfy: number, dj: number): number {
  return Math.round(cz_fy * (dj - 1) + cfy);
}

// ========== 初始幻兽（新游戏时生成）==========
// 两只一级攻防型幻兽，都设置为出征和合体状态
const initialPet1 = generateInitialPet('initial-pet-001', '攻防型', true, true);
const initialPet2 = generateInitialPet('initial-pet-002', '攻防型', true, true);

// ========== 示例幻兽（用于测试）==========

/**
 * 示例幻兽1: 攻防型 - 普通品质
 * 攻防型是均衡型幻兽，攻防兼备，基础评分为0
 */
const pet1: Pet = (() => {
  const chp = 25;
  const cxgj = 12;
  const cdgj = 22;
  const cfy = 7;
  const cz_hp = 35;
  const cz_xgj = 9;
  const cz_dgj = 14;
  const cz_fy = 3;
  const dj = 15;

  const rating: PetRating = {
    pzbase: petTypeBaseScore['攻防型'],
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

/**
 * 示例幻兽2: 调皮鬼 - 良品品质
 * 调皮鬼是高攻击型幻兽，最大攻击成长突出，基础评分280
 */
const pet2: Pet = (() => {
  const chp = 28;
  const cxgj = 13;
  const cdgj = 26;
  const cfy = 6;
  const cz_hp = 36;
  const cz_xgj = 10;
  const cz_dgj = 15;
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

/**
 * 示例幻兽3: 吉鲁猪 - 上品品质
 * 吉鲁猪是高攻击型幻兽，攻击成长最高，基础评分380
 */
const pet3: Pet = (() => {
  const chp = 30;
  const cxgj = 14;
  const cdgj = 28;
  const cfy = 5;
  const cz_hp = 38;
  const cz_xgj = 11;
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
    zs: 1,
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
    predj: 50,
    premjy: 5000,
    prejy: 2500
  };
})();

/**
 * 示例幻兽4: 奇异兽 - 精品品质
 * 奇异兽是特殊型幻兽，属性随机范围大，基础评分450
 */
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

/**
 * 示例幻兽5: 圣天使 - 极品品质
 * 圣天使是高生命型幻兽，生命成长最高，基础评分280
 */
const pet5: Pet = (() => {
  const chp = 34;
  const cxgj = 11;
  const cdgj = 24;
  const cfy = 7;
  const cz_hp = 41;
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
    zs: 2,
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

/**
 * 示例幻兽6: 守护 - 上品品质
 * 守护是高防御型幻兽，防御成长突出，基础评分550
 */
const pet6: Pet = (() => {
  const chp = 26;
  const cxgj = 12;
  const cdgj = 23;
  const cfy = 9;
  const cz_hp = 37;
  const cz_xgj = 10;
  const cz_dgj = 15;
  const cz_fy = 6;
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
// 包含两只初始一级攻防型幻兽（出征+合体状态）和6只示例幻兽
export const examplePets: Pet[] = [
  initialPet1,
  initialPet2,
  pet1,
  pet2,
  pet3,
  pet4,
  pet5,
  pet6
];

// ========== 导出幻兽类型基础评分映射 ==========
export { petTypeBaseScore };

// ========== 导出品质计算函数 ==========
export { getQualityByScore };

// ========== 导出属性计算函数 ==========
export { calculateDefense, calculateMaxAttack, calculateMaxHp, calculateMinAttack };
