# 幻兽研究所逻辑优化 Spec

## Why
当前幻兽研究所的实现与参考文档存在多处不一致，包括资助魔石计算错误、缺少技术等级限制检查、缺少生产量自动增长逻辑等。需要优化以符合原始游戏设计。

## What Changes
- 修复资助魔石计算：从每100魔石提升1级改为每10000魔石提升1级
- 添加技术等级>=20才能购买幻兽的限制
- 添加技术等级达到20级时生产量自动+1的逻辑
- 添加资助最低金额限制（100魔石）
- 添加购买时幻兽背包满检查提示
- 移除2008奥运使者相关逻辑（已完成）
- 优化提高产量任务描述（从"周日开放"改为"每周一次"）

## Impact
- Affected specs: 幻兽研究所系统
- Affected code: 
  - `src/utils/petInstituteUtils.ts`
  - `src/components/pet/PetInstituteModal.tsx`
  - `src/data/npcData.ts`
  - `src/App.tsx`

## ADDED Requirements

### Requirement: 技术等级限制
系统应当在购买幻兽时检查技术等级是否>=20级。

#### Scenario: 技术等级不足
- **WHEN** 玩家尝试购买幻兽且技术等级<20
- **THEN** 显示提示"技术20级前不能生产幻兽"

### Requirement: 生产量自动增长
系统应当在技术等级首次达到20级时自动将生产量从0提升到1。

#### Scenario: 技术等级达到20级
- **WHEN** 技术等级从<20变为>=20且生产量为0
- **THEN** 生产量自动+1

### Requirement: 资助最低金额
系统应当限制最低资助金额为100魔石。

#### Scenario: 资助金额不足
- **WHEN** 玩家尝试资助且金额<100魔石
- **THEN** 显示提示"最低资助金额为100魔石"

## MODIFIED Requirements

### Requirement: 资助魔石提升技术等级
系统应当允许玩家通过资助魔石提升技术等级，每10000魔石提升1级（而非当前的每100魔石）。

#### Scenario: 资助成功
- **WHEN** 玩家资助10000魔石
- **THEN** 技术等级+1

### Requirement: 提高产量任务
系统应当将提高产量任务描述从"周日开放"改为"每周一次"，任务逻辑保持不变（每周重置时开启）。

## REMOVED Requirements

### Requirement: 2008奥运使者相关逻辑
**Reason**: 用户明确要求移除2008奥运使者相关逻辑
**Migration**: 已在之前的任务中完成移除
