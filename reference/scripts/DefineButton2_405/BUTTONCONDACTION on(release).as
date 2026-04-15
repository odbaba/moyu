on(release){
   var moyu_so = SharedObject.getLocal("moyusave");
   if(moyu_so.data.versions != _root.versions)
   {
      moyu_so.clear();
   }
   else if(moyu_so.data.saved)
   {
      _root.newgame = false;
      _root.laoddata = true;
      gotoAndStop("读取游戏");
   }
}
