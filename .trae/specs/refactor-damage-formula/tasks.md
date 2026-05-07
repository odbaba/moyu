# Tasks

- [x] Task 1: 扩展类型定义 — 在 BattleCharacter 和 DamageResult 中新增暴击相关字段
  - [x] SubTask 1.1: BattleCharacter 新增 `criticalRate: number` 和 `criticalDamageRate: number` 字段
  - [x] SubTask 1.2: DamageResult 新增 `criticalDamageRate: number` 字段

- [x] Task 2: 扩展属性计算器 — 在 attributeCalculator.ts 中新增暴击率/暴击伤害率的等级成长计算
  - [x] SubTask 2.1: 创建玩家暴击率/暴击伤害率等级成长表（按策划文档第二章）
  - [x] SubTask 2.2: `calculateTotalCharacterAttributes` 返回值新增 `criticalRate` 和 `criticalDamageRate`
  - [x] SubTask 2.3: `calculateCharacterBaseAttributes` 新增暴击属性计算

- [x] Task 3: 扩展战斗适配器 — battleAdapter.ts 适配新属性字段
  - [x] SubTask 3.1: `characterToBattleCharacter` 将 criticalRate 和 criticalDamageRate 传入 BattleCharacter
  - [x] SubTask 3.2: `createEnemyFromEnemyData` 为敌人设置默认暴击率和暴击伤害率

- [x] Task 4: 重构伤害计算核心 — battleCalculator.ts 伤害公式重构
  - [x] SubTask 4.1: 新增 `calculateKValue(level)` 函数：K = 200 + 10 × level
  - [x] SubTask 4.2: 重构 `calculateDamage` 函数，使用新公式：基础伤害 = 攻击力 × K/(K+防御)
  - [x] SubTask 4.3: 重构暴击判定：使用 criticalRate 替代幸运值，使用 criticalDamageRate 替代固定×2
  - [x] SubTask 4.4: 重构 `calculateCombatPowerModifier` 函数：改为分段查表机制
  - [x] SubTask 4.5: 新增伤害浮动：最终伤害 × (0.99 + random × 0.02)
  - [x] SubTask 4.6: 调整伤害结算顺序：防御减伤 → 暴击 → 战斗力修正 → 技能倍率 → 浮动
  - [x] SubTask 4.7: 修改破防逻辑：破防时增加额外伤害倍率而非跳过防御

- [x] Task 5: 重构幻兽承伤逻辑 — Battle.tsx 中修改幻兽伤害吸收为顺序承伤
  - [x] SubTask 5.1: 修改 `handleSingleAttackResult` 中的幻兽承伤逻辑：幻兽A → 幻兽B → 玩家
  - [x] SubTask 5.2: 幻兽血量降为0时自动解除合体状态，溢出伤害传递到下一级
  - [x] SubTask 5.3: 同步修改多段攻击中的幻兽承伤逻辑

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 1]
- [Task 5] depends on [Task 4]
- [Task 2] and [Task 4] can be done in parallel after Task 1
