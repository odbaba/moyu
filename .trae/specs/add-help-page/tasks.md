# Tasks

- [x] Task 1: 创建帮助信息生成工具函数
  - [x] SubTask 1.1: 创建 src/utils/helpUtils.ts 文件
  - [x] SubTask 1.2: 实现等级帮助信息生成函数（判断等级是否 < 132）
  - [x] SubTask 1.3: 实现装备品质帮助信息生成函数（判断是否有装备未达极品）
  - [x] SubTask 1.4: 实现装备魔魂等级帮助信息生成函数（判断是否有装备魔魂 < 12级）
  - [x] SubTask 1.5: 实现装备使用等级帮助信息生成函数（判断是否有装备可提升使用等级）
  - [x] SubTask 1.6: 实现装备战魂等级帮助信息生成函数（判断战魂系统是否开启，是否有装备战魂 < 5级）
  - [x] SubTask 1.7: 实现装备战魂套装帮助信息生成函数（判断战魂系统是否开启，战魂类型是否一致）
  - [x] SubTask 1.8: 实现幻兽帮助信息生成函数
  - [x] SubTask 1.9: 实现军衔帮助信息生成函数（判断军衔是否 < 元帅）
  - [x] SubTask 1.10: 实现爵位帮助信息生成函数（判断爵位是否 < 王）
  - [x] SubTask 1.11: 实现公主关系帮助信息生成函数（判断关系是否 < 亲密恋人）
  - [x] SubTask 1.12: 实现金钱魔石帮助信息生成函数

- [x] Task 2: 创建帮助页面组件
  - [x] SubTask 2.1: 创建 src/components/help 文件夹
  - [x] SubTask 2.2: 创建 src/components/help/HelpPage.tsx 组件文件
  - [x] SubTask 2.3: 实现帮助页面UI布局，参考结算页面但不显示评价称号、综合评语和操作按钮
  - [x] SubTask 2.4: 在各项属性后面集成帮助信息显示
  - [x] SubTask 2.5: 添加关闭按钮功能

- [x] Task 3: 创建帮助页面样式文件
  - [x] SubTask 3.1: 创建 src/components/help/help.css 文件
  - [x] SubTask 3.2: 参考结算页面样式，调整帮助页面样式
  - [x] SubTask 3.3: 添加帮助信息的样式（字体颜色、大小等）

- [x] Task 4: 集成帮助页面到主应用
  - [x] SubTask 4.1: 在 App.tsx 中添加帮助页面状态管理
  - [x] SubTask 4.2: 在 Menu.tsx 中为帮助按钮添加点击事件
  - [x] SubTask 4.3: 在 App.tsx 中添加帮助页面的渲染逻辑
  - [x] SubTask 4.4: 导入帮助页面样式文件到 App.tsx

- [x] Task 5: 测试和验证
  - [x] SubTask 5.1: 测试帮助页面打开和关闭功能
  - [x] SubTask 5.2: 验证各项帮助信息在正确条件下显示
  - [x] SubTask 5.3: 验证各项帮助信息在正确条件下隐藏
  - [x] SubTask 5.4: 测试手机端显示效果（一屏展示所有内容）

# Task Dependencies
- [Task 2] depends on [Task 1]（帮助页面组件需要使用帮助信息生成函数）
- [Task 3] depends on [Task 2]（样式文件配合组件开发）
- [Task 4] depends on [Task 2, Task 3]（集成需要组件和样式都完成）
- [Task 5] depends on [Task 4]（测试需要功能集成完成）
