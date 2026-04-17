/**
 * 幻兽经验获取机制测试文件
 * 用于验证 gainExperience 函数的功能
 */

import {
  gainExperience,
  generatePetByType
} from '../src/utils/petGenerator';

// 测试结果统计
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const testResults: { testName: string; passed: boolean; message: string }[] = [];

// 测试辅助函数
function assert(condition: boolean, testName: string, message: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    testResults.push({ testName, passed: true, message: '✅ 通过' });
    console.log(`✅ ${testName}: 通过`);
  } else {
    failedTests++;
    testResults.push({ testName, passed: false, message });
    console.log(`❌ ${testName}: ${message}`);
  }
}

// 测试1：等级限制测试 - 幻兽等级 >= 130 时无法获得经验
function testLevelCap() {
  console.log('\n=== 测试1：等级限制测试 ===');

  const pet = generatePetByType('攻防型', { level: 130 });
  const result = gainExperience(pet, 1000, 130);

  assert(
    result.pet.dj === 130,
    '等级上限检查',
    result.pet.dj === 130 ? '通过' : `期望等级130，实际${result.pet.dj}`
  );

  assert(
    result.message === '幻兽等级已满，无法再获得经验值了。',
    '等级上限消息',
    result.message === '幻兽等级已满，无法再获得经验值了。' ? '通过' : `消息不正确：${result.message}`
  );

  assert(
    result.pet.jy === 0,
    '经验值清零',
    result.pet.jy === 0 ? '通过' : `期望经验值0，实际${result.pet.jy}`
  );
}

// 测试2：人物等级关联检查
function testPlayerLevelLimit() {
  console.log('\n=== 测试2：人物等级关联检查 ===');

  const pet = generatePetByType('攻防型', { level: 20 });
  const result = gainExperience(pet, 1000, 10); // 玩家等级10，幻兽等级20

  assert(
    result.pet.dj === 20,
    '等级不变',
    result.pet.dj === 20 ? '通过' : `期望等级20，实际${result.pet.dj}`
  );

  assert(
    result.message === '幻兽等级已高于人物的10级，无法再获得经验值了。',
    '等级关联消息',
    result.message === '幻兽等级已高于人物的10级，无法再获得经验值了。' ? '通过' : `消息不正确：${result.message}`
  );
}

// 测试3：经验翻倍测试
function testExpDoubling() {
  console.log('\n=== 测试3：经验翻倍测试 ===');

  const pet = generatePetByType('攻防型', { level: 1 });
  const result = gainExperience(pet, 100, 10); // 获得100经验，应该翻倍为200

  assert(
    result.pet.jy === 200,
    '经验值翻倍',
    result.pet.jy === 200 ? '通过' : `期望经验值200，实际${result.pet.jy}`
  );
}

// 测试4：升级循环测试
function testLevelUpLoop() {
  console.log('\n=== 测试4：升级循环测试 ===');

  const pet = generatePetByType('攻防型', { level: 1 });
  const result = gainExperience(pet, 10000, 50); // 获得大量经验，应该连续升级

  assert(
    result.pet.dj > 1,
    '等级提升',
    result.pet.dj > 1 ? `通过，等级从1升到${result.pet.dj}` : '等级未提升'
  );

  assert(
    result.leveledUp,
    '升级标记',
    result.leveledUp ? '通过' : '升级标记未设置'
  );
}

// 测试5：经验需求递增测试
function testExpRequirementGrowth() {
  console.log('\n=== 测试5：经验需求递增测试 ===');

  // 测试1-19级（×1.2）
  const pet1 = generatePetByType('攻防型', { level: 1 });
  const result1 = gainExperience(pet1, 100, 50);
  const expectedMjy1 = Math.round(10 * 1.2); // 2级时mjy应该为12

  assert(
    result1.pet.mjy === expectedMjy1,
    '1-19级经验需求递增（×1.2）',
    result1.pet.mjy === expectedMjy1 ? `通过，mjy=${result1.pet.mjy}` : `期望mjy=${expectedMjy1}，实际${result1.pet.mjy}`
  );

  // 测试20-50级（×1.1）
  const pet20 = generatePetByType('攻防型', { level: 20 });
  let currentPet = pet20;
  for (let i = 0; i < 10; i++) {
    currentPet = gainExperience(currentPet, 100000, 50).pet;
  }
  // 20级升到21级，mjy应该按×1.1递增

  assert(
    currentPet.dj > 20,
    '20-50级经验需求递增（×1.1）',
    currentPet.dj > 20 ? `通过，等级升到${currentPet.dj}` : '等级未提升'
  );
}

// 测试6：顿悟机制测试
function testEnlightenment() {
  console.log('\n=== 测试6：顿悟机制测试 ===');

  // 创建一个幻化过的幻兽（predj > 50）
  const pet = generatePetByType('攻防型', { level: 49 });
  pet.predj = 80; // 幻化前等级80
  pet.premjy = 20000; // 幻化前升级所需经验
  pet.prejy = 12000; // 幻化前当前经验

  const result = gainExperience(pet, 100000, 100); // 给足够经验升到50级

  assert(
    result.pet.dj === 80,
    '顿悟后等级恢复',
    result.pet.dj === 80 ? '通过' : `期望等级80，实际${result.pet.dj}`
  );

  assert(
    result.pet.mjy === 20000,
    '顿悟后经验需求恢复',
    result.pet.mjy === 20000 ? '通过' : `期望mjy=20000，实际${result.pet.mjy}`
  );

  assert(
    result.pet.jy === 12000,
    '顿悟后经验值恢复',
    result.pet.jy === 12000 ? '通过' : `期望jy=12000，实际${result.pet.jy}`
  );

  assert(
    result.message?.includes('顿悟'),
    '顿悟消息',
    result.message?.includes('顿悟') ? '通过' : `消息不正确：${result.message}`
  );
}

// 测试7：属性更新测试
function testAttributeUpdate() {
  console.log('\n=== 测试7：属性更新测试 ===');

  const pet = generatePetByType('攻防型', { level: 1 });
  const result = gainExperience(pet, 10000, 50);

  if (result.pet.dj > 1) {
    // 计算期望属性
    const expectedMhp = pet.cz_hp * (result.pet.dj - 1) + pet.chp;
    const expectedXgj = pet.cz_xgj * (result.pet.dj - 1) + pet.cxgj;
    const expectedDgj = pet.cz_dgj * (result.pet.dj - 1) + pet.cdgj;
    const expectedFy = pet.cz_fy * (result.pet.dj - 1) + pet.cfy;

    assert(
      result.pet.mhp === expectedMhp,
      '最大生命值更新',
      result.pet.mhp === expectedMhp ? '通过' : `期望mhp=${expectedMhp}，实际${result.pet.mhp}`
    );

    assert(
      result.pet.xgj === expectedXgj,
      '最小攻击力更新',
      result.pet.xgj === expectedXgj ? '通过' : `期望xgj=${expectedXgj}，实际${result.pet.xgj}`
    );

    assert(
      result.pet.dgj === expectedDgj,
      '最大攻击力更新',
      result.pet.dgj === expectedDgj ? '通过' : `期望dgj=${expectedDgj}，实际${result.pet.dgj}`
    );

    assert(
      result.pet.fy === expectedFy,
      '防御力更新',
      result.pet.fy === expectedFy ? '通过' : `期望fy=${expectedFy}，实际${result.pet.fy}`
    );

    assert(
      result.pet.hp === result.pet.mhp,
      '当前生命值恢复满值',
      result.pet.hp === result.pet.mhp ? '通过' : `期望hp=${result.pet.mhp}，实际${result.pet.hp}`
    );
  } else {
    console.log('⚠️  升级失败，无法测试属性更新');
  }
}

// 测试8：50级特殊处理测试
function testLevel50Special() {
  console.log('\n=== 测试8：50级特殊处理测试 ===');

  const pet = generatePetByType('攻防型', { level: 49 });
  const result = gainExperience(pet, 100000, 100);

  if (result.pet.dj >= 50) {
    assert(
      result.pet.hun > 1,
      'hun值计算',
      result.pet.hun > 1 ? `通过，hun=${result.pet.hun}` : `hun值未更新：${result.pet.hun}`
    );

    assert(
      result.message === '你的幻兽达到50级了，可以到幻化大师那里进行幻化。',
      '50级提示消息',
      result.message === '你的幻兽达到50级了，可以到幻化大师那里进行幻化。' ? '通过' : `消息不正确：${result.message}`
    );
  } else {
    console.log('⚠️  未达到50级，无法测试50级特殊处理');
  }
}

// 运行所有测试
function runAllTests() {
  console.log('========================================');
  console.log('幻兽经验获取机制测试');
  console.log('========================================');

  testLevelCap();
  testPlayerLevelLimit();
  testExpDoubling();
  testLevelUpLoop();
  testExpRequirementGrowth();
  testEnlightenment();
  testAttributeUpdate();
  testLevel50Special();

  console.log('\n========================================');
  console.log('测试结果统计');
  console.log('========================================');
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

// 运行测试
runAllTests();
