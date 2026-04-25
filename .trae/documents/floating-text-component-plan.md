# 浮动文字提示组件实现计划

## 一、需求概述

创建一个浮动文字提示组件，实现白色文字从屏幕中间上浮并逐渐消失的动画效果，参考战斗页面的伤害数字动画。

## 二、应用场景

1. **背包页面使用满经验球后的升级日志**
   - 当角色使用满经验球升级时，显示升级提示

2. **角色升级到装备使用等级节点**
   - 等级节点：10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 125级
   - 提示："你已经" + dj + "级了，你可以使用更加高级的装备了，到装备打造师那里把你的装备升级吧。"

3. **星期六PK大赛提示**
   - 提示："今天是星期六，PK大赛即将开始，如果要参加比赛请到皇宫周赛PK报名官那里报名吧。"

4. **星期日军饷和公主礼物提示**
   - 军饷提示（有军衔时）
   - 公主礼物提示（认识公主时）

5. **星期日公主关系鲜花提示**
   - 提示："公主是你的" + 关系名称 + "。星期天了，公主很想收到一束漂亮的鲜花，你是否会给她送上一束呢。"

## 三、技术方案

### 3.1 组件设计

#### 3.1.1 创建浮动文字组件 `FloatingText.tsx`

**位置**: `src/components/common/FloatingText.tsx`

**功能**:
- 接收文字内容和显示状态
- 实现上浮动画效果
- 动画结束后自动移除

**Props接口**:
```typescript
interface FloatingTextProps {
  text: string;           // 显示的文字内容
  isVisible: boolean;     // 是否显示
  duration?: number;      // 动画持续时间，默认3000ms
  onComplete?: () => void; // 动画完成回调
}
```

#### 3.1.2 创建浮动文字管理器 `FloatingTextManager.tsx`

**位置**: `src/components/common/FloatingTextManager.tsx`

**功能**:
- 管理多个浮动文字的显示队列
- 支持同时显示多条文字（依次显示）
- 提供全局的显示方法

**Props接口**:
```typescript
interface FloatingTextItem {
  id: number;
  text: string;
  duration?: number;
}

interface FloatingTextManagerProps {
  texts: FloatingTextItem[];
  onRemove: (id: number) => void;
}
```

#### 3.1.3 创建CSS样式文件 `FloatingText.css`

**位置**: `src/components/common/FloatingText.css`

**样式设计**:
- 固定定位在屏幕中间
- 白色文字（#FCFFFF）
- 上浮动画（参考伤害数字动画）
- 文字阴影增强可读性
- 支持多行文字显示

### 3.2 动画实现

参考战斗页面的伤害数字动画（`battle.css` 第539-552行）:

```css
@keyframes damageFloat {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) translateY(-30px) scale(1.3);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(-60px) scale(1.5);
  }
}
```

**调整方案**:
- 动画持续时间延长到3秒（伤害数字是1.5秒）
- 上浮距离增加到100px（更适合长文字）
- 缩放比例调整为1.1（避免文字过大）

### 3.3 集成方案

#### 3.3.1 在App.tsx中添加状态管理

```typescript
// 浮动文字状态
const [floatingTexts, setFloatingTexts] = useState<FloatingTextItem[]>([]);
const floatingTextIdCounterRef = useRef(0);

// 添加浮动文字的方法
const addFloatingText = useCallback((text: string, duration?: number) => {
  const id = floatingTextIdCounterRef.current + 1;
  floatingTextIdCounterRef.current = id;
  setFloatingTexts(prev => [...prev, { id, text, duration }]);
  
  // 自动移除
  setTimeout(() => {
    setFloatingTexts(prev => prev.filter(t => t.id !== id));
  }, duration || 3000);
}, []);
```

#### 3.3.2 场景集成点

**场景1: 背包页面使用满经验球**
- 位置: `handleUseItemOnPlayer` 函数
- 触发条件: `result.message` 存在时（表示升级）
- 调用: `addFloatingText(result.message)`

**场景2: 角色升级到装备使用等级节点**
- 位置: `gainCharacterExperience` 函数或 `setCharacter` 回调中
- 触发条件: 新等级在 [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 125] 中
- 调用: `addFloatingText("你已经" + dj + "级了，你可以使用更加高级的装备了，到装备打造师那里把你的装备升级吧。")`

**场景3: 星期六PK大赛提示**
- 位置: 时间系统更新时（`handleTimeUpdate` 或相关函数）
- 触发条件: `getWeekday(nowday) === '星期六'` 且当天未提示过
- 调用: `addFloatingText("今天是星期六，PK大赛即将开始，如果要参加比赛请到皇宫周赛PK报名官那里报名吧。")`

**场景4: 星期日军饷和公主礼物提示**
- 位置: 时间系统更新时
- 触发条件: `getWeekday(nowday) === '星期日'` 且当天未提示过
- 调用: 
  - 军饷: `addFloatingText("今天是星期天啦，如果你有军衔了就可以去元帅那里领取军饷...")`
  - 公主礼物: `addFloatingText("今天是星期天啦，如果你认识了公主那今天她会送你一份礼物。")`

**场景5: 星期日公主关系鲜花提示**
- 位置: 时间系统更新时
- 触发条件: `getWeekday(nowday) === '星期日'` 且公主关系等级 > 0 且当天未提示过
- 调用: `addFloatingText("公主是你的" + 关系名称 + "。星期天了，公主很想收到一束漂亮的鲜花，你是否会给她送上一束呢。")`

## 四、实现步骤

### 步骤1: 创建浮动文字组件
1. 创建 `src/components/common/FloatingText.tsx`
2. 创建 `src/components/common/FloatingText.css`
3. 创建 `src/components/common/FloatingTextManager.tsx`

### 步骤2: 在App.tsx中集成
1. 添加浮动文字状态管理
2. 添加 `addFloatingText` 方法
3. 在页面中渲染 `FloatingTextManager` 组件

### 步骤3: 实现场景1 - 背包页面使用满经验球
1. 修改 `handleUseItemOnPlayer` 函数
2. 在升级时调用 `addFloatingText`

### 步骤4: 实现场景2 - 角色升级到装备使用等级节点
1. 创建装备使用等级节点检测函数
2. 在角色升级时检测并调用 `addFloatingText`

### 步骤5: 实现场景3-5 - 时间系统相关提示
1. 创建每日提示状态管理（避免重复提示）
2. 在时间系统更新时检测星期
3. 根据条件调用 `addFloatingText`

### 步骤6: 更新文档
1. 更新 `src/components/common/README.md`
2. 添加浮动文字组件的使用说明

## 五、文件清单

### 新增文件
1. `src/components/common/FloatingText.tsx` - 浮动文字组件
2. `src/components/common/FloatingText.css` - 浮动文字样式
3. `src/components/common/FloatingTextManager.tsx` - 浮动文字管理器

### 修改文件
1. `src/App.tsx` - 添加浮动文字状态管理和集成
2. `src/components/common/index.ts` - 导出新组件
3. `src/components/common/README.md` - 更新文档

## 六、注意事项

1. **避免重复提示**: 时间系统相关的提示需要记录当天是否已提示过，避免每次时间更新都提示
2. **动画性能**: 使用CSS动画，避免JavaScript动画影响性能
3. **文字长度**: 长文字需要自动换行，确保在手机屏幕上完整显示
4. **层级管理**: 浮动文字的z-index需要高于其他元素，但低于弹窗
5. **多文字处理**: 多条文字同时显示时，需要依次显示，避免重叠

## 七、测试要点

1. 使用满经验球升级时，是否显示浮动文字
2. 角色升级到10, 20, 30...125级时，是否显示装备升级提示
3. 星期六时，是否显示PK大赛提示（只显示一次）
4. 星期日时，是否显示军饷和公主礼物提示（只显示一次）
5. 星期日时，如果认识公主，是否显示鲜花提示（只显示一次）
6. 多条文字同时触发时，是否依次显示
7. 动画效果是否流畅，文字是否清晰可读
