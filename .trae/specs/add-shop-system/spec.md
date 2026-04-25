# 商店系统设计 Spec

## Why
项目中已有背包系统和NPC交互系统，但缺少商店系统，玩家无法购买和出售物品。根据 reference 文档，原游戏包含杂货商（金币商店）和魔石商人（魔石商店）两个重要的NPC，提供了购买消耗品、宝石、幻兽等物品的功能。需要实现完整的商店系统，使玩家能够通过金币和魔石购买物品，并正确集成到现有的背包系统和NPC交互系统中。

## What Changes
- 根据 reference/docs/杂货商交互逻辑文档.md，实现杂货商NPC和金币商店系统
- 根据 reference/docs/魔石商人交互逻辑文档.md，实现魔石商人NPC和魔石商店系统
- 创建商店页面组件，复用现有背包系统的物品数据结构和渲染组件
- 实现完整的购买流程，包括物品选择、数量输入、支付确认及购买结果反馈
- 实现出售功能，玩家可以将物品出售给商店获得金币（75%价值）
- 将杂货商和魔石商人NPC添加到卡萨诺城场景的交互按钮区
- 扩展NPC交互系统，支持打开商店页面的动作类型

## Impact
- Affected specs: inventory-page（背包系统）、add-npc-characters（NPC交互系统）
- Affected code:
  - src/components/shop/ShopPage.tsx（新建：商店页面组件）
  - src/components/shop/shop.css（新建：商店页面样式）
  - src/data/shopData.ts（新建：商店物品配置数据）
  - src/utils/shopUtils.ts（新建：商店工具函数）
  - src/data/npcData.ts（修改：添加杂货商和魔石商人NPC配置）
  - src/data/gameData.ts（修改：卡萨诺城地图添加NPC交互ID）
  - src/App.tsx（修改：添加商店页面状态和处理逻辑）
  - src/types/index.ts（修改：添加商店相关类型定义）

## ADDED Requirements

### Requirement: 商店物品数据配置
系统 SHALL 配置杂货商和魔石商人的出售物品列表：

#### 杂货商物品列表（金币购买）
| 物品名称 | 价格（金币） | 价格（魔石） | 类型 |
|---------|------------|------------|------|
| 灵魂晶石 | 1,000,000 | 0 | 宝石 |
| 魔魂晶石 | 50,000 | 0 | 宝石 |
| 幻魔晶石 | 500,000 | 0 | 宝石 |
| 中级战斗力石 | 500,000 | 0 | 消耗品 |
| 中级经验石 | 500,000 | 0 | 消耗品 |
| 空经验球 | 10,000 | 0 | 特殊道具 |
| 体力药 | 50,000 | 0 | 消耗品 |
| 果子 | 100,000 | 0 | 消耗品 |
| 星魔剑 | 10,000,000 | 1,000 | 技能书 |
| 高级风斩 | 1,000 | 0 | 技能书 |
| 高级地裂爆斩 | 10,000 | 0 | 技能书 |
| 随机武器 | 1,000 | 0 | 装备 |

#### 魔石商人物品列表（魔石购买）
| 物品名称 | 价格（魔石） | 价格（金币） | 类型 |
|---------|------------|------------|------|
| 攻防型幻兽 | 1 | 10,000 | 幻兽 |
| 调皮猫 | 28 | 280,000 | 幻兽 |
| 吉鲁猪 | 40 | 400,000 | 幻兽 |
| 奇异兽 | 50 | 500,000 | 幻兽 |
| 守护 | 1,200 | 12,000,000 | 幻兽 |
| 8星奇异兽 | 150 | 1,500,000 | 幻兽 |
| 12星奇异兽 | 450 | 4,500,000 | 幻兽 |
| 魔魂之心 | 128 | 280,000 | 宝石 |
| 幻魔之心 | 280 | 3,000,000 | 宝石 |
| 灵魂王 | 2,000 | 200,000,000 | 宝石 |
| 高级经验石 | 500 | 5,000,000 | 消耗品 |
| 高级战斗力石 | 2,800 | 28,000,000 | 消耗品 |
| 电浆药水 | 8,280 | 100,000,000 | 消耗品 |
| 99朵白玫瑰 | 50 | 500,000 | 消耗品 |
| 斗志昂扬 | 2,800 | 28,000,000 | 技能书 |
| 月光宝盒 | 2,800 | 0 | 特殊道具 |

### Requirement: 商店页面组件设计
系统 SHALL 实现功能完整的商店页面组件：

#### Scenario: 打开商店页面
- **WHEN** 玩家与杂货商或魔石商人NPC交互并选择"购买物品"
- **THEN** 打开对应的商店页面（金币商店或魔石商店）
- **AND** 显示商店物品列表，每个物品显示图标、名称、价格
- **AND** 显示玩家当前金币/魔石余额
- **AND** 提供"关闭"按钮返回游戏

#### Scenario: 购买物品流程
- **WHEN** 玩家在商店页面点击某个物品
- **THEN** 显示物品详情弹窗，包含物品描述、价格、购买数量输入框
- **AND** 提供"购买"和"取消"按钮
- **WHEN** 玩家输入购买数量并点击"购买"
- **THEN** 检查玩家货币是否足够
- **IF** 货币足够
  - **THEN** 扣除货币
  - **AND** 将物品添加到背包
  - **AND** 显示购买成功提示
- **IF** 货币不足
  - **THEN** 显示货币不足提示
- **IF** 背包已满
  - **THEN** 显示背包已满提示
  - **AND** 退还已扣除的货币

#### Scenario: 出售物品流程
- **WHEN** 玩家在商店页面点击"出售物品"按钮
- **THEN** 切换到出售模式
- **AND** 显示玩家背包物品列表
- **WHEN** 玩家点击背包中的物品
- **THEN** 显示物品出售价格（物品价值的75%）
- **AND** 提供"出售"和"取消"按钮
- **WHEN** 玩家点击"出售"
- **THEN** 从背包移除物品
- **AND** 增加玩家金币
- **AND** 显示出售成功提示

### Requirement: 商店页面UI设计
系统 SHALL 设计符合手机端体验的商店页面：

#### 页面布局
- **顶部区域**：商店名称、玩家货币余额（金币/魔石）
- **中部区域**：物品网格列表（复用背包系统的ItemGrid组件）
- **底部区域**：操作按钮（购买/出售切换、关闭）
- **物品详情弹窗**：物品图标、名称、描述、价格、数量输入、购买/取消按钮

#### 样式要求
- 使用深色主题，与现有游戏风格一致
- 物品网格使用40x40像素格子
- 价格显示：金币使用金色，魔石使用紫色
- 响应式设计，适配手机屏幕

### Requirement: NPC交互系统扩展
系统 SHALL 扩展NPC交互系统以支持商店功能：

#### 杂货商NPC配置
```typescript
{
  id: 'npc_grocery_merchant',
  type: 'npc',
  name: '杂货商',
  icon: '🏪',
  description: '卡萨诺城的杂货商，出售各种消耗品和材料。',
  location: 'kasanuocheng',
  npcType: 'shop',
  options: [
    { text: '购买物品', result: '欢迎光临！请随意挑选。', actionType: 'openShop', actionParams: { shopType: 'gold' } },
    { text: '出售物品', result: '有什么不需要的物品吗？', actionType: 'openSellMode', actionParams: { shopType: 'gold' } },
    { text: '离开', result: '欢迎下次再来！', actionType: 'close' }
  ]
}
```

#### 魔石商人NPC配置
```typescript
{
  id: 'npc_magic_stone_merchant',
  type: 'npc',
  name: '魔石商人',
  icon: '💎',
  description: '神秘的魔石商人，出售珍贵的物品和幻兽。',
  location: 'kasanuocheng',
  npcType: 'shop',
  options: [
    { text: '购买物品', result: '用魔石可以买到很多珍贵的东西哦！', actionType: 'openShop', actionParams: { shopType: 'magicStone' } },
    { text: '出售物品', result: '我不收物品，只卖东西哦。', actionType: 'showMessage', actionParams: { message: '魔石商人不出售物品功能。' } },
    { text: '离开', result: '期待你的下次光临！', actionType: 'close' }
  ]
}
```

### Requirement: 购买流程实现
系统 SHALL 实现完整的购买流程：

#### 货币检查
- 检查玩家金币/魔石是否足够支付
- 不足时显示提示："金币/魔石不足，无法购买"

#### 背包空间检查
- 检查背包是否有足够空间
- 如果物品可堆叠，检查是否已有相同物品
- 背包已满时显示提示："背包已满，无法购买"

#### 物品添加
- 调用背包系统的addItem函数添加物品
- 如果是幻兽，调用幻兽系统的addPet函数
- 支持物品堆叠（数量增加）

#### 货币扣除
- 调用货币系统的subtractCurrency函数扣除金币/魔石
- 购买失败时自动退还货币

### Requirement: 出售流程实现
系统 SHALL 实现完整的出售流程：

#### 出售价格计算
- 物品出售价格为物品价值的75%
- 调用物品的getSellPrice方法获取出售价格
- 显示出售价格预览

#### 物品移除
- 调用背包系统的removeItem函数移除物品
- 支持部分出售（减少数量）

#### 金币增加
- 调用货币系统的addCurrency函数增加金币
- 显示出售成功提示和获得的金币数量

### Requirement: 随机武器生成
系统 SHALL 实现随机武器生成功能：

#### 生成规则
- 等级：固定为1级
- 品质：普通（50%）、良好（33%）、优秀（17%）
- 洞数：0.1%概率有1-2个洞
- 魔魂等级：随机0-3级
- 装备类型：随机（武器、头盔、衣服、鞋子、手镯、项链）

### Requirement: 幻兽生成系统
系统 SHALL 实现幻兽生成功能：

#### 幻兽属性生成
- 根据幻兽类型生成基础属性
- 随机生成初始属性和成长属性
- 计算幻兽品质分数
- 添加基础品质加成（如调皮猫+280，吉鲁猪+380）

#### 幻兽添加
- 调用幻兽系统的addPet函数添加幻兽
- 检查幻兽背包是否已满
- 幻兽背包已满时显示提示并退还魔石

### Requirement: 错误处理
系统 SHALL 实现完善的错误处理：

#### 货币不足
- 显示提示："金币/魔石不足，无法购买"
- 不执行购买操作

#### 背包已满
- 显示提示："背包已满，无法购买"
- 退还已扣除的货币

#### 幻兽背包已满
- 显示提示："幻兽背包已满，无法购买幻兽"
- 退还已扣除的魔石

#### 数量输入验证
- 检查输入数量是否为正整数
- 检查输入数量是否超过最大购买数量（99）
- 显示相应的错误提示

## MODIFIED Requirements

### Requirement: NPC交互系统
NPC交互系统 SHALL 支持新的actionType：
- `openShop`：打开商店页面，参数：`{ shopType: 'gold' | 'magicStone' }`
- `openSellMode`：打开出售模式，参数：`{ shopType: 'gold' }`
- `showMessage`：显示提示消息，参数：`{ message: string }`

### Requirement: 背包系统
背包系统 SHALL 提供以下接口供商店系统调用：
- `addItem(item: InventoryItem, quantity: number): boolean` - 添加物品到背包
- `removeItem(itemId: string, quantity: number): boolean` - 从背包移除物品
- `hasSpaceFor(item: InventoryItem, quantity: number): boolean` - 检查背包空间

### Requirement: 货币系统
货币系统 SHALL 提供以下接口供商店系统调用：
- `getGold(): number` - 获取玩家金币数量
- `getMagicStone(): number` - 获取玩家魔石数量
- `subtractGold(amount: number): boolean` - 扣除金币
- `subtractMagicStone(amount: number): boolean` - 扣除魔石
- `addGold(amount: number): void` - 增加金币

## REMOVED Requirements
无移除的需求。
