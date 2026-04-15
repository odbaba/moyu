function openme(info, size)
{
   _X = show_x;
   _Y = show_y;
   _visible = true;
   if(info == true)
   {
      _root.havesaved = true;
      msg.text = "保存完成\r保存了";
      if(size / 1024 >= 1)
      {
         msg.text += Math.floor(size / 1024) + 1 + "KB";
      }
      else
      {
         msg.text += size + "B";
      }
      msg.text += "数据";
   }
   else if(info == false)
   {
      msg.text = "保存失败\r请点右键设置你的播放器。";
   }
   else
   {
      msg.text = "保存结果未知\r请再保存一次";
   }
}
function closeme()
{
   _X = hide_x;
   _Y = hide_y;
   _visible = false;
}
var show_x = 250;
var show_y = 200;
var hide_x = 800;
var hite_y = 600;
closeme();
