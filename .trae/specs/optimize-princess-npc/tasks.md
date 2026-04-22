# Tasks

- [x] Task 1: 优化公主NPC对话内容
  - [x] SubTask 1.1: 在princessRelationUtils.ts中完善getChatDialogue函数，添加所有关系等级的对话内容
  - [x] SubTask 1.2: 添加已救国王状态判断逻辑（hasRescuedKing参数）
  - [x] SubTask 1.3: 在npcData.ts中更新公主NPC的描述，添加关系等级显示
  - [x] SubTask 1.4: 添加"查看关系"选项，显示当前关系等级、亲密度和升级需求

- [x] Task 2: 实现"爱的力量"技能学习功能
  - [x] SubTask 2.1: 在princessRelationUtils.ts中添加学习技能的逻辑
  - [x] SubTask 2.2: 在关系升级时检查是否达到等级5或6
  - [x] SubTask 2.3: 达到等级5时自动学习"爱的力量"等级1
  - [x] SubTask 2.4: 达到等级6时自动学习"爱的力量"等级2
  - [x] SubTask 2.5: 添加技能学习的提示消息

- [x] Task 3: 完善丫环NPC交易功能
  - [x] SubTask 3.1: 在npcData.ts中更新丫环1的配置，添加购买高级战斗力石选项
  - [x] SubTask 3.2: 在npcData.ts中更新丫环2的配置，添加购买年猪选项
  - [x] SubTask 3.3: 更新丫环NPC的描述和对话内容
  - [x] SubTask 3.4: 在App.tsx中实现丫环交易处理逻辑（buyItem action）
  - [x] SubTask 3.5: 实现每日限购和一次性购买的限制逻辑

- [x] Task 4: 优化周日礼物发放逻辑
  - [x] SubTask 4.1: 在princessRelationUtils.ts中完善getSundayGift函数
  - [x] SubTask 4.2: 添加战魂开启状态判断（hasOpenedSoul参数）
  - [x] SubTask 4.3: 关系等级6时根据战魂状态返回不同礼物（电浆药水或战魂之心）
  - [x] SubTask 4.4: 添加周日礼物的对话内容

- [x] Task 5: 优化知己礼物领取逻辑
  - [x] SubTask 5.1: 在princessRelationUtils.ts中完善receiveConfidantGift函数
  - [x] SubTask 5.2: 添加领取状态判断（hasReceivedConfidantGift）
  - [x] SubTask 5.3: 确保只能领取一次
  - [x] SubTask 5.4: 添加领取后的提示消息

- [x] Task 6: 更新NPC交互处理逻辑
  - [x] SubTask 6.1: 在App.tsx中添加viewRelationship action处理
  - [x] SubTask 6.2: 在App.tsx中添加receiveConfidantGift action处理
  - [x] SubTask 6.3: 在App.tsx中优化chat action处理，显示详细对话内容
  - [x] SubTask 6.4: 在App.tsx中优化receiveWeeklyGift action处理，考虑战魂状态
  - [x] SubTask 6.5: 在App.tsx中添加buyItem action处理（丫环交易）

- [x] Task 7: 添加必要的类型定义
  - [x] SubTask 7.1: 检查是否需要添加新的类型定义（如BuyItemAction）
  - [x] SubTask 7.2: 确保所有新增功能都有正确的类型支持

- [x] Task 8: 测试和验证
  - [x] SubTask 8.1: 测试公主对话内容是否根据关系等级正确显示
  - [x] SubTask 8.2: 测试"爱的力量"技能学习功能
  - [x] SubTask 8.3: 测试丫环交易功能（购买限制、价格扣除）
  - [x] SubTask 8.4: 测试周日礼物发放（不同关系等级、战魂状态）
  - [x] SubTask 8.5: 测试知己礼物领取（一次性限制）
  - [x] SubTask 8.6: 测试关系信息显示功能

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 6] depends on [Task 1, Task 2, Task 3, Task 4, Task 5]
- [Task 8] depends on [Task 1, Task 2, Task 3, Task 4, Task 5, Task 6, Task 7]
