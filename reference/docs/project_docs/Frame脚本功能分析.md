# Frame脚本功能分析

本文档记录 `/scripts/frame_*/DoAction.as` 文件的功能分析。

---

## Frame 2: 加载等待

**文件**: `scripts/frame_2/DoAction.as`

**功能**: 显示游戏加载进度，等待资源加载完成后进入"前言"场景

```actionscript
if(_framesloaded / _totalframes >= 1)
{
   _root.loading.gotoAndStop(100 * _framesloaded / _totalframes);
   gotoAndStop("前言");
   play();
}
else
{
   gotoAndPlay(1);
}
```

---

## Frame 3: 游戏初始化

**文件**: `scripts/frame_3/DoAction.as`

**功能**: 初始化游戏基本设置

```actionscript
stop();
fscommand("showmenu","false");
_root.versions = 1030;
```

**说明**:
- 禁用右键菜单
- 设置游戏版本号为1030

---

## Frame 4: 玩家名称输入

**文件**: `scripts/frame_4/DoAction.as`

**功能**: 显示玩家名称输入界面

```actionscript
stop();
player_name.text = "魔域玩家";
Selection.setFocus("_root.player_name");
Selection.setSelection(0,0);
_root.newgame = true;
```

---

## Frame 5: 开始游戏判断

**文件**: `scripts/frame_5/DoAction.as`

**功能**: 判断是新游戏还是加载存档

```actionscript
_root.newgame = false;
gotoAndStop("开始");
play();
```

---

## Frame 6: 核心游戏逻辑 (最重要)

**文件**: `scripts/frame_6/DoAction.as`

**功能**: 包含游戏的核心函数和全局变量初始化，是游戏最重要的脚本文件

### 核心函数

| 函数名 | 功能 |
|--------|------|
| `returnhp()` | 恢复角色和幻兽的生命值和体力值 |
| `nextday()` | 处理新的一天逻辑 |
| `flashboss()` | 随机刷新BOSS |
| `flashgw()` | 刷新官阶任务 |
| `flashmj()` | 刷新魔将 |
| `TouchStory()` | 救出国王剧情触发 |
| `weapon()` | 生成随机装备 |
| `CloseAll()` | 关闭所有界面 |
| `msgbox()` | 显示消息框 |
| `alertbox()` | 显示警告框 |
| `huanhua()` | 幻兽幻化核心函数 |

### 幻化类型参数 (huanhua函数)

| 幻兽类型 | 主属性成长 | 副属性成长 |
|----------|------------|------------|
| 攻防型 | 攻击+1.0/1.2/0.8 | 生命+0.9 |
| 调皮鬼 | 攻击+0.8/1.4/0.7 | 生命+0.9 |
| 吉鲁猪 | 攻击+1.2/1.6 | 防御/生命+0.9 |
| 奇异兽 | 攻击+1.3/1.3 | 防御/生命+0.9 |
| 圣天使 | 攻击+0.5/0.8 | 生命+1.8 |
| 守护 | 攻击+1.4/1.6 | 防御/生命+0.9 |
| 年猪 | 攻击+1.1/1.2/1.0 | 生命+1.5 |

### 全局变量初始化

```actionscript
nowmap = "雷鸣大陆";     // 当前地图
owermap = "";            // 所属地图
mapreward = false;       // 地图奖励
pk_race = false;         // PK比赛
shinv1item = true;       // 商人1物品
shinv2item = true;       // 商人2物品
king = false;            // 国王是否被救
openzh = false;          // 是否开启转世
```

---

## Frame 7: 加载存档

**文件**: `scripts/frame_7/DoAction.as`

**功能**: 加载已保存的游戏进度

```actionscript
stop();
if(_root.laoddata)
{
   _root.saveload.loadgame();
   _root.loadgamedata.openme();
}
else
{
   play();
}
```

---

## Frame 8-35: 地图场景

这些Frame主要用于设置玩家位置(`renwu._x`, `renwu._y`)和危险标记(`danger`)

| Frame | 地图 | 位置X | 位置Y | 危险 |
|-------|------|-------|-------|------|
| 8 | (危险区域) | 313 | 323 | true |
| 9 | (安全区域) | 345 | 333 | false |
| 10 | 草原2 | 180 | 380 | true |
| 11 | 卡萨诺城 | 345 | 333 | false |
| 12 | (安全区域) | 345 | 333 | false |
| 13 | 皇宫 | 355 | 380 | false |
| 14 | (安全区域) | 355 | 475 | false |
| 15 | 抽奖房 | 345 | 315 | false |
| 16 | (危险区域) | 320 | 315 | true |
| 17 | (危险区域) | 320 | 315 | true |
| 18 | (危险区域) | 320 | 315 | true |
| 19 | (危险区域) | 235 | 333 | true |
| 20 | (危险区域) | 150 | 355 | true |
| 21 | (危险区域) | 215 | 265 | true |
| 22 | 雪域边境 | 145 | 315 | true |
| 23 | (危险区域) | 145 | 315 | true |
| 24 | (危险区域) | 170 | 470 | true |
| 25 | (危险区域) | 170 | 470 | true |
| 26 | (危险区域) | 145 | 315 | true |
| 27 | (危险区域) | 145 | 315 | true |
| 28 | 地下城1层 | 320 | 315 | true |
| 29 | 地下城2层 | 140 | 470 | true |
| 30 | 地下城3层 | 340 | 335 | true |
| 31 | (危险区域) | 145 | 335 | true |
| 32 | (危险区域) | 145 | 335 | true |
| 33 | (危险区域) | 145 | 335 | true |
| 34 | (安全区域) | 190 | 245 | false |
| 35 | 树心城 | 235 | 310 | false |

### 特殊地图任务

**Frame 28 - 地下城1层任务**:
```actionscript
if(!rw_gw1_1 && !rw_gw1_2 && !rw_gw1_3)
{
   id = "灵魂王";
   _root.beibao.more(this);
   _root.xinxi.upjw(3000);
   // 奖励: 灵魂王 + 3000功勋
}
```

**Frame 29 - 地下城2层任务**:
```actionscript
if(!rw_gw2_1 && !rw_gw2_2)
{
   weapon(4,9,1);  // 极品一洞+9装备
   _root.xinxi.upjw(6000);
   // 奖励: 极品装备 + 6000功勋
}
```

**Frame 30 - 地下城3层任务**:
```actionscript
if(!rw_gw3_1)
{
   // 根据是否转世给予不同奖励
   id = openzh ? "战魂之心" : "月光宝盒增强版";
   weapon(4,12,1);  // 极品一洞+12装备
   _root.xinxi.upjw(12000);
   TouchStory();  // 触发救国王剧情
}
```

---

## Frame 36: 进入战斗

**文件**: `scripts/frame_36/DoAction.as`

**功能**: 进入战斗场景

```actionscript
_root.zhanchang.gotoAndPlay("开始");
```

---

## Frame 37: 游戏结束评价 (最重要)

**文件**: `scripts/frame_37/DoAction.as`

**功能**: 计算并显示游戏结束时的各项评价

### 评价维度

| 维度 | 最高评价要求 | 评价名称 |
|------|-------------|----------|
| 战斗力 | ≥1200 | 终极勇士 |
| 等级 | ≥132 | 冲级能手 |
| 装备战斗力 | ≥126 | 装备打造宗师 |
| 幻兽战斗力 | ≥400 | 究极幻兽师 |
| 军衔 | 元帅(11级) | 亚特兰蒂斯战神 |
| 爵位 | 王(6级) | 人类的骄傲 |
| 公主关系 | 亲密恋人(6级) | 情圣 |
| 金钱 | ≥50万+50万魔石 | 富可敌国 |

### 综合评价

- **7个最高评价**: "绝世高手啊"
- **5-6个最高评价**: "天才游戏玩家"
- **军衔≥少将**: "不败将军"
- **军衔≥少校**: "神勇的战士"
- **军衔≥少尉**: "英勇的战士"
- **其他**: "菜菜鸟"

---

## Frame 38: 结束

**文件**: `scripts/frame_38/DoAction.as`

**功能**: 停止所有操作

```actionscript
stop();
```

---

## 全局核心函数 (Frame 6)

### returnhp() - 恢复生命

```actionscript
function returnhp()
{
   _root.xinxi.hp = _root.xinxi.mhp;  // 恢复角色HP
   _root.xinxi.tl = _root.xinxi.mtl;  // 恢复角色体力
   // 恢复所有幻兽HP
   // 自动设置出征幻兽
}
```

### nextday() - 新的一天

```actionscript
function nextday()
{
   useds_num = 1;           // 重置使用物品数量
   havesaved = false;       // 重置存档标记
   manexpball = 5;           // 重置满经验球数量
   returnhp();               // 恢复HP
   // 随机BOSS刷新
   // 任务刷新
   // 星期天特殊处理...
}
```

### flashboss() - BOSS刷新

```actionscript
function flashboss()
{
   // 10级BOSS: 55%概率
   // 20级BOSS: 45%概率
   // 30级BOSS: 33%概率
   // 50级BOSS: 23%概率
   // 70级BOSS: 33%概率
   // 90级BOSS: 23%概率
   // 100级BOSS: 33%概率
   // ZZ级BOSS: 23%概率
   // DZZ级BOSS: 33%概率
}
```

### weapon() - 装备生成

```actionscript
function weapon(setpz, setmhdj, setdong)
{
   // 使用等级: 10-100级，每10级一档
   // 随机类型: 武器/头盔/项链/衣服/手镯/战鞋
   // 品质: setpz
   // 追加等级: setmhdj
   // 镶嵌孔数: setdong
}
```

### huanhua() - 幻兽幻化

```actionscript
function huanhua(bbz, bbf)
{
   // bbz: 被幻化的幻兽
   // bbf: 用于幻化的幻兽(副幻兽)
   // 主属性加分 = 新成长率 / 基础成长率 × 幻化系数
   // 转世次数+1
   // 等级重置为1，保存幻化前等级
}
```

---

## 关键变量说明

| 变量名 | 类型 | 说明 |
|--------|------|------|
| `nowmap` | String | 当前所在地图名称 |
| `danger` | Boolean | 当前区域是否危险 |
| `king` | Boolean | 国王是否被救出 |
| `openzh` | Boolean | 是否开启了转世系统 |
| `manexpball` | Number | 满经验球剩余数量 |
| `useds_num` | Number | 今日已使用物品数量 |
