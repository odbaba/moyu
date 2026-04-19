# 幻兽幻化页面选择幻兽弹窗优化计划

## 需求分析

1. **主幻兽选择弹窗**：出战中的幻兽也需要能被选择（不排除出战幻兽）
2. **副幻兽选择弹窗**：需排除出战中状态的幻兽（保持当前行为）
3. **幻化结束后**：需要及时更新角色面板

## 当前问题

`PetSelectModal` 组件当前会排除所有 `deployedPetIds` 中的幻兽，无法区分主/副幻兽选择场景。

## 实现步骤

### 步骤1：修改 PetSelectModal 组件

**文件**：`src/components/pet/PetSelectModal.tsx`

1. 添加新的属性 `excludeDeployed?: boolean`，默认为 `true`
2. 修改 `availablePets` 的过滤逻辑，根据 `excludeDeployed` 参数决定是否排除出战幻兽

```typescript
interface PetSelectModalProps {
  // ... 现有属性
  excludeDeployed?: boolean; // 是否排除出战幻兽，默认 true
}

const availablePets = useMemo(() => {
  // 创建需要排除的ID集合
  const excludeSet = new Set([...excludePetIds]);
  
  // 如果需要排除出战幻兽，则添加到排除集合
  if (excludeDeployed) {
    deployedPetIds.forEach(id => excludeSet.add(id));
  }
  
  // 过滤出可选择的幻兽
  return pets.filter(pet => !excludeSet.has(pet.id));
}, [pets, deployedPetIds, excludePetIds, excludeDeployed]);
```

### 步骤2：修改 PetFusionModal 组件

**文件**：`src/components/pet/PetFusionModal.tsx`

修改 `PetSelectModal` 的调用，根据 `selectType` 决定是否排除出战幻兽：

```typescript
<PetSelectModal
  isVisible={showSelectModal}
  onClose={() => setShowSelectModal(false)}
  pets={pets}
  deployedPetIds={deployedPetIds}
  onSelect={handlePetSelect}
  excludePetIds={excludePetIds}
  excludeDeployed={selectType === 'sub'} // 主幻兽不排除出战幻兽，副幻兽排除
  title={selectType === 'main' ? '选择主幻兽' : '选择副幻兽'}
/>
```

### 步骤3：验证角色面板更新

**文件**：`src/App.tsx`

确认幻化结束后角色面板会自动更新：
- `handleUpdatePet` 更新主幻兽 → `pets` 状态变化
- `handleRemovePet` 移除副幻兽 → `pets` 状态变化
- `characterWithPetBonus` 通过 `useMemo` 依赖于 `pets`，会自动重新计算

当前实现已经满足需求，无需额外修改。

## 涉及文件

1. `src/components/pet/PetSelectModal.tsx` - 添加 `excludeDeployed` 参数
2. `src/components/pet/PetFusionModal.tsx` - 根据选择类型传递 `excludeDeployed` 参数

## 测试要点

1. 主幻兽选择弹窗：出战中的幻兽可以被选择
2. 副幻兽选择弹窗：出战中的幻兽不可被选择
3. 幻化结束后：角色面板的幻兽合体加成正确更新
