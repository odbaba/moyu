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
  generateStarStrangePet,
  petTypeBaseScore} from '../utils/petGenerator';

// ========== 初始幻兽（新游戏时生成）==========
// 两只一级攻防型幻兽，都设置为出征和合体状态
const initialPet1 = generateInitialPet('initial-pet-001', '攻防型', true, true);
const initialPet2 = generateInitialPet('initial-pet-002', '攻防型', true, true);

// ========== 示例幻兽（用于测试）==========
// 随机生成6只奇异兽，星级从有效的8、12、19中随机选择
const generateRandomStrangePets = (): Pet[] => {
  const pets: Pet[] = [];
  const validStars = [8, 12, 19]; // 有效的奇异兽星级

  for (let i = 1; i <= 6; i++) {
    // 从有效的星级中随机选择一个
    const stars = validStars[Math.floor(Math.random() * validStars.length)];
    const basePet = generateStarStrangePet(stars, {
      id: `pet-00${i}`,
      othername: `奇异兽${i}`,
      level: 1 // 所有奇异兽初始等级为1
    });

    pets.push({
      ...basePet,
      jy: 0,
      mjy: 10
    });
  }

  return pets;
};

const randomPets = generateRandomStrangePets();

// ========== 导出示例幻兽数据数组 ==========
// 包含两只初始一级攻防型幻兽（出征+合体状态）和6只随机生成的奇异兽
export const examplePets: Pet[] = [
  initialPet1,
  initialPet2,
  ...randomPets
];

// ========== 导出幻兽类型基础评分映射 ==========
export { petTypeBaseScore };

// ========== 导出属性计算函数 ==========
export { calculateDefense, calculateMaxAttack, calculateMaxHp, calculateMinAttack };
