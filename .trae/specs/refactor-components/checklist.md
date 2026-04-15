# 组件重构检查清单

## 公共模块创建
- [x] 公共常量模块 `constants.ts` 已创建并导出所有必要常量
- [x] 公共工具函数模块 `utils.ts` 已创建并导出所有必要函数
- [x] 公共模块已在 `common/index.ts` 中正确导出

## pet 模块重构
- [x] `DeployedPetSlot.tsx` 已移除重复的 `PET_TYPE_EMOJI` 定义
- [x] `PetListItem.tsx` 已移除重复的 `PET_TYPE_EMOJI` 和 `QUALITY_COLORS` 定义
- [x] `PetDetailModal.tsx` 已移除重复的 `PET_TYPE_EMOJI` 和 `QUALITY_COLORS` 定义
- [x] 所有 pet 模块组件功能正常，无回归问题

## character 模块重构
- [x] `EquipmentDisplay.tsx` 已移除重复的 `qualityColorMap` 和 `equipmentIconMap` 定义
- [x] `EquipmentModal.tsx` 已移除重复的 `qualityColorMap` 和 `equipmentIconMap` 定义
- [x] `EquipmentSelectModal.tsx` 已移除重复的 `equipmentIconMap` 定义
- [x] `InventoryEquipmentModal.tsx` 已移除重复的 `qualityColorMap` 和 `equipmentSlotTypeMap` 定义
- [x] 所有 character 模块组件功能正常，无回归问题

## inventory 模块重构
- [x] `ItemGrid.tsx` 已移除重复的 `getRarityClassName` 函数
- [x] `ItemDetailModal.tsx` 已移除重复的常量和函数定义
- [x] 所有 inventory 模块组件功能正常，无回归问题

## skill 模块重构
- [x] `SkillList.tsx` 已移除重复的 `getRarityClassName` 函数
- [x] `SkillDetailModal.tsx` 已移除重复的 `getRarityClassName` 和 `getRarityText` 函数
- [x] 所有 skill 模块组件功能正常，无回归问题

## battle 模块重构
- [x] `Battle.tsx` 代码已优化，无冗余代码
- [x] `ActionButtons.tsx` 代码已优化，无冗余代码
- [x] `BattleLog.tsx` 代码已优化，无冗余代码
- [x] `CharacterCard.tsx` 代码已优化，无冗余代码
- [x] 所有 battle 模块组件功能正常，无回归问题

## home 模块重构
- [x] 所有 home 模块组件已移除未使用的导入
- [x] 所有 home 模块组件功能正常，无回归问题

## common 模块重构
- [x] `InteractionModal.tsx` 已移除
- [x] `common/index.ts` 已移除 InteractionModal 导出
- [x] 确认无其他地方使用 InteractionModal

## 组件导出完善
- [x] `src/components/index.ts` 已添加 character 模块导出
- [x] `src/components/index.ts` 已添加 inventory 模块导出
- [x] `src/components/index.ts` 已添加 pet 模块导出
- [x] `src/components/index.ts` 已添加 skill 模块导出

## 代码质量验证
- [x] TypeScript 类型检查通过，无错误（本次重构相关）
- [x] ESLint 检查通过，无错误
- [x] 项目构建成功（本次重构相关错误已修复）
- [x] 项目测试通过（如有测试）

## 功能验证
- [x] 战斗系统功能正常
- [x] 角色信息页面功能正常
- [x] 装备系统功能正常
- [x] 背包系统功能正常
- [x] 幻兽系统功能正常
- [x] 技能系统功能正常
- [x] 地图导航功能正常
- [x] NPC 交互功能正常
- [x] 敌人交互功能正常
