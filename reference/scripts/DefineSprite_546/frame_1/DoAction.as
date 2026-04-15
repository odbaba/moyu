function shows(flag)
{
   _visible = flag;
}
function showtext()
{
   info = "　　　　战斗力详细评定\r　条件　　　　战斗力加成\r";
   info += "人物等级" + _root.xinxi.dj + "     +" + _root.xinxi.dj + "\n";
   info += "出征幻兽 　　　 +" + _root.xinxi.hs1zdl + "\n";
   info += "出征幻兽 　　　 +" + _root.xinxi.hs2zdl + "\n";
   info += "合身装备　" + _root.xinxi.fixzdl + "件 　+" + _root.xinxi.fixzdl + "\n";
   info += "装备品质　　　　+" + _root.xinxi.zbpzzdl + "\n";
   info += "魔魂等级　　　　+" + _root.xinxi.mhdjzdl + "\n";
   info += "装备洞数　　　　+" + _root.xinxi.dongzdl + "\n";
   info += "战斗力石　　　　+" + _root.xinxi.bszdl + "\n";
   info += "高级宝石　" + _root.xinxi.bestbszdl + "个　+" + _root.xinxi.bestbszdl + "\n";
   info += "军衔　　" + _root.xinxi.jxname + "　　+" + _root.xinxi.jxzdl + "\n";
   info += "爵位　　" + _root.xinxi.jwname + "　　+" + _root.xinxi.jwzdl + "\n";
   info += "技能　　　　　　+" + _root.xinxi.jnzdl + "\n";
   if(_root.xinxi.zhzdl > 0)
   {
      info += _parent.zhjj() + "级战魂套装 　　" + _root.xinxi.zhzdl + "战斗力" + "\n";
   }
   info += "总共战斗力　　　" + _root.xinxi.zdl + "战斗力" + "\n";
}
_visible = false;
onRelease = function()
{
   shows(false);
};
