function openme(str)
{
   if(msgstr[msgstr.length - 1] == str)
   {
      return false;
   }
   msgstr.push(str);
   if(!_visible)
   {
      msgtext.text = msgstr.shift();
   }
   _X = show_x;
   _Y = show_y;
   _visible = true;
   _alpha = 75;
}
function closeme()
{
   if(msgstr.length <= 0)
   {
      _X = hide_x;
      _Y = hide_y;
      _visible = false;
   }
   else
   {
      msgtext.text = msgstr.shift();
   }
}
var msgstr = new Array();
var show_x = 240;
var show_y = 185;
var hide_x = 800;
var hite_y = 600;
stop();
closeme();
this.onRelease = function()
{
   closeme();
};
this.onRollOver = function()
{
   _alpha = 95;
};
this.onRollOut = function()
{
   _alpha = 75;
};
this.onDragOut = function()
{
   _alpha = 75;
};
