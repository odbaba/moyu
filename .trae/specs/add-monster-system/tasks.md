# Tasks

- [x] Task 1: 定义怪物相关类型
  - [x] SubTask 1.1: 在 `src/types/index.ts` 中新增 MonsterTemplate 接口（怪物模板，包含基础属性和成长属性）
  - [x] SubTask 1.2: 在 `src/types/index.ts` 中新增 Monster 接口（怪物实例，包含计算后的属性）
  - [x] SubTask 1.3: 在 `src/types/index.ts` 中新增 MonsterSpawnConfig 接口（怪物刷新配置）
  - [x] SubTask 1.4: 在 `src/types/index.ts` 中新增 MonsterType 枚举（普通怪物、BOSS、特殊怪物）

- [x] Task 2: 创建怪物数据配置文件
  - [x] SubTask 2.1: 创建 `src/data/monsterData.ts` 文件
  - [x] SubTask 2.2: 定义雷鸣大陆怪物模板（龙怪、巨杰士）
  - [x] SubTask 2.3: 定义戈壁怪物模板（冰妖剑士、杰克灯笼、提风）
  - [x] SubTask 2.4: 定义迷梦沼泽怪物模板（角蜥、望齿魔人、蜘蛛）
  - [x] SubTask 2.5: 定义冰宫怪物模板（塔亚龙、死亡骑士）
  - [x] SubTask 2.6: 定义亚维特岛怪物模板（鱼妖、恐兽、巨斧怪、蜘蛛王后艾达）
  - [x] SubTask 2.7: 定义火山怪物模板（蝎怪、四牙怪、炎女）
  - [x] SubTask 2.8: 定义深渊迷宫怪物模板（暗黑格拉斯、叹息骑士、暗黑弥塞亚、骑士亡魂）
  - [x] SubTask 2.9: 定义各地图怪物刷新配置（数量和位置）

- [x] Task 3: 创建怪物工具函数
  - [x] SubTask 3.1: 创建 `src/utils/monsterUtils.ts` 文件
  - [x] SubTask 3.2: 实现 `calculateMonsterStats` 函数（根据等级计算怪物属性）
  - [x] SubTask 3.3: 实现 `getEnemyCount` 函数（根据怪物等级计算战斗时敌方数量）
  - [x] SubTask 3.4: 实现 `isSpecialMonster` 函数（判断是否为特殊怪物）
  - [x] SubTask 3.5: 实现 `generateMonsterInstance` 函数（从模板生成怪物实例）
  - [x] SubTask 3.6: 实现 `getMonstersByLocation` 函数（获取指定地图的怪物列表）

- [x] Task 4: 扩展交互数据配置
  - [x] SubTask 4.1: 在 `src/data/interactableData.ts` 中导入怪物数据
  - [x] SubTask 4.2: 为雷鸣大陆创建1个怪物交互按钮
  - [x] SubTask 4.3: 为戈壁创建5个怪物交互按钮
  - [x] SubTask 4.4: 为迷梦沼泽创建4个怪物交互按钮
  - [x] SubTask 4.5: 为冰宫创建4个怪物交互按钮
  - [x] SubTask 4.6: 为亚维特岛创建4个怪物交互按钮
  - [x] SubTask 4.7: 为火山创建5个怪物交互按钮
  - [x] SubTask 4.8: 为深渊迷宫创建6个怪物交互按钮

- [x] Task 5: 更新地图数据配置
  - [x] SubTask 5.1: 更新 `src/data/gameData.ts` 中雷鸣大陆的 interactables 列表
  - [x] SubTask 5.2: 更新 `src/data/gameData.ts` 中戈壁的 interactables 列表
  - [x] SubTask 5.3: 更新 `src/data/gameData.ts` 中迷梦沼泽的 interactables 列表
  - [x] SubTask 5.4: 更新 `src/data/gameData.ts` 中冰宫的 interactables 列表
  - [x] SubTask 5.5: 更新 `src/data/gameData.ts` 中亚维特岛的 interactables 列表
  - [x] SubTask 5.6: 更新 `src/data/gameData.ts` 中火山的 interactables 列表
  - [x] SubTask 5.7: 更新 `src/data/gameData.ts` 中深渊迷宫的 interactables 列表

- [x] Task 6: 集成战斗系统
  - [x] SubTask 6.1: 扩展 EnemyData 类型，支持怪物模板引用
  - [x] SubTask 6.2: 更新战斗初始化逻辑，支持根据怪物等级生成敌方数量
  - [x] SubTask 6.3: 确保战斗系统能正确处理怪物生成的敌人

# Task Dependencies
- [Task 2] depends on [Task 1]（怪物数据配置依赖类型定义）
- [Task 3] depends on [Task 1]（工具函数依赖类型定义）
- [Task 4] depends on [Task 2, Task 3]（交互配置依赖怪物数据和工具函数）
- [Task 5] depends on [Task 4]（地图数据更新依赖交互配置）
- [Task 6] depends on [Task 3]（战斗集成依赖工具函数）
