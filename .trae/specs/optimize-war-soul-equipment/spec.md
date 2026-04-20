# 战魂系统装备属性优化 Spec

## Why
当前战魂系统已有基础实现，但缺少一些重要功能：战魂套装效果（天魂套装攻击加成、地魂套装闪避加成）、战魂等级降低逻辑（使用战魂物品、摘除宝石）、魔魂升至12级时战魂等级提升逻辑、战魂等级达到5级时显示MAX等。需要根据战魂系统完整文档进行优化补充。

## What Changes
- 优化战魂类型定义（添加枚举类型）
- 实现战魂套装效果计算
- 完善战魂等级提升逻辑（魔魂升至12级）
- 实现战魂等级降低逻辑（使用战魂物品、摘除宝石）
- 优化战魂显示（5级显示MAX）
- 实现战魂属性加成到角色属性计算

## Impact
- Affected specs:
  - add-equipment-refiner（装备打造师系统）
  - optimize-character-equipment-system（装备系统）
- Affected code:
  - src/types/index.ts（优化战魂类型定义）
  - src/utils/equipmentConverter.ts（优化战魂属性计算）
  - src/utils/combatPower.ts（实现战魂套装效果）
  - src/utils/attributeCalculator.ts（战魂属性加成到角色）
  - src/utils/equipmentRefine.ts（完善战魂等级升降逻辑）
  - src/components/common/EquipmentDetailModal.tsx（优化战魂显示）

## ADDED Requirements

### Requirement: 战魂类型枚举定义
系统 SHALL 提供战魂类型的枚举定义。

#### Scenario: 战魂类型枚举
- **WHEN** 定义战魂类型时
- **THEN** 使用枚举类型 `WarSoulType`：
  - NONE: 0（无战魂）
  - TIAN_HUN: 1（天魂）
  - DI_HUN: 2（地魂）

### Requirement: 战魂套装效果计算
系统 SHALL 实现战魂套装效果的计算。

#### Scenario: 天魂套装激活
- **WHEN** 所有6件装备都有战魂
- **AND** 所有装备战魂类型 = 1（天魂）
- **THEN** 激活天魂套装，攻击力加成 = 每件装备战魂等级 × 5%
- **AND** 最大加成：6件 × 5级 × 5% = 150%

#### Scenario: 地魂套装激活
- **WHEN** 所有6件装备都有战魂
- **AND** 所有装备战魂类型 = 2（地魂）
- **THEN** 激活地魂套装，闪避率加成 = 每件装备战魂等级 × 2%
- **AND** 最大加成：6件 × 5级 × 2% = 60%

#### Scenario: 套装等级计算
- **WHEN** 计算战魂套装等级时
- **THEN** 套装等级 = 所有装备战魂等级中的最小值

#### Scenario: PK赛战斗力加成
- **WHEN** 在PK赛中
- **AND** 战魂套装已激活
- **THEN** 战斗力加成 = 套装等级 × 5%

### Requirement: 战魂等级提升逻辑
系统 SHALL 完善战魂等级提升逻辑。

#### Scenario: 魔魂升至12级时战魂等级提升
- **WHEN** 装备魔魂等级升至12级
- **AND** 装备已有战魂（soulType > 0）
- **AND** 战魂等级 < 5
- **THEN** 战魂等级 + 1
- **AND** 显示提示："魔魂等级提升到了12级使得装备能量提升，战魂等级提高一级。"

#### Scenario: 战魂等级上限
- **WHEN** 战魂等级已达到5级
- **THEN** 无法继续提升

### Requirement: 战魂等级降低逻辑
系统 SHALL 实现战魂等级降低逻辑。

#### Scenario: 使用战魂晶石/战魂之心时等级重置
- **WHEN** 使用战魂晶石或战魂之心
- **AND** 装备已有战魂
- **THEN** 战魂等级重置为1

#### Scenario: 摘除宝石时战魂等级降低
- **WHEN** 摘除装备上的宝石
- **AND** 装备已有战魂
- **AND** 战魂等级 > 1
- **THEN** 战魂等级降为1
- **AND** 显示提示："摘除宝石操作使战魂的等级下降为1级"

### Requirement: 战魂显示优化
系统 SHALL 优化战魂信息显示。

#### Scenario: 战魂等级5级显示MAX
- **WHEN** 战魂等级 = 5
- **THEN** 显示格式："天魂MAX" 或 "地魂MAX"

#### Scenario: 战魂效果显示
- **WHEN** 显示战魂属性时
- **THEN** 显示战魂效果：
  - 天魂："效果：攻击+X%"
  - 地魂："效果：闪避+X%"

### Requirement: 战魂属性加成到角色属性
系统 SHALL 实现战魂属性加成到角色属性的计算。

#### Scenario: 天魂攻击加成
- **WHEN** 计算角色攻击力时
- **THEN** 攻击力 += 每件天魂装备的（战魂等级 × 5% × 基础攻击力）

#### Scenario: 地魂闪避加成
- **WHEN** 计算角色闪避率时
- **THEN** 闪避率 += 每件地魂装备的（战魂等级 × 2%）

## MODIFIED Requirements

### Requirement: 战魂属性接口优化
战魂属性接口 SHALL 使用枚举类型。

#### Scenario: 使用枚举类型
- **WHEN** 定义装备战魂属性时
- **THEN** 使用 `WarSoulType` 枚举替代数字
- **AND** soulType 类型为 `WarSoulType`
- **AND** soulLevel 范围为 1-5

### Requirement: 战魂属性计算函数优化
战魂属性计算函数 SHALL 支持套装效果。

#### Scenario: 函数签名更新
- **WHEN** 调用战魂属性计算函数时
- **THEN** 函数参数包含所有装备信息
- **AND** 函数返回单件装备战魂加成和套装战魂加成

## REMOVED Requirements
无移除的需求。
