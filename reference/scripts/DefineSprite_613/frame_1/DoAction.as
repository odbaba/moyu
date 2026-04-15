function newbb(newpz)
{
   flashme(newpz);
   _root.huanshoumb.givebb(this);
}
function flashme(newpz)
{
   zs = 0;
   hs_name = othername = "攻防型";
   dj = 1;
   cxgj = random(5) + 10;
   cdgj = random(30 - cxgj) + cxgj;
   cfy = random(5) + 5;
   chp = random(15) + 20;
   cz_xgj = 8 + random(4);
   cz_dgj = random(17 - cz_xgj) + cz_xgj;
   cz_fy = 1 + random(6);
   cz_hp = 30 + random(12);
   switch(random(8))
   {
      case 0:
         cxgj = random(100);
         break;
      case 1:
         cdgj = random(100 - cxgj) + cxgj;
         break;
      case 2:
         cfy = random(100);
         break;
      case 3:
         chp = random(291);
         break;
      case 4:
         cz_xgj = random(21);
         if(cz_dgj < cz_xgj)
         {
            cz_dgj = cz_xgj;
         }
         break;
      case 5:
         cz_dgj = random(26 - cz_xgj) + cz_xgj;
         break;
      case 6:
         cz_fy = random(16);
         break;
      case 7:
         cz_hp = random(41);
   }
   var _temp_1 = "mhp";
   var _loc0_;
   hp = _loc0_ = cz_hp * (dj - 1) + chp;
   set(_temp_1,_loc0_);
   dgj = cz_dgj * (dj - 1) + cdgj;
   xgj = cz_xgj * (dj - 1) + cxgj;
   fy = cz_fy * (dj - 1) + cfy;
   mjy = 10;
   jy = 0;
   pzbase = 0;
   pz_chp = 0;
   pz_cxgj = 0;
   pz_cdgj = 0;
   pz_cfy = 0;
   _root.pfc(this);
   pz_cz_hp = 0;
   pz_cz_xgj = 0;
   pz_cz_dgj = 0;
   pz_cz_fy = 0;
   _root.pfhp(this);
   _root.pfxgj(this);
   _root.pfdgj(this);
   _root.pffy(this);
   pz = pzbase + pz_chp + pz_cxgj + pz_cdgj + pz_cfy + pz_cz_hp + pz_cz_xgj + pz_cz_dgj + pz_cz_fy;
   if(newpz)
   {
      pz += newpz;
   }
}
