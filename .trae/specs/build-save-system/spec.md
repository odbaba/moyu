# 游戏存档系统 Spec

## Why

当前存档系统仅保存4个布尔标记（warSoulSystemEnabled、wumingshiDefeated、hasParticipatedPKToday、isKingRescued），核心游戏进度数据（角色属性、背包、装备、幻兽、金币、位置等）完全未持久化，导致"继续游戏"几乎等于重新开始。需要构建完整的存档系统，使玩家能够真正保存和恢复游戏进度。

## What Changes

- 扩展 `SaveData` 接口，覆盖所有核心游戏状态数据
- 重写 `saveUtils.ts`，实现完整的序列化/反序列化逻辑（处理 Set、EquipmentDetail 等特殊类型）
- 首页菜单（Menu.tsx）增加"保存游戏"按钮，点击后保存当前所有游戏信息
- 封面页（CoverPage.tsx）"继续游戏"按钮读取存档所有信息，使用存档数据对游戏做完整初始化
- 移除旧的自动保存 useEffect（仅保存4个布尔值），改为手动保存
- 添加版本号机制，存档版本不兼容时清除旧存档

## Impact

- Affected specs: saveUtils.ts 存档系统、Menu.tsx 菜单组件、CoverPage.tsx 封面页、App.tsx 状态管理
- Affected code:
  - `src/utils/saveUtils.ts` - 存档核心逻辑重写
  - `src/components/home/Menu.tsx` - 增加保存按钮
  - `src/components/cover/CoverPage.tsx` - 无需修改（已有 onContinueGame 回调）
  - `src/App.tsx` - 修改 handleContinueGame、handleStartGame、移除旧自动保存 useEffect、增加手动保存函数

## ADDED Requirements

### Requirement: 完整存档数据结构

系统 SHALL 提供完整的存档数据结构，覆盖以下所有游戏状态：

#### 存档数据字段

| 数据类别  | 字段                           | 说明           |
| ----- | ---------------------------- | ------------ |
| 版本    | version                      | 游戏存档版本号      |
| 位置    | currentLocation              | 当前所在位置ID     |
| 时间    | timeSystem                   | 时间系统（天数、时间）  |
| 角色    | character                    | 角色全部属性       |
| 资源    | playerResources              | 金币、魔石、战功、功勋  |
| 装备    | equippedItems                | 6个装备槽位数据     |
| 背包    | inventory                    | 背包物品列表       |
| 幻兽    | pets                         | 幻兽列表         |
| 技能    | skills                       | 技能列表         |
| 军衔    | militaryRank                 | 军衔等级         |
| 战功    | battleExp                    | 累计战功         |
| 爵位    | nobleRank                    | 爵位等级         |
| 公主    | princessRelationship         | 公主关系数据       |
| 国王    | isKingRescued                | 国王是否救出       |
| 探险家   | explorerUnlocked             | 探险家是否解锁      |
| 神秘人   | mysteriousPersonTriggered    | 神秘人是否触发      |
| 无名氏   | wumingshiDefeated            | 无名氏是否击败      |
| 战魂    | warSoulSystemEnabled         | 战魂系统是否开启     |
| 击杀    | killedMonsters               | 已击杀怪物ID列表    |
| BOSS  | spawnedBosses                | 已刷新BOSS ID列表 |
| 日常任务  | dailyTaskState               | 日常任务状态       |
| 地图挑战  | mapChallengeState            | 地图挑战状态       |
| PK赛   | hasParticipatedPKToday       | 今日是否参加PK赛    |
| 军饷    | hasClaimedMilitaryPay        | 本周是否领取军饷     |
| 丫环    | maid1DailyPurchaseCount      | 丫环1今日购买次数    |
| 年猪    | hasPurchasedYearPig          | 是否已购买年猪      |
| 电浆药水  | hasUsedDianJiangYaoShuiToday | 今日是否使用电浆药水   |
| 幻兽研究所 | petInstituteState            | 幻兽研究所状态      |

#### Scenario: 保存成功

- **WHEN** 用户点击"保存游戏"按钮
- **THEN** 系统将所有游戏状态序列化并保存到 localStorage，显示保存成功提示

#### Scenario: 保存失败

- **WHEN** localStorage 写入失败（如存储空间不足）
- **THEN** 系统显示保存失败提示，不丢失当前游戏状态

### Requirement: 手动保存机制

系统 SHALL 提供手动保存功能，通过首页菜单的"保存游戏"按钮触发。

#### Scenario: 点击保存按钮

- **WHEN** 用户在首页菜单中点击"保存游戏"
- **THEN** 菜单关闭，执行保存操作，交互日志显示保存结果

### Requirement: 继续游戏完整恢复

系统 SHALL 在"继续游戏"时恢复所有存档数据，使游戏状态与保存时完全一致。

#### Scenario: 有存档时继续游戏

- **WHEN** 用户在封面页点击"继续游戏"且存在有效存档
- **THEN** 系统读取存档数据，恢复所有游戏状态（角色、装备、背包、幻兽、位置、资源等），进入游戏主界面

#### Scenario: 开始新游戏

- **WHEN** 用户点击"开始游戏"
- **THEN** 以默认初始状态进入游戏

## MODIFIED Requirements

### Requirement: 存档系统

原有的自动保存机制（仅保存4个布尔值）变更为手动保存机制，保存完整游戏状态。移除旧的 useEffect 自动保存逻辑。

## REMOVED Requirements

### Requirement: 旧自动保存逻辑

**Reason**: 仅保存4个布尔值不足以恢复游戏进度，改为手动保存完整数据
**Migration**: 移除 useEffect 自动保存，改为菜单按钮手动保存
