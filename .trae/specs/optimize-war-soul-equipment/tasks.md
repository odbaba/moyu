# Tasks

## 任务1: 修改战魂套装效果函数为怪物压制函数
- [x] Task 1.1: 在 `src/utils/combatPower.ts` 中修改天魂套装函数
  - [x] 将 `calculateTianHunSetBonus` 重命名为 `calculateTianHunSetSuppression`
  - [x] 修改返回值为怪物战斗力压制百分比（套装等级 × 0.02，最高0.10）
  - [x] 更新函数注释说明这是对怪物的压制效果

- [x] Task 1.2: 在 `src/utils/combatPower.ts` 中修改地魂套装函数
  - [x] 将 `calculateDiHunSetBonus` 重命名为 `calculateDiHunSetSuppression`
  - [x] 修改返回值为怪物生命值压制百分比（套装等级 × 0.05，最高0.25）
  - [x] 更新函数注释说明这是对怪物的压制效果

- [x] Task 1.3: 删除 `calculateWarSoulPKCombatPower` 函数
  - [x] 删除函数定义
  - [x] 检查并清理所有引用

## 任务2: 修改敌人创建时应用战魂套装压制
- [x] Task 2.1: 修改 `createEnemyFromEnemyData` 函数
  - [x] 增加 `warSoulSetInfo` 可选参数（类型为 WarSoulSetInfo）
  - [x] 天魂套装激活时：怪物战斗力 = Math.round(原始战斗力 × (1 - 套装等级 × 0.02))
  - [x] 地魂套装激活时：怪物maxHp和currentHp = Math.round(原始maxHp × (1 - 套装等级 × 0.05))
  - [x] 记录原始属性值用于详情显示

- [x] Task 2.2: 修改 `createEnemyFromTemplate` 函数
  - [x] 增加 `warSoulSetInfo` 可选参数
  - [x] 同上应用战魂套装压制效果

- [x] Task 2.3: 修改 `Battle.tsx` 中敌人创建流程
  - [x] 在 `initializeBattleState` 中调用 `checkWarSoulSet` 获取套装信息
  - [x] 将套装信息传递给 `createEnemyFromEnemyData` 和 `createEnemyFromTemplate`
  - [x] 天魂套装激活时添加战斗日志提示
  - [x] 地魂套装激活时添加战斗日志提示

## 任务3: 修改怪物详情弹窗显示战魂套装压制信息
- [x] Task 3.1: 修改 `EnemyDetailModal.tsx` 组件
  - [x] 增加 `warSoulSetInfo` 可选 prop
  - [x] 天魂套装激活时：战斗力行显示压制后值和减少百分比
  - [x] 地魂套装激活时：生命值行显示压制后值和减少百分比
  - [x] 新增战魂套装压制提示区域

- [x] Task 3.2: 修改 `Battle.tsx` 中传递战魂套装信息到详情弹窗
  - [x] 在 Battle 组件中存储战魂套装信息
  - [x] 传递给 EnemyDetailModal 组件

## 任务4: 更新 BattleCharacter 类型支持战魂压制信息
- [x] Task 4.1: 在 `src/types/index.ts` 中扩展 BattleCharacter 类型
  - [x] 增加 `originalCombatPower?` 可选字段（压制前原始战斗力）
  - [x] 增加 `originalMaxHp?` 可选字段（压制前原始最大生命值）
  - [x] 增加 `warSoulSuppression?` 可选字段（战魂压制信息）

## 任务5: 更新文档
- [x] Task 5.1: 更新 `src/utils/equipmentRefine.md` 文档
  - [x] 修正战魂套装效果说明（从角色加成改为怪物压制）
  - [x] 添加天魂套装怪物战斗力压制说明
  - [x] 添加地魂套装怪物生命值压制说明

# Task Dependencies
- [Task 2] depends on [Task 1] and [Task 4]（敌人创建依赖压制函数和类型定义）
- [Task 3] depends on [Task 4]（详情弹窗依赖类型定义）
- [Task 5] depends on all tasks（文档更新依赖所有实现）
