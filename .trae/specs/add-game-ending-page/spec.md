# 游戏结算页面 Spec

## Why
游戏目前缺少结局/结算机制，玩家在通关地下城三层或第60天结束后无法获得游戏评价和综合评语。需要新增一个结算页面，根据参考文档《游戏结算评价系统完整文档》实现8维度评价和综合评语系统。

## What Changes
- 新增游戏结算页面组件 `GameEndingPage`，全屏覆盖方式展示结算结果
- 新增评价计算工具函数 `gameEndingUtils.ts`，包含8个维度的评价逻辑和综合评语生成
- 在 `App.tsx` 中新增 `showGameEnding` 状态和触发逻辑
- 触发条件1：游戏天数超过60天（`nowday > 60`），此时 `isWin = false`
- 触发条件2：通关地下城三层（击败呖风火龙兽），此时 `isWin = true`
- 新增 `isWin` 和 `maxCombatPower`（历史最高战斗力）状态，持久化到存档系统
- 结算页面提供"再玩一次"和"读取存档"两个操作按钮

## Impact
- Affected specs: 时间系统（天数上限检测）、存档系统（新增字段）、战斗系统（地下城3层通关触发）
- Affected code:
  - `src/App.tsx` — 新增 `showGameEnding`、`isWin`、`maxCombatPower` 状态，修改 `consumeTime` 检测天数结束，修改地下城3层通关逻辑触发结算
  - `src/utils/saveUtils.ts` — SaveData 新增 `isWin`、`maxCombatPower` 字段
  - `src/components/game-ending/GameEndingPage.tsx` — 新增结算页面组件
  - `src/utils/gameEndingUtils.ts` — 新增评价计算工具函数

## ADDED Requirements

### Requirement: 游戏结算评价计算
系统 SHALL 提供 `gameEndingUtils.ts`，包含以下8个维度的评价计算函数：

#### Scenario: 战斗力评价
- **WHEN** 玩家历史最高战斗力 `maxCombatPower` 被传入
- **THEN** 根据范围返回对应称号：
  - < 300 → "无"
  - 300-599 → "普通"
  - 600-799 → "很利害"
  - 800-999 → "非常利害"
  - 1000-1199 → "罕见的"
  - ≥ 1200 → "终极勇士"（最高评价）

#### Scenario: 等级评价
- **WHEN** 玩家等级 `level` 被传入
- **THEN** 根据范围返回对应称号：
  - < 70 → "低级菜鸟"
  - 70-99 → "练级还行"
  - 100-119 → "很会升级"
  - 120-131 → "练级高手"
  - ≥ 132 → "冲级能手"（最高评价）

#### Scenario: 装备评价
- **WHEN** 装备总战斗力被传入
- **THEN** 根据范围返回对应称号：
  - < 48 → "装备打造傻鸟"
  - 48-71 → "装备打造学徒"
  - 72-107 → "装备打造高手"
  - 108-125 → "装备打造大师"
  - ≥ 126 → "装备打造宗师"（最高评价）
- 装备战斗力 = 品质战斗力 + 洞数战斗力 + 宝石战斗力 + 魔魂等级加成 + 战魂战斗力

#### Scenario: 幻兽评价
- **WHEN** 幻兽总战斗力被传入
- **THEN** 根据范围返回对应称号：
  - < 100 → "不会培养幻兽"
  - 100-249 → "善于培养幻兽"
  - 250-319 → "幻兽培养高手"
  - 320-399 → "幻兽培养大师"
  - ≥ 400 → "究极幻兽师"（最高评价）
- 幻兽战斗力 = 所有出战幻兽的战斗力之和

#### Scenario: 军衔评价
- **WHEN** 军衔等级被传入
- **THEN** 根据等级返回对应称号：
  - 0 → "无名小兵"
  - 1-3 → "亚特兰蒂斯下级军官"
  - 4-6 → "亚特兰蒂斯中级军官"
  - 7-9 → "亚特兰蒂斯高级军官"
  - 10 → "亚特兰蒂斯名将"
  - ≥ 11 → "亚特兰蒂斯战神"（最高评价）

#### Scenario: 爵位评价
- **WHEN** 爵位等级被传入
- **THEN** 根据等级返回对应称号：
  - 0 → "平民"
  - 1 → "贵族"
  - 2-3 → "荣誉贵族"
  - 4 → "令人尊敬的贵族"
  - 5 → "无尚荣誉的贵族"
  - ≥ 6 → "人类的骄傲"（最高评价）

#### Scenario: 公主关系评价
- **WHEN** 公主关系等级被传入
- **THEN** 根据等级返回对应称号：
  - 0-2 → "不懂交往"
  - 3 → "善于交往"
  - 4 → "交际高手"
  - 5 → "情商过人"
  - ≥ 6 → "情圣"（最高评价）

#### Scenario: 财富评价
- **WHEN** 金钱和魔石被传入
- **THEN** 计算财富值 = 金钱 / 10000 + 魔石，根据范围返回对应称号：
  - < 50,000 → "贫穷的家伙"
  - 50,000-199,999 → "还能过日子"
  - 200,000-349,999 → "小富商"
  - 350,000-499,999 → "大富豪"
  - ≥ 500,000 → "富可敌国"（最高评价）

### Requirement: 综合评语生成
系统 SHALL 根据最高评价数量 `maxprice` 和 `isWin` 生成综合评语：

#### Scenario: 未胜利
- **WHEN** `isWin == false`
- **THEN** 所有评价项目显示"无"，综合评语显示"无"

#### Scenario: 绝世高手
- **WHEN** `isWin == true` 且 `maxprice == 7`
- **THEN** 综合评语："你能玩到这地步，我无语――绝世高手啊。(最高评价)"

#### Scenario: 天才游戏玩家
- **WHEN** `isWin == true` 且 `maxprice >= 5`
- **THEN** 综合评语："天啊！你凭着超人的智慧，无比的英勇，击败数不清的（就是未来人类所说的无数个）魔族大军，被人类推举为最高军事领袖之一。看，魔族大军已经溃不成军了，人类已经为胜利准备了盛宴在等待你凯旋。你真不愧是天才游戏玩家。"

#### Scenario: 不败将军
- **WHEN** `isWin == true` 且 `jxdj >= 7`
- **THEN** 综合评语："你以势如破竹的进攻将魔族大军打得得花流水，魔族大军一谈到你的名字就脸色都变了（就是未来人类所说的谈虎色变）。在你的指挥下的如钢铁般的军队的打击下，魔族大军已经知道它们已是胜利无望了，它们正在做着逃跑的准备了。"

#### Scenario: 神勇战士
- **WHEN** `isWin == true` 且 `jxdj >= 4`
- **THEN** 综合评语："在这60天里亚特兰蒂斯出现了一个神勇的战士，就是你，你的无畏的勇气打倒一批批的魔族大军，由于你卓越的战功，人们赠与你不败将军的称号，从你身上人类看到了胜利将属于人类的。"

#### Scenario: 英勇战士
- **WHEN** `isWin == true` 且 `jxdj >= 1`
- **THEN** 综合评语："你在60天的战斗里取得了优异的战绩，亚特兰蒂斯与魔族的战斗还在进行中，你已经是一位英勇的战士，希望你能战斗到胜利！"

#### Scenario: 菜鸟
- **WHEN** `isWin == true` 且无军衔
- **THEN** 综合评语："游戏结束了，哎，你在唱着：\"我是一只菜菜鸟，想要飞呀却飞也飞不高~。\"离开了游戏。"

### Requirement: 游戏结算触发条件
系统 SHALL 在以下条件之一满足时自动进入结算页面：

#### Scenario: 60天结束
- **WHEN** `consumeTime` 使得 `nowday > 60`
- **THEN** 设置 `isWin = false`，设置 `showGameEnding = true`，进入结算页面

#### Scenario: 通关地下城三层
- **WHEN** 玩家击败地下城3层的呖风火龙兽
- **THEN** 先显示现有的"救出国王"弹窗，设置 `isWin = true`
- **WHEN** 玩家点击"救出国王"弹窗的确定按钮
- **THEN** 设置 `showGameEnding = true`，进入结算页面

### Requirement: 历史最高战斗力记录
系统 SHALL 持续跟踪玩家的历史最高战斗力：

#### Scenario: 更新最高战斗力
- **WHEN** 当前战斗力 > 历史最高战斗力
- **THEN** 更新 `maxCombatPower` 为当前战斗力

### Requirement: 结算页面UI
系统 SHALL 提供全屏结算页面，手机一屏展示所有内容：

#### Scenario: 展示结算结果
- **WHEN** 结算页面打开
- **THEN** 显示以下内容：
  - 标题"游戏结束"
  - 游戏天数描述："{nowday}天过去了，"
  - 8个维度的数值、称号（格式参考示例）
  - 综合评语
  - 两个操作按钮：[再玩一次] [读取存档]

#### Scenario: 再玩一次
- **WHEN** 玩家点击"再玩一次"
- **THEN** 执行刷新页面操作（`window.location.reload()`）

#### Scenario: 读取存档
- **WHEN** 玩家点击"读取存档"
- **THEN** 执行刷新页面操作（`window.location.reload()`），玩家可从封面页继续游戏

### Requirement: 存档系统更新
系统 SHALL 在存档数据中新增以下字段：

#### Scenario: 保存新字段
- **WHEN** 保存游戏
- **THEN** SaveData 新增 `isWin: boolean`（是否胜利）、`maxCombatPower: number`（历史最高战斗力）

#### Scenario: 加载新字段
- **WHEN** 加载存档
- **THEN** 恢复 `isWin` 和 `maxCombatPower` 状态，兼容旧存档（默认 `isWin: false`, `maxCombatPower: 0`）

## MODIFIED Requirements

### Requirement: 存档数据结构
SaveData 接口新增字段：
- `isWin: boolean` — 是否击败最终BOSS
- `maxCombatPower: number` — 历史最高战斗力记录
