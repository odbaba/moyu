# Tasks

## 任务1: 新增战魂系统全局状态
- [x] Task 1.1: 在 src/App.tsx 中新增 warSoulSystemEnabled 状态
  - [x] 新增 useState hook：const [warSoulSystemEnabled, setWarSoulSystemEnabled] = useState(false)
  - [x] 在无名氏击败逻辑中设置 setWarSoulSystemEnabled(true)
  - [x] 更新击败无名氏后的提示信息

- [x] Task 1.2: 在存档系统中保存和加载战魂系统状态
  - [x] 在 saveGame 函数中保存 warSoulSystemEnabled 状态
  - [x] 在 loadGame 函数中加载 warSoulSystemEnabled 状态

## 任务2: 修改装备打造师NPC配置
- [x] Task 2.1: 修改 src/data/npcData.ts 中装备打造师的交互选项
  - [x] 将"关于战魂"选项改为条件显示
  - [x] 添加 condition 字段，检查 warSoulSystemEnabled 状态

- [x] Task 2.2: 修改 NPC 交互逻辑
  - [x] 在 NPCModal 组件中根据条件过滤交互选项
  - [x] 确保只有满足条件的选项才显示

## 任务3: 创建战魂物品掉落工具函数
- [x] Task 3.1: 创建 src/utils/warSoulDropUtils.ts 文件
  - [x] 定义 WarSoulDropConfig 接口（怪物ID、掉落物品、掉落概率）
  - [x] 定义战魂之心掉落配置表
  - [x] 定义战魂晶石掉落配置表

- [x] Task 3.2: 实现 checkWarSoulDrop 函数
  - [x] 参数：怪物ID、战魂系统开启状态
  - [x] 返回：掉落的战魂物品列表（可能为空）
  - [x] 根据怪物ID查询掉落配置
  - [x] 根据概率判断是否掉落

- [x] Task 3.3: 实现 getWarSoulDropConfig 函数
  - [x] 参数：怪物ID
  - [x] 返回：该怪物的战魂物品掉落配置

## 任务4: 集成战魂物品掉落到战斗系统
- [x] Task 4.1: 修改战斗胜利后的掉落逻辑
  - [x] 在战斗胜利处理中调用 checkWarSoulDrop
  - [x] 将掉落的战魂物品添加到背包
  - [x] 显示掉落提示信息

- [x] Task 4.2: 处理无名氏特殊掉落
  - [x] 无名氏必定掉落战魂之心
  - [x] 无名氏掉落不受战魂系统开启状态限制
  - [x] 无名氏击败后开启战魂系统

## 任务5: 配置战魂之心掉落数据
- [x] Task 5.1: 在 warSoulDropUtils.ts 中配置战魂之心掉落
  - [x] 无名氏：100%（不受战魂系统限制）
  - [x] 魔军主帅：100%
  - [x] 冰雪巨人军官：100%
  - [x] 魔军突击队：25%
  - [x] 魔军守卫军：25%
  - [x] 魔军神秘部队：25%
  - [x] 魔军图腾兽：25%
  - [x] 冰雪巨人士官：25%
  - [x] 雷角风牙兽：50%

## 任务6: 配置战魂晶石掉落数据
- [x] Task 6.1: 在 warSoulDropUtils.ts 中配置战魂晶石掉落
  - [x] 魔军突击队：75%
  - [x] 魔军守卫军：75%
  - [x] 魔军神秘部队：75%
  - [x] 魔军图腾兽：75%
  - [x] 骑士亡魂：100%
  - [x] 冰雪巨人士兵：100%
  - [x] BOSS级怪物：50%

## 任务7: 实现公主星期天礼物逻辑
- [x] Task 7.1: 修改公主NPC的礼物逻辑
  - [x] 检查是否为星期天（mc_day.nowday % 7 === 0）
  - [x] 检查关系等级是否为6
  - [x] 根据战魂系统开启状态决定礼物内容
  - [x] 战魂系统开启：战魂之心
  - [x] 战魂系统未开启：电浆药水

## 任务8: 更新类型定义
- [x] Task 8.1: 在 src/types/index.ts 中新增类型
  - [x] 定义 WarSoulDropConfig 接口
  - [x] 定义 WarSoulItemType 类型（'zhanHunZhiXin' | 'zhanHunJingShi'）

## 任务9: 测试和验证
- [x] Task 9.1: 功能测试
  - [x] 测试战魂系统默认关闭
  - [x] 测试击败无名氏后战魂系统开启
  - [x] 测试战魂系统开启前装备打造师不显示"关于战魂"
  - [x] 测试战魂系统开启后装备打造师显示"关于战魂"
  - [x] 测试战魂系统开启前怪物不掉落战魂物品
  - [x] 测试战魂系统开启后怪物掉落战魂物品
  - [x] 测试无名氏必定掉落战魂之心
  - [x] 测试存档保存和加载战魂系统状态

- [x] Task 9.2: 边界情况测试
  - [x] 测试同时可能掉落战魂之心和战魂晶石的怪物
  - [x] 测试概率掉落的随机性
  - [x] 测试BOSS级怪物的战魂晶石掉落

# Task Dependencies
- [Task 2] depends on [Task 1]（装备打造师配置依赖全局状态）
- [Task 4] depends on [Task 3]（战斗系统集成依赖掉落工具函数）
- [Task 5] depends on [Task 3]（掉落配置依赖工具函数）
- [Task 6] depends on [Task 3]（掉落配置依赖工具函数）
- [Task 7] depends on [Task 1]（公主礼物逻辑依赖全局状态）
- [Task 9] depends on all tasks（测试依赖所有功能实现）
