# 装备追加属性显示修复计划

## 问题分析

### 根本原因
当前装备详情弹窗 (`EquipmentDetailModal.tsx`) 和背包物品详情弹窗 (`ItemDetailModal.tsx`) 的追加属性（追加攻击/追加防御）是通过读取存储的属性来展示的：

```typescript
// EquipmentDetailModal.tsx - 旧逻辑
const baseDefense = equipment.baseDefense ?? 0;
const bonusDefense = equipment.bonusDefense ?? 0;
```

而这些存储属性 (`baseDefense`/`bonusDefense`) 存在以下问题：
1. **旧存档没有这些字段**，导致显示为 0
2. **魔魂等级提升后没有同步更新**这些字段，导致显示旧值
3. **推算逻辑不准确**（之前的手动推算与真实公式有细微差异）

### 正确的计算逻辑
角色页面的攻击/防御悬浮弹窗使用的计算逻辑（位于 `src/utils/attributeCalculator.ts`）才是正确的：

- `calculateEquipmentBaseAttributes(equipment)` — 根据 `equipment.useLevel` × 系数表计算基础属性
- `calculateEquipmentBonusAttributes(equipment)` — 根据 `Math.floor(基础属性 / 10) * magicSoulLevel` 计算追加属性

这个方案不需要任何存储字段，永远根据当前 `useLevel` 和 `magicSoulLevel` 动态计算，始终正确。

### 系数表
```typescript
// attributeCalculator.ts − EQUIPMENT_BASE_COEFFICIENTS
weapon:   { attackMin: 20, attackMax: 30, defense: 0 }
helmet:   { attackMin: 0,  attackMax: 0,  defense: 12 }
clothes:  { attackMin: 0,  attackMax: 0,  defense: 18 }
shoes:    { attackMin: 0,  attackMax: 0,  defense: 8 }
bracelet: { attackMin: 10, attackMax: 15, defense: 0 }
necklace: { attackMin: 15, attackMax: 20, defense: 0 }
```

---

## 修改计划

### 步骤 1：修复 `EquipmentDetailModal.tsx` — 使用 attributeCalculator 动态计算

**文件**：`src/components/common/EquipmentDetailModal.tsx`  
**当前代码位置**：第 115-140 行（baseDefense/bonusDefense 推算逻辑块）

**修改内容**：
- 删除所有手动的 `baseDefense` 推算逻辑（第 115-140 行）
- 改为直接调用 `attributeCalculator.ts` 的 `calculateEquipmentBaseAttributes` 和 `calculateEquipmentBonusAttributes`
- 这两个函数根据 `equipment.useLevel` 和 `equipment.magicSoulLevel` 动态计算，始终正确

**修改后的代码**：
```typescript
import { calculateEquipmentBaseAttributes, calculateEquipmentBonusAttributes } from '../../utils/attributeCalculator';

// 在组件内部：
const baseAttrs = calculateEquipmentBaseAttributes(equipment);
const bonusAttrs = calculateEquipmentBonusAttributes(equipment);

// 攻击型装备使用：
baseAttrs.attackMin, baseAttrs.attackMax  // 基础攻击
bonusAttrs.attackMin, bonusAttrs.attackMax  // 追加攻击

// 防御型装备使用：
baseAttrs.defense   // 基础防御
bonusAttrs.defense  // 追加防御
```

---

### 步骤 2：修复 `ItemDetailModal.tsx` — 使用 attributeCalculator 动态计算

**文件**：`src/components/inventory/ItemDetailModal.tsx`  
**当前代码位置**：第 81-82 行（local 的 calculateAddDefense 函数）

**修改内容**：
- 删除本地的 `calculateAddAttack` 和 `calculateAddDefense` 函数（第 80-82 行）
- 改为导入并调用 `attributeCalculator.ts` 的 `calculateEquipmentBaseAttributes` 和 `calculateEquipmentBonusAttributes`
- 需要先将 `EquipmentItem` 的关键字段映射到函数参数格式

**注意**：`ItemDetailModal` 接收的是 `EquipmentItem` 类型，而 `calculateEquipmentBaseAttributes` 需要 `{ type: EquipmentSlotType, useLevel: number }` 格式。可以直接传递 `{ type: equip.equipmentType, useLevel: equip.useLevel }`。

对于 `calculateEquipmentBonusAttributes`，需要 `{ type: ..., useLevel: ..., magicSoulLevel: ... }` 格式。

---

### 步骤 3：修复 `equipmentConverter.ts` — `equipmentItemToDetail` 使用 attributeCalculator

**文件**：`src/utils/equipmentConverter.ts`  
**当前代码位置**：第 214-274 行

**修改内容**：
- 将 `baseAttackMin`/`baseAttackMax`/`baseDefense` 的计算从读取 `item.attackMin`/`item.defense` 改为调用 `calculateEquipmentBaseAttributes`
- 将 `bonusAttackMin`/`bonusAttackMax`/`bonusDefense` 的计算从 `calculateMagicSoulBonus` 改为调用 `calculateEquipmentBonusAttributes`
- 这两个函数逻辑一致，但统一使用 attributeCalculator 的函数可以确保一致性

---

### 步骤 4：修复 `equipmentConverter.ts` — `equipmentDetailToItem` 使用 attributeCalculator

**文件**：`src/utils/equipmentConverter.ts`  
**当前代码位置**：第 281-325 行

**修改内容**：
- 同样改为使用 `calculateEquipmentBaseAttributes` 计算基础属性
- 使用 `calculateEquipmentBonusAttributes` 计算追加属性
- 移除第 284-296 行手动推算 `baseDefense` 的逻辑

---

### 步骤 5：类型检查验证

运行 `npx tsc --noEmit` 确保所有改动无类型错误。

---

## 好处

1. **始终正确**：不需要存储 `baseDefense`/`bonusDefense` 等字段，每次根据 `useLevel` 和 `magicSoulLevel` 动态计算
2. **与新/老数据兼容**：旧存档没有这些字段也能正确显示
3. **与角色面板一致**：和攻击/防御悬浮弹窗使用完全相同的计算逻辑
4. **代码简洁**：不需要手动的属性推算和 fallback 逻辑
