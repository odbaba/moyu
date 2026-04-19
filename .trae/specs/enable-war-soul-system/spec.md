# 战魂系统开启机制 Spec

## Why
当前游戏中，战魂系统相关的功能（装备打造师的"关于战魂"选项、战魂之心和战魂晶石的掉落）没有与战魂系统开启状态关联。根据 reference/docs/战魂系统完整文档.md，战魂系统需要通过击败无名氏BOSS才能开启，开启前玩家不应该看到战魂相关内容。

## What Changes
- 新增全局状态管理战魂系统开启状态（warSoulSystemEnabled）
- 击败无名氏后自动开启战魂系统
- 装备打造师的"关于战魂"选项仅在战魂系统开启后显示
- 战魂之心和战魂晶石仅在战魂系统开启后才会掉落
- 实现各种怪物对战魂物品的掉落逻辑

## Impact
- Affected specs:
  - add-equipment-refiner（装备打造师系统）
  - add-monster-system（怪物系统）
  - battle-system（战斗系统）
- Affected code:
  - src/App.tsx（新增战魂系统开启状态）
  - src/data/npcData.ts（装备打造师交互选项条件显示）
  - src/utils/monsterDropUtils.ts（新增怪物掉落工具函数）
  - src/types/index.ts（新增战魂掉落配置类型）

## ADDED Requirements

### Requirement: 战魂系统全局状态管理
系统 SHALL 提供战魂系统开启状态的全局管理。

#### Scenario: 战魂系统默认关闭
- **WHEN** 游戏初始化时
- **THEN** 战魂系统默认为关闭状态（warSoulSystemEnabled = false）

#### Scenario: 击败无名氏开启战魂系统
- **WHEN** 玩家击败无名氏BOSS
- **THEN** 战魂系统自动开启（warSoulSystemEnabled = true）
- **AND** 显示提示："获得了战魂之心。终于找到关于战魂的秘密了，快去找装备打造师吧，他知道如果激发装备的战魂。"

#### Scenario: 战魂系统状态持久化
- **WHEN** 游戏保存时
- **THEN** 战魂系统开启状态应保存到存档中
- **WHEN** 游戏加载时
- **THEN** 应从存档中恢复战魂系统开启状态

### Requirement: 装备打造师战魂选项条件显示
系统 SHALL 根据战魂系统开启状态控制"关于战魂"选项的显示。

#### Scenario: 战魂系统未开启时隐藏选项
- **WHEN** 玩家与装备打造师交互
- **AND** 战魂系统未开启（warSoulSystemEnabled = false）
- **THEN** 不显示"关于战魂"交互选项

#### Scenario: 战魂系统开启后显示选项
- **WHEN** 玩家与装备打造师交互
- **AND** 战魂系统已开启（warSoulSystemEnabled = true）
- **THEN** 显示"关于战魂"交互选项

### Requirement: 战魂之心掉落逻辑
系统 SHALL 根据战魂系统开启状态控制战魂之心的掉落。

#### Scenario: 无名氏必定掉落战魂之心
- **WHEN** 玩家击败无名氏
- **THEN** 100%掉落战魂之心
- **AND** 同时开启战魂系统

#### Scenario: 魔军主帅掉落战魂之心
- **WHEN** 玩家击败魔军主帅
- **AND** 战魂系统已开启（warSoulSystemEnabled = true）
- **THEN** 100%掉落战魂之心

#### Scenario: 冰雪巨人军官掉落战魂之心
- **WHEN** 玩家击败冰雪巨人军官
- **AND** 战魂系统已开启（warSoulSystemEnabled = true）
- **THEN** 100%掉落战魂之心

#### Scenario: 魔军突击队掉落战魂之心
- **WHEN** 玩家击败魔军突击队
- **AND** 战魂系统已开启（warSoulSystemEnabled = true）
- **THEN** 25%概率掉落战魂之心

#### Scenario: 魔军守卫军掉落战魂之心
- **WHEN** 玩家击败魔军守卫军
- **AND** 战魂系统已开启（warSoulSystemEnabled = true）
- **THEN** 25%概率掉落战魂之心

#### Scenario: 魔军神秘部队掉落战魂之心
- **WHEN** 玩家击败魔军神秘部队
- **AND** 战魂系统已开启（warSoulSystemEnabled = true）
- **THEN** 25%概率掉落战魂之心

#### Scenario: 魔军图腾兽掉落战魂之心
- **WHEN** 玩家击败魔军图腾兽
- **AND** 战魂系统已开启（warSoulSystemEnabled = true）
- **THEN** 25%概率掉落战魂之心

#### Scenario: 冰雪巨人士官掉落战魂之心
- **WHEN** 玩家击败冰雪巨人士官
- **AND** 战魂系统已开启（warSoulSystemEnabled = true）
- **THEN** 25%概率掉落战魂之心

#### Scenario: 雷角风牙兽掉落战魂之心
- **WHEN** 玩家击败雷角风牙兽
- **AND** 战魂系统已开启（warSoulSystemEnabled = true）
- **THEN** 50%概率掉落战魂之心

#### Scenario: 地下城3层奖励战魂之心
- **WHEN** 玩家完成地下城3层
- **AND** 战魂系统已开启（warSoulSystemEnabled = true）
- **THEN** 100%获得战魂之心

#### Scenario: 公主星期天礼物战魂之心
- **WHEN** 玩家与公主交互
- **AND** 今天是星期天
- **AND** 公主关系等级 = 6
- **AND** 战魂系统已开启（warSoulSystemEnabled = true）
- **THEN** 获得战魂之心
- **WHEN** 战魂系统未开启
- **THEN** 获得电浆药水

### Requirement: 战魂晶石掉落逻辑
系统 SHALL 根据战魂系统开启状态控制战魂晶石的掉落。

#### Scenario: 魔军突击队掉落战魂晶石
- **WHEN** 玩家击败魔军突击队
- **AND** 战魂系统已开启（warSoulSystemEnabled = true）
- **THEN** 75%概率掉落战魂晶石

#### Scenario: 魔军守卫军掉落战魂晶石
- **WHEN** 玩家击败魔军守卫军
- **AND** 战魂系统已开启（warSoulSystemEnabled = true）
- **THEN** 75%概率掉落战魂晶石

#### Scenario: 魔军神秘部队掉落战魂晶石
- **WHEN** 玩家击败魔军神秘部队
- **AND** 战魂系统已开启（warSoulSystemEnabled = true）
- **THEN** 75%概率掉落战魂晶石

#### Scenario: 魔军图腾兽掉落战魂晶石
- **WHEN** 玩家击败魔军图腾兽
- **AND** 战魂系统已开启（warSoulSystemEnabled = true）
- **THEN** 75%概率掉落战魂晶石

#### Scenario: 骑士亡魂掉落战魂晶石
- **WHEN** 玩家击败骑士亡魂
- **AND** 战魂系统已开启（warSoulSystemEnabled = true）
- **THEN** 100%掉落战魂晶石

#### Scenario: 冰雪巨人士兵掉落战魂晶石
- **WHEN** 玩家击败冰雪巨人士兵
- **AND** 战魂系统已开启（warSoulSystemEnabled = true）
- **THEN** 100%掉落战魂晶石

#### Scenario: BOSS掉落战魂晶石
- **WHEN** 玩家击败BOSS级怪物
- **AND** 战魂系统已开启（warSoulSystemEnabled = true）
- **THEN** 50%概率掉落战魂晶石

### Requirement: 战魂物品掉落优先级
系统 SHALL 按照优先级处理战魂物品的掉落。

#### Scenario: 战魂之心和战魂晶石同时可能掉落
- **WHEN** 怪物同时可能掉落战魂之心和战魂晶石
- **THEN** 系统应分别计算两者的掉落概率
- **AND** 两者可能同时掉落，也可能都不掉落

#### Scenario: 战魂系统未开启时不掉落
- **WHEN** 战魂系统未开启（warSoulSystemEnabled = false）
- **THEN** 所有怪物都不会掉落战魂之心和战魂晶石
- **EXCEPT** 无名氏（必定掉落并开启战魂系统）

## MODIFIED Requirements

### Requirement: 装备打造师NPC配置
装备打造师NPC的交互选项 SHALL 根据战魂系统状态动态显示。

#### Scenario: 交互选项列表
- **WHEN** 玩家与装备打造师交互
- **THEN** 显示以下对话选项：
  - 我要精练我的装备（始终显示）
  - 关于提升魔魂等级（始终显示）
  - 关于提升品质（始终显示）
  - 关于装备开洞（始终显示）
  - 关于镶嵌宝石（始终显示）
  - 关于战魂（仅当 warSoulSystemEnabled = true 时显示）

## REMOVED Requirements
无移除的需求。
