# 战斗系统 - 实现任务清单

## [ ] 任务 1: 定义战斗系统类型
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 在 types/index.ts 中添加战斗系统相关的类型定义
  - 包括：Character（角色）、Skill（技能）、BattleState（战斗状态）、BattleLogEntry（战斗日志）等
- **Acceptance Criteria Addressed**: 为所有功能提供类型支持
- **Test Requirements**:
  - `programmatic` TR-1.1: 类型定义完整且没有 TypeScript 错误
  - `human-judgement` TR-1.2: 类型定义清晰易读，符合项目现有风格
- **Notes**: 参考现有类型定义的风格

## [ ] 任务 2: 创建战斗数据
- **Priority**: P0
- **Depends On**: 任务 1
- **Description**: 
  - 创建玩家角色数据和敌人角色数据
  - 为角色配置基础属性（生命、蓝量、攻击力、防御力）
  - 为角色配置技能数据
- **Acceptance Criteria Addressed**: FR-2, FR-7
- **Test Requirements**:
  - `programmatic` TR-2.1: 角色数据结构符合类型定义
  - `human-judgement` TR-2.2: 数据值合理，适合游戏平衡
- **Notes**: 可以创建示例敌人用于测试

## [ ] 任务 3: 实现战斗页面布局
- **Priority**: P0
- **Depends On**: 任务 1, 任务 2
- **Description**: 
  - 创建 Battle 组件作为主战斗容器
  - 实现上方敌人九宫格布局
  - 实现中间玩家九宫格布局
  - 实现下方战斗日志区域布局
- **Acceptance Criteria Addressed**: AC-1
- **Test Requirements**:
  - `human-judgement` TR-3.1: 布局与需求描述一致
  - `human-judgement` TR-3.2: 样式与现有游戏风格协调
- **Notes**: 使用 CSS Grid 或 Flexbox 实现九宫格

## [ ] 任务 4: 实现角色卡片组件
- **Priority**: P0
- **Depends On**: 任务 3
- **Description**: 
  - 创建 CharacterCard 组件
  - 显示角色名称
  - 实现生命条和蓝条
- **Acceptance Criteria Addressed**: AC-2
- **Test Requirements**:
  - `human-judgement` TR-4.1: 角色卡片显示完整信息
  - `programmatic` TR-4.2: 生命条和蓝条正确反映当前值
- **Notes**: 生命条红色，蓝条蓝色

## [ ] 任务 5: 实现战斗日志组件
- **Priority**: P0
- **Depends On**: 任务 3
- **Description**: 
  - 创建 BattleLog 组件
  - 显示回合数
  - 显示每个角色的行动日志
  - 自动滚动到底部
- **Acceptance Criteria Addressed**: AC-8
- **Test Requirements**:
  - `human-judgement` TR-5.1: 日志信息清晰易读
  - `human-judgement` TR-5.2: 新日志自动滚动到底部
- **Notes**: 参考 InteractionLog 组件的实现

## [ ] 任务 6: 实现普攻系统
- **Priority**: P0
- **Depends On**: 任务 4
- **Description**: 
  - 实现普攻伤害计算（100%攻击力）
  - 实现目标选择功能
  - 扣减目标生命值
- **Acceptance Criteria Addressed**: AC-3
- **Test Requirements**:
  - `programmatic` TR-6.1: 普攻伤害计算正确
  - `programmatic` TR-6.2: 目标生命值正确扣减
- **Notes**: 伤害 = 攻击力 - 目标防御力（最小为1）

## [ ] 任务 7: 实现技能系统
- **Priority**: P0
- **Depends On**: 任务 6
- **Description**: 
  - 实现技能伤害计算（固定伤害 + 攻击力百分比）
  - 实现蓝量消耗检查
  - 扣减蓝量和目标生命值
- **Acceptance Criteria Addressed**: AC-4, AC-5
- **Test Requirements**:
  - `programmatic` TR-7.1: 技能伤害计算正确
  - `programmatic` TR-7.2: 蓝量不足时技能按钮禁用
- **Notes**: 蓝量不足时技能按钮变灰或隐藏

## [ ] 任务 8: 实现操作按钮组件
- **Priority**: P0
- **Depends On**: 任务 7
- **Description**: 
  - 创建 ActionButtons 组件
  - 显示普攻按钮
  - 显示技能按钮
  - 根据蓝量控制按钮状态
- **Acceptance Criteria Addressed**: AC-7
- **Test Requirements**:
  - `human-judgement` TR-8.1: 按钮清晰可见
  - `programmatic` TR-8.2: 蓝量不足时技能按钮禁用
- **Notes**: 参考 InteractionButtons 组件

## [ ] 任务 9: 实现战斗回合制逻辑
- **Priority**: P0
- **Depends On**: 任务 8
- **Description**: 
  - 实现回合状态管理
  - 玩家行动后自动切换到敌方回合
  - 敌方角色轮流行动
  - 简单的敌方AI（随机选择目标）
- **Acceptance Criteria Addressed**: AC-6
- **Test Requirements**:
  - `programmatic` TR-9.1: 回合切换逻辑正确
  - `programmatic` TR-9.2: 敌方角色都能行动
- **Notes**: 敌方AI初期使用简单的随机选择目标

## [ ] 任务 10: 实现攻击动画
- **Priority**: P1
- **Depends On**: 任务 9
- **Description**: 
  - 实现角色撞击目标的动画效果
  - 使用 CSS transitions 或 animations
- **Acceptance Criteria Addressed**: AC-9
- **Test Requirements**:
  - `human-judgement` TR-10.1: 动画效果流畅
  - `human-judgement` TR-10.2: 动画能正确播放和结束
- **Notes**: 参考 LocalMap 的动画实现方式

## [ ] 任务 11: 实现伤害数字显示
- **Priority**: P1
- **Depends On**: 任务 10
- **Description**: 
  - 实现伤害数字显示（-xx）
  - 数字向上飘出并逐渐消失
- **Acceptance Criteria Addressed**: AC-10
- **Test Requirements**:
  - `human-judgement` TR-11.1: 伤害数字清晰可见
  - `human-judgement` TR-11.2: 动画效果自然
- **Notes**: 使用 CSS animation 实现

## [ ] 任务 12: 实现敌人阵亡消失
- **Priority**: P1
- **Depends On**: 任务 11
- **Description**: 
  - 检测敌人生命值为0
  - 敌人从九宫格中消失
  - 可以添加淡出动画
- **Acceptance Criteria Addressed**: AC-11
- **Test Requirements**:
  - `programmatic` TR-12.1: 生命值为0的敌人不显示
  - `human-judgement` TR-12.2: 消失效果自然
- **Notes**: 可以使用 opacity 动画

## [ ] 任务 13: 实现战斗胜负判定
- **Priority**: P0
- **Depends On**: 任务 12
- **Description**: 
  - 检测玩家生命值为0 → 战斗失败
  - 检测所有敌人阵亡 → 战斗胜利
  - 显示胜负结果
- **Acceptance Criteria Addressed**: AC-12, AC-13
- **Test Requirements**:
  - `programmatic` TR-13.1: 胜利/失败判定正确
  - `human-judgement` TR-13.2: 结果信息清晰显示
- **Notes**: 胜负判定后可以添加重试或返回按钮

## [ ] 任务 14: 集成到主应用
- **Priority**: P0
- **Depends On**: 任务 13
- **Description**: 
  - 在 App.tsx 中添加战斗状态
  - 添加进入战斗的入口
  - 实现战斗结束后的处理
- **Acceptance Criteria Addressed**: 所有功能
- **Test Requirements**:
  - `programmatic` TR-14.1: 可以正常进入和退出战斗
  - `human-judgement` TR-14.2: 整体流程流畅
- **Notes**: 可以暂时在某个位置添加战斗触发按钮用于测试
