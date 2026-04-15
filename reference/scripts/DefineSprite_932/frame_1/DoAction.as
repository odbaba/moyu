// ============================================================
// DefineSprite_932/frame_1/DoAction.as - 角色信息管理
// ============================================================
// 功能说明：
// 本文件是角色系统的核心，管理角色的所有属性、战斗、升级等功能
// 这是游戏中最重要的系统之一，控制玩家的所有状态
// 
// 主要功能：
// 1. 角色属性计算 (flashdata) - 重新计算角色的所有属性
// 2. 界面更新 (upxx) - 更新角色信息显示
// 3. 战斗系统 (hitsb, byhit) - 攻击和受伤处理
// 4. 战斗力计算 (flashzdl) - 计算总战斗力
// 5. 升级系统 (have_exp_only) - 经验获取和升级
// 6. 军衔系统 (upjx) - 军衔升级
// 7. 爵位系统 (upjw) - 爵位升级
// 8. 公主关系系统 (upgzgx) - 与公主的关系升级
// 
// 核心属性：
// - dj: Number - 等级（1-132）
// - hp/mhp: Number - 当前/最大生命值
// - tl/mtl: Number - 当前/最大体力值
// - jy/mjy: Number - 当前/升级所需经验值
// - xgj/dgj: Number - 最小/最大攻击力
// - fy: Number - 防御力
// - miss: Number - 闪避率
// - zdl: Number - 总战斗力
// - xy: Number - 幸运值（0-100）
// 
// 军衔等级：
// 0=无, 1=少尉, 2=中尉, 3=上尉, 4=少校, 5=中校, 6=上校
// 7=少将, 8=中将, 9=上将, 10=大将, 11=元帅
// 
// 爵位等级：
// 0=平民, 1=勋爵, 2=子爵, 3=伯爵, 4=公爵, 5=侯爵, 6=王
// 
// 公主关系等级：
// 0=未认识, 1=认识, 2=普通朋友, 3=好朋友, 4=知己, 5=恋人, 6=亲密恋人
// 
// 调用关系：
// - 被 _root 全局访问（_root.xinxi）
// - 调用 _root.zhuangbei 装备系统
// - 调用 _root.czmb0, _root.czmb1 出征幻兽
// - 调用 _root.jineng 技能系统
// - 调用 _root.beibao 背包系统
// 
// 相关文件：
// - frame_6/DoAction.as - 核心游戏逻辑
// - 03_装备系统_DefineSprite_561.md - 装备系统
// - 04_幻兽背包_DefineSprite_787.md - 幻兽系统
// ============================================================

// ------------------------------------------------------------
// flashdata() - 刷新角色属性
// 重新计算角色的所有属性，包括装备加成和幻兽加成
// ------------------------------------------------------------
function flashdata()
{
   miss = _root.zhuangbei.zhmiss();
   mhp = base_hp + cz_hp * dj;
   mtl = base_tl + cz_tl * dj;
   xgj = base_xgj + cz_xgj * dj + _root.zhuangbei.getxgj();
   dgj = base_dgj + cz_dgj * dj + _root.zhuangbei.getdgj();
   fy = base_fy + cz_fy * dj + _root.zhuangbei.getfy();
   if(_root.czmb0.InOne && _root.czmb0._visible)
   {
      xgj += _root.czmb0.point.xgj;
      dgj += _root.czmb0.point.dgj;
      fy += _root.czmb0.point.fy;
   }
   if(_root.czmb1.InOne && _root.czmb1._visible)
   {
      xgj += _root.czmb1.point.xgj;
      dgj += _root.czmb1.point.dgj;
      fy += _root.czmb1.point.fy;
   }
   xgj = Math.round(xgj * (1 + _root.zhuangbei.zhgj()));
   dgj = Math.round(dgj * (1 + _root.zhuangbei.zhgj()));
   bs_exp = _root.zhuangbei.getbsexp();
   flashzdl();
   upxx();
   more_exp = (zdl - dj) * 0.05 + bs_exp;
}
function upxx()
{
   if(hp > mhp)
   {
      hp = mhp;
   }
   if(tl > mtl)
   {
      tl = mtl;
   }
   this.shp._xscale = 100 * hp / mhp;
   if(tl > 0)
   {
      this.stl._xscale = 100 * tl / mtl;
   }
   else
   {
      this.stl._xscale = 0;
   }
   this.sjy._xscale = 100 * jy / mjy;
   this.txs.text = "生命" + hp + "/" + mhp;
   this.txs.text += "\r体力" + tl + "/" + mtl;
   this.txs.text += "\r经验" + Math.round(jy / mjy * 100) + "%";
   this.mxs.text = dj + "级  " + jwname + "  " + jxname;
}
function hitsb(hittype, dsc)
{
   hit = xgj + random(dgj - xgj + 1);
   switch(hittype)
   {
      case 0:
      default:
         hit *= 1;
         break;
      case 1:
         hit *= 1.5;
         break;
      case 2:
         hit *= 0.6;
         break;
      case 3:
         hit *= 0.75;
         break;
      case 4:
         hit *= 1;
         break;
      case 5:
         hit *= 1.5;
         break;
      case 6:
         hit *= 1;
         dsc.byhit(hit,zdl,true);
         return true;
      case 7:
         hit *= 1;
   }
   dsc.byhit(hit,zdl);
}
function byhit(hit, it_zdl)
{
   if(random(100) < miss)
   {
      hithp = 0;
      mubiao.setshanghai();
      return false;
   }
   var _loc4_;
   if(it_zdl > zdl)
   {
      _loc4_ = it_zdl - zdl <= 20 ? it_zdl - zdl : 20;
      hit += _loc4_ * 0.05 * hit;
   }
   else if(it_zdl < zdl)
   {
      _loc4_ = zdl - it_zdl <= 50 ? zdl - it_zdl : 50;
      hit -= _loc4_ * 0.01 * hit;
   }
   hit -= fy;
   hit = Math.round(hit);
   if(hit < 0)
   {
      hit = 1;
   }
   hithp = - hit;
   mubiao.setshanghai();
   if(_root.czmb0._visible && _root.czmb0.InOne)
   {
      _root.czmb0.byhit(hit);
      return true;
   }
   if(_root.czmb1._visible && _root.czmb1.InOne)
   {
      _root.czmb1.byhit(hit);
      return true;
   }
   hp -= hit;
   if(hp <= 0)
   {
      deathSound.start();
      _root.alertbox("战斗失败，你的幸运值降低了10点。经验值减少5%。\r看来敌人并不简单，还是退出战斗吧！");
      _root.jineng.love();
      xy -= 10;
      jy -= Math.round(jy * 0.05);
      if(xy < 0)
      {
         xy = 0;
         _root.zhanchang.gotoAndPlay("结束");
         _root.msgbox("你的幸运值没有了!自动退出了战斗。");
      }
      hp = 0;
   }
   upxx();
}
function usetl(u_tl)
{
   if(tl >= u_tl)
   {
      tl -= u_tl;
      upxx();
      return true;
   }
   return false;
}
function shanghai()
{
   return hithp;
}
function turnme()
{
   mubiao.gotoAndStop("战斗姿势");
}
function beginpk(pk_x, pk_y)
{
   mubiao.pking = true;
   pre_x = mubiao._x;
   pre_y = mubiao._y;
   mubiao._x = pk_x;
   mubiao._y = pk_y;
   mubiao.gotoAndStop("战斗姿势");
   if(_root.czmb0._visible == false)
   {
      _root.alertbox("提示：你的第一幻兽尚未出征。");
   }
   if(_root.czmb1._visible == false)
   {
      _root.alertbox("提示：你的第二幻兽尚未出征。");
   }
}
function pkover()
{
   hp = mhp;
   tl = mtl;
   upxx();
   mubiao.pking = false;
   mubiao._x = pre_x;
   mubiao._y = pre_y;
   mubiao.gotoAndStop("向下");
}
function flashzdl()
{
   flashitem();
   zdl = jbzdl = jxzdl = jwzdl = hs1zdl = hs2zdl = zbpzzdl = mhdjzdl = dongzdl = bszdl = fixzdl = bestbszdl = zhzdl = 0;
   jbzdl = dj;
   switch(jxdj)
   {
      case 1:
         jxname = "少尉";
         jxzdl = 1;
         break;
      case 2:
         jxname = "中尉";
         jxzdl = 2;
         break;
      case 3:
         jxname = "上尉";
         jxzdl = 3;
         break;
      case 4:
         jxname = "少校";
         jxzdl = 5;
         break;
      case 5:
         jxname = "中校";
         jxzdl = 10;
         break;
      case 6:
         jxname = "上校";
         jxzdl = 15;
         break;
      case 7:
         jxname = "少将";
         jxzdl = 20;
         break;
      case 8:
         jxname = "中将";
         jxzdl = 30;
         break;
      case 9:
         jxname = "上将";
         jxzdl = 40;
         break;
      case 10:
         jxname = "大将";
         jxzdl = 50;
         break;
      case 11:
      default:
         jxname = "元帅";
         jxzdl = 60;
         break;
      case 0:
         jxname = "　无";
         jxzdl = 0;
   }
   switch(jwdj)
   {
      case 1:
         jwname = "勋爵";
         jwzdl = 2;
         break;
      case 2:
         jwname = "子爵";
         jwzdl = 6;
         break;
      case 3:
         jwname = "伯爵";
         jwzdl = 12;
         break;
      case 4:
         jwname = "公爵";
         jwzdl = 20;
         break;
      case 5:
         jwname = "侯爵";
         jwzdl = 30;
         break;
      case 6:
      default:
         jwname = "王";
         jwzdl = 50;
         break;
      case 0:
         jwname = "平民";
         jwzdl = 0;
   }
   hs1zdl = _root.czmb0.getzdl();
   hs2zdl = _root.czmb1.getzdl();
   var _loc2_ = hs1zdl <= hs2zdl ? hs2zdl : hs1zdl;
   var _loc3_ = hs1zdl >= hs2zdl ? hs2zdl : hs1zdl;
   if(_loc2_ >= hs1_maxzdl)
   {
      hs1_maxzdl = _loc2_;
      if(_loc3_ >= hs2_maxzdl)
      {
         hs2_maxzdl = _loc3_;
      }
   }
   zbpzzdl = _root.zhuangbei.getpz();
   mhdjzdl = _root.zhuangbei.getmhdj();
   dongzdl = _root.zhuangbei.getdong();
   bszdl = _root.zhuangbei.getbs();
   fixzdl = _root.zhuangbei.getfix();
   bestbszdl = _root.zhuangbei.bestbszdl;
   zdl = jbzdl + jxzdl + jwzdl + hs1zdl + hs2zdl + zbpzzdl + mhdjzdl + dongzdl + bszdl + fixzdl + bestbszdl;
   jnjc = _root.jineng.getjnjc();
   jnzdl = Math.round(jnjc * zdl);
   zhzdl = Math.round(_root.zhuangbei.zhzdlrace() * zdl);
   zdl += jnzdl + zhzdl;
   if(my_maxzdl <= zdl)
   {
      my_maxzdl = zdl;
   }
   return zdl;
}
function have_exp(it_hp)
{
   var _loc2_ = it_hp * (1 + more_exp) / 100;
   _loc2_ *= 1;
   _root.czmb0.have_exp(_loc2_);
   _root.czmb1.have_exp(_loc2_);
   have_exp_only(_loc2_);
}
function have_exp_only(exps)
{
   var _loc2_;
   if(dj >= 100)
   {
      _loc2_ = _root.beibao.fillexpball(exps);
   }
   else
   {
      _loc2_ = exps;
   }
   if(_loc2_ <= 0)
   {
      return true;
   }
   if(dj >= 132)
   {
      _root.msgbox("人物等级已满132级，无法再获得经验值了。");
      jy = 0;
      return false;
   }
   jy += _loc2_;
   while(jy >= mjy)
   {
      if(dj >= 132)
      {
         _root.msgbox("人物等级已满132级，无法再获得经验值了。");
         jy = 0;
         return false;
      }
      jy -= mjy;
      dj++;
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
      else
      {
         mjy += hun;
      }
      if(dj == 50 || dj == 132)
      {
         hun = Math.round(mjy * 0.2);
      }
      flashdata();
      hp = mhp;
      tl = mtl;
      growSound.start();
      if(dj % 10 == 0 && dj <= 100)
      {
         _root.alertbox("\r你已经" + dj + "级了，你可以使用更加高级的装备了，到装备打造师那里把你的装备升级吧。");
      }
   }
   mjy = Math.round(mjy);
   jy = Math.round(jy);
   upxx();
}
function upjx(exps)
{
   jxexp += exps;
   if(jxdj >= 11 || jxexp >= 100000)
   {
      jxdj = 11;
      flashdata();
   }
   else if(jxexp >= 54000)
   {
      if(jxdj < 10)
      {
         _root.alertbox("恭喜你荣升大将");
         upSound.start();
         flashdata();
      }
      jxdj = 10;
   }
   else if(jxexp >= 44000)
   {
      if(jxdj < 9)
      {
         _root.alertbox("恭喜你荣升上将");
         upSound.start();
         flashdata();
      }
      jxdj = 9;
   }
   else if(jxexp >= 34000)
   {
      if(jxdj < 8)
      {
         _root.alertbox("恭喜你荣升中将");
         upSound.start();
         flashdata();
      }
      jxdj = 8;
   }
   else if(jxexp >= 26000)
   {
      if(jxdj < 7)
      {
         _root.alertbox("恭喜你荣升少将");
         upSound.start();
         flashdata();
      }
      jxdj = 7;
   }
   else if(jxexp >= 18000)
   {
      if(jxdj < 6)
      {
         _root.alertbox("恭喜你荣升上校");
         upSound.start();
         flashdata();
      }
      jxdj = 6;
   }
   else if(jxexp >= 13000)
   {
      if(jxdj < 5)
      {
         _root.alertbox("恭喜你荣升中校");
         upSound.start();
         flashdata();
      }
      jxdj = 5;
   }
   else if(jxexp >= 8000)
   {
      if(jxdj < 4)
      {
         _root.alertbox("恭喜你荣升少校");
         upSound.start();
         flashdata();
      }
      jxdj = 4;
   }
   else if(jxexp >= 3000)
   {
      if(jxdj < 3)
      {
         _root.alertbox("恭喜你荣升上尉");
         upSound.start();
         flashdata();
      }
      jxdj = 3;
   }
   else if(jxexp >= 2000)
   {
      if(jxdj < 2)
      {
         _root.alertbox("恭喜你荣升中尉");
         upSound.start();
         flashdata();
      }
      jxdj = 2;
   }
   else if(jxexp >= 1000)
   {
      if(jxdj < 1)
      {
         _root.alertbox("恭喜你荣升少尉");
         upSound.start();
         flashdata();
      }
      jxdj = 1;
   }
   else
   {
      jxdj = 0;
   }
}
function upjw(exps)
{
   jwexp += exps;
   if(exps > 0)
   {
      _root.msgbox("获得" + exps + "点功勋");
   }
   var _loc3_;
   if(jwdj >= 6 || jwexp >= 100000)
   {
      jwdj = 6;
      flashdata();
   }
   else if(jwexp < 1000)
   {
      jwdj = 0;
   }
   else
   {
      _loc3_ = 0;
      while(jwexp >= jwdjexp[jwdj] && jwdjexp[jwdj] != undefined)
      {
         jwdj++;
         flashdata();
         _root.alertbox("恭喜你被授与" + jwname);
         upSound.start();
      }
   }
}
function upgzgx(exps)
{
   gzgxexp += exps;
   if(gzgxexp >= 200)
   {
      if(gzgx < 6)
      {
         _root.alertbox("\r恭喜，你与公主感情关系到了最高级了。\r学会了新技能：爱的力量。");
         gxname = "亲密恋人";
         upSound.start();
         _root.jineng.studyjn(5,2);
         if(gzgx < 4)
         {
            _root.gzgx4 = true;
         }
      }
      gzgx = 6;
   }
   else if(gzgxexp >= 100)
   {
      if(gzgx < 5)
      {
         _root.alertbox("\r恭喜，你与公主感情关系提高到了恋人了。\r学会了新技能：爱的力量。");
         gxname = "恋人";
         upSound.start();
         _root.jineng.studyjn(5,1);
         if(gzgx < 4)
         {
            _root.gzgx4 = true;
         }
      }
      gzgx = 5;
   }
   else if(gzgxexp >= 50)
   {
      if(gzgx < 4)
      {
         _root.alertbox("\r\r\r恭喜，你与公主已经成为知己了。");
         gxname = "知己";
         upSound.start();
         _root.gzgx4 = true;
      }
      gzgx = 4;
   }
   else if(gzgxexp >= 30)
   {
      if(gzgx < 3)
      {
         _root.alertbox("\r\r\r恭喜，你与公主成为好朋友了。");
         gxname = "好朋友";
         upSound.start();
      }
      gzgx = 3;
   }
   else if(gzgxexp >= 10)
   {
      if(gzgx < 2)
      {
         _root.alertbox("\r\r\r恭喜，你与公主交上朋友了。");
         gxname = "普通朋友";
         upSound.start();
      }
      gzgx = 2;
   }
   else if(gzgxexp >= 1)
   {
      if(gzgx < 1)
      {
         _root.alertbox("\r\r\r恭喜，你认识了公主。");
         gxname = "认识";
         upSound.start();
      }
      gzgx = 1;
   }
   else
   {
      gxname = "未认识";
      gzgx = 0;
   }
}
hs1_maxzdl = hs2_maxzdl = 0;
my_maxzdl = 0;
mubiao = _root.renwu;
if(_root.js_name)
{
   names = myname = _root.js_name;
}
else
{
   names = myname = "魔域玩家";
}
tnames.text = myname;
dj = 1;
base_hp = 500;
base_tl = 100;
base_xgj = 45;
base_dgj = 45;
base_fy = 80;
cz_hp = 50;
cz_tl = 10;
cz_xgj = 10;
cz_dgj = 10;
cz_fy = 8;
jxdj = 0;
jwdj = 0;
gzgx = 0;
xy = 50;
jy = 0;
mjy = 10;
gzgxexp = 0;
gzgx = 0;
upgzgx(0);
jxexp = jwexp = 0;
upjx(0);
upjw(0);
var upSound = new Sound();
var growSound = new Sound();
var deathSound = new Sound();
upSound.attachSound("其它升级.wav");
growSound.attachSound("升级.wav");
deathSound.attachSound("deathman.wav");
flashdata();
hp = mhp;
tl = mtl;
var jxdjexp = new Array(1000,2000,3000,8000,13000,18000,26000,34000,44000,54000,100000);
var jwdjexp = new Array(1000,3000,6000,15000,30000,100000);
