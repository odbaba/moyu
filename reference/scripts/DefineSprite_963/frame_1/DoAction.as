function startmusic()
{
   BackSound.start();
}
function stopmusic()
{
   BackSound.stop();
}
BackSound = new Sound();
BackSound.attachSound("back.mp3");
BackSound.setVolume(10);
startmusic();
stop();
BackSound.onSoundComplete = function()
{
   BackSound.start(0);
};
this.onRelease = function()
{
   if(_currentframe == 1)
   {
      gotoAndStop(2);
   }
   else
   {
      gotoAndStop(1);
   }
};
