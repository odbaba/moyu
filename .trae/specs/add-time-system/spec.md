# 时间系统 Spec

## Why
游戏需要一个时间系统来管理玩家的行动消耗。根据参考文档，游戏采用独特的时间系统，将现实时间转换为游戏内的"天"和"时间单位"。玩家的每个行动都会消耗时间单位，当时间累积到一定值时进入下一天。系统还包含星期系统，不同星期会有不同的特殊事件。

## What Changes
- 新增时间系统状态管理（当前天数、当天已用时间单位、一天时间单位总数、当前星期）
- 在交互日志区最上方新增时间显示组件
- 时间显示组件包含：当前天数、当前星期、时间单位进度条（绿色条）
- 挖矿功能消耗1个时间单位
- 战斗功能消耗3个时间单位

## Impact
- Affected specs: 无
- Affected code: 
  - `src/App.tsx` - 新增时间状态管理，修改挖矿逻辑
  - `src/components/home/InteractionLog.tsx` - 新增时间显示组件
  - `src/components/home/home.css` - 新增时间显示样式
  - `src/types/index.ts` - 新增时间系统类型定义

## ADDED Requirements

### Requirement: 时间系统状态管理
系统 SHALL 提供时间状态管理功能，包括：
- 当前天数（nowday）：初始值为1
- 当天已用时间单位（nowtime）：初始值为0
- 一天时间单位总数（onedaytime）：固定为15
- 当前星期（weekday）：根据 nowday % 7 计算

#### Scenario: 时间消耗
- **WHEN** 玩家执行消耗时间的操作
- **THEN** 系统增加已用时间单位
- **AND** 如果已用时间单位达到一天上限，进入下一天

### Requirement: 星期系统
系统 SHALL 根据当前天数计算星期：
- nowday % 7 == 1 -> 星期一
- nowday % 7 == 2 -> 星期二
- nowday % 7 == 3 -> 星期三
- nowday % 7 == 4 -> 星期四
- nowday % 7 == 5 -> 星期五
- nowday % 7 == 6 -> 星期六
- nowday % 7 == 0 -> 星期天

#### Scenario: 星期显示
- **WHEN** 天数变化
- **THEN** 更新当前星期显示

### Requirement: 时间显示组件
系统 SHALL 在交互日志区最上方显示时间信息：
- 显示格式：第X天 星期X
- 时间单位进度条：15个绿色条，每个代表1个时间单位
- 已消耗的时间单位显示为深绿色，未消耗的显示为浅灰色
- 黑色边框，样式与首页保持一致

#### Scenario: 时间显示更新
- **WHEN** 时间状态发生变化
- **THEN** 时间显示组件实时更新显示

### Requirement: 挖矿消耗时间
系统 SHALL 在挖矿时消耗1个时间单位

#### Scenario: 挖矿消耗时间
- **WHEN** 玩家执行挖矿操作
- **THEN** 系统消耗1个时间单位
- **AND** 更新时间显示

### Requirement: 战斗消耗时间
系统 SHALL 在战斗结束时消耗3个时间单位

#### Scenario: 战斗消耗时间
- **WHEN** 战斗结束
- **THEN** 系统消耗3个时间单位
- **AND** 更新时间显示

## MODIFIED Requirements
无

## REMOVED Requirements
无
