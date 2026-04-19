# 战魂封印迷宫和无名氏NPC实现计划

## 需求概述
1. 新增战魂封印迷宫地点，包含神秘人NPC和无名氏敌人的交互
2. 修改探险家交互，支付后传送到战魂封印迷宫

## 实现步骤

### 步骤1: 新增战魂封印迷宫地点
**文件**: `src/data/gameData.ts`

在locations数组中添加新地点：
```typescript
{
  id: 'zhanhun-fengyin-migong',
  name: '战魂封印迷宫',
  description: '神秘的战魂封印之地，传说这里隐藏着战魂的秘密。',
  adjacentLocations: [], // 独立地点，无法通过地图移动到达
  interactables: ['npc_mysterious_person'], // 初始只有神秘人NPC
  x: 10, // 独立坐标
  y: 5,
}
```

### 步骤2: 新增神秘人NPC配置
**文件**: `src/data/npcData.ts`

创建神秘人NPC：
- id: 'npc_mysterious_person'
- name: '神秘人'
- icon: '👤'
- description: 对话内容
- 点击后显示对话，然后神秘人消失，无名氏敌人出现

### 步骤3: 新增无名氏敌人配置
**文件**: `src/data/monsterData.ts`

创建无名氏怪物模板：
- 等级：动态计算，max(玩家等级, 50)
- 最大生命值：4000 × 等级
- 最小攻击：112.5 × 等级
- 最大攻击：168 × 等级
- 防御：96 × 等级
- 战斗力：100 + 等级

### 步骤4: 新增无名氏交互对象
**文件**: `src/data/interactableData.ts`

创建无名氏敌人交互对象：
- id: 'enemy_wumingshi'
- type: 'enemy'
- 初始不可见，点击神秘人后才出现

### 步骤5: 新增游戏状态
**文件**: `src/App.tsx`

添加状态：
- `mysteriousPersonDefeated: boolean` - 神秘人是否已触发（神秘人消失，无名氏出现）
- `wumingshiDefeated: boolean` - 无名氏是否已被击败

### 步骤6: 修改探险家交互逻辑
**文件**: `src/App.tsx`

修改 `payForExplore` actionType处理：
- 扣除50,000魔石
- 消耗15时间单位
- 显示骗局提示
- 传送到战魂封印迷宫（而不是原地）

### 步骤7: 实现神秘人交互逻辑
**文件**: `src/App.tsx`

添加 `triggerMysteriousPerson` actionType处理：
- 显示对话弹窗
- 设置 `mysteriousPersonDefeated = true`
- 神秘人NPC消失，无名氏敌人出现

### 步骤8: 实现无名氏战斗逻辑
**文件**: `src/App.tsx`

修改战斗结束处理：
- 检测是否为无名氏战斗
- 战斗失败：自动传送到卡萨诺城
- 战斗胜利：获得战魂之心，显示提示，设置 `wumingshiDefeated = true`

### 步骤9: 修改交互对象计算逻辑
**文件**: `src/App.tsx`

修改 `currentInteractables`：
- 战魂封印迷宫根据状态显示神秘人或无名氏
- 无名氏被击败后，两者都不再显示

### 步骤10: 添加战魂之心物品
**文件**: `src/data/inventoryData.ts`

确保战魂之心物品存在：
- id: '战魂之心'
- 功能：激活装备战魂属性
- 成功率：100%

## 文件修改清单

| 文件路径 | 修改类型 | 说明 |
|---------|---------|------|
| `src/data/gameData.ts` | 修改 | 新增战魂封印迷宫地点 |
| `src/data/npcData.ts` | 修改 | 新增神秘人NPC配置 |
| `src/data/monsterData.ts` | 修改 | 新增无名氏怪物模板 |
| `src/data/interactableData.ts` | 修改 | 新增无名氏交互对象 |
| `src/App.tsx` | 修改 | 添加状态、修改交互逻辑、修改战斗结束处理 |
| `src/data/inventoryData.ts` | 检查 | 确认战魂之心物品存在 |

## 注意事项
1. 无名氏属性根据玩家等级动态计算
2. 战斗失败后自动回到卡萨诺城
3. 战斗胜利后获得战魂之心
4. 无名氏被击败后不再出现
5. 神秘人触发后消失，无名氏出现
