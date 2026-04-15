function setbb(zb)
{
   if(!zb)
   {
      return false;
   }
   point = zb;
   updata();
   return true;
}
function updata()
{
   showbb.shows(point);
}
function sell()
{
   if(point.chuzheng)
   {
      _root.alertbox("\r呵呵，请先召回幻兽！");
      return false;
   }
   if(point != null && mb.givebb(point.hs_name,point.pz))
   {
      _root.huanshoumb.getbb(point);
      point = null;
      updata();
      _root.msgbox("给与幻兽成功");
   }
   closeme();
}
function openme(dsc)
{
   _X = show_x;
   _Y = show_y;
   _visible = true;
   point = null;
   mb = dsc;
   updata();
}
function closeme()
{
   _X = hide_x;
   _Y = hide_y;
   _visible = false;
   point = null;
   mb = null;
}
show_x = 453;
show_y = 127;
hide_x = 800;
hite_y = 600;
mb = null;
closeme();
