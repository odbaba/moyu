function getroom(dsc)
{
   var _loc2_ = 0;
   while(_loc2_ <= gwnum)
   {
      if(!array[_loc2_])
      {
         array[_loc2_] = dsc;
         dsc.getgw(this.gwname);
         dsc.xi = _loc2_;
         break;
      }
      _loc2_ = _loc2_ + 1;
   }
}
function freeroom(dsc)
{
   var _loc2_ = 0;
   var _loc3_ = dsc.xi;
   removeMovieClip(dsc);
   array[_loc3_] = false;
   var _loc1_ = 0;
   while(_loc1_ < gwnum)
   {
      if(array[_loc1_])
      {
         _loc2_ = _loc2_ + 1;
      }
      _loc1_ = _loc1_ + 1;
   }
   if(!_loc2_)
   {
      gotoAndStop("结束");
      play();
   }
}
function hitgw(hittype)
{
   var _loc1_;
   switch(hittype)
   {
      case 0:
      case 1:
      default:
         _loc1_ = 0;
         while(_loc1_ < gwnum)
         {
            if(array[_loc1_])
            {
               wanjia.hitsb(hittype,array[_loc1_]);
               break;
            }
            _loc1_ = _loc1_ + 1;
         }
         break;
      case 2:
      case 3:
      case 4:
      case 5:
         _loc1_ = 0;
         while(_loc1_ < gwnum)
         {
            if(array[_loc1_])
            {
               wanjia.hitsb(hittype,array[_loc1_]);
            }
            _loc1_ = _loc1_ + 1;
         }
         break;
      case 6:
         _loc1_ = 0;
         while(_loc1_ < gwnum)
         {
            if(array[_loc1_])
            {
               wanjia.hitsb(hittype,array[_loc1_]);
               return true;
            }
            _loc1_ = _loc1_ + 1;
         }
         break;
      case 7:
         _loc1_ = 0;
         while(_loc1_ < gwnum)
         {
            if(array[_loc1_])
            {
               wanjia.hitsb(hittype,array[_loc1_]);
               return true;
            }
            _loc1_ = _loc1_ + 1;
         }
   }
   next_gw_hit(0);
   return true;
}
function next_gw_hit(begin)
{
   var _loc1_;
   var _loc2_;
   _loc1_ = begin;
   while(_loc1_ < gwnum)
   {
      if(array[_loc1_])
      {
         array[_loc1_].gotoAndPlay("攻击");
         break;
      }
      _loc1_ = _loc1_ + 1;
   }
   _loc2_ = _loc1_ + 1;
   while(_loc2_ < gwnum)
   {
      if(array[_loc2_])
      {
         break;
      }
      _loc2_ = _loc2_ + 1;
   }
   if(_loc2_ >= gwnum)
   {
      wanjia.turnme();
   }
}
function show_hs()
{
   if(_root.czmb0._visible && !_root.czmb0.InOne)
   {
      zdhs1.gotoAndPlay(_root.czmb0.point.hs_name);
   }
   else
   {
      zdhs1.gotoAndStop(1);
   }
   if(_root.czmb1._visible && !_root.czmb1.InOne)
   {
      zdhs2.gotoAndPlay(_root.czmb1.point.hs_name);
   }
   else
   {
      zdhs2.gotoAndStop(1);
   }
}
_visible = false;
stop();
wanjia = _root.xinxi;
gwnum = 6;
isBoss = false;
gw_x = new Array(550,550,550,400,400,400);
gw_y = new Array(240,390,90,240,390,90);
array = new Array(gwnum);
i = 0;
while(i < 6)
{
   array[i] = false;
   i++;
}
