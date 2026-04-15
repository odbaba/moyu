stop();
var i = 0;
while(i < gwnum)
{
   if(array[i])
   {
      removeMovieClip(array[i]);
   }
   i++;
}
isBoss = false;
wanjia.pkover();
_root.mc_day.times_go(3);
_visible = false;
_root.returnmap();
