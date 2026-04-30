# Tasks

- [x] Task 1: 创建引导配置文件 `src/data/guideConfig.ts`
  - [x] SubTask 1.1: 定义引导步骤类型接口 `GuideStep`
  - [x] SubTask 1.2: 定义引导配置数据，包含26个引导步骤
  - [x] SubTask 1.3: 使用 CSS 选择器定位目标元素（非侵入式）
  - [x] SubTask 1.4: 添加 noAutoDispatch 选项支持纯展示步骤

- [x] Task 2: 创建引导状态管理 Hook `src/hooks/useGuide.ts`
  - [x] SubTask 2.1: 定义引导状态接口 `GuideState`
  - [x] SubTask 2.2: 实现 `useGuide` Hook，包含状态管理和阶段切换逻辑
  - [x] SubTask 2.3: 实现首次进入检测（使用 localStorage）
  - [x] SubTask 2.4: 实现开发者模式检测（开发者模式下始终显示引导）
  - [x] SubTask 2.5: 导出 Hook 和相关类型

- [x] Task 3: 创建蒙层组件 `src/components/common/GuideOverlay.tsx`
  - [x] SubTask 3.1: 定义组件属性接口 `GuideOverlayProps`
  - [x] SubTask 3.2: 使用 CSS clip-path 实现镂空效果（纯 CSS，不使用 SVG）
  - [x] SubTask 3.3: 实现目标元素高亮效果（#2295D6 边框 + 发光）
  - [x] SubTask 3.4: 实现引导文字显示和智能定位逻辑（边界处理）
  - [x] SubTask 3.5: 实现点击高亮区域触发目标元素原始点击事件
  - [x] SubTask 3.6: 实现 noAutoDispatch 模式（仅推进步骤，不派发事件）
  - [x] SubTask 3.7: 实现定时器重新计算位置（处理动画等情况）
  - [x] SubTask 3.8: 添加跳过引导按钮
  - [x] SubTask 3.9: 移除非高亮区域点击跳过引导功能

- [x] Task 4: 创建蒙层样式文件 `src/components/common/GuideOverlay.css`
  - [x] SubTask 4.1: 定义蒙层基础样式（半透明背景 rgba(0, 0, 0, 0.5)、z-index: 3550）
  - [x] SubTask 4.2: 定义高亮区域样式（#2295D6 边框、发光效果、脉冲动画）
  - [x] SubTask 4.3: 定义引导文字样式（#252935 背景、#2295D6 边框、无箭头）
  - [x] SubTask 4.4: 定义过渡动画效果
  - [x] SubTask 4.5: 定义移动端响应式样式
  - [x] SubTask 4.6: 定义跳过按钮样式

- [x] Task 5: 在 `src/components/common/index.ts` 中导出新组件

- [x] Task 6: 在 `App.tsx` 中集成引导系统
  - [x] SubTask 6.1: 引入 `useGuide` Hook 和 `GuideOverlay` 组件
  - [x] SubTask 6.2: 在 `handleStartGame` 中触发引导
  - [x] SubTask 6.3: 实现引导步骤自动推进逻辑

- [x] Task 7: 修改 Menu.tsx 添加帮助按钮类名
  - [x] SubTask 7.1: 为帮助按钮添加 `help-button` 类名以便引导定位

# Task Dependencies
- [Task 3] depends on [Task 1, Task 2, Task 4]
- [Task 6] depends on [Task 2, Task 3, Task 5]
- [Task 7] depends on [Task 1]

# 非侵入式设计说明
本实现采用非侵入式设计：
- 不修改任何业务组件代码（仅 Menu.tsx 添加了 help-button 类名）
- 不添加额外的 data 属性
- 使用已有的 CSS 类选择器定位目标元素
- 通过 `dispatchEvent` 模拟点击事件触发目标元素的原生行为

# 引导流程说明
新手引导共26步，涵盖以下内容：
1. 角色面板和装备系统（步骤1-5）
2. 地图导航和装备打造师（步骤6-12）
3. 幻兽系统（步骤13-15）
4. 幻兽幻化师和幻化帮助（步骤16-20）
5. 皇宫和日常任务官（步骤21-24）
6. 菜单和帮助按钮（步骤25-26）
