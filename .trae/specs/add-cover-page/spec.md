# 封面页面 Spec

## Why
当前游戏启动后直接进入游戏主界面，没有封面/启动页面。需要新增一个封面页面作为游戏入口，提供"开始游戏"和"继续游戏"两种模式，让玩家可以选择全新开始或从存档继续。

## What Changes
- 新增封面页面组件（CoverPage），包含"开始游戏"和"继续游戏"按钮
- 修改 App.tsx，新增 `showCover` 状态控制封面页面与游戏主界面的切换
- "开始游戏"：清除存档数据，以全新初始状态进入游戏
- "继续游戏"：从 localStorage 读取存档数据，使用缓存数据初始化游戏状态
- "继续游戏"按钮仅在有存档数据时可用
- 新增封面页面样式文件

## Impact
- Affected specs:
  - enable-war-soul-system（存档数据结构相关）
- Affected code:
  - src/App.tsx（新增封面页面状态控制，修改初始化逻辑）
  - src/utils/saveUtils.ts（可能需要新增清除存档函数，已有 deleteSave）
  - src/components/cover/（新增封面页面组件目录）

## ADDED Requirements

### Requirement: 封面页面组件
系统 SHALL 提供封面页面作为游戏默认入口。

#### Scenario: 进入游戏默认显示封面
- **WHEN** 玩家打开游戏
- **THEN** 默认显示封面页面，不显示游戏主界面

#### Scenario: 封面页面布局
- **WHEN** 封面页面显示时
- **THEN** 页面居中显示游戏标题
- **AND** 显示"开始游戏"按钮
- **AND** 显示"继续游戏"按钮
- **AND** 页面样式优先保障手机端用户体验，手机一屏能展示所有信息

### Requirement: 开始游戏功能
系统 SHALL 提供"开始游戏"功能，以全新初始状态进入游戏。

#### Scenario: 点击开始游戏
- **WHEN** 玩家点击"开始游戏"按钮
- **THEN** 清除 localStorage 中的存档数据
- **AND** 所有游戏状态使用默认初始值（不使用任何缓存值）
- **AND** 关闭封面页面，显示游戏主界面

#### Scenario: 开始游戏后战魂系统状态
- **WHEN** 玩家通过"开始游戏"进入游戏
- **THEN** 战魂系统开启状态为 false（warSoulSystemEnabled = false）
- **AND** 无名氏击败状态为 false（wumingshiDefeated = false）

### Requirement: 继续游戏功能
系统 SHALL 提供"继续游戏"功能，从存档数据恢复游戏状态。

#### Scenario: 点击继续游戏（有存档）
- **WHEN** 玩家点击"继续游戏"按钮
- **AND** localStorage 中存在存档数据
- **THEN** 从存档中读取保存的数据
- **AND** 使用存档数据初始化游戏状态（如战魂系统开启状态、无名氏击败状态）
- **AND** 关闭封面页面，显示游戏主界面

#### Scenario: 继续游戏按钮不可用（无存档）
- **WHEN** localStorage 中不存在存档数据
- **THEN** "继续游戏"按钮显示为禁用状态（灰色，不可点击）

#### Scenario: 继续游戏后战魂系统状态恢复
- **WHEN** 玩家通过"继续游戏"进入游戏
- **AND** 存档中 warSoulSystemEnabled 为 true
- **THEN** 游戏中战魂系统为开启状态

### Requirement: 封面页面与游戏主界面切换
系统 SHALL 通过状态控制封面页面与游戏主界面的切换。

#### Scenario: 从封面进入游戏
- **WHEN** 玩家在封面页面点击"开始游戏"或"继续游戏"
- **THEN** 封面页面消失，游戏主界面显示

#### Scenario: 游戏中不显示封面
- **WHEN** 玩家已进入游戏主界面
- **THEN** 封面页面不再显示

## MODIFIED Requirements

### Requirement: 游戏初始化逻辑
游戏初始化 SHALL 根据进入方式（开始游戏/继续游戏）决定是否使用存档数据。

#### Scenario: 通过开始游戏初始化
- **WHEN** 玩家通过"开始游戏"进入
- **THEN** 不读取存档数据，所有状态使用默认初始值

#### Scenario: 通过继续游戏初始化
- **WHEN** 玩家通过"继续游戏"进入
- **THEN** 从存档读取数据，使用存档数据覆盖默认初始值

## REMOVED Requirements
无移除的需求。
