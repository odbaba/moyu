# Tasks

- [x] Task 1: 完善 Android 原生层 TapTap 登录实现
  - [x] SubTask 1.1: 实现 `TapTapLoginPlugin.java` 的 `login()` 方法，调用 TapTap SDK 登录 API
  - [x] SubTask 1.2: 实现 `TapTapLoginPlugin.java` 的 `logout()` 方法，调用 TapTap SDK 登出 API
  - [x] SubTask 1.3: 新增 `isLoggedIn()` 方法，检测当前登录状态
  - [x] SubTask 1.4: 新增 `getCurrentUser()` 方法，获取当前登录用户信息
  - [x] SubTask 1.5: 处理登录回调结果，返回用户信息给前端

- [x] Task 2: 扩展前端 TapTap 登录接口
  - [x] SubTask 2.1: 扩展 `TapTapLogin.ts` 接口定义，添加 `isLoggedIn()` 和 `getCurrentUser()` 方法
  - [x] SubTask 2.2: 添加 `TapTapUserInfo` 类型定义
  - [x] SubTask 2.3: 添加错误处理和类型安全

- [x] Task 3: 创建登录状态管理 Hook
  - [x] SubTask 3.1: 创建 `src/hooks/useTapTapLogin.ts` Hook
  - [x] SubTask 3.2: 实现登录状态管理（isLoggedIn, userInfo, isLoading）
  - [x] SubTask 3.3: 实现 `login()` 方法，调用 TapTap 登录并更新状态
  - [x] SubTask 3.4: 实现 `logout()` 方法，调用 TapTap 登出并清除状态
  - [x] SubTask 3.5: 实现 `checkLoginStatus()` 方法，初始化时检测登录状态
  - [x] SubTask 3.6: 实现本地存储持久化（localStorage）

- [x] Task 4: 更新封面页组件
  - [x] SubTask 4.1: 在 `CoverPage.tsx` 中集成 `useTapTapLogin` Hook
  - [x] SubTask 4.2: 添加 TapTap 登录按钮（未登录时显示）
  - [x] SubTask 4.3: 添加用户信息显示区域（已登录时显示头像和昵称）
  - [x] SubTask 4.4: 添加退出登录按钮（已登录时显示）
  - [x] SubTask 4.5: 添加登录状态样式（cover.css）

- [x] Task 5: 更新存档系统支持账号关联
  - [x] SubTask 5.1: 扩展 `SaveData` 类型，添加 `taptapUserId` 字段
  - [x] SubTask 5.2: 修改 `saveGame()` 函数，保存时关联当前登录用户 ID
  - [x] SubTask 5.3: 修改 `loadGame()` 函数，加载时验证用户 ID 匹配
  - [x] SubTask 5.4: 支持游客模式存档（无用户 ID）

- [x] Task 6: 添加 Web 平台兼容处理
  - [x] SubTask 6.1: 检测运行环境（Capacitor/Web）
  - [x] SubTask 6.2: Web 环境下隐藏 TapTap 登录相关 UI
  - [x] SubTask 6.3: Web 环境下使用本地存储模拟登录状态

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 3]
- [Task 5] depends on [Task 3]
- [Task 6] depends on [Task 4]

# Additional Tasks (Implementation)

- [x] Task 7: 更新 App.tsx 集成登录功能
  - [x] 添加 `taptapUserId` 状态管理
  - [x] 添加 `handleLoginSuccess` 回调
  - [x] 修改 `loadGame` 调用传递用户 ID
  - [x] 修改 `saveGame` 调用传递用户 ID
  - [x] 更新 `CoverPage` 组件调用
