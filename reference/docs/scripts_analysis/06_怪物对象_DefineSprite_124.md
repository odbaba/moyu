# 怪物对象分析 (DefineSprite_124)

## 概述

DefineSprite_124 是怪物对象的核心，管理怪物的属性、战斗行为、伤害显示等功能。

## 核心属性

| 属性 | 说明 |
|-----|------|
| names | 怪物名称 |
| dj | 怪物等级 |
| hp | 当前生命 |
| mhp | 最大生命 |
| xgj | 最小攻击 |
| dgj | 最大攻击 |
| fy | 防御 |
| isBoss | 是否为BOSS |

## 核心函数分析

### setmydim(src) - 初始化属性

```actionscript
function setmydim(src)
{
   names = src.names;
   dj = src.dj;
   hp = src.hp;
   mhp = src.mhp;
   xgj = src.xgj;
   dgj = src.dgj;
   fy = src.fy;
   isBoss = src.isBoss;
   
   // 设置显示
   nameText.text = names;
   updateHP();
}
```

### byhit(hit, it_zdl) - 受到伤害

```actionscript
function byhit(hit, it_zdl)
{
   // 战斗力差距修正
   if(it_zdl > zdl)
   {
      var add = it_zdl - zdl;
      if(add > 20) add = 20;
      hit += add * 0.05 * hit;
   }
   else if(it_zdl < zdl)
   {
      var sub = zdl - it_zdl;
      if(sub > 50) sub = 50;
      hit -= sub * 0.01 * hit;
   }
   
   // 防御减免
   hit -= fy;
   if(hit < 1) hit = 1;
   
   hp -= hit;
   
   // 显示伤害数字
   showDamage(hit);
   
   // 死亡判定
   if(hp <= 0)
   {
      hp = 0;
      onDeath();
   }
   
   updateHP();
}
```

### hitsb(hittype, dsc) - 攻击目标

```actionscript
function hitsb(hittype, dsc)
{
   hit = xgj + random(dgj - xgj + 1);
   
   switch(hittype)
   {
      case 0: hit *= 1; break;      // 普通
      case 1: hit *= 1.5; break;    // 暴击
      case 2: hit *= 0.6; break;    // 弱攻击
      case 3: hit *= 0.75; break;   // 中等攻击
   }
   
   dsc.byhit(hit, zdl);
}
```

### showDamage(damage) - 显示伤害数字

```actionscript
function showDamage(damage)
{
   var dmg = attachMovie("伤害显示", "dmg" + depth, depth);
   dmg._x = _x + random(20) - 10;
   dmg._y = _y - 20;
   dmg.setDamage(damage);
}
```

### updateHP() - 更新HP显示

```actionscript
function updateHP()
{
   hpBar._xscale = 100 * hp / mhp;
   hpText.text = hp + "/" + mhp;
}
```

### onDeath() - 死亡处理

```actionscript
function onDeath()
{
   // 掉落物品
   dropItems();
   
   // 给予经验
   _root.xinxi.have_exp(mhp);
   
   // 任务进度
   updateQuest();
   
   // 播放死亡动画
   gotoAndPlay("死亡");
}
```

## AI行为

### 攻击模式

| 模式 | 说明 |
|-----|------|
| 主动攻击 | 玩家进入范围后主动攻击 |
| 被动攻击 | 受到攻击后反击 |
| 随机攻击 | 随机选择攻击类型 |

### 攻击类型选择

```actionscript
function selectAttackType()
{
   var rand = random(100);
   
   if(rand < 60)
      return 0;  // 60%普通攻击
   else if(rand < 80)
      return 1;  // 20%暴击
   else if(rand < 95)
      return 2;  // 15%弱攻击
   else
      return 3;  // 5%中等攻击
}
```

## BOSS系统

### BOSS属性加成

| 属性 | 加成倍率 |
|-----|---------|
| HP | 10x |
| 攻击 | 5x |
| 防御 | 3x |

### BOSS掉落

| 等级 | 掉落物品 |
|-----|---------|
| 10级BOSS | 初级装备、经验球 |
| 30级BOSS | 中级装备、宝石 |
| 50级BOSS | 高级装备、稀有材料 |
| 70级BOSS | 精品装备、灵魂晶石 |
| 90级BOSS | 极品装备、高级宝石 |
| 100级BOSS | 顶级装备、特殊道具 |

## 怪物等级分布

| 地图 | 怪物等级 |
|-----|---------|
| 雷鸣大陆 | 1-10级 |
| 戈壁 | 10-30级 |
| 迷梦沼泽 | 30-50级 |
| 冰宫 | 50-70级 |
| 亚维特岛 | 70-90级 |
| 卡萨诺城 | 90-100级 |
| 地下城 | 100-120级 |

## 与其他系统的交互

- **战斗系统**：通过hitsb/byhit进行战斗
- **任务系统**：击杀怪物更新任务进度
- **掉落系统**：死亡时掉落物品
- **经验系统**：给予玩家经验

## 设计模式

怪物对象采用了以下设计模式：

1. **策略模式**：不同攻击类型使用不同伤害计算
2. **状态模式**：存活/死亡状态切换
3. **观察者模式**：HP变化时更新显示
