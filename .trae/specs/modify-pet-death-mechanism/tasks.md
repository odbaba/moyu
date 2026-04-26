# Tasks

- [x] Task 1: 扩展类型定义，添加幸运值属性
  - [x] SubTask 1.1: 在 `src/types/index.ts` 的 Pet 接口中添加 `luck: number` 属性
  - [x] SubTask 1.2: 在 `src/types/index.ts` 的 BattlePet 接口中添加 `luck: number` 属性
  - [x] SubTask 1.3: 添加注释说明幸运值的用途和范围（0-100）

- [x] Task 2: 修改幻兽生成逻辑，初始化幸运值
  - [x] SubTask 2.1: 在 `src/utils/petGenerator.ts` 中修改幻兽生成函数
  - [x] SubTask 2.2: 为新生成的幻兽设置初始幸运值为100
  - [x] SubTask 2.3: 添加注释说明幸运值初始化逻辑

- [x] Task 3: 修改战斗适配器，转换幸运值数据
  - [x] SubTask 3.1: 在 `src/utils/battleAdapter.ts` 的 `petToBattlePet` 函数中添加幸运值转换
  - [x] SubTask 3.2: 确保BattlePet包含正确的幸运值数据
  - [x] SubTask 3.3: 添加注释说明幸运值转换逻辑

- [x] Task 4: 修改战斗逻辑，实现幻兽保留1血机制
  - [x] SubTask 4.1: 在 `src/components/battle/Battle.tsx` 中修改幻兽受到致命伤害的处理逻辑
  - [x] SubTask 4.2: 实现幻兽血量保留为1的逻辑（当伤害值 >= 当前血量时）
  - [x] SubTask 4.3: 实现幻兽幸运值降低10的逻辑
  - [x] SubTask 4.4: 添加战斗日志记录幸运值降低信息
  - [x] SubTask 4.5: 添加注释说明幻兽保留1血机制

- [x] Task 5: 实现幻兽幸运值为0时退出战斗
  - [x] SubTask 5.1: 在幻兽幸运值降低后检查是否为0
  - [x] SubTask 5.2: 实现幻兽幸运值为0时自动解除合体状态的逻辑
  - [x] SubTask 5.3: 实现幻兽退出战斗的逻辑（从deployedPets中移除）
  - [x] SubTask 5.4: 添加战斗日志记录幻兽因幸运值耗尽而退出战斗
  - [x] SubTask 5.5: 添加注释说明幻兽退出战斗的逻辑

- [x] Task 6: 在战斗界面显示幻兽幸运值
  - [x] SubTask 6.1: 在 `src/components/battle/CharacterCard.tsx` 中添加幸运值显示
  - [x] SubTask 6.2: 当幻兽幸运值较低（≤30）时显示特殊警告标识
  - [x] SubTask 6.3: 添加注释说明幸运值显示逻辑

- [x] Task 7: 更新文档
  - [x] SubTask 7.1: 更新 `src/components/battle/README.md` 添加幻兽幸运值机制说明
  - [x] SubTask 7.2: 更新 `src/components/pet/README.md` 添加幸运值属性说明
  - [x] SubTask 7.3: 添加注释说明幻兽幸运值在战斗中的作用

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 3]
- [Task 5] depends on [Task 4]
- [Task 6] depends on [Task 1]
- [Task 7] depends on [Task 5] and [Task 6]
