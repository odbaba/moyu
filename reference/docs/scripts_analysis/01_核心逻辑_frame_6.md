# 核心游戏逻辑分析 (frame_6)

## 概述

frame_6/DoAction.as 是游戏的核心逻辑文件，包含游戏的主要功能函数和全局变量初始化。这是游戏主循环的入口点，负责初始化游戏状态和提供全局工具函数。

**文件位置**：`scripts/frame_6/DoAction.as`

**主要功能**：
1. 每日重置系统 (nextday) - 处理新的一天的各种重置逻辑
2. BOSS刷新系统 (flashboss) - 随机刷新各等级BOSS
3. 怪物刷新系统 (flashgw, flashmj) - 刷新地图怪物和魔军
4. 装备生成系统 (weapon) - 生成随机装备
5. 幻兽评分系统 (pfxgj, pfdgj, pffy, pfhp, pfc) - 计算幻兽属性评分
6. 幻兽幻化系统 (huanhua, fuhuanhua, cuhuanhua) - 幻兽合成强化
7. 救出国王剧情 (TouchStory) - 触发救出国王的剧情事件
8. UI工具函数 (CloseAll, msgbox, alertbox) - 关闭界面、显示消息
9. 恢复系统 (returnhp) - 恢复角色和幻兽的生命值

## 核心函数分析

### returnhp() - 恢复生命值和体力

恢复角色和所有幻兽的HP到最大值：

```actionscript
function returnhp()
{
   _root.xinxi.hp = _root.xinxi.mhp;  // 角色HP
   _root.xinxi.tl = _root.xinxi.mtl;  // 角色体力
   
   // 遍历所有幻兽恢复HP
   i = 0;
   while(i < _root.huanshoumb.maxbb)
   {
      if(_root.huanshoumb.array[i])
      {
         _root.huanshoumb.array[i].hp = _root.huanshoumb.array[i].mhp;
      }
      i++;
   }
   
   // 自动设置出征幻兽
   if(!_root.czmb0._visible && _root.huanshoumb.array[0])
   {
      _root.huanshoumb.chuzhengbb(_root.huanshoumb.array[0]);
   }
}
```

### nextday() - 新的一天处理

处理每日重置逻辑：

| 重置项 | 说明 |
|-------|------|
| useds_num | 每日使用物品次数 |
| manexpball | 满经验球使用次数(5次) |
| mapreward | 地图奖励领取标记 |
| pk_race | PK比赛标记(周六) |
| BOSS刷新 | 随机刷新各等级BOSS |
| 任务重置 | 官阶任务、魔将等 |

### flashboss() - BOSS刷新

各BOSS刷新概率：

| BOSS | 刷新概率 |
|------|---------|
| boss10 | 55% |
| boss20 | 45% |
| boss30 | 33% |
| boss50 | 23% |
| boss70 | 33% |
| boss90 | 23% |
| boss100 | 33% |
| bossZZ | 23% |
| bossDZZ | 33% |

### weapon(setpz, setmhdj, setdong) - 生成装备

生成随机装备的函数：

```actionscript
function weapon(setpz, setmhdj, setdong)
{
   pz = setpz;      // 品质
   mhdj = setmhdj;  // 追加等级
   dong = setdong;  // 镶嵌孔数
   
   // 使用等级：向下取整到10的倍数
   if(_root.xinxi.dj < 10) dj = 10;
   else if(_root.xinxi.dj >= 100) dj = 100;
   else dj = _root.xinxi.dj - _root.xinxi.dj % 10;
   
   // 随机装备类型
   switch(random(6))
   {
      case 0: id = "武器"; break;
      case 1: id = "头盔"; break;
      case 2: id = "项链"; break;
      case 3: id = "衣服"; break;
      case 4: id = "手镯"; break;
      case 5: id = "战鞋"; break;
   }
   _root.beibao.more(this);
}
```

### huanhua(bbz, bbf) - 幻兽幻化

幻化效果根据幻兽类型不同：

| 幻兽类型 | 主属性成长率提升 |
|---------|-----------------|
| 攻防型 | 最小攻击+1.0, 最大攻击+1.2, 防御+0.8 |
| 调皮鬼 | 最小攻击+0.8, 最大攻击+1.4, 防御+0.7 |
| 吉鲁猪 | 最小攻击+1.2, 最大攻击+1.6 |
| 奇异兽 | 最小攻击+1.3, 最大攻击+1.3 |
| 圣天使 | 最小攻击+0.5, 最大攻击+0.8, 生命+1.8 |
| 守护 | 最小攻击+1.4, 最大攻击+1.6 |
| 年猪 | 最小攻击+1.1, 最大攻击+1.2, 防御+1.0, 生命+1.5 |

### 幻兽评分函数组

评分规则：
- 基础值以下：0分
- 基础值~基础值+10：每点20分
- 基础值+10以上：每点100分

| 函数 | 属性 | 基础值 |
|-----|------|-------|
| pfxgj() | 最小攻击 | 10 |
| pfdgj() | 最大攻击 | 15 |
| pffy() | 防御 | 5 |
| pfhp() | 生命 | 40 |

### TouchStory() - 救出国王剧情

触发条件：击败地下城3层的魔将

效果：
- 设置 king = true
- 如果爵位>=5级，升为王爵
- 否则获得200,000魔石

## 全局变量初始化

### 时间系统

```actionscript
_root.mc_day.reset();  // 重置日期
_root.mc_day.upxx();   // 更新显示
```

### 地图相关

```actionscript
nextmap = true;        // 允许切换地图
nowmap = "雷鸣大陆";   // 当前地图
owermap = "";          // 拥有的保护地
mapreward = false;     // 地图奖励
pk_race = false;       // PK比赛
map_race = true;       // 地图挑战
```

### 任务标记

```actionscript
rw_bs = true;          // 宝石任务
rw_hs = true;          // 幻兽任务
rw_dxc = true;         // 地下城任务
rw_gw1_1~3 = true;     // 地下城1层怪物
rw_gw2_1~2 = true;     // 地下城2层怪物
rw_gw3_1 = true;       // 地下城3层怪物
```

### 魔将状态

```actionscript
_root.mj_gj = true;    // 魔军攻击
_root.mj_fy = true;    // 魔军防御
_root.mj_tt = true;    // 魔军天赋
_root.mj_sm = true;    // 魔军生命
_root.mj_zs = true;    // 魔军主帅
_root.mj_nl = true;    // 魔军能量
```

### 游戏流程

```actionscript
if(_root.laoddata)
{
   gotoAndStop("读取进度");  // 加载存档
}
else
{
   gotoAndStop(nowmap);      // 进入游戏
}
havesaved = false;           // 存档标记
```

## 辅助函数

### msgbox(str) - 显示消息框

```actionscript
function msgbox(str)
{
   _root.msg.msgtext.text = str;
   _root.msg.gotoAndPlay(2);
}
```

### alertbox(str) - 显示警告框

```actionscript
function alertbox(str)
{
   _root.alert.openme(str);
}
```

### CloseAll(baobao) - 关闭所有界面

关闭背包、仓库、商店、装备等所有UI界面。

## 设计模式

核心逻辑采用了以下设计模式：

1. **单例模式**：全局变量和函数集中管理
2. **工厂模式**：weapon()函数生成装备
3. **观察者模式**：日期变化触发各种重置事件
4. **策略模式**：不同幻兽类型的幻化效果不同

## 函数调用关系图

```
frame_6/DoAction.as
├── 游戏初始化
│   ├── flashboss() → 刷新BOSS
│   ├── flashgw() → 刷新怪物
│   └── gotoAndStop() → 跳转到地图或读取进度
│
├── 每日重置 (nextday)
│   ├── returnhp() → 恢复HP
│   ├── flashboss() → 刷新BOSS
│   ├── flashgw() → 刷新怪物
│   └── flashmj() → 刷新魔军
│
├── 装备生成 (weapon)
│   └── _root.beibao.more() → 添加到背包
│
├── 幻兽幻化 (huanhua)
│   ├── pfxgj(), pfdgj(), pffy(), pfhp() → 评分成长属性
│   ├── pfc() → 评分初始属性
│   ├── fuhuanhua() → 计算副属性加成
│   └── cuhuanhua() → 计算初始属性加成
│
└── UI工具
    ├── CloseAll() → 关闭所有界面
    ├── msgbox() → 显示消息
    ├── alertbox() → 显示警告
    └── returnmap() → 返回地图
```

## 全局变量说明

### 地图相关变量

| 变量名 | 类型 | 初始值 | 说明 |
|--------|------|--------|------|
| nowmap | String | "雷鸣大陆" | 当前地图名称 |
| nextmap | Boolean | true | 是否可以切换地图 |
| owermap | String | "" | 拥有的地图名称（地图赛奖励） |
| mapreward | Boolean | false | 地图奖励是否可领取 |
| pk_race | Boolean | false | PK比赛是否开启（周六） |
| map_race | Boolean | true | 地图赛是否开启 |

### 任务相关变量

| 变量名 | 类型 | 初始值 | 说明 |
|--------|------|--------|------|
| rw_bs | Boolean | true | BOSS任务可用 |
| rw_hs | Boolean | true | 幻兽任务可用 |
| rw_dxc | Boolean | true | 地下城任务可用 |
| rw_gw1_1~3 | Boolean | true | 地下城1层怪物任务 |
| rw_gw2_1~2 | Boolean | true | 地下城2层怪物任务 |
| rw_gw3_1 | Boolean | true | 地下城3层怪物任务 |

### 剧情相关变量

| 变量名 | 类型 | 初始值 | 说明 |
|--------|------|--------|------|
| king | Boolean | false | 是否已救出国王 |
| havesaved | Boolean | false | 是否已保存 |
| openzh | Boolean | false | 是否打开账户 |
| openzhrw | Boolean | false | 是否打开账户任务 |

### 幻兽相关变量

| 变量名 | 类型 | 初始值 | 说明 |
|--------|------|--------|------|
| bbhh_point | Boolean | true | 幻兽幻化点数可用 |
| manexpball | Number | 5 | 满经验球使用次数 |
| hsyjs_jsdj | Number | 10 | 军饷基数等级 |
| hsyjs_rate | Number | 0 | 军饷增长率 |
| hsyjs_number | Number | 0 | 军饷累计数量 |

### 魔军相关变量

| 变量名 | 类型 | 初始值 | 说明 |
|--------|------|--------|------|
| _root.mj_gj | Boolean | true | 魔军攻击型存在 |
| _root.mj_fy | Boolean | true | 魔军防御型存在 |
| _root.mj_tt | Boolean | true | 魔军突击型存在 |
| _root.mj_sm | Boolean | true | 魔军生命型存在 |
| _root.mj_zs | Boolean | true | 魔军主帅存在 |
| _root.mj_nl | Boolean | true | 魔军能量型存在 |

## 相关文件

- [角色信息管理](./02_角色信息_DefineSprite_932.md) - 角色属性系统
- [装备系统](./03_装备系统_DefineSprite_561.md) - 装备管理
- [幻兽背包](./04_幻兽背包_DefineSprite_787.md) - 幻兽管理
- [战斗系统](./13_战斗系统.md) - 战斗逻辑
