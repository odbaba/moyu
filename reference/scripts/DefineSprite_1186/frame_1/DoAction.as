function talk()
{
   _root.talk.openme(this);
   words = "　　每星期六，国家竞技场都会举行例行勇士PK赛，任何勇士都可以参加，对于胜出都有丰厚的奖励。";
   words += "\r　　比赛总共分为三组，60级组，100级组和100级以上组，报名后系统会跟据你的等级来确定将你分配到哪一组比赛中。每组比赛都只评出一个冠军给与奖励";
   _root.talk.words(words,"PK赛报名官");
   var _loc3_ = 1;
   _root.talk.answer(_loc3_++,"查看奖品");
   _root.talk.answer(_loc3_++,"我来报名参加");
   _root.talk.answer(_loc3_++,"随便看看");
}
function answer(num)
{
   var _loc2_;
   switch(num)
   {
      case 1:
         words = "奖品是：";
         words += "\r60级组奖高级飞天连斩技能书、大量经验和魔石。";
         words += "\r100级组奖高级飞天连斩技能书、大量经验、魔石和稀有物品月光宝盒加强版。";
         words += "\r100级以上组奖高级斗志抑扬技能书、大量经验、魔石、月光宝盒加强版、电浆药水和999朵白玫瑰";
         words += "\r报名比赛前不要忘了整理一个背包，确保有足够的空间装奖品哦。";
         _root.talk.words(words,"PK赛报名官");
         break;
      case 2:
         if(_root.mc_day.nowday % 7 == 6)
         {
            if(_root.pk_race)
            {
               _root.pk_race = false;
               _root.talk.closeme();
               _loc2_ = new Sound();
               _loc2_.attachSound("传送.wav");
               _loc2_.start();
               if(_root.xinxi.dj <= 60)
               {
                  _root.gotoAndStop("PK赛场1层");
               }
               else if(_root.xinxi.dj <= 100)
               {
                  _root.gotoAndStop("PK赛场2层");
               }
               else
               {
                  _root.gotoAndStop("PK赛场3层");
               }
            }
            else
            {
               _root.alertbox("\r\r今天的比赛已经结束了，下次再来吧。");
               _root.talk.closeme();
            }
         }
         else
         {
            _root.alertbox("\r\r比赛在星期六才进行，你到那时再来报名吧");
            _root.talk.closeme();
         }
         break;
      case 3:
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
