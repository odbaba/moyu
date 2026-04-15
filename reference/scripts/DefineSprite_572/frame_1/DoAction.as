function more(dsc)
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
   if(!isok)
   {
      _root.alertbox("你的背包已经满了");
      return isok;
   }
   src = dsc;
   var _loc3_ = this.getNextHighestDepth();
   this.attachMovie(dsc.id,"wp" + _loc3_,_loc3_);
   return isok;
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
   var _loc3_;
   if(isok)
   {
      src = dsc;
      _loc3_ = this.getNextHighestDepth();
      this.attachMovie(dsc.myid,"wp" + _loc3_,_loc3_);
   }
   else
   {
      _root.alertbox("你的背包已经满了");
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
function subjb(price)
{
   if(price < 0)
   {
      price = - price;
      if(myjb >= price)
      {
         myjb -= price;
         jb.text = showjb(myjb);
         return true;
      }
      return false;
   }
   myjb += price;
   jb.text = showjb(myjb);
   return true;
}
function subms(price)
{
   if(price < 0)
   {
      price = - price;
      if(myms >= price)
      {
         myms -= price;
         ms.text = showjb(myms);
         return true;
      }
      return false;
   }
   myms += price;
   ms.text = showjb(myms);
   return true;
}
function fillexpball(exps)
{
   i = 0;
   var _loc4_;
   while(i < yn)
   {
      j = 0;
      while(j < xn)
      {
         if(array[i][j] && array[i][j].myid == "空经验球")
         {
            if(exps <= 3000)
            {
               _root.msgbox("经验太少不能存储进经验球");
               return exps;
            }
            exps += array[i][j].exps;
            array[i][j].exps = 0;
            while(exps >= 27000)
            {
               exps -= 27000;
               src = null;
               _loc4_ = this.getNextHighestDepth();
               this.attachMovie("满经验球","wp" + _loc4_,_loc4_);
               if(--array[i][j].number < 1)
               {
                  removeMovieClip(array[i][j]);
                  array[i][j] = false;
                  return exps;
               }
            }
            array[i][j].addexp(exps);
            return 0;
         }
         j++;
      }
      i++;
   }
   return exps;
}
function usethings(it_name, it_num)
{
   if(it_num < 0)
   {
      it_num = - it_num;
      i = 0;
      while(i < yn)
      {
         j = 0;
         while(j < xn)
         {
            if(array[i][j] && array[i][j].myid == it_name)
            {
               if(array[i][j].number >= it_num)
               {
                  array[i][j].number -= it_num;
                  if(array[i][j].number <= 0)
                  {
                     removeMovieClip(array[i][j]);
                     array[i][j] = false;
                  }
                  return true;
               }
               return false;
            }
            j++;
         }
         i++;
      }
      return false;
   }
   var _loc3_ = 0;
   i = 0;
   while(i < yn)
   {
      j = 0;
      while(j < xn)
      {
         if(array[i][j] && array[i][j].myid == it_name)
         {
            _loc3_ = _loc3_ + 1;
         }
         j++;
      }
      i++;
   }
   if(_loc3_ >= it_num)
   {
      i = 0;
      while(i < yn)
      {
         j = 0;
         while(j < xn)
         {
            if(array[i][j] && array[i][j].myid == it_name)
            {
               removeMovieClip(array[i][j]);
               array[i][j] = false;
               it_num = it_num - 1;
               if(0 >= it_num)
               {
                  return true;
               }
            }
            j++;
         }
         i++;
      }
   }
   return false;
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
   i = 0;
   while(i < yn)
   {
      j = 0;
      while(j < xn)
      {
         if(array[i][j])
         {
            if(!array[i][j].myid)
            {
               array[i][j] = false;
            }
         }
         j++;
      }
      i++;
   }
}
function clearall()
{
   i = 0;
   while(i < yn)
   {
      j = 0;
      while(j < xn)
      {
         removeMovieClip(array[i][j]);
         array[i][j] = false;
         j++;
      }
      i++;
   }
   myjb = 0;
   myms = 0;
   ms.text = showjb(myms);
   jb.text = showjb(myjb);
}
var myjb = 0;
var myms = 0;
src = null;
mydepth = this.getDepth();
base = 40;
xbase = 3;
ybase = 1;
offset = 4;
xn = 6;
yn = 4;
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
jb.text = showjb(myjb);
ms.text = showjb(myms);
show_x = 453;
show_y = 300;
hide_x = 800;
hite_y = 600;
closeme();
