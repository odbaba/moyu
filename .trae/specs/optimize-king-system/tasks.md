# Tasks

- [x] Task 1: 更新存档系统支持国王状态
  - [x] SubTask 1.1: 在 `SaveData` 接口中添加 `isKingRescued` 字段
  - [x] SubTask 1.2: 在 `saveGame` 和 `loadGame` 函数中处理国王状态
  - [x] SubTask 1.3: 在 `App.tsx` 中添加国王状态的存档保存和加载逻辑

- [x] Task 2: 实现国王NPC可见性控制
  - [x] SubTask 2.1: 在 `npcData.ts` 中为国王NPC添加可见性条件配置
  - [x] SubTask 2.2: 在 `App.tsx` 中实现国王NPC的条件显示逻辑
  - [x] SubTask 2.3: 在 `InteractionButtons.tsx` 中根据国王状态过滤NPC显示

- [x] Task 3: 实现首相NPC对话变化
  - [x] SubTask 3.1: 在 `npcData.ts` 中更新首相NPC的"关于国王的消息"选项
  - [x] SubTask 3.2: 在 `App.tsx` 中实现首相NPC对话的条件显示逻辑

- [x] Task 4: 实现雪域边境入口限制
  - [x] SubTask 4.1: 在 `App.tsx` 的 `handleMove` 函数中添加雪域边境入口限制逻辑
  - [x] SubTask 4.2: 添加周五判断逻辑（`nowday % 7 === 5`）

- [x] Task 5: 实现冰雪巨人可见性控制
  - [x] SubTask 5.1: 在 `monsterData.ts` 中为冰雪巨人添加国王状态条件
  - [x] SubTask 5.2: 在 `InteractionButtons.tsx` 中根据国王状态过滤怪物显示

- [x] Task 6: 新增魔中军阵地地点
  - [x] SubTask 6.1: 在 `gameData.ts` 中添加魔中军阵地地点配置
  - [x] SubTask 6.2: 更新雪域边境的相邻地点列表，添加魔中军阵地
  - [x] SubTask 6.3: 在 `connections` 中添加雪域边境与魔中军阵地的连接

- [x] Task 7: 新增魔中军阵地怪物
  - [x] SubTask 7.1: 在 `monsterData.ts` 中添加魔族大军怪物模板
  - [x] SubTask 7.2: 在 `monsterData.ts` 中添加魔族大军怪物刷新配置
  - [x] SubTask 7.3: 在 `interactableData.ts` 中添加魔族大军交互对象（自动生成）

- [x] Task 8: 实现魔中军阵地入口可见性控制
  - [x] SubTask 8.1: 在 `App.tsx` 中实现魔中军阵地入口的条件显示逻辑
  - [x] SubTask 8.2: 在 `InteractionButtons.tsx` 中根据国王状态过滤地点显示

- [x] Task 9: 实现魔军每日复活提示
  - [x] SubTask 9.1: 在 `App.tsx` 的新的一天逻辑中添加魔军复活提示
  - [x] SubTask 9.2: 仅在国王救出后显示复活提示

# Task Dependencies
- [Task 2] depends on [Task 1] - 国王NPC可见性需要存档系统支持
- [Task 3] depends on [Task 1] - 首相NPC对话需要存档系统支持
- [Task 4] depends on [Task 1] - 雪域边境入口限制需要存档系统支持
- [Task 5] depends on [Task 1] - 冰雪巨人可见性需要存档系统支持
- [Task 7] depends on [Task 6] - 怪物配置需要地点配置
- [Task 8] depends on [Task 1], [Task 6] - 入口可见性需要存档系统和地点配置
- [Task 9] depends on [Task 1] - 魔军复活提示需要存档系统支持
