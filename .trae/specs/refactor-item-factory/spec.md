# 物品工厂模式重构 Spec

## Why
当前物品创建逻辑分散在多个文件中，存在绕过 itemFactory 直接用对象字面量创建物品、直接调用底层 `createEquipment` 而非统一接口 `createEquipmentItem`、物品模板未统一注册导致部分物品无法通过 `findItemByName` 查找等问题。需要将所有物品生成统一收敛到工厂模式，消除不一致风险，提升可维护性。

## What Changes
- 扩展 `itemFactory.ts`，新增矿石工厂函数（`createSilverOre`、`createGoldOre`）和战魂晶石模板导出
- 将 `inventoryData.ts` 中的 `createSilverOre`/`createGoldOre` 迁移到 `itemFactory.ts`
- 将 `inventoryData.ts` 中的 `zhanHunJingShi` 导出，纳入 `ITEM_TEMPLATES`
- 将 `lootUtils.ts` 中的 `generateRandomEquipment` 改为调用 `createEquipmentItem` 而非直接调用 `createEquipment` + `generateItemId`
- 将 `inventoryData.ts` 中的 `createInitialEquipment` 改为使用 `cloneItem` 而非展开语法 `{ ...lingHunJingShi, quantity: 1 }`
- 将 `warSoulDropUtils.ts` 中的战魂晶石对象字面量改为使用 `ITEM_TEMPLATES` 或 `createItemFromTemplate`
- 将 `lotterySystem.ts` 中的 fallback 对象字面量改为使用 `itemFactory` 的统一创建接口
- 将 `App.tsx` 中的商店购买 fallback 对象字面量改为使用 `itemFactory` 的统一创建接口
- 在 `itemFactory.ts` 中新增 `createFallbackItem` 通用兜底创建函数

## Impact
- Affected specs: 物品系统、战利品系统、商店系统、抽奖系统、战魂掉落系统
- Affected code:
  - `src/utils/itemFactory.ts` — 扩展工厂函数和模板导出
  - `src/data/inventoryData.ts` — 导出 `zhanHunJingShi`，删除 `createSilverOre`/`createGoldOre`（迁移到 itemFactory），修改 `createInitialEquipment`
  - `src/utils/lootUtils.ts` — `generateRandomEquipment` 改用 `createEquipmentItem`
  - `src/utils/warSoulDropUtils.ts` — `getWarSoulItemTemplate` 改用 `ITEM_TEMPLATES` 或 `createItemFromTemplate`
  - `src/utils/lotterySystem.ts` — `createLotteryItem` fallback 改用 `createFallbackItem`
  - `src/App.tsx` — 商店购买 fallback 改用 `createFallbackItem`

## ADDED Requirements

### Requirement: 统一物品工厂入口
系统 SHALL 通过 `itemFactory.ts` 提供所有物品类型的统一创建接口，其他模块不得绕过工厂直接用对象字面量创建物品实例。

#### Scenario: 创建装备
- **WHEN** 任何模块需要创建装备物品
- **THEN** 必须调用 `createEquipmentItem(config)` 而非直接调用 `createEquipment` + 手动生成ID

#### Scenario: 从模板创建物品
- **WHEN** 任何模块需要根据名称创建物品
- **THEN** 必须调用 `createItemFromTemplate(name, quantity)` 或 `cloneItem(template)`

#### Scenario: 创建兜底物品
- **WHEN** 物品模板不存在，需要创建基础物品实例
- **THEN** 必须调用 `createFallbackItem(config)` 而非直接用对象字面量

### Requirement: 矿石工厂函数迁移
系统 SHALL 将矿石创建函数从 `inventoryData.ts` 迁移到 `itemFactory.ts`，并保持功能一致。

#### Scenario: 创建银矿
- **WHEN** 调用 `createSilverOreItem(quality)`
- **THEN** 返回品质为指定值的银矿 SpecialItem，属性与原 `createSilverOre` 完全一致

#### Scenario: 创建金矿
- **WHEN** 调用 `createGoldOreItem(quality)`
- **THEN** 返回品质为指定值的金矿 SpecialItem，属性与原 `createGoldOre` 完全一致

### Requirement: 战魂晶石模板导出
系统 SHALL 将 `zhanHunJingShi` 从 `inventoryData.ts` 导出并纳入 `ITEM_TEMPLATES`。

#### Scenario: 通过 ITEM_TEMPLATES 获取战魂晶石
- **WHEN** 访问 `ITEM_TEMPLATES.zhanHunJingShi`
- **THEN** 返回与 `inventoryData.ts` 中定义的 `zhanHunJingShi` 完全一致的模板

#### Scenario: 通过 createItemFromTemplate 创建战魂晶石
- **WHEN** 调用 `createItemFromTemplate('战魂晶石', 1)`
- **THEN** 返回战魂晶石物品实例

### Requirement: 兜底物品创建函数
系统 SHALL 在 `itemFactory.ts` 中提供 `createFallbackItem` 函数，用于在模板不存在时创建基础物品。

#### Scenario: 创建兜底物品
- **WHEN** 调用 `createFallbackItem({ name, type, description, icon, source, ... })`
- **THEN** 返回一个合法的 InventoryItem 实例，包含自动生成的唯一ID和合理的默认值

### Requirement: createInitialEquipment 使用 cloneItem
系统 SHALL 将 `createInitialEquipment` 中的展开语法替换为 `cloneItem` 调用。

#### Scenario: 创建初始装备中的消耗品
- **WHEN** `createInitialEquipment` 创建灵魂晶石、魔魂晶石、幻魔晶石
- **THEN** 使用 `cloneItem(template)` 并设置 `quantity: 1`，而非 `{ ...template, quantity: 1 }`

## MODIFIED Requirements

### Requirement: lootUtils.generateRandomEquipment 使用 createEquipmentItem
`generateRandomEquipment` 函数 SHALL 调用 `createEquipmentItem` 而非直接调用 `createEquipment` + `generateItemId`。

#### Scenario: 生成随机装备
- **WHEN** 调用 `generateRandomEquipment(monsterLevel, dropRate, isBossLoot)`
- **THEN** 内部使用 `createEquipmentItem({ equipmentType, level, quality, magicSoulLevel, gemSlots })` 创建装备
- **AND** 不再直接导入和使用 `createEquipment` 和 `generateItemId`

### Requirement: warSoulDropUtils 使用 ITEM_TEMPLATES
`getWarSoulItemTemplate` 函数 SHALL 从 `ITEM_TEMPLATES` 获取战魂晶石模板，而非用对象字面量创建。

#### Scenario: 获取战魂晶石模板
- **WHEN** 调用 `getWarSoulItemTemplate('zhanHunJingShi')`
- **THEN** 返回 `ITEM_TEMPLATES.zhanHunJingShi`，而非对象字面量

### Requirement: lotterySystem fallback 使用 createFallbackItem
`createLotteryItem` 函数的 fallback 逻辑 SHALL 使用 `createFallbackItem` 而非对象字面量。

#### Scenario: 模板不存在时创建抽奖物品
- **WHEN** `createItemFromTemplate` 返回 null
- **THEN** 调用 `createFallbackItem({ name: itemName, type: 'special', ... })` 创建兜底物品

### Requirement: App.tsx 商店购买 fallback 使用 createFallbackItem
商店购买逻辑的 fallback SHALL 使用 `createFallbackItem` 而非对象字面量。

#### Scenario: 商店物品模板不存在时
- **WHEN** `createItemFromTemplate` 返回 null
- **THEN** 调用 `createFallbackItem` 创建兜底物品

## REMOVED Requirements

### Requirement: inventoryData.ts 中的 createSilverOre/createGoldOre
**Reason**: 迁移到 itemFactory.ts，统一工厂入口
**Migration**: 使用 `itemFactory.ts` 中的 `createSilverOreItem`/`createGoldOreItem` 替代

### Requirement: warSoulDropUtils.ts 中战魂晶石的对象字面量创建
**Reason**: 使用统一的 ITEM_TEMPLATES 获取模板，避免数据重复定义
**Migration**: 从 `ITEM_TEMPLATES.zhanHunJingShi` 获取模板
