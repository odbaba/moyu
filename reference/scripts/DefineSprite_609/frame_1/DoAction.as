function buy()
{
   if(_root.beibao.subjb(- price_jb))
   {
      id = thing;
      if(!_root.beibao.more(this))
      {
         noroom._visible = true;
         _root.beibao.subjb(price_jb);
      }
   }
   else
   {
      nomoney._visible = true;
   }
}
function sell()
{
   i = 0;
   while(i < yn)
   {
      j = 0;
      while(j < xn)
      {
         if(array[i][j] != false)
         {
            removeMovieClip(array[i][j]);
            array[i][j] = false;
         }
         j++;
      }
      i++;
   }
   _root.beibao.subjb(myjb);
   myjb = 0;
   jb.text = showjb(myjb);
}
function item(str)
{
   thing = str;
   dj = 1;
   switch(random(100) % 6)
   {
      case 0:
      case 1:
      case 2:
         pz = 0;
         break;
      case 3:
      case 4:
         pz = 1;
         break;
      case 5:
         pz = 2;
   }
   dong = 0;
   if(random(1000) < 10)
   {
      dong = random(2) + 1;
   }
   mhdj = random(4);
}
function more(dsc)
{
   src = dsc;
   var _loc2_ = this.getNextHighestDepth();
   this.attachMovie(dsc.id,"wp" + _loc2_,_loc2_);
}
function movethings(dsc)
{
   isok = false;
   i = 0;
   while(i < yn)
   {
      j = 0;
      while(j < xn)
      {
         if(!array[i][j])
         {
            isok = true;
            i = yn;
            j = xn;
         }
         j++;
      }
      i++;
   }
   var _loc2_;
   if(isok)
   {
      src = dsc;
      _loc2_ = this.getNextHighestDepth();
      this.attachMovie(dsc.myid,"wp" + _loc2_,_loc2_);
   }
   return isok;
}
function getroom(dsc)
{
   var _loc0_;
   var _loc2_ = yj = -1;
   i = 0;
   while(i < yn)
   {
      j = 0;
      while(j < xn)
      {
         if(!array[i][j])
         {
            array[i][j] = dsc;
            countvalue(dsc,1);
            _loc2_ = i;
            yj = j;
            i = yn;
            j = xn;
         }
         j++;
      }
      i++;
   }
   if(_loc2_ != -1 && yj != -1)
   {
      dsc.xi = _loc2_;
      dsc.yj = yj;
      dsc._x = xbase + base * yj + offset;
      dsc._y = ybase + base * _loc2_ + offset;
   }
   else
   {
      removeMovieClip(dsc);
   }
}
function freeroom(dsc)
{
   countvalue(dsc,-1);
   array[dsc.xi][dsc.yj] = false;
}
function showjb(a)
{
   b = new Array(5);
   b[0] = Math.floor(a / 1000000000000);
   b[1] = Math.floor(a % 1000000000000 / 1000000000);
   b[2] = Math.floor(a % 1000000000 / 1000000);
   b[3] = Math.floor(a % 1000000 / 1000);
   b[4] = Math.floor(a % 1000);
   textjb = "";
   var _loc1_ = 0;
   var _loc2_ = true;
   while(_loc1_ < b.length)
   {
      if(b[_loc1_] > 0 || !_loc2_)
      {
         if(!_loc2_)
         {
            textjb += ",";
            if(b[_loc1_] < 10)
            {
               textjb += "00";
            }
            else if(b[_loc1_] < 100)
            {
               textjb += "0";
            }
         }
         textjb += b[_loc1_];
         _loc2_ = false;
      }
      _loc1_ = _loc1_ + 1;
   }
   return textjb;
}
function countvalue(wp, flag)
{
   myjb += flag * wp.getjbvalue() * 0.75;
   jb.text = showjb(myjb);
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
thing = "灵魂晶石";
price_jb = 1000000;
price_ms = 0;
number = 10;
src = null;
mydepth = this.getDepth();
base = 40;
xbase = 166;
ybase = 81;
offset = 4;
xn = 4;
yn = 3;
array = new Array(yn);
i = 0;
while(i < yn)
{
   array[i] = new Array(xn);
   j = 0;
   while(j < xn)
   {
      array[i][j] = false;
      j++;
   }
   i++;
}
myjb = 0;
myms = 0;
jb.text = showjb(myjb);
ms.text = showjb(myms);
show_x = 285;
show_y = 90;
hide_x = 800;
hite_y = 600;
closeme();
