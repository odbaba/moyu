function setmydim()
{
   ddim = _parent.src;
   if(ddim.zhtype != undefined)
   {
      zhtype = ddim.zhtype;
      zhdj = ddim.zhdj;
   }
   dj = ddim.dj;
   pz = ddim.pz;
   mhdj = ddim.mhdj;
   dong = ddim.dong;
   dong1 = ddim.dong1;
   dong2 = ddim.dong2;
   dgj = 10 * dj;
   xgj = 5 * dj;
   fdgj = Math.floor(dgj / 10) * mhdj;
   fxgj = Math.floor(xgj / 10) * mhdj;
   if(_parent.src.myid == myid)
   {
      removeMovieClip(_parent.src);
   }
   if(!dj)
   {
      _parent.freeroom(this);
      this.removeMovieClip();
   }
}
function doAfterDrag()
{
   if(this.hitTest(_parent.baokou))
   {
      _parent.getroom(this);
   }
   else if(this.hitTest(_root.beibao.baokou))
   {
      if(!_root.beibao.movethings(this))
      {
         _parent.getroom(this);
      }
   }
   else if(this.hitTest(_root.cangku.baokou))
   {
      if(!_root.cangku.movethings(this))
      {
         _parent.getroom(this);
      }
   }
   else if(this.hitTest(_root.jiahuoshang.baokou))
   {
      if(!_root.jiahuoshang.movethings(this))
      {
         _parent.getroom(this);
      }
   }
   else if(this.hitTest(_root.shoucangjia.baokou))
   {
      if(!_root.shoucangjia.movethings(this))
      {
         _parent.getroom(this);
      }
   }
   else if(this.hitTest(_root.geiyi.baokou))
   {
      if(!_root.geiyi.movethings(this))
      {
         _parent.getroom(this);
      }
   }
   else if(this.hitTest(_root.zbjingliank.baokou))
   {
      if(!_root.zbjingliank.movethings(this))
      {
         _parent.getroom(this);
      }
   }
   else if(this.hitTest(_root.zhuangbeihuanjy.baokou))
   {
      if(!_root.zhuangbeihuanjy.movethings(this))
      {
         _parent.getroom(this);
      }
   }
   else if(this.hitTest(_root.zhuangbei.baokou))
   {
      if(_root.xinxi.dj >= dj)
      {
         if(!_root.zhuangbei.shouzhuo.item)
         {
            _root.zhuangbei.setzhuangbei(this);
         }
         else
         {
            swapitem();
            _parent.getroom(this);
         }
      }
      else
      {
         _parent.getroom(this);
         _root.msgbox("你的等级不够还不能使用这件装备");
      }
   }
   else if(this.hitTest(_root.lajixiang))
   {
      this.removeMovieClip();
   }
   else
   {
      _parent.getroom(this);
      _root.alertbox("如果要删除物品请把该物品拖到垃圾箱里。");
   }
}
function swapitem()
{
   ditem = _root.zhuangbei.shouzhuo.item;
   temp = zhtype;
   zhtype = ditem.zhtype;
   ditem.zhtype = temp;
   temp = zhdj;
   zhdj = ditem.zhdj;
   ditem.zhdj = temp;
   temp = dj;
   dj = ditem.dj;
   ditem.dj = temp;
   temp = pz;
   pz = ditem.pz;
   ditem.pz = temp;
   temp = mhdj;
   mhdj = ditem.mhdj;
   ditem.mhdj = temp;
   temp = dong;
   dong = ditem.dong;
   ditem.dong = temp;
   temp = dong1;
   dong1 = ditem.dong1;
   ditem.dong1 = temp;
   temp = dong2;
   dong2 = ditem.dong2;
   ditem.dong2 = temp;
   flashcount();
   with(ditem)
   {
      dgj = 15 * dj;
      xgj = 10 * dj;
      fdgj = Math.floor(dgj / 10) * mhdj;
      fxgj = Math.floor(xgj / 10) * mhdj;
      nowplayto();
   }
   ditem._parent.flashme();
   nowplayto();
}
function flashcount()
{
   dgj = 15 * dj;
   xgj = 10 * dj;
   fdgj = Math.floor(dgj / 10) * mhdj;
   fxgj = Math.floor(xgj / 10) * mhdj;
}
function nowplayto(n)
{
   if(n)
   {
      gotoAndStop(n);
   }
   else if(_parent._name == "zhuangbei" || _parent._name == "zbjingliank")
   {
      gotoAndStop(dj + 1 + "s");
   }
   else
   {
      gotoAndStop(dj + "s");
   }
}
function checkbs(bs)
{
   switch(bs)
   {
      case "中级战斗力石":
         zdl = 3;
         return "战斗力+3";
      case "高级战斗力石":
         zdl = 5;
         return "战斗力+5";
      case "中级经验石":
         jy = 0.25;
         return "经验值+25%";
      case "高级经验石":
         jy = 0.5;
         return "经验值+50%";
      default:
         return "";
   }
}
function getjbvalue()
{
   return 100 * dj * (pz + 1) + 100 * mhdj + 10000 * dong * dong * dong;
}
function getmsvalue()
{
   if(pz == 4)
   {
      return 28 * (dj * 2.5 + 50) + mhdj * 128 + 1500 * dong * dong * dong;
   }
   return 0;
}
myid = "手镯";
mydepth = getDepth();
setmydim();
nowplayto();
_parent.getroom(this);
onPress = function()
{
   _root.wpxs.tohide();
   _parent.swapDepths(1040000);
   this.swapDepths(1040005);
   _parent.freeroom(this);
   nowplayto(dj + 1 + "s");
   startDrag(this,0);
};
onRelease = function()
{
   _parent.swapDepths(_parent.mydepth);
   nowplayto();
   this.swapDepths(mydepth);
   stopDrag();
   doAfterDrag();
};
onRollOver = function()
{
   flashcount();
   nowplayto();
   texts = "";
   switch(pz)
   {
      case 0:
         pzcolor = "<font color=\"#ffffff\">";
         texts2 = pzcolor + "";
         break;
      case 1:
         pzcolor = "<font color=\"#00ff00\">";
         texts2 = pzcolor + "良品";
         break;
      case 2:
         pzcolor = "<font color=\"#0000ff\">";
         texts2 = pzcolor + "上品";
         break;
      case 3:
         pzcolor = "<font color=\"#ff0000\">";
         texts2 = pzcolor + "精品";
         break;
      case 4:
         pzcolor = "<font color=\"#cc00ff\">";
         texts2 = pzcolor + "极品";
   }
   texts2 += names;
   if(mhdj)
   {
      texts2 += " +" + mhdj;
   }
   if(zhtype > 0 && _root.openzh == true)
   {
      switch(zhtype)
      {
         case 1:
         default:
            texts2 += "</font><font color=\"#cc00ff\">\r战魂：</font><font color=\"#0000ff\">天魂" + zhdj + "级";
            if(zhdj >= 5)
            {
               zhdj = 5;
               texts2 += "(MAX)\r";
            }
            else
            {
               texts2 += "\r";
            }
            texts2 += "效果：攻击+" + zhdj * 5 + "%</font>";
            break;
         case 2:
            texts2 += "</font><font color=\"#cc00ff\">\r战魂：</font><font color=\"#000000\">地魂" + zhdj + "级";
            if(zhdj >= 5)
            {
               zhdj = 5;
               texts2 += "(MAX)\r";
            }
            else
            {
               texts2 += "\r";
            }
            texts2 += "效果：闪避+" + zhdj * 2 + "%</font>";
      }
      texts2 += pzcolor;
   }
   texts2 += "\r使用等级 " + dj;
   texts2 += "\r攻击：" + xgj + "--" + dgj;
   if(mhdj)
   {
      texts2 += "\r追加攻击：" + fxgj + "--" + fdgj;
   }
   if(dong)
   {
      texts2 += "</font><font color=\"#ffcc33\">\r可以镶嵌" + dong + "个宝石";
      if(dong > 0 && checkbs(dong1) != "")
      {
         texts2 += "\r镶嵌了" + checkbs(dong1) + "宝石";
      }
      if(dong == 2 && checkbs(dong2) != "")
      {
         texts2 += "\r镶嵌了" + checkbs(dong2) + "宝石";
      }
   }
   texts2 += "</font>";
   _root.wpxs.toshow(this);
};
onRollOut = function()
{
   _root.wpxs.tohide();
};
