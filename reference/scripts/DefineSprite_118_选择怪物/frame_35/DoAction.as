stop();
var zdl = 1000;
var dj = 1000;
var chp = 300;
var cxgj = 30;
var cdgj = 50;
var cfy = 30;
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
