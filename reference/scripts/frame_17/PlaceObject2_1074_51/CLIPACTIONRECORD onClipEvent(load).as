onClipEvent(load){
   names = "30级BOSS";
   dj = 30;
   isBoss = true;
   gotoAndStop("BOSS");
   _visible = _root.boss30;
   mb_visible = "boss30";
   if(_visible)
   {
      var boss_sound = new Sound();
      boss_sound.attachSound("见到BOSS.wav");
      boss_sound.start();
   }
}
