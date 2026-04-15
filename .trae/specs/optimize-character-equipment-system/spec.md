# 角色与装备系统优化 Spec

## Why
当前项目的角色属性是静态写死的数值，装备系统也没有实现穿戴装备后动态增加角色属性的功能。根据参考文档，角色属性应该由基础属性、等级成长、装备加成、幻兽加成等多个部分动态计算得出。

## What Changes
- 实现角色属性的动态计算系统（基础属性 + 等级成长 + 装备加成 + 幻兽加成）
- 实现装备属性根据等级、品质、魔魂等级动态计算
- 实现穿戴/卸下装备后角色属性实时更新
- 优化战斗力计算，使其与参考文档一致

## Impact
- Affected specs: 角色系统、装备系统、战斗力系统
- Affected code: 
  - `src/types/index.ts` - 类型定义
  - `src/data/characterData.ts` - 角色数据
  - `src/utils/combatPower.ts` - 战斗力计算
  - `src/components/character/CharacterInfo.tsx` - 角色信息显示
  - `src/components/character/CombatPowerModal.tsx` - 战斗力详情

## ADDED Requirements

### Requirement: 角色基础属性计算系统
系统应根据角色等级动态计算基础属性。

#### Scenario: 等级提升后属性自动增长
- **WHEN** 角色等级为 N
- **THEN** 基础属性计算如下：
  - 最大生命值 = 500 + 50 × N
  - 最大体力值 = 100 + 10 × N
  - 最小攻击力 = 45 + 10 × N
  - 最大攻击力 = 45 + 10 × N
  - 防御力 = 80 + 8 × N

### Requirement: 装备属性动态计算系统
系统应根据装备等级、品质、魔魂等级动态计算装备属性。

#### Scenario: 武器属性计算
- **WHEN** 武器等级为 dj，魔魂等级为 mhdj
- **THEN** 武器属性计算如下：
  - 基础最小攻击 = 10 × dj
  - 基础最大攻击 = 30 × dj
  - 追加最小攻击 = Math.floor(基础最小攻击 / 10) × mhdj
  - 追加最大攻击 = Math.floor(基础最大攻击 / 10) × mhdj

#### Scenario: 防具属性计算
- **WHEN** 防具等级为 dj，魔魂等级为 mhdj
- **THEN** 防具属性计算如下：
  - 衣服：基础防御 = 8 × dj
  - 头盔：基础防御 = 6 × dj
  - 战鞋：基础防御 = 4 × dj
  - 追加防御 = Math.floor(基础防御 / 10) × mhdj

#### Scenario: 饰品属性计算
- **WHEN** 饰品等级为 dj，魔魂等级为 mhdj
- **THEN** 饰品属性计算如下：
  - 项链：基础最小攻击 = 8 × dj，基础最大攻击 = 20 × dj
  - 手镯：基础最小攻击 = 5 × dj，基础最大攻击 = 15 × dj
  - 追加攻击按魔魂等级计算

### Requirement: 装备属性加成到角色
系统应在角色穿戴装备后，将装备属性加成到角色属性上。

#### Scenario: 穿戴攻击型装备
- **WHEN** 角色穿戴武器、项链、手镯
- **THEN** 角色攻击力增加：
  - 最小攻击力 += 所有装备的(基础最小攻击 + 追加最小攻击)
  - 最大攻击力 += 所有装备的(基础最大攻击 + 追加最大攻击)

#### Scenario: 穿戴防御型装备
- **WHEN** 角色穿戴头盔、衣服、战鞋
- **THEN** 角色防御力增加：
  - 防御力 += 所有装备的(基础防御 + 追加防御)

### Requirement: 战魂系统属性加成
系统应根据装备战魂类型提供额外属性加成。

#### Scenario: 天魂战魂加成
- **WHEN** 装备战魂类型为天魂(zhtype=1)，战魂等级为 zhdj
- **THEN** 角色攻击力百分比加成：
  - 攻击力加成 = zhdj × 5%

#### Scenario: 地魂战魂加成
- **WHEN** 装备战魂类型为地魂(zhtype=2)，战魂等级为 zhdj
- **THEN** 角色闪避率加成：
  - 闪避率加成 = zhdj × 2%

### Requirement: 战斗力计算优化
系统应按照参考文档的公式计算战斗力。

#### Scenario: 战斗力组成计算
- **WHEN** 计算总战斗力
- **THEN** 战斗力 = 等级 + 军衔加成 + 爵位加成 + 幻兽战斗力 + 装备品质总和 + 魔魂等级总和 + 宝石洞总和 + 宝石战斗力

#### Scenario: 装备品质战斗力
- **WHEN** 装备品质为 pz (0-4)
- **THEN** 每件装备品质贡献 = pz


## MODIFIED Requirements

### Requirement: 角色数据结构
扩展 CharacterData 类型，支持动态属性计算。

```typescript
interface CharacterData {
  // 基础属性常量
  baseHp: number;       // 基础生命值 = 500
  baseStamina: number;  // 基础体力值 = 100
  baseAttackMin: number; // 基础最小攻击 = 45
  baseAttackMax: number; // 基础最大攻击 = 45
  baseDefense: number;  // 基础防御力 = 80
  
  // 成长系数
  growthHp: number;       // 生命成长 = 50
  growthStamina: number;  // 体力成长 = 10
  growthAttackMin: number; // 最小攻击成长 = 10
  growthAttackMax: number; // 最大攻击成长 = 10
  growthDefense: number;  // 防御成长 = 8
  
  // 装备加成（动态计算）
  equipmentBonus?: {
    attackMin: number;
    attackMax: number;
    defense: number;
    dodgeRate: number;
  };
  
  // 幻兽加成（已有）
  petBonus?: {
    attackMin: number;
    attackMax: number;
    defense: number;
  };
}
```

### Requirement: 装备数据结构
扩展 EquipmentDetail 类型，支持动态属性计算。

```typescript
interface EquipmentDetail {
  // 基础属性（根据等级动态计算）
  baseAttackMin?: number;  // 基础最小攻击
  baseAttackMax?: number;  // 基础最大攻击
  baseDefense?: number;    // 基础防御
  
  // 追加属性（根据魔魂等级计算）
  bonusAttackMin?: number; // 追加最小攻击
  bonusAttackMax?: number; // 追加最大攻击
  bonusDefense?: number;   // 追加防御
  
  // 战魂属性
  soulType?: number;       // 战魂类型 (0=无, 1=天魂, 2=地魂)
  soulLevel?: number;      // 战魂等级 (1-5)
}
```
