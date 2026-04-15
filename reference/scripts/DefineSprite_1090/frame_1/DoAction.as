function talk()
{
   _root.talk.openme(this);
   words = "　　我们的五福娃不知跑去哪玩了，我正在找它们。";
   _root.talk.words(words,"2008奥运使者");
   var _loc3_ = 1;
   _root.talk.answer(_loc3_++,"我帮你去找找吧");
}
function answer(num)
{
   if(num === 1)
   {
      _root.pro2008show = 0;
      _visible = false;
      _root.talk.closeme();
      _root.gotoAndStop("草原");
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
