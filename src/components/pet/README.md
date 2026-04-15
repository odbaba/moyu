# 幻兽模块 (Pet Module)

## 概述

幻兽模块提供了完整的幻兽管理界面，包括幻兽列表展示、出战幻兽管理、幻兽详情查看等功能。该模块针对移动端进行了优化，确保在一屏内展示所有关键信息。

## 组件结构

```
pet/
├── PetPage.tsx           # 幻兽页面主组件
├── DeployedPetSlot.tsx   # 出战幻兽栏组件
├── PetListItem.tsx       # 幻兽列表项组件
├── PetDetailModal.tsx    # 幻兽详情弹窗组件
├── pet.css               # 样式文件
├── index.ts              # 导出文件
└── README.md             # 文档文件
```

## 组件说明

### 1. PetPage（幻兽页面主组件）

**功能**：幻兽系统的主页面，整合所有幻兽相关功能。

**Props**：
- `isVisible: boolean` - 是否显示页面
- `onClose: () => void` - 关闭页面的回调函数
- `pets: Pet[]` - 所有幻兽数据数组
- `deployedPets: Pet[]` - 出战幻兽数组（最多2只）
- `onRecall: (petId: string) => void` - 召回幻兽的回调函数
- `onMerge: (petId: string) => void` - 合体幻兽的回调函数
- `onUnmerge: (petId: string) => void` - 解体幻兽的回调函数

**布局结构**：
- 顶部：页面标题和关闭按钮
- 上部：两个出战幻兽栏（DeployedPetSlot组件）
- 中部：幻兽数量提示
- 下部：幻兽列表（PetListItem组件）

### 2. DeployedPetSlot（出战幻兽栏组件）

**功能**：显示单个出战幻兽的信息和操作按钮。

**Props**：
- `pet: Pet | null` - 幻兽对象，如果为null表示该槽位为空
- `slotIndex: number` - 槽位索引（0或1）
- `onRecall: (petId: string) => void` - 召回幻兽的回调函数
- `onMerge: (petId: string) => void` - 合体幻兽的回调函数
- `onUnmerge: (petId: string) => void` - 解体幻兽的回调函数

**显示内容**：
- 幻兽头像（emoji图标）
- 幻兽名称和等级
- 生命值进度条
- 经验值进度条
- 召回按钮
- 合体/解体按钮

**幻兽类型emoji映射**：
- 攻防型：🦁
- 调皮鬼：👹
- 吉鲁猪：🐷
- 奇异兽：🦄
- 圣天使：👼
- 守护：🛡️
- 年猪：🐗

### 3. PetListItem（幻兽列表项组件）

**功能**：在幻兽列表中显示单个幻兽的基本信息。

**Props**：
- `pet: Pet` - 幻兽对象
- `onClick: (pet: Pet) => void` - 点击幻兽项时触发的回调函数

**显示内容**：
- 幻兽头像（emoji图标）
- 幻兽名称（品质颜色）
- 幻兽类型
- 幻兽等级
- 品质标签
- 状态标签（出战中/合体中）

**品质颜色映射**：
- 普通：#9e9e9e（灰色）
- 良品：#4caf50（绿色）
- 上品：#2196f3（蓝色）
- 精品：#9c27b0（紫色）
- 极品：#ff9800（橙色）

### 4. PetDetailModal（幻兽详情弹窗组件）

**功能**：显示幻兽的详细信息，包括基础属性、成长属性、评分等。

**Props**：
- `isVisible: boolean` - 是否显示弹窗
- `onClose: () => void` - 关闭弹窗的回调函数
- `pet: Pet | null` - 要显示的幻兽对象

**显示内容**（表格形式）：
- 名字和幻兽类型
- 品质和等级
- 生命值和经验值
- 攻击力范围
- 防御力和防御成长率（含评分）
- 生命成长率（含评分）
- 攻击成长率（含评分）
- 初始生命（含评分）
- 初始攻击（含评分）
- 初始防御（含评分）
- 罕见度加分和转世次数
- 总评分

## 数据类型

### Pet（幻兽接口）

```typescript
interface Pet {
  id: string;                   // 幻兽唯一ID
  hs_name: PetType;             // 幻兽类型名称
  othername: string;            // 显示名称（自定义名称）
  dj: number;                   // 等级 (1-130)
  hp: number;                   // 当前生命值
  mhp: number;                  // 最大生命值
  xgj: number;                  // 最小攻击力
  dgj: number;                  // 最大攻击力
  fy: number;                   // 防御力
  jy: number;                   // 当前经验值
  mjy: number;                  // 升级所需经验
  zs: number;                   // 转世次数（幻化次数）
  pz: number;                   // 总评分
  quality: PetQuality;          // 品质（基于评分计算）
  isDeployed: boolean;          // 是否出战中
  isMerged: boolean;            // 是否合体中
  // 初始属性
  chp: number;                  // 初始生命值 (20-34)
  cxgj: number;                 // 初始最小攻击 (10-14)
  cdgj: number;                 // 初始最大攻击 (cxgj 到 29)
  cfy: number;                  // 初始防御 (5-9)
  // 成长属性
  cz_hp: number;                // 生命成长率 (30-41)
  cz_xgj: number;               // 最小攻击成长率 (8-11)
  cz_dgj: number;               // 最大攻击成长率 (cz_xgj 到 16)
  cz_fy: number;                // 防御成长率 (1-6)
  // 评分详情
  rating: PetRating;            // 各项评分详情
}
```

### PetType（幻兽类型）

```typescript
type PetType = '攻防型' | '调皮鬼' | '吉鲁猪' | '奇异兽' | '圣天使' | '守护';
```

### PetQuality（幻兽品质）

```typescript
type PetQuality = '普通' | '良品' | '上品' | '精品' | '极品';
```

### PetRating（幻兽评分）

```typescript
interface PetRating {
  pzbase: number;       // 基础评分（根据幻兽类型固定）
  pz_chp: number;       // 初始生命评分
  pz_cxgj: number;      // 初始最小攻击评分
  pz_cdgj: number;      // 初始最大攻击评分
  pz_cfy: number;       // 初始防御评分
  pz_cz_hp: number;     // 生命成长评分
  pz_cz_xgj: number;    // 最小攻击成长评分
  pz_cz_dgj: number;    // 最大攻击成长评分
  pz_cz_fy: number;     // 防御成长评分
}
```

## 使用示例

```tsx
import React, { useState } from 'react';
import { PetPage } from './components/pet';
import { examplePets } from './data/petData';

const App: React.FC = () => {
  const [showPetPage, setShowPetPage] = useState(false);
  const [pets, setPets] = useState(examplePets);
  const [deployedPets, setDeployedPets] = useState(
    examplePets.filter(p => p.isDeployed)
  );

  const handleRecall = (petId: string) => {
    // 召回幻兽逻辑
    console.log('召回幻兽:', petId);
  };

  const handleMerge = (petId: string) => {
    // 合体幻兽逻辑
    console.log('合体幻兽:', petId);
  };

  const handleUnmerge = (petId: string) => {
    // 解体幻兽逻辑
    console.log('解体幻兽:', petId);
  };

  return (
    <div>
      <button onClick={() => setShowPetPage(true)}>
        打开幻兽页面
      </button>

      <PetPage
        isVisible={showPetPage}
        onClose={() => setShowPetPage(false)}
        pets={pets}
        deployedPets={deployedPets}
        onRecall={handleRecall}
        onMerge={handleMerge}
        onUnmerge={handleUnmerge}
      />
    </div>
  );
};

export default App;
```

## 样式特性

### 移动端优化
- 全屏布局，确保一屏展示所有信息
- 响应式设计，适配不同屏幕尺寸
- 触摸设备优化，提供良好的触摸反馈

### 视觉效果
- 幻兽品质颜色区分
- 进度条动画效果
- 悬停和点击反馈
- 合体状态特殊样式

### 响应式断点
- 小屏幕手机（< 375px）
- 标准手机（375px - 767px）
- 平板设备（768px - 1023px）
- 大屏幕设备（≥ 1024px）
- 超大屏幕设备（≥ 1440px）

### 横屏模式
- 自动切换为左右布局
- 隐藏中部提示区域
- 出战幻兽栏改为单列显示

## 注意事项

1. **幻兽数据**：确保传入的幻兽数据符合 `Pet` 接口定义
2. **出战幻兽**：最多支持2只幻兽同时出战
3. **回调函数**：所有回调函数必须正确实现，否则操作按钮无法正常工作
4. **品质计算**：品质基于总评分自动计算，无需手动设置
5. **合体状态**：合体状态的幻兽会显示特殊的边框样式和标签

### 战斗系统集成

幻兽系统已与战斗系统完整集成，幻兽可以参与战斗并提供战斗支持。

#### 幻兽在战斗中的作用
- **出战机制**：最多2只幻兽可以同时出战，参与战斗
- **显示位置**：
  - 第一只幻兽：九宫格左下角 `{x: 0, y: 2}`
  - 第二只幻兽：九宫格右下角 `{x: 2, y: 2}`
- **战斗属性**：幻兽使用自己的攻击力、防御力、生命值参与战斗
- **攻击范围**：幻兽的攻击力有最小值和最大值范围，战斗时随机取值

#### 合体状态对战斗的影响
- **优先攻击**：敌方AI会优先攻击合体状态的幻兽
- **攻击优先级**：
  1. 第一出战位的合体幻兽（如果存活）
  2. 第二出战位的合体幻兽（如果存活）
  3. 玩家角色（当没有合体幻兽或合体幻兽已阵亡时）
- **视觉标识**：合体幻兽在战斗中显示金色发光边框和"合体"标签
- **保护作用**：合体幻兽可以吸引敌方攻击，保护玩家角色

#### 幻兽血量在战斗后的同步
- **状态同步**：战斗结束后，幻兽的当前血量会自动同步到主系统
- **回调机制**：通过 `onBattleEnd` 回调函数返回 `finalDeployedPets` 参数
- **数据结构**：`finalDeployedPets` 包含每个幻兽的 `petId` 和 `currentHp`
- **阵亡处理**：幻兽在战斗中阵亡（`currentHp <= 0`）后，血量会同步为0
- **恢复机制**：阵亡的幻兽需要在幻兽系统中恢复血量后才能再次出战

## 相关文件

- 类型定义：`src/types/index.ts`
- 示例数据：`src/data/petData.ts`
- 主组件导出：`src/components/index.ts`
