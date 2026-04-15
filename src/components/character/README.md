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
// 装备类型
interface Equipment {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'accessory';
  attack: number;
  defense: number;
  maxHp: number;
  maxMp: number;
}

// 详细角色信息
interface CharacterDetail {
  id: string;
  name: string;
  level: number;
  exp: number;
  maxExp: number;
  maxHp: number;
  currentHp: number;
  maxMp: number;
  currentMp: number;
  attack: number;
  defense: number;
  equipment: {
    weapon: Equipment | null;
    armor: Equipment | null;
    accessory: Equipment | null;
  };
  skills: Skill[];
}
```

## 使用示例

（预留使用示例）

## 注意事项

1. 本模块用于显示和管理玩家的角色详细信息
2. 支持装备的装备/卸下操作
3. 展示角色属性和技能信息
4. 所有样式遵循项目的现有设计风格
