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
      return isok;
   }
   src = dsc;
   var _loc2_ = this.getNextHighestDepth();
   this.attachMovie(dsc.id,"wp" + _loc2_,_loc2_);
   return isok;
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
}
src = null;
mydepth = this.getDepth();
base = 40;
xbase = 3;
ybase = 41;
offset = 4;
xn = 6;
yn = 6;
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
show_x = 208;
show_y = 220;
hide_x = 800;
hite_y = 600;
closeme();
