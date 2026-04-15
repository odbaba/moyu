function setInOne(b)
{
   _parent.InOne = b;
   if(b)
   {
      gotoAndStop(1);
      _root.msgbox(_root.xinxi.myname + "与" + _parent.point.othername + "幻兽成功合体，攻击力、防御力得到了提升");
   }
   else
   {
      gotoAndStop(2);
   }
   _root.zhuangbei.flashme();
   _root.zhanchang.show_hs();
}
stop();
onRelease = function()
{
   setInOne(!_parent.InOne);
};
onRollOver = function()
{
   texts = "幻兽合体/解体：幻兽合体后，人物和幻兽的攻击力、防御力合为一体。在人物被攻击时，伤害值由出征中的幻兽承受。\r幻兽在出征中但不合体的状态下不会进行攻击、也不会被攻击，攻击力和防御力也不与人物的相加，仅为人物提供战斗力。";
   _root.wpxs.toshow(this);
};
onRollOut = function()
{
   _root.wpxs.tohide();
};
onPress = function()
{
   _root.wpxs.tohide();
};
