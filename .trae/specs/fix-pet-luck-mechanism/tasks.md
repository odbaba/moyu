# Tasks

- [ ] Task 1: 删除幻兽幸运值属性
  - [ ] SubTask 1.1: 在 `src/types/index.ts` 中删除 Pet 接口的 `luck` 属性
  - [ ] SubTask 1.2: 在 `src/types/index.ts` 中删除 BattlePet 接口的 `luck` 属性
  - [ ] SubTask 1.3: 删除相关注释

- [ ] Task 2: 删除幻兽幸运值初始化逻辑
  - [ ] SubTask 2.1: 在 `src/utils/petGenerator.ts` 中删除幻兽幸运值初始化代码
  - [ ] SubTask 2.2: 删除相关注释

- [ ] Task 3: 删除战斗适配器中的幸运值转换
  - [ ] SubTask 3.1: 在 `src/utils/battleAdapter.ts` 中删除幸运值转换代码
  - [ ] SubTask 3.2: 删除相关注释

- [ ] Task 4: 删除幻兽幸运值显示
  - [ ] SubTask 4.1: 在 `src/components/battle/CharacterCard.tsx` 中删除幻兽幸运值显示代码
  - [ ] SubTask 4.2: 在 `src/components/battle/battle.css` 中删除幻兽幸运值样式
  - [ ] SubTask 4.3: 删除相关注释

- [ ] Task 5: 修改幻兽阵亡逻辑，集成人物幸运值和爱的力量技能
  - [ ] SubTask 5.1: 在 `src/components/battle/Battle.tsx` 中删除幻兽保留1血机制
  - [ ] SubTask 5.2: 恢复原有的幻兽阵亡逻辑（血量降为0时阵亡）
  - [ ] SubTask 5.3: 在幻兽阵亡时降低人物幸运值10点
  - [ ] SubTask 5.4: 添加战斗日志记录人物幸运值降低
  - [ ] SubTask 5.5: 集成"爱的力量"技能检查（使用 `checkLovePower` 函数）
  - [ ] SubTask 5.6: 如果触发爱的力量，人物幸运值+10，幻兽满血复活
  - [ ] SubTask 5.7: 添加战斗日志记录爱的力量触发
  - [ ] SubTask 5.8: 添加注释说明新的幻兽阵亡逻辑

- [ ] Task 6: 更新文档
  - [ ] SubTask 6.1: 更新 `src/components/battle/README.md` 删除幻兽幸运值机制说明，添加人物幸运值机制说明
  - [ ] SubTask 6.2: 更新 `src/components/pet/README.md` 删除幻兽幸运值属性说明
  - [ ] SubTask 6.3: 添加注释说明幻兽阵亡时的人物幸运值机制

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 1]
- [Task 5] depends on [Task 1]
- [Task 6] depends on [Task 5]
