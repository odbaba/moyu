# 角色信息模块 (Character Module)

本目录包含角色信息和装备系统的所有组件。

## 目录结构

```
character/
├── index.ts              # 模块导出文件
├── README.md             # 本说明文件
├── character.css         # 角色信息模块样式
```

## 组件说明

（预留组件说明）

## 数据类型

```typescript
// 装备槽位类型（使用 clothes 而非 armor）
type EquipmentSlotType = 'weapon' | 'helmet' | 'clothes' | 'shoes' | 'bracelet' | 'necklace';

// 装备品质
type EquipmentQuality = '普通品' | '良品' | '上品' | '精品' | '极品';

// 装备详情
interface EquipmentDetail {
  id: string;
  name: string;
  type: EquipmentSlotType;
  quality: EquipmentQuality;
  magicSoulLevel: number;
  attributes: EquipmentAttribute;
  holeCount: number;
  gems?: string[];
  gemAttributes?: GemAttribute[];
  soulType?: number;
  soulLevel?: number;
  combatPower: number;
  icon?: string;
  imagePath?: string;
}

// 角色数据
interface CharacterData {
  id: string;
  playerName: string;
  level: number;
  equipment: {
    weapon: EquipmentDetail | null;
    clothes: EquipmentDetail | null;
    shoes: EquipmentDetail | null;
    bracelet: EquipmentDetail | null;
    necklace: EquipmentDetail | null;
    helmet: EquipmentDetail | null;
  };
  // ... 其他属性
}
```

## 使用示例

（预留使用示例）

## 注意事项

1. 本模块用于显示和管理玩家的角色详细信息
2. 支持装备的装备/卸下操作
3. 展示角色属性和技能信息
4. 所有样式遵循项目的现有设计风格
