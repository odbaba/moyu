/**
 * 战利品工具函数模块
 * 提供战斗胜利后的战利品和经验奖励计算功能
 * 参考文档：reference/docs/project_docs/04_怪物系统.md
 */


import {
  createEquipment,
  EQUIPMENT_LEVELS,
  lingHunJingShi,
  lingHunWang,
  yueGuangBaoHe,
  yueGuangBaoHeZengQiangBan,
} from '../data/inventoryData';
import type { EquipmentItem, InventoryItem } from '../types';
import { generateItemId } from './itemFactory';

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
 * 复制物品模板用于战利品
 * 保留原始ID以支持堆叠，设置quantity为1
 *
 * @param template 物品模板
 * @returns 战利品物品实例
 */
function cloneItemTemplate<T extends InventoryItem>(template: T): T {
  return {
    ...template,
    quantity: 1, // 战利品每次掉落1个
    // 保留原始ID，这样可以与背包中的物品堆叠
  };
}

/**
 * 计算战利品
 * 根据怪物等级和最大生命值计算战利品
 *
 * @param monsterLevel 怪物等级
 * @param monsterMaxHp 怪物最大生命值
 * @param isBoss 是否为BOSS
 * @param luckValue 幸运值（影响掉落概率）
 * @returns 战利品结果
 */
export function calculateLoot(
  monsterLevel: number,
  monsterMaxHp: number,
  isBoss: boolean = false,
  luckValue: number = 0
): LootResult {
  const messages: string[] = [];
  const items: InventoryItem[] = [];

  // 暴率 = 1 + (幸运值 + 1) / 100
  const dropRate = 1 + (luckValue + 1) / 100;

  // 经验值 = 怪物最大生命值
  const experience = monsterMaxHp;
  messages.push(`获得经验: ${experience}`);

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
      items.push(cloneItemTemplate(lingHunJingShi));
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
    items.push(cloneItemTemplate(lingHunJingShi));
    messages.push('获得: 灵魂晶石');
  }

  // 灵魂王 (等级/10%概率)
  if (Math.random() * 100 < bossLevel / 10) {
    items.push(cloneItemTemplate(lingHunWang));
    messages.push('获得: 灵魂王');
  }

  // 月光宝盒 (5%概率)
  if (Math.random() * 200 < 10 * dropRate) {
    if (bossLevel >= 60) {
      // 60级以上BOSS掉落月光宝盒增强版
      items.push(cloneItemTemplate(yueGuangBaoHeZengQiangBan));
      messages.push('获得: 月光宝盒增强版');
    } else {
      // 60级以下BOSS掉落月光宝盒
      items.push(cloneItemTemplate(yueGuangBaoHe));
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
    equipLevel = 110;
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

  // 使用 inventoryData.ts 中的 createEquipment 函数生成装备
  const equipment = createEquipment(equipmentType, equipLevel, qualityNum, magicSoulLevel, holeCount);

  // 为战利品生成唯一ID（使用统一的ID生成函数）
  return {
    ...equipment,
    id: generateItemId('loot', `${equipmentType}_${equipLevel}_${qualityNum}`),
  };
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
