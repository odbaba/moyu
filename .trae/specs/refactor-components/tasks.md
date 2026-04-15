# Tasks

- [x] Task 1: 创建公共常量模块
  - [x] SubTask 1.1: 创建 `src/components/common/constants.ts` 文件
  - [x] SubTask 1.2: 定义品质颜色映射 `QUALITY_COLORS`
  - [x] SubTask 1.3: 定义装备图标映射 `EQUIPMENT_ICON_MAP`
  - [x] SubTask 1.4: 定义装备槽位类型映射 `EQUIPMENT_SLOT_TYPE_MAP`
  - [x] SubTask 1.5: 定义幻兽类型图标映射 `PET_TYPE_EMOJI`
  - [x] SubTask 1.6: 定义物品类型映射 `ITEM_TYPE_MAP`
  - [x] SubTask 1.7: 定义稀有度配置 `RARITY_CONFIG`

- [x] Task 2: 创建公共工具函数模块
  - [x] SubTask 2.1: 创建 `src/components/common/utils.ts` 文件
  - [x] SubTask 2.2: 实现 `getQualityColor(quality)` 函数
  - [x] SubTask 2.3: 实现 `getPetEmoji(petType)` 函数
  - [x] SubTask 2.4: 实现 `getRarityClassName(rarity)` 函数
  - [x] SubTask 2.5: 实现 `getRarityText(rarity)` 函数
  - [x] SubTask 2.6: 实现 `isEquipmentItem(item)` 类型守卫函数
  - [x] SubTask 2.7: 实现 `getEquipmentIcon(slotType)` 函数

- [x] Task 3: 重构 pet 模块组件
  - [x] SubTask 3.1: 更新 `DeployedPetSlot.tsx` 使用公共模块
  - [x] SubTask 3.2: 更新 `PetListItem.tsx` 使用公共模块
  - [x] SubTask 3.3: 更新 `PetDetailModal.tsx` 使用公共模块
  - [x] SubTask 3.4: 移除各文件中的重复常量定义

- [x] Task 4: 重构 character 模块组件
  - [x] SubTask 4.1: 更新 `EquipmentDisplay.tsx` 使用公共模块
  - [x] SubTask 4.2: 更新 `EquipmentModal.tsx` 使用公共模块
  - [x] SubTask 4.3: 更新 `EquipmentSelectModal.tsx` 使用公共模块
  - [x] SubTask 4.4: 更新 `InventoryEquipmentModal.tsx` 使用公共模块
  - [x] SubTask 4.5: 移除各文件中的重复常量定义

- [x] Task 5: 重构 inventory 模块组件
  - [x] SubTask 5.1: 更新 `ItemGrid.tsx` 使用公共模块
  - [x] SubTask 5.2: 更新 `ItemDetailModal.tsx` 使用公共模块
  - [x] SubTask 5.3: 移除各文件中的重复常量和函数定义

- [x] Task 6: 重构 skill 模块组件
  - [x] SubTask 6.1: 更新 `SkillList.tsx` 使用公共模块
  - [x] SubTask 6.2: 更新 `SkillDetailModal.tsx` 使用公共模块
  - [x] SubTask 6.3: 移除各文件中的重复函数定义

- [x] Task 7: 重构 battle 模块组件
  - [x] SubTask 7.1: 检查 `Battle.tsx` 是否有可优化的代码
  - [x] SubTask 7.2: 检查 `ActionButtons.tsx` 是否有可优化的代码
  - [x] SubTask 7.3: 检查 `BattleLog.tsx` 是否有可优化的代码
  - [x] SubTask 7.4: 检查 `CharacterCard.tsx` 是否有可优化的代码

- [x] Task 8: 重构 home 模块组件
  - [x] SubTask 8.1: 检查各组件是否有可优化的代码
  - [x] SubTask 8.2: 移除未使用的导入

- [x] Task 9: 重构 common 模块组件
  - [x] SubTask 9.1: 移除 `InteractionModal.tsx` 组件（旧版）
  - [x] SubTask 9.2: 更新 `common/index.ts` 移除 InteractionModal 导出
  - [x] SubTask 9.3: 检查是否有其他地方使用 InteractionModal

- [x] Task 10: 完善组件导出
  - [x] SubTask 10.1: 更新 `src/components/index.ts` 添加 character 模块导出
  - [x] SubTask 10.2: 更新 `src/components/index.ts` 添加 inventory 模块导出
  - [x] SubTask 10.3: 更新 `src/components/index.ts` 添加 pet 模块导出
  - [x] SubTask 10.4: 更新 `src/components/index.ts` 添加 skill 模块导出

- [x] Task 11: 代码质量验证
  - [x] SubTask 11.1: 运行 TypeScript 类型检查
  - [x] SubTask 11.2: 运行 ESLint 检查
  - [x] SubTask 11.3: 运行项目构建
  - [x] SubTask 11.4: 运行项目测试（如有）

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 1, Task 2
- Task 4 depends on Task 1, Task 2
- Task 5 depends on Task 1, Task 2
- Task 6 depends on Task 2
- Task 7 depends on Task 2
- Task 10 depends on Task 3, Task 4, Task 5, Task 6, Task 7, Task 8, Task 9
- Task 11 depends on Task 10
