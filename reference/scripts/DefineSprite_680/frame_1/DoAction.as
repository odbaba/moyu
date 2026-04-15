function openme(t)
{
   _visible = true;
   if(!t)
   {
      myt.text = "幻化失败";
   }
   else
   {
      myt.text = "——————幻化成功—————\r";
      myt.text += t;
      myt.text += "\r幻兽的转世次数加1　　共转世" + _root.huanhuak.zbb.zs + "次";
   }
}
function closeme()
{
   _X = hide_x;
   _Y = hide_y;
   _visible = false;
   _root.huanhuak.openme();
}
closeme();
onRelease = function()
{
   closeme();
};
