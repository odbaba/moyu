# Scripts目录全面分析计划

## 任务概述

对 `/scripts/` 目录下的所有 ActionScript 文件进行逐行分析，添加注释，并整理技术文档。

---

## 文件分类统计

### 1. 主时间轴帧脚本 (frame_*)
- frame_2 到 frame_38
- 共37个目录，每个目录包含 DoAction.as
- **frame_6** 和 **frame_37** 是最核心的文件

### 2. DefineSprite 元件脚本
- 约200+个目录
- 包含物品、怪物、UI、幻兽等游戏对象
- 重要文件：
  - DefineSprite_932 - 角色信息
  - DefineSprite_561 - 装备系统
  - DefineSprite_787 - 幻兽背包
  - DefineSprite_139 - 幻兽对象
  - DefineSprite_124 - 怪物对象
  - DefineSprite_446 - 存档系统
  - DefineSprite_164_武器 等 - 装备类

### 3. DefineButton2 按钮脚本
- 约50+个文件
- 包含各种UI按钮的事件处理

### 4. PlaceObject2 事件脚本
- 嵌入在frame目录中的事件处理脚本

---

## 实施计划

### 第一阶段：核心文件分析（高优先级）

| 文件 | 功能 | 预计行数 |
|------|------|----------|
| frame_6/DoAction.as | 核心游戏逻辑 | ~700行 |
| frame_37/DoAction.as | 游戏结束评价 | ~300行 |
| DefineSprite_932/frame_1/DoAction.as | 角色信息管理 | ~600行 |
| DefineSprite_561/frame_1/DoAction.as | 装备系统 | ~500行 |
| DefineSprite_787/frame_1/DoAction.as | 幻兽背包 | ~300行 |
| DefineSprite_139_空幻兽对象/frame_1/DoAction.as | 幻兽对象 | ~300行 |
| DefineSprite_124_怪物对象/frame_1/DoAction.as | 怪物对象 | ~200行 |
| DefineSprite_446/frame_1/DoAction.as | 存档系统 | ~300行 |

### 第二阶段：装备物品类分析

| 文件 | 功能 |
|------|------|
| DefineSprite_164_武器 | 武器逻辑 |
| DefineSprite_189_头盔 | 头盔逻辑 |
| DefineSprite_214_手镯 | 手镯逻辑 |
| DefineSprite_239_项链 | 项链逻辑 |
| DefineSprite_264_衣服 | 衣服逻辑 |
| DefineSprite_289_战鞋 | 战鞋逻辑 |
| DefineSprite_37_体力药 | 消耗品逻辑 |
| DefineSprite_41_满经验球 | 经验球逻辑 |

### 第三阶段：UI界面类分析

| 文件 | 功能 |
|------|------|
| DefineSprite_1018~1235 | 各种UI组件 |
| frame_8~35 中的PlaceObject2 | 地图事件处理 |

### 第四阶段：按钮事件分析

| 文件 | 功能 |
|------|------|
| DefineButton2_* | 各类按钮点击事件 |

---

## 输出文档结构

```
docs/
├── 01_角色系统.md          # 已完成
├── 02_幻兽系统.md          # 已完成
├── Frame脚本功能分析.md    # 已完成
├── 物品图片映射关系.md     # 已完成
├── scripts_analysis/
│   ├── 00_索引.md          # 文件索引
│   ├── 01_核心逻辑.md      # frame_6核心函数
│   ├── 02_角色信息.md      # DefineSprite_932
│   ├── 03_装备系统.md      # DefineSprite_561
│   ├── 04_幻兽系统.md      # DefineSprite_787, 139
│   ├── 05_怪物系统.md      # DefineSprite_124
│   ├── 06_存档系统.md      # DefineSprite_446
│   ├── 07_物品类/
│   │   ├── 武器.md
│   │   ├── 头盔.md
│   │   └── ...
│   ├── 08_UI组件/
│   │   └── ...
│   └── 09_按钮事件/
│       └── ...
```

---

## 实施步骤

1. **创建索引文档** - 列出所有文件及其分类
2. **分析核心文件** - frame_6, DefineSprite_932等
3. **为每个文件添加注释** - 在原文件中添加中文注释
4. **生成技术文档** - 整理函数说明和调用关系
5. **更新整体技术文档** - 汇总所有分析结果

---

## 注意事项

1. 文件数量巨大，需要分批次处理
2. 优先处理核心逻辑文件
3. 注释使用中文，保持一致性
4. 保持原有代码结构不变，只添加注释
5. 文档需要包含代码引用链接

---

## 预计工作量

- 核心文件分析：8个文件 × 平均400行 = 3200行
- 装备物品类：20个文件 × 平均200行 = 4000行
- UI组件类：50个文件 × 平均100行 = 5000行
- 按钮事件：50个文件 × 平均50行 = 2500行

**总计：约15000行代码需要分析**
