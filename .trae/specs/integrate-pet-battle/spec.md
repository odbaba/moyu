# 战斗幻兽集成 Spec

## Why
当前战斗系统只显示玩家角色，没有显示出战幻兽。幻兽系统已经实现了出战和合体功能，但战斗页面没有集成幻兽显示和合体伤害分担机制。需要将幻兽系统集成到战斗页面，提升游戏体验和战斗策略性。

## What Changes
- 在战斗页面我方九宫格的左下角（位置 0,2）和右下角（位置 2,2）显示出战幻兽
- 为合体状态的幻兽添加特殊的视觉标识和显示效果
- 修改敌方攻击逻辑，优先攻击合体状态的幻兽，合体幻兽阵亡后才攻击玩家
- 新增幻兽战斗数据类型和转换工具函数

## Impact
- Affected specs: 战斗系统、幻兽系统
- Affected code: `src/components/battle/Battle.tsx`, `src/components/battle/CharacterCard.tsx`, `src/components/battle/battle.css`, `src/types/index.ts`, `src/utils/battleAdapter.ts`

## ADDED Requirements

### Requirement: 战斗页面显示出战幻兽
系统 SHALL 在战斗页面我方九宫格中显示出战幻兽。

#### Scenario: 显示出战幻兽
- **WHEN** 玩家有幻兽出战时
- **THEN** 在我方九宫格的左下角（位置 0,2）显示第一个出战幻兽
- **AND** 在我方九宫格的右下角（位置 2,2）显示第二个出战幻兽
- **AND** 玩家角色固定在九宫格中心（位置 1,1）

#### Scenario: 无出战幻兽
- **WHEN** 玩家没有幻兽出战时
- **THEN** 我方九宫格左下角和右下角显示空位置
- **AND** 只显示玩家角色在中心位置

### Requirement: 合体幻兽视觉标识
系统 SHALL 为合体状态的幻兽添加特殊的视觉标识。

#### Scenario: 合体状态显示
- **WHEN** 幻兽处于合体状态时
- **THEN** 在幻兽卡片上显示"合体"字样标签
- **AND** 幻兽卡片边框使用特殊颜色（金色发光效果）
- **AND** 幻兽卡片显示合体状态图标

#### Scenario: 非合体状态显示
- **WHEN** 幻兽未处于合体状态时
- **THEN** 幻兽卡片显示正常样式
- **AND** 不显示合体相关标识

### Requirement: 敌方优先攻击合体幻兽
系统 SHALL 在敌方回合优先攻击合体状态的幻兽。

#### Scenario: 有合体幻兽时的攻击顺序
- **WHEN** 敌方攻击时
- **AND** 第一出战位幻兽处于合体状态
- **THEN** 敌方优先攻击第一出战位的合体幻兽
- **AND** 扣除该幻兽的血量

#### Scenario: 第一合体幻兽阵亡
- **WHEN** 第一出战位的合体幻兽血量降为0时
- **AND** 第二出战位幻兽处于合体状态
- **THEN** 敌方下次攻击时攻击第二出战位的合体幻兽
- **AND** 扣除该幻兽的血量

#### Scenario: 无合体幻兽时攻击玩家
- **WHEN** 敌方攻击时
- **AND** 没有合体状态的幻兽（或所有合体幻兽已阵亡）
- **THEN** 敌方攻击玩家角色
- **AND** 扣除玩家的血量

#### Scenario: 幻兽阵亡后从战斗移除
- **WHEN** 幻兽血量降为0时
- **THEN** 幻兽从战斗九宫格中消失
- **AND** 该位置显示为空或阵亡状态

### Requirement: 幻兽战斗数据转换
系统 SHALL 提供幻兽数据到战斗数据的转换功能。

#### Scenario: 幻兽数据转换
- **WHEN** 需要将幻兽数据用于战斗时
- **THEN** 将 Pet 类型转换为 BattlePet 类型
- **AND** 包含幻兽的战斗属性（攻击力、防御力、血量等）
- **AND** 包含幻兽的合体状态信息

### Requirement: 战斗状态扩展
系统 SHALL 扩展战斗状态以包含幻兽信息。

#### Scenario: 战斗状态包含幻兽
- **WHEN** 战斗初始化时
- **THEN** 战斗状态中包含出战幻兽列表
- **AND** 记录每个幻兽的合体状态
- **AND** 记录幻兽的当前位置信息

## MODIFIED Requirements

### Requirement: 战斗初始化逻辑
系统 SHALL 在战斗初始化时处理幻兽数据。

#### Scenario: 初始化包含幻兽的战斗
- **WHEN** 战斗开始时
- **AND** 玩家有幻兽出战
- **THEN** 将出战幻兽数据转换为战斗数据
- **AND** 将幻兽放置在九宫格的指定位置
- **AND** 初始化幻兽的合体状态

### Requirement: 战斗结束处理
系统 SHALL 在战斗结束时更新幻兽状态。

#### Scenario: 战斗结束更新幻兽
- **WHEN** 战斗结束时
- **THEN** 将幻兽的战斗后状态（血量）同步回幻兽数据
- **AND** 如果幻兽阵亡，重置幻兽状态

## REMOVED Requirements
无移除的需求。
