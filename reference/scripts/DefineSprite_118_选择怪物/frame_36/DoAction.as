stop();
var zdl = 900;
var dj = 900;
var chp = 300;
var cxgj = 30;
var cdgj = 60;
var cfy = 25;
if(_root.mj_tt == true)
{
   zdl *= 1.5;
}
if(_root.mj_gj == true)
{
   cxgj *= 1.5;
   cdgj *= 1.5;
}
if(_root.mj_fy == true)
{
   cfy *= 1.5;
}
if(_root.mj_sm == true)
{
   chp *= 1.5;
}
_parent._parent.setprop(zdl,dj,0,0,0,0,chp,cxgj,cdgj,cfy);
