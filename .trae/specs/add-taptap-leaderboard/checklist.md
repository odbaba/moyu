# Checklist

## Android 原生层
- [x] `android/app/build.gradle` 添加了 `tap-leaderboard:4.10.1` 依赖
- [x] `TapTapLeaderboardPlugin.java` 的 `submitScore()` 方法正确调用 SDK 上传分数
- [x] `TapTapLeaderboardPlugin.java` 的 `showLeaderboard()` 方法正确调用 SDK 展示排行榜 UI
- [x] `MainActivity.java` 注册了 `TapTapLeaderboardPlugin`
- [x] `AndroidManifest.xml` 包含所需权限

## 前端接口
- [x] `TapTapLeaderboard.ts` 接口定义完整，包含 `submitScore` 和 `showLeaderboard`
- [x] 使用 `registerPlugin` 正确注册插件

## 前端 Hook
- [x] `useTapTapLeaderboard` Hook 提供 `submitScore` 和 `showLeaderboard` 方法
- [x] 处理原生环境和 Web 环境差异
- [x] 上传状态和错误管理正确

## 封面页 UI
- [x] "查看排行榜"按钮已登录时亮起可点击
- [x] "查看排行榜"按钮未登录时置灰不可点击
- [x] 排行榜按钮仅在原生平台显示
- [x] 按钮样式符合游戏风格

## 结算页 UI
- [x] "上传分数"按钮仅在原生平台且已登录时显示
- [x] 上传成功后提示"上传成功"
- [x] 上传失败后提示错误信息
- [x] 按钮样式符合游戏风格

## App.tsx 集成
- [x] App.tsx 正确传递排行榜相关 props
- [x] 上传分数逻辑使用 `overall.maxPrice` 作为分数

## 整体功能验证
- [x] 已登录用户可以查看排行榜
- [x] 已登录用户可以上传分数
- [x] 未登录用户排行榜按钮置灰
- [x] Web 环境下排行榜相关 UI 隐藏
- [x] 构建验证通过
