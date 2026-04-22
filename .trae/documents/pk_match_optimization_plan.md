# PK赛报名官交互优化计划

## 一、需求分析

### 1.1 当前状态
- PK赛报名官NPC已存在于 `src/data/npcData.ts`
- NPC有"查看奖品"和"我来报名参加"选项
- "我来报名参加"选项的 `actionType` 是 `registerPK`，但该处理逻辑尚未实现
- 战斗系统已完善，可复用

### 1.2 需求目标
优化PK赛报名官交互，实现以下功能：
1. 点击PK赛报名官报名PK赛
2. 检查当天是否为星期六
3. 如果是星期六，根据玩家等级进入对应级别挑战战斗
4. 战斗敌人属性参考 `reference/docs/project_docs/11_PK赛系统.md`
5. 战斗胜利后获得对应奖励

---

## 二、PK赛系统规则（参考文档）

### 2.1 时间与地点
- **时间**：每周六开放
- **地点**：皇宫
- **NPC**：PK赛报名官

### 2.2 分组规则
| 分组 | 等级范围 | 场景 | BOSS |
|------|---------|------|------|
| 60级组 | ≤60级 | PK赛场1层 | 60级PK赛BOSS |
| 100级组 | 61-100级 | PK赛场2层 | 100级PK赛BOSS |
| 100级以上组 | >100级 | PK赛场3层 | 130级PK赛BOSS |

### 2.3 BOSS属性
| BOSS名称 | 等级 | 战斗力 | 生命值 | 攻击力 | 防御 |
|---------|------|--------|--------|--------|------|
| 60级PK赛BOSS | 60 | 201 | 120,000 | 6,750-10,080 | 5,760 |
| 100级PK赛BOSS | 100 | 284 | 200,000 | 11,250-16,800 | 9,600 |
| 130级PK赛BOSS | 130 | 374 | 260,000 | 14,625-21,840 | 12,480 |

**属性计算公式**：
- 生命值 = 0 + 2000 × 等级
- 小攻击 = 0 + 112.5 × 等级
- 大攻击 = 0 + 168 × 等级
- 防御 = 0 + 96 × 等级

### 2.4 冠军奖励
| 分组 | 魔石 | 经验 | 技能书 | 特殊物品 |
|------|------|------|--------|---------|
| 60级组 | 27,000 | 40,000 | 高级飞天连斩 | - |
| 100级组 | 56,000 | 150,000 | 高级飞天连斩 | 月光宝盒增强版 |
| 100级以上组 | 82,800 | 250,000 | 高级斗志抑扬 | 月光宝盒增强版、电浆药水、999朵白玫瑰 |

---

## 三、实现步骤

### 步骤1：创建PK赛BOSS怪物模板
**文件**：`src/data/monsterData.ts`

在 `monsterTemplates` 中添加三个PK赛BOSS：
```typescript
// 60级PK赛BOSS
'pk-boss-60': {
  id: 'pk-boss-60',
  name: '60级PK赛BOSS',
  type: 'special',
  level: 60,
  combatPower: 201,
  location: 'pk-arena-1',
  icon: '🏆',
  description: 'PK赛60级组冠军挑战BOSS，击败它获得冠军荣誉！',
  baseHp: 0,
  growthHp: 2000,
  baseAttackMin: 0,
  growthAttackMin: 112.5,
  baseAttackMax: 0,
  growthAttackMax: 168,
  baseDefense: 0,
  growthDefense: 96,
},
// 100级PK赛BOSS
'pk-boss-100': { ... },
// 130级PK赛BOSS
'pk-boss-130': { ... },
```

### 步骤2：创建PK赛配置数据
**文件**：`src/data/pkMatchData.ts`（新建）

创建PK赛配置数据文件，包含：
- PK赛分组配置
- PK赛奖励配置
- 获取PK赛分组的工具函数
- 获取PK赛奖励的工具函数

### 步骤3：实现registerPK actionType处理
**文件**：`src/App.tsx`

在 `handleNPCOptionSelect` 函数的 switch 语句中添加 `registerPK` case：

```typescript
case 'registerPK': {
  // 1. 检查是否为周六（nowday % 7 === 6）
  const isSaturday = timeSystem.nowday % 7 === 6;
  if (!isSaturday) {
    showInfoModalWithContent('报名失败', '比赛在星期六才进行，你到那时再来报名吧。');
    break;
  }

  // 2. 检查今日是否已参加（需要添加状态变量）
  if (hasParticipatedPKToday) {
    showInfoModalWithContent('报名失败', '今天的比赛已经结束了，下次再来吧。');
    break;
  }

  // 3. 根据等级确定分组
  const group = getPKMatchGroup(character.level);

  // 4. 创建对应BOSS的敌人数据
  const bossData = createPKBossEnemyData(group);

  // 5. 关闭NPC对话框，开始战斗
  setShowNPCModal(false);
  setBattleParams({
    enemyTemplateId: 'boss',
    enemyLevel: bossData.level,
    enemyCount: 1,
    enemiesData: [bossData],
  });
  setInBattle(true);

  // 6. 标记今日已参加
  setHasParticipatedPKToday(true);
  break;
}
```

### 步骤4：添加状态变量
**文件**：`src/App.tsx`

添加PK赛参与状态：
```typescript
const [hasParticipatedPKToday, setHasParticipatedPKToday] = useState(false);
```

### 步骤5：实现战斗胜利奖励发放
**文件**：`src/App.tsx`

在战斗结束处理逻辑中添加PK赛BOSS的特殊奖励处理：
- 检测敌人是否为PK赛BOSS
- 根据BOSS等级发放对应奖励
- 显示冠军祝贺消息

### 步骤6：每日重置逻辑
**文件**：`src/App.tsx`

在每日重置逻辑中添加PK赛状态重置：
```typescript
// 周六特殊处理：开启PK比赛
if (timeSystem.nowday % 7 === 6) {
  setHasParticipatedPKToday(false);
}
```

### 步骤7：更新存档系统
**文件**：`src/utils/saveUtils.ts`

将 `hasParticipatedPKToday` 添加到存档数据中。

---

## 四、文件修改清单

| 文件路径 | 修改内容 |
|---------|---------|
| `src/data/monsterData.ts` | 添加PK赛BOSS怪物模板 |
| `src/data/pkMatchData.ts` | 新建PK赛配置数据文件 |
| `src/App.tsx` | 添加registerPK处理逻辑、状态变量、奖励发放 |
| `src/utils/saveUtils.ts` | 添加PK赛状态到存档 |
| `src/types/index.ts` | 添加PK赛相关类型定义（如需要） |

---

## 五、测试要点

1. **周六判断测试**：非周六时报名应提示失败
2. **等级分组测试**：不同等级玩家应进入对应分组
3. **战斗测试**：BOSS属性是否符合文档规定
4. **奖励测试**：胜利后是否正确发放奖励
5. **每日重置测试**：周六时状态是否正确重置
6. **存档测试**：PK赛状态是否正确保存和恢复

---

## 六、注意事项

1. 复用现有战斗系统，不重复实现
2. 遵循项目代码规范，添加必要注释
3. 奖励物品使用 `itemFactory.ts` 中的 `createItemFromTemplate` 或 `cloneItem` 函数
4. 技能书使用 `ITEM_TEMPLATES` 中的模板
5. 优先保障手机端用户体验
