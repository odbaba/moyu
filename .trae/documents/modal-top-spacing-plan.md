# 弹窗样式统一修改计划

## 目标
所有弹窗离页面最上方需要保持至少10%屏幕高度，当展示不下后可以进行滚动展示，但要隐藏滚动条。

## 需要修改的文件

### 1. 公共样式文件
- `src/components/common/common.css` - 公共 `.modal-overlay` 样式

### 2. 独立弹窗样式文件
| 文件路径 | 弹窗类名 | 说明 |
|---------|---------|------|
| `src/components/common/CollectorModal.css` | `.collector-modal-overlay` | ✅ 已修改 |
| `src/components/common/EquipmentRefineModal.css` | `.refine-modal-overlay` | 装备精炼弹窗 |
| `src/components/common/EquipmentDetailModal.css` | `.equipment-detail-modal-overlay` | 装备详情弹窗 |
| `src/components/common/GiftSelectModal.css` | `.gift-select-modal-overlay` | 送礼选择弹窗 |
| `src/components/inventory/ItemDetailModal.css` | `.item-detail-modal-overlay` | 物品详情弹窗 |
| `src/components/inventory/UseItemTargetModal.css` | `.use-item-modal-overlay` | 使用物品目标弹窗 |
| `src/components/pet/pet.css` | `.pet-detail-modal-overlay` | 幻兽详情弹窗 |
| `src/components/pet/pet.css` | `.pet-select-modal-overlay` | 幻兽选择弹窗 |
| `src/components/pet/pet.css` | `.fusion-help-modal-overlay` | 幻化帮助弹窗 |
| `src/components/battle/battle.css` | `.detail-modal-overlay` | 战斗详情弹窗 |

## 修改方案

### Overlay 层修改
每个弹窗的 overlay 层需要添加以下样式：

```css
.xxx-modal-overlay {
  /* 原有样式保持不变 */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* ... */
  
  /* 新增/修改的样式 */
  align-items: flex-start;  /* 从 center 改为 flex-start */
  padding-top: 10vh;        /* 新增：距离顶部10%屏幕高度 */
  overflow-y: auto;         /* 新增：支持垂直滚动 */
  scrollbar-width: none;    /* 新增：隐藏滚动条 (Firefox) */
  -ms-overflow-style: none; /* 新增：隐藏滚动条 (IE/Edge) */
}

/* 新增：隐藏滚动条 (Chrome/Safari) */
.xxx-modal-overlay::-webkit-scrollbar {
  display: none;
}
```

## 实施步骤

1. 修改 `src/components/common/common.css` 中的 `.modal-overlay` 公共样式
2. 修改 `src/components/common/EquipmentRefineModal.css` 中的 `.refine-modal-overlay`
3. 修改 `src/components/common/EquipmentDetailModal.css` 中的 `.equipment-detail-modal-overlay`
4. 修改 `src/components/common/GiftSelectModal.css` 中的 `.gift-select-modal-overlay`
5. 修改 `src/components/inventory/ItemDetailModal.css` 中的 `.item-detail-modal-overlay`
6. 修改 `src/components/inventory/UseItemTargetModal.css` 中的 `.use-item-modal-overlay`
7. 修改 `src/components/pet/pet.css` 中的三个弹窗 overlay
8. 修改 `src/components/battle/battle.css` 中的 `.detail-modal-overlay`

## 注意事项
- CollectorModal.css 已经修改完成，无需再次修改
- 需要确保弹窗内容区域（content）有合适的 max-height 限制，避免内容过长
- 隐藏滚动条后仍需保持滚动功能正常
