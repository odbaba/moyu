# 装备精炼功能增强计划

## 需求分析

当前装备精炼弹窗只能选择背包中的装备，无法选择角色身上已装备的装备。需要修改为：
1. 装备精炼弹窗中可以选择角色身上的装备
2. 精炼完成后，需要正确更新角色装备信息和角色面板

## 当前实现分析

### 数据结构
- **inventoryEquipments**：背包中的装备列表（EquipmentItem[]）
- **equippedItems**：角色身上的装备槽位（Record<EquipmentSlotType, EquipmentDetail | null>）
- **character.equipment**：从 equippedItems 同步的角色装备数据

### 相关文件
1. **EquipmentRefineModal.tsx**：装备精炼弹窗组件
   - 只接收 `inventoryEquipments` 参数
   - 无法访问角色身上的装备

2. **App.tsx**：
   - 调用 EquipmentRefineModal 组件
   - handleRefine 函数目前只记录日志，未实现装备更新逻辑

3. **equipmentConverter.ts**：
   - equipmentItemToDetail：将背包装备转换为槽位装备
   - equipmentDetailToItem：将槽位装备转换为背包装备

## 实现方案

### 第一步：修改 EquipmentRefineModal 组件

#### 1.1 扩展 Props 接口
在 `EquipmentRefineModalProps` 中添加：
```typescript
/** 角色身上已装备的装备列表 */
equippedItems: Record<EquipmentSlotType, EquipmentDetail | null>;
```

#### 1.2 合并装备列表
创建一个新的 useMemo，将背包装备和角色装备合并：
```typescript
const allEquipments = useMemo(() => {
  // 从角色装备中提取非空装备，转换为 EquipmentItem 类型
  const equippedList: EquipmentItem[] = Object.values(equippedItems)
    .filter((item): item is EquipmentDetail => item !== null)
    .map(detail => equipmentDetailToItem(detail));

  // 合并背包装备和角色装备
  return [...inventoryEquipments, ...equippedList];
}, [inventoryEquipments, equippedItems]);
```

#### 1.3 修改装备过滤逻辑
将 `availableEquipments` 的数据源从 `inventoryEquipments` 改为 `allEquipments`：
```typescript
const availableEquipments = useMemo(() => {
  return allEquipments.filter(item => item.useLevel <= playerLevel);
}, [allEquipments, playerLevel]);
```

#### 1.4 标识装备来源
在装备显示时，需要标识装备是来自背包还是角色装备：
- 可以通过检查 `equippedItems` 中是否存在该装备的 ID 来判断
- 在装备名称或图标上添加标识（如"已装备"标签）

### 第二步：修改 App.tsx

#### 2.1 传递 equippedItems 给 EquipmentRefineModal
在调用 EquipmentRefineModal 时添加 equippedItems 参数：
```typescript
<EquipmentRefineModal
  // ... 其他参数
  equippedItems={equippedItems}
/>
```

#### 2.2 实现 handleRefine 函数的装备更新逻辑

需要判断精炼的装备是背包装备还是角色装备：

```typescript
const handleRefine = (result: RefineResult) => {
  // 记录到交互日志
  setInteractionLog(prev => [...prev, result.message]);

  // 如果精炼成功，更新装备属性
  if (result.success && refineEquipment) {
    // 检查是否是角色装备
    const isEquipped = Object.values(equippedItems).some(
      item => item?.id === refineEquipment.id
    );

    if (isEquipped) {
      // 更新角色装备
      setEquippedItems(prev => {
        const updated = { ...prev };
        const slotType = refineEquipment.equipmentType;
        if (updated[slotType]) {
          // 将精炼后的装备转换为 EquipmentDetail 并更新
          updated[slotType] = equipmentItemToDetail(refineEquipment);
        }
        return updated;
      });
    } else {
      // 更新背包装备
      setInventory(prev => {
        return prev.map(item => {
          if (item.id === refineEquipment.id && item.type === 'equipment') {
            return refineEquipment;
          }
          return item;
        });
      });
    }
  }
};
```

### 第三步：确保角色面板自动更新

由于 `characterWithPetBonus` 已经通过 useMemo 从 `equippedItems` 同步数据：
```typescript
const characterWithPetBonus: CharacterData = useMemo(() => {
  // ...
  return {
    ...character,
    equipment: {
      weapon: equippedItems.weapon,
      helmet: equippedItems.helmet,
      // ...
    }
  };
}, [character, equippedItems, pets]);
```

因此，当 `equippedItems` 更新时，角色面板会自动更新，无需额外处理。

## 实现步骤

### Task 1: 修改 EquipmentRefineModal 组件
- [ ] Task 1.1: 在 EquipmentRefineModalProps 接口中添加 equippedItems 参数
- [ ] Task 1.2: 导入 equipmentDetailToItem 函数
- [ ] Task 1.3: 创建 allEquipments 合并背包装备和角色装备
- [ ] Task 1.4: 修改 availableEquipments 使用 allEquipments 作为数据源
- [ ] Task 1.5: 添加装备来源标识逻辑（可选，提升用户体验）

### Task 2: 修改 App.tsx
- [ ] Task 2.1: 在 EquipmentRefineModal 调用处添加 equippedItems 参数
- [ ] Task 2.2: 实现 handleRefine 函数的装备更新逻辑
  - [ ] Task 2.2.1: 判断装备是背包装备还是角色装备
  - [ ] Task 2.2.2: 更新角色装备（setEquippedItems）
  - [ ] Task 2.2.3: 更新背包装备（setInventory）

### Task 3: 测试验证
- [ ] Task 3.1: 测试选择背包装备进行精炼
- [ ] Task 3.2: 测试选择角色装备进行精炼
- [ ] Task 3.3: 验证精炼后角色面板是否正确更新
- [ ] Task 3.4: 验证战斗力计算是否正确

## 注意事项

1. **装备 ID 唯一性**：确保背包装备和角色装备的 ID 不会冲突
2. **类型转换**：注意 EquipmentItem 和 EquipmentDetail 之间的转换
3. **状态同步**：确保 equippedItems 更新后，characterWithPetBonus 会自动重新计算
4. **用户体验**：在装备列表中标识装备来源，避免用户混淆

## 风险评估

- **低风险**：修改范围明确，只涉及装备精炼功能
- **兼容性**：不影响其他功能，向后兼容
- **测试难度**：测试场景清晰，易于验证
