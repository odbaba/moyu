# 国王系统优化与魔中军阵地 Spec

## Why
国王系统是游戏主线剧情的核心，目前游戏中已有 `isKingRescued` 全局变量，但国王NPC的可见性控制、相关NPC对话变化、雪域边境入口限制、冰雪巨人可见性控制等功能尚未完整实现。同时，需要新增"魔中军阵地"地点作为游戏后期内容。

## What Changes
- 设置全局变量 `isKingRescued`，控制国王是否被救出
- 优化国王NPC：救出前不可见，救出后在皇宫可见
- 优化首相NPC："关于国王的消息"对话根据国王状态变化
- 优化公主NPC：聊天对话根据国王状态变化（已有部分实现）
- 优化日常任务官：任务描述和传送目标根据国王状态变化（已有部分实现）
- 优化雪域边境入口限制：国王救出前仅周五可进入，救出后随时可进入
- 优化冰雪巨人可见性：国王救出后隐藏
- 新增"魔中军阵地"地点：国王救出后解锁，包含6种魔族大军怪物

## Impact
- Affected specs: 国王系统、NPC系统、地图系统、怪物系统
- Affected code:
  - `src/App.tsx` - 全局状态管理、NPC交互处理、移动逻辑
  - `src/data/gameData.ts` - 地点配置
  - `src/data/npcData.ts` - NPC配置
  - `src/data/monsterData.ts` - 怪物模板和刷新配置
  - `src/data/interactableData.ts` - 交互对象配置
  - `src/utils/saveUtils.ts` - 存档系统
  - `src/components/home/InteractionButtons.tsx` - 交互按钮显示逻辑

## ADDED Requirements

### Requirement: 国王NPC可见性控制
系统应当在国王未救出时隐藏皇宫的国王NPC，救出后显示国王NPC。

#### Scenario: 国王未救出时
- **WHEN** `isKingRescued === false`
- **THEN** 皇宫不显示国王NPC

#### Scenario: 国王救出后
- **WHEN** `isKingRescued === true`
- **THEN** 皇宫显示国王NPC，玩家可与其交互查看魔族大军情报

### Requirement: 首相NPC对话变化
首相NPC的"关于国王的消息"选项应根据国王是否被救出显示不同对话。

#### Scenario: 国王未救出时
- **WHEN** 玩家选择"关于国王的消息"且 `isKingRescued === false`
- **THEN** 显示"人类的国王被前来偷袭的魔族大军先锋部队俘虏了..."的长文本

#### Scenario: 国王救出后
- **WHEN** 玩家选择"关于国王的消息"且 `isKingRescued === true`
- **THEN** 显示"感谢勇士们，我们的国王终于回来了。我们的国王智勇双全，看看他有什么对付魔族大军的策略吧。"

### Requirement: 雪域边境入口限制
雪域边境入口应根据国王是否被救出限制进入条件。

#### Scenario: 国王未救出时
- **WHEN** 玩家尝试进入雪域边境且 `isKingRescued === false`
- **AND** 当前不是周五（`nowday % 7 !== 5`）
- **THEN** 阻止进入并提示"该地方十分危险，你没有有任务不能进入雪域边境"

#### Scenario: 国王救出后
- **WHEN** 玩家尝试进入雪域边境且 `isKingRescued === true`
- **THEN** 允许随时进入

### Requirement: 冰雪巨人可见性控制
雪域边境的冰雪巨人怪物应根据国王是否被救出控制可见性。

#### Scenario: 国王未救出时
- **WHEN** `isKingRescued === false`
- **THEN** 雪域边境的冰雪巨人士兵、冰雪巨人士官可见

#### Scenario: 国王救出后
- **WHEN** `isKingRescued === true`
- **THEN** 雪域边境的冰雪巨人士兵、冰雪巨人士官隐藏

### Requirement: 魔中军阵地地点
系统应当在国王救出后解锁"魔中军阵地"地点，包含6种魔族大军怪物。

#### Scenario: 国王救出前
- **WHEN** `isKingRescued === false`
- **THEN** 魔中军阵地入口不可见

#### Scenario: 国王救出后
- **WHEN** `isKingRescued === true`
- **THEN** 魔中军阵地入口可见，玩家可从雪域边境进入
- **AND** 魔中军阵地包含以下怪物：
  - 魔军突击队（700级）
  - 魔军守卫军（800级）
  - 魔军神秘部队（900级）
  - 魔军图腾兽（1000级）
  - 魔的能量
  - 魔军主帅（2000级）

### Requirement: 存档系统支持国王状态
存档系统应当保存和加载国王是否被救出的状态。

#### Scenario: 保存游戏
- **WHEN** 玩家保存游戏
- **THEN** `isKingRescued` 状态被保存到 localStorage

#### Scenario: 加载游戏
- **WHEN** 玩家继续游戏
- **THEN** 从 localStorage 加载 `isKingRescued` 状态

## MODIFIED Requirements

### Requirement: NPC选项条件判断
NPC选项的条件判断系统需要支持国王状态条件。

#### 新增条件类型
- `kingRescued`: 国王是否被救出
  - `value: true` - 国王已救出
  - `value: false` - 国王未救出

### Requirement: 交互按钮显示条件
交互按钮的显示条件需要支持国王状态判断。

#### 新增条件
- 交互按钮可根据 `isKingRescued` 状态控制可见性
