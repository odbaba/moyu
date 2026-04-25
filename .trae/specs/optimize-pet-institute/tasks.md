# Tasks

- [x] Task 1: 修复资助魔石计算逻辑
  - [x] SubTask 1.1: 修改 `donate` 函数中的计算公式，从每100魔石提升1级改为每10000魔石提升1级
  - [x] SubTask 1.2: 更新相关注释说明

- [x] Task 2: 添加技术等级购买限制
  - [x] SubTask 2.1: 在 `canBuyPet` 函数中添加技术等级>=20的检查
  - [x] SubTask 2.2: 返回适当的错误提示"技术20级前不能生产幻兽"

- [x] Task 3: 添加生产量自动增长逻辑
  - [x] SubTask 3.1: 在 `donate` 函数中添加技术等级达到20级时生产量自动+1的逻辑
  - [x] SubTask 3.2: 确保只在生产量为0时触发

- [x] Task 4: 添加资助最低金额限制
  - [x] SubTask 4.1: 在 `canDonate` 函数中添加最低100魔石的检查
  - [x] SubTask 4.2: 返回适当的错误提示

- [x] Task 5: 优化购买时的背包检查提示
  - [x] SubTask 5.1: 在 `PetInstituteModal` 组件中检查幻兽背包是否已满
  - [x] SubTask 5.2: 显示背包已满的提示信息

- [x] Task 6: 更新相关文档和注释
  - [x] SubTask 6.1: 更新 `petInstituteUtils.ts` 中的函数注释
  - [x] SubTask 6.2: 确保所有修改符合参考文档规范

# Task Dependencies
- Task 2, Task 3, Task 4 可并行执行
- Task 5 依赖于 Task 2（购买限制逻辑）
- Task 6 应在所有代码修改完成后执行
