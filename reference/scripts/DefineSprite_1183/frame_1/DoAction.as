function talk()
{
   _root.talk.openme(this);
   words = "　　你好，我是国家首相。";
   _root.talk.words(words,"首相");
   var _loc3_ = 1;
   _root.talk.answer(_loc3_++,"捐献金币");
   _root.talk.answer(_loc3_++,"功勋查询");
   _root.talk.answer(_loc3_++,"关于国王的消息");
   _root.talk.answer(_loc3_++,"关于爵位");
   _root.talk.answer(_loc3_++,"没事");
}
function answer(num)
{
   switch(num)
   {
      case 1:
         words = "感谢勇士慷慨解囊。";
         _root.geiyi.openme(this);
         _root.beibao.openme();
         _root.talk.words(words,"首相");
         break;
      case 2:
         words = _root.xinxi.jwname + "，你的当前的功勋是：" + _root.xinxi.jwexp;
         if(_root.xinxi.jwdj < 5)
         {
            words += "/" + _root.xinxi.jwdjexp[_root.xinxi.jwdj];
            words += "\r你还要" + (_root.xinxi.jwdjexp[_root.xinxi.jwdj] - _root.xinxi.jwexp) + "功勋就能被授与高一级爵位。";
         }
         _root.talk.words(words,"首相");
         break;
      case 3:
         if(_root.king == true)
         {
            words = "　　感谢勇士们，我们的国王终于回来了。\r　　我们的国王智勇双全，看看他有什么对付魔族大军的策略吧。";
         }
         else
         {
            words = "　　人类的国王被前来偷袭的魔族大军先锋部队俘虏了，亚特兰蒂斯大陆已处于群龙无首的地步，据探子说，魔族大军估计不久后将从北边的雪狼冰原进入到亚特兰蒂斯大中原，若不及时制止那时人类将会成为魔族的奴隶。所以每一个亚特兰蒂斯的人类（包括你）都肩负拯救人类的使命。人类需要尽快消灭境内的魔族先锋部队，救出国王，并组织起军队来抵抗魔族大军。\r　　开始行动吧，勇敢的亚特兰蒂斯勇士，也许你就是那位救出国王，击败魔族大军，拯救了人类的英雄……";
         }
         _root.talk.words(words,"首相");
         break;
      case 4:
         words = "　　由于与魔族战争，国家需要大量金币。对于富有而又能慷慨的人，国家将授于他爵位。爵位可以为勇士增加战斗力，爵位也参加是各地图挑战赛有前提条件。\r　　捐每750,000金币能获得1点功勋。";
         words += "\r　　有1,000点功勋就的人国家将授于他勋爵。勋爵之上有子爵3,000功勋、伯爵6,000功勋、公爵15,000功勋、侯爵30,000功勋...";
         _root.talk.words(words,"首相");
         break;
      case 5:
         _root.talk.closeme();
      default:
         return;
   }
}
function givegift()
{
   var _loc2_;
   if(needjb >= 750000)
   {
      _loc2_ = Math.round(needjb / 750000);
      _root.xinxi.upjw(_loc2_);
      _root.msgbox("你获得了" + _loc2_ + "点功勋");
      _root.CloseAll(true);
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
var needjb = 0;
var needms = 0;
