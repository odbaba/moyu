function more(dsc)
{
   src = dsc;
   var _loc2_ = this.getNextHighestDepth();
   this.attachMovie(dsc.id,"wp" + _loc2_,_loc2_);
}
function setdim(dsc)
{
   dsc.dj = (random(10) + 1) * 10;
   dsc.pz = 1;
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
function sell()
{
   if(mb == null)
   {
      return false;
   }
   myjb = jb.text;
   myms = ms.text;
   var _loc2_;
   if(myjb >= 0 && myms >= 0 && _root.beibao.myjb >= myjb && _root.beibao.myms >= myms)
   {
      if(myjb == "" && myms == "" || myjb == "" && myms == 0 || myjb == 0 && myms == "")
      {
         _root.alertbox("\r没钱哦，你想忽悠我啊");
         closeme();
      }
      else
      {
         _root.beibao.subjb(- myjb);
         _root.beibao.subms(- myms);
         mb.needjb = myjb;
         mb.needms = myms;
      }
      i = 0;
      while(i < yn)
      {
         j = 0;
         while(j < xn)
         {
            if(array[i][j] != false)
            {
               _loc2_ = 0;
               while(_loc2_ < mb.need.length)
               {
                  if(array[i][j].myid == mb.need[_loc2_])
                  {
                     mb.neednum[_loc2_]++;
                     removeMovieClip(array[i][j]);
                     array[i][j] = false;
                  }
                  _loc2_ = _loc2_ + 1;
               }
            }
            j++;
         }
         i++;
      }
      mb.givegift();
      mb = null;
      return true;
   }
   nomoney._visible = true;
   return false;
}
function openme(dsc)
{
   _X = show_x;
   _Y = show_y;
   _visible = true;
   mb = dsc;
}
function closeme()
{
   _X = hide_x;
   _Y = hide_y;
   _visible = false;
   myms = 0;
   myjb = 0;
   _root.beibao.closeme();
}
src = null;
jb.restrict = "0-9";
ms.restrict = "0-9";
mydepth = this.getDepth();
base = 40;
xbase = 3;
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
var show_x = 5;
var show_y = 280;
var hide_x = 800;
var hite_y = 600;
var mb = null;
closeme();
