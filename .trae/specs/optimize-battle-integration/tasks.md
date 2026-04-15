# 战斗模块优化与模块关联 - 任务清单

## [x] 任务 1: 创建战斗类型定义
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 在 types/index.ts 中添加战斗相关的类型定义
  - 包括：BattleCharacter（战斗角色）、BattleSkill（战斗技能）、Buff（增益效果）、CombatPowerModifier（战斗力修正）等
- **Acceptance Criteria Addressed**: 为所有功能提供类型支持
- **Test Requirements**:
  - `programmatic` TR-1.1: 类型定义完整且没有 TypeScript 错误
  - `human-judgement` TR-1.2: 类型定义清晰易读，符合项目现有风格
- **Notes**: 参考现有类型定义的风格

## [x] 任务 2: 创建战斗适配器工具
- **Priority**: P0
- **Depends On**: 任务 1
- **Description**: 
  - 创建 src/utils/battleAdapter.ts
  - 实现 characterToBattleCharacter 函数：将 CharacterData 转换为 BattleCharacter
  - 实现 skillToBattleSkill 函数：将 SkillDetail 转换为 BattleSkill
  - 实现 createBattleState 函数：创建初始战斗状态
- **Acceptance Criteria Addressed**: FR-战斗适配器系统
- **Test Requirements**:
  - `programmatic` TR-2.1: 转换函数正确转换数据
  - `programmatic` TR-2.2: 战斗状态初始化正确
- **Notes**: 需要处理属性映射和默认值

## [x] 任务 3: 创建战斗计算工具
- **Priority**: P0
- **Depends On**: 任务 1
- **Description**: 
  - 创建 src/utils/battleCalculator.ts
  - 实现 calculateCombatPowerModifier 函数：计算战斗力差距修正
  - 实现 calculateDodge 函数：判定闪避
  - 实现 calculateCritical 函数：判定暴击
  - 实现 calculateDamage 函数：计算最终伤害
- **Acceptance Criteria Addressed**: FR-战斗力差距修正、FR-闪避系统、FR-暴击系统
- **Test Requirements**:
  - `programmatic` TR-3.1: 战斗力修正计算正确
  - `programmatic` TR-3.2: 闪避判定正确
  - `programmatic` TR-3.3: 暴击判定正确
  - `programmatic` TR-3.4: 伤害计算正确
- **Notes**: 参考原始游戏的伤害公式

## [x] 任务 4: 实现技能攻击类型处理
- **Priority**: P0
- **Depends On**: 任务 3
- **Description**: 
  - 在 battleCalculator.ts 中添加技能攻击类型处理
  - 实现 executeSingleAttack：单体攻击
  - 实现 executeAoeAttack：群体攻击
  - 实现 executeMultiAttack：多段攻击
  - 实现 executeBuffSkill：增益技能
- **Acceptance Criteria Addressed**: FR-技能攻击类型
- **Test Requirements**:
  - `programmatic` TR-4.1: 单体攻击正确执行
  - `programmatic` TR-4.2: 群体攻击正确执行
  - `programmatic` TR-4.3: 多段攻击正确执行
  - `programmatic` TR-4.4: 增益技能正确执行
- **Notes**: 需要处理技能冷却和消耗

## [x] 任务 5: 更新战斗数据
- **Priority**: P0
- **Depends On**: 任务 2
- **Description**: 
  - 更新 src/data/battleData.ts
  - 删除硬编码的玩家和敌人数据
  - 创建敌人模板数据（基于参考文档的怪物系统）
  - 创建 createEnemyFromTemplate 函数：根据等级生成敌人
- **Acceptance Criteria Addressed**: RR-独立战斗数据
- **Test Requirements**:
  - `programmatic` TR-5.1: 敌人数据结构符合类型定义
  - `programmatic` TR-5.2: 敌人属性根据等级正确计算
- **Notes**: 参考原始游戏的怪物属性公式

## [x] 任务 6: 更新战斗组件
- **Priority**: P0
- **Depends On**: 任务 4, 任务 5
- **Description**: 
  - 更新 Battle.tsx 使用新的类型和工具
  - 更新伤害计算逻辑
  - 更新技能执行逻辑
  - 添加增益效果管理
- **Acceptance Criteria Addressed**: FR-战斗模块关联
- **Test Requirements**:
  - `programmatic` TR-6.1: 战斗组件正确使用新类型
  - `programmatic` TR-6.2: 伤害计算正确
  - `programmatic` TR-6.3: 技能执行正确
  - `human-judgement` TR-6.4: 战斗流程流畅
- **Notes**: 保持现有UI布局不变

## [x] 任务 7: 更新角色卡片组件
- **Priority**: P1
- **Depends On**: 任务 6
- **Description**: 
  - 更新 CharacterCard.tsx 显示战斗力
  - 添加增益效果图标显示
  - 更新属性显示（攻击力范围）
- **Acceptance Criteria Addressed**: UI显示优化
- **Test Requirements**:
  - `human-judgement` TR-7.1: 角色卡片显示完整信息
  - `human-judgement` TR-7.2: 增益效果图标清晰可见
- **Notes**: 保持现有样式风格

## [x] 任务 8: 更新行动按钮组件
- **Priority**: P0
- **Depends On**: 任务 6
- **Description**: 
  - 更新 ActionButtons.tsx 使用新的技能类型
  - 添加技能冷却显示
  - 添加技能类型图标（单体/群体/增益）
  - 根据技能类型显示不同的按钮样式
- **Acceptance Criteria Addressed**: FR-技能冷却管理
- **Test Requirements**:
  - `human-judgement` TR-8.1: 技能按钮清晰可见
  - `programmatic` TR-8.2: 技能冷却正确显示
  - `human-judgement` TR-8.3: 技能类型图标清晰
- **Notes**: 参考技能模块的样式

## [x] 任务 9: 更新战斗日志组件
- **Priority**: P1
- **Depends On**: 任务 6
- **Description**: 
  - 更新 BattleLog.tsx 显示新的战斗信息
  - 添加闪避、暴击等特殊事件的日志
  - 添加增益效果的日志
- **Acceptance Criteria Addressed**: UI显示优化
- **Test Requirements**:
  - `human-judgement` TR-9.1: 日志信息清晰易读
  - `human-judgement` TR-9.2: 特殊事件有明显的视觉区分
- **Notes**: 保持现有滚动功能

## [x] 任务 10: 集成到主应用
- **Priority**: P0
- **Depends On**: 任务 6, 任务 7, 任务 8, 任务 9
- **Description**: 
  - 更新 App.tsx 传递角色数据和技能数据
  - 实现战斗入口（从交互系统触发）
  - 实现战斗结束后的处理（经验、掉落等）
- **Acceptance Criteria Addressed**: 所有功能
- **Test Requirements**:
  - `programmatic` TR-10.1: 可以正常进入和退出战斗
  - `programmatic` TR-10.2: 角色数据正确传递
  - `programmatic` TR-10.3: 技能数据正确传递
  - `human-judgement` TR-10.4: 整体流程流畅
- **Notes**: 需要与交互系统集成

## [x] 任务 11: 更新模块README
- **Priority**: P1
- **Depends On**: 任务 10
- **Description**: 
  - 更新 battle/README.md 文档
  - 更新类型定义说明
  - 更新使用示例
- **Acceptance Criteria Addressed**: 文档更新
- **Test Requirements**:
  - `human-judgement` TR-11.1: 文档清晰易懂
  - `human-judgement` TR-11.2: 示例代码正确
- **Notes**: 遵循项目文档规范

# Task Dependencies
- [任务 2] depends on [任务 1]
- [任务 3] depends on [任务 1]
- [任务 4] depends on [任务 3]
- [任务 5] depends on [任务 2]
- [任务 6] depends on [任务 4, 任务 5]
- [任务 7] depends on [任务 6]
- [任务 8] depends on [任务 6]
- [任务 9] depends on [任务 6]
- [任务 10] depends on [任务 6, 任务 7, 任务 8, 任务 9]
- [任务 11] depends on [任务 10]
