function talk()
{
   _root.talk.openme(this);
   words = "　　为了提升勇士们幻兽的战斗力，国家投资100,000魔石成立了幻兽研究所，专门研究提升幻兽星级的技术。";
   words += "\r　　幻兽研究所的技术每星期提升10%，每资助10,000魔石可以提升1级技术。当技术等级达到20级以上时就可以生产高星级奇异兽。每个勇士都可以购买这些极品幻兽，由于受生产量有限，所有数量也不会很多。";
   if(_root.hsyjs_rate >= _root.hsyjsmaxrate)
   {
      words += "现在生产量已经达到最高了。";
   }
   else
   {
      words += "但我们会努力提升生产量的，勇士是否愿意帮忙？";
   }
   _root.talk.words(words,"幻兽研究所");
   flag = 1;
   _root.talk.answer(1,"进入");
   _root.talk.answer(2,"研究所的当前信息");
   _root.talk.answer(3,"关于2008奥运使者");
   if(_root.rw_hsyjs && _root.hsyjs_rate < _root.hsyjsmaxrate)
   {
      _root.talk.answer(4,"提高产量任务");
   }
}
function answer(num)
{
   switch(num)
   {
      case 1:
         switch(flag)
         {
            case 1:
               _root.CloseAll();
               _root.hsyjs.openme();
               _root.talk.closeme();
               break;
            case 2:
               _root.talk.closeme();
               break;
            case 3:
               if(_root.pro2008now == undefined)
               {
                  _root.pro2008now = 0;
                  _root.alertbox("你接受了幻兽研究所的嘱托。");
               }
               _root.talk.closeme();
               break;
            case 4:
               if(_root.beibao.usethings("灵魂王",needbs))
               {
                  _root.rw_hsyjs = false;
                  _root.hsyjs_rate += 1;
                  _root.hsyjs.updata();
                  _root.hsyjsvip = _root.hsyjsvip + 1;
                  _root.alertbox("\r任务完成，幻兽研究所的幻兽生产量提高了。你被幻兽研究所提升为" + _root.hsyjsvip + "星VIP会员");
                  exps = 105000 * needbs;
                  _root.xinxi.have_exp(exps);
                  _root.alertbox("\r你获得了" + exps + "经验");
               }
               else
               {
                  _root.alertbox("\r你的背包里不够" + needbs + "个灵魂王。");
               }
               _root.talk.closeme();
         }
         break;
      case 2:
         if(_root.hsyjs_jsdj >= 20)
         {
            words = "　　幻兽研究所现在技术等级为" + Math.round(_root.hsyjs_jsdj * 100) / 100 + "级。生产量为" + _root.hsyjs_rate + "个/天。现在还有" + _root.hsyjs_number + "个库存。";
            if(_root.hsyjsvip > 0)
            {
               words += "\r　　你是我们的" + _root.hsyjsvip + "星VIP，所以你在这里可以享受" + (10 - _root.hsyjsvip) + "折优惠价购买奇异兽";
            }
         }
         else
         {
            words = "　　幻兽研究所现在技术等级为" + Math.round(_root.hsyjs_jsdj * 100) / 100 + "级。在20级之前未能生产幻兽。";
         }
         words += "\r　　完成幻兽研究所的任务可以提高你在这里的VIP星级，VIP星级越高在这里购买奇异兽就能获得越高的折扣。";
         _root.talk.words(words,"幻兽研究所");
         break;
      case 3:
         if(_root.pro2008now < 5 || _root.pro2008now == undefined)
         {
            words = "　　听说2008奥运使者对幻兽培养技术很有研究。如果你见到他，帮我打听一些有关幻兽培养的技术。";
            _root.talk.words(words,"幻兽研究所");
            _root.talk.answer(1,"放心，我会的。");
            i = 2;
            while(i <= 6)
            {
               _root.talk.answer(i,"");
               i++;
            }
            flag = 3;
         }
         else
         {
            words = "　　非常感谢2008奥运使者给我们到来的技术，现在我们的技术等级最高可以提高到" + _root.hsyjs_jsdjmax + "级。";
            _root.talk.words(words,"幻兽研究所");
         }
         break;
      case 4:
         if(_root.rw_hsyjs)
         {
            needbs = _root.hsyjs_rate + 1;
            words = "　　我们现在还需要" + needbs + "个灵魂王就可以提生产量提升一级啦，勇士你能帮帮我的忙吗?";
            _root.talk.words(words,"幻兽研究所");
            _root.talk.answer(1,"我已经给你到来了");
            i = 2;
            while(i <= 6)
            {
               _root.talk.answer(i,"");
               i++;
            }
            flag = 4;
         }
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
var needbs;
