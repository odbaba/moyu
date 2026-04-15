stop();
this.onRollOut = function()
{
   _root.minmap.updata();
   gotoAndStop(1);
};
this.onDragOut = function()
{
   gotoAndStop(1);
   _root.minmap.updata();
};
this.onRollOver = function()
{
   _root.minmap.updata(map);
   gotoAndStop(2);
};
this.onPress = function()
{
   var _loc1_ = new Sound();
   _loc1_.attachSound("切换地图.wav");
   _loc1_.start();
   gotoAndStop(3);
};
this.onRelease = function()
{
   if(_root.nowmap == "皇宫" && map == "后花园")
   {
      if(_root.xinxi.jwdj <= 0)
      {
         _root.alertbox("\r\r只有爵位达到勋爵以上才可以进入后花园");
         return false;
      }
   }
   if(_root.nowmap == "卡萨诺城" && map == "亚维特岛")
   {
      if(_root.xinxi.dj < 70)
      {
         _root.alertbox("\r\r亚维特岛是个十分危险的地方，70级以上才允许从卡萨诺城进入亚维特岛");
         return false;
      }
   }
   if(_root.nowmap == "冰宫" && map == "雪域边境")
   {
      if(_root.mc_day.nowday % 7 != 5 && _root.king == false)
      {
         _root.alertbox("\r\r该地方十分危险，你没有有任务不能进入雪域边境");
         return false;
      }
   }
   if(_root.nowmap == "地下城1层" && map == "地下城2层")
   {
      if(_root.rw_gw1_1 || _root.rw_gw1_2 || _root.rw_gw1_3)
      {
         _root.alertbox("\r\r只有消灭完怪物后才能进入下一层");
         return false;
      }
   }
   if(_root.nowmap == "地下城2层" && map == "地下城3层")
   {
      if(_root.rw_gw2_1 || _root.rw_gw2_2)
      {
         _root.alertbox("\r\r只有消灭完怪物后才能进入下一层");
         return false;
      }
   }
   if(_root.nowmap == "魔军帅旗" && map == "能量塔禁地")
   {
      if(_root.mj_zs == true)
      {
         _root.alertbox("\r\r魔军主帅在此守护，无法进入魔军能量塔禁地");
         return false;
      }
   }
   if(_root.nextmap)
   {
      _root.nowmap = map;
      _root.minmap.updata();
      _root.talk.closeme();
      _root.CloseAll();
      _root.gotoAndStop(map);
   }
   gotoAndStop(2);
};
