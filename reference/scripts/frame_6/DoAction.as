// ============================================================
// frame_6/DoAction.as - 核心游戏逻辑
// ============================================================
// 功能说明：
// 本文件是游戏的核心逻辑文件，包含游戏的主要功能函数和全局变量初始化
// 这是游戏主循环的入口点，负责初始化游戏状态和提供全局工具函数
// 
// 主要功能：
// 1. 每日重置系统 (nextday) - 处理新的一天的各种重置逻辑
// 2. BOSS刷新系统 (flashboss) - 随机刷新各等级BOSS
// 3. 怪物刷新系统 (flashgw, flashmj) - 刷新地图怪物和魔军
// 4. 装备生成系统 (weapon) - 生成随机装备
// 5. 幻兽评分系统 (pfxgj, pfdgj, pffy, pfhp, pfc) - 计算幻兽属性评分
// 6. 幻兽幻化系统 (huanhua, fuhuanhua, cuhuanhua) - 幻兽合成强化
// 7. 救出国王剧情 (TouchStory) - 触发救出国王的剧情事件
// 8. UI工具函数 (CloseAll, msgbox, alertbox) - 关闭界面、显示消息
// 9. 恢复系统 (returnhp) - 恢复角色和幻兽的生命值
// 
// 全局变量：
// - nowmap: String - 当前地图名称
// - nextmap: Boolean - 是否可以切换地图
// - owermap: String - 拥有的地图名称（地图赛奖励）
// - mapreward: Boolean - 地图奖励是否可领取
// - pk_race: Boolean - PK比赛是否开启（周六）
// - map_race: Boolean - 地图赛是否开启
// - king: Boolean - 是否已救出国王
// - manexpball: Number - 满经验球剩余使用次数
// - useds_num: Number - 每日使用物品次数
// - havesaved: Boolean - 是否已保存
// 
// 调用关系：
// - 被 frame_4, frame_5 等帧调用（游戏初始化）
// - 调用 _root.xinxi (角色信息), _root.huanshoumb (幻兽背包)
// - 调用 _root.beibao (背包系统), _root.mc_day (时间系统)
// ============================================================

// ------------------------------------------------------------
// returnhp() - 恢复生命值和体力
// 
// 功能：
// 恢复角色和所有幻兽的HP到最大值，并自动设置出征幻兽
// 
// 参数：无
// 
// 返回值：无
// 
// 调用关系：
// - 被 nextday() 调用（每日重置）
// - 被 frame_7/DoAction.as 调用（读取存档）
// - 调用 _root.xinxi.upxx() 更新角色界面
// - 调用 _root.huanshoumb.chuzhengbb() 设置出征幻兽
// - 调用 czmb0.updata(), czmb1.updata() 更新出征幻兽界面
// 
// 算法说明：
// 1. 恢复角色HP和体力到最大值
// 2. 遍历幻兽背包，恢复所有幻兽HP
// 3. 如果第一个出征位置为空，自动设置第一只幻兽出征
// 4. 如果第二个出征位置为空，自动设置第二只幻兽出征
// ------------------------------------------------------------
function returnhp()
{
   // 恢复角色HP到最大值
   _root.xinxi.hp = _root.xinxi.mhp;
   // 恢复角色体力到最大值
   _root.xinxi.tl = _root.xinxi.mtl;
   // 更新角色信息界面
   _root.xinxi.upxx();
   
   // 遍历幻兽背包，恢复所有幻兽HP
   i = 0;
   while(i < _root.huanshoumb.maxbb)
   {
      // 如果该位置有幻兽
      if(_root.huanshoumb.array[i])
      {
         // 恢复幻兽HP到最大值
         _root.huanshoumb.array[i].hp = _root.huanshoumb.array[i].mhp;
      }
      i++;
   }
   
   // 处理第一个出征幻兽位置
   if(_root.czmb0._visible)
   {
      // 如果已有幻兽出征，更新其界面
      czmb0.updata();
   }
   else if(_root.huanshoumb.array[0])
   {
      // 如果没有幻兽出征但背包有幻兽，自动设置第一只出征
      _root.huanshoumb.chuzhengbb(_root.huanshoumb.array[0]);
   }
   
   // 处理第二个出征幻兽位置
   if(_root.czmb1._visible)
   {
      // 如果已有幻兽出征，更新其界面
      czmb1.updata();
   }
   else if(_root.huanshoumb.array[1])
   {
      // 如果没有幻兽出征但背包有幻兽，自动设置第二只出征
      _root.huanshoumb.chuzhengbb(_root.huanshoumb.array[1]);
   }
}
// ------------------------------------------------------------
// nextday() - 新的一天处理
// 
// 功能：
// 处理每日重置逻辑，包括恢复HP、刷新BOSS、重置任务等
// 
// 参数：无
// 
// 返回值：无
// 
// 调用关系：
// - 被 _root.mc_day 调用（时间系统到达新的一天）
// - 调用 returnhp() 恢复HP
// - 调用 flashboss() 刷新BOSS
// - 调用 flashgw() 刷新怪物
// - 调用 flashmj() 刷新魔军
// - 调用 _root.mc_nextday.openme() 显示新的一天动画
// - 调用 _root.alertbox(), _root.msgbox() 显示提示信息
// 
// 重置内容：
// 1. 每日使用次数重置
// 2. 满经验球使用次数重置为5次
// 3. 地图奖励可领取标记
// 4. 周六PK比赛开启
// 5. 周五雪域边境怪物刷新
// 6. BOSS随机刷新
// 7. 怪物和魔军刷新
// 8. 周日军饷领取和公主礼物提示
// ------------------------------------------------------------
function nextday()
{
   // 重置每日使用物品次数
   useds_num = 1;
   // 标记为未保存状态
   havesaved = false;
   // 显示新的一天动画
   mc_nextday.openme();
   
   // 2008奥运活动处理
   if(pro2008now < pro2008all)
   {
      // 随机显示1-9号奥运项目
      pro2008show = random(9) + 1;
   }
   else
   {
      // 活动已完成，不显示
      pro2008show = 0;
   }
   
   // 恢复角色和幻兽HP
   returnhp();
   
   // 重置满经验球使用次数为5次
   manexpball = 5;
   
   // 如果拥有地图，设置地图奖励可领取
   if(owermap != "")
   {
      mapreward = true;
   }
   
   // 开启地图赛
   map_race = true;
   
   // 周六特殊处理（nowday % 7 == 6 表示周六）
   if(_root.mc_day.nowday % 7 == 6)
   {
      // 开启PK比赛
      pk_race = true;
      // 显示提示消息
      _root.tsmsg.openme();
      // 重置地下城怪物任务
      rw_gw1_1 = true;  // 地下城1层怪物1
      rw_gw1_2 = true;  // 地下城1层怪物2
      rw_gw1_3 = true;  // 地下城1层怪物3
      rw_gw2_1 = true;  // 地下城2层怪物1
      rw_gw2_2 = true;  // 地下城2层怪物2
      rw_gw3_1 = true;  // 地下城3层怪物
   }
   else
   {
      // 非周六，关闭PK比赛
      pk_race = false;
   }
   
   // 周五特殊处理（nowday % 7 == 5 表示周五）
   if(_root.mc_day.nowday % 7 == 5)
   {
      // 刷新雪域边境怪物
      gw_xybj_1 = gw_xybj_2 = gw_xybj_3 = gw_xybj_4 = gw_xybj_5 = true;
   }
   
   // 重置各种交互权限
   shinv2item = true;  // 商人道具购买权限
   gzchat = true;      // 公主聊天权限
   gzgive = true;      // 公主赠送权限
   gzgift = true;      // 公主礼物权限
   yspay = true;       // 元帅支付权限
   
   // 重置任务标记
   rw_bs = true;       // BOSS任务
   rw_hs = true;       // 幻兽任务
   rw_dxc = true;      // 地下城任务
   
   // 刷新BOSS、怪物、魔军
   flashboss();
   flashgw();
   flashmj();
   
   // 增加军饷累计数量
   hsyjs_number += hsyjs_rate;
   
   // 周日特殊处理（nowday % 7 == 0 表示周日）
   if(_root.mc_day.nowday % 7 == 0)
   {
      // 开启军饷领取
      rw_hsyjs = true;
      // 更新军饷计数
      _root.hsyjs.goupjs();
      // 提示玩家领取军饷和公主礼物
      _root.alertbox("今天是星期天啦，如果你有军衔了就可以去元帅那里领取军饷，如果你认识了公主那今天她会送你一份礼物。");
      
      // 如果与公主有关系，提示送花
      if(_root.xinxi.gzgx > 0)
      {
         _root.alertbox("公主是你的" + _root.xinxi.gxname + "。星期天了，公主很想收到一束漂亮的鲜花，你是否会给她送上一束呢。");
      }
   }
   
   // 显示新的一天消息
   _root.msgbox("新的一天到来了，后有的幻兽生命值都回复到满了。");
}
// ------------------------------------------------------------
// flashboss() - BOSS刷新
// 
// 功能：
// 随机刷新各等级BOSS，每天刷新一次
// 
// 参数：无
// 
// 返回值：无
// 
// 调用关系：
// - 被 nextday() 调用（每日重置）
// - 被 frame_6 初始化调用
// 
// BOSS刷新概率：
// | BOSS变量 | BOSS等级 | 刷新概率 | 刷新条件 |
// |---------|---------|---------|---------|
// | boss10 | 10级BOSS | 55% | random(100) < 55 |
// | boss20 | 20级BOSS | 45% | random(100) > 55 |
// | boss30 | 30级BOSS | 33% | random(100) < 33 |
// | boss50 | 50级BOSS | 23% | random(100) > 77 |
// | boss70 | 70级BOSS | 33% | random(100) < 33 |
// | boss90 | 90级BOSS | 23% | random(100) > 77 |
// | boss100 | 100级BOSS | 33% | random(100) < 33 |
// | bossZZ | 最终BOSS | 23% | random(100) > 77 |
// | bossDZZ | 超级最终BOSS | 33% | random(100) < 33 |
// 
// 算法说明：
// 1. 先将所有BOSS标记为false（未刷新）
// 2. 对每个BOSS独立进行随机判定
// 3. 低级BOSS刷新概率较高，高级BOSS刷新概率较低
// ------------------------------------------------------------
function flashboss()
{
   // 先将所有BOSS标记为未刷新
   boss10 = boss20 = boss30 = boss50 = boss70 = boss90 = boss100 = bossZZ = bossDZZ = false;
   
   // 10级BOSS：55%概率刷新
   if(random(100) < 55)
   {
      boss10 = true;
   }
   
   // 20级BOSS：45%概率刷新（random(100) > 55 等同于 random(100) >= 56，概率44%）
   if(random(100) > 55)
   {
      boss20 = true;
   }
   
   // 30级BOSS：33%概率刷新
   if(random(100) < 33)
   {
      boss30 = true;
   }
   
   // 50级BOSS：23%概率刷新（random(100) > 77 等同于 random(100) >= 78，概率22%）
   if(random(100) > 77)
   {
      boss50 = true;
   }
   
   // 70级BOSS：33%概率刷新
   if(random(100) < 33)
   {
      boss70 = true;
   }
   
   // 90级BOSS：23%概率刷新
   if(random(100) > 77)
   {
      boss90 = true;
   }
   
   // 100级BOSS：33%概率刷新
   if(random(100) < 33)
   {
      boss100 = true;
   }
   
   // 最终BOSS：23%概率刷新
   if(random(100) > 77)
   {
      bossZZ = true;
   }
   
   // 超级最终BOSS：33%概率刷新
   if(random(100) < 33)
   {
      bossDZZ = true;
   }
}

// ------------------------------------------------------------
// flashgw() - 怪物刷新
// 
// 功能：
// 刷新各地图的怪物，每天刷新一次
// 
// 参数：无
// 
// 返回值：无
// 
// 调用关系：
// - 被 nextday() 调用（每日重置）
// - 被 frame_6 初始化调用
// 
// 刷新的怪物：
// | 变量名 | 地图 | 怪物数量 |
// |--------|------|---------|
// | gw_lmdl_1 | 雷鸣大陆 | 1个 |
// | gw_gb_1~5 | 戈壁 | 5个 |
// | gw_mmzz_1~4 | 迷梦沼泽 | 4个 |
// | gw_bg_1~4 | 冰宫 | 4个 |
// | gw_ywtd_1~4 | 亚维特岛 | 4个 |
// | gw_hs_1~5 | 海神庙 | 5个 |
// | gw_symg_1~6 | 树心迷宫 | 6个 |
// ------------------------------------------------------------
function flashgw()
{
   // 雷鸣大陆怪物
   gw_lmdl_1 = true;
   
   // 戈壁怪物（5个）
   gw_gb_1 = gw_gb_2 = gw_gb_3 = gw_gb_4 = gw_gb_5 = true;
   
   // 迷梦沼泽怪物（4个）
   gw_mmzz_1 = gw_mmzz_2 = gw_mmzz_3 = gw_mmzz_4 = true;
   
   // 冰宫怪物（4个）
   gw_bg_1 = gw_bg_2 = gw_bg_3 = gw_bg_4 = true;
   
   // 亚维特岛怪物（4个）
   gw_ywtd_1 = gw_ywtd_2 = gw_ywtd_3 = gw_ywtd_4 = true;
   
   // 海神庙怪物（5个）
   gw_hs_1 = gw_hs_2 = gw_hs_3 = gw_hs_4 = gw_hs_5 = true;
   
   // 树心迷宫怪物（6个）
   gw_symg_1 = gw_symg_2 = gw_symg_3 = gw_symg_4 = gw_symg_5 = gw_symg_6 = true;
}

// ------------------------------------------------------------
// flashmj() - 魔军刷新
// 
// 功能：
// 刷新魔族军队，每天刷新一次
// 如果魔军已被击败，会显示复活提示
// 
// 参数：无
// 
// 返回值：无
// 
// 调用关系：
// - 被 nextday() 调用（每日重置）
// 
// 魔军类型：
// | 变量名 | 魔军类型 |
// |--------|---------|
// | mj_gj | 魔军攻击型 |
// | mj_fy | 魔军防御型 |
// | mj_tt | 魔军突击型 |
// | mj_sm | 魔军生命型 |
// | mj_zs | 魔军主帅 |
// | mj_nl | 魔军能量型 |
// 
// 特殊逻辑：
// - 如果已救出国王（king == true），会显示魔军复活提示
// ------------------------------------------------------------
function flashmj()
{
   // 检查是否有魔军被击败
   if(_root.mj_gj == false || _root.mj_fy == false || _root.mj_tt == false || _root.mj_sm == false || _root.mj_zs == false || _root.mj_nl == false)
   {
      // 如果已救出国王，显示魔军复活提示
      if(_root.king == true)
      {
         _root.alertbox("\r黑夜到来时，魔的能量将\r所有死亡的魔族军队复活了");
      }
   }
   
   // 刷新所有魔军
   _root.mj_gj = _root.mj_fy = _root.mj_tt = _root.mj_sm = _root.mj_zs = _root.mj_nl = true;
}
// ------------------------------------------------------------
// hidegw() - 隐藏怪物
// 
// 功能：
// 隐藏当前显示的怪物
// 
// 参数：无
// 
// 返回值：无
// 
// 调用关系：
// - 被各地图帧调用（切换地图时）
// 
// 算法说明：
// 通过动态变量名（mb_visible）来隐藏当前显示的怪物
// mb_visible存储的是当前显示怪物的变量名
// ------------------------------------------------------------
function hidegw()
{
   // 如果有怪物正在显示
   if(mb_visible != "")
   {
      // 隐藏该怪物
      this[mb_visible] = false;
   }
}

// ------------------------------------------------------------
// TouchStory() - 救出国王剧情
// 
// 功能：
// 触发救出国王的剧情事件，这是游戏主线剧情之一
// 
// 参数：无
// 
// 返回值：无
// 
// 调用关系：
// - 被击败魔军主帅后调用
// - 调用 _root.storymsg.openme() 显示剧情文本
// - 调用 _root.xinxi.upjw() 更新爵位
// - 调用 _root.beibao.subms() 增加魔石
// 
// 剧情逻辑：
// 1. 标记国王已被救出（king = true）
// 2. 如果爵位等级>=5，授予王爵位（爵位等级6）
// 3. 否则奖励200,000魔石
// 4. 显示剧情文本
// 
// 注意：
// - 此函数只会执行一次（通过king变量控制）
// ------------------------------------------------------------
function TouchStory()
{
   var _loc2_;
   
   // 只在国王未被救出时执行
   if(king == false)
   {
      // 标记国王已被救出
      king = true;
      
      // 构建剧情文本
      _loc2_ = "　　" + _root.xinxi.myname + "击败魔族的高级军官了，并救出国王......";
      _loc2_ += "\r　　随着国王的回来，人类军队的士气被激起到了最高点，他们已经准备好与魔族大军决战到底。";
      
      // 根据爵位等级给予不同奖励
      if(_root.xinxi.jwdj >= 5)
      {
         // 爵位>=5级，授予王爵位
         _loc2_ += "\r　　因为英勇地救出了国王，你被授与王爵位。";
         _root.xinxi.jwexp = _root.xinxi.jwdjexp[5];  // 设置爵位经验
         _root.xinxi.jwdj = 6;  // 设置爵位等级为王爵
         _root.xinxi.upjw(0);   // 更新爵位
      }
      else
      {
         // 爵位<5级，奖励魔石
         _loc2_ += "\r　　由于你的英勇作战，你获得了200,000魔石奖励。";
         _root.beibao.subms(200000);  // 增加200,000魔石
      }
      
      // 添加后续提示
      _loc2_ += "\r　　快回皇宫看年国王对于与魔族大军决战有什么策略吧......";
      
      // 显示剧情文本
      _root.storymsg.openme(_loc2_);
   }
}

// ------------------------------------------------------------
// weapon(setpz, setmhdj, setdong) - 生成装备
// 
// 功能：
// 生成随机装备，用于BOSS掉落、任务奖励等
// 
// 参数：
// - setpz: Number - 装备品质（1=普通, 2=良好, 3=优秀, 4=精品, 5=传说）
// - setmhdj: Number - 追加等级（0-12）
// - setdong: Number - 镶嵌孔数（0-3）
// 
// 返回值：无
// 
// 调用关系：
// - 被BOSS掉落、任务奖励等调用
// - 调用 _root.beibao.more(this) 将装备添加到背包
// 
// 算法说明：
// 1. 设置装备品质、追加等级、镶嵌孔数
// 2. 根据玩家等级确定装备等级（向下取整到10的倍数）
// 3. 随机选择装备类型（武器、头盔、项链、衣服、手镯、战鞋）
// 4. 调用背包系统添加装备
// 
// 装备等级规则：
// - 玩家等级<10：装备等级=10
// - 玩家等级>=100：装备等级=100
// - 其他：装备等级=玩家等级向下取整到10的倍数
// ------------------------------------------------------------
function weapon(setpz, setmhdj, setdong)
{
   // 设置装备品质
   pz = setpz;
   // 设置追加等级
   mhdj = setmhdj;
   // 设置镶嵌孔数
   dong = setdong;
   
   // 根据玩家等级确定装备等级
   if(_root.xinxi.dj < 10)
   {
      // 等级<10，装备等级为10
      dj = 10;
   }
   else if(_root.xinxi.dj >= 100)
   {
      // 等级>=100，装备等级为100
      dj = 100;
   }
   else
   {
      // 其他情况，向下取整到10的倍数
      dj = _root.xinxi.dj - _root.xinxi.dj % 10;
   }
   
   // 随机选择装备类型
   switch(random(6))
   {
      case 0:
         id = "武器";
         break;
      case 1:
         id = "头盔";
         break;
      case 2:
         id = "项链";
         break;
      case 3:
         id = "衣服";
         break;
      case 4:
         id = "手镯";
         break;
      case 5:
      default:
         id = "战鞋";
   }
   
   // 将装备添加到背包
   _root.beibao.more(this);
}
// ------------------------------------------------------------
// CloseAll(baobao) - 关闭所有界面
// 
// 功能：
// 关闭游戏中的所有UI界面，返回主游戏界面
// 
// 参数：
// - baobao: Boolean - 是否关闭幻兽背包界面
// 
// 返回值：无
// 
// 调用关系：
// - 被各地图帧调用（切换地图时）
// - 被战斗系统调用（进入战斗时）
// 
// 关闭的界面：
// - huanshoumb: 幻兽背包
// - huanhuak: 幻兽幻化
// - geiyi: 交易界面
// - baoshironghe: 宝石融合
// - zhuangbeihuanjy: 装备幻境
// - zbjingliank: 装备精炼
// - zhuangbei: 装备栏
// - jineng: 技能栏
// - cangku: 仓库
// - jiahuoshang: 加货商
// - moshishang: 魔石商
// - shoucangjia: 收藏家
// - hsyjs: 军饷领取
// ------------------------------------------------------------
function CloseAll(baobao)
{
   // 如果需要关闭幻兽背包
   if(baobao)
   {
      _root.huanshoumb.closeme();
   }
   
   // 关闭所有其他界面
   _root.huanhuak.closeme();       // 幻兽幻化
   _root.geiyi.closeme();          // 交易界面
   _root.baoshironghe.closeme();   // 宝石融合
   _root.zhuangbeihuanjy.closeme(); // 装备幻境
   _root.zbjingliank.closeme();    // 装备精炼
   _root.zhuangbei.closeme();      // 装备栏
   _root.jineng.closeme();         // 技能栏
   _root.cangku.closeme();         // 仓库
   _root.jiahuoshang.closeme();    // 加货商
   _root.moshishang.closeme();     // 魔石商
   _root.shoucangjia.closeme();    // 收藏家
   _root.hsyjs.closeme();          // 军饷领取
}

// ------------------------------------------------------------
// msgbox(str) - 显示消息框
// 
// 功能：
// 在游戏界面显示一条消息提示
// 
// 参数：
// - str: String - 要显示的消息文本
// 
// 返回值：无
// 
// 调用关系：
// - 被各种游戏事件调用（如新的一天、任务完成等）
// ------------------------------------------------------------
function msgbox(str)
{
   // 设置消息文本
   _root.msg.msgtext.text = str;
   // 播放消息显示动画
   _root.msg.gotoAndPlay(2);
}

// ------------------------------------------------------------
// alertbox(str) - 显示警告框
// 
// 功能：
// 显示一个警告对话框，需要玩家确认
// 
// 参数：
// - str: String - 要显示的警告文本
// 
// 返回值：无
// 
// 调用关系：
// - 被各种游戏事件调用（如剧情提示、错误提示等）
// ------------------------------------------------------------
function alertbox(str)
{
   // 打开警告对话框
   _root.alert.openme(str);
}

// ------------------------------------------------------------
// pfbb(pbb) - 幻兽评分（空函数）
// 
// 功能：
// 幻兽评分函数（未实现）
// 
// 参数：
// - pbb: Object - 幻兽对象
// 
// 返回值：无
// 
// 注意：此函数为空，可能是预留接口
// ------------------------------------------------------------
function pfbb(pbb)
{
}

// ------------------------------------------------------------
// pfxgj(dsc) - 评分最小攻击成长
// 
// 功能：
// 计算幻兽最小攻击成长率的评分
// 
// 参数：
// - dsc: Object - 幻兽对象，包含cz_xgj属性（最小攻击成长率）
// 
// 返回值：Number - 最小攻击成长评分
// 
// 调用关系：
// - 被 huanhua() 调用（幻兽幻化）
// 
// 算法说明：
// 1. 基础值：10（低于此值不加分）
// 2. 0-10分：每分加20分
// 3. 10分以上：每分加100分
// 
// 评分公式：
// - 如果 cz_xgj <= 10: 评分 = 0
// - 如果 10 < cz_xgj <= 20: 评分 = (cz_xgj - 10) * 20
// - 如果 cz_xgj > 20: 评分 = (cz_xgj - 20) * 100 + 10 * 20
// ------------------------------------------------------------
function pfxgj(dsc)
{
   // 基础值：最小攻击成长率低于10不计分
   var _loc3_ = 10;
   // 计算超出基础值的部分
   var _loc2_ = dsc.cz_xgj - _loc3_ <= 0 ? 0 : dsc.cz_xgj - _loc3_;
   
   var _loc1_ = 0;
   // 0-10分的分值
   var _loc4_ = 20;
   // 10分以上的分值
   var _loc6_ = 100;
   
   // 根据超出值计算评分
   if(_loc2_ <= 0)
   {
      // 未超出基础值，不加分
      _loc1_ += 0;
   }
   else if(_loc2_ <= 10)
   {
      // 超出0-10分，每分20分
      _loc1_ += _loc2_ * _loc4_;
   }
   else
   {
      // 超出10分以上，每分100分
      _loc1_ += (_loc2_ - 10) * _loc6_ + _loc4_ * 10;
   }
   
   // 保存评分到幻兽对象
   dsc.pz_cz_xgj = Math.round(_loc1_);
   return Math.round(_loc1_);
}

// ------------------------------------------------------------
// pfdgj(dsc) - 评分最大攻击成长
// 
// 功能：
// 计算幻兽最大攻击成长率的评分
// 
// 参数：
// - dsc: Object - 幻兽对象，包含cz_dgj属性（最大攻击成长率）
// 
// 返回值：Number - 最大攻击成长评分
// 
// 调用关系：
// - 被 huanhua() 调用（幻兽幻化）
// 
// 算法说明：
// 与 pfxgj() 相同，但基础值为15
// ------------------------------------------------------------
function pfdgj(dsc)
{
   // 基础值：最大攻击成长率低于15不计分
   var _loc3_ = 15;
   // 计算超出基础值的部分
   var _loc2_ = dsc.cz_dgj - _loc3_ <= 0 ? 0 : dsc.cz_dgj - _loc3_;
   
   var _loc1_ = 0;
   var _loc4_ = 20;
   var _loc6_ = 100;
   
   if(_loc2_ <= 0)
   {
      _loc1_ += 0;
   }
   else if(_loc2_ <= 10)
   {
      _loc1_ += _loc2_ * _loc4_;
   }
   else
   {
      _loc1_ += (_loc2_ - 10) * _loc6_ + _loc4_ * 10;
   }
   
   dsc.pz_cz_dgj = Math.round(_loc1_);
   return Math.round(_loc1_);
}

// ------------------------------------------------------------
// pffy(dsc) - 评分防御成长
// 
// 功能：
// 计算幻兽防御成长率的评分
// 
// 参数：
// - dsc: Object - 幻兽对象，包含cz_fy属性（防御成长率）
// 
// 返回值：Number - 防御成长评分
// 
// 调用关系：
// - 被 huanhua() 调用（幻兽幻化）
// 
// 算法说明：
// 与 pfxgj() 相同，但基础值为5
// ------------------------------------------------------------
function pffy(dsc)
{
   // 基础值：防御成长率低于5不计分
   var _loc3_ = 5;
   var _loc2_ = dsc.cz_fy - _loc3_ <= 0 ? 0 : dsc.cz_fy - _loc3_;
   
   var _loc1_ = 0;
   var _loc4_ = 20;
   var _loc6_ = 100;
   
   if(_loc2_ <= 0)
   {
      _loc1_ += 0;
   }
   else if(_loc2_ <= 10)
   {
      _loc1_ += _loc2_ * _loc4_;
   }
   else
   {
      _loc1_ += (_loc2_ - 10) * _loc6_ + _loc4_ * 10;
   }
   
   dsc.pz_cz_fy = Math.round(_loc1_);
   return Math.round(_loc1_);
}

// ------------------------------------------------------------
// pfhp(dsc) - 评分生命成长
// 
// 功能：
// 计算幻兽生命成长率的评分
// 
// 参数：
// - dsc: Object - 幻兽对象，包含cz_hp属性（生命成长率）
// 
// 返回值：Number - 生命成长评分
// 
// 调用关系：
// - 被 huanhua() 调用（幻兽幻化）
// 
// 算法说明：
// 与 pfxgj() 相同，但基础值为40
// ------------------------------------------------------------
function pfhp(dsc)
{
   // 基础值：生命成长率低于40不计分
   var _loc3_ = 40;
   var _loc2_ = dsc.cz_hp - _loc3_ <= 0 ? 0 : dsc.cz_hp - _loc3_;
   
   var _loc1_ = 0;
   var _loc4_ = 20;
   var _loc6_ = 100;
   
   if(_loc2_ <= 0)
   {
      _loc1_ += 0;
   }
   else if(_loc2_ <= 10)
   {
      _loc1_ += _loc2_ * _loc4_;
   }
   else
   {
      _loc1_ += (_loc2_ - 10) * _loc6_ + _loc4_ * 10;
   }
   
   dsc.pz_cz_hp = Math.round(_loc1_);
   return Math.round(_loc1_);
}

// ------------------------------------------------------------
// pfc(dsc) - 评分初始属性
// 
// 功能：
// 计算幻兽初始属性的评分
// 
// 参数：
// - dsc: Object - 幻兽对象，包含cxgj, cdgj, cfy, chp属性
// 
// 返回值：Number - 初始属性总评分
// 
// 调用关系：
// - 被 huanhua() 调用（幻兽幻化）
// 
// 算法说明：
// 对初始属性进行评分，每项超出基础值的部分乘以2
// 
// 基础值：
// - 初始最小攻击：15
// - 初始最大攻击：25
// - 初始防御：10
// - 初始生命：100
// ------------------------------------------------------------
function pfc(dsc)
{
   // 各项基础值
   var _loc4_ = 15;  // 初始最小攻击基础值
   var _loc2_ = 25;  // 初始最大攻击基础值
   var _loc3_ = 10;  // 初始防御基础值
   var _loc5_ = 100; // 初始生命基础值
   
   // 计算各项评分（超出基础值的部分乘以2）
   dsc.pz_cxgj = cx = dsc.cxgj - _loc4_ <= 0 ? 0 : (dsc.cxgj - _loc4_) * 2;
   dsc.pz_cdgj = cd = dsc.cdgj - _loc2_ <= 0 ? 0 : (dsc.cdgj - _loc2_) * 2;
   dsc.pz_cfy = cf = dsc.cfy - _loc3_ <= 0 ? 0 : (dsc.cfy - _loc3_) * 2;
   dsc.pz_chp = ch = dsc.chp - _loc5_ <= 0 ? 0 : (dsc.chp - _loc5_) * 2;
   
   // 返回总评分
   return cx + cd + cf + ch;
}
function huanhua(bbz, bbf)
{
   var _loc0_;
   var _loc3_ = ffen = cfen = 0;
   var _loc5_ = z2 = z3 = z4 = f1 = f2 = f3 = f4 = 0;
   var _loc6_ = fcha = ccha = 0;
   var _loc7_ = tf = tc = "";
   if(bbz.hs_name != "年猪")
   {
      cfen = pfc(bbz);
   }
   var _loc11_;
   var _loc10_;
   var _loc8_;
   switch(bbz.hs_name)
   {
      case "攻防型":
         _loc3_ = pfxgj(bbz) + pfdgj(bbz) + pffy(bbz);
         ffen = pfhp(bbz);
         _loc11_ = _loc3_ <= 20 ? 20 : _loc3_;
         _loc10_ = bbf.pz <= 40 ? 40 : bbf.pz;
         _loc8_ = _loc10_ / _loc11_ <= 2 ? _loc10_ / _loc11_ : 2;
         bbz.cz_xgj += _loc5_ = Math.round(_loc8_ * 1 * 10) / 10;
         var _temp_3 = bbz;
         var _temp_2 = "cz_dgj";
         var _temp_1 = bbz.cz_dgj;
         z2 = _loc0_ = Math.round(_loc8_ * 1.2 * 10) / 10;
         _temp_3[_temp_2] = _temp_1 + _loc0_;
         var _temp_6 = bbz;
         var _temp_5 = "cz_fy";
         var _temp_4 = bbz.cz_fy;
         z3 = _loc0_ = Math.round(_loc8_ * 0.8 * 10) / 10;
         _temp_6[_temp_5] = _temp_4 + _loc0_;
         var _temp_9 = bbz;
         var _temp_8 = "cz_hp";
         var _temp_7 = bbz.cz_hp;
         f4 = _loc0_ = fuhuanhua(bbz.cz_hp,bbf.cz_hp);
         _temp_9[_temp_8] = _temp_7 + _loc0_;
         if(bbz.cz_xgj > bbz.cz_dgj)
         {
            z2 += bbz.cz_xgj - bbz.cz_dgj;
            bbz.cz_dgj = bbz.cz_xgj;
         }
         _loc6_ = pfxgj(bbz) + pfdgj(bbz) + pffy(bbz) - _loc3_;
         fcha = pfhp(bbz) - ffen;
         break;
      case "调皮鬼":
         _loc3_ = pfxgj(bbz) + pfdgj(bbz) + pffy(bbz);
         ffen = pfhp(bbz);
         _loc11_ = _loc3_ <= 20 ? 20 : _loc3_;
         _loc10_ = bbf.pz <= 40 ? 40 : bbf.pz;
         _loc8_ = _loc10_ / _loc11_ <= 2 ? _loc10_ / _loc11_ : 2;
         bbz.cz_xgj += _loc5_ = Math.round(_loc8_ * 0.8 * 10) / 10;
         var _temp_12 = bbz;
         var _temp_11 = "cz_dgj";
         var _temp_10 = bbz.cz_dgj;
         z2 = _loc0_ = Math.round(_loc8_ * 1.4 * 10) / 10;
         _temp_12[_temp_11] = _temp_10 + _loc0_;
         var _temp_15 = bbz;
         var _temp_14 = "cz_fy";
         var _temp_13 = bbz.cz_fy;
         z3 = _loc0_ = Math.round(_loc8_ * 0.7 * 10) / 10;
         _temp_15[_temp_14] = _temp_13 + _loc0_;
         var _temp_18 = bbz;
         var _temp_17 = "cz_hp";
         var _temp_16 = bbz.cz_hp;
         f4 = _loc0_ = fuhuanhua(bbz.cz_hp,bbf.cz_hp);
         _temp_18[_temp_17] = _temp_16 + _loc0_;
         if(bbz.cz_xgj > bbz.cz_dgj)
         {
            z2 += bbz.cz_xgj - bbz.cz_dgj;
            bbz.cz_dgj = bbz.cz_xgj;
         }
         _loc6_ = pfxgj(bbz) + pfdgj(bbz) + pffy(bbz) - _loc3_;
         fcha = pfhp(bbz) - ffen;
         break;
      case "吉鲁猪":
         _loc3_ = pfxgj(bbz) + pfdgj(bbz);
         ffen = pffy(bbz) + pfhp(bbz);
         _loc11_ = _loc3_ <= 20 ? 20 : _loc3_;
         _loc10_ = bbf.pz <= 40 ? 40 : bbf.pz;
         _loc8_ = _loc10_ / _loc11_ <= 2 ? _loc10_ / _loc11_ : 2;
         bbz.cz_xgj += _loc5_ = Math.round(_loc8_ * 1.2 * 10) / 10;
         var _temp_21 = bbz;
         var _temp_20 = "cz_dgj";
         var _temp_19 = bbz.cz_dgj;
         z2 = _loc0_ = Math.round(_loc8_ * 1.6 * 10) / 10;
         _temp_21[_temp_20] = _temp_19 + _loc0_;
         var _temp_24 = bbz;
         var _temp_23 = "cz_fy";
         var _temp_22 = bbz.cz_fy;
         f3 = _loc0_ = fuhuanhua(bbz.cz_fy,bbf.cz_fy);
         _temp_24[_temp_23] = _temp_22 + _loc0_;
         var _temp_27 = bbz;
         var _temp_26 = "cz_hp";
         var _temp_25 = bbz.cz_hp;
         f4 = _loc0_ = fuhuanhua(bbz.cz_hp,bbf.cz_hp);
         _temp_27[_temp_26] = _temp_25 + _loc0_;
         if(bbz.cz_xgj > bbz.cz_dgj)
         {
            z2 += bbz.cz_xgj - bbz.cz_dgj;
            bbz.cz_dgj = bbz.cz_xgj;
         }
         _loc6_ = pfxgj(bbz) + pfdgj(bbz) - _loc3_;
         fcha = pffy(bbz) + pfhp(bbz) - ffen;
         break;
      case "奇异兽":
         _loc3_ = pfxgj(bbz) + pfdgj(bbz);
         ffen = pffy(bbz) + pfhp(bbz);
         _loc11_ = _loc3_ <= 20 ? 20 : _loc3_;
         _loc10_ = bbf.pz <= 40 ? 40 : bbf.pz;
         _loc8_ = _loc10_ / _loc11_ <= 2 ? _loc10_ / _loc11_ : 2;
         bbz.cz_xgj += _loc5_ = Math.round(_loc8_ * 1.3 * 10) / 10;
         var _temp_30 = bbz;
         var _temp_29 = "cz_dgj";
         var _temp_28 = bbz.cz_dgj;
         z2 = _loc0_ = Math.round(_loc8_ * 1.3 * 10) / 10;
         _temp_30[_temp_29] = _temp_28 + _loc0_;
         var _temp_33 = bbz;
         var _temp_32 = "cz_fy";
         var _temp_31 = bbz.cz_fy;
         f3 = _loc0_ = fuhuanhua(bbz.cz_fy,bbf.cz_fy);
         _temp_33[_temp_32] = _temp_31 + _loc0_;
         var _temp_36 = bbz;
         var _temp_35 = "cz_hp";
         var _temp_34 = bbz.cz_hp;
         f4 = _loc0_ = fuhuanhua(bbz.cz_hp,bbf.cz_hp);
         _temp_36[_temp_35] = _temp_34 + _loc0_;
         if(bbz.cz_xgj > bbz.cz_dgj)
         {
            z2 += bbz.cz_xgj - bbz.cz_dgj;
            bbz.cz_dgj = bbz.cz_xgj;
         }
         _loc6_ = pfxgj(bbz) + pfdgj(bbz) - _loc3_;
         fcha = pffy(bbz) + pfhp(bbz) - ffen;
         break;
      case "圣天使":
         _loc3_ = pfxgj(bbz) + pfdgj(bbz) + pfhp(bbz);
         ffen = pffy(bbz);
         _loc11_ = _loc3_ <= 20 ? 20 : _loc3_;
         _loc10_ = bbf.pz <= 40 ? 40 : bbf.pz;
         _loc8_ = _loc10_ / _loc11_ <= 2 ? _loc10_ / _loc11_ : 2;
         bbz.cz_xgj += _loc5_ = Math.round(_loc8_ * 0.5 * 10) / 10;
         var _temp_39 = bbz;
         var _temp_38 = "cz_dgj";
         var _temp_37 = bbz.cz_dgj;
         z2 = _loc0_ = Math.round(_loc8_ * 0.8 * 10) / 10;
         _temp_39[_temp_38] = _temp_37 + _loc0_;
         var _temp_42 = bbz;
         var _temp_41 = "cz_hp";
         var _temp_40 = bbz.cz_hp;
         z4 = _loc0_ = Math.round(_loc8_ * 1.8 * 10) / 10;
         _temp_42[_temp_41] = _temp_40 + _loc0_;
         var _temp_45 = bbz;
         var _temp_44 = "cz_fy";
         var _temp_43 = bbz.cz_fy;
         f3 = _loc0_ = fuhuanhua(bbz.cz_fy,bbf.cz_fy);
         _temp_45[_temp_44] = _temp_43 + _loc0_;
         if(bbz.cz_xgj > bbz.cz_dgj)
         {
            z2 += bbz.cz_xgj - bbz.cz_dgj;
            bbz.cz_dgj = bbz.cz_xgj;
         }
         _loc6_ = pfxgj(bbz) + pfdgj(bbz) + pfhp(bbz) - _loc3_;
         fcha = pffy(bbz) - ffen;
         break;
      case "守护":
         _loc3_ = pfxgj(bbz) + pfdgj(bbz);
         ffen = pffy(bbz) + pfhp(bbz);
         _loc11_ = _loc3_ <= 20 ? 20 : _loc3_;
         _loc10_ = bbf.pz <= 40 ? 40 : bbf.pz;
         _loc8_ = _loc10_ / _loc11_ <= 2 ? _loc10_ / _loc11_ : 2;
         bbz.cz_xgj += _loc5_ = Math.round(_loc8_ * 1.4 * 10) / 10;
         var _temp_48 = bbz;
         var _temp_47 = "cz_dgj";
         var _temp_46 = bbz.cz_dgj;
         z2 = _loc0_ = Math.round(_loc8_ * 1.6 * 10) / 10;
         _temp_48[_temp_47] = _temp_46 + _loc0_;
         var _temp_51 = bbz;
         var _temp_50 = "cz_fy";
         var _temp_49 = bbz.cz_fy;
         f3 = _loc0_ = fuhuanhua(bbz.cz_fy,bbf.cz_fy);
         _temp_51[_temp_50] = _temp_49 + _loc0_;
         var _temp_54 = bbz;
         var _temp_53 = "cz_hp";
         var _temp_52 = bbz.cz_hp;
         f4 = _loc0_ = fuhuanhua(bbz.cz_hp,bbf.cz_hp);
         _temp_54[_temp_53] = _temp_52 + _loc0_;
         if(bbz.cz_xgj > bbz.cz_dgj)
         {
            z2 += bbz.cz_xgj - bbz.cz_dgj;
            bbz.cz_dgj = bbz.cz_xgj;
         }
         _loc6_ = pfxgj(bbz) + pfdgj(bbz) - _loc3_;
         fcha = pffy(bbz) + pfhp(bbz) - ffen;
         break;
      case "年猪":
         _loc3_ = pfxgj(bbz) + pfdgj(bbz) + pffy(bbz) + pfhp(bbz);
         _loc11_ = _loc3_ <= 20 ? 20 : _loc3_;
         _loc10_ = bbf.pz <= 40 ? 40 : bbf.pz;
         _loc8_ = _loc10_ / _loc11_ <= 2 ? _loc10_ / _loc11_ : 2;
         bbz.cz_xgj += _loc5_ = Math.round(_loc8_ * 1.1 * 10) / 10;
         var _temp_57 = bbz;
         var _temp_56 = "cz_dgj";
         var _temp_55 = bbz.cz_dgj;
         z2 = _loc0_ = Math.round(_loc8_ * 1.2 * 10) / 10;
         _temp_57[_temp_56] = _temp_55 + _loc0_;
         var _temp_60 = bbz;
         var _temp_59 = "cz_fy";
         var _temp_58 = bbz.cz_fy;
         z3 = _loc0_ = Math.round(_loc8_ * 1 * 10) / 10;
         _temp_60[_temp_59] = _temp_58 + _loc0_;
         var _temp_63 = bbz;
         var _temp_62 = "cz_hp";
         var _temp_61 = bbz.cz_hp;
         z4 = _loc0_ = Math.round(_loc8_ * 1.5 * 10) / 10;
         _temp_63[_temp_62] = _temp_61 + _loc0_;
         if(bbz.cz_xgj > bbz.cz_dgj)
         {
            z2 += bbz.cz_xgj - bbz.cz_dgj;
            bbz.cz_dgj = bbz.cz_xgj;
         }
         _loc6_ = pfxgj(bbz) + pfdgj(bbz) + pffy(bbz) + pfhp(bbz) - _loc3_;
   }
   if(bbz.hs_name != "年猪")
   {
      tc = cuhuanhua(bbz,bbf);
      ccha = pfc(bbz) - cfen;
   }
   _loc7_ += _loc5_ <= 0 ? "" : "最小攻击成长率+" + _loc5_ + "\n";
   _loc7_ += z2 <= 0 ? "" : "最大攻击成长率+" + z2 + "\n";
   _loc7_ += z3 <= 0 ? "" : "防御成长率+" + z3 + "\n";
   _loc7_ += z4 <= 0 ? "" : "生命成长率+" + z4 + "\n";
   tf += f1 <= 0 ? "" : "最小攻击成长率+" + f1 + "\n";
   tf += f2 <= 0 ? "" : "最大攻击成长率+" + f2 + "\n";
   tf += f3 <= 0 ? "" : "防御成长率+" + f3 + "\n";
   tf += f4 <= 0 ? "" : "生命成长率+" + f4 + "\n";
   var _loc9_ = "主属性：+++++++++++ +++加" + _loc6_ + "分" + "\n" + _loc7_;
   _loc9_ += "副属性加分：+++++++++++加" + fcha + "分" + "\n" + tf;
   _loc9_ += "初始属性加分：+++++++++加" + ccha + "分" + "\n" + tc;
   bbz.pz += _loc6_ + fcha + ccha;
   bbz.zs = bbz.zs + 1;
   bbz.predj = bbz.dj;
   bbz.prejy = bbz.jy;
   bbz.premjy = bbz.mjy;
   bbz.jy = 0;
   bbz.mjy = 10;
   bbz.dj = 1;
   bbz.updata();
   if(bbf.chuzheng)
   {
      _root.huanshoumb.zhaohuibb(bbf);
   }
   _root.huanshoumb.getbb(bbf);
   return _loc9_;
}
function fuhuanhua(zf, ff)
{
   var _loc1_ = ff - zf;
   return Math.round((_loc1_ <= 0 ? 0 : _loc1_ * 0.9) * 10) / 10;
}
function cuhuanhua(bbz, bbf)
{
   var _loc2_ = 0;
   var _loc1_ = 0;
   var _loc4_ = "";
   _loc2_ = bbf.cxgj - bbz.cxgj;
   bbz.cxgj += _loc1_ = Math.round(_loc2_ <= 0 ? 0 : _loc2_ * 0.85);
   if(bbz.cxgj > bbz.cdgj)
   {
      bbz.cdgj = bbz.cxgj;
   }
   _loc4_ += _loc1_ <= 0 ? "" : "初始最小攻击+" + _loc1_ + "\n";
   _loc2_ = bbf.cdgj - bbz.cdgj;
   bbz.cdgj += _loc1_ = Math.round(_loc2_ <= 0 ? 0 : _loc2_ * 0.85);
   _loc4_ += _loc1_ <= 0 ? "" : "初始最大攻击+" + _loc1_ + "\n";
   _loc2_ = bbf.cfy - bbz.cfy;
   bbz.cfy += _loc1_ = Math.round(_loc2_ <= 0 ? 0 : _loc2_ * 0.85);
   _loc4_ += _loc1_ <= 0 ? "" : "初始防御+" + _loc1_ + "\n";
   _loc2_ = bbf.chp - bbz.chp;
   bbz.chp += _loc1_ = Math.round(_loc2_ <= 0 ? 0 : _loc2_ * 0.85);
   _loc4_ += _loc1_ <= 0 ? "" : "初始生命+" + _loc1_ + "\n";
   return _loc4_;
}
// ------------------------------------------------------------
// returnmap() - 返回地图
// 
// 功能：
// 返回当前地图或游戏结束画面
// 
// 参数：无
// 
// 返回值：无
// 
// 调用关系：
// - 被战斗结束、剧情结束等调用
// 
// 算法说明：
// 1. 如果当前天数超过总天数，跳转到游戏结束
// 2. 否则跳转到当前地图
// ------------------------------------------------------------
function returnmap()
{
   // 检查是否游戏结束
   if(_root.mc_day.nowday > _root.mc_day.allday)
   {
      // 超过总天数，游戏结束
      gotoAndStop("游戏结束");
   }
   else
   {
      // 返回当前地图
      gotoAndStop(nowmap);
   }
}

// ============================================================
// 游戏初始化代码
// ============================================================
// 以下代码在frame_6加载时执行，负责初始化游戏状态

// 重置时间系统
_root.mc_day.reset();
_root.mc_day.upxx();

// 刷新BOSS和怪物
flashboss();
flashgw();

// 初始化地图相关变量
nextmap = true;           // 允许切换地图
nowmap = "雷鸣大陆";      // 当前地图：雷鸣大陆
owermap = "";             // 拥有的地图（地图赛奖励）
mapreward = false;        // 地图奖励不可领取
pk_race = false;          // PK比赛关闭
map_race = true;          // 地图赛开启

// 初始化交互权限
shinv1item = true;        // 商人道具1购买权限
shinv2item = true;        // 商人道具2购买权限
gzchat = true;            // 公主聊天权限
gzgive = true;            // 公主赠送权限
gzgift = true;            // 公主礼物权限
gzgx4 = false;            // 公主关系4（未解锁）
yspay = true;             // 元帅支付权限

// 初始化剧情标记
king = false;             // 国王未救出

// 初始化任务标记
rw_bs = true;             // BOSS任务可用
rw_hs = true;             // 幻兽任务可用
rw_dxc = true;            // 地下城任务可用
rw_gw1_1 = true;          // 地下城1层怪物1任务
rw_gw1_2 = true;          // 地下城1层怪物2任务
rw_gw1_3 = true;          // 地下城1层怪物3任务
rw_gw2_1 = true;          // 地下城2层怪物1任务
rw_gw2_2 = true;          // 地下城2层怪物2任务
rw_gw3_1 = true;          // 地下城3层怪物任务

// 初始化幻兽相关
bbhh_point = true;        // 幻兽幻化点数可用
manexpball = 5;           // 满经验球使用次数：5次
rw_hsyjs = true;          // 军饷领取任务可用
hsyjs_jsdj = 10;          // 军饷基数等级：10
hsyjs_rate = 0;           // 军饷增长率：0
hsyjs_number = 0;         // 军饷累计数量：0
useds_num = 1;            // 每日使用物品次数：1

// 根据是否读取存档决定跳转
if(_root.laoddata)
{
   // 读取存档，跳转到读取进度画面
   gotoAndStop("读取进度");
}
else
{
   // 新游戏，跳转到当前地图
   gotoAndStop(nowmap);
}

// 初始化其他变量
havesaved = false;        // 未保存
openzh = false;           // 未打开账户
openzhrw = false;         // 未打开账户任务

// 2008奥运活动初始化
pro2008all = 5;           // 活动总数量：5
pro2008now = undefined;   // 当前活动进度：未定义
pro2008show = 0;          // 显示的活动：0

// 军饷系统初始化
_root.hsyjsmaxrate = 6;   // 最大增长率：6
_root.hsyjsvip = 0;       // VIP等级：0
_root.hsyjs_jsdjmax = 120; // 最大基数等级：120

// 魔军初始化
_root.mj_gj = true;       // 魔军攻击型：存在
_root.mj_fy = true;       // 魔军防御型：存在
_root.mj_tt = true;       // 魔军突击型：存在
_root.mj_sm = true;       // 魔军生命型：存在
_root.mj_zs = true;       // 魔军主帅：存在
_root.mj_nl = true;       // 魔军能量型：存在

// 游戏胜利标记
_root.isWin = false;      // 未胜利
