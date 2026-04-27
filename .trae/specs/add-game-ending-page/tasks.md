# Tasks

- [x] Task 1: 创建评价计算工具函数 `src/utils/gameEndingUtils.ts`
  - [x] SubTask 1.1: 实现8个维度的评价函数（战斗力、等级、装备、幻兽、军衔、爵位、公主关系、财富）
  - [x] SubTask 1.2: 实现综合评语生成函数
  - [x] SubTask 1.3: 实现装备战斗力计算（品质+洞数+宝石+魔魂+战魂）
  - [x] SubTask 1.4: 实现幻兽战斗力计算（复用 calculateAllPetsCombatPower）
  - [x] SubTask 1.5: 导出统一的结算数据接口 `GameEndingResult`

- [x] Task 2: 创建结算页面组件 `src/components/game-ending/GameEndingPage.tsx`
  - [x] SubTask 2.1: 创建 game-ending 文件夹及组件文件
  - [x] SubTask 2.2: 实现结算页面UI（标题、8维度展示、综合评语、操作按钮）
  - [x] SubTask 2.3: 实现样式文件 `game-ending.css`，手机一屏展示
  - [x] SubTask 2.4: 导出组件

- [x] Task 3: 修改存档系统 `src/utils/saveUtils.ts`
  - [x] SubTask 3.1: SaveData 接口新增 `isWin` 和 `maxCombatPower` 字段
  - [x] SubTask 3.2: 兼容旧存档（默认 `isWin: false`, `maxCombatPower: 0`）

- [x] Task 4: 修改 `src/App.tsx` 集成结算系统
  - [x] SubTask 4.1: 新增 `showGameEnding`、`isWin`、`maxCombatPower` 状态
  - [x] SubTask 4.2: 修改 `consumeTime`，当 `nowday > 60` 时触发结算（`isWin = false`）
  - [x] SubTask 4.3: 修改地下城3层通关逻辑：先显示"救出国王"弹窗，弹窗确定回调中设置 `isWin = true` 并触发结算
  - [x] SubTask 4.4: 实现 `maxCombatPower` 持续更新逻辑
  - [x] SubTask 4.5: 保存/加载存档时处理 `isWin` 和 `maxCombatPower`
  - [x] SubTask 4.6: "再玩一次"和"读取存档"按钮都执行 `window.location.reload()`
  - [x] SubTask 4.7: 在渲染逻辑中加入结算页面（showGameEnding 时显示）

# Task Dependencies
- [Task 2] depends on [Task 1]（页面组件需要评价计算函数）
- [Task 4] depends on [Task 1, Task 2, Task 3]（App集成需要所有前置完成）
- [Task 3] 无依赖，可并行
