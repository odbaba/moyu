# Checklist

## 类型定义验证
- [x] 商店相关类型定义完整（ShopItem, ShopType, ShopConfig等）
- [x] NPCInteractionOption 接口正确扩展 openShop、openSellMode、showMessage 动作类型
- [x] ShopItem 接口包含所有必要字段（ID、名称、价格、类型、描述、图标）
- [x] ShopConfig 接口包含商店类型和物品列表配置

## 商店数据配置验证
- [x] shopData.ts 文件正确导出所有商店配置
- [x] 杂货商物品列表配置完整（12种物品）
- [x] 魔石商人物品列表配置完整（16种物品）
- [x] 每个物品的属性配置详细且符合原游戏设计
- [x] shopConfig 映射表正确导出

## 商店工具函数验证
- [x] canAffordPurchase 函数正确检查玩家货币
- [x] hasInventorySpace 函数正确检查背包空间
- [x] calculateSellPrice 函数正确计算出售价格（75%价值）
- [x] purchaseItem 函数正确执行购买流程
- [x] sellItem 函数正确执行出售流程
- [x] generateRandomWeapon 函数正确生成随机武器
- [x] generatePet 函数正确生成幻兽属性

## 商店页面组件验证
- [x] ShopPage 组件正确显示商店名称和货币余额
- [x] 物品网格正确复用 ItemGrid 组件
- [x] 物品详情弹窗正确显示物品信息
- [x] 购买流程正确执行（货币检查、背包空间检查、购买确认）
- [x] 出售模式正确切换和执行
- [x] 错误处理和提示正确显示
- [x] 组件添加了完整的中文注释

## 商店页面样式验证
- [x] 商店页面布局样式正确（深色主题）
- [x] 物品网格样式正确（40x40像素格子）
- [x] 物品详情弹窗样式美观
- [x] 货币显示样式正确（金币金色、魔石紫色）
- [x] 按钮样式美观且易于点击
- [x] 响应式设计正确，适配手机屏幕

## NPC配置验证
- [x] 杂货商NPC配置正确（id: npc_grocery_merchant）
- [x] 杂货商交互选项正确（购买物品、出售物品、离开）
- [x] 魔石商人NPC配置正确（id: npc_magic_stone_merchant）
- [x] 魔石商人交互选项正确（购买物品、出售物品、离开）
- [x] 新NPC正确添加到 npcConfig 和 npcByType 映射表
- [x] 新NPC正确添加到 npcByLocation 映射表（卡萨诺城）

## 地图数据验证
- [x] 卡萨诺城地图正确配置杂货商NPC交互ID
- [x] 卡萨诺城地图正确配置魔石商人NPC交互ID
- [x] interactableData.ts 正确导入新的NPC配置

## App.tsx集成验证
- [x] 商店页面状态正确管理（showShopPage, currentShopType）
- [x] handleOpenShop 函数正确处理打开商店动作
- [x] handlePurchaseItem 函数正确处理购买物品逻辑
- [x] handleSellItem 函数正确处理出售物品逻辑
- [x] handleNPCOptionSelect 正确处理 openShop、openSellMode、showMessage 动作
- [x] ShopPage 组件正确渲染并接收必要的props
- [x] 添加了完整的中文注释

## 背包系统接口验证
- [x] addItem 函数正确添加物品到背包
- [x] removeItem 函数正确从背包移除物品
- [x] hasSpaceFor 函数正确检查背包空间
- [x] findItemById 函数正确查找背包中的物品
- [x] 物品堆叠逻辑正确（相同物品数量增加）

## 货币系统接口验证
- [x] 金币和魔石状态正确管理
- [x] subtractGold 函数正确扣除金币并检查是否足够
- [x] subtractMagicStone 函数正确扣除魔石并检查是否足够
- [x] addGold 函数正确增加金币
- [x] 货币不足的错误处理正确

## 随机武器生成验证
- [x] generateRandomWeapon 函数正确生成随机装备类型
- [x] 品质随机生成正确（普通50%、良好33%、优秀17%）
- [x] 洞数随机生成正确（0.1%概率有1-2个洞）
- [x] 魔魂等级随机生成正确（0-3级）
- [x] 返回完整的装备数据结构

## 幻兽生成验证
- [x] generatePet 函数正确根据幻兽类型设置属性
- [x] 初始属性随机生成正确
- [x] 幻兽品质分数计算正确
- [x] 基础品质加成正确应用
- [x] 返回完整的幻兽数据结构

## 整体验证
- [x] TypeScript 类型检查通过（无错误）
- [x] 杂货商NPC在卡萨诺城正确显示和交互
- [x] 魔石商人NPC在卡萨诺城正确显示和交互
- [x] 金币商店购买流程顺畅
- [x] 魔石商店购买流程顺畅
- [x] 出售物品流程顺畅
- [x] 错误处理完善（货币不足、背包已满、数量验证）
- [x] 随机武器生成功能正常
- [x] 幻兽生成功能正常
- [x] 手机端体验良好（一屏能展示所有信息）
- [x] 代码注释完整，符合项目规范
