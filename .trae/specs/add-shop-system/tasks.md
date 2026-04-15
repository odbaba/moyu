# Tasks

- [x] Task 1: 扩展类型定义和数据结构
  - [x] SubTask 1.1: 在 types/index.ts 中添加商店相关类型定义（ShopItem, ShopType, ShopConfig等）
  - [x] SubTask 1.2: 扩展 NPCInteractionOption 接口，支持 openShop、openSellMode、showMessage 动作类型
  - [x] SubTask 1.3: 定义 ShopItem 接口，包含物品ID、价格、类型、描述等字段
  - [x] SubTask 1.4: 定义 ShopConfig 接口，包含商店类型、物品列表等配置

- [x] Task 2: 创建商店数据配置文件
  - [x] SubTask 2.1: 创建 src/data/shopData.ts 文件
  - [x] SubTask 2.2: 配置杂货商物品列表（12种物品，金币购买）
  - [x] SubTask 2.3: 配置魔石商人物品列表（16种物品，魔石购买）
  - [x] SubTask 2.4: 为每个物品配置详细属性（ID、名称、价格、类型、描述、图标）
  - [x] SubTask 2.5: 导出商店配置映射表 shopConfig

- [x] Task 3: 创建商店工具函数
  - [x] SubTask 3.1: 创建 src/utils/shopUtils.ts 文件
  - [x] SubTask 3.2: 实现 canAffordPurchase 函数，检查玩家货币是否足够
  - [x] SubTask 3.3: 实现 hasInventorySpace 函数，检查背包是否有空间
  - [x] SubTask 3.4: 实现 calculateSellPrice 函数，计算物品出售价格（75%价值）
  - [x] SubTask 3.5: 实现 purchaseItem 函数，执行购买流程（扣除货币、添加物品）
  - [x] SubTask 3.6: 实现 sellItem 函数，执行出售流程（移除物品、增加金币）
  - [x] SubTask 3.7: 实现 generateRandomWeapon 函数，生成随机武器
  - [x] SubTask 3.8: 实现 generatePet 函数，生成幻兽属性

- [x] Task 4: 创建商店页面组件
  - [x] SubTask 4.1: 创建 src/components/shop/ShopPage.tsx 文件
  - [x] SubTask 4.2: 实现商店页面布局（顶部：商店名称和货币余额，中部：物品网格，底部：操作按钮）
  - [x] SubTask 4.3: 复用背包系统的 ItemGrid 组件显示物品列表
  - [x] SubTask 4.4: 实现物品详情弹窗（显示物品描述、价格、数量输入、购买按钮）
  - [x] SubTask 4.5: 实现购买流程（货币检查、背包空间检查、购买确认、结果反馈）
  - [x] SubTask 4.6: 实现出售模式切换（显示背包物品、选择物品、显示出售价格、确认出售）
  - [x] SubTask 4.7: 实现错误处理和提示（货币不足、背包已满、数量验证）
  - [x] SubTask 4.8: 添加完整的中文注释

- [x] Task 5: 创建商店页面样式
  - [x] SubTask 5.1: 创建 src/components/shop/shop.css 文件
  - [x] SubTask 5.2: 定义商店页面布局样式（深色主题）
  - [x] SubTask 5.3: 定义物品网格样式（40x40像素格子）
  - [x] SubTask 5.4: 定义物品详情弹窗样式
  - [x] SubTask 5.5: 定义货币显示样式（金币金色、魔石紫色）
  - [x] SubTask 5.6: 定义按钮样式（购买、出售、关闭）
  - [x] SubTask 5.7: 添加响应式设计，适配手机屏幕

- [x] Task 6: 创建商店组件索引文件
  - [x] SubTask 6.1: 创建 src/components/shop/index.ts 文件
  - [x] SubTask 6.2: 导出 ShopPage 组件
  - [x] SubTask 6.3: 添加组件说明注释

- [x] Task 7: 添加杂货商和魔石商人NPC配置
  - [x] SubTask 7.1: 在 src/data/npcData.ts 中添加杂货商NPC配置（id: npc_grocery_merchant）
  - [x] SubTask 7.2: 为杂货商配置交互选项（购买物品、出售物品、离开）
  - [x] SubTask 7.3: 在 src/data/npcData.ts 中添加魔石商人NPC配置（id: npc_magic_stone_merchant）
  - [x] SubTask 7.4: 为魔石商人配置交互选项（购买物品、出售物品、离开）
  - [x] SubTask 7.5: 将新NPC添加到 npcConfig 和 npcByType 映射表
  - [x] SubTask 7.6: 将新NPC添加到 npcByLocation 映射表（卡萨诺城）

- [x] Task 8: 更新地图数据配置
  - [x] SubTask 8.1: 在 src/data/gameData.ts 中为卡萨诺城地图添加杂货商NPC交互ID
  - [x] SubTask 8.2: 为卡萨诺城地图添加魔石商人NPC交互ID
  - [x] SubTask 8.3: 更新 interactableData.ts，导入新的NPC配置

- [x] Task 9: 集成商店系统到App.tsx
  - [x] SubTask 9.1: 在 App.tsx 中添加商店页面状态（showShopPage, currentShopType）
  - [x] SubTask 9.2: 实现 handleOpenShop 函数，处理打开商店的动作
  - [x] SubTask 9.3: 实现 handlePurchaseItem 函数，处理购买物品逻辑
  - [x] SubTask 9.4: 实现 handleSellItem 函数，处理出售物品逻辑
  - [x] SubTask 9.5: 在 handleNPCOptionSelect 中添加 openShop、openSellMode、showMessage 动作处理
  - [x] SubTask 9.6: 渲染 ShopPage 组件，传递必要的props
  - [x] SubTask 9.7: 添加完整的中文注释

- [x] Task 10: 扩展背包系统接口
  - [x] SubTask 10.1: 在 inventoryData.ts 中添加 addItem 函数（添加物品到背包）
  - [x] SubTask 10.2: 添加 removeItem 函数（从背包移除物品）
  - [x] SubTask 10.3: 添加 hasSpaceFor 函数（检查背包空间）
  - [x] SubTask 10.4: 添加 findItemById 函数（查找背包中的物品）
  - [x] SubTask 10.5: 确保物品堆叠逻辑正确（相同物品数量增加）

- [x] Task 11: 扩展货币系统接口
  - [x] SubTask 11.1: 在 App.tsx 中确保金币和魔石状态正确管理
  - [x] SubTask 11.2: 实现 subtractGold 函数（扣除金币，检查是否足够）
  - [x] SubTask 11.3: 实现 subtractMagicStone 函数（扣除魔石，检查是否足够）
  - [x] SubTask 11.4: 实现 addGold 函数（增加金币）
  - [x] SubTask 11.5: 实现货币不足的错误处理

- [ ] Task 12: 实现随机武器生成功能
  - [ ] SubTask 12.1: 在 shopUtils.ts 中实现 generateRandomWeapon 函数
  - [ ] SubTask 12.2: 随机生成装备类型（武器、头盔、衣服、鞋子、手镯、项链）
  - [ ] SubTask 12.3: 随机生成品质（普通50%、良好33%、优秀17%）
  - [ ] SubTask 12.4: 随机生成洞数（0.1%概率有1-2个洞）
  - [ ] SubTask 12.5: 随机生成魔魂等级（0-3级）
  - [ ] SubTask 12.6: 返回完整的装备数据结构

- [ ] Task 13: 实现幻兽生成功能
  - [ ] SubTask 13.1: 在 shopUtils.ts 中实现 generatePet 函数
  - [ ] SubTask 13.2: 根据幻兽类型设置基础属性和成长属性
  - [ ] SubTask 13.3: 随机生成初始属性（攻击、防御、生命等）
  - [ ] SubTask 13.4: 计算幻兽品质分数
  - [ ] SubTask 13.5: 添加基础品质加成（调皮猫+280，吉鲁猪+380等）
  - [ ] SubTask 13.6: 返回完整的幻兽数据结构

- [ ] Task 14: 测试和验证
  - [ ] SubTask 14.1: 运行 TypeScript 类型检查（tsc --noEmit）
  - [ ] SubTask 14.2: 测试杂货商NPC的显示和交互
  - [ ] SubTask 14.3: 测试魔石商人NPC的显示和交互
  - [ ] SubTask 14.4: 测试金币商店的购买流程
  - [ ] SubTask 14.5: 测试魔石商店的购买流程
  - [ ] SubTask 14.6: 测试出售物品流程
  - [ ] SubTask 14.7: 测试错误处理（货币不足、背包已满、数量验证）
  - [ ] SubTask 14.8: 测试随机武器生成功能
  - [ ] SubTask 14.9: 测试幻兽生成功能
  - [ ] SubTask 14.10: 验证手机端体验（一屏展示所有信息）

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 1, Task 2, Task 3]
- [Task 5] depends on [Task 4]
- [Task 6] depends on [Task 4, Task 5]
- [Task 7] depends on [Task 1]
- [Task 8] depends on [Task 7]
- [Task 9] depends on [Task 4, Task 6, Task 7, Task 8, Task 10, Task 11]
- [Task 10] depends on [Task 1]
- [Task 11] depends on [Task 1]
- [Task 12] depends on [Task 3]
- [Task 13] depends on [Task 3]
- [Task 14] depends on [Task 9, Task 12, Task 13]
