# 幻兽研究所交互逻辑优化计划

## 一、需求分析

### 1.1 参考文档
- `reference/docs/幻兽研究所交互逻辑文档.md` - 完整的交互逻辑文档
- `reference/docs/幻兽幻化师交互逻辑文档.md` - 幻化系统文档

### 1.2 核心功能
根据参考文档，幻兽研究所需要实现以下功能：

| 功能模块 | 说明 |
|---------|------|
| 技术等级系统 | 初始10级，最高120级（完成奥运任务后150级） |
| 生产量系统 | 每日生产奇异兽数量，最大6个/天 |
| VIP折扣系统 | 0-10星，折扣从100%到免费 |
| 购买系统 | 根据技术等级计算幻兽品质和价格 |
| 资助系统 | 花费魔石提升技术等级 |
| 提高产量任务 | 上交灵魂王提高产量，获得经验和VIP星级 |
| 每日重置系统 | 库存增加、周日技术提升10% |

### 1.3 当前项目状态
- ✅ 已有NPC配置 (`npcData.ts`)
- ❌ 交互逻辑未实现
- ❌ 状态管理未创建
- ❌ 工具函数未创建

---

## 二、实现步骤

### 步骤1：创建类型定义
**文件**: `src/types/index.ts`

添加以下类型：
```typescript
// 幻兽研究所状态接口
export interface PetInstituteState {
  techLevel: number;           // 技术等级 (10-120/150)
  techLevelMax: number;        // 技术等级上限 (120/150)
  productionRate: number;      // 每日生产量 (0-6)
  stock: number;               // 当前库存
  vipLevel: number;            // VIP星级 (0-10)
  canDoProductionTask: boolean; // 是否可做提高产量任务
}
```

### 步骤2：创建工具函数
**文件**: `src/utils/petInstituteUtils.ts`

实现以下函数：

| 函数名 | 功能 |
|--------|------|
| `calculatePetQuality(techLevel)` | 根据技术等级计算幻兽品质分 |
| `calculatePrice(qualityScore, vipLevel)` | 计算购买价格（含VIP折扣） |
| `canBuyPet(state, resources)` | 检查是否可以购买幻兽 |
| `buyPet(state, resources)` | 购买幻兽 |
| `canDonate(state, magicStones)` | 检查是否可以资助 |
| `donate(state, magicStones)` | 资助魔石提升技术等级 |
| `canImproveProduction(state, inventory)` | 检查是否可以做提高产量任务 |
| `improveProduction(state, inventory)` | 完成提高产量任务 |
| `getInstituteInfo(state)` | 获取研究所信息文本 |
| `dailyReset(state)` | 每日重置（库存增加） |
| `weeklyReset(state)` | 周日重置（技术提升10%） |

### 步骤3：创建奇异兽生成函数
**文件**: `src/utils/petGenerator.ts`

添加函数：
```typescript
// 生成奇异兽（根据品质分）
export function generateStrangePet(qualityScore: number): Pet
```

### 步骤4：更新NPC配置
**文件**: `src/data/npcData.ts`

优化NPC对话选项：
1. 进入 - 打开购买界面
2. 研究所的当前信息 - 显示技术等级、库存、VIP等级
3. 提高产量任务 - 条件显示（周日开启）

### 步骤5：创建购买界面组件
**文件**: `src/components/pet/PetInstituteModal.tsx`

功能：
- 显示技术等级、库存、VIP等级
- 购买奇异兽按钮（显示价格）
- 资助魔石输入框
- 提高产量任务按钮

### 步骤6：添加App.tsx动作处理
**文件**: `src/App.tsx`

添加以下动作处理：
- `openPetInstitute` - 打开幻兽研究所界面
- `viewInstituteInfo` - 查看研究所信息
- `improveProduction` - 完成提高产量任务

### 步骤7：集成每日重置系统
**文件**: `src/App.tsx`

在时间系统更新时调用：
- `dailyReset()` - 每日库存增加
- `weeklyReset()` - 周日技术提升

---

## 三、技术等级与幻兽品质对照

| 技术等级 | 品质分 | 星级 | 价格(魔石) |
|---------|-------|------|-----------|
| 20级 | 1500 | 15星 | 2800 |
| 40级 | 3000 | 30星 | 5800 |
| 60级 | 4500 | 45星 | 8800 |
| 80级 | 6000 | 60星 | 11800 |
| 100级 | 7500 | 75星 | 14800 |
| 120级 | 9000 | 90星 | 17800 |

**计算公式**：
- 品质分 = `Math.round(techLevel * 100 * 3 / 4)`
- 基础价格 = `Math.round(200 * (品质分 / 100 - 10))`
- VIP价格 = `Math.round((1 - vipLevel / 10) * 基础价格)`

---

## 四、VIP折扣系统

| VIP星级 | 折扣 | 实付比例 |
|--------|------|---------|
| 0星 | 无折扣 | 100% |
| 1星 | 9折 | 90% |
| 2星 | 8折 | 80% |
| 3星 | 7折 | 70% |
| 4星 | 6折 | 60% |
| 5星 | 5折 | 50% |
| 6星 | 4折 | 40% |
| 7星 | 3折 | 30% |
| 8星 | 2折 | 20% |
| 9星 | 1折 | 10% |
| 10星 | 免费 | 0% |

---

## 五、提高产量任务

| 当前产量 | 所需灵魂王 | 经验奖励 |
|---------|-----------|---------|
| 0 → 1 | 1个 | 105000 |
| 1 → 2 | 2个 | 210000 |
| 2 → 3 | 3个 | 315000 |
| 3 → 4 | 4个 | 420000 |
| 4 → 5 | 5个 | 525000 |
| 5 → 6 | 6个 | 630000 |

---

## 六、文件修改清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/types/index.ts` | 修改 | 添加 PetInstituteState 类型 |
| `src/utils/petInstituteUtils.ts` | 新建 | 幻兽研究所工具函数 |
| `src/utils/petGenerator.ts` | 修改 | 添加奇异兽生成函数 |
| `src/data/npcData.ts` | 修改 | 优化NPC配置 |
| `src/components/pet/PetInstituteModal.tsx` | 新建 | 购买界面组件 |
| `src/App.tsx` | 修改 | 添加状态和动作处理 |

---

## 七、验证清单

- [ ] 技术等级系统正常工作
- [ ] 生产量系统正常工作
- [ ] VIP折扣系统正常工作
- [ ] 购买奇异兽功能正常
- [ ] 资助魔石功能正常
- [ ] 提高产量任务功能正常
- [ ] 每日重置功能正常
- [ ] 周日技术提升功能正常
- [ ] 构建成功无错误
