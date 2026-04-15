# 首页模块 (Home Module)

本目录包含游戏主界面（非战斗状态）的所有组件。

## 目录结构

```
home/
├── index.ts              # 模块导出文件
├── README.md             # 本说明文件
├── LocationHeader.tsx    # 位置标题组件
├── SceneDescription.tsx  # 场景描述组件
├── LocalMap.tsx          # 局部地图组件
├── InteractionButtons.tsx # 交互按钮组件
├── InteractionLog.tsx    # 交互日志组件
├── Menu.tsx              # 右下角菜单组件
├── WorldMap.tsx          # 大地图组件
└── SoldierModal.tsx      # 小兵弹窗组件
```

## 组件说明

### LocationHeader
- **功能**: 显示当前位置的标题
- **位置**: 页面顶部
- **Props**: `location: string` - 当前位置名称

### SceneDescription
- **功能**: 显示当前场景的文字描述
- **位置**: 标题下方
- **Props**: `description: string` - 场景描述文本

### LocalMap
- **功能**: 显示当前位置周围的相邻地点，支持点击移动
- **位置**: 场景描述下方
- **Props**: 
  - `currentLocation: string` - 当前位置ID
  - `onMove: (locationId: string) => void` - 移动回调
  - `isAutoMoving: boolean` - 是否正在自动移动

### InteractionButtons
- **功能**: 显示当前地点可交互的对象按钮
- **位置**: 局部地图下方
- **Props**:
  - `interactables: string[]` - 可交互对象列表
  - `onInteract: (interactable: string) => void` - 交互回调

### InteractionLog
- **功能**: 显示玩家的操作历史日志
- **位置**: 页面底部
- **Props**: `logs: string[]` - 日志条目数组

### Menu
- **功能**: 右下角的悬浮菜单，提供大地图等功能入口
- **位置**: 页面右下角固定
- **Props**:
  - `isOpen: boolean` - 菜单是否展开
  - `onToggle: () => void` - 切换菜单状态
  - `onShowMap: () => void` - 显示大地图回调

### WorldMap
- **功能**: 全屏大地图，显示所有地点，支持拖拽和点击移动
- **位置**: 全屏弹窗
- **Props**:
  - `isVisible: boolean` - 是否显示
  - `onClose: () => void` - 关闭回调
  - `currentLocation: string` - 当前位置ID
  - `onMove: (locationId: string) => void` - 移动回调

### SoldierModal
- **功能**: 小兵弹窗，显示敌人信息，提供攻击和离开选项
- **位置**: 中央广场特定交互
- **Props**:
  - `isVisible: boolean` - 是否显示
  - `onClose: () => void` - 关闭回调
  - `onAttack: () => void` - 攻击回调（进入战斗）

## 使用示例

```tsx
import { 
  LocationHeader, 
  SceneDescription, 
  LocalMap,
  InteractionButtons,
  InteractionLog,
  Menu,
  WorldMap,
  SoldierModal
} from './components/home';

// 在主应用中使用
<LocationHeader location={currentLocation.name} />
<SceneDescription description={currentLocation.description} />
<LocalMap currentLocation={currentLocationId} onMove={handleMove} />
<InteractionButtons interactables={interactables} onInteract={handleInteract} />
<InteractionLog logs={logs} />
<Menu isOpen={menuOpen} onToggle={toggleMenu} onShowMap={showMap} />
<WorldMap isVisible={showMap} onClose={closeMap} currentLocation={currentLocationId} onMove={handleMove} />
```

## 注意事项

1. 所有组件都是响应式的，会自动适配手机端
2. WorldMap 组件支持触摸拖拽，适配移动端操作
3. SoldierModal 目前只在中央广场显示
