function reset()
{
   nowday = 1;
   onedaytime = 15;
   nowtime = 0;
}
function times_go(t)
{
   nowtime += t;
   if(nowtime >= onedaytime)
   {
      days_go(1);
   }
   upxx();
}
function days_go(d)
{
   nowday += d;
   nowtime = 0;
   upxx();
   _root.nextday();
}
function upxx()
{
   t_nowtime.text = onedaytime - nowtime;
   daytime._xscale = 100 * (onedaytime - nowtime) / onedaytime;
   t_nowday.text = "第" + nowday + "天 ";
   var _loc0_;
   switch(nowday % 7)
   {
      case 0:
         t_nowday.text += "星期天";
         weekday = "星期天";
         break;
      case 1:
         var _temp_3 = t_nowday;
         var _temp_2 = "text";
         var _temp_1 = t_nowday.text;
         weekday = _loc0_ = "星期一";
         _temp_3[_temp_2] = _temp_1 + _loc0_;
         break;
      case 2:
         var _temp_6 = t_nowday;
         var _temp_5 = "text";
         var _temp_4 = t_nowday.text;
         weekday = _loc0_ = "星期二";
         _temp_6[_temp_5] = _temp_4 + _loc0_;
         break;
      case 3:
         var _temp_9 = t_nowday;
         var _temp_8 = "text";
         var _temp_7 = t_nowday.text;
         weekday = _loc0_ = "星期三";
         _temp_9[_temp_8] = _temp_7 + _loc0_;
         break;
      case 4:
         var _temp_12 = t_nowday;
         var _temp_11 = "text";
         var _temp_10 = t_nowday.text;
         weekday = _loc0_ = "星期四";
         _temp_12[_temp_11] = _temp_10 + _loc0_;
         break;
      case 5:
         var _temp_15 = t_nowday;
         var _temp_14 = "text";
         var _temp_13 = t_nowday.text;
         weekday = _loc0_ = "星期五";
         _temp_15[_temp_14] = _temp_13 + _loc0_;
         break;
      case 6:
         var _temp_18 = t_nowday;
         var _temp_17 = "text";
         var _temp_16 = t_nowday.text;
         weekday = _loc0_ = "星期六";
         _temp_18[_temp_17] = _temp_16 + _loc0_;
   }
   t_nowday.text += " 今天时间：";
}
reset();
upxx();
