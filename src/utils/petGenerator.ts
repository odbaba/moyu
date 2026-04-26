/**
 * 幻兽生成工具函数
 * 提供幻兽属性生成、评分计算等功能
 * 参考文档：reference/docs/初始幻兽生成规格文档.md
 */

import type { Pet, PetRating, PetType } from '../types';

// ========== 幻兽类型基础评分映射 ==========
// 参考文档：reference/docs/project_docs/02_幻兽系统.md 第386-398行
const petTypeBaseScore: Record<PetType, number> = {
  '攻防型': 0,
  '调皮猫': 280,
  '吉鲁猪': 380,
  '奇异兽': 450,
  '圣天使': 280,
  '守护': 550,
  '年猪': 380
};

// ========== 奇异兽星级罕见度加分映射 ==========
// 参考文档：reference/docs/project_docs/02_幻兽系统.md 第386-398行
// 罕见度加分是固定的，加上基础评分450和属性评分后，总评分至少达到对应星级
const strangePetStarBonus: Record<number, number> = {
  1: 0, // 1星：基础450 + 罕见度0 = 450
  8: 350, // 8星：基础450 + 罕见度350 = 800（至少8星）
  12: 750, // 12星：基础450 + 罕见度750 = 1200（至少12星）
  19: 1450 // 19星：基础450 + 罕见度1450 = 1900（至少19星）
};

// ========== 幻兽生成选项接口 ==========
export interface PetGenerateOptions {
  id?: string;
  othername?: string;
  level?: number;
  isDeployed?: boolean;
  isMerged?: boolean;
}

/**
 * 根据评分计算品质称号
 * 参考文档：reference/docs/project_docs/02_幻兽系统.md 第401-446行
 *
 * @param score 总评分(pz)
 * @returns 品质称号字符串
 */
export function getQualityTitle(score: number): string {
  if (score >= 100) {
    const stars = (score / 100).toFixed(2);

    return `极品${stars}星`;
  } else if (score >= 75) {
    return '万众瞩目';
  } else if (score >= 50) {
    return '千载难逢';
  } else if (score >= 25) {
    return '百里挑一';
  } else if (score >= 10) {
    return '优秀';
  } else {
    return '普通';
  }
}

// ========== 评分计算函数 ==========
// 参考文档：reference/docs/project_docs/02_幻兽系统.md 第253-309行

/**
 * 计算初始属性评分
 * 基于标准值差值×2
 * 评分保留整数
 */
function calculateInitialRating(
  chp: number,
  cxgj: number,
  cdgj: number,
  cfy: number
): { pz_chp: number; pz_cxgj: number; pz_cdgj: number; pz_cfy: number } {
  return {
    pz_chp: Math.round(Math.max(0, (chp - 100) * 2)),
    pz_cxgj: Math.round(Math.max(0, (cxgj - 15) * 2)),
    pz_cdgj: Math.round(Math.max(0, (cdgj - 25) * 2)),
    pz_cfy: Math.round(Math.max(0, (cfy - 10) * 2))
  };
}

/**
 * 计算成长属性评分
 * 差值≤10时：差值×20
 * 差值>10时：(差值-10)×100 + 200
 * 评分保留整数
 */
function calculateGrowthRating(
  cz_hp: number,
  cz_xgj: number,
  cz_dgj: number,
  cz_fy: number
): { pz_cz_hp: number; pz_cz_xgj: number; pz_cz_dgj: number; pz_cz_fy: number } {
  const baseHp = 40;
  const baseXgj = 10;
  const baseDgj = 15;
  const baseFy = 5;

  const calcScore = (value: number, base: number): number => {
    const diff = value - base;

    if (diff <= 0) return 0;
    if (diff <= 10) return Math.round(diff * 20);

    return Math.round((diff - 10) * 100 + 200);
  };

  return {
    pz_cz_hp: calcScore(cz_hp, baseHp),
    pz_cz_xgj: calcScore(cz_xgj, baseXgj),
    pz_cz_dgj: calcScore(cz_dgj, baseDgj),
    pz_cz_fy: calcScore(cz_fy, baseFy)
  };
}

/**
 * 计算总评分
 * 总评分 = 基础评分 + 初始属性评分 + 成长属性评分
 * 评分保留整数
 */
function calculateTotalScore(
  pzbase: number,
  initialRating: { pz_chp: number; pz_cxgj: number; pz_cdgj: number; pz_cfy: number },
  growthRating: { pz_cz_hp: number; pz_cz_xgj: number; pz_cz_dgj: number; pz_cz_fy: number }
): number {
  return Math.round(pzbase +
    initialRating.pz_chp + initialRating.pz_cxgj + initialRating.pz_cdgj + initialRating.pz_cfy +
    growthRating.pz_cz_hp + growthRating.pz_cz_xgj + growthRating.pz_cz_dgj + growthRating.pz_cz_fy);
}

// ========== 属性计算函数 ==========

/**
 * 计算最大生命值
 * 公式：生命成长率 × (等级-1) + 初始生命值
 */
function calculateMaxHp(cz_hp: number, chp: number, dj: number): number {
  return Math.round(cz_hp * (dj - 1) + chp);
}

/**
 * 计算最小攻击力
 * 公式：最小攻击成长率 × (等级-1) + 初始最小攻击
 */
function calculateMinAttack(cz_xgj: number, cxgj: number, dj: number): number {
  return Math.round(cz_xgj * (dj - 1) + cxgj);
}

/**
 * 计算最大攻击力
 * 公式：最大攻击成长率 × (等级-1) + 初始最大攻击
 */
function calculateMaxAttack(cz_dgj: number, cdgj: number, dj: number): number {
  return Math.round(cz_dgj * (dj - 1) + cdgj);
}

/**
 * 计算防御力
 * 公式：防御成长率 × (等级-1) + 初始防御
 */
function calculateDefense(cz_fy: number, cfy: number, dj: number): number {
  return Math.round(cz_fy * (dj - 1) + cfy);
}

// ========== 幻兽属性生成函数 ==========

/**
 * 生成幻兽基础属性
 * 参考文档：reference/docs/初始幻兽生成规格文档.md 第189-252行
 *
 * @param petType 幻兽类型
 * @returns 生成的属性对象
 */
/**
 * 生成幻兽属性
 * 参考文档：reference/docs/project_docs/02.2_幻兽属性生成系统.md
 *
 * @param petType 幻兽类型
 * @returns 幻兽属性对象
 */
function generatePetAttributes(petType: PetType): {
  cxgj: number;
  cdgj: number;
  cfy: number;
  chp: number;
  cz_xgj: number;
  cz_dgj: number;
  cz_fy: number;
  cz_hp: number;
} {
  // ========== 年猪特殊处理 ==========
  // 年猪拥有固定的初始属性，没有额外属性加成机制，成长率属性仍为随机生成
  if (petType === '年猪') {
    // 固定初始属性
    const cxgj = 88; // 固定初始最小攻击
    const cdgj = 88; // 固定初始最大攻击
    const cfy = 88; // 固定初始防御
    const chp = 188; // 固定初始生命

    // 成长率属性仍为随机生成
    const cz_xgj = 8 + Math.floor(Math.random() * 4);
    const cz_dgj = Math.floor(Math.random() * (17 - cz_xgj)) + cz_xgj;
    const cz_fy = 1 + Math.floor(Math.random() * 6);
    const cz_hp = 30 + Math.floor(Math.random() * 12);

    return {
      cxgj,
      cdgj,
      cfy,
      chp,
      cz_xgj,
      cz_dgj,
      cz_fy,
      cz_hp
    };
  }

  // ========== 随机生成初始属性 ==========
  let cxgj = Math.floor(Math.random() * 5) + 10;
  let cdgj = Math.floor(Math.random() * (30 - cxgj)) + cxgj;
  let cfy = Math.floor(Math.random() * 5) + 5;
  let chp = Math.floor(Math.random() * 15) + 20;

  // ========== 随机生成成长属性 ==========
  let cz_xgj = 8 + Math.floor(Math.random() * 4);
  let cz_dgj = Math.floor(Math.random() * (17 - cz_xgj)) + cz_xgj;
  let cz_fy = 1 + Math.floor(Math.random() * 6);
  let cz_hp = 30 + Math.floor(Math.random() * 12);

  // ========== 随机加成 (12.5%概率触发其中一种) ==========
  const bonusType = Math.floor(Math.random() * 8);

  switch (bonusType) {
    case 0:
      // 初始最小攻击大加成 (0-99)
      cxgj = Math.floor(Math.random() * 100);
      if (cdgj < cxgj) {
        cdgj = cxgj;
      }
      break;
    case 1:
      // 初始最大攻击大加成 (cxgj ~ 99)
      cdgj = Math.floor(Math.random() * (100 - cxgj)) + cxgj;
      break;
    case 2:
      // 初始防御大加成 (0-99)
      cfy = Math.floor(Math.random() * 100);
      break;
    case 3:
      // 初始生命大加成
      // 攻防型：random(291)，圣天使：random(400)，其他：random(200)
      if (petType === '攻防型') {
        chp = Math.floor(Math.random() * 291);
      } else if (petType === '圣天使') {
        chp = Math.floor(Math.random() * 400);
      } else {
        chp = Math.floor(Math.random() * 200);
      }
      break;
    case 4: {
      // 最小攻击成长大加成 (0-20)
      cz_xgj = Math.floor(Math.random() * 21);
      if (cz_dgj < cz_xgj) {
        cz_dgj = cz_xgj;
      }
      break;
    }
    case 5:
      // 最大攻击成长大加成 (cz_xgj ~ 25)
      cz_dgj = Math.floor(Math.random() * (26 - cz_xgj)) + cz_xgj;
      break;
    case 6:
      // 防御成长大加成 (0-15)
      cz_fy = Math.floor(Math.random() * 16);
      break;
    case 7:
      // 生命成长大加成 (0-40)
      cz_hp = Math.floor(Math.random() * 41);
      break;
  }

  return {
    cxgj,
    cdgj,
    cfy,
    chp,
    cz_xgj,
    cz_dgj,
    cz_fy,
    cz_hp
  };
}

/**
 * 生成幻兽ID
 * 格式：pet-{类型}-{时间戳}-{随机字符串}
 */
function generatePetId(petType: PetType): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substr(2, 9);
  const typeKey = petType.replace(/[()（）]/g, '');

  return `pet-${typeKey}-${timestamp}-${randomStr}`;
}

// ========== 通用幻兽生成函数 ==========

/**
 * 通用幻兽生成函数
 * 支持生成所有类型的幻兽（攻防型、调皮猫、吉鲁猪、奇异兽、圣天使、守护、年猪）
 * 参考文档：reference/docs/project_docs/02_幻兽系统.md 第136-151行
 *
 * @param petType 幻兽类型
 * @param options 生成选项
 * @returns 生成的幻兽数据
 */
export function generatePetByType(petType: PetType, options?: PetGenerateOptions): Pet {
  // ========== 基础信息 ==========
  const id = options?.id || generatePetId(petType);
  const othername = options?.othername || petType;
  const dj = options?.level || 1;
  const isDeployed = options?.isDeployed || false;
  const isMerged = options?.isMerged || false;

  // ========== 生成属性 ==========
  const attributes = generatePetAttributes(petType);

  // ========== 计算当前属性值 ==========
  const hp = calculateMaxHp(attributes.cz_hp, attributes.chp, dj);
  const mhp = hp;
  const xgj = calculateMinAttack(attributes.cz_xgj, attributes.cxgj, dj);
  const dgj = calculateMaxAttack(attributes.cz_dgj, attributes.cdgj, dj);
  const fy = calculateDefense(attributes.cz_fy, attributes.cfy, dj);

  // ========== 计算评分 ==========
  const pzbase = petTypeBaseScore[petType];
  const initialRating = calculateInitialRating(
    attributes.chp,
    attributes.cxgj,
    attributes.cdgj,
    attributes.cfy
  );
  const growthRating = calculateGrowthRating(
    attributes.cz_hp,
    attributes.cz_xgj,
    attributes.cz_dgj,
    attributes.cz_fy
  );

  const rating: PetRating = {
    pzbase,
    ...initialRating,
    ...growthRating
  };

  // 计算总评分
  const pz = calculateTotalScore(pzbase, initialRating, growthRating);

  // ========== 返回幻兽数据 ==========
  return {
    id,
    hs_name: petType,
    othername,
    dj,
    hp,
    mhp,
    xgj,
    dgj,
    fy,
    jy: 0,
    mjy: 10,
    zs: 0,
    pz,
    qualityTitle: getQualityTitle(pz),
    isDeployed,
    isMerged,
    chp: attributes.chp,
    cxgj: attributes.cxgj,
    cdgj: attributes.cdgj,
    cfy: attributes.cfy,
    cz_hp: attributes.cz_hp,
    cz_xgj: attributes.cz_xgj,
    cz_dgj: attributes.cz_dgj,
    cz_fy: attributes.cz_fy,
    rating,
    // 幻化相关属性（初始值）
    hun: 1, // 升级经验递增变量
    predj: 1, // 幻化前等级
    premjy: 10, // 幻化前升级所需经验
    prejy: 0 // 幻化前当前经验
  };
}

// ========== 指定星级奇异兽生成函数 ==========

/**
 * 生成指定星级奇异兽
 * 参考文档：reference/docs/project_docs/02_幻兽系统.md 第386-398行
 * 参考代码：reference/scripts/DefineSprite_626/frame_1/DoAction.as 第62-68行
 *
 * 星级罕见度加分规则：
 * - 8星奇异兽：罕见度加分350（总评分至少800）
 * - 12星奇异兽：罕见度加分750（总评分至少1200）
 * - 19星奇异兽：罕见度加分1450（总评分至少1900）
 *
 * 如果是生成普通奇异兽，直接调用generatePetByType函数
 *
 * 总评分 = 基础评分(450) + 属性评分 + 罕见度加分
 *
 * @param starLevel 星级 (8, 12, 19)
 * @param options 生成选项
 * @returns 生成的奇异兽数据
 */
export function generateStarStrangePet(starLevel: number, options?: PetGenerateOptions): Pet {
  // 验证星级
  if (!strangePetStarBonus[starLevel] || strangePetStarBonus[starLevel] === 0) {
    throw new Error(`无效的奇异兽星级: ${starLevel}。有效星级为: 8, 12, 19`);
  }

  // 获取罕见度加分
  const rarityBonus = strangePetStarBonus[starLevel];

  // 生成奇异兽（基础评分490 + 随机属性评分）
  const pet = generatePetByType('奇异兽', options);

  // 更新评分：基础评分 + 属性评分 + 罕见度加分
  const pz = pet.pz + rarityBonus;

  // 更新评级信息
  const qualityTitle = getQualityTitle(pz);

  // 返回更新后的幻兽数据
  return {
    ...pet,
    pz,
    qualityTitle,
    // 更新评分详情，增加罕见度加分到基础评分中
    rating: {
      ...pet.rating,
      pzbase: pet.rating.pzbase + rarityBonus
    }
  };
}

// ========== 奇异兽生成函数（幻兽研究所购买） ==========

/**
 * 生成奇异兽（幻兽研究所购买）
 * 根据品质分生成对应品质的奇异兽
 * 参考文档：reference/docs/幻兽研究所交互逻辑文档.md
 *
 * @param qualityScore 品质分（由技术等级计算得出：技术等级 × 75）
 * @param options 生成选项
 * @returns 生成的奇异兽数据
 */
export function generateStrangePet(qualityScore: number, options?: PetGenerateOptions): Pet {
  // 生成奇异兽基础属性
  const pet = generatePetByType('奇异兽', options);

  // 计算其他各项评分总和（不包括基础评分）
  const otherScore = pet.rating.pz_chp + pet.rating.pz_cxgj + pet.rating.pz_cdgj + pet.rating.pz_cfy +
    pet.rating.pz_cz_hp + pet.rating.pz_cz_xgj + pet.rating.pz_cz_dgj + pet.rating.pz_cz_fy;

  // 基础评分就是 qualityScore
  const pzbase = qualityScore;

  // 总评分 = 基础评分 + 其他各项评分
  const pz = pzbase + otherScore;

  // 更新评级信息
  const qualityTitle = getQualityTitle(pz);

  // 返回更新后的幻兽数据
  return {
    ...pet,
    pz,
    qualityTitle,
    // 更新评分详情，基础评分设为 qualityScore
    rating: {
      ...pet.rating,
      pzbase
    }
  };
}

// ========== 初始幻兽生成函数 ==========

/**
 * 生成初始攻防型幻兽
 * 完全按照文档规范实现随机属性生成
 * 参考文档：reference/docs/初始幻兽生成规格文档.md 第189-252行
 *
 * @param id 幻兽ID
 * @param othername 显示名称
 * @param isDeployed 是否出征
 * @param isMerged 是否合体
 * @returns 生成的幻兽数据
 */
export function generateInitialPet(
  id: string,
  othername: string,
  isDeployed: boolean = false,
  isMerged: boolean = false
): Pet {
  return generatePetByType('攻防型', {
    id,
    othername,
    isDeployed,
    isMerged
  });
}

/**
 * 生成两只初始攻防型幻兽
 * 新游戏开始时调用，两只幻兽都设置为出征和合体状态
 *
 * @returns 两只初始幻兽数组
 */
export function generateInitialPets(): Pet[] {
  const pet1 = generateInitialPet('initial-pet-001', '攻防型', true, true);
  const pet2 = generateInitialPet('initial-pet-002', '攻防型', true, true);

  return [pet1, pet2];
}

// ========== 幻兽升级函数 ==========

/**
 * 幻兽升级函数
 * 根据新等级重新计算幻兽属性，返回新的幻兽对象
 *
 * @param pet 原幻兽数据
 * @param newLevel 新等级 (1-130)
 * @returns 升级后的新幻兽数据
 */
export function upgradePetLevel(pet: Pet, newLevel: number): Pet {
  const newMhp = calculateMaxHp(pet.cz_hp, pet.chp, newLevel);
  const newXgj = calculateMinAttack(pet.cz_xgj, pet.cxgj, newLevel);
  const newDgj = calculateMaxAttack(pet.cz_dgj, pet.cdgj, newLevel);
  const newFy = calculateDefense(pet.cz_fy, pet.cfy, newLevel);

  return {
    ...pet,
    dj: newLevel,
    mhp: newMhp,
    hp: newMhp,
    xgj: newXgj,
    dgj: newDgj,
    fy: newFy
  };
}

// ========== 幻兽经验获取函数 ==========

/**
 * 幻兽获得经验并处理升级的结果接口
 */
export interface PetExperienceResult {
  pet: Pet; // 更新后的幻兽数据
  leveledUp: boolean; // 是否升级
  message?: string; // 提示消息
  luckBonus: number; // 幸运值增加量（幻兽升级时玩家幸运值+1）
}

/**
 * 幻兽获得经验并处理升级
 * 参考文档：reference/docs/project_docs/02.1_幻兽升级经验系统.md
 * 参考代码：reference/scripts/DefineSprite_139_空幻兽对象/frame_1/DoAction.as
 *
 * 注意：幻兽升级时，玩家的幸运值会增加（每次升级+1，上限100）
 *
 * @param pet 幻兽对象
 * @param expAmount 获得的经验值（基础值，会自动翻倍）
 * @param playerLevel 玩家等级（用于等级限制检查）
 * @param skipLevelLimit 是否跳过等级限制（幻化场景下使用）
 * @returns 更新后的幻兽数据和升级信息
 */
export function gainExperience(
  pet: Pet,
  expAmount: number,
  playerLevel: number,
  skipLevelLimit: boolean = false
): PetExperienceResult {
  // 1. 等级上限检查
  if (pet.dj >= 130) {
    return {
      pet: { ...pet, jy: 0 },
      leveledUp: false,
      message: '幻兽等级已满，无法再获得经验值了。',
      luckBonus: 0
    };
  }

  // 2. 人物等级关联检查（幻化场景下跳过）
  if (!skipLevelLimit && pet.dj >= playerLevel + 10) {
    return {
      pet,
      leveledUp: false,
      message: '幻兽等级已高于人物的10级，无法再获得经验值了。',
      luckBonus: 0
    };
  }

  // 3. 幻兽获得双倍经验
  const doubledExp = expAmount * 2;
  let newExp = pet.jy + doubledExp;
  let newLevel = pet.dj;
  let newMaxExp = pet.mjy;
  let newHun = pet.hun;
  let newPredj = pet.predj;
  let leveledUp = false;
  let message: string | undefined;
  let luckBonus = 0; // 累计幸运值增加量

  // 4. 升级循环处理
  while (newExp >= newMaxExp && newLevel < 130) {
    newExp -= newMaxExp;
    newLevel++;
    leveledUp = true;
    luckBonus++; // 每次升级幸运值+1

    // 更新 predj（幻化前等级记录）
    if (newPredj < newLevel) {
      newPredj = newLevel;
    }

    // 根据等级计算新的 mjy
    if (newLevel < 20) {
      // 等级 1-19: mjy = mjy × 1.2
      newMaxExp = Math.round(newMaxExp * 1.2);
    } else if (newLevel <= 50) {
      // 等级 20-50: mjy = mjy × 1.1
      newMaxExp = Math.round(newMaxExp * 1.1);
    } else if (newLevel < 130) {
      // 等级 51-129: mjy = mjy + hun
      newMaxExp += newHun;
    }

    // 50级特殊处理
    if (newLevel === 50) {
      // 计算 hun 值：50级时 mjy 的 20%
      newHun = Math.round(newMaxExp * 0.2);

      // 顿悟机制：如果幻化前等级 > 当前等级，恢复到幻化前等级
      if (pet.predj > newLevel) {
        newLevel = pet.predj;
        newMaxExp = pet.premjy;
        newExp = pet.prejy;
        message = `幻兽在升级中顿悟了，等级立即升到幻化转世之前的等级${newLevel}级`;
        break;
      } else {
        message = '你的幻兽达到50级了，可以到幻化大师那里进行幻化。';
      }
    }
  }

  // 5. 如果升级了，更新属性
  let updatedPet: Pet;
  if (newLevel !== pet.dj) {
    // 升级后更新属性
    updatedPet = upgradePetLevel(
      {
        ...pet,
        jy: newExp,
        mjy: newMaxExp,
        hun: newHun,
        predj: newPredj,
      },
      newLevel
    );
  } else {
    // 未升级，只更新经验值
    updatedPet = {
      ...pet,
      jy: newExp,
      mjy: newMaxExp,
      hun: newHun,
      predj: newPredj,
    };
  }

  return {
    pet: updatedPet,
    leveledUp,
    message,
    luckBonus,
  };
}

// ========== 导出 ==========
export { petTypeBaseScore, strangePetStarBonus };
export { calculateDefense, calculateMaxAttack, calculateMaxHp, calculateMinAttack };
export { calculateGrowthRating, calculateInitialRating, calculateTotalScore };
