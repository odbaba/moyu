# 怪物系统 Spec

## Why
当前游戏缺少怪物系统，无法在地图上与怪物进行交互和战斗。需要新增怪物对象和怪物系统模块，实现：
1. 在首页交互按钮区显示怪物按钮（敌人类型）
2. 点击怪物按钮进入战斗时，根据怪物等级决定敌方数量
3. 支持怪物每日刷新机制

## What Changes
- 新增怪物类型定义（Monster类型），包含怪物属性、成长属性、地图归属等
- 新增怪物数据配置文件（monsterData.ts），定义各地图的怪物模板
- 新增怪物系统工具函数（monsterUtils.ts），包含属性计算、数量计算、刷新逻辑
- 扩展交互数据配置，为各地图添加怪物交互按钮
- 扩展EnemyData类型，支持怪物模板引用

## Impact
- Affected specs: interaction-system（交互系统需要支持怪物类型）、battle-system（战斗系统需要支持怪物数量规则）
- Affected code:
  - `src/types/index.ts` - 新增Monster、MonsterTemplate等类型定义
  - `src/data/monsterData.ts` - 新增怪物数据配置文件
  - `src/utils/monsterUtils.ts` - 新增怪物工具函数
  - `src/data/interactableData.ts` - 扩展交互配置，添加怪物交互
  - `src/data/gameData.ts` - 更新各地图的interactables列表

## ADDED Requirements

### Requirement: 怪物类型定义
系统 SHALL 提供完整的怪物类型定义：

#### Scenario: 怪物基础属性
- **WHEN** 定义怪物时
- **THEN** 系统应支持配置：唯一ID、名称、等级、战斗力、所在地图
- **AND** 系统应支持配置：生命值、攻击力、防御力

#### Scenario: 怪物成长属性
- **WHEN** 定义怪物成长属性时
- **THEN** 系统应支持配置：基础生命、生命成长率
- **AND** 系统应支持配置：基础最小攻击、最小攻击成长率
- **AND** 系统应支持配置：基础最大攻击、最大攻击成长率
- **AND** 系统应支持配置：基础防御、防御成长率

#### Scenario: 怪物刷新属性
- **WHEN** 定义怪物刷新时
- **THEN** 系统应支持配置：刷新变量名、是否已刷新状态

### Requirement: 地图怪物数量配置
系统 SHALL 按照参考文档配置各地图的怪物按钮数量：

#### Scenario: 雷鸣大陆怪物
- **WHEN** 玩家位于雷鸣大陆时
- **THEN** 系统应显示1个怪物交互按钮

#### Scenario: 戈壁怪物
- **WHEN** 玩家位于戈壁时
- **THEN** 系统应显示5个怪物交互按钮

#### Scenario: 迷梦沼泽怪物
- **WHEN** 玩家位于迷梦沼泽时
- **THEN** 系统应显示4个怪物交互按钮

#### Scenario: 冰宫怪物
- **WHEN** 玩家位于冰宫时
- **THEN** 系统应显示4个怪物交互按钮

#### Scenario: 亚维特岛怪物
- **WHEN** 玩家位于亚维特岛时
- **THEN** 系统应显示4个怪物交互按钮

#### Scenario: 火山怪物
- **WHEN** 玩家位于火山时
- **THEN** 系统应显示5个怪物交互按钮

#### Scenario: 深渊迷宫怪物
- **WHEN** 玩家位于深渊迷宫时
- **THEN** 系统应显示6个怪物交互按钮

### Requirement: 战斗敌方数量规则
系统 SHALL 根据怪物等级决定战斗时遇到的敌方数量：

#### Scenario: 低等级怪物数量
- **WHEN** 怪物等级 <= 25
- **THEN** 战斗时敌方数量为1-3只（随机）

#### Scenario: 中低等级怪物数量
- **WHEN** 怪物等级 > 25 且 <= 65
- **THEN** 战斗时敌方数量为2-4只（随机）

#### Scenario: 中高等级怪物数量
- **WHEN** 怪物等级 > 65 且 <= 100
- **THEN** 战斗时敌方数量为3-5只（随机）

#### Scenario: 高等级怪物数量
- **WHEN** 怪物等级 > 100
- **THEN** 战斗时敌方数量为4-6只（随机）

#### Scenario: 特殊怪物数量
- **WHEN** 怪物为特殊类型（BOSS、蜘蛛、蜘蛛王后艾达等）
- **THEN** 战斗时敌方数量固定为1只

### Requirement: 怪物属性计算
系统 SHALL 按照参考文档公式计算怪物属性：

#### Scenario: 生命值计算
- **WHEN** 计算怪物生命值时
- **THEN** 最大生命值 = 基础生命 + 生命成长 × 等级

#### Scenario: 攻击力计算
- **WHEN** 计算怪物攻击力时
- **THEN** 最小攻击力 = 基础最小攻击 + 最小攻击成长 × 等级
- **AND** 最大攻击力 = 基础最大攻击 + 最大攻击成长 × 等级

#### Scenario: 防御力计算
- **WHEN** 计算怪物防御力时
- **THEN** 防御力 = 基础防御 + 防御成长 × 等级

### Requirement: 怪物刷新系统
系统 SHALL 提供怪物刷新机制：

#### Scenario: 每日刷新
- **WHEN** 游戏进入新的一天
- **THEN** 系统应刷新所有地图的怪物状态为可用

#### Scenario: 击杀后刷新
- **WHEN** 怪物被击杀
- **THEN** 该怪物按钮应从交互区消失
- **AND** 次日刷新时重新出现

### Requirement: 怪物交互按钮
系统 SHALL 在首页交互按钮区显示怪物按钮：

#### Scenario: 怪物按钮显示
- **WHEN** 玩家进入有怪物的地图
- **THEN** 系统应在交互按钮区显示怪物按钮
- **AND** 按钮类型为敌人类型（enemy）

#### Scenario: 怪物按钮点击
- **WHEN** 玩家点击怪物按钮
- **THEN** 系统应弹出敌人信息模态窗口
- **AND** 窗口显示怪物描述和属性
- **AND** 窗口提供"攻击"和"离开"按钮

#### Scenario: 攻击怪物
- **WHEN** 玩家点击"攻击"按钮
- **THEN** 系统应根据怪物等级计算敌方数量
- **AND** 跳转至战斗页面进行战斗

## MODIFIED Requirements
无

## REMOVED Requirements
无
