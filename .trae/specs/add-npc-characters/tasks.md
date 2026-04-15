# Tasks

- [x] Task 1: 扩展 NPC 类型定义和数据结构
  - [x] SubTask 1.1: 在 types/index.ts 中扩展 NPCInteractable 接口，添加 location、npcType、conditions 字段
  - [x] SubTask 1.2: 扩展 NPCInteractionOption 接口，添加 condition 字段支持条件显示
  - [x] SubTask 1.3: 定义 NPCInteractionCondition 接口，支持多种条件类型（weekday、relationship、militaryRank、nobleRank）
  - [x] SubTask 1.4: 定义 NPC 类型枚举（palace、function、shop、special）

- [x] Task 2: 创建 NPC 数据配置文件
  - [x] SubTask 2.1: 创建 src/data/npcData.ts 文件
  - [x] SubTask 2.2: 实现皇宫 NPC 配置（国王、公主、元帅、首相、丫环）
  - [x] SubTask 2.3: 实现功能 NPC 配置（日常任务官、地图赛报名官、PK赛报名官、抽奖官）
  - [x] SubTask 2.4: 实现商店 NPC 配置（宝石合成师、收藏家、幻兽研究所）
  - [x] SubTask 2.5: 实现特殊 NPC 配置（2008奥运使者、探险家）
  - [x] SubTask 2.6: 为每个 NPC 配置详细的对话选项和条件

- [x] Task 3: 实现 NPC 条件判断工具函数
  - [x] SubTask 3.1: 创建 src/utils/npcUtils.ts 文件
  - [x] SubTask 3.2: 实现 checkNPCOptionCondition 函数，判断选项是否显示
  - [x] SubTask 3.3: 实现 weekday 条件判断（判断当前是否为指定星期）
  - [x] SubTask 3.4: 实现 relationship 条件判断（判断公主关系等级）
  - [x] SubTask 3.5: 实现 militaryRank 条件判断（判断军衔等级）
  - [x] SubTask 3.6: 实现 nobleRank 条件判断（判断爵位等级）

- [x] Task 4: 增强 NPCModal 组件功能
  - [x] SubTask 4.1: 修改 NPCModal 组件，支持条件选项显示
  - [x] SubTask 4.2: 添加 NPC 类型和位置信息展示
  - [x] SubTask 4.3: 实现选项执行后的结果反馈显示
  - [x] SubTask 4.4: 优化 NPC 对话界面布局和样式

- [x] Task 5: 实现军衔系统功能
  - [x] SubTask 5.1: 在 characterData.ts 中完善军衔相关数据（军饷奖励配置）
  - [x] SubTask 5.2: 实现领取军饷功能（周日领取魔石）
  - [x] SubTask 5.3: 实现战功查询功能（显示当前战功和晋升需求）
  - [x] SubTask 5.4: 实现军情查询功能（显示各等级 BOSS 位置）
  - [x] SubTask 5.5: 实现军衔系统说明展示

- [x] Task 6: 实现爵位系统功能
  - [x] SubTask 6.1: 在 characterData.ts 中完善爵位相关数据
  - [x] SubTask 6.2: 实现爵位系统说明展示
  - [x] SubTask 6.3: 实现爵位奖励领取功能
  - [x] SubTask 6.4: 实现交易功能（打开交易界面，预留接口）

- [x] Task 7: 实现公主关系系统功能
  - [x] SubTask 7.1: 在 characterData.ts 中添加公主关系数据（亲密度、关系等级）
  - [x] SubTask 7.2: 实现聊天功能（每天一次，增加友好度，获得幻兽奖励）
  - [x] SubTask 7.3: 实现送礼功能（周日送花，大幅提升友好度）
  - [x] SubTask 7.4: 实现周日礼物领取功能（根据关系等级发放不同礼物）
  - [x] SubTask 7.5: 实现知己的礼物功能（关系≥4时获得年猪）
  - [x] SubTask 7.6: 实现魔族大军情报查看功能（国王 NPC）

- [x] Task 8: 实现日常任务系统功能
  - [x] SubTask 8.1: 创建 src/data/dailyTaskData.ts 文件，配置每日任务
  - [x] SubTask 8.2: 实现任务接受功能（根据星期显示不同任务）
  - [x] SubTask 8.3: 实现任务完成判定和奖励发放
  - [x] SubTask 8.4: 实现任务系统说明展示

- [x] Task 9: 实现地图挑战系统功能
  - [x] SubTask 9.1: 创建 src/data/mapChallengeData.ts 文件，配置地图挑战数据
  - [x] SubTask 9.2: 实现地图挑战报名功能（检查爵位要求）
  - [x] SubTask 9.3: 实现保护者奖励领取功能
  - [x] SubTask 9.4: 实现地图挑战系统说明展示

- [x] Task 10: 更新地图数据配置
  - [ ] SubTask 10.1: 在 gameData.ts 中为皇宫地图添加 NPC 交互 ID
  - [ ] SubTask 10.2: 为树心城地图添加 NPC 交互 ID
  - [ ] SubTask 10.3: 为各地图添加对应的地图赛报名官 NPC
  - [ ] SubTask 10.4: 创建抽奖房地图并添加抽奖官 NPC

- [x] Task 11: 集成 NPC 到交互系统
  - [x] SubTask 11.1: 更新 interactableData.ts，导入所有 NPC 配置
  - [x] SubTask 11.2: 在 App.tsx 中实现 NPC 交互处理函数
  - [x] SubTask 11.3: 实现 handleNPCInteract 函数，处理不同 NPC 的交互逻辑
  - [x] SubTask 11.4: 实现选项执行后的状态更新和反馈

- [x] Task 12: 测试和验证
  - [x] SubTask 12.1: 测试所有 NPC 的显示和交互
  - [x] SubTask 12.2: 测试条件选项的正确显示和隐藏
  - [x] SubTask 12.3: 测试军衔、爵位、公主关系系统功能
  - [x] SubTask 12.4: 测试日常任务和地图挑战系统
  - [x] SubTask 12.5: 验证 NPC 在不同地图的正确分布

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 1, Task 3]
- [Task 5] depends on [Task 2, Task 3]
- [Task 6] depends on [Task 2, Task 3]
- [Task 7] depends on [Task 2, Task 3]
- [Task 8] depends on [Task 2, Task 3]
- [Task 9] depends on [Task 2, Task 3]
- [Task 10] depends on [Task 2]
- [Task 11] depends on [Task 2, Task 4, Task 5, Task 6, Task 7, Task 8, Task 9]
- [Task 12] depends on [Task 11]
