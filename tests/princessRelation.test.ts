/**
 * 公主关系系统测试文件
 * 用于验证公主对话、技能学习、丫环交易、周日礼物、知己礼物等功能
 */

import type { PrincessRelationship, SkillDetail } from '../src/types';
import {
  calculateGiftIntimacy,
  calculateRelationshipLevel,
  checkSkillUnlock,
  getChatDialogue,
  getChatReward,
  getConfidantGift,
  getNextRelationshipRequirement,
  getRelationshipName,
  getSundayGift,
  getUpgradeMessage,
  learnLovePowerSkill,
  performChat,
  performGift,
  receiveConfidantGift,
  receiveSundayGift,
  RELATIONSHIP_LEVELS
} from '../src/utils/princessRelationUtils';

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

// ========== 1. 测试公主对话内容是否根据关系等级正确显示 ==========

function testChatDialogueByRelationshipLevel() {
  console.log('\n========== 测试公主对话内容是否根据关系等级正确显示 ==========');

  // 测试用例1: 关系等级0（未认识）的对话
  const dialogue0 = getChatDialogue(0, false);
  const passed0 = dialogue0 === '听说你是位英勇的战士，我非常敬佩你的勇敢。';
  logTest(
    '公主对话 - 关系等级0（未认识）',
    passed0,
    passed0 ? `对话正确: ${dialogue0}` : `期望: '听说你是位英勇的战士...' 实际: ${dialogue0}`
  );

  // 测试用例2: 关系等级1（认识）- 未救国王
  const dialogue1a = getChatDialogue(1, false);
  const passed1a = dialogue1a === '很高兴，你能和我聊天。我最担心的是我的父亲，你有他的消息了吗。';
  logTest(
    '公主对话 - 关系等级1（认识）未救国王',
    passed1a,
    passed1a ? `对话正确: ${dialogue1a}` : '对话不正确'
  );

  // 测试用例3: 关系等级1（认识）- 已救国王
  const dialogue1b = getChatDialogue(1, true);
  const passed1b = dialogue1b === '很高兴，你能和我聊天。非常感谢你把我父亲救出来。';
  logTest(
    '公主对话 - 关系等级1（认识）已救国王',
    passed1b,
    passed1b ? `对话正确: ${dialogue1b}` : '对话不正确'
  );

  // 测试用例4: 关系等级2（普通朋友）
  const dialogue2 = getChatDialogue(2, false);
  const passed2 = dialogue2 === '我的朋友，我这里有些攻防型幻兽...';
  logTest(
    '公主对话 - 关系等级2（普通朋友）',
    passed2,
    passed2 ? `对话正确: ${dialogue2}` : '对话不正确'
  );

  // 测试用例5: 关系等级3（好朋友）
  const dialogue3 = getChatDialogue(3, false);
  const passed3 = dialogue3 === '我这里有许多幻兽，这个奇异兽听说是幻兽幻化时的最好副幻兽...';
  logTest(
    '公主对话 - 关系等级3（好朋友）',
    passed3,
    passed3 ? `对话正确: ${dialogue3}` : '对话不正确'
  );

  // 测试用例6: 关系等级4（知己）
  const dialogue4 = getChatDialogue(4, false);
  const passed4 = dialogue4 === '这是我精心为你培养的12星奇异兽...';
  logTest(
    '公主对话 - 关系等级4（知己）',
    passed4,
    passed4 ? `对话正确: ${dialogue4}` : '对话不正确'
  );

  // 测试用例7: 关系等级5（恋人）
  const dialogue5 = getChatDialogue(5, false);
  const passed5 = dialogue5 === '看，这只亚特兰蒂斯大陆里非常稀有的极品19星奇异兽...';
  logTest(
    '公主对话 - 关系等级5（恋人）',
    passed5,
    passed5 ? `对话正确: ${dialogue5}` : '对话不正确'
  );

  // 测试用例8: 关系等级6（亲密恋人）
  const dialogue6 = getChatDialogue(6, false);
  const passed6 = dialogue6 === '你把这无比优秀的19星奇异兽带上吧...';
  logTest(
    '公主对话 - 关系等级6（亲密恋人）',
    passed6,
    passed6 ? `对话正确: ${dialogue6}` : '对话不正确'
  );
}

// ========== 2. 测试"爱的力量"技能学习功能 ==========

function testLovePowerSkillLearning() {
  console.log('\n========== 测试"爱的力量"技能学习功能 ==========');

  // 创建模拟技能列表
  const createMockSkills = (): SkillDetail[] => {
    return [
      { id: 'skill_1', name: '技能1', level: 1, maxLevel: 3, isLearned: true, description: '测试技能1', type: 'active', mpCost: 10, damage: 100 },
      { id: 'skill_2', name: '技能2', level: 0, maxLevel: 3, isLearned: false, description: '测试技能2', type: 'active', mpCost: 10, damage: 100 },
      { id: 'skill_3', name: '技能3', level: 0, maxLevel: 3, isLearned: false, description: '测试技能3', type: 'active', mpCost: 10, damage: 100 },
      { id: 'skill_4', name: '技能4', level: 0, maxLevel: 3, isLearned: false, description: '测试技能4', type: 'active', mpCost: 10, damage: 100 },
      { id: 'skill_5', name: '技能5', level: 0, maxLevel: 3, isLearned: false, description: '测试技能5', type: 'active', mpCost: 10, damage: 100 },
      { id: 'skill_love_power', name: '爱的力量', level: 0, maxLevel: 2, isLearned: false, description: '爱的力量技能', type: 'passive', mpCost: 0, damage: 0 },
    ];
  };

  // 测试用例1: 从等级4升级到等级5时检查技能解锁
  const skillUnlock1 = checkSkillUnlock(4, 5);
  const passed1 = skillUnlock1 !== null && skillUnlock1.skillId === 'skill_love_power' && skillUnlock1.skillLevel === 1;
  logTest(
    '技能解锁检查 - 从知己升级到恋人',
    passed1,
    passed1 ? `技能解锁正确: ${JSON.stringify(skillUnlock1)}` : '应该解锁爱的力量等级1',
    skillUnlock1
  );

  // 测试用例2: 从等级5升级到等级6时检查技能解锁
  const skillUnlock2 = checkSkillUnlock(5, 6);
  const passed2 = skillUnlock2 !== null && skillUnlock2.skillId === 'skill_love_power' && skillUnlock2.skillLevel === 2;
  logTest(
    '技能解锁检查 - 从恋人升级到亲密恋人',
    passed2,
    passed2 ? `技能解锁正确: ${JSON.stringify(skillUnlock2)}` : '应该解锁爱的力量等级2',
    skillUnlock2
  );

  // 测试用例3: 从等级3升级到等级4时不解锁技能
  const skillUnlock3 = checkSkillUnlock(3, 4);
  const passed3 = skillUnlock3 === null;
  logTest(
    '技能解锁检查 - 从好朋友升级到知己（不应解锁）',
    passed3,
    passed3 ? '正确：不解锁技能' : '不应该解锁技能'
  );

  // 测试用例4: 学习爱的力量等级1
  const skills1 = createMockSkills();
  const learnResult1 = learnLovePowerSkill(skills1, 1);
  const passed4 = learnResult1.success && learnResult1.skillLevel === 1;
  logTest(
    '学习技能 - 爱的力量等级1',
    passed4,
    passed4 ? `学习成功: ${learnResult1.message}` : `学习失败: ${learnResult1.message}`,
    learnResult1
  );

  // 测试用例5: 升级爱的力量到等级2
  const skills2 = createMockSkills();
  skills2[5].isLearned = true;
  skills2[5].level = 1;
  const learnResult2 = learnLovePowerSkill(skills2, 2);
  const passed5 = learnResult2.success && learnResult2.skillLevel === 2;
  logTest(
    '升级技能 - 爱的力量等级1→2',
    passed5,
    passed5 ? `升级成功: ${learnResult2.message}` : `升级失败: ${learnResult2.message}`,
    learnResult2
  );

  // 测试用例6: 重复学习相同等级应该失败
  const skills3 = createMockSkills();
  skills3[5].isLearned = true;
  skills3[5].level = 1;
  const learnResult3 = learnLovePowerSkill(skills3, 1);
  const passed6 = !learnResult3.success;
  logTest(
    '重复学习 - 已有等级1时再次学习等级1',
    passed6,
    passed6 ? `正确拒绝: ${learnResult3.message}` : '应该拒绝重复学习'
  );

  // 测试用例7: 关系等级配置中包含技能解锁信息
  const level5Config = RELATIONSHIP_LEVELS.find(l => l.level === 5);
  const passed7 = level5Config?.unlockSkill?.skillId === 'love_power' && level5Config?.unlockSkill?.skillLevel === 1;
  logTest(
    '配置验证 - 关系等级5（恋人）解锁技能配置',
    passed7,
    passed7 ? '配置正确' : '配置不正确',
    level5Config?.unlockSkill
  );

  const level6Config = RELATIONSHIP_LEVELS.find(l => l.level === 6);
  const passed8 = level6Config?.unlockSkill?.skillId === 'love_power' && level6Config?.unlockSkill?.skillLevel === 2;
  logTest(
    '配置验证 - 关系等级6（亲密恋人）解锁技能配置',
    passed8,
    passed8 ? '配置正确' : '配置不正确',
    level6Config?.unlockSkill
  );
}

// ========== 3. 测试周日礼物发放（不同关系等级、战魂状态） ==========

function testSundayGiftDistribution() {
  console.log('\n========== 测试周日礼物发放（不同关系等级、战魂状态） ==========');

  // 测试用例1: 关系等级0-2 获得高级经验石
  const gift0 = getSundayGift(0, false);
  const passed0 = gift0?.itemId === 'senior_exp_stone' && gift0?.itemName === '高级经验石';
  logTest(
    '周日礼物 - 关系等级0（未认识）',
    passed0,
    passed0 ? `礼物正确: ${gift0?.itemName}` : '礼物不正确',
    gift0
  );

  const gift2 = getSundayGift(2, false);
  const passed2 = gift2?.itemId === 'senior_exp_stone';
  logTest(
    '周日礼物 - 关系等级2（普通朋友）',
    passed2,
    passed2 ? `礼物正确: ${gift2?.itemName}` : '礼物不正确',
    gift2
  );

  // 测试用例2: 关系等级3-4 获得高级战斗力石
  const gift3 = getSundayGift(3, false);
  const passed3 = gift3?.itemId === 'senior_combat_stone' && gift3?.itemName === '高级战斗力石';
  logTest(
    '周日礼物 - 关系等级3（好朋友）',
    passed3,
    passed3 ? `礼物正确: ${gift3?.itemName}` : '礼物不正确',
    gift3
  );

  const gift4 = getSundayGift(4, false);
  const passed4 = gift4?.itemId === 'senior_combat_stone';
  logTest(
    '周日礼物 - 关系等级4（知己）',
    passed4,
    passed4 ? `礼物正确: ${gift4?.itemName}` : '礼物不正确',
    gift4
  );

  // 测试用例3: 关系等级5 获得灵魂王
  const gift5 = getSundayGift(5, false);
  const passed5 = gift5?.itemId === 'soul_king' && gift5?.itemName === '灵魂王';
  logTest(
    '周日礼物 - 关系等级5（恋人）',
    passed5,
    passed5 ? `礼物正确: ${gift5?.itemName}` : '礼物不正确',
    gift5
  );

  // 测试用例4: 关系等级6 未开战魂 获得电浆药水
  const gift6a = getSundayGift(6, false);
  const passed6a = gift6a?.itemId === 'plasma_potion' && gift6a?.itemName === '电浆药水';
  logTest(
    '周日礼物 - 关系等级6（亲密恋人）未开战魂',
    passed6a,
    passed6a ? `礼物正确: ${gift6a?.itemName}` : '礼物不正确',
    gift6a
  );

  // 测试用例5: 关系等级6 已开战魂 获得战魂之心
  const gift6b = getSundayGift(6, true);
  const passed6b = gift6b?.itemId === 'battle_soul_heart' && gift6b?.itemName === '战魂之心';
  logTest(
    '周日礼物 - 关系等级6（亲密恋人）已开战魂',
    passed6b,
    passed6b ? `礼物正确: ${gift6b?.itemName}` : '礼物不正确',
    gift6b
  );

  // 测试用例6: 非周日不能领取礼物
  const relationship: PrincessRelationship = {
    level: 5,
    intimacy: 150,
    relationshipName: '恋人',
    canChatToday: true,
    canGiftToday: true,
    canReceiveSundayGift: true,
    hasReceivedConfidantGift: false
  };
  const receiveResult = receiveSundayGift(relationship, false, false);
  const passed7 = !receiveResult.success && receiveResult.message.includes('只有在周日');
  logTest(
    '周日礼物领取限制 - 非周日',
    passed7,
    passed7 ? `正确拒绝: ${receiveResult.message}` : '应该拒绝非周日领取'
  );

  // 测试用例7: 本周已领取不能再次领取
  const relationship2: PrincessRelationship = {
    level: 5,
    intimacy: 150,
    relationshipName: '恋人',
    canChatToday: true,
    canGiftToday: true,
    canReceiveSundayGift: false,
    hasReceivedConfidantGift: false
  };
  const receiveResult2 = receiveSundayGift(relationship2, true, false);
  const passed8 = !receiveResult2.success && receiveResult2.message.includes('本周已经领取过');
  logTest(
    '周日礼物领取限制 - 本周已领取',
    passed8,
    passed8 ? `正确拒绝: ${receiveResult2.message}` : '应该拒绝重复领取'
  );

  // 测试用例8: 周日正常领取
  const relationship3: PrincessRelationship = {
    level: 5,
    intimacy: 150,
    relationshipName: '恋人',
    canChatToday: true,
    canGiftToday: true,
    canReceiveSundayGift: true,
    hasReceivedConfidantGift: false
  };
  const receiveResult3 = receiveSundayGift(relationship3, true, false);
  const passed9 = receiveResult3.success && receiveResult3.gift?.itemId === 'soul_king';
  logTest(
    '周日礼物领取 - 正常领取',
    passed9,
    passed9 ? `领取成功: ${receiveResult3.message}` : '领取失败',
    receiveResult3
  );
}

// ========== 4. 测试知己礼物领取（一次性限制） ==========

function testConfidantGift() {
  console.log('\n========== 测试知己礼物领取（一次性限制） ==========');

  // 测试用例1: 关系等级不足（等级3）不能领取
  const relationship1: PrincessRelationship = {
    level: 3,
    intimacy: 40,
    relationshipName: '好朋友',
    canChatToday: true,
    canGiftToday: true,
    canReceiveSundayGift: true,
    hasReceivedConfidantGift: false
  };
  const result1 = receiveConfidantGift(relationship1);
  const passed1 = !result1.success && result1.message.includes('需要达到知己关系');
  logTest(
    '知己礼物 - 关系等级不足（等级3）',
    passed1,
    passed1 ? `正确拒绝: ${result1.message}` : '应该拒绝等级不足的领取'
  );

  // 测试用例2: 关系等级达到知己（等级4）可以领取
  const relationship2: PrincessRelationship = {
    level: 4,
    intimacy: 75,
    relationshipName: '知己',
    canChatToday: true,
    canGiftToday: true,
    canReceiveSundayGift: true,
    hasReceivedConfidantGift: false
  };
  const result2 = receiveConfidantGift(relationship2);
  const passed2 = result2.success && result2.gift?.itemId === 'year_pig';
  logTest(
    '知己礼物 - 关系等级达到知己（等级4）',
    passed2,
    passed2 ? `领取成功: ${result2.message}` : '领取失败',
    result2
  );

  // 测试用例3: 关系等级达到恋人（等级5）可以领取
  const relationship3: PrincessRelationship = {
    level: 5,
    intimacy: 150,
    relationshipName: '恋人',
    canChatToday: true,
    canGiftToday: true,
    canReceiveSundayGift: true,
    hasReceivedConfidantGift: false
  };
  const result3 = receiveConfidantGift(relationship3);
  const passed3 = result3.success && result3.gift?.itemId === 'year_pig';
  logTest(
    '知己礼物 - 关系等级达到恋人（等级5）',
    passed3,
    passed3 ? `领取成功: ${result3.message}` : '领取失败',
    result3
  );

  // 测试用例4: 已领取过不能再次领取
  const relationship4: PrincessRelationship = {
    level: 4,
    intimacy: 75,
    relationshipName: '知己',
    canChatToday: true,
    canGiftToday: true,
    canReceiveSundayGift: true,
    hasReceivedConfidantGift: true
  };
  const result4 = receiveConfidantGift(relationship4);
  const passed4 = !result4.success && result4.message.includes('已经领取过');
  logTest(
    '知己礼物 - 已领取过（一次性限制）',
    passed4,
    passed4 ? `正确拒绝: ${result4.message}` : '应该拒绝重复领取'
  );

  // 测试用例5: 验证知己礼物内容
  const gift = getConfidantGift();
  const passed5 = gift.itemId === 'year_pig' && gift.itemName === '年猪';
  logTest(
    '知己礼物内容验证',
    passed5,
    passed5 ? `礼物内容正确: ${gift.itemName}` : '礼物内容不正确',
    gift
  );
}

// ========== 5. 测试关系信息显示功能 ==========

function testRelationshipInfoDisplay() {
  console.log('\n========== 测试关系信息显示功能 ==========');

  // 测试用例1: 关系名称获取
  const name0 = getRelationshipName(0);
  const passed1 = name0 === '未认识';
  logTest(
    '关系名称 - 等级0（未认识）',
    passed1,
    passed1 ? `名称正确: ${name0}` : `期望: 未认识, 实际: ${name0}`
  );

  const name1 = getRelationshipName(1);
  const passed2 = name1 === '认识';
  logTest(
    '关系名称 - 等级1（认识）',
    passed2,
    passed2 ? `名称正确: ${name1}` : `期望: 认识, 实际: ${name1}`
  );

  const name4 = getRelationshipName(4);
  const passed3 = name4 === '知己';
  logTest(
    '关系名称 - 等级4（知己）',
    passed3,
    passed3 ? `名称正确: ${name4}` : `期望: 知己, 实际: ${name4}`
  );

  const name6 = getRelationshipName(6);
  const passed4 = name6 === '亲密恋人';
  logTest(
    '关系名称 - 等级6（亲密恋人）',
    passed4,
    passed4 ? `名称正确: ${name6}` : `期望: 亲密恋人, 实际: ${name6}`
  );

  // 测试用例2: 升级所需亲密度
  const req0 = getNextRelationshipRequirement(0);
  const passed5 = req0 === 1;
  logTest(
    '升级需求 - 等级0→1所需亲密度',
    passed5,
    passed5 ? `需求正确: ${req0}` : `期望: 1, 实际: ${req0}`
  );

  const req1 = getNextRelationshipRequirement(1);
  const passed6 = req1 === 10;
  logTest(
    '升级需求 - 等级1→2所需亲密度',
    passed6,
    passed6 ? `需求正确: ${req1}` : `期望: 10, 实际: ${req1}`
  );

  const req4 = getNextRelationshipRequirement(4);
  const passed7 = req4 === 100;
  logTest(
    '升级需求 - 等级4→5所需亲密度',
    passed7,
    passed7 ? `需求正确: ${req4}` : `期望: 100, 实际: ${req4}`
  );

  const req6 = getNextRelationshipRequirement(6);
  const passed8 = req6 === Infinity;
  logTest(
    '升级需求 - 等级6（最高级）',
    passed8,
    passed8 ? `需求正确: ${req6}` : `期望: Infinity, 实际: ${req6}`
  );

  // 测试用例3: 根据亲密度计算关系等级
  const level0 = calculateRelationshipLevel(0);
  const passed9 = level0 === 0;
  logTest(
    '等级计算 - 亲密度0',
    passed9,
    passed9 ? `等级正确: ${level0}` : `期望: 0, 实际: ${level0}`
  );

  const level1 = calculateRelationshipLevel(5);
  const passed10 = level1 === 1;
  logTest(
    '等级计算 - 亲密度5',
    passed10,
    passed10 ? `等级正确: ${level1}` : `期望: 1, 实际: ${level1}`
  );

  const level4 = calculateRelationshipLevel(75);
  const passed11 = level4 === 4;
  logTest(
    '等级计算 - 亲密度75',
    passed11,
    passed11 ? `等级正确: ${level4}` : `期望: 4, 实际: ${level4}`
  );

  const level6 = calculateRelationshipLevel(250);
  const passed12 = level6 === 6;
  logTest(
    '等级计算 - 亲密度250',
    passed12,
    passed12 ? `等级正确: ${level6}` : `期望: 6, 实际: ${level6}`
  );

  // 测试用例4: 聊天奖励获取
  const reward0 = getChatReward(0);
  const passed13 = reward0 === null;
  logTest(
    '聊天奖励 - 等级0（无奖励）',
    passed13,
    passed13 ? '正确：无奖励' : '等级0不应该有奖励'
  );

  const reward2 = getChatReward(2);
  const passed14 = reward2?.petType === '攻防型' && reward2?.petStar === 1;
  logTest(
    '聊天奖励 - 等级2（普通朋友）',
    passed14,
    passed14 ? `奖励正确: ${reward2?.description}` : '奖励不正确',
    reward2
  );

  const reward4 = getChatReward(4);
  const passed15 = reward4?.petType === '奇异兽' && reward4?.petStar === 12;
  logTest(
    '聊天奖励 - 等级4（知己）',
    passed15,
    passed15 ? `奖励正确: ${reward4?.description}` : '奖励不正确',
    reward4
  );

  const reward6 = getChatReward(6);
  const passed16 = reward6?.petType === '奇异兽' && reward6?.petStar === 19;
  logTest(
    '聊天奖励 - 等级6（亲密恋人）',
    passed16,
    passed16 ? `奖励正确: ${reward6?.description}` : '奖励不正确',
    reward6
  );

  // 测试用例5: 升级消息
  const msg5 = getUpgradeMessage(5);
  const passed17 = msg5.includes('恋人') && msg5.includes('爱的力量');
  logTest(
    '升级消息 - 等级5（恋人）',
    passed17,
    passed17 ? `消息正确: ${msg5}` : '消息应包含恋人和爱的力量'
  );
}

// ========== 6. 测试送礼功能 ==========

function testGiftFunction() {
  console.log('\n========== 测试送礼功能 ==========');

  // 测试用例1: 非周日不能送礼
  const relationship1: PrincessRelationship = {
    level: 4,
    intimacy: 75,
    relationshipName: '知己',
    canChatToday: true,
    canGiftToday: true,
    canReceiveSundayGift: true,
    hasReceivedConfidantGift: false
  };
  const result1 = performGift(relationship1, '99朵白玫瑰', 1, false);
  const passed1 = !result1.success && result1.message.includes('只有在周日');
  logTest(
    '送礼限制 - 非周日',
    passed1,
    passed1 ? `正确拒绝: ${result1.message}` : '应该拒绝非周日的送礼'
  );

  // 测试用例2: 今天已送礼不能再次送礼
  const relationship2: PrincessRelationship = {
    level: 4,
    intimacy: 75,
    relationshipName: '知己',
    canChatToday: true,
    canGiftToday: false,
    canReceiveSundayGift: true,
    hasReceivedConfidantGift: false
  };
  const result2 = performGift(relationship2, '99朵白玫瑰', 1, true);
  const passed2 = !result2.success && result2.message.includes('已经送过');
  logTest(
    '送礼限制 - 今天已送礼',
    passed2,
    passed2 ? `正确拒绝: ${result2.message}` : '应该拒绝重复送礼'
  );

  // 测试用例3: 送99朵白玫瑰计算亲密度
  const intimacy1 = calculateGiftIntimacy('99朵白玫瑰', 1);
  const passed3 = intimacy1 === 5;
  logTest(
    '送礼亲密度 - 99朵白玫瑰 x1',
    passed3,
    passed3 ? `亲密度正确: ${intimacy1}` : `期望: 5, 实际: ${intimacy1}`
  );

  const intimacy2 = calculateGiftIntimacy('99朵白玫瑰', 10);
  const passed4 = intimacy2 === 14;
  logTest(
    '送礼亲密度 - 99朵白玫瑰 x10',
    passed4,
    passed4 ? `亲密度正确: ${intimacy2}` : `期望: 14, 实际: ${intimacy2}`
  );

  // 测试用例4: 送999朵白玫瑰计算亲密度
  const intimacy3 = calculateGiftIntimacy('999朵白玫瑰', 1);
  const passed5 = intimacy3 === 25;
  logTest(
    '送礼亲密度 - 999朵白玫瑰 x1',
    passed5,
    passed5 ? `亲密度正确: ${intimacy3}` : `期望: 25, 实际: ${intimacy3}`
  );

  const intimacy4 = calculateGiftIntimacy('999朵白玫瑰', 10);
  const passed6 = intimacy4 === 70;
  logTest(
    '送礼亲密度 - 999朵白玫瑰 x10',
    passed6,
    passed6 ? `亲密度正确: ${intimacy4}` : `期望: 70, 实际: ${intimacy4}`
  );

  // 测试用例5: 周日正常送礼
  const relationship3: PrincessRelationship = {
    level: 4,
    intimacy: 75,
    relationshipName: '知己',
    canChatToday: true,
    canGiftToday: true,
    canReceiveSundayGift: true,
    hasReceivedConfidantGift: false
  };
  const result3 = performGift(relationship3, '99朵白玫瑰', 1, true);
  const passed7 = result3.success && result3.intimacyGain === 5;
  logTest(
    '送礼成功 - 周日送99朵白玫瑰',
    passed7,
    passed7 ? `送礼成功: ${result3.message}` : '送礼失败',
    result3
  );
}

// ========== 7. 测试聊天功能 ==========

function testChatFunction() {
  console.log('\n========== 测试聊天功能 ==========');

  // 测试用例1: 今天已聊天不能再次聊天
  const relationship1: PrincessRelationship = {
    level: 4,
    intimacy: 75,
    relationshipName: '知己',
    canChatToday: false,
    canGiftToday: true,
    canReceiveSundayGift: true,
    hasReceivedConfidantGift: false
  };
  const result1 = performChat(relationship1, false);
  const passed1 = !result1.success && result1.message.includes('今天已经聊过天');
  logTest(
    '聊天限制 - 今天已聊天',
    passed1,
    passed1 ? `正确拒绝: ${result1.message}` : '应该拒绝重复聊天'
  );

  // 测试用例2: 正常聊天增加亲密度
  const relationship2: PrincessRelationship = {
    level: 4,
    intimacy: 75,
    relationshipName: '知己',
    canChatToday: true,
    canGiftToday: true,
    canReceiveSundayGift: true,
    hasReceivedConfidantGift: false
  };
  const result2 = performChat(relationship2, false);
  const passed2 = result2.success && result2.newIntimacy === 76;
  logTest(
    '聊天成功 - 增加亲密度',
    passed2,
    passed2 ? `聊天成功，新亲密度: ${result2.newIntimacy}` : '聊天失败',
    result2
  );

  // 测试用例3: 聊天获得奖励
  const passed3 = result2.reward !== null && result2.reward?.petType === '奇异兽';
  logTest(
    '聊天奖励 - 知己等级获得12星奇异兽',
    passed3,
    passed3 ? `奖励正确: ${result2.reward?.description}` : '奖励不正确',
    result2.reward
  );

  // 测试用例4: 聊天时关系等级提升
  const relationship3: PrincessRelationship = {
    level: 3,
    intimacy: 48,
    relationshipName: '好朋友',
    canChatToday: true,
    canGiftToday: true,
    canReceiveSundayGift: true,
    hasReceivedConfidantGift: false
  };
  const result3 = performChat(relationship3, false);
  const passed4 = result3.success && result3.newLevel === 4;
  logTest(
    '聊天升级 - 从好朋友升级到知己',
    passed4,
    passed4 ? `升级成功，新等级: ${result3.newLevel}` : '升级失败',
    result3
  );
}

// ========== 运行所有测试 ==========

function runAllTests() {
  console.log('========================================');
  console.log('开始运行公主关系系统测试');
  console.log('========================================');

  testChatDialogueByRelationshipLevel();
  testLovePowerSkillLearning();
  testSundayGiftDistribution();
  testConfidantGift();
  testRelationshipInfoDisplay();
  testGiftFunction();
  testChatFunction();

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
  testChatDialogueByRelationshipLevel,
  testChatFunction,
  testConfidantGift,
  testGiftFunction,
  testLovePowerSkillLearning,
  testRelationshipInfoDisplay,
  testSundayGiftDistribution};

// 如果直接运行此文件，执行所有测试
runAllTests();
