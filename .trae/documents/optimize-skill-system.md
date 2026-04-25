# 技能系统优化计划

## Why
根据参考文档，原版魔域游戏的技能系统包含6个技能，玩家初始拥有2个技能（高级风斩、高级地裂爆斩），其他技能需要通过技能书学习。当前项目的技能系统与参考文档有较大差距，需要优化以符合原版游戏设计。

## 参考文档关键信息

### 技能索引对照表
| 索引 | 技能名称 | 类型 | 效果 | 学习方式 |
|------|----------|------|------|----------|
| 0 | 高级风斩 | 单体攻击 | 攻击力150% | 初始技能 |
| 1 | 高级地裂爆斩 | 群体攻击 | 攻击力50% | 初始技能 |
| 2 | 星魔剑/高级星魔剑 | 群体攻击 | 攻击力120%/150% | 技能书学习 |
| 3 | 飞天连斩/高级飞天连斩 | 单体四连击 | 其中2击破防 | 技能书学习 |
| 4 | 斗志昂扬/高级斗志昂扬 | 增益 | 战斗力加成5%-50% | 技能书学习，可升级到5级 |
| 5 | 爱的力量 | 特殊 | 公主亲密度解锁 | 公主亲密度 |

### 斗志昂扬等级加成
- 等级1: 5%
- 等级2: 10%
- 等级3: 20%
- 等级4: 35%
- 等级5: 50%

## What Changes

### 1. 类型定义优化
- 新增 `SkillIndex` 枚举（0-5对应6个技能槽位）
- 修改 `SkillDetail` 接口，增加技能索引和学习方式字段
- 新增 `SkillLearnMethod` 类型（初始/技能书/亲密度）

### 2. 技能数据重构
- 重写 `skillData.ts`，按参考文档定义6个技能
- 新增技能书物品数据 `skillBooks.ts`

### 3. 技能工具函数
- 新增 `skillUtils.ts` 工具文件
- `getSkillDamage()` - 计算技能伤害
- `getSkillBonus()` - 获取斗志昂扬战斗力加成
- `canUpgradeSkill()` - 判断技能是否可升级

### 4. 组件优化
- 修改 `SkillPage.tsx` - 调整技能分类展示
- 修改 `SkillDetailModal.tsx` - 新增技能升级功能

### 5. 状态管理
- 在 `App.tsx` 中新增技能状态管理
- 新增技能升级处理函数

## Implementation Steps

### Step 1: 类型定义优化
- [x] 在 `types/index.ts` 中新增 `SkillIndex` 枚举
- [x] 新增 `SkillLearnMethod` 类型
- [x] 修改 `SkillDetail` 接口，增加 `skillIndex` 和 `learnMethod` 字段

### Step 2: 技能数据重构
- [x] 重写 `data/skillData.ts`，定义6个技能数据
- [x] 新增 `data/skillBooks.ts`，定义技能书物品

### Step 3: 技能工具函数
- [x] 创建 `utils/skillUtils.ts`
- [x] 实现 `getSkillDamage()` 函数
- [x] 实现 `getSkillBonus()` 函数
- [x] 实现 `canUpgradeSkill()` 函数

### Step 4: 组件优化
- [x] 修改 `SkillPage.tsx`，调整技能分类展示
- [x] 修改 `SkillDetailModal.tsx`，新增技能升级功能
- [x] 更新 `skill.css` 样式

### Step 5: 状态管理集成
- [x] 在 `App.tsx` 中新增技能状态
- [x] 新增技能升级处理函数
- [x] 传递技能数据到 SkillPage 组件

### Step 6: 验证
- [x] 运行构建验证
- [x] 测试技能显示和升级功能

## Impact
- Affected files:
  - `src/types/index.ts`
  - `src/data/skillData.ts`
  - `src/data/skillBooks.ts` (新增)
  - `src/utils/skillUtils.ts` (新增)
  - `src/components/skill/SkillPage.tsx`
  - `src/components/skill/SkillDetailModal.tsx`
  - `src/components/skill/skill.css`
  - `src/App.tsx`
