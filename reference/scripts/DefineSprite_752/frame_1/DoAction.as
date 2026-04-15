function shows(dsc)
{
   if(!dsc.dj)
   {
      _visible = false;
      return false;
   }
   _visible = true;
   point = dsc;
   pz = dsc.pz / 100;
   if(dsc.chuzheng)
   {
      cz = "(已出征)";
   }
   else
   {
      cz = "";
   }
   if(dsc.pz >= 100)
   {
      tpz = "极品" + dsc.pz / 100 + "星";
   }
   else if(dsc.pz >= 75)
   {
      tpz = "万众瞩目";
   }
   else if(dsc.pz >= 50)
   {
      tpz = "千载难逢";
   }
   else if(dsc.pz >= 25)
   {
      tpz = "百里挑一";
   }
   else if(dsc.pz >= 10)
   {
      tpz = "优秀";
   }
   else
   {
      tpz = "普通";
   }
   t.text = dsc.othername + "\n" + "等级: " + dsc.dj + cz + "\n" + "品质: " + tpz;
   gotoAndStop(dsc.hs_name);
}
stop();
focusbox._visible = false;
point = null;
onRelease = function()
{
   if(_parent.focus == this.point && this.point.dj)
   {
      _parent.movedan();
   }
   else if(point.dj)
   {
      _parent.setfocus(this);
   }
   else
   {
      _visible = false;
      _parent.setfocus();
   }
};
onDragOut = function()
{
   _parent.setfocus(this);
   _parent.movedan();
};
