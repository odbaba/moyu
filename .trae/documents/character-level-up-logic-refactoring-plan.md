# 角色升级逻辑重构计划

## 一、问题分析

当前角色升级逻辑存在以下问题：

1. **缺少统一的经验获取接口**：获得经验时直接增加经验值，没有检查是否升级
2. **升级逻辑缺失**：经验值超过 maxExp 时没有自动升级
3. **属性更新不完整**：升级后没有正确更新角色的各项属性
4. **逻辑分散**：经验获取逻辑分散在多个地方（战斗结束、使用经验球、完成任务），没有统一处理

## 二、重构目标

参考幻兽升级逻辑，为角色创建统一的 `gainExperience` 函数：

1. **封装升级逻辑**：在 `attributeCalculator.ts` 中创建 `gainExperience` 函数
2. **实现完整升级机制**：包括经验检查、升级循环、属性更新
3. **统一调用接口**：战斗结束、使用经验球、完成任务时调用同一方法
4. **符合文档规范**：严格按照角色升级规则实现

## 三、实施方案

### 3.1 创建角色经验获取函数

**文件**：`src/utils/attributeCalculator.ts`

**新增函数**：`gainCharacterExperience(character, expAmount)`

**功能**：
- 检查经验值是否足够升级
- 升级循环处理（可能连续升级）
- 经验需求递增规则（使用 `MAX_EXP_TABLE` 预计算表）
- 升级后更新属性（HP、MP、攻击、防御等）
- 等级上限检查（最高125级）

**返回值**：
```typescript
{
  character: CharacterData;  // 更新后的角色数据
  leveledUp: boolean;        // 是否升级
  levelUpCount: number;      // 升级次数
  message?: string;          // 提示消息
}
```

### 3.2 角色升级规则

参考 `MAX_EXP_TABLE` 预计算表：

1. **1-19级**：每次升级所需经验 = 上一级 × 1.2
2. **20-50级**：每次升级所需经验 = 上一级 × 1.1
3. **51-125级**：每次升级所需经验 = 上一级 + hun（51级时计算固定值）

### 3.3 角色属性更新规则

升级时需要更新的属性：

1. **等级**：level + 1
2. **最大经验**：maxExp（根据等级计算）
3. **当前经验**：exp（扣除升级消耗的经验）
4. **最大生命值**：maxHp = baseHp + level × growthHp
5. **最大体力值**：maxStamina = baseStamina + level × growthStamina
6. **最小攻击**：attackMin = baseAttackMin + level × growthAttackMin
7. **最大攻击**：attackMax = baseAttackMax + level × growthAttackMax
8. **防御力**：defense = baseDefense + level × growthDefense

注意：需要保留装备加成和幻兽加成

### 3.4 重构 App.tsx 中的经验获取逻辑

**修改点1**：战斗结束后
- 查找 `handleEnemyDeath` 函数
- 使用 `gainCharacterExperience` 函数处理角色经验

**修改点2**：使用经验球
- 查找使用经验球的逻辑
- 使用 `gainCharacterExperience` 函数处理角色经验

**修改点3**：完成任务
- 查找任务奖励发放逻辑
- 使用 `gainCharacterExperience` 函数处理角色经验

## 四、详细实现规范

### 4.1 经验获取函数实现

```typescript
/**
 * 角色获得经验并处理升级
 * 参考文档：reference/docs/project_docs/角色升级系统.md（假设存在）
 * 
 * @param character 角色对象
 * @param expAmount 获得的经验值
 * @returns 更新后的角色数据和升级信息
 */
export function gainCharacterExperience(
  character: CharacterData,
  expAmount: number
): {
  character: CharacterData;
  leveledUp: boolean;
  levelUpCount: number;
  message?: string;
} {
  // 1. 等级上限检查
  if (character.level >= 125) {
    return {
      character: { ...character, exp: 0 },
      leveledUp: false,
      levelUpCount: 0,
      message: "角色等级已满，无法再获得经验值了。"
    };
  }

  let newExp = character.exp + expAmount;
  let newLevel = character.level;
  let newMaxExp = character.maxExp;
  let levelUpCount = 0;
  let leveledUp = false;

  // 2. 升级循环处理
  while (newExp >= newMaxExp && newLevel < 125) {
    newExp -= newMaxExp;
    newLevel++;
    levelUpCount++;
    leveledUp = true;

    // 从预计算表中获取下一级所需经验
    newMaxExp = MAX_EXP_TABLE.get(newLevel) || newMaxExp;
  }

  // 3. 如果升级了，更新属性
  let updatedCharacter: CharacterData;
  if (newLevel !== character.level) {
    // 计算新的基础属性
    const baseHp = character.baseHp || 500;
    const baseStamina = character.baseStamina || 100;
    const baseAttackMin = character.baseAttackMin || 45;
    const baseAttackMax = character.baseAttackMax || 45;
    const baseDefense = character.baseDefense || 80;
    
    const growthHp = character.growthHp || 50;
    const growthStamina = character.growthStamina || 10;
    const growthAttackMin = character.growthAttackMin || 10;
    const growthAttackMax = character.growthAttackMax || 10;
    const growthDefense = character.growthDefense || 8;

    updatedCharacter = {
      ...character,
      level: newLevel,
      exp: newExp,
      maxExp: newMaxExp,
      maxHp: baseHp + newLevel * growthHp,
      maxStamina: baseStamina + newLevel * growthStamina,
      attackMin: baseAttackMin + newLevel * growthAttackMin,
      attackMax: baseAttackMax + newLevel * growthAttackMax,
      defense: baseDefense + newLevel * growthDefense,
      // 保持当前HP和MP不变（除非超过最大值）
      currentHp: Math.min(character.currentHp, baseHp + newLevel * growthHp),
      currentStamina: Math.min(character.currentStamina, baseStamina + newLevel * growthStamina),
    };

    // 重新计算装备加成和幻兽加成
    // 注意：这部分需要在 App.tsx 中调用 calculateCharacterBaseAttributes
  } else {
    updatedCharacter = {
      ...character,
      exp: newExp,
      maxExp: newMaxExp,
    };
  }

  // 4. 生成提示消息
  let message: string | undefined;
  if (leveledUp) {
    if (levelUpCount === 1) {
      message = `恭喜升级！等级提升到 ${newLevel} 级！`;
    } else {
      message = `恭喜连升 ${levelUpCount} 级！等级提升到 ${newLevel} 级！`;
    }
  }

  return {
    character: updatedCharacter,
    leveledUp,
    levelUpCount,
    message,
  };
}
```

### 4.2 App.tsx 调用示例

```typescript
// 战斗结束后获得经验
const handleEnemyDeath = useCallback((enemy: BattleCharacter) => {
  // ... 击败敌人的逻辑

  // 计算获得的经验值
  const expGained = enemy.level * 100; // 示例计算

  // 使用统一的升级函数
  const result = gainCharacterExperience(character, expGained);
  
  // 更新角色状态
  setCharacter(result.character);
  
  // 显示消息
  if (result.message) {
    setInteractionLog(prev => [...prev, result.message!]);
  }
  
  // 重新计算装备加成和幻兽加成
  // 注意：这部分需要调用 calculateCharacterBaseAttributes
}, [character]);

// 使用经验球
const handleUseExpOrb = useCallback((expAmount: number) => {
  const result = gainCharacterExperience(character, expAmount);
  
  setCharacter(result.character);
  
  if (result.message) {
    setInteractionLog(prev => [...prev, result.message!]);
  }
}, [character]);

// 完成任务获得经验
const handleTaskReward = useCallback((expReward: number) => {
  const result = gainCharacterExperience(character, expReward);
  
  setCharacter(result.character);
  
  if (result.message) {
    setInteractionLog(prev => [...prev, result.message!]);
  }
}, [character]);
```

## 五、实施步骤

### 步骤1：创建角色经验获取函数（优先级：高）
- 文件：`src/utils/attributeCalculator.ts`
- 操作：实现 `gainCharacterExperience` 函数
- 预计时间：30分钟

### 步骤2：重构战斗结束逻辑（优先级：高）
- 文件：`src/App.tsx`
- 操作：修改 `handleEnemyDeath` 函数，使用 `gainCharacterExperience`
- 预计时间：20分钟

### 步骤3：重构经验球使用逻辑（优先级：高）
- 文件：`src/App.tsx`
- 操作：查找并修改使用经验球的逻辑
- 预计时间：20分钟

### 步骤4：重构任务奖励逻辑（优先级：高）
- 文件：`src/App.tsx`
- 操作：修改任务奖励发放逻辑，使用 `gainCharacterExperience`
- 预计时间：20分钟

### 步骤5：更新属性计算逻辑（优先级：中）
- 文件：`src/utils/attributeCalculator.ts`
- 操作：确保升级后正确计算装备加成和幻兽加成
- 预计时间：15分钟

### 步骤6：测试和优化（优先级：低）
- 操作：测试所有经验获取场景
- 预计时间：30分钟

## 六、注意事项

### 6.1 数据一致性
- 确保升级后正确更新所有属性
- 确保装备加成和幻兽加成正确应用
- 确保当前HP和MP不超过最大值

### 6.2 用户体验
- 升级时显示清晰的提示消息
- 连续升级时显示升级次数
- 等级满时显示提示信息

### 6.3 代码规范
- 所有新增代码必须添加详细注释
- 遵循项目现有的代码风格
- 使用预计算表提高性能

### 6.4 兼容性
- 不破坏已有的功能
- 确保其他系统（装备、幻兽）不受影响

## 七、预期效果

### 7.1 功能完整性
- 角色获得经验时自动检查升级
- 升级后正确更新所有属性
- 支持连续升级

### 7.2 代码质量
- 统一的经验获取接口
- 逻辑集中，易于维护
- 符合面向对象设计原则

### 7.3 用户体验
- 清晰的升级提示
- 流畅的游戏体验
- 符合玩家预期

## 八、相关文件

- `src/utils/attributeCalculator.ts` - 角色属性计算逻辑
- `src/types/index.ts` - 类型定义
- `src/App.tsx` - 主应用逻辑
- `src/data/characterData.ts` - 角色数据
- `.trae/documents/幻兽升级逻辑重构计划.md` - 参考文档

## 九、风险评估

### 9.1 技术风险
- **低风险**：升级逻辑相对简单，参考幻兽实现即可
- **中风险**：需要确保装备加成和幻兽加成正确应用
- **低风险**：经验需求计算已有现成函数

### 9.2 兼容性风险
- **低风险**：新增功能不影响现有系统
- **低风险**：统一接口提高代码一致性

### 9.3 用户体验风险
- **低风险**：升级逻辑清晰，易于理解
- **低风险**：提示消息明确，用户反馈良好

## 十、总结

本计划旨在重构角色升级逻辑，通过创建统一的 `gainCharacterExperience` 函数，实现完整的升级机制。参考幻兽升级逻辑的设计模式，确保角色获得经验时能够正确升级并更新属性。实施过程分为6个步骤，预计总时间约2小时。
