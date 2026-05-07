# Tasks

- [x] Task 1: 扩展 itemFactory.ts — 新增矿石工厂函数、战魂晶石模板导出、兜底创建函数
  - [ ] SubTask 1.1: 从 inventoryData.ts 导入 zhanHunJingShi，加入 ITEM_TEMPLATES 导出
  - [ ] SubTask 1.2: 新增 createSilverOreItem(quality) 函数，逻辑从 inventoryData.ts 的 createSilverOre 迁移
  - [ ] SubTask 1.3: 新增 createGoldOreItem(quality) 函数，逻辑从 inventoryData.ts 的 createGoldOre 迁移
  - [ ] SubTask 1.4: 新增 createFallbackItem(config) 函数，用于模板不存在时创建基础物品
- [x] Task 2: 修改 inventoryData.ts — 导出 zhanHunJingShi，删除矿石工厂函数，修改 createInitialEquipment
  - [ ] SubTask 2.1: 导出 zhanHunJingShi（当前为 const 未导出）
  - [ ] SubTask 2.2: 删除 createSilverOre 和 createGoldOre 函数（已迁移到 itemFactory.ts）
  - [ ] SubTask 2.3: 修改 createInitialEquipment 中的 `{ ...lingHunJingShi, quantity: 1 }` 等展开语法为 `cloneItem` 调用
  - [ ] SubTask 2.4: 银矿/金矿预生成变量改为从 itemFactory 导入的 createSilverOreItem/createGoldOreItem 调用
- [x] Task 3: 修改 lootUtils.ts — generateRandomEquipment 改用 createEquipmentItem
  - [ ] SubTask 3.1: 移除对 createEquipment 和 generateItemId 的直接导入
  - [ ] SubTask 3.2: 导入 createEquipmentItem 替代
  - [ ] SubTask 3.3: 修改 generateRandomEquipment 内部实现，使用 createEquipmentItem 创建装备
- [x] Task 4: 修改 warSoulDropUtils.ts — getWarSoulItemTemplate 改用 ITEM_TEMPLATES
  - [ ] SubTask 4.1: 移除战魂晶石的对象字面量创建
  - [ ] SubTask 4.2: 从 itemFactory 导入 ITEM_TEMPLATES，使用 ITEM_TEMPLATES.zhanHunJingShi 替代
- [x] Task 5: 修改 lotterySystem.ts — createLotteryItem fallback 改用 createFallbackItem
  - [ ] SubTask 5.1: 从 itemFactory 导入 createFallbackItem
  - [ ] SubTask 5.2: 替换 fallback 对象字面量为 createFallbackItem 调用
- [x] Task 6: 修改 App.tsx — 商店购买 fallback 改用 createFallbackItem
  - [ ] SubTask 6.1: 从 itemFactory 导入 createFallbackItem
  - [ ] SubTask 6.2: 替换 fallbackItem 对象字面量为 createFallbackItem 调用
- [x] Task 7: 检查所有引用 inventoryData.ts 中 createSilverOre/createGoldOre 的地方，更新导入路径
- [x] Task 8: 运行构建验证，确保无类型错误和编译错误

# Task Dependencies
- [Task 2] depends on [Task 1] — inventoryData.ts 的修改依赖 itemFactory.ts 的新增函数
- [Task 3] depends on [Task 1] — lootUtils.ts 需要 itemFactory.ts 的 createEquipmentItem
- [Task 4] depends on [Task 1] — warSoulDropUtils.ts 需要 ITEM_TEMPLATES.zhanHunJingShi
- [Task 5] depends on [Task 1] — lotterySystem.ts 需要 createFallbackItem
- [Task 6] depends on [Task 1] — App.tsx 需要 createFallbackItem
- [Task 7] depends on [Task 1, Task 2] — 引用更新依赖两个文件的修改完成
- [Task 8] depends on [Task 1-7] — 构建验证在所有修改完成后进行
