function talk()
{
   _root.talk.openme(this);
   words = "你好，" + _root.xinxi.myname + _root.xinxi.jwname;
   switch(_root.xinxi.gzgx)
   {
      case 0:
      default:
         words += "，人类的勇士";
         break;
      case 1:
         words += "，人类的勇士";
         break;
      case 2:
         words += "，我的朋友";
         break;
      case 3:
         words += "，我的好朋友，非常高兴见到你";
         break;
      case 4:
         words += "，我的知己，终于等到你了";
         break;
      case 5:
         words += "，我爱的人，你还好吧";
         break;
      case 6:
         words += "，我的至爱。";
   }
   _root.talk.words(words,"公主");
   var _loc3_ = 1;
   if(_root.gzgx4)
   {
      _root.talk.answer(_loc3_++,"知己的礼物");
   }
   else
   {
      _root.talk.answer(_loc3_++,"战争还在进行着，我该出发了");
   }
   _root.talk.answer(_loc3_++,"聊天");
   if(_root.mc_day.nowday % 7 == 0)
   {
      _root.talk.answer(_loc3_++,"送礼");
   }
   if(_root.mc_day.nowday % 7 == 0 && _root.gzgift)
   {
      _root.talk.answer(_loc3_++,"星期天的礼物");
   }
}
function answer(num)
{
   switch(num)
   {
      case 1:
         if(_root.gzgx4)
         {
            _root.gzgx4 = false;
            _root.moshishang.nz.newbb();
            _root.alertbox("\r\r公主送给了你一只超级幻兽－－年猪");
         }
         else
         {
            _root.talk.closeme();
            _root.CloseAll(true);
         }
         break;
      case 2:
         if(_root.gzchat)
         {
            chat();
         }
         else
         {
            _root.alertbox("今天已经聊过了");
         }
         break;
      case 3:
         if(_root.gzgive)
         {
            _root.talk.closeme();
            _root.beibao.openme();
            _root.geiyi.openme(this);
         }
         else
         {
            _root.alertbox("公主今天不想要礼物了");
         }
         break;
      case 4:
         if(_root.gzgift)
         {
            sundaygift();
         }
      default:
         return;
   }
}
function chat()
{
   _root.gzchat = false;
   words = "";
   switch(_root.xinxi.gzgx)
   {
      case 0:
      default:
         words += "听说你是位英勇的战士，我非常敬佩你的勇敢。";
         break;
      case 1:
         if(_root.king == true)
         {
            words += "很高兴，你能和我聊天。非常感谢你把我父亲救出来。";
         }
         else
         {
            words += "很高兴，你能和我聊天。我最担心的是我的父亲，你有他的消息了吗。";
         }
         break;
      case 2:
         words += "我的朋友，我这里有些攻防型幻兽，它们很优秀在多年的战斗中它们已经进化到极品1星以上了。我把它赠与你，希望它们能在战场上助你一臂之力。";
         _root.moshishang.gfx.newbb(100);
         _root.alertbox("\r\r你获得了极品1星的攻防型幻兽");
         break;
      case 3:
         words += "我这里有许多幻兽，这个奇异兽听说是幻兽幻化时的最好副幻兽，你把它带去吧。";
         _root.moshishang.xo.newbb();
         _root.alertbox("\r\r你获得了奇异兽");
         break;
      case 4:
         words += "这是我精心为你培养的12星奇异兽，这是非常少有的优秀幻化副幻兽。";
         _root.moshishang.xo12.newbb();
         _root.alertbox("\r\r你获得了极品12星奇异兽");
         break;
      case 5:
         words += "看，这只亚特兰蒂斯大陆里非常稀有的极品19星奇异兽，我好不容易找到你，你把它带上吧，它一定是个无比优秀的幻兽";
         _root.moshishang.xo19.newbb();
         _root.alertbox("\r\r你获得了极品19星奇异兽");
         break;
      case 6:
         if(_root.king == true)
         {
            words += "你把这无比优秀的19星奇异兽带上吧";
         }
         else
         {
            words += "你把这无比优秀的19星奇异兽带上吧，希望你早目救出我的父亲。";
         }
         _root.moshishang.xo19.newbb();
         _root.alertbox("\r\r你获得了极品19星奇异兽");
   }
   _root.talk.words(words,"公主");
   if(_root.xinxi.gzgx >= 5)
   {
      _root.talk.answer(1,"谢谢亲爱的");
   }
   else
   {
      _root.talk.answer(1,"美丽的公主");
   }
   _root.talk.answer(2,"");
   _root.talk.answer(3,"");
   _root.talk.answer(4,"");
   _root.xinxi.upgzgx(1);
   _root.msgbox("你与公主的友好度增加1点");
}
function givegift()
{
   _root.gzgive = false;
   words = "谢谢你，除了鲜花以外我什么都不想要。";
   _root.talk.words(words,"公主");
   _root.talk.answer(1,"再见美丽的公主");
   _root.talk.answer(2,"");
   _root.talk.answer(3,"");
   _root.talk.answer(4,"");
   var _loc2_ = new Sound();
   _loc2_.attachSound("送花.wav");
   var _loc3_;
   if(neednum[1])
   {
      _loc3_ = 25 + (neednum[1] - 1) * 5 + neednum[0] * 1;
      _root.msgbox("公主非常高兴地收下了你的999朵白玫瑰，你与公主的友好度提高了" + _loc3_ + "点");
      _root.xinxi.upgzgx(_loc3_);
      _loc2_.start();
   }
   else if(neednum[0])
   {
      _loc3_ = 5 + (neednum[0] - 1) * 1;
      _root.msgbox("公主高兴地收下了你的99朵白玫瑰，你与公主的友好度提高了" + _loc3_ + "点");
      _root.xinxi.upgzgx(_loc3_);
      _loc2_.start();
   }
}
function sundaygift()
{
   _root.gzgift = false;
   switch(_root.xinxi.gzgx)
   {
      case 0:
      case 1:
      case 2:
      default:
         id = "高级经验石";
         words = "今天是星期天，我为你准备了一份特别的礼物。\r这是我收藏了许久的优质宝石，高级经验石，听说可以用来精练装备的，你拿去用吧。";
         break;
      case 3:
      case 4:
         id = "高级战斗力石";
         words = "今天是星期天，我为你准备了一份特别的礼物。\r这是我收藏了许久的优质宝石，高级战斗力石，听说可以用来精练装备的，你拿去用吧。";
         break;
      case 5:
         id = "灵魂王";
         words = "今天是星期天，我为你准备了一份特别的礼物。\r这是我收藏了许久的优质宝石，灵魂王，听说可以用来精练装备的，你拿去用吧。";
      case 6:
         if(_root.openzh == false)
         {
            id = "电浆药水";
            words = "今天是星期天，我为你准备了一份特别的礼物。\r我找到了一瓶电浆药水，它是一种非常神奇的宝物，可以把人物的幸运提高到100哦。送给你。";
         }
         else
         {
            id = "战魂之心";
            words = "今天是星期天，我为你准备了一份特别的礼物。\r我找到了一个战魂之心，它是极其稀有的宝石，我也不知道它有什么用，但我知道你一定懂得它有什么的。";
         }
   }
   _root.talk.words(words,"公主");
   _root.talk.answer(1,"谢谢你神圣的公主");
   _root.talk.answer(2,"");
   _root.talk.answer(3,"");
   _root.talk.answer(4,"");
   _root.beibao.more(this);
   _root.msgbox("获得了" + id);
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
var need = new Array("99朵白玫瑰","999朵白玫瑰");
var neednum = new Array(0,0);
