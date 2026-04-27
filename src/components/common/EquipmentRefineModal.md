# EquipmentRefineModal 组件文档

## 概述

装备精炼模态窗口组件，用于装备精炼操作。支持选择装备和宝石进行精炼，提升装备属性。

## 功能特性

- ✅ 装备选择：点击装备槽打开装备列表进行选择
- ✅ 宝石选择：点击宝石槽打开宝石列表进行选择
- ✅ 精炼操作：检查装备和宝石后执行精炼
- ✅ 结果反馈：显示精炼成功/失败消息
- ✅ 移动端优化：全屏布局，一屏显示所有信息
- ✅ 自动过滤：只显示玩家等级可用的装备和可用的宝石（强化类/镶嵌类）
- ✅ 宝石镶嵌：支持选择中级/高级战斗力石、经验石进行镶嵌
- ✅ 宝石摘除：支持点击已镶嵌宝石进行摘除（会触发战魂等级下降，摘除的宝石会返回背包）

## 组件结构

```
EquipmentRefineModal/
├── EquipmentRefineModal.tsx    # 主组件文件
├── EquipmentRefineModal.css    # 样式文件
└── README.md                   # 本文档
```

## Props 接口

```typescript
interface EquipmentRefineModalProps {
  isVisible: boolean;                    // 是否显示模态窗口
  onClose: () => void;                   // 关闭回调
  equipment: EquipmentItem | null;       // 当前选中的装备
  gem: GemItem | null;                   // 当前选中的宝石
  onEquipmentChange: (equipment: EquipmentItem | null) => void;  // 装备变更回调
  onGemChange: (gem: GemItem | null) => void;                    // 宝石变更回调
  onRefine: (result: RefineResult) => void;                      // 精炼回调
  playerLevel: number;                   // 玩家等级
  inventoryEquipments: EquipmentItem[];  // 背包中的所有装备
  inventoryGems: GemItem[];              // 背包中的所有宝石
}
```

## 使用示例

### 在 App.tsx 中集成

```tsx
import EquipmentRefineModal from './components/common/EquipmentRefineModal';
import type { EquipmentItem, GemItem, RefineResult } from './types';

function App() {
  // 状态管理
  const [showRefineModal, setShowRefineModal] = useState(false);
  const [refineEquipment, setRefineEquipment] = useState<EquipmentItem | null>(null);
  const [refineGem, setRefineGem] = useState<GemItem | null>(null);
  
  // 获取背包中的装备和宝石
  const inventoryEquipments = useMemo(() => {
    return inventory.filter((item): item is EquipmentItem => 
      item.type === 'equipment'
    );
  }, [inventory]);
  
  const inventoryGems = useMemo(() => {
    return inventory.filter((item): item is GemItem => 
      item.type === 'gem'
    );
  }, [inventory]);
  
  // 处理精炼
  const handleRefine = (result: RefineResult) => {
    setInteractionLog(prev => [...prev, result.message]);
    if (result.success) {
      // 更新装备属性
    }
    setRefineEquipment(null);
    setRefineGem(null);
  };
  
  return (
    <EquipmentRefineModal
      isVisible={showRefineModal}
      onClose={() => {
        setShowRefineModal(false);
        setRefineEquipment(null);
        setRefineGem(null);
      }}
      equipment={refineEquipment}
      gem={refineGem}
      onEquipmentChange={setRefineEquipment}
      onGemChange={setRefineGem}
      onRefine={handleRefine}
      playerLevel={character.level}
      inventoryEquipments={inventoryEquipments}
      inventoryGems={inventoryGems}
    />
  );
}
```

### 通过 NPC 打开精炼界面

在 NPC 数据配置中添加精炼选项：

```typescript
const npc_equipment_refiner: NPCInteractable = {
  id: 'npc_equipment_refiner',
  type: 'npc',
  name: '装备打造师',
  icon: '⚒️',
  description: '精通装备精炼的工匠，可以提升装备的品质、魔魂等级、开洞和镶嵌宝石。',
  location: 'kasanuocheng',
  npcType: 'shop',
  options: [
    {
      text: '我要精练我的装备',
      result: '打开装备精炼界面。',
      actionType: 'openRefine',
      actionParams: {},
    },
    // ... 其他选项
  ]
};
```

在 `handleNPCOptionSelect` 中处理：

```typescript
case 'openRefine':
  setShowRefineModal(true);
  setShowNPCModal(false);
  setInteractionLog(prev => [...prev, result]);
  break;
```

## 界面布局

### 主要区域

1. **标题栏**：显示"装备精炼"标题和关闭按钮
2. **装备槽**：显示当前选中的装备信息
3. **精炼按钮**：执行精炼操作
4. **宝石槽**：显示当前选中的宝石信息
5. **结果反馈**：显示精炼结果（成功/失败）

### 物品选择界面

点击装备槽或宝石槽时，会弹出物品选择界面：

- **标签页切换**：可在"装备"和"宝石"标签之间切换
- **物品列表**：显示可用的装备或宝石
- **空状态提示**：当没有可用物品时显示提示信息

## 样式特性

### 移动端优化

- 全屏布局，确保一屏显示所有关键信息
- 响应式设计，适配不同屏幕尺寸
- 触摸友好的交互区域
- 超小屏幕（如 iPhone SE）特殊优化

### 视觉效果

- 装备槽：绿色边框表示已填充
- 宝石槽：紫色边框表示已填充
- 精炼按钮：金色激活状态
- 结果反馈：绿色背景表示成功，红色背景表示失败

## 精炼逻辑

当前实现为模拟精炼逻辑，实际应该调用精炼工具函数：

```typescript
// TODO: 实现真实的精炼逻辑
const success = Math.random() > 0.5;
const result: RefineResult = {
  success,
  message: success 
    ? `精炼成功！${equipment.name}的属性得到了提升！` 
    : '精炼失败...装备属性没有变化。',
  attributeChanges: success ? { attack: 10 } : undefined
};
```

## 注意事项

1. **装备过滤**：只显示玩家等级可使用的装备
2. **宝石过滤**：显示可用的宝石，包括强化类宝石（`gemType === 'enhance'`）、镶嵌类宝石（`gemType === 'embed'`）、开洞道具（`gemSubType === 'openHole'`）和战魂道具（`gemSubType === 'soul'`）
3. **状态管理**：关闭模态窗口时会清空选中的装备和宝石
4. **结果自动消失**：精炼结果会在 5 秒后自动消失
5. **切换清空提示**：切换装备或宝石时会立即清空精炼结果提示
6. **新提示覆盖旧提示**：每次出现新提示时，会先清除旧的定时器再设置新的，避免旧的自动清除定时器意外清除新提示

## 后续优化建议

1. 实现真实的精炼逻辑（调用精炼工具函数）
2. 添加精炼成功率显示
3. 添加精炼消耗显示（金币、魔石等）
4. 添加精炼预览功能（显示精炼后的属性变化）
5. 添加精炼历史记录
6. 支持批量精炼

## 相关文件

- [EquipmentItem 类型定义](../../types/index.ts)
- [GemItem 类型定义](../../types/index.ts)
- [RefineResult 类型定义](../../types/index.ts)
- [NPC 数据配置](../../data/npcData.ts)
- [背包数据](../../data/inventoryData.ts)
