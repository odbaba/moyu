# 战斗模块优化与模块关联 Spec

## Why
当前战斗模块使用独立的 `Character` 和 `Skill` 类型，与角色模块 (`CharacterData`) 和技能模块 (`SkillDetail`) 完全分离，导致数据不统一、维护困难，且伤害计算过于简单，缺少参考文档中的战斗力差距修正、闪避、暴击等核心机制。

## What Changes
- 创建战斗适配器，统一角色数据和技能数据类型
- 实现基于参考文档的伤害计算系统（战斗力差距修正、闪避、暴击）
- 实现完整的技能攻击类型（单体、群体、多段攻击、增益技能）
- 将战斗模块与角色模块、技能模块关联
- 更新战斗组件以使用新的数据结构

## Impact
- Affected specs: 战斗系统、角色系统、技能系统
- Affected code: 
  - `src/components/battle/` - 战斗组件
  - `src/data/battleData.ts` - 战斗数据
  - `src/types/index.ts` - 类型定义
  - `src/utils/` - 新增战斗计算工具

## ADDED Requirements

### Requirement: 战斗适配器系统
系统应提供战斗适配器，将角色模块和技能模块的数据转换为战斗所需的格式。

#### Scenario: 角色数据转换
- **WHEN** 战斗开始时
- **THEN** 系统将 `CharacterData` 转换为战斗角色格式，包含正确的攻击力范围、防御力、生命值等属性

#### Scenario: 技能数据转换
- **WHEN** 玩家查看可用技能时
- **THEN** 系统将 `SkillDetail` 转换为战斗技能格式，包含正确的伤害百分比、消耗、冷却等属性

### Requirement: 战斗力差距修正
系统应根据攻击者和防御者的战斗力差距修正伤害。

#### Scenario: 攻击者战斗力高
- **WHEN** 攻击者战斗力高于防御者
- **THEN** 每点差距增加5%伤害，最多增加100%

#### Scenario: 防御者战斗力高
- **WHEN** 防御者战斗力高于攻击者
- **THEN** 每点差距减少1%伤害，最多减少50%

### Requirement: 闪避系统
系统应根据角色的闪避率判定是否闪避攻击。

#### Scenario: 闪避成功
- **WHEN** 随机数小于角色闪避率
- **THEN** 攻击被闪避，不造成伤害

#### Scenario: 闪避失败
- **WHEN** 随机数大于等于角色闪避率
- **THEN** 攻击正常命中，计算伤害

### Requirement: 暴击系统
系统应根据技能类型判定是否暴击。

#### Scenario: 普通攻击暴击
- **WHEN** 使用普通攻击且随机触发暴击
- **THEN** 伤害提升50%

#### Scenario: 技能暴击
- **WHEN** 使用高级星魔剑等技能
- **THEN** 伤害提升50%

### Requirement: 技能攻击类型
系统应支持多种技能攻击类型。

#### Scenario: 单体攻击
- **WHEN** 使用高级风斩等单体技能
- **THEN** 对单个目标造成攻击力百分比伤害

#### Scenario: 群体攻击
- **WHEN** 使用星魔剑、地裂爆斩等群体技能
- **THEN** 对所有敌人造成攻击力百分比伤害

#### Scenario: 多段攻击
- **WHEN** 使用飞天连斩等多段技能
- **THEN** 对单个目标造成多次伤害，部分攻击无视防御

#### Scenario: 增益技能
- **WHEN** 使用斗志昂扬等增益技能
- **THEN** 提升角色战斗力百分比，持续若干回合

### Requirement: 战斗模块关联
战斗模块应与角色模块和技能模块关联。

#### Scenario: 使用角色数据
- **WHEN** 战斗开始时
- **THEN** 使用 `CharacterData` 中的属性（攻击力范围、防御力、生命值等）

#### Scenario: 使用技能数据
- **WHEN** 玩家选择技能时
- **THEN** 使用 `SkillDetail` 中的技能属性（伤害百分比、消耗、冷却等）

#### Scenario: 技能冷却管理
- **WHEN** 使用有冷却的技能
- **THEN** 技能进入冷却状态，冷却结束后可再次使用

## MODIFIED Requirements

### Requirement: 伤害计算公式
伤害计算应参考原始游戏的公式。

**原公式**: `hit = xgj + random(dgj - xgj + 1)` (最小攻击~最大攻击之间随机)

**新公式**: 
```
baseDamage = attackMin + random(attackMax - attackMin + 1)
combatPowerModifier = 计算战斗力差距修正
finalDamage = baseDamage × skillMultiplier × combatPowerModifier - defense
finalDamage = max(finalDamage, 1)
```

### Requirement: 战斗状态管理
战斗状态应包含完整的角色和技能信息。

**新增字段**:
- `combatPower: number` - 战斗力
- `dodgeRate: number` - 闪避率
- `buffs: Buff[]` - 增益效果列表
- `skillCooldowns: Map<string, number>` - 技能冷却状态

## REMOVED Requirements

### Requirement: 独立战斗数据
**Reason**: 战斗数据应从角色模块和技能模块获取，不再使用独立的硬编码数据
**Migration**: 删除 `battleData.ts` 中的硬编码数据，改为从角色和技能模块获取
