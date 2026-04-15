on(release){
   switch(_currentframe)
   {
      case 1:
         if(_parent._parent.chuzhengbb())
         {
            _root.zhanchang.show_hs();
            gotoAndStop(2);
            var sounds = new Sound();
            sounds.attachSound("出征幻兽.wav");
            sounds.start();
         }
         break;
      case 2:
         _parent._parent.zhaohuibb();
         _root.zhanchang.show_hs();
         gotoAndStop(1);
         var sounds = new Sound();
         sounds.attachSound("召回幻兽.wav");
         sounds.start();
   }
}
