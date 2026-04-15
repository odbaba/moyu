function talk()
{
   _root.talk.openme(this);
   words = "　　精练能使你的装备属性更好，战斗力更高。";
   words = "\r　　装备精练说明：装备精练分五种，提升装备品质、提升装备魔魂等级、提升装备使用等级、装备开洞和镶嵌宝石。";
   words += "\r\r你需要些什么服务？";
   _root.talk.words(words,"元帅");
   var _loc3_ = 1;
   _root.talk.answer(_loc3_++,"我要精练我的装备");
   _root.talk.answer(_loc3_++,"关于提升魔魂等级");
   _root.talk.answer(_loc3_++,"关于提升品质");
   _root.talk.answer(_loc3_++,"关于装备开洞");
   _root.talk.answer(_loc3_++,"关于镶嵌宝石");
   if(_root.openzh == true)
   {
      _root.talk.answer(_loc3_++,"关于战魂");
   }
}
function answer(num)
{
   switch(num)
   {
      case 1:
         _root.CloseAll();
         _root.zbjingliank.openme();
         _root.beibao.openme();
         _root.zhuangbei.openme();
         _root.talk.closeme();
         break;
      case 2:
         words = "　　提升魔魂等级：魔魂等级最高可以+12，魔魂等级可以追加装备的攻击或防御属性，每一级追加装备基本属性的10%。如果全套装备都有魔魂等级还可以加战斗力，比如全套装备都是魔魂等级+9的就加9战斗力。魔魂等级可以用[魔魂晶石]或[魔魂之心]来提升，[魔魂之心]在+9之前可以使用，成功率为100%，+9之后只能用[魔魂晶石]追加。魔魂等级在升级时如果成功则升一级，如果失败就会降一级，+9之后不会再降低于+9了。";
         _root.talk.words(words,"元帅");
         break;
      case 3:
         words = "　　提升品质：装备品质有白品、良品、上品、精品、极品五个等级，白品加1战斗力、良品加2战斗力、上品加3战斗力、精品加4战斗力、极品加5战斗力。装备的品质可以用[灵魂晶石]或[灵魂王]来精练提升等级。";
         _root.talk.words(words,"元帅");
         break;
      case 4:
         words = "　　装备开洞：可以用[月光宝盒]或[月光宝盒加强版]给装备开洞，开第一个洞时要使用[月光宝盒]，开第二个洞时要使用[月光宝盒加强版]。先把装备放上，把月光宝盒放到“宝石”的位置，再点开始。";
         _root.talk.words(words,"元帅");
         break;
      case 5:
         words = "　　镶嵌宝石：可以给有[洞]的装备镶嵌宝石，可以镶嵌中级经验石、中级战斗力石、高级经验石和高级战斗力石。一个洞只能镶嵌一个宝石。";
         _root.talk.words(words,"元帅");
         break;
      case 6:
         words = "　　谢谢你，年轻的勇士。我已经看懂了你带给我有关战魂的秘密。装备在升极品时或都开洞时都可能会使装备激发出战魂，但是机率非常之小要。在BOSS手中有一种叫做[战魂晶石]的宝石用来激发装备战魂机率较高。还有一种叫做[战魂之心]的稀有宝石，可惜不知来源...";
         words += "\r　　只有在精练装备的时候战魂等级才可能得到提升，所以对于战魂装备来说，越差的装备升级潜力越大。";
         _root.talk.words(words,"元帅");
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
};
this.onRollOut = function()
{
   gotoAndStop(1);
};
this.onPress = function()
{
   gotoAndStop(3);
};
