# 日常任务官交互逻辑优化计划

## 一、优化目标

参考 `/reference/docs/日常任务官交互逻辑文档.md`，优化当前日常任务官的交互逻辑，使其更符合原始设计，提供完整的任务系统功能。

## 二、当前实现分析

### 2.1 已实现的功能

1. **基础任务配置** (`src/data/dailyTaskData.ts`)
   - 定义了7天的日常任务配置
   - 包含任务类型、奖励、需求等基础信息

2. **任务工具函数** (`src/utils/dailyTaskUtils.ts`)
   - `getDailyTask()` - 获取指定星期的任务
   - `checkTaskCompletion()` - 检查任务是否完成
   - `claimTaskReward()` - 领取任务奖励
   - `getTaskDescription()` - 获取任务描述

3. **NPC配置** (`src/data/npcData.ts`)
   - 定义了日常任务官NPC
   - 包含基础的交互选项

4. **基础交互** (`src/App.tsx`)
   - `acceptDailyTask` - 接受任务的基础逻辑

### 2.2 存在的问题

#### 问题1：任务状态管理缺失
- **参考文档**：使用 `rw_bs`、`rw_hs`、`rw_dxc` 等状态变量控制任务完成
- **当前实现**：缺少任务状态管理，无法跟踪任务是否已完成
- **影响**：玩家可以重复完成任务，无法正确控制任务次数

#### 问题2：任务完成逻辑不完善
- **参考文档**：
  - 收集宝石任务：根据玩家等级动态计算所需数量
  - 训练幻兽任务：检查幻兽类型和品质
  - 突袭任务：检查是否击败冰雪巨人
  - PK赛任务：检查是否参加PK赛
  - 地下城任务：检查是否完成地下城
- **当前实现**：只有基础框架，缺少详细的完成条件检查
- **影响**：任务完成判断不准确

#### 问题3：每日重置系统缺失
- **参考文档**：`nextday()` 函数处理每日重置，重置任务状态和怪物刷新
- **当前实现**：没有重置机制
- **影响**：任务状态无法在新的一天重置

#### 问题4：任务描述不够详细
- **参考文档**：根据玩家等级动态生成任务要求
  - < 100级：收集灵魂晶石，数量 = (等级+10) / 10
  - 100-109级：收集灵魂王 2个
  - 110-119级：收集灵魂王 5个
  - ≥ 120级：收集灵魂王 10个
- **当前实现**：固定配置，缺少动态计算
- **影响**：任务难度不符合玩家等级

#### 问题5：NPC交互逻辑不完整
- **参考文档**：
  - 完整的对话流程（问候语 → 任务信息 → 选项）
  - 根据星期显示不同任务
  - 任务完成后的奖励发放
  - 传送功能（周五、周六、周日）
- **当前实现**：只有基础的接受任务功能
- **影响**：用户体验不完整

#### 问题6：奖励发放逻辑不完善
- **参考文档**：
  - 收集灵魂晶石：经验 = 30000 × 数量，功勋 = 500
  - 收集灵魂王：经验 = 210000 × 数量，功勋 = 2000
  - 训练幻兽：根据星级给予魔石（5000/10000/50000），战功 = 1000
- **当前实现**：只有基础框架
- **影响**：奖励发放不准确

#### 问题7：与其他系统的交互缺失
- **参考文档**：
  - 背包系统：检查和消耗物品
  - 幻兽系统：检查和上交幻兽
  - 地图系统：传送功能
  - 时间系统：判断当前星期
- **当前实现**：缺少这些集成
- **影响**：任务系统无法与其他系统联动

## 三、优化方案

### 3.1 任务状态管理优化

#### 步骤1：定义任务状态接口
**文件**：`src/types/index.ts`

**需要添加的类型**：
```typescript
// 日常任务状态管理接口
export interface DailyTaskState {
  // 任务完成标记（对应参考文档中的 rw_bs, rw_hs, rw_dxc）
  rw_bs: boolean;      // BOSS任务（收集宝石）是否可完成
  rw_hs: boolean;      // 幻兽任务（训练幻兽）是否可完成
  rw_dxc: boolean;     // 地下城任务是否可完成

  // 地下城怪物状态（对应参考文档中的 rw_gw1_1 等）
  rw_gw1_1: boolean;   // 地下城1层怪物1是否存在
  rw_gw1_2: boolean;   // 地下城1层怪物2是否存在
  rw_gw1_3: boolean;   // 地下城1层怪物3是否存在
  rw_gw2_1: boolean;   // 地下城2层怪物1是否存在
  rw_gw2_2: boolean;   // 地下城2层怪物2是否存在
  rw_gw3_1: boolean;   // 地下城3层怪物是否存在

  // 雪域边境怪物状态（周五任务）
  gw_xybj_1: boolean;  // 雪域边境怪物1是否存在
  gw_xybj_2: boolean;  // 雪域边境怪物2是否存在
  gw_xybj_3: boolean;  // 雪域边境怪物3是否存在
  gw_xybj_4: boolean;  // 雪域边境怪物4是否存在
  gw_xybj_5: boolean;  // 雪域边境怪物5是否存在

  // 任务进度追踪
  currentTaskId?: string;        // 当前接受的任务ID
  taskAcceptedAt?: number;       // 任务接受时间戳
  taskProgress: number;          // 任务进度
}
```

#### 步骤2：创建任务状态管理工具函数
**文件**：`src/utils/dailyTaskStateUtils.ts`（新建）

**需要实现的功能**：
- `createInitialDailyTaskState()` - 创建初始任务状态
- `resetDailyTaskState()` - 重置每日任务状态（对应参考文档的 nextday()）
- `canAcceptTask()` - 检查是否可以接受任务
- `completeTask()` - 标记任务完成
- `getTaskStateDescription()` - 获取任务状态描述

#### 步骤3：集成到游戏状态
**文件**：`src/App.tsx`

**需要添加的状态**：
```typescript
const [dailyTaskState, setDailyTaskState] = useState<DailyTaskState>(
  createInitialDailyTaskState()
);
```

### 3.2 任务完成逻辑优化

#### 步骤1：优化收集宝石任务逻辑
**文件**：`src/utils/dailyTaskUtils.ts`

**需要实现的功能**：
- 根据玩家等级动态计算所需物品数量
- 检查背包中是否有足够的物品
- 消耗物品并发放奖励

**参考逻辑**：
```typescript
// 根据等级计算需要收集的数量
function calculateGemRequirement(level: number): {
  type: '灵魂晶石' | '灵魂王';
  quantity: number;
} {
  if (level < 100) {
    return {
      type: '灵魂晶石',
      quantity: Math.floor((level + 10) / 10)
    };
  } else if (level < 110) {
    return { type: '灵魂王', quantity: 2 };
  } else if (level < 120) {
    return { type: '灵魂王', quantity: 5 };
  } else {
    return { type: '灵魂王', quantity: 10 };
  }
}

// 计算奖励
function calculateGemReward(type: string, quantity: number): DailyTaskReward {
  if (type === '灵魂晶石') {
    return {
      exp: 30000 * quantity,
      merit: 500,
      description: `${30000 * quantity}经验 + 500功勋`
    };
  } else {
    return {
      exp: 210000 * quantity,
      merit: 2000,
      description: `${210000 * quantity}经验 + 2000功勋`
    };
  }
}
```

#### 步骤2：优化训练幻兽任务逻辑
**文件**：`src/utils/dailyTaskUtils.ts`

**需要实现的功能**：
- 检查幻兽是否为攻防型
- 检查幻兽品质（极品10星以上）
- 根据幻兽星级计算奖励

**参考逻辑**：
```typescript
function checkPetRequirement(pet: Pet): boolean {
  // 检查是否为攻防型
  if (pet.hs_name !== '攻防型') return false;

  // 检查品质（品质分 >= 500，约等于极品10星）
  if (pet.pz < 500) return false;

  return true;
}

function calculatePetReward(pet: Pet): number {
  // 根据品质分估算星级
  if (pet.pz >= 3000) return 50000;      // 极品30星
  else if (pet.pz >= 1500) return 10000; // 极品15星
  else return 5000;                       // 极品10星
}
```

#### 步骤3：优化其他任务类型
- 突袭任务：检查是否击败冰雪巨人
- PK赛任务：检查是否参加PK赛
- 地下城任务：检查是否完成地下城

### 3.3 每日重置系统优化

#### 步骤1：实现重置函数
**文件**：`src/utils/dailyTaskStateUtils.ts`

**参考逻辑**：
```typescript
function resetDailyTaskState(
  currentState: DailyTaskState,
  currentDay: number
): DailyTaskState {
  const newState = { ...currentState };

  // 重置任务标记
  newState.rw_bs = true;   // BOSS任务可完成
  newState.rw_hs = true;   // 幻兽任务可完成
  newState.rw_dxc = true;  // 地下城任务可完成

  // 周六特殊重置：地下城怪物
  if (currentDay % 7 === 6) {
    newState.rw_gw1_1 = true;
    newState.rw_gw1_2 = true;
    newState.rw_gw1_3 = true;
    newState.rw_gw2_1 = true;
    newState.rw_gw2_2 = true;
    newState.rw_gw3_1 = true;
  }

  // 周五特殊重置：雪域边境怪物
  if (currentDay % 7 === 5) {
    newState.gw_xybj_1 = true;
    newState.gw_xybj_2 = true;
    newState.gw_xybj_3 = true;
    newState.gw_xybj_4 = true;
    newState.gw_xybj_5 = true;
  }

  return newState;
}
```

#### 步骤2：集成到时间系统
**文件**：`src/App.tsx`

**需要添加的逻辑**：
- 监听时间系统变化
- 当进入新的一天时，调用重置函数

### 3.4 NPC交互逻辑优化

#### 步骤1：优化日常任务官NPC配置
**文件**：`src/data/npcData.ts`

**需要修改的内容**：
- 添加动态任务描述（根据当前星期和玩家等级）
- 添加任务完成选项（当任务已完成时）
- 添加传送选项（周五、周六、周日）

#### 步骤2：优化NPC交互处理
**文件**：`src/App.tsx`

**需要添加的actionType**：
- `acceptDailyTask` - 接受任务（已存在，需优化）
- `completeDailyTask` - 完成任务（新增）
- `claimDailyTaskReward` - 领取奖励（新增）
- `teleportForDailyTask` - 传送（新增，用于周五、周六、周日任务）

#### 步骤3：实现完整的对话流程
**文件**：`src/utils/dailyTaskUtils.ts`

**需要实现的功能**：
- `getDailyTaskGreeting()` - 获取问候语
- `getDailyTaskInfo()` - 获取当前任务信息
- `getDailyTaskOptions()` - 获取可用选项

### 3.5 奖励发放逻辑优化

#### 步骤1：实现奖励发放函数
**文件**：`src/utils/dailyTaskUtils.ts`

**需要实现的功能**：
- `giveExpReward()` - 给予经验奖励
- `giveMeritReward()` - 给予功勋奖励
- `giveBattleExpReward()` - 给予战功奖励
- `giveMagicStoneReward()` - 给予魔石奖励

#### 步骤2：集成到游戏状态更新
**文件**：`src/App.tsx`

**需要更新的状态**：
- `character.exp` - 经验值
- `playerResources.merit` - 功勋值（需要新增）
- `battleExp` - 战功
- `playerResources.magicStone` - 魔石

### 3.6 与其他系统的集成

#### 步骤1：背包系统集成
**文件**：`src/utils/dailyTaskUtils.ts`

**需要实现的功能**：
- `checkInventoryForItem()` - 检查背包物品
- `consumeItemFromInventory()` - 消耗物品（已存在）

#### 步骤2：幻兽系统集成
**文件**：`src/utils/dailyTaskUtils.ts`

**需要实现的功能**：
- `checkPetForTask()` - 检查幻兽是否符合要求
- `removePetFromInventory()` - 移除幻兽（上交）

#### 步骤3：地图系统集成
**文件**：`src/App.tsx`

**需要实现的功能**：
- 周五：传送到雪域边境
- 周六：传送到皇宫
- 周日：传送到地下城

#### 步骤4：时间系统集成
**文件**：`src/utils/dailyTaskUtils.ts`

**需要实现的功能**：
- `getCurrentWeekday()` - 获取当前星期
- `isTaskAvailable()` - 检查任务是否可用

### 3.7 任务描述和提示优化

#### 步骤1：动态生成任务描述
**文件**：`src/utils/dailyTaskUtils.ts`

**需要实现的功能**：
- 根据玩家等级生成收集宝石任务描述
- 根据幻兽品质生成训练幻兽任务描述
- 根据国王状态生成突袭和地下城任务描述

#### 步骤2：添加任务进度提示
**文件**：`src/utils/dailyTaskUtils.ts`

**需要实现的功能**：
- `getTaskProgressDescription()` - 获取任务进度描述
- `getTaskCompletionHint()` - 获取任务完成提示

## 四、实施步骤

### 阶段一：基础架构优化（优先级：高）

1. **定义任务状态接口**
   - 文件：`src/types/index.ts`
   - 添加 `DailyTaskState` 接口
   - 预计时间：15分钟

2. **创建任务状态管理工具**
   - 文件：`src/utils/dailyTaskStateUtils.ts`（新建）
   - 实现状态初始化、重置、检查等功能
   - 预计时间：30分钟

3. **集成到游戏状态**
   - 文件：`src/App.tsx`
   - 添加 `dailyTaskState` 状态
   - 预计时间：15分钟

### 阶段二：任务逻辑优化（优先级：高）

4. **优化收集宝石任务**
   - 文件：`src/utils/dailyTaskUtils.ts`
   - 实现动态计算和奖励发放
   - 预计时间：30分钟

5. **优化训练幻兽任务**
   - 文件：`src/utils/dailyTaskUtils.ts`
   - 实现幻兽检查和奖励计算
   - 预计时间：30分钟

6. **优化其他任务类型**
   - 文件：`src/utils/dailyTaskUtils.ts`
   - 实现突袭、PK赛、地下城任务逻辑
   - 预计时间：30分钟

### 阶段三：NPC交互优化（优先级：中）

7. **优化NPC配置**
   - 文件：`src/data/npcData.ts`
   - 添加动态选项和传送功能
   - 预计时间：20分钟

8. **实现NPC交互处理**
   - 文件：`src/App.tsx`
   - 添加新的 actionType 处理
   - 预计时间：30分钟

9. **实现对话流程**
   - 文件：`src/utils/dailyTaskUtils.ts`
   - 实现完整的对话逻辑
   - 预计时间：20分钟

### 阶段四：系统集成（优先级：中）

10. **背包系统集成**
    - 文件：`src/utils/dailyTaskUtils.ts`
    - 实现物品检查和消耗
    - 预计时间：20分钟

11. **幻兽系统集成**
    - 文件：`src/utils/dailyTaskUtils.ts`
    - 实现幻兽检查和上交
    - 预计时间：20分钟

12. **地图系统集成**
    - 文件：`src/App.tsx`
    - 实现传送功能
    - 预计时间：15分钟

13. **时间系统集成**
    - 文件：`src/utils/dailyTaskUtils.ts`
    - 实现时间判断和重置
    - 预计时间：15分钟

### 阶段五：测试和优化（优先级：低）

14. **功能测试**
    - 测试所有任务类型的完整流程
    - 测试每日重置功能
    - 测试奖励发放
    - 预计时间：30分钟

15. **代码优化**
    - 优化代码结构
    - 添加详细注释
    - 更新相关文档
    - 预计时间：30分钟

## 五、注意事项

### 5.1 代码规范
- 所有新增代码必须添加详细注释
- 遵循项目现有的代码风格
- 参考文档中的变量命名（如 rw_bs, rw_hs）

### 5.2 数据一致性
- 确保任务状态与游戏时间同步
- 确保奖励发放后正确更新玩家资源
- 确保物品消耗后正确更新背包

### 5.3 用户体验
- 提供清晰的任务提示
- 显示详细的任务进度
- 给予明确的奖励反馈

### 5.4 兼容性
- 保持与现有系统的兼容性
- 不破坏已有的功能
- 确保存档系统能正确保存任务状态

## 六、预期效果

### 6.1 功能完整性
- 实现完整的日常任务系统
- 支持7种不同的任务类型
- 每日自动重置任务状态

### 6.2 用户体验
- 清晰的任务指引
- 合理的任务难度（根据等级动态调整）
- 丰富的奖励反馈

### 6.3 系统稳定性
- 准确的任务状态管理
- 可靠的奖励发放机制
- 完善的错误处理

## 七、相关文档

- 参考文档：`/reference/docs/日常任务官交互逻辑文档.md`
- NPC系统文档：`/reference/docs/scripts_analysis/14_NPC系统.md`
- 时间系统文档：`/reference/docs/scripts_analysis/12_时间与精力系统.md`
- 存档系统文档：`/reference/docs/scripts_analysis/07_存档系统_DefineSprite_446.md`

## 八、风险评估

### 8.1 技术风险
- **低风险**：任务状态管理相对简单，易于实现
- **中风险**：与其他系统的集成需要仔细处理数据同步
- **低风险**：每日重置逻辑清晰，易于实现

### 8.2 兼容性风险
- **低风险**：新增功能不影响现有系统
- **中风险**：需要确保存档系统能正确保存新状态

### 8.3 用户体验风险
- **低风险**：任务系统设计清晰，易于理解
- **低风险**：奖励机制明确，用户反馈良好

## 九、总结

本优化计划旨在完善日常任务官的交互逻辑，使其更符合原始设计文档。通过分阶段实施，逐步完善任务状态管理、任务完成逻辑、NPC交互、奖励发放和系统集成等功能，最终实现一个完整、稳定、用户友好的日常任务系统。
