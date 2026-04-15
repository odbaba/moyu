onClipEvent(load){
   names = "10级BOSS";
   dj = 10;
   isBoss = true;
   gotoAndStop("BOSS");
   _visible = _root.boss10;
   mb_visible = "boss10";
   if(_visible)
   {
      var boss_sound = new Sound();
      boss_sound.attachSound("见到BOSS.wav");
      boss_sound.start();
   }
}
