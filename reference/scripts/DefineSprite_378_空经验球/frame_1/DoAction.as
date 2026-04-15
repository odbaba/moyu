function finding()
{
   var _loc3_ = false;
   i = 0;
   while(i < _parent.yn)
   {
      j = 0;
      while(j < _parent.xn)
      {
         if(_parent.array[i][j].myid == myid)
         {
            _parent.array[i][j].number += number;
            _loc3_ = true;
            i = _parent.yn;
            j = _parent.xn;
         }
         j++;
      }
      i++;
   }
   if(_loc3_)
   {
      removeMovieClip(this);
   }
   else
   {
      _parent.getroom(this);
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
   return 1000 * number;
}
function getmsvalue()
{
   return 0;
}
function addexp(m_exp)
{
   exps += m_exp;
}
stop();
myid = "空经验球";
names = "空经验球";
number = 1;
exps = 0;
mydepth = getDepth();
xi = -1;
yj = -1;
if(_parent.src.number)
{
   number = _parent.src.number;
}
else
{
   number = 1;
}
if(_parent.src.myid == myid)
{
   removeMovieClip(_parent.src);
}
finding();
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
   atoi = Math.round(exps / 270);
   texts = names + "　数量" + number + "\n" + "空经验球，将它放在背包里可以将战斗中人物获得的经验存进里面。已存经验" + atoi + "%当经验值存储到达100%后你就能得到一个[满经验球]" + "\n" + "等级100级以上才可以使用。";
   _root.wpxs.toshow(this);
};
onRollOut = function()
{
   _root.wpxs.tohide();
};
