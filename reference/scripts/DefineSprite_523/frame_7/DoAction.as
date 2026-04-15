array = new Array("风斩","裂地爆斩","星魔剑","飞天连斩");
jnname.text = "";
i = 0;
while(i < _root.jineng.jns)
{
   if(_root.jineng.getjn(i) > 0)
   {
      this["jn" + i]._visible = true;
      if(_root.jineng.getjn(i) > 1)
      {
         jnname.text += "高级";
      }
      jnname.text += array[i];
   }
   else
   {
      this["jn" + i]._visible = false;
   }
   jnname.text += "\n";
   i++;
}
