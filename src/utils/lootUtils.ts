/**
 * 战利品工具函数模块
 * 提供战斗胜利后的战利品和经验奖励计算功能
 * 参考文档：reference/docs/project_docs/04_怪物系统.md
 */


import {
  // 移除 createEquipment，改用 itemFactory 中的 createEquipmentItem 统一接口
  douZhiYiYang,
  EQUIPMENT_LEVELS,
  feiTianLianZhan,
  gaoJiDouZhiYiYang,
  gaoJiFeiTianLianZhan,
  gaoJiXingMoJian,
  huanMoZhiXin,
  lingHunJingShi,
  lingHunWang,
  moHunZhiXin,
  // 特殊怪物掉落物品
  xingMoJian,
  yueGuangBaoHe,
  yueGuangBaoHeZengQiangBan,
} from '../data/inventoryData';
import type { EquipmentItem, InventoryItem } from '../types';
// 移除 generateItemId，改用 createEquipmentItem 统一接口（内部自动生成ID）
import { cloneItem, createEquipmentItem } from './itemFactory';

/**
 * 战利品结果接口
 */
export interface LootResult {
  gold: number; // 金币数量
  experience: number; // 经验值
  items: InventoryItem[]; // 获得的物品列表
  messages: string[]; // 奖励消息列表
}

/**
 * 装备类型数组（用于随机生成装备）
 */
const EQUIPMENT_TYPES: EquipmentItem['equipmentType'][] = ['weapon', 'helmet', 'clothes', 'shoes', 'bracelet', 'necklace'];


/**
 * 计算战利品
 * 根据怪物等级和最大生命值计算战利品
 *
 * 经验值计算公式（参考文档：04.1_怪物经验值.md）：
 * 1. 基础经验值 = 怪物最大生命值 ÷ 100
 * 2. 经验加成 = (玩家战斗力 - 玩家等级) × 0.05 + 宝石加成
 * 3. 实际经验 = 基础经验值 × (1 + 经验加成)
 *
 * @param monsterLevel 怪物等级
 * @param monsterMaxHp 怪物最大生命值
 * @param isBoss 是否为BOSS
 * @param luckValue 幸运值（影响掉落概率）
 * @param playerCombatPower 玩家战斗力（用于经验加成计算）
 * @param playerLevel 玩家等级（用于经验加成计算）
 * @param gemExpBonus 宝石经验加成（默认为0）
 * @returns 战利品结果
 */
export function calculateLoot(
  monsterLevel: number,
  monsterMaxHp: number,
  isBoss: boolean = false,
  luckValue: number = 0,
  playerCombatPower: number = 0,
  playerLevel: number = 1,
  gemExpBonus: number = 0
): LootResult {
  const messages: string[] = [];
  const items: InventoryItem[] = [];

  // 暴率 = 1 + (幸运值 + 1) / 100
  const dropRate = 1 + (luckValue + 1) / 100;

  // ========== 经验值计算（参考文档：04.1_怪物经验值.md） ==========
  // 1. 基础经验值 = 怪物最大生命值 ÷ 100
  const baseExperience = monsterMaxHp / 100;

  // 2. 经验加成计算
  // 战斗力加成：(玩家战斗力 - 玩家等级) × 0.05
  // 注意：如果战斗力 < 等级，加成为0（不减少经验）
  const combatPowerBonus = Math.max(0, (playerCombatPower - playerLevel) * 0.05);

  // 总经验加成 = 战斗力加成 + 宝石加成
  const totalExpBonus = combatPowerBonus + gemExpBonus;

  // 3. 实际经验 = 基础经验值 × (1 + 总经验加成)
  // 最低经验为1
  const experience = Math.max(1, Math.floor(baseExperience * (1 + totalExpBonus)));

  // 生成经验获得消息
  const expBonusPercent = Math.floor(totalExpBonus * 100);
  if (expBonusPercent > 0) {
    messages.push(`获得经验: ${experience} (加成+${expBonusPercent}%)`);
  } else {
    messages.push(`获得经验: ${experience}`);
  }

  // 金币 = 6 × (20 + 等级) × 10 × 暴率
  const gold = Math.floor(6 * (20 + monsterLevel) * 10 * dropRate);
  messages.push(`获得金币: ${gold}`);

  if (isBoss) {
    // BOSS掉落逻辑
    const bossLoot = generateBossLoot(monsterLevel, dropRate);
    items.push(...bossLoot.items);
    messages.push(...bossLoot.messages);
  } else {
    // 普通怪物掉落逻辑

    // 灵魂晶石 (2.5%概率)
    if (Math.random() * 200 < 5 * dropRate) {
      items.push(cloneItem(lingHunJingShi));
      messages.push('获得: 灵魂晶石');
    }

    // 装备掉落 (25%概率)
    if (Math.random() < 0.25) {
      const equipment = generateRandomEquipment(monsterLevel, dropRate);
      items.push(equipment);
      messages.push(`获得装备: ${equipment.name}`);
    }
  }

  return {
    gold,
    experience,
    items,
    messages,
  };
}

/**
 * 生成BOSS战利品
 *
 * @param bossLevel BOSS等级
 * @param dropRate 暴率
 * @returns 战利品结果
 */
function generateBossLoot(bossLevel: number, dropRate: number): { items: InventoryItem[]; messages: string[] } {
  const items: InventoryItem[] = [];
  const messages: string[] = [];

  // 灵魂晶石 (50%概率)
  if (Math.random() < 0.5) {
    items.push(cloneItem(lingHunJingShi));
    messages.push('获得: 灵魂晶石');
  }

  // 灵魂王 (等级/10%概率)
  if (Math.random() * 100 < bossLevel / 10) {
    items.push(cloneItem(lingHunWang));
    messages.push('获得: 灵魂王');
  }

  // 月光宝盒 (5%概率)
  if (Math.random() * 200 < 10 * dropRate) {
    if (bossLevel >= 60) {
      // 60级以上BOSS掉落月光宝盒增强版
      items.push(cloneItem(yueGuangBaoHeZengQiangBan));
      messages.push('获得: 月光宝盒增强版');
    } else {
      // 60级以下BOSS掉落月光宝盒
      items.push(cloneItem(yueGuangBaoHe));
      messages.push('获得: 月光宝盒');
    }
  }

  // 装备掉落 (必掉，品质更高)
  const equipment = generateRandomEquipment(bossLevel, dropRate, true);
  items.push(equipment);
  messages.push(`获得装备: ${equipment.name}`);

  return { items, messages };
}

/**
 * 生成随机装备
 * 使用 inventoryData.ts 中的 createEquipment 函数生成正确格式的装备
 *
 * @param monsterLevel 怪物等级
 * @param dropRate 暴率
 * @param isBossLoot 是否为BOSS掉落
 * @returns 装备物品
 */
function generateRandomEquipment(monsterLevel: number, dropRate: number, isBossLoot: boolean = false): EquipmentItem {
  // 等级处理：找到最接近的装备等级
  let equipLevel = monsterLevel;
  if (monsterLevel < 10) {
    equipLevel = 1;
  } else if (monsterLevel > 100) {
    equipLevel = 125;
  } else {
    // 找到最接近的装备等级
    equipLevel = EQUIPMENT_LEVELS.reduce((prev, curr) =>
      Math.abs(curr - monsterLevel) < Math.abs(prev - monsterLevel) ? curr : prev
    );
  }

  // 品质随机（0-4）
  let qualityNum = 0;
  if (isBossLoot) {
    // BOSS掉落：70%精品(3)，30%极品(4)
    qualityNum = Math.random() < 0.7 ? 3 : 4;
  } else {
    // 普通掉落
    if (Math.random() < 0.3) qualityNum = 1; // 良品
    if (Math.random() < 0.3) qualityNum = 2; // 上品
    if (Math.random() * 200 < 5 * dropRate) qualityNum = 3; // 精品
    if (Math.random() * 200 < 5 * dropRate) qualityNum = 4; // 极品
  }

  // 魔魂等级随机（0-12）
  const magicSoulLevel = Math.random() < 0.9
    ? Math.floor(Math.random() * 10)
    : 9 + Math.floor(Math.random() * 4);

  // 宝石洞数量随机（0-2）
  const holeCount = Math.random() < 0.05 ? Math.floor(Math.random() * 3) : 0;

  // 装备类型随机
  const equipmentType = EQUIPMENT_TYPES[Math.floor(Math.random() * EQUIPMENT_TYPES.length)];

  // 使用统一的装备创建接口（内部自动生成ID和完整装备数据）
  return createEquipmentItem({
    equipmentType,
    level: equipLevel,
    quality: qualityNum,
    magicSoulLevel,
    gemSlots: holeCount,
  });
}

/**
 * 合并多个战利品结果
 */
export function mergeLootResults(results: LootResult[]): LootResult {
  const merged: LootResult = {
    gold: 0,
    experience: 0,
    items: [],
    messages: [],
  };

  for (const result of results) {
    merged.gold += result.gold;
    merged.experience += result.experience;
    merged.items.push(...result.items);
    merged.messages.push(...result.messages);
  }

  return merged;
}

/**
 * 特殊怪物ID列表
 * 用于判断是否为特殊怪物
 */
const SPECIAL_MONSTER_IDS = [
  'zhizhu', // 蜘蛛
  'zhizhu-wanghou-aida', // 蜘蛛王后艾达
];

/**
 * 检查是否为特殊怪物
 * @param monsterId 怪物ID
 * @returns 是否为特殊怪物
 */
export function isSpecialMonster(monsterId: string): boolean {
  // 检查怪物ID是否包含特殊怪物标识
  return SPECIAL_MONSTER_IDS.some(id => monsterId.includes(id)) ||
         monsterId.includes('zhizhu') || // 蜘蛛相关
         monsterId.includes('spider'); // 英文标识
}

/**
 * 计算特殊怪物战利品
 * 蜘蛛和蜘蛛王后艾达有独特的掉落规则
 *
 * 参考文档：reference/docs/project_docs/04_怪物系统.md
 *
 * @param monsterId 怪物ID（用于判断是哪种特殊怪物）
 * @param dropRate 暴率
 * @returns 战利品结果
 */
export function calculateSpecialMonsterLoot(monsterId: string, dropRate: number): { items: InventoryItem[]; messages: string[] } {
  const items: InventoryItem[] = [];
  const messages: string[] = [];

  // 判断是蜘蛛还是蜘蛛王后艾达
  const isZhizhuWanghou = monsterId.includes('zhizhu-wanghou') ||
                          monsterId.includes('wanghou') ||
                          monsterId.includes('spider_queen');

  if (isZhizhuWanghou) {
    // ========== 蜘蛛王后艾达掉落（80级） ==========
    // 参考文档：reference/docs/project_docs/04_怪物系统.md

    // 高级斗志昂扬 (20% × 暴率)
    if (Math.random() * 100 < 20 * dropRate) {
      items.push(cloneItem(gaoJiDouZhiYiYang));
      messages.push('获得: 高级斗志昂扬');
    }

    // 高级星魔剑 (20% × 暴率)
    if (Math.random() * 100 < 20 * dropRate) {
      items.push(cloneItem(gaoJiXingMoJian));
      messages.push('获得: 高级星魔剑');
    }

    // 高级飞天连斩 (10% × 暴率)
    if (Math.random() * 100 < 10 * dropRate) {
      items.push(cloneItem(gaoJiFeiTianLianZhan));
      messages.push('获得: 高级飞天连斩');
    }

    // 灵魂晶石 (80% × 暴率)
    if (Math.random() * 100 < 80 * dropRate) {
      items.push(cloneItem(lingHunJingShi));
      messages.push('获得: 灵魂晶石');
    }

    // 灵魂王 (30% × 暴率)
    if (Math.random() * 100 < 30 * dropRate) {
      items.push(cloneItem(lingHunWang));
      messages.push('获得: 灵魂王');
    }

    // 幻魔之心 (30% × 暴率)
    if (Math.random() * 100 < 30 * dropRate) {
      items.push(cloneItem(huanMoZhiXin));
      messages.push('获得: 幻魔之心');
    }

    // 魔魂之心 (30% × 暴率)
    if (Math.random() * 100 < 30 * dropRate) {
      items.push(cloneItem(moHunZhiXin));
      messages.push('获得: 魔魂之心');
    }

    // 月光宝盒增强版 (5% × 暴率)
    if (Math.random() * 100 < 5 * dropRate) {
      items.push(cloneItem(yueGuangBaoHeZengQiangBan));
      messages.push('获得: 月光宝盒增强版');
    }

  } else {
    // ========== 蜘蛛掉落（45级） ==========
    // 参考文档：reference/docs/project_docs/04_怪物系统.md

    // 斗志昂扬 (15% × 暴率)
    if (Math.random() * 100 < 15 * dropRate) {
      items.push(cloneItem(douZhiYiYang));
      messages.push('获得: 斗志昂扬');
    }

    // 飞天连斩 (25% × 暴率)
    if (Math.random() * 100 < 25 * dropRate) {
      items.push(cloneItem(feiTianLianZhan));
      messages.push('获得: 飞天连斩');
    }

    // 星魔剑 (30% × 暴率)
    if (Math.random() * 100 < 30 * dropRate) {
      items.push(cloneItem(xingMoJian));
      messages.push('获得: 星魔剑');
    }

    // 灵魂晶石 (30% × 暴率)
    if (Math.random() * 100 < 30 * dropRate) {
      items.push(cloneItem(lingHunJingShi));
      messages.push('获得: 灵魂晶石');
    }

    // 月光宝盒 (5% × 暴率)
    if (Math.random() * 100 < 5 * dropRate) {
      items.push(cloneItem(yueGuangBaoHe));
      messages.push('获得: 月光宝盒');
    }
  }

  return { items, messages };
}
