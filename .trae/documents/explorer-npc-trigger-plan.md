# 探险家NPC触发机制实现计划

## 需求概述
- 探险家NPC的交换按钮正常状态是不显示的
- 当角色全身6件装备都是极品品质时，到达卡萨诺城会触发一个弹窗
- 弹窗内容："飞翔：噢，你的全身装备都是极品啊，看来这位你是位不同寻常的人。听装备打造师说从戈壁可以找到有关战魂的秘密...你应该去看一看。"
- 玩家点击确定后，探险家NPC出现在戈壁地点的交互按钮区里

## 实现步骤

### 步骤1: 创建装备检测工具函数
**文件**: `src/utils/equipmentUtils.ts` (新建)

创建检测全身装备是否都是极品的函数：
```typescript
/**
 * 检查全身6件装备是否都是极品品质
 * @param equipment 角色装备对象
 * @returns 是否全身极品
 */
export function checkAllEquipmentLegendary(equipment: CharacterData['equipment']): boolean {
  const slots: (keyof typeof equipment)[] = ['weapon', 'helmet', 'clothes', 'shoes', 'bracelet', 'necklace'];
  
  // 检查是否所有槽位都有装备
  for (const slot of slots) {
    const item = equipment[slot];
    if (!item) {
      return false;
    }
    // 检查品质是否为极品
    if (item.quality !== '极品') {
      return false;
    }
  }
  
  return true;
}
```

### 步骤2: 新增游戏状态
**文件**: `src/App.tsx`

在状态声明区域添加：
```typescript
// 探险家解锁状态（戈壁探险家）
const [explorerUnlocked, setExplorerUnlocked] = useState(false);
```

### 步骤3: 修改地点移动逻辑
**文件**: `src/App.tsx`

修改 `handleMove` 函数，添加卡萨诺城到达检测逻辑：
```typescript
const handleMove = (locationId: string) => {
  const location = locations.find(loc => loc.id === locationId);
  if (location) {
    setCurrentLocation(locationId);
    setInteractionLog(prev => [...prev, `你移动到了${location.name}`]);
    
    // 检测到达卡萨诺城时是否触发探险家解锁
    if (locationId === 'kasanuocheng' && !explorerUnlocked) {
      if (checkAllEquipmentLegendary(character.equipment)) {
        // 显示解锁弹窗
        setInfoModalTitle('飞翔');
        setInfoModalContent('噢，你的全身装备都是极品啊，看来这位你是位不同寻常的人。听装备打造师说从戈壁可以找到有关战魂的秘密...你应该去看一看。');
        setInfoModalOnConfirm(() => {
          setExplorerUnlocked(true);
        });
        setShowInfoModal(true);
      }
    }
  }
};
```

### 步骤4: 创建戈壁探险家NPC配置
**文件**: `src/data/npcData.ts`

在探险家NPC配置后添加戈壁版本：
```typescript
/**
 * 戈壁探险家 NPC 配置
 * 功能：提供探险任务和奖励（解锁条件：全身极品装备到达卡萨诺城）
 * 位置：戈壁
 */
const npc_explorer_gebi: NPCInteractable = {
  id: 'npc_explorer_gebi',
  type: 'npc',
  name: '探险家',
  icon: '🧭',
  description: '经验丰富的探险家，在戈壁寻找战魂的秘密。',
  location: 'gebi',
  npcType: 'special',
  options: [
    {
      text: '接受探险任务',
      result: '接受探险任务，探索未知的领域。',
      actionType: 'acceptExploreTask',
      actionParams: {},
    },
    {
      text: '领取探险奖励',
      result: '领取已完成的探险任务奖励。',
      actionType: 'claimExploreReward',
      actionParams: {},
    },
    {
      text: '关于探险',
      result: '探险说明：\n\n探险任务会引导你前往各个地图探索。\n完成探险任务可以获得丰厚奖励。\n\n祝你好运，冒险者！',
      actionType: 'showHelp',
      actionParams: { topic: 'explore' },
    },
  ],
};
```

### 步骤5: 更新NPC配置导出
**文件**: `src/data/npcData.ts`

将新NPC添加到配置中：
```typescript
// 在 npcConfig 对象中添加
npc_explorer_gebi,

// 在 npcByType.special 数组中添加
npc_explorer_gebi,

// 在 npcByLocation.gebi 数组中添加
npc_explorer_gebi,
```

### 步骤6: 修改交互对象计算逻辑
**文件**: `src/App.tsx`

修改 `currentInteractables` 的计算逻辑，动态添加戈壁探险家：
```typescript
const currentInteractables = useMemo(() => {
  // 获取静态交互对象（怪物、NPC等）
  const staticInteractables = currentLoc?.interactables
    ?.map(id => interactableConfig[id])
    .filter(interactable => interactable && !killedMonsters.has(interactable.id)) || [];

  // 获取当前地图的 BOSS 交互对象（过滤掉已击杀的 BOSS）
  const locationBossInteractables: (EnemyInteractable | undefined)[] = [];
  // ... 现有BOSS逻辑 ...

  // 动态添加戈壁探险家（如果已解锁）
  const dynamicInteractables: (ActionInteractable | EnemyInteractable | NPCInteractable)[] = [];
  if (currentLocation === 'gebi' && explorerUnlocked) {
    const explorerGebi = interactableConfig['npc_explorer_gebi'];
    if (explorerGebi) {
      dynamicInteractables.push(explorerGebi as NPCInteractable);
    }
  }

  return [...staticInteractables, ...locationBossInteractables.filter(Boolean), ...dynamicInteractables] as (ActionInteractable | EnemyInteractable | NPCInteractable)[];
}, [currentLoc, killedMonsters, bossInteractables, spawnedBosses, currentLocation, explorerUnlocked]);
```

## 文件修改清单

| 文件路径 | 修改类型 | 说明 |
|---------|---------|------|
| `src/utils/equipmentUtils.ts` | 新建 | 创建装备检测工具函数 |
| `src/App.tsx` | 修改 | 添加状态、修改移动逻辑、修改交互对象计算 |
| `src/data/npcData.ts` | 修改 | 添加戈壁探险家NPC配置 |

## 注意事项
1. 弹窗只触发一次，解锁后不再触发（通过 `explorerUnlocked` 状态控制）
2. 探险家NPC的交互功能与现有探险家一致
3. 遵循项目代码规范，添加必要的中文注释
4. 不需要持久化存储，当前会话有效即可（刷新页面后重新触发）

## 测试要点
1. 正常情况下戈壁没有探险家NPC
2. 穿戴不全极品装备到达卡萨诺城不触发弹窗
3. 全身极品装备到达卡萨诺城触发弹窗
4. 点击确定后戈壁出现探险家NPC
5. 再次到达卡萨诺城不再触发弹窗
