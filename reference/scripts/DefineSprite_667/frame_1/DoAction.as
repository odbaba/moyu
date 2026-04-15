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
function compose()
{
   countStone();
   index = 0;
   var _loc2_;
   var _loc3_;
   while(index < 5)
   {
      if(stoneNum[index] >= stoneBaseNum[index])
      {
         _loc2_ = stoneBaseNum[index];
         i = 0;
         while(i < yn)
         {
            j = 0;
            while(j < xn)
            {
               if(array[i][j].myid == stoneName[index] && _loc2_ > 0)
               {
                  removeMovieClip(array[i][j]);
                  array[i][j] = false;
                  _loc2_ = _loc2_ - 1;
               }
               j++;
            }
            i++;
         }
         src = null;
         _loc3_ = this.getNextHighestDepth();
         this.attachMovie(stoneUpName[index],"wp" + _loc3_,_loc3_);
      }
      index++;
   }
}
function countStone()
{
   i = 0;
   while(i < 5)
   {
      stoneNum[i] = 0;
      i++;
   }
   i = 0;
   while(i < yn)
   {
      j = 0;
      while(j < xn)
      {
         if(array[i][j] != false)
         {
            switch(array[i][j].myid)
            {
               case stoneName[0]:
                  stoneNum[0]++;
                  break;
               case stoneName[1]:
                  stoneNum[1]++;
                  break;
               case stoneName[2]:
                  stoneNum[2]++;
                  break;
               case stoneName[3]:
                  stoneNum[3]++;
                  break;
               case stoneName[4]:
                  stoneNum[4]++;
            }
         }
         j++;
      }
      i++;
   }
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
src = null;
mydepth = this.getDepth();
base = 40;
xbase = 3;
ybase = 41;
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
stoneNum = new Array(0,0,0,0,0);
stoneBaseNum = new Array(5,5,10,10,10);
stoneName = new Array("魔魂晶石","幻魔晶石","灵魂晶石","中级经验石","中级战斗力石");
stoneUpName = new Array("魔魂之心","幻魔之心","灵魂王","高级经验石","高级战斗力石");
show_x = 275;
show_y = 300;
hide_x = 800;
hite_y = 600;
closeme();
