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
  petTypeBaseScore} from '../utils/petGenerator';

// ========== 初始幻兽（新游戏时生成）==========
// 两只一级攻防型幻兽，都设置为出征和合体状态
const initialPet1 = generateInitialPet('initial-pet-001', '攻防型', true, true);
const initialPet2 = generateInitialPet('initial-pet-002', '攻防型', true, true);

// ========== 导出示例幻兽数据数组 ==========
// 包含两只初始一级攻防型幻兽（出征+合体状态）和6只随机生成的奇异兽
export const examplePets: Pet[] = [
  initialPet1,
  initialPet2,
];

// ========== 导出幻兽类型基础评分映射 ==========
export { petTypeBaseScore };

// ========== 导出属性计算函数 ==========
export { calculateDefense, calculateMaxAttack, calculateMaxHp, calculateMinAttack };
