function talk()
{
   _root.talk.openme(this);
   words = "　　经过冰宫进入雪域边境，就能到达魔族大军的营地了。勇士们出发吧。";
   words += "\r　　魔族大军非常强大，千万不可轻敌，要善找出它们的弱点来进攻。我们已经收集一些关于魔族大军的资料，";
   words += "魔族大军由几个部分组成：魔军突击队700级，魔军守卫军800级，魔军神秘部队900级，魔军图腾兽1000级，魔的能量和魔军主帅2000级。";
   words += "\r　　我们的目标就是－－消灭魔族主帅－－进而销毁[魔的能量]";
   _root.talk.words(words,"国王");
   var _loc3_ = 1;
   _root.talk.answer(_loc3_++,"魔军突击队资料");
   _root.talk.answer(_loc3_++,"魔军守卫军资料");
   _root.talk.answer(_loc3_++,"魔军神秘部队资料");
   _root.talk.answer(_loc3_++,"魔军图腾兽资料");
   _root.talk.answer(_loc3_++,"魔的能量资料");
   _root.talk.answer(_loc3_++,"魔军主帅资料");
}
function answer(num)
{
   switch(num)
   {
      case 1:
      default:
         words = "\r魔军突击队：700级，这是魔族大军的中锋部队，杀伤加很强，这部队的存在会使所有魔族军队的攻击力提高50%。";
         break;
      case 2:
         words = "\r魔军守卫军：800级，这支部队的存在会使所有魔族军队的防御提高50%。";
         break;
      case 3:
         words = "\r魔军神秘部队：900级，估计大多数由祭师组成，因为它的存在使得所有魔族军队的生命值提高50%。";
         break;
      case 4:
         words = "\r魔军图腾兽：1000级，非常强大的东西，它使得所有魔族军队的战斗力提高50%。";
         break;
      case 5:
         words = "\r魔的能量：这是魔族大军的生命支柱，也是我们的主要目标，只有消灭它才能彻底战胜魔族大军。不然，每天它都会复活所有的魔族大军。";
         break;
      case 6:
         words = "\r魔军主帅：2000级：魔族大军的最高指挥官，它在保护着[魔的能量]。只有消灭它才能进一步消灭[魔的能量]从而取得胜利。";
   }
   _root.talk.words(words,"国王");
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
