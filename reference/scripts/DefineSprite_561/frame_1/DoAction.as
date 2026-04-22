// ============================================================
// DefineSprite_561/frame_1/DoAction.as - 装备系统
// ============================================================
// 功能说明：
// 本文件是装备系统的核心，管理角色装备的穿戴、属性加成计算
// 这是游戏中最重要的系统之一，控制装备的所有状态和属性加成
// 
// 主要功能：
// 1. 装备穿戴和卸下 (setzhuangbei, getroom, freeroom)
// 2. 装备属性加成计算 (getxgj, getdgj, getfy, getpz, getmhdj, getdong, getbs)
// 3. 战魂系统 (zhth, zhdh, zhjj, zhmiss, zhgj) - 天魂/地魂套装
// 4. 宝石系统 (bszdl, bsjy, getbs, getbsexp)
// 5. 界面管理 (openme, closeme, flashme)
// 
// 装备槽位：
// - wuqi: 武器 - 增加攻击力
// - toukui: 头盔 - 增加防御力
// - shouzhuo: 手镯 - 增加攻击力
// - xianglian: 项链 - 增加攻击力
// - yifu: 衣服 - 增加防御力
// - zhanxie: 战鞋 - 增加防御力
// 
// 装备属性：
// - dj: Number - 装备等级（10-125）
// - pz: Number - 装备品质（1=普通, 2=良好, 3=优秀, 4=精品, 5=传说）
// - mhdj: Number - 追加等级（0-12）
// - dong: Number - 镶嵌孔数（0-3）
// - dong1/dong2: String - 镶嵌的宝石名称
// - zhtype: Number - 战魂类型（0=无, 1=天魂, 2=地魂）
// - zhdj: Number - 战魂等级（1-5）
// - xgj/dgj: Number - 最小/最大攻击力
// - fy: Number - 防御力
// - fxgj/fdgj/ffy: Number - 附加攻击/防御
// 
// 战魂系统：
// - 天魂套装(zhtype=1)：增加攻击力百分比
// - 地魂套装(zhtype=2)：增加闪避率
// - 套装效果：6件装备全部同类型战魂才生效
// - 战魂等级：取6件装备中最低的战魂等级
// 
// 宝石系统：
// - 中级战斗力石：+3战斗力
// - 高级战斗力石：+5战斗力
// - 中级经验石：+25%经验
// - 高级经验石：+50%经验
// 
// 调用关系：
// - 被 _root.zhuangbei 全局访问
// - 调用 _root.xinxi 角色信息
// - 调用 _root.beibao 背包系统
// 
// 相关文件：
// - frame_6/DoAction.as - 核心游戏逻辑
// - 02_角色信息_DefineSprite_932.md - 角色系统
// - 03_装备系统_DefineSprite_561.md - 装备系统文档
// ============================================================

// ------------------------------------------------------------
// openme() - 打开装备界面
// 
// 功能：
// 显示装备界面并刷新数据
// 
// 参数：无
// 
// 返回值：无
// ------------------------------------------------------------
function openme()
{
   // 设置显示位置
   _X = show_x;
   _Y = show_y;
   _visible = true;
   // 刷新装备数据
   flashme();
   // 隐藏详细信息面板
   xiangxi.shows(false);
}

// ------------------------------------------------------------
// closeme() - 关闭装备界面
// ------------------------------------------------------------
function closeme()
{
   _X = hide_x;
   _Y = hide_y;
   _visible = false;
}

// ------------------------------------------------------------
// flashme() - 刷新装备界面
// 
// 功能：
// 重新计算角色属性并更新界面显示
// 
// 参数：无
// 
// 返回值：无
// 
// 显示内容：
// - 角色名称、等级、爵位、军衔
// - 与公主关系
// - 生命值、体力值、经验值
// - 攻击力、防御力、闪避率、幸运值
// - 战斗力
// - 套装效果提示
// ------------------------------------------------------------
function flashme()
{
   // 获取角色信息
   mb = _root.xinxi;
   // 重新计算角色属性
   mb.flashdata();
   
   // 构建角色信息文本
   renwuxinxi.text = mb.myname + "\n" + "等级：" + mb.dj + "级" + "\n" + "爵位：" + mb.jwname + "    " + "军衔：" + mb.jxname + "\n" + "与公主关系：" + mb.gxname + "\n";
   renwuxinxi.text += "生命值：" + mb.hp + "/" + mb.mhp + "\n" + "体力值：" + mb.tl + "/" + mb.mtl + "\n" + "经验值：" + Math.round(mb.jy) + "/" + Math.round(mb.mjy) + "\n" + "攻击力：" + mb.xgj + "--" + mb.dgj + "\n" + "防御力：" + mb.fy + "\n" + "闪避　：" + zhmiss() + "%" + "\n" + "幸运值：" + mb.xy + "\n" + "战斗力：" + mb.zdl;
   
   // 显示详细信息
   xiangxi.showtext();
   
   // 显示战魂等级
   zhdenjie.shows(zhjj());
   
   // 隐藏套装提示
   this.zhtaozhuang.hides();
   
   // 检查是否激活天魂套装
   if(zhth() == 1)
   {
      this.zhtaozhuang.shows("天魂套装");
   }
   // 检查是否激活地魂套装
   else if(zhdh() == 1)
   {
      this.zhtaozhuang.shows("地魂套装");
   }
}

// ------------------------------------------------------------
// setzhuangbei(dsc) - 设置装备
// 
// 功能：
// 将装备对象设置到对应的槽位
// 
// 参数：
// - dsc: Object - 装备对象
// 
// 返回值：无
// ------------------------------------------------------------
function setzhuangbei(dsc)
{
   src = dsc;
   
   // 根据装备类型选择对应槽位
   switch(dsc.myid)
   {
      case "武器":
         rsc = this.wuqi;
         break;
      case "头盔":
         rsc = this.toukui;
         break;
      case "手镯":
         rsc = this.shouzhuo;
         break;
      case "项链":
         rsc = this.xianglian;
         break;
      case "衣服":
         rsc = this.yifu;
         break;
      case "战鞋":
         rsc = this.zhanxie;
   }
   
   // 标记槽位有装备
   rsc.haveItem = true;
   
   // 创建装备显示对象
   var _loc2_ = this.getNextHighestDepth();
   this.attachMovie(dsc.myid,"wp" + _loc2_,_loc2_);
}

// ------------------------------------------------------------
// getroom(dsc) - 装备穿戴
// 
// 功能：
// 将装备穿戴到对应槽位，并检查是否触发剧情
// 
// 参数：
// - dsc: Object - 装备对象
// 
// 返回值：无
// 
// 特殊逻辑：
// - 当全身装备品质总和达到24（全传说装备）时，触发飞翔剧情
// ------------------------------------------------------------
function getroom(dsc)
{
   // 根据装备类型选择对应槽位
   switch(dsc.myid)
   {
      case "武器":
         rsc = this.wuqi;
         break;
      case "头盔":
         rsc = this.toukui;
         break;
      case "手镯":
         rsc = this.shouzhuo;
         break;
      case "项链":
         rsc = this.xianglian;
         break;
      case "衣服":
         rsc = this.yifu;
         break;
      case "战鞋":
         rsc = this.zhanxie;
   }
   
   // 设置槽位装备
   rsc.item = dsc;
   
   // 设置装备位置
   dsc._x = rsc._x;
   dsc._y = rsc._y;
   
   // 检查是否触发飞翔剧情（全传说装备）
   if(_root.openzh == false && _root.openzhrw == false && getpz() == 24)
   {
      trace("ok");
      _root.openzhrw = true;
      
      // 构建剧情文本
      words = "　　飞翔";
      if(_root.dj < 10)
      {
         words += "（大吃一惊）";
      }
      else if(_root.dj < 50)
      {
         words += "（惊讶）";
      }
      else if(_root.dj < 80)
      {
         words += "（非常高兴）";
      }
      else if(_root.dj < 100)
      {
         words += "（很高兴）";
      }
      words += "：噢，你的全身装备都是极品啊，看来这位你是位不同寻常的人。听装备打造师说从戈壁可以找到有关战魂的秘密...你应该去看一看。";
      
      // 显示剧情
      _root.storymsg.openme(words);
   }
   
   // 刷新界面
   flashme();
   
   // 播放装备音效
   var _loc3_ = new Sound();
   _loc3_.attachSound("装备.wav");
   _loc3_.start();
}

// ------------------------------------------------------------
// freeroom(dsc) - 装备卸下
// 
// 功能：
// 从槽位卸下装备
// 
// 参数：
// - dsc: Object - 装备对象
// 
// 返回值：无
// ------------------------------------------------------------
function freeroom(dsc)
{
   // 根据装备类型选择对应槽位
   switch(dsc.myid)
   {
      case "武器":
         rsc = this.wuqi;
         break;
      case "头盔":
         rsc = this.toukui;
         break;
      case "手镯":
         rsc = this.shouzhuo;
         break;
      case "项链":
         rsc = this.xianglian;
         break;
      case "衣服":
         rsc = this.yifu;
         break;
      case "战鞋":
         rsc = this.zhanxie;
   }
   
   // 清空槽位
   rsc.item = false;
   
   // 刷新界面
   flashme();
}

// ------------------------------------------------------------
// getfix() - 获取装备修正值
// 
// 功能：
// 计算装备等级修正值，用于战斗力计算
// 
// 参数：无
// 
// 返回值：Number - 装备修正值（0-6）
// 
// 算法说明：
// 检查每件装备的等级是否与角色等级匹配
// 匹配规则：
// - 角色等级<10：所有装备都算匹配
// - 角色等级10-100：装备等级与角色等级差<10算匹配
// - 角色等级100-125：装备等级必须为100算匹配
// - 角色等级>=125：装备等级必须为125算匹配
// ------------------------------------------------------------
function getfix()
{
   var _loc1_ = 0;
   // 累加所有装备的修正值
   _loc1_ = isfix(wuqi.item.dj) + isfix(toukui.item.dj) + isfix(shouzhuo.item.dj) + isfix(xianglian.item.dj) + isfix(yifu.item.dj) + isfix(zhanxie.item.dj);
   return _loc1_;
}

// ------------------------------------------------------------
// isfix(zbdj) - 检查单件装备是否匹配
// 
// 功能：
// 检查装备等级是否与角色等级匹配
// 
// 参数：
// - zbdj: Number - 装备等级
// 
// 返回值：Number - 0或1（1表示匹配）
// ------------------------------------------------------------
function isfix(zbdj)
{
   // 装备不存在，不匹配
   if(zbdj == undefined)
   {
      return 0;
   }
   
   // 角色等级<10，所有装备都匹配
   if(_root.xinxi.dj < 10)
   {
      return 1;
   }
   
   // 角色等级10-100
   if(_root.xinxi.dj <= 100)
   {
      // 装备等级与角色等级差<10算匹配
      return _root.xinxi.dj - zbdj >= 10 ? 0 : 1;
   }
   
   // 角色等级>=125，装备等级必须为125
   if(_root.xinxi.dj >= 125)
   {
      return zbdj != 125 ? 0 : 1;
   }
   
   // 角色等级100-125，装备等级必须为100
   return zbdj != 100 ? 0 : 1;
}

// ------------------------------------------------------------
// getpz() - 获取装备品质总和
// 
// 功能：
// 计算所有装备的品质总和
// 
// 参数：无
// 
// 返回值：Number - 品质总和（0-30）
// 
// 品质值：
// - 普通=1, 良好=2, 优秀=3, 精品=4, 传说=5
// - 全传说装备品质总和=6*5=30
// ------------------------------------------------------------
function getpz()
{
   var _loc1_ = 0;
   
   // 累加所有装备的品质
   if(wuqi.item)
   {
      _loc1_ += wuqi.item.pz;
   }
   if(toukui.item)
   {
      _loc1_ += toukui.item.pz;
   }
   if(shouzhuo.item)
   {
      _loc1_ += shouzhuo.item.pz;
   }
   if(xianglian.item)
   {
      _loc1_ += xianglian.item.pz;
   }
   if(yifu.item)
   {
      _loc1_ += yifu.item.pz;
   }
   if(zhanxie.item)
   {
      _loc1_ += zhanxie.item.pz;
   }
   
   return _loc1_;
}

// ------------------------------------------------------------
// getmhdj() - 获取最低追加等级
// 
// 功能：
// 获取所有装备中最低的追加等级
// 
// 参数：无
// 
// 返回值：Number - 最低追加等级（0-12）
// 
// 算法说明：
// 追加等级用于战斗力计算，取最低值
// ------------------------------------------------------------
function getmhdj()
{
   // 初始值为最高追加等级
   var _loc1_ = 12;
   
   // 检查武器追加等级
   if(wuqi.item && _loc1_)
   {
      if(_loc1_ > wuqi.item.mhdj)
      {
         _loc1_ = wuqi.item.mhdj;
      }
   }
   else
   {
      _loc1_ = 0;
   }
   
   // 检查头盔追加等级
   if(toukui.item && _loc1_)
   {
      if(_loc1_ >= toukui.item.mhdj)
      {
         _loc1_ = toukui.item.mhdj;
      }
   }
   else
   {
      _loc1_ = 0;
   }
   
   // 检查手镯追加等级
   if(shouzhuo.item && _loc1_)
   {
      if(_loc1_ >= shouzhuo.item.mhdj)
      {
         _loc1_ = shouzhuo.item.mhdj;
      }
   }
   else
   {
      _loc1_ = 0;
   }
   
   // 检查项链追加等级
   if(xianglian.item && _loc1_)
   {
      if(_loc1_ >= xianglian.item.mhdj)
      {
         _loc1_ = xianglian.item.mhdj;
      }
   }
   else
   {
      zdl0;
   }
   
   // 检查衣服追加等级
   if(yifu.item && _loc1_)
   {
      if(_loc1_ >= yifu.item.mhdj)
      {
         _loc1_ = yifu.item.mhdj;
      }
   }
   else
   {
      _loc1_ = 0;
   }
   
   // 检查战鞋追加等级
   if(zhanxie.item && _loc1_)
   {
      if(_loc1_ >= zhanxie.item.mhdj)
      {
         _loc1_ = zhanxie.item.mhdj;
      }
   }
   else
   {
      _loc1_ = 0;
   }
   
   return _loc1_;
}

// ------------------------------------------------------------
// getdong() - 获取镶嵌孔总数
// 
// 功能：
// 计算所有装备的镶嵌孔总数
// 
// 参数：无
// 
// 返回值：Number - 镶嵌孔总数（0-18）
// ------------------------------------------------------------
function getdong()
{
   var _loc1_ = 0;
   
   // 累加所有装备的镶嵌孔数
   if(wuqi.item)
   {
      _loc1_ += wuqi.item.dong;
   }
   if(toukui.item)
   {
      _loc1_ += toukui.item.dong;
   }
   if(shouzhuo.item)
   {
      _loc1_ += shouzhuo.item.dong;
   }
   if(xianglian.item)
   {
      _loc1_ += xianglian.item.dong;
   }
   if(yifu.item)
   {
      _loc1_ += yifu.item.dong;
   }
   if(zhanxie.item)
   {
      _loc1_ += zhanxie.item.dong;
   }
   
   return _loc1_;
}

// ------------------------------------------------------------
// getbs() - 获取宝石战斗力总和
// 
// 功能：
// 计算所有镶嵌宝石的战斗力总和
// 
// 参数：无
// 
// 返回值：Number - 宝石战斗力总和
// ------------------------------------------------------------
function getbs()
{
   bestbszdl = 0;
   var _loc1_ = 0;
   
   // 累加所有装备的宝石战斗力
   if(wuqi.item)
   {
      _loc1_ += bszdl(wuqi.item.dong1) + bszdl(wuqi.item.dong2);
   }
   if(toukui.item)
   {
      _loc1_ += bszdl(toukui.item.dong1) + bszdl(toukui.item.dong2);
   }
   if(shouzhuo.item)
   {
      _loc1_ += bszdl(shouzhuo.item.dong1) + bszdl(shouzhuo.item.dong2);
   }
   if(xianglian.item)
   {
      _loc1_ += bszdl(xianglian.item.dong1) + bszdl(xianglian.item.dong2);
   }
   if(yifu.item)
   {
      _loc1_ += bszdl(yifu.item.dong1) + bszdl(yifu.item.dong2);
   }
   if(zhanxie.item)
   {
      _loc1_ += bszdl(zhanxie.item.dong1) + bszdl(zhanxie.item.dong2);
   }
   
   return _loc1_;
}

// ------------------------------------------------------------
// getbsexp() - 获取宝石经验加成
// 
// 功能：
// 计算所有镶嵌宝石的经验加成总和
// 
// 参数：无
// 
// 返回值：Number - 经验加成（0-6.0）
// ------------------------------------------------------------
function getbsexp()
{
   var _loc1_ = 0;
   
   // 累加所有装备的宝石经验加成
   if(wuqi.item)
   {
      _loc1_ += bsjy(wuqi.item.dong1) + bsjy(wuqi.item.dong2);
   }
   if(toukui.item)
   {
      _loc1_ += bsjy(toukui.item.dong1) + bsjy(toukui.item.dong2);
   }
   if(shouzhuo.item)
   {
      _loc1_ += bsjy(shouzhuo.item.dong1) + bsjy(shouzhuo.item.dong2);
   }
   if(xianglian.item)
   {
      _loc1_ += bsjy(xianglian.item.dong1) + bsjy(xianglian.item.dong2);
   }
   if(yifu.item)
   {
      _loc1_ += bsjy(yifu.item.dong1) + bsjy(yifu.item.dong2);
   }
   if(zhanxie.item)
   {
      _loc1_ += bsjy(zhanxie.item.dong1) + bsjy(zhanxie.item.dong2);
   }
   
   return _loc1_;
}

// ------------------------------------------------------------
// bszdl(bs) - 计算宝石战斗力
// 
// 功能：
// 根据宝石名称返回战斗力加成
// 
// 参数：
// - bs: String - 宝石名称
// 
// 返回值：Number - 战斗力加成
// 
// 宝石战斗力：
// - 中级战斗力石：+3
// - 高级战斗力石：+5
// - 其他：+0
// ------------------------------------------------------------
function bszdl(bs)
{
   // 统计高级宝石数量
   switch(bs)
   {
      case "高级经验石":
      case "高级战斗力石":
         bestbszdl += 1;
   }
   
   // 返回战斗力加成
   switch(bs)
   {
      case "中级战斗力石":
         return 3;
      case "高级战斗力石":
         return 5;
      default:
         return 0;
   }
}

// ------------------------------------------------------------
// bsjy(bs) - 计算宝石经验加成
// 
// 功能：
// 根据宝石名称返回经验加成
// 
// 参数：
// - bs: String - 宝石名称
// 
// 返回值：Number - 经验加成（0-0.5）
// 
// 宝石经验加成：
// - 中级经验石：+25%
// - 高级经验石：+50%
// - 其他：+0%
// ------------------------------------------------------------
function bsjy(bs)
{
   switch(bs)
   {
      case "中级经验石":
         return 0.25;
      case "高级经验石":
         return 0.5;
      default:
         return 0;
   }
}

// ------------------------------------------------------------
// getxgj() - 获取装备最小攻击加成
// 
// 功能：
// 计算所有装备的最小攻击力加成
// 
// 参数：无
// 
// 返回值：Number - 最小攻击加成
// 
// 加成来源：
// - 武器：基础攻击+附加攻击
// - 手镯：基础攻击+附加攻击
// - 项链：基础攻击+附加攻击
// ------------------------------------------------------------
function getxgj()
{
   var _loc1_ = 0;
   
   // 武器攻击加成
   if(wuqi.item)
   {
      _loc1_ += wuqi.item.xgj + wuqi.item.fxgj;
   }
   // 头盔无攻击加成
   if(!toukui.item)
   {
   }
   // 手镯攻击加成
   if(shouzhuo.item)
   {
      _loc1_ += shouzhuo.item.xgj + shouzhuo.item.fxgj;
   }
   // 项链攻击加成
   if(xianglian.item)
   {
      _loc1_ += xianglian.item.xgj + xianglian.item.fxgj;
   }
   // 衣服无攻击加成
   if(!yifu.item)
   {
   }
   // 战鞋无攻击加成
   if(!zhanxie.item)
   {
   }
   
   return _loc1_;
}

// ------------------------------------------------------------
// getdgj() - 获取装备最大攻击加成
// 
// 功能：
// 计算所有装备的最大攻击力加成
// 
// 参数：无
// 
// 返回值：Number - 最大攻击加成
// ------------------------------------------------------------
function getdgj()
{
   var _loc1_ = 0;
   
   // 武器攻击加成
   if(wuqi.item)
   {
      _loc1_ += wuqi.item.dgj + wuqi.item.fdgj;
   }
   // 头盔无攻击加成
   if(!toukui.item)
   {
   }
   // 手镯攻击加成
   if(shouzhuo.item)
   {
      _loc1_ += shouzhuo.item.dgj + shouzhuo.item.fdgj;
   }
   // 项链攻击加成
   if(xianglian.item)
   {
      _loc1_ += xianglian.item.dgj + xianglian.item.fdgj;
   }
   // 衣服无攻击加成
   if(!yifu.item)
   {
   }
   // 战鞋无攻击加成
   if(!zhanxie.item)
   {
   }
   
   return _loc1_;
}

// ------------------------------------------------------------
// getfy() - 获取装备防御加成
// 
// 功能：
// 计算所有装备的防御力加成
// 
// 参数：无
// 
// 返回值：Number - 防御加成
// 
// 加成来源：
// - 头盔：基础防御+附加防御
// - 衣服：基础防御+附加防御
// - 战鞋：基础防御+附加防御
// ------------------------------------------------------------
function getfy()
{
   var _loc1_ = 0;
   
   // 武器无防御加成
   if(!wuqi.item)
   {
   }
   // 头盔防御加成
   if(toukui.item)
   {
      _loc1_ += toukui.item.fy + toukui.item.ffy;
   }
   // 手镯无防御加成
   if(!shouzhuo.item)
   {
   }
   // 项链无防御加成
   if(!xianglian.item)
   {
   }
   // 衣服防御加成
   if(yifu.item)
   {
      _loc1_ += yifu.item.fy + yifu.item.ffy;
   }
   // 战鞋防御加成
   if(zhanxie.item)
   {
      _loc1_ += zhanxie.item.fy + zhanxie.item.ffy;
   }
   
   return _loc1_;
}

// ------------------------------------------------------------
// clearall() - 清空所有装备
// 
// 功能：
// 卸下所有装备并清空槽位
// 
// 参数：无
// 
// 返回值：无
// ------------------------------------------------------------
function clearall()
{
   // 移除武器
   removeMovieClip(wuqi.item);
   wuqi.item = false;
   // 移除头盔
   removeMovieClip(toukui.item);
   toukui.item = false;
   // 移除项链
   removeMovieClip(xianglian.item);
   xianglian.item = false;
   // 移除手镯
   removeMovieClip(shouzhuo.item);
   shouzhuo.item = false;
   // 移除战鞋
   removeMovieClip(zhanxie.item);
   zhanxie.item = false;
   // 移除衣服
   removeMovieClip(yifu.item);
   yifu.item = false;
}

// ------------------------------------------------------------
// zhmiss() - 计算地魂闪避加成
// 
// 功能：
// 计算地魂套装的闪避率加成
// 
// 参数：无
// 
// 返回值：Number - 闪避率（0-60%）
// 
// 算法说明：
// - 每件地魂装备提供 zhdj * 2% 的闪避率
// - zhtype=2 表示地魂装备
// ------------------------------------------------------------
function zhmiss()
{
   // 检查是否开启战魂系统
   if(_root.openzh != true)
   {
      return 0;
   }
   
   var _loc2_ = 0;
   var _loc3_ = 2;  // 每级战魂提供的闪避率
   
   // 累加所有地魂装备的闪避率
   if(wuqi.item.zhtype == 2)
   {
      _loc2_ += wuqi.item.zhdj * _loc3_;
   }
   if(toukui.item.zhtype == 2)
   {
      _loc2_ += toukui.item.zhdj * _loc3_;
   }
   if(shouzhuo.item.zhtype == 2)
   {
      _loc2_ += shouzhuo.item.zhdj * _loc3_;
   }
   if(xianglian.item.zhtype == 2)
   {
      _loc2_ += xianglian.item.zhdj * _loc3_;
   }
   if(yifu.item.zhtype == 2)
   {
      _loc2_ += yifu.item.zhdj * _loc3_;
   }
   if(zhanxie.item.zhtype == 2)
   {
      _loc2_ += zhanxie.item.zhdj * _loc3_;
   }
   
   return _loc2_;
}

// ------------------------------------------------------------
// zhgj() - 计算天魂攻击加成
// 
// 功能：
// 计算天魂套装的攻击力百分比加成
// 
// 参数：无
// 
// 返回值：Number - 攻击力加成比例（0-0.3）
// 
// 算法说明：
// - 每件天魂装备提供 zhdj * 5% 的攻击力加成
// - zhtype=1 表示天魂装备
// ------------------------------------------------------------
function zhgj()
{
   // 检查是否开启战魂系统
   if(_root.openzh != true)
   {
      return 0;
   }
   
   var _loc2_ = 0;
   var _loc3_ = 0.05;  // 每级战魂提供的攻击力加成比例
   
   // 累加所有天魂装备的攻击力加成
   if(wuqi.item.zhtype == 1)
   {
      _loc2_ += wuqi.item.zhdj * _loc3_;
   }
   if(toukui.item.zhtype == 1)
   {
      _loc2_ += toukui.item.zhdj * _loc3_;
   }
   if(shouzhuo.item.zhtype == 1)
   {
      _loc2_ += shouzhuo.item.zhdj * _loc3_;
   }
   if(xianglian.item.zhtype == 1)
   {
      _loc2_ += xianglian.item.zhdj * _loc3_;
   }
   if(yifu.item.zhtype == 1)
   {
      _loc2_ += yifu.item.zhdj * _loc3_;
   }
   if(zhanxie.item.zhtype == 1)
   {
      _loc2_ += zhanxie.item.zhdj * _loc3_;
   }
   
   return _loc2_;
}

// ------------------------------------------------------------
// zhzdlrace() - 计算战魂战斗力加成
// 
// 参数：无
// 
// 返回值：Number - 战斗力加成比例（0-0.05）
// ------------------------------------------------------------
function zhzdlrace()
{
   // 隐藏战魂等级显示
   this.zhdenjie._visible = false;
   
   // 检查是否开启战魂系统
   if(_root.openzh != true)
   {
      return 0;
   }
   
   // 返回战魂等级 * 5% 的战斗力加成
   return zhjj() * 5 / 100;
}

// ------------------------------------------------------------
// zhjj() - 获取战魂套装等级
// 
// 功能：
// 计算战魂套装的等级（取所有装备中最低的战魂等级）
// 
// 参数：无
// 
// 返回值：Number - 战魂套装等级（0-5）
// 
// 算法说明：
// - 只有6件装备都有战魂时才返回等级
// - 返回最低的战魂等级
// ------------------------------------------------------------
function zhjj()
{
   var _loc2_;
   
   // 检查是否所有装备都有战魂
   if(_root.openzh == true && wuqi.item.zhdj > 0 && toukui.item.zhdj > 0 && shouzhuo.item.zhdj > 0 && xianglian.item.zhdj > 0 && yifu.item.zhdj > 0 && zhanxie.item.zhdj > 0)
   {
      // 初始值为5
      _loc2_ = 5;
      
      // 取最低的战魂等级
      _loc2_ = _loc2_ > wuqi.item.zhdj ? wuqi.item.zhdj : _loc2_;
      _loc2_ = _loc2_ > toukui.item.zhdj ? toukui.item.zhdj : _loc2_;
      _loc2_ = _loc2_ > shouzhuo.item.zhdj ? shouzhuo.item.zhdj : _loc2_;
      _loc2_ = _loc2_ > xianglian.item.zhdj ? xianglian.item.zhdj : _loc2_;
      _loc2_ = _loc2_ > yifu.item.zhdj ? yifu.item.zhdj : _loc2_;
      _loc2_ = _loc2_ > zhanxie.item.zhdj ? zhanxie.item.zhdj : _loc2_;
      
      return _loc2_;
   }
   
   return 0;
}

// ------------------------------------------------------------
// zhth() - 检查是否激活天魂套装
// 
// 功能：
// 检查是否所有装备都是天魂类型
// 
// 参数：无
// 
// 返回值：Number - 1表示激活，0表示未激活
// ------------------------------------------------------------
function zhth()
{
   // 检查是否开启战魂系统
   if(_root.openzh != true)
   {
      return 0;
   }
   
   // 检查所有装备是否都是天魂类型（zhtype=1）
   if(wuqi.item.zhtype != 1)
   {
      return 0;
   }
   if(toukui.item.zhtype != 1)
   {
      return 0;
   }
   if(shouzhuo.item.zhtype != 1)
   {
      return 0;
   }
   if(xianglian.item.zhtype != 1)
   {
      return 0;
   }
   if(yifu.item.zhtype != 1)
   {
      return 0;
   }
   if(zhanxie.item.zhtype != 1)
   {
      return 0;
   }
   
   return 1;
}

// ------------------------------------------------------------
// zhdh() - 检查是否激活地魂套装
// 
// 功能：
// 检查是否所有装备都是地魂类型
// 
// 参数：无
// 
// 返回值：Number - 1表示激活，0表示未激活
// ------------------------------------------------------------
function zhdh()
{
   // 检查是否开启战魂系统
   if(_root.openzh != true)
   {
      return 0;
   }
   
   // 检查所有装备是否都是地魂类型（zhtype=2）
   if(wuqi.item.zhtype != 2)
   {
      return 0;
   }
   if(toukui.item.zhtype != 2)
   {
      return 0;
   }
   if(shouzhuo.item.zhtype != 2)
   {
      return 0;
   }
   if(xianglian.item.zhtype != 2)
   {
      return 0;
   }
   if(yifu.item.zhtype != 2)
   {
      return 0;
   }
   if(zhanxie.item.zhtype != 2)
   {
      return 0;
   }
   
   return 1;
}

// ============================================================
// 初始化代码
// ============================================================

// 保存当前深度
mydepth = getDepth();

// 初始化源对象
src = null;

// 界面位置设置
show_x = 210;
show_y = 85;
hide_x = 800;
hite_y = 600;

// 初始隐藏界面
closeme();

// 宝石战斗力变量
var bestbszdl;
