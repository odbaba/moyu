# 装备精炼改进计划

## 问题描述
当前装备精炼完成后，装备选择框中的装备会消失，宝石选择框中的宝石也会消失，需要重新选择。

## 需求
- 装备精炼完成后：
1. 装备选择框中保留装备，并更新为最新状态
2. 如果背包中还有相同类型的宝石，宝石选择框中的宝石也保留，不需要重新选择

## 实现计划

### 1. 修改类型定义
- 更新 `RefineResult` 接口，添加 `updatedEquipment` 和 `usedGem` 字段
- 位置：`src/types/index.ts`

### 2. 修改精炼函数
- 更新所有精炼函数（`refineQuality`, `refineMagicSoul`, `refineUseLevel`, `refineOpenHole`, `embedGem`, `activateSoul`）
- 让它们返回更新后的装备和使用的宝石信息
- 位置：`src/utils/equipmentRefine.ts`

### 3. 修改装备精炼模态窗口
- 更新 `handleRefine` 函数，保留装备和宝石
- 位置：`src/components/common/EquipmentRefineModal.tsx`

### 4. 修改 App.tsx 中的 handleRefine
- 不再清空装备和宝石选择
- 根据精炼成功时更新装备为最新状态
- 检查背包中是否还有相同类型的宝石，保留宝石选择
- 位置：`src/App.tsx`

## 文件清单

1. `src/types/index.ts`
2. `src/utils/equipmentRefine.ts`
3. `src/components/common/EquipmentRefineModal.tsx`
4. `src/App.tsx`

## 预期结果
精炼完成后：
- 装备选择框保留装备，并显示最新属性
- 如果背包中还有相同类型的宝石，宝石选择框也保留
- 可以直接进行下一次精炼
