function shows(dsc)
{
   t.text = dsc.mytext;
   ddj = _root.xinxi.zdl;
   if(dsc.gwzdl)
   {
      dj = dsc.gwzdl;
   }
   else if(dsc.zdl)
   {
      dj = dsc.zdl;
   }
   else
   {
      dj = dsc.dj;
   }
   if(dj > ddj + 5)
   {
      t.textColor = 3355443;
   }
   else if(dj > ddj)
   {
      t.textColor = 16711680;
   }
   else if(dj == ddj)
   {
      t.textColor = 16777215;
   }
   else
   {
      t.textColor = 39219;
   }
   _X = dsc._x;
   _Y = dsc._y - _height + 15;
   _visible = true;
}
_visible = false;
this.onRollOut = function()
{
   _visible = false;
};
