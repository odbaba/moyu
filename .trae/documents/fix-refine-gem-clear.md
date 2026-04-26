# 装备精炼宝石消耗后自动清空问题修复计划

## 问题描述

在装备精炼页面，当背包里只有一个灵魂王宝石时，执行一次精炼消耗掉了，背包没有灵魂王宝石了，但精炼页面仍然显示可以继续精炼。

## 问题定位

**问题代码位置**: `src/App.tsx` 第 3787-3799 行

```typescript
// 检查背包中是否还有相同的宝石，如果有则保留，否则清空
if (refineGem && result.usedGem) {
  // 使用 setTimeout 确保我们拿到最新的 inventory 状态
  setTimeout(() => {
    const hasRemainingGem = inventory.some(  // ❌ 这里的 inventory 是闭包中的旧值
      item => item.name === result.usedGem!.name && item.quantity > 0
    );

    if (!hasRemainingGem) {
      setRefineGem(null);
    }
  }, 0);
}
```

**问题原因**:
1. `setTimeout` 回调中的 `inventory` 是闭包捕获的旧值，不是 `setInventory` 更新后的最新状态
2. React 的状态更新是异步的，`setTimeout(..., 0)` 无法保证获取到最新状态
3. 因此检查 `hasRemainingGem` 时使用的是旧的 `inventory`，导致判断错误

## 修复方案

### 方案：在 setInventory 回调中直接处理

在 `setInventory` 更新完成后，直接在同一个回调中判断是否需要清空 `refineGem`。

**修改位置**: `src/App.tsx` `handleRefine` 函数

**修改内容**:

1. 删除原有的 `setTimeout` 检查逻辑（第 3787-3799 行）

2. 在 `setInventory` 回调中，更新完成后直接返回一个标志，用于判断是否需要清空宝石

3. 使用 `useEffect` 监听 `inventory` 变化，当宝石数量为 0 时自动清空 `refineGem`

### 具体实现步骤

#### 步骤 1: 添加 useEffect 监听宝石数量变化

在 `App.tsx` 中添加一个 `useEffect`，监听 `inventory` 和 `refineGem` 的变化：

```typescript
// 当背包中宝石数量为0时，自动清空精炼界面选中的宝石
useEffect(() => {
  if (refineGem) {
    const hasRemainingGem = inventory.some(
      item => item.name === refineGem.name && item.quantity > 0
    );
    if (!hasRemainingGem) {
      setRefineGem(null);
    }
  }
}, [inventory, refineGem]);
```

#### 步骤 2: 删除原有错误的 setTimeout 逻辑

删除 `handleRefine` 函数中第 3787-3799 行的 `setTimeout` 代码块。

## 修改文件清单

| 文件 | 修改内容 |
|-----|---------|
| `src/App.tsx` | 1. 添加 useEffect 监听宝石数量变化<br>2. 删除 handleRefine 中的 setTimeout 逻辑 |

## 验证方法

1. 在商店购买 1 个灵魂王宝石
2. 打开装备精炼界面
3. 选择装备和灵魂王宝石
4. 执行精炼
5. 验证：精炼成功后，宝石槽应该自动清空，不再显示该宝石
