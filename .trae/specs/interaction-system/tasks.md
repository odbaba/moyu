# Tasks

- [x] Task 1: 定义交互类型接口和数据结构
  - [x] SubTask 1.1: 在types/index.ts中定义InteractableType枚举（action, enemy, npc）
  - [x] SubTask 1.2: 定义ActionInteractable接口（id, name, icon, actionType, actionParams）
  - [x] SubTask 1.3: 定义EnemyData接口（id, name, hp, attack, defense, description）
  - [x] SubTask 1.4: 定义EnemyInteractable接口（id, name, icon, description, enemies）
  - [x] SubTask 1.5: 定义NPCInteractable接口（id, name, icon, description, options）
  - [x] SubTask 1.6: 定义Interactable联合类型

- [x] Task 2: 创建交互配置数据文件
  - [x] SubTask 2.1: 创建src/data/interactableData.ts文件
  - [x] SubTask 2.2: 定义挖矿动作交互配置
  - [x] SubTask 2.3: 定义巡逻小兵敌人交互配置
  - [x] SubTask 2.4: 定义示例NPC交互配置
  - [x] SubTask 2.5: 导出交互配置映射表

- [x] Task 3: 实现敌人模态窗口组件
  - [x] SubTask 3.1: 创建src/components/common/EnemyModal.tsx组件
  - [x] SubTask 3.2: 实现敌人描述文本展示区域
  - [x] SubTask 3.3: 实现战斗力数据展示区域（HP、攻击、防御）
  - [x] SubTask 3.4: 实现"攻击"按钮，点击触发战斗
  - [x] SubTask 3.5: 实现"离开"按钮，点击关闭弹窗

- [x] Task 4: 重构NPC模态窗口组件
  - [x] SubTask 4.1: 创建NPCModal.tsx组件
  - [x] SubTask 4.2: 调整组件接口适配NPCInteractable类型
  - [x] SubTask 4.3: 实现垂直列表形式的交互选项展示

- [x] Task 5: 重构交互按钮组件
  - [x] SubTask 5.1: 修改InteractionButtons.tsx支持Interactable类型数组
  - [x] SubTask 5.2: 根据交互类型渲染不同按钮样式（图标、颜色区分）
  - [x] SubTask 5.3: 点击事件根据类型分发到不同处理函数

- [x] Task 6: 更新App.tsx交互处理逻辑
  - [x] SubTask 6.1: 导入新的交互类型和配置数据
  - [x] SubTask 6.2: 实现handleActionInteract处理动作交互
  - [x] SubTask 6.3: 实现handleEnemyInteract处理敌人交互
  - [x] SubTask 6.4: 实现handleNPCInteract处理NPC交互
  - [x] SubTask 6.5: 移除SoldierModal相关代码

- [x] Task 7: 更新gameData.ts位置数据
  - [x] SubTask 7.1: 修改Location接口的interactables字段类型
  - [x] SubTask 7.2: 更新雷鸣矿洞的交互配置引用
  - [x] SubTask 7.3: 为其他位置预留交互配置接口

- [x] Task 8: 编写组件使用文档
  - [x] SubTask 8.1: 创建src/components/common/README.md文档
  - [x] SubTask 8.2: 编写三种按钮类型的配置参数说明
  - [x] SubTask 8.3: 编写事件接口说明
  - [x] SubTask 8.4: 编写使用示例代码

- [x] Task 9: 创建配置模板和示例文件
  - [x] SubTask 9.1: 创建src/data/templates/interactionTemplates.ts
  - [x] SubTask 9.2: 编写新增敌人的配置模板
  - [x] SubTask 9.3: 编写新增NPC的配置模板
  - [x] SubTask 9.4: 编写新增动作的配置模板
  - [x] SubTask 9.5: 创建示例配置文件展示完整用法

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 1]
- [Task 5] depends on [Task 1, Task 2]
- [Task 6] depends on [Task 3, Task 4, Task 5]
- [Task 7] depends on [Task 1]
- [Task 8] depends on [Task 6]
- [Task 9] depends on [Task 1]
