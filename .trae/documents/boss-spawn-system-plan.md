# BOSS 刷新系统实现计划

## 需求概述
参考 `/reference/docs/project_docs/04_怪物系统.md` 和 `/reference/docs/project_docs/06_地图系统.md`，实现每日 BOSS 刷新功能：
1. 每天开始时有概率在对应地图刷新 BOSS
2. 在交互日志区显示 BOSS 出现的消息
3. 进入游戏时的第一天也需要显示日志

## BOSS 刷新规则（参考文档）

### BOSS 与地图对应关系
| 地图 | BOSS等级 | 刷新概率 |
|------|----------|----------|
| 雷鸣大陆 | 10级BOSS | 55% |
| 戈壁 | 20级BOSS | 45% |
| 迷梦沼泽 | 30级BOSS | 33% |
| 冰宫 | 50级BOSS | 23% |
| 亚维特岛 | 70级BOSS | 33% |
| 火山 | 90级BOSS | 23% |
| 深渊迷宫 | 100级BOSS | 33% |

### BOSS 属性（参考文档）
| BOSS等级 | 战斗力 | 生命值范围 |
|----------|--------|------------|
| 10级BOSS | 10 | 1000-1200 |
| 20级BOSS | 30 | 1000-2200 |
| 30级BOSS | 45 | 1250-2750 |
| 50级BOSS | 75 | 1250-2750 |
| 70级BOSS | 105 | 1500-3300 |
| 90级BOSS | 135 | 1500-3300 |
| 100级BOSS | 150 | 2000-4400 |

## 实现步骤

### 步骤 1: 定义 BOSS 数据类型和模板
**文件**: `src/types/index.ts`
- 定义 `BossSpawnConfig` 接口（BOSS 刷新配置）
- 定义 `BossTemplate` 接口（BOSS 模板属性）

**文件**: `src/data/bossData.ts`（新建）
- 创建 BOSS 模板数据（7个等级的 BOSS）
- 创建 BOSS 刷新配置（地图与 BOSS 对应关系）
- 定义刷新概率

### 步骤 2: 创建 BOSS 工具函数
**文件**: `src/utils/bossUtils.ts`（新建）
- `rollBossSpawns()` - 根据概率随机决定哪些 BOSS 刷新
- `getBossByLocation()` - 获取指定地图的 BOSS
- `generateBossEnemyData()` - 生成 BOSS 敌人数据
- `getBossSpawnMessage()` - 生成 BOSS 出现消息

### 步骤 3: 扩展交互数据配置
**文件**: `src/data/interactableData.ts`
- 导入 BOSS 数据
- 创建 BOSS 交互对象生成函数
- 将 BOSS 交互对象添加到交互配置

### 步骤 4: 更新地图数据配置
**文件**: `src/data/gameData.ts`
- 为各地图添加 BOSS 交互 ID 占位

### 步骤 5: 修改 App.tsx 实现 BOSS 刷新逻辑
**文件**: `src/App.tsx`
- 添加 `spawnedBosses` 状态（已刷新的 BOSS ID 集合）
- 添加 `bossSpawnMessages` 状态（BOSS 刷新消息列表）
- 修改 `consumeTime` 函数，在新的一天调用 BOSS 刷新逻辑
- 添加初始化时的第一天 BOSS 刷新逻辑
- 在交互日志中显示 BOSS 出现消息

### 步骤 6: 更新怪物击杀逻辑
**文件**: `src/App.tsx`
- BOSS 击杀后从刷新列表移除
- 次日重新随机刷新

## 详细实现

### 1. BOSS 数据结构

```typescript
// src/types/index.ts

// BOSS 模板接口
export interface BossTemplate {
  id: string;                     // BOSS 模板 ID
  name: string;                   // BOSS 名称
  level: number;                  // BOSS 等级
  combatPower: number;            // 战斗力
  location: string;               // 所在地图 ID
  icon: string;                   // BOSS 图标
  description: string;            // BOSS 描述
  // 属性范围
  minHp: number;                  // 最小生命值
  maxHp: number;                  // 最大生命值
  baseAttackMin: number;          // 基础最小攻击
  baseAttackMax: number;          // 基础最大攻击
  baseDefense: number;            // 基础防御
  // 刷新概率
  spawnChance: number;            // 刷新概率（0-100）
}

// BOSS 刷新配置接口
export interface BossSpawnConfig {
  id: string;                     // 刷新配置 ID
  bossTemplateId: string;         // BOSS 模板 ID
  location: string;               // 所在地图 ID
  interactableId: string;         // 交互对象 ID
}
```

### 2. BOSS 刷新消息格式

```
"【BOSS出现】10级BOSS 出现在雷鸣大陆！"
"【BOSS出现】20级BOSS 出现在戈壁！"
...
```

### 3. 刷新时机

1. **游戏初始化时**：第一天开始时刷新 BOSS
2. **每日刷新**：`consumeTime` 函数检测到新的一天时刷新

### 4. 状态管理

```typescript
// 已刷新的 BOSS ID 集合
const [spawnedBosses, setSpawnedBosses] = useState<Set<string>>(new Set());

// BOSS 刷新消息（用于显示在交互日志）
const [bossSpawnMessages, setBossSpawnMessages] = useState<string[]>([]);
```

## 文件变更清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/types/index.ts` | 修改 | 添加 BossTemplate、BossSpawnConfig 类型 |
| `src/data/bossData.ts` | 新建 | BOSS 模板数据和刷新配置 |
| `src/utils/bossUtils.ts` | 新建 | BOSS 工具函数 |
| `src/data/interactableData.ts` | 修改 | 添加 BOSS 交互对象生成 |
| `src/data/gameData.ts` | 修改 | 更新各地图的 interactables 列表 |
| `src/App.tsx` | 修改 | 添加 BOSS 刷新状态和逻辑 |

## 验收标准

1. 进入游戏第一天，交互日志显示刷新的 BOSS 消息
2. 每天开始时，交互日志显示刷新的 BOSS 消息
3. BOSS 按照设定概率刷新
4. BOSS 出现在对应地图的交互按钮区
5. 击杀 BOSS 后从地图消失
6. 次日 BOSS 重新随机刷新
