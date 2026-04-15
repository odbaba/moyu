function talk()
{
   _root.talk.openme(this);
   words = "　　我是公主的侍女，公主平时代我如同姐妹一样亲，无论发生什么事我都会陪着公主的。";
   if(_root.shinv1item)
   {
      words += "\r对了，上次国王赏给我一个很可爱的猪，它是一只叫年猪的幻兽，听说是极其稀有的。不知勇士能否用得上。";
   }
   _root.talk.words(words,"丫环2");
   var _loc3_ = 1;
   if(_root.shinv1item)
   {
      _root.talk.answer(_loc3_++,"啊,年猪是我梦想中幻兽,我愿用5888魔石和你换。(仅一个)");
   }
   _root.talk.answer(_loc3_++,"你是个好姑娘");
}
function answer(num)
{
   switch(num)
   {
      case 1:
         if(_root.shinv1item)
         {
            if(_root.beibao.subms(-5888))
            {
               _root.shinv1item = false;
               _root.moshishang.nz.newbb();
               _root.alertbox("\r\r你获得了幻兽年猪");
            }
            else
            {
               _root.alertbox("\r你没有足够的魔石哦");
            }
         }
         _root.talk.closeme();
         break;
      case 2:
         _root.talk.closeme();
      default:
         return;
   }
}
stop();
this.onRelease = function()
{
   talk();
   var _loc1_ = new Sound();
   _loc1_.attachSound("选择NPC.wav");
   _loc1_.start();
};
this.onRollOver = function()
{
   gotoAndStop(2);
   var _loc1_ = new Sound();
   _loc1_.attachSound("指向NPC.wav");
   _loc1_.start();
};
this.onRollOut = function()
{
   gotoAndStop(1);
};
this.onPress = function()
{
   gotoAndStop(3);
};
