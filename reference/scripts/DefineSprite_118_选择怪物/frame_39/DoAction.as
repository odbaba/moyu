stop();
var zdl = 2000;
var dj = 2000;
var chp = 500;
var cxgj = 50;
var cdgj = 100;
var cfy = 20;
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
