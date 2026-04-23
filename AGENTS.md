1.本项目优先保障手机端的用户体验，手机一屏能展示所有信息

2.当涉及物品生成逻辑时请优先复用src\utils\itemFactory.ts下的cloneItem函数

3.生成代码和修改代码时必须增加注释

4.新增新页面需要新增文件夹，并在文件夹下增加md文件使得AI能够更易读项目

5.生成的代码结构需要使AI能够更易读项目

6.涉及代码逻辑改动时，必须更新文件夹下的md文件

7.有不够明确的逻辑都可以参考/reference下的文档和代码, 以及项目中的注释和文档，/reference下代码不可更改

8.当需要在地点增加交互按钮（NPC、怪物）时，需要在src\data\gameData.ts下修改locations数据

9.尽可能复用现有功能，避免重复实现相同的功能，如果已有功能逻辑存在不一致请和我确认是否需要修改，例：生成装备使用createEquipmentItem，生成幻兽使用generatePetByType，生成特殊的奇异兽（8星、12星、19星）使用generateStarStrangePet

10.所有白色字体和白色边框都是指的#FCFFFF颜色