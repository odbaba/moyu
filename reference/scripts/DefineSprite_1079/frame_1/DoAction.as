function talk()
{
   _root.talk.openme(this);
   words = "　　在魔族大军的威胁下，各个地方都在招募勇士来保护当地的人民和财产的安全，";
   words += "只要你达到一定的爵位就有资格参加挑战，挑战胜利后该地方就属于你的保护地。";
   words += "每天该地方都会赠与你一定的财物以助你发展。";
   switch(jwyq)
   {
      case 1:
         jwname = "勋爵";
         break;
      case 2:
         jwname = "子爵";
         break;
      case 3:
         jwname = "伯爵";
         break;
      case 4:
         jwname = "公爵";
         break;
      case 5:
         jwname = "侯爵";
         break;
      case 6:
      default:
         jwname = "王";
         break;
      case 0:
         jwname = "平民";
   }
   words += "\r挑战要求：" + jwname + "以上。" + "\n";
   if(_root.owermap == "")
   {
      words += "\n" + _root.nowmap + "还没有保护者。";
   }
   else if(_root.owermap == _root.nowmap)
   {
      words += "\n" + _root.nowmap + "已经属于你的保护地了。";
   }
   else
   {
      words += "你是" + _root.owermap + "的保护者。" + "如果要挑战" + _root.nowmap + "你将会放弃" + _root.owermap + "保护者的资格";
   }
   _root.talk.words(words,"地图赛报名官");
   var _loc3_ = 1;
   _root.talk.answer(_loc3_++,"查看保护者每天的奖励");
   if(_root.owermap == _root.nowmap)
   {
      flag = 1;
      _root.talk.answer(_loc3_++,"我来领取今天的奖励");
   }
   else
   {
      flag = 2;
      _root.talk.answer(_loc3_++,"我来挑战");
   }
   _root.talk.answer(_loc3_++,"随便看看");
}
function answer(num)
{
   switch(num)
   {
      case 1:
         _root.talk.words("保护者每天可以得到：" + rewardtext,"地图赛报名官");
         break;
      case 2:
         if(flag == 2)
         {
            if(_root.xinxi.jwdj < jwyq)
            {
               _root.alertbox("\r\r你的爵位没有达到" + jwname);
            }
            else
            {
               _root.talk.closeme();
               if(_root.map_race)
               {
                  _root.map_race = false;
                  zhandou();
               }
               else
               {
                  _root.alertbox("\r\r你今天已经挑战过了，明天再来吧。");
               }
            }
         }
         else if(flag == 1)
         {
            if(_root.mapreward)
            {
               _root.alertbox("你获得了：" + rewardtext);
               _root.mapreward = false;
               switch(_root.nowmap)
               {
                  case "雷鸣大陆":
                     reward1();
                     break;
                  case "戈壁":
                     reward2();
                     break;
                  case "迷梦沼泽":
                     reward3();
                     break;
                  case "冰宫":
                     reward4();
                     break;
                  case "亚维特岛":
                     reward5();
                     break;
                  case "卡萨诺城":
                     reward6();
               }
            }
            else
            {
               _root.alertbox("\r\r今天没有奖励了，明天再来领吧");
            }
         }
         _root.talk.closeme();
         break;
      case 3:
         _root.talk.closeme();
      default:
         return;
   }
}
function reward1()
{
   myid = "满经验球";
   number = 2;
   id = "满经验球";
   _root.beibao.more(this);
   id = "灵魂晶石";
   _root.beibao.more(this);
   _root.beibao.more(this);
   pz = 3;
   mhdj = 9;
   dong = 1;
   item();
   _root.moshishang.xo.newbb();
}
function reward2()
{
   myid = "满经验球";
   number = 4;
   id = "满经验球";
   _root.beibao.more(this);
   id = "灵魂晶石";
   _root.beibao.more(this);
   _root.beibao.more(this);
   id = "99朵白玫瑰";
   _root.beibao.more(this);
   pz = 3;
   mhdj = 9;
   dong = 1;
   item();
   _root.moshishang.xo8.newbb();
}
function reward3()
{
   myid = "满经验球";
   number = 6;
   id = "满经验球";
   _root.beibao.more(this);
   id = "灵魂晶石";
   _root.beibao.more(this);
   _root.beibao.more(this);
   id = "飞天连斩";
   _root.beibao.more(this);
   id = "99朵白玫瑰";
   _root.beibao.more(this);
   _root.moshishang.xo12.newbb();
}
function reward4()
{
   myid = "满经验球";
   number = 8;
   id = "满经验球";
   _root.beibao.more(this);
   id = "灵魂王";
   _root.beibao.more(this);
   _root.beibao.more(this);
   id = "99朵白玫瑰";
   _root.beibao.more(this);
   pz = 3;
   mhdj = 12;
   dong = 1;
   item();
   _root.moshishang.xo12.newbb();
}
function reward5()
{
   myid = "满经验球";
   number = 10;
   id = "满经验球";
   _root.beibao.more(this);
   id = "灵魂王";
   _root.beibao.more(this);
   _root.beibao.more(this);
   id = "999朵白玫瑰";
   _root.beibao.more(this);
   pz = 4;
   mhdj = 9;
   dong = 1;
   item();
   _root.moshishang.xo19.newbb();
}
function reward6()
{
   myid = "满经验球";
   number = 15;
   id = "满经验球";
   _root.beibao.more(this);
   id = "灵魂王";
   _root.beibao.more(this);
   _root.beibao.more(this);
   id = "999朵白玫瑰";
   _root.beibao.more(this);
   pz = 4;
   mhdj = 12;
   dong = 1;
   item();
   _root.moshishang.xo19.newbb();
}
function item()
{
   if(_root.xinxi.dj < 10)
   {
      dj = 10;
   }
   else if(_root.xinxi.dj >= 100)
   {
      dj = 100;
   }
   else
   {
      dj = _root.xinxi.dj - _root.xinxi.dj % 10;
   }
   switch(random(6))
   {
      case 0:
         id = "武器";
         break;
      case 1:
         id = "头盔";
         break;
      case 2:
         id = "项链";
         break;
      case 3:
         id = "衣服";
         break;
      case 4:
         id = "手镯";
         break;
      case 5:
      default:
         id = "战鞋";
   }
   _root.beibao.more(this);
}
function zhandou()
{
   _root.zhanchang.isBoss = isBoss;
   _root.zhanchang.gwname = names;
   _root.zhanchang.gwnum = 1;
   _root.gotoAndStop("战场");
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
