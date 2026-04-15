# Tasks

- [x] Task 1: 定义时间系统类型
  - [x] SubTask 1.1: 在 types/index.ts 中新增 TimeSystem 类型定义（包含 nowday、nowtime、onedaytime）

- [x] Task 2: 创建时间显示组件
  - [x] SubTask 2.1: 创建 TimeDisplay.tsx 组件，显示当前天数、星期和时间进度条
  - [x] SubTask 2.2: 在 home.css 中添加时间显示样式（黑色边框、绿色进度条）

- [x] Task 3: 集成时间系统到主应用
  - [x] SubTask 3.1: 在 App.tsx 中新增时间状态管理
  - [x] SubTask 3.2: 创建时间消耗函数 consumeTime
  - [x] SubTask 3.3: 创建星期计算函数 getWeekday
  - [x] SubTask 3.4: 修改挖矿逻辑，消耗1个时间单位
  - [x] SubTask 3.5: 修改战斗结束逻辑，消耗3个时间单位

- [x] Task 4: 将时间显示组件集成到交互日志区
  - [x] SubTask 4.1: 修改 InteractionLog.tsx，在顶部显示时间信息

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 2]
