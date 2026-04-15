onClipEvent(load){
   this.onDragOut = function()
   {
      _root.dan.doStartDrag(_parent.point);
      _root.wpxs.tohide();
   };
   this.onRelease = function()
   {
      if(_root.huanshoumb._visible)
      {
         _root.huanshoumb.closeme();
      }
      else
      {
         _root.huanshoumb.opens();
      }
   };
   onRollOver = function()
   {
      texts = _parent.point.othername;
      texts += "\n" + _parent.point.dj + "级";
      texts += "\r品质：";
      if(_parent.point.pz >= 100)
      {
         texts += "极品" + _parent.point.pz / 100 + "星";
      }
      else if(_parent.point.pz >= 75)
      {
         texts += "万众瞩目";
      }
      else if(_parent.point.pz >= 50)
      {
         texts += "千载难逢";
      }
      else if(_parent.point.pz >= 25)
      {
         texts += "百里挑一";
      }
      else if(_parent.point.pz >= 10)
      {
         texts += "优秀";
      }
      else
      {
         texts += "普通";
      }
      texts += "\r生命值：" + Math.round(_parent.point.hp) + "/" + Math.round(_parent.point.mhp);
      texts += "\r经验值：" + Math.round(_parent.point.jy) + "/" + Math.round(_parent.point.mjy);
      texts += "\r攻击力：" + Math.round(_parent.point.xgj) + "－" + Math.round(_parent.point.dgj);
      texts += "\r防御力：" + Math.round(_parent.point.fy);
      _root.wpxs.toshow(this);
   };
   onRollOut = function()
   {
      _root.wpxs.tohide();
   };
}
