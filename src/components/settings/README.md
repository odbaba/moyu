# 设置模块 (Settings Module)

## 概述

设置模块提供游戏设置功能，包括音乐控制和退出游戏等功能。该模块采用移动端优先的设计，确保在一屏内展示所有设置选项。

## 文件结构

```
settings/
├── SettingsPage.tsx    # 设置页面主组件
├── settings.css        # 设置页面样式
├── index.ts            # 模块导出文件
└── README.md           # 模块说明文档
```

## 组件说明

### SettingsPage

设置页面主组件，提供游戏设置功能。

**属性 (Props):**

- `isVisible: boolean` - 是否显示页面
- `isMusicEnabled: boolean` - 音乐是否开启
- `onToggleMusic: () => void` - 切换音乐开关的回调
- `onClose: () => void` - 关闭设置页面的回调
- `onExitGame: () => void` - 退出游戏的回调

**功能特性:**

1. **音乐开关**: 提供背景音乐的开启/关闭功能
2. **退出游戏**: 点击后返回游戏封面页
3. **响应式设计**: 适配移动端和桌面端
4. **动画效果**: 页面打开/关闭带有淡入淡出动画

## 使用示例

```tsx
import { SettingsPage } from './components/settings';

// 在父组件中使用
const [showSettingsPage, setShowSettingsPage] = useState(false);
const [isMusicEnabled, setIsMusicEnabled] = useState(true);

<SettingsPage
  isVisible={showSettingsPage}
  isMusicEnabled={isMusicEnabled}
  onToggleMusic={() => setIsMusicEnabled(!isMusicEnabled)}
  onClose={() => setShowSettingsPage(false)}
  onExitGame={() => {
    setShowSettingsPage(false);
    setShowCover(true);
  }}
/>
```

## 样式说明

### 主要样式类

- `.settings-page-overlay` - 页面覆盖层，半透明黑色背景
- `.settings-page-container` - 页面主容器
- `.settings-page-header` - 页面头部，包含标题和关闭按钮
- `.settings-page-content` - 主要内容区域
- `.settings-section` - 设置区域容器
- `.settings-item` - 单个设置项
- `.settings-toggle` - 切换按钮
- `.settings-exit-button` - 退出游戏按钮

### 颜色方案

- 主色调: `#ffd700` (金色)
- 背景色: `#252935` (深蓝灰色)
- 开启状态: `#4CAF50` (绿色)
- 关闭状态: `#ff6b6b` (红色)

## 集成说明

1. 在 `App.tsx` 中添加设置页面状态管理
2. 在 `Menu.tsx` 中添加设置按钮点击事件
3. 实现音乐开关逻辑
4. 实现退出游戏逻辑

## 注意事项

- 设置页面采用全屏覆盖方式显示
- 点击覆盖层（非内容区域）可关闭页面
- 退出游戏会返回到封面页，不会保存游戏进度
- 音乐开关状态需要持久化存储（可选）
