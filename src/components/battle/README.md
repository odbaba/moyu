# 战斗模块 (Battle Module)

本目录包含回合制战斗系统的所有组件。

## 目录结构

```
battle/
├── index.ts              # 模块导出文件
├── README.md             # 本说明文件
├── Battle.tsx            # 战斗主组件
├── BattleLog.tsx         # 战斗日志组件
├── CharacterCard.tsx     # 角色卡片组件
├── ActionButtons.tsx     # 行动按钮组件
└── battle.css            # 战斗样式文件
```

## 组件说明

### Battle
- **功能**: 战斗系统的主组件，管理整个战斗流程
- **职责**:
  - 管理战斗状态（玩家、敌人、回合、日志等）
  - 处理玩家行动选择和目标选择
  - 执行敌方AI行动
  - 计算伤害和更新状态（战斗力修正、闪避、暴击）
  - 判断战斗结果
- **Props**: 
  - `playerData: CharacterData` - 玩家角色数据
  - `playerSkills: SkillDetail[]` - 玩家技能数据
  - `enemyTemplateId: string` - 敌人模板ID
  - `enemyLevel: number` - 敌人等级
  - `enemyCount: number` - 敌人数量
  - `deployedPets?: Pet[]` - 出战幻兽列表（可选，最多2只）
  - `onBattleEnd: (result: BattleResult, finalPlayerState?: BattleCharacter, finalDeployedPets?: BattlePet[]) => void` - 战斗结束回调，返回战斗结果、玩家最终状态和幻兽最终状态

### CharacterCard
- **功能**: 显示角色或幻兽的基本信息和状态条
- **显示内容**:
  - 角色名称和等级
  - 战斗力（仅角色）
  - 攻击力范围
  - 生命值（HP）进度条和数值
  - 魔法值（MP）进度条和数值（仅角色）
  - 增益效果图标（仅角色）
  - 合体标签（仅合体幻兽）
- **特性**:
  - 支持显示 BattleCharacter（角色）和 BattlePet（幻兽）两种类型
  - 合体幻兽显示金色发光边框和"合体"标签
  - 通过类型守卫自动识别角色或幻兽
- **Props**: 
  - `character: BattleCharacter | BattlePet` - 战斗角色或幻兽数据对象

### ActionButtons
- **功能**: 显示玩家可用的行动按钮（普攻、技能等）
- **特性**:
  - 显示技能类型图标（单体/群体/多段/增益）
  - 显示技能消耗（MP和体力）
  - 显示技能冷却状态
  - 根据MP和体力自动判断技能是否可用
  - 显示禁用原因提示
- **Props**:
  - `skills: BattleSkill[]` - 可用技能列表
  - `currentMp: number` - 当前MP值
  - `currentStamina: number` - 当前体力值
  - `onActionSelect: (skillId: string) => void` - 选择行动回调
  - `disabled?: boolean` - 是否禁用

### BattleLog
- **功能**: 显示战斗过程中的行动日志
- **特性**:
  - 显示回合数、行动者、行动类型、目标、伤害等信息
  - 支持不同类型信息的颜色区分
  - 显示特殊事件（闪避、暴击、破防）
  - 显示增益效果日志
- **Props**: 
  - `logs: BattleLogEntry[]` - 战斗日志条目数组

## 战斗流程

```
1. 战斗开始
   ├── 初始化战斗状态（角色数据转换、敌人生成）
   ├── 计算战斗力
   └── 设置初始增益效果
   ↓
2. 玩家回合
   ├── 选择行动（普攻/技能）
   ├── 检查技能冷却和消耗
   ├── 选择目标（单体技能）
   ├── 执行攻击
   │   ├── 闪避判定
   │   ├── 战斗力修正计算
   │   ├── 暴击判定
   │   └── 伤害计算
   └── 更新状态和日志
   ↓
3. 敌方回合
   ├── AI选择行动
   ├── 执行攻击
   └── 更新状态和日志
   ↓
4. 回合结束处理
   ├── 移除过期增益效果
   ├── 减少技能冷却时间
   └── 检查战斗结果
   ↓
5. 循环直到战斗结束
   ├── 所有敌人死亡 → 战斗胜利
   └── 玩家死亡 → 战斗失败
```

## 数据类型

```typescript
// 战斗角色
interface BattleCharacter {
  id: string;                    // 角色唯一ID
  name: string;                  // 角色名称
  level: number;                 // 角色等级
  maxHp: number;                 // 最大生命值
  currentHp: number;             // 当前生命值
  maxMp: number;                 // 最大魔法值
  currentMp: number;             // 当前魔法值
  attack: number;                // 攻击力
  defense: number;               // 防御力
  speed: number;                 // 速度
  evasion: number;               // 闪避率
  critRate: number;              // 暴击率
  critDamage: number;            // 暴击伤害倍率
  combatPower: number;           // 战斗力
  stamina: number;               // 当前体力值
  maxStamina: number;            // 最大体力值
  buffs: Buff[];                 // 增益效果列表
  isPlayer: boolean;             // 是否为玩家
  gridPosition: { x: number; y: number }; // 九宫格位置
}

// 战斗幻兽
interface BattlePet {
  id: string;                    // 幻兽唯一ID
  petId: string;                 // 原始幻兽ID（用于同步数据）
  name: string;                  // 幻兽名称
  level: number;                 // 幻兽等级
  maxHp: number;                 // 最大生命值
  currentHp: number;             // 当前生命值
  minAttack: number;             // 最小攻击力
  maxAttack: number;             // 最大攻击力
  defense: number;               // 防御力
  isMerged: boolean;             // 是否合体状态
  gridPosition: { x: number; y: number }; // 九宫格位置
}

// 战斗技能
interface BattleSkill {
  id: string;                    // 技能ID
  name: string;                  // 技能名称
  description: string;           // 技能描述
  mpCost: number;                // MP消耗
  staminaCost: number;           // 体力消耗
  cooldown: number;              // 冷却回合数
  currentCooldown: number;       // 当前冷却时间
  attackType: 'single' | 'aoe' | 'multi' | 'buff'; // 攻击类型
  fixedDamage: number;           // 固定伤害
  attackPercent: number;         // 攻击力百分比
  hitCount: number;              // 攻击次数
  targetType: 'enemy' | 'self' | 'ally'; // 目标类型
}

// 战斗状态
interface BattleState {
  player: BattleCharacter;       // 玩家数据
  enemies: BattleCharacter[];    // 敌人列表
  deployedPets: BattlePet[];     // 出战幻兽列表（最多2只）
  currentTurn: 'player' | 'enemy'; // 当前回合
  isPlayerTurn: boolean;         // 是否玩家回合
  battleLogs: BattleLogEntry[];  // 战斗日志
  round: number;                 // 当前回合数
  selectedAction: string | null; // 选中的行动
  targetEnemy: string | null;    // 选中的目标
  battleResult: BattleResult;    // 战斗结果
}

// 增益效果
interface Buff {
  id: string;                    // 增益ID
  name: string;                  // 增益名称
  type: 'attack' | 'defense' | 'speed' | 'evasion' | 'crit'; // 增益类型
  value: number;                 // 增益数值
  duration: number;              // 持续回合数
  remainingDuration: number;     // 剩余回合数
  icon: string;                  // 图标标识
}

// 伤害结果
interface DamageResult {
  damage: number;                // 最终伤害
  isEvaded: boolean;             // 是否闪避
  isBreakDefense: boolean;       // 是否破防
  actualDamage: number;          // 实际造成的伤害
}

// 敌人模板
interface EnemyTemplate {
  id: string;                    // 模板ID
  name: string;                  // 敌人名称
  baseHp: number;                // 基础生命值
  baseMp: number;                // 基础魔法值
  baseAttack: number;            // 基础攻击力
  baseDefense: number;           // 基础防御力
  baseSpeed: number;             // 基础速度
  baseEvasion: number;           // 基础闪避率
  baseCritRate: number;          // 基础暴击率
  skills: string[];              // 可用技能ID列表
  aiType: 'aggressive' | 'defensive' | 'balanced'; // AI类型
}

// 战斗结果
type BattleResult = 'player_win' | 'enemy_win' | 'in_progress';
```

## 使用示例

```tsx
import { Battle } from './components/battle';
import { exampleCharacter } from './data/characterData';
import { createInitialSkills } from './data/skillData';

function App() {
  const [inBattle, setInBattle] = useState(false);
  const [battleParams, setBattleParams] = useState(null);
  const skills = createInitialSkills(true);
  
  const handleBattleEnd = (result: BattleResult) => {
    setInBattle(false);
    setBattleParams(null);
    console.log('战斗结果:', result);
  };

  return (
    {inBattle && battleParams ? (
      <Battle 
        playerData={exampleCharacter}
        playerSkills={skills.filter(s => s.isLearned)}
        enemyTemplateId={battleParams.enemyTemplateId}
        enemyLevel={battleParams.enemyLevel}
        enemyCount={battleParams.enemyCount}
        onBattleEnd={handleBattleEnd}
      />
    ) : (
      // 显示主界面
    )}
  );
}
```

## 新功能说明

### 幻兽系统集成

战斗系统已完整集成幻兽系统，支持最多2只幻兽同时出战参与战斗。

#### 幻兽显示位置
- **第一只幻兽**：九宫格左下角位置 `{x: 0, y: 2}`
- **第二只幻兽**：九宫格右下角位置 `{x: 2, y: 2}`
- 幻兽位置固定，避免与玩家中心位置冲突

#### 合体幻兽特殊标识
- **视觉标识**：合体幻兽显示特殊的"合体"标签
- **边框效果**：金色发光边框，带有动态发光动画
- **悬停效果**：鼠标悬停时边框发光效果增强
- **样式类名**：`.merged-pet` 类控制合体幻兽的特殊样式

#### 敌方优先攻击机制
敌方AI会优先攻击合体幻兽，攻击优先级规则如下：
1. **第一优先级**：第一出战位的合体幻兽（如果存活）
2. **第二优先级**：第二出战位的合体幻兽（如果存活）
3. **默认目标**：玩家角色（当没有合体幻兽或合体幻兽已阵亡时）

#### 幻兽阵亡处理
- **阵亡判定**：幻兽 `currentHp <= 0` 时视为阵亡
- **目标切换**：幻兽阵亡后，敌方自动切换攻击目标
- **状态同步**：战斗结束时，通过 `onBattleEnd` 回调同步幻兽最终血量

#### 战斗数据同步
战斗结束后，系统会自动同步以下数据：
- 玩家角色的最终状态（HP、MP、体力等）
- 所有出战幻兽的最终血量（通过 `finalDeployedPets` 参数）
- 幻兽血量会同步更新到主系统的幻兽数据中

### 幻兽幸运值机制

幻兽幸运值是幻兽在战斗中的重要属性，决定了幻兽在受到致命伤害时的生存能力。

#### 幸运值属性定义
- **属性范围**：0-100
- **初始值**：50
- **作用对象**：所有幻兽（但只有合体状态的幻兽才会触发保留1血机制）

#### 幸运值在战斗中的作用

**1. 保留1血机制**
- **触发条件**：只有合体状态的幻兽才会触发此机制
- **触发时机**：当合体幻兽受到致命伤害时（伤害值 >= 当前血量）
- **效果**：
  - 幻兽不会死亡，而是保留1点血量
  - 幻兽幸运值降低10点（确保不低于0）
  - 战斗日志记录：`{幻兽名称} 受到致命伤害，幸运值降低10点！当前幸运值：{新幸运值}`

**2. 幸运值耗尽退出战斗机制**
- **触发条件**：幻兽幸运值降为0时
- **效果**：
  - 幻兽自动解除合体状态
  - 幻兽退出战斗（从 `deployedPets` 中移除）
  - 战斗日志记录：`{幻兽名称} 幸运值耗尽，退出战斗！`
  - 敌方后续攻击自动转向玩家

**3. 幸运值影响暴击率**
- 幻兽的幸运值影响暴击率：暴击率 = 幸运值 / 100，最大50%
- 幸运值越高，暴击率越高

#### 战斗流程示例

```
1. 敌方攻击玩家
   ↓
2. 检查是否有合体幻兽
   ├── 有合体幻兽 → 伤害优先从幻兽血条扣除
   │   ├── 伤害 < 幻兽当前血量 → 正常扣除血量
   │   └── 伤害 >= 幻兽当前血量（致命伤害）→ 触发保留1血机制
   │       ├── 幻兽血量保留为1
   │       ├── 幸运值降低10点
   │       └── 如果幸运值降为0 → 幻兽退出战斗
   └── 无合体幻兽 → 伤害直接扣除玩家血量
```

#### 注意事项
- 只有合体状态的幻兽才会触发保留1血机制
- 非合体幻兽受到致命伤害会直接阵亡
- 幻兽退出战斗后，需要恢复血量才能再次出战
- 幻兽幸运值在战斗结束后不会自动恢复，需要通过其他方式恢复

### 战斗力差距修正系统
- 根据攻击方和防御方的战斗力差距，动态调整伤害倍率
- 战斗力差距越大，修正效果越明显
- 鼓励玩家提升战斗力以获得战斗优势

### 闪避系统
- 每个角色都有基础闪避率
- 闪避成功时完全免疫伤害
- 闪避率受增益效果影响

### 暴击系统
- 每个角色都有基础暴击率和暴击伤害倍率
- 暴击时造成额外伤害（默认1.5倍）
- 暴击率受增益效果影响

### 技能攻击类型
- **单体攻击**: 对单个目标造成伤害
- **群体攻击**: 对所有敌人造成伤害
- **多段攻击**: 对目标进行多次攻击
- **增益技能**: 为自己或队友施加增益效果

### 增益效果管理
- 支持多种增益类型（攻击、防御、速度、闪避、暴击）
- 增益效果有持续时间限制
- 回合结束时自动移除过期增益
- 增益效果在角色卡片上以图标形式显示

### 点击查看详情功能

战斗系统支持点击九宫格中的角色、幻兽或敌人查看详细信息。

#### 交互逻辑
- **玩家回合且已选择技能**：点击敌人 = 选择攻击目标（保持现有逻辑）
- **其他情况**：点击角色/幻兽/敌人 = 查看详情（新功能）

#### 详情弹窗组件

##### CharacterDetailModal（角色详情弹窗）
- **功能**：显示玩家角色的详细信息
- **显示内容**：
  - 角色名称和等级
  - 生命值（HP）、魔法值（MP）、体力值
  - 攻击力范围、防御力、战斗力
  - 闪避率、幸运值
  - 技能列表（包含技能类型和消耗）
  - 增益效果列表（包含增益图标、名称、数值和持续时间）
- **Props**：
  - `isVisible: boolean` - 是否显示弹窗
  - `onClose: () => void` - 关闭弹窗的回调函数
  - `character: BattleCharacter | null` - 要显示的角色对象

##### EnemyDetailModal（敌人详情弹窗）
- **功能**：显示敌人的详细信息
- **显示内容**：
  - 敌人名称和等级
  - 生命值（HP）、魔法值（MP）
  - 攻击力范围、防御力、战斗力
  - 闪避率、幸运值
  - 技能列表（包含技能类型和消耗）
  - 增益效果列表（包含增益图标、名称、数值和持续时间）
- **Props**：
  - `isVisible: boolean` - 是否显示弹窗
  - `onClose: () => void` - 关闭弹窗的回调函数
  - `enemy: BattleCharacter | null` - 要显示的敌人对象

##### PetDetailModal（幻兽详情弹窗）
- **功能**：显示幻兽的详细信息（复用现有组件）
- **显示内容**：
  - 幻兽名称、类型、等级
  - 品质称号、生命值、经验值
  - 攻击力范围、防御力
  - 成长率信息、初始属性
  - 总评分、罕见度、转世次数
- **Props**：
  - `isVisible: boolean` - 是否显示弹窗
  - `onClose: () => void` - 关闭弹窗的回调函数
  - `pet: Pet | null` - 要显示的幻兽对象
  - `canDeploy: boolean` - 是否可以出战（战斗中固定为 false）

#### 视觉反馈
- **可点击状态**：鼠标悬停时显示可点击状态（`.clickable` 类）
- **点击提示**：鼠标指针变为手型，格子背景色变化
- **弹窗样式**：
  - 角色详情弹窗：青色边框（`#4ecdc4`）
  - 敌人详情弹窗：红色边框（`#ff4444`）
  - 幻兽详情弹窗：金色边框（`#ffd700`）

#### 数据转换
- **幻兽数据**：从 `BattlePet` 类型转换为 `Pet` 类型，通过 `petId` 在 `deployedPets` 中查找原始幻兽数据
- **角色数据**：直接使用 `BattleCharacter` 数据
- **敌人数据**：直接使用 `BattleCharacter` 数据

## 注意事项

1. 战斗系统采用回合制，玩家先行动
2. 敌方AI会根据MP和体力情况随机选择普攻或技能
3. 九宫格布局用于显示角色位置，支持目标选择
4. 所有动画效果使用CSS实现，性能优化
5. 移动端已优化，九宫格高度为屏幕的1/3
6. 技能冷却系统确保技能平衡使用
7. 战斗力系统提供更直观的战力对比
