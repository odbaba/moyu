# Tasks

- [x] Task 1: 定义幻兽类型和接口
  - [x] SubTask 1.1: 在 `src/types/index.ts` 中添加 PetType、PetQuality、Pet 接口定义
  - [x] SubTask 1.2: 定义幻兽评分相关接口

- [x] Task 2: 创建幻兽数据配置
  - [x] SubTask 2.1: 创建 `src/data/petData.ts` 文件
  - [x] SubTask 2.2: 定义示例幻兽数据（包含不同类型、品质的幻兽）

- [x] Task 3: 创建幻兽页面组件
  - [x] SubTask 3.1: 创建 `src/components/pet/` 目录
  - [x] SubTask 3.2: 创建 `PetPage.tsx` 幻兽页面主组件
  - [x] SubTask 3.3: 创建 `DeployedPetSlot.tsx` 出战幻兽栏组件
  - [x] SubTask 3.4: 创建 `PetListItem.tsx` 幻兽列表项组件
  - [x] SubTask 3.5: 创建 `PetDetailModal.tsx` 幻兽详情弹窗组件

- [x] Task 4: 添加幻兽页面样式
  - [x] SubTask 4.1: 创建 `src/components/pet/pet.css` 样式文件
  - [x] SubTask 4.2: 实现出战栏、列表、详情弹窗的样式

- [x] Task 5: 集成幻兽入口按钮
  - [x] SubTask 5.1: 在 `src/App.tsx` 中添加幻兽页面状态管理
  - [x] SubTask 5.2: 在首页标题模块最左侧添加"幻兽"按钮
  - [x] SubTask 5.3: 实现点击按钮打开幻兽页面的逻辑

- [x] Task 6: 实现幻兽交互功能
  - [x] SubTask 6.1: 实现召回幻兽功能
  - [x] SubTask 6.2: 实现合体/解体功能（提示消息）
  - [x] SubTask 6.3: 实现点击幻兽查看详情功能

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 3]
- [Task 5] depends on [Task 3]
- [Task 6] depends on [Task 3]
