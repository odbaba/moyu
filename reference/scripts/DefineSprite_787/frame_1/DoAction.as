// ============================================================
// DefineSprite_787/frame_1/DoAction.as - 幻兽背包管理
// ============================================================
// 功能说明：
// 本文件是幻兽背包系统的核心，管理幻兽的存储、出征、排序等功能
// 主要功能：
// 1. 幻兽背包容量管理（最大100只）
// 2. 幻兽出征/召回
// 3. 幻兽排序（按评分和出征状态）
// 4. 分页显示（每页4只）
// ============================================================

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
function movedan()
{
   _root.dan.doStartDrag(focus);
}
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
function changecz()
{
   _root.czmb0.chuzheng(chuzheng[0]);
   _root.czmb1.chuzheng(chuzheng[1]);
}
function openme()
{
   movebutton._visible = false;
   dan._visible = false;
   diuqi._visible = false;
   focusbox._visible = false;
   shuomin._visible = false;
   updata();
}
function closeme()
{
   _X = hide_x;
   _Y = hide_y;
   _visible = false;
}
function opens()
{
   _X = show_x;
   _Y = show_y;
   _visible = true;
}
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
src = null;
num = 0;
mydepth = this.getDepth();
nowpage = 1;
allpage = 1;
onepage_bbnum = 4;
maxbb = 100;
array = new Array(maxbb);
chuzheng = new Array(2);
openme();
show_x = 0;
show_y = 150;
hide_x = 800;
hite_y = 600;
closeme();
