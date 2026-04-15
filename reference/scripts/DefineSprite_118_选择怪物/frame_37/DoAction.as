stop();
var zdl = 800;
var dj = 800;
var chp = 600;
var cxgj = 20;
var cdgj = 50;
var cfy = 35;
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
