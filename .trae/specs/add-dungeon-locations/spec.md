# 地下城地点与怪物系统 Spec

## Why
当前游戏已有地下城任务的数据层和状态管理层（DailyTaskState中的rw_gw1_1~rw_gw3_1），但缺少实际的地下城地点定义、怪物配置和交互逻辑。玩家无法通过日常任务官进入地下城，也无法在大地图上看到地下城地点。需要在大地图中增加3个独立的地下城地点，配置各层怪物，实现从主地图通过日常任务官传送进入地下城的完整流程。

## What Changes
- 在 `gameData.ts` 的 locations 数组中新增3个地下城地点：地下城1层、地下城2层、地下城3层
- 在 `gameData.ts` 的 connections 数组中新增地下城之间的连接关系（1层↔2层↔3层）
- 在 `monsterData.ts` 中新增3种地下城怪物模板：地下城蝎怪、地下城骑士亡魂、呖风火龙兽
- 在 `monsterData.ts` 中新增6条地下城怪物刷新配置（1层3个、2层2个、3层1个）
- 在 `interactableData.ts` 中新增6个地下城怪物交互配置
- 在 `gameData.ts` 中为3个地下城地点配置 interactables 列表
- 修改 App.tsx 中 dungeon 分支，实现传送逻辑
- 地下城地点与主地图不连通（adjacentLocations不包含主地图地点），只能通过日常任务官传送进入

## Impact
- Affected specs: interaction-system（交互系统需支持地下城怪物交互）、add-monster-system（怪物系统需扩展地下城怪物）、world-map-system（大地图需显示地下城地点）
- Affected code:
  - `src/data/gameData.ts` - 新增3个地下城地点和连接关系
  - `src/data/monsterData.ts` - 新增3种地下城怪物模板和6条刷新配置
  - `src/data/interactableData.ts` - 新增6个地下城怪物交互配置
  - `src/App.tsx` - 修改dungeon分支实现传送逻辑

## ADDED Requirements

### Requirement: 地下城地点定义
系统 SHALL 在大地图中新增3个独立的地下城地点：

#### Scenario: 地下城1层地点
- **WHEN** 玩家查看大地图
- **THEN** 地图上显示"地下城1层"地点，ID为 `dixiacheng-1`
- **AND** 该地点坐标为 (7, 2)，与主地图不直接连通
- **AND** 该地点 adjacentLocations 包含 `dixiacheng-2`（可通往地下城2层）
- **AND** 该地点 interactables 包含3个地下城蝎怪交互按钮

#### Scenario: 地下城2层地点
- **WHEN** 玩家查看大地图
- **THEN** 地图上显示"地下城2层"地点，ID为 `dixiacheng-2`
- **AND** 该地点坐标为 (8, 2)，与主地图不直接连通
- **AND** 该地点 adjacentLocations 包含 `dixiacheng-1` 和 `dixiacheng-3`
- **AND** 该地点 interactables 包含2个骑士亡魂交互按钮

#### Scenario: 地下城3层地点
- **WHEN** 玩家查看大地图
- **THEN** 地图上显示"地下城3层"地点，ID为 `dixiacheng-3`
- **AND** 该地点坐标为 (9, 2)，与主地图不直接连通
- **AND** 该地点 adjacentLocations 包含 `dixiacheng-2`（可返回地下城2层）
- **AND** 该地点 interactables 包含1个呖风火龙兽交互按钮

### Requirement: 地下城与主地图隔离
系统 SHALL 确保地下城地点与主地图不直接连通：

#### Scenario: 主地图无法直接到达地下城
- **WHEN** 玩家在主地图任意地点
- **THEN** 玩家无法通过地图移动到达地下城地点
- **AND** 地下城地点的 adjacentLocations 不包含任何主地图地点ID
- **AND** 主地图地点的 adjacentLocations 不包含任何地下城地点ID

#### Scenario: 地下城之间相互连通
- **WHEN** 玩家在地下城1层
- **THEN** 玩家可以移动到地下城2层（前提：1层所有怪物已被击败）
- **WHEN** 玩家在地下城2层
- **THEN** 玩家可以移动到地下城1层或地下城3层（前往3层前提：2层所有怪物已被击败）
- **WHEN** 玩家在地下城3层
- **THEN** 玩家可以移动到地下城2层

### Requirement: 地下城怪物配置
系统 SHALL 为地下城配置3种怪物，属性参照reference/docs/project_docs/04_怪物系统.md：

#### Scenario: 地下城蝎怪
- **WHEN** 定义地下城蝎怪时
- **THEN** 怪物ID为 `dixiacheng-xieguai`
- **AND** 等级为动态（等于玩家等级），基础等级设为1
- **AND** 战斗力为200
- **AND** 类型为 `dungeon`（地下城专属怪物）
- **AND** 出现在地下城1层，共3只（rw_gw1_1, rw_gw1_2, rw_gw1_3）
- **AND** 属性参数：基础生命300、生命成长100、基础最小攻击5、最小攻击成长20、基础最大攻击15、最大攻击成长20、基础防御0、防御成长20

#### Scenario: 地下城骑士亡魂
- **WHEN** 定义地下城骑士亡魂时
- **THEN** 怪物ID为 `dixiacheng-qishiwanghun`
- **AND** 等级为150
- **AND** 战斗力为100
- **AND** 类型为 `dungeon`（地下城专属怪物）
- **AND** 出现在地下城2层，共2只（rw_gw2_1, rw_gw2_2）
- **AND** 属性参数：基础生命10000、生命成长400、基础最小攻击500、最小攻击成长20、基础最大攻击500、最大攻击成长30、基础防御500、防御成长25

#### Scenario: 呖风火龙兽
- **WHEN** 定义呖风火龙兽时
- **THEN** 怪物ID为 `lifeng-huolongshou`
- **AND** 等级为800
- **AND** 战斗力为800
- **AND** 类型为 `dungeon`（地下城专属怪物）
- **AND** 出现在地下城3层，共1只（rw_gw3_1）
- **AND** 属性参数：基础生命10000、生命成长400、基础最小攻击500、最小攻击成长20、基础最大攻击500、最大攻击成长30、基础防御500、防御成长25

### Requirement: 地下城怪物交互配置
系统 SHALL 为地下城6个怪物创建交互配置：

#### Scenario: 地下城1层怪物交互
- **WHEN** 玩家位于地下城1层
- **THEN** 显示3个地下城蝎怪交互按钮（interact-dxc1-xieguai-1/2/3）
- **AND** 怪物按钮的可见性由 rw_gw1_1/2/3 状态控制
- **AND** 击败怪物后按钮消失，次日刷新后重新出现

#### Scenario: 地下城2层怪物交互
- **WHEN** 玩家位于地下城2层
- **THEN** 显示2个骑士亡魂交互按钮（interact-dxc2-qishiwanghun-1/2）
- **AND** 怪物按钮的可见性由 rw_gw2_1/2 状态控制
- **AND** 击败怪物后按钮消失，次日刷新后重新出现

#### Scenario: 地下城3层怪物交互
- **WHEN** 玩家位于地下城3层
- **THEN** 显示1个呖风火龙兽交互按钮（interact-dxc3-huolongshou-1）
- **AND** 怪物按钮的可见性由 rw_gw3_1 状态控制
- **AND** 击败怪物后按钮消失，次日刷新后重新出现

### Requirement: 日常任务官传送进入地下城
系统 SHALL 通过日常任务官实现传送进入地下城：

#### Scenario: 周日接取地下城任务（未救出国王）
- **WHEN** 周日玩家与日常任务官交互并接取地下城任务
- **AND** 国王未被救出（king === false）
- **THEN** 玩家被传送到地下城1层（dixiacheng-1）
- **AND** rw_dxc 设为 false（标记任务已开始）

#### Scenario: 周日接取地下城任务（已救出国王）
- **WHEN** 周日玩家与日常任务官交互并接取地下城任务
- **AND** 国王已被救出（king === true）
- **THEN** 玩家被传送到地下城3层（dixiacheng-3）
- **AND** rw_dxc 设为 false

### Requirement: 地下城层间传送条件
系统 SHALL 在地下城层间移动时检查怪物清除条件：

#### Scenario: 1层前往2层（怪物未清除）
- **WHEN** 玩家在地下城1层尝试前往地下城2层
- **AND** 1层仍有怪物存活（rw_gw1_1 || rw_gw1_2 || rw_gw1_3 为 true）
- **THEN** 提示"只有消灭完怪物后才能进入下一层"
- **AND** 阻止移动

#### Scenario: 1层前往2层（怪物已清除）
- **WHEN** 玩家在地下城1层尝试前往地下城2层
- **AND** 1层所有怪物已被击败
- **THEN** 允许移动到地下城2层

#### Scenario: 2层前往3层（怪物未清除）
- **WHEN** 玩家在地下城2层尝试前往地下城3层
- **AND** 2层仍有怪物存活（rw_gw2_1 || rw_gw2_2 为 true）
- **THEN** 提示"只有消灭完怪物后才能进入下一层"
- **AND** 阻止移动

#### Scenario: 2层前往3层（怪物已清除）
- **WHEN** 玩家在地下城2层尝试前往地下城3层
- **AND** 2层所有怪物已被击败
- **THEN** 允许移动到地下城3层

### Requirement: 大地图显示地下城地点
系统 SHALL 在大地图上显示地下城地点：

#### Scenario: 地下城地点在大地图上的显示
- **WHEN** 玩家打开大地图
- **THEN** 地图上显示3个地下城地点（地下城1层、2层、3层）
- **AND** 地下城之间有连接线
- **AND** 地下城与主地图之间没有连接线
- **AND** 地下城地点使用不同的视觉样式（如暗色/特殊边框）以区分主地图地点

### Requirement: 地下城怪物类型扩展
系统 SHALL 在MonsterTemplate类型中支持dungeon类型：

#### Scenario: 地下城怪物类型
- **WHEN** 定义地下城怪物模板时
- **THEN** 怪物类型（type）可设为 `dungeon`
- **AND** dungeon类型怪物在战斗时固定为1只（不随等级增加数量）

## MODIFIED Requirements

### Requirement: 日常任务dungeon分支实现
修改 App.tsx 中的 dungeon 分支，从占位代码改为实际传送逻辑：

- 原代码：`setInteractionLog(prev => [...prev, '地下城任务暂未开放，敬请期待！']);`
- 修改为：根据国王是否已救出，传送到对应地下城层

## REMOVED Requirements
无
