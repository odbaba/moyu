# 战魂系统装备属性优化 Spec

## Why
当前战魂系统已有基础实现（战魂激活、战魂属性加成计算、战魂战斗力计算、战魂掉落等），但对照参考文档 `reference/docs/战魂系统完整文档.md`，仍缺少以下重要功能：
1. **战魂套装效果**：天魂套装攻击加成、地魂套装闪避加成、PK赛战斗力加成
2. **升极品时战魂逻辑**：升极品时已有战魂则等级+1，无战魂则2.5%概率激活
3. **魔魂升至12级时战魂等级提升**：当前 `refineMagicSoul` 未实现此逻辑
4. **摘除宝石时战魂等级降低**：当前无 `removeGem` 函数
5. **战魂系统开关检查**：精炼函数中缺少 `warSoulSystemEnabled` 参数检查
6. **战魂类型枚举**：当前 `soulType` 为裸数字，缺少枚举约束
7. **战魂显示优化**：5级应显示MAX、需显示效果描述

## What Changes
- 新增 `WarSoulType` 枚举类型，替代 `soulType` 的裸数字
- 新增战魂套装效果计算函数（天魂套装攻击加成、地魂套装闪避加成、PK赛战斗力加成）
- 修改 `refineQuality` 函数：升极品时增加战魂等级提升/激活逻辑
- 修改 `refineMagicSoul` 函数：魔魂升至12级时战魂等级+1
- 新增 `removeGem` 函数：摘除宝石时战魂等级降为1
- 修改 `activateSoul` 函数：增加 `warSoulSystemEnabled` 参数检查
- 修改 `activateSoulInternal` 函数：增加 `warSoulSystemEnabled` 参数检查
- 修改 `refineOpenHole` 函数：增加 `warSoulSystemEnabled` 参数检查
- 优化 `EquipmentDetailModal` 战魂显示：5级显示MAX、显示效果描述
- 更新 `equipmentRefine.md` 文档

## Impact
- Affected specs:
  - add-equipment-refiner（装备打造师系统）
  - optimize-character-equipment-system（装备系统）
- Affected code:
  - `src/types/index.ts`（新增 WarSoulType 枚举，更新接口类型）
  - `src/utils/equipmentRefine.ts`（完善战魂等级升降逻辑、增加开关检查）
  - `src/utils/equipmentConverter.ts`（优化战魂属性计算、使用枚举）
  - `src/utils/combatPower.ts`（实现战魂套装效果计算）
  - `src/utils/attributeCalculator.ts`（战魂属性加成到角色、使用枚举）
  - `src/components/common/EquipmentDetailModal.tsx`（优化战魂显示）
  - `src/App.tsx`（传递 warSoulSystemEnabled 到精炼函数）
  - `src/utils/equipmentRefine.md`（更新文档）

## ADDED Requirements

### Requirement: 战魂类型枚举定义
系统 SHALL 提供战魂类型的枚举定义。

#### Scenario: 战魂类型枚举
- **WHEN** 定义战魂类型时
- **THEN** 使用枚举类型 `WarSoulType`：
  - NONE: 0（无战魂）
  - TIAN_HUN: 1（天魂）
  - DI_HUN: 2（地魂）

#### Scenario: 接口类型更新
- **WHEN** 定义装备战魂属性时
- **THEN** `EquipmentDetail.soulType` 类型更新为 `WarSoulType`
- **AND** `EquipmentItem.soulType` 类型更新为 `WarSoulType`
- **AND** `soulLevel` 范围为 1-5

### Requirement: 战魂套装效果计算
系统 SHALL 实现战魂套装效果的计算。

#### Scenario: 天魂套装激活
- **WHEN** 所有6件装备都有战魂
- **AND** 所有装备战魂类型 = WarSoulType.TIAN_HUN（1）
- **THEN** 激活天魂套装，攻击力加成 = 每件装备战魂等级 × 5%
- **AND** 最大加成：6件 × 5级 × 5% = 150%

#### Scenario: 地魂套装激活
- **WHEN** 所有6件装备都有战魂
- **AND** 所有装备战魂类型 = WarSoulType.DI_HUN（2）
- **THEN** 激活地魂套装，闪避率加成 = 每件装备战魂等级 × 2%
- **AND** 最大加成：6件 × 5级 × 2% = 60%

#### Scenario: 套装等级计算
- **WHEN** 计算战魂套装等级时
- **THEN** 套装等级 = 所有装备战魂等级中的最小值

#### Scenario: 混合战魂无套装效果
- **WHEN** 6件装备战魂类型不完全一致时
- **THEN** 无套装效果

#### Scenario: PK赛战斗力加成
- **WHEN** 在PK赛中
- **AND** 战魂套装已激活
- **THEN** 战斗力加成 = 套装等级 × 5%

### Requirement: 升极品时战魂逻辑
系统 SHALL 在装备升极品时处理战魂相关逻辑。

#### Scenario: 升极品时已有战魂且等级<5
- **WHEN** 装备品质提升到极品（pz >= 4）
- **AND** 装备已有战魂（soulType > WarSoulType.NONE）
- **AND** 战魂等级 < 5
- **THEN** 战魂等级 + 1
- **AND** 显示提示："装备品质提升到了极品使得装备能量提升，战魂等级提高一级。"

#### Scenario: 升极品时无战魂概率激活
- **WHEN** 装备品质提升到极品
- **AND** 装备无战魂（soulType <= WarSoulType.NONE）
- **THEN** 2.5%概率激活战魂
- **AND** 激活时随机获得天魂或地魂，等级为1

### Requirement: 魔魂升至12级时战魂等级提升
系统 SHALL 在魔魂升至12级时提升战魂等级。

#### Scenario: 魔魂升至12级时战魂等级提升
- **WHEN** 装备魔魂等级升至12级
- **AND** 装备已有战魂（soulType > WarSoulType.NONE）
- **AND** 战魂等级 < 5
- **THEN** 战魂等级 + 1
- **AND** 显示提示："魔魂等级提升到了12级使得装备能量提升，战魂等级提高一级。"

#### Scenario: 战魂等级上限
- **WHEN** 战魂等级已达到5级
- **THEN** 无法继续提升

### Requirement: 摘除宝石时战魂等级降低
系统 SHALL 实现摘除宝石时战魂等级降低逻辑。

#### Scenario: 摘除宝石时战魂等级降低
- **WHEN** 摘除装备上的宝石
- **AND** 装备已有战魂（soulType > WarSoulType.NONE）
- **AND** 战魂等级 > 1
- **THEN** 战魂等级降为1
- **AND** 显示提示："摘除宝石操作使战魂的等级下降为1级"

#### Scenario: 战魂等级为1时摘除宝石
- **WHEN** 摘除装备上的宝石
- **AND** 装备已有战魂
- **AND** 战魂等级 = 1
- **THEN** 战魂等级不变

### Requirement: 战魂系统开关检查
系统 SHALL 在战魂相关操作中检查战魂系统是否已开启。

#### Scenario: 使用战魂物品时检查开关
- **WHEN** 使用战魂晶石或战魂之心激活战魂
- **AND** 战魂系统未开启（warSoulSystemEnabled = false）
- **THEN** 返回失败，提示："战魂系统尚未开启，请先击败无名氏开启战魂系统"

#### Scenario: 开洞时概率激活战魂检查开关
- **WHEN** 开洞时概率激活战魂
- **AND** 战魂系统未开启
- **THEN** 不触发战魂激活

### Requirement: 战魂显示优化
系统 SHALL 优化战魂信息显示。

#### Scenario: 战魂等级5级显示MAX
- **WHEN** 战魂等级 = 5
- **THEN** 显示格式："天魂MAX" 或 "地魂MAX"

#### Scenario: 战魂等级1-4级显示等级
- **WHEN** 战魂等级 < 5
- **THEN** 显示格式："天魂X级" 或 "地魂X级"

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

### Requirement: 精炼函数增加战魂系统开关参数
精炼函数 SHALL 接受战魂系统开关参数。

#### Scenario: refineQuality 增加开关参数
- **WHEN** 调用 refineQuality 时
- **THEN** 函数签名增加 `warSoulSystemEnabled?: boolean` 参数
- **AND** 升极品时根据开关决定是否触发战魂逻辑

#### Scenario: refineMagicSoul 增加开关参数
- **WHEN** 调用 refineMagicSoul 时
- **THEN** 函数签名增加 `warSoulSystemEnabled?: boolean` 参数
- **AND** 魔魂升至12级时根据开关决定是否触发战魂逻辑

#### Scenario: refineOpenHole 增加开关参数
- **WHEN** 调用 refineOpenHole 时
- **THEN** 函数签名增加 `warSoulSystemEnabled?: boolean` 参数
- **AND** 开洞时根据开关决定是否触发战魂激活

#### Scenario: activateSoul 增加开关参数
- **WHEN** 调用 activateSoul 时
- **THEN** 函数签名增加 `warSoulSystemEnabled?: boolean` 参数
- **AND** 战魂系统未开启时返回失败

## REMOVED Requirements
无移除的需求。
