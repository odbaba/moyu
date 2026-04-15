# 幻兽背包管理分析 (DefineSprite_787)

## 概述

DefineSprite_787 是幻兽背包系统的核心，管理幻兽的存储、出征、排序等功能。

**代码引用**: [DefineSprite_787/frame_1/DoAction.as](scripts/DefineSprite_787/frame_1/DoAction.as)

## 核心属性

| 属性 | 值 | 说明 |
|-----|-----|------|
| maxbb | 100 | 最大幻兽数量 |
| array | Array(100) | 幻兽数组 |
| chuzheng | Array(2) | 出征数组（2个位置） |
| nowpage | 1 | 当前页码 |
| allpage | 1 | 总页数 |
| onepage_bbnum | 4 | 每页显示数量 |

### 位置属性

| 属性 | 值 | 说明 |
|-----|-----|------|
| show_x | 0 | 显示时X坐标 |
| show_y | 150 | 显示时Y坐标 |
| hide_x | 800 | 隐藏时X坐标 |
| hide_y | 600 | 隐藏时Y坐标 |

## 核心函数分析

### givebb(dsc) - 添加幻兽到背包

```actionscript
function givebb(dsc)
{
   if(bblen() >= maxbb)
   {
      _root.alertbox("\r\r你的幻兽背包已经满了，放不下更多幻兽了");
      return false;
   }
   src = dsc;
   var _loc3_ = this.getNextHighestDepth();
   this.attachMovie("空幻兽对象","hs" + _loc3_,_loc3_);
   return true;
}
```

**代码引用**: [DefineSprite_787/frame_1/DoAction.as](scripts/DefineSprite_787/frame_1/DoAction.as#L27-L38)

### getbb(wbb) - 从背包移除幻兽

```actionscript
function getbb(wbb)
{
   if(wbb.chuzheng || !wbb.dj)
   {
      _root.alertbox("出征中的幻兽无法丢弃，请召回幻兽再丢弃");
      return false;
   }
   array[wbb.number] = false;
   removeMovieClip(wbb);
   reversebb();
   updata();
   setfocus();
   return true;
}
```

**代码引用**: [DefineSprite_787/frame_1/DoAction.as](scripts/DefineSprite_787/frame_1/DoAction.as#L13-L26)

### getroom(hs) - 分配背包格子

```actionscript
function getroom(hs)
{
   var _loc1_ = 0;
   while(_loc1_ < maxbb)
   {
      if(!array[_loc1_])
      {
         hs.number = _loc1_;
         array[_loc1_] = hs;
         break;
      }
      _loc1_ = _loc1_ + 1;
   }
   reversebb();
   updata();
   setfocus();
}
```

**代码引用**: [DefineSprite_787/frame_1/DoAction.as](scripts/DefineSprite_787/frame_1/DoAction.as#L39-L55)

### chuzhengbb(czbb) - 设置出征幻兽

```actionscript
function chuzhengbb(czbb)
{
   if(czbb.dj)
   {
      focus = czbb;
   }
   if(focus.chuzheng || !focus.dj)
   {
      return false;
   }
   var _loc1_ = 0;
   while(_loc1_ < 2)
   {
      if(!chuzheng[_loc1_])
      {
         chuzheng[_loc1_] = focus;
         focus.chuzheng = true;
         reversebb();
         updata();
         setfocus();
         return true;
      }
      _loc1_ = _loc1_ + 1;
   }
   return false;
}
```

**代码引用**: [DefineSprite_787/frame_1/DoAction.as](scripts/DefineSprite_787/frame_1/DoAction.as#L215-L240)

### zhaohuibb(zhbb) - 召回出征幻兽

```actionscript
function zhaohuibb(zhbb)
{
   if(zhbb.dj)
   {
      focus = zhbb;
   }
   if(!focus.dj)
   {
      return false;
   }
   if(!focus.chuzheng)
   {
      return false;
   }
   focus.chuzheng = false;
   var _loc1_ = 0;
   while(_loc1_ < 2)
   {
      if(chuzheng[_loc1_] == focus)
      {
         chuzheng[_loc1_] = false;
         reversebb();
         updata();
         setfocus();
         break;
      }
      _loc1_ = _loc1_ + 1;
   }
}
```

**代码引用**: [DefineSprite_787/frame_1/DoAction.as](scripts/DefineSprite_787/frame_1/DoAction.as#L241-L269)

### bblen() - 获取背包中幻兽数量

```actionscript
function bblen()
{
   var _loc0_;
   var _loc1_ = len = 0;
   while(_loc1_ < maxbb)
   {
      if(array[_loc1_])
      {
         len++;
      }
      _loc1_ = _loc1_ + 1;
   }
   return len;
}
```

**代码引用**: [DefineSprite_787/frame_1/DoAction.as](scripts/DefineSprite_787/frame_1/DoAction.as#L150-L163)

### reversebb() - 幻兽排序

按评分和出征状态排序：

```actionscript
function reversebb()
{
   var _loc4_ = 0;
   var _loc3_;
   var _loc2_;
   var _loc1_;
   _loc2_ = _loc4_;
   while(_loc2_ < maxbb)
   {
      if(!array[_loc2_])
      {
         _loc1_ = maxbb;
         while(_loc1_ >= _loc2_)
         {
            if(array[_loc1_])
            {
               array[_loc2_] = array[_loc1_];
               array[_loc2_].number = _loc2_;
               array[_loc1_] = false;
               break;
            }
            if(_loc1_ == _loc2_)
            {
               return true;
            }
            _loc1_ = _loc1_ - 1;
         }
      }
      _loc1_ = _loc2_ + 1;
      while(_loc1_ < maxbb)
      {
         if(array[_loc1_].dj)
         {
            if(array[_loc2_].pz + array[_loc2_].chuzheng * 1000000 < array[_loc1_].pz + array[_loc1_].chuzheng * 1000000)
            {
               _loc3_ = array[_loc2_];
               array[_loc2_] = array[_loc1_];
               array[_loc1_] = _loc3_;
               array[_loc2_].number = _loc2_;
               array[_loc1_].number = _loc1_;
            }
         }
         _loc1_ = _loc1_ + 1;
      }
      _loc2_ = _loc2_ + 1;
   }
}
```

**排序规则**:
1. 出征幻兽排在最前面（chuzheng * 1000000 加成）
2. 按评分从高到低排序

**代码引用**: [DefineSprite_787/frame_1/DoAction.as](scripts/DefineSprite_787/frame_1/DoAction.as#L164-L210)

### updata() - 更新背包显示

```actionscript
function updata()
{
   var _loc2_ = 0;
   while(_loc2_ < onepage_bbnum)
   {
      this["bb" + _loc2_]._visible = false;
      _loc2_ = _loc2_ + 1;
   }
   var _loc0_;
   _loc2_ = j = n = 0;
   var _loc3_ = (nowpage - 1) * onepage_bbnum;
   _loc2_ = 0;
   while(_loc3_ && _loc2_ < maxbb)
   {
      if(array[_loc2_])
      {
         n = _loc2_ + 1;
         _loc3_ = _loc3_ - 1;
      }
      _loc2_ = _loc2_ + 1;
   }
   _loc2_ = 0;
   while(_loc2_ < onepage_bbnum)
   {
      j = n;
      while(j < maxbb)
      {
         if(array[j])
         {
            this["bb" + _loc2_].shows(array[j]);
            n = j + 1;
            break;
         }
         j++;
      }
      if(j == maxbb)
      {
         break;
      }
      _loc2_ = _loc2_ + 1;
   }
   allpage = (bblen() - bblen() % onepage_bbnum) / 4 + 1;
   t_page.text = nowpage + "/" + allpage;
   changecz();
}
```

**代码引用**: [DefineSprite_787/frame_1/DoAction.as](scripts/DefineSprite_787/frame_1/DoAction.as#L105-L149)

### setfocus(fb) - 设置焦点幻兽

```actionscript
function setfocus(fb)
{
   focus = fb.point;
   var _loc2_ = 0;
   while(_loc2_ < onepage_bbnum)
   {
      this["bb" + _loc2_].focusbox._visible = false;
      _loc2_ = _loc2_ + 1;
   }
   fb.focusbox._visible = true;
   shuomin.shows(fb.point);
   if(fb)
   {
      movebutton._y = fb._y;
      if(focus.chuzheng)
      {
         movebutton.b2.gotoAndStop(2);
      }
      else
      {
         movebutton.b2.gotoAndStop(1);
      }
      movebutton._visible = true;
   }
   else
   {
      movebutton._visible = false;
   }
}
```

**代码引用**: [DefineSprite_787/frame_1/DoAction.as](scripts/DefineSprite_787/frame_1/DoAction.as#L76-L104)

### pageUp() - 上一页

```actionscript
function pageUp()
{
   allpage = (bblen() - bblen() % onepage_bbnum) / 4 + 1;
   if(nowpage > 1)
   {
      nowpage--;
      updata();
      setfocus();
   }
}
```

**代码引用**: [DefineSprite_787/frame_1/DoAction.as](scripts/DefineSprite_787/frame_1/DoAction.as#L56-L65)

### pageDown() - 下一页

```actionscript
function pageDown()
{
   allpage = (bblen() - bblen() % onepage_bbnum) / 4 + 1;
   if(nowpage < allpage)
   {
      nowpage++;
      updata();
      setfocus();
   }
}
```

**代码引用**: [DefineSprite_787/frame_1/DoAction.as](scripts/DefineSprite_787/frame_1/DoAction.as#L66-L75)

### changecz() - 更新出征显示

```actionscript
function changecz()
{
   _root.czmb0.chuzheng(chuzheng[0]);
   _root.czmb1.chuzheng(chuzheng[1]);
}
```

**代码引用**: [DefineSprite_787/frame_1/DoAction.as](scripts/DefineSprite_787/frame_1/DoAction.as#L270-L274)

### openme() - 打开背包

```actionscript
function openme()
{
   movebutton._visible = false;
   dan._visible = false;
   diuqi._visible = false;
   focusbox._visible = false;
   shuomin._visible = false;
   updata();
}
```

**代码引用**: [DefineSprite_787/frame_1/DoAction.as](scripts/DefineSprite_787/frame_1/DoAction.as#L275-L283)

### closeme() - 关闭背包

```actionscript
function closeme()
{
   _X = hide_x;
   _Y = hide_y;
   _visible = false;
}
```

**代码引用**: [DefineSprite_787/frame_1/DoAction.as](scripts/DefineSprite_787/frame_1/DoAction.as#L284-L289)

### opens() - 显示背包

```actionscript
function opens()
{
   _X = show_x;
   _Y = show_y;
   _visible = true;
}
```

**代码引用**: [DefineSprite_787/frame_1/DoAction.as](scripts/DefineSprite_787/frame_1/DoAction.as#L290-L295)

### clearall() - 清空背包

```actionscript
function clearall()
{
   zhaohuibb(chuzheng[0]);
   zhaohuibb(chuzheng[1]);
   removeMovieClip(chuzheng[0]);
   chuzheng[0] = false;
   removeMovieClip(chuzheng[1]);
   chuzheng[1] = false;
   var _loc1_;
   _loc1_ = 0;
   while(_loc1_ < maxbb)
   {
      removeMovieClip(array[_loc1_]);
      array[_loc1_] = false;
      _loc1_ = _loc1_ + 1;
   }
}
```

**代码引用**: [DefineSprite_787/frame_1/DoAction.as](scripts/DefineSprite_787/frame_1/DoAction.as#L296-L312)

### movedan() - 拖拽幻兽

```actionscript
function movedan()
{
   _root.dan.doStartDrag(focus);
}
```

**代码引用**: [DefineSprite_787/frame_1/DoAction.as](scripts/DefineSprite_787/frame_1/DoAction.as#L211-L214)

## 出征幻兽管理

### 出征位置

| 位置 | 变量 | 显示对象 |
|-----|------|---------|
| 第一个 | chuzheng[0] | _root.czmb0 |
| 第二个 | chuzheng[1] | _root.czmb1 |

### 出征限制

- 最多同时出征2只幻兽
- 出征幻兽会自动排在背包最前面
- 召回出征幻兽后自动取消出征状态

## 分页系统

| 参数 | 值 |
|-----|-----|
| 每页显示 | 4只 |
| 总容量 | 100只 |

### 页数计算

```actionscript
allpage = (bblen() - bblen() % onepage_bbnum) / 4 + 1;
```

## 背包操作限制

### 添加幻兽

- 检查背包是否已满（bblen() >= maxbb）
- 满时提示"你的幻兽背包已经满了，放不下更多幻兽了"

### 移除幻兽

- 检查是否在出征中（wbb.chuzheng）
- 检查是否有等级（!wbb.dj）
- 出征中的幻兽无法丢弃

## 与其他系统的交互

- **幻兽对象**：通过 array 存储幻兽引用
- **出征幻兽**：通过 _root.czmb0/czmb1 显示
- **角色信息**：出征幻兽属性加成到角色
- **存档系统**：保存/加载幻兽数据

## 设计模式

幻兽背包系统采用了以下设计模式：

1. **容器模式**：管理幻兽集合
2. **迭代器模式**：遍历幻兽数组
3. **观察者模式**：幻兽数量变化时更新界面
4. **分页模式**：大量数据分页显示
