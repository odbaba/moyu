# Tasks

## 任务1: 新增战魂类型枚举并更新接口
- [x] Task 1.1: 在 `src/types/index.ts` 中新增 WarSoulType 枚举
  - [x] 定义 `WarSoulType` 枚举：NONE=0, TIAN_HUN=1, DI_HUN=2
  - [x] 更新 `EquipmentDetail.soulType` 类型为 `WarSoulType`
  - [x] 更新 `EquipmentItem.soulType` 类型为 `WarSoulType`

- [x] Task 1.2: 更新所有使用 soulType 的代码文件，适配枚举类型
  - [x] 更新 `src/utils/equipmentRefine.ts` 中的 soulType 比较逻辑
  - [x] 更新 `src/utils/equipmentConverter.ts` 中的 soulType 比较逻辑
  - [x] 更新 `src/utils/combatPower.ts` 中的 soulType 比较逻辑
  - [x] 更新 `src/utils/attributeCalculator.ts` 中的 soulType 比较逻辑
  - [x] 更新 `src/components/common/EquipmentDetailModal.tsx` 中的 soulType 比较逻辑

## 任务2: 实现战魂套装效果计算
- [x] Task 2.1: 在 `src/utils/combatPower.ts` 中实现战魂套装检查函数
  - [x] 实现 `checkWarSoulSet` 函数
  - [x] 参数：角色装备对象（CharacterData['equipment']）
  - [x] 返回：套装信息（是否激活、套装类型、套装等级）

- [x] Task 2.2: 实现天魂套装攻击加成计算
  - [x] 实现 `calculateTianHunSetBonus` 函数
  - [x] 参数：角色装备对象
  - [x] 返回：攻击加成百分比（如0.25表示25%）

- [x] Task 2.3: 实现地魂套装闪避加成计算
  - [x] 实现 `calculateDiHunSetBonus` 函数
  - [x] 参数：角色装备对象
  - [x] 返回：闪避加成百分比

- [x] Task 2.4: 实现PK赛战斗力加成计算
  - [x] 实现 `calculateWarSoulPKCombatPower` 函数
  - [x] 参数：角色装备对象
  - [x] 返回：PK赛战斗力加成百分比

## 任务3: 完善精炼函数中的战魂逻辑
- [x] Task 3.1: 修改 `refineQuality` 函数，增加升极品时战魂逻辑
  - [x] 增加 `warSoulSystemEnabled?: boolean` 参数
  - [x] 升极品时：已有战魂且等级<5 → 战魂等级+1
  - [x] 升极品时：无战魂且系统已开启 → 2.5%概率激活战魂
  - [x] 在 attributeChanges 中增加 soulLevelChange 和 soulActivated 字段

- [x] Task 3.2: 修改 `refineMagicSoul` 函数，增加魔魂升至12级时战魂等级提升
  - [x] 增加 `warSoulSystemEnabled?: boolean` 参数
  - [x] 魔魂升至12级时：已有战魂且等级<5 → 战魂等级+1
  - [x] 在 attributeChanges 中增加 soulLevelChange 字段

- [x] Task 3.3: 修改 `refineOpenHole` 函数，增加战魂系统开关检查
  - [x] 增加 `warSoulSystemEnabled?: boolean` 参数
  - [x] 传递给 `activateSoulInternal` 函数
  - [x] 战魂系统未开启时不触发战魂激活

- [x] Task 3.4: 修改 `activateSoul` 函数，增加战魂系统开关检查
  - [x] 增加 `warSoulSystemEnabled?: boolean` 参数
  - [x] 战魂系统未开启时返回失败提示

- [x] Task 3.5: 修改 `activateSoulInternal` 内部函数，增加开关检查
  - [x] 增加 `warSoulSystemEnabled` 参数
  - [x] 战魂系统未开启时直接返回 false

## 任务4: 实现摘除宝石功能
- [x] Task 4.1: 在 `src/utils/equipmentRefine.ts` 中新增 `removeGem` 函数
  - [x] 参数：装备对象、要摘除的宝石索引
  - [x] 从装备 gems 数组中移除指定宝石
  - [x] 检查装备是否已有战魂且战魂等级 > 1 → 战魂等级降为1
  - [x] 返回 RefineResult，包含提示信息

## 任务5: 优化战魂显示
- [x] Task 5.1: 在 `src/components/common/EquipmentDetailModal.tsx` 中优化战魂显示
  - [x] 战魂等级5级显示"天魂MAX"或"地魂MAX"
  - [x] 战魂等级1-4级显示"天魂X级"或"地魂X级"
  - [x] 显示战魂效果描述（天魂：攻击+X%，地魂：闪避+X%）

## 任务6: 战魂属性加成集成到角色属性
- [x] Task 6.1: 在 `src/utils/attributeCalculator.ts` 中更新战魂属性加成
  - [x] 更新 `calculateSoulAttackBonus` 使用 WarSoulType 枚举
  - [x] 更新 `calculateAllEquipmentBonus` 使用 WarSoulType 枚举
  - [x] 确认 `calculateTotalCharacterAttributes` 正确集成战魂加成

- [x] Task 6.2: 在 `src/utils/combatPower.ts` 中集成战魂套装效果
  - [x] 更新 `calculateTotalCombatPower` 函数，加入战魂套装效果
  - [x] 更新 `calculateSoulCombatPower` 使用 WarSoulType 枚举

## 任务7: 更新 App.tsx 传递战魂系统开关
- [x] Task 7.1: 在 `src/App.tsx` 中更新精炼函数调用
  - [x] 传递 `warSoulSystemEnabled` 到 `refineQuality`
  - [x] 传递 `warSoulSystemEnabled` 到 `refineMagicSoul`
  - [x] 传递 `warSoulSystemEnabled` 到 `refineOpenHole`
  - [x] 传递 `warSoulSystemEnabled` 到 `activateSoul`
  - [x] 集成 `removeGem` 函数到装备打造师交互流程

## 任务8: 更新装备精炼说明文档
- [x] Task 8.1: 更新 `src/utils/equipmentRefine.md` 文档
  - [x] 增加升极品时战魂逻辑说明
  - [x] 增加魔魂升至12级时战魂等级提升说明
  - [x] 增加摘除宝石功能说明
  - [x] 增加战魂系统开关参数说明
  - [x] 增加战魂套装效果说明

# Task Dependencies
- [Task 2] depends on [Task 1]（套装效果计算依赖枚举类型定义）
- [Task 3] depends on [Task 1]（精炼函数修改依赖枚举类型定义）
- [Task 4] depends on [Task 1]（摘除宝石功能依赖枚举类型定义）
- [Task 5] depends on [Task 1]（战魂显示优化依赖枚举类型定义）
- [Task 6] depends on [Task 1] and [Task 2]（属性加成集成依赖枚举和套装效果）
- [Task 7] depends on [Task 3] and [Task 4]（App.tsx 更新依赖精炼函数修改完成）
- [Task 8] depends on all tasks（文档更新依赖所有实现）
