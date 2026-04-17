/**
 * 幻兽系统测试运行脚本
 * 用于执行幻兽系统的所有测试
 */

import { runAllTests } from './petSystem.test';

// 运行所有测试
console.log('开始执行幻兽系统测试...\n');

try {
  const results = runAllTests();

  console.log('\n========================================');
  console.log('测试执行完成');
  console.log('========================================');

  // 输出详细结果
  if (results.failed > 0) {
    console.log('\n⚠️  有测试失败，请检查上述输出');
    process.exit(1);
  } else {
    console.log('\n✅ 所有测试通过！');
    process.exit(0);
  }
} catch (error) {
  console.error('\n❌ 测试执行出错:', error);
  process.exit(1);
}
