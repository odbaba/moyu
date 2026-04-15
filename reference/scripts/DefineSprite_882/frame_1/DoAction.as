function answer(n, str)
{
   this["answer" + n].openme(str);
}
function words(str, face_name)
{
   npcwords.text = str;
   if(face_name)
   {
      faces.gotoAndStop(face_name);
   }
}
function openme(dsc)
{
   closeme();
   _X = show_x;
   _Y = show_y;
   _visible = true;
   mb = dsc;
   sounds.start();
}
function closeme()
{
   _X = hide_x;
   _Y = hide_y;
   _visible = false;
   i = 1;
   while(i <= 6)
   {
      this["answer" + i]._visible = false;
      i++;
   }
}
var show_x = 200;
var show_y = 80;
var hide_x = 800;
var hite_y = 600;
var sounds = new Sound();
sounds.attachSound("NPC对话框.wav");
closeme();
