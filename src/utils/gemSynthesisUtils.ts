/**
 * 宝石合成工具函数
 * 提供宝石合成的核心逻辑
 * 
 * 根据参考文档：宝石合成师交互逻辑文档.md
 */

import type { InventoryItem } from '../types';

/**
 * 宝石合成配方定义
 * 定义了每种高级宝石的合成配方
 */
export interface GemSynthesisRecipe {
  /** 合成结果物品ID */
  resultItemId: string;
  /** 合成结果物品名称 */
  resultItemName: string;
  /** 合成结果物品图标 */
  resultItemIcon: string;
  /** 所需材料：物品名称 -> 数量 */
  materials: Record<string, number>;
  /** 合成结果物品描述 */
  description: string;
}

/**
 * 宝石合成配方列表
 * 根据参考文档定义的5种合成配方
 */
export const GEM_SYNTHESIS_RECIPES: Record<string, GemSynthesisRecipe> = {
  // 魔魂之心：5个魔魂晶石
  '魔魂之心': {
    resultItemId: 'gem_mohunzhixin',
    resultItemName: '魔魂之心',
    resultItemIcon: '💜',
    materials: { '魔魂晶石': 5 },
    description: '由5个魔魂晶石凝聚而成的宝石，蕴含纯净的魔力。用于提升装备魔魂等级，+9前100%成功。',
  },
  // 幻魔之心：5个幻魔晶石
  '幻魔之心': {
    resultItemId: 'gem_huanmozhixin',
    resultItemName: '幻魔之心',
    resultItemIcon: '💜',
    materials: { '幻魔晶石': 5 },
    description: '由5个幻魔晶石凝聚而成的宝石，蕴含幻魔之力。用于提升装备使用等级，成功率100%。',
  },
  // 灵魂王：20个灵魂晶石
  '灵魂王': {
    resultItemId: 'gem_linghunwang',
    resultItemName: '灵魂王',
    resultItemIcon: '👑',
    materials: { '灵魂晶石': 20 },
    description: '由20个灵魂晶石凝聚而成的宝石，蕴含强大的灵魂之力。用于提升装备品质等级，成功率100%。',
  },
  // 高级经验石：10个中级经验石
  '高级经验石': {
    resultItemId: 'gem_gaojijingyanshi',
    resultItemName: '高级经验石',
    resultItemIcon: '🟣',
    materials: { '中级经验石': 10 },
    description: '由10个中级经验石凝聚而成的宝石，镶嵌到装备上增加经验获取+50%。',
  },
  // 高级战斗力石：10个中级战斗力石
  '高级战斗力石': {
    resultItemId: 'gem_gaojizhandoulishi',
    resultItemName: '高级战斗力石',
    resultItemIcon: '🔷',
    materials: { '中级战斗力石': 10 },
    description: '由10个中级战斗力石凝聚而成的宝石，镶嵌到装备上增加战斗力+5。',
  },
};

/**
 * 宝石合成结果
 */
export interface GemSynthesisResult {
  /** 是否成功 */
  success: boolean;
  /** 结果消息 */
  message: string;
  /** 合成结果物品（如果成功） */
  resultItem?: InventoryItem;
}

/**
 * 检查背包中是否有足够的材料
 * @param inventory 背包物品列表
 * @param materials 所需材料
 * @returns 是否有足够的材料
 */
export function checkMaterials(
  inventory: InventoryItem[],
  materials: Record<string, number>
): { hasEnough: boolean; missingMaterials: Record<string, number> } {
  const missingMaterials: Record<string, number> = {};
  let hasEnough = true;

  for (const [materialName, requiredCount] of Object.entries(materials)) {
    // 计算背包中该材料的总数量
    const totalCount = inventory
      .filter(item => item.name === materialName)
      .reduce((sum, item) => sum + item.quantity, 0);

    if (totalCount < requiredCount) {
      hasEnough = false;
      missingMaterials[materialName] = requiredCount - totalCount;
    }
  }

  return { hasEnough, missingMaterials };
}

/**
 * 消耗背包中的材料
 * @param inventory 背包物品列表
 * @param materials 要消耗的材料
 * @returns 消耗后的背包物品列表
 */
export function consumeMaterials(
  inventory: InventoryItem[],
  materials: Record<string, number>
): InventoryItem[] {
  const newInventory = [...inventory];
  
  for (const [materialName, requiredCount] of Object.entries(materials)) {
    let remainingToConsume = requiredCount;

    // 从背包中消耗材料
    for (let i = 0; i < newInventory.length && remainingToConsume > 0; i++) {
      const item = newInventory[i];
      if (item.name === materialName) {
        if (item.quantity <= remainingToConsume) {
          // 该物品数量不足或刚好，完全消耗
          remainingToConsume -= item.quantity;
          newInventory.splice(i, 1);
          i--; // 因为删除了元素，需要调整索引
        } else {
          // 该物品数量足够，部分消耗
          item.quantity -= remainingToConsume;
          remainingToConsume = 0;
        }
      }
    }
  }

  return newInventory;
}

/**
 * 创建合成结果物品
 * @param recipe 合成配方
 * @returns 合成结果物品
 */
export function createSynthesisResultItem(recipe: GemSynthesisRecipe): InventoryItem {
  // 生成唯一的实例ID：基础ID + 时间戳 + 随机数
  const instanceId = `${recipe.resultItemId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id: instanceId,
    name: recipe.resultItemName,
    icon: recipe.resultItemIcon,
    quantity: 1,
    type: 'gem',
    rarity: recipe.resultItemName === '灵魂王' ? 'legendary' : 'rare',
    source: '宝石合成师合成',
    description: recipe.description,
    maxStack: 99,
    usable: false,
    equippable: false,
  };
}

/**
 * 执行宝石合成
 * @param inventory 背包物品列表
 * @param targetItemName 要合成的目标物品名称
 * @returns 合成结果
 */
export function performGemSynthesis(
  inventory: InventoryItem[],
  targetItemName: string
): GemSynthesisResult {
  // 查找配方
  const recipe = GEM_SYNTHESIS_RECIPES[targetItemName];
  if (!recipe) {
    return {
      success: false,
      message: `未找到 ${targetItemName} 的合成配方。`,
    };
  }

  // 检查材料是否足够
  const { hasEnough, missingMaterials } = checkMaterials(inventory, recipe.materials);
  
  if (!hasEnough) {
    // 构建缺少材料的消息
    const missingList = Object.entries(missingMaterials)
      .map(([name, count]) => `${name} ×${count}`)
      .join('、');
    return {
      success: false,
      message: `材料不足！缺少：${missingList}`,
    };
  }

  // 创建合成结果物品
  const resultItem = createSynthesisResultItem(recipe);

  return {
    success: true,
    message: `成功合成了 ${targetItemName}！`,
    resultItem,
  };
}

/**
 * 获取合成配方的材料描述
 * @param targetItemName 目标物品名称
 * @returns 材料描述文本
 */
export function getRecipeDescription(targetItemName: string): string {
  const recipe = GEM_SYNTHESIS_RECIPES[targetItemName];
  if (!recipe) {
    return '';
  }

  const materialsList = Object.entries(recipe.materials)
    .map(([name, count]) => `${name} ×${count}`)
    .join('、');
  
  return `需要：${materialsList}`;
}
