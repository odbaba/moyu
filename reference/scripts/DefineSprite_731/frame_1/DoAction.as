function updata()
{
   var _loc2_ = 0;
   while(_loc2_ < jns)
   {
      if(jineng[_loc2_] > 0)
      {
         this["jn" + _loc2_].gotoAndStop(jineng[_loc2_]);
      }
      else
      {
         this["jn" + _loc2_]._visible = false;
      }
      _loc2_ = _loc2_ + 1;
   }
}
function setjn(n, m)
{
   if(m <= 0)
   {
      return false;
   }
   var _loc3_;
   var _loc2_;
   if(!jineng[n])
   {
      _loc3_ = 0;
      _loc2_ = 0;
      while(_loc2_ < jns)
      {
         _loc3_ += jineng[_loc2_] <= 0 ? 0 : 1;
         _loc2_ = _loc2_ + 1;
      }
      jineng[n] = m;
      this["jn" + n]._visible = true;
      this["jn" + n]._y = ybase + _loc3_ * base;
      this["jn" + n]._x = xbase;
   }
   else if(jineng[n] < m)
   {
      jineng[n] = m;
   }
   return true;
}
function studyjn(n, m)
{
   var _loc3_;
   var _loc2_;
   var _loc5_;
   if(!jineng[n])
   {
      _loc3_ = 0;
      _loc2_ = 0;
      while(_loc2_ < jns)
      {
         _loc3_ += jineng[_loc2_] <= 0 ? 0 : 1;
         _loc2_ = _loc2_ + 1;
      }
      jineng[n] = m;
      this["jn" + n]._visible = true;
      this["jn" + n]._y = ybase + _loc3_ * base;
      this["jn" + n]._x = xbase;
      openme();
      _loc5_ = new Sound();
      _loc5_.attachSound("学习技能.wav");
      _loc5_.start();
   }
   else if(jineng[n] < m)
   {
      jineng[n] = m;
      openme();
      _loc5_ = new Sound();
      _loc5_.attachSound("学习技能.wav");
      _loc5_.start();
   }
   updata();
}
function getjn(n)
{
   if(n < 0 || n > 4)
   {
      return 0;
   }
   return jineng[n];
}
function getjnjc()
{
   switch(jineng[4])
   {
      case 0:
         return 0;
      case 1:
         return 0.05;
      case 2:
         return 0.1;
      case 3:
         return 0.2;
      case 4:
         return 0.35;
      case 5:
      default:
         return 0.5;
   }
}
function love()
{
   if(jineng[5] == 1 && random(100) > 80)
   {
      _root.xinxi.xy += 10;
      IntervalID = setInterval(delay,100);
      _root.alertbox("\r爱的力量使你和你的幻兽生命值\r回复满，并且幸运值增加10点");
      return true;
   }
   if(jineng[5] == 2 && random(100) > 75)
   {
      _root.xinxi.xy += 20;
      IntervalID = setInterval(delay,100);
      _root.alertbox("\r爱的力量使你和你的幻兽生命值\r回复满，并且幸运值增加20点");
      return true;
   }
   return false;
}
function delay()
{
   clearInterval(IntervalID);
   _root.returnhp();
}
function openme()
{
   _X = show_x;
   _Y = show_y;
   _visible = true;
}
function closeme()
{
   _X = hide_x;
   _Y = hide_y;
   _visible = false;
}
xbase = 10;
ybase = 5;
base = 40;
jns = 6;
jineng = new Array(jns);
jineng[0] = jineng[1] = jineng[2] = jineng[3] = jineng[4] = jineng[5] = 0;
setjn(0,1);
setjn(1,1);
updata();
var IntervalID;
show_x = 23;
show_y = 220;
hide_x = 800;
hite_y = 600;
closeme();
