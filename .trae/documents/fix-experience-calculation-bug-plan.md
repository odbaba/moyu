# 修复经验计算逻辑问题计划

## 一、问题分析

### 1.1 当前问题

`calculateNextLevelMaxExp` 函数存在严重的逻辑错误：

```typescript
// 50级以上，每次升级增加固定值
else {
  // 在50级时计算固定值（50级所需经验的20%）
  // 注意：这里的 hun 值在50级时计算，之后保持不变
  const hun = currentLevel === 50 ? Math.round(currentMaxExp * 0.2) : 0;

  return currentMaxExp + hun;
}
```

**问题根源**：
- 当角色从50级升到51级时，`currentLevel` 是51，所以 `hun` 永远是0
- 这导致51级及以后的经验计算完全错误
- 每次调用都会返回 `currentMaxExp + 0`，经验值不再增长

### 1.2 正确的实现

`preCalculateMaxExpTable` 函数已经正确实现了经验计算逻辑：

```typescript
// 在51级时计算固定值（50级所需经验的20%）
if (level === 51) {
  hun = Math.round(maxExp * 0.2);
}
maxExp += hun;
```

**正确之处**：
- 在 level === 51 时计算 hun 值
- 之后每次升级都累加这个固定的 hun 值
- 使用 Map 存储所有等级的经验需求

## 二、修复方案

### 2.1 删除错误的函数

**需要删除的函数**：
1. `calculateNextLevelMaxExp` - 有逻辑错误的函数
2. `calculateMaxExp` - 依赖于错误函数的函数

**原因**：
- `preCalculateMaxExpTable` 已经提供了正确的实现
- `MAX_EXP_TABLE` 已经预计算好所有等级的经验需求
- 不需要实时计算，直接查表即可

### 2.2 修改 gainCharacterExperience 函数

**当前实现**（第387行）：
```typescript
// 计算下一级所需经验
newMaxExp = calculateNextLevelMaxExp(newLevel, newMaxExp);
```

**修改为**：
```typescript
// 从预计算表中获取下一级所需经验
newMaxExp = MAX_EXP_TABLE.get(newLevel) || newMaxExp;
```

### 2.3 更新导入

**文件**：`src/App.tsx`

**当前导入**（第51行）：
```typescript
import { calculateCharacterBaseAttributes, calculateNextLevelMaxExp, gainCharacterExperience } from './utils/attributeCalculator';
```

**修改为**：
```typescript
import { calculateCharacterBaseAttributes, gainCharacterExperience } from './utils/attributeCalculator';
```

### 2.4 更新相关文档

需要更新以下文档中关于经验计算的说明：
- `.trae/documents/character-level-up-logic-refactoring-plan.md`
- 其他可能引用 `calculateNextLevelMaxExp` 的文档

## 三、实施步骤

### 步骤1：修改 gainCharacterExperience 函数（优先级：高）
- 文件：`src/utils/attributeCalculator.ts`
- 操作：使用 `MAX_EXP_TABLE.get(newLevel)` 替换 `calculateNextLevelMaxExp`
- 预计时间：5分钟

### 步骤2：删除错误的函数（优先级：高）
- 文件：`src/utils/attributeCalculator.ts`
- 操作：删除 `calculateNextLevelMaxExp` 和 `calculateMaxExp` 函数
- 预计时间：5分钟

### 步骤3：更新 App.tsx 导入（优先级：高）
- 文件：`src/App.tsx`
- 操作：移除 `calculateNextLevelMaxExp` 的导入
- 预计时间：2分钟

### 步骤4：更新相关文档（优先级：中）
- 文件：`.trae/documents/character-level-up-logic-refactoring-plan.md`
- 操作：更新文档中关于经验计算的说明
- 预计时间：10分钟

### 步骤5：测试验证（优先级：低）
- 操作：测试角色升级，特别是50级以上的升级
- 预计时间：15分钟

## 四、详细修改内容

### 4.1 attributeCalculator.ts 修改

#### 修改点1：gainCharacterExperience 函数

**位置**：第387行

**修改前**：
```typescript
// 计算下一级所需经验
newMaxExp = calculateNextLevelMaxExp(newLevel, newMaxExp);
```

**修改后**：
```typescript
// 从预计算表中获取下一级所需经验
newMaxExp = MAX_EXP_TABLE.get(newLevel) || newMaxExp;
```

#### 修改点2：删除错误函数

**删除以下代码**（第247-291行）：
```typescript
/**
 * 计算下一级所需经验
 * 根据参考代码 DefineSprite_932/frame_1/DoAction.as 的逻辑
 * @param currentLevel 当前等级
 * @param currentMaxExp 当前升级所需经验
 * @returns 下一级升级所需经验
 */
export function calculateNextLevelMaxExp(currentLevel: number, currentMaxExp: number): number {
  // 20级前，每次升级所需经验是上一级的1.2倍
  if (currentLevel < 20) {
    return Math.round(currentMaxExp * 1.2);
  }
  // 20-50级，每次升级所需经验是上一级的1.1倍
  else if (currentLevel <= 50) {
    return Math.round(currentMaxExp * 1.1);
  }
  // 50级以上，每次升级增加固定值
  else {
    // 在50级时计算固定值（50级所需经验的20%）
    // 注意：这里的 hun 值在50级时计算，之后保持不变
    const hun = currentLevel === 50 ? Math.round(currentMaxExp * 0.2) : 0;

    return currentMaxExp + hun;
  }
}

/**
 * 计算指定等级的升级所需经验
 * @param targetLevel 目标等级
 * @returns 升级所需经验
 */
export function calculateMaxExp(targetLevel: number): number {
  // 1级升2级需要10经验
  if (targetLevel === 1) {
    return 10;
  }

  // 递归计算
  let maxExp = 10;
  for (let level = 1; level < targetLevel; level++) {
    maxExp = calculateNextLevelMaxExp(level, maxExp);
  }

  return maxExp;
}
```

### 4.2 App.tsx 修改

**位置**：第51行

**修改前**：
```typescript
import { calculateCharacterBaseAttributes, calculateNextLevelMaxExp, gainCharacterExperience } from './utils/attributeCalculator';
```

**修改后**：
```typescript
import { calculateCharacterBaseAttributes, gainCharacterExperience } from './utils/attributeCalculator';
```

## 五、注意事项

### 5.1 性能优化
- 使用预计算表 `MAX_EXP_TABLE` 比实时计算更高效
- Map 的查询时间复杂度是 O(1)，性能极佳

### 5.2 数据一致性
- 确保所有等级的经验需求都正确
- 特别是50级以上的经验增长

### 5.3 代码规范
- 删除不再使用的函数
- 更新相关文档
- 保持代码整洁

## 六、预期效果

### 6.1 修复问题
- 51级及以后的经验计算将正确
- 角色可以正常升级到125级

### 6.2 性能提升
- 使用预计算表，查询速度更快
- 减少不必要的重复计算

### 6.3 代码质量
- 删除有问题的函数
- 使用更可靠的预计算方案
- 提高代码可维护性

## 七、相关文件

- `src/utils/attributeCalculator.ts` - 经验计算逻辑
- `src/App.tsx` - 主应用逻辑
- `.trae/documents/character-level-up-logic-refactoring-plan.md` - 相关文档

## 八、风险评估

### 8.1 技术风险
- **低风险**：修改简单直接，使用已有的正确实现
- **低风险**：预计算表已经过验证

### 8.2 兼容性风险
- **低风险**：只影响内部实现，不影响外部接口
- **低风险**：`gainCharacterExperience` 的返回值不变

### 8.3 用户体验风险
- **低风险**：修复后用户体验更好
- **低风险**：角色可以正常升级

## 九、总结

本计划旨在修复经验计算逻辑的严重bug，通过使用预计算表替代实时计算，确保51级及以后的经验计算正确。实施过程分为5个步骤，预计总时间约40分钟。
