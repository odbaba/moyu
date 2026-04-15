function talk()
{
   _root.talk.openme(this);
   words = "　　国家为了鼓励勇士们英勇奋战，特别开设一抽奖房。抽奖房里的宝箱有各种各样的好东西，甚至是稀世极品，只要你花上28魔石就能打开一个宝箱，每个宝箱都有可能得到极品的哦。";
   _root.talk.words(words,"抽奖官");
   var _loc3_ = 1;
   _root.talk.answer(_loc3_++,"好吧，让我来试试我的运气");
   _root.talk.answer(_loc3_++,"我对这事不感兴趣");
}
function answer(num)
{
   var _loc2_;
   switch(num)
   {
      case 1:
         _root.talk.closeme();
         _loc2_ = new Sound();
         _loc2_.attachSound("传送.wav");
         _loc2_.start();
         _root.gotoAndStop("抽奖房");
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
