// ============================================================
// frame_37/DoAction.as - 游戏结束评价
// ============================================================
// 功能说明：
// 本文件负责在游戏结束时显示玩家的综合评价
// 根据玩家在游戏中的各项表现给予不同的评价和称号
// 
// 主要功能：
// 1. 停止背景音乐
// 2. 计算各项战斗力指标
// 3. 根据指标给予评价和称号
// 4. 显示综合评语
// 
// 评价项目：
// 1. 战斗力评价 - 根据最高战斗力
// 2. 等级评价 - 根据最终等级
// 3. 装备评价 - 根据装备战斗力
// 4. 幻兽评价 - 根据幻兽战斗力
// 5. 军衔评价 - 根据军衔等级
// 6. 爵位评价 - 根据爵位等级
// 7. 公主关系评价 - 根据与公主的关系等级
// 8. 财富评价 - 根据金钱和魔石总量
// 
// 评价等级：
// - 最高评价：获得maxprice计数
// - 其他评价：根据数值范围给予不同称号
// 
// 综合评语：
// - 根据maxprice数量和军衔等级给出不同的评语
// - maxprice == 7：绝世高手
// - maxprice >= 5：天才游戏玩家
// - 军衔 >= 7：不败将军
// - 军衔 >= 4：神勇战士
// - 军衔 >= 1：英勇战士
// - 其他：菜鸟
// 
// 调用关系：
// - 被 frame_6/returnmap() 调用（游戏天数结束）
// - 调用 _root.backmusic.stopmusic() 停止音乐
// - 读取 _root.xinxi 角色信息
// - 读取 _root.zhuangbei 装备信息
// - 读取 _root.beibao 背包信息
// 
// 全局变量：
// - _root.isWin: Boolean - 是否胜利（击败最终BOSS）
// - maxprice: Number - 获得最高评价的数量
// 
// 相关文件：
// - frame_6/DoAction.as - 核心游戏逻辑
// - 02_角色信息_DefineSprite_932.md - 角色系统文档
// ============================================================

// 停止背景音乐
_root.backmusic.stopmusic();

// 清空评价文本
end_judge.text = "";

// 初始化最高评价计数器
var maxprice = 0;

// 计算幻兽总战斗力
end_hs_zdl = _root.xinxi.hs1_maxzdl + _root.xinxi.hs2_maxzdl;

// 计算装备总战斗力
end_zb_zdl = _root.zhuangbei.getpz() + _root.zhuangbei.getmhdj() + _root.zhuangbei.getdong() + _root.zhuangbei.getbs() + _root.zhuangbei.getfix() + _root.zhuangbei.bestbszdl;

// 显示游戏天数
end_judge.text += "\n" + _root.mc_day.nowday + "天过去了，";

// ============================================================
// 战斗力评价
// ============================================================
end_judge.text += "\r你的战斗力：　　　　" + _root.xinxi.my_maxzdl + "\t\t\t评价：";

if(_root.isWin == false)
{
   // 未胜利，无评价
   end_judge.text += "无";
}
else if(_root.xinxi.my_maxzdl >= 1200)
{
   // 战斗力>=1200：终极勇士（最高评价）
   end_judge.text += "终极勇士(最高评价)";
   maxprice++;
}
else if(_root.xinxi.my_maxzdl >= 1000)
{
   // 战斗力>=1000：罕见的
   end_judge.text += "罕见的";
}
else if(_root.xinxi.my_maxzdl >= 800)
{
   // 战斗力>=800：非常利害
   end_judge.text += "非常利害";
}
else if(_root.xinxi.my_maxzdl >= 600)
{
   // 战斗力>=600：很利害
   end_judge.text += "很利害";
}
else if(_root.xinxi.my_maxzdl >= 300)
{
   // 战斗力>=300：普通
   end_judge.text += "普通";
}
else
{
   // 战斗力<300：无
   end_judge.text += "无";
}

// ============================================================
// 等级评价
// ============================================================
end_judge.text += "\r你的等级：　　　　　" + _root.xinxi.dj + "级\t\t\t称号：";

if(_root.isWin == false)
{
   end_judge.text += "无";
}
else if(_root.xinxi.dj >= 132)
{
   // 等级>=132：冲级能手（最高评价）
   end_judge.text += "冲级能手(最高评价)";
   maxprice++;
}
else if(_root.xinxi.dj >= 120)
{
   // 等级>=120：练级高手
   end_judge.text += "练级高手";
}
else if(_root.xinxi.dj >= 100)
{
   // 等级>=100：很会升级
   end_judge.text += "很会升级";
}
else if(_root.xinxi.dj >= 70)
{
   // 等级>=70：练级还行
   end_judge.text += "练级还行";
}
else
{
   // 等级<70：低级菜鸟
   end_judge.text += "低级菜鸟";
}

// ============================================================
// 装备评价
// ============================================================
end_judge.text += "\r你的装备的战斗力：　" + end_zb_zdl + "战斗力\t\t称号：";

if(_root.isWin == false)
{
   end_judge.text += "无";
}
else if(end_zb_zdl >= 126)
{
   // 装备战斗力>=126：装备打造宗师（最高评价）
   end_judge.text += "装备打造宗师(最高评价)";
   maxprice++;
}
else if(end_zb_zdl >= 108)
{
   // 装备战斗力>=108：装备打造大师
   end_judge.text += "装备打造大师";
}
else if(end_zb_zdl >= 72)
{
   // 装备战斗力>=72：装备打造高手
   end_judge.text += "装备打造高手";
}
else if(end_zb_zdl >= 48)
{
   // 装备战斗力>=48：装备打造学徒
   end_judge.text += "装备打造学徒";
}
else
{
   // 装备战斗力<48：装备打造傻鸟
   end_judge.text += "装备打造傻鸟";
}

// ============================================================
// 幻兽评价
// ============================================================
end_judge.text += "\r你的幻兽的战斗力：　" + end_hs_zdl + "战斗力\t\t称号：";

if(_root.isWin == false)
{
   end_judge.text += "无";
}
else if(end_hs_zdl >= 400)
{
   // 幻兽战斗力>=400：究极幻兽师（最高评价）
   end_judge.text += "究极幻兽师(最高评价)";
   maxprice++;
}
else if(end_hs_zdl >= 320)
{
   // 幻兽战斗力>=320：幻兽培养大师
   end_judge.text += "幻兽培养大师";
}
else if(end_hs_zdl >= 250)
{
   // 幻兽战斗力>=250：幻兽培养高手
   end_judge.text += "幻兽培养高手";
}
else if(end_hs_zdl >= 100)
{
   // 幻兽战斗力>=100：善于培养幻兽
   end_judge.text += "善于培养幻兽";
}
else
{
   // 幻兽战斗力<100：不会培养幻兽
   end_judge.text += "不会培养幻兽";
}

// ============================================================
// 军衔评价
// ============================================================
end_judge.text += "\r你的军衔：　　　　　" + _root.xinxi.jxname + "\t\t\t被称为：";

if(_root.isWin == false)
{
   end_judge.text += "无";
}
else
{
   switch(_root.xinxi.jxdj)
   {
      case 0:
         // 无军衔：无名小兵
         end_judge.text += "无名小兵";
         break;
      case 1:
      case 2:
      case 3:
         // 军衔1-3级：亚特兰蒂斯下级军官
         end_judge.text += "亚特兰蒂斯下级军官";
         break;
      case 4:
      case 5:
      case 6:
         // 军衔4-6级：亚特兰蒂斯中级军官
         end_judge.text += "亚特兰蒂斯中级军官";
         break;
      case 7:
      case 8:
      case 9:
         // 军衔7-9级：亚特兰蒂斯高级军官
         end_judge.text += "亚特兰蒂斯高级军官";
         break;
      case 10:
         // 军衔10级：亚特兰蒂斯名将
         end_judge.text += "亚特兰蒂斯名将";
         break;
      case 11:
      default:
         // 军衔11级：亚特兰蒂斯战神（最高评价）
         end_judge.text += "亚特兰蒂斯战神(最高评价)";
         maxprice++;
   }
}

// ============================================================
// 爵位评价
// ============================================================
end_judge.text += "\r你的爵位：　　　　　" + _root.xinxi.jwname + "\t\t\t被称为：";

if(_root.isWin == false)
{
   end_judge.text += "无";
}
else
{
   switch(_root.xinxi.jwdj)
   {
      case 0:
         // 无爵位：平民
         end_judge.text += "平民";
         break;
      case 1:
         // 爵位1级：贵族
         end_judge.text += "贵族";
         break;
      case 2:
      case 3:
         // 爵位2-3级：荣誉贵族
         end_judge.text += "荣誉贵族";
         break;
      case 4:
         // 爵位4级：令人尊敬的贵族
         end_judge.text += "令人尊敬的贵族";
         break;
      case 5:
         // 爵位5级：无尚荣誉的贵族
         end_judge.text += "无尚荣誉的贵族";
         break;
      case 6:
      default:
         // 爵位6级：人类的骄傲（最高评价）
         end_judge.text += "人类的骄傲(最高评价)";
         maxprice++;
   }
}

// ============================================================
// 公主关系评价
// ============================================================
end_judge.text += "\r你与公主关系：　　　" + _root.xinxi.gxname + "\t\t\t被认为：";

if(_root.isWin == false)
{
   end_judge.text += "无";
}
else
{
   switch(_root.xinxi.gzgx)
   {
      case 0:
      case 1:
      case 2:
         // 关系0-2级：不懂交往
         end_judge.text += "不懂交往";
         break;
      case 3:
         // 关系3级：善于交往
         end_judge.text += "善于交往";
         break;
      case 4:
         // 关系4级：交际高手
         end_judge.text += "交际高手";
         break;
      case 5:
         // 关系5级：情商过人
         end_judge.text += "情商过人";
         break;
      case 6:
      default:
         // 关系6级：情圣（最高评价）
         end_judge.text += "情圣(最高评价)";
         maxprice++;
   }
}

// ============================================================
// 财富评价
// ============================================================
end_judge.text += "\r你的金钱：" + _root.beibao.jb.text + "　你的魔石：" + _root.beibao.ms.text + "　称号：";

if(_root.isWin == false)
{
   end_judge.text += "无";
}
else if(_root.beibao.myjb / 10000 + _root.beibao.myms >= 500000)
{
   // 财富>=500000：富可敌国（最高评价）
   end_judge.text += "富可敌国(最高评价)";
   maxprice++;
}
else if(_root.beibao.myjb / 10000 + _root.beibao.myms >= 350000)
{
   // 财富>=350000：大富豪
   end_judge.text += "大富豪";
}
else if(_root.beibao.myjb / 10000 + _root.beibao.myms >= 200000)
{
   // 财富>=200000：小富商
   end_judge.text += "小富商";
}
else if(_root.beibao.myjb / 10000 + _root.beibao.myms >= 50000)
{
   // 财富>=50000：还能过日子
   end_judge.text += "还能过日子";
}
else
{
   // 财富<50000：贫穷的家伙
   end_judge.text += "贫穷的家伙";
}

// ============================================================
// 综合评语
// ============================================================
end_judge.text += "\r";
end_judge.text += "\r综合评语：";

if(_root.isWin == false)
{
   // 未胜利：无评语
   end_judge.text += "无";
}
else if(maxprice == 7)
{
   // 全部最高评价：绝世高手
   end_judge.text += "\r　　你能玩到这地步，我无语――绝世高手啊。(最高评价)";
}
else if(maxprice >= 5)
{
   // 5个以上最高评价：天才游戏玩家
   end_judge.text += "\r　　天啊！你凭着超人的智慧，无比的英勇，击败数不清的（就是未来人类所说的无数个）魔族大军，被人类推举为最高军事领袖之一。看，魔族大军已经溃不成军了，人类已经为胜利准备了盛宴在等待你凯旋。你真不愧是天才游戏玩家。";
}
else if(_root.xinxi.jxdj >= 7)
{
   // 军衔>=7级：不败将军
   end_judge.text += "\r　　你以势如破竹的进攻将魔族大军打得得花流水，魔族大军一谈到你的名字就脸色都变了（就是未来人类所说的谈虎色变）。在你的指挥下的如钢铁般的军队的打击下，魔族大军已经知道它们已是胜利无望了，它们正在做着逃跑的准备了。";
}
else if(_root.xinxi.jxdj >= 4)
{
   // 军衔>=4级：神勇战士
   end_judge.text += "\r　　在这60天里亚特兰蒂斯出现了一个神勇的战士，就是你，你的无畏的勇气打倒一批批的魔族大军，由于你卓越的战功，人们赠与你不败将军的称号，从你身上人类看到了胜利将属于人类的。";
}
else if(_root.xinxi.jxdj >= 1)
{
   // 军衔>=1级：英勇战士
   end_judge.text += "\r　　你在60天的战斗里取得了优异的战绩，亚特兰蒂斯与魔族的战斗还在进行中，你已经是一位英勇的战士，希望你能战斗到胜利！";
}
else
{
   // 无军衔：菜鸟
   end_judge.text += "\r　　游戏结束了，哎，你在唱着："我是一只菜菜鸟，想要飞呀却飞也飞不高~。"离开了游戏。";
}

// 跳转到下一帧（显示评价界面）
nextFrame();
