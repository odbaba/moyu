# Checklist

## Android 原生层实现
- [x] `TapTapLoginPlugin.java` 的 `login()` 方法正确调用 TapTap SDK 登录 API
- [x] `TapTapLoginPlugin.java` 的 `logout()` 方法正确调用 TapTap SDK 登出 API
- [x] `isLoggedIn()` 方法能正确检测登录状态
- [x] `getCurrentUser()` 方法能正确获取用户信息
- [x] 登录成功时返回正确的用户信息（accessToken, userId, name, avatar）
- [x] 登录取消时返回正确的错误信息
- [x] 登录失败时返回正确的错误信息

## 前端接口
- [x] `TapTapLogin.ts` 接口定义完整，包含所有必要方法
- [x] `TapTapUserInfo` 类型定义正确
- [x] 接口调用有正确的错误处理

## 登录状态管理
- [x] `useTapTapLogin` Hook 正确管理登录状态
- [x] 登录成功后状态正确更新
- [x] 登出后状态正确清除
- [x] 登录状态持久化到 localStorage
- [x] 页面刷新后能恢复登录状态

## 封面页 UI
- [x] 未登录时显示 TapTap 登录按钮
- [x] 已登录时显示用户头像和昵称
- [x] 已登录时显示退出登录按钮
- [x] 登录按钮样式符合游戏风格
- [x] 用户信息显示样式符合游戏风格

## 存档系统
- [x] 存档数据包含 `taptapUserId` 字段
- [x] 保存时正确关联当前用户 ID
- [x] 加载时正确验证用户 ID 匹配
- [x] 游客模式存档正常工作

## Web 平台兼容
- [x] Web 环境下隐藏 TapTap 登录 UI
- [x] Web 环境下游戏功能正常

## 整体功能验证
- [x] 首次登录流程完整可用
- [x] 登录取消流程正确处理
- [x] 登录失败流程正确处理
- [x] 已登录用户启动游戏自动恢复状态
- [x] 登出流程完整可用
- [x] 存档与账号正确关联
