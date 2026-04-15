# 技能模块 (Skill Module)

## 概述
技能展示页面模块，用于展示玩家已学习的所有技能，并提供技能详情查看功能。

## 组件结构

```
skill/
├── SkillPage.tsx        # 技能主页面组件
├── SkillList.tsx        # 技能列表组件
├── SkillDetailModal.tsx # 技能详情弹窗组件
├── skill.css            # 技能模块样式
├── index.ts             # 模块导出文件
└── README.md            # 模块说明文档
```

## 组件说明

### SkillPage
技能主页面组件，整合技能列表和详情弹窗。

**Props:**
- `isVisible: boolean` - 是否显示页面
- `skills?: SkillDetail[]` - 技能数据数组
- `onClose: () => void` - 关闭回调

### SkillList
技能列表组件，使用垂直列表展示技能。

**Props:**
- `skills: SkillDetail[]` - 技能数据数组
- `selectedSkillId: string | null` - 当前选中的技能ID
- `onSkillClick: (skill: SkillDetail) => void` - 点击技能回调

### SkillDetailModal
技能详情弹窗组件，展示技能完整属性。

**Props:**
- `isVisible: boolean` - 是否显示弹窗
- `skill: SkillDetail | null` - 技能数据
- `onClose: () => void` - 关闭回调

## 功能特性

1. **垂直列表布局** - 清晰展示技能图标、名称和等级
2. **流畅滚动** - 支持大量技能时的平滑滚动
3. **选中状态** - 明确的选中样式反馈
4. **详情弹窗** - 完整展示技能属性信息
5. **稀有度区分** - 通过边框颜色区分技能稀有度
6. **性能优化** - 使用useMemo和useCallback优化渲染

## 类型定义

```typescript
// 技能类型
type SkillType = 'active' | 'passive' | 'toggle';

// 技能稀有度
type SkillRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

// 技能详情接口
interface SkillDetail {
  id: string;
  name: string;
  icon: string;
  type: SkillType;
  rarity: SkillRarity;
  level: number;
  maxLevel: number;
  description: string;
  effect: SkillEffect;
  cost: SkillCost;
  cooldown: number;
  currentCooldown: number;
  range: string;
  targetType: string;
  learnLevel: number;
  upgradeCost?: number;
}
```

## 使用示例

```tsx
import { SkillPage } from './components/skill';

function App() {
  const [showSkillPage, setShowSkillPage] = useState(false);
  
  return (
    <SkillPage 
      isVisible={showSkillPage}
      onClose={() => setShowSkillPage(false)}
    />
  );
}
```

## 移动端优化

- 全屏覆盖层布局
- 触摸友好的交互区域
- 响应式字体和间距
- 硬件加速滚动
- 减少动画模式支持
