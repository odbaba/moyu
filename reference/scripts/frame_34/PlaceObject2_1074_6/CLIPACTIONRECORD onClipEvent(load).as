onClipEvent(load){
   names = "无名氏";
   dj = _root.xinxi.dj;
   if(dj < 50)
   {
      dj = 50;
   }
   zdl = 100 + dj;
   isBoss = false;
   gotoAndStop("无名氏");
   _visible = false;
}
