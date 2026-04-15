function talk()
{
   _root.talk.openme(this);
   words = "　　小伙子，看你东张西望的，是不是在寻找有关战魂的秘密？这里有条路是通往一个地方，我在那里见过一个箱子，也许有关战魂的秘密就在里面......\r";
   words += "　　如果你愿意付给我50,000魔石作路费我可以带你去。";
   words += "　　不过，要还看你有没有本事拿得到箱子里的东西。";
   _root.talk.words(words,"探险家");
   var _loc3_ = 1;
   _root.talk.answer(_loc3_++,"太好了，那正是我要找的地方");
   _root.talk.answer(_loc3_++,"要那么多钱啊。我还是自己找算了");
}
function answer(num)
{
   switch(num)
   {
      case 1:
         if(_root.beibao.subms(-50000))
         {
            _root.alertbox("经过了一天的辛苦跋涉，那家伙带你来你转了一圈沙漠后，又把你带到回来原来不远的地方。你还没反应过来，他就跑了......");
            _root.mc_day.times_go(15);
            _root.nowmap = "卡萨诺城";
            _root.talk.closeme();
            _root.gotoAndStop("战魂封印谜宫");
         }
         else
         {
            _root.alertbox("你的没有那么多魔石啊");
            _root.talk.closeme();
         }
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
