# Tasks

- [x] Task 1: 扩展类型定义
  - [x] SubTask 1.1: 在 CharacterData 接口中添加基础属性常量和成长系数字段
  - [x] SubTask 1.2: 在 CharacterData 接口中添加 equipmentBonus 字段
  - [x] SubTask 1.3: 在 EquipmentDetail 接口中添加战魂属性(soulType, soulLevel)
  - [x] SubTask 1.4: 在 EquipmentDetail 接口中添加基础属性和追加属性字段

- [x] Task 2: 创建装备属性计算工具函数
  - [x] SubTask 2.1: 创建 calculateEquipmentBaseAttributes 函数，根据装备类型和等级计算基础属性
  - [x] SubTask 2.2: 创建 calculateEquipmentBonusAttributes 函数，根据魔魂等级计算追加属性
  - [x] SubTask 2.3: 创建 calculateTotalEquipmentAttributes 函数，汇总所有装备属性

- [x] Task 3: 创建角色属性计算工具函数
  - [x] SubTask 3.1: 创建 calculateCharacterBaseAttributes 函数，根据等级计算基础属性
  - [x] SubTask 3.2: 创建 calculateSoulBonus 函数，计算战魂加成
  - [x] SubTask 3.3: 创建 calculateTotalCharacterAttributes 函数，汇总所有属性加成

- [x] Task 4: 优化战斗力计算
  - [x] SubTask 4.1: 修改装备品质战斗力计算公式为 pz
  - [x] SubTask 4.2: 添加宝石洞战斗力计算为 dong
  - [x] SubTask 4.3: 添加战魂战斗力加成计算

- [x] Task 5: 更新角色数据初始化
  - [x] SubTask 5.1: 更新 characterData.ts 中的角色数据，添加基础属性常量和成长系数
  - [x] SubTask 5.2: 更新装备数据，添加战魂属性

- [x] Task 6: 更新角色信息显示组件
  - [x] SubTask 6.1: 修改 CharacterInfo 组件，显示动态计算后的属性
  - [x] SubTask 6.2: 显示装备加成数值（如有装备）
  - [x] SubTask 6.3: 显示战魂加成百分比（如有战魂）

- [x] Task 7: 更新战斗力详情弹窗
  - [x] SubTask 7.1: 添加装备品质战斗力详情显示
  - [x] SubTask 7.2: 添加宝石洞战斗力详情显示
  - [x] SubTask 7.3: 添加战魂战斗力详情显示

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 1]
- [Task 5] depends on [Task 1]
- [Task 6] depends on [Task 2, Task 3]
- [Task 7] depends on [Task 4]
