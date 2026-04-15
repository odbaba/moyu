function talk()
{
   _root.talk.openme(this);
   words = "　　我自小跟随公主，公主向来与我们有福共享，一在正是公主困难的时候，我一定会好好照看好公主的。";
   if(_root.shinv2item)
   {
      words += "\r听说有一位将军要卖一种很漂亮的宝石，叫高级战斗力宝石，听说是精练武器的宝物。他卖2,800魔石一个，如果你需要我帮你联系他吧。";
   }
   _root.talk.words(words,"丫环1");
   var _loc3_ = 1;
   if(_root.shinv2item)
   {
      _root.talk.answer(_loc3_++,"太好了，那正是我要找的宝物呢。(每天一个)");
   }
   _root.talk.answer(_loc3_++,"谢谢你美丽的姑娘");
}
function answer(num)
{
   switch(num)
   {
      case 1:
         if(_root.shinv2item)
         {
            if(_root.beibao.subms(-2800))
            {
               _root.shinv2item = false;
               id = "高级战斗力石";
               _root.beibao.more(this);
               _root.alertbox("\r\r高级战斗力石");
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
