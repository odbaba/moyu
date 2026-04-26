# 移除幻兽研究所弹窗中的提高产量任务按钮，改为NPC交互确认弹窗

## 任务目标
将提高产量任务从幻兽研究所弹窗中移除，改为在NPC交互界面点击"提高产量任务"时显示确认弹窗。

## 当前实现
1. `npcData.ts` 中幻兽研究所NPC有"提高产量任务"选项，actionType为`improveProduction`
2. `App.tsx` 中`improveProduction` case会打开`PetInstituteModal`
3. `PetInstituteModal.tsx` 中有提高产量任务按钮和相关逻辑

## 目标实现
点击NPC交互的"提高产量任务"选项时，显示确认弹窗：
```
提高产量任务已开放！

所需灵魂王：X 个
经验奖励：X
完成次数：X / 6

离开  |  接受
```

## 实施步骤

### Step 1: 添加 InfoModal 按钮文本状态
在 App.tsx 中添加：
- `infoModalConfirmText` 状态
- `infoModalCancelText` 状态
- 在 InfoModal 组件中传递这些属性

### Step 2: 修改 App.tsx 中的 improveProduction case
- 使用现有的 InfoModal 组件
- 设置 `confirmText` 为"接受"，`cancelText` 为"离开"
- 设置 `onConfirm` 为执行提高产量任务的逻辑
- 弹窗内容显示任务信息

### Step 3: 移除 PetInstituteModal.tsx 中的提高产量任务相关代码
- 移除 `onImproveProduction` prop
- 移除 `productionCheck` 相关逻辑
- 移除 `handleImproveProduction` 函数
- 移除提高产量任务按钮
- 移除任务提示区域

### Step 4: 更新相关类型和导入
- 更新 PetInstituteModalProps 接口
- 移除不需要的导入（canImproveProduction, improveProduction, MAX_PRODUCTION_RATE）

### Step 5: 测试验证
- 构建通过
- 功能正常

## 文件修改清单
1. `src/App.tsx` - 添加按钮文本状态，修改 improveProduction case 逻辑
2. `src/components/pet/PetInstituteModal.tsx` - 移除提高产量任务相关代码

## 详细代码修改

### App.tsx 修改 - 添加状态
```typescript
// 信息弹窗状态
const [showInfoModal, setShowInfoModal] = useState(false);
const [infoModalTitle, setInfoModalTitle] = useState('');
const [infoModalContent, setInfoModalContent] = useState('');
const [infoModalOnConfirm, setInfoModalOnConfirm] = useState<(() => void) | undefined>(undefined);
const [infoModalConfirmText, setInfoModalConfirmText] = useState<string | undefined>(undefined);
const [infoModalCancelText, setInfoModalCancelText] = useState<string | undefined>(undefined);
```

### App.tsx 修改 - InfoModal 组件
```tsx
<InfoModal
  isVisible={showInfoModal}
  onClose={() => {
    setShowInfoModal(false);
    setInfoModalOnConfirm(undefined);
    setInfoModalConfirmText(undefined);
    setInfoModalCancelText(undefined);
  }}
  title={infoModalTitle}
  content={infoModalContent}
  onConfirm={infoModalOnConfirm}
  confirmText={infoModalConfirmText}
  cancelText={infoModalCancelText}
/>
```

### App.tsx 修改 - improveProduction case
```typescript
case 'improveProduction':
  // 提高产量任务（每周一次）
  if (petInstituteState.canDoProductionTask && petInstituteState.productionRate < 6) {
    // 计算所需灵魂王和经验奖励
    const requiredSoulKings = PRODUCTION_TASK_SOUL_KING_COST[petInstituteState.productionRate] || 0;
    const expReward = PRODUCTION_TASK_EXP_REWARD[petInstituteState.productionRate] || 0;
    
    // 检查背包中灵魂王数量
    const soulKingCount = inventory
      .filter(item => item.name === '灵魂王')
      .reduce((sum, item) => sum + item.quantity, 0);
    
    // 构建弹窗内容
    const content = `提高产量任务已开放！\n\n所需灵魂王：${requiredSoulKings} 个\n经验奖励：${expReward}\n完成次数：${petInstituteState.productionRate} / 6`;
    
    setInfoModalTitle('提高产量任务');
    setInfoModalContent(content);
    setInfoModalConfirmText('接受');
    setInfoModalCancelText('离开');
    setInfoModalOnConfirm(() => {
      // 检查灵魂王是否足够
      if (soulKingCount < requiredSoulKings) {
        setInteractionLog(prev => [...prev, `灵魂王不足，需要 ${requiredSoulKings} 个，当前 ${soulKingCount} 个`]);
        return;
      }
      
      // 执行提高产量任务
      const result = improveProduction(petInstituteState, inventory);
      if (result.success) {
        // 消耗灵魂王
        const newInventory = consumeItemFromInventory(inventory, '灵魂王', result.consumedSoulKings);
        setInventory(newInventory);
        
        // 计算带战斗力加成的经验值
        const bonusExp = calculateCombatPowerBonusExp(result.expGained, character.combatPower, character.level);
        
        // 更新角色经验
        setCharacter(prev => {
          const charResult = gainCharacterExperience(prev, bonusExp);
          if (charResult.message) {
            setInteractionLog(logs => [...logs, charResult.message!]);
          }
          return charResult.character;
        });
        
        // 更新幻兽经验
        setPets(prevPets => {
          return prevPets.map(pet => {
            if (!pet.isDeployed) return pet;
            const petResult = gainExperience(pet, bonusExp, character.level);
            if (petResult.message) {
              setInteractionLog(logs => [...logs, petResult.message!]);
            }
            return petResult.pet;
          });
        });
        
        // 更新研究所状态
        setPetInstituteState(prev => ({
          ...prev,
          productionRate: Math.min(prev.productionRate + 1, 6),
          vipLevel: Math.min(prev.vipLevel + result.vipGained, 10),
          canDoProductionTask: false
        }));
        
        setInteractionLog(prev => [...prev, `完成提高产量任务！生产量+1，获得经验 ${bonusExp.toLocaleString()}，VIP星级 +${result.vipGained}`]);
      }
    });
    setShowInfoModal(true);
  } else if (!petInstituteState.canDoProductionTask) {
    setInteractionLog(prev => [...prev, '本周提高产量任务已完成！']);
  } else {
    setInteractionLog(prev => [...prev, '生产量已达上限！']);
  }
  break;
```

### PetInstituteModal.tsx 修改
- 移除 `onImproveProduction` prop
- 移除 `canImproveProduction`, `improveProduction`, `MAX_PRODUCTION_RATE` 导入
- 移除 `productionCheck` 相关逻辑
- 移除 `handleImproveProduction` 函数
- 移除提高产量任务按钮
- 移除任务提示区域
