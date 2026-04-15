# 幻兽系统 Spec

## Why
幻兽系统是游戏的核心战斗辅助系统，玩家可以携带最多两只幻兽参与战斗。需要在前端实现幻兽管理界面，包括出战管理、幻兽列表和详情展示。

## What Changes
- 新增幻兽类型定义和接口
- 新增幻兽数据配置文件
- 新增幻兽页面组件（出战栏、幻兽列表、详情弹窗）
- 在首页标题模块最左侧新增"幻兽"按钮入口

## Impact
- Affected specs: 首页布局、类型系统
- Affected code: `src/types/index.ts`, `src/App.tsx`, 新增 `src/components/pet/` 目录

## ADDED Requirements

### Requirement: 幻兽类型定义
系统 SHALL 定义幻兽相关的类型和接口。

#### Scenario: 幻兽基础接口
- **WHEN** 定义幻兽数据结构时
- **THEN** 应包含以下属性：
  - 基本信息：id、name(名字)、type(幻兽类型)、quality(品质)、level(等级)
  - 生命和经验：currentHp/maxHp、currentExp/maxExp
  - 战斗属性：attackMin/attackMax、defense
  - 成长属性：hpGrowth、attackMinGrowth/attackMaxGrowth、defenseGrowth
  - 初始属性：initialHp、initialAttackMin/initialAttackMax、initialDefense
  - 评分属性：hpScore、attackScore、defenseScore、totalScore
  - 其他：rarity(罕见度加分)、reincarnation(转世次数)、isDeployed(是否出战)、isMerged(是否合体)

### Requirement: 幻兽入口按钮
系统 SHALL 在首页标题模块最左侧提供"幻兽"按钮入口。

#### Scenario: 点击幻兽按钮
- **WHEN** 用户点击"幻兽"按钮
- **THEN** 打开幻兽页面

### Requirement: 出战栏
系统 SHALL 在幻兽页面顶部显示出战栏，展示当前出战的两个幻兽。

#### Scenario: 显示出战幻兽
- **WHEN** 有幻兽出战时
- **THEN** 出战栏显示幻兽头像、生命值条、经验值条
- **AND** 显示"召回"按钮和"合体/解体"按钮

#### Scenario: 出战栏空状态
- **WHEN** 某个出战位置没有幻兽时
- **THEN** 显示空状态占位符

#### Scenario: 召回幻兽
- **WHEN** 用户点击"召回"按钮
- **THEN** 该幻兽取消出战状态
- **AND** 出战栏该位置变为空状态

#### Scenario: 合体/解体
- **WHEN** 用户点击"合体"按钮
- **THEN** 提示"合体成功"
- **WHEN** 用户点击"解体"按钮
- **THEN** 提示"解体成功"

### Requirement: 幻兽列表
系统 SHALL 在出战栏下方显示玩家拥有的所有幻兽列表。

#### Scenario: 显示幻兽列表
- **WHEN** 用户查看幻兽页面时
- **THEN** 以垂直列表形式显示所有幻兽
- **AND** 每个列表项显示幻兽名称、等级、品质

#### Scenario: 点击幻兽
- **WHEN** 用户点击某个幻兽
- **THEN** 打开幻兽详情弹窗

### Requirement: 幻兽详情弹窗
系统 SHALL 提供幻兽详情弹窗，展示幻兽的完整属性信息。

#### Scenario: 显示幻兽详情
- **WHEN** 用户点击幻兽列表中的某个幻兽
- **THEN** 显示详情弹窗，包含以下信息表格：
  | 属性 | 值 | 属性 | 值 |
  |------|-----|------|-----|
  | 名字 | [类型名] | 幻兽类型 | [类型名] |
  | 品质 | [品质] | 等级 | [等级] |
  | 生命 | [当前/最大] | 经验 | [百分比] |
  | 攻击 | [最小-最大] | | |
  | 防御 | [值] | 防御成长率:[值] 评分:[分] | |
  | 生命成长率 | [值] | 评分:[分] | |
  | 攻击成长率 | [最小-最大] | 评分:[分-分] | |
  | 初始生命 | [值] | 评分:[分] | |
  | 初始攻击 | [最小-最大] | 评分:[分-分] | |
  | 初始防御 | [值] | 评分:[分] | |
  | 罕见度 | [+分] | 转世 | [次数] |

### Requirement: 幻兽品质
系统 SHALL 定义幻兽品质等级。

#### Scenario: 品质类型
- **WHEN** 定义幻兽品质时
- **THEN** 应包含：普通、良品、上品、精品、极品

### Requirement: 幻兽类型
系统 SHALL 定义多种幻兽类型，不同类型有不同的基础评分和成长倾向。

#### Scenario: 幻兽类型列表
- **WHEN** 定义幻兽类型时
- **THEN** 应包含：攻防型、调皮鬼、吉鲁猪、奇异兽、圣天使、守护、年猪
