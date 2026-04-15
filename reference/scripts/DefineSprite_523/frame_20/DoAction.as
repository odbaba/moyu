if(_root.jineng.getjn(1) == 1)
{
   if(_root.xinxi.usetl(10))
   {
      _root.zhanchang.hitgw(2);
   }
   else
   {
      _root.alertbox("\r\r体力不足，技能效果不能正常发挥。");
      _root.zhanchang.hitgw(0);
   }
}
else if(_root.xinxi.usetl(20))
{
   _root.zhanchang.hitgw(3);
}
else
{
   _root.alertbox("\r\r体力不足，技能效果不能正常发挥。");
   _root.zhanchang.hitgw(0);
}
gotoAndStop("站立姿势");
