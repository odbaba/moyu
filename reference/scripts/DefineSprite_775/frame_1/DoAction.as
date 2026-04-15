function shows(bb)
{
   nowbb = bb;
   if(bb)
   {
      this.bbshow.gotoAndPlay(bb.hs_name);
      if(bb.pz >= 100)
      {
         tpz = "极品" + bb.pz / 100 + "星";
      }
      else if(bb.pz >= 75)
      {
         tpz = "万众瞩目";
      }
      else if(bb.pz >= 50)
      {
         tpz = "千载难逢";
      }
      else if(bb.pz >= 25)
      {
         tpz = "百里挑一";
      }
      else if(bb.pz >= 10)
      {
         tpz = "优秀";
      }
      else
      {
         tpz = "普通";
      }
      t.text = "名字:  " + bb.othername + "   幻兽类型:" + bb.hs_name + "\n";
      t.text += "品质:  " + tpz + "      等级:  " + bb.dj + "\n";
      t.text += "生命:  " + bb.hp + "/" + bb.mhp + "      经验:" + Math.round(100 * bb.jy / bb.mjy) + "%" + "\n";
      t.text += "攻击:  " + bb.xgj + "--" + bb.dgj + "\n";
      t.text += "防御: " + bb.fy + "     防御成长率:" + Math.round(bb.cz_fy) + "  评分:" + bb.pz_cz_fy + "\n";
      t.text += "生命成长率:  " + Math.round(bb.cz_hp) + "   评分:" + bb.pz_cz_hp + "\n";
      t.text += "攻击成长率: " + bb.cz_xgj + "--" + bb.cz_dgj + "  评分:" + bb.pz_cz_xgj + "--" + bb.pz_cz_dgj + "\n";
      t.text += "初始生命:  " + bb.chp + "   评分:" + bb.pz_chp + "\n";
      t.text += "初始攻击:  " + bb.cxgj + "--" + bb.cdgj + "   评分:" + bb.pz_cxgj + "--" + bb.pz_cdgj + "\n";
      t.text += "初始防御:  " + bb.cfy + "   评分:" + bb.pz_cfy + "\n";
      t.text += "罕见度: +" + bb.pzbase + "分";
      t.text += "  转世：" + bb.zs + "次";
   }
   else
   {
      this.bbshow.gotoAndStop(1);
      t.text = "";
   }
}
function getname(names)
{
   nowbb.othername = names;
   shows(nowbb);
   with(_parent)
   {
      updata();
      changecz();
   }
}
