# 交互系统组件使用文档

## 概述

交互系统是游戏中玩家与世界互动的核心机制，支持三种交互类型：

| 类型 | 标识 | 说明 | 触发行为 |
|------|------|------|----------|
| 动作类 | `action` | 执行预设动作（如挖矿、钓鱼等） | 点击后直接执行动作 |
| 敌人类 | `enemy` | 遭遇敌人并可选择战斗 | 点击后弹出敌人信息弹窗 |
| NPC类 | `npc` | 与NPC进行对话交互 | 点击后弹出NPC对话弹窗，选择选项后直接执行 |

---

## 组件列表

| 组件 | 文件 | 功能描述 |
|------|------|----------|
| InteractionButtons | `InteractionButtons.tsx` | 交互按钮列表组件 |
| EnemyModal | `EnemyModal.tsx` | 敌人信息弹窗组件 |
| NPCModal | `NPCModal.tsx` | NPC对话弹窗组件 |

---

## 公共模块

### constants.ts - 公共常量

提供各组件共用的常量定义：

| 常量名 | 说明 |
|--------|------|
| `PET_QUALITY_COLORS` | 幻兽品质颜色映射 |
| `EQUIPMENT_QUALITY_COLORS` | 装备品质颜色映射 |
| `EQUIPMENT_ICON_MAP` | 装备图标映射 |
| `EQUIPMENT_SLOT_TYPE_NAMES` | 装备槽位类型中文名称 |
| `PET_TYPE_EMOJI` | 幻兽类型图标映射 |
| `ITEM_TYPE_NAMES` | 物品类型中文名称 |
| `RARITY_CONFIG` | 稀有度配置 |
| `RARITY_CLASS_NAMES` | 稀有度CSS类名映射 |

### utils.ts - 公共工具函数

提供各组件共用的工具函数：

| 函数名 | 说明 |
|--------|------|
| `getPetQualityColor(quality)` | 获取幻兽品质颜色 |
| `getEquipmentQualityColor(quality)` | 获取装备品质颜色 |
| `getPetEmoji(petType)` | 获取幻兽图标 |
| `getEquipmentIcon(slotType)` | 获取装备图标 |
| `getRarityClassName(rarity)` | 获取稀有度CSS类名 |
| `getRarityText(rarity)` | 获取稀有度中文显示 |
| `getRarityColor(rarity)` | 获取稀有度颜色 |
| `isEquipmentItem(item)` | 判断是否为装备类型 |
| `formatNumber(num)` | 格式化数字显示 |

---

## 配置参数说明

### ActionInteractable（动作类交互）

动作类交互用于定义可执行的游戏动作，如挖矿、钓鱼、采集等。

```typescript
interface ActionInteractable {
  id: string;                           // 交互唯一ID，用于引用和查找
  type: 'action';                       // 交互类型标识，固定为'action'
  name: string;                         // 显示名称，显示在按钮上
  icon: string;                         // 显示图标（emoji格式）
  actionType: ActionType;               // 动作类型：'mining' | 'fishing' | 'gathering' | 'crafting' | 'custom'
  actionParams?: Record<string, unknown>; // 可选：动作参数，传递给动作处理函数
  description?: string;                 // 可选：动作描述文本
}
```

**配置示例：**

```typescript
const mining_shallow: ActionInteractable = {
  id: 'mining_shallow',
  type: 'action',
  name: '挖矿',
  icon: '⛏️',
  actionType: 'mining',
  description: '开始挖矿，获取资源。',
};
```

---

### EnemyInteractable（敌人类交互）

敌人类交互用于定义可遭遇的敌人组，点击后显示敌人详细信息并提供战斗选项。

```typescript
interface EnemyInteractable {
  id: string;                 // 交互唯一ID
  type: 'enemy';              // 交互类型标识，固定为'enemy'
  name: string;               // 显示名称
  icon: string;               // 显示图标（emoji格式）
  description: string;        // 敌人描述文本，显示在弹窗中
  enemies: EnemyData[];       // 敌人列表，包含所有敌人数据
}

// EnemyData 结构定义
interface EnemyData {
  id: string;           // 敌人唯一ID
  name: string;         // 敌人名称
  maxHp: number;        // 最大生命值
  attack: number;       // 攻击力
  defense: number;      // 防御力
  description?: string; // 可选：敌人描述
}
```

**配置示例：**

```typescript
const patrol_soldiers: EnemyInteractable = {
  id: 'patrol_soldiers',
  type: 'enemy',
  name: '巡逻小兵',
  icon: '⚔️',
  description: '你看到三个正在巡逻的城卫小兵。⚠️ 他们看起来不太好惹...',
  enemies: [
    {
      id: 'soldier_a',
      name: '小兵甲',
      maxHp: 50,
      attack: 10,
      defense: 2,
      description: '手持长枪，神情警惕',
    },
    {
      id: 'soldier_b',
      name: '小兵乙',
      maxHp: 60,
      attack: 12,
      defense: 3,
      description: '腰佩短刀，目光锐利',
    },
  ],
};
```

---

### NPCInteractable（NPC类交互）

NPC类交互用于定义与NPC的对话交互，支持多个对话选项。**点击选项后直接执行，无需二次确认**。

```typescript
interface NPCInteractable {
  id: string;                       // 交互唯一ID
  type: 'npc';                      // 交互类型标识，固定为'npc'
  name: string;                     // NPC名称
  icon: string;                     // 显示图标（emoji格式）
  description: string;              // NPC描述文本
  options: NPCInteractionOption[];  // 交互选项列表
  npcType?: NPCType;                // 可选：NPC类型（palace | function | shop | special）
  location?: string;                // 可选：NPC位置信息
}

// NPCInteractionOption 结构定义
interface NPCInteractionOption {
  text: string;                             // 选项显示文本
  result: string;                           // 选项执行结果描述
  actionType?: string;                      // 可选：执行的动作类型
  actionParams?: Record<string, unknown>;   // 可选：动作参数
  condition?: NPCCondition;                 // 可选：选项显示条件
}
```

**配置示例：**

```typescript
const merchant_npc: NPCInteractable = {
  id: 'merchant_npc',
  type: 'npc',
  name: '商人',
  icon: '🧑‍💼',
  description: '一位来自远方的商人，正在兜售他的商品。',
  options: [
    {
      text: '购买商品',
      result: '你浏览了商人的商品...',
    },
    {
      text: '出售物品',
      result: '你向商人出售了一些物品...',
    },
    {
      text: '离开',
      result: '你向商人告别。',
    },
  ],
};
```

---

## 事件接口说明

### InteractionButtons 组件

交互按钮列表组件，渲染所有可交互对象的按钮。

```typescript
interface InteractionButtonsProps {
  /** 交互对象数组 */
  interactables: Interactable[];
  /** 点击交互按钮的回调函数 */
  onInteract: (interactable: Interactable) => void;
}
```

**使用示例：**

```tsx
<InteractionButtons
  interactables={currentLocationInteractables}
  onInteract={(interactable) => {
    // 根据类型分发处理
    switch (interactable.type) {
      case 'action':
        handleAction(interactable);
        break;
      case 'enemy':
        setShowEnemyModal(true);
        break;
      case 'npc':
        setShowNPCModal(true);
        break;
    }
  }}
/>
```

---

### EnemyModal 组件

敌人信息弹窗组件，显示敌人详细属性和战斗选项。

```typescript
interface EnemyModalProps {
  /** 是否显示弹窗 */
  isVisible: boolean;
  /** 关闭弹窗的回调函数 */
  onClose: () => void;
  /** 攻击按钮的回调函数 */
  onAttack: () => void;
  /** 敌人交互数据 */
  enemyData: EnemyInteractable;
}
```

**使用示例：**

```tsx
<EnemyModal
  isVisible={showEnemyModal}
  onClose={() => setShowEnemyModal(false)}
  onAttack={() => {
    // 进入战斗逻辑
    startBattle(currentEnemyData.enemies);
  }}
  enemyData={currentEnemyData}
/>
```

---

### NPCModal 组件

NPC对话弹窗组件，显示NPC信息和交互选项。

```typescript
interface NPCModalProps {
  /** 是否显示模态窗口 */
  isVisible: boolean;
  /** 关闭模态窗口的回调函数 */
  onClose: () => void;
  /** NPC交互数据 */
  npcData: NPCInteractable;
  /** 选择选项后的回调函数 */
  onSelectOption: (result: string) => void;
}
```

**使用示例：**

```tsx
<NPCModal
  isVisible={showNPCModal}
  onClose={() => setShowNPCModal(false)}
  npcData={currentNPCData}
  onSelectOption={(result) => {
    // 处理选项结果
    console.log('NPC交互结果:', result);
    // 可以根据结果显示提示或执行其他逻辑
  }}
/>
```

---

## 使用示例代码

### 1. 在位置配置中引用交互对象

位置配置文件中通过ID引用交互对象：

```typescript
// src/data/locationData.ts
const locations = {
  'town_square': {
    id: 'town_square',
    name: '城镇广场',
    description: '热闹的城镇中心...',
    interactables: ['merchant_npc', 'patrol_soldiers'], // 引用交互对象ID
  },
  'mine_entrance': {
    id: 'mine_entrance',
    name: '矿洞入口',
    description: '深邃的矿洞入口...',
    interactables: ['mining_shallow', 'mining_middle'],
  },
};
```

### 2. 在 interactableData.ts 中定义新的交互对象

```typescript
// src/data/interactableData.ts

// 步骤1：定义交互对象配置
const fishing_lake: ActionInteractable = {
  id: 'fishing_lake',
  type: 'action',
  name: '湖边垂钓',
  icon: '🎣',
  actionType: 'fishing',
  description: '宁静的湖边，适合放松心情钓鱼。',
};

// 步骤2：添加到配置映射表
export const interactableConfig: InteractableConfig = {
  // ... 其他配置
  fishing_lake,
};
```

### 3. 处理不同类型的交互事件

```typescript
// 在App.tsx或页面组件中
const handleInteract = (interactable: Interactable) => {
  // 使用类型守卫进行类型判断
  switch (interactable.type) {
    case 'action':
      // 动作类：直接执行动作
      handleActionInteract(interactable);
      break;
    case 'enemy':
      // 敌人类：显示敌人弹窗
      setCurrentEnemyData(interactable);
      setShowEnemyModal(true);
      break;
    case 'npc':
      // NPC类：显示NPC弹窗
      setCurrentNPCData(interactable);
      setShowNPCModal(true);
      break;
  }
};

// 动作类交互处理
const handleActionInteract = (interactable: ActionInteractable) => {
  switch (interactable.actionType) {
    case 'mining':
      // 执行挖矿逻辑
      performMining(interactable.actionParams);
      break;
    case 'fishing':
      // 执行钓鱼逻辑
      performFishing(interactable.actionParams);
      break;
    // ... 其他动作类型
  }
};
```

---

## 扩展开发指南

### 新增动作类型的步骤

1. **扩展 ActionType 类型**

   在 `src/types/index.ts` 中添加新的动作类型：

   ```typescript
   export type ActionType = 'mining' | 'fishing' | 'gathering' | 'crafting' | 'custom' | 'new_action';
   ```

2. **定义交互配置**

   在 `src/data/interactableData.ts` 中添加新配置：

   ```typescript
   const new_action_config: ActionInteractable = {
     id: 'new_action_id',
     type: 'action',
     name: '新动作名称',
     icon: '🎯',
     actionType: 'new_action',
     actionParams: { difficulty: 'easy' },
     description: '新动作的描述',
   };
   ```

3. **实现动作处理逻辑**

   在动作处理函数中添加新分支：

   ```typescript
   case 'new_action':
     performNewAction(interactable.actionParams);
     break;
   ```

---

## 注意事项

1. **ID唯一性**：所有交互对象的 `id` 必须全局唯一，避免冲突。

2. **类型匹配**：确保 `type` 字段与接口定义一致，TypeScript会进行类型检查。

3. **图标格式**：`icon` 字段使用emoji格式，确保在不同设备上显示一致。

4. **可选字段**：`description`、`actionParams` 等可选字段根据实际需求填写。

5. **敌人平衡性**：新增敌人时注意属性平衡，避免过于强大或弱小。

6. **NPC选项设计**：NPC选项应该提供有意义的交互体验，避免无意义的选项。

7. **性能优化**：大量交互对象时，考虑按需加载配置数据。

8. **移动端适配**：本项目优先保障手机端体验，弹窗和按钮设计需考虑移动端交互。
