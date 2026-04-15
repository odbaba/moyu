# Checklist

## 类型定义验证
- [x] InteractableType枚举正确定义三种类型（action, enemy, npc）
- [x] ActionInteractable接口包含所有必要字段
- [x] EnemyData接口包含战斗力数据字段
- [x] EnemyInteractable接口包含敌人列表字段
- [x] NPCInteractable接口包含交互选项字段
- [x] Interactable联合类型正确组合三种类型

## 配置数据验证
- [x] interactableData.ts文件正确导出交互配置
- [x] 挖矿动作配置符合ActionInteractable接口
- [x] 巡逻小兵配置符合EnemyInteractable接口
- [x] 示例NPC配置符合NPCInteractable接口

## 组件实现验证
- [x] EnemyModal组件正确显示敌人描述
- [x] EnemyModal组件正确显示战斗力数据
- [x] EnemyModal攻击按钮正确触发战斗
- [x] EnemyModal离开按钮正确关闭弹窗
- [x] NPCModal组件正确显示NPC描述
- [x] NPCModal组件以垂直列表展示选项
- [x] NPCModal选项点击正确执行事件
- [x] InteractionButtons根据类型渲染不同样式

## 集成验证
- [x] App.tsx正确处理动作交互
- [x] App.tsx正确处理敌人交互
- [x] App.tsx正确处理NPC交互
- [x] SoldierModal相关代码已移除
- [x] gameData.ts位置数据正确引用交互配置

## 可扩展性验证
- [x] 新增敌人只需配置无需修改组件代码
- [x] 新增NPC只需配置无需修改组件代码
- [x] 新增动作只需配置无需修改组件代码

## 文档验证
- [x] 组件使用文档完整描述三种按钮类型
- [x] 配置参数说明清晰完整
- [x] 事件接口说明清晰完整
- [x] 使用示例代码可运行
- [x] 配置模板文件包含三种类型模板
- [x] 示例配置文件展示完整用法
