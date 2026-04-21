# Tasks

- [x] Task 1: 扩展MonsterTemplate类型，支持dungeon怪物类型
  - [x] SubTask 1.1: 在 `src/types/index.ts` 中，将 MonsterTemplate 的 type 字段联合类型增加 `'dungeon'`
  - [x] SubTask 1.2: 确认怪物数量规则中 dungeon 类型固定为1只

- [x] Task 2: 新增3种地下城怪物模板到 `src/data/monsterData.ts`
  - [x] SubTask 2.1: 新增地下城蝎怪模板（id: `dixiacheng-xieguai`，等级动态=玩家等级，战斗力200，type: dungeon）
  - [x] SubTask 2.2: 新增地下城骑士亡魂模板（id: `dixiacheng-qishiwanghun`，等级150，战斗力100，type: dungeon）
  - [x] SubTask 2.3: 新增呖风火龙兽模板（id: `lifeng-huolongshou`，等级800，战斗力800，type: dungeon）

- [x] Task 3: 新增6条地下城怪物刷新配置到 `src/data/monsterData.ts`
  - [x] SubTask 3.1: 地下城1层3个蝎怪刷新配置（spawnVariable: rw_gw1_1/2/3）
  - [x] SubTask 3.2: 地下城2层2个骑士亡魂刷新配置（spawnVariable: rw_gw2_1/2）
  - [x] SubTask 3.3: 地下城3层1个呖风火龙兽刷新配置（spawnVariable: rw_gw3_1）

- [x] Task 4: 新增6个地下城怪物交互配置到 `src/data/interactableData.ts`
  - [x] SubTask 4.1: 地下城1层3个蝎怪交互（interact-dxc1-xieguai-1/2/3）
  - [x] SubTask 4.2: 地下城2层2个骑士亡魂交互（interact-dxc2-qishiwanghun-1/2）
  - [x] SubTask 4.3: 地下城3层1个呖风火龙兽交互（interact-dxc3-huolongshou-1）

- [x] Task 5: 在 `src/data/gameData.ts` 中新增3个地下城地点和连接关系
  - [x] SubTask 5.1: 新增地下城1层地点（id: `dixiacheng-1`，坐标(7,2)，adjacentLocations: ['dixiacheng-2']，interactables: 3个蝎怪交互ID）
  - [x] SubTask 5.2: 新增地下城2层地点（id: `dixiacheng-2`，坐标(8,2)，adjacentLocations: ['dixiacheng-1', 'dixiacheng-3']，interactables: 2个骑士亡魂交互ID）
  - [x] SubTask 5.3: 新增地下城3层地点（id: `dixiacheng-3`，坐标(9,2)，adjacentLocations: ['dixiacheng-2']，interactables: 1个呖风火龙兽交互ID）
  - [x] SubTask 5.4: 新增地下城之间的连接关系（dixiacheng-1↔dixiacheng-2↔dixiacheng-3）

- [x] Task 6: 修改 `src/App.tsx` 中 dungeon 分支，实现传送逻辑
  - [x] SubTask 6.1: 将占位代码替换为实际传送逻辑
  - [x] SubTask 6.2: 根据国王是否已救出（king状态），传送至地下城1层或3层
  - [x] SubTask 6.3: 设置 rw_dxc 为 false 标记任务已开始

- [x] Task 7: 实现地下城层间移动条件检查
  - [x] SubTask 7.1: 在移动逻辑中，当地点为地下城时，检查当前层怪物是否全部清除
  - [x] SubTask 7.2: 未清除时提示"只有消灭完怪物后才能进入下一层"并阻止移动

- [x] Task 8: 修改大地图组件，区分地下城地点的视觉样式
  - [x] SubTask 8.1: 在 WorldMap.tsx 中为地下城地点使用不同的视觉样式（暗色/特殊边框）

# Task Dependencies
- [Task 2] depends on [Task 1] （怪物模板需要dungeon类型先定义）
- [Task 3] depends on [Task 2] （刷新配置引用怪物模板ID）
- [Task 4] depends on [Task 2] （交互配置引用怪物模板ID）
- [Task 5] depends on [Task 4] （地点的interactables引用交互配置ID）
- [Task 6] depends on [Task 5] （传送逻辑需要地下城地点已定义）
- [Task 7] depends on [Task 5] （移动条件检查需要地下城地点已定义）
- [Task 8] depends on [Task 5] （大地图显示需要地下城地点已定义）
- [Task 4] 和 [Task 3] 可并行
