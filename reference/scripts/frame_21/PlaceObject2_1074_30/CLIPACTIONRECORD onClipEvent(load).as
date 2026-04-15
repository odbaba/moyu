onClipEvent(load){
   names = "100级BOSS";
   dj = 100;
   isBoss = true;
   gotoAndStop("BOSS");
   _visible = _root.boss100;
   mb_visible = "boss100";
   if(_visible)
   {
      var boss_sound = new Sound();
      boss_sound.attachSound("见到BOSS.wav");
      boss_sound.start();
   }
}
