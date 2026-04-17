/**
 * 幻兽数据文件
 * 定义示例幻兽数据
 * 参考文档：reference/docs/初始幻兽生成规格文档.md
 */

import type { Pet } from '../types';
import {
  calculateDefense,
  calculateMaxAttack,
  calculateMaxHp,
  calculateMinAttack,
  generateInitialPet,
  generatePetByType,
  generateStarStrangePet,
  petTypeBaseScore} from '../utils/petGenerator';

// ========== 初始幻兽（新游戏时生成）==========
// 两只一级攻防型幻兽，都设置为出征和合体状态
const initialPet1 = generateInitialPet('initial-pet-001', '攻防型', true, true);
const initialPet2 = generateInitialPet('initial-pet-002', '攻防型', true, true);

// ========== 示例幻兽（用于测试）==========

/**
 * 示例幻兽1: 攻防型 - 普通品质
 * 攻防型是均衡型幻兽，攻防兼备，基础评分为0
 * 等级15，展示中等等级幻兽的属性
 */
const pet1: Pet = (() => {
  // 使用 generatePetByType 生成幻兽
  const basePet = generatePetByType('攻防型', {
    id: 'pet-001',
    othername: '小攻防',
    level: 15
  });

  // 设置示例幻兽的经验值和最大经验值
  return {
    ...basePet,
    jy: 0,
    mjy: 10
  };
})();

/**
 * 示例幻兽2: 调皮鬼 - 良品品质
 * 调皮鬼是高攻击型幻兽，最大攻击成长突出，基础评分280
 * 等级25，展示高攻击型幻兽的特点
 */
const pet2: Pet = (() => {
  const basePet = generatePetByType('调皮鬼', {
    id: 'pet-002',
    othername: '顽皮精灵',
    level: 25
  });

  return {
    ...basePet,
    jy: 500,
    mjy: 1200
  };
})();

/**
 * 示例幻兽3: 吉鲁猪 - 上品品质
 * 吉鲁猪是高攻击型幻兽，攻击成长最高，基础评分380
 * 等级35，展示高等级幻兽的属性
 */
const pet3: Pet = (() => {
  const basePet = generatePetByType('吉鲁猪', {
    id: 'pet-003',
    othername: '狂暴战猪',
    level: 35
  });

  return {
    ...basePet,
    jy: 2000,
    mjy: 3500,
    zs: 1,
    // 添加转生信息
    predj: 50,
    premjy: 5000,
    prejy: 2500
  };
})();

/**
 * 示例幻兽4: 奇异兽 - 精品品质
 * 奇异兽是特殊型幻兽，属性随机范围大，基础评分450
 * 使用 generateStarStrangePet 生成8星奇异兽（评分约800）
 * 等级45，展示特殊型幻兽的特点
 */
const pet4: Pet = (() => {
  // 使用 generateStarStrangePet 生成8星奇异兽
  const basePet = generateStarStrangePet(8, {
    id: 'pet-004',
    othername: '神秘异兽',
    level: 45
  });

  return {
    ...basePet,
    jy: 5000,
    mjy: 8000
  };
})();

/**
 * 示例幻兽5: 圣天使 - 极品品质
 * 圣天使是高生命型幻兽，生命成长最高，基础评分280
 * 等级60，展示高等级高生命型幻兽的特点
 */
const pet5: Pet = (() => {
  const basePet = generatePetByType('圣天使', {
    id: 'pet-005',
    othername: '神圣守护者',
    level: 60
  });

  return {
    ...basePet,
    jy: 10000,
    mjy: 15000,
    zs: 2,
    // 添加转生信息
    predj: 80,
    premjy: 20000,
    prejy: 12000
  };
})();

/**
 * 示例幻兽6: 守护 - 上品品质
 * 守护是高防御型幻兽，防御成长突出，基础评分550
 * 等级40，展示高防御型幻兽的特点
 */
const pet6: Pet = (() => {
  const basePet = generatePetByType('守护', {
    id: 'pet-006',
    othername: '钢铁卫士',
    level: 40
  });

  return {
    ...basePet,
    jy: 3000,
    mjy: 6000
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

// ========== 导出属性计算函数 ==========
export { calculateDefense, calculateMaxAttack, calculateMaxHp, calculateMinAttack };
