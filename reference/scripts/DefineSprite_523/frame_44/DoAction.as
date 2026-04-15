if(_root.jineng.getjn(3) == 1)
{
   if(_root.xinxi.usetl(30))
   {
      _root.zhanchang.hitgw(7);
   }
   else
   {
      _root.alertbox("\r\r体力不足，技能效果不能正常发挥。");
   }
}
else if(_root.xinxi.usetl(50))
{
   _root.zhanchang.hitgw(6);
}
else
{
   _root.alertbox("\r\r体力不足，技能效果不能正常发挥。");
   _root.zhanchang.hitgw(7);
}
