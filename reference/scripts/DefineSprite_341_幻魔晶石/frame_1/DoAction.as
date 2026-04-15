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
   else if(this.hitTest(_root.baoshironghe.baokou))
   {
      if(!_root.baoshironghe.movethings(this))
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
      _parent.getroom(this);
      _root.alertbox("如果要删除物品请把该物品拖到垃圾箱里。");
   }
}
function getjbvalue()
{
   return 500000;
}
function getmsvalue()
{
   return 0;
}
myid = "幻魔晶石";
names = "幻魔晶石";
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
   texts = names + "\n" + "可以提升装备[使用]等级de宝石,成功率20%-50%";
   _root.wpxs.toshow(this);
};
onRollOut = function()
{
   _root.wpxs.tohide();
};
