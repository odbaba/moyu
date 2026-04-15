# 局部地图平移效果 - 实现计划

## [x] 任务1: 重构局部地图组件，使用大地图渲染方式
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 修改 LocalMap 组件，使其渲染完整的大地图，但只显示局部区域
  - 使用与 WorldMap 相同的坐标计算方式
  - 添加视图偏移（offset）状态来控制显示区域
- **Success Criteria**:
  - 局部地图能显示以当前位置为中心的大地图局部区域
  - 显示当前位置和相邻位置
- **Test Requirements**:
  - `human-judgement` TR-1.1: 局部地图显示以当前位置为中心的区域
  - `human-judgement` TR-1.2: 显示当前位置（金色）和相邻位置（灰色）
- **Notes**: 使用 WorldMap 的渲染逻辑，但调整尺寸和可见区域

## [x] 任务2: 添加移动时的视图偏移跟踪
- **Priority**: P0
- **Depends On**: 任务1
- **Description**:
  - 在 App 组件中跟踪上一个位置
  - 计算移动方向和距离
  - 传递移动信息给 LocalMap 组件
- **Success Criteria**:
  - 能正确获取上一个位置
  - 能计算移动方向（上/下/左/右）
- **Test Requirements**:
  - `programmatic` TR-2.1: 能正确获取上一个位置
  - `programmatic` TR-2.2: 能计算移动方向
- **Notes**: 可以通过 useEffect 监听 currentLocation 变化来获取上一个位置

## [x] 任务3: 实现视图平移动画
- **Priority**: P0
- **Depends On**: 任务2
- **Description**:
  - 在 LocalMap 组件中实现视图偏移（offset）动画
  - 当角色向上移动时，视图向下平移
  - 当角色向下移动时，视图向上平移
  - 当角色向左移动时，视图向右平移
  - 当角色向右移动时，视图向左平移
  - 使用 CSS transition 或 requestAnimationFrame 实现平滑动画
- **Success Criteria**:
  - 向上移动时，视图向下平移
  - 动画平滑自然
  - 动画结束后，视图正确显示新位置的相邻位置
- **Test Requirements**:
  - `human-judgement` TR-3.1: 向上移动时视图向下平移
  - `human-judgement` TR-3.2: 向下移动时视图向上平移
  - `human-judgement` TR-3.3: 向左移动时视图向右平移
  - `human-judgement` TR-3.4: 向右移动时视图向左平移
  - `human-judgement` TR-3.5: 动画平滑自然
- **Notes**: 动画时长约 300-500ms，与自动移动间隔一致

## [x] 任务4: 集成与现有功能兼容
- **Priority**: P1
- **Depends On**: 任务1, 任务2, 任务3
- **Description**:
  - 确保与自动移动功能兼容
  - 确保与局部地图点击移动功能兼容
  - 确保动画不会影响交互
- **Success Criteria**:
  - 自动移动时也有平移效果
  - 局部地图点击移动时也有平移效果
  - 交互功能正常工作
- **Test Requirements**:
  - `human-judgement` TR-4.1: 自动移动时有平移效果
  - `human-judgement` TR-4.2: 点击移动时有平移效果
  - `human-judgement` TR-4.3: 所有交互功能正常
- **Notes**: 注意动画期间可能需要暂时禁用交互

## [x] 任务5: 测试与优化
- **Priority**: P1
- **Depends On**: 任务1, 任务2, 任务3, 任务4
- **Description**:
  - 测试所有方向的移动
  - 测试不同距离的移动
  - 优化动画流畅度
  - 处理边界情况
- **Success Criteria**:
  - 所有方向的移动都有正确的平移效果
  - 动画流畅不卡顿
  - 边界情况处理正确
- **Test Requirements**:
  - `human-judgement` TR-5.1: 所有方向的移动都有正确的平移效果
  - `human-judgement` TR-5.2: 动画流畅不卡顿
  - `human-judgement` TR-5.3: 边界情况处理正确
- **Notes**: 测试角色在地图边缘移动的情况