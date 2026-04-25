# 统一角色MP和体力为体力概念的重构计划

## 问题分析

### 当前问题
1. **概念混乱**：角色有 MP（魔法值）和体力两个概念，但实际上应该是同一个东西
2. **数据不一致**：
   - `CharacterData` 只有 `maxStamina/currentStamina`，没有 MP
   - `BattleCharacter` 同时有 `maxMp/currentMp` 和 `maxStamina/currentStamina`
3. **技能消耗不一致**：
   - 攻击技能（风斩、裂地爆斩、星魔剑、飞天连斩）消耗 `stamina`
   - 增益技能（斗志昂扬）消耗 `mp`
4. **状态不同步**：战斗中 MP 被扣除，但战斗结束后不会同步到 `CharacterData`（因为 `CharacterData` 没有 MP 字段）
5. **UI 显示问题**：战斗界面显示 MP 进度条，但实际消耗的是体力

### 影响范围
- 类型定义：`types/index.ts`
- 技能数据：`data/skillData.ts`, `data/skillBooks.ts`
- 战斗适配器：`utils/battleAdapter.ts`
- 战斗组件：`components/battle/Battle.tsx`, `CharacterCard.tsx`, `ActionButtons.tsx`, `CharacterDetailModal.tsx`, `EnemyDetailModal.tsx`
- 技能工具：`utils/skillUtils.ts`
- 其他数据：`data/battleData.ts`

## 重构方案

### 核心原则
- **统一概念**：所有技能消耗统一使用"体力"
- **移除冗余**：移除所有 MP 相关的字段和逻辑
- **保持功能**：确保重构后功能不受损

### 修改步骤

#### Step 1: 类型定义修改 (`types/index.ts`)

1. **修改 `SkillCost` 接口**：
   - 移除 `mp?: number` 字段
   - 保留 `stamina?: number` 字段

2. **修改 `BattleSkill` 接口**：
   - 移除 `mpCost: number` 字段
   - 保留 `staminaCost: number` 字段

3. **修改 `BattleCharacter` 接口**：
   - 移除 `maxMp: number` 字段
   - 移除 `currentMp: number` 字段
   - 保留 `maxStamina: number` 和 `currentStamina: number` 字段

4. **清理其他接口**：
   - 检查并移除 `Character`, `CharacterDetail`, `CharacterStats` 等接口中的 `maxMp/currentMp` 字段（如果有）

#### Step 2: 技能数据修改 (`data/skillData.ts`)

1. **修改"斗志昂扬"技能**：
   - 将 `cost: { mp: 25 }` 改为 `cost: { stamina: 25 }`
   - 更新描述：将"消耗MP"改为"消耗体力"

2. **修改"爱的力量"技能**：
   - 将 `cost: { mp: 0 }` 改为 `cost: { stamina: 0 }`

#### Step 3: 战斗适配器修改 (`utils/battleAdapter.ts`)

1. **修改 `skillToBattleSkill` 函数**：
   - 移除 `currentMp` 参数
   - 移除 `mpCost` 变量和相关逻辑
   - 修改 `isAvailable` 判断逻辑，只检查体力

2. **修改 `characterToBattleCharacter` 函数**：
   - 移除 `maxMp` 计算逻辑
   - 移除 `currentMp: maxMp` 赋值
   - 更新技能转换调用

3. **修改 `createEnemyFromTemplate` 函数**：
   - 移除 `maxMp` 计算逻辑
   - 移除 `currentMp` 赋值

4. **修改 `createEnemyFromEnemyData` 函数**：
   - 移除 `maxMp` 计算逻辑
   - 移除 `currentMp` 赋值
   - 移除默认技能中的 `mpCost` 字段

#### Step 4: 战斗组件修改 (`components/battle/`)

1. **修改 `Battle.tsx`**：
   - 移除 `updateCharacterResources` 函数中的 MP 扣除逻辑
   - 修改敌人 AI 选择技能逻辑，移除 MP 检查
   - 移除传递给 `ActionButtons` 的 `currentMp` prop

2. **修改 `CharacterCard.tsx`**：
   - 移除 MP 进度条显示
   - 添加体力进度条显示（如果还没有）

3. **修改 `ActionButtons.tsx`**：
   - 移除 `currentMp` prop
   - 移除 `hasEnoughMp` 检查
   - 移除 MP 不足提示
   - 移除 MP 消耗显示

4. **修改 `CharacterDetailModal.tsx`**：
   - 移除 MP 显示
   - 添加体力显示

5. **修改 `EnemyDetailModal.tsx`**：
   - 移除 MP 显示
   - 添加体力显示

#### Step 5: 技能工具修改 (`utils/skillUtils.ts`)

1. **修改 `canUseSkill` 函数**：
   - 移除 `currentMp` 参数
   - 移除 MP 检查逻辑

#### Step 6: 其他数据修改

1. **修改 `data/battleData.ts`**：
   - 移除技能数据中的 `mpCost` 字段

2. **修改 `data/skillBooks.ts`**：
   - 检查并更新技能书描述中的消耗说明

#### Step 7: 验证

1. 运行 TypeScript 类型检查
2. 测试战斗系统功能
3. 测试技能消耗体力功能
4. 测试战斗结束后体力同步

## 详细修改清单

### 文件修改列表

| 文件路径 | 修改内容 |
|---------|---------|
| `src/types/index.ts` | 移除 MP 相关字段 |
| `src/data/skillData.ts` | 将斗志昂扬的 mp 消耗改为 stamina |
| `src/utils/battleAdapter.ts` | 移除 MP 相关逻辑 |
| `src/components/battle/Battle.tsx` | 移除 MP 扣除和检查逻辑 |
| `src/components/battle/CharacterCard.tsx` | 移除 MP 显示，添加体力显示 |
| `src/components/battle/ActionButtons.tsx` | 移除 MP 相关逻辑 |
| `src/components/battle/CharacterDetailModal.tsx` | 移除 MP 显示 |
| `src/components/battle/EnemyDetailModal.tsx` | 移除 MP 显示 |
| `src/utils/skillUtils.ts` | 移除 MP 检查逻辑 |
| `src/data/battleData.ts` | 移除 mpCost 字段 |

### 类型定义变更

```typescript
// 修改前
export interface SkillCost {
  mp?: number;
  stamina?: number;
  hp?: number;
  gold?: number;
}

// 修改后
export interface SkillCost {
  stamina?: number;
  hp?: number;
  gold?: number;
}

// 修改前
export interface BattleSkill {
  // ...
  mpCost: number;
  staminaCost: number;
  // ...
}

// 修改后
export interface BattleSkill {
  // ...
  staminaCost: number;
  // ...
}

// 修改前
export interface BattleCharacter {
  // ...
  maxMp: number;
  currentMp: number;
  maxStamina: number;
  currentStamina: number;
  // ...
}

// 修改后
export interface BattleCharacter {
  // ...
  maxStamina: number;
  currentStamina: number;
  // ...
}
```

## 风险评估

### 低风险
- 类型定义修改：TypeScript 编译器会捕获所有类型错误
- 技能数据修改：简单的值替换

### 中等风险
- 战斗组件修改：需要仔细测试战斗流程
- UI 显示修改：需要验证界面显示正确

### 缓解措施
1. 每个步骤完成后运行类型检查
2. 逐步修改，每次修改后测试
3. 保留体力相关的所有逻辑，只移除 MP 相关逻辑

## 预期结果

1. 所有技能消耗统一使用体力
2. 战斗界面显示体力条，不再显示 MP 条
3. 战斗结束后体力正确同步到角色数据
4. 功能完全正常，无任何损失
