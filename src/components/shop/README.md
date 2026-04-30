# 商店组件 (Shop Components)

## 概述

商店组件提供购买和出售物品的功能，支持杂货商（金币商店）和魔石商人（魔石商店）。

## 组件列表

### ShopPage

商店页面组件，提供购买和出售物品的功能。

#### 属性

```typescript
interface ShopPageProps {
  shopType: ShopType;              // 商店类型：'gold' | 'magicStone'
  playerResources: PlayerResources; // 玩家资源（金币、魔石）
  inventoryItems: InventoryItem[];  // 背包物品列表
  maxSlots?: number;                // 背包最大格子数（默认1000）
  pets?: Pet[];                     // 幻兽列表
  maxPetSlots?: number;             // 幻兽背包最大格子数（默认10）
  onPurchase: (itemId, quantity, goldSpent, magicStoneSpent) => void; // 购买物品回调
  onPurchasePet: (pet, goldSpent, magicStoneSpent) => void;           // 购买幻兽数回调
  onSell: (itemId, quantity, goldEarned, magicStoneEarned) => void;   // 出售物品回调
  onClose: () => void;              // 关闭商店回调
}
```

#### 功能

1. **购买物品**
   - 支持金币和魔石两种货币
   - 自动检查货币是否足够
   - 支持可堆叠物品和不可堆叠物品
   - 支持购买幻兽

2. **出售物品**
   - 显示出售价格
   - 自动从背包移除物品
   - 金币商店出售只获得金币，魔石商店出售只获得魔石

3. **幻兽购买**
   - 检查幻兽背包是否已满
   - 检查货币是否足够
   - 自动生成幻兽并添加到幻兽列表
   - 扣除相应货币

## 使用示例

```tsx
import { ShopPage } from './components/shop';

function App() {
  const [showShopPage, setShowShopPage] = useState(false);
  const [playerResources, setPlayerResources] = useState({
    gold: 100000,
    magicStone: 100,
  });
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);

  // 处理购买物品
  const handlePurchaseItem = (itemId, quantity, goldSpent, magicStoneSpent) => {
    // 扣除货币
    setPlayerResources(prev => ({
      ...prev,
      gold: prev.gold - goldSpent,
      magicStone: prev.magicStone - magicStoneSpent,
    }));
    // 添加物品到背包
    // ...
  };

  // 处理购买幻兽
  const handlePurchasePet = (pet, goldSpent, magicStoneSpent) => {
    // 扣除货币
    setPlayerResources(prev => ({
      ...prev,
      gold: prev.gold - goldSpent,
      magicStone: prev.magicStone - magicStoneSpent,
    }));
    // 添加幻兽到幻兽列表
    setPets(prev => [...prev, pet]);
  };

  // 处理出售物品
  const handleSellItem = (itemId, quantity, goldEarned, magicStoneEarned) => {
    // 增加货币
    setPlayerResources(prev => ({
      ...prev,
      gold: prev.gold + goldEarned,
      magicStone: prev.magicStone + magicStoneEarned,
    }));
    // 从背包移除物品
    // ...
  };

  return (
    <>
      <button onClick={() => setShowShopPage(true)}>打开商店</button>
      {showShopPage && (
        <ShopPage
          shopType="magicStone"
          playerResources={playerResources}
          inventoryItems={inventory}
          pets={pets}
          maxPetSlots={100}
          onPurchase={handlePurchaseItem}
          onPurchasePet={handlePurchasePet}
          onSell={handleSellItem}
          onClose={() => setShowShopPage(false)}
        />
      )}
    </>
  );
}
```

## 商店配置

商店数据配置在 `src/data/shopData.ts` 文件中：

### 杂货商（金币商店）

- 消耗品：生命药水、魔法药水等
- 材料：灵魂晶石、魔魂晶石、幻魔晶石
- 技能书：各种技能升级书籍
- 随机装备：随机获得一件装备

### 魔石商人（魔石商店）

- 幻兽：攻防型、调皮猫、吉鲁猪、奇异兽、守护等
- 8星奇异兽：评分约800
- 12星奇异兽：评分约1200
- 高级物品：经验球、幻化圣兽等

## 注意事项

1. **货币检查**：购买前会自动检查货币是否足够
2. **幻兽背包**：购买幻兽前会检查幻兽背包是否已满
3. **物品堆叠**：可堆叠物品会自动合并
4. **价格显示**：同时显示金币和魔石价格（如果都有）
5. **出售价格**：出售价格为购买价格的50%

## 相关文件

- `src/components/shop/ShopPage.tsx` - 商店页面组件
- `src/data/shopData.ts` - 商店数据配置
- `src/utils/shopUtils.ts` - 商店工具函数
- `src/types/index.ts` - 类型定义

## 更新日志

### 2024-01-17
- 修复了魔石商人商店购买幻兽点击没有反应的问题
- 添加了 `onPurchasePet` 回调函数，用于处理幻兽购买
- 增加了货币检查，确保购买前有足够的金币或魔石
- 完善了幻兽购买的完整流程（扣除货币 + 添加幻兽）
- **修复了货币检查函数参数顺序错误的问题**（重要）
  - `canAffordPurchase` 函数的正确参数顺序：`(playerGold, playerMagicStone, item, quantity, shopType)`
  - 之前错误地传递了 `(shopItem, 1, shopType, playerResources)`
  - 现在正确传递 `(playerResources.gold, playerResources.magicStone, shopItem, 1, shopType)`
