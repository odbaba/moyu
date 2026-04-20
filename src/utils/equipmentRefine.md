# 装备精炼模块使用示例

本文档展示如何使用 `equipmentRefine.ts` 模块中的各项功能。

## 导入模块

```typescript
import {
  isWeaponOrStone,
  refineQuality,
  refineMagicSoul,
  refineUseLevel,
  refineOpenHole,
  embedGem,
  activateSoul,
  removeGem,
  canRefine,
  getQualityCombatPower,
  getSoulTypeName,
  getQualityName
} from '@/utils/equipmentRefine';
import type { EquipmentItem, GemItem } from '@/types';
```

## 1. 物品识别

```typescript
// 识别装备
const equipment = { name: '武器', type: 'equipment' };
const result1 = isWeaponOrStone(equipment); // 返回 1

// 识别宝石
const gem = { name: '灵魂晶石', type: 'gem' };
const result2 = isWeaponOrStone(gem); // 返回 2

// 识别其他物品
const other = { name: '生命药水', type: 'consumable' };
const result3 = isWeaponOrStone(other); // 返回 0
```

## 2. 品质提升

```typescript
// 创建装备和宝石
const equipment: EquipmentItem = {
  id: 'weapon_001',
  name: '武器',
  type: 'equipment',
  equipmentType: 'weapon',
  equipmentQuality: '普通品', // 白品
  useLevel: 10,
  magicSoulLevel: 0,
  holeCount: 0,
  quantity: 1,
  icon: '⚔️',
  description: '一把普通的武器'
};

const gem: GemItem = {
  id: 'gem_001',
  name: '灵魂晶石',
  type: 'gem',
  gemType: 'enhance',
  gemSubType: 'enhance',
  effect: '提升装备品质',
  quantity: 1,
  icon: '💎',
  description: '用于提升装备品质'
};

// 使用灵魂晶石提升品质（白品→良品，100%成功）
const result = refineQuality(equipment, gem);
console.log(result);
// {
//   success: true,
//   message: '精炼成功！装备品质提升为良品',
//   attributeChanges: { qualityLevel: 1, combatPowerChange: 1 }
// }

// 使用灵魂王（100%成功）
const kingGem: GemItem = { ...gem, name: '灵魂王' };
const result2 = refineQuality(equipment, kingGem);
```

## 3. 魔魂提升

```typescript
// 使用魔魂晶石提升魔魂等级
const magicGem: GemItem = {
  id: 'gem_002',
  name: '魔魂晶石',
  type: 'gem',
  gemType: 'enhance',
  gemSubType: 'enhance',
  effect: '提升魔魂等级',
  quantity: 1,
  icon: '🔮',
  description: '用于提升魔魂等级'
};

const result = refineMagicSoul(equipment, magicGem);
console.log(result);
// +0~+5: 90% 成功率
// +6~+8: 50% 成功率
// +9~+11: 35% 成功率，失败不降级

// 使用魔魂之心（+9前100%成功）
const heartGem: GemItem = { ...magicGem, name: '魔魂之心' };
const result2 = refineMagicSoul(equipment, heartGem);
```

## 4. 使用等级提升

```typescript
// 使用幻魔晶石提升使用等级
const levelGem: GemItem = {
  id: 'gem_003',
  name: '幻魔晶石',
  type: 'gem',
  gemType: 'enhance',
  gemSubType: 'enhance',
  effect: '提升使用等级',
  quantity: 1,
  icon: '⬆️',
  description: '用于提升装备使用等级'
};

const playerLevel = 50;
const result = refineUseLevel(equipment, levelGem, playerLevel);
console.log(result);
// 1级→10级: 50% 成功率
// 10级~80级: 30% 成功率
// 80级~125级: 20% 成功率

// 使用幻魔之心（100%成功）
const heartGem: GemItem = { ...levelGem, name: '幻魔之心' };
const result2 = refineUseLevel(equipment, heartGem, playerLevel);
```

## 5. 开洞

```typescript
// 使用月光宝盒开第一个洞
const moonBox: GemItem = {
  id: 'gem_004',
  name: '月光宝盒',
  type: 'gem',
  gemType: 'enhance',
  gemSubType: 'openHole',
  effect: '给装备开第一个洞',
  quantity: 1,
  icon: '📦',
  description: '用于给装备开第一个洞'
};

const result = refineOpenHole(equipment, moonBox);
console.log(result);
// 成功后装备获得1个宝石洞
// 3% 概率激活战魂

// 使用月光宝盒增强版开第二个洞
const enhancedBox: GemItem = { ...moonBox, name: '月光宝盒增强版' };
const result2 = refineOpenHole(equipment, enhancedBox);
// 10% 概率激活战魂
```

## 6. 宝石镶嵌

```typescript
// 确保装备有洞
equipment.holeCount = 1;

// 镶嵌高级战斗力石
const combatGem: GemItem = {
  id: 'gem_005',
  name: '高级战斗力石',
  type: 'gem',
  gemType: 'embed',
  gemSubType: 'embed',
  effect: '战斗力+5',
  combatPower: 5,
  quantity: 1,
  icon: '⚔️',
  description: '增加5点战斗力'
};

const result = embedGem(equipment, combatGem);
console.log(result);
// {
//   success: true,
//   message: '成功镶嵌高级战斗力石！',
//   attributeChanges: {
//     embeddedGem: '高级战斗力石',
//     combatPowerBonus: 5,
//     expBonus: 0,
//     soulLevelChange: 0
//   }
// }

// 如果装备有战魂，高级宝石会提升战魂等级
equipment.soulType = 1; // 天魂
equipment.soulLevel = 1;
const result2 = embedGem(equipment, combatGem);
// 战魂等级会从1提升到2
```

## 7. 战魂激活

```typescript
// 使用战魂晶石激活战魂（20%成功率）
const soulGem: GemItem = {
  id: 'gem_006',
  name: '战魂晶石',
  type: 'gem',
  gemType: 'enhance',
  gemSubType: 'soul',
  effect: '激活战魂',
  quantity: 1,
  icon: '👻',
  description: '用于激活装备战魂'
};

const result = activateSoul(equipment, soulGem);
console.log(result);
// 成功后随机获得天魂(1)或地魂(2)

// 使用战魂之心（100%成功）
const heartGem: GemItem = { ...soulGem, name: '战魂之心' };
const result2 = activateSoul(equipment, heartGem);
```

## 8. 辅助函数

```typescript
// 检查是否可以精炼
const check = canRefine(equipment, gem);
console.log(check);
// { canRefine: true, reason: '可以精炼' }

// 获取品质战斗力加成
const combatPower = getQualityCombatPower('极品');
console.log(combatPower); // 5

// 获取战魂类型名称
const soulName = getSoulTypeName(1);
console.log(soulName); // '天魂'

// 获取品质名称
const qualityName = getQualityName(4);
console.log(qualityName); // '极品'
```

## 完整示例：装备精炼流程

```typescript
// 1. 创建装备
const sword: EquipmentItem = {
  id: 'sword_001',
  name: '武器',
  type: 'equipment',
  equipmentType: 'weapon',
  equipmentQuality: '普通品',
  useLevel: 1,
  magicSoulLevel: 0,
  holeCount: 0,
  quantity: 1,
  icon: '⚔️',
  description: '一把普通的武器'
};

// 2. 提升品质到极品
const soulGem: GemItem = { /* ... */ name: '灵魂王' };
refineQuality(sword, soulGem); // 普通品→良品
refineQuality(sword, soulGem); // 良品→上品
refineQuality(sword, soulGem); // 上品→精品
refineQuality(sword, soulGem); // 精品→极品

// 3. 提升魔魂等级到+12
const magicGem: GemItem = { /* ... */ name: '魔魂之心' };
for (let i = 0; i < 9; i++) {
  refineMagicSoul(sword, magicGem); // +0→+9（使用魔魂之心）
}
const normalMagicGem: GemItem = { /* ... */ name: '魔魂晶石' };
for (let i = 0; i < 3; i++) {
  refineMagicSoul(sword, normalMagicGem); // +9→+12（使用魔魂晶石）
}

// 4. 提升使用等级到125级
const levelGem: GemItem = { /* ... */ name: '幻魔之心' };
refineUseLevel(sword, levelGem, 125); // 直接升到125级

// 5. 开两个洞
const moonBox: GemItem = { /* ... */ name: '月光宝盒' };
refineOpenHole(sword, moonBox); // 开第一个洞
const enhancedBox: GemItem = { /* ... */ name: '月光宝盒增强版' };
refineOpenHole(sword, enhancedBox); // 开第二个洞

// 6. 镶嵌宝石
const combatGem: GemItem = { /* ... */ name: '高级战斗力石' };
embedGem(sword, combatGem); // 第一个洞
const expGem: GemItem = { /* ... */ name: '高级经验石' };
embedGem(sword, expGem); // 第二个洞

// 7. 激活战魂
const soulHeart: GemItem = { /* ... */ name: '战魂之心' };
activateSoul(sword, soulHeart);

console.log('最终装备：', sword);
// {
//   equipmentQuality: '极品',
//   magicSoulLevel: 12,
//   useLevel: 125,
//   holeCount: 2,
//   gems: ['高级战斗力石', '高级经验石'],
//   soulType: 1, // 天魂
//   soulLevel: 3 // 高级宝石提升了战魂等级
// }
```

## 9. 升极品时战魂逻辑

当装备品质提升到极品时，会触发战魂相关逻辑（需要战魂系统已开启）：

- **已有战魂且等级<5**：战魂等级+1，提示"装备品质提升到了极品使得装备能量提升，战魂等级提高一级。"
- **无战魂**：2.5%概率激活战魂，激活时随机获得天魂或地魂，等级为1
- **战魂等级=5**：不再提升

```typescript
// 使用灵魂王升极品，触发战魂逻辑
const result = refineQuality(equipment, soulKingGem, true); // warSoulSystemEnabled=true
console.log(result);
// 如果已有战魂且等级<5：
// { success: true, message: '...战魂等级提高一级。', attributeChanges: { soulLevelChange: 1, ... } }
// 如果无战魂且2.5%概率触发：
// { success: true, message: '...激活了装备战魂！', attributeChanges: { soulActivated: 1, ... } }
```

## 10. 魔魂升至12级时战魂等级提升

当装备魔魂等级升至12级时，如果装备已有战魂且战魂等级<5，战魂等级+1：

```typescript
// 使用魔魂晶石提升到+12，触发战魂等级提升
const result = refineMagicSoul(equipment, magicGem, true); // warSoulSystemEnabled=true
console.log(result);
// { success: true, message: '...魔魂等级提升到了12级使得装备能量提升，战魂等级提高一级。', ... }
```

## 11. 摘除宝石

从装备上摘除指定位置的宝石。摘除宝石时，如果装备有战魂且战魂等级>1，战魂等级降为1：

```typescript
// 摘除第一个宝石（索引0）
const result = removeGem(equipment, 0);
console.log(result);
// { success: true, message: '成功摘除高级战斗力石！ 摘除宝石操作使战魂的等级下降为1级', ... }

// 摘除第二个宝石（索引1）
const result2 = removeGem(equipment, 1);
```

## 12. 战魂系统开关参数

以下精炼函数新增了 `warSoulSystemEnabled?: boolean` 可选参数，用于控制战魂相关逻辑：

| 函数 | 参数 | 说明 |
|------|------|------|
| `refineQuality` | `warSoulSystemEnabled?` | 升极品时是否触发战魂逻辑 |
| `refineMagicSoul` | `warSoulSystemEnabled?` | 魔魂升至12级时是否触发战魂等级提升 |
| `refineOpenHole` | `warSoulSystemEnabled?` | 开洞时是否触发战魂激活 |
| `activateSoul` | `warSoulSystemEnabled?` | 战魂系统未开启时返回失败 |

```typescript
// 战魂系统未开启时激活战魂会失败
const result = activateSoul(equipment, soulGem, false);
console.log(result);
// { success: false, message: '战魂系统尚未开启，请先击败无名氏开启战魂系统' }
```

## 13. 战魂套装效果

战魂套装需要所有6件装备都拥有战魂属性且类型一致：

| 套装类型 | 条件 | 效果 | 最大加成 |
|----------|------|------|----------|
| 天魂套装 | 6件装备soulType=1 | 攻击力+每件战魂等级×5% | 150% |
| 地魂套装 | 6件装备soulType=2 | 闪避率+每件战魂等级×2% | 60% |
| 混合套装 | 不同类型战魂 | 无套装效果 | - |

套装等级 = 所有装备战魂等级中的最小值

PK赛战斗力加成 = 套装等级 × 5%（最高25%）

```typescript
import { checkWarSoulSet, calculateTianHunSetBonus, calculateDiHunSetBonus, calculateWarSoulPKCombatPower } from '@/utils/combatPower';

// 检查战魂套装
const setInfo = checkWarSoulSet(character.equipment);
console.log(setInfo);
// { isActivated: true, setType: WarSoulType.TIAN_HUN, setLevel: 3 }

// 计算天魂套装攻击加成
const attackBonus = calculateTianHunSetBonus(character.equipment);
console.log(attackBonus); // 0.15 (15%)

// 计算地魂套装闪避加成
const dodgeBonus = calculateDiHunSetBonus(character.equipment);
console.log(dodgeBonus); // 0 (无地魂装备)

// 计算PK赛战斗力加成
const pkBonus = calculateWarSoulPKCombatPower(character.equipment);
console.log(pkBonus); // 0.15 (15%)
```

## 注意事项

1. **品质提升**：灵魂晶石成功率随品质提升而降低，建议使用灵魂王确保成功
2. **魔魂提升**：+9后失败不降级，建议+9前使用魔魂之心
3. **使用等级**：升级后等级不能超过玩家等级
4. **开洞**：月光宝盒只能开第一个洞，增强版只能开第二个洞
5. **镶嵌**：高级宝石会提升战魂等级（最高5级）
6. **战魂**：战魂之心100%成功，战魂晶石仅20%成功率
7. **升极品战魂**：升极品时已有战魂则等级+1，无战魂则2.5%概率激活（需战魂系统已开启）
8. **魔魂12级战魂**：魔魂升至12级时战魂等级+1（需战魂系统已开启）
9. **摘除宝石**：摘除宝石会使战魂等级降为1（如果等级>1）
10. **战魂系统开关**：使用战魂相关功能前需先击败无名氏开启战魂系统
11. **战魂套装**：6件装备战魂类型一致时激活套装效果

## 错误处理

所有函数都会返回 `RefineResult` 对象，包含：
- `success`: 是否成功
- `message`: 结果消息
- `attributeChanges`: 属性变化（可选）

建议在使用前调用 `canRefine` 检查是否可以精炼。
