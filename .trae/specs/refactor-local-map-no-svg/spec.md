# LocalMap 组件重构规范（不使用 SVG）

## Why
当前的 LocalMap 组件使用 SVG 实现局部地图和移动动画效果，需要改为使用纯 CSS/HTML 实现，以提供更好的灵活性和性能优化空间。

## What Changes
- 将 SVG 元素替换为 HTML div 元素
- 使用 CSS transform 实现地图移动动画
- 使用 CSS transition 实现平滑过渡效果
- 保持现有的功能和交互逻辑不变
- 保持现有的视觉效果不变

## Impact
- Affected specs: 无直接影响现有功能规格
- Affected code: 
  - `src/components/home/LocalMap.tsx`
  - 可能需要调整相关的 CSS 样式

## ADDED Requirements

### Requirement: HTML 元素实现地图
系统 SHALL 使用 HTML div 元素替代 SVG 元素实现局部地图：
- 使用 div 元素表示地点
- 使用 div 元素表示连接线
- 使用 CSS 定位和布局控制元素位置

#### Scenario: 地点显示
- **WHEN** 玩家查看局部地图
- **THEN** 当前位置和相邻地点以 HTML 元素形式显示
- **AND** 地点之间有连接线显示

### Requirement: CSS 动画实现移动效果
系统 SHALL 使用 CSS transform 和 transition 实现移动动画：
- 使用 `transform: translate()` 控制地图位置
- 使用 `transition` 属性实现平滑过渡
- 动画时长根据移动距离动态计算

#### Scenario: 移动动画
- **WHEN** 玩家点击相邻地点移动
- **THEN** 地图以动画形式移动到新位置
- **AND** 动画效果与原 SVG 实现一致

### Requirement: 保持现有功能
系统 SHALL 保持所有现有功能不变：
- 显示当前位置和相邻地点
- 点击相邻地点触发移动
- 当前位置高亮显示
- 自动移动状态处理
- 动画期间禁止交互

#### Scenario: 功能一致性
- **WHEN** 重构完成
- **THEN** 所有现有功能正常工作
- **AND** 用户体验与重构前一致

## MODIFIED Requirements

### Requirement: 组件实现方式
LocalMap 组件 SHALL 使用纯 HTML/CSS 实现，而非 SVG：
- 移除所有 SVG 相关代码
- 使用 div 元素和 CSS 样式实现相同效果
- 保持组件接口不变（props 和回调）

## REMOVED Requirements

### Requirement: SVG 元素
**Reason**: 改用 HTML/CSS 实现
**Migration**: 将 SVG 元素替换为 HTML div 元素，保持相同的视觉效果
