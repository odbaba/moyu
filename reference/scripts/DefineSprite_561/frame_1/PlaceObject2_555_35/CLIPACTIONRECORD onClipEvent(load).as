onClipEvent(load){
   function shows(dj)
   {
      if(dj == 0)
      {
         hides();
         return false;
      }
      _visible = true;
      gotoAndStop(dj);
   }
   function hides()
   {
      _visible = false;
   }
   _visible = false;
   texts = "";
}
