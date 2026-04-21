# 优化公主NPC系统 Spec

## Why
项目中已实现公主NPC基础功能，但根据reference/docs/project_docs/10_公主系统.md文档，当前公主NPC实现还不够完善。需要优化公主NPC的对话内容、丫环NPC功能、技能学习提示等，使公主系统更加完整和符合原游戏设计。

## What Changes
- 完善公主NPC对话内容，根据关系等级和是否已救国王显示不同对话
- 添加"爱的力量"技能学习功能（关系等级5、6时自动学习）
- 完善丫环NPC功能（丫环1出售高级战斗力石，丫环2出售年猪）
- 优化周日礼物发放逻辑，考虑战魂开启状态
- 添加关系等级和亲密度显示功能
- 完善知己礼物的领取条件判断

## Impact
- Affected specs: add-npc-characters（已有NPC系统）
- Affected code: 
  - src/data/npcData.ts（公主和丫环NPC配置）
  - src/utils/princessRelationUtils.ts（公主关系工具函数）
  - src/App.tsx（NPC交互处理逻辑）
  - src/types/index.ts（类型定义，如需要）

## ADDED Requirements

### Requirement: 公主对话内容优化
系统 SHALL 根据关系等级和是否已救国王显示不同的对话内容：

#### Scenario: 未认识公主
- **WHEN** 关系等级为0（未认识）
- **THEN** 公主对话："听说你是位英勇的战士，我非常敬佩你的勇敢。"

#### Scenario: 认识但未救国王
- **WHEN** 关系等级为1且未救国王
- **THEN** 公主对话："很高兴，你能和我聊天。我最担心的是我的父亲，你有他的消息了吗。"

#### Scenario: 认识且已救国王
- **WHEN** 关系等级为1且已救国王
- **THEN** 公主对话："很高兴，你能和我聊天。非常感谢你把我父亲救出来。"

#### Scenario: 普通朋友
- **WHEN** 关系等级为2（普通朋友）
- **THEN** 公主对话："我的朋友，我这里有些攻防型幻兽..."，并赠送极品1星攻防型幻兽

#### Scenario: 好朋友
- **WHEN** 关系等级为3（好朋友）
- **THEN** 公主对话："我这里有许多幻兽，这个奇异兽听说是幻兽幻化时的最好副幻兽..."，并赠送奇异兽

#### Scenario: 知己
- **WHEN** 关系等级为4（知己）
- **THEN** 公主对话："这是我精心为你培养的12星奇异兽..."，并赠送极品12星奇异兽

#### Scenario: 恋人
- **WHEN** 关系等级为5（恋人）
- **THEN** 公主对话："看，这只亚特兰蒂斯大陆里非常稀有的极品19星奇异兽..."，并赠送极品19星奇异兽，同时学会技能"爱的力量"等级1

#### Scenario: 亲密恋人
- **WHEN** 关系等级为6（亲密恋人）
- **THEN** 公主对话："你把这无比优秀的19星奇异兽带上吧..."，并赠送极品19星奇异兽，同时学会技能"爱的力量"等级2

### Requirement: 爱的力量技能学习
系统 SHALL 在关系等级达到5或6时自动学习"爱的力量"技能：

#### Scenario: 达到恋人等级
- **WHEN** 关系等级首次达到5（恋人）
- **THEN** 系统自动学习技能"爱的力量"等级1
- **AND** 显示提示："恭喜，你与公主感情关系提高到了恋人了。学会了新技能：爱的力量。"

#### Scenario: 达到亲密恋人等级
- **WHEN** 关系等级首次达到6（亲密恋人）
- **THEN** 系统自动学习技能"爱的力量"等级2（或升级到等级2）
- **AND** 显示提示："恭喜，你与公主感情关系到了最高级了。学会了新技能：爱的力量。"

### Requirement: 丫环NPC功能完善
系统 SHALL 为两个丫环NPC添加交易功能：

#### Scenario: 丫环1交易
- **WHEN** 玩家与丫环1交互
- **THEN** 显示交易选项：
  - "购买高级战斗力石"（价格：2,800魔石，每天限购一个）
  - 对话："我自小跟随公主，公主向来与我们有福共享..."

#### Scenario: 丫环2交易
- **WHEN** 玩家与丫环2交互
- **THEN** 显示交易选项：
  - "购买年猪"（价格：5,888魔石，仅限一个）
  - 对话："我是公主的侍女，公主平时代我如同姐妹一样亲..."

### Requirement: 周日礼物优化
系统 SHALL 根据关系等级和战魂开启状态发放不同的周日礼物：

#### Scenario: 关系等级0-2
- **WHEN** 周日领取礼物且关系等级为0-2
- **THEN** 获得高级经验石
- **AND** 公主对话："这是我收藏了许久的优质宝石，高级经验石..."

#### Scenario: 关系等级3-4
- **WHEN** 周日领取礼物且关系等级为3-4
- **THEN** 获得高级战斗力石
- **AND** 公主对话："这是我收藏了许久的优质宝石，高级战斗力石..."

#### Scenario: 关系等级5
- **WHEN** 周日领取礼物且关系等级为5
- **THEN** 获得灵魂王
- **AND** 公主对话："这是我收藏了许久的优质宝石，灵魂王..."

#### Scenario: 关系等级6且未开战魂
- **WHEN** 周日领取礼物且关系等级为6且未开战魂
- **THEN** 获得电浆药水
- **AND** 公主对话："我找到了一瓶电浆药水，它可以把人物的幸运提高到100哦。"

#### Scenario: 关系等级6且已开战魂
- **WHEN** 周日领取礼物且关系等级为6且已开战魂
- **THEN** 获得战魂之心
- **AND** 公主对话："我找到了一个战魂之心，它是极其稀有的宝石..."

### Requirement: 关系等级显示
系统 SHALL 在公主NPC交互界面显示当前关系信息：

#### Scenario: 显示关系信息
- **WHEN** 玩家与公主NPC交互
- **THEN** 在NPC描述区域显示：
  - 当前关系等级名称（如"知己"）
  - 当前亲密度数值
  - 升级到下一级所需亲密度（如未达最高级）

### Requirement: 知己礼物领取条件优化
系统 SHALL 优化知己礼物的领取条件：

#### Scenario: 首次达到知己
- **WHEN** 关系等级首次达到4（知己）
- **THEN** 解锁"知己的礼物"选项
- **AND** 可以领取年猪（超级幻兽）
- **AND** 只能领取一次

#### Scenario: 已领取知己礼物
- **WHEN** 已领取过知己礼物
- **THEN** "知己的礼物"选项不再显示或显示为已领取状态

## MODIFIED Requirements

### Requirement: 公主NPC选项优化
公主NPC的交互选项 SHALL 根据条件动态显示：

```typescript
options: [
  {
    text: '查看关系',
    result: '查看与公主的关系信息',
    actionType: 'viewRelationship',
    actionParams: {}
  },
  {
    text: '知己的礼物',
    result: '获得超级幻兽年猪！',
    actionType: 'receiveConfidantGift',
    actionParams: {},
    condition: {
      type: 'relationship',
      value: 4,
      operator: 'gte'
    }
  },
  {
    text: '聊天',
    result: '与公主聊天，增加友好度。',
    actionType: 'chat',
    actionParams: { dailyLimit: true }
  },
  {
    text: '送礼',
    result: '向公主送花，增加友好度。',
    actionType: 'sendGift',
    actionParams: { giftType: 'flowers' },
    condition: {
      type: 'weekday',
      value: '星期日'
    }
  },
  {
    text: '星期天的礼物',
    result: '获得宝石奖励！',
    actionType: 'receiveWeeklyGift',
    actionParams: { giftType: 'gem' },
    condition: {
      type: 'weekday',
      value: '星期日'
    }
  }
]
```

### Requirement: 丫环NPC配置优化
丫环NPC SHALL 添加交易功能：

```typescript
// 丫环1配置
const npc_maid_1: NPCInteractable = {
  id: 'npc_maid_1',
  type: 'npc',
  name: '丫环',
  icon: '👘',
  description: '皇宫中的丫环，自小跟随公主。',
  location: 'houhuayuan',
  npcType: 'palace',
  options: [
    {
      text: '购买高级战斗力石（2,800魔石）',
      result: '购买高级战斗力石，每天限购一个。',
      actionType: 'buyItem',
      actionParams: { 
        itemId: 'senior_combat_stone',
        price: 2800,
        currency: 'magicStone',
        dailyLimit: true
      }
    },
    {
      text: '离开',
      result: '感谢你的访问！',
      actionType: 'close',
      actionParams: {}
    }
  ]
};

// 丫环2配置
const npc_maid_2: NPCInteractable = {
  id: 'npc_maid_2',
  type: 'npc',
  name: '丫环',
  icon: '👘',
  description: '公主的侍女，公主待她如同姐妹。',
  location: 'houhuayuan',
  npcType: 'palace',
  options: [
    {
      text: '购买年猪（5,888魔石）',
      result: '购买超级幻兽年猪，仅限一个。',
      actionType: 'buyItem',
      actionParams: { 
        itemId: 'year_pig',
        price: 5888,
        currency: 'magicStone',
        onceOnly: true
      }
    },
    {
      text: '离开',
      result: '感谢你的访问！',
      actionType: 'close',
      actionParams: {}
    }
  ]
};
```

## REMOVED Requirements
无移除的需求。
