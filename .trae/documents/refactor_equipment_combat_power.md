# 重构装备战斗力计算逻辑计划

## 问题分析

通过分析原始代码 `reference/scripts/DefineSprite_561/frame_1/DoAction.as` 和 `reference/scripts/DefineSprite_932/frame_1/DoAction.as`，发现以下问题：

### 品质值定义

pz 值范围是 **0-4**：
- 普通品 pz = 0
- 良品 pz = 1
- 上品 pz = 2
- 精品 pz = 3
- 极品 pz = 4

**品质战斗力 = pz**（白品+0、良品+1、上品+2、精品+3、极品+4）

### 魔魂等级战斗力规则

**单件装备魔魂等级没有战斗力加成！**

只有当全套六件装备都有魔魂等级时，才有战斗力加成，且取最低魔魂等级。

原始代码 `getmhdj()` 逻辑：
- 如果任何一件装备没有魔魂等级，返回 0
- 如果六件装备都有魔魂等级，返回最低的那个值

### 当前代码错误对比

| 计算项 | 原始代码正确逻辑 | equipmentConverter.ts | combatPower.ts |
|--------|-----------------|----------------------|----------------|
| 品质战斗力 | pz (0-4) | ✅ 已修复 | ✅ 已修复 |
| 洞数战斗力 | 洞数本身 | ✅ 已修复 | ✅ 正确 |
| 魔魂等级战斗力(单件) | 无加成 | ✅ 已修复 | N/A |
| 魔魂等级战斗力(全套) | 取最低值 | N/A | ✅ 已修复 |
| 宝石战斗力 | 中级=3, 高级=5 | ✅ 正确 | ✅ 已添加 |

### 原始代码战斗力计算公式

```actionscript
zdl = jbzdl + jxzdl + jwzdl + hs1zdl + hs2zdl + zbpzzdl + mhdjzdl + dongzdl + bszdl + fixzdl + bestbszdl;
```

- `jbzdl` = 等级
- `jxzdl` = 军衔战斗力
- `jwzdl` = 爵位战斗力
- `hs1zdl, hs2zdl` = 幻兽战斗力
- `zbpzzdl` = 品质战斗力总和 (pz 值直接相加)
- `mhdjzdl` = 最低魔魂等级（只有全套六件都有才生效）
- `dongzdl` = 洞数总和 (不乘系数)
- `bszdl` = 宝石战斗力总和
- `fixzdl` = 装备等级匹配数量
- `bestbszdl` = 高级宝石数量

## 重构方案

### 第一步：修复 equipmentConverter.ts

1. **修复洞数战斗力计算**
   - 删除 `× 3` 的系数
   - 洞数战斗力 = 洞数本身

2. **修复魔魂等级战斗力计算**
   - 单件装备魔魂等级战斗力 = 0（无加成）
   - 删除单件装备的魔魂等级战斗力计算

3. **修复品质战斗力计算**
   - 品质战斗力 = pz（0-4）

### 第二步：修复 combatPower.ts

1. **修复品质战斗力计算**
   - 修改 `calculateEquipmentQualityCombatPower` 函数
   - 品质战斗力 = pz

2. **修复全套魔魂加成**
   - 改为取最低魔魂等级

### 第三步：统一公共函数

将 `combatPower.ts` 中的装备战斗力计算函数复用到 `equipmentConverter.ts`：

1. 提取公共计算函数到 `equipmentConverter.ts`
2. `combatPower.ts` 导入并复用这些函数
3. 确保两处计算逻辑一致

## 实施步骤

### Step 1: 修复 equipmentConverter.ts

- [x] 修改 `calculateEquipmentCombatPower` 函数
  - 删除洞数计算的 `×3` 系数
  - 删除单件装备魔魂等级战斗力计算（设为 0）
  - 品质战斗力改为 pz
- [x] 添加注释说明计算公式来源

### Step 2: 修复 combatPower.ts

- [x] 修改 `calculateEquipmentQualityCombatPower` 函数
  - 品质战斗力 = pz
- [x] 从 equipmentConverter 导入宝石战斗力计算函数
- [x] 修复 `calculateFullSetMagicSoulBonusCombatPower`（取最低值）

### Step 3: 验证功能

- [x] 运行项目检查是否有编译错误
- [x] 测试装备穿戴/卸下功能
- [x] 测试战斗力计算显示

### Step 4: 检查并修正文档

- [x] 检查 `src/utils/equipmentRefine.md` 中的品质战斗力描述
- [x] 检查其他项目文档中的品质战斗力描述

## 文件修改清单

1. `src/utils/equipmentConverter.ts` - 修复洞数和魔魂战斗力计算，品质战斗力改为 pz
2. `src/utils/combatPower.ts` - 修复品质战斗力计算，复用装备计算函数
3. `src/utils/equipmentRefine.ts` - 修复品质战斗力映射
4. `src/components/character/CombatPowerModal.tsx` - 更新战斗力详情显示
