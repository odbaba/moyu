function openme(str)
{
   if(str != "")
   {
      words.text = str;
      _visible = true;
   }
   else
   {
      _visible = false;
   }
}
stop();
onRollOver = function()
{
   gotoAndStop(2);
};
onRollOut = function()
{
   gotoAndStop(1);
};
onDragOut = function()
{
   gotoAndStop(1);
};
