# Tasks

- [x] Task 1: 重构幻兽评分计算逻辑
  - [x] SubTask 1.1: 修正初始属性评分计算公式，确保符合文档规范
  - [x] SubTask 1.2: 修正成长属性评分计算公式，实现分段计算逻辑
  - [x] SubTask 1.3: 确保总评分计算正确，包含所有评分项

- [x] Task 2: 实现幻兽品质称号系统
  - [x] SubTask 2.1: 创建品质称号计算函数 `getQualityTitle(score)`
  - [x] SubTask 2.2: 在 Pet 接口中添加 `qualityTitle` 属性
  - [x] SubTask 2.3: 更新幻兽详情弹窗，显示品质称号而非品质等级

- [x] Task 3: 实现幻兽升级属性更新机制
  - [x] SubTask 3.1: 创建幻兽升级函数 `upgradePetLevel(pet, newLevel)`
  - [x] SubTask 3.2: 实现属性重新计算逻辑，根据成长率更新属性
  - [x] SubTask 3.3: 处理升级后生命值恢复满值的逻辑

- [x] Task 4: 统一幻兽生成模块
  - [x] SubTask 4.1: 在 `petGenerator.ts` 中创建通用幻兽生成函数 `generatePetByType(petType, options)`
  - [x] SubTask 4.2: 创建指定星级奇异兽生成函数 `generateStarStrangePet(starLevel)`
  - [x] SubTask 4.3: 重构 `generateStrangePet` 函数，确保评分计算正确

- [x] Task 5: 重构商店幻兽购买逻辑
  - [x] SubTask 5.1: 修改商店数据，移除硬编码的幻兽数据
  - [x] SubTask 5.2: 在商店购买逻辑中调用 `petGenerator.ts` 的生成函数
  - [x] SubTask 5.3: 确保商店购买的幻兽评分和属性正确

- [x] Task 6: 重构抽奖系统幻兽生成逻辑
  - [x] SubTask 6.1: 移除 `lotterySystem.ts` 中的幻兽生成代码
  - [x] SubTask 6.2: 在抽奖系统中调用 `petGenerator.ts` 的生成函数
  - [x] SubTask 6.3: 确保抽奖获得的幻兽评分和属性正确

- [x] Task 7: 更新幻兽数据文件
  - [x] SubTask 7.1: 重构 `petData.ts`，使用统一的生成函数创建示例幻兽
  - [x] SubTask 7.2: 确保所有示例幻兽的评分计算正确
  - [x] SubTask 7.3: 为示例幻兽添加品质称号

- [x] Task 8: 更新幻兽组件显示逻辑
  - [x] SubTask 8.1: 修改 `PetDetailModal.tsx`，显示品质称号而非品质等级
  - [x] SubTask 8.2: 确保品质称号颜色显示正确
  - [x] SubTask 8.3: 更新幻兽列表项的显示逻辑

- [x] Task 9: 测试和验证
  - [x] SubTask 9.1: 测试幻兽评分计算是否正确
  - [x] SubTask 9.2: 测试品质称号显示是否符合文档规范
  - [x] SubTask 9.3: 测试幻兽升级后属性是否正确更新
  - [x] SubTask 9.4: 测试商店购买幻兽是否正确生成
  - [x] SubTask 9.5: 测试抽奖获得幻兽是否正确生成

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 1, Task 2]
- [Task 5] depends on [Task 4]
- [Task 6] depends on [Task 4]
- [Task 7] depends on [Task 1, Task 2, Task 4]
- [Task 8] depends on [Task 2]
- [Task 9] depends on [Task 1, Task 2, Task 3, Task 4, Task 5, Task 6, Task 7, Task 8]
