# 魔域（nilaizijianghu）

一款类似魔域风格的文字 RPG 游戏，使用 React + TypeScript + Vite 构建的 Web 应用，支持打包为 Android 原生应用。

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | React 19 + TypeScript 5.9 |
| 构建工具 | Vite 8（基于 Rolldown） |
| 状态管理 | React Hooks（useState / useRef） |
| CSS 方案 | 纯 CSS 文件 |
| 字体 | 霞鹜文楷（LXGW WenKai） |
| 移动端打包 | Capacitor 8 |
| 原生 SDK | TapTap SDK 4.10.0 |

## 开发指南

### 环境要求

- Node.js 18+
- npm 或 pnpm
- Android Studio（用于 Android 打包）
- Android SDK API 36

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

启动开发服务器，访问 http://localhost:5173

### 构建生产版本

```bash
# 标准构建（多文件输出）
npm run build

# 单文件构建（所有资源内联到一个 HTML）
npm run build:singlefile
```

### 代码检查

```bash
npm run lint        # 检查代码
npm run lint:fix    # 自动修复
```

## Android 打包

### 新增 npm scripts

| 命令 | 作用 |
|------|------|
| `npm run cap:sync` | 构建 Web + 同步到 Android 项目 |
| `npm run cap:open` | 用 Android Studio 打开 Android 项目 |
| `npm run cap:run` | 构建 + 同步 + 直接运行到连接的安卓设备 |
| `npm run android:build` | 构建 + 同步 + 打开 Android Studio（完整打包流程） |

### 打包步骤

1. 运行 `npm run android:build`
2. Android Studio 会自动打开 `android/` 项目
3. 在 Android Studio 中：Build → Build Bundle(s) / APK(s) → Build APK(s)
4. APK 输出位置：`android/app/build/outputs/apk/debug/app-debug.apk`

### TapTap SDK 配置

在打包前需要配置 TapTap 凭据：

1. 登录 [TapTap 开发者后台](https://developer.taptap.cn/)
2. 获取 Client ID 和 Client Token
3. 修改 `android/app/src/main/java/com/moyu/nilaizijianghu/MoyuApplication.java`：

```java
private static final String TAP_CLIENT_ID = "你的_CLIENT_ID";
private static final String TAP_CLIENT_TOKEN = "你的_CLIENT_TOKEN";
```

### Android 端 React 代码调试（Chrome 远程调试）

在 Android 设备上运行的应用使用 WebView 渲染 React 代码，可以通过 Chrome 远程调试获得完整的 DevTools 体验（Console、Sources 断点、Network 等）。

**前提条件**

- 应用必须是 **debug 构建**（不是 release 签名包）
- 手机开启 **USB 调试**模式
- 使用 USB 数据线连接手机和电脑

**步骤**

1. **开启手机 USB 调试**
   - 进入手机「设置」→「关于手机」→ 连续点击「版本号」7 次开启开发者选项
   - 进入「设置」→「开发者选项」→ 开启「USB 调试」
   - 用 USB 数据线连接手机和电脑，手机弹出授权提示时点击「允许」

2. **运行 Android 应用**
   - 方式一：`npm run cap:run`（构建 + 同步 + 安装到手机）
   - 方式二：在 Android Studio 中点击 Run 按钮

3. **打开 Chrome 远程调试页面**
   - 在电脑 Chrome 浏览器地址栏输入：`chrome://inspect`
   - 页面会列出已连接的设备和正在运行的 WebView

4. **找到你的应用并打开 DevTools**
   - 在设备列表中找到如下条目：
     ```
     魔域  com.moyu.nilaizijianghu  WebView
     ```
   - 点击该条目右侧的 **inspect** 按钮
   - 会打开一个新的 DevTools 窗口

5. **开始调试**
   - **Console 面板** — 查看所有 `console.log` / `console.error` 输出
   - **Sources 面板** — 在 React 源码中设置断点、单步执行、查看变量值
   - **Network 面板** — 查看网络请求和响应
   - **Elements 面板** — 检查 DOM 元素和样式

**注意事项**

- debug 构建包默认允许 WebView 调试，无需额外配置
- release 签名包的 WebView 调试默认关闭，如需开启需在代码中添加 `WebView.setWebContentsDebuggingEnabled(true)`
- 如果 `chrome://inspect` 中看不到设备，检查 USB 驱动是否安装、USB 调试是否开启
- 如果能看到设备但看不到 WebView 条目，确认应用已启动且页面已加载

---

## Capacitor + TapTap SDK 接入说明

### 新增/修改的文件一览

| 文件 | 说明 |
|------|------|
| `capacitor.config.ts` | Capacitor 核心配置（appId、appName、webDir 等） |
| `android/` | 完整的 Android 原生项目（自动生成 + 定制） |
| `android/build.gradle` | 添加了 TapTap Maven 仓库 |
| `android/app/build.gradle` | 添加了 `tap-core:4.10.0` 和 `tap-login:4.10.0` 依赖 |
| `android/app/src/main/AndroidManifest.xml` | 注册了 `MoyuApplication`，添加了网络状态权限 |
| `android/app/src/main/java/.../MoyuApplication.java` | 自定义 Application，初始化 TapTap SDK |
| `android/app/src/main/java/.../TapTapLoginPlugin.java` | Capacitor 自定义插件，桥接 TapTap 登录给 JS 层 |
| `android/app/src/main/java/.../MainActivity.java` | 注册了 TapTapLoginPlugin |
| `src/plugins/TapTapLogin.ts` | 前端 JS 调用 TapTap 登录的 TypeScript 接口 |

### 前端调用 TapTap 登录

```typescript
import { TapTapLogin } from './plugins/TapTapLogin';

// 发起登录
const result = await TapTapLogin.login();
console.log(result.userId, result.name, result.accessToken);

// 登出
await TapTapLogin.logout();
```

### 后续完善事项

1. **实现 TapTap 登录逻辑**：`TapTapLoginPlugin.java` 中的 `login()` 方法目前是占位实现，需要根据 TapTap SDK 文档补充实际的登录回调逻辑

2. **添加更多 TapTap 功能**：如数据分析（tap-db）、成就系统（tap-achievement）等，可在 `android/app/build.gradle` 中添加对应依赖

---

## 项目结构

```
moyu/
├── src/
│   ├── components/          # React 组件
│   │   ├── battle/          # 战斗系统
│   │   ├── character/       # 角色信息
│   │   ├── home/            # 主界面
│   │   ├── inventory/       # 背包系统
│   │   ├── pet/             # 幻兽系统
│   │   ├── shop/            # 商店
│   │   ├── skill/           # 技能系统
│   │   └── ...
│   ├── data/                # 游戏数据配置
│   ├── hooks/               # 自定义 Hooks
│   ├── types/               # TypeScript 类型定义
│   ├── utils/               # 工具函数
│   └── plugins/             # Capacitor 插件桥接
├── android/                 # Android 原生项目
├── reference/               # 参考文档和代码（只读）
├── capacitor.config.ts      # Capacitor 配置
├── vite.config.ts           # Vite 配置
└── package.json             # 项目依赖和脚本
```

## 设计原则

- 优先保障手机端的用户体验，手机一屏能展示所有信息
- 所有白色字体和白色边框使用 `#FCFFFF` 颜色
- 涉及物品生成逻辑优先复用 `src/utils/itemFactory.ts` 下的 `cloneItem` 函数
- 新增页面需要新增文件夹，并在文件夹下增加 md 文件说明

## React Compiler

项目启用了 React Compiler 以优化渲染性能。详见 [React Compiler 文档](https://react.dev/learn/react-compiler)。

注意：这会影响 Vite 开发和构建的性能。
