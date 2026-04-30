# Tasks

- [x] Task 1: 添加 Android 排行榜 SDK 依赖
  - [x] SubTask 1.1: 在 `android/app/build.gradle` 添加 `tap-leaderboard:4.10.1` 依赖
  - [x] SubTask 1.2: 确认 `AndroidManifest.xml` 已有网络权限和网络状态权限

- [x] Task 2: 创建 Android 原生层排行榜 Capacitor 插件
  - [x] SubTask 2.1: 创建 `TapTapLeaderboardPlugin.java`，实现 `submitScore()` 方法
  - [x] SubTask 2.2: 实现 `showLeaderboard()` 方法，调用 SDK 展示排行榜 UI
  - [x] SubTask 2.3: 在 `MainActivity.java` 注册新插件

- [x] Task 3: 创建前端排行榜接口
  - [x] SubTask 3.1: 创建 `src/plugins/TapTapLeaderboard.ts`，定义 `TapTapLeaderboardPlugin` 接口
  - [x] SubTask 3.2: 定义 `submitScore` 和 `showLeaderboard` 方法
  - [x] SubTask 3.3: 使用 `registerPlugin` 注册插件

- [x] Task 4: 创建前端排行榜 Hook
  - [x] SubTask 4.1: 创建 `src/hooks/useTapTapLeaderboard.ts`
  - [x] SubTask 4.2: 实现 `submitScore(leaderboardId, score)` 方法
  - [x] SubTask 4.3: 实现 `showLeaderboard(leaderboardId)` 方法
  - [x] SubTask 4.4: 处理原生环境和 Web 环境差异
  - [x] SubTask 4.5: 添加上传状态和错误管理

- [x] Task 5: 更新封面页增加排行榜按钮
  - [x] SubTask 5.1: 导入 `useTapTapLeaderboard` Hook
  - [x] SubTask 5.2: 添加"查看排行榜"按钮，已登录时亮起，未登录时置灰
  - [x] SubTask 5.3: 仅在原生平台显示排行榜按钮
  - [x] SubTask 5.4: 更新 `cover.css` 添加排行榜按钮样式

- [x] Task 6: 更新结算页增加上传分数按钮
  - [x] SubTask 6.1: 添加 `onSubmitScore` 回调 prop
  - [x] SubTask 6.2: 添加"上传分数"按钮，仅在原生平台且已登录时显示
  - [x] SubTask 6.3: 更新 `game-ending.css` 添加上传按钮样式

- [x] Task 7: 更新 App.tsx 集成排行榜功能
  - [x] SubTask 7.1: 在 App.tsx 中传递排行榜相关 props 给 GameEndingPage
  - [x] SubTask 7.2: 实现上传分数逻辑

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 3]
- [Task 5] depends on [Task 4]
- [Task 6] depends on [Task 4]
- [Task 7] depends on [Task 5, Task 6]
