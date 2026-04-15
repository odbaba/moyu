function setzbb(zb)
{
   if(fbb && zb == fbb)
   {
      return false;
   }
   if(zbb)
   {
      if(fbb.hs_name != zb.hs_name)
      {
         fbb = null;
      }
   }
   zbb = zb;
   yq = yaoqiu(zbb.pz - zbb.pzbase);
   if(this.setting.check1.getcheck())
   {
      autosetfbb();
   }
   updata();
   if(this.setting.check3.getcheck())
   {
      if(_root.xinxi.dj < 40)
      {
         _root.alertbox("\r\r你还没有达到40级，不能使用自动幻化功能。");
         this.setting.check3.setcheck(false);
         return false;
      }
      hh();
   }
   return true;
}
function setfbb(fb)
{
   if(fb == zbb)
   {
      return false;
   }
   if(zbb && fb.hs_name == zbb.hs_name && fb != zbb)
   {
      fbb = fb;
   }
   else
   {
      if(!(zbb && fb.hs_name == "奇异兽"))
      {
         return false;
      }
      fbb = fb;
   }
   updata();
   return true;
}
function autosetfbb()
{
   i = _root.huanshoumb.bblen() - 1;
   while(i > 0)
   {
      if(_root.huanshoumb.array[i] && _root.huanshoumb.array[i].hs_name == "奇异兽" && _root.huanshoumb.array[i].pz >= this.yq)
      {
         this.setfbb(_root.huanshoumb.array[i]);
         return true;
      }
      i--;
   }
   _root.alertbox("\r\r你的幻兽背包里没有合适的奇异兽了。");
   return false;
}
function updata()
{
   if(zbb.dj)
   {
      zbbs.shows(zbb);
      tz.text = "主幻兽评分：" + zbb.pz;
   }
   else
   {
      zbbs.shows(zbb);
      tz.text = "";
   }
   if(fbb)
   {
      fbbs.shows(fbb);
      tf.text = "副幻兽评分：" + fbb.pz;
      if(yq > fbb.pz)
      {
         tf.textColor = 10027059;
      }
      else
      {
         tf.textColor = 16777215;
      }
   }
   else
   {
      fbbs.shows(fbb);
      tf.text = "";
   }
   if(yq)
   {
      tyq.text = "极品" + yq / 100 + "星";
   }
   else
   {
      tyq.text = "无要求";
   }
}
function hh()
{
   if(zbb.dj < 50 && this.setting.check2.getcheck())
   {
      if(!_root.beibao.usethings("满经验球",-1))
      {
         _root.alertbox("\r\r\r你没有满的经验球了");
         return false;
      }
      zbb.have_exp(27000);
      _root.huanshoumb.updata();
   }
   var _loc3_;
   if(zbb.dj && fbb.dj && zbb != fbb && fbb.pz >= yq && (zbb.dj >= 50 || this.check2.getcheck()))
   {
      _loc3_ = _root.huanhua(zbb,fbb);
      _root.huanhuacg.openme(_loc3_);
      _root.huanshoumb.updata();
      _root.huanhuacg._x = this._x;
      _root.huanhuacg._y = this._y;
      _visible = false;
      return true;
   }
   hhyq._visible = true;
   hhyq.yqtext.text = "不能进行幻化\r";
   if(!zbb.dj)
   {
      hhyq.yqtext.text += "请放入主幻兽  ";
   }
   if(!fbb.dj)
   {
      hhyq.yqtext.text += "请放入副幻兽";
   }
   hhyq.yqtext.text += "\n";
   if(zbb.dj < 50)
   {
      hhyq.yqtext.text += "主幻兽等级不满50级\r";
   }
   if(fbb.pz < yq)
   {
      hhyq.yqtext.text += "副幻兽的评分没有达到" + yq + "分" + "\n";
   }
   this.setting.check3.setcheck(false);
   return false;
}
function yaoqiu(fen)
{
   if(fen < 1500)
   {
      return 0;
   }
   return Math.floor((fen - 500) / 2);
}
function openme()
{
   _X = show_x;
   _Y = show_y;
   _visible = true;
   _root.huanhuacg._visible = false;
   if(zbb.dj)
   {
      setzbb(zbb);
   }
   updata();
}
function closeme()
{
   _X = hide_x;
   _Y = hide_y;
   fbb = null;
   _visible = false;
   setting.closeme();
}
openme();
show_x = 215;
show_y = 75;
hide_x = 800;
hite_y = 600;
closeme();
