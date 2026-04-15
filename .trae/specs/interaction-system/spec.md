# 首页交互按钮区组件化方案 Spec

## Why
当前交互按钮系统存在以下问题：
1. 交互按钮仅支持字符串数组，无法区分不同交互类型
2. 敌人交互（如小兵）需要硬编码单独组件（SoldierModal），扩展性差
3. NPC交互和动作交互混用同一模态窗口，缺乏类型区分
4. 新增交互元素需要修改核心组件代码，不符合开闭原则

## What Changes
- 重构交互数据结构，支持三种交互类型：动作(Action)、敌人(Enemy)、NPC
- 创建类型化的交互配置系统，通过配置文件定义交互元素
- 实现三个专用模态窗口组件：ActionModal、EnemyModal、NPCModal
- 重构InteractionButtons组件，支持根据类型渲染不同按钮样式
- 创建交互配置数据文件，集中管理所有交互元素定义

## Impact
- Affected specs: 无直接影响现有功能规格
- Affected code:
  - `src/data/gameData.ts` - 交互数据结构重构
  - `src/components/home/InteractionButtons.tsx` - 组件重构
  - `src/components/common/InteractionModal.tsx` - 重构为NPCModal
  - `src/components/home/SoldierModal.tsx` - 废弃，由EnemyModal替代
  - `src/App.tsx` - 交互处理逻辑更新
  - `src/types/index.ts` - 新增交互类型定义

## ADDED Requirements

### Requirement: 交互类型定义系统
系统 SHALL 提供三种标准交互类型的定义：

#### Scenario: 动作类型交互定义
- **WHEN** 定义动作类型交互时
- **THEN** 系统应支持配置：唯一ID、显示名称、图标、执行动作类型、动作参数

#### Scenario: 敌人类型交互定义
- **WHEN** 定义敌人类型交互时
- **THEN** 系统应支持配置：唯一ID、显示名称、图标、敌人描述、战斗力数据（HP、攻击、防御）、敌人列表

#### Scenario: NPC类型交互定义
- **WHEN** 定义NPC类型交互时
- **THEN** 系统应支持配置：唯一ID、显示名称、图标、NPC描述、交互选项列表（每项包含文本和执行结果）

### Requirement: 执行动作类按钮
系统 SHALL 提供动作类按钮功能：

#### Scenario: 动作按钮点击
- **WHEN** 用户点击动作类按钮
- **THEN** 系统直接执行预设动作，无需弹出模态窗口
- **AND** 在交互日志中记录执行结果

### Requirement: 敌人角色类按钮
系统 SHALL 提供敌人类按钮功能：

#### Scenario: 敌人按钮点击
- **WHEN** 用户点击敌人类按钮
- **THEN** 系统弹出敌人信息模态窗口
- **AND** 窗口显示敌人描述文本
- **AND** 窗口显示战斗力数据（HP、攻击、防御等）
- **AND** 窗口提供"攻击"和"离开"两个操作按钮

#### Scenario: 攻击按钮点击
- **WHEN** 用户在敌人模态窗口点击"攻击"按钮
- **THEN** 系统关闭模态窗口
- **AND** 跳转至战斗页面进行战斗

#### Scenario: 离开按钮点击
- **WHEN** 用户在敌人模态窗口点击"离开"按钮
- **THEN** 系统关闭模态窗口
- **AND** 返回原页面

### Requirement: NPC角色类按钮
系统 SHALL 提供NPC类按钮功能：

#### Scenario: NPC按钮点击
- **WHEN** 用户点击NPC类按钮
- **THEN** 系统弹出NPC信息模态窗口
- **AND** 窗口显示NPC描述文本
- **AND** 窗口以垂直列表形式展示交互操作选项

#### Scenario: NPC选项点击
- **WHEN** 用户点击NPC交互选项
- **THEN** 系统执行对应的预设事件
- **AND** 在交互日志中记录执行结果
- **AND** 关闭模态窗口

### Requirement: 可扩展性设计
系统 SHALL 满足以下可扩展性目标：

#### Scenario: 新增敌人配置
- **WHEN** 需要在特定位置添加新敌人
- **THEN** 只需在配置文件中定义敌人数据
- **AND** 无需修改核心组件代码

#### Scenario: 新增NPC配置
- **WHEN** 需要在特定位置添加新NPC
- **THEN** 只需在配置文件中定义NPC数据
- **AND** 无需修改核心组件代码

#### Scenario: 新增动作配置
- **WHEN** 需要在特定位置添加新动作按钮
- **THEN** 只需在配置文件中定义动作数据
- **AND** 无需修改核心组件代码

## MODIFIED Requirements
无

## REMOVED Requirements
无
