on(release){
   _root.CloseAll();
   _root.cangku.openme();
   _root.beibao.openme();
   if(!isopen)
   {
   }
   var over_sound = new Sound();
   over_sound.attachSound("选择NPC.wav");
   over_sound.start();
}
