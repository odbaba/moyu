# 删除暴击逻辑并优化技能伤害计划

## 问题分析

### 当前问题

1. 游戏中存在暴击概念，但用户要求删除
2. 技能伤害百分比需要根据参考文档优化
3. 需要确保技能逻辑与参考文档对应

### 参考文档

`reference/docs/project_docs/05.1_技能伤害逻辑.md`

### 当前技能配置 vs 参考文档

| 技能名称        | 当前伤害百分比        | 参考文档hittype | 参考文档倍率          | 需要调整   |
| ----------- | -------------- | ----------- | --------------- | ------ |
| 风斩（等级1）     | 100%           | hittype=0   | 1.0x            | ✅ 一致   |
| 高级风斩（等级2）   | 不存在            | hittype=1   | 1.5x            | ❌ 需要添加 |
| 裂地爆斩（等级1）   | 60%            | hittype=2   | 0.6x            | ✅ 一致   |
| 高级裂地爆斩（等级2） | 不存在            | hittype=3   | 0.75x           | ❌ 需要添加 |
| 星魔剑（等级1）    | 100%           | hittype=4   | 1.0x            | ✅ 一致   |
| 高级星魔剑（等级2）  | 150%           | hittype=5   | 1.5x            | ✅ 一致   |
| 飞天连斩（等级1）   | 40% × 4击       | hittype=7   | 1.0x × 4击       | ❌ 需要调整 |
| 高级飞天连斩（等级2） | 40% × 4击（2次破防） | hittype=6,7 | 1.0x × 4击（2次破防） | ❌ 需要调整 |

## 解决方案

### 方案概述

1. 删除所有暴击相关逻辑
2. 根据参考文档调整技能伤害百分比
3. 确保技能逻辑与参考文档对应

### 实施步骤

#### 步骤1：删除暴击相关逻辑

**文件**：`src/utils/battleCalculator.ts`

**修改内容**：

1. 删除 `checkCritical()` 函数（第48-79行）
2. 修改 `calculateDamage()` 函数，移除暴击检查和暴击伤害计算（第134-140行）

```typescript
/**
 * 计算最终伤害
 * 综合考虑闪避、战斗力修正、防御力等因素计算最终伤害
 * @param attacker 攻击者战斗角色数据
 * @param defender 防御者战斗角色数据
 * @param skill 使用的战斗技能
 * @param isBreakDefense 是否为破防攻击
 * @returns 伤害计算结果
 */
export function calculateDamage(
  attacker: BattleCharacter,
  defender: BattleCharacter,
  skill: BattleSkill,
  isBreakDefense: boolean
): DamageResult {
  // 1. 检查闪避
  const isDodged = checkDodge(defender.dodgeRate);

  // 2. 如果闪避成功，返回伤害为0
  if (isDodged) {
    return {
      damage: 0,
      isDodged: true,
      isBreakDefense: false,
      combatPowerModifier: 1
    };
  }

  // 3. 计算基础伤害
  let damage = calculateBaseDamage(attacker.attackMin, attacker.attackMax);

  // 4. 应用技能倍率：baseDamage * (skill.damagePercent / 100)
  damage = damage * (skill.damagePercent / 100);

  // 5. 计算战斗力修正
  const combatPowerModifier = calculateCombatPowerModifier(attacker.combatPower, defender.combatPower);

  // 6. 应用战斗力修正：damage * combatPowerModifier
  damage = damage * combatPowerModifier;

  // 7. 如果不是破防攻击，减去防御力：damage - defender.defense
  if (!isBreakDefense) {
    damage = damage - defender.defense;
  }

  // 8. 最小伤害为 1
  damage = Math.max(1, Math.floor(damage));

  // 9. 返回结果
  return {
    damage,
    isDodged: false,
    isBreakDefense,
    combatPowerModifier
  };
}
```

#### 步骤2：修改类型定义

**文件**：`src/types/index.ts`

**修改内容**：

1. 移除 `DamageResult` 接口中的 `isCritical` 字段
2. 移除 `BattleLogEntry` 接口中的 `isCritical` 字段

```typescript
export interface DamageResult {
  damage: number; // 最终伤害值
  isDodged: boolean; // 是否闪避
  isBreakDefense: boolean; // 是否破防
  combatPowerModifier: number; // 战斗力修正系数
}

export interface BattleLogEntry {
  id: string; // 日志唯一ID
  round: number; // 回合数
  actor: string; // 行动者名称
  actorId: string; // 行动者ID
  action: string; // 行动描述
  actionType: 'skill' | 'buff' | 'death'; // 行动类型
  damage: number; // 伤害值
  target?: string; // 目标名称
  targetId?: string; // 目标ID
  skillName?: string; // 技能名称
  isDodged?: boolean; // 是否闪避
  isBreakDefense?: boolean; // 是否破防
}
```

#### 步骤3：修改战斗组件

**文件**：`src/components/battle/Battle.tsx`

**修改内容**：
移除所有与暴击相关的逻辑和显示

#### 步骤4：优化技能伤害百分比

**文件**：`src/data/skillData.ts`

**修改内容**：
根据参考文档调整技能伤害百分比：

**技能索引0 - 风斩系列**：

* 风斩（等级1）：保持 100%（对应 hittype=0，倍率1.0x）

* 高级风斩（等级2）：保持 150%（对应 hittype=1，倍率1.5x）

**技能索引1 - 裂地爆斩系列**：

* 裂地爆斩（等级1）：保持 60%（对应 hittype=2，倍率0.6x）

* 高级裂地爆斩（等级2）：保持 75%（对应 hittype=3，倍率0.75x）

**技能索引2 - 星魔剑系列**：

* 星魔剑（等级1）：保持 100%（对应 hittype=4，倍率1.0x）

* 高级星魔剑（等级2）：保持 150%（对应 hittype=5，倍率1.5x）

**技能索引3 - 飞天连斩系列**：

* 飞天连斩（等级1）：调整为 100% × 4击（对应 hittype=7，倍率1.0x × 4击）

* 高级飞天连斩（等级2）：调整为 100% × 4击，前2击破防（对应 hittype=6,7）

**关键修改**：

```typescript
// 飞天连斩（等级1）
{
  id: 'skill_flying_slash',
  skillIndex: 3 as SkillIndex,
  name: '飞天连斩',
  icon: '🗡️',
  type: 'active',
  attackType: 'multi',
  rarity: 'epic',
  level: 1,
  maxLevel: 2,
  description: '发动四连斩击，对单个敌人造成4次伤害。消耗30点体力。',
  effect: {
    damagePercent: 100,  // 从40%调整为100%
    hitCount: 4,
    breakDefenseHits: 0  // 普通版本不破防
  },
  cost: { stamina: 30 },
  cooldown: 3,
  currentCooldown: 0,
  range: '近战',
  targetType: '单体',
  learnMethod: 'skillBook',
  learnLevel: 15,
  upgradeCost: 15000,
  isLearned: isLearned
}

// 高级飞天连斩（等级2）
// 需要在技能升级逻辑中处理，前2击破防
```

#### 步骤5：更新技能升级逻辑

**文件**：`src/utils/skillUtils.ts`

**修改内容**：
添加高级飞天连斩的破防逻辑

```typescript
/**
 * 获取技能的实际伤害百分比（考虑等级）
 */
export const getSkillDamagePercent = (skill: SkillDetail): number => {
  // 风斩系列
  if (skill.skillIndex === 0) {
    return skill.level === 2 ? 150 : 100;
  }

  // 裂地爆斩系列
  if (skill.skillIndex === 1) {
    return skill.level === 2 ? 75 : 60;
  }

  // 星魔剑系列
  if (skill.skillIndex === 2) {
    return skill.level === 2 ? 150 : 100;
  }

  // 飞天连斩系列
  if (skill.skillIndex === 3) {
    return 100;  // 每击都是100%
  }

  // 其他技能返回基础值
  return skill.effect.damagePercent || 0;
};

/**
 * 获取飞天连斩的破防击数
 */
export const getBreakDefenseHits = (skill: SkillDetail): number => {
  if (skill.skillIndex === 3 && skill.level === 2) {
    return 2;  // 高级飞天连斩前2击破防
  }
  return 0;
};
```

#### 步骤6：更新战斗适配器

**文件**：`src/utils/battleAdapter.ts`

**修改内容**：
在技能转换时应用新的伤害百分比和破防击数

```typescript
export function skillToBattleSkill(
  skill: SkillDetail,
  currentMp: number,
  currentStamina: number
): BattleSkill {
  // 获取MP消耗，默认为0
  const mpCost = skill.cost.mp || 0;
  // 获取体力消耗，默认为0
  const staminaCost = skill.cost.stamina || 0;
  // 获取当前冷却时间
  const currentCooldown = skill.currentCooldown || 0;

  // 判断技能是否可用（MP、体力足够且冷却时间为0）
  const isAvailable = currentMp >= mpCost && currentStamina >= staminaCost && currentCooldown === 0;

  // 获取实际伤害百分比
  const damagePercent = getSkillDamagePercent(skill);
  
  // 获取破防击数（仅对飞天连斩系列有效）
  const breakDefenseHits = getBreakDefenseHits(skill);

  return {
    id: skill.id,
    skillIndex: skill.skillIndex,
    name: skill.name,
    icon: skill.icon,
    attackType: skill.attackType,
    level: skill.level,
    damagePercent: damagePercent,
    mpCost: mpCost,
    staminaCost: staminaCost,
    cooldown: skill.cooldown,
    currentCooldown: currentCooldown,
    hitCount: skill.effect.hitCount || 1,
    breakDefenseHits: breakDefenseHits || skill.effect.breakDefenseHits || 0,
    battlePowerBonus: skill.effect.battlePowerBonus || 0,
    buffDuration: skill.effect.duration || 0,
    isAvailable: isAvailable
  };
}
```

#### 步骤7：更新技能描述

**文件**：`src/data/skillData.ts`

**修改内容**：
更新技能描述，移除暴击相关描述，确保与参考文档一致

## 技能伤害对照表（最终版本）

| 技能名称   | 等级 | 伤害百分比     | 攻击类型 | 体力消耗 | 特殊效果          | 对应hittype |
| ------ | -- | --------- | ---- | ---- | ------------- | --------- |
| 风斩     | 1  | 100%      | 单体   | 0    | 无消耗           | 0         |
| 高级风斩   | 2  | 150%      | 单体   | 5    | 伤害+50%        | 1         |
| 裂地爆斩   | 1  | 60%       | 群体   | 10   | 攻击所有怪物        | 2         |
| 高级裂地爆斩 | 2  | 75%       | 群体   | 20   | 攻击所有怪物        | 3         |
| 星魔剑    | 1  | 100%      | 群体   | 30   | 攻击所有怪物        | 4         |
| 高级星魔剑  | 2  | 150%      | 群体   | 50   | 攻击所有怪物，伤害+50% | 5         |
| 飞天连斩   | 1  | 100% × 4击 | 单体   | 30   | 四连击           | 7         |
| 高级飞天连斩 | 2  | 100% × 4击 | 单体   | 50   | 四连击，前2击破防     | 6,7       |

## 注意事项

1. **删除所有暴击相关代码**：确保没有遗漏
2. **更新所有引用**：确保所有使用 `isCritical` 的地方都已修改
3. **保持技能平衡**：伤害百分比与参考文档一致
4. **更新战斗日志**：移除暴击相关的日志显示
5. **飞天连斩特殊处理**：确保高级版本的前2击破防

## 测试验证

修改完成后需要验证：

1. 战斗中没有暴击提示
2. 技能伤害计算正确
3. 战斗日志中没有暴击信息
4. 所有技能的伤害百分比与参考文档一致
5. 高级飞天连斩的前2击正确破防

