# 幻兽出战槽位数据结构重构计划

## 问题分析

当前 `deployedPets` 是通过 `pets.filter(pet => pet.isDeployed)` 动态派生的数组，存在两个问题：

1. **召回位置一的幻兽后，位置二的幻兽会自动移动到位置一** — 因为 `filter` 返回的数组会重新紧凑排列，原来的 `[petA, petB]` 在召回 petA 后变成 `[petB]`，petB 从索引1移到了索引0
2. **出战两只幻兽时位置会自动排序** — `filter` 的顺序取决于 `pets` 数组中元素的原始顺序，无法保持槽位稳定性

## 解决方案

将 `deployedPets` 从动态长度数组改为固定长度2的槽位数组 `(Pet | null)[]`：
- 始终包含2个元素：`[slot0, slot1]`
- 空槽位用 `null` 表示
- 召回时只清空对应槽位，不移动其他槽位
- 出战时填入第一个空槽位，不改变已有槽位

---

## 实施步骤

### 步骤1：修改 `src/App.tsx` — 增加出战槽位状态

**位置**：在 `pets` state 附近（约 L214 行之后）

**改动内容**：
1. 新增 `deployedPetSlots` state，类型 `(Pet | null)[]`，初始值 `[null, null]`
2. 在首次加载时，根据现有 `pets` 中 `isDeployed: true` 的幻兽初始化槽位（保持原有出战状态）

```typescript
// 新增出战槽位状态：固定2个槽位，空槽位为 null
const [deployedPetSlots, setDeployedPetSlots] = useState<(Pet | null)[]>(() => {
  const deployed = pets.filter(p => p.isDeployed);
  return [deployed[0] || null, deployed[1] || null];
});
```

---

### 步骤2：修改 `src/App.tsx` — 重写 `handleDeployPet`

**位置**：L3820-L3832

**改动内容**：
- 查找第一个 `null` 槽位，将幻兽填入该槽位
- 同时保持 `pets` 中 `isDeployed: true` 和 `isMerged: true` 的同步更新
- 如果两个槽位都不为空则直接返回（已满）

```typescript
const handleDeployPet = (petId: string) => {
  setDeployedPetSlots(prev => {
    // 检查是否已满
    const emptySlotIndex = prev.findIndex(slot => slot === null);
    if (emptySlotIndex === -1) return prev; // 已满2只
    
    // 在 pets 中找到该幻兽
    const pet = pets.find(p => p.id === petId);
    if (!pet) return prev;
    
    // 检查是否已出战（防止重复出战）
    if (prev.some(slot => slot?.id === petId)) return prev;
    
    const newSlots = [...prev];
    newSlots[emptySlotIndex] = pet;
    return newSlots;
  });
  
  // 同步更新 pets 中的 isDeployed 状态
  setPets(prev => prev.map(pet =>
    pet.id === petId
      ? { ...pet, isDeployed: true, isMerged: true }
      : pet
  ));
};
```

---

### 步骤3：修改 `src/App.tsx` — 重写 `handleRecallPet`

**位置**：L3780-L3786

**改动内容**：
- 查找匹配 `petId` 的槽位，将其置为 `null`
- 同时保持 `pets` 中 `isDeployed: false` 和 `isMerged: false` 的同步更新

```typescript
const handleRecallPet = (petId: string) => {
  setDeployedPetSlots(prev => 
    prev.map(slot => slot?.id === petId ? null : slot)
  );
  
  // 同步更新 pets 中的 isDeployed 状态
  setPets(prev => prev.map(pet =>
    pet.id === petId
      ? { ...pet, isDeployed: false, isMerged: false }
      : pet
  ));
};
```

---

### 步骤4：修改 `src/App.tsx` — 更新 JSX 中传递给 PetPage 的 prop

**位置**：L4744 附近

**改动内容**：
- 将 `deployedPets={getDeployedPets()}` 改为 `deployedPets={deployedPetSlots}`
- `getDeployedPets()` 保持不变，继续供 Battle 组件使用

---

### 步骤5：修改 `src/components/pet/PetPage.tsx` — 更新 Props 类型和内部逻辑

**改动内容**：

1. **Props 接口**（L30）：`deployedPets: Pet[]` → `deployedPets: (Pet | null)[]`

2. **`getDeployedPet1`**（L110-L112）：简化为 `return deployedPets[0] || null;`

3. **`getDeployedPet2`**（L117-L119）：简化为 `return deployedPets[1] || null;`

4. **`canDeployMore`**（L135）：改为 `deployedPets.filter(p => p !== null).length < 2`

5. **`getUndeployedPets`**（L125-L129）：改为过滤非 null 的 ID

6. **出战幻兽列表渲染**（L202-L216）：`deployedPets` 现在包含 null，需要用 `.filter((p): p is Pet => p !== null)` 过滤后再 `.map`

7. **出战数量显示**（L189-L193）：`deployedPets.length > 0` 改为 `deployedPets.some(p => p !== null)`，`deployedPets.length` 改为 `deployedPets.filter(p => p !== null).length`

8. **注释更新**：Props 注释中 `deployedPets` 描述改为"出战幻兽槽位数组（固定2个元素，空槽位为 null）"

---

### 步骤6：修改 `src/components/pet/README.md` — 更新文档

**改动内容**：
- 更新 `deployedPets` Props 说明：`Pet[]` → `(Pet | null)[]`，描述改为"固定2个槽位的出战幻兽数组"
- 更新 `getUndeployedPets` 相关描述

---

## 不需要修改的文件

| 文件 | 原因 |
|------|------|
| `DeployedPetSlot.tsx` | 已接受 `Pet \| null`，无需改动 |
| `PetListItem.tsx` | 仅透传 `onDeploy`/`onRecall` 回调，不直接使用 `deployedPets` |
| `PetDetailModal.tsx` | 仅透传 `onDeploy`，使用 `canDeploy`（传入 props） |
| `Battle.tsx` | 继续通过 `getDeployedPets()` 获取过滤后的纯净 `Pet[]` |
| `CombatPowerModal.tsx` | 自行通过 `pets.filter(pet => pet.isDeployed)` 计算，不依赖外部传入 |
| `types/index.ts` | `Pet` 接口无需修改 |

---

## 验证要点

1. 召回位置一的幻兽后，位置二的幻兽保持不动
2. 出战时自动填入第一个空槽位
3. 两只都出战时，槽位位置保持稳定，不会交换
4. 出战幻兽数量显示正确
5. 战斗系统继续正常工作（Battle 仍接收纯净 Pet[]）
6. 合体/解体功能正常
