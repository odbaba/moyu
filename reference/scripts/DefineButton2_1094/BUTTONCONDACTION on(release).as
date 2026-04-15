on(release){
   pz = random(10) + 1;
   if(random(200) > 100)
   {
      id = "金矿";
   }
   else
   {
      id = "银矿";
   }
   _root.beibao.more(this);
   str = "获得了品质是" + pz;
   str += "的" + id;
   _root.msgbox(str);
   _root.mc_day.times_go(1);
}
