this.onRelease = function()
{
   _root.mb_visible = mb_visible;
   _root.tsxs._visible = false;
   _root.zhanchang.isBoss = isBoss;
   _root.zhanchang.gwname = names;
   if(!isBoss && names != "蜘蛛" && names != "蜘蛛王后艾达")
   {
      if(names == "蜘蛛" || names == "蜘蛛王后艾达" || names == "雷角风牙兽" || names == "无名氏" || names == "魔的能量")
      {
         _root.zhanchang.gwnum = 1;
      }
      else if(dj <= 25)
      {
         _root.zhanchang.gwnum = random(3) + 1;
      }
      else if(dj <= 65)
      {
         _root.zhanchang.gwnum = random(3) + 2;
      }
      else if(dj <= 100)
      {
         _root.zhanchang.gwnum = random(3) + 3;
      }
      else if(dj <= 130)
      {
         _root.zhanchang.gwnum = random(3) + 4;
      }
      else
      {
         _root.zhanchang.gwnum = 1;
      }
   }
   else
   {
      _root.zhanchang.gwnum = 1;
   }
   _root.gotoAndStop("战场");
};
this.onRollOver = function()
{
   mytext = names + "(" + dj + "级)" + "\n" + "经验增加" + Math.round(_root.xinxi.more_exp * 100) + "%" + "\n" + "单击左键进入战斗";
   _root.tsxs.shows(this);
   var _loc3_ = new Sound();
   _loc3_.attachSound("指向怪物.wav");
   _loc3_.start();
};
this.onRollOut = function()
{
   _root.tsxs._visible = false;
};
this.onDragOut = function()
{
   _root.tsxs._visible = false;
};
