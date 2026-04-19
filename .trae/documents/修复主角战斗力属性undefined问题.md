# 主角战斗力属性undefined问题修复计划

## 问题分析

### 根本原因
在 [App.tsx:L1019](file:///d:/life/code/moyu/src/App.tsx#L1019) 中调用 `calculateCombatPowerBonusExp(reward.exp!, character.combatPower, character.level)` 时，`character.combatPower` 为 `undefined`。

### 问题链条
1. **类型定义问题**: 在 [types/index.ts:L228](file:///d:/life/code/moyu/src/types/index.ts#L228)，`combatPower` 被定义为**可选属性** (`combatPower?: number`)
2. **初始化缺失**: 在 [characterData.ts:L141-185](file:///d:/life/code/moyu/src/data/characterData.ts#L141-L185)，`exampleCharacter` 初始化时**没有设置** `combatPower` 属性
3. **战斗中使用正确**: 战斗系统在 [battleAdapter.ts:L125](file:///d:/life/code/moyu/src/utils/battleAdapter.ts#L125) 会通过 `calculateTotalCombatPower()` 计算并赋值 `battleCharacter.combatPower`
4. **非战斗场景缺失**: 但在非战斗场景（如任务奖励发放）直接使用 `character.combatPower` 时，该属性为 `undefined`

## 修复方案

### 步骤1: 修改类型定义
- **文件**: `d:\life\code\moyu\src\types\index.ts`
- **位置**: L228
- **改动**: 将 `combatPower?: number;` 改为 `combatPower: number;`（从可选改为必需）

### 步骤2: 在 characterData 中引入战斗力计算
- **文件**: `d:\life\code\moyu\src\data\characterData.ts`
- **改动**: 
  - 导入 `calculateTotalCombatPower` 函数
  - 导入 pet 相关数据（初始幻兽）
  - 在 `playerCharacter` 对象中添加 `combatPower` 属性，通过 `calculateTotalCombatPower()` 计算

### 步骤3: 检查其他创建/更新 character 的地方
- **文件**: `d:\life\code\moyu\src\App.tsx` 及其他相关文件
- **改动**: 
  - 搜索所有创建或更新 `CharacterData` 的地方
  - 确保每次更新都包含 `combatPower` 的计算和赋值

### 步骤4: 验证和测试
- 确保游戏启动时 `character.combatPower` 有正确的初始值
- 确保在 [App.tsx:L1019](file:///d:/life/code/moyu/src/App.tsx#L1019) 处不再出现 undefined
- 运行 lint 检查

## 实施细节

### 修改 types/index.ts
```typescript
// 修改前
combatPower?: number; // 角色战斗力

// 修改后
combatPower: number; // 角色战斗力（必须，进入游戏时计算）
```

### 修改 characterData.ts
```typescript
// 添加导入
import { calculateTotalCombatPower } from '../utils/combatPower';
import { initialPets } from './petData';

// 在 playerCharacter 对象末尾添加
combatPower: 0, // 初始值，后面会重新计算

// 导出时重新计算
export const exampleCharacter: CharacterData = {
  ...playerCharacter,
  combatPower: calculateTotalCombatPower(playerCharacter, initialPets)
};
```

### 检查 App.tsx 中的 character 更新
- 搜索所有 `setCharacter` 调用
- 确保在使用 `gainCharacterExperience` 等函数后，战斗力属性被正确更新
- 可能需要在使用 `character.combatPower` 的地方添加防御性代码（如使用 `character.combatPower || 0`）
