# NPC 角色系统设计 Spec

## Why
项目中已有交互系统框架，但缺少具体的 NPC 角色内容。根据 reference 文档，原游戏包含丰富的 NPC 系统（皇宫NPC、功能NPC、商店NPC等），这些 NPC 提供了军衔、爵位、公主关系、任务、交易等核心游戏功能。需要在项目中实现这些 NPC 角色，使玩家能够与游戏世界进行深度交互。

## What Changes
- 根据 reference/docs/scripts_analysis/14_NPC系统.md 文档，设计并实现所有 NPC 角色
- 为每个 NPC 配置详细的对话选项和功能逻辑
- 将 NPC 放置到相应地图的交互按钮区
- 实现 NPC 交互的核心功能系统（军衔、爵位、公主关系等）
- 扩展 NPCInteractable 接口以支持复杂的 NPC 功能

## Impact
- Affected specs: interaction-system（已有交互框架）、character-info-page（角色属性展示）
- Affected code: 
  - src/data/interactableData.ts（NPC 配置数据）
  - src/components/common/NPCModal.tsx（NPC 交互界面）
  - src/components/home/InteractionButtons.tsx（交互按钮区）
  - src/types/index.ts（类型定义）
  - src/App.tsx（NPC 交互处理逻辑）

## ADDED Requirements

### Requirement: NPC 分类与设计
系统 SHALL 根据 reference 文档设计以下 NPC 分类：

#### 皇宫 NPC
1. **国王** - 提供魔族大军情报查看功能
2. **公主** - 提供关系系统、送礼系统、幻兽赠送功能
3. **元帅** - 提供军衔系统、军饷领取、BOSS 情报功能
4. **首相** - 提供爵位系统、交易系统功能
5. **丫环** - 提供游戏提示和帮助信息

#### 功能 NPC
1. **日常任务官** - 提供每日任务系统
2. **地图赛报名官** - 提供地图挑战系统
3. **PK赛报名官** - 提供 PK 比赛报名功能
4. **抽奖官** - 提供抽奖系统

#### 商店 NPC
1. **宝石合成师** - 提供宝石合成功能
2. **收藏家** - 提供物品收藏与交易
3. **幻兽研究所** - 提供幻兽购买、VIP 系统

#### 特殊 NPC
1. **2008奥运使者** - 提供特殊活动任务
2. **探险家** - 提供探险任务和奖励

### Requirement: NPC 交互选项配置
系统 SHALL 为每个 NPC 配置详细的交互选项：

#### Scenario: 国王 NPC 交互
- **WHEN** 玩家与国王 NPC 交互
- **THEN** 显示魔族大军情报选项列表：
  - 魔军突击队资料（700级）
  - 魔军守卫军资料（800级）
  - 魔军神秘部队资料（900级）
  - 魔军图腾兽资料（1000级）
  - 魔的能量资料
  - 魔军主帅资料（2000级）

#### Scenario: 公主 NPC 交互
- **WHEN** 玩家与公主 NPC 交互
- **THEN** 根据关系等级显示不同选项：
  - 知己的礼物（关系≥4时显示）
  - 聊天（每天一次）
  - 送礼（周日显示）
  - 星期天的礼物（周日显示）

#### Scenario: 元帅 NPC 交互
- **WHEN** 玩家与元帅 NPC 交互
- **THEN** 显示军衔系统选项：
  - 领取军饷（周日显示）
  - 战功查询
  - 军情查询（BOSS 位置）
  - 关于军衔

#### Scenario: 首相 NPC 交互
- **WHEN** 玩家与首相 NPC 交互
- **THEN** 显示爵位系统选项：
  - 关于爵位
  - 交易
  - 领取奖励

### Requirement: NPC 功能系统实现
系统 SHALL 实现以下核心功能系统：

#### 军衔系统
- 根据战功提升军衔等级（0-11级）
- 军衔提供战斗力加成
- 周日可领取军饷（魔石奖励）
- 军衔等级影响军饷数量

#### 爵位系统
- 根据功勋提升爵位等级（0-6级）
- 爵位提供战斗力加成
- 爵位影响地图进入权限（如后花园需要勋爵以上）
- 爵位影响地图挑战权限

#### 公主关系系统
- 通过聊天、送礼提升亲密度
- 关系等级影响对话内容和奖励
- 关系等级解锁特殊技能"爱的力量"
- 关系等级影响周日礼物品质

#### 日常任务系统
- 每日提供不同任务（根据星期）
- 任务奖励包括经验、魔石、战功、功勋
- 任务类型包括收集、训练、战斗等

#### 地图挑战系统
- 每个地图有爵位要求
- 挑战成功成为地图保护者
- 保护者每日可领取奖励

### Requirement: NPC 数据结构扩展
系统 SHALL 扩展 NPCInteractable 接口以支持复杂功能：

```typescript
interface NPCInteractable {
  id: string;
  type: 'npc';
  name: string;
  icon: string;
  description: string;
  location: string;  // 新增：NPC 所在地图
  npcType: 'palace' | 'function' | 'shop' | 'special';  // 新增：NPC 类型分类
  options: NPCInteractionOption[];
  conditions?: NPCInteractionCondition[];  // 新增：选项显示条件
}

interface NPCInteractionOption {
  text: string;
  result: string;
  actionType?: string;
  actionParams?: Record<string, unknown>;
  condition?: {  // 新增：选项显示条件
    type: 'weekday' | 'relationship' | 'militaryRank' | 'nobleRank' | 'custom';
    value: any;
  };
}
```

### Requirement: NPC 地图分布
系统 SHALL 将 NPC 放置到正确的地图位置：

- **皇宫**：国王、公主、元帅、首相、丫环、PK赛报名官
- **皇宫后花园**：公主（需要爵位才能进入）
- **树心城**：日常任务官、宝石合成师、收藏家、幻兽研究所、2008奥运使者
- **各地图**：地图赛报名官、探险家
- **抽奖房**：抽奖官

## MODIFIED Requirements

### Requirement: 交互按钮区显示逻辑
交互按钮区 SHALL 根据当前地图显示对应的 NPC 交互按钮：
- 从 gameData.ts 获取当前地图的 interactables 列表
- 根据交互类型渲染不同样式的按钮
- NPC 类型按钮使用特定图标和颜色标识

### Requirement: NPC 模态窗口增强
NPCModal 组件 SHALL 支持以下增强功能：
- 根据条件动态显示/隐藏选项
- 显示 NPC 详细描述和位置信息
- 支持选项执行后的结果反馈
- 支持复杂的交互流程（如多步对话）

## REMOVED Requirements
无移除的需求。
