# Tasks

- [x] Task 1: 创建开发者模式配置字段和工具函数
  - [x] SubTask 1.1: 在 `src/utils/` 下创建 `developerMode.ts` 文件，定义开发者模式配置和工具函数
  - [x] SubTask 1.2: 导出 `isDeveloperMode` 配置变量和 `getExperienceMultiplier` 工具函数
  - [x] SubTask 1.3: `getExperienceMultiplier` 函数返回 1（开启）或 0.01（关闭）

- [x] Task 2: 创建初始装备生成函数
  - [x] SubTask 2.1: 在 `src/data/inventoryData.ts` 中添加 `createInitialEquipment` 函数，生成一套1级装备
  - [x] SubTask 2.2: 武器和衣服：魔魂等级9级、品质精品
  - [x] SubTask 2.3: 头盔、鞋子、手镯、项链：魔魂等级0级、品质普通品

- [x] Task 3: 修改游戏初始化逻辑
  - [x] SubTask 3.1: 在 `src/App.tsx` 中导入开发者模式配置
  - [x] SubTask 3.2: 修改背包初始化逻辑，根据开发者模式决定使用 `exampleItems` 或初始装备
  - [x] SubTask 3.3: 修改玩家资源初始化逻辑，根据开发者模式决定初始金币和魔石
  - [x] SubTask 3.4: 开启时：金币 12568000000，魔石 100000000
  - [x] SubTask 3.5: 关闭时：金币 100000，魔石 280
  - [x] SubTask 3.6: 确保存档系统兼容开发者模式配置

- [x] Task 4: 修改非战斗经验获取逻辑
  - [x] SubTask 4.1: 在 `src/utils/petInstituteUtils.ts` 中修改 `PRODUCTION_TASK_EXP_REWARD`，使用经验倍率函数
  - [x] SubTask 4.2: 在 `src/data/pkMatchData.ts` 中修改 PK赛奖励经验，使用经验倍率函数
  - [x] SubTask 4.3: 在 `src/utils/dailyTaskUtils.ts` 中修改日常任务经验奖励，使用经验倍率函数

- [x] Task 5: 确保战斗和满经验球经验不受影响
  - [x] SubTask 5.1: 检查战斗经验获取逻辑，确保不使用经验倍率函数
  - [x] SubTask 5.2: 检查满经验球使用逻辑，确保不使用经验倍率函数

- [x] Task 6: 测试和验证
  - [x] SubTask 6.1: 测试开发者模式开启时的背包初始化
  - [x] SubTask 6.2: 测试开发者模式关闭时的背包初始化
  - [x] SubTask 6.3: 测试开发者模式开启时的初始金币和魔石
  - [x] SubTask 6.4: 测试开发者模式关闭时的初始金币和魔石
  - [x] SubTask 6.5: 测试开发者模式开启时的非战斗经验获取
  - [x] SubTask 6.6: 测试开发者模式关闭时的非战斗经验获取
  - [x] SubTask 6.7: 测试战斗经验不受开发者模式影响
  - [x] SubTask 6.8: 测试满经验球经验不受开发者模式影响

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1] and [Task 2]
- [Task 4] depends on [Task 1]
- [Task 5] depends on [Task 1]
- [Task 6] depends on [Task 3], [Task 4] and [Task 5]
