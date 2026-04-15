function newbb()
{
   flashme();
   _root.huanshoumb.givebb(this);
}
function flashme()
{
   zs = 0;
   othername = hs_name = "年猪";
   dj = 1;
   cxgj = 88;
   cdgj = 88;
   cfy = 88;
   chp = 188;
   cz_xgj = 8 + random(4);
   cz_dgj = random(17 - cz_xgj) + cz_xgj;
   cz_fy = 1 + random(6);
   cz_hp = 30 + random(12);
   mhp = hp = cz_hp * (dj - 1) + chp;
   dgj = cz_dgj * (dj - 1) + cdgj;
   xgj = cz_xgj * (dj - 1) + cxgj;
   fy = cz_fy * (dj - 1) + cfy;
   mjy = 10;
   jy = 0;
   pzbase = 380;
   pz_chp = 0;
   pz_cxgj = 0;
   pz_cdgj = 0;
   pz_cfy = 0;
   _root.pfhp(this);
   _root.pfxgj(this);
   _root.pfdgj(this);
   _root.pffy(this);
   pz = pzbase + pz_chp + pz_cxgj + pz_cdgj + pz_cfy + pz_cz_hp + pz_cz_xgj + pz_cz_dgj + pz_cz_fy;
}
