# Tasks

- [x] Task 1: 创建幻兽幻化工具函数
  - [x] SubTask 1.1: 创建 src/utils/petFusion.ts 文件
  - [x] SubTask 1.2: 实现评分要求计算函数 calculateScoreRequirement
  - [x] SubTask 1.3: 实现幻化系数计算函数 calculateFusionRatio
  - [x] SubTask 1.4: 实现主属性幻化函数 applyMainAttributeFusion
  - [x] SubTask 1.5: 实现副属性幻化函数 applySubAttributeFusion
  - [x] SubTask 1.6: 实现初始属性幻化函数 applyInitialAttributeFusion
  - [x] SubTask 1.7: 实现幻化主函数 executeFusion
  - [x] SubTask 1.8: 实现幻化条件检查函数 checkFusionConditions
  - [x] SubTask 1.9: 添加详细注释说明每个函数的作用和参数

- [x] Task 2: 添加幻兽幻化师NPC配置
  - [x] SubTask 2.1: 在 src/data/npcData.ts 中添加 npc_pet_fusion_master 配置
  - [x] SubTask 2.2: 将 NPC 添加到 npcConfig 映射表
  - [x] SubTask 2.3: 将 NPC 添加到 npcByLocation['kasanuocheng'] 数组
  - [x] SubTask 2.4: 将 NPC 添加到 npcByType['function'] 数组
  - [x] SubTask 2.5: 添加 NPC 交互选项（进行幻化、关于幻化、离开）

- [x] Task 3: 创建幻兽选择弹窗组件
  - [x] SubTask 3.1: 创建 src/components/pet/PetSelectModal.tsx 文件
  - [x] SubTask 3.2: 实现幻兽列表展示功能
  - [x] SubTask 3.3: 实现幻兽过滤功能（排除已出战幻兽）
  - [x] SubTask 3.4: 实现幻兽选择回调功能
  - [x] SubTask 3.5: 添加样式文件 src/components/pet/pet.css 中对应的样式

- [x] Task 4: 创建幻化帮助弹窗组件
  - [x] SubTask 4.1: 创建 src/components/pet/FusionHelpModal.tsx 文件
  - [x] SubTask 4.2: 实现帮助内容展示（幻化条件、效果、评分要求、顿悟机制、注意事项）
  - [x] SubTask 4.3: 添加样式文件 src/components/pet/pet.css 中对应的样式

- [x] Task 5: 创建幻化设置面板组件
  - [x] SubTask 5.1: 创建 src/components/pet/FusionSettingsPanel.tsx 文件
  - [x] SubTask 5.2: 实现三个复选框（自动放入副幻兽、自动使用经验球、自动幻化）
  - [x] SubTask 5.3: 实现设置状态保存和读取
  - [x] SubTask 5.4: 添加样式文件 src/components/pet/pet.css 中对应的样式

- [x] Task 6: 创建幻化结果弹窗组件
  - [x] SubTask 6.1: 创建 src/components/pet/FusionResultModal.tsx 文件
  - [x] SubTask 6.2: 实现幻化结果展示（主属性加分、副属性加分、初始属性加分、转世次数）
  - [x] SubTask 6.3: 添加样式文件 src/components/pet/pet.css 中对应的样式

- [x] Task 7: 创建幻兽幻化主界面组件
  - [x] SubTask 7.1: 创建 src/components/pet/PetFusionModal.tsx 文件
  - [x] SubTask 7.2: 实现主幻兽框和副幻兽框组件
  - [x] SubTask 7.3: 实现评分显示区域
  - [x] SubTask 7.4: 实现副幻兽品质要求显示
  - [x] SubTask 7.5: 实现开始幻化按钮及逻辑
  - [x] SubTask 7.6: 实现帮助按钮及弹窗
  - [x] SubTask 7.7: 实现自动放入副幻兽按钮及逻辑
  - [x] SubTask 7.8: 实现设置按钮及面板
  - [x] SubTask 7.9: 集成所有子组件
  - [x] SubTask 7.10: 添加样式文件 src/components/pet/pet.css 中对应的样式

- [x] Task 8: 集成幻兽幻化功能到主应用
  - [x] SubTask 8.1: 在 src/App.tsx 中添加幻兽幻化弹窗状态管理
  - [x] SubTask 8.2: 在 NPC 交互处理逻辑中添加 'openPetFusion' actionType 处理
  - [x] SubTask 8.3: 实现幻兽幻化弹窗的打开和关闭逻辑
  - [x] SubTask 8.4: 实现幻化后幻兽数据的更新逻辑

- [x] Task 9: 更新组件导出
  - [x] SubTask 9.1: 在 src/components/pet/index.ts 中导出 PetFusionModal 组件
  - [x] SubTask 9.2: 在 src/components/pet/index.ts 中导出相关子组件

- [x] Task 10: 测试和验证
  - [x] SubTask 10.1: 测试 NPC 交互功能
  - [x] SubTask 10.2: 测试幻兽选择功能
  - [x] SubTask 10.3: 测试幻化条件检查
  - [x] SubTask 10.4: 测试幻化核心逻辑
  - [x] SubTask 10.5: 测试自动功能（自动放入、自动使用经验球、自动幻化）
  - [x] SubTask 10.6: 测试帮助和设置功能
  - [x] SubTask 10.7: 验证移动端显示效果

# Task Dependencies
- [Task 3] depends on [Task 1]
- [Task 7] depends on [Task 1, Task 3, Task 4, Task 5, Task 6]
- [Task 8] depends on [Task 7]
- [Task 10] depends on [Task 8]
