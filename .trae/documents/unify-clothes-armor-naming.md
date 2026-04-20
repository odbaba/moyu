# 统一 clothes 和 armor 命名计划

## 问题分析

### 使用情况统计

| 名称 | 使用文件数 | 用途 |
|------|-----------|------|
| `clothes` | 16个文件 | `EquipmentSlotType` 类型的值，表示衣服槽位 |
| `armor` | 4个文件 | 图片目录名、旧的 `EquipmentType` 类型值 |

### 结论

**保留 `clothes`**，删除 `armor`。原因：
1. `clothes` 是 `EquipmentSlotType` 的标准值，在核心逻辑中广泛使用
2. `armor` 主要出现在：
   - 图片目录名（需要重命名）
   - 旧的 `EquipmentType` 类型（遗留代码，可删除）
   - `ItemDetailModal.tsx` 中的 bug（应该用 `clothes`）

---

## 实施步骤

### 步骤1：重命名图片目录
- 将 `public/images/equipment/armor/` 重命名为 `public/images/equipment/clothes/`

### 步骤2：修改 inventoryData.ts
- 删除 `imageDir` 映射逻辑
- 直接使用 `equipmentType` 作为图片目录名

**修改前：**
```typescript
const imageDir = equipmentType === 'clothes' ? 'armor' : equipmentType;
imagePath: `./images/equipment/${imageDir}/lv${useLevel}.png`,
```

**修改后：**
```typescript
imagePath: `./images/equipment/${equipmentType}/lv${useLevel}.png`,
```

### 步骤3：修复 ItemDetailModal.tsx 中的 bug
- 将 `'armor'` 改为 `'clothes'`

**修改前：**
```typescript
const isDefenseType = ['helmet', 'armor', 'shoes'].includes(equip.equipmentType);
```

**修改后：**
```typescript
const isDefenseType = ['helmet', 'clothes', 'shoes'].includes(equip.equipmentType);
```

### 步骤4：清理 types/index.ts 中的遗留代码
- 删除 `EquipmentType` 类型定义（第62行）
- 删除 `Equipment` 接口（第65-83行）
- 删除 `CharacterEquipment` 接口（第77-84行）

这些是遗留代码，当前项目使用的是：
- `EquipmentSlotType` - 装备槽位类型
- `EquipmentDetail` - 详细装备接口
- `EquipmentItem` - 装备物品接口

### 步骤5：更新 character/README.md 文档
- 将 `type: 'weapon' | 'armor' | 'accessory'` 改为 `type: EquipmentSlotType`
- 更新相关接口说明

### 步骤6：运行类型检查验证
- 执行 `npx tsc --noEmit` 确保无类型错误

---

## 文件修改清单

| 文件 | 操作 |
|------|------|
| `public/images/equipment/armor/` | 重命名为 `clothes/` |
| `src/data/inventoryData.ts` | 删除 imageDir 映射 |
| `src/components/inventory/ItemDetailModal.tsx` | 修复 armor → clothes |
| `src/types/index.ts` | 删除遗留的 EquipmentType、Equipment、CharacterEquipment |
| `src/components/character/README.md` | 更新文档 |

---

## 风险评估

- **低风险**：修改仅涉及命名统一和遗留代码清理
- **兼容性**：`clothes` 已是主要使用的命名，此次修改是消除不一致
