function talk()
{
   _root.talk.openme(this);
   words = "　　你好，今天是" + _root.mc_day.weekday + "。";
   words += missionshow();
   _root.talk.words(words,"日常任务官");
   var _loc3_ = 1;
   _root.talk.answer(_loc3_++,"接受任务");
   _root.talk.answer(_loc3_++,"关于日常任务");
   _root.talk.answer(_loc3_++,"随便问问");
   flag = 1;
}
function answer(num)
{
   switch(num)
   {
      case 1:
         if(flag == 1)
         {
            mission();
         }
         else if(flag == 2)
         {
            talk();
         }
         break;
      case 2:
         words = "在这里从周一到周日都有不同的任务可以接。";
         words += "\r周一和周二任务：收集宝石－－收集一定数量灵魂晶石或灵魂王";
         words += "\r周三和周四任务：训练幻兽－－上交一只高星攻防型幻兽";
         words += "\r周五任务：突袭－－前往雪域边境袭击魔族军队";
         words += "\r周六任务：PK赛－－国家例行勇士PK大赛";
         words += "\r周日任务：地下城魔族将领会议－－前往破坏会议";
         if(_root.xinxi.jwdj < 6)
         {
            words += "并打听国王的下落";
         }
         words += "\r提示:BOSS会爆好装备和宝石,蜘蛛会爆技能书。";
         _root.talk.words(words,"日常任务官");
         flag = 2;
         _root.talk.answer(1,"看看今天的任务");
         break;
      case 3:
         _root.talk.closeme();
      default:
         return;
   }
}
function missionshow()
{
   var _loc2_;
   var _loc3_;
   switch(_root.mc_day.nowday % 7)
   {
      case 1:
      case 2:
      default:
         _loc2_ = "\r今天任务：收集宝石";
         _loc2_ += "\r　　据说灵魂晶石里蕴含着强大的能量，还可以用于精练武器装备以提升品质，所以国家正在大量收集灵魂晶石。你是否愿意帮助收集一些灵魂晶石？";
         _loc2_ += "\r任务要求：";
         _loc3_ = _root.xinxi.dj;
         if(_loc3_ < 100)
         {
            _loc3_ += 10;
            lhjs = (_loc3_ - _loc3_ % 10) / 10;
            lhw = 0;
            _loc2_ += "收集" + lhjs + "个灵魂晶石";
         }
         else if(_loc3_ < 110)
         {
            lhjs = 0;
            lhw = 2;
            _loc2_ += "收集" + lhw + "个灵魂王";
         }
         else if(_loc3_ < 120)
         {
            lhjs = 0;
            lhw = 5;
            _loc2_ += "收集" + lhw + "个灵魂王";
         }
         else
         {
            lhjs = 0;
            lhw = 10;
            _loc2_ += "收集" + lhw + "个灵魂王";
         }
         _loc2_ += "\r任务奖励：大量经验和500点功勋。";
         break;
      case 3:
      case 4:
         _loc2_ = "\r今天任务：训练幻兽";
         _loc2_ += "\r　　为了组织强大的军队与魔族战斗，国家军队需要扩编一支战斗力强悍幻兽队伍，国家出了很高价钱来招收符合要求的幻兽。";
         _loc2_ += "\r　　任务要求与奖励：上交一个[攻防型]幻兽，极品10星奖励5,000魔石，极品15星奖励10,000魔石，极品30星奖励50,000魔石。还有1000点战功奖励。";
         break;
      case 5:
         _loc2_ = "\r今天任务：突袭";
         if(_root.king == false)
         {
            _loc2_ += "\r　　前言：据探子回报，魔族大军部分已经进入到了雪域边境，趁着敌人还未站稳脚人类军队要派遣轻骑兵前往袭击敌人。不过敌人的战斗力还是非常强，战斗肯定会非常艰苦和危险，你是否愿意前往杀敌？";
         }
         else
         {
            _loc2_ += "\r　　虽然雪域边境已经是我们收复的领地了，但还不时有魔族军队侵扰，我们要趁着敌人还没有发觉时派遣轻骑兵前往袭击敌人，敌人不是很多，但都是精捍部队，勇士一定要小心。";
         }
         _loc2_ += "\r任务要求：从冰宫进入雪域边境，消灭那里的冰雪巨人。";
         _loc2_ += "\r任务奖励：消灭每个冰雪巨人都会得到大量战功。";
         break;
      case 6:
         _loc2_ = "\r今天任务：PK赛\r请到[皇宫][周赛PK报名官]那里报名参加比赛。";
         break;
      case 0:
         if(_root.king == false)
         {
            _loc2_ = "\r今天任务：地下城魔族将领会议";
            _loc2_ += "\r　前言：探子来报说，今天在魔族将领某个地下城里举行了军事会议，国家军事指挥部并打听国王下落。地下城共有三层，只有消灭门口那队怪物后才能进入下一层，进入到每一层都会有奖励。";
            _loc2_ += "\r任务要求：前往地下城。";
            _loc2_ += "\r任务奖励：消灭怪物越多就获得功勋值就越高。";
         }
         else
         {
            _loc2_ = _root.xinxi.myname + "探子来报说，今天在魔族将领某个地下城里举行了军事会议，国王已经发布悬赏任务招募勇士前去破坏魔族会议和消灭魔族将领。";
         }
   }
   return _loc2_;
}
function mission()
{
   var _loc3_;
   switch(_root.mc_day.nowday % 7)
   {
      case 1:
      case 2:
         if(_root.rw_bs)
         {
            gather();
         }
         else
         {
            _root.alertbox("\r\r你今天已经做过任务了");
            _root.talk.closeme();
         }
         return;
      case 3:
      case 4:
         if(_root.rw_hs)
         {
            _root.huanshougeiyu.openme(this);
            _root.huanshoumb.opens();
            _root.beibao.closeme();
         }
         else
         {
            _root.alertbox("\r\r你今天已经做过任务了");
         }
         _root.talk.closeme();
         return;
      case 5:
         _root.talk.closeme();
         _loc3_ = new Sound();
         _loc3_.attachSound("传送.wav");
         _loc3_.start();
         _root.gotoAndStop("雪域边境");
         return;
      case 6:
         _root.talk.closeme();
         _root.gotoAndStop("皇宫");
         return;
      case 0:
      default:
         if(_root.rw_dxc)
         {
            _root.rw_dxc = false;
            _root.talk.closeme();
            _loc3_ = new Sound();
            _loc3_.attachSound("传送.wav");
            _loc3_.start();
            if(_root.king == false)
            {
               _root.gotoAndStop("地下城1层");
            }
            else
            {
               _root.gotoAndStop("地下城3层");
            }
         }
         else
         {
            _root.alertbox("\r\r你今天已经做过任务了");
            _root.talk.closeme();
         }
         return;
   }
}
function gather()
{
   if(lhjs)
   {
      if(_root.beibao.usethings("灵魂晶石",lhjs))
      {
         _root.rw_bs = false;
         exps = 30000 * lhjs;
         _root.xinxi.have_exp(exps);
         _root.alertbox("\r\r你获得了" + exps + "点经验和" + 500 + "点功勋");
         _root.xinxi.upjw(500);
      }
      else
      {
         _root.alertbox("你的背包里没有足够的灵魂晶石");
      }
   }
   else if(lhw)
   {
      if(_root.beibao.usethings("灵魂王",lhw))
      {
         _root.rw_bs = false;
         exps = 210000 * lhw;
         _root.xinxi.have_exp(exps);
         _root.alertbox("\r\r你获得了" + exps + "点经验和" + 2000 + "点功勋");
         _root.xinxi.upjw(2000);
      }
      else
      {
         _root.alertbox("你的背包里没有足够的灵魂王");
      }
   }
   lhjs = lhw = 0;
}
function givebb(hs_name, hs_pz)
{
   if(hs_name == "攻防型" && hs_pz >= 500)
   {
      _root.rw_hs = false;
      if(hs_pz >= 3000)
      {
         _root.beibao.subms(50000);
         _root.alertbox("\r\r获得50,000魔石和1,000点战功");
      }
      else if(hs_pz >= 1500)
      {
         _root.beibao.subms(10000);
         _root.alertbox("\r\r获得10,000魔石和1,000点战功");
      }
      else if(hs_pz >= 1000)
      {
         _root.beibao.subms(5000);
         _root.alertbox("\r\r获得5,000魔石和1,000点战功");
      }
      _root.xinxi.upjx(1000);
      return true;
   }
   _root.alertbox("\r\r这幻兽不符合要求");
   return false;
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
