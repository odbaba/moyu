function more(dsc)
{
   src = dsc;
   var _loc2_ = this.getNextHighestDepth();
   this.attachMovie(dsc.id,"wp" + _loc2_,_loc2_);
}
function movethings(dsc)
{
   var _loc2_;
   if(weapon == null && isWeaponOrStone(dsc) == 1 || stone == null && isWeaponOrStone(dsc) == 2)
   {
      src = dsc;
      _loc2_ = this.getNextHighestDepth();
      this.attachMovie(dsc.myid,"wp" + _loc2_,_loc2_);
      return true;
   }
   return false;
}
function getroom(dsc)
{
   if(weapon == null && isWeaponOrStone(dsc) == 1)
   {
      weapon = dsc;
      dsc._x = weapon_x;
      dsc._y = weapon_y;
      return 1;
   }
   if(stone == null && isWeaponOrStone(dsc) == 2)
   {
      stone = dsc;
      dsc._x = stone_x;
      dsc._y = stone_y;
      return 1;
   }
   return 0;
}
function freeroom(dsc)
{
   if(isWeaponOrStone(dsc) == 1)
   {
      weapon = null;
   }
   if(isWeaponOrStone(dsc) == 2)
   {
      stone = null;
   }
}
function isWeaponOrStone(dsc)
{
   if(dsc.myid == "手镯" || dsc.myid == "头盔" || dsc.myid == "武器" || dsc.myid == "项链" || dsc.myid == "衣服" || dsc.myid == "战鞋")
   {
      return 1;
   }
   if(dsc.myid == "高级经验石" || dsc.myid == "高级战斗力石" || dsc.myid == "幻魔晶石" || dsc.myid == "幻魔之心" || dsc.myid == "灵魂晶石" || dsc.myid == "灵魂王" || dsc.myid == "魔魂晶石" || dsc.myid == "魔魂之心" || dsc.myid == "月光宝盒" || dsc.myid == "月光宝盒增强版" || dsc.myid == "中级经验石" || dsc.myid == "中级战斗力石" || dsc.myid == "战魂晶石" || dsc.myid == "战魂之心")
   {
      return 2;
   }
   return 0;
}
function begin()
{
   var _loc2_ = false;
   switch(stone.myid)
   {
      case "战魂晶石":
         if(random(100) < 20)
         {
            openzh();
         }
         _loc2_ = true;
         fail.start();
         break;
      case "战魂之心":
         _loc2_ = openzh();
         break;
      case "灵魂晶石":
         if(weapon.pz < 2)
         {
            _loc2_ = weaponUp("品质");
         }
         else if(weapon.pz == 2)
         {
            if(random(100) % 2)
            {
               _loc2_ = weaponUp("品质");
            }
            else
            {
               _loc2_ = true;
               fail.start();
            }
         }
         else if(weapon.pz == 3)
         {
            if(random(100) % 4 == 1)
            {
               _loc2_ = weaponUp("品质");
            }
            else
            {
               _loc2_ = true;
               fail.start();
            }
         }
         break;
      case "灵魂王":
         if(weapon.pz < 4)
         {
            _loc2_ = weaponUp("品质");
         }
         break;
      case "幻魔晶石":
         if(!canuse())
         {
            return false;
         }
         if(weapon.dj < 50)
         {
            if(random(100) < 50)
            {
               _loc2_ = weaponUp("等级");
            }
            else
            {
               _loc2_ = true;
               fail.start();
            }
         }
         else if(weapon.dj < 90)
         {
            if(random(100) < 30)
            {
               _loc2_ = weaponUp("等级");
            }
            else
            {
               _loc2_ = true;
               fail.start();
            }
         }
         else if(weapon.dj < 125)
         {
            if(random(100) < 20)
            {
               _loc2_ = weaponUp("等级");
            }
            else
            {
               _loc2_ = true;
               fail.start();
            }
         }
         break;
      case "幻魔之心":
         if(!canuse())
         {
            return false;
         }
         _loc2_ = weaponUp("等级");
         break;
      case "魔魂晶石":
         if(weapon.mhdj < 6)
         {
            if(random(100) < 90)
            {
               _loc2_ = weaponUp("魔魂");
            }
            else
            {
               _loc2_ = true;
               weapon.mhdj--;
               fail.start();
            }
         }
         else if(weapon.mhdj < 9)
         {
            if(random(100) < 50)
            {
               _loc2_ = weaponUp("魔魂");
            }
            else
            {
               _loc2_ = true;
               weapon.mhdj--;
               fail.start();
            }
         }
         else if(weapon.mhdj < 12)
         {
            if(random(100) < 35)
            {
               _loc2_ = weaponUp("魔魂");
            }
            else
            {
               _loc2_ = true;
               if(weapon.mhdj > 9)
               {
                  weapon.mhdj--;
               }
               fail.start();
            }
         }
         break;
      case "魔魂之心":
         if(weapon.mhdj < 9)
         {
            _loc2_ = weaponUp("魔魂");
         }
         break;
      case "中级经验石":
         _loc2_ = stoneIn("中级经验石");
         break;
      case "高级经验石":
         _loc2_ = stoneIn("高级经验石");
         if(_loc2_ && weapon.zhtype > 0 && weapon.zhdj < 5)
         {
            weapon.zhdj += 1;
            _root.alertbox("高级宝石的镶入使得装备能量提升，战魂等级提高一级。");
         }
         break;
      case "中级战斗力石":
         _loc2_ = stoneIn("中级战斗力石");
         break;
      case "高级战斗力石":
         _loc2_ = stoneIn("高级战斗力石");
         if(_loc2_ && weapon.zhtype > 0 && weapon.zhdj < 5)
         {
            weapon.zhdj += 1;
            _root.alertbox("高级宝石的镶入使得装备能量提升，战魂等级提高一级。");
         }
         break;
      case "月光宝盒":
         if(weapon.dong == 0)
         {
            weapon.dong = 1;
            _loc2_ = true;
            success.start();
            if((weapon.zhtype == undefined || weapon.zhtype < 1) && random(1000) < 30)
            {
               openzh();
            }
         }
         break;
      case "月光宝盒增强版":
         if(weapon.dong == 1)
         {
            weapon.dong = 2;
            _loc2_ = true;
            success.start();
            if((weapon.zhtype == undefined || weapon.zhtype < 1) && random(1000) < 100)
            {
               openzh();
            }
         }
         break;
      default:
         return false;
   }
   if(_loc2_)
   {
      weapom.nowplayto();
      if(stone.myid == "战魂之心" || stone.myid == "月光宝盒" || stone.myid == "月光宝盒增强版")
      {
         removeMovieClip(stone);
         stone = null;
      }
      else if(!_root.beibao.usethings(stone.myid,1))
      {
         removeMovieClip(stone);
         stone = null;
      }
   }
   return _loc2_;
}
function canuse()
{
   if(weapon.dj == 125)
   {
      _root.alertbox("\r\r该装备已经是最高等级了，所以不能升级。");
      return false;
   }
   var _loc2_ = 125;
   if(weapon.dj == 1)
   {
      _loc2_ = 10;
   }
   else if(weapon.dj < 100)
   {
      _loc2_ = weapon.dj + 10;
   }
   else if(weapon.dj < 125)
   {
      _loc2_ = 125;
   }
   if(_loc2_ <= _root.xinxi.dj)
   {
      return true;
   }
   _root.alertbox("\r\r该装备升级后使用等级高于你的等级，所以不能升级。");
   return false;
}
function weaponUp(type)
{
   switch(type)
   {
      case "品质":
         if(weapon.pz < 4)
         {
            weapon.pz++;
            if(weapon.pz >= 4)
            {
               _root.msgbox(_root.xinxi.myname + "打造出了传说中的极品装备。");
               if(weapon.zhtype > 0 && weapon.zhdj < 5)
               {
                  weapon.zhdj += 1;
                  _root.alertbox("装备品质提升到了极品使得装备能量提升，战魂等级提高一级。");
               }
               else if((weapon.zhtype == undefined || weapon.zhtype < 1) && random(1000) < 25)
               {
                  openzh();
               }
            }
            break;
         }
         return false;
         break;
      case "等级":
         if(weapon.dj == 1)
         {
            weapon.dj += 9;
         }
         else if(weapon.dj < 100)
         {
            weapon.dj += 10;
         }
         else if(weapon.dj < 125)
         {
            weapon.dj += 25;
         }
         break;
      case "魔魂":
         if(weapon.mhdj < 12)
         {
            weapon.mhdj++;
            if(weapon.mhdj >= 12)
            {
               _root.msgbox(_root.xinxi.myname + "将" + weapon.myid + "的魔魂等级提升到了12级。");
               if(weapon.zhtype > 0 && weapon.zhdj < 5)
               {
                  weapon.zhdj += 1;
                  _root.alertbox("魔魂等级提升到了12级使得装备能量提升，战魂等级提高一级。");
               }
            }
         }
         break;
      default:
         return false;
   }
   success.start();
   return true;
}
function stoneIn(bs)
{
   if(weapon.dong > 0 && weapon.checkbs(weapon.dong1) == "")
   {
      weapon.dong1 = bs;
      success.start();
      return true;
   }
   if(weapon.dong == 2 && weapon.checkbs(weapon.dong2) == "")
   {
      weapon.dong2 = bs;
      success.start();
      return true;
   }
   return false;
}
function cutbs()
{
   if(weapon.dong1)
   {
      if(weapon.zhtype > 0 && weapon.zhdj > 1)
      {
         weapon.zhdj = 1;
         _root.msgbox("摘除宝石操作使战魂的等级下降为1级");
      }
      weapon.dong1 = "";
      if(weapon.dong2)
      {
         weapon.dong2 = "";
         if(random(100) < 80 && weapon.pz > 0)
         {
            weapon.pz -= 1;
            fail.start();
         }
         return true;
      }
      if(random(100) < 50 && weapon.pz > 0)
      {
         weapon.pz -= 1;
         fail.start();
      }
      return true;
   }
}
function openzh()
{
   if(_root.openzh == false)
   {
      return false;
   }
   if(weapon.zhtype <= 0)
   {
      _root.alertbox(_root.xinxi.myname + "的装备在精练中爆发出强大的能量激活了装备战魂");
   }
   weapon.zhtype = random(2) + 1;
   weapon.zhdj = 1;
   success.start();
   return true;
}
function openme()
{
   _X = show_x;
   _Y = show_y;
   _visible = true;
}
function closeme()
{
   _X = hide_x;
   _Y = hide_y;
   _visible = false;
   if(weapon != null && _root.beibao.movethings(weapon))
   {
      weapon = null;
   }
   else if(stone != null && _root.cangku.movethings(stone))
   {
      stone = null;
   }
   _root.zhuangbei.closeme();
   _root.beibao.closeme();
}
src = null;
weapon = null;
stone = null;
mydepth = this.getDepth();
weapon_x = 72;
weapon_y = 47;
stone_x = 147;
stone_y = 38;
var success = new Sound();
var fail = new Sound();
success.attachSound("精练成功.wav");
fail.attachSound("精练失败.wav");
show_x = 238;
show_y = 375;
hide_x = 800;
hite_y = 600;
closeme();
