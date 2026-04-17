/**
 * 幻兽系统测试文件
 * 用于验证幻兽评分计算、品质称号、升级、商店购买、抽奖等功能
 */

import { selectHighPrize, selectLegendaryPrize, selectMediumPrize } from '../src/utils/lotterySystem';
import {
  calculateGrowthRating,
  calculateInitialRating,
  generatePetByType,
  generateStrangePet,
  getQualityTitle,
  upgradePetLevel} from '../src/utils/petGenerator';
import { generateShopPet } from '../src/utils/shopUtils';

// ========== 测试工具函数 ==========

interface TestResult {
  testName: string;
  passed: boolean;
  message: string;
  details?: any;
}

const testResults: TestResult[] = [];

function logTest(testName: string, passed: boolean, message: string, details?: any) {
  testResults.push({ testName, passed, message, details });
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} - ${testName}: ${message}`);
  if (details) {
    console.log('  Details:', JSON.stringify(details, null, 2));
  }
}

// ========== 1. 测试幻兽评分计算 ==========

function testInitialRatingCalculation() {
  console.log('\n========== 测试初始属性评分计算 ==========');

  // 测试用例1: 初始生命值评分
  // 公式: Math.max(0, (chp - 100) * 2)
  const chp1 = 120;
  const expectedChpScore1 = (chp1 - 100) * 2; // 40
  const rating1 = calculateInitialRating(chp1, 15, 25, 10);
  const passed1 = rating1.pz_chp === expectedChpScore1;
  logTest(
    '初始生命评分计算 (chp=120)',
    passed1,
    passed1 ? `评分正确: ${rating1.pz_chp}` : `期望: ${expectedChpScore1}, 实际: ${rating1.pz_chp}`
  );

  // 测试用例2: 初始最小攻击评分
  // 公式: Math.max(0, (cxgj - 15) * 2)
  const cxgj2 = 20;
  const expectedXgjScore2 = (cxgj2 - 15) * 2; // 10
  const rating2 = calculateInitialRating(100, cxgj2, 25, 10);
  const passed2 = rating2.pz_cxgj === expectedXgjScore2;
  logTest(
    '初始最小攻击评分计算 (cxgj=20)',
    passed2,
    passed2 ? `评分正确: ${rating2.pz_cxgj}` : `期望: ${expectedXgjScore2}, 实际: ${rating2.pz_cxgj}`
  );

  // 测试用例3: 初始最大攻击评分
  // 公式: Math.max(0, (cdgj - 25) * 2)
  const cdgj3 = 35;
  const expectedDgjScore3 = (cdgj3 - 25) * 2; // 20
  const rating3 = calculateInitialRating(100, 15, cdgj3, 10);
  const passed3 = rating3.pz_cdgj === expectedDgjScore3;
  logTest(
    '初始最大攻击评分计算 (cdgj=35)',
    passed3,
    passed3 ? `评分正确: ${rating3.pz_cdgj}` : `期望: ${expectedDgjScore3}, 实际: ${rating3.pz_cdgj}`
  );

  // 测试用例4: 初始防御评分
  // 公式: Math.max(0, (cfy - 10) * 2)
  const cfy4 = 15;
  const expectedFyScore4 = (cfy4 - 10) * 2; // 10
  const rating4 = calculateInitialRating(100, 15, 25, cfy4);
  const passed4 = rating4.pz_cfy === expectedFyScore4;
  logTest(
    '初始防御评分计算 (cfy=15)',
    passed4,
    passed4 ? `评分正确: ${rating4.pz_cfy}` : `期望: ${expectedFyScore4}, 实际: ${rating4.pz_cfy}`
  );

  // 测试用例5: 低于标准值的情况
  const rating5 = calculateInitialRating(80, 10, 20, 5);
  const passed5 = rating5.pz_chp === 0 && rating5.pz_cxgj === 0 && rating5.pz_cdgj === 0 && rating5.pz_cfy === 0;
  logTest(
    '初始属性评分计算 (低于标准值)',
    passed5,
    passed5 ? '所有评分为0（正确）' : '评分应该为0',
    rating5
  );
}

function testGrowthRatingCalculation() {
  console.log('\n========== 测试成长属性评分计算 ==========');

  // 测试用例1: 差值≤10的情况
  // 公式: 差值×20
  const cz_hp1 = 45; // 差值 = 45 - 40 = 5
  const expectedHpScore1 = 5 * 20; // 100
  const rating1 = calculateGrowthRating(cz_hp1, 10, 15, 5);
  const passed1 = rating1.pz_cz_hp === expectedHpScore1;
  logTest(
    '生命成长评分计算 (差值≤10)',
    passed1,
    passed1 ? `评分正确: ${rating1.pz_cz_hp}` : `期望: ${expectedHpScore1}, 实际: ${rating1.pz_cz_hp}`
  );

  // 测试用例2: 差值>10的情况
  // 公式: (差值-10)×100 + 200
  const cz_xgj2 = 25; // 差值 = 25 - 10 = 15
  const expectedXgjScore2 = (15 - 10) * 100 + 200; // 700
  const rating2 = calculateGrowthRating(40, cz_xgj2, 15, 5);
  const passed2 = rating2.pz_cz_xgj === expectedXgjScore2;
  logTest(
    '最小攻击成长评分计算 (差值>10)',
    passed2,
    passed2 ? `评分正确: ${rating2.pz_cz_xgj}` : `期望: ${expectedXgjScore2}, 实际: ${rating2.pz_cz_xgj}`
  );

  // 测试用例3: 最大攻击成长评分
  const cz_dgj3 = 30; // 差值 = 30 - 15 = 15
  const expectedDgjScore3 = (15 - 10) * 100 + 200; // 700
  const rating3 = calculateGrowthRating(40, 10, cz_dgj3, 5);
  const passed3 = rating3.pz_cz_dgj === expectedDgjScore3;
  logTest(
    '最大攻击成长评分计算 (差值>10)',
    passed3,
    passed3 ? `评分正确: ${rating3.pz_cz_dgj}` : `期望: ${expectedDgjScore3}, 实际: ${rating3.pz_cz_dgj}`
  );

  // 测试用例4: 防御成长评分
  const cz_fy4 = 12; // 差值 = 12 - 5 = 7
  const expectedFyScore4 = 7 * 20; // 140
  const rating4 = calculateGrowthRating(40, 10, 15, cz_fy4);
  const passed4 = rating4.pz_cz_fy === expectedFyScore4;
  logTest(
    '防御成长评分计算 (差值≤10)',
    passed4,
    passed4 ? `评分正确: ${rating4.pz_cz_fy}` : `期望: ${expectedFyScore4}, 实际: ${rating4.pz_cz_fy}`
  );

  // 测试用例5: 低于标准值的情况
  const rating5 = calculateGrowthRating(30, 8, 10, 3);
  const passed5 = rating5.pz_cz_hp === 0 && rating5.pz_cz_xgj === 0 && rating5.pz_cz_dgj === 0 && rating5.pz_cz_fy === 0;
  logTest(
    '成长属性评分计算 (低于标准值)',
    passed5,
    passed5 ? '所有评分为0（正确）' : '评分应该为0',
    rating5
  );
}

function testTotalScoreCalculation() {
  console.log('\n========== 测试总评分计算 ==========');

  // 测试用例1: 攻防型幻兽（基础评分0）
  const pet1 = generatePetByType('攻防型');
  const expectedTotal1 = pet1.rating.pzbase +
    pet1.rating.pz_chp + pet1.rating.pz_cxgj + pet1.rating.pz_cdgj + pet1.rating.pz_cfy +
    pet1.rating.pz_cz_hp + pet1.rating.pz_cz_xgj + pet1.rating.pz_cz_dgj + pet1.rating.pz_cz_fy;
  const passed1 = pet1.pz === expectedTotal1;
  logTest(
    '攻防型幻兽总评分计算',
    passed1,
    passed1 ? `总评分正确: ${pet1.pz}` : `期望: ${expectedTotal1}, 实际: ${pet1.pz}`,
    { baseScore: pet1.rating.pzbase, totalScore: pet1.pz }
  );

  // 测试用例2: 调皮鬼幻兽（基础评分280）
  const pet2 = generatePetByType('调皮鬼');
  const expectedTotal2 = pet2.rating.pzbase +
    pet2.rating.pz_chp + pet2.rating.pz_cxgj + pet2.rating.pz_cdgj + pet2.rating.pz_cfy +
    pet2.rating.pz_cz_hp + pet2.rating.pz_cz_xgj + pet2.rating.pz_cz_dgj + pet2.rating.pz_cz_fy;
  const passed2 = pet2.pz === expectedTotal2 && pet2.rating.pzbase === 280;
  logTest(
    '调皮鬼幻兽总评分计算',
    passed2,
    passed2 ? `总评分正确: ${pet2.pz}, 基础评分: ${pet2.rating.pzbase}` : `期望: ${expectedTotal2}, 实际: ${pet2.pz}`,
    { baseScore: pet2.rating.pzbase, totalScore: pet2.pz }
  );

  // 测试用例3: 守护幻兽（基础评分550）
  const pet3 = generatePetByType('守护');
  const expectedTotal3 = pet3.rating.pzbase +
    pet3.rating.pz_chp + pet3.rating.pz_cxgj + pet3.rating.pz_cdgj + pet3.rating.pz_cfy +
    pet3.rating.pz_cz_hp + pet3.rating.pz_cz_xgj + pet3.rating.pz_cz_dgj + pet3.rating.pz_cz_fy;
  const passed3 = pet3.pz === expectedTotal3 && pet3.rating.pzbase === 550;
  logTest(
    '守护幻兽总评分计算',
    passed3,
    passed3 ? `总评分正确: ${pet3.pz}, 基础评分: ${pet3.rating.pzbase}` : `期望: ${expectedTotal3}, 实际: ${pet3.pz}`,
    { baseScore: pet3.rating.pzbase, totalScore: pet3.pz }
  );
}

// ========== 2. 测试品质称号显示 ==========

function testQualityTitle() {
  console.log('\n========== 测试品质称号显示 ==========');

  // 测试用例1: 评分 >= 100 显示"极品 X 星"
  const title1 = getQualityTitle(1200);
  const passed1 = title1 === '极品12星';
  logTest(
    '品质称号 - 极品12星 (评分1200)',
    passed1,
    passed1 ? `称号正确: ${title1}` : `期望: 极品12星, 实际: ${title1}`
  );

  const title1b = getQualityTitle(800);
  const passed1b = title1b === '极品8星';
  logTest(
    '品质称号 - 极品8星 (评分800)',
    passed1b,
    passed1b ? `称号正确: ${title1b}` : `期望: 极品8星, 实际: ${title1b}`
  );

  const title1c = getQualityTitle(100);
  const passed1c = title1c === '极品1星';
  logTest(
    '品质称号 - 极品1星 (评分100)',
    passed1c,
    passed1c ? `称号正确: ${title1c}` : `期望: 极品1星, 实际: ${title1c}`
  );

  // 测试用例2: 评分 >= 75 显示"万众瞩目"
  const title2 = getQualityTitle(75);
  const passed2 = title2 === '万众瞩目';
  logTest(
    '品质称号 - 万众瞩目 (评分75)',
    passed2,
    passed2 ? `称号正确: ${title2}` : `期望: 万众瞩目, 实际: ${title2}`
  );

  const title2b = getQualityTitle(99);
  const passed2b = title2b === '万众瞩目';
  logTest(
    '品质称号 - 万众瞩目 (评分99)',
    passed2b,
    passed2b ? `称号正确: ${title2b}` : `期望: 万众瞩目, 实际: ${title2b}`
  );

  // 测试用例3: 评分 >= 50 显示"千载难逢"
  const title3 = getQualityTitle(50);
  const passed3 = title3 === '千载难逢';
  logTest(
    '品质称号 - 千载难逢 (评分50)',
    passed3,
    passed3 ? `称号正确: ${title3}` : `期望: 千载难逢, 实际: ${title3}`
  );

  const title3b = getQualityTitle(74);
  const passed3b = title3b === '千载难逢';
  logTest(
    '品质称号 - 千载难逢 (评分74)',
    passed3b,
    passed3b ? `称号正确: ${title3b}` : `期望: 千载难逢, 实际: ${title3b}`
  );

  // 测试用例4: 评分 >= 25 显示"百里挑一"
  const title4 = getQualityTitle(25);
  const passed4 = title4 === '百里挑一';
  logTest(
    '品质称号 - 百里挑一 (评分25)',
    passed4,
    passed4 ? `称号正确: ${title4}` : `期望: 百里挑一, 实际: ${title4}`
  );

  const title4b = getQualityTitle(49);
  const passed4b = title4b === '百里挑一';
  logTest(
    '品质称号 - 百里挑一 (评分49)',
    passed4b,
    passed4b ? `称号正确: ${title4b}` : `期望: 百里挑一, 实际: ${title4b}`
  );

  // 测试用例5: 评分 >= 10 显示"优秀"
  const title5 = getQualityTitle(10);
  const passed5 = title5 === '优秀';
  logTest(
    '品质称号 - 优秀 (评分10)',
    passed5,
    passed5 ? `称号正确: ${title5}` : `期望: 优秀, 实际: ${title5}`
  );

  const title5b = getQualityTitle(24);
  const passed5b = title5b === '优秀';
  logTest(
    '品质称号 - 优秀 (评分24)',
    passed5b,
    passed5b ? `称号正确: ${title5b}` : `期望: 优秀, 实际: ${title5b}`
  );

  // 测试用例6: 评分 < 10 显示"普通"
  const title6 = getQualityTitle(9);
  const passed6 = title6 === '普通';
  logTest(
    '品质称号 - 普通 (评分9)',
    passed6,
    passed6 ? `称号正确: ${title6}` : `期望: 普通, 实际: ${title6}`
  );

  const title6b = getQualityTitle(0);
  const passed6b = title6b === '普通';
  logTest(
    '品质称号 - 普通 (评分0)',
    passed6b,
    passed6b ? `称号正确: ${title6b}` : `期望: 普通, 实际: ${title6b}`
  );
}

// ========== 3. 测试幻兽升级后属性更新 ==========

function testPetUpgrade() {
  console.log('\n========== 测试幻兽升级后属性更新 ==========');

  // 测试用例1: 从1级升到10级
  const pet1 = generatePetByType('攻防型', { level: 1 });
  const upgradedPet1 = upgradePetLevel(pet1, 10);

  // 验证等级更新
  const passedLevel1 = upgradedPet1.dj === 10;
  logTest(
    '升级 - 等级更新 (1级→10级)',
    passedLevel1,
    passedLevel1 ? `等级正确: ${upgradedPet1.dj}` : `期望: 10, 实际: ${upgradedPet1.dj}`
  );

  // 验证最大生命值计算
  const expectedMhp1 = Math.round(pet1.cz_hp * (10 - 1) + pet1.chp);
  const passedMhp1 = upgradedPet1.mhp === expectedMhp1;
  logTest(
    '升级 - 最大生命值计算',
    passedMhp1,
    passedMhp1 ? `最大生命值正确: ${upgradedPet1.mhp}` : `期望: ${expectedMhp1}, 实际: ${upgradedPet1.mhp}`,
    { formula: `${pet1.cz_hp} × (10-1) + ${pet1.chp} = ${expectedMhp1}` }
  );

  // 验证当前生命值恢复满值
  const passedHp1 = upgradedPet1.hp === upgradedPet1.mhp;
  logTest(
    '升级 - 当前生命值恢复满值',
    passedHp1,
    passedHp1 ? `当前生命值正确: ${upgradedPet1.hp}` : `期望: ${upgradedPet1.mhp}, 实际: ${upgradedPet1.hp}`
  );

  // 验证最小攻击力计算
  const expectedXgj1 = Math.round(pet1.cz_xgj * (10 - 1) + pet1.cxgj);
  const passedXgj1 = upgradedPet1.xgj === expectedXgj1;
  logTest(
    '升级 - 最小攻击力计算',
    passedXgj1,
    passedXgj1 ? `最小攻击力正确: ${upgradedPet1.xgj}` : `期望: ${expectedXgj1}, 实际: ${upgradedPet1.xgj}`,
    { formula: `${pet1.cz_xgj} × (10-1) + ${pet1.cxgj} = ${expectedXgj1}` }
  );

  // 验证最大攻击力计算
  const expectedDgj1 = Math.round(pet1.cz_dgj * (10 - 1) + pet1.cdgj);
  const passedDgj1 = upgradedPet1.dgj === expectedDgj1;
  logTest(
    '升级 - 最大攻击力计算',
    passedDgj1,
    passedDgj1 ? `最大攻击力正确: ${upgradedPet1.dgj}` : `期望: ${expectedDgj1}, 实际: ${upgradedPet1.dgj}`,
    { formula: `${pet1.cz_dgj} × (10-1) + ${pet1.cdgj} = ${expectedDgj1}` }
  );

  // 验证防御力计算
  const expectedFy1 = Math.round(pet1.cz_fy * (10 - 1) + pet1.cfy);
  const passedFy1 = upgradedPet1.fy === expectedFy1;
  logTest(
    '升级 - 防御力计算',
    passedFy1,
    passedFy1 ? `防御力正确: ${upgradedPet1.fy}` : `期望: ${expectedFy1}, 实际: ${upgradedPet1.fy}`,
    { formula: `${pet1.cz_fy} × (10-1) + ${pet1.cfy} = ${expectedFy1}` }
  );

  // 测试用例2: 从10级升到50级
  const pet2 = generatePetByType('调皮鬼', { level: 10 });
  const upgradedPet2 = upgradePetLevel(pet2, 50);

  const expectedMhp2 = Math.round(pet2.cz_hp * (50 - 1) + pet2.chp);
  const passedMhp2 = upgradedPet2.mhp === expectedMhp2;
  logTest(
    '升级 - 最大生命值计算 (10级→50级)',
    passedMhp2,
    passedMhp2 ? `最大生命值正确: ${upgradedPet2.mhp}` : `期望: ${expectedMhp2}, 实际: ${upgradedPet2.mhp}`
  );

  // 验证初始属性和成长属性保持不变
  const passedInit2 = upgradedPet2.chp === pet2.chp &&
                      upgradedPet2.cxgj === pet2.cxgj &&
                      upgradedPet2.cdgj === pet2.cdgj &&
                      upgradedPet2.cfy === pet2.cfy;
  logTest(
    '升级 - 初始属性保持不变',
    passedInit2,
    passedInit2 ? '初始属性正确保持' : '初始属性不应改变'
  );

  const passedGrowth2 = upgradedPet2.cz_hp === pet2.cz_hp &&
                        upgradedPet2.cz_xgj === pet2.cz_xgj &&
                        upgradedPet2.cz_dgj === pet2.cz_dgj &&
                        upgradedPet2.cz_fy === pet2.cz_fy;
  logTest(
    '升级 - 成长属性保持不变',
    passedGrowth2,
    passedGrowth2 ? '成长属性正确保持' : '成长属性不应改变'
  );
}

// ========== 4. 测试商店购买幻兽生成 ==========

function testShopPetGeneration() {
  console.log('\n========== 测试商店购买幻兽生成 ==========');

  // 测试用例1: 购买攻防型幻兽
  const pet1 = generateShopPet('pet_attack_defense');
  const passed1 = pet1 !== null && pet1.hs_name === '攻防型' && pet1.rating.pzbase === 0;
  logTest(
    '商店购买 - 攻防型幻兽',
    passed1,
    passed1 ? `生成成功，类型: ${pet1?.hs_name}, 基础评分: ${pet1?.rating.pzbase}` : '生成失败',
    pet1 ? { type: pet1.hs_name, baseScore: pet1.rating.pzbase, totalScore: pet1.pz } : null
  );

  // 测试用例2: 购买调皮鬼幻兽
  const pet2 = generateShopPet('pet_naughty_cat');
  const passed2 = pet2 !== null && pet2.hs_name === '调皮鬼' && pet2.rating.pzbase === 280;
  logTest(
    '商店购买 - 调皮鬼幻兽',
    passed2,
    passed2 ? `生成成功，类型: ${pet2?.hs_name}, 基础评分: ${pet2?.rating.pzbase}` : '生成失败',
    pet2 ? { type: pet2.hs_name, baseScore: pet2.rating.pzbase, totalScore: pet2.pz } : null
  );

  // 测试用例3: 购买守护幻兽
  const pet3 = generateShopPet('pet_guardian');
  const passed3 = pet3 !== null && pet3.hs_name === '守护' && pet3.rating.pzbase === 550;
  logTest(
    '商店购买 - 守护幻兽',
    passed3,
    passed3 ? `生成成功，类型: ${pet3?.hs_name}, 基础评分: ${pet3?.rating.pzbase}` : '生成失败',
    pet3 ? { type: pet3.hs_name, baseScore: pet3.rating.pzbase, totalScore: pet3.pz } : null
  );

  // 测试用例4: 购买8星奇异兽
  const pet4 = generateShopPet('pet_8star_strange_beast');
  const passed4 = pet4 !== null && pet4.hs_name === '奇异兽' && pet4.pz >= 800;
  logTest(
    '商店购买 - 8星奇异兽',
    passed4,
    passed4 ? `生成成功，类型: ${pet4?.hs_name}, 总评分: ${pet4?.pz}` : '生成失败',
    pet4 ? { type: pet4.hs_name, totalScore: pet4.pz, qualityTitle: pet4.qualityTitle } : null
  );

  // 测试用例5: 购买12星奇异兽
  const pet5 = generateShopPet('pet_12star_strange_beast');
  const passed5 = pet5 !== null && pet5.hs_name === '奇异兽' && pet5.pz >= 1200;
  logTest(
    '商店购买 - 12星奇异兽',
    passed5,
    passed5 ? `生成成功，类型: ${pet5?.hs_name}, 总评分: ${pet5?.pz}` : '生成失败',
    pet5 ? { type: pet5.hs_name, totalScore: pet5.pz, qualityTitle: pet5.qualityTitle } : null
  );

  // 测试用例6: 验证幻兽属性完整性
  if (pet1) {
    const hasAllProps = pet1.id !== undefined &&
                        pet1.hs_name !== undefined &&
                        pet1.dj !== undefined &&
                        pet1.hp !== undefined &&
                        pet1.mhp !== undefined &&
                        pet1.xgj !== undefined &&
                        pet1.dgj !== undefined &&
                        pet1.fy !== undefined &&
                        pet1.pz !== undefined &&
                        pet1.quality !== undefined &&
                        pet1.qualityTitle !== undefined &&
                        pet1.rating !== undefined;
    logTest(
      '商店购买 - 幻兽属性完整性',
      hasAllProps,
      hasAllProps ? '所有必需属性都存在' : '缺少必需属性'
    );
  }
}

// ========== 5. 测试抽奖获得幻兽生成 ==========

function testLotteryPetGeneration() {
  console.log('\n========== 测试抽奖获得幻兽生成 ==========');

  // 测试用例1: 极品奖品 - 噜噜幻兽
  const prize1 = selectLegendaryPrize(50);
  const passed1 = prize1.pet !== undefined && prize1.pet.hs_name === '噜噜' && prize1.pet.rating.pzbase === 700;
  logTest(
    '抽奖 - 极品奖品噜噜幻兽',
    passed1,
    passed1 ? `生成成功，类型: ${prize1.pet?.hs_name}, 基础评分: ${prize1.pet?.rating.pzbase}` : '生成失败',
    prize1.pet ? { type: prize1.pet.hs_name, baseScore: prize1.pet.rating.pzbase, totalScore: prize1.pet.pz } : null
  );

  // 测试用例2: 高级奖品 - 圣天使幻兽
  const prize2 = selectHighPrize(50);
  const passed2 = prize2.pet !== undefined && prize2.pet.hs_name === '圣天使' && prize2.pet.rating.pzbase === 280;
  logTest(
    '抽奖 - 高级奖品圣天使幻兽',
    passed2,
    passed2 ? `生成成功，类型: ${prize2.pet?.hs_name}, 基础评分: ${prize2.pet?.rating.pzbase}` : '生成失败',
    prize2.pet ? { type: prize2.pet.hs_name, baseScore: prize2.pet.rating.pzbase, totalScore: prize2.pet.pz } : null
  );

  // 测试用例3: 中级奖品 - 8星或12星奇异兽
  const prize3 = selectMediumPrize(50);
  const passed3 = prize3.pet !== undefined &&
                  prize3.pet.hs_name === '奇异兽' &&
                  (prize3.pet.pz >= 800 || prize3.pet.pz >= 1200);
  logTest(
    '抽奖 - 中级奖品奇异兽',
    passed3,
    passed3 ? `生成成功，类型: ${prize3.pet?.hs_name}, 总评分: ${prize3.pet?.pz}` : '生成失败',
    prize3.pet ? { type: prize3.pet.hs_name, totalScore: prize3.pet.pz, qualityTitle: prize3.pet.qualityTitle } : null
  );

  // 测试用例4: 验证抽奖幻兽属性完整性
  if (prize1.pet) {
    const hasAllProps = prize1.pet.id !== undefined &&
                        prize1.pet.hs_name !== undefined &&
                        prize1.pet.dj !== undefined &&
                        prize1.pet.hp !== undefined &&
                        prize1.pet.mhp !== undefined &&
                        prize1.pet.xgj !== undefined &&
                        prize1.pet.dgj !== undefined &&
                        prize1.pet.fy !== undefined &&
                        prize1.pet.pz !== undefined &&
                        prize1.pet.quality !== undefined &&
                        prize1.pet.qualityTitle !== undefined &&
                        prize1.pet.rating !== undefined;
    logTest(
      '抽奖 - 幻兽属性完整性',
      hasAllProps,
      hasAllProps ? '所有必需属性都存在' : '缺少必需属性'
    );
  }

  // 测试用例5: 验证品质称号正确性
  if (prize1.pet) {
    const correctTitle = prize1.pet.qualityTitle === getQualityTitle(prize1.pet.pz);
    logTest(
      '抽奖 - 品质称号正确性',
      correctTitle,
      correctTitle ? `品质称号正确: ${prize1.pet.qualityTitle}` : '品质称号不匹配'
    );
  }
}

// ========== 6. 测试幻兽研究所购买奇异兽 ==========

function testPetInstituteGeneration() {
  console.log('\n========== 测试幻兽研究所购买奇异兽 ==========');

  // 测试用例1: 技术等级20，品质分 = 20 * 75 = 1500
  const qualityScore1 = 20 * 75; // 1500
  const pet1 = generateStrangePet(qualityScore1);
  const passed1 = pet1.hs_name === '奇异兽' && pet1.pz === qualityScore1;
  logTest(
    '幻兽研究所 - 技术等级20奇异兽',
    passed1,
    passed1 ? `生成成功，品质分: ${pet1.pz}` : `期望: ${qualityScore1}, 实际: ${pet1.pz}`,
    { qualityScore: qualityScore1, actualScore: pet1.pz, qualityTitle: pet1.qualityTitle }
  );

  // 测试用例2: 技术等级50，品质分 = 50 * 75 = 3750
  const qualityScore2 = 50 * 75; // 3750
  const pet2 = generateStrangePet(qualityScore2);
  const passed2 = pet2.hs_name === '奇异兽' && pet2.pz === qualityScore2;
  logTest(
    '幻兽研究所 - 技术等级50奇异兽',
    passed2,
    passed2 ? `生成成功，品质分: ${pet2.pz}` : `期望: ${qualityScore2}, 实际: ${pet2.pz}`,
    { qualityScore: qualityScore2, actualScore: pet2.pz, qualityTitle: pet2.qualityTitle }
  );

  // 测试用例3: 技术等级100，品质分 = 100 * 75 = 7500
  const qualityScore3 = 100 * 75; // 7500
  const pet3 = generateStrangePet(qualityScore3);
  const passed3 = pet3.hs_name === '奇异兽' && pet3.pz === qualityScore3;
  logTest(
    '幻兽研究所 - 技术等级100奇异兽',
    passed3,
    passed3 ? `生成成功，品质分: ${pet3.pz}` : `期望: ${qualityScore3}, 实际: ${pet3.pz}`,
    { qualityScore: qualityScore3, actualScore: pet3.pz, qualityTitle: pet3.qualityTitle }
  );

  // 测试用例4: 验证品质称号
  if (pet1) {
    const expectedStars = Math.floor(qualityScore1 / 100);
    const expectedTitle = `极品${expectedStars}星`;
    const passed4 = pet1.qualityTitle === expectedTitle;
    logTest(
      '幻兽研究所 - 品质称号正确性',
      passed4,
      passed4 ? `品质称号正确: ${pet1.qualityTitle}` : `期望: ${expectedTitle}, 实际: ${pet1.qualityTitle}`
    );
  }
}

// ========== 运行所有测试 ==========

function runAllTests() {
  console.log('========================================');
  console.log('开始运行幻兽系统测试');
  console.log('========================================');

  testInitialRatingCalculation();
  testGrowthRatingCalculation();
  testTotalScoreCalculation();
  testQualityTitle();
  testPetUpgrade();
  testShopPetGeneration();
  testLotteryPetGeneration();
  testPetInstituteGeneration();

  console.log('\n========================================');
  console.log('测试结果汇总');
  console.log('========================================');

  const totalTests = testResults.length;
  const passedTests = testResults.filter(r => r.passed).length;
  const failedTests = totalTests - passedTests;

  console.log(`总测试数: ${totalTests}`);
  console.log(`通过: ${passedTests}`);
  console.log(`失败: ${failedTests}`);
  console.log(`通过率: ${((passedTests / totalTests) * 100).toFixed(2)}%`);

  if (failedTests > 0) {
    console.log('\n失败的测试:');
    testResults.filter(r => !r.passed).forEach(r => {
      console.log(`  - ${r.testName}: ${r.message}`);
    });
  }

  return {
    total: totalTests,
    passed: passedTests,
    failed: failedTests,
    results: testResults
  };
}

// 导出测试函数
export {
  runAllTests,
  testGrowthRatingCalculation,
  testInitialRatingCalculation,
  testLotteryPetGeneration,
  testPetInstituteGeneration,
  testPetUpgrade,
  testQualityTitle,
  testShopPetGeneration,
  testTotalScoreCalculation};
