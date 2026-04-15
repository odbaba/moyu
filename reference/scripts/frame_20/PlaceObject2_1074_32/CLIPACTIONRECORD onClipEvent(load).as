onClipEvent(load){
   names = "90级BOSS";
   dj = 90;
   isBoss = true;
   gotoAndStop("BOSS");
   _visible = _root.boss90;
   mb_visible = "boss90";
   if(_visible)
   {
      var boss_sound = new Sound();
      boss_sound.attachSound("见到BOSS.wav");
      boss_sound.start();
   }
}
