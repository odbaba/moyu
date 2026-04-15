function openme(news)
{
   _X = show_x;
   _Y = show_y;
   _visible = true;
   if(news == true)
   {
      gotoAndStop("版本说明");
   }
}
function closeme()
{
   _X = hide_x;
   _Y = hide_y;
   _visible = false;
   gotoAndStop(1);
}
var show_x = 150;
var show_y = 125;
var hide_x = 800;
var hite_y = 600;
stop();
