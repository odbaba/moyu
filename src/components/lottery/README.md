# 抽奖区组件 (Lottery Area)

## 概述

抽奖区组件提供宝箱抽奖功能，玩家可以消耗魔石进行抽奖，获得各种奖品（装备、幻兽、特殊物品等）。

## 组件结构

```
lottery/
├── LotteryArea.tsx    # 主组件
├── lottery.css        # 样式文件
├── index.ts           # 导出文件
└── README.md          # 本文档
```

## 功能特性

### 1. 宝箱抽奖系统

- **七个宝箱按钮**：采用 2-3-2 布局排列
- **抽奖消耗**：每次抽奖需要 28 魔石
- **抽奖动画**：宝箱抖动动画和开箱效果
- **结果展示**：弹窗显示奖品详情

### 2. 奖品等级

| 等级 | 概率 | 颜色 | 示例奖品 |
|------|------|------|----------|
| 极品奖励 | 2% | 红色 | 噜噜幻兽、精品装备、电浆药水 |
| 高级奖励 | 5% | 黄色 | 圣天使幻兽、精品装备、飞天连斩 |
| 中级奖励 | 38% | 绿色 | 奇异兽、精品装备、幻魔之心 |
| 普通奖励 | 55% | 蓝色 | 满经验球、优秀装备、灵魂晶石 |

### 3. 响应式设计

- **手机端优化**：适配各种屏幕尺寸
- **触摸友好**：增大触摸区域，优化交互体验
- **动画优化**：支持 `prefers-reduced-motion` 用户偏好

## 组件接口

### LotteryAreaProps

```typescript
interface LotteryAreaProps {
  isVisible: boolean;              // 是否可见
  onClose: () => void;             // 关闭回调
  onReturnToCity: () => void;      // 回城回调
  magicStones: number;             // 当前魔石数量
  onUpdateMagicStones: (amount: number) => void;  // 更新魔石数量
  playerLevel: number;             // 玩家等级
  onAddItem: (item: InventoryItem) => void;       // 添加物品回调
  onAddPet: (pet: Pet) => void;                    // 添加幻兽回调
  onConsumeTime: (amount: number) => void;         // 消耗时间回调
}
```

## 使用示例

```tsx
import { LotteryArea } from './components/lottery';

function App() {
  const [showLottery, setShowLottery] = useState(false);
  const [magicStones, setMagicStones] = useState(1000);

  return (
    <LotteryArea
      isVisible={showLottery}
      onClose={() => setShowLottery(false)}
      onReturnToCity={() => {
        setShowLottery(false);
        // 返回城市逻辑
      }}
      magicStones={magicStones}
      onUpdateMagicStones={(amount) => setMagicStones(prev => prev + amount)}
      playerLevel={50}
      onAddItem={(item) => {
        // 添加物品到背包
      }}
      onAddPet={(pet) => {
        // 添加幻兽到幻兽列表
      }}
      onConsumeTime={(amount) => {
        // 消耗游戏时间
      }}
    />
  );
}
```

## 样式说明

### 主要样式类

| 类名 | 说明 |
|------|------|
| `.lottery-area` | 全屏容器 |
| `.lottery-header` | 标题区域 |
| `.lottery-chests` | 宝箱区域 |
| `.chest-button` | 宝箱按钮 |
| `.chest-icon` | 宝箱图标 |
| `.lottery-result-modal` | 结果弹窗 |
| `.prize-legendary` | 极品奖品样式 |
| `.prize-high` | 高级奖品样式 |
| `.prize-medium` | 中级奖品样式 |
| `.prize-common` | 普通奖品样式 |

### 动画效果

- **shake**：宝箱抖动动画
- **fadeIn**：消息淡入动画
- **scaleIn**：弹窗缩放动画

## 抽奖逻辑

抽奖逻辑由 `lotterySystem.ts` 工具模块提供：

1. **生成随机数**：0-999 范围
2. **判定奖品等级**：根据随机值区间
3. **选择具体奖品**：从对应奖品池随机选择
4. **生成奖品数据**：装备或幻兽数据

详细逻辑请参考 [lotterySystem.ts](../../utils/lotterySystem.ts)。

## 注意事项

1. **魔石检查**：抽奖前会检查魔石是否足够
2. **防重复点击**：抽奖过程中禁用所有宝箱按钮
3. **时间消耗**：每次抽奖消耗 1 单位游戏时间
4. **奖品添加**：奖品自动添加到背包或幻兽列表

## 后续优化建议

1. 添加抽奖历史记录
2. 支持十连抽功能
3. 添加抽奖音效
4. 优化奖品预览功能
