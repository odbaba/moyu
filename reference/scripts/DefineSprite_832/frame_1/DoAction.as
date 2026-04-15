function openme(str)
{
   _X = show_x;
   _Y = show_y;
   msg.text = str;
   _visible = true;
}
function closeme()
{
   _X = hide_x;
   _Y = hide_y;
   _visible = false;
}
var show_x = 270;
var show_y = 220;
var hide_x = 800;
var hite_y = 600;
closeme();
