# 背包模块 (Inventory Module)

本目录包含背包系统的所有组件。

## 目录结构

```
inventory/
├── index.ts              # 模块导出文件
├── README.md             # 本说明文件
└── inventory.css         # 背包模块样式
```

## 组件说明

### Inventory（待实现）
- **功能**: 背包系统的主组件，管理整个背包界面
- **职责**:
  - 显示玩家资源（金币、魔石）
  - 管理物品分类标签切换
  - 展示物品网格
  - 处理物品详情弹窗
- **Props**: 
  - `items: InventoryItem[]` - 物品列表
  - `resources: PlayerResources` - 玩家资源

### InventoryGrid（待实现）
- **功能**: 显示物品网格
- **特性**:
  - 根据分类过滤物品
  - 显示物品图标、名称、数量
  - 根据稀有度显示不同边框颜色
  - 支持物品点击查看详情
- **Props**: 
  - `items: InventoryItem[]` - 物品列表
  - `onItemClick: (item: InventoryItem) => void` - 物品点击回调

### ItemDetailModal（待实现）
- **功能**: 显示物品详细信息弹窗
- **显示内容**:
  - 物品图标和名称
  - 物品类型和稀有度
  - 物品属性列表
  - 物品描述
  - 获取途径
  - 操作按钮（使用、装备、丢弃等）
- **Props**: 
  - `item: InventoryItem` - 物品数据
  - `onClose: () => void` - 关闭回调
  - `onUse?: (item: InventoryItem) => void` - 使用回调
  - `onEquip?: (item: InventoryItem) => void` - 装备回调

### PlayerResources（待实现）
- **功能**: 显示玩家资源（金币、魔石）
- **显示内容**:
  - 金币图标和数量
  - 魔石图标和数量
- **Props**: 
  - `resources: PlayerResources` - 玩家资源数据

## 数据类型

```typescript
// 物品类型枚举
type ItemType = 'consumable' | 'material' | 'equipment' | 'quest' | 'other';

// 物品稀有度枚举
type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

// 物品属性接口
interface ItemAttribute {
  hp?: number;        // 生命值
  mp?: number;        // 魔法值
  attack?: number;    // 攻击力
  defense?: number;   // 防御力
  stamina?: number;   // 体力
  luck?: number;      // 幸运值
}

// 物品接口
interface InventoryItem {
  id: string;                    // 物品唯一ID
  name: string;                  // 物品名称
  icon: string;                  // 物品图标（emoji或图片路径）
  quantity: number;              // 物品数量
  type: ItemType;                // 物品类型
  rarity: ItemRarity;            // 物品稀有度
  attributes?: ItemAttribute;    // 物品属性
  source?: string;               // 获取途径
  description: string;           // 物品描述
  maxStack?: number;             // 最大堆叠数量
  usable?: boolean;              // 是否可使用
  equippable?: boolean;          // 是否可装备
}

// 玩家资源接口
interface PlayerResources {
  gold: number;        // 金币
  magicStone: number;  // 魔石
}
```

## 物品分类

背包系统支持以下物品分类：

1. **全部**: 显示所有物品
2. **消耗品**: 药水、卷轴等可使用物品
3. **材料**: 合成材料、任务材料等
4. **装备**: 武器、防具、饰品等
5. **任务**: 任务相关物品
6. **技能书**: 用于学习新技能或升级已有技能
7. **宝石**: 用于装备强化和镶嵌
8. **特殊道具**: 打造道具、礼物、矿石等
9. **其他**: 其他类型物品

## 技能书学习功能

### 功能说明
点击背包中的技能书，可以学习对应的技能或升级已有技能。

### 技能书类型
1. **学习新技能**: 使用后学习新的技能（如星魔剑技能书、飞天连斩技能书）
2. **升级技能**: 使用后将已有技能升级到更高级别（如高级风斩、高级星魔剑技能书）
3. **多级升级**: 可升级到5级的技能书（斗志抑扬系列）

### 使用流程
1. 在背包中点击技能书
2. 在物品详情弹窗中点击"使用物品"按钮
3. 学习成功后，技能书被消耗，技能列表中显示新技能
4. 学习失败时，技能书不会被消耗，显示失败原因

### 学习条件
- **学习新技能**: 该技能未被学习
- **升级技能**: 已学习该技能，且当前等级低于目标等级
- **斗志抑扬**: 可从1级依次升级到5级

### 相关文件
- `src/data/skillBooks.ts` - 技能书数据定义
- `src/data/skillData.ts` - 技能数据定义
- `src/utils/skillLearnUtils.ts` - 技能学习工具函数
- `src/utils/skillUtils.ts` - 技能工具函数

## 物品稀有度

物品稀有度通过边框颜色区分：

- **普通 (common)**: 灰色边框 `#888`
- **优秀 (uncommon)**: 绿色边框 `#4caf50`
- **稀有 (rare)**: 蓝色边框 `#2196f3`
- **史诗 (epic)**: 紫色边框 `#9c27b0`
- **传说 (legendary)**: 橙色边框 + 发光效果 `#ff9800`

## 使用示例

```tsx
import { Inventory } from './components/inventory';
import { InventoryItem, PlayerResources } from './types';

// 物品数据
const items: InventoryItem[] = [
  {
    id: 'hp-potion-1',
    name: '生命药水',
    icon: '🧪',
    quantity: 10,
    type: 'consumable',
    rarity: 'common',
    description: '恢复100点生命值',
    source: '商店购买',
    usable: true,
    attributes: { hp: 100 }
  },
  {
    id: 'iron-sword-1',
    name: '铁剑',
    icon: '⚔️',
    quantity: 1,
    type: 'equipment',
    rarity: 'uncommon',
    description: '一把普通的铁剑',
    source: '怪物掉落',
    equippable: true,
    attributes: { attack: 15 }
  }
];

// 玩家资源
const resources: PlayerResources = {
  gold: 1000,
  magicStone: 50
};

// 在主应用中使用
<Inventory items={items} resources={resources} />
```

## 注意事项

1. 背包系统优先保障手机端用户体验，一屏能展示所有信息
2. 物品网格采用4列布局，适应移动端屏幕
3. 物品详情弹窗在移动端居中显示，宽度自适应
4. 所有动画效果使用CSS实现，性能优化
5. 支持物品堆叠显示，最大堆叠数量可配置
