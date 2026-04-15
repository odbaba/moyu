// ============================================================
// DefineSprite_124_怪物对象/frame_1/DoAction.as - 怪物对象
// ============================================================
// 功能说明：
// 本文件是怪物对象的核心，管理怪物的属性、战斗、伤害显示等功能
// 主要功能：
// 1. 怪物属性初始化
// 2. 怪物战斗行为
// 3. 怪物死亡处理
// 4. BOSS特殊处理
// ============================================================

function getgw(gwname)
{
   names = gwname;
   gw.newgw.gotoAndPlay(gwname);
}
function upxx()
{
   shp._xscale = 100 * hp / mhp;
}
function setprop(zdl, gwdj, base_hp, base_xgj, base_dgj, base_fy, cz_hp, cz_xgj, cz_dgj, cz_fy)
{
   gwzdl = zdl;
   dj = gwdj;
   mhp = base_hp + cz_hp * dj;
   hp = base_hp + cz_hp * dj;
   xgj = base_xgj + cz_xgj * dj;
   dgj = base_dgj + cz_dgj * dj;
   fy = base_fy + cz_fy * dj;
   if(_root.zhuangbei.zhth() == 1)
   {
      gwzdl = Math.round(gwzdl * (1 - _root.zhuangbei.zhjj() * 0.02));
   }
   else if(_root.zhuangbei.zhdh() == 1)
   {
      hp = Math.round(mhp * (1 - _root.zhuangbei.zhjj() * 0.05));
   }
   upxx();
}
function hitsb(dsc)
{
   hit = xgj + random(dgj - xgj + 1);
   dsc.byhit(hit,gwzdl);
}
function byhit(hit, it_zdl, heavy)
{
   var _loc6_;
   if(it_zdl > gwzdl)
   {
      _loc6_ = it_zdl - gwzdl <= 50 ? it_zdl - gwzdl : 50;
      hit += _loc6_ * 0.05 * hit;
   }
   else if(it_zdl < gwzdl)
   {
      _loc6_ = gwzdl - it_zdl <= 50 ? gwzdl - it_zdl : 50;
      hit -= _loc6_ * 0.01 * hit;
   }
   if(heavy != true)
   {
      hit -= fy;
   }
   hit = Math.round(hit);
   if(hit < 0)
   {
      hit = 1;
   }
   hithp = - hit;
   setshanghai();
   hp -= hit;
   if(hp <= 0)
   {
      if(_name == "gw0")
      {
         _root.creatething.gwname = names;
         _root.creatething.dj = dj;
         _root.creatething.drop1();
         if(names == "魔军图腾兽" || names == "魔军神秘部队" || names == "魔军守卫部队" || names == "魔军突击队" || names == "魔军主帅")
         {
         }
      }
      if(dj <= 200)
      {
         _root.xinxi.have_exp(mhp);
      }
      _parent.freeroom(this);
   }
   else
   {
      upxx();
   }
}
function shanghai()
{
   return hithp;
}
function setshanghai()
{
   var _loc2_ = this.getNextHighestDepth();
   attachMovie("伤害显示","sh" + _loc2_,_loc2_);
}
_parent.getroom(this);
gotoAndStop("站立");
play();
var gwzdl = 0;
var dj = 0;
var hp = 0;
var mhp = 0;
var xgj = 0;
var dgj = 0;
var fy = 0;
this.onRollOver = function()
{
   mytext = names + "(" + dj + "级) " + "\n" + gwzdl + "战斗力" + "\n" + "经验增加" + Math.round(_root.xinxi.more_exp * 100) + "%";
   _root.tsxs.shows(this);
};
this.onRollOut = function()
{
   _root.tsxs._visible = false;
};
this.onDragOut = function()
{
   _root.tsxs._visible = false;
};
