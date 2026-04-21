# 战魂系统装备属性优化 Spec（更新版）

## Why
根据参考文档 `reference/docs/战魂系统完整文档.md` 的最新内容，当前实现存在以下关键问题：
1. **战魂套装效果理解错误**：当前 `calculateTianHunSetBonus` 和 `calculateDiHunSetBonus` 计算的是角色属性加成（与单件装备加成重复），但参考文档明确套装效果是**对怪物属性的压制削弱**，不是角色加成
2. **战魂套装压制效果未在战斗中体现**：天魂套装应降低怪物战斗力（最高10%），地魂套装应降低怪物生命值（最高25%），当前未实现
3. **怪物详情未显示战魂套装压制信息**：战斗页面中点击怪物详情时，应显示战魂套装压制效果和减少的属性值

## What Changes
- 修改 `calculateTianHunSetBonus` 为 `calculateTianHunSetSuppression`：天魂套装降低怪物战斗力（套装等级×2%，最高10%）
- 修改 `calculateDiHunSetBonus` 为 `calculateDiHunSetSuppression`：地魂套装降低怪物生命值（套装等级×5%，最高25%）
- 修改 `createEnemyFromEnemyData` 和 `createEnemyFromTemplate`：创建敌人时应用战魂套装压制效果
- 修改 `EnemyDetailModal`：显示战魂套装压制信息和被削弱的属性值（括号内显示减少值）
- 修改 `Battle` 组件：传递战魂套装信息到敌人创建流程
- 删除 `calculateWarSoulPKCombatPower`（PK赛功能暂未实现，避免误导）

## Impact
- Affected code:
  - `src/utils/combatPower.ts`（修改套装效果函数为怪物压制函数）
  - `src/utils/battleAdapter.ts`（创建敌人时应用战魂套装压制）
  - `src/components/battle/EnemyDetailModal.tsx`（显示战魂套装压制信息）
  - `src/components/battle/Battle.tsx`（传递战魂套装信息）

## ADDED Requirements

### Requirement: 天魂套装怪物战斗力压制
系统 SHALL 实现天魂套装对怪物战斗力的压制效果。

#### Scenario: 天魂套装激活时降低怪物战斗力
- **WHEN** 所有6件装备都是天魂（soulType = WarSoulType.TIAN_HUN）
- **AND** 战魂系统已开启
- **THEN** 怪物战斗力 = Math.round(怪物原始战斗力 × (1 - 套装等级 × 0.02))
- **AND** 最大压制：5级套装 × 2% = 10%

#### Scenario: 天魂套装战斗提示
- **WHEN** 天魂套装激活时进入战斗
- **THEN** 在战斗日志中显示提示："在天魂战魂的神圣力量下，所有敌人的战斗力下降X%。"

### Requirement: 地魂套装怪物生命值压制
系统 SHALL 实现地魂套装对怪物生命值的压制效果。

#### Scenario: 地魂套装激活时降低怪物生命值
- **WHEN** 所有6件装备都是地魂（soulType = WarSoulType.DI_HUN）
- **AND** 战魂系统已开启
- **THEN** 怪物当前生命值 = Math.round(怪物原始生命值 × (1 - 套装等级 × 0.05))
- **AND** 怪物最大生命值 = Math.round(怪物原始最大生命值 × (1 - 套装等级 × 0.05))
- **AND** 最大压制：5级套装 × 5% = 25%

#### Scenario: 地魂套装战斗提示
- **WHEN** 地魂套装激活时进入战斗
- **THEN** 在战斗日志中显示提示："在地魂战魂的神圣力量下，所有敌人的生命值减少X%。"

### Requirement: 怪物详情显示战魂套装压制信息
系统 SHALL 在怪物详情弹窗中显示战魂套装压制效果。

#### Scenario: 天魂套装压制显示
- **WHEN** 天魂套装已激活
- **AND** 玩家在战斗中点击查看怪物详情
- **THEN** 在怪物详情中显示战魂套装压制信息
- **AND** 战斗力行显示格式："战斗力：被压制后值（-X%）"
- **AND** 显示提示："天魂套装压制：敌人战斗力降低X%"

#### Scenario: 地魂套装压制显示
- **WHEN** 地魂套装已激活
- **AND** 玩家在战斗中点击查看怪物详情
- **THEN** 在怪物详情中显示战魂套装压制信息
- **AND** 生命值行显示格式："生命值：被压制后值/被压制后最大值（-X%）"
- **AND** 显示提示："地魂套装压制：敌人生命值降低X%"

#### Scenario: 无套装压制显示
- **WHEN** 没有激活任何战魂套装
- **THEN** 怪物详情正常显示，无压制信息

## MODIFIED Requirements

### Requirement: 战魂套装效果函数修改
战魂套装效果函数 SHALL 计算怪物属性压制而非角色属性加成。

#### Scenario: calculateTianHunSetBonus 改为 calculateTianHunSetSuppression
- **WHEN** 调用天魂套装效果函数时
- **THEN** 函数名改为 `calculateTianHunSetSuppression`
- **AND** 返回怪物战斗力压制百分比（如0.06表示6%）
- **AND** 计算公式：套装等级 × 2%

#### Scenario: calculateDiHunSetBonus 改为 calculateDiHunSetSuppression
- **WHEN** 调用地魂套装效果函数时
- **THEN** 函数名改为 `calculateDiHunSetSuppression`
- **AND** 返回怪物生命值压制百分比（如0.15表示15%）
- **AND** 计算公式：套装等级 × 5%

### Requirement: 敌人创建时应用战魂套装压制
创建敌人时 SHALL 应用战魂套装压制效果。

#### Scenario: createEnemyFromEnemyData 增加战魂套装压制参数
- **WHEN** 调用 createEnemyFromEnemyData 时
- **THEN** 增加 `warSoulSetInfo` 可选参数
- **AND** 如果天魂套装激活，应用战斗力压制
- **AND** 如果地魂套装激活，应用生命值压制

#### Scenario: createEnemyFromTemplate 增加战魂套装压制参数
- **WHEN** 调用 createEnemyFromTemplate 时
- **THEN** 增加 `warSoulSetInfo` 可选参数
- **AND** 如果天魂套装激活，应用战斗力压制
- **AND** 如果地魂套装激活，应用生命值压制

## REMOVED Requirements

### Requirement: calculateWarSoulPKCombatPower
**Reason**: PK赛功能暂未实现，此函数计算逻辑与当前套装压制概念不一致，避免误导
**Migration**: 当PK赛功能实现时，重新根据参考文档实现PK赛战斗力加成
