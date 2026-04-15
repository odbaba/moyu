# Tasks

## 任务1: 更新收藏家NPC配置
- [x] Task 1.1: 在 src/data/npcData.ts 中更新收藏家NPC配置
  - [x] 更新 location 字段为 'kasanuocheng'
  - [x] 更新 description 字段为完整的对话内容
  - [x] 更新交互选项为"我有些好东西要卖"和"我没什么想卖的"
  - [x] 配置 actionType 为 'openCollector'

- [x] Task 1.2: 在 src/data/gameData.ts 中更新地图交互列表
  - [x] 从雷鸣大陆的 interactables 列表移除 'npc_collector'
  - [x] 在卡萨诺城的 interactables 列表添加 'npc_collector'

- [x] Task 1.3: 在 npcData.ts 中更新映射表
  - [x] 从 npcByLocation['leiming-dalu'] 移除 'npc_collector'
  - [x] 在 npcByLocation['kasanuocheng'] 添加 'npc_collector'

## 任务2: 创建物品价值计算工具
- [x] Task 2.1: 创建 src/utils/itemValueCalculator.ts 文件
  - [x] 实现 calculateItemMagicStoneValue() 函数
  - [x] 实现珍稀材料价值计算逻辑
  - [x] 实现特殊道具价值计算逻辑
  - [x] 实现极品装备价值计算逻辑
  - [x] 实现 calculateTotalValue() 函数

## 任务3: 创建收藏架交易界面组件
- [x] Task 3.1: 创建 src/components/common/CollectorModal.tsx 组件
  - [x] 设计界面布局（4×3网格、总价值显示、出售按钮）
  - [x] 实现物品拖拽接收功能
  - [x] 实现物品从收藏架移除功能
  - [x] 实现总价值计算和显示
  - [x] 实现出售功能

- [x] Task 3.2: 创建 src/components/common/CollectorModal.css 样式文件
  - [x] 设计收藏架界面样式
  - [x] 设计物品格子样式
  - [x] 设计总价值显示样式
  - [x] 设计按钮样式

- [x] Task 3.3: 在 src/App.tsx 中集成收藏架界面
  - [x] 添加收藏架界面状态管理
  - [x] 处理 'openCollector' actionType
  - [x] 实现打开/关闭收藏架界面的逻辑

- [x] 同时打开背包界面

## 任务4: 更新物品数据
- [x] Task 4.1: 在 src/data/inventoryData.ts 中确保物品有魔石价值字段
  - [x] 确认金矿有 magicStoneValue 字段
  - [x] 确认灵魂王有 magicStoneValue 字段
  - [x] 确认月光宝盒有 magicStoneValue 字段
  - [x] 确认电浆药水有 magicStoneValue 字段
  - [x] 确认999朵白玫瑰有 magicStoneValue 字段
  - [x] 确认满经验球有 magicStoneValue 字段

## 任务5: 测试和验证
- [x] Task 5.1: 功能测试
  - [x] 测试收藏家NPC出现在卡萨诺城
  - [x] 测试收藏家对话内容正确显示
  - [x] 测试收藏架界面打开和关闭
  - [x] 测试物品拖拽到收藏架
  - [x] 测试物品从收藏架移除
  - [x] 测试总价值计算
  - [x] 测试出售功能

- [x] Task 5.2: 边界情况测试
  - [x] 测试无魔石价值物品无法放入收藏架
  - [x] 测试收藏架已满时的处理
  - [x] 测试空收藏架出售
  - [x] 测试非极品装备无法出售

- [x] 测试TypeScript编译无错误
- [x] 测试项目可以正常运行

# Task Dependencies
- Task 2 依赖 Task 4（物品数据）
- Task 3 依赖 Task 2（价值计算）
- Task 5 依赖所有前置任务
