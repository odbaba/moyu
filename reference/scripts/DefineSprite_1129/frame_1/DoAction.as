function talk()
{
   _root.talk.openme(this);
   words = "　　每一件装备都有都有一股神秘的力量，我可以帮你将其提练出来放到经验球里面。只有良品以上或都有洞的装备才可以提练。";
   words += "\r\r　　良品可以换1个满的经验球，上品可以换2个，精品可以换3个，极品可以换4个。如果装备有一个洞的话可以多2个经验球，二洞多5个。　魔魂等级达到+9的可以多换1，达到+12的多2个。";
   _root.talk.words(words,"经验导师");
   var _loc3_ = 1;
   _root.talk.answer(_loc3_++,"用装备换经验球");
   _root.talk.answer(_loc3_++,"哦，知道了");
}
function answer(num)
{
   switch(num)
   {
      case 1:
         _root.CloseAll();
         _root.zhuangbeihuanjy.openme();
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
