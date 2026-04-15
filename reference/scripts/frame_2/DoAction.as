if(_framesloaded / _totalframes >= 1)
{
   _root.loading.gotoAndStop(100 * _framesloaded / _totalframes);
   gotoAndStop("前言");
   play();
}
else
{
   gotoAndPlay(1);
}
