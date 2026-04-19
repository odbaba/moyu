# 角色模块功勋和战功获取函数优化计划

## 概述

在角色模块中封装统一的获得战功和获得功勋函数，确保所有获得功勋/战功的操作（日常任务、捐献金币、击杀怪物等）都使用统一的函数，实现状态更新和日志打印的一致性。

## 当前实现情况分析

### 现有函数
1. **`gainMeritAndPromote`** (nobleRankUtils.ts)
   - 功能：增加功勋并自动晋升爵位
   - 返回：计算结果（新功勋、新爵位、是否晋升等）
   - 问题：不直接更新状态，需要调用方手动处理

2. **`gainBattleExpAndPromote`** (militaryRankUtils.ts)
   - 功能：增加战功并自动晋升军衔
   - 返回：计算结果（新战功、新军衔、是否晋升等）
   - 问题：不直接更新状态，需要调用方手动处理

### 当前调用位置
1. **战斗结束** (App.tsx ~1860行)
   - 击败BOSS获得1000战功
   - 击败冰雪巨人获得10000战功
   - 击败BOSS获得功勋

2. **日常任务** (App.tsx ~938行)
   - 收集宝石任务：获得功勋
   - 训练幻兽任务：获得战功

3. **捐献金币** (App.tsx ~2780行)
   - 捐献金币获得功勋

### 问题
1. 各处实现不一致，有的直接更新状态，有的调用工具函数
2. 日志打印格式不统一
3. 晋升提示处理不一致

## 优化方案

### 一、创建统一的处理函数

在 App.tsx 中创建两个核心函数：

#### 1. `handleGainMerit` 函数
```typescript
/**
 * 处理获得功勋
 * @param amount 获得的功勋数量
 * @param source 来源描述（可选，用于日志）
 */
const handleGainMerit = (amount: number, source?: string) => {
  // 调用工具函数计算结果
  const result = gainMeritAndPromote(playerResources.merit, nobleRank, amount);
  
  // 更新功勋
  setPlayerResources(prev => ({
    ...prev,
    merit: result.newMerit,
  }));
  
  // 如果晋升，更新爵位
  if (result.promoted) {
    setNobleRank(result.newNobleRank);
  }
  
  // 打印日志
  const logMessages = [];
  if (source) {
    logMessages.push(`${source}，获得 ${amount.toLocaleString()} 点功勋！`);
  } else {
    logMessages.push(`获得 ${amount.toLocaleString()} 点功勋！`);
  }
  if (result.promoted && result.promotedRankName) {
    logMessages.push(`🎉 恭喜你被授予 ${result.promotedRankName}！`);
  }
  setInteractionLog(prev => [...prev, ...logMessages]);
  
  return result;
};
```

#### 2. `handleGainBattleExp` 函数
```typescript
/**
 * 处理获得战功
 * @param amount 获得的战功数量
 * @param source 来源描述（可选，用于日志）
 */
const handleGainBattleExp = (amount: number, source?: string) => {
  // 调用工具函数计算结果
  const result = gainBattleExpAndPromote(battleExp, militaryRank, amount);
  
  // 更新战功
  _setBattleExp(result.newBattleExp);
  
  // 如果晋升，更新军衔
  if (result.promoted) {
    _setMilitaryRank(result.newMilitaryRank);
  }
  
  // 打印日志
  const logMessages = [];
  if (source) {
    logMessages.push(`${source}，获得 ${amount.toLocaleString()} 点战功！`);
  } else {
    logMessages.push(`获得 ${amount.toLocaleString()} 点战功！`);
  }
  if (result.promoted && result.promotedRankName) {
    logMessages.push(`🎖️ 恭喜你荣升 ${result.promotedRankName}！`);
  }
  setInteractionLog(prev => [...prev, ...logMessages]);
  
  return result;
};
```

### 二、修改调用位置

#### 1. 战斗结束逻辑 (handleBattleEnd)
```typescript
// 击败BOSS获得战功
if (isBoss) {
  handleGainBattleExp(1000, '击败BOSS');
}

// 击败冰雪巨人获得战功
if (isIceGiant) {
  handleGainBattleExp(10000, '击败冰雪巨人');
}

// 击败BOSS获得功勋
if (isBoss && meritReward > 0) {
  handleGainMerit(meritReward, '击败BOSS');
}
```

#### 2. 日常任务完成逻辑
```typescript
// 收集宝石任务 - 获得功勋
if (reward.merit) {
  handleGainMerit(reward.merit, '完成收集宝石任务');
}

// 训练幻兽任务 - 获得战功
handleGainBattleExp(1000, '完成训练幻兽任务');
```

#### 3. 捐献金币逻辑
```typescript
// 捐献金币获得功勋
handleGainMerit(gainedMerit, `捐献 ${donatedGold.toLocaleString()} 金币`);
```

## 实施步骤

### 步骤1：在 App.tsx 中创建统一处理函数
- 创建 `handleGainMerit` 函数
- 创建 `handleGainBattleExp` 函数
- 使用 useCallback 包装以避免不必要的重新创建

### 步骤2：修改战斗结束逻辑
- 更新 handleBattleEnd 中的战功和功勋获取
- 使用统一的处理函数

### 步骤3：修改日常任务逻辑
- 更新收集宝石任务的功勋获取
- 更新训练幻兽任务的战功获取
- 使用统一的处理函数

### 步骤4：修改捐献金币逻辑
- 更新捐献金币的功勋获取
- 使用统一的处理函数

### 步骤5：测试验证
- 测试击败BOSS获得战功和功勋
- 测试击败冰雪巨人获得战功
- 测试完成日常任务获得功勋/战功
- 测试捐献金币获得功勋
- 测试晋升提示是否正确显示

## 文件修改清单

| 文件路径 | 修改内容 |
|---------|---------|
| `src/App.tsx` | 创建统一处理函数，修改所有调用位置 |

## 注意事项

1. 保持日志格式的一致性
2. 确保晋升提示正确显示
3. 复用现有的工具函数，避免重复实现
4. 添加必要的注释
