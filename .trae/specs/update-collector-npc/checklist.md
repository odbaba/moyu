# 收藏家NPC完善与迁移检查清单

## NPC配置检查
- [x] 收藏家NPC已更新 location 为 'kasanuocheng'
- [x] 收藏家NPC description 已更新为完整对话内容
- [x] 收藏家NPC options 已更新为"我有些好东西要卖"和"我没什么想卖的"

- [x] 收藏家NPC actionType 配置为 'openCollector'

## 地图交互列表检查
- [x] 雷鸣大陆的 interactables 列表已移除 'npc_collector'
- [x] 卡萨诺城的 interactables 列表已添加 'npc_collector'

## NPC映射表检查
- [x] npcByLocation['leiming-dalu'] 已移除 'npc_collector'
- [x] npcByLocation['kasanuocheng'] 已添加 'npc_collector'

## 物品价值计算检查
- [x] itemValueCalculator.ts 文件已创建
- [x] calculateItemMagicStoneValue 函数已实现
- [x] 金矿价值计算正确
- [x] 灵魂王价值计算正确
- [x] 月光宝盒价值计算正确
- [x] 电浆药水价值计算正确
- [x] 999朵白玫瑰价值计算正确
- [x] 满经验球价值计算正确
- [x] 极品装备价值计算正确
- [x] 非极品装备价值返回0
- [x] 收购价格计算正确（80%）
- [x] calculateTotalValue 函数已实现
- [x] calculatePurchasePrice 函数已实现

- [x] formatMagicStoneValue 函数已实现

## 收藏架界面检查
- [x] CollectorModal 组件已创建
- [x] 界面布局正确（4×3网格）
- [x] 总价值显示正确
- [x] 出售按钮功能正常
- [x] 关闭按钮功能正常
- [x] 物品拖拽到收藏架功能正常
- [x] 物品从收藏架移除功能正常
- [x] 收藏架内部物品交换功能正常
- [x] 无价值物品提示正确
- [x] 收藏架已满提示正确
- [x] 出售成功提示正确

- [x] 同时打开背包界面功能正常

## 物品数据检查
- [x] 金矿有 magicStoneValue 字段
- [x] 灵魂王有 magicStoneValue 字段
- [x] 月光宝盒有 magicStoneValue 字段
- [x] 月光宝盒增强版有 magicStoneValue 字段
- [x] 电浆药水有 magicStoneValue 字段
- [x] 999朵白玫瑰有 magicStoneValue 字段
- [x] 满经验球有 magicStoneValue 字段

- [x] createGoldOre 函数正确计算金矿价值

## App.tsx 集成检查
- [x] 收藏架界面状态管理已添加
- [x] 'openCollector' actionType 已处理
- [x] 打开/关闭收藏架界面逻辑正确
- [x] 同时打开背包界面功能正常

## 功能测试检查
- [x] 收藏家NPC出现在卡萨诺城
- [x] 收藏家对话内容正确显示
- [x] 收藏架界面可以正常打开
- [x] 收藏架界面可以正常关闭
- [x] 物品可以拖拽到收藏架
- [x] 物品可以从收藏架移除
- [x] 总价值计算正确
- [x] 出售功能正确
- [x] 无魔石价值物品无法放入收藏架
- [x] 收藏架已满时有提示
- [x] 空收藏架出售有提示
- [x] 非极品装备无法出售

- [x] TypeScript编译无错误
- [x] 项目可以正常运行

## 用户体验检查
- [x] 收藏架界面适合手机端
- [x] 按钮易于点击
- [x] 提示信息清晰
- [x] 视觉效果良好
- [x] 一屏显示所有关键信息

- [x] 触摸友好

## 代码质量检查
- [x] 代码注释完整
- [x] 函数命名规范
- [x] 无冗余代码
- [x] 错误处理完善
- [x] TypeScript类型检查通过
