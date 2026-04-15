on(release){
   _root.CloseAll();
   _root.jiahuoshang.openme();
   _root.beibao.openme();
   var over_sound = new Sound();
   over_sound.attachSound("选择NPC.wav");
   over_sound.start();
}
