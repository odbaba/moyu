# 幻兽系统重构 Spec

## Why
当前幻兽系统存在评分计算不准确、品质显示不符合文档规范、幻兽升级后属性未正确更新、以及幻兽生成逻辑分散不统一等问题。需要重构幻兽生成代码和幻兽数据代码，优化幻兽系统逻辑，确保幻兽评分计算正确、品质按文档显示、升级属性正确更新、以及幻兽生成逻辑统一。

## What Changes
- 重构幻兽评分计算逻辑，严格按照文档规范实现
- 修正幻兽品质显示逻辑，按照评分范围正确显示品质称号
- 实现幻兽升级后根据成长率更新属性的机制
- 统一幻兽生成模块，商店购买和抽奖系统的幻兽都来源于公共生成模块
- **BREAKING**: 修改品质计算逻辑，从固定分数区间改为文档规定的品质称号系统

## Impact
- Affected specs: 幻兽系统、商店系统、抽奖系统
- Affected code: `src/utils/petGenerator.ts`, `src/data/petData.ts`, `src/utils/lotterySystem.ts`, `src/data/shopData.ts`, `src/components/pet/`

## ADDED Requirements

### Requirement: 幻兽评分计算
系统 SHALL 按照文档规范正确计算幻兽评分。

#### Scenario: 初始属性评分计算
- **WHEN** 计算初始属性评分时
- **THEN** 应按照以下公式计算：
  - 初始生命评分 = max(0, (初始生命 - 100) × 2)
  - 初始最小攻击评分 = max(0, (初始最小攻击 - 15) × 2)
  - 初始最大攻击评分 = max(0, (初始最大攻击 - 25) × 2)
  - 初始防御评分 = max(0, (初始防御 - 10) × 2)

#### Scenario: 成长属性评分计算
- **WHEN** 计算成长属性评分时
- **THEN** 应按照以下规则计算：
  - 差值 ≤ 10: 评分 = 差值 × 20
  - 差值 > 10: 评分 = (差值 - 10) × 100 + 200
  - 标准成长值：生命40、最小攻击10、最大攻击15、防御5

#### Scenario: 总评分计算
- **WHEN** 计算总评分时
- **THEN** 总评分 = 基础评分 + 所有初始属性评分 + 所有成长属性评分

### Requirement: 幻兽品质显示
系统 SHALL 按照文档规范显示幻兽品质称号。

#### Scenario: 品质称号显示规则
- **WHEN** 显示幻兽品质时
- **THEN** 应按照以下规则显示：
  - 评分 >= 100: 显示"极品 X 星"（X = 评分 / 100）
  - 评分 >= 75: 显示"万众瞩目"
  - 评分 >= 50: 显示"千载难逢"
  - 评分 >= 25: 显示"百里挑一"
  - 评分 >= 10: 显示"优秀"
  - 评分 < 10: 显示"普通"

### Requirement: 幻兽升级属性更新
系统 SHALL 在幻兽升级后根据成长率更新属性。

#### Scenario: 升级属性计算
- **WHEN** 幻兽等级提升时
- **THEN** 应按照以下公式重新计算属性：
  - 最大生命 = 生命成长率 × (等级 - 1) + 初始生命
  - 最小攻击 = 最小攻击成长率 × (等级 - 1) + 初始最小攻击
  - 最大攻击 = 最大攻击成长率 × (等级 - 1) + 初始最大攻击
  - 防御 = 防御成长率 × (等级 - 1) + 初始防御

#### Scenario: 升级后生命值处理
- **WHEN** 幻兽升级后
- **THEN** 当前生命值应设置为新的最大生命值

### Requirement: 统一幻兽生成模块
系统 SHALL 提供统一的幻兽生成模块。

#### Scenario: 商店购买幻兽
- **WHEN** 玩家从商店购买幻兽时
- **THEN** 应使用 `petGenerator.ts` 中的生成函数创建幻兽

#### Scenario: 抽奖获得幻兽
- **WHEN** 玩家通过抽奖获得幻兽时
- **THEN** 应使用 `petGenerator.ts` 中的生成函数创建幻兽

#### Scenario: 幻兽生成函数
- **WHEN** 调用幻兽生成函数时
- **THEN** 应提供以下生成函数：
  - `generatePetByType(petType, options)`: 根据类型生成幻兽
  - `generateStrangePet(qualityScore)`: 生成奇异兽
  - `generateStarStrangePet(starLevel)`: 生成指定星级奇异兽

## MODIFIED Requirements

### Requirement: 幻兽评分接口
系统 SHALL 扩展幻兽评分接口，支持品质称号显示。

#### Scenario: 评分接口扩展
- **WHEN** 定义幻兽评分接口时
- **THEN** 应包含以下属性：
  - pzbase: 基础评分
  - pz_chp, pz_cxgj, pz_cdgj, pz_cfy: 初始属性评分
  - pz_cz_hp, pz_cz_xgj, pz_cz_dgj, pz_cz_fy: 成长属性评分
  - qualityTitle: 品质称号（如"极品12星"、"万众瞩目"等）

### Requirement: 幻兽接口
系统 SHALL 扩展幻兽接口，支持品质称号和升级函数。

#### Scenario: 幻兽接口扩展
- **WHEN** 定义幻兽接口时
- **THEN** 应包含以下属性：
  - qualityTitle: 品质称号
  - upgradeLevel(): 升级函数

## REMOVED Requirements

### Requirement: 旧的品质计算逻辑
**Reason**: 旧的品质计算逻辑不符合文档规范，使用固定分数区间（普通<300, 良品<500等）与文档规定的品质称号系统不一致。
**Migration**: 使用新的品质称号系统替代，按照评分范围显示"极品X星"、"万众瞩目"等称号。
