# Tasks

- [x] Task 1: 扩展 saveUtils.ts 存档数据结构和序列化逻辑
  - [x] SubTask 1.1: 定义完整的 SaveData 接口，覆盖所有游戏状态字段
  - [x] SubTask 1.2: 实现 saveGame 函数，将游戏状态序列化并保存到 localStorage（处理 Set→Array 转换）
  - [x] SubTask 1.3: 实现 loadGame 函数，从 localStorage 读取并反序列化存档数据（处理 Array→Set 转换）
  - [x] SubTask 1.4: 实现版本号常量和版本兼容性检查逻辑
  - [x] SubTask 1.5: 更新 hasSaveData 函数，检查存档版本兼容性

- [x] Task 2: 修改 App.tsx 存档相关逻辑
  - [x] SubTask 2.1: 移除旧的 useEffect 自动保存逻辑（仅保存4个布尔值）
  - [x] SubTask 2.2: 新增 handleSaveGame 函数，收集所有游戏状态并调用 saveGame
  - [x] SubTask 2.3: 修改 handleContinueGame 函数，从存档恢复所有游戏状态
  - [x] SubTask 2.4: 修改 handleStartGame 函数，确保清除存档后使用默认初始值

- [x] Task 3: 首页菜单增加保存游戏按钮
  - [x] SubTask 3.1: Menu.tsx 增加 onSaveGame 属性和"保存游戏"按钮
  - [x] SubTask 3.2: App.tsx 中 Menu 组件传入 onSaveGame 回调

# Task Dependencies
- [Task 2] depends on [Task 1] - App.tsx 的存档逻辑依赖 saveUtils.ts 的接口定义
- [Task 3] depends on [Task 2] - Menu 组件的保存按钮依赖 App.tsx 的 handleSaveGame 函数
