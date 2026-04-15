# Tasks

- [x] Task 1: 扩展类型定义
  - [x] SubTask 1.1: 在 `src/types/index.ts` 中添加 BattlePet 接口定义
  - [x] SubTask 1.2: 在 BattleState 接口中添加 deployedPets 字段
  - [x] SubTask 1.3: 添加注释说明每个字段的用途

- [x] Task 2: 创建幻兽战斗数据转换工具
  - [x] SubTask 2.1: 在 `src/utils/battleAdapter.ts` 中添加 petToBattlePet 函数
  - [x] SubTask 2.2: 实现幻兽属性到战斗属性的转换逻辑
  - [x] SubTask 2.3: 添加注释说明转换规则

- [x] Task 3: 修改战斗初始化逻辑
  - [x] SubTask 3.1: 在 Battle.tsx 的 initializeBattleState 函数中添加幻兽处理逻辑
  - [x] SubTask 3.2: 将出战幻兽数据转换为战斗数据
  - [x] SubTask 3.3: 将幻兽放置在九宫格的左下角和右下角位置
  - [x] SubTask 3.4: 添加注释说明幻兽位置分配逻辑

- [x] Task 4: 实现合体幻兽视觉标识
  - [x] SubTask 4.1: 在 CharacterCard.tsx 中添加合体状态判断逻辑
  - [x] SubTask 4.2: 为合体幻兽添加"合体"标签显示
  - [x] SubTask 4.3: 在 battle.css 中添加合体幻兽特殊样式
  - [x] SubTask 4.4: 添加注释说明合体状态显示逻辑

- [x] Task 5: 实现敌方优先攻击合体幻兽逻辑
  - [x] SubTask 5.1: 在 Battle.tsx 中添加获取攻击目标的函数
  - [x] SubTask 5.2: 实现优先攻击合体幻兽的逻辑（第一出战位优先）
  - [x] SubTask 5.3: 实现第一合体幻兽阵亡后攻击第二合体幻兽的逻辑
  - [x] SubTask 5.4: 实现无合体幻兽时攻击玩家的逻辑
  - [x] SubTask 5.5: 添加注释说明攻击优先级逻辑

- [x] Task 6: 实现幻兽阵亡处理
  - [x] SubTask 6.1: 在战斗伤害处理函数中添加幻兽血量扣除逻辑
  - [x] SubTask 6.2: 实现幻兽阵亡后从九宫格移除的逻辑
  - [x] SubTask 6.3: 添加幻兽阵亡的战斗日志
  - [x] SubTask 6.4: 添加注释说明幻兽阵亡处理逻辑

- [x] Task 7: 实现战斗结束幻兽状态同步
  - [x] SubTask 7.1: 在战斗结束回调中添加幻兽状态同步逻辑
  - [x] SubTask 7.2: 将幻兽战斗后的血量同步回幻兽数据
  - [x] SubTask 7.3: 添加注释说明状态同步逻辑

- [x] Task 8: 更新文档
  - [x] SubTask 8.1: 更新 battle/README.md 添加幻兽集成说明
  - [x] SubTask 8.2: 更新 pet/README.md 添加战斗集成说明
  - [x] SubTask 8.3: 添加注释说明幻兽在战斗中的作用

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 3]
- [Task 5] depends on [Task 3]
- [Task 6] depends on [Task 5]
- [Task 7] depends on [Task 6]
- [Task 8] depends on [Task 7]
