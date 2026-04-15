# 修复装备名称显示问题

## 问题分析

### 问题1：物品基础名称错误
**位置**：`d:\life\code\moyu\src\data\inventoryData.ts#L213-216`

**当前代码**：
```typescript
// 构建装备名称：普通品不显示品质前缀，魔魂等级显示在名称后面
const qualityPrefix = qualityName === '普通品' ? '' : qualityName;
const name = `${qualityPrefix}${baseName}+${magicSoulLevel}`;
```

**问题**：物品的 `name` 字段应该是基础名称（如 "重剑"、"精锻剑"），不应该包含品质前缀和魔魂等级。这会导致：
- 精炼后更新装备名称时，名称会重复包含品质和魔魂信息
- 物品的基础名称被污染，不利于后续处理

**正确做法**：
```typescript
// 物品基础名称不包含品质和魔魂等级
const name = baseName;
```

### 问题2：背包显示装备名称未按规则生成
**位置**：`d:\life\code\moyu\src\components\inventory\ItemGrid.tsx#L148-150`

**当前代码**：
```typescript
<span className="item-list-name">
  {item.name}
</span>
```

**问题**：直接显示 `item.name`，没有按照规则生成显示名称。应该根据规则显示：`${装备品质 === 普通品 ? '' : 装备品质}${装备名称}+${装备魔魂等级}`

**正确做法**：
- 创建一个工具函数 `getEquipmentDisplayName` 来生成装备显示名称
- 在显示装备时调用该函数

## 修复方案

### 步骤1：修改 inventoryData.ts
- 移除 `name` 字段中的品质前缀和魔魂等级
- `name` 字段只存储基础名称（baseName）

### 步骤2：创建装备显示名称生成函数
- 在 `src/utils/equipmentConverter.ts` 中创建 `getEquipmentDisplayName` 函数
- 函数逻辑：`${装备品质 === 普通品 ? '' : 装备品质}${装备名称}+${装备魔魂等级}`

### 步骤3：修改 ItemGrid.tsx
- 导入 `getEquipmentDisplayName` 函数
- 在显示装备名称时调用该函数

### 步骤4：检查其他显示位置
- 检查 `EquipmentModal.tsx`、`EquipmentDisplay.tsx` 等组件
- 确保所有显示装备名称的地方都使用 `getEquipmentDisplayName` 函数

### 步骤5：测试验证
- 测试背包中装备名称显示是否正确
- 测试精炼后装备名称更新是否正确
- 测试魔魂等级提升后名称显示是否正确

## 影响范围

### 需要修改的文件
1. `src/data/inventoryData.ts` - 修改物品基础名称生成逻辑
2. `src/utils/equipmentConverter.ts` - 添加装备显示名称生成函数
3. `src/components/inventory/ItemGrid.tsx` - 修改装备名称显示逻辑
4. `src/components/character/EquipmentDisplay.tsx` - 检查并修改装备名称显示
5. `src/components/character/EquipmentModal.tsx` - 检查并修改装备名称显示

### 不受影响的功能
- 装备精炼逻辑（精炼后更新名称）
- 装备属性计算
- 其他物品类型显示

## 预期结果

修复后，装备名称显示将符合以下规则：
- **普通品装备**：`重剑+0`、`精锻剑+5`
- **良品装备**：`良品重剑+0`、`良品精锻剑+5`
- **上品装备**：`上品重剑+0`、`上品精锻剑+5`
- **精品装备**：`精品重剑+0`、`精品精锻剑+5`
- **极品装备**：`极品重剑+0`、`极品精锻剑+5`

精炼提升魔魂等级后，名称会正确更新显示新的魔魂等级。
