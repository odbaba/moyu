function setcheck(val)
{
   checking = val;
   if(checking)
   {
      gotoAndStop("check");
   }
   else
   {
      gotoAndStop("uncheck");
   }
}
function getcheck()
{
   return checking;
}
stop();
this.onLoad = function()
{
   var _loc1_ = false;
};
this.onRelease = function()
{
   setcheck(!getcheck());
};
