# Tasks

## 任务1: 优化战魂类型定义
- [ ] Task 1.1: 在 src/types/index.ts 中新增战魂类型枚举
  - [ ] 定义 WarSoulType 枚举
  - [ ] NONE: 0（无战魂）
  - [ ] TIAN_HUN: 1（天魂）
  - [ ] DI_HUN: 2（地魂）

- [ ] Task 1.2: 更新战魂属性接口
  - [ ] 更新 EquipmentDetail 接口中的 soulType 类型为 WarSoulType
  - [ ] 更新 EquipmentItem 接口中的 soulType 类型为 WarSoulType
  - [ ] 保持 soulLevel 为 number 类型（1-5）

## 任务2: 实现战魂套装效果计算
- [ ] Task 2.1: 在 src/utils/combatPower.ts 中实现战魂套装检查
  - [ ] 实现 checkWarSoulSet 函数
  - [ ] 参数：角色装备对象
  - [ ] 返回：套装信息（是否激活、套装类型、套装等级）

- [ ] Task 2.2: 实现天魂套装攻击加成计算
  - [ ] 实现 calculateTianHunSetBonus 函数
  - [ ] 参数：角色装备对象
  - [ ] 返回：攻击加成百分比

- [ ] Task 2.3: 实现地魂套装闪避加成计算
  - [ ] 实现 calculateDiHunSetBonus 函数
  - [ ] 参数：角色装备对象
  - [ ] 返回：闪避加成百分比

- [ ] Task 2.4: 实现PK赛战斗力加成计算
  - [ ] 实现 calculateWarSoulPKCombatPower 函数
  - [ ] 参数：角色装备对象
  - [ ] 返回：PK赛战斗力加成百分比

## 任务3: 完善战魂等级提升逻辑
- [ ] Task 3.1: 在 src/utils/equipmentRefine.ts 中实现魔魂升至12级时战魂等级提升
  - [ ] 在 refineMagicSoul 函数中增加战魂等级提升逻辑
  - [ ] 检查魔魂等级是否升至12级
  - [ ] 检查装备是否已有战魂且战魂等级 < 5
  - [ ] 战魂等级 + 1
  - [ ] 显示提示信息

## 任务4: 实现战魂等级降低逻辑
- [ ] Task 4.1: 在 src/utils/equipmentRefine.ts 中实现使用战魂物品时等级重置
  - [ ] 在 activateSoul 函数中增加战魂等级重置逻辑
  - [ ] 如果装备已有战魂，战魂等级重置为1

- [ ] Task 4.2: 实现摘除宝石时战魂等级降低
  - [ ] 创建 removeGem 函数
  - [ ] 参数：装备对象
  - [ ] 检查装备是否已有战魂且战魂等级 > 1
  - [ ] 战魂等级降为1
  - [ ] 显示提示信息

## 任务5: 优化战魂显示
- [ ] Task 5.1: 在 src/components/common/EquipmentDetailModal.tsx 中优化战魂显示
  - [ ] 战魂等级5级显示MAX
  - [ ] 显示战魂效果（攻击+X% 或 闪避+X%）
  - [ ] 添加战魂效果说明

## 任务6: 实现战魂属性加成到角色属性
- [ ] Task 6.1: 在 src/utils/attributeCalculator.ts 中实现战魂属性加成
  - [ ] 实现 calculateWarSoulAttackBonus 函数
  - [ ] 参数：角色装备对象、基础攻击力
  - [ ] 返回：攻击力加成

  - [ ] 实现 calculateWarSoulDodgeBonus 函数
  - [ ] 参数：角色装备对象
  - [ ] 返回：闪避率加成

- [ ] Task 6.2: 在角色属性计算中集成战魂加成
  - [ ] 在计算角色攻击力时增加战魂加成
  - [ ] 在计算角色闪避率时增加战魂加成

## 任务7: 更新战魂属性计算函数
- [ ] Task 7.1: 在 src/utils/equipmentConverter.ts 中优化战魂属性计算
  - [ ] 优化 calculateSoulBonus 函数
  - [ ] 增加战魂效果说明

## 任务8: 更新装备精炼说明文档
- [ ] Task 8.1: 更新 src/utils/equipmentRefine.md 文档
  - [ ] 增加战魂套装效果说明
  - [ ] 增加战魂等级提升说明
  - [ ] 增加战魂等级降低说明

# Task Dependencies
- [Task 2] depends on [Task 1]（套装效果计算依赖类型定义）
- [Task 3] depends on [Task 1]（战魂等级提升依赖类型定义）
- [Task 4] depends on [Task 1]（战魂等级降低依赖类型定义）
- [Task 5] depends on [Task 1]（战魂显示依赖类型定义）
- [Task 6] depends on [Task 2]（战魂属性加成依赖套装效果）
- [Task 7] depends on [Task 1]（战魂属性计算优化依赖类型定义）
- [Task 8] depends on all tasks（文档更新依赖所有实现）
