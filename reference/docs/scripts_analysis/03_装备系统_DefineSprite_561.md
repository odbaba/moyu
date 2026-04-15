# 装备系统分析 (DefineSprite_561)

## 概述

DefineSprite_561 是装备系统的核心，管理角色装备的穿戴、属性加成计算等功能。

## 核心函数分析

### setzhuangbei(mc) - 装备穿戴

将物品装备到对应槽位：

```actionscript
function setzhuangbei(mc)
{
   switch(mc.myid)
   {
      case "武器":
         wuqi.setitem(mc);
         break;
      case "头盔":
         toukui.setitem(mc);
         break;
      case "项链":
         xianglian.setitem(mc);
         break;
      case "衣服":
         yifu.setitem(mc);
         break;
      case "手镯":
         shouzhuo.setitem(mc);
         break;
      case "战鞋":
         zhanxie.setitem(mc);
         break;
   }
   _root.xinxi.flashdata();
   flashme();
}
```

### getxgj() - 获取最小攻击加成

计算所有装备的最小攻击加成：

```actionscript
function getxgj()
{
   var _loc2_ = 0;
   if(wuqi.item) _loc2_ += wuqi.item.xgj + wuqi.item.fxgj;
   if(toukui.item) _loc2_ += toukui.item.xgj + toukui.item.fxgj;
   if(xianglian.item) _loc2_ += xianglian.item.xgj + xianglian.item.fxgj;
   if(yifu.item) _loc2_ += yifu.item.xgj + yifu.item.fxgj;
   if(shouzhuo.item) _loc2_ += shouzhuo.item.xgj + shouzhuo.item.fxgj;
   if(zhanxie.item) _loc2_ += zhanxie.item.xgj + zhanxie.item.fxgj;
   return _loc2_;
}
```

### getdgj() - 获取最大攻击加成

计算所有装备的最大攻击加成（结构与getxgj相同）。

### getfy() - 获取防御加成

计算所有装备的防御加成：

```actionscript
function getfy()
{
   var _loc2_ = 0;
   if(toukui.item) _loc2_ += toukui.item.fy + toukui.item.ffy;
   if(yifu.item) _loc2_ += yifu.item.fy + yifu.item.ffy;
   if(zhanxie.item) _loc2_ += zhanxie.item.fy + zhanxie.item.ffy;
   return _loc2_;
}
```

### getpz() - 获取品质战斗力

计算装备品质带来的战斗力加成：

```actionscript
function getpz()
{
   var _loc2_ = 0;
   if(wuqi.item) _loc2_ += wuqi.item.pz;
   if(toukui.item) _loc2_ += toukui.item.pz;
   if(xianglian.item) _loc2_ += xianglian.item.pz;
   if(yifu.item) _loc2_ += yifu.item.pz;
   if(shouzhuo.item) _loc2_ += shouzhuo.item.pz;
   if(zhanxie.item) _loc2_ += zhanxie.item.pz;
   return _loc2_;
}
```

### getmhdj() - 获取追加等级战斗力

计算装备追加等级带来的战斗力加成：

```actionscript
function getmhdj()
{
   var _loc2_ = 0;
   if(wuqi.item) _loc2_ += wuqi.item.mhdj;
   if(toukui.item) _loc2_ += toukui.item.mhdj;
   if(xianglian.item) _loc2_ += xianglian.item.mhdj;
   if(yifu.item) _loc2_ += yifu.item.mhdj;
   if(shouzhuo.item) _loc2_ += shouzhuo.item.mhdj;
   if(zhanxie.item) _loc2_ += zhanxie.item.mhdj;
   return _loc2_;
}
```

### getdong() - 获取镶嵌孔战斗力

计算装备镶嵌孔带来的战斗力加成：

```actionscript
function getdong()
{
   var _loc2_ = 0;
   if(wuqi.item) _loc2_ += wuqi.item.dong * 3;
   if(toukui.item) _loc2_ += toukui.item.dong * 3;
   if(xianglian.item) _loc2_ += xianglian.item.dong * 3;
   if(yifu.item) _loc2_ += yifu.item.dong * 3;
   if(shouzhuo.item) _loc2_ += shouzhuo.item.dong * 3;
   if(zhanxie.item) _loc2_ += zhanxie.item.dong * 3;
   return _loc2_;
}
```

### getbs() - 获取宝石战斗力

计算镶嵌宝石带来的战斗力加成：

```actionscript
function getbs()
{
   var _loc2_ = 0;
   if(wuqi.item) _loc2_ += wuqi.item.zdl;
   if(toukui.item) _loc2_ += toukui.item.zdl;
   if(xianglian.item) _loc2_ += xianglian.item.zdl;
   if(yifu.item) _loc2_ += yifu.item.zdl;
   if(shouzhuo.item) _loc2_ += shouzhuo.item.zdl;
   if(zhanxie.item) _loc2_ += zhanxie.item.zdl;
   return _loc2_;
}
```

### zhgj() - 战魂攻击加成

计算天魂战魂的攻击加成百分比：

```actionscript
function zhgj()
{
   var _loc2_ = 0;
   if(wuqi.item && wuqi.item.zhtype == 1) _loc2_ += wuqi.item.zhdj * 0.05;
   if(toukui.item && toukui.item.zhtype == 1) _loc2_ += toukui.item.zhdj * 0.05;
   if(xianglian.item && xianglian.item.zhtype == 1) _loc2_ += xianglian.item.zhdj * 0.05;
   if(yifu.item && yifu.item.zhtype == 1) _loc2_ += yifu.item.zhdj * 0.05;
   if(shouzhuo.item && shouzhuo.item.zhtype == 1) _loc2_ += shouzhuo.item.zhdj * 0.05;
   if(zhanxie.item && zhanxie.item.zhtype == 1) _loc2_ += zhanxie.item.zhdj * 0.05;
   return _loc2_;
}
```

### zhmiss() - 战魂闪避加成

计算地魂战魂的闪避加成：

```actionscript
function zhmiss()
{
   var _loc2_ = 0;
   if(wuqi.item && wuqi.item.zhtype == 2) _loc2_ += wuqi.item.zhdj * 2;
   if(toukui.item && toukui.item.zhtype == 2) _loc2_ += toukui.item.zhdj * 2;
   if(xianglian.item && xianglian.item.zhtype == 2) _loc2_ += xianglian.item.zhdj * 2;
   if(yifu.item && yifu.item.zhtype == 2) _loc2_ += yifu.item.zhdj * 2;
   if(shouzhuo.item && shouzhuo.item.zhtype == 2) _loc2_ += shouzhuo.item.zhdj * 2;
   if(zhanxie.item && zhanxie.item.zhtype == 2) _loc2_ += zhanxie.item.zhdj * 2;
   return _loc2_;
}
```

### getbsexp() - 宝石经验加成

计算镶嵌经验石的经验加成：

```actionscript
function getbsexp()
{
   var _loc2_ = 0;
   if(wuqi.item) _loc2_ += wuqi.item.jy;
   if(toukui.item) _loc2_ += toukui.item.jy;
   if(xianglian.item) _loc2_ += xianglian.item.jy;
   if(yifu.item) _loc2_ += yifu.item.jy;
   if(shouzhuo.item) _loc2_ += shouzhuo.item.jy;
   if(zhanxie.item) _loc2_ += zhanxie.item.jy;
   return _loc2_;
}
```

## 装备槽位

| 槽位名称 | 变量名 | 装备类型 |
|---------|--------|---------|
| 武器槽 | wuqi | 武器 |
| 头盔槽 | toukui | 头盔 |
| 项链槽 | xianglian | 项链 |
| 衣服槽 | yifu | 衣服 |
| 手镯槽 | shouzhuo | 手镯 |
| 战鞋槽 | zhanxie | 战鞋 |

## 战斗力加成计算

### 品质战斗力

| 品质 | 每件加成 |
|-----|---------|
| 普通(0) | 0 |
| 良品(1) | 1 |
| 上品(2) | 2 |
| 精品(3) | 3 |
| 极品(4) | 4 |

### 镶嵌孔战斗力

每个镶嵌孔 +3 战斗力

### 战魂加成

| 战魂类型 | 效果 |
|---------|------|
| 天魂 | 攻击 +5%/级 |
| 地魂 | 闪避 +2%/级 |

## 界面管理

### openme() - 打开装备界面

```actionscript
function openme()
{
   _visible = true;
   _x = show_x;
   _y = show_y;
}
```

### closeme() - 关闭装备界面

```actionscript
function closeme()
{
   _visible = false;
   _x = hide_x;
   _y = hide_y;
}
```

### flashme() - 刷新装备显示

遍历所有槽位，调用flashcount()刷新属性，nowplayto()刷新图标。

## 设计模式

装备系统采用了以下设计模式：

1. **组合模式**：总战斗力由各装备槽位组合而成
2. **策略模式**：不同装备类型有不同的属性计算方式
3. **外观模式**：提供统一的接口获取各种属性加成
