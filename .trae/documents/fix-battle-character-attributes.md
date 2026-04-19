# 战斗页面角色属性修复计划

## 问题分析

### 当前问题
战斗页面中显示的角色属性不正确，与角色面板中显示的属性不一致。

### 根本原因
1. **角色面板**（CharacterInfo.tsx）：
   - 使用 `calculateTotalCharacterAttributes(character)` 计算角色总属性
   - 该函数计算：基础属性 + 装备加成 + 幻兽加成 + 战魂加成
   - 显示的是正确的总属性

2. **战斗页面**（battleAdapter.ts）：
   - 在 `characterToBattleCharacter()` 函数中（第121-123行）
   - 直接使用 `characterData.attackMin`, `characterData.attackMax`, `characterData.defense`
   - 这些只是基础属性，没有包含装备加成、幻兽加成和战魂加成

### 影响范围
- 战斗初始化时角色属性不正确
- 战斗伤害计算基于错误的基础属性
- 战斗力计算可能也受影响

## 解决方案

### 方案选择
**复用角色面板的属性计算逻辑**，在 `characterToBattleCharacter()` 函数中使用 `calculateTotalCharacterAttributes()` 来获取角色的总属性。

### 实施步骤

#### 步骤1：修改 battleAdapter.ts
在 `characterToBattleCharacter()` 函数中：
1. 导入 `calculateTotalCharacterAttributes` 函数
2. 使用该函数计算角色的总属性
3. 使用总属性替代基础属性

#### 步骤2：验证修改
1. 检查战斗页面角色属性是否与角色面板一致
2. 确认战斗力计算是否正确
3. 测试战斗伤害计算是否基于正确的属性

## 代码修改详情

### 文件：src/utils/battleAdapter.ts

#### 修改点1：导入 calculateTotalCharacterAttributes
```typescript
// 在文件顶部添加导入
import { calculateTotalCharacterAttributes } from './attributeCalculator';
```

#### 修改点2：修改 characterToBattleCharacter 函数
```typescript
export function characterToBattleCharacter(
  characterData: CharacterData,
  skills: SkillDetail[],
  isPlayer: boolean,
  gridPosition: GridPosition,
  pets?: Pet[]
): BattleCharacter {
  // 计算最大MP（简化处理：100 + 等级 × 10）
  const maxMp = 100 + characterData.level * 10;

  // 转换所有已学习的技能为战斗技能
  const battleSkills: BattleSkill[] = skills
    .filter(skill => skill.isLearned)
    .map(skill => skillToBattleSkill(skill, maxMp, characterData.currentStamina));

  // ========== 使用 calculateTotalCharacterAttributes 计算总属性 ==========
  // 复用角色面板的属性计算逻辑，确保战斗中使用的属性与面板一致
  const totalAttributes = calculateTotalCharacterAttributes(characterData);

  // 创建战斗角色对象
  const battleCharacter: BattleCharacter = {
    id: characterData.id,
    name: characterData.playerName,
    level: characterData.level,
    maxHp: totalAttributes.maxHp, // 使用总生命值
    currentHp: characterData.currentHp, // 保持当前HP
    maxMp: maxMp,
    currentMp: maxMp, // MP每次战斗恢复满（根据游戏设计）
    maxStamina: totalAttributes.maxStamina, // 使用总体力值
    currentStamina: characterData.currentStamina, // 保持当前体力
    attackMin: totalAttributes.attackMin, // 使用总最小攻击力（包含装备、幻兽、战魂加成）
    attackMax: totalAttributes.attackMax, // 使用总最大攻击力（包含装备、幻兽、战魂加成）
    defense: totalAttributes.defense, // 使用总防御力（包含装备、幻兽、战魂加成）
    combatPower: 0, // 先设为0，后面计算
    dodgeRate: totalAttributes.dodgeRate, // 使用总闪避率（包含战魂加成）
    luck: characterData.luck,
    skills: battleSkills,
    buffs: [], // 初始无增益效果
    isPlayer: isPlayer,
    gridPosition: gridPosition
  };

  // 使用统一的战斗力计算函数（包含幻兽战斗力加成）
  battleCharacter.combatPower = calculateTotalCombatPower(characterData, pets);

  return battleCharacter;
}
```

## 注意事项

1. **不要重新计算属性**：直接复用 `calculateTotalCharacterAttributes()` 函数，确保逻辑一致性
2. **保持当前HP/体力**：战斗中应该保持角色的当前HP和体力值，而不是恢复满
3. **战斗力计算**：战斗力计算使用 `calculateTotalCombatPower()`，已经包含了幻兽加成
4. **闪避率**：闪避率也需要使用总闪避率（包含地魂战魂加成）

## 测试验证

修改完成后需要验证：
1. 战斗页面角色属性与角色面板一致
2. 战斗伤害计算正确
3. 闪避率生效（地魂战魂加成）
4. 战斗力显示正确
