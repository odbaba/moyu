# 经验导师NPC实现计划

## 需求概述
在卡萨诺城地点的交互按钮区增加经验导师NPC，提供装备换经验球的功能。

### NPC描述
"每一件装备都有都有一股神秘的力量，我可以帮你将其提练出来放到经验球里面。只有良品以上或都有洞的装备才可以提练。

良品可以换1个满的经验球，上品可以换2个，精品可以换3个，极品可以换4个。如果装备有一个洞的话可以多2个经验球，二洞多5个。魔魂等级达到+9的可以多换1，达到+12的多2个。"

### 交互选项
1. **用装备换经验球** - 点击后弹出装备选择弹窗，支持多选装备
2. **哦，知道了** - 点击后退出交互

### 经验球计算规则
| 条件 | 经验球数量 |
|------|-----------|
| 良品 | 1个 |
| 上品 | 2个 |
| 精品 | 3个 |
| 极品 | 4个 |
| 一洞 | +2个 |
| 二洞 | +5个 |
| 魔魂+9 | +1个 |
| 魔魂+12 | +2个 |

**注意**: 只有良品以上（品质>=1）或有洞（holeCount>0）的装备才可以提练。

---

## 实现步骤

### 步骤1: 创建经验球计算工具函数
**文件**: `src/utils/exchangeUtils.ts` (新建)

创建以下函数：
- `calculateExperienceBalls(equipment: EquipmentItem): number` - 计算单个装备可换取的经验球数量
- `canExchangeEquipment(equipment: EquipmentItem): boolean` - 判断装备是否可交换
- `calculateTotalExperienceBalls(equipments: EquipmentItem[]): number` - 计算多个装备的总经验球数量

### 步骤2: 创建经验交换弹窗组件
**文件**: `src/components/common/ExperienceExchangeModal.tsx` (新建)
**样式**: `src/components/common/ExperienceExchangeModal.css` (新建)

组件功能：
- 显示背包中可交换的装备列表
- 支持多选装备（复选框或点击选中）
- 显示每个装备可换取的经验球数量
- 显示已选装备的总经验球数量
- 确认按钮执行交换
- 取消按钮关闭弹窗

### 步骤3: 添加NPC配置
**文件**: `src/data/npcData.ts`

添加经验导师NPC配置：
```typescript
const npc_experience_mentor: NPCInteractable = {
  id: 'npc_experience_mentor',
  type: 'npc',
  name: '经验导师',
  icon: '🔮',
  description: '每一件装备都有都有一股神秘的力量...',
  location: 'kasanuocheng',
  npcType: 'function',
  options: [
    {
      text: '用装备换经验球',
      result: '打开装备交换界面。',
      actionType: 'openExperienceExchange',
      actionParams: {},
    },
    {
      text: '哦，知道了',
      result: '好的，有需要再来找我。',
      actionType: 'close',
      actionParams: {},
    },
  ],
};
```

更新 `npcConfig` 和 `npcByLocation` 导出。

### 步骤4: 更新地点数据
**文件**: `src/data/gameData.ts`

在卡萨诺城的 `interactables` 数组中添加 `'npc_experience_mentor'`。

### 步骤5: 更新App.tsx
**文件**: `src/App.tsx`

1. 导入新组件和工具函数
2. 添加状态: `showExperienceExchangeModal`
3. 在 `handleNPCOptionSelect` 中添加 `openExperienceExchange` case
4. 渲染 `ExperienceExchangeModal` 组件

### 步骤6: 更新组件导出
**文件**: `src/components/common/index.ts`

导出 `ExperienceExchangeModal` 组件。

---

## 文件变更清单

| 操作 | 文件路径 |
|------|---------|
| 新建 | `src/utils/exchangeUtils.ts` |
| 新建 | `src/components/common/ExperienceExchangeModal.tsx` |
| 新建 | `src/components/common/ExperienceExchangeModal.css` |
| 修改 | `src/data/npcData.ts` |
| 修改 | `src/data/gameData.ts` |
| 修改 | `src/App.tsx` |
| 修改 | `src/components/common/index.ts` |

---

## 关键代码参考

### 品质定义 (inventoryData.ts)
```typescript
QUALITY_NAMES: {
  0: '普通品',
  1: '良品',
  2: '上品',
  3: '精品',
  4: '极品'
}
```

### 装备属性 (EquipmentItem)
- `equipmentQuality`: 装备品质 (普通品/良品/上品/精品/极品)
- `magicSoulLevel`: 魔魂等级 (0-12)
- `holeCount`: 宝石洞数量 (0-2)

### 满经验球模板 (inventoryData.ts)
```typescript
manJingYanQiu: {
  id: 'consumable_manjingyanqiu',
  name: '满经验球',
  icon: '🔮',
  type: 'consumable',
  ...
}
```

### 参考实现
- NPC配置: `src/data/npcData.ts` 中的 `npc_collector`
- 物品选择弹窗: `src/components/common/CollectorModal.tsx`
- NPC交互处理: `src/App.tsx` 中的 `handleNPCOptionSelect`
