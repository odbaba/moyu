function callme(dsc)
{
   if(dsc)
   {
      dr = dsc;
      tempbb.shows(dsc);
      _visible = true;
   }
}
dr = null;
tempbb.enabled = false;
yes.onRelease = function()
{
   _parent.getbb(dr);
   _visible = false;
};
no.onRelease = function()
{
   _visible = false;
};
