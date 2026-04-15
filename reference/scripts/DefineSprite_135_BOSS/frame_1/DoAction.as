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
function getgw(gwname)
{
   names = gwname;
   isNormalBoss = false;
   switch(gwname)
   {
      case "10级BOSS":
         isNormalBoss = true;
         setprop(10,10,0,0,0,0,200 * (5 + random(1)),22.5,22.5,30);
         return;
      case "20级BOSS":
         isNormalBoss = true;
         setprop(30,20,0,0,0,0,200 * (5 + random(6)),37.5,45,30);
         return;
      case "30级BOSS":
         isNormalBoss = true;
         setprop(45,30,0,0,0,0,250 * (5 + random(6)),52.5,82.5,49.5);
         return;
      case "50级BOSS":
         setprop(75,50,0,0,0,0,250 * (5 + random(6)),52.5,82.5,49.5);
         return;
      case "70级BOSS":
         isNormalBoss = true;
         setprop(105,70,0,0,0,0,300 * (5 + random(6)),75,132,67.5);
         return;
      case "90级BOSS":
         isNormalBoss = true;
         setprop(135,90,0,0,0,0,300 * (5 + random(6)),75,132,67.5);
         return;
      case "100级BOSS":
      default:
         isNormalBoss = true;
         setprop(150,100,0,0,0,0,400 * (5 + random(6)),112.5,168,96);
         return;
      case "雷鸣大陆挑战者":
         setprop(120,50,0,0,0,0,400 * (5 + random(11)),112.5,168,96);
         return;
      case "戈壁挑战者":
         setprop(140,80,0,0,0,0,400 * (5 + random(11)),112.5,168,96);
         return;
      case "迷梦沼泽挑战者":
         setprop(160,100,0,0,0,0,400 * (5 + random(11)),112.5,168,96);
         return;
      case "冰宫挑战者":
         setprop(200,120,0,0,0,0,400 * (5 + random(11)),112.5,168,96);
         return;
      case "亚维特岛挑战者":
         setprop(240,120,0,0,0,0,400 * (5 + random(11)),112.5,168,96);
         return;
      case "火山挑战者":
         setprop(300,130,0,0,0,0,400 * (5 + random(11)),112.5,168,96);
         return;
      case "深渊迷宫挑战者":
         setprop(400,130,0,0,0,0,400 * (5 + random(11)),112.5,168,96);
         return;
      case "卡萨诺城挑战者":
         setprop(500,150,0,0,0,0,400 * (5 + random(11)),112.5,168,96);
         return;
      case "60级PK赛BOSS":
         setprop(201,60,0,0,0,0,2000,112.5,168,96);
         return;
      case "100级PK赛BOSS":
         setprop(284,100,0,0,0,0,2000,112.5,168,96);
         return;
      case "130级PK赛BOSS":
         setprop(374,130,0,0,0,0,2000,112.5,168,96);
         return;
   }
}
function upxx()
{
   shp._xscale = 100 * hp / mhp;
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
      if(names == "雷鸣大陆挑战者" || names == "戈壁挑战者" || names == "迷梦沼泽挑战者" || names == "冰宫挑战者" || names == "亚维特岛挑战者" || names == "火山挑战者" || names == "深渊迷宫挑战者" || names == "卡萨诺城挑战者")
      {
         _root.owermap = _root.nowmap;
      }
      _root.creatething.gwname = names;
      _root.creatething.isNormalBoss = isNormalBoss;
      _root.creatething.dj = dj;
      _root.creatething.drop2();
      _root.xinxi.have_exp(Math.round(mhp / 5));
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
stop();
_parent.getroom(this);
gotoAndStop("站立");
play();
hithp = 0;
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
