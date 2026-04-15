function talk()
{
   _root.talk.openme(this);
   words = "　　你好，我是国家元帅，有什么事情吗？";
   _root.talk.words(words,"元帅");
   var _loc3_ = 1;
   _root.talk.answer(_loc3_++,"领取军饷");
   _root.talk.answer(_loc3_++,"战功查询");
   _root.talk.answer(_loc3_++,"军情查询");
   _root.talk.answer(_loc3_++,"关于军衔");
   _root.talk.answer(_loc3_++,"没事");
}
function answer(num)
{
   switch(num)
   {
      case 1:
         if(_root.mc_day.nowday % 7 == 0)
         {
            if(_root.yspay)
            {
               _root.yspay = false;
               myms = 0;
               switch(_root.xinxi.jxdj)
               {
                  case 0:
                  default:
                     _root.alertbox("你还没有军衔，所以没有你的军饷。");
                     return false;
                  case 1:
                     myms = 280;
                     break;
                  case 2:
                     myms = 540;
                     break;
                  case 3:
                     myms = 820;
                     break;
                  case 4:
                     myms = 2800;
                     break;
                  case 5:
                     myms = 5600;
                     break;
                  case 6:
                     myms = 8280;
                     break;
                  case 7:
                     myms = 10000;
                     break;
                  case 8:
                     myms = 20000;
                     break;
                  case 9:
                     myms = 30000;
                     break;
                  case 10:
                     myms = 40000;
                     break;
                  case 11:
                     myms = 50000;
               }
               words = _root.xinxi.jxname + "，这是你的军饷：";
               _root.beibao.subms(myms);
               _root.alertbox("获得了" + myms + "魔石");
               words += "\n" + myms + "魔石。";
               if(_root.xinxi.jxdj >= 7)
               {
                  id = "高级斗志抑扬";
                  _root.beibao.more(this);
                  words += "\r你作为一个高级将领，这" + id + "是对你的奖励。";
                  _root.alertbox("获得了" + id);
               }
            }
            else
            {
               words = "这个星期的军饷你已经领过了";
            }
         }
         else
         {
            words = "星期天才发军饷，到时候记得来领哦。";
         }
         _root.talk.words(words,"元帅");
         break;
      case 2:
         words = "你的当前的战功是：" + _root.xinxi.jxexp;
         if(_root.xinxi.jxdj < 11)
         {
            words += "/" + _root.xinxi.jxdjexp[_root.xinxi.jxdj];
            words += "\r你还要" + (_root.xinxi.jxdjexp[_root.xinxi.jxdj] - _root.xinxi.jxexp) + "战功才能晋升一级军衔。";
         }
         _root.talk.words(words,"元帅");
         break;
      case 3:
         words = "　　国家情报机关收集了部分BOSS的行踪，你可以看看。";
         if(_root.boss10)
         {
            words += "\r10级BOSS正在雷鸣大陆活动";
         }
         if(_root.boss20)
         {
            words += "\r20级BOSS正在戈壁活动";
         }
         if(_root.boss30)
         {
            words += "\r30级BOSS正在迷梦沼泽活动";
         }
         if(_root.boss50)
         {
            words += "\r50级BOSS正在冰宫活动";
         }
         if(_root.boss70)
         {
            words += "\r70级BOSS正在亚维特岛活动";
         }
         if(_root.boss90)
         {
            words += "\r90级BOSS正在火山活动";
         }
         if(_root.boss100)
         {
            words += "\r100级BOSS正在深渊迷宫活动";
         }
         _root.talk.words(words,"元帅");
         break;
      case 4:
         words = "　　为了与魔族大军战斗，国家军队需要培养一批优秀的军官。只要有相当的战功就授与相应的军衔。\r　　每消灭一个BOSS奖1000点战功，每消灭一个雪域边境的魔族冰雪巨人奖10,000点战功。";
         words += "\r　　少尉至上尉军衔每级要求1000点战功，少校至上校军衔每级要求5000点战功，少将至大将军衔每级要求10,000点战功...";
         _root.talk.words(words,"元帅");
         break;
      case 5:
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
