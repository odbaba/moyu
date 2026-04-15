# Tasks

## 任务1: 添加装备打造师NPC配置
- [x] Task 1.1: 在 src/data/npcData.ts 中添加装备打造师NPC配置
  - [x] 配置NPC基本信息（id, name, icon, description）
  - [x] 配置NPC位置为卡萨诺城（location: 'kasanuocheng'）
  - [x] 配置NPC类型为商店类型（npcType: 'shop'）
  - [x] 配置交互选项列表（精练装备、帮助信息等）
  - [x] 配置战魂选项的条件显示逻辑

- [x] Task 1.2: 在 src/data/gameData.ts 中更新卡萨诺城的interactables列表
  - [x] 添加装备打造师NPC的交互ID到卡萨诺城的interactables数组

- [x] Task 1.3: 在 npcByLocation 和 npcByType 映射表中添加装备打造师
  - [x] 更新 npcByLocation['kasanuocheng'] 数组
  - [x] 更新 npcByType['shop'] 数组

## 任务2: 创建装备精炼界面组件
- [x] Task 2.1: 创建 src/components/common/EquipmentRefineModal.tsx 组件
  - [x] 设计界面布局（左侧装备槽、右侧宝石槽、开始按钮）
  - [x] 实现拖拽接收功能
  - [x] 实现装备和宝石的识别逻辑
  - [x] 实现精炼按钮和结果反馈

- [x] Task 2.2: 创建 src/components/common/EquipmentRefineModal.css 样式文件
  - [x] 设计精炼界面样式
  - [x] 设计装备槽和宝石槽样式
  - [x] 设计成功/失败反馈样式

- [x] Task 2.3: 在 src/App.tsx 中集成精炼界面
  - [x] 添加精炼界面状态管理
  - [x] 处理 'openRefine' actionType
  - [x] 实现打开/关闭精炼界面的逻辑

## 任务3: 实现装备精炼核心逻辑
- [x] Task 3.1: 创建 src/utils/equipmentRefine.ts 工具文件
  - [x] 实现物品识别函数 isWeaponOrStone()
  - [x] 实现品质提升函数 refineQuality()
  - [x] 实现魔魂提升函数 refineMagicSoul()
  - [x] 实现等级提升函数 refineUseLevel()
  - [x] 实现开洞函数 refineOpenHole()
  - [x] 实现宝石镶嵌函数 embedGem()
  - [x] 实现战魂激活函数 activateSoul()

- [x] Task 3.2: 实现成功率计算逻辑
  - [x] 实现品质提升成功率计算
  - [x] 实现魔魂提升成功率计算
  - [x] 实现等级提升成功率计算
  - [x] 实现战魂激活概率计算

- [x] Task 3.3: 实现失败处理逻辑
  - [x] 实现魔魂降级逻辑（+9后不降级）
  - [x] 实现精炼失败提示

## 任务4: 添加宝石和道具数据
- [x] Task 4.1: 在 src/data/inventoryData.ts 中添加强化类宝石
  - [x] 添加魔魂晶石数据
  - [x] 添加魔魂之心数据
  - [x] 添加灵魂晶石数据
  - [x] 添加灵魂王数据
  - [x] 添加幻魔晶石数据
  - [x] 添加幻魔之心数据

- [x] Task 4.2: 在 src/data/inventoryData.ts 中添加开洞类道具
  - [x] 添加月光宝盒数据
  - [x] 添加月光宝盒增强版数据

- [x] Task 4.3: 在 src/data/inventoryData.ts 中添加镶嵌类宝石
  - [x] 添加中级战斗力石数据
  - [x] 添加高级战斗力石数据
  - [x] 添加中级经验石数据
  - [x] 添加高级经验石数据

- [x] Task 4.4: 在 src/data/inventoryData.ts 中添加战魂类道具
  - [x] 添加战魂晶石数据
  - [x] 添加战魂之心数据

## 任务5: 扩展类型定义
- [x] Task 5.1: 在 src/types/index.ts 中扩展 GemItem 接口
  - [x] 添加 gemSubType 字段（强化/镶嵌/开洞/战魂）
  - [x] 添加 successRate 字段（成功率描述）
  - [x] 添加 refineType 字段（精炼类型）

- [x] Task 5.2: 添加精炼相关类型定义
  - [x] 定义 RefineType 类型（品质/魔魂/等级/开洞/镶嵌/战魂）
  - [x] 定义 RefineResult 接口（成功/失败/消息/属性变化）
  - [x] 定义 GemSubType 类型枚举

## 任务6: 更新装备属性计算逻辑
- [x] Task 6.1: 在 src/utils/equipmentConverter.ts 中更新属性计算
  - [x] 更新魔魂追加属性计算
  - [x] 更新品质战斗力加成计算
  - [x] 更新宝石属性加成计算
  - [x] 更新战魂属性加成计算

- [x] Task 6.2: 实现精炼后属性更新
  - [x] 实现品质提升后的属性更新
  - [x] 实现魔魂提升后的属性更新
  - [x] 实现开洞后的属性更新
  - [x] 实现镶嵌后的属性更新
  - [x] 实现战魂激活后的属性更新

## 任务7: 实现帮助信息系统
- [x] Task 7.1: 实现装备打造师帮助信息
  - [x] 实现"关于提升魔魂等级"帮助信息
  - [x] 实现"关于提升品质"帮助信息
  - [x] 实现"关于装备开洞"帮助信息
  - [x] 实现"关于镶嵌宝石"帮助信息
  - [x] 实现"关于战魂"帮助信息

## 任务8: 添加音效支持（可选）
- [ ] Task 8.1: 添加精炼音效
  - [ ] 添加精炼成功音效
  - [ ] 添加精炼失败音效

## 任务9: 测试和验证
- [x] Task 9.1: 功能测试
  - [x] 测试装备打造师NPC交互
  - [x] 测试精炼界面打开和关闭
  - [x] 测试装备和宝石拖拽
  - [x] 测试各种精炼功能
  - [x] 测试成功率计算
  - [x] 测试失败处理

- [x] Task 9.2: 边界情况测试
  - [x] 测试装备已达最高品质
  - [x] 测试魔魂已达最高等级
  - [x] 测试装备已有2个洞
  - [x] 测试战魂已达最高等级
  - [x] 测试等级超过玩家等级

## 任务10: 装备使用等级提升后更新名称和属性
- [x] Task 10.1: 创建装备名称映射表
  - [x] 创建 src/data/equipmentNames.ts 文件
  - [x] 定义各等级装备名称映射表（武器、头盔、衣服、战鞋、手镯、项链）
  - [x] 实现 getEquipmentName 函数
  - [x] 实现 getEquipmentBaseLevel 函数
  - [x] 实现 calculateEquipmentBaseAttributes 函数

- [x] Task 10.2: 更新 refineUseLevel 函数
  - [x] 导入装备名称和属性计算函数
  - [x] 添加 updateEquipmentNameAndAttributes 辅助函数
  - [x] 在成功提升等级后更新装备名称
  - [x] 在成功提升等级后更新基础属性
  - [x] 重新计算魔魂追加属性

# Task Dependencies
- Task 2 依赖 Task 5（类型定义）
- Task 3 依赖 Task 5（类型定义）
- Task 4 依赖 Task 5（类型定义）
- Task 6 依赖 Task 3（精炼逻辑）
- Task 9 依赖所有前置任务
- Task 10 依赖 Task 3（精炼逻辑）
