stop();
_alpha = 60;
onRollOver = function()
{
   if(msgtext.text != "")
   {
      gotoAndStop(2);
   }
};
onRollOut = function()
{
   gotoAndStop(1);
};
onPress = function()
{
   gotoAndStop(1);
   msgtext.text = "";
};
