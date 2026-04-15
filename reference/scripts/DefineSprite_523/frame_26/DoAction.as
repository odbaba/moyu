if(_root.jineng.getjn(0) == 1)
{
   _root.zhanchang.hitgw(0);
}
else if(_root.xinxi.usetl(5))
{
   _root.zhanchang.hitgw(1);
}
else
{
   _root.alertbox("\r\r体力不足，技能效果不能正常发挥。");
   _root.zhanchang.hitgw(0);
}
gotoAndStop("站立姿势");
