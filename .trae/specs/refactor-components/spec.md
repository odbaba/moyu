# 组件重构规范

## Why
/src/components 目录下存在大量重复代码、冗余常量定义和不一致的代码结构，影响代码可维护性和可读性。需要进行系统性重构，消除冗余，优化结构，同时确保所有功能保持不变。

## What Changes
- 提取重复的常量定义到公共模块
- 提取重复的工具函数到公共模块
- 移除未使用的导入和代码
- 统一代码风格和结构
- 完善组件导出
- **BREAKING**: 移除已标记为旧版的 `InteractionModal` 组件

## Impact
- Affected specs: 无直接影响现有功能规格
- Affected code: 
  - `src/components/` 下所有模块
  - 需要新增公共常量和工具模块

## ADDED Requirements

### Requirement: 公共常量模块
系统 SHALL 提供统一的常量定义模块，包含：
- 品质颜色映射 (`QUALITY_COLORS`, `qualityColorMap`)
- 装备图标映射 (`equipmentIconMap`)
- 装备槽位类型映射 (`equipmentSlotTypeMap`)
- 幻兽类型图标映射 (`PET_TYPE_EMOJI`)
- 物品类型映射 (`itemTypeMap`)
- 稀有度配置 (`rarityConfig`)

#### Scenario: 常量模块使用
- **WHEN** 组件需要使用品质颜色或图标映射
- **THEN** 从公共常量模块导入，而非在组件内重复定义

### Requirement: 公共工具函数模块
系统 SHALL 提供统一的工具函数模块，包含：
- `getQualityColor(quality)` - 获取品质颜色
- `getPetEmoji(petType)` - 获取幻兽图标
- `getRarityClassName(rarity)` - 获取稀有度CSS类名
- `isEquipmentItem(item)` - 判断是否为装备类型
- `getEquipmentIcon(slotType)` - 获取装备图标

#### Scenario: 工具函数使用
- **WHEN** 组件需要使用类型判断或格式化函数
- **THEN** 从公共工具模块导入，而非在组件内重复定义

### Requirement: 组件导出完善
系统 SHALL 在 `src/components/index.ts` 中导出所有子模块组件

#### Scenario: 组件导入
- **WHEN** 其他模块需要使用 character、inventory、pet、skill 组件
- **THEN** 可以从 `src/components` 直接导入

### Requirement: 冗余代码移除
系统 SHALL 移除以下冗余代码：
- 各组件中重复定义的常量
- 各组件中重复定义的工具函数
- 未使用的导入语句
- 已标记为旧版的 `InteractionModal` 组件

#### Scenario: 代码清理
- **WHEN** 重构完成
- **THEN** 每个常量和函数只定义一次

## MODIFIED Requirements

### Requirement: 代码结构统一
所有组件 SHALL 遵循统一的代码结构：
1. 导入语句（React、类型、工具、组件、样式）
2. 类型/接口定义
3. 常量定义（仅组件特有的）
4. 辅助函数（仅组件特有的）
5. 主组件定义
6. 导出语句

## REMOVED Requirements

### Requirement: InteractionModal 组件
**Reason**: 已被 `NPCModal` 和 `EnemyModal` 替代，标记为旧版保留兼容性
**Migration**: 检查是否有使用 `InteractionModal` 的地方，如有则迁移到 `NPCModal`
