function shows(p)
{
   point = p;
   if(point.dj)
   {
      gotoAndPlay(point.hs_name);
   }
   else
   {
      gotoAndStop(1);
   }
}
stop();
this.onDragOut = function()
{
   if(point.dj)
   {
      _root.dan.doStartDrag(point);
   }
};
this.onLoad = function()
{
   point = null;
};
