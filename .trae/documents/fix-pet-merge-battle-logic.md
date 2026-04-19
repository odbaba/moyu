# 修复合体幻兽战斗逻辑计划

## 问题分析

### 当前问题
怪物攻击合体幻兽时，直接攻击幻兽并扣除幻兽血量，这不符合游戏设计。

### 当前实现逻辑
1. `getAttackTarget()` 函数优先返回合体幻兽作为攻击目标
2. 敌人攻击时，直接攻击幻兽，使用幻兽的防御计算伤害
3. 扣除幻兽的血量

### 正确的游戏逻辑
1. **怪物不能直接攻击幻兽**
2. 当幻兽处于合体状态时：
   - 怪物攻击主角
   - 计算防御时，使用主角最终面板防御（已包含：基础防御属性 + 装备加成 + 所有合体的幻兽防御加成 + 战魂加成）
   - 扣除生命值时，优先从幻兽血条扣除
   - 如果幻兽血量不足，再扣除主角血量

### 重要说明
**主角的防御力已经包含了所有加成**：
- 在 `App.tsx` 中，战斗初始化时使用 `characterWithPetBonus`
- `characterWithPetBonus` 通过 `calculatePetMergeBonus(pets)` 计算幻兽合体加成
- 在 `battleAdapter.ts` 的 `characterToBattleCharacter()` 中，使用 `calculateTotalCharacterAttributes()` 计算总属性
- 总属性已经包含：基础属性 + 装备加成 + 幻兽加成 + 战魂加成
- **因此，不需要在伤害计算时额外添加幻兽防御**

## 解决方案

### 方案概述
修改战斗逻辑，使怪物始终攻击主角，在扣除生命值时优先从合体幻兽血条扣除。

### 实施步骤

#### 步骤1：修改 `getAttackTarget()` 函数
**文件**：`src/components/battle/Battle.tsx`

**修改内容**：
- 移除优先攻击合体幻兽的逻辑
- 始终返回主角作为攻击目标

```typescript
const getAttackTarget = (currentState: BattleState): BattleCharacter => {
  // 怪物始终攻击主角，不直接攻击幻兽
  // 即使有合体幻兽，攻击目标也是主角
  // 主角的防御力已经包含了幻兽的防御加成（在 characterToBattleCharacter 中计算）
  return currentState.player;
};
```

#### 步骤2：修改伤害扣除逻辑
**文件**：`src/components/battle/Battle.tsx`

**修改内容**：
- 在 `handleSingleAttackResult()` 函数中添加合体幻兽血量扣除逻辑
- 优先从幻兽血条扣除，如果幻兽血量不足，再扣除主角血量
- 注意：主角的防御力已经包含了幻兽加成，不需要额外计算

```typescript
const handleSingleAttackResult = (
  result: { defender: BattleCharacter; damageResult: DamageResult; logEntry: BattleLogEntry },
  attacker: BattleCharacter,
  skill: BattleSkill
) => {
  // 播放攻击动画
  setAttackingCharacterId(attacker.id);

  // 添加伤害数字
  if (result.damageResult.damage > 0) {
    addDamageNumber(result.damageResult.damage, result.defender.id);
  }

  // 添加战斗日志
  addBattleLog(result.logEntry);

  // 更新状态
  setBattleState(prev => {
    const newState = { ...prev };

    // 更新攻击者资源
    if (attacker.isPlayer) {
      newState.player = updateCharacterResources(newState.player, skill);
    } else {
      newState.enemies = newState.enemies.map(enemy =>
        enemy.id === attacker.id ? updateCharacterResources(enemy, skill) : enemy
      );
    }

    // ========== 合体幻兽伤害扣除逻辑 ==========
    // 检查是否有合体幻兽
    const mergedPet = newState.deployedPets.find(pet => pet.isMerged && pet.currentHp > 0);
    
    if (mergedPet && result.defender.isPlayer) {
      // 有合体幻兽，优先从幻兽血条扣除
      const damage = result.damageResult.damage;
      
      if (mergedPet.currentHp >= damage) {
        // 幻兽血量足够，全部从幻兽扣除
        newState.deployedPets = newState.deployedPets.map(pet => {
          if (pet.id === mergedPet.id) {
            return {
              ...pet,
              currentHp: pet.currentHp - damage
            };
          }
          return pet;
        });
        
        // 检查幻兽是否阵亡
        if (mergedPet.currentHp - damage <= 0) {
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
        }
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
        
        // 扣除主角血量
        newState.player = {
          ...newState.player,
          currentHp: Math.max(0, newState.player.currentHp - remainingDamage)
        };
      }
    } else {
      // 没有合体幻兽，直接扣除主角血量
      if (result.defender.isPlayer) {
        newState.player = result.defender;
      } else {
        // 防御者是敌人，更新敌人列表
        newState.enemies = newState.enemies.map(enemy =>
          enemy.id === result.defender.id ? result.defender : enemy
        );
      }
    }

    // 检查战斗是否结束
    newState.battleResult = checkBattleEnd(newState);

    return newState;
  });

  // 攻击动画结束
  setTimeout(() => {
    setAttackingCharacterId(null);
  }, 500);
};
```

#### 步骤3：修改 `executeSkillAttack()` 函数
**文件**：`src/components/battle/Battle.tsx`

**修改内容**：
- 移除幻兽转换为 BattleCharacter 的逻辑
- 防御者应该是主角，不应该是幻兽

```typescript
const executeSkillAttack = (
  attacker: BattleCharacter,
  defender: BattleCharacter | BattlePet | null,
  skill: BattleSkill
) => {
  // 防御者应该是主角，不应该是幻兽
  // getAttackTarget() 已经修改为始终返回主角
  if (!defender || !defender.isPlayer) {
    console.error('防御者应该是主角');
    return;
  }

  // 使用统一的 executeSkill 函数
  const result = executeSkill(attacker, defender, battleState.enemies, skill, battleState.round);

  // 根据技能类型处理结果
  switch (result.type) {
    case 'single':
      handleSingleAttackResult(result, attacker, skill);
      break;
    case 'aoe':
      handleAoeAttackResult(result, attacker, skill);
      break;
    case 'multi':
      handleMultiAttackResult(result, attacker, skill);
      break;
    case 'buff':
      handleBuffResult(result, attacker, skill);
      break;
    case 'special':
      handleSingleAttackResult(result, attacker, skill);
      break;
  }
};
```

## 注意事项

1. **防御力计算**：主角的防御力已经包含了幻兽的防御加成，不需要额外计算
2. **血量扣除顺序**：优先从幻兽血条扣除，幻兽血量不足时再扣除主角血量
3. **幻兽阵亡处理**：幻兽血量降为0时，应该添加阵亡日志
4. **战斗日志**：攻击目标应该显示为主角，而不是幻兽
5. **群体攻击**：群体攻击也需要考虑合体幻兽的血量扣除逻辑

## 测试验证

修改完成后需要验证：
1. 怪物攻击时，目标显示为主角
2. 有合体幻兽时，使用主角的最终面板防御（已包含幻兽加成）
3. 伤害优先从幻兽血条扣除
4. 幻兽血量不足时，剩余伤害扣除主角血量
5. 幻兽阵亡时，正确显示阵亡日志
6. 没有合体幻兽时，战斗逻辑正常
