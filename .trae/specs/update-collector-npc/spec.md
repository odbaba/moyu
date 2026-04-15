# 收藏家NPC完善与迁移 Spec

## Why
收藏家NPC目前位于雷鸣大陆，但根据参考文档，收藏家应该位于卡萨诺城。同时，收藏家的交互功能尚未完善，需要实现收藏架交易界面，让玩家能够出售珍稀物品和极品装备获得魔石。

## What Changes
- 将收藏家NPC从雷鸣大陆移动到卡萨诺城交互按钮区
- 完善收藏家对话内容，增加详细的对话说明
- 实现收藏架交易界面组件
- 实现物品魔石价值计算逻辑
- 实现拖拽物品到收藏架的功能
- 实现出售物品获得魔石的功能

## Impact
- Affected specs: 
  - add-npc-characters（NPC系统）
  - inventory-page（背包系统）
- Affected code:
  - src/data/npcData.ts（更新收藏家NPC配置和位置）
  - src/data/gameData.ts（更新雷鸣大陆和卡萨诺城的interactables列表）
  - src/components/common/CollectorModal.tsx（新增收藏架交易界面）
  - src/utils/itemValueCalculator.ts（新增物品价值计算工具）
  - src/App.tsx（集成收藏家交互）

## ADDED Requirements

### Requirement: 收藏家NPC位置迁移
系统 SHALL 将收藏家NPC从雷鸣大陆移动到卡萨诺城。

#### Scenario: 更新NPC位置配置
- **WHEN** 更新收藏家NPC配置
- **THEN** location 字段从 'leiming-dalu' 改为 'kasanuocheng'

#### Scenario: 更新地图交互列表
- **WHEN** 更新地图数据
- **THEN** 雷鸣大陆的 interactables 列表移除 'npc_collector'
- **AND** 卡萨诺城的 interactables 列表添加 'npc_collector'

#### Scenario: 更新NPC映射表
- **WHEN** 更新NPC映射表
- **THEN** npcByLocation['leiming-dalu'] 移除 'npc_collector'
- **AND** npcByLocation['kasanuocheng'] 添加 'npc_collector'

### Requirement: 收藏家对话内容完善
系统 SHALL 完善收藏家的对话内容，提供详细的说明。

#### Scenario: 显示收藏家对话
- **WHEN** 玩家与收藏家NPC交互
- **THEN** 显示以下对话内容：
  "我们家族是世袭公爵家族，我向来喜欢收藏各种珍稀名贵物品。
   我现在很想收集的是金矿、灵魂王、电浆药水、999朵白玫瑰、月光宝盒和满经验球等等...
   还有我正在收集各种各样的极品装备，只要是极品我都要，如果其它属性很好的话我还会出更高的价钱给你。
   如果你有什么好东西别忘了先找找我吧，我要的东西我会出很高的魔石价钱和你交易的。"

#### Scenario: 显示交互选项
- **WHEN** 对话显示完成
- **THEN** 显示以下选项：
  - "我有些好东西要卖" - 打开收藏架和背包界面
  - "我没什么想卖的" - 关闭对话

### Requirement: 收藏架交易界面
系统 SHALL 提供收藏架交易界面，支持物品拖拽和出售。

#### Scenario: 打开收藏架界面
- **WHEN** 玩家选择"我有些好东西要卖"
- **THEN** 同时打开：
  - 收藏架界面（4列×3行，共12个格子）
  - 背包界面
  - 关闭NPC对话界面

#### Scenario: 收藏架界面布局
- **WHEN** 收藏架界面打开
- **THEN** 显示以下内容：
  - 标题："收藏架"
  - 物品格子区域（4×3网格）
  - 总价值显示区域（显示魔石数量）
  - 出售按钮
  - 关闭按钮

#### Scenario: 物品拖拽到收藏架
- **WHEN** 玩家将物品从背包拖拽到收藏架
- **AND** 物品有魔石价值（magicStoneValue > 0 或为极品装备）
- **THEN** 物品放入收藏架格子
- **AND** 自动计算并更新总价值
- **AND** 显示物品的魔石价值

#### Scenario: 物品无魔石价值
- **WHEN** 玩家将无魔石价值的物品拖拽到收藏架
- **THEN** 显示提示："该物品无法出售给收藏家"
- **AND** 物品返回背包

#### Scenario: 收藏架已满
- **WHEN** 玩家将物品拖拽到收藏架
- **AND** 收藏架已满（12个物品）
- **THEN** 显示提示："收藏架已满"
- **AND** 物品返回背包

#### Scenario: 从收藏架移除物品
- **WHEN** 玩家将物品从收藏架拖回背包
- **THEN** 物品返回背包
- **AND** 自动计算并更新总价值

#### Scenario: 出售物品
- **WHEN** 玩家点击"出售"按钮
- **AND** 收藏架中有物品
- **THEN** 玩家获得魔石（总价值 × 80%）
- **AND** 收藏架清空
- **AND** 显示成功提示："成功出售，获得 XXX 魔石"

#### Scenario: 收藏架为空
- **WHEN** 玩家点击"出售"按钮
- **AND** 收藏架为空
- **THEN** 显示提示："收藏架中没有物品"

### Requirement: 物品魔石价值计算
系统 SHALL 实现物品魔石价值计算功能。

#### Scenario: 珍稀材料价值计算
- **WHEN** 计算珍稀材料的魔石价值
- **THEN** 根据以下规则计算：
  - 金矿：品质 × 10
  - 灵魂王：2000
  - 月光宝盒：2700
  - 月光宝盒增强版：8280

#### Scenario: 特殊道具价值计算
- **WHEN** 计算特殊道具的魔石价值
- **THEN** 根据以下规则计算：
  - 电浆药水：8280
  - 999朵白玫瑰：4000
  - 满经验球：100 × 数量

#### Scenario: 极品装备价值计算
- **WHEN** 计算极品装备的魔石价值
- **AND** 装备品质为极品
- **THEN** 使用公式：
  魔石价值 = 28 × (装备等级 × 2.5 + 50) + 魔魂等级 × 128 + 1500 × 宝石洞数量³

#### Scenario: 非极品装备价值
- **WHEN** 计算非极品装备的魔石价值
- **THEN** 返回 0（无法出售给收藏家）

### Requirement: 收购价格机制
系统 SHALL 以80%的价格收购物品。

#### Scenario: 计算收购价格
- **WHEN** 玩家出售物品
- **THEN** 实际获得的魔石 = 物品魔石价值 × 0.8

#### Scenario: 显示收购价格
- **WHEN** 物品放入收藏架
- **THEN** 显示物品的收购价格（80%价值）
- **AND** 显示总收购价格

### Requirement: 手机端优化
系统 SHALL 优化收藏架界面以适配手机端。

#### Scenario: 手机端布局
- **WHEN** 在手机端显示收藏架界面
- **THEN** 采用全屏布局
- **AND** 一屏显示所有关键信息
- **AND** 触摸友好的交互区域

## MODIFIED Requirements

### Requirement: NPC数据结构
收藏家NPC配置 SHALL 包含完整的对话内容：
- 增加详细的 description 字段
- 增加完整的对话选项
- 更新 location 字段为 'kasanuocheng'

### Requirement: 地图交互列表
gameData.ts 中的地图配置 SHALL 更新：
- 雷鸣大陆 interactables 移除 'npc_collector'
- 卡萨诺城 interactables 添加 'npc_collector'

## REMOVED Requirements
无移除的需求。
