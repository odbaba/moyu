# 新手指引蒙层组件 Spec

## Why
新玩家首次进入游戏时，需要清晰的引导来了解游戏界面和核心操作流程。当前缺少新手引导系统，导致新玩家可能不知道如何开始游戏或使用核心功能。

## What Changes
- 新增 `GuideOverlay` 蒙层组件，用于实现新手指引功能
- 新增 `useGuide` Hook，用于管理引导状态和阶段切换
- 新增引导配置文件，定义各阶段的引导目标和提示文字
- 在 `App.tsx` 中集成引导系统，首次点击"开始游戏"时触发引导

## Impact
- Affected specs: 无
- Affected code: 
  - `src/components/common/GuideOverlay.tsx` (新增)
  - `src/components/common/GuideOverlay.css` (新增)
  - `src/hooks/useGuide.ts` (新增)
  - `src/data/guideConfig.ts` (新增)
  - `src/App.tsx` (修改)
  - `src/components/common/index.ts` (修改)
  - `src/components/home/Menu.tsx` (修改 - 添加帮助按钮类名)

## ADDED Requirements

### Requirement: 蒙层组件核心功能
系统 SHALL 提供一个半透明蒙层组件，能够覆盖整个游戏界面，同时允许特定元素"穿透"显示。

#### Scenario: 显示蒙层
- **WHEN** 引导系统激活时
- **THEN** 蒙层覆盖整个视口，背景半透明（rgba(0, 0, 0, 0.5)）

#### Scenario: 高亮目标元素
- **WHEN** 指定目标元素时
- **THEN** 目标元素不被蒙层覆盖（使用 CSS clip-path 实现镂空），并有明显的视觉高亮效果（#2295D6 色边框 + 发光效果）

#### Scenario: 显示引导文字
- **WHEN** 配置了引导文字时
- **THEN** 文字显示在目标元素旁边，清晰可读，无箭头指示器

#### Scenario: 点击行为
- **WHEN** 用户点击蒙层区域
- **THEN** 不触发任何效果，点击被阻止，不跳过引导
- **WHEN** 用户点击高亮区域
- **THEN** 触发目标元素的原始点击事件（除非设置了 noAutoDispatch）

### Requirement: 引导阶段管理
系统 SHALL 支持多阶段引导流程，每个阶段可以指定不同的高亮目标和提示文字。

#### Scenario: 阶段切换
- **WHEN** 用户完成当前阶段的操作（点击高亮元素）
- **THEN** 系统自动切换到下一阶段或结束引导

#### Scenario: noAutoDispatch 模式
- **WHEN** 步骤配置了 `noAutoDispatch: true`
- **THEN** 点击高亮区域仅推进到下一步，不派发点击事件

#### Scenario: 引导完成
- **WHEN** 没有下一步引导步骤时
- **THEN** 引导消失，localStorage 中的 GUIDE_COMPLETED_KEY 设置为 true

### Requirement: 首次游戏检测
系统 SHALL 检测用户是否为首次进入游戏，仅在首次进入时显示引导。

#### Scenario: 首次进入
- **WHEN** 用户首次点击"开始游戏"按钮
- **THEN** 触发新手指引流程

#### Scenario: 非首次进入
- **WHEN** 用户通过"继续游戏"进入或已完成引导
- **THEN** 不显示引导蒙层

#### Scenario: 开发者模式
- **WHEN** 开发者模式（isDeveloperMode）开启时
- **THEN** 每次进入游戏都显示新手引导，方便测试

### Requirement: 响应式适配
系统 SHALL 适配不同屏幕尺寸，确保引导元素定位准确。

#### Scenario: 移动端适配
- **WHEN** 在移动设备上显示引导
- **THEN** 引导文字和高亮区域正确适配屏幕尺寸

#### Scenario: 边界处理
- **WHEN** 提示框在界面边缘时
- **THEN** 智能调整位置，确保提示框完全可见

### Requirement: 视觉效果
系统 SHALL 提供平滑的过渡动画效果。

#### Scenario: 蒙层显示动画
- **WHEN** 蒙层显示时
- **THEN** 有淡入动画效果（0.3秒）

#### Scenario: 高亮区域动画
- **WHEN** 高亮区域显示时
- **THEN** 有脉冲呼吸效果

### Requirement: 扩展性设计
系统 SHALL 预留接口支持后续扩展更多指引步骤。

#### Scenario: 添加新阶段
- **WHEN** 需要添加新的引导阶段
- **THEN** 只需修改配置文件，无需修改组件代码

### Requirement: 非侵入式设计
系统 SHALL 不修改业务组件代码，通过 CSS 选择器定位目标元素。

#### Scenario: 目标元素定位
- **WHEN** 需要高亮某个元素
- **THEN** 使用 CSS 选择器定位，不添加额外的 data 属性

## Technical Design

### 组件架构
```
GuideOverlay (蒙层组件)
├── MaskLayer (CSS clip-path 镂空遮罩层)
├── HighlightArea (高亮区域 - 可点击)
├── GuideText (引导文字)
└── SkipButton (跳过按钮)
```

### 实现方案
使用 CSS `clip-path: polygon()` 实现镂空效果：
- 通过计算目标元素位置，生成镂空多边形
- 纯 CSS 实现，不依赖 SVG
- 兼容性好，性能优秀

### z-index 层级规划
- 引导蒙层容器: 3550
- 高亮区域: 3600
- 引导文字: 3601
- 跳过按钮: 3602

### 状态管理
使用 `useGuide` Hook 管理引导状态：
- `isActive`: 是否激活引导
- `currentStepIndex`: 当前引导步骤索引
- `totalSteps`: 总步骤数
- `nextStep()`: 切换到下一步（无下一步时自动完成）
- `skipGuide()`: 跳过引导
- `completeGuide()`: 完成引导
- `isFirstTime()`: 检测是否首次进入

### 样式规范
- 高亮边框颜色: #2295D6
- 提示框背景色: #252935
- 提示框边框颜色: #2295D6
- 文字颜色: #FCFFFF
- 蒙层透明度: rgba(0, 0, 0, 0.5)
- 无三角箭头指示器

### 引导步骤配置（共26步）

| 步骤 | 目标元素 | 提示文字 | 位置 | noAutoDispatch |
|------|---------|---------|------|----------------|
| 1 | .interact-button--char | 点击进入角色面板 | bottom | false |
| 2 | .equipment-grid-compact .equipment-card-compact:first-child | 点击装备武器 | bottom | false |
| 3 | .equipment-select-modal-content .inventory-list-item:first-child | 点击选择武器 | bottom | false |
| 4 | .equipment-detail-modal-content .equip-button | 点击装备武器 | bottom | false |
| 5 | .character-page-close-button | 点击关闭按钮，回到游戏主页 | bottom | false |
| 6 | [data-location-id="kasanuocheng"] | 点击去往卡萨诺城 | bottom | false |
| 7 | [data-interactable-id="npc_equipment_refiner"] | 装备打造师功能说明 | top | false |
| 8 | .npc-modal .option-button[data-option-index="0"] | 点击进入装备精炼页面 | bottom | false |
| 9 | .refine-slot.gem-slot | 点击选择宝石 | bottom | false |
| 10 | .selection-list | 宝石类型说明 | top | true |
| 11 | .selection-close | 关闭 | bottom | false |
| 12 | .refine-close-modal | 关闭 | bottom | false |
| 13 | .interact-button--pet | 打开幻兽页面 | bottom | false |
| 14 | .deployed-pets-container | 幻兽合体说明 | top | true |
| 15 | .pet-page-close-button | 关闭 | bottom | false |
| 16 | [data-interactable-id="npc_pet_fusion_master"] | 点击幻兽幻化师查看幻兽幻化功能 | top | false |
| 17 | .npc-modal .option-button[data-option-index="1"] | 点击查看幻兽幻化帮助 | bottom | false |
| 18 | .info-modal-content | 幻化可以根据副幻兽属性，大幅增加主幻兽的属性成长和基础属性 | bottom | true |
| 19 | .modal-content .close-modal | 关闭 | bottom | false |
| 20 | .npc-modal .close-modal | 点击关闭 | bottom | false |
| 21 | [data-location-id="huanggong"] | 点击去往皇宫 | bottom | false |
| 22 | [data-interactable-id="npc_daily_task"] | 点击查看日常任务 | top | false |
| 23 | .npc-modal .modal-description | 日常任务说明 | bottom | true |
| 24 | .npc-modal .close-modal | 你已了解游戏基本内容，请开始游戏自行探索吧 | bottom | false |
| 25 | .menu-button | 不知道干什么的时候，可以点击右下角菜单 | top | false |
| 26 | .menu-popup .help-button | 查看帮助，有更精确的指引 | left | true |

### 非侵入式设计原则
- 不修改业务组件代码
- 不添加额外的 data 属性（仅 Menu.tsx 添加了 help-button 类名）
- 使用已有的 CSS 类选择器定位目标元素
- 通过 dispatchEvent 模拟点击事件
