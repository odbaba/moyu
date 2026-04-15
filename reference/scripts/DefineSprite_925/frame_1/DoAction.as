function chuzheng(dsc)
{
   if(dsc)
   {
      _visible = true;
      point = dsc;
      tname.text = dsc.othername;
      if(point.hp <= 0)
      {
         _root.msgbox("警告：你出征的幻兽是没有生命值的，很容易再次死亡。过了一天之后幻兽的生命值会自动回复。");
      }
      updata();
      gotoAndStop(dsc.hs_name);
   }
   else
   {
      _visible = false;
   }
   _root.zhanchang.show_hs();
   _root.zhuangbei.flashme();
}
function updata()
{
   tdj.text = point.dj + "级";
   thp.text = "生命" + point.hp + "/" + point.mhp + "\n" + "经验" + Math.round(100 * point.jy / point.mjy) + "%";
   shp._xscale = 100 * point.hp / point.mhp;
   sjy._xscale = 100 * point.jy / point.mjy;
}
function getzdl()
{
   if(_visible)
   {
      return (point.pz - point.pz % 100) / 100;
   }
   return 0;
}
function have_exp(exps)
{
   if(_visible)
   {
      point.have_exp(exps);
   }
   updata();
}
function byhit(hit)
{
   if(point.byhit(hit))
   {
      updata();
   }
   else
   {
      updata();
   }
}
_visible = false;
stop();
InOne = false;
