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
   if(point.dj)
   {
      showbb.shows(point);
      tdy.text = "使用立即升到50级以上";
   }
   else
   {
      showbb.gotoAndStop(1);
      tdy.text = "";
   }
}
function use()
{
   if(point == null || !point.dj)
   {
      _root.alertbox("\r\r请放入要使用经验球的幻兽。");
      return false;
   }
   if(_root.beibao.usethings("满经验球",-1))
   {
      point.have_exp(27000);
      _root.huanshoumb.updata();
   }
   else
   {
      _root.alertbox("\r\r\r你没有满的经验球了");
   }
}
function manuse()
{
   if(_root.manexpball > 0)
   {
      if(_root.beibao.usethings("满经验球",-1))
      {
         _root.xinxi.have_exp_only(2700);
         _root.manexpball = _root.manexpball - 1;
      }
      else
      {
         _root.alertbox("\r\r\r你没有满的经验球了");
      }
   }
   else
   {
      _root.alertbox("\r\r\r人物今天已经使用过5个经验球了，明天再用吧。");
      this.check1.setcheck(false);
      use();
   }
}
function openme()
{
   _X = show_x;
   _Y = show_y;
   _visible = true;
   _root.huanshoumb.opens();
   point = null;
   this.check1.setcheck(false);
   updata();
}
function closeme()
{
   _X = hide_x;
   _Y = hide_y;
   _visible = false;
}
var show_x = 220;
var show_y = 300;
var hide_x = 800;
var hite_y = 600;
closeme();
