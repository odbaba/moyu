function openbox()
{
   if(!_root.beibao.subms(-28))
   {
      _root.alertbox("\r\r你不够28点魔石了哦，不能抽奖费啦。");
      return false;
   }
   _root.mc_day.times_go(2);
   var _loc3_ = random(1000);
   var _loc4_;
   if(_loc3_ < 20)
   {
      switch(random(6))
      {
         case 0:
            _root.moshishang.nz.newbb();
            id = "噜噜幻兽";
            break;
         case 1:
            id = "月光宝盒增强版";
            _root.beibao.more(this);
            break;
         case 2:
            id = "电浆药水";
            _root.beibao.more(this);
            break;
         case 3:
            id = "高级斗志抑扬";
            _root.beibao.more(this);
            break;
         case 4:
            id = "999朵白玫瑰";
            _root.beibao.more(this);
            break;
         case 5:
            pz = 4;
            mhdj = 9;
            dong = 2;
            item();
            break;
         default:
            id = "满经验球";
            _root.beibao.more(this);
      }
      _root.alertbox("\n" + _root.xinxi.myname + "受到幸运女神的青睐，获得了" + id);
      _loc4_ = new Sound();
      _loc4_.attachSound("升级.wav");
      _loc4_.start();
   }
   else if(_loc3_ < 70)
   {
      switch(random(7))
      {
         case 0:
            _root.moshishang.ts.newbb();
            id = "圣天使幻兽";
            break;
         case 1:
            pz = 4;
            mhdj = 12;
            dong = 1;
            item();
            break;
         case 2:
            id = "飞天连斩";
            _root.beibao.more(this);
            break;
         case 3:
            id = "斗志抑扬";
            _root.beibao.more(this);
            break;
         case 4:
            id = "高级星魔剑";
            _root.beibao.more(this);
            break;
         case 5:
            id = "飞天连斩";
            _root.beibao.more(this);
            break;
         case 6:
            id = "灵魂王";
            _root.beibao.more(this);
            break;
         default:
            id = "满经验球";
            _root.beibao.more(this);
      }
   }
   else if(_loc3_ < 450)
   {
      switch(random(5))
      {
         case 0:
            _root.moshishang.xo8.newbb();
            id = "8星奇异兽";
            break;
         case 1:
            pz = 4;
            mhdj = 0;
            dong = 0;
            item();
            break;
         case 2:
            _root.moshishang.xo12.newbb();
            id = "12星奇异兽";
            break;
         case 3:
            id = "幻魔之心";
            _root.beibao.more(this);
            break;
         case 4:
            id = "魔魂之心";
            _root.beibao.more(this);
            break;
         default:
            id = "满经验球";
            _root.beibao.more(this);
      }
   }
   else
   {
      switch(random(4))
      {
         case 0:
            id = "满经验球";
            _root.beibao.more(this);
            break;
         case 1:
            pz = 3;
            mhdj = random(9);
            dong = 0;
            item();
            break;
         case 2:
            id = "灵魂晶石";
            _root.beibao.more(this);
            break;
         case 3:
            id = "99朵白玫瑰";
            _root.beibao.more(this);
            break;
         default:
            id = "满经验球";
            _root.beibao.more(this);
      }
   }
   _root.msgbox(_root.xinxi.myname + "意气风发，获得了" + id);
}
function item()
{
   if(_root.xinxi.dj < 10)
   {
      dj = 10;
   }
   else if(_root.xinxi.dj < 40)
   {
      dj = _root.xinxi.dj - _root.xinxi.dj % 10;
   }
   else
   {
      dj = 50;
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
stop();
this.onRelease = function()
{
   var _loc1_ = new Sound();
   _loc1_.attachSound("open.wav");
   _loc1_.start();
   openbox();
};
this.onRollOver = function()
{
   gotoAndStop(2);
};
this.onRollOut = function()
{
   gotoAndStop(1);
};
