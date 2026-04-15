on(release){
   trace(_root.pro2008now);
   _root.pro2008now += 1;
   trace(_root.pro2008now);
   _visible = false;
   switch(random(3))
   {
      case 0:
         id = "999朵白玫瑰";
         break;
      case 1:
         id = "电浆药水";
         break;
      case 2:
         id = "灵魂王";
   }
   _root.rw2008_dlg.openme("　　你找到了五福娃中的" + myname + "。" + myname + "送" + id + "给你。");
   _root.beibao.more(this);
}
