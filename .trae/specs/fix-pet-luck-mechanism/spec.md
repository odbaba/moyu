# 修正幻兽阵亡幸运值机制 Spec

## Why
之前错误地为幻兽添加了幸运值属性，实际上幻兽本身没有幸运值，应该使用人物的幸运值属性。需要删除幻兽幸运值相关内容，并修正幻兽阵亡时的幸运值处理逻辑，同时集成"爱的力量"技能的触发机制。

## What Changes
- **BREAKING** 删除幻兽的幸运值属性（Pet.luck 和 BattlePet.luck）
- 修改幻兽阵亡逻辑：降低人物幸运值10点
- 集成"爱的力量"技能：幻兽阵亡时有20%概率触发，幸运值+10，幻兽满血复活
- 人物幸运值为0时自动退出战斗（现有逻辑，无需修改）

## Impact
- Affected specs: 战斗系统、幻兽系统
- Affected code: 
  - `src/types/index.ts` - 删除 Pet 和 BattlePet 的 luck 属性
  - `src/utils/petGenerator.ts` - 删除幻兽幸运值初始化
  - `src/utils/battleAdapter.ts` - 删除幸运值转换
  - `src/components/battle/Battle.tsx` - 修改幻兽阵亡逻辑，集成爱的力量技能
  - `src/components/battle/CharacterCard.tsx` - 删除幻兽幸运值显示
  - `src/components/battle/battle.css` - 删除幻兽幸运值样式

## ADDED Requirements

### Requirement: 幻兽阵亡降低人物幸运值
系统 SHALL 在幻兽阵亡时降低人物幸运值。

#### Scenario: 幻兽阵亡降低人物幸运值
- **WHEN** 幻兽阵亡时
- **THEN** 人物幸运值降低10点
- **AND** 添加战斗日志记录幸运值降低
- **AND** 检查是否触发"爱的力量"技能

### Requirement: 爱的力量技能触发
系统 SHALL 在幻兽阵亡时检查并触发"爱的力量"技能。

#### Scenario: 触发爱的力量技能
- **WHEN** 幻兽阵亡时
- **AND** 人物学习了"爱的力量"技能
- **AND** 随机数触发20%概率
- **THEN** 人物幸运值+10
- **AND** 幻兽满血复活
- **AND** 添加战斗日志记录爱的力量触发

#### Scenario: 未触发爱的力量技能
- **WHEN** 幻兽阵亡时
- **AND** 人物未学习"爱的力量"技能
- **OR** 随机数未触发20%概率
- **THEN** 人物幸运值降低10点
- **AND** 幻兽继续阵亡

### Requirement: 人物幸运值为0退出战斗
系统 SHALL 在人物幸运值降为0时自动退出战斗。

#### Scenario: 人物幸运值降为0
- **WHEN** 人物幸运值降为0时
- **THEN** 自动退出战斗
- **AND** 添加战斗日志记录

## MODIFIED Requirements

### Requirement: 幻兽阵亡处理逻辑
系统 SHALL 修改幻兽阵亡的处理逻辑。

**原逻辑**：
- 幻兽血量降为0时，幻兽阵亡
- 幻兽从九宫格中移除

**新逻辑**：
- 幻兽血量降为0时，幻兽阵亡
- 人物幸运值降低10点
- 检查是否触发"爱的力量"技能
- 如果触发，幻兽满血复活
- 如果未触发，幻兽从九宫格中移除

## REMOVED Requirements

### Requirement: 幻兽幸运值属性
**Reason**: 幻兽本身没有幸运值属性，使用的是人物的幸运值属性
**Migration**: 删除 Pet 和 BattlePet 接口中的 luck 属性，删除相关初始化、转换和显示逻辑

### Requirement: 幻兽保留1血机制
**Reason**: 幻兽阵亡时直接降低人物幸运值，不再保留1血
**Migration**: 删除幻兽保留1血的相关逻辑，恢复原有的阵亡处理
