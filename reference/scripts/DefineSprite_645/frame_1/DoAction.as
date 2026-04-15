function buy()
{
   if(_root.beibao.subms(- price_ms))
   {
      id = thing;
      if(id == "幻兽")
      {
         huanshou.flashme();
         if(!_root.huanshoumb.givebb(huanshou))
         {
            _root.alertbox("\r\r你的幻兽背包已经满了，放不下更多幻兽了");
            _root.beibao.subms(price_ms);
            return false;
         }
      }
      else if(!_root.beibao.more(this))
      {
         noroom._visible = true;
         _root.beibao.subms(price_ms);
      }
   }
   else
   {
      nomoney._visible = true;
   }
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
   _root.huanshoumb.closeme();
}
huanshou = null;
thing = "";
price_jb = 0;
price_ms = 0;
show_x = 285;
show_y = 90;
hide_x = 800;
hite_y = 600;
closeme();
