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
      _parent.getroom(this);
      _root.alertbox("如果要删除物品请把该物品拖到垃圾箱里。");
   }
}
function getjbvalue()
{
   return 28000000;
}
function getmsvalue()
{
   return 2800;
}
function useitem()
{
   _root.jineng.studyjn(2,2);
   _root.msgbox("学会了" + names);
   _parent.freeroom(this);
   this.removeMovieClip();
}
useit = "使用(点击这里使用该物品)";
myid = "高级星魔剑";
names = "高级星魔剑";
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
   texts = useit + "\n" + names + "\n" + "使用后学会高级星魔剑技能" + "\n" + "技能效果：群体攻击,攻击力150%";
   _root.wpxs.toshow(this);
};
onRollOut = function()
{
   _root.wpxs.tohide();
};
