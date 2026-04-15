# 幻兽对象分析 (DefineSprite_139)

## 概述

DefineSprite_139 是单个幻兽对象的核心，管理幻兽的属性、升级、战斗等功能。

**代码引用**: [DefineSprite_139_空幻兽对象/frame_1/DoAction.as](scripts/DefineSprite_139_空幻兽对象/frame_1/DoAction.as)

## 幻兽类型

| 类型ID | 名称 | 主属性 | 特点 |
|-------|------|-------|------|
| 1 | 攻防型 | 攻击+防御 | 均衡发展 |
| 2 | 调皮鬼 | 攻击 | 高攻击成长 |
| 3 | 吉鲁猪 | 攻击 | 极高攻击成长 |
| 4 | 奇异兽 | 攻击 | 攻击均衡 |
| 5 | 圣天使 | 生命 | 高生命成长 |
| 6 | 守护 | 攻击 | 高攻击成长 |
| 7 | 年猪 | 全属性 | 全主属性成长 |

## 核心属性

### 基础属性

| 属性 | 类型 | 说明 |
|-----|------|------|
| hs_name | String | 幻兽类型名称 |
| othername | String | 显示名称 |
| dj | Number | 等级 (最大130) |
| hp | Number | 当前生命 |
| mhp | Number | 最大生命 |
| xgj | Number | 最小攻击 |
| dgj | Number | 最大攻击 |
| fy | Number | 防御 |
| jy | Number | 当前经验值 |
| mjy | Number | 升级所需经验 |
| zs | Number | 转世次数 |
| pz | Number | 总评分 |
| chuzheng | Boolean | 是否出征 |

### 成长属性

| 属性 | 类型 | 说明 |
|-----|------|------|
| cz_hp | Number | 生命成长率 |
| cz_xgj | Number | 最小攻击成长率 |
| cz_dgj | Number | 最大攻击成长率 |
| cz_fy | Number | 防御成长率 |

### 初始属性

| 属性 | 类型 | 说明 |
|-----|------|------|
| chp | Number | 初始生命 |
| cxgj | Number | 初始最小攻击 |
| cdgj | Number | 初始最大攻击 |
| cfy | Number | 初始防御 |

### 幻化相关属性

| 属性 | 类型 | 说明 |
|-----|------|------|
| predj | Number | 幻化前等级 |
| premjy | Number | 幻化前升级所需经验 |
| prejy | Number | 幻化前当前经验 |
| hun | Number | 升级经验递增变量 |

### 评分属性

| 属性 | 类型 | 说明 |
|-----|------|------|
| pzbase | Number | 基础评分 |
| pz_chp | Number | 初始生命评分 |
| pz_cxgj | Number | 初始最小攻击评分 |
| pz_cdgj | Number | 初始最大攻击评分 |
| pz_cfy | Number | 初始防御评分 |
| pz_cz_hp | Number | 生命成长评分 |
| pz_cz_xgj | Number | 最小攻击成长评分 |
| pz_cz_dgj | Number | 最大攻击成长评分 |
| pz_cz_fy | Number | 防御成长评分 |

## 核心函数分析

### setmydim(dsc) - 初始化属性

从数据源加载幻兽属性：

```actionscript
function setmydim(dsc)
{
   chuzheng = false;
   hs_name = dsc.hs_name;
   othername = dsc.othername;
   dj = dsc.dj;
   if(dsc.predj == undefined)
   {
      predj = 1;
   }
   else
   {
      predj = dsc.predj;
   }
   if(dsc.premjy == undefined)
   {
      premjy = 10;
   }
   else
   {
      premjy = dsc.premjy;
   }
   if(dsc.prejy == undefined)
   {
      prejy = 0;
   }
   else
   {
      prejy = dsc.jy;
   }
   if(dsc.hun == undefined)
   {
      hun = 1;
   }
   else
   {
      hun = dsc.hun;
   }
   hp = dsc.hp;
   jy = dsc.jy;
   mjy = dsc.mjy;
   zs = dsc.zs;
   chp = dsc.chp;
   cxgj = dsc.cxgj;
   cdgj = dsc.cdgj;
   cfy = dsc.cfy;
   cz_hp = dsc.cz_hp;
   cz_dgj = dsc.cz_dgj;
   cz_xgj = dsc.cz_xgj;
   cz_fy = dsc.cz_fy;
   pzbase = dsc.pzbase;
   pz = dsc.pz;
   pz_chp = dsc.pz_chp;
   pz_cxgj = dsc.pz_cxgj;
   pz_cdgj = dsc.pz_cdgj;
   pz_cfy = dsc.pz_cfy;
   pz_cz_hp = dsc.pz_cz_hp;
   pz_cz_xgj = dsc.pz_cz_xgj;
   pz_cz_dgj = dsc.pz_cz_dgj;
   pz_cz_fy = dsc.pz_cz_fy;
   mhp = Math.round(cz_hp * (dj - 1) + chp);
   xgj = Math.round(cz_xgj * (dj - 1) + cxgj);
   dgj = Math.round(cz_dgj * (dj - 1) + cdgj);
   fy = Math.round(cz_fy * (dj - 1) + cfy);
}
```

**代码引用**: [DefineSprite_139_空幻兽对象/frame_1/DoAction.as](scripts/DefineSprite_139_空幻兽对象/frame_1/DoAction.as#L13-L77)

### updata() - 更新属性

根据等级重新计算属性值：

```actionscript
function updata()
{
   hp = mhp = Math.round(cz_hp * (dj - 1) + chp);
   xgj = Math.round(cz_xgj * (dj - 1) + cxgj);
   dgj = Math.round(cz_dgj * (dj - 1) + cdgj);
   fy = Math.round(cz_fy * (dj - 1) + cfy);
}
```

**代码引用**: [DefineSprite_139_空幻兽对象/frame_1/DoAction.as](scripts/DefineSprite_139_空幻兽对象/frame_1/DoAction.as#L78-L84)

### byhit(hit) - 受到伤害

幻兽在战斗中承受伤害：

```actionscript
function byhit(hit)
{
   hp -= hit;
   if(hp <= 0)
   {
      _root.alertbox(othername + "已经死亡，你的幸运值降低了10点。");
      _root.jineng.love();
      _root.xinxi.xy -= 10;
      if(_root.xinxi.xy < 0)
      {
         _root.xinxi.xy = 0;
         _root.zhanchang.gotoAndPlay("结束");
         _root.msgbox("你的幸运值没有了!自动退出了战斗。");
      }
      hp = 0;
      _root.huanshoumb.shuomin.shows(_root.huanshoumb.shuomin.nowbb);
      return false;
   }
   _root.huanshoumb.shuomin.shows(_root.huanshoumb.shuomin.nowbb);
   return true;
}
```

**代码引用**: [DefineSprite_139_空幻兽对象/frame_1/DoAction.as](scripts/DefineSprite_139_空幻兽对象/frame_1/DoAction.as#L85-L105)

### have_exp(exps) - 获取经验

幻兽获取经验并升级：

```actionscript
function have_exp(exps)
{
   if(dj >= 130)
   {
      _root.msgbox("幻兽等级已满，无法再获得经验值了。");
      jy = 0;
      return false;
   }
   if(dj >= _root.xinxi.dj + 10)
   {
      _root.msgbox("幻兽等级已高于人物的10级，无法再获得经验值了。");
      return false;
   }
   exps *= 2;
   jy += exps;
   while(jy >= mjy)
   {
      if(dj >= 130)
      {
         _root.msgbox("幻兽等级已满，无法再获得经验值了。");
         jy = 0;
         return false;
      }
      jy -= mjy;
      dj++;
      if(predj < dj)
      {
         predj = dj;
      }
      if(dj < 20)
      {
         mjy = Math.round(mjy * 1.2);
      }
      else if(dj <= 50)
      {
         mjy = Math.round(mjy * 1.1);
      }
      else if(dj < 130)
      {
         mjy += hun;
      }
      if(dj == 50)
      {
         hun = Math.round(mjy * 0.2);
         if(predj > dj)
         {
            dj = predj;
            mjy = premjy;
            jy = prejy;
            _root.msgbox("幻兽在升级中顿悟了，等级立即升到幻化转世之前的等级" + dj + "级");
         }
         else if(_root.bbhh_point)
         {
            _root.bbhh_point = false;
            _root.alertbox("你的幻兽达到50级了，可以到幻化大师那里进行幻化。幻化可以使幻兽的各种属性得到提高。");
            _root.msgbox("你的幻兽达到50级了，可以到幻化大师那里进行幻化。幻化可以使幻兽的各种属性得到提高。");
         }
         else
         {
            _root.msgbox("你的幻兽达到50级了，可以到幻化大师那里进行幻化。幻化可以使幻兽的各种属性得到提高。");
         }
      }
   }
   updata();
   _root.huanshoumb.updata();
   _root.huanshoumb.shuomin.shows(_root.huanshoumb.shuomin.nowbb);
}
```

**代码引用**: [DefineSprite_139_空幻兽对象/frame_1/DoAction.as](scripts/DefineSprite_139_空幻兽对象/frame_1/DoAction.as#L106-L176)

## 等级系统

### 等级限制

| 限制类型 | 条件 | 说明 |
|----------|------|------|
| 最高等级 | dj >= 130 | 幻兽等级已满，无法再获得经验 |
| 角色关联 | dj >= 角色等级+10 | 幻兽等级已高于人物10级，无法再获得经验 |

### 经验需求递增规则

| 等级范围 | 经验递增公式 |
|----------|--------------|
| 1-19级 | mjy = Math.round(mjy * 1.2) |
| 20-50级 | mjy = Math.round(mjy * 1.1) |
| 51-129级 | mjy += hun |

## 顿悟系统

### 顿悟触发条件

- 幻兽经过幻化后等级重置为1级
- 幻兽升级到50级时触发检查
- predj > dj（幻化前等级 > 当前等级）

### 顿悟效果

当满足条件时，幻兽会"顿悟"：
- 等级立即恢复到幻化前等级（predj）
- 升级所需经验恢复到幻化前值（premjy）
- 当前经验恢复到幻化前值（prejy）

```actionscript
if(dj == 50)
{
   hun = Math.round(mjy * 0.2);
   if(predj > dj)
   {
      dj = predj;
      mjy = premjy;
      jy = prejy;
      _root.msgbox("幻兽在升级中顿悟了，等级立即升到幻化转世之前的等级" + dj + "级");
   }
}
```

**代码引用**: [DefineSprite_139_空幻兽对象/frame_1/DoAction.as](scripts/DefineSprite_139_空幻兽对象/frame_1/DoAction.as#L151-L170)

## 幻兽死亡处理

| 事件 | 效果 |
|------|------|
| 幻兽死亡 | 玩家幸运值-10 |
| 幸运值降为0 | 自动退出战斗 |

## 属性计算公式

| 属性 | 计算公式 |
|------|----------|
| 最大生命 | Math.round(cz_hp * (dj - 1) + chp) |
| 最小攻击 | Math.round(cz_xgj * (dj - 1) + cxgj) |
| 最大攻击 | Math.round(cz_dgj * (dj - 1) + cdgj) |
| 防御 | Math.round(cz_fy * (dj - 1) + cfy) |

## 设计模式

幻兽对象采用了以下设计模式：

1. **原型模式**：通过setmydim复制属性
2. **策略模式**：不同幻兽类型有不同的成长率
3. **状态模式**：幻化前后有不同的升级逻辑
