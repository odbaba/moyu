onClipEvent(load){
   names = "20级BOSS";
   dj = 20;
   isBoss = true;
   gotoAndStop("BOSS");
   _visible = _root.boss20;
   mb_visible = "boss20";
   if(_visible)
   {
      var boss_sound = new Sound();
      boss_sound.attachSound("见到BOSS.wav");
      boss_sound.start();
   }
}
