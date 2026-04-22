# 全局页面样式统一调整计划

## 目标
根据首页的样式，调整全局所有页面的样式，使其风格统一：
1. 页面内容高度压缩到90vh，顶部增加10vh高度的占位块，整体高度保持100vh
2. 背景颜色调整为 `#252935`，除特殊处理外其他所有字体颜色都是 `#FFFFFF`
3. 风格和首页保持统一

---

## 需要修改的文件清单

### 一、角色页面 (CharacterPage)
- **TSX文件**: `src/components/character/CharacterPage.tsx`
- **CSS文件**: `src/components/character/character.css`

### 二、幻兽页面 (PetPage)
- **TSX文件**: `src/components/pet/PetPage.tsx`
- **CSS文件**: `src/components/pet/pet.css`

### 三、背包页面 (InventoryPage)
- **TSX文件**: `src/components/inventory/InventoryPage.tsx`
- **CSS文件**: `src/components/inventory/inventory.css`

### 四、技能页面 (SkillPage)
- **TSX文件**: `src/components/skill/SkillPage.tsx`
- **CSS文件**: `src/components/skill/skill.css`

### 五、商店页面 (ShopPage)
- **TSX文件**: `src/components/shop/ShopPage.tsx`
- **CSS文件**: `src/components/shop/shop.css`

### 六、抽奖页面 (LotteryArea)
- **TSX文件**: `src/components/lottery/LotteryArea.tsx`
- **CSS文件**: `src/components/lottery/lottery.css`

### 七、战斗页面 (Battle)
- **TSX文件**: `src/components/battle/Battle.tsx`
- **CSS文件**: `src/components/battle/battle.css`

### 八、幻兽融合页面 (PetFusionModal)
- **CSS文件**: `src/components/pet/pet.css` (已包含)

---

## 详细修改步骤

### 步骤1: 角色页面 (CharacterPage)

#### 1.1 修改 CharacterPage.tsx
在 `character-page-container` 内部顶部添加占位框：
```tsx
<div className="character-page-container">
  {/* 顶部占位框 */}
  <div className="page-top-placeholder"></div>
  
  {/* 页面顶部关闭按钮 */}
  <div className="character-page-header">
    ...
  </div>
  ...
</div>
```

#### 1.2 修改 character.css
1. 添加顶部占位框样式：
```css
/* 顶部占位框 - 高度10% */
.page-top-placeholder {
  width: 100%;
  height: 10vh;
  background-color: #252935;
  border-bottom: 1px solid #000000;
  flex-shrink: 0;
}
```

2. 修改 `.character-page-overlay` 背景色：
```css
.character-page-overlay {
  background-color: rgba(0, 0, 0, 0.9); /* 保持不变，遮罩层 */
}
```

3. 修改 `.character-page-container` 背景色和布局：
```css
.character-page-container {
  background-color: #252935;
  height: 100%;
  ...
}
```

4. 修改 `.character-page-header` 背景色：
```css
.character-page-header {
  background-color: #252935;
  ...
}
```

5. 修改 `.character-info-compact` 背景色：
```css
.character-info-compact {
  background-color: #252935;
  ...
}
```

6. 修改 `.equipment-display-compact` 背景色

7. 统一字体颜色为 `#FFFFFF`（保留特殊颜色如标题、数值等）

---

### 步骤2: 幻兽页面 (PetPage)

#### 2.1 修改 PetPage.tsx
在 `pet-page-container` 内部顶部添加占位框：
```tsx
<div className="pet-page-container">
  {/* 顶部占位框 */}
  <div className="page-top-placeholder"></div>
  
  {/* 页面顶部标题和关闭按钮 */}
  <div className="pet-page-header">
    ...
  </div>
  ...
</div>
```

#### 2.2 修改 pet.css
1. 添加顶部占位框样式（同上）
2. 修改 `.pet-page-container` 背景色为 `#252935`
3. 修改 `.pet-page-header` 背景色为 `#252935`
4. 修改 `.pet-page-content` 背景色
5. 修改 `.deployed-pet-slot` 背景色
6. 修改 `.pet-list-item` 背景色
7. 统一字体颜色为 `#FFFFFF`

---

### 步骤3: 背包页面 (InventoryPage)

#### 3.1 修改 InventoryPage.tsx
在 `inventory-page-container` 内部顶部添加占位框：
```tsx
<div className="inventory-page-container">
  {/* 顶部占位框 */}
  <div className="page-top-placeholder"></div>
  
  {/* 页面顶部标题和关闭按钮 */}
  <div className="inventory-page-header">
    ...
  </div>
  ...
</div>
```

#### 3.2 修改 inventory.css
1. 添加顶部占位框样式（同上）
2. 修改 `.inventory-page-container` 背景色为 `#252935`
3. 修改 `.inventory-page-header` 背景色为 `#252935`
4. 修改 `.inventory-page-content` 背景色
5. 修改 `.player-resources` 背景色
6. 修改 `.inventory-tabs` 背景色
7. 修改 `.inventory-list` 背景色
8. 修改 `.inventory-list-item` 背景色
9. 统一字体颜色为 `#FFFFFF`

---

### 步骤4: 技能页面 (SkillPage)

#### 4.1 修改 SkillPage.tsx
在 `skill-page-container` 内部顶部添加占位框：
```tsx
<div className="skill-page-container">
  {/* 顶部占位框 */}
  <div className="page-top-placeholder"></div>
  
  {/* 页面顶部标题和关闭按钮 */}
  <div className="skill-page-header">
    ...
  </div>
  ...
</div>
```

#### 4.2 修改 skill.css
1. 添加顶部占位框样式（同上）
2. 修改 `.skill-page-container` 背景色为 `#252935`
3. 修改 `.skill-page-header` 背景色为 `#252935`
4. 修改 `.skill-stats` 背景色
5. 修改 `.skill-page-content` 背景色
6. 修改 `.skill-list-item` 背景色
7. 统一字体颜色为 `#FFFFFF`

---

### 步骤5: 商店页面 (ShopPage)

#### 5.1 修改 ShopPage.tsx
在商店页面容器内部顶部添加占位框

#### 5.2 修改 shop.css
1. 添加顶部占位框样式（同上）
2. 修改 `.shop-page` 背景色为 `#252935`
3. 修改 `.shop-header` 背景色为 `#252935`
4. 修改 `.shop-currency` 背景色
5. 修改 `.shop-mode-buttons` 背景色
6. 统一字体颜色为 `#FFFFFF`

---

### 步骤6: 抽奖页面 (LotteryArea)

#### 6.1 修改 LotteryArea.tsx
在抽奖页面容器内部顶部添加占位框

#### 6.2 修改 lottery.css
1. 添加顶部占位框样式（同上）
2. 修改 `.lottery-area` 背景色为 `#252935`
3. 修改 `.lottery-header` 背景色为 `#252935`
4. 修改 `.lottery-currency` 背景色
5. 修改 `.lottery-probabilities` 背景色
6. 统一字体颜色为 `#FFFFFF`

---

### 步骤7: 战斗页面 (Battle)

#### 7.1 修改 Battle.tsx
在战斗页面容器内部顶部添加占位框

#### 7.2 修改 battle.css
1. 添加顶部占位框样式（同上）
2. 修改 `.battle-container` 背景色为 `#252935`
3. 修改 `.enemy-section`、`.player-section` 背景色
4. 修改 `.grid-cell` 背景色
5. 修改 `.battle-log-section` 背景色
6. 统一字体颜色为 `#FFFFFF`

---

### 步骤8: 幻兽融合页面 (PetFusionModal)

#### 8.1 修改 PetFusionModal.tsx
在融合页面容器内部顶部添加占位框

#### 8.2 修改 pet.css (融合页面部分)
1. 修改 `.pet-fusion-page-container` 背景色为 `#252935`
2. 修改 `.pet-fusion-page-header` 背景色为 `#252935`
3. 修改 `.pet-fusion-page-content` 背景色
4. 统一字体颜色为 `#FFFFFF`

---

## 统一样式规范

### 颜色规范
| 元素 | 颜色值 | 说明 |
|------|--------|------|
| 页面背景 | `#252935` | 主背景色 |
| 占位框背景 | `#252935` | 与页面背景一致 |
| 默认字体 | `#FFFFFF` | 白色 |
| 标题/重点文字 | `#ffd700` | 金色，保留 |
| 数值/等级 | `#4ecdc4` | 青色，保留 |
| 攻击力 | `#ff9800` | 橙色，保留 |
| 防御力 | `#2196f3` | 蓝色，保留 |
| 生命值 | `#ff6b6b` | 红色，保留 |
| 边框 | `#000000` 或 `#333` | 黑色/深灰 |

### 布局规范
- 顶部占位框：`height: 10vh`
- 页面内容区：`height: 90vh` 或使用 `flex: 1`
- 整体页面：`height: 100vh`

---

## 执行顺序
1. 角色页面 (CharacterPage)
2. 幻兽页面 (PetPage)
3. 背包页面 (InventoryPage)
4. 技能页面 (SkillPage)
5. 商店页面 (ShopPage)
6. 抽奖页面 (LotteryArea)
7. 战斗页面 (Battle)
8. 幻兽融合页面 (PetFusionModal)

---

## 注意事项
1. 保留特殊颜色（标题、数值、稀有度等）不变
2. 保持响应式设计不变
3. 保持动画效果不变
4. 每个页面修改后需要测试验证
