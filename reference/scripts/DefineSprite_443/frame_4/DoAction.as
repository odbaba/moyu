stop();
if(_root.newgame)
{
   _root.newgame = false;
   var moyu_so = SharedObject.getLocal("moyusave");
   if(moyu_so.data.saved == undefined || moyu_so.data.versions != _root.versions)
   {
      _root.help.openme(true);
   }
   with(_root.xinxi)
   {
      flashdata();
      getgzgx();
      hp = mhp;
      tl = mtl;
   }
   _root.huanshoumb.chuzhengbb(_root.huanshoumb.array[1]);
   _root.czmb1.ToOne.setInOne(true);
   dj = 1;
   pz = 0;
   dong = 0;
   dong1 = "";
   dong2 = "";
   mhdj = random(12);
   id = "手镯";
   _root.beibao.more(this);
   id = "头盔";
   _root.beibao.more(this);
   id = "项链";
   _root.beibao.more(this);
   id = "战鞋";
   _root.beibao.more(this);
   _root.beibao.subms(280);
   _root.beibao.subjb(100000);
   id = "魔魂晶石";
   _root.beibao.more(this);
   id = "幻魔晶石";
   _root.beibao.more(this);
   id = "灵魂晶石";
   _root.beibao.more(this);
   number = 10;
   id = "果子";
   _root.beibao.more(this);
   id = "体力药";
   _root.beibao.more(this);
}
