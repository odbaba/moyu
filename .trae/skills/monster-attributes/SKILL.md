---
name: monster-attributes
description: 查找怪物/敌人属性信息。当用户询问怪物属性、敌人属性、怪物战斗力、怪物生命值、怪物攻击力等问题时调用此skill。
---

#怪物属性查找 Skill

此skill帮助AI快速定位怪物属性相关的代码和文档，理解怪物属性的计算方式。

## 触发条件

当出现以下情况时，应调用此skill：
- 用户询问"怪物属性"、"敌人属性"
- 用户询问特定怪物的战斗力、生命值、攻击力、防御力
- 用户需要了解怪物属性计算公式
- 用户需要修改或添加怪物属性
- 用户询问怪物的掉落物品

## 参考文件路径

### 代码文件
| 文件路径 | 说明 |
|---------|------|
| `reference/scripts/DefineSprite_135_BOSS/frame_1/DoAction.as` | BOSS属性定义，包含setprop函数和getgw函数 |
| `reference/scripts/DefineSprite_124_怪物对象/frame_1/DoAction.as` | 普通怪物属性定义 |
| `reference/scripts/DefineSprite_118_选择怪物/` | 各地图普通怪物的具体定义 |

### 文档文件
| 文件路径 | 说明 |
|---------|------|
| `reference/docs/project_docs/04_怪物系统.md` | 怪物系统完整技术文档 |

## 怪物核心属性

| 属性名 | 变量名 | 类型 | 说明 |
|--------|--------|------|------|
| 名称 | names | String | 怪物名称 |
| 战斗力 | gwzdl | Number | 怪物战斗力 |
| 等级 | dj | Number | 怪物等级 |
| 当前生命值 | hp | Number | 当前HP |
| 最大生命值 | mhp | Number | 最大HP |
| 最小攻击力 | xgj | Number | 攻击力下限 |
| 最大攻击力 | dgj | Number | 攻击力上限 |
| 防御力 | fy | Number | 防御值 |

## 属性计算公式

```
最大生命值(mhp) = 基础生命 + 生命成长 × 等级
最小攻击力(xgj) = 基础最小攻击 + 最小攻击成长 × 等级
最大攻击力(dgj) = 基础最大攻击 + 最大攻击成长 × 等级
防御力(fy) = 基础防御 + 防御成长 × 等级
经验值 = 怪物最大生命值 / 5
```

## setprop函数详解

```actionscript
function setprop(zdl, gwdj, base_hp, base_xgj, base_dgj, base_fy, cz_hp, cz_xgj, cz_dgj, cz_fy)
```

### 参数说明

| 参数 | 说明 |
|------|------|
| zdl | 战斗力 |
| gwdj | 怪物等级 |
| base_hp | 基础生命 |
| base_xgj | 基础最小攻击 |
| base_dgj | 基础最大攻击 |
| base_fy | 基础防御 |
| cz_hp | 生命成长系数 |
| cz_xgj | 最小攻击成长系数 |
| cz_dgj | 最大攻击成长系数 |
| cz_fy | 防御成长系数 |

## 怪物分类

### 1. 普通怪物
分布在各地图，通过 `DefineSprite_118_选择怪物` 定义。

### 2. BOSS怪物
通过 `DefineSprite_135_BOSS` 的 `getgw()` 函数定义，包括：
- 等级BOSS (10级BOSS ~ 100级BOSS)
- 地图挑战者 (雷鸣大陆挑战者 ~ 卡萨诺城挑战者)
- PK赛BOSS (60级/100级/130级PK赛BOSS)

### 3. 魔族军队
特殊怪物类型，有强化系统。

### 4. 特殊怪物
如蜘蛛王后艾达、雷角风牙兽、无名氏等。

## 使用示例

### 查找BOSS属性
1. 打开 `reference/scripts/DefineSprite_135_BOSS/frame_1/DoAction.as`
2. 在 `getgw()` 函数的 switch 语句中查找对应BOSS名称
3. 查看 `setprop()` 调用的参数

### 查找普通怪物属性
1. 打开 `reference/docs/project_docs/04_怪物系统.md`
2. 在文档中搜索怪物名称
3. 或查看 `reference/scripts/DefineSprite_118_选择怪物/` 下对应的frame

### 计算实际属性
以"10级BOSS"为例：
```actionscript
setprop(10, 10, 0, 0, 0, 0, 200 * (5 + random(1)), 22.5, 22.5, 30);
```
- 战斗力 = 10
- 等级 = 10
- 生命成长 = 200 * (5 + random(1)) = 1000~1200
- 最大生命值 = 0 + 1000~1200 × 10 = 10000~12000
- 最小攻击力 = 0 + 22.5 × 10 = 225
- 最大攻击力 = 0 + 22.5 × 10 = 225
- 防御力 = 0 + 30 × 10 = 300

## 注意事项

1. **随机属性**: 部分怪物属性包含随机成分，如BOSS的生命成长
2. **套装效果**: 战魂套装会影响怪物属性（天魂减战斗力，地魂减生命）
3. **特殊标记**: `isNormalBoss` 标记是否为普通BOSS，影响掉落
4. **掉落系统**: 怪物死亡后调用 `drop1()` (普通) 或 `drop2()` (BOSS) 处理掉落