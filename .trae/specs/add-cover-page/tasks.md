# Tasks

- [x] Task 1: 创建封面页面组件及样式
  - [x] SubTask 1.1: 创建 src/components/cover/ 目录，新增 CoverPage.tsx 组件，包含游戏标题、"开始游戏"按钮和"继续游戏"按钮
  - [x] SubTask 1.2: 创建 src/components/cover/cover.css 样式文件，封面页面样式优先保障手机端用户体验
  - [x] SubTask 1.3: 创建 src/components/cover/index.ts 导出文件
  - [x] SubTask 1.4: 创建 src/components/cover/README.md 说明文档
- [x] Task 2: 修改 App.tsx 集成封面页面
  - [x] SubTask 2.1: 新增 showCover 状态，默认为 true（进入游戏默认显示封面）
  - [x] SubTask 2.2: 修改 App.tsx 渲染逻辑，showCover 为 true 时显示封面页面，为 false 时显示游戏主界面
  - [x] SubTask 2.3: 修改游戏状态初始化逻辑，将存档数据读取从组件初始化时移除，改为通过回调函数传入
  - [x] SubTask 2.4: 实现"开始游戏"回调：清除存档数据（调用 deleteSave），设置 showCover 为 false
  - [x] SubTask 2.5: 实现"继续游戏"回调：从存档读取数据，使用存档数据初始化游戏状态，设置 showCover 为 false
  - [x] SubTask 2.6: "继续游戏"按钮根据 hasSaveData() 判断是否可用

# Task Dependencies
- [Task 2] depends on [Task 1]
