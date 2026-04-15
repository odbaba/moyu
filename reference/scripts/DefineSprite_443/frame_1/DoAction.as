function drop1()
{
   _root.hidegw();
   baoli = 1 + (_root.xinxi.xy + 1) / 100;
   if(gwname == "蜘蛛")
   {
      if(random(100) < 15 * baoli)
      {
         id = "斗志抑扬";
         _root.beibao.more(this);
      }
      if(random(100) < 25 * baoli)
      {
         id = "飞天连斩";
         _root.beibao.more(this);
      }
      if(random(100) < 30 * baoli)
      {
         id = "星魔剑";
         _root.beibao.more(this);
      }
      if(random(200) < 60 * baoli)
      {
         id = "灵魂晶石";
         _root.beibao.more(this);
      }
      if(random(200) < 10 * baoli)
      {
         id = "月光宝盒";
         _root.beibao.more(this);
      }
      return true;
   }
   if(gwname == "蜘蛛王后艾达")
   {
      if(random(100) < 20 * baoli)
      {
         id = "高级斗志抑扬";
         _root.beibao.more(this);
      }
      if(random(100) < 20 * baoli)
      {
         id = "高级星魔剑";
         _root.beibao.more(this);
      }
      if(random(100) < 10 * baoli)
      {
         id = "高级飞天连斩";
         _root.beibao.more(this);
      }
      if(random(100) < 80 * baoli)
      {
         id = "灵魂晶石";
         _root.beibao.more(this);
      }
      if(random(100) < 30 * baoli)
      {
         id = "灵魂王";
         _root.beibao.more(this);
      }
      if(random(100) < 30 * baoli)
      {
         id = "幻魔之心";
         _root.beibao.more(this);
      }
      if(random(100) < 30 * baoli)
      {
         id = "魔魂之心";
         _root.beibao.more(this);
      }
      if(random(200) < 10 * baoli)
      {
         id = "月光宝盒增强版";
         _root.beibao.more(this);
      }
      return true;
   }
   if(gwname == "魔军突击队")
   {
      if(_root.openzh == true)
      {
         if(random(100) < 25)
         {
            id = "战魂之心";
         }
         else
         {
            id = "战魂晶石";
         }
         _root.beibao.more(this);
      }
      _root.alertbox("魔军突击队已经被消灭，所有魔军的攻击力下降50%。");
      return true;
   }
   if(gwname == "魔军守卫军")
   {
      if(_root.openzh == true)
      {
         if(random(100) < 25)
         {
            id = "战魂之心";
         }
         elseid = "战魂晶石";
         _root.beibao.more(this);
      }
      _root.alertbox("魔军守卫军已经被消灭，所有魔军的防御力下降50%。");
      return true;
   }
   if(gwname == "魔军神秘部队")
   {
      if(_root.openzh == true)
      {
         if(random(100) < 25)
         {
            id = "战魂之心";
         }
         elseid = "战魂晶石";
         _root.beibao.more(this);
      }
      _root.alertbox("魔军神秘部队已经被消灭，所有魔军的生命值下降50%。");
      return true;
   }
   if(gwname == "魔军图腾兽")
   {
      if(_root.openzh == true)
      {
         if(random(100) < 25)
         {
            id = "战魂之心";
         }
         elseid = "战魂晶石";
         _root.beibao.more(this);
      }
      _root.alertbox("魔军图腾兽已经被消灭，所有魔军的战斗力下降50%。");
      return true;
   }
   if(gwname == "魔军主帅")
   {
      if(_root.openzh == true)
      {
         id = "战魂之心";
         _root.beibao.more(this);
      }
      _root.alertbox("魔军主帅已经被消灭！！！，只要进入能量塔禁地销毁魔的能量就能取得完全胜利了！");
      return true;
   }
   if(gwname == "魔的能量")
   {
      _root.isWin = true;
      _root.gotoAndPlay("游戏结束");
      return true;
   }
   _root.beibao.subjb(6 * (20 + dj) * 10 * baoli);
   if(dj <= 200)
   {
      if(random(200) < 5 * baoli)
      {
         id = "灵魂晶石";
         _root.beibao.more(this);
      }
      if(random(100) < 25)
      {
         if(dj < 10)
         {
            dj = 1;
         }
         else if(dj > 100)
         {
            dj = 125;
         }
         else if(dj % 10)
         {
            dj -= dj % 10;
         }
         pz = 0;
         if(random(100) < 30)
         {
            pz = 1;
         }
         if(random(100) < 30)
         {
            pz = 2;
         }
         if(random(200) < 5 * baoli)
         {
            pz = 3;
         }
         if(random(200) < 5 * baoli)
         {
            pz = 4;
         }
         if(random(100) < 90)
         {
            mhdj = random(10);
         }
         else
         {
            mhdj = 9 + random(4);
         }
         dong = 0;
         if(random(100) < 5)
         {
            dong = random(2);
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
   }
   if(gwname == "雷角风牙兽")
   {
      if(_root.openzh == true && random(100) > 50)
      {
         id = "战魂之心";
      }
      else
      {
         id = "月光宝盒增强版";
      }
      _root.beibao.more(this);
      _root.alertbox("你击败了挡道的雷角风牙兽\r获得了" + id);
   }
   else if(gwname == "骑士亡魂" && _root.openzh == true)
   {
      id = "战魂晶石";
      _root.beibao.more(this);
   }
   else if(gwname == "冰雪巨人士兵")
   {
      _root.xinxi.upjx(500);
      _root.alertbox("你消灭了冰雪巨人士兵，获得了500点战功");
      if(_root.openzh == true)
      {
         id = "战魂晶石";
         _root.beibao.more(this);
      }
   }
   else if(gwname == "冰雪巨人士官")
   {
      _root.xinxi.upjx(2000);
      _root.alertbox("你消灭了冰雪巨人士官，获得了2,000点战功");
      if(random(100) < 25 && _root.openzh == true)
      {
         id = "战魂之心";
         _root.beibao.more(this);
      }
   }
   else if(gwname == "冰雪巨人军官")
   {
      _root.xinxi.upjx(5000);
      _root.alertbox("你消灭了冰雪巨人军官，获得了5,000点战功");
      if(_root.openzh == true)
      {
         id = "战魂之心";
         _root.beibao.more(this);
      }
   }
   else if(gwname == "无名氏")
   {
      id = "战魂之心";
      _root.beibao.more(this);
      _root.openzh = true;
      _root.openzhrw = false;
      _root.alertbox("获得了战魂之心。\r终于找到关于战魂的秘密了，快去找装备打造师吧，他知道如果激发装备的战魂。");
   }
   return true;
}
function drop2()
{
   _root.hidegw();
   baoli = 1 + (_root.xinxi.xy + 1) / 100;
   if(!isNormalBoss)
   {
      switch(gwname)
      {
         case "60级PK赛BOSS":
            _root.beibao.subms(27000);
            _root.xinxi.have_exp(40000);
            id = "高级飞天连斩";
            _root.beibao.more(this);
            _root.alertbox("\r恭喜你获得了本届PK赛冠军\r你获得了：27,000魔石、40,000经验、高级飞天连斩");
            break;
         case "100级PK赛BOSS":
            _root.beibao.subms(56000);
            _root.xinxi.have_exp(150000);
            id = "高级飞天连斩";
            _root.beibao.more(this);
            id = "月光宝盒增强版";
            _root.beibao.more(this);
            _root.alertbox("\r恭喜你获得了本届PK赛冠军\r你获得了：56,000魔石、150,000经验、高级飞天连斩、月光宝盒增强版");
            break;
         case "130级PK赛BOSS":
            _root.beibao.subms(82800);
            _root.xinxi.have_exp(250000);
            id = "高级斗志抑扬";
            _root.beibao.more(this);
            id = "月光宝盒增强版";
            _root.beibao.more(this);
            id = "电浆药水";
            _root.beibao.more(this);
            id = "999朵白玫瑰";
            _root.beibao.more(this);
            _root.alertbox("\r恭喜你获得了本届PK赛冠军\r你获得了：82,800魔石、250,000经验、高级斗志抑扬、月光宝盒增强版、电浆药水、999朵白玫瑰");
      }
      return true;
   }
   if(_root.openzh == true && random(100) > 50)
   {
      id = "战魂晶石";
   }
   else
   {
      id = "灵魂晶石";
   }
   _root.beibao.more(this);
   if(random(100) < dj / 10)
   {
      id = "灵魂王";
      _root.beibao.more(this);
   }
   if(random(200) < 10 * baoli)
   {
      if(dj >= 60)
      {
         id = "月光宝盒增强版";
      }
      else
      {
         id = "月光宝盒";
      }
      _root.beibao.more(this);
   }
   if(dj < 10)
   {
      dj = 1;
   }
   else if(dj > 100)
   {
      dj = 125;
   }
   else if(dj % 10)
   {
      dj -= dj % 10;
   }
   if(random(100) < 70)
   {
      pz = 3;
   }
   else
   {
      pz = 4;
   }
   if(random(100) < 75)
   {
      mhdj = 6 + random(4);
   }
   else
   {
      mhdj = 9 + random(4);
   }
   dong = 0;
   if(random(100) < 25)
   {
      dong = 1;
      if(random(100) > 80)
      {
         dong = 2;
      }
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
   _root.xinxi.upjx(1000);
   _root.msgbox("你消灭了BOSS，获得了1000点战功");
   return true;
}
_visible = false;
gwname = "";
dj = 1;
isNormalBoss = false;
