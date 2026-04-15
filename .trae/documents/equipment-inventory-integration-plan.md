# 装备模块与背包模块关联实施计划

## 需求分析

建立装备模块和背包模块的联系，实现以下功能：
1. 装备模块初始显示六个装备位的空栏位
2. 点击空栏位弹出对应类型的背包装备列表
3. 点击背包装备弹出装备详情，右上角有"装备"按钮
4. 装备后增加角色属性
5. 已装备的栏位点击后显示详情，有"替换"按钮

## 当前实现分析

### 现有组件
- **EquipmentDisplay**: 显示装备列表，但没有空栏位概念
- **EquipmentModal**: 显示装备详情，但没有装备/替换按钮
- **InventoryPage**: 背包页面，有分类筛选功能
- **CharacterPage**: 角色页面，整合角色信息和装备展示
- **EquipmentItem**: 背包中的装备物品类型
- **EquipmentDetail**: 角色装备槽位的装备类型

### 关键问题
1. 装备槽位状态在 App.tsx 中通过 CharacterData.equipment 管理
2. 背包中的装备是 EquipmentItem 类型，装备槽位是 EquipmentDetail 类型
3. 需要实现两种类型的转换

## 实施步骤

### Step 1: 扩展 App.tsx 状态管理
- 添加装备槽位状态 `equippedItems: Record<EquipmentSlotType, EquipmentDetail | null>`
- 添加装备/卸下装备的处理函数
- 将装备状态传递给 CharacterPage

### Step 2: 创建装备选择弹窗组件
创建 `src/components/character/EquipmentSelectModal.tsx`:
- 接收装备类型参数，过滤背包中对应类型的装备
- 显示可装备列表
- 点击装备后弹出详情

### Step 3: 修改 EquipmentDisplay 组件
- 显示六个固定槽位（包括空栏位）
- 空栏位显示装备类型图标和"空"文字
- 点击空栏位触发 `onEmptySlotClick(slotType)` 回调
- 点击已装备栏位触发 `onEquipmentClick(equipment)` 回调

### Step 4: 修改 EquipmentModal 组件
- 添加 `onEquip` 回调（装备按钮）
- 添加 `onReplace` 回调（替换按钮）
- 添加 `isEquipped` 属性判断是否已装备
- 添加 `canEquip` 属性判断是否可装备

### Step 5: 创建装备详情弹窗（背包装备用）
创建 `src/components/character/InventoryEquipmentModal.tsx`:
- 显示背包中装备的详情
- 右上角显示"装备"按钮
- 点击装备后调用装备逻辑

### Step 6: 修改 CharacterPage 组件
- 接收装备槽位状态和背包物品
- 管理装备选择弹窗状态
- 处理空栏位点击 -> 打开装备选择弹窗
- 处理已装备栏位点击 -> 打开装备详情（有替换按钮）

### Step 7: 实现装备逻辑
- `equipItem(item: EquipmentItem)`: 装备物品
  - 从背包移除物品
  - 转换为 EquipmentDetail 类型
  - 放入对应装备槽位
  - 更新角色属性
- `unequipItem(slotType: EquipmentSlotType)`: 卸下装备
  - 从装备槽位移除
  - 转换为 EquipmentItem 类型
  - 放入背包
  - 更新角色属性
- `replaceItem(slotType, newItem)`: 替换装备
  - 先卸下当前装备
  - 再装备新装备

### Step 8: 添加类型转换工具函数
创建 `src/utils/equipmentConverter.ts`:
- `equipmentItemToDetail(item: EquipmentItem): EquipmentDetail`
- `equipmentDetailToItem(detail: EquipmentDetail): EquipmentItem`

## 文件修改清单

| 文件路径 | 操作 | 说明 |
|---------|------|------|
| `src/App.tsx` | 修改 | 添加装备状态管理和处理函数 |
| `src/components/character/CharacterPage.tsx` | 修改 | 整合装备选择逻辑 |
| `src/components/character/EquipmentDisplay.tsx` | 修改 | 显示空栏位，添加点击回调 |
| `src/components/character/EquipmentModal.tsx` | 修改 | 添加装备/替换按钮 |
| `src/components/character/EquipmentSelectModal.tsx` | 新建 | 装备选择弹窗 |
| `src/components/character/InventoryEquipmentModal.tsx` | 新建 | 背包装备详情弹窗 |
| `src/utils/equipmentConverter.ts` | 新建 | 类型转换工具 |
| `src/components/character/character.css` | 修改 | 添加空栏位样式 |

## 数据流设计

```
用户点击空栏位
    ↓
CharacterPage 触发 onEmptySlotClick(slotType)
    ↓
打开 EquipmentSelectModal，过滤对应类型装备
    ↓
用户点击背包装备
    ↓
打开 InventoryEquipmentModal 显示详情
    ↓
用户点击"装备"按钮
    ↓
调用 onEquip(item)
    ↓
App.tsx 执行 equipItem 逻辑
    ↓
更新 equippedItems 状态和 inventory 状态
    ↓
角色属性自动更新（通过 calculateTotalCharacterAttributes）
```

## UI 交互设计

### 空栏位样式
- 显示装备类型图标（如 ⚔️ 武器）
- 显示"空"文字
- 虚线边框表示可点击

### 装备选择弹窗
- 标题：选择要装备的[装备类型]
- 列表显示该类型的所有背包装备
- 每个装备项显示：图标、名称、品质、等级

### 装备详情弹窗
- 已装备状态：右上角显示"替换"按钮
- 未装备状态（背包中）：右上角显示"装备"按钮
- 底部显示"卸下"按钮（仅已装备状态）
