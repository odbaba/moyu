# 修复每日初始化逻辑重复执行问题 Spec

## Why
当前每日初始化逻辑在"继续游戏"时会重复执行，因为 `prevDayRef` 的初始值与加载存档后的 `timeSystem.nowday` 不一致，导致条件判断错误触发。

## What Changes
- 将每日初始化逻辑统一到一个函数中
- 修复 `prevDayRef` 初始化问题，确保"继续游戏"不会触发每日初始化
- 只有真正的新的一天开始才会执行每日初始化逻辑

## Impact
- Affected specs: 时间系统、存档系统
- Affected code: `src/App.tsx`

## ADDED Requirements

### Requirement: 每日初始化逻辑只在新的一天执行
系统应当只在游戏过程中天数真正变化时执行每日初始化逻辑，而不是在加载存档时执行。

#### Scenario: 继续游戏不触发每日初始化
- **WHEN** 玩家从存档加载游戏
- **THEN** 每日初始化逻辑不执行

#### Scenario: 新的一天触发每日初始化
- **WHEN** 游戏过程中时间推进到新的一天
- **THEN** 每日初始化逻辑执行

## MODIFIED Requirements

### Requirement: prevDayRef 初始化
`prevDayRef` 应当在组件初始化时设置为当前 `timeSystem.nowday` 的值，而不是 `undefined` 或 `0`。

## REMOVED Requirements

无
