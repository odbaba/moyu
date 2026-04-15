function doStartDrag(bb)
{
   if(bb == undefined)
   {
      return false;
   }
   movebb = bb;
   _visible = true;
   startDrag(this,1);
}
function doAfterDrag()
{
   stopDrag();
   if(movebb == null)
   {
      return false;
   }
   if(this.hitTest(_root.huanhuak.fbaokou))
   {
      _root.huanhuak.setfbb(movebb);
   }
   else if(this.hitTest(_root.huanhuak.zbaokou))
   {
      _root.huanhuak.setzbb(movebb);
   }
   else if(this.hitTest(_root.usejy.baokou))
   {
      _root.usejy.setbb(movebb);
   }
   else if(this.hitTest(_root.huanshougeiyu.baokou))
   {
      _root.huanshougeiyu.setbb(movebb);
   }
   _visible = false;
   movebb = null;
}
this.onLoad = function()
{
   movebb = null;
};
this.onRelease = function()
{
   doAfterDrag();
};
this.onDragOut = function()
{
   doAfterDrag();
};
