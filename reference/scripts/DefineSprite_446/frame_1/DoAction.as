// ============================================================
// DefineSprite_446/frame_1/DoAction.as - 存档系统
// ============================================================
// 功能说明：
// 本文件是游戏存档系统的核心，使用Flash SharedObject实现本地存储
// 主要功能：
// 1. 保存游戏进度
// 2. 加载游戏进度
// 3. 版本兼容性检查
// ============================================================

function savegame()
{
   moyu_so = SharedObject.getLocal("moyusave");
   moyu_so.clear();
   moyu_so.data.saved = true;
   moyu_so.data.versions = _root.versions;
   moyu_so.data.nextmap = _root.nextmap;
   moyu_so.data.nowmap = _root.nowmap;
   moyu_so.data.owermap = _root.owermap;
   moyu_so.data.mapreward = _root.mapreward;
   moyu_so.data.pk_race = _root.pk_race;
   moyu_so.data.map_race = _root.map_race;
   moyu_so.data.shinv1item = _root.shinv1item;
   moyu_so.data.shinv2item = _root.shinv2item;
   moyu_so.data.gzchat = _root.gzchat;
   moyu_so.data.gzgive = _root.gzgive;
   moyu_so.data.gzgift = _root.gzgift;
   moyu_so.data.gzgx4 = _root.gzgx4;
   moyu_so.data.yspay = _root.yspay;
   moyu_so.data.king = _root.king;
   moyu_so.data.rw_bs = _root.rw_bs;
   moyu_so.data.rw_hs = _root.rw_hs;
   moyu_so.data.rw_dxc = _root.rw_dxc;
   moyu_so.data.rw_gw1_1 = _root.rw_gw1_1;
   moyu_so.data.rw_gw1_2 = _root.rw_gw1_2;
   moyu_so.data.rw_gw1_3 = _root.rw_gw1_3;
   moyu_so.data.rw_gw2_1 = _root.rw_gw2_1;
   moyu_so.data.rw_gw2_2 = _root.rw_gw2_2;
   moyu_so.data.rw_gw3_1 = _root.rw_gw3_1;
   moyu_so.data.bbhh_point = _root.bbhh_point;
   moyu_so.data.manexpball = _root.manexpball;
   moyu_so.data.rw_hsyjs = _root.rw_hsyjs;
   moyu_so.data.hsyjs_jsdj = _root.hsyjs_jsdj;
   moyu_so.data.hsyjs_rate = _root.hsyjs_rate;
   moyu_so.data.hsyjs_number = _root.hsyjs_number;
   moyu_so.data.time_nowday = _root.mc_day.nowday;
   moyu_so.data.time_nowtime = _root.mc_day.nowtime;
   moyu_so.data.boss10 = _root.boss10;
   moyu_so.data.boss20 = _root.boss20;
   moyu_so.data.boss30 = _root.boss30;
   moyu_so.data.boss50 = _root.boss50;
   moyu_so.data.boss70 = _root.boss70;
   moyu_so.data.boss90 = _root.boss90;
   moyu_so.data.boss100 = _root.boss100;
   moyu_so.data.bossZZ = _root.bossZZ;
   moyu_so.data.bossDZZ = _root.bossDZZ;
   moyu_so.data.openzh = _root.openzh;
   moyu_so.data.openzhrw = _root.openzhrw;
   moyu_so.data.pro2008all = _root.pro2008all;
   moyu_so.data.pro2008now = _root.pro2008now;
   moyu_so.data.pro2008show = _root.pro2008show;
   moyu_so.data.hsyjsmaxrate = _root.hsyjsmaxrate;
   moyu_so.data.hsyjsvip = _root.hsyjsvip;
   moyu_so.data.hsyjs_jsdjmax = _root.hsyjs_jsdjmax;
   moyu_so.data.mj_gj = _root.mj_gj;
   moyu_so.data.mj_fy = _root.mj_fy;
   moyu_so.data.mj_tt = _root.mj_tt;
   moyu_so.data.mj_sm = _root.mj_sm;
   moyu_so.data.mj_zs = _root.mj_zs;
   moyu_so.data.mj_nl = _root.mj_nl;
   moyu_so.data.hs1_maxzdl = _root.xinxi.hs1_maxzdl;
   moyu_so.data.hs2_maxzdl = _root.xinxi.hs2_maxzdl;
   moyu_so.data.my_maxzdl = _root.xinxi.my_maxzdl;
   moyu_so.data.js_name = _root.xinxi.myname;
   moyu_so.data.dj = _root.xinxi.dj;
   moyu_so.data.hp = _root.xinxi.hp;
   moyu_so.data.mhp = _root.xinxi.mhp;
   moyu_so.data.tl = _root.xinxi.tl;
   moyu_so.data.mtl = _root.xinxi.mtl;
   moyu_so.data.jxdj = _root.xinxi.jxdj;
   moyu_so.data.jwdj = _root.xinxi.jwdj;
   moyu_so.data.gzgx = _root.xinxi.gzgx;
   moyu_so.data.xy = _root.xinxi.xy;
   moyu_so.data.jy = _root.xinxi.jy;
   moyu_so.data.mjy = _root.xinxi.mjy;
   moyu_so.data.hun = _root.xinxi.hun;
   moyu_so.data.gzgxexp = _root.xinxi.gzgxexp;
   moyu_so.data.gxname = _root.xinxi.gxname;
   moyu_so.data.jxexp = _root.xinxi.jxexp;
   moyu_so.data.jwexp = _root.xinxi.jwexp;
   moyu_so.data.jinengjns = _root.jineng.jns;
   i = 0;
   while(i < _root.jineng.jns)
   {
      moyu_so.data["jineng" + i] = _root.jineng.jineng[i];
      i++;
   }
   moyu_so.data.zhuangbei_shouzhuo = false;
   if(_root.zhuangbei.shouzhuo.item)
   {
      moyu_so.data.zhuangbei_shouzhuo = true;
      moyu_so.data.zhuangbei_shouzhuodj = _root.zhuangbei.shouzhuo.item.dj;
      moyu_so.data.zhuangbei_shouzhuopz = _root.zhuangbei.shouzhuo.item.pz;
      moyu_so.data.zhuangbei_shouzhuomhdj = _root.zhuangbei.shouzhuo.item.mhdj;
      moyu_so.data.zhuangbei_shouzhuodong = _root.zhuangbei.shouzhuo.item.dong;
      moyu_so.data.zhuangbei_shouzhuodong1 = _root.zhuangbei.shouzhuo.item.dong1;
      moyu_so.data.zhuangbei_shouzhuodong2 = _root.zhuangbei.shouzhuo.item.dong2;
      moyu_so.data.zhuangbei_shouzhuozhtype = _root.zhuangbei.shouzhuo.item.zhtype;
      moyu_so.data.zhuangbei_shouzhuozhdj = _root.zhuangbei.shouzhuo.item.zhdj;
   }
   moyu_so.data.zhuangbei_zhanxie = false;
   if(_root.zhuangbei.zhanxie.item)
   {
      moyu_so.data.zhuangbei_zhanxie = true;
      moyu_so.data.zhuangbei_zhanxiedj = _root.zhuangbei.zhanxie.item.dj;
      moyu_so.data.zhuangbei_zhanxiepz = _root.zhuangbei.zhanxie.item.pz;
      moyu_so.data.zhuangbei_zhanxiemhdj = _root.zhuangbei.zhanxie.item.mhdj;
      moyu_so.data.zhuangbei_zhanxiedong = _root.zhuangbei.zhanxie.item.dong;
      moyu_so.data.zhuangbei_zhanxiedong1 = _root.zhuangbei.zhanxie.item.dong1;
      moyu_so.data.zhuangbei_zhanxiedong2 = _root.zhuangbei.zhanxie.item.dong2;
      moyu_so.data.zhuangbei_zhanxiezhtype = _root.zhuangbei.zhanxie.item.zhtype;
      moyu_so.data.zhuangbei_zhanxiezhdj = _root.zhuangbei.zhanxie.item.zhdj;
   }
   moyu_so.data.zhuangbei_yifu = false;
   if(_root.zhuangbei.yifu.item)
   {
      moyu_so.data.zhuangbei_yifu = true;
      moyu_so.data.zhuangbei_yifudj = _root.zhuangbei.yifu.item.dj;
      moyu_so.data.zhuangbei_yifupz = _root.zhuangbei.yifu.item.pz;
      moyu_so.data.zhuangbei_yifumhdj = _root.zhuangbei.yifu.item.mhdj;
      moyu_so.data.zhuangbei_yifudong = _root.zhuangbei.yifu.item.dong;
      moyu_so.data.zhuangbei_yifudong1 = _root.zhuangbei.yifu.item.dong1;
      moyu_so.data.zhuangbei_yifudong2 = _root.zhuangbei.yifu.item.dong2;
      moyu_so.data.zhuangbei_yifuzhtype = _root.zhuangbei.yifu.item.zhtype;
      moyu_so.data.zhuangbei_yifuzhdj = _root.zhuangbei.yifu.item.zhdj;
   }
   moyu_so.data.zhuangbei_xianglian = false;
   if(_root.zhuangbei.xianglian.item)
   {
      moyu_so.data.zhuangbei_xianglian = true;
      moyu_so.data.zhuangbei_xiangliandj = _root.zhuangbei.xianglian.item.dj;
      moyu_so.data.zhuangbei_xianglianpz = _root.zhuangbei.xianglian.item.pz;
      moyu_so.data.zhuangbei_xianglianmhdj = _root.zhuangbei.xianglian.item.mhdj;
      moyu_so.data.zhuangbei_xiangliandong = _root.zhuangbei.xianglian.item.dong;
      moyu_so.data.zhuangbei_xiangliandong1 = _root.zhuangbei.xianglian.item.dong1;
      moyu_so.data.zhuangbei_xiangliandong2 = _root.zhuangbei.xianglian.item.dong2;
      moyu_so.data.zhuangbei_xianglianzhtype = _root.zhuangbei.xianglian.item.zhtype;
      moyu_so.data.zhuangbei_xianglianzhdj = _root.zhuangbei.xianglian.item.zhdj;
   }
   moyu_so.data.zhuangbei_wuqi = false;
   if(_root.zhuangbei.wuqi.item)
   {
      moyu_so.data.zhuangbei_wuqi = true;
      moyu_so.data.zhuangbei_wuqidj = _root.zhuangbei.wuqi.item.dj;
      moyu_so.data.zhuangbei_wuqipz = _root.zhuangbei.wuqi.item.pz;
      moyu_so.data.zhuangbei_wuqimhdj = _root.zhuangbei.wuqi.item.mhdj;
      moyu_so.data.zhuangbei_wuqidong = _root.zhuangbei.wuqi.item.dong;
      moyu_so.data.zhuangbei_wuqidong1 = _root.zhuangbei.wuqi.item.dong1;
      moyu_so.data.zhuangbei_wuqidong2 = _root.zhuangbei.wuqi.item.dong2;
      moyu_so.data.zhuangbei_wuqizhtype = _root.zhuangbei.wuqi.item.zhtype;
      moyu_so.data.zhuangbei_wuqizhdj = _root.zhuangbei.wuqi.item.zhdj;
   }
   moyu_so.data.zhuangbei_toukui = false;
   if(_root.zhuangbei.toukui.item)
   {
      moyu_so.data.zhuangbei_toukui = true;
      moyu_so.data.zhuangbei_toukuidj = _root.zhuangbei.toukui.item.dj;
      moyu_so.data.zhuangbei_toukuipz = _root.zhuangbei.toukui.item.pz;
      moyu_so.data.zhuangbei_toukuimhdj = _root.zhuangbei.toukui.item.mhdj;
      moyu_so.data.zhuangbei_toukuidong = _root.zhuangbei.toukui.item.dong;
      moyu_so.data.zhuangbei_toukuidong1 = _root.zhuangbei.toukui.item.dong1;
      moyu_so.data.zhuangbei_toukuidong2 = _root.zhuangbei.toukui.item.dong2;
      moyu_so.data.zhuangbei_toukuizhtype = _root.zhuangbei.toukui.item.zhtype;
      moyu_so.data.zhuangbei_toukuizhdj = _root.zhuangbei.toukui.item.zhdj;
   }
   moyu_so.data.beibao_myjb = _root.beibao.myjb;
   moyu_so.data.beibao_myms = _root.beibao.myms;
   i = 0;
   while(i < _root.beibao.yn)
   {
      j = 0;
      for(; j < _root.beibao.xn; j++)
      {
         moyu_so.data["beibao_array" + i + "" + j] = false;
         if(!_root.beibao.array[i][j])
         {
            continue;
         }
         moyu_so.data["beibao_array" + i + "" + j] = true;
         moyu_so.data["beibao_array" + i + "" + j + "myid"] = _root.beibao.array[i][j].myid;
         switch(_root.beibao.array[i][j].myid)
         {
            case "果子":
            case "空经验球":
            case "体力药":
            case "满经验球":
               moyu_so.data["beibao_array" + i + "" + j + "number"] = _root.beibao.array[i][j].number;
               break;
            case "手镯":
            case "头盔":
            case "武器":
            case "项链":
            case "衣服":
            case "战鞋":
               moyu_so.data["beibao_array" + i + "" + j + "dj"] = _root.beibao.array[i][j].dj;
               moyu_so.data["beibao_array" + i + "" + j + "pz"] = _root.beibao.array[i][j].pz;
               moyu_so.data["beibao_array" + i + "" + j + "mhdj"] = _root.beibao.array[i][j].mhdj;
               moyu_so.data["beibao_array" + i + "" + j + "dong"] = _root.beibao.array[i][j].dong;
               moyu_so.data["beibao_array" + i + "" + j + "dong1"] = _root.beibao.array[i][j].dong1;
               moyu_so.data["beibao_array" + i + "" + j + "dong2"] = _root.beibao.array[i][j].dong2;
               moyu_so.data["beibao_array" + i + "" + j + "zhtype"] = _root.beibao.array[i][j].zhtype;
               moyu_so.data["beibao_array" + i + "" + j + "zhdj"] = _root.beibao.array[i][j].zhdj;
         }
      }
      i++;
   }
   i = 0;
   while(i < _root.cangku.yn)
   {
      j = 0;
      for(; j < _root.cangku.xn; j++)
      {
         moyu_so.data["cangku_array" + i + "" + j] = false;
         if(!_root.cangku.array[i][j])
         {
            continue;
         }
         moyu_so.data["cangku_array" + i + "" + j] = true;
         moyu_so.data["cangku_array" + i + "" + j + "myid"] = _root.cangku.array[i][j].myid;
         switch(_root.cangku.array[i][j].myid)
         {
            case "果子":
            case "空经验球":
            case "体力药":
            case "满经验球":
               moyu_so.data["cangku_array" + i + "" + j + "number"] = _root.cangku.array[i][j].number;
               break;
            case "手镯":
            case "头盔":
            case "武器":
            case "项链":
            case "衣服":
            case "战鞋":
               moyu_so.data["cangku_array" + i + "" + j + "dj"] = _root.cangku.array[i][j].dj;
               moyu_so.data["cangku_array" + i + "" + j + "pz"] = _root.cangku.array[i][j].pz;
               moyu_so.data["cangku_array" + i + "" + j + "mhdj"] = _root.cangku.array[i][j].mhdj;
               moyu_so.data["cangku_array" + i + "" + j + "dong"] = _root.cangku.array[i][j].dong;
               moyu_so.data["cangku_array" + i + "" + j + "dong1"] = _root.cangku.array[i][j].dong1;
               moyu_so.data["cangku_array" + i + "" + j + "dong2"] = _root.cangku.array[i][j].dong2;
               moyu_so.data["cangku_array" + i + "" + j + "zhtype"] = _root.cangku.array[i][j].zhtype;
               moyu_so.data["cangku_array" + i + "" + j + "zhdj"] = _root.cangku.array[i][j].zhdj;
         }
      }
      i++;
   }
   moyu_so.data.huanshoumblen = _root.huanshoumb.bblen();
   i = 0;
   while(i < _root.huanshoumb.bblen())
   {
      moyu_so.data["huanshoumb" + i] = true;
      moyu_so.data["huanshoumb" + i + "hs_name"] = _root.huanshoumb.array[i].hs_name;
      moyu_so.data["huanshoumb" + i + "othername"] = _root.huanshoumb.array[i].othername;
      moyu_so.data["huanshoumb" + i + "dj"] = _root.huanshoumb.array[i].dj;
      moyu_so.data["huanshoumb" + i + "predj"] = _root.huanshoumb.array[i].predj;
      moyu_so.data["huanshoumb" + i + "hp"] = _root.huanshoumb.array[i].hp;
      moyu_so.data["huanshoumb" + i + "jy"] = _root.huanshoumb.array[i].jy;
      moyu_so.data["huanshoumb" + i + "mjy"] = _root.huanshoumb.array[i].mjy;
      moyu_so.data["huanshoumb" + i + "hun"] = _root.huanshoumb.array[i].hun;
      moyu_so.data["huanshoumb" + i + "zs"] = _root.huanshoumb.array[i].zs;
      moyu_so.data["huanshoumb" + i + "chp"] = _root.huanshoumb.array[i].chp;
      moyu_so.data["huanshoumb" + i + "cxgj"] = _root.huanshoumb.array[i].cxgj;
      moyu_so.data["huanshoumb" + i + "cdgj"] = _root.huanshoumb.array[i].cdgj;
      moyu_so.data["huanshoumb" + i + "cfy"] = _root.huanshoumb.array[i].cfy;
      moyu_so.data["huanshoumb" + i + "cz_hp"] = _root.huanshoumb.array[i].cz_hp;
      moyu_so.data["huanshoumb" + i + "cz_dgj"] = _root.huanshoumb.array[i].cz_dgj;
      moyu_so.data["huanshoumb" + i + "cz_xgj"] = _root.huanshoumb.array[i].cz_xgj;
      moyu_so.data["huanshoumb" + i + "cz_fy"] = _root.huanshoumb.array[i].cz_fy;
      moyu_so.data["huanshoumb" + i + "pzbase"] = _root.huanshoumb.array[i].pzbase;
      moyu_so.data["huanshoumb" + i + "pz"] = _root.huanshoumb.array[i].pz;
      moyu_so.data["huanshoumb" + i + "pz_chp"] = _root.huanshoumb.array[i].pz_chp;
      moyu_so.data["huanshoumb" + i + "pz_cxgj"] = _root.huanshoumb.array[i].pz_cxgj;
      moyu_so.data["huanshoumb" + i + "pz_cdgj"] = _root.huanshoumb.array[i].pz_cdgj;
      moyu_so.data["huanshoumb" + i + "pz_cfy"] = _root.huanshoumb.array[i].pz_cfy;
      moyu_so.data["huanshoumb" + i + "pz_cz_hp"] = _root.huanshoumb.array[i].pz_cz_hp;
      moyu_so.data["huanshoumb" + i + "pz_cz_xgj"] = _root.huanshoumb.array[i].pz_cz_xgj;
      moyu_so.data["huanshoumb" + i + "pz_cz_dgj"] = _root.huanshoumb.array[i].pz_cz_dgj;
      moyu_so.data["huanshoumb" + i + "pz_cz_fy"] = _root.huanshoumb.array[i].pz_cz_fy;
      i++;
   }
   var _loc2_ = moyu_so.flush();
   _root.saved.openme(_loc2_,moyu_so.getSize());
   return true;
}
function beload()
{
   moyu_so = SharedObject.getLocal("moyusave");
   if(moyu_so.data.versions != _root.versions)
   {
      moyu_so.clear();
   }
   else
   {
      if(moyu_so.data.saved == undefined)
      {
         _root.loadfail.openme();
         _root.gotoAndStop(_root.nowmap);
         return false;
      }
      _root.laoddata = true;
      _root.backmusic.stopmusic();
      _root.gotoAndPlay("读取游戏");
   }
}
function loadgame()
{
   moyu_so = SharedObject.getLocal("moyusave");
   _root.beibao.clearall();
   _root.cangku.clearall();
   _root.zhuangbei.clearall();
   _root.huanshoumb.clearall();
   _root.nextmap = moyu_so.data.nextmap;
   _root.nowmap = moyu_so.data.nowmap;
   _root.owermap = moyu_so.data.owermap;
   _root.mapreward = moyu_so.data.mapreward;
   _root.pk_race = moyu_so.data.pk_race;
   _root.map_race = moyu_so.data.map_race;
   _root.shinv1item = moyu_so.data.shinv1item;
   _root.shinv2item = moyu_so.data.shinv2item;
   _root.gzchat = moyu_so.data.gzchat;
   _root.gzgive = moyu_so.data.gzgive;
   _root.gzgift = moyu_so.data.gzgift;
   _root.gzgx4 = moyu_so.data.gzgx4;
   _root.yspay = moyu_so.data.yspay;
   _root.king = moyu_so.data.king;
   _root.rw_bs = moyu_so.data.rw_bs;
   _root.rw_hs = moyu_so.data.rw_hs;
   _root.rw_dxc = moyu_so.data.rw_dxc;
   _root.rw_gw1_1 = moyu_so.data.rw_gw1_1;
   _root.rw_gw1_2 = moyu_so.data.rw_gw1_2;
   _root.rw_gw1_3 = moyu_so.data.rw_gw1_3;
   _root.rw_gw2_1 = moyu_so.data.rw_gw2_1;
   _root.rw_gw2_2 = moyu_so.data.rw_gw2_2;
   _root.rw_gw3_1 = moyu_so.data.rw_gw3_1;
   _root.bbhh_point = moyu_so.data.bbhh_point;
   _root.manexpball = moyu_so.data.manexpball;
   _root.rw_hsyjs = moyu_so.data.rw_hsyjs;
   _root.hsyjs_jsdj = moyu_so.data.hsyjs_jsdj;
   _root.hsyjs_rate = moyu_so.data.hsyjs_rate;
   _root.hsyjs_number = moyu_so.data.hsyjs_number;
   _root.mc_day.nowday = moyu_so.data.time_nowday;
   _root.mc_day.nowtime = moyu_so.data.time_nowtime;
   _root.mc_day.upxx();
   _root.boss10 = moyu_so.data.boss10;
   _root.boss20 = moyu_so.data.boss20;
   _root.boss30 = moyu_so.data.boss30;
   _root.boss50 = moyu_so.data.boss50;
   _root.boss70 = moyu_so.data.boss70;
   _root.boss90 = moyu_so.data.boss90;
   _root.boss100 = moyu_so.data.boss100;
   _root.bossZZ = moyu_so.data.bossZZ;
   _root.bossDZZ = moyu_so.data.bossDZZ;
   _root.openzh = moyu_so.data.openzh;
   _root.openzhrw = moyu_so.data.openzhrw;
   _root.pro2008all = moyu_so.data.pro2008all;
   _root.pro2008now = moyu_so.data.pro2008now;
   _root.pro2008show = moyu_so.data.pro2008show;
   _root.hsyjsmaxrate = moyu_so.data.hsyjsmaxrate;
   _root.hsyjsvip = moyu_so.data.hsyjsvip;
   _root.hsyjs_jsdjmax = moyu_so.data.hsyjs_jsdjmax;
   _root.mj_gj = moyu_so.data.mj_gj;
   _root.mj_fy = moyu_so.data.mj_fy;
   _root.mj_tt = moyu_so.data.mj_tt;
   _root.mj_sm = moyu_so.data.mj_sm;
   _root.mj_zs = moyu_so.data.mj_zs;
   _root.mj_nl = moyu_so.data.mj_nl;
   _root.xinxi.hs1_maxzdl = moyu_so.data.hs1_maxzdl;
   _root.xinxi.hs2_maxzdl = moyu_so.data.hs2_maxzdl;
   _root.xinxi.my_maxzdl = moyu_so.data.my_maxzdl;
   _root.xinxi.myname = moyu_so.data.js_name;
   _root.xinxi.names = _root.xinxi.myname;
   _root.xinxi.tnames.text = _root.xinxi.myname;
   _root.xinxi.dj = moyu_so.data.dj;
   _root.xinxi.hp = moyu_so.data.hp;
   _root.xinxi.mhp = moyu_so.data.mhp;
   _root.xinxi.tl = moyu_so.data.tl;
   _root.xinxi.mtl = moyu_so.data.mtl;
   _root.xinxi.jxdj = moyu_so.data.jxdj;
   _root.xinxi.jwdj = moyu_so.data.jwdj;
   _root.xinxi.gzgx = moyu_so.data.gzgx;
   _root.xinxi.xy = moyu_so.data.xy;
   _root.xinxi.jy = moyu_so.data.jy;
   _root.xinxi.mjy = moyu_so.data.mjy;
   _root.xinxi.hun = moyu_so.data.hun;
   _root.xinxi.gzgxexp = moyu_so.data.gzgxexp;
   _root.xinxi.gxname = moyu_so.data.gxname;
   _root.xinxi.jxexp = moyu_so.data.jxexp;
   _root.xinxi.jwexp = moyu_so.data.jwexp;
   _root.xinxi.upxx();
   _root.jineng.jns = moyu_so.data.jinengjns;
   i = 0;
   while(i < moyu_so.data.jinengjns)
   {
      _root.jineng.setjn(i,moyu_so.data["jineng" + i]);
      i++;
   }
   _root.jineng.updata();
   _root.beibao.myjb = moyu_so.data.beibao_myjb;
   _root.beibao.myms = moyu_so.data.beibao_myms;
   _root.beibao.subjb(0);
   _root.beibao.subms(0);
   num = 0;
   IntervalID = setInterval(loaditem,30);
}
function loaditem(dsc)
{
   id = "";
   myid = "";
   if(++num > 6)
   {
      clearInterval(IntervalID);
      i = j = 0;
      IntervalID = setInterval(loadbeibao,30);
      return false;
   }
   switch(num)
   {
      case 1:
         if(moyu_so.data.zhuangbei_zhanxie)
         {
            rsc = "zhuangbei_zhanxie";
            myid = "战鞋";
         }
         break;
      case 2:
         if(moyu_so.data.zhuangbei_yifu)
         {
            rsc = "zhuangbei_yifu";
            myid = "衣服";
         }
         break;
      case 3:
         if(moyu_so.data.zhuangbei_xianglian)
         {
            rsc = "zhuangbei_xianglian";
            myid = "项链";
         }
         break;
      case 4:
         if(moyu_so.data.zhuangbei_wuqi)
         {
            rsc = "zhuangbei_wuqi";
            myid = "武器";
         }
         break;
      case 5:
         if(moyu_so.data.zhuangbei_toukui)
         {
            rsc = "zhuangbei_toukui";
            myid = "头盔";
         }
         break;
      case 6:
         if(moyu_so.data.zhuangbei_shouzhuo)
         {
            rsc = "zhuangbei_shouzhuo";
            myid = "手镯";
         }
         break;
      default:
         return false;
   }
   setitem(rsc);
   _root.zhuangbei.setzhuangbei(_root.saveload);
   return true;
}
function setitem(rsc)
{
   dj = moyu_so.data[rsc + "dj"];
   pz = moyu_so.data[rsc + "pz"];
   mhdj = moyu_so.data[rsc + "mhdj"];
   dong = moyu_so.data[rsc + "dong"];
   dong1 = moyu_so.data[rsc + "dong1"];
   dong2 = moyu_so.data[rsc + "dong2"];
   zhtype = moyu_so.data[rsc + "zhtype"];
   zhdj = moyu_so.data[rsc + "zhdj"];
}
function loadbeibao()
{
   id = "";
   myid = "";
   if(moyu_so.data["beibao_array" + i + "" + j])
   {
      number = 1;
      switch(moyu_so.data["beibao_array" + i + "" + j + "myid"])
      {
         case "果子":
         case "空经验球":
         case "体力药":
         case "满经验球":
            number = moyu_so.data["beibao_array" + i + "" + j + "number"];
         default:
            id = moyu_so.data["beibao_array" + i + "" + j + "myid"];
            _root.beibao.more(_root.saveload);
            break;
         case "手镯":
         case "头盔":
         case "武器":
         case "项链":
         case "衣服":
         case "战鞋":
            id = moyu_so.data["beibao_array" + i + "" + j + "myid"];
            setitem("beibao_array" + i + "" + j);
            _root.beibao.more(_root.saveload);
      }
   }
   var _loc0_;
   j = _loc0_ = j + 1;
   if(_loc0_ >= _root.beibao.xn)
   {
      j = 0;
      i = _loc0_ = i + 1;
      if(_loc0_ >= _root.beibao.yn)
      {
         clearInterval(IntervalID);
         var _temp_1 = "i";
         j = _loc0_ = 0;
         set(_temp_1,_loc0_);
         IntervalID = setInterval(loadcangku,20);
         return false;
      }
   }
}
function loadcangku()
{
   id = "";
   myid = "";
   if(moyu_so.data["cangku_array" + i + "" + j])
   {
      number = 1;
      switch(moyu_so.data["cangku_array" + i + "" + j + "myid"])
      {
         case "果子":
         case "空经验球":
         case "体力药":
         case "满经验球":
            number = moyu_so.data["cangku_array" + i + "" + j + "number"];
         default:
            id = moyu_so.data["cangku_array" + i + "" + j + "myid"];
            _root.cangku.more(_root.saveload);
            break;
         case "手镯":
         case "头盔":
         case "武器":
         case "项链":
         case "衣服":
         case "战鞋":
            id = moyu_so.data["cangku_array" + i + "" + j + "myid"];
            setitem("cangku_array" + i + "" + j);
            _root.cangku.more(_root.saveload);
      }
   }
   var _loc0_;
   j = _loc0_ = j + 1;
   if(_loc0_ >= _root.cangku.xn)
   {
      j = 0;
      i = _loc0_ = i + 1;
      if(_loc0_ >= _root.cangku.yn)
      {
         clearInterval(IntervalID);
         var _temp_1 = "i";
         j = _loc0_ = 0;
         set(_temp_1,_loc0_);
         IntervalID = setInterval(loadhuanshou,30);
         return false;
      }
   }
}
function loadhuanshou()
{
   if(moyu_so.data["huanshoumb" + i])
   {
      hs_name = moyu_so.data["huanshoumb" + i + "hs_name"];
      othername = moyu_so.data["huanshoumb" + i + "othername"];
      dj = moyu_so.data["huanshoumb" + i + "dj"];
      predj = moyu_so.data["huanshoumb" + i + "predj"];
      hp = moyu_so.data["huanshoumb" + i + "hp"];
      jy = moyu_so.data["huanshoumb" + i + "jy"];
      mjy = moyu_so.data["huanshoumb" + i + "mjy"];
      hun = moyu_so.data["huanshoumb" + i + "hun"];
      zs = moyu_so.data["huanshoumb" + i + "zs"];
      chp = moyu_so.data["huanshoumb" + i + "chp"];
      cxgj = moyu_so.data["huanshoumb" + i + "cxgj"];
      cdgj = moyu_so.data["huanshoumb" + i + "cdgj"];
      cfy = moyu_so.data["huanshoumb" + i + "cfy"];
      cz_hp = moyu_so.data["huanshoumb" + i + "cz_hp"];
      cz_dgj = moyu_so.data["huanshoumb" + i + "cz_dgj"];
      cz_xgj = moyu_so.data["huanshoumb" + i + "cz_xgj"];
      cz_fy = moyu_so.data["huanshoumb" + i + "cz_fy"];
      pzbase = moyu_so.data["huanshoumb" + i + "pzbase"];
      pz = moyu_so.data["huanshoumb" + i + "pz"];
      pz_chp = moyu_so.data["huanshoumb" + i + "pz_chp"];
      pz_cxgj = moyu_so.data["huanshoumb" + i + "pz_cxgj"];
      pz_cdgj = moyu_so.data["huanshoumb" + i + "pz_cdgj"];
      pz_cfy = moyu_so.data["huanshoumb" + i + "pz_cfy"];
      pz_cz_hp = moyu_so.data["huanshoumb" + i + "pz_cz_hp"];
      pz_cz_xgj = moyu_so.data["huanshoumb" + i + "pz_cz_xgj"];
      pz_cz_dgj = moyu_so.data["huanshoumb" + i + "pz_cz_dgj"];
      pz_cz_fy = moyu_so.data["huanshoumb" + i + "pz_cz_fy"];
      _root.huanshoumb.givebb(_root.saveload);
   }
   if(++i >= moyu_so.data.huanshoumblen)
   {
      clearInterval(IntervalID);
      i = j = 0;
      IntervalID = setInterval(chuzheng,50);
      return false;
   }
}
function chuzheng()
{
   switch(i)
   {
      case 0:
         _root.huanshoumb.chuzhengbb(_root.huanshoumb.array[0]);
         _root.czmb0.ToOne.setInOne(true);
         break;
      case 1:
         _root.huanshoumb.chuzhengbb(_root.huanshoumb.array[1]);
         _root.czmb1.ToOne.setInOne(true);
         break;
      default:
         clearInterval(IntervalID);
         loaded();
   }
   i++;
}
function loaded()
{
   _root.havesaved = true;
   _root.zhuangbei.flashme();
   this.gotoAndStop(1);
   _root.gotoAndStop(_root.nowmap);
}
_visible = false;
stop();
var moyu_so;
var myid;
var dj;
var pz;
var mhdj;
var dong;
var dong1;
var dong2;
var num;
var IntervalID;
var number;
var i;
var j;
var hs_name;
var othername;
var dj;
var predj;
var hp;
var jy;
var mjy;
var hun;
var zs;
var chp;
var cxgj;
var cdgj;
var cfy;
var cz_hp;
var cz_dgj;
var cz_xgj;
var cz_fy;
var pzbase;
var pz;
var pz_chp;
var pz_cxgj;
var pz_cdgj;
var pz_cfy;
var pz_cz_hp;
var pz_cz_xgj;
var pz_cz_dgj;
var pz_cz_fy;
