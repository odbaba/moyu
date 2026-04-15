onClipEvent(load){
   names = "50级BOSS";
   dj = 50;
   isBoss = true;
   gotoAndStop("BOSS");
   _visible = _root.boss50;
   mb_visible = "boss50";
   if(_visible)
   {
      var boss_sound = new Sound();
      boss_sound.attachSound("见到BOSS.wav");
      boss_sound.start();
   }
}
