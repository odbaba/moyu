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
   else if(this.hitTest(_root.lajixiang))
   {
      this.removeMovieClip();
   }
   else
   {
      _root.alertbox("如果要删除物品请把该物品拖到垃圾箱里。");
      _parent.getroom(this);
   }
}
function getjbvalue()
{
   return 82800000;
}
function getmsvalue()
{
   return 8280;
}
function useitem()
{
   if(_root.useds_num > 0)
   {
      _root.useds_num = 0;
      _root.xinxi.xy = 100;
      _root.zhuangbei.flashme();
      _root.msgbox("使用了" + names + "幸运值提高到了100点");
      _parent.freeroom(this);
      this.removeMovieClip();
   }
   else
   {
      _root.alertbox("\r\r每天只能用一瓶电浆药水哦");
   }
}
myid = "电浆药水";
names = "电浆药水";
useit = "使用(点击这里使用该物品)";
mydepth = getDepth();
xi = -1;
yj = -1;
if(_parent.src.myid == myid)
{
   removeMovieClip(_parent.src);
}
_parent.getroom(this);
onPress = function()
{
   _root.wpxs.tohide();
   _parent.swapDepths(104000);
   this.swapDepths(104005);
   _parent.freeroom(this);
   startDrag(this,0);
};
onRelease = function()
{
   _parent.swapDepths(_parent.mydepth);
   this.swapDepths(mydepth);
   stopDrag();
   doAfterDrag();
};
onRollOver = function()
{
   texts = useit + "\n" + names + "\n" + "使用后提高人的幸运值。使幸运值增加到100。每天只能用一瓶。";
   _root.wpxs.toshow(this);
};
onRollOut = function()
{
   _root.wpxs.tohide();
};
