# 组件目录结构

本目录包含游戏的所有UI组件，按功能模块组织。

## 目录结构

```
components/
├── index.ts           # 总导出文件
├── README.md          # 本说明文件
├── home/              # 首页模块
│   ├── index.ts
│   ├── README.md
│   ├── LocationHeader.tsx
│   ├── SceneDescription.tsx
│   ├── LocalMap.tsx
│   ├── InteractionButtons.tsx
│   ├── InteractionLog.tsx
│   ├── Menu.tsx
│   ├── WorldMap.tsx
│   └── SoldierModal.tsx
├── battle/            # 战斗模块
│   ├── index.ts
│   ├── README.md
│   ├── Battle.tsx
│   ├── BattleLog.tsx
│   ├── CharacterCard.tsx
│   └── ActionButtons.tsx
├── common/            # 公共组件
│   ├── index.ts
│   ├── README.md
│   ├── constants.ts   # 公共常量
│   ├── utils.ts       # 公共工具函数
│   ├── NPCModal.tsx
│   └── EnemyModal.tsx
├── character/         # 角色模块
│   ├── index.ts
│   ├── CharacterPage.tsx
│   ├── CharacterInfo.tsx
│   ├── EquipmentDisplay.tsx
│   ├── EquipmentModal.tsx
│   ├── EquipmentSelectModal.tsx
│   ├── InventoryEquipmentModal.tsx
│   └── CombatPowerModal.tsx
├── inventory/         # 背包模块
│   ├── index.ts
│   ├── InventoryPage.tsx
│   ├── ItemGrid.tsx
│   ├── ItemDetailModal.tsx
│   └── ResourceDisplay.tsx
├── pet/               # 幻兽模块
│   ├── index.ts
│   ├── PetPage.tsx
│   ├── DeployedPetSlot.tsx
│   ├── PetListItem.tsx
│   └── PetDetailModal.tsx
└── skill/             # 技能模块
    ├── index.ts
    ├── SkillPage.tsx
    ├── SkillList.tsx
    └── SkillDetailModal.tsx
```

## 模块说明

### home - 首页模块
游戏主界面相关组件，包括：
- 位置标题、场景描述
- 局部地图、大地图
- 交互按钮、交互日志
- 右下角菜单
- 小兵弹窗

详见 [home/README.md](./home/README.md)

### battle - 战斗模块
回合制战斗系统相关组件，包括：
- 战斗主组件
- 战斗日志
- 角色卡片
- 行动按钮

详见 [battle/README.md](./battle/README.md)

### common - 公共组件
可复用的通用组件，包括：
- NPC对话弹窗
- 敌人信息弹窗
- 公共常量（品质颜色、装备图标等）
- 公共工具函数（获取颜色、图标等）

详见 [common/README.md](./common/README.md)

### character - 角色模块
角色信息相关组件，包括：
- 角色信息页面
- 装备展示
- 装备详情弹窗
- 装备选择弹窗

### inventory - 背包模块
背包系统相关组件，包括：
- 背包页面
- 物品列表
- 物品详情弹窗
- 资源显示

### pet - 幻兽模块
幻兽系统相关组件，包括：
- 幻兽页面
- 出战幻兽栏
- 幻兽列表项
- 幻兽详情弹窗

### skill - 技能模块
技能系统相关组件，包括：
- 技能页面
- 技能列表
- 技能详情弹窗

## 导入方式

### 方式一：从总入口导入
```tsx
import { 
  LocationHeader, 
  Battle, 
  NPCModal,
  EQUIPMENT_ICON_MAP,
  getPetEmoji
} from './components';
```

### 方式二：从模块导入（推荐）
```tsx
// 首页组件
import { LocationHeader, LocalMap } from './components/home';

// 战斗组件
import { Battle, CharacterCard } from './components/battle';

// 公共组件和工具
import { NPCModal, EnemyModal } from './components/common';
import { EQUIPMENT_ICON_MAP, getPetEmoji } from './components/common';

// 角色组件
import { CharacterPage, EquipmentDisplay } from './components/character';

// 背包组件
import { InventoryPage, ItemGrid } from './components/inventory';

// 幻兽组件
import { PetPage, PetListItem } from './components/pet';

// 技能组件
import { SkillPage, SkillList } from './components/skill';
```

## 设计原则

1. **模块化**: 按功能划分模块，职责清晰
2. **可复用**: 公共组件和工具函数放在 common 目录
3. **易维护**: 每个模块有独立的 README 说明
4. **类型安全**: 所有组件都有完整的 TypeScript 类型定义
5. **避免重复**: 公共常量和工具函数统一定义，避免在各组件中重复

## 扩展建议

1. **新增组件时**:
   - 判断属于哪个模块
   - 如果是通用组件，放在 common 目录
   - 更新对应模块的 index.ts 和 README.md

2. **新增模块时**:
   - 创建新目录
   - 添加 index.ts 和 README.md
   - 更新 components/index.ts 导出

3. **新增常量或工具函数时**:
   - 判断是否可复用
   - 如果可复用，添加到 common/constants.ts 或 common/utils.ts
   - 更新 common/index.ts 导出
