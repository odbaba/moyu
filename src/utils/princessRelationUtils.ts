/**
 * 公主关系系统工具函数
 * 提供公主关系系统的核心功能，包括关系等级计算、聊天奖励、送礼、周日礼物等
 *
 * 参考文档：
 * - reference/docs/scripts_analysis/15_公主关系系统.md
 * - reference/docs/scripts_analysis/14_NPC系统.md
 */

import type {
  ChatReward,
  DemonArmyInfo,
  GiftResult,
  PrincessRelationship,
  RelationshipLevel,
  RelationshipLevelConfig,
  RelationshipUpgradeResult,
  SkillDetail,
  SkillLearnResult,
  SundayGift} from '../types';

// ========== 关系等级配置数据 ==========

/**
 * 每周最大玫瑰花赠送数量
 * 999玫瑰和99玫瑰合计最多12个
 */
export const MAX_WEEKLY_ROSE_GIFT_COUNT = 12;

/**
 * 关系等级配置表
 * 定义每个关系等级的详细信息
 * 参考文档：reference/docs/scripts_analysis/15_公主关系系统.md
 */
export const RELATIONSHIP_LEVELS: RelationshipLevelConfig[] = [
  {
    level: 0,
    name: '未认识',
    minIntimacy: 0,
    maxIntimacy: 0
  },
  {
    level: 1,
    name: '认识',
    minIntimacy: 1,
    maxIntimacy: 9
  },
  {
    level: 2,
    name: '普通朋友',
    minIntimacy: 10,
    maxIntimacy: 29,
    chatReward: {
      petType: '攻防型',
      petStar: 1,
      description: '极品1星攻防型幻兽'
    }
  },
  {
    level: 3,
    name: '好朋友',
    minIntimacy: 30,
    maxIntimacy: 49,
    chatReward: {
      petType: '奇异兽',
      petStar: 0,
      description: '奇异兽'
    }
  },
  {
    level: 4,
    name: '知己',
    minIntimacy: 50,
    maxIntimacy: 99,
    chatReward: {
      petType: '奇异兽',
      petStar: 12,
      description: '极品12星奇异兽'
    },
    sundayGift: {
      itemId: 'senior_combat_stone',
      itemName: '高级战斗力石',
      description: '这是我收藏了许久的优质宝石，高级战斗力石...'
    }
  },
  {
    level: 5,
    name: '恋人',
    minIntimacy: 100,
    maxIntimacy: 199,
    chatReward: {
      petType: '奇异兽',
      petStar: 19,
      description: '极品19星奇异兽'
    },
    sundayGift: {
      itemId: 'soul_king',
      itemName: '灵魂王',
      description: '这是我收藏了许久的优质宝石，灵魂王...'
    },
    unlockSkill: {
      skillId: 'love_power',
      skillLevel: 1
    }
  },
  {
    level: 6,
    name: '亲密恋人',
    minIntimacy: 200,
    maxIntimacy: Infinity,
    chatReward: {
      petType: '奇异兽',
      petStar: 19,
      description: '极品19星奇异兽'
    },
    sundayGift: {
      itemId: 'plasma_potion',
      itemName: '电浆药水',
      description: '我找到了一瓶电浆药水，它可以把人物的幸运提高到100哦。',
      condition: '未开战魂'
    },
    unlockSkill: {
      skillId: 'love_power',
      skillLevel: 2
    }
  }
];

// ========== 魔族大军情报数据 ==========

/**
 * 魔族大军情报配置表
 * 定义魔族军队的详细信息
 * 参考文档：reference/docs/scripts_analysis/14_NPC系统.md
 */
export const DEMON_ARMY_INFO: DemonArmyInfo[] = [
  {
    id: 'demon_assault',
    name: '魔军突击队',
    level: 700,
    effect: '使所有魔族军队攻击力提高50%',
    description: '魔军突击队是魔族大军的先锋部队，等级700级，能够大幅提升魔族军队的攻击力。'
  },
  {
    id: 'demon_guard',
    name: '魔军守卫军',
    level: 800,
    effect: '使所有魔族军队防御提高50%',
    description: '魔军守卫军是魔族大军的防御主力，等级800级，能够大幅提升魔族军队的防御力。'
  },
  {
    id: 'demon_mystery',
    name: '魔军神秘部队',
    level: 900,
    effect: '使所有魔族军队生命值提高50%',
    description: '魔军神秘部队是魔族大军的精锐部队，等级900级，能够大幅提升魔族军队的生命值。'
  },
  {
    id: 'demon_totem',
    name: '魔军图腾兽',
    level: 1000,
    effect: '使所有魔族军队战斗力提高50%',
    description: '魔军图腾兽是魔族大军的图腾象征，等级1000级，能够大幅提升魔族军队的战斗力。'
  },
  {
    id: 'demon_energy',
    name: '魔的能量',
    level: 0,
    effect: '每天复活所有魔族大军',
    description: '魔的能量是魔族大军的力量源泉，能够每天复活所有被消灭的魔族军队。'
  },
  {
    id: 'demon_commander',
    name: '魔军主帅',
    level: 2000,
    effect: '保护魔的能量',
    description: '魔军主帅是魔族大军的最高指挥官，等级2000级，负责保护魔的能量不被破坏。'
  }
];

// ========== 基础工具函数 ==========

/**
 * 获取关系名称
 * 根据关系等级返回对应的关系名称
 *
 * @param level 关系等级 (0-6)
 * @returns 关系名称
 *
 * @example
 * getRelationshipName(0)  // 返回: '未认识'
 * getRelationshipName(4)  // 返回: '知己'
 * getRelationshipName(6)  // 返回: '亲密恋人'
 */
export const getRelationshipName = (level: number): string => {
  const config = RELATIONSHIP_LEVELS.find(config => config.level === level);

  return config?.name || '未知';
};

/**
 * 获取升级到下一级所需的亲密度
 * 根据当前关系等级，返回升级到下一级所需的最小亲密度
 *
 * @param level 当前关系等级 (0-6)
 * @returns 升级所需亲密度，如果已达最高级则返回 Infinity
 *
 * @example
 * getNextRelationshipRequirement(0)  // 返回: 1 (升级到认识需要1点亲密度)
 * getNextRelationshipRequirement(1)  // 返回: 10 (升级到普通朋友需要10点亲密度)
 * getNextRelationshipRequirement(6)  // 返回: Infinity (已达最高级)
 */
export const getNextRelationshipRequirement = (level: number): number => {
  // 如果已经是最高级，返回 Infinity
  if (level >= 6) {
    return Infinity;
  }

  // 返回下一级的最小亲密度要求
  const nextLevel = RELATIONSHIP_LEVELS.find(config => config.level === level + 1);

  return nextLevel?.minIntimacy || Infinity;
};

/**
 * 判断是否可以升级关系
 * 根据当前亲密度和关系等级，判断是否可以升级到下一级
 *
 * @param currentIntimacy 当前亲密度
 * @param currentLevel 当前关系等级 (0-6)
 * @returns 是否可以升级
 *
 * @example
 * canUpgradeRelationship(0, 0)   // 返回: false (亲密度不足)
 * canUpgradeRelationship(1, 0)   // 返回: true (可以升级到认识)
 * canUpgradeRelationship(10, 1)  // 返回: true (可以升级到普通朋友)
 * canUpgradeRelationship(200, 6) // 返回: false (已达最高级)
 */
export const canUpgradeRelationship = (
  currentIntimacy: number,
  currentLevel: number
): boolean => {
  // 如果已经是最高级，无法升级
  if (currentLevel >= 6) {
    return false;
  }

  // 获取下一级所需亲密度
  const requiredIntimacy = getNextRelationshipRequirement(currentLevel);

  // 判断当前亲密度是否足够
  return currentIntimacy >= requiredIntimacy;
};

/**
 * 根据亲密度计算关系等级
 *
 * @param intimacy 亲密度
 * @returns 关系等级
 *
 * @example
 * calculateRelationshipLevel(0)   // 返回: 0 (未认识)
 * calculateRelationshipLevel(5)   // 返回: 1 (认识)
 * calculateRelationshipLevel(50)  // 返回: 4 (知己)
 * calculateRelationshipLevel(200) // 返回: 6 (亲密恋人)
 */
export const calculateRelationshipLevel = (intimacy: number): RelationshipLevel => {
  // 从高到低查找第一个满足条件的等级
  for (let i = RELATIONSHIP_LEVELS.length - 1; i >= 0; i--) {
    const config = RELATIONSHIP_LEVELS[i];
    if (intimacy >= config.minIntimacy) {
      return config.level;
    }
  }

  return 0;
};

// ========== 聊天奖励功能 ==========

/**
 * 获取聊天奖励
 * 根据关系等级返回对应的聊天奖励
 *
 * @param relationshipLevel 关系等级 (0-6)
 * @returns 聊天奖励，如果没有奖励则返回 null
 *
 * @example
 * getChatReward(0)  // 返回: null (未认识没有奖励)
 * getChatReward(2)  // 返回: { petType: '攻防型', petStar: 1, description: '极品1星攻防型幻兽' }
 * getChatReward(4)  // 返回: { petType: '奇异兽', petStar: 12, description: '极品12星奇异兽' }
 */
export const getChatReward = (relationshipLevel: number): ChatReward | null => {
  const config = RELATIONSHIP_LEVELS.find(config => config.level === relationshipLevel);

  return config?.chatReward || null;
};

/**
 * 获取聊天对话内容
 * 根据关系等级和是否已救国王，返回公主的对话内容
 *
 * @param relationshipLevel 关系等级 (0-6)
 * @param hasRescuedKing 是否已救国王
 * @returns 公主的对话内容
 *
 * @example
 * getChatDialogue(0, false)  // 返回: '听说你是位英勇的战士，我非常敬佩你的勇敢。'
 * getChatDialogue(1, false)  // 返回: '很高兴，你能和我聊天。我最担心的是我的父亲，你有他的消息了吗。'
 * getChatDialogue(4, true)   // 返回: '这是我精心为你培养的12星奇异兽...'
 */
export const getChatDialogue = (
  relationshipLevel: number,
  hasRescuedKing: boolean
): string => {
  switch (relationshipLevel) {
    case 0:
      return '听说你是位英勇的战士，我非常敬佩你的勇敢。';

    case 1:
      if (hasRescuedKing) {
        return '很高兴，你能和我聊天。非常感谢你把我父亲救出来。';
      }

      return '很高兴，你能和我聊天。我最担心的是我的父亲，你有他的消息了吗。';

    case 2:
      return '我的朋友，我这里有些攻防型幻兽...';

    case 3:
      return '我这里有许多幻兽，这个奇异兽听说是幻兽幻化时的最好副幻兽...';

    case 4:
      return '这是我精心为你培养的12星奇异兽...';

    case 5:
      return '看，这只亚特兰蒂斯大陆里非常稀有的极品19星奇异兽...';

    case 6:
      return '你把这无比优秀的19星奇异兽带上吧...';

    default:
      return '你好，很高兴见到你。';
  }
};

/**
 * 执行聊天功能
 * 增加友好度+1，并返回聊天奖励
 *
 * @param relationship 当前公主关系数据
 * @param hasRescuedKing 是否已救国王
 * @returns 聊天结果，包含是否成功、新亲密度、奖励和对话
 */
export const performChat = (
  relationship: PrincessRelationship,
  hasRescuedKing: boolean
): {
  success: boolean;
  newIntimacy: number;
  newLevel: number;
  reward: ChatReward | null;
  dialogue: string;
  message: string;
} => {
  // 检查今天是否可以聊天
  if (!relationship.canChatToday) {
    return {
      success: false,
      newIntimacy: relationship.intimacy,
      newLevel: relationship.level,
      reward: null,
      dialogue: '',
      message: '今天已经聊过天了，明天再来吧。'
    };
  }

  // 增加亲密度
  const newIntimacy = relationship.intimacy + 1;
  const newLevel = calculateRelationshipLevel(newIntimacy);

  // 获取奖励
  const reward = getChatReward(newLevel);

  // 获取对话
  const dialogue = getChatDialogue(newLevel, hasRescuedKing);

  // 生成提示消息
  let message = '与公主聊天，友好度+1。';
  if (reward) {
    message += `获得奖励：${reward.description}。`;
  }
  if (newLevel > relationship.level) {
    message += `恭喜！你与公主的关系提升到了${getRelationshipName(newLevel)}！`;
  }

  return {
    success: true,
    newIntimacy,
    newLevel,
    reward,
    dialogue,
    message
  };
};

// ========== 送礼功能 ==========

/**
 * 计算送礼增加的亲密度
 * 根据花朵类型和数量计算亲密度增加
 *
 * @param flowerType 花朵类型 ('99朵白玫瑰' | '999朵白玫瑰')
 * @param quantity 花朵数量
 * @returns 增加的亲密度
 *
 * @example
 * calculateGiftIntimacy('99朵白玫瑰', 1)   // 返回: 5 (基础5点)
 * calculateGiftIntimacy('99朵白玫瑰', 10)   // 返回: 14 (基础5点 + 9点)
 * calculateGiftIntimacy('999朵白玫瑰', 1)   // 返回: 25 (基础25点)
 * calculateGiftIntimacy('999朵白玫瑰', 10)  // 返回: 70 (基础25点 + 45点)
 */
export const calculateGiftIntimacy = (
  flowerType: '99朵白玫瑰' | '999朵白玫瑰',
  quantity: number
): number => {
  if (flowerType === '99朵白玫瑰') {
    // 99朵白玫瑰：基础5点 + 每多1朵+1点
    return 5 + (quantity - 1) * 1;
  } else if (flowerType === '999朵白玫瑰') {
    // 999朵白玫瑰：基础25点 + 每多1朵+5点
    return 25 + (quantity - 1) * 5;
  }

  return 0;
};

/**
 * 检查是否可以赠送玫瑰花
 * 检查本周已赠送数量是否达到上限
 *
 * @param relationship 当前公主关系数据
 * @param quantity 本次要赠送的数量
 * @returns 是否可以赠送
 */
export const canGiftRose = (
  relationship: PrincessRelationship,
  quantity: number
): { canGift: boolean; remainingCount: number; message: string } => {
  const currentCount = relationship.weeklyRoseGiftCount || 0;
  const remainingCount = MAX_WEEKLY_ROSE_GIFT_COUNT - currentCount;

  if (currentCount >= MAX_WEEKLY_ROSE_GIFT_COUNT) {
    return {
      canGift: false,
      remainingCount: 0,
      message: `本周已赠送${MAX_WEEKLY_ROSE_GIFT_COUNT}个玫瑰花，下周再来吧。`
    };
  }

  if (quantity > remainingCount) {
    return {
      canGift: false,
      remainingCount,
      message: `本周还能赠送${remainingCount}个玫瑰花，请减少数量。`
    };
  }

  return {
    canGift: true,
    remainingCount,
    message: ''
  };
};

/**
 * 执行送礼功能
 * 送花给公主，增加亲密度
 *
 * @param relationship 当前公主关系数据
 * @param flowerType 花朵类型
 * @param quantity 花朵数量
 * @param isSunday 是否是周日
 * @returns 送礼结果
 */
export const performGift = (
  relationship: PrincessRelationship,
  flowerType: '99朵白玫瑰' | '999朵白玫瑰',
  quantity: number,
  isSunday: boolean
): GiftResult => {
  // 检查是否是周日
  if (!isSunday) {
    return {
      success: false,
      intimacyGain: 0,
      message: '只有在周日才能送花给公主。'
    };
  }

  // 检查今天是否已送礼
  if (!relationship.canGiftToday) {
    return {
      success: false,
      intimacyGain: 0,
      message: '今天已经送过礼物了，明天再来吧。'
    };
  }

  // 计算亲密度增加
  const intimacyGain = calculateGiftIntimacy(flowerType, quantity);

  return {
    success: true,
    intimacyGain,
    message: `公主收下了你的${quantity}份${flowerType}，友好度+${intimacyGain}！`
  };
};

// ========== 周日礼物功能 ==========

/**
 * 获取周日礼物
 * 根据关系等级返回对应的周日礼物
 *
 * @param relationshipLevel 关系等级 (0-6)
 * @param hasOpenedSoul 是否已开战魂（仅关系等级6时需要）
 * @returns 周日礼物，如果没有礼物则返回 null
 *
 * @example
 * getSundayGift(0, false)  // 返回: { itemId: 'senior_exp_stone', itemName: '高级经验石', ... }
 * getSundayGift(5, false)  // 返回: { itemId: 'soul_king', itemName: '灵魂王', ... }
 * getSundayGift(6, false)  // 返回: { itemId: 'plasma_potion', itemName: '电浆药水', ... }
 * getSundayGift(6, true)   // 返回: { itemId: 'battle_soul_heart', itemName: '战魂之心', ... }
 */
export const getSundayGift = (
  relationshipLevel: number,
  hasOpenedSoul: boolean = false
): SundayGift | null => {
  // 关系等级 0-2：高级经验石
  if (relationshipLevel >= 0 && relationshipLevel <= 2) {
    return {
      itemId: 'senior_exp_stone',
      itemName: '高级经验石',
      description: '这是我收藏了许久的优质宝石，高级经验石...'
    };
  }

  // 关系等级 3-4：高级战斗力石
  if (relationshipLevel >= 3 && relationshipLevel <= 4) {
    return {
      itemId: 'senior_combat_stone',
      itemName: '高级战斗力石',
      description: '这是我收藏了许久的优质宝石，高级战斗力石...'
    };
  }

  // 关系等级 5：灵魂王
  if (relationshipLevel === 5) {
    return {
      itemId: 'soul_king',
      itemName: '灵魂王',
      description: '这是我收藏了许久的优质宝石，灵魂王...'
    };
  }

  // 关系等级 6：根据是否开战魂决定礼物
  if (relationshipLevel === 6) {
    if (hasOpenedSoul) {
      return {
        itemId: 'battle_soul_heart',
        itemName: '战魂之心',
        description: '我找到了一个战魂之心，它是极其稀有的宝石...'
      };
    } else {
      return {
        itemId: 'plasma_potion',
        itemName: '电浆药水',
        description: '我找到了一瓶电浆药水，它可以把人物的幸运提高到100哦。',
        condition: '未开战魂'
      };
    }
  }

  return null;
};

/**
 * 领取周日礼物
 *
 * @param relationship 当前公主关系数据
 * @param isSunday 是否是周日
 * @param hasOpenedSoul 是否已开战魂
 * @returns 领取结果
 */
export const receiveSundayGift = (
  relationship: PrincessRelationship,
  isSunday: boolean,
  hasOpenedSoul: boolean = false
): {
  success: boolean;
  gift: SundayGift | null;
  message: string;
} => {
  // 检查是否是周日
  if (!isSunday) {
    return {
      success: false,
      gift: null,
      message: '只有在周日才能领取公主的礼物。'
    };
  }

  // 检查本周是否已领取
  if (!relationship.canReceiveSundayGift) {
    return {
      success: false,
      gift: null,
      message: '本周已经领取过礼物了，下周再来吧。'
    };
  }

  // 获取礼物
  const gift = getSundayGift(relationship.level, hasOpenedSoul);

  if (!gift) {
    return {
      success: false,
      gift: null,
      message: '当前关系等级没有礼物可领取。'
    };
  }

  return {
    success: true,
    gift,
    message: `${gift.description}获得：${gift.itemName}！`
  };
};

// ========== 知己的礼物功能 ==========

/**
 * 获取知己的礼物
 * 关系达到知己（等级4）后，可以获得年猪
 *
 * @returns 知己的礼物信息
 */
export const getConfidantGift = (): {
  itemId: string;
  itemName: string;
  description: string;
} => {
  return {
    itemId: 'year_pig',
    itemName: '年猪',
    description: '超级幻兽——年猪，它拥有强大的战斗力！'
  };
};

/**
 * 领取知己的礼物
 * 关系达到知己（等级4）后，可以领取一次年猪礼物
 *
 * 参考文档：reference/docs/project_docs/10_公主系统.md（知己的礼物部分）
 *
 * @param relationship 当前公主关系数据
 * @returns 领取结果，包含是否成功、礼物信息和提示消息
 *
 * @example
 * const result = receiveConfidantGift(princessRelationship);
 * if (result.success) {
 *   // 领取成功，更新状态：hasReceivedConfidantGift = true
 *   // 将礼物添加到背包
 * }
 */
export const receiveConfidantGift = (
  relationship: PrincessRelationship
): {
  success: boolean;
  gift: { itemId: string; itemName: string; description: string } | null;
  message: string;
} => {
  // 检查关系等级是否达到知己（等级4）
  if (relationship.level < 4) {
    return {
      success: false,
      gift: null,
      message: '需要达到知己关系才能领取此礼物。'
    };
  }

  // 检查是否已领取过知己礼物（只能领取一次）
  if (relationship.hasReceivedConfidantGift) {
    return {
      success: false,
      gift: null,
      message: '你已经领取过知己的礼物了，每人只能领取一次。'
    };
  }

  // 获取礼物信息
  const gift = getConfidantGift();

  // 返回成功结果，包含礼物和提示消息
  return {
    success: true,
    gift,
    message: `公主送给了你一只${gift.description}`
  };
};

// ========== 魔族大军情报功能 ==========

/**
 * 获取所有魔族大军情报
 *
 * @returns 魔族大军情报列表
 */
export const getAllDemonArmyInfo = (): DemonArmyInfo[] => {
  return DEMON_ARMY_INFO;
};

/**
 * 获取指定魔族大军情报
 *
 * @param demonId 魔族ID
 * @returns 魔族情报，如果不存在则返回 null
 */
export const getDemonArmyInfoById = (demonId: string): DemonArmyInfo | null => {
  return DEMON_ARMY_INFO.find(demon => demon.id === demonId) || null;
};

/**
 * 获取魔族大军情报对话内容
 * 用于国王NPC显示魔族军队信息
 *
 * @param demonId 魔族ID
 * @returns 对话内容
 */
export const getDemonArmyDialogue = (demonId: string): string => {
  const demon = getDemonArmyInfoById(demonId);

  if (!demon) {
    return '没有找到该魔族军队的情报。';
  }

  let dialogue = `【${demon.name}】\n`;

  if (demon.level > 0) {
    dialogue += `等级：${demon.level}级\n`;
  }

  dialogue += `特殊效果：${demon.effect}\n`;
  dialogue += `描述：${demon.description}`;

  return dialogue;
};

// ========== 关系升级提示功能 ==========

/**
 * 获取关系升级提示消息
 *
 * @param newLevel 新的关系等级
 * @returns 提示消息
 */
export const getUpgradeMessage = (newLevel: number): string => {
  switch (newLevel) {
    case 1:
      return '恭喜，你认识了公主。';
    case 2:
      return '恭喜，你与公主交上朋友了。';
    case 3:
      return '恭喜，你与公主成为好朋友了。';
    case 4:
      return '恭喜，你与公主已经成为知己了。';
    case 5:
      return '恭喜，你与公主感情关系提高到了恋人了。学会了新技能：爱的力量。';
    case 6:
      return '恭喜，你与公主感情关系到了最高级了。学会了新技能：爱的力量。';
    default:
      return '关系等级提升！';
  }
};

// ========== 每日重置功能 ==========

/**
 * 重置每日状态
 * 每天重置聊天和送礼状态
 *
 * @param relationship 当前公主关系数据
 * @returns 重置后的关系数据
 */
export const resetDailyStatus = (
  relationship: PrincessRelationship
): PrincessRelationship => {
  return {
    ...relationship,
    canChatToday: true,
    canGiftToday: true
  };
};

/**
 * 重置每周状态
 * 每周日重置礼物领取状态和玫瑰花赠送计数
 *
 * @param relationship 当前公主关系数据
 * @returns 重置后的关系数据
 */
export const resetWeeklyStatus = (
  relationship: PrincessRelationship
): PrincessRelationship => {
  return {
    ...relationship,
    canReceiveSundayGift: true,
    weeklyRoseGiftCount: 0 // 重置每周玫瑰花赠送计数
  };
};

/**
 * 更新关系数据
 * 根据亲密度更新关系等级和名称
 *
 * @param relationship 当前公主关系数据
 * @param intimacyChange 亲密度变化值（可正可负）
 * @returns 更新后的关系数据
 */
export const updateRelationship = (
  relationship: PrincessRelationship,
  intimacyChange: number
): PrincessRelationship => {
  const newIntimacy = Math.max(0, relationship.intimacy + intimacyChange);
  const newLevel = calculateRelationshipLevel(newIntimacy);
  const newName = getRelationshipName(newLevel);

  return {
    ...relationship,
    intimacy: newIntimacy,
    level: newLevel,
    relationshipName: newName
  };
};

// ========== 技能学习功能 ==========

/**
 * 检查关系等级是否需要解锁技能
 * 根据关系等级配置检查是否需要学习"爱的力量"技能
 *
 * @param oldLevel 旧的关系等级
 * @param newLevel 新的关系等级
 * @returns 需要学习的技能信息，如果不需要则返回 null
 *
 * @example
 * checkSkillUnlock(4, 5)  // 返回: { skillId: 'love_power', skillLevel: 1 }
 * checkSkillUnlock(5, 6)  // 返回: { skillId: 'love_power', skillLevel: 2 }
 * checkSkillUnlock(3, 4)  // 返回: null
 */
export const checkSkillUnlock = (
  oldLevel: RelationshipLevel,
  newLevel: RelationshipLevel
): { skillId: string; skillLevel: number } | null => {
  // 只有等级提升时才检查技能解锁
  if (newLevel <= oldLevel) {
    return null;
  }

  // 检查是否达到等级5（恋人）
  if (newLevel >= 5 && oldLevel < 5) {
    return {
      skillId: 'skill_love_power',
      skillLevel: 1
    };
  }

  // 检查是否达到等级6（亲密恋人）
  if (newLevel >= 6 && oldLevel < 6) {
    return {
      skillId: 'skill_love_power',
      skillLevel: 2
    };
  }

  return null;
};

/**
 * 学习"爱的力量"技能
 * 根据关系等级学习对应等级的技能
 *
 * @param currentSkills 当前技能列表
 * @param skillLevel 要学习的技能等级（1或2）
 * @returns 学习结果
 *
 * @example
 * // 学习等级1
 * learnLovePowerSkill(skills, 1)
 *
 * // 学习等级2（升级）
 * learnLovePowerSkill(skills, 2)
 */
export const learnLovePowerSkill = (
  currentSkills: SkillDetail[],
  skillLevel: number
): SkillLearnResult => {
  // 查找"爱的力量"技能（索引5）
  const skillIndex = currentSkills.findIndex(
    skill => skill.id === 'skill_love_power'
  );

  // 如果找不到技能，返回错误
  if (skillIndex === -1) {
    return {
      success: false,
      skillId: 'skill_love_power',
      skillName: '爱的力量',
      skillLevel: 0,
      message: '未找到"爱的力量"技能数据',
      updatedSkills: currentSkills
    };
  }

  const currentSkill = currentSkills[skillIndex];

  // 检查是否已经学习了更高等级
  if (currentSkill.isLearned && currentSkill.level >= skillLevel) {
    return {
      success: false,
      skillId: 'skill_love_power',
      skillName: '爱的力量',
      skillLevel: currentSkill.level,
      message: `"爱的力量"已达到或超过等级${skillLevel}`,
      updatedSkills: currentSkills
    };
  }

  // 学习或升级技能
  const updatedSkills = [...currentSkills];
  const newSkill: SkillDetail = {
    ...currentSkill,
    level: skillLevel,
    maxLevel: 2, // 爱的力量最高等级为2
    isLearned: true
  };
  updatedSkills[skillIndex] = newSkill;

  // 生成提示消息
  let message: string;
  if (currentSkill.isLearned) {
    // 升级
    message = `恭喜！"爱的力量"技能升级成功！当前等级：Lv.${skillLevel}`;
  } else {
    // 新学习
    message = `恭喜！学会了新技能："爱的力量" Lv.${skillLevel}`;
  }

  return {
    success: true,
    skillId: 'skill_love_power',
    skillName: '爱的力量',
    skillLevel,
    message,
    updatedSkills
  };
};

/**
 * 处理关系升级（包含技能学习）
 * 当关系等级提升时，自动检查并学习"爱的力量"技能
 *
 * @param relationship 当前公主关系数据
 * @param intimacyChange 亲密度变化值
 * @param currentSkills 当前技能列表
 * @returns 关系升级结果，包含更新后的关系数据和技能学习结果
 *
 * @example
 * // 从知己升级到恋人
 * const result = processRelationshipUpgrade(relationship, 50, skills);
 * if (result.skillLearnResult?.success) {
 *   console.log('学会了"爱的力量"技能！');
 * }
 */
export const processRelationshipUpgrade = (
  relationship: PrincessRelationship,
  intimacyChange: number,
  currentSkills: SkillDetail[]
): RelationshipUpgradeResult => {
  // 更新关系数据
  const newRelationship = updateRelationship(relationship, intimacyChange);

  // 检查是否需要学习技能
  const skillUnlock = checkSkillUnlock(relationship.level, newRelationship.level);

  let skillLearnResult: SkillLearnResult | null = null;
  let upgradeMessage = '';

  // 如果关系等级提升，生成升级消息
  if (newRelationship.level > relationship.level) {
    upgradeMessage = getUpgradeMessage(newRelationship.level);

    // 如果需要学习技能
    if (skillUnlock) {
      skillLearnResult = learnLovePowerSkill(currentSkills, skillUnlock.skillLevel);

      // 如果技能学习成功，添加技能学习提示
      if (skillLearnResult.success) {
        upgradeMessage += `\n${skillLearnResult.message}`;
      }
    }
  }

  return {
    relationship: newRelationship,
    skillLearnResult,
    upgradeMessage
  };
};
