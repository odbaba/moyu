function talk()
{
   _root.talk.openme(this);
   words = "　　我们家族是世袭公爵家族，我向来喜欢收藏各种珍稀名贵物品。";
   words = "\r　　我现在很想收集的是金矿、灵魂王、电浆药水、999朵白玫瑰、月光宝盒和满经验球等等...";
   words += "\r　　还有我正在收集各种各样的极品装备，只要是极品我都要，如果其它属性很好的话我还会出更高的价钱给你。";
   words += "\r　　如果你有什么好东西别忘了先找找我吧，我要的东西我会出很高的　魔石　价钱和你交易的。";
   _root.talk.words(words,"收藏家");
   var _loc3_ = 1;
   _root.talk.answer(_loc3_++,"我有些好东西要卖");
   _root.talk.answer(_loc3_++,"我没什么想卖的");
}
function answer(num)
{
   switch(num)
   {
      case 1:
         _root.CloseAll();
         _root.shoucangjia.openme();
         _root.beibao.openme();
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
