# 日常任务官交互逻辑优化计划

## 一、优化目标

优化日常任务官的交互逻辑，使其更加符合游戏设计，提供更好的用户体验。

## 二、需求分析

### 2.1 用户需求

1. **去除无用选项**：移除"完成任务"和"查看任务进度"选项
2. **增加任务描述**：在NPC描述中增加当天任务的描述
3. **优化接受任务逻辑**：
   - 提交物品/幻兽：弹出确认弹窗，确认后完成任务获得奖励
   - 消灭冰雪巨人：自动寻路至雪域边境
   - PK赛：自动寻路至皇宫和PK赛报名官交互
   - 地下城：暂时不做

### 2.2 当前实现分析

#### NPC配置（src/data/npcData.ts）
- 当前有5个选项：接受任务、完成任务、查看任务进度、关于日常任务、随便问问
- 需要移除"完成任务"和"查看任务进度"

#### NPC描述
- 当前描述是固定的："负责发布每日任务的官员。每天都有不同的任务等待着你！"
- 需要根据当天任务动态生成描述

#### 接受任务逻辑（src/App.tsx）
- 当前只是显示任务描述
- 需要根据任务类型执行不同的操作

## 三、实施方案

### 3.1 修改NPC配置

**文件**：`src/data/npcData.ts`

**修改内容**：
1. 移除"完成任务"选项（第283-288行）
2. 移除"查看任务进度"选项（第289-294行）
3. 保留"接受任务"、"关于日常任务"、"随便问问"三个选项

### 3.2 动态生成NPC描述

**文件**：`src/App.tsx`

**实现方案**：
在点击NPC打开对话框时，动态生成包含当天任务描述的NPC描述。

**具体步骤**：
1. 在 `handleInteract` 函数中，当 `interactable.type === 'npc'` 且 `interactable.id === 'npc_daily_task'` 时
2. 使用 `getDailyTaskDescriptionByWeekday()` 函数获取当天任务描述
3. 将任务描述附加到NPC的description字段中
4. 设置到 `currentNPCData` 状态

**代码位置**：`src/App.tsx` 第432行附近

### 3.3 优化接受任务逻辑

**文件**：`src/App.tsx`

**修改位置**：`acceptDailyTask` case（第773-786行）

**实现逻辑**：

#### 3.3.1 收集宝石任务（周一、周二）
```typescript
case 'acceptDailyTask': {
  const weekday = timeSystem.nowday % 7;
  const task = getDailyTask(weekday);

  if (!task) {
    setInteractionLog(prev => [...prev, '今天没有可接受的任务']);
    break;
  }

  // 根据任务类型执行不同操作
  switch (task.type) {
    case 'collect': {
      // 收集宝石任务
      const requirement = calculateGemRequirement(character.level);

      // 检查背包中是否有足够的物品
      if (checkGemInInventory(inventory, requirement.type, requirement.quantity)) {
        // 弹出确认弹窗
        // 使用 InfoModal 显示确认信息
        setInfoModalTitle('确认提交物品');
        setInfoModalContent(`确定要提交 ${requirement.quantity} 个${requirement.type}吗？\n\n奖励：${calculateGemReward(requirement.type, requirement.quantity).description}`);
        setShowInfoModal(true);

        // 需要添加确认按钮的处理逻辑
        // 可以通过 actionParams 传递确认状态
      } else {
        setInteractionLog(prev => [...prev, `背包中没有足够的${requirement.type}！\n需要：${requirement.quantity}个`]);
      }
      break;
    }

    case 'train': {
      // 训练幻兽任务
      const validPets = getValidPetsForTraining(pets);

      if (validPets.length > 0) {
        // 弹出幻兽选择弹窗
        // 需要创建一个新的弹窗组件或复用现有弹窗
        // 显示符合条件的幻兽列表，让玩家选择
      } else {
        setInteractionLog(prev => [...prev, '没有符合条件的幻兽！\n需要：攻防型幻兽，品质分≥500']);
      }
      break;
    }

    case 'raid': {
      // 突袭任务：自动寻路到雪域边境
      setShowNPCModal(false); // 关闭NPC对话框
      handleAutoMove('xueyu-bianjing');
      setInteractionLog(prev => [...prev, '正在前往雪域边境...']);
      break;
    }

    case 'pk': {
      // PK赛任务：自动寻路到皇宫
      setShowNPCModal(false); // 关闭NPC对话框
      handleAutoMove('huanggong');
      setInteractionLog(prev => [...prev, '正在前往皇宫...请找PK赛报名官报名']);
      break;
    }

    case 'dungeon': {
      // 地下城任务：暂时不做
      setInteractionLog(prev => [...prev, '地下城任务暂未开放，敬请期待！']);
      break;
    }
  }
  break;
}
```

### 3.4 实现物品提交确认

**方案A：使用 InfoModal 组件**
- 优点：简单快速，复用现有组件
- 缺点：InfoModal 通常只用于显示信息，可能需要修改以支持确认按钮

**方案B：创建新的确认弹窗组件**
- 优点：更灵活，可以自定义按钮和回调
- 缺点：需要创建新组件

**推荐方案**：使用方案A，修改 InfoModal 组件以支持确认/取消按钮

**文件**：`src/components/common/InfoModal.tsx`

**修改内容**：
1. 添加 `onConfirm` 和 `onCancel` 回调props
2. 添加确认和取消按钮
3. 根据是否有回调来决定是否显示按钮

### 3.5 实现幻兽选择弹窗

**方案A：创建新的幻兽选择弹窗组件**
- 文件：`src/components/common/PetSelectModal.tsx`
- 功能：显示符合条件的幻兽列表，支持选择和确认

**方案B：复用现有的幻兽页面**
- 在幻兽页面中添加"任务提交"模式
- 允许选择幻兽并确认提交

**推荐方案**：使用方案A，创建专用的幻兽选择弹窗

**组件设计**：
```typescript
interface PetSelectModalProps {
  isVisible: boolean;
  pets: Pet[]; // 符合条件的幻兽列表
  onSelect: (petId: string) => void; // 选择幻兽的回调
  onCancel: () => void; // 取消的回调
}
```

### 3.6 实现奖励发放

**文件**：`src/App.tsx`

**需要更新的状态**：
- `character.exp` - 经验值
- `playerResources.merit` - 功勋值
- `playerResources.magicStone` - 魔石
- `battleExp` - 战功
- `inventory` - 背包（消耗物品）
- `pets` - 幻兽列表（消耗幻兽）
- `dailyTaskState` - 任务状态（标记任务完成）

**奖励发放函数**：
```typescript
const giveTaskReward = (reward: DailyTaskReward) => {
  // 更新经验值
  if (reward.exp) {
    setCharacter(prev => ({
      ...prev,
      exp: prev.exp + reward.exp!,
    }));
  }

  // 更新功勋值
  if (reward.merit) {
    setPlayerResources(prev => ({
      ...prev,
      merit: prev.merit + reward.merit!,
    }));
  }

  // 更新战功
  if (reward.battleExp) {
    _setBattleExp(prev => prev + reward.battleExp!);
  }

  // 更新魔石
  if (reward.magicStone) {
    setPlayerResources(prev => ({
      ...prev,
      magicStone: prev.magicStone + reward.magicStone!,
    }));
  }
};
```

## 四、实施步骤

### 步骤1：修改NPC配置（优先级：高）
- 文件：`src/data/npcData.ts`
- 操作：移除无用选项
- 预计时间：5分钟

### 步骤2：实现动态NPC描述（优先级：高）
- 文件：`src/App.tsx`
- 操作：在 `handleInteract` 中添加动态描述逻辑
- 预计时间：15分钟

### 步骤3：修改InfoModal组件（优先级：高）
- 文件：`src/components/common/InfoModal.tsx`
- 操作：添加确认/取消按钮支持
- 预计时间：20分钟

### 步骤4：实现收集宝石任务逻辑（优先级：高）
- 文件：`src/App.tsx`
- 操作：实现物品检查、确认弹窗、奖励发放
- 预计时间：30分钟

### 步骤5：创建幻兽选择弹窗（优先级：中）
- 文件：`src/components/common/PetSelectModal.tsx`（新建）
- 操作：创建幻兽选择弹窗组件
- 预计时间：30分钟

### 步骤6：实现训练幻兽任务逻辑（优先级：中）
- 文件：`src/App.tsx`
- 操作：实现幻兽检查、选择弹窗、奖励发放
- 预计时间：30分钟

### 步骤7：实现突袭任务逻辑（优先级：中）
- 文件：`src/App.tsx`
- 操作：实现自动寻路到雪域边境
- 预计时间：10分钟

### 步骤8：实现PK赛任务逻辑（优先级：中）
- 文件：`src/App.tsx`
- 操作：实现自动寻路到皇宫
- 预计时间：10分钟

### 步骤9：实现地下城任务逻辑（优先级：低）
- 文件：`src/App.tsx`
- 操作：显示暂未开放提示
- 预计时间：5分钟

### 步骤10：测试和优化（优先级：低）
- 操作：测试所有任务类型的完整流程
- 预计时间：30分钟

## 五、注意事项

### 5.1 用户体验
- 确认弹窗要清晰显示奖励信息
- 自动寻路时要关闭NPC对话框
- 错误提示要明确说明缺少什么

### 5.2 数据一致性
- 确保物品消耗后正确更新背包
- 确保幻兽消耗后正确更新幻兽列表
- 确保奖励发放后正确更新玩家资源
- 确保任务完成后正确更新任务状态

### 5.3 代码规范
- 所有新增代码必须添加详细注释
- 遵循项目现有的代码风格
- 复用现有的工具函数和组件

### 5.4 兼容性
- 不破坏已有的功能
- 确保其他NPC的交互不受影响

## 六、预期效果

### 6.1 功能完整性
- 移除无用的NPC选项
- NPC描述包含当天任务信息
- 所有任务类型都有正确的处理逻辑

### 6.2 用户体验
- 清晰的任务指引
- 流畅的任务完成流程
- 明确的奖励反馈

### 6.3 系统稳定性
- 准确的物品和幻兽检查
- 可靠的奖励发放机制
- 完善的错误处理

## 七、相关文档

- 参考文档：`/reference/docs/日常任务官交互逻辑文档.md`
- NPC系统文档：`/reference/docs/scripts_analysis/14_NPC系统.md`
- 时间系统文档：`/reference/docs/scripts_analysis/12_时间与精力系统.md`

## 八、风险评估

### 8.1 技术风险
- **低风险**：NPC配置修改简单直接
- **中风险**：InfoModal组件修改需要确保不影响其他使用场景
- **低风险**：自动寻路功能已存在，只需调用

### 8.2 兼容性风险
- **低风险**：修改只影响日常任务官NPC
- **低风险**：新增功能不影响现有系统

### 8.3 用户体验风险
- **低风险**：任务流程清晰，易于理解
- **低风险**：奖励机制明确，用户反馈良好

## 九、总结

本计划旨在优化日常任务官的交互逻辑，通过移除无用选项、增加动态任务描述、完善任务处理逻辑，提供更好的用户体验。实施过程分为10个步骤，预计总时间约3小时。
