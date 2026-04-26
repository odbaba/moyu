# Tasks

## 任务1: 创建战魂套装图标组件
- [x] Task 1.1: 在 `EquipmentDisplay.tsx` 中添加套装图标组件
  - [x] 创建 `WarSoulSetIcon` 子组件
  - [x] 定义组件属性接口（套装类型、套装等级、战斗力加成等）
  - [x] 实现点击显示悬浮提示功能
  - [x] 支持多个图标并排显示

## 任务2: 实现套装状态检测逻辑
- [x] Task 2.1: 在 `EquipmentDisplay` 组件中集成套装检测
  - [x] 调用 `checkWarSoulSet` 函数检测套装状态
  - [x] 调用 `calculateWarSoulSetCombatPowerPercent` 计算战斗力加成百分比
  - [x] 调用 `calculateWarSoulSetCombatPowerBonus` 计算战斗力加成数值
  - [x] 检测是否满足战魂套装条件（6件都有战魂）
  - [x] 检测是否满足天魂套装条件（6件都是天魂）
  - [x] 检测是否满足地魂套装条件（6件都是地魂）

## 任务3: 实现悬浮提示内容
- [x] Task 3.1: 实现战魂套装提示内容
  - [x] 显示套装名称和等级
  - [x] 显示战斗力提高百分比
  - [x] 显示当前提高的战斗力数值

- [x] Task 3.2: 实现天魂套装提示内容
  - [x] 显示套装名称和等级
  - [x] 显示敌人战斗力下降百分比

- [x] Task 3.3: 实现地魂套装提示内容
  - [x] 显示套装名称和等级
  - [x] 显示敌人生命值减少百分比

## 任务4: 添加CSS样式
- [x] Task 4.1: 在 `character.css` 中添加套装图标样式
  - [x] 添加图标容器样式（右上角定位）
  - [x] 添加图标样式（大小、颜色）
  - [x] 添加悬浮提示样式（背景、边框、文字）
  - [x] 添加不同套装类型的颜色区分
  - [x] 添加多图标并排显示样式

## 任务5: 集成到装备展示组件
- [x] Task 5.1: 修改 `EquipmentDisplay` 组件
  - [x] 接收角色装备数据作为属性
  - [x] 计算所有激活的套装状态
  - [x] 在装备模块右上角渲染所有激活的套装图标
  - [x] 多个图标并排显示

# Task Dependencies
- [Task 2] depends on [Task 1]（套装检测依赖组件定义）
- [Task 3] depends on [Task 2]（提示内容依赖套装检测）
- [Task 4] depends on [Task 1]（样式依赖组件结构）
- [Task 5] depends on [Task 1], [Task 2], [Task 3], [Task 4]（集成依赖所有前置任务）
