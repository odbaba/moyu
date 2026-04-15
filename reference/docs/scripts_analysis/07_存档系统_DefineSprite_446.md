# 存档系统分析 (DefineSprite_446)

## 概述

DefineSprite_446 是游戏存档系统的核心，使用Flash SharedObject实现本地存储。

## 存档机制

### SharedObject

```actionscript
var so = SharedObject.getLocal("moyusave");
```

### 存档位置

- Windows: `%APPDATA%\Macromedia\Flash Player\#SharedObjects\`
- 存档名称: `moyusave.sol`

## 核心函数分析

### savedata() - 保存游戏

```actionscript
function savedata()
{
   var so = SharedObject.getLocal("moyusave");
   
   // 角色信息
   so.data.myname = _root.xinxi.myname;
   so.data.dj = _root.xinxi.dj;
   so.data.jy = _root.xinxi.jy;
   so.data.hp = _root.xinxi.hp;
   so.data.tl = _root.xinxi.tl;
   so.data.xy = _root.xinxi.xy;
   // ... 更多属性
   
   // 军衔爵位
   so.data.jxdj = _root.xinxi.jxdj;
   so.data.jwdj = _root.xinxi.jwdj;
   so.data.gzgx = _root.xinxi.gzgx;
   
   // 地图信息
   so.data.nowmap = _root.nowmap;
   so.data.owermap = _root.owermap;
   
   // 时间信息
   so.data.nowday = _root.mc_day.nowday;
   
   // 幻兽数据
   so.data.huanshou = new Array();
   for(i = 0; i < _root.huanshoumb.maxbb; i++)
   {
      if(_root.huanshoumb.array[i])
      {
         so.data.huanshou.push(_root.huanshoumb.array[i].getdata());
      }
   }
   
   // 装备数据
   so.data.zhuangbei = _root.zhuangbei.getdata();
   
   // 背包数据
   so.data.beibao = _root.beibao.getdata();
   
   // 任务进度
   so.data.quests = getQuestData();
   
   // BOSS状态
   so.data.boss = getBossData();
   
   // 写入存档
   so.flush();
   
   _root.msgbox("游戏已保存");
}
```

### loaddata() - 加载游戏

```actionscript
function loaddata()
{
   var so = SharedObject.getLocal("moyusave");
   
   if(so.data.myname == undefined)
   {
      _root.alertbox("没有找到存档");
      return false;
   }
   
   // 版本检查
   if(so.data.version != GAME_VERSION)
   {
      _root.alertbox("存档版本不兼容");
      return false;
   }
   
   // 角色信息
   _root.xinxi.myname = so.data.myname;
   _root.xinxi.dj = so.data.dj;
   _root.xinxi.jy = so.data.jy;
   // ... 更多属性
   
   // 地图信息
   _root.nowmap = so.data.nowmap;
   _root.owermap = so.data.owermap;
   
   // 时间信息
   _root.mc_day.nowday = so.data.nowday;
   
   // 异步加载幻兽
   loadHuanshou(so.data.huanshou);
   
   // 异步加载装备
   loadZhuangbei(so.data.zhuangbei);
   
   // 异步加载背包
   loadBeibao(so.data.beibao);
   
   // 加载任务进度
   loadQuests(so.data.quests);
   
   // 加载BOSS状态
   loadBoss(so.data.boss);
   
   _root.msgbox("存档加载成功");
   return true;
}
```

### deletedata() - 删除存档

```actionscript
function deletedata()
{
   var so = SharedObject.getLocal("moyusave");
   so.clear();
   _root.msgbox("存档已删除");
}
```

## 存档数据结构

### 角色数据

| 字段 | 类型 | 说明 |
|-----|------|------|
| myname | String | 角色名称 |
| dj | Number | 等级 |
| jy | Number | 当前经验 |
| hp | Number | 当前生命 |
| tl | Number | 当前体力 |
| xy | Number | 幸运值 |
| jxdj | Number | 军衔等级 |
| jwdj | Number | 爵位等级 |
| gzgx | Number | 公主关系等级 |

### 幻兽数据

| 字段 | 类型 | 说明 |
|-----|------|------|
| names | String | 幻兽名称 |
| type | Number | 幻兽类型 |
| dj | Number | 等级 |
| hp | Number | 当前生命 |
| cz_* | Number | 成长率 |
| c* | Number | 初始属性 |
| zhuanshi | Number | 转世次数 |
| dunwu | Boolean | 是否顿悟 |

### 装备数据

| 字段 | 类型 | 说明 |
|-----|------|------|
| myid | String | 装备类型 |
| dj | Number | 使用等级 |
| pz | Number | 品质 |
| mhdj | Number | 追加等级 |
| dong | Number | 镶嵌孔数 |
| dong1 | String | 宝石1 |
| dong2 | String | 宝石2 |
| zhtype | Number | 战魂类型 |
| zhdj | Number | 战魂等级 |

### 物品数据

| 字段 | 类型 | 说明 |
|-----|------|------|
| myid | String | 物品标识 |
| names | String | 物品名称 |
| number | Number | 数量 |

## 异步加载机制

由于Flash的限制，大量数据加载可能导致卡顿，采用异步加载：

```actionscript
function loadHuanshou(data)
{
   var index = 0;
   var interval = setInterval(function()
   {
      if(index < data.length)
      {
         _root.huanshoumb.addbb(data[index]);
         index++;
      }
      else
      {
         clearInterval(interval);
         _root.xinxi.flashdata();
      }
   }, 10);
}
```

## 存档版本管理

```actionscript
var GAME_VERSION = "1.0.0";

function checkVersion(savedVersion)
{
   if(savedVersion != GAME_VERSION)
   {
      // 版本不兼容处理
      return false;
   }
   return true;
}
```

## 自动存档

```actionscript
// 每日结束自动存档
function autosave()
{
   if(!_root.havesaved)
   {
      savedata();
      _root.havesaved = true;
   }
}
```

## 存档容量限制

SharedObject默认大小限制：
- 默认: 100KB
- 最大可请求: 无限制（需用户授权）

## 设计模式

存档系统采用了以下设计模式：

1. **序列化模式**：将对象转换为可存储格式
2. **原型模式**：从存档数据重建对象
3. **命令模式**：封装保存/加载操作
4. **备忘录模式**：保存和恢复游戏状态
