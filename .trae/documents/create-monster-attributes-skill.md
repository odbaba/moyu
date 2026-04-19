# 创建怪物属性查找Skill计划

## 目标
创建一个skill，帮助AI在需要查找"怪物属性"、"敌人属性"时，能够快速定位到相关代码和文档。

## 参考资源
- **代码文件**: `reference/scripts/DefineSprite_135_BOSS/frame_1/DoAction.as` - BOSS属性定义
- **代码文件**: `reference/scripts/DefineSprite_124_怪物对象/frame_1/DoAction.as` - 普通怪物属性定义
- **文档文件**: `reference/docs/project_docs/04_怪物系统.md` - 怪物系统完整文档

## 怪物属性结构

### 核心属性
| 属性名 | 类型 | 说明 |
|--------|------|------|
| names | String | 怪物名称 |
| gwzdl | Number | 战斗力 |
| dj | Number | 等级 |
| hp | Number | 当前生命值 |
| mhp | Number | 最大生命值 |
| xgj | Number | 最小攻击力 |
| dgj | Number | 最大攻击力 |
| fy | Number | 防御力 |

### 属性计算公式
```
最大生命值(mhp) = 基础生命 + 生命成长 × 等级
最小攻击力(xgj) = 基础最小攻击 + 最小攻击成长 × 等级
最大攻击力(dgj) = 基础最大攻击 + 最大攻击成长 × 等级
防御力(fy) = 基础防御 + 防御成长 × 等级
经验值 = 怪物最大生命值 / 5
```

### setprop函数参数
```actionscript
function setprop(zdl, gwdj, base_hp, base_xgj, base_dgj, base_fy, cz_hp, cz_xgj, cz_dgj, cz_fy)
```
- zdl: 战斗力
- gwdj: 怪物等级
- base_hp: 基础生命
- base_xgj: 基础最小攻击
- base_dgj: 基础最大攻击
- base_fy: 基础防御
- cz_hp: 生命成长
- cz_xgj: 最小攻击成长
- cz_dgj: 最大攻击成长
- cz_fy: 防御成长

## 实现步骤

### 步骤1: 创建skill目录结构
- 创建目录: `.trae/skills/monster-attributes/`

### 步骤2: 创建SKILL.md文件
文件内容将包括：
1. **name**: monster-attributes
2. **description**: 查找怪物/敌人属性信息。当用户询问怪物属性、敌人属性、怪物战斗力、怪物生命值等问题时调用此skill。
3. **详细内容**:
   - 怪物属性查找方法
   - 参考文件路径
   - 属性计算公式
   - 常见怪物属性示例
   - 使用指南

## Skill内容设计

### 触发条件
- 用户询问"怪物属性"、"敌人属性"
- 用户询问特定怪物的战斗力、生命值、攻击力等
- 用户需要了解怪物属性计算公式
- 用户需要修改或添加怪物属性

### Skill将提供的能力
1. **快速定位**: 指向正确的代码文件和文档
2. **属性解析**: 解释setprop函数参数含义
3. **计算示例**: 提供属性计算的具体示例
4. **代码引用**: 提供关键代码片段的引用
