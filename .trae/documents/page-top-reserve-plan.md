# 页面顶部预留黑边方案分析

## 需求说明
- 给项目整个页面增加距离顶部10%屏幕高度的黑边预留
- 预留之后，整个页面的屏幕高度仍然保持100%
- 以最小的改动实现

## 当前布局分析

### 现有高度分配（home.css）
```
位置标题：5vh
场景描述：20vh
局部地图：25vh
交互按钮：15vh
时间显示：5vh
交互日志：30vh
总计：100vh
```

### 涉及文件
1. `src/index.css` - 定义 `#root` 的 `min-height: 100vh`
2. `src/App.css` - 定义 `.game-container`
3. `src/components/home/home.css` - 各组件使用 `vh` 单位
4. `src/components/battle/battle.css` - 战斗界面使用 `vh` 单位

---

## 方案对比

### 方案一：CSS Transform 缩放方案 ⭐推荐

**实现方式：**
```css
/* index.css */
#root {
  width: 100%;
  height: 90vh;           /* 高度设为90% */
  transform: scale(1);     /* 不缩放，保持原大小 */
  margin-top: 10vh;        /* 顶部留出10%黑边 */
  background-color: #252935;
}

/* 或者在 App.css 中 */
.game-container {
  margin-top: 10vh;
  height: 90vh;
  overflow: hidden;
}
```

**优点：**
- 改动最小，只需修改1-2个CSS属性
- 内容不会被缩小，保持原有大小和清晰度
- 不影响现有各组件的 `vh` 单位计算

**缺点：**
- 需要确保 `overflow: hidden` 防止内容溢出

**修改文件：** `src/index.css` 或 `src/App.css`

---

### 方案二：CSS 变量统一管理方案

**实现方式：**
```css
/* index.css */
:root {
  --top-reserve: 10vh;
  --content-height: calc(100vh - var(--top-reserve));
}

#root {
  padding-top: var(--top-reserve);
  height: 100vh;
  box-sizing: border-box;
}

/* home.css - 修改所有 vh 单位 */
.location-header { height: calc(var(--content-height) * 0.05); }
.scene-description { height: calc(var(--content-height) * 0.20); }
/* ... 其他组件类似 */
```

**优点：**
- 便于后续调整预留高度
- 结构清晰，易于维护

**缺点：**
- 需要修改多个CSS文件
- 改动量较大

**修改文件：** `src/index.css`, `src/components/home/home.css`, `src/components/battle/battle.css`

---

### 方案三：Flexbox 布局包装方案

**实现方式：**
```css
/* App.css */
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.top-reserve {
  height: 10vh;
  background-color: #000000; /* 黑色预留区域 */
}

#root {
  flex: 1;
  height: 90vh;
}
```

**优点：**
- 结构清晰，黑边区域独立
- 易于扩展（可在黑边区域添加内容）

**缺点：**
- 可能需要修改HTML结构
- 需要确保各组件高度适配

**修改文件：** `src/index.css`, `src/App.css`, 可能需要修改 `index.html`

---

### 方案四：Viewport 单位调整方案

**实现方式：**
```css
/* index.css */
#root {
  height: 100vh;
  padding-top: 10vh;
  box-sizing: border-box;
}

/* 所有组件的 vh 单位按比例缩小 */
/* 原来 5vh → 4.5vh (5% × 90%) */
/* 原来 20vh → 18vh (20% × 90%) */
/* 以此类推 */
```

**优点：**
- 保持100vh的总高度
- 逻辑直观

**缺点：**
- 需要修改所有使用 `vh` 单位的地方
- 改动量最大

**修改文件：** `src/index.css`, `src/components/home/home.css`, `src/components/battle/battle.css`, 其他组件CSS

---

## 推荐方案

**推荐使用方案一（CSS Transform 缩放方案）**

理由：
1. **改动最小**：只需修改 `src/index.css` 或 `src/App.css` 中的2-3行代码
2. **不影响现有布局**：各组件的 `vh` 单位无需修改
3. **易于回滚**：如果效果不理想，只需删除新增的代码即可
4. **兼容性好**：现代浏览器完全支持

---

## 方案一具体实施步骤

### 步骤1：修改 `src/index.css`

```css
#root {
  width: 100%;
  min-height: 100vh;
  height: 100vh;           /* 固定高度为100vh */
  padding-top: 10vh;       /* 顶部预留10%黑边 */
  box-sizing: border-box;  /* 包含padding在高度内 */
}
```

### 步骤2：修改 `src/App.css`（可选，用于确保内容不溢出）

```css
.game-container {
  height: 90vh;            /* 内容区域高度 */
  overflow: hidden;        /* 防止溢出 */
}
```

---

## 注意事项

1. **黑边颜色**：预留区域会显示 `body` 的背景色 `#252935`，如需纯黑色可单独设置
2. **弹窗组件**：使用 `position: fixed` 的弹窗组件不受影响
3. **测试验证**：修改后需在手机端测试显示效果
