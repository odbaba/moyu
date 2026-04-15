# Tasks

## 任务清单

- [x] Task 1: 创建抽奖区地点配置
  - [x] SubTask 1.1: 在 gameData.ts 中新增 'lottery-area' 地点配置
  - [x] SubTask 1.2: 设置抽奖区坐标为 (6, 1)
  - [x] SubTask 1.3: 配置抽奖区的 interactables（7个宝箱按钮 + 1个回城按钮）
  - [x] SubTask 1.4: 确保抽奖区不与任何现有地点连接（adjacentLocations 为空）

- [x] Task 2: 修改抽奖官NPC交互逻辑
  - [x] SubTask 2.1: 更新 npc_lottery 的 description 字段为完整的抽奖说明
  - [x] SubTask 2.2: 修改抽奖官的对话选项，增加"试试运气"选项
  - [x] SubTask 2.3: 实现 teleportToLottery actionType
  - [x] SubTask 2.4: 确保玩家确认后能正确传送至抽奖区

- [x] Task 3: 创建抽奖系统工具函数
  - [x] SubTask 3.1: 创建 src/utils/lotterySystem.ts 文件
  - [x] SubTask 3.2: 实现抽奖概率计算函数（random 0-999）
  - [x] SubTask 3.3: 实现奖品等级判定函数
  - [x] SubTask 3.4: 实现极品奖品随机选择函数（6选1）
  - [x] SubTask 3.5: 实现高级奖品随机选择函数（7选1）
  - [x] SubTask 3.6: 实现中级奖品随机选择函数（5选1）
  - [x] SubTask 3.7: 实现普通奖品随机选择函数（4选1）
  - [x] SubTask 3.8: 实现装备生成函数（根据玩家等级）
  - [x] SubTask 3.9: 实现魔石扣除和检查函数

- [x] Task 4: 创建抽奖区界面组件
  - [x] SubTask 4.1: 创建 src/components/lottery 目录
  - [x] SubTask 4.2: 创建 LotteryArea.tsx 主组件
  - [x] SubTask 4.3: 实现抽奖区界面布局（标题、提示、宝箱按钮、回城按钮）
  - [x] SubTask 4.4: 创建 lottery.css 样式文件
  - [x] SubTask 4.5: 实现手机端响应式布局
  - [x] SubTask 4.6: 创建 README.md 文档

- [x] Task 5: 创建宝箱按钮组件
  - [x] SubTask 5.1: 创建 LotteryBox.tsx 组件
  - [x] SubTask 5.2: 实现宝箱按钮点击交互
  - [x] SubTask 5.3: 实现魔石检查逻辑
  - [x] SubTask 5.4: 实现抽奖结果展示
  - [x] SubTask 5.5: 实现时间消耗逻辑（每次抽奖消耗2点时间）

- [x] Task 6: 实现回城按钮功能
  - [x] SubTask 6.1: 在抽奖区界面添加回城按钮
  - [x] SubTask 6.2: 实现点击回城按钮传送至卡萨诺城
  - [x] SubTask 6.3: 确保回城后关闭抽奖区界面

- [x] Task 7: 集成抽奖系统到主应用
  - [x] SubTask 7.1: 在 App.tsx 中导入抽奖相关组件
  - [x] SubTask 7.2: 添加抽奖区状态管理
  - [x] SubTask 7.3: 实现抽奖官NPC的传送逻辑
  - [x] SubTask 7.4: 确保抽奖结果正确添加到背包或幻兽栏

- [x] Task 8: 实现奖品发放逻辑
  - [x] SubTask 8.1: 实现物品奖品添加到背包的逻辑
  - [x] SubTask 8.2: 实现幻兽奖品添加到幻兽栏的逻辑
  - [x] SubTask 8.3: 实现装备生成的完整逻辑（等级、类型、品质、魔魂等级、宝石孔）
  - [x] SubTask 8.4: 实现特殊提示显示（幸运女神青睐）

- [x] Task 9: 测试和验证
  - [x] SubTask 9.1: 测试抽奖官NPC交互流程
  - [x] SubTask 9.2: 测试传送至抽奖区功能
  - [x] SubTask 9.3: 测试魔石扣除逻辑
  - [x] SubTask 9.4: 测试抽奖概率分布（多次抽奖验证概率）
  - [x] SubTask 9.5: 测试各类奖品发放
  - [x] SubTask 9.6: 测试回城功能
  - [x] SubTask 9.7: 测试手机端界面显示

## 任务依赖关系

- Task 2 依赖 Task 1（需要先创建抽奖区地点）
- Task 5 依赖 Task 3（需要抽奖系统工具函数）
- Task 7 依赖 Task 1, Task 2, Task 4, Task 5, Task 6（需要所有组件和配置就绪）
- Task 8 依赖 Task 3, Task 7（需要工具函数和系统集成）
- Task 9 依赖所有前置任务完成

## 并行任务

以下任务可以并行执行：
- Task 1 和 Task 3（地点配置和工具函数开发互不依赖）
- Task 4 和 Task 5（界面组件和宝箱组件可以并行开发）
- Task 6 可以与 Task 4、Task 5 并行开发
