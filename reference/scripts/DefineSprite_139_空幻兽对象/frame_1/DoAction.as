// ============================================================
// DefineSprite_139_空幻兽对象/frame_1/DoAction.as - 幻兽对象
// ============================================================
// 功能说明：
// 本文件是单个幻兽对象的核心，管理幻兽的属性、升级、战斗等功能
// 主要功能：
// 1. 幻兽属性初始化和计算
// 2. 幻兽升级和顿悟
// 3. 幻兽评分计算
// 4. 幻兽战斗行为
// ============================================================

function setmydim(dsc)
{
   chuzheng = false;
   hs_name = dsc.hs_name;
   othername = dsc.othername;
   dj = dsc.dj;
   if(dsc.predj == undefined)
   {
      predj = 1;
   }
   else
   {
      predj.dsc.predj;
   }
   if(dsc.premjy == undefined)
   {
      premjy = 10;
   }
   else
   {
      premjy = dsc.premjy;
   }
   if(dsc.prejy == undefined)
   {
      prejy = 0;
   }
   else
   {
      prejy = dsc.jy;
   }
   if(dsc.hun == undefined)
   {
      hun = 1;
   }
   else
   {
      hun = dsc.hun;
   }
   hp = dsc.hp;
   jy = dsc.jy;
   mjy = dsc.mjy;
   zs = dsc.zs;
   chp = dsc.chp;
   cxgj = dsc.cxgj;
   cdgj = dsc.cdgj;
   cfy = dsc.cfy;
   cz_hp = dsc.cz_hp;
   cz_dgj = dsc.cz_dgj;
   cz_xgj = dsc.cz_xgj;
   cz_fy = dsc.cz_fy;
   pzbase = dsc.pzbase;
   pz = dsc.pz;
   pz_chp = dsc.pz_chp;
   pz_cxgj = dsc.pz_cxgj;
   pz_cdgj = dsc.pz_cdgj;
   pz_cfy = dsc.pz_cfy;
   pz_cz_hp = dsc.pz_cz_hp;
   pz_cz_xgj = dsc.pz_cz_xgj;
   pz_cz_dgj = dsc.pz_cz_dgj;
   pz_cz_fy = dsc.pz_cz_fy;
   mhp = Math.round(cz_hp * (dj - 1) + chp);
   xgj = Math.round(cz_xgj * (dj - 1) + cxgj);
   dgj = Math.round(cz_dgj * (dj - 1) + cdgj);
   fy = Math.round(cz_fy * (dj - 1) + cfy);
}
function updata()
{
   hp = mhp = Math.round(cz_hp * (dj - 1) + chp);
   xgj = Math.round(cz_xgj * (dj - 1) + cxgj);
   dgj = Math.round(cz_dgj * (dj - 1) + cdgj);
   fy = Math.round(cz_fy * (dj - 1) + cfy);
}
function byhit(hit)
{
   hp -= hit;
   if(hp <= 0)
   {
      _root.alertbox(othername + "已经死亡，你的幸运值降低了10点。");
      _root.jineng.love();
      _root.xinxi.xy -= 10;
      if(_root.xinxi.xy < 0)
      {
         _root.xinxi.xy = 0;
         _root.zhanchang.gotoAndPlay("结束");
         _root.msgbox("你的幸运值没有了!自动退出了战斗。");
      }
      hp = 0;
      _root.huanshoumb.shuomin.shows(_root.huanshoumb.shuomin.nowbb);
      return false;
   }
   _root.huanshoumb.shuomin.shows(_root.huanshoumb.shuomin.nowbb);
   return true;
}
function have_exp(exps)
{
   if(dj >= 130)
   {
      _root.msgbox("幻兽等级已满，无法再获得经验值了。");
      jy = 0;
      return false;
   }
   if(dj >= _root.xinxi.dj + 10)
   {
      _root.msgbox("幻兽等级已高于人物的10级，无法再获得经验值了。");
      return false;
   }
   exps *= 2;
   jy += exps;
   while(jy >= mjy)
   {
      if(dj >= 130)
      {
         _root.msgbox("幻兽等级已满，无法再获得经验值了。");
         jy = 0;
         return false;
      }
      jy -= mjy;
      dj++;
      if(predj < dj)
      {
         predj = dj;
      }
      if(++xy > 100)
      {
         xy = 100;
      }
      if(dj < 20)
      {
         mjy = Math.round(mjy * 1.2);
      }
      else if(dj <= 50)
      {
         mjy = Math.round(mjy * 1.1);
      }
      else if(dj < 130)
      {
         mjy += hun;
      }
      if(dj == 50)
      {
         hun = Math.round(mjy * 0.2);
         if(predj > dj)
         {
            dj = predj;
            mjy = premjy;
            jy = prejy;
            _root.msgbox("幻兽在升级中顿悟了，等级立即升到幻化转世之前的等级" + dj + "级");
         }
         else if(_root.bbhh_point)
         {
            _root.bbhh_point = false;
            _root.alertbox("你的幻兽达到50级了，可以到幻化大师那里进行幻化。幻化可以使幻兽的各种属性得到提高。");
            _root.msgbox("你的幻兽达到50级了，可以到幻化大师那里进行幻化。幻化可以使幻兽的各种属性得到提高。");
         }
         else
         {
            _root.msgbox("你的幻兽达到50级了，可以到幻化大师那里进行幻化。幻化可以使幻兽的各种属性得到提高。");
         }
      }
   }
   updata();
   _root.huanshoumb.updata();
   _root.huanshoumb.shuomin.shows(_root.huanshoumb.shuomin.nowbb);
}
setmydim(_parent.src);
_parent.getroom(this);
