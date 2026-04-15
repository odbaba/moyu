function updata(str)
{
   mapname.text = "当前地图\r" + _root.nowmap;
   if(str)
   {
      mapname.text += "\r下一地图\r" + str;
   }
}
stop();
this.onRelease = function()
{
   _root.bigmap._visible = !_root.bigmap._visible;
};
this.onRollOver = function()
{
   gotoAndStop(2);
};
this.onRollOut = function()
{
   gotoAndStop(1);
};
this.onDragOut = function()
{
   gotoAndStop(1);
};
updata("");
