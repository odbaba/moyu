# 修复合体幻兽伤害溢出问题

## 问题描述

在战斗页面中，当怪物攻击我方时，如果扣除合体中幻兽的生命值，当幻兽生命值被清零后，溢出的伤害不应该继续扣除主角生命值。

## 当前逻辑分析

### 问题代码位置
文件：`src/components/battle/Battle.tsx`
函数：`handleSingleAttackResult`（第380-517行）

### 当前伤害扣除逻辑（第409-478行）

```typescript
// ========== 合体幻兽伤害扣除逻辑 ==========
const mergedPet = newState.deployedPets.find(pet => pet.isMerged && pet.currentHp > 0);

if (mergedPet && result.defender.isPlayer) {
  const damage = result.damageResult.damage;
  
  if (mergedPet.currentHp >= damage) {
    // 幻兽血量足够，全部从幻兽扣除
    // ...
  } else {
    // 问题所在：幻兽血量不足时，溢出伤害继续扣除主角血量
    const remainingDamage = damage - mergedPet.currentHp;
    
    // 扣除幻兽血量（降为0）
    // ...
    
    // ❌ 这里不应该扣除主角血量
    newState.player = {
      ...newState.player,
      currentHp: Math.max(0, newState.player.currentHp - remainingDamage)
    };
  }
}
```

### 问题原因
当幻兽血量不足以承受全部伤害时，代码会计算溢出伤害 `remainingDamage`，然后继续扣除主角血量。这不符合用户需求。

## 修复方案

### 修改内容
修改 `handleSingleAttackResult` 函数中的合体幻兽伤害扣除逻辑：

**修改前（第444-478行）：**
```typescript
} else {
  // 幻兽血量不足，先扣除幻兽血量，再扣除主角血量
  const remainingDamage = damage - mergedPet.currentHp;
  
  // 扣除幻兽血量（降为0）
  newState.deployedPets = newState.deployedPets.map(pet => {
    if (pet.id === mergedPet.id) {
      return {
        ...pet,
        currentHp: 0
      };
    }
    return pet;
  });
  
  // 添加幻兽阵亡日志
  const deathLogEntry: BattleLogEntry = {
    id: generateLogId(),
    round: newState.round,
    actor: mergedPet.name,
    actorId: mergedPet.id,
    action: `${mergedPet.name} 阵亡了！`,
    actionType: 'death',
    damage: 0,
    target: mergedPet.name,
    targetId: mergedPet.id
  };
  newState.battleLogs = [...newState.battleLogs, deathLogEntry];
  
  // ❌ 删除这部分：扣除主角血量
  newState.player = {
    ...newState.player,
    currentHp: Math.max(0, newState.player.currentHp - remainingDamage)
  };
}
```

**修改后：**
```typescript
} else {
  // 幻兽血量不足，将幻兽血量清零，溢出伤害不再扣除主角血量
  // 扣除幻兽血量（降为0）
  newState.deployedPets = newState.deployedPets.map(pet => {
    if (pet.id === mergedPet.id) {
      return {
        ...pet,
        currentHp: 0
      };
    }
    return pet;
  });
  
  // 添加幻兽阵亡日志
  const deathLogEntry: BattleLogEntry = {
    id: generateLogId(),
    round: newState.round,
    actor: mergedPet.name,
    actorId: mergedPet.id,
    action: `${mergedPet.name} 阵亡了！`,
    actionType: 'death',
    damage: 0,
    target: mergedPet.name,
    targetId: mergedPet.id
  };
  newState.battleLogs = [...newState.battleLogs, deathLogEntry];
  
  // ✅ 不再扣除主角血量，溢出伤害消失
}
```

## 实施步骤

1. **修改 `handleSingleAttackResult` 函数**
   - 文件：`src/components/battle/Battle.tsx`
   - 位置：第444-478行
   - 操作：删除计算 `remainingDamage` 和扣除主角血量的代码

2. **更新注释**
   - 更新相关注释，说明溢出伤害不再扣除主角血量

3. **测试验证**
   - 测试场景1：幻兽血量充足时，正常扣除幻兽血量
   - 测试场景2：幻兽血量不足时，幻兽血量清零，主角血量不变
   - 测试场景3：没有合体幻兽时，正常扣除主角血量

## 影响范围

- **直接影响**：战斗系统中合体幻兽的伤害吸收逻辑
- **间接影响**：无
- **风险评估**：低风险，仅修改伤害溢出处理逻辑

## 注意事项

1. 修改后需要确保幻兽阵亡日志正常显示
2. 确保战斗结束判断逻辑不受影响
3. 确保其他伤害处理逻辑（如群体攻击、多段攻击）不受影响
