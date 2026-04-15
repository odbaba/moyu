if(_root.jineng.getjn(2) == 1)
{
   if(_root.xinxi.usetl(30))
   {
      _root.zhanchang.hitgw(4);
   }
   else
   {
      _root.alertbox("\r\r体力不足，技能效果不能正常发挥。");
      _root.zhanchang.hitgw(0);
   }
}
else if(_root.xinxi.usetl(50))
{
   _root.zhanchang.hitgw(5);
}
else
{
   _root.alertbox("\r\r体力不足，技能效果不能正常发挥。");
   _root.zhanchang.hitgw(0);
}
gotoAndStop("站立姿势");
