function talk()
{
   _root.talk.openme(this);
   words = "我可以帮你合成　魔魂之心、幻魔之心、灵魂王、高级经验石、高级战斗力石。\r";
   words += "\r魔魂之心：需要5个魔魂晶石。";
   words += "\r幻魔之心：需要5个幻魔晶石。";
   words += "\r灵魂王：需要20个灵魂晶石。";
   words += "\r高级经验石：需要10个中级经验石。";
   _root.talk.words(words,"宝石合成师");
   var _loc3_ = 1;
   _root.talk.answer(_loc3_++,"我要合成　魔魂之心");
   _root.talk.answer(_loc3_++,"我要合成　幻魔之心");
   _root.talk.answer(_loc3_++,"我要合成　灵魂王");
   _root.talk.answer(_loc3_++,"我要合成　高级经验石");
}
function answer(num)
{
   switch(num)
   {
      case 1:
         if(_root.beibao.usethings("魔魂晶石",5))
         {
            id = "魔魂之心";
            _root.beibao.more(this);
            _root.msgbox("成功合成了魔魂之心");
         }
         else
         {
            _root.alertbox("你的背包里没有足够的魔魂晶石啊哦");
         }
         break;
      case 2:
         if(_root.beibao.usethings("幻魔晶石",5))
         {
            id = "幻魔之心";
            _root.beibao.more(this);
            _root.msgbox("成功合成了幻魔之心");
         }
         else
         {
            _root.alertbox("你的背包里没有足够的幻魔晶石啊哦");
         }
         break;
      case 3:
         if(_root.beibao.usethings("灵魂晶石",20))
         {
            id = "灵魂王";
            _root.beibao.more(this);
            _root.msgbox("成功合成了灵魂王");
         }
         else
         {
            _root.alertbox("你的背包里没有足够的灵魂晶石啊哦");
         }
         break;
      case 4:
         if(_root.beibao.usethings("中级经验石",10))
         {
            id = "高级经验石";
            _root.beibao.more(this);
            _root.msgbox("成功合成了高级经验石");
         }
         else
         {
            _root.alertbox("你的背包里没有足够的中级经验石啊哦");
         }
         break;
      case 5:
         if(_root.beibao.usethings("中级战斗力石",10))
         {
            id = "高级战斗力石";
            _root.beibao.more(this);
            _root.msgbox("成功合成了高级战斗力石");
         }
         else
         {
            _root.alertbox("你的背包里没有足够的中级战斗力石啊哦");
         }
         break;
      case 6:
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
