function openme(str)
{
   _X = show_x;
   _Y = show_y;
   _visible = true;
   txt.text = str;
}
function closeme()
{
   _X = hide_x;
   _Y = hide_y;
   _visible = false;
   if(_root.king == true)
   {
      _root.gotoAndStop("皇宫");
   }
}
show_x = 220;
show_y = 150;
hide_x = 800;
hite_y = 600;
closeme();
stop();
