# 修复无名氏怪物等级问题

## 问题描述

无名氏怪物的等级应该等于人物的等级，人物小于50级则无名氏等级50级，当前固定为了50级。

## 问题分析

### 当前实现

1. 无名氏怪物模板定义在 [monsterData.ts:428-447](file:///d:/life/code/moyu/src/data/monsterData.ts#L428-L447)

   * `level: 50` 是固定值

   * 注释说明"实际等级在战斗时动态计算"，但实际代码没有实现

2. 怪物交互配置在 [interactableData.ts:169-200](file:///d:/life/code/moyu/src/data/interactableData.ts#L169-L200) 的 `generateMonsterInteractables` 函数中生成

   * 使用 `calculateMonsterStats(template)` 计算属性

   * 直接使用模板中的 `level` 字段，没有动态计算

3. 在 [App.tsx:2890-2904](file:///d:/life/code/moyu/src/App.tsx#L2890-L2904) 中，无名氏敌人从静态配置 `interactableConfig['enemy_wumingshi']` 获取

   * 没有根据玩家等级动态调整

### 根本原因

无名氏敌人的等级在模块加载时就固定计算了，没有根据玩家等级动态调整的机制。

## 修复方案

### 方案：在 App.tsx 中动态生成无名氏敌人数据

修改 [App.tsx:2890-2904](file:///d:/life/code/moyu/src/App.tsx#L2890-L2904) 中无名氏敌人的生成逻辑：

1. 获取玩家当前等级
2. 计算无名氏等级：`max(玩家等级, 50)`
3. 根据计算后的等级动态生成无名氏敌人数据

### 具体修改

#### 1. 在 `interactableData.ts` 中添加生成无名氏敌人的函数

```typescript
/**
 * 生成无名氏敌人数据
 * 无名氏等级 = max(玩家等级, 50)
 * @param playerLevel 玩家等级
 * @returns 无名氏敌人交互对象
 */
export function generateWumingshiInteractable(playerLevel: number): EnemyInteractable {
  // 无名氏等级 = max(玩家等级, 50)
  const wumingshiLevel = Math.max(playerLevel, 50);
  
  // 获取无名氏模板
  const template = monsterTemplates['wumingshi'];
  if (!template) {
    console.error('无名氏模板不存在');
    throw new Error('无名氏模板不存在');
  }
  
  // 创建临时模板，使用计算后的等级
  const dynamicTemplate: MonsterTemplate = {
    ...template,
    level: wumingshiLevel,
    combatPower: 100 + wumingshiLevel, // 战斗力 = 100 + 等级
  };
  
  // 计算怪物属性
  const monsterStats = calculateMonsterStats(dynamicTemplate);
  
  // 生成战斗用的敌人列表
  const enemies: EnemyData[] = generateEnemiesForBattle(monsterStats, 'spawn-zhanhun-wumingshi');
  
  // 返回交互对象
  return {
    id: 'enemy_wumingshi',
    type: 'enemy',
    name: template.name,
    icon: template.icon,
    description: `${template.description}\n等级: ${wumingshiLevel} | 战斗力: ${dynamicTemplate.combatPower}`,
    enemies,
  };
}
```

#### 2. 修改 `App.tsx` 中无名氏敌人的生成逻辑

将静态获取改为动态生成：

```typescript
// 动态添加战魂封印迷宫的交互对象
// 根据状态显示神秘人或无名氏
if (currentLocation === 'zhanhun-fengyin-migong' && !wumingshiDefeated) {
  if (mysteriousPersonTriggered) {
    // 神秘人已触发，动态生成无名氏敌人（等级根据玩家等级计算）
    const wumingshi = generateWumingshiInteractable(character.level);
    dynamicInteractables.push(wumingshi);
  } else {
    // 神秘人未触发，显示神秘人NPC
    const mysteriousPerson = interactableConfig['npc_mysterious_person'];
    if (mysteriousPerson) {
      dynamicInteractables.push(mysteriousPerson as NPCInteractable);
    }
  }
}
```

## 修改文件清单

1. **src/data/interactableData.ts**

   * 添加 `generateWumingshiInteractable` 函数

   * 导出该函数供 App.tsx 使用

2. **src/App.tsx**

   * 导入 `generateWumingshiInteractable` 函数

   * 修改无名氏敌人的生成逻辑，使用动态生成替代静态配置

## 测试验证

1. 创建一个等级低于50的角色，验证无名氏等级是否为50
2. 创建一个等级高于50的角色（如100级），验证无名氏等级是否与角色等级相同
3. 验证无名氏的属性（HP、攻击、防御）是否正确按等级计算

