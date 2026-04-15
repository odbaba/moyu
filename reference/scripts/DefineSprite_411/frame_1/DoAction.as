function openme()
{
   count = 0;
   _visible = true;
}
function closeme()
{
   _visible = false;
}
closeme();
this.onEnterFrame = function()
{
   if(_visible)
   {
      count++;
      second.text = Math.round(count / 12);
      if(count >= 180)
      {
         closeme();
         _root.loadfail.openme();
         if(_root.nowmap)
         {
            _root.gotoAndStop(_root.nowmap);
         }
         else
         {
            _root.newgame = true;
            _root.creatething.gotoAndPlay(1);
            _root.gotoAndStop("开始");
         }
      }
   }
};
