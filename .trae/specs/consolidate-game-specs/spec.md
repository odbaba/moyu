# 游戏首页规格文档

## 概述
游戏首页是玩家进入游戏后的主界面，采用手机端优先的100vh单屏布局，包含标题栏、局部地图、交互按钮区、交互日志区等核心模块。

## 页面布局

### 整体高度分配（100vh）
| 区域 | 高度 | 组件 |
|------|------|------|
| 顶部占位 | 10vh | 黑色背景 |
| 位置标题 | 5vh | LocationHeader |
| 场景描述 | 12vh | SceneDescription |
| 局部地图 | 26vh | LocalMap |
| 交互按钮区 | 15vh | InteractionButtons |
| 时间显示 | 5vh | TimeDisplay |
| 交互日志 | 27vh | InteractionLog |

### 全局样式规范
- 背景色：`#252935`
- 字体颜色：`#FCFFFF`
- 分割线：`1px solid #000000`
- 字体：`LXGW WenKai`（霞鹜文楷），桌面端回退到系统楷体
- 滚动条：场景描述、交互按钮区、交互日志区均隐藏滚动条

## 模块详细规格

### 1. 位置标题栏（LocationHeader）

**代码位置**：[LocationHeader.tsx](file:///d:/life/code/bak/moyu/src/components/home/LocationHeader.tsx)

**布局**：flex横向排列
- 左侧：角色按钮（`--char`样式）、背包按钮（`--inventory`样式）
- 中间：位置名称（h1标签）
- 右侧：幻兽按钮（`--pet`样式）

**Props接口**：
```typescript
interface LocationHeaderProps {
  location: string;
  onShowCharacter: () => void;
  onShowInventory: () => void;
  onShowPet: () => void;
}
```

### 2. 场景描述（SceneDescription）

**代码位置**：[SceneDescription.tsx](file:///d:/life/code/bak/moyu/src/components/home/SceneDescription.tsx)

**功能**：按`\n`换行符拆分描述文本，每行渲染为`<p>`元素，第二段加粗显示

**Props接口**：
```typescript
interface SceneDescriptionProps {
  description: string;
}
```

### 3. 局部地图（LocalMap）

**代码位置**：[LocalMap.tsx](file:///d:/life/code/bak/moyu/src/components/home/LocalMap.tsx)

**数据来源**：[gameData.ts](file:///d:/life/code/bak/moyu/src/data/gameData.ts)（locations、connections）

**核心功能**：
- 只渲染当前地点和相邻地点，其他地点隐藏
- 相邻地点与当前地点距离超过1个单位时，显示坐标限制在±1范围内
- 连接线使用HTML div实现（计算欧几里得距离和角度旋转）
- 当前地点高亮：蓝色边框`#2492D1`+发光效果
- 相邻地点灰色边框
- 视图偏移系统：`transform: translate()`使当前地点居中
- 移动动画：时长根据曼哈顿距离动态计算（`BASE_ANIMATION_DURATION × distance`）

**Props接口**：
```typescript
interface LocalMapProps {
  currentLocation: string;
  onMove: (location: string) => void;
  isAutoMoving?: boolean;
}
```

**寻路算法**：[pathfinding.ts](file:///d:/life/code/bak/moyu/src/utils/pathfinding.ts)

**大地图组件**：[WorldMap.tsx](file:///d:/life/code/bak/moyu/src/components/home/WorldMap.tsx)（点击目标地点自动寻路，移动间隔300-500ms）

### 4. 交互按钮区（InteractionButtons）

**代码位置**：[InteractionButtons.tsx](file:///d:/life/code/bak/moyu/src/components/home/InteractionButtons.tsx)

**数据来源**：[gameData.ts](file:///d:/life/code/bak/moyu/src/data/gameData.ts)（locations中的interactableIds）→ [interactableData.ts](file:///d:/life/code/bak/moyu/src/data/interactableData.ts)（interactableConfig）

**交互类型与样式**：
| 类型 | 样式类 | 文字颜色 |
|------|--------|----------|
| action | `--action` | #FCFFFF白色 |
| enemy | `--enemy` | #ff4444红色 |
| npc | `--npc` | #FCFFFF白色 |

**按钮样式**：纯黑背景`#000000`，`clip-path: polygon(...)`实现毛笔笔触不规则边框

**Props接口**：
```typescript
interface InteractionButtonsProps {
  interactables: Interactable[];
  onInteract: (interactable: Interactable) => void;
}
```

**新增交互按钮规则**：在`src/data/gameData.ts`的`locations`数据中添加interactableIds

### 5. 时间显示（TimeDisplay）

**代码位置**：[TimeDisplay.tsx](file:///d:/life/code/bak/moyu/src/components/home/TimeDisplay.tsx)

**时间系统规则**：
- 一天总时间单位：15
- 挖矿消耗：1时间单位
- 战斗消耗：3时间单位
- 星期计算：`nowday % 7`（0=周日，1=周一，...，6=周六）

**显示内容**：
- 上方：`第X天`（金色#ffd700）+ 保存游戏按钮 + 星期
- 下方：时间进度条（已消耗灰色`#555555`，剩余深绿色`#2d5a27`）

**Props接口**：
```typescript
interface TimeDisplayProps {
  nowday: number;
  nowtime: number;
  onedaytime: number;
  onSaveGame: () => void;
}
```

### 6. 交互日志区（InteractionLog）

**代码位置**：[InteractionLog.tsx](file:///d:/life/code/bak/moyu/src/components/home/InteractionLog.tsx)

**功能**：遍历logs数组渲染日志条目，自动滚动到底部

**Props接口**：
```typescript
interface InteractionLogProps {
  logs: string[];
}
```

### 7. 菜单（Menu）

**代码位置**：[Menu.tsx](file:///d:/life/code/bak/moyu/src/components/home/Menu.tsx)

**位置**：固定定位右下角，圆形黑色按钮（`☰`图标）

**功能入口**：角色信息、幻兽、背包、技能、大地图、保存游戏、设置、帮助

**Props接口**：
```typescript
interface MenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onShowMap: () => void;
  onShowCharacter: () => void;
  onShowInventory: () => void;
  onShowSkill: () => void;
  onShowPet: () => void;
  onSaveGame: () => void;
  onShowSettings: () => void;
  onShowHelp: () => void;
}
```

## 交互系统架构

**交互类型**：三种（Action / Enemy / NPC），对应三个专用弹窗

| 交互类型 | 弹窗组件 | 代码位置 |
|----------|----------|----------|
| Action | ActionModal | [ActionModal.tsx](file:///d:/life/code/bak/moyu/src/components/common/ActionModal.tsx) |
| Enemy | EnemyModal | [EnemyModal.tsx](file:///d:/life/code/bak/moyu/src/components/common/EnemyModal.tsx) |
| NPC | NPCModal | [NPCModal.tsx](file:///d:/life/code/bak/moyu/src/components/common/NPCModal.tsx) |

**交互配置数据**：[interactableData.ts](file:///d:/life/code/bak/moyu/src/data/interactableData.ts)
**交互模板数据**：[interactionTemplates.ts](file:///d:/life/code/bak/moyu/src/data/templates/interactionTemplates.ts)

## 封面页与新手引导

### 封面页
- "开始游戏"：清除存档，全新初始状态
- "继续游戏"：从localStorage读取存档恢复状态（仅在有存档时可用）
- 通过`showCover`状态控制封面与游戏主界面切换

### 新手引导
- 组件：[GuideOverlay.tsx](file:///d:/life/code/bak/moyu/src/components/common/GuideOverlay.tsx)
- 26步引导流程，首次点击"开始游戏"触发
- CSS clip-path镂空高亮效果，#2295D6边框

## 开发者模式
- 配置字段：`isDeveloperMode`
- 开启时：示例物品、大量金币(12,568,000,000)/魔石(100,000,000)、正常经验、快速挖矿(15时间单位)
- 关闭时：初始1级装备、少量金币(100,000)/魔石(280)、非战斗经验降为1/100、挖矿1时间单位

## 相关代码文件索引

| 文件 | 说明 |
|------|------|
| [App.tsx](file:///d:/life/code/bak/moyu/src/App.tsx) | 应用主组件，全局状态管理 |
| [home.css](file:///d:/life/code/bak/moyu/src/components/home/home.css) | 首页样式 |
| [index.ts](file:///d:/life/code/bak/moyu/src/components/home/index.ts) | 模块导出 |
| [SoldierModal.tsx](file:///d:/life/code/bak/moyu/src/components/home/SoldierModal.tsx) | 士兵弹窗 |
| [FloatingText.tsx](file:///d:/life/code/bak/moyu/src/components/common/FloatingText.tsx) | 浮动文字组件 |
| [FloatingTextManager.tsx](file:///d:/life/code/bak/moyu/src/components/common/FloatingTextManager.tsx) | 浮动文字管理器 |
| [constants.ts](file:///d:/life/code/bak/moyu/src/components/common/constants.ts) | 公共常量 |
| [utils.ts](file:///d:/life/code/bak/moyu/src/components/common/utils.ts) | 公共工具函数 |

---

# 装备模块规格文档

## 概述
装备模块包含装备属性系统、装备精炼（品质提升/魔魂提升/使用等级提升/开洞/镶嵌/战魂激活）、装备展示与交互、战魂套装系统。

## 装备类型与槽位

### 六种装备槽位
| 槽位 | 类型键名 | 属性类型 | 基础属性系数 |
|------|----------|----------|-------------|
| 武器 | weapon | 攻击型 | 攻击 20×等级 ~ 30×等级 |
| 头盔 | helmet | 防御型 | 防御 12×等级 |
| 衣服 | clothes | 防御型 | 防御 18×等级 |
| 战鞋 | shoes | 防御型 | 防御 8×等级 |
| 手镯 | bracelet | 攻击型 | 攻击 10×等级 ~ 15×等级 |
| 项链 | necklace | 攻击型 | 攻击 15×等级 ~ 20×等级 |

**代码位置**：[attributeCalculator.ts](file:///d:/life/code/bak/moyu/src/utils/attributeCalculator.ts)（`EQUIPMENT_BASE_COEFFICIENTS`）

## 装备属性计算

### 基础属性
**核心函数**：`calculateEquipmentBaseAttributes`
- 公式：系数 × 使用等级

### 追加属性（魔魂加成）
**核心函数**：`calculateEquipmentBonusAttributes`
- 公式：`Math.floor(基础属性 / 10) × 魔魂等级`

### 装备总属性
**核心函数**：`calculateTotalEquipmentAttributes`
- 总属性 = 基础属性 + 追加属性

### 装备显示名称规则
**核心函数**：`getEquipmentDisplayName`（[equipmentConverter.ts](file:///d:/life/code/bak/moyu/src/utils/equipmentConverter.ts)）
- 格式：`${品质 === '普通品' ? '' : 品质}${名称}+${魔魂等级}`

## 装备品质系统

| 品质 | 数值(pz) | 战斗力加成 | 颜色 |
|------|----------|-----------|------|
| 普通品 | 0 | +0 | #FCFFFF白色 |
| 良品 | 1 | +1 | #00ff00绿色 |
| 上品 | 2 | +2 | #0000ff蓝色 |
| 精品 | 3 | +3 | #ff0000红色 |
| 极品 | 4 | +4 | #cc00ff紫色 |

**代码位置**：[equipmentRefine.ts](file:///d:/life/code/bak/moyu/src/utils/equipmentRefine.ts)（`QUALITY_LEVELS`、`QUALITY_NAMES`、`QUALITY_COMBAT_POWER`）

## 装备精炼系统

**代码位置**：[equipmentRefine.ts](file:///d:/life/code/bak/moyu/src/utils/equipmentRefine.ts)
**UI组件**：[EquipmentRefineModal.tsx](file:///d:/life/code/bak/moyu/src/components/common/EquipmentRefineModal.tsx)

### 1. 品质提升

| 道具 | 成功率 | 说明 |
|------|--------|------|
| 灵魂王 | 100% | 直接提升 |
| 灵魂晶石 | 递减 | 白品→良品100%/良品→上品50%/上品→精品25%/精品→极品25% |

- 升极品时战魂逻辑：已有战魂且等级<5则+1；无战魂则2.5%概率激活

### 2. 魔魂提升

| 道具 | 成功率 | 上限 |
|------|--------|------|
| 魔魂之心 | 100% | +9 |
| 魔魂晶石 | +0~+5: 90% / +6~+8: 50% / +9+: 50% | +12 |

- 失败惩罚：+9失败不降级，其他等级失败降1级
- 魔魂升到+12时，已有战魂则战魂等级+1

### 3. 使用等级提升

| 道具 | 成功率 | 说明 |
|------|--------|------|
| 幻魔之心 | 100% | 直接提升 |
| 幻魔晶石 | 1~10级50%/10~80级30%/80~125级20% | 上限125级 |

- 等级跳跃规则：1级→10级，10~90级→+10级，100级→125级
- 升级后不能超过玩家等级

### 4. 开洞

| 道具 | 功能 | 战魂概率 |
|------|------|----------|
| 月光宝盒 | 给无洞装备开第1个洞 | 3%激活战魂 |
| 月光宝盒增强版 | 给1洞装备开第2个洞 | 10%激活战魂 |

- 最多2个洞

### 5. 镶嵌宝石

| 宝石 | 效果 | 战魂效果 |
|------|------|----------|
| 中级战斗力石 | 战斗力+3 | 无 |
| 高级战斗力石 | 战斗力+5 | 已有战魂时等级+1 |
| 中级经验石 | 经验+25% | 无 |
| 高级经验石 | 经验+50% | 已有战魂时等级+1 |

- 摘除宝石：摘除后若装备有战魂且等级>1，战魂等级降为1

### 6. 战魂激活

| 道具 | 成功率 | 效果 |
|------|--------|------|
| 战魂之心 | 100% | 激活/切换战魂类型（天魂↔地魂），等级设为1 |
| 战魂晶石 | 20% | 随机天魂或地魂，等级设为1 |

### 战魂系统开启条件
- 击败无名氏BOSS后开启
- 开启前：装备打造师不显示"关于战魂"选项、怪物不掉落战魂物品
- 开启后：无名氏100%掉落战魂之心，特定怪物25%-50%概率掉落

**代码位置**：[bossUtils.ts](file:///d:/life/code/bak/moyu/src/utils/bossUtils.ts)、[warSoulDropUtils.ts](file:///d:/life/code/bak/moyu/src/utils/warSoulDropUtils.ts)

## 战魂套装系统

### 套装检测
**代码位置**：[CharacterInfo.tsx](file:///d:/life/code/bak/moyu/src/components/character/CharacterInfo.tsx)（`detectActiveSets`）、[combatPower.ts](file:///d:/life/code/bak/moyu/src/utils/combatPower.ts)（`checkWarSoulSet`）

| 套装 | 条件 | 效果 | 最大值 |
|------|------|------|--------|
| 天魂套装 | 6件都是天魂(setType=1) | 降低怪物战斗力（等级×2%） | 10% |
| 地魂套装 | 6件都是地魂(setType=2) | 降低怪物生命值（等级×5%） | 25% |
| 战魂套装 | 6件都有战魂 | 提高角色战斗力（最低等级×5%） | 无上限 |

### 套装图标显示规则
- 6件都有战魂：显示战魂套装图标（紫色/金色）
- 6件都是天魂：显示天魂套装图标（蓝色）
- 6件都是地魂：显示地魂套装图标（黑色/深色）
- 多套装可同时显示

### 战魂属性加成
**代码位置**：[equipmentConverter.ts](file:///d:/life/code/bak/moyu/src/utils/equipmentConverter.ts)（`calculateSoulBonus`）
- 天魂：攻击力 + 战魂等级 × 5%
- 地魂：闪避率 + 战魂等级 × 2%

## 装备类型转换

**代码位置**：[equipmentConverter.ts](file:///d:/life/code/bak/moyu/src/utils/equipmentConverter.ts)

| 函数 | 说明 |
|------|------|
| `equipmentItemToDetail` | EquipmentItem → EquipmentDetail，动态计算基础/追加属性 |
| `equipmentDetailToItem` | EquipmentDetail → EquipmentItem，保留宝石/战魂/图片信息 |
| `calculateEquipmentCombatPower` | 单件装备总战斗力 = 品质 + 洞数 + 战魂 + 宝石 |

**注意**：单件装备魔魂等级无战斗力加成，只有全套六件装备都有魔魂才有套装加成

## 装备展示与交互

### 装备展示组件
**代码位置**：[EquipmentDisplay.tsx](file:///d:/life/code/bak/moyu/src/components/character/EquipmentDisplay.tsx)
- 2行3列展示6个装备槽位
- 已装备：显示图片（优先）或emoji图标、品质颜色名称、等级
- 空栏位：显示槽位中文名称、"空"文字、"点击装备"提示
- 点击空栏位打开装备选择弹窗

### 装备详情弹窗
**代码位置**：[EquipmentDetailModal.tsx](file:///d:/life/code/bak/moyu/src/components/common/EquipmentDetailModal.tsx)
- 统一弹窗：整合角色面板和背包两种来源
- 攻击型显示攻击力，防御型显示防御力
- 操作按钮：已装备状态显示"卸下装备"和"替换"；背包状态显示"装备"（等级不足时禁用）

### 装备选择弹窗
**代码位置**：[EquipmentSelectModal.tsx](file:///d:/life/code/bak/moyu/src/components/character/EquipmentSelectModal.tsx)
- 根据槽位类型过滤背包装备
- 复用ItemGrid组件展示

## 装备数据类型

**代码位置**：[types/index.ts](file:///d:/life/code/bak/moyu/src/types/index.ts)
- `EquipmentDetail`（L74-L100）：装备详情类型
- `EquipmentItem`（L231-L248）：装备物品类型
- `GemItem`（L272-L281）：宝石类型
- `RefineResult`（L287-L293）：精炼结果类型
- `WarSoulType`（L1211-L1218）：战魂类型

## 相关代码文件索引

| 文件 | 说明 |
|------|------|
| [equipmentRefine.ts](file:///d:/life/code/bak/moyu/src/utils/equipmentRefine.ts) | 精炼核心逻辑 |
| [equipmentConverter.ts](file:///d:/life/code/bak/moyu/src/utils/equipmentConverter.ts) | 类型转换+战斗力计算 |
| [equipmentUtils.ts](file:///d:/life/code/bak/moyu/src/utils/equipmentUtils.ts) | 装备检查工具 |
| [attributeCalculator.ts](file:///d:/life/code/bak/moyu/src/utils/attributeCalculator.ts) | 装备属性计算 |
| [gemSynthesisUtils.ts](file:///d:/life/code/bak/moyu/src/utils/gemSynthesisUtils.ts) | 宝石合成 |
| [warSoulDropUtils.ts](file:///d:/life/code/bak/moyu/src/utils/warSoulDropUtils.ts) | 战魂掉落 |
| [EquipmentRefineModal.tsx](file:///d:/life/code/bak/moyu/src/components/common/EquipmentRefineModal.tsx) | 精炼弹窗UI |
| [EquipmentDetailModal.tsx](file:///d:/life/code/bak/moyu/src/components/common/EquipmentDetailModal.tsx) | 装备详情弹窗 |
| [EquipmentDisplay.tsx](file:///d:/life/code/bak/moyu/src/components/character/EquipmentDisplay.tsx) | 装备展示组件 |
| [EquipmentSelectModal.tsx](file:///d:/life/code/bak/moyu/src/components/character/EquipmentSelectModal.tsx) | 装备选择弹窗 |
| [equipmentNames.ts](file:///d:/life/code/bak/moyu/src/data/equipmentNames.ts) | 装备名称和基础属性 |
| [equipmentImages.ts](file:///d:/life/code/bak/moyu/src/data/equipmentImages.ts) | 装备图片路径映射 |
| [inventoryData.ts](file:///d:/life/code/bak/moyu/src/data/inventoryData.ts) | 装备创建函数 |

---

# 幻兽模块规格文档

## 概述
幻兽模块包含幻兽生成、评分系统、幻化系统、幻兽研究所、出战系统等核心功能。幻兽是角色战斗力的重要组成部分。

## 幻兽类型

| 类型 | 基础评分 | 说明 |
|------|----------|------|
| 攻防型 | 0 | 初始幻兽，均衡型 |
| 调皮猫 | 280 | 攻击偏向型 |
| 吉鲁猪 | 380 | 高攻击型 |
| 奇异兽 | 450 | 特殊型，可幻化给任何类型 |
| 圣天使 | 280 | 生命偏向型 |
| 守护 | 550 | 高评分型 |
| 年猪 | 380 | 特殊型，固定初始属性 |

**代码位置**：[petGenerator.ts](file:///d:/life/code/bak/moyu/src/utils/petGenerator.ts)（`petTypeBaseScore`）

**奇异兽星级加成**：8星+350、12星+750、19星+1450

## 评分系统

### 评分公式
**代码位置**：[petGenerator.ts](file:///d:/life/code/bak/moyu/src/utils/petGenerator.ts)

**初始属性评分** = `(属性值 - 标准值) × 2`
- 标准值：生命100、最小攻击15、最大攻击25、防御10

**成长属性评分**：
- 差值 ≤ 10：`差值 × 20`
- 差值 > 10：`(差值 - 10) × 100 + 200`
- 标准值：生命40、最小攻击10、最大攻击15、防御5

**总评分** = 基础评分(petTypeBaseScore) + 初始属性评分 + 成长属性评分

### 品质称号系统

| 称号 | 评分范围 | 颜色 |
|------|----------|------|
| 极品X星 | ≥ 100 | 紫色 |
| 万众瞩目 | ≥ 75 | 红色 |
| 千载难逢 | ≥ 50 | 蓝色 |
| 百里挑一 | ≥ 25 | 绿色 |
| 优秀 | ≥ 10 | 蓝色 |
| 普通 | < 10 | 白色 |

**核心函数**：`getQualityTitle(score)`

## 属性计算

### 升级属性公式
- 最大生命 = 生命成长率 × (等级-1) + 初始生命
- 最小攻击 = 最小攻击成长率 × (等级-1) + 初始最小攻击
- 最大攻击 = 最大攻击成长率 × (等级-1) + 初始最大攻击
- 防御 = 防御成长率 × (等级-1) + 初始防御

### 属性生成规则
- 年猪：固定初始属性（攻击88、防御88、生命188），成长率随机
- 其他类型：初始属性和成长率均随机，12.5%概率触发8种大加成之一

**核心函数**：`calculateMaxHp`、`calculateMinAttack`、`calculateMaxAttack`、`calculateDefense`

## 升级与经验系统

### 升级经验公式
**核心函数**：`gainExperience`

- 等级1-19：`mjy = mjy × 1.2`
- 等级20-50：`mjy = mjy × 1.1`
- 等级51-129：`mjy = mjy + hun`
- 50级时计算hun值 = mjy的20%，触发顿悟机制
- 幻兽获得双倍经验
- 等级上限：130级
- 等级限制：不超过玩家等级+10

### 升级函数
**核心函数**：`upgradePetLevel(pet, newLevel)`

## 幻化系统

**代码位置**：[petFusion.ts](file:///d:/life/code/bak/moyu/src/utils/petFusion.ts)
**UI组件**：[PetFusionModal.tsx](file:///d:/life/code/bak/moyu/src/components/pet/PetFusionModal.tsx)

### 幻化条件
**核心函数**：`checkFusionConditions(mainPet, subPet, skipLevelCheck?)`
- 主幻兽等级 ≥ 50
- 副幻兽类型相同或为奇异兽
- 副幻兽评分达标（主幻兽评分<1500时无要求；≥1500时要求=(主幻兽评分-500)/2）
- 不能相同幻兽

### 幻化系数
**核心函数**：`calculateFusionRatio(mainPet, subPet)`
- `min(副幻兽品质 / max(主幻兽主属性评分, 20), 2)`，范围0-2

### 主属性幻化
**核心函数**：`applyMainAttributeFusion(mainPet, subPet, ratio)`

| 类型 | 最小攻击成长 | 最大攻击成长 | 防御成长 | 生命成长 |
|------|------------|------------|---------|---------|
| 攻防型 | ratio×1.0 | ratio×1.2 | ratio×0.8 | - |
| 调皮猫 | ratio×0.8 | ratio×1.4 | ratio×0.7 | - |
| 吉鲁猪 | ratio×1.2 | ratio×1.6 | - | - |
| 奇异兽 | ratio×1.3 | ratio×1.3 | - | - |
| 圣天使 | ratio×0.5 | ratio×0.8 | - | ratio×1.8 |
| 守护 | ratio×1.4 | ratio×1.6 | - | - |
| 年猪 | ratio×1.1 | ratio×1.2 | ratio×1.0 | ratio×1.5 |

### 副属性幻化
**核心函数**：`applySubAttributeFusion(mainPet, subPet)`
- 继承值 = `(副幻兽属性 - 主幻兽属性) × 0.9`（仅当副幻兽属性更高时）
- 攻防型/调皮猫：副属性为生命成长
- 吉鲁猪/奇异兽/守护：副属性为防御成长+生命成长
- 圣天使：副属性为防御成长
- 年猪：无副属性

### 初始属性幻化
**核心函数**：`applyInitialAttributeFusion(mainPet, subPet)`
- 继承值 = `(副幻兽属性 - 主幻兽属性) × 0.85`（仅当副幻兽属性更高时）
- 年猪不进行初始属性幻化

### 幻化后效果
- 等级重置为1
- 经验清零
- 转世次数+1
- 重新计算评分

### 自动幻化设置
**代码位置**：[PetFusionModal.tsx](file:///d:/life/code/bak/moyu/src/components/pet/PetFusionModal.tsx)
- 自动放入副幻兽：优先选评分最低的奇异兽，其次选评分最低的同类型幻兽
- 自动使用经验球：主幻兽<50级时消耗1个满经验球（给予27000经验，幻兽双倍54000）
- 自动幻化：需玩家等级≥40，满足条件自动执行

## 幻兽研究所

**代码位置**：[petInstituteUtils.ts](file:///d:/life/code/bak/moyu/src/utils/petInstituteUtils.ts)
**UI组件**：[PetInstituteModal.tsx](file:///d:/life/code/bak/moyu/src/components/pet/PetInstituteModal.tsx)

### 核心参数
| 参数 | 值 |
|------|-----|
| 初始技术等级 | 10 |
| 技术等级上限 | 150 |
| 最大生产量 | 8 |
| 购买条件 | 技术等级≥20、库存>0、魔石足够 |

### 品质分公式
`品质分 = Math.round(techLevel × 100 × 3 / 4)`

### 购买价格
- 基础价格 = `Math.round(200 × (品质分/100 - 10))`
- VIP价格 = `Math.round((1 - vipLevel/10) × 基础价格)`
- VIP等级0无折扣，10免费

### 资助
- 每100魔石提升0.01级技术等级
- 最低资助100魔石

### 重置机制
- 每日重置：库存 += 生产量
- 周日重置：技术等级提升10%（至少+1），开启提高产量任务

### 提高产量任务
- 消耗灵魂王：生产量1-7分别消耗1-7个
- 经验奖励基础值：105000~735000（按生产量递增）

## 出战系统

### 出战栏
- 2个出战槽位（Pet | null）[]
- 支持召回、合体、解体操作

### 合体战斗逻辑
- 合体幻兽在战斗九宫格左下角(0,2)和右下角(2,2)显示
- 金色发光边框+"合体"标签
- 敌方优先攻击合体幻兽，阵亡后才攻击玩家
- 怪物始终攻击主角（不直接攻击幻兽），使用主角最终面板防御
- 伤害优先从幻兽血条扣除
- 幻兽血量清零后溢出伤害不再扣除主角血量

### 幻兽阵亡机制
- 幻兽本身没有幸运值，使用人物的幸运值
- 幻兽阵亡时降低人物幸运值10点
- "爱的力量"技能：幻兽阵亡时20%概率触发，幸运值+10，幻兽满血复活
- 人物幸运值为0时自动退出战斗

## 幻兽生成函数

**代码位置**：[petGenerator.ts](file:///d:/life/code/bak/moyu/src/utils/petGenerator.ts)

| 函数 | 说明 |
|------|------|
| `generatePetByType(petType, options?)` | 通用幻兽生成（核心入口） |
| `generateStarStrangePet(starLevel, options?)` | 生成指定星级奇异兽（8/12/19星） |
| `generateStrangePet(qualityScore, options?)` | 幻兽研究所购买奇异兽 |
| `generateInitialPet(id, othername, isDeployed, isMerged)` | 生成初始攻防型幻兽 |

**项目规则**：生成幻兽使用`generatePetByType`，生成奇异兽使用`generateStrangePet`，生成特殊奇异兽（8星、12星、19星）使用`generateStarStrangePet`

## UI组件

| 组件 | 代码位置 | 说明 |
|------|----------|------|
| PetPage | [PetPage.tsx](file:///d:/life/code/bak/moyu/src/components/pet/PetPage.tsx) | 幻兽管理主页面 |
| PetFusionModal | [PetFusionModal.tsx](file:///d:/life/code/bak/moyu/src/components/pet/PetFusionModal.tsx) | 幻化操作页面 |
| PetDetailModal | [PetDetailModal.tsx](file:///d:/life/code/bak/moyu/src/components/pet/PetDetailModal.tsx) | 幻兽详情弹窗 |
| DeployedPetSlot | [DeployedPetSlot.tsx](file:///d:/life/code/bak/moyu/src/components/pet/DeployedPetSlot.tsx) | 出战幻兽槽位 |
| PetSelectModal | [PetSelectModal.tsx](file:///d:/life/code/bak/moyu/src/components/pet/PetSelectModal.tsx) | 幻兽选择弹窗 |
| FusionSettingsPanel | [FusionSettingsPanel.tsx](file:///d:/life/code/bak/moyu/src/components/pet/FusionSettingsPanel.tsx) | 融合设置面板 |
| FusionResultModal | [FusionResultModal.tsx](file:///d:/life/code/bak/moyu/src/components/pet/FusionResultModal.tsx) | 融合结果弹窗 |
| FusionHelpModal | [FusionHelpModal.tsx](file:///d:/life/code/bak/moyu/src/components/pet/FusionHelpModal.tsx) | 融合帮助弹窗 |
| PetInstituteModal | [PetInstituteModal.tsx](file:///d:/life/code/bak/moyu/src/components/pet/PetInstituteModal.tsx) | 幻兽研究所界面 |

## 幻兽数据类型

**代码位置**：[types/index.ts](file:///d:/life/code/bak/moyu/src/types/index.ts)
- `Pet`（L567-L601）：幻兽主类型
- `PetRating`（L551-L561）：评分类型
- `PetType`（L545）：幻兽类型枚举
- `PetInstituteState`（L607-L614）：研究所状态

**初始数据**：[petData.ts](file:///d:/life/code/bak/moyu/src/data/petData.ts)

## 相关代码文件索引

| 文件 | 说明 |
|------|------|
| [petGenerator.ts](file:///d:/life/code/bak/moyu/src/utils/petGenerator.ts) | 幻兽生成+评分+升级核心 |
| [petFusion.ts](file:///d:/life/code/bak/moyu/src/utils/petFusion.ts) | 幻化系统核心 |
| [petInstituteUtils.ts](file:///d:/life/code/bak/moyu/src/utils/petInstituteUtils.ts) | 研究所逻辑 |
| [petData.ts](file:///d:/life/code/bak/moyu/src/data/petData.ts) | 幻兽初始数据 |
| [pet.css](file:///d:/life/code/bak/moyu/src/components/pet/pet.css) | 幻兽模块样式 |
| [PetInstituteModal.css](file:///d:/life/code/bak/moyu/src/components/pet/PetInstituteModal.css) | 研究所样式 |

---

# 怪物模块规格文档

## 概述
怪物模块包含普通怪物、BOSS、特殊怪物、地下城怪物的模板数据、属性计算、刷新机制和战斗敌人生成。采用模板-实例模式，运行时通过工具函数计算实际属性。

## 怪物类型

| 类型 | 说明 | 敌人数量 |
|------|------|----------|
| normal | 普通怪物 | 根据等级1-6只 |
| special | 特殊怪物（有刷新概率） | 固定1只 |
| boss | BOSS | 固定1只 |
| dungeon | 地下城怪物 | 固定1只 |

## 怪物分布

### 普通怪物
**代码位置**：[monsterData.ts](file:///d:/life/code/bak/moyu/src/data/monsterData.ts)

| 地图 | 怪物 | 等级范围 |
|------|------|----------|
| 雷鸣大陆 | 龙怪、巨杰士 | 1-5 |
| 戈壁 | 冰妖剑士、杰克灯笼、提风 | 10-25 |
| 迷梦沼泽 | 角蜥、望齿魔人、蜘蛛(23%) | 35-45 |
| 冰宫 | 塔亚龙、死亡骑士 | 55-65 |
| 亚维特岛 | 鱼妖、恐兽、巨斧怪、刺虫人、蜘蛛王后艾达(33%) | 70-85 |
| 火山 | 四牙怪、炎女、蝎怪 | 90-100 |
| 深渊迷宫 | 暗黑弥塞亚、暗黑格拉斯、叹息骑士、骑士亡魂 | 110-130 |

### 特殊怪物
| 地图 | 怪物 | 等级 | 刷新概率 | 特殊奖励 |
|------|------|------|----------|----------|
| 雪域边境 | 冰雪巨人士兵 | 200 | 固定 | 500战功 |
| 雪域边境 | 冰雪巨人士官 | 300 | 固定 | 2000战功 |
| 雪域边境 | 冰雪巨人军官 | 500 | 固定 | 5000战功 |
| 战魂封印迷宫 | 无名氏 | max(玩家,50) | 固定 | 战魂之心100% |

### 地下城怪物
| 层级 | 怪物 | 等级 |
|------|------|------|
| 地下城1层 | 蝎怪 | 动态等级 |
| 地下城2层 | 骑士亡魂 | 150 |
| 地下城3层 | 呖风火龙兽 | 800 |

- 层间移动需清除当前层所有怪物
- 传送逻辑：未救国王传送到1层，已救国王传送到3层

### 魔中军阵地怪物（国王救出后解锁）
| 怪物 | 等级 |
|------|------|
| 魔军突击队 | 700 |
| 守卫军 | 800 |
| 神秘部队 | 900 |
| 图腾兽 | 1000 |
| 魔的能量 | - |
| 魔军主帅 | 2000 |

### PK赛BOSS
| 分组 | 等级 |
|------|------|
| 低级组 | 60 |
| 中级组 | 100 |
| 高级组 | 130 |

## 属性计算公式

### 普通怪物
**核心函数**：`calculateMonsterStats(template)` — [monsterUtils.ts](file:///d:/life/code/bak/moyu/src/utils/monsterUtils.ts)

```
属性值 = base属性 + growth属性 × 等级
```

- maxHp = baseHp + growthHp × level
- attackMin = baseAttackMin + growthAttackMin × level
- attackMax = baseAttackMax + growthAttackMax × level
- defense = baseDefense + growthDefense × level

### BOSS
**核心函数**：`generateBossEnemyData(bossTemplate, spawnId)` — [bossUtils.ts](file:///d:/life/code/bak/moyu/src/utils/bossUtils.ts)

```
生命值 = random(minGrowthHp, maxGrowthHp) × 等级
最小攻击 = baseAttackMin + growthAttackMin × 等级
最大攻击 = baseAttackMax + growthAttackMax × 等级
防御 = baseDefense + growthDefense × 等级
```

## 敌人数量规则

**核心函数**：`getEnemyCount(monsterLevel, monsterType)` — [monsterUtils.ts](file:///d:/life/code/bak/moyu/src/utils/monsterUtils.ts)

| 怪物等级 | 数量 |
|----------|------|
| ≤ 25 | 1-3只 |
| 26-65 | 2-4只 |
| 66-100 | 3-5只 |
| > 100 | 4-6只 |
| 特殊/BOSS/地下城 | 固定1只 |

## 战斗敌人生成

**核心函数**：`generateEnemiesForBattle(monster, spawnId?)` — [monsterUtils.ts](file:///d:/life/code/bak/moyu/src/utils/monsterUtils.ts)

- 每个敌人属性有±10%随机变化：`variationFactor = 0.9 + Math.random() × 0.2`
- 多只敌人时添加编号
- 攻击力保留最小/最大范围

## BOSS刷新系统

**代码位置**：[bossData.ts](file:///d:/life/code/bak/moyu/src/data/bossData.ts)、[bossUtils.ts](file:///d:/life/code/bak/moyu/src/utils/bossUtils.ts)

### BOSS列表
| BOSS ID | 等级 | 位置 | 战斗力 | 刷新概率 |
|---------|------|------|--------|----------|
| boss-10 | 10 | 雷鸣大陆 | 10 | 55% |
| boss-20 | 20 | 戈壁 | 30 | 45% |
| boss-30 | 30 | 迷梦沼泽 | 45 | 33% |
| boss-50 | 50 | 冰宫 | 75 | 23% |
| boss-70 | 70 | 亚维特岛 | 105 | 33% |
| boss-90 | 90 | 火山 | 135 | 23% |
| boss-100 | 100 | 深渊迷宫 | 150 | 33% |

### 刷新机制
**核心函数**：`rollBossSpawns()`、`rollSpecialMonsterSpawns()`

- 每日刷新：`rollSpawn(spawnChance)` 生成0-99随机数，小于刷新概率则刷新
- 击杀后次日重新随机刷新
- 保存游戏后BOSS信息不重新刷新（已修复useEffect时序问题）

### 战魂掉落
- 无名氏100%掉落战魂之心
- 魔军主帅/冰雪巨人军官100%掉落战魂之心
- 其他怪物25%-50%概率掉落战魂之心或战魂晶石（战魂系统开启后）

**代码位置**：[warSoulDropUtils.ts](file:///d:/life/code/bak/moyu/src/utils/warSoulDropUtils.ts)

## 战斗系统

### 战斗计算
**代码位置**：[battleCalculator.ts](file:///d:/life/code/bak/moyu/src/utils/battleCalculator.ts)

- 战斗力差距修正：攻>防每点+5%伤害（最高+100%），防>攻每点-1%（最高-50%）
- 闪避系统
- 伤害公式：`baseDamage × skillMultiplier × combatPowerModifier - defense`，最低1

### 战斗适配器
**代码位置**：[battleAdapter.ts](file:///d:/life/code/bak/moyu/src/utils/battleAdapter.ts)

- 使用`calculateTotalCharacterAttributes`计算总属性（确保与面板一致）
- 角色/幻兽数据转换为战斗用数据

### 战利品
**代码位置**：[lootUtils.ts](file:///d:/life/code/bak/moyu/src/utils/lootUtils.ts)

- 掉落物品和经验奖励计算
- 幸运值影响掉落概率：[luckUtils.ts](file:///d:/life/code/bak/moyu/src/utils/luckUtils.ts)

## 敌人弹窗组件

**代码位置**：[EnemyModal.tsx](file:///d:/life/code/bak/moyu/src/components/common/EnemyModal.tsx)

- 显示敌人列表：名称、HP、攻击力范围、防御力、描述
- 攻击按钮（红色#ff4444）
- 离开按钮

## 怪物数据类型

**代码位置**：[types/index.ts](file:///d:/life/code/bak/moyu/src/types/index.ts)
- `MonsterTemplate`（L808-L830）：怪物模板类型
- `Monster`（L846-L865）：怪物实例类型
- `MonsterSpawnConfig`（L871-L878）：怪物刷新配置
- `BossTemplate`（L893-L914）：BOSS模板类型
- `EnemyData`（L420-L430）：敌人数据类型
- `BattleState`（L747-L760）：战斗状态类型
- `DamageResult`（L765-L771）：伤害结果类型

## 相关代码文件索引

| 文件 | 说明 |
|------|------|
| [monsterData.ts](file:///d:/life/code/bak/moyu/src/data/monsterData.ts) | 怪物模板和刷新配置 |
| [bossData.ts](file:///d:/life/code/bak/moyu/src/data/bossData.ts) | BOSS模板和刷新配置 |
| [battleData.ts](file:///d:/life/code/bak/moyu/src/data/battleData.ts) | 战斗数据 |
| [monsterUtils.ts](file:///d:/life/code/bak/moyu/src/utils/monsterUtils.ts) | 怪物属性计算和敌人生成 |
| [bossUtils.ts](file:///d:/life/code/bak/moyu/src/utils/bossUtils.ts) | BOSS刷新和敌人生成 |
| [battleCalculator.ts](file:///d:/life/code/bak/moyu/src/utils/battleCalculator.ts) | 战斗计算器 |
| [battleAdapter.ts](file:///d:/life/code/bak/moyu/src/utils/battleAdapter.ts) | 战斗适配器 |
| [lootUtils.ts](file:///d:/life/code/bak/moyu/src/utils/lootUtils.ts) | 战利品工具 |
| [luckUtils.ts](file:///d:/life/code/bak/moyu/src/utils/luckUtils.ts) | 幸运值工具 |
| [warSoulDropUtils.ts](file:///d:/life/code/bak/moyu/src/utils/warSoulDropUtils.ts) | 战魂掉落工具 |
| [EnemyModal.tsx](file:///d:/life/code/bak/moyu/src/components/common/EnemyModal.tsx) | 敌人弹窗 |
| [Battle.tsx](file:///d:/life/code/bak/moyu/src/components/battle/Battle.tsx) | 战斗主组件 |
| [BattleLog.tsx](file:///d:/life/code/bak/moyu/src/components/battle/BattleLog.tsx) | 战斗日志 |
| [CharacterCard.tsx](file:///d:/life/code/bak/moyu/src/components/battle/CharacterCard.tsx) | 角色卡片 |
| [CharacterDetailModal.tsx](file:///d:/life/code/bak/moyu/src/components/battle/CharacterDetailModal.tsx) | 角色详情弹窗 |
| [EnemyDetailModal.tsx](file:///d:/life/code/bak/moyu/src/components/battle/EnemyDetailModal.tsx) | 敌人详情弹窗 |
| [ActionButtons.tsx](file:///d:/life/code/bak/moyu/src/components/battle/ActionButtons.tsx) | 战斗行动按钮 |
| [battle.css](file:///d:/life/code/bak/moyu/src/components/battle/battle.css) | 战斗模块样式 |