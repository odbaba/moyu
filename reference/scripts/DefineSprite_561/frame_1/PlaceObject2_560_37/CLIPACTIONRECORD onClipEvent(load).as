onClipEvent(load){
   function shows(type)
   {
      dj = _parent.zhjj();
      _visible = true;
      switch(type)
      {
         case "天魂套装":
            texts2 = "<font color=\"#0000ff\">天魂套装" + dj + "级\r全身装备都有天魂战魂而产生的神圣力量，使得战斗中所有敌人的战斗力下降" + dj * 2 + "%</font>";
            break;
         case "地魂套装":
            texts2 = "<font color=\"#000000\">地魂套装" + dj + "级\r全身装备都有地魂战魂而产生的神圣力量，使得战斗中所有敌人的生命值减少" + dj * 5 + "%</font>";
      }
      gotoAndStop(type);
   }
   function hides()
   {
      _visible = false;
   }
   _visible = false;
   texts = "";
}
