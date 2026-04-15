function shanghai()
{
   return _root.xinxi.shanghai();
}
function setshanghai()
{
   var _loc2_ = this.getNextHighestDepth();
   attachMovie("伤害显示","sh" + _loc2_,_loc2_);
   this["sh" + _loc2_]._x = -80;
   this["sh" + _loc2_]._y = -140;
}
stop();
this.onMouseMove = function()
{
   var _loc5_;
   var _loc4_;
   if(!pking)
   {
      _loc5_ = Math.abs(_parent._xmouse - this._x);
      _loc4_ = Math.abs(_parent._ymouse - this._y);
      if(_loc5_ >= _loc4_)
      {
         if(_parent._xmouse <= this._x)
         {
            if(_root.danger)
            {
               gotoAndStop("向左走");
            }
            else
            {
               gotoAndStop("向左");
            }
         }
         else if(_root.danger)
         {
            gotoAndStop("向右走");
         }
         else
         {
            gotoAndStop("向右");
         }
      }
      else if(_parent._ymouse <= this._y)
      {
         if(_root.danger)
         {
            gotoAndStop("向上走");
         }
         else
         {
            gotoAndStop("向上");
         }
      }
      else if(_root.danger)
      {
         gotoAndStop("向下走");
      }
      else
      {
         gotoAndStop("向下");
      }
   }
};
