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
├── TimeDisplay.tsx       # 时间显示组件（含保存按钮）
├── Menu.tsx              # 右下角菜单组件
├── WorldMap.tsx          # 大地图组件
└── SoldierModal.tsx      # 小兵弹窗组件
```

## 组件说明

### LocationHeader
- **功能**: 显示当前位置的标题，提供角色和幻兽系统入口
- **位置**: 页面顶部
- **布局**: 左侧角色按钮 + 中间位置名称 + 右侧幻兽按钮
- **Props**: 
  - `location: string` - 当前位置名称
  - `onShowCharacter: () => void` - 显示角色信息页面的回调
  - `onShowPet: () => void` - 显示幻兽页面的回调

### SceneDescription
- **功能**: 显示当前场景的文字描述
- **位置**: 标题下方
- **Props**: `description: string` - 场景描述文本

### LocalMap
- **功能**: 显示当前位置周围的相邻地点，支持点击移动，带平滑移动动画
- **位置**: 场景描述下方
- **Props**: 
  - `currentLocation: string` - 当前位置ID
  - `onMove: (locationId: string) => void` - 移动回调
  - `isAutoMoving: boolean` - 是否正在自动移动
- **动画机制**:
  - 每个节点使用独立的CSS transition动画（`transform`过渡）
  - 节点位置基于`displayCoord`相对于当前地点居中计算，无需容器偏移
  - 动画时长根据曼哈顿距离动态调整：距离1=200ms，距离2=400ms
  - 连接线在动画期间淡出，避免端点与节点位置不同步
  - 使用`animationTimeoutRef`管理超时，防止快速移动时旧超时提前中断新动画
  - 动画期间禁止交互（`pointerEvents: none`），防止重复移动

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

### TimeDisplay
- **功能**: 显示当前天数、星期、时间进度条，以及保存游戏按钮
- **位置**: 交互日志区顶部
- **Props**:
  - `nowday: number` - 当前天数
  - `nowtime: number` - 当天已消耗的时间单位
  - `onedaytime: number` - 一天的时间单位总数
  - `onSaveGame: () => void` - 保存游戏回调

### Menu
- **功能**: 右下角的悬浮菜单，提供角色信息、幻兽、背包、技能、大地图等功能入口
- **位置**: 页面右下角固定
- **Props**:
  - `isOpen: boolean` - 菜单是否展开
  - `onToggle: () => void` - 切换菜单状态
  - `onShowMap: () => void` - 显示大地图回调
  - `onShowCharacter: () => void` - 显示角色信息页面回调
  - `onShowInventory: () => void` - 显示背包页面回调
  - `onShowSkill: () => void` - 显示技能页面回调
  - `onShowPet: () => void` - 显示幻兽页面回调
  - `onShowSettings: () => void` - 显示设置页面回调

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
<LocationHeader 
  location={currentLocation.name} 
  onShowCharacter={() => setShowCharacterPage(true)}
  onShowPet={() => setShowPetPage(true)}
/>
<SceneDescription description={currentLocation.description} />
<LocalMap currentLocation={currentLocationId} onMove={handleMove} />
<InteractionButtons interactables={interactables} onInteract={handleInteract} />
<InteractionLog logs={logs} />
<Menu 
  isOpen={menuOpen} 
  onToggle={toggleMenu} 
  onShowMap={showMap}
  onShowCharacter={() => setShowCharacterPage(true)}
  onShowInventory={() => setShowInventoryPage(true)}
  onShowSkill={() => setShowSkillPage(true)}
  onShowPet={() => setShowPetPage(true)}
/>
<WorldMap isVisible={showMap} onClose={closeMap} currentLocation={currentLocationId} onMove={handleMove} />
```

## 注意事项

1. 所有组件都是响应式的，会自动适配手机端
2. WorldMap 组件支持触摸拖拽，适配移动端操作
3. SoldierModal 目前只在中央广场显示
