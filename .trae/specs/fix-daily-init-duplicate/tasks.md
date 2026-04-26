# Tasks

- [x] Task 1: 修复 prevDayRef 初始化问题
  - [x] SubTask 1.1: 将 prevDayRef 的初始值设置为 timeSystem.nowday
  - [x] SubTask 1.2: 确保首次渲染时不会触发每日初始化逻辑

- [x] Task 2: 将每日初始化逻辑提取到统一函数
  - [x] SubTask 2.1: 创建 `handleNewDay` 函数，包含所有每日初始化逻辑
  - [x] SubTask 2.2: 在 useEffect 中调用该函数

- [x] Task 3: 验证修复
  - [x] SubTask 3.1: 测试继续游戏不触发每日初始化
  - [x] SubTask 3.2: 测试新的一天正确触发每日初始化

# Task Dependencies
- Task 2 依赖于 Task 1
- Task 3 依赖于 Task 1 和 Task 2
