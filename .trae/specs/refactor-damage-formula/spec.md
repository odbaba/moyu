# 战斗伤害公式重构 Spec

## Why
当前战斗系统的伤害计算采用"伤害-防御"的固定减法模式，高防御怪物/玩家会导致伤害被完全抵消，且暴击机制仅依赖幸运值、暴击伤害固定×2，缺乏成长性。需要根据策划文档重构为基于阴阳师同款的 `K/(K+防御)` 百分比减伤公式，并引入动态暴击率/暴击伤害率、分段战斗力压制、伤害浮动等机制。

## What Changes
- **BREAKING**: 防御减伤公式从 `damage - defense` 改为 `attack × K/(K+defense)` 百分比减伤，K = 200 + 10 × 攻击方等级
- **BREAKING**: 暴击机制从"幸运值决定暴击率、暴击固定×2"改为"独立暴击率属性 + 独立暴击伤害率属性"
- **BREAKING**: 战斗力修正从线性缩放改为分段查表机制
- 新增伤害浮动机制（99%~101%）
- 新增幻兽顺序承伤机制（幻兽A → 幻兽B → 玩家）
- `BattleCharacter` 类型新增 `criticalRate` 和 `criticalDamageRate` 字段
- `DamageResult` 类型新增 `criticalDamageRate` 字段
- `attributeCalculator.ts` 新增暴击率和暴击伤害率的属性计算
- `battleAdapter.ts` 适配新属性字段

## Impact
- Affected specs: 战斗系统、角色属性系统
- Affected code:
  - `src/utils/battleCalculator.ts` — 核心伤害计算公式重构
  - `src/utils/attributeCalculator.ts` — 新增暴击率/暴击伤害率属性计算
  - `src/utils/battleAdapter.ts` — 适配新属性字段到 BattleCharacter
  - `src/types/index.ts` — BattleCharacter 和 DamageResult 类型扩展
  - `src/components/battle/Battle.tsx` — 幻兽顺序承伤逻辑修改

## ADDED Requirements

### Requirement: 防御减伤公式（阴阳师同款）
系统 SHALL 使用动态参数K的百分比减伤公式计算防御效果。

#### Scenario: 计算基础伤害
- **WHEN** 攻击方对防御方造成伤害
- **THEN** K = 200 + 10 × 攻击方等级
- **AND** 基础伤害 = 攻击力 × K / (K + 目标总防御)
- **AND** 贯穿比 = K / (K + 防御力)，减伤比 = 防御力 / (K + 防御力)

#### Scenario: K值随等级变化
- **WHEN** 攻击方等级为1
- **THEN** K = 210
- **WHEN** 攻击方等级为100
- **THEN** K = 1200
- **WHEN** 攻击方等级为132
- **THEN** K = 1520

### Requirement: 暴击率与暴击伤害率独立属性
系统 SHALL 将暴击率和暴击伤害率作为独立属性，不再依赖幸运值。

#### Scenario: 基础暴击属性
- **WHEN** 玩家等级为1
- **THEN** 暴击率 = 5.0%，暴击伤害率 = 150%

#### Scenario: 暴击属性随等级成长
- **WHEN** 玩家等级提升
- **THEN** 暴击率和暴击伤害率按属性成长表递增
- **AND** 100级时暴击率 = 10.0%，暴击伤害率 = 193%
- **AND** 132级时暴击率 = 16.0%，暴击伤害率 = 235%

#### Scenario: 暴击伤害计算
- **WHEN** 攻击触发暴击
- **THEN** 伤害 × 暴击伤害率（如暴击伤害率150%则×1.5，而非固定×2）

### Requirement: 战斗力分段压制机制
系统 SHALL 使用分段查表的方式计算战斗力修正，替代当前的线性缩放。

#### Scenario: 玩家战力远超怪物
- **WHEN** 玩家战力 - 怪物战力 ≥ 100
- **THEN** 玩家对怪物伤害倍率 = 1.50×，怪物对玩家伤害倍率 = 0.50×

#### Scenario: 玩家战力略超怪物
- **WHEN** 玩家战力 - 怪物战力在 +1 ~ +19
- **THEN** 玩家对怪物伤害倍率 = 1.03×，怪物对玩家伤害倍率 = 0.97×

#### Scenario: 战力相等
- **WHEN** 玩家战力 = 怪物战力
- **THEN** 双方伤害倍率 = 1.00×

#### Scenario: 玩家战力低于怪物
- **WHEN** 怪物战力 - 玩家战力 ≤ -100
- **THEN** 玩家对怪物伤害倍率 = 0.40×，怪物对玩家伤害倍率 = 1.80×

#### Scenario: 完整分段表
| 差值(玩家-怪物) | 玩家伤害倍率 | 怪物伤害倍率 |
|---|---|---|
| ≥ +100 | 1.50× | 0.50× |
| +80 ~ +99 | 1.40× | 0.60× |
| +60 ~ +79 | 1.28× | 0.72× |
| +40 ~ +59 | 1.16× | 0.84× |
| +20 ~ +39 | 1.08× | 0.92× |
| +1 ~ +19 | 1.03× | 0.97× |
| 0 | 1.00× | 1.00× |
| -1 ~ -19 | 0.97× | 1.03× |
| -20 ~ -39 | 0.92× | 1.10× |
| -40 ~ -59 | 0.84× | 1.20× |
| -60 ~ -79 | 0.72× | 1.35× |
| -80 ~ -99 | 0.60× | 1.55× |
| ≤ -100 | 0.40× | 1.80× |

### Requirement: 伤害浮动
系统 SHALL 在最终伤害上增加99%~101%的随机浮动。

#### Scenario: 伤害浮动计算
- **WHEN** 计算出最终伤害值
- **THEN** 实际伤害 = 最终伤害 × (0.99 + Math.random() × 0.02)
- **AND** 实际伤害向下取整，最小为1

### Requirement: 幻兽顺序承伤
系统 SHALL 按照幻兽A → 幻兽B → 玩家的顺序依次吸收伤害。

#### Scenario: 幻兽A血量充足
- **WHEN** 玩家受到伤害且幻兽A存活
- **THEN** 伤害优先由幻兽A承受
- **AND** 幻兽A血量减少，玩家不受伤害

#### Scenario: 幻兽A血量不足
- **WHEN** 玩家受到伤害且幻兽A血量不足以承受全部伤害
- **THEN** 幻兽A血量降为0，解除合体状态
- **AND** 剩余伤害由幻兽B承受

#### Scenario: 两只幻兽血量都不足
- **WHEN** 玩家受到伤害且两只幻兽血量都不足以承受全部伤害
- **THEN** 幻兽A血量降为0，解除合体状态
- **AND** 幻兽B血量降为0，解除合体状态
- **AND** 剩余伤害由玩家自身承受

### Requirement: 完整伤害结算顺序
系统 SHALL 按以下顺序结算伤害。

#### Scenario: 伤害结算流程
1. 计算总攻击力（角色 + 幻兽合体 + 装备）
2. 计算K值 = 200 + 10 × 攻击方等级
3. 计算目标总防御
4. 应用防御减伤：基础伤害 = 攻击力 × K/(K+防御)
5. 判定暴击（比较暴击率与随机数），暴击则伤害 × 暴击伤害率
6. 应用战斗力修正（分段查表）
7. 应用技能倍率
8. 应用伤害浮动（99%~101%）
9. 最终伤害优先由合体幻兽顺序承受

## MODIFIED Requirements

### Requirement: BattleCharacter 类型扩展
BattleCharacter 接口 SHALL 新增以下字段：
- `criticalRate: number` — 暴击率（百分比，如5.0表示5%）
- `criticalDamageRate: number` — 暴击伤害率（百分比，如150表示150%，即×1.5）

### Requirement: DamageResult 类型扩展
DamageResult 接口 SHALL 新增以下字段：
- `criticalDamageRate: number` — 本次暴击使用的暴击伤害率

### Requirement: 属性计算器扩展
`calculateTotalCharacterAttributes` 函数 SHALL 返回 `criticalRate` 和 `criticalDamageRate` 字段，按策划文档的等级成长表计算。

### Requirement: 战斗适配器扩展
`characterToBattleCharacter` 函数 SHALL 将 `criticalRate` 和 `criticalDamageRate` 传入 BattleCharacter。

## REMOVED Requirements

### Requirement: 幸运值决定暴击率
**Reason**: 暴击率改为独立属性，不再由幸运值/100计算
**Migration**: 幸运值字段保留用于其他机制（如掉落概率），但不再影响暴击判定

### Requirement: 暴击固定×2
**Reason**: 暴击伤害改为独立属性，基础150%随等级成长
**Migration**: 使用 criticalDamageRate 属性替代固定×2

### Requirement: 破防跳过防御
**Reason**: 新公式采用百分比减伤，防御力无法完全抵消伤害，破防机制不再需要
**Migration**: 破防相关逻辑（breakDefenseHits、isBreakDefense）保留字段但不再跳过防御计算，改为破防时额外增加伤害倍率（如×1.5）
