function toshow(dsc)
{
   texts.text = "";
   texts2.htmlText = "";
   point = dsc;
   _visible = true;
   if(dsc.useit)
   {
      usebutton._visible = true;
   }
   if(dsc.texts != undefined)
   {
      texts.text = dsc.texts;
   }
   if(dsc.texts2 != undefined)
   {
      texts2.htmlText = dsc.texts2;
   }
   if(!dsc.myid)
   {
      _X = _root._xmouse + 5;
      _Y = _root._ymouse + 5;
      return true;
   }
   dx = dsc._x + dsc._parent._x + dsc._width - 8;
   dy = dsc._y + dsc._parent._y + dsc._width - 8;
   if(dx + _width > 700)
   {
      dx -= _width + 16;
   }
   if(dy + _height > 550)
   {
      dy -= _height + 16;
   }
   _X = dx;
   _Y = dy;
}
function tohide()
{
   _visible = false;
   usebutton._visible = false;
}
_visible = false;
usebutton._visible = false;
texts.text = "";
texts.textColor = 16777215;
texts2.htmlText = "";
point = null;
onRollOver = function()
{
   if(point.useit)
   {
      usebutton._visible = true;
      _visible = true;
   }
   else
   {
      _visible = false;
   }
};
onRollOut = function()
{
   tohide();
};
onRelease = function()
{
   if(point.useit)
   {
      point.useitem();
   }
   _visible = false;
};
stop();
