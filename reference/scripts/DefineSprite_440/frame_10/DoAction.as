stop();
if(isBoss)
{
   this.attachMovie("BOSS","gw0",this.getNextHighestDepth());
   this.gw0._x = gw_x[0];
   this.gw0._y = gw_y[0];
}
else
{
   var i = 0;
   while(i < gwnum)
   {
      this.attachMovie("怪物对象","gw" + i,this.getNextHighestDepth());
      setProperty(eval("gw" + i), _X, gw_x[i]);
      setProperty(eval("gw" + i), _Y, gw_y[i]);
      i++;
   }
}
show_hs();
_root.xinxi.beginpk(185,335);
if(_root.zhuangbei.zhth() == 1)
{
   _root.msgbox("在天魂战魂的神圣力量下，所有敌人的战斗力下降" + 2 * _root.zhuangbei.zhjj() + "%。");
}
else if(_root.zhuangbei.zhdh() == 1)
{
   _root.msgbox("在地魂战魂的神圣力量下，所有敌人的生命值减少" + 5 * _root.zhuangbei.zhjj() + "%。");
}
