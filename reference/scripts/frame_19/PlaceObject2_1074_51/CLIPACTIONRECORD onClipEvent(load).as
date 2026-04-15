onClipEvent(load){
   names = "70级BOSS";
   dj = 70;
   isBoss = true;
   gotoAndStop("BOSS");
   _visible = _root.boss70;
   mb_visible = "boss70";
   if(_visible)
   {
      var boss_sound = new Sound();
      boss_sound.attachSound("见到BOSS.wav");
      boss_sound.start();
   }
}
