function updata()
{
   msg.text = "技术等级：" + Math.round(_root.hsyjs_jsdj * 100) / 100 + "级";
   if(_root.hsyjs_jsdj >= 20)
   {
      hs_pz = Math.round(_root.hsyjs_jsdj * 100 * 3 / 4);
      price = Math.round(200 * (hs_pz / 100 - 10));
      vipprice = Math.round((1 - _root.hsyjsvip / 10) * price);
      msg.text += "\r出产幻兽：" + Math.round(hs_pz / 100) + "星奇异兽" + "\n" + "出售单价：" + price + "魔石" + "\n" + "优惠价格：" + vipprice + "魔石" + "\n" + "　库存量：" + _root.hsyjs_number + "个";
   }
   else
   {
      msg.text += "\r技术20级前不能生产";
   }
   msg.text += "\r　生产量：" + _root.hsyjs_rate + "个/天";
}
function upjs(js)
{
   if(_root.hsyjs_jsdj < 20 && _root.hsyjs_jsdj + js >= 20)
   {
      if(_root.hsyjs_rate == 0)
      {
         _root.hsyjs_rate += 1;
      }
   }
   _root.hsyjs_jsdj += js;
   if(_root.hsyjs_jsdj > _root.hsyjs_jsdjmax)
   {
      _root.hsyjs_jsdj = _root.hsyjs_jsdjmax;
   }
   updata();
}
function goupjs()
{
   upjs(_root.hsyjs_jsdj / 10);
}
function buy()
{
   if(_root.hsyjs_jsdj < 20)
   {
      _root.alertbox("\r还没生产有幻兽哦");
      return false;
   }
   if(_root.hsyjs_number > 0)
   {
      if(_root.beibao.subms(- vipprice))
      {
         huanshou.flashme(hs_pz - 450);
         if(!_root.huanshoumb.givebb(huanshou))
         {
            _root.alertbox("\r\r你的幻兽背包已经满了，放不下更多幻兽了");
            _root.beibao.subms(vipprice);
            return false;
         }
         _root.hsyjs_number -= 1;
         _root.geiyi.closeme();
         _root.huanshoumb.opens();
         updata();
      }
      else
      {
         _root.alertbox("\r你的魔石不够啊");
      }
   }
   else
   {
      _root.alertbox("\r没有库存了");
   }
}
function sell()
{
   if(_root._root.hsyjs_jsdj < _root.hsyjs_jsdjmax)
   {
      _root.CloseAll();
      _root.geiyi.openme(this);
      _root.beibao.openme();
      this.openme();
   }
   else
   {
      _root.alertbox("技术等级已经达到最高，不再需要资助了。");
   }
}
function givegift()
{
   if(needms >= 100)
   {
      upjs(needms / 10000);
      _root.msgbox("感谢勇士的资助。幻兽研究所技术等级提升了" + needms / 10000 + "级");
      _root.geiyi.closeme();
      _root.beibao.closeme();
   }
}
function openme()
{
   _X = show_x;
   _Y = show_y;
   _visible = true;
   updata();
}
function closeme()
{
   _X = hide_x;
   _Y = hide_y;
   _visible = false;
}
var price;
var hs_pz;
var needjb = 0;
var needms = 0;
var show_x = 250;
var show_y = 180;
var hide_x = 800;
var hite_y = 600;
closeme();
