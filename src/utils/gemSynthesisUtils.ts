/**
 * 宝石合成系统工具函数
 * 提供宝石合成功能，将低级宝石合成为高级宝石
 * 参考文档：reference/docs/宝石合成师交互逻辑文档.md
 */

import { findItemByName } from '../data/inventoryData';
import type { InventoryItem } from '../types';
import { cloneItem } from './itemFactory';

// ==================== 合成配方定义 ====================

/**
 * 合成配方接口
 */
export interface SynthesisRecipe {
  /** 配方ID */
  id: string;
  /** 配方名称 */
  name: string;
  /** 所需材料（物品名称 -> 数量） */
  materials: Record<string, number>;
  /** 合成结果物品名称 */
  result: string;
  /** 合成描述 */
  description: string;
}

/**
 * 合成结果接口
 */
export interface SynthesisResult {
  /** 是否成功 */
  success: boolean;
  /** 结果消息 */
  message: string;
  /** 合成后的物品（成功时返回） */
  resultItem?: InventoryItem;
}

/**
 * 所有合成配方
 * 根据宝石合成师文档定义
 */
export const SYNTHESIS_RECIPES: SynthesisRecipe[] = [
  {
    id: 'mohunzhixin',
    name: '魔魂之心',
    materials: {
      '魔魂晶石': 5,
    },
    result: '魔魂之心',
    description: '使用5个魔魂晶石合成魔魂之心，提升装备魔魂等级（+9前100%成功）。',
  },
  {
    id: 'huanmozhixin',
    name: '幻魔之心',
    materials: {
      '幻魔晶石': 5,
    },
    result: '幻魔之心',
    description: '使用5个幻魔晶石合成幻魔之心，提升装备使用等级（100%成功）。',
  },
  {
    id: 'linghunwang',
    name: '灵魂王',
    materials: {
      '灵魂晶石': 20,
    },
    result: '灵魂王',
    description: '使用20个灵魂晶石合成灵魂王，提升装备品质等级（100%成功）。',
  },
  {
    id: 'gaojijingyanshi',
    name: '高级经验石',
    materials: {
      '中级经验石': 10,
    },
    result: '高级经验石',
    description: '使用10个中级经验石合成高级经验石，镶嵌后经验值+50%。',
  },
  {
    id: 'gaojizhandoulishi',
    name: '高级战斗力石',
    materials: {
      '中级战斗力石': 10,
    },
    result: '高级战斗力石',
    description: '使用10个中级战斗力石合成高级战斗力石，镶嵌后战斗力+5。',
  },
];

// ==================== 合成工具函数 ====================

/**
 * 根据配方ID获取配方
 * @param recipeId 配方ID
 * @returns 配方配置，不存在则返回 undefined
 */
export function getRecipeById(recipeId: string): SynthesisRecipe | undefined {
  return SYNTHESIS_RECIPES.find(recipe => recipe.id === recipeId);
}

/**
 * 根据结果物品名称获取配方
 * @param resultName 结果物品名称
 * @returns 配方配置，不存在则返回 undefined
 */
export function getRecipeByResultName(resultName: string): SynthesisRecipe | undefined {
  return SYNTHESIS_RECIPES.find(recipe => recipe.result === resultName);
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
): { hasEnough: boolean; missing: Record<string, number> } {
  const missing: Record<string, number> = {};

  for (const [itemName, requiredCount] of Object.entries(materials)) {
    // 计算背包中该物品的总数量
    const totalCount = inventory
      .filter(item => item.name === itemName)
      .reduce((sum, item) => sum + item.quantity, 0);

    if (totalCount < requiredCount) {
      missing[itemName] = requiredCount - totalCount;
    }
  }

  return {
    hasEnough: Object.keys(missing).length === 0,
    missing,
  };
}

/**
 * 从背包中消耗材料
 * 注意：此函数会修改传入的 inventory 数组
 * @param inventory 背包物品列表
 * @param materials 要消耗的材料
 * @returns 消耗后的背包物品列表
 */
export function consumeMaterials(
  inventory: InventoryItem[],
  materials: Record<string, number>
): InventoryItem[] {
  const newInventory = [...inventory];

  for (const [itemName, requiredCount] of Object.entries(materials)) {
    let remaining = requiredCount;

    // 从背包中消耗物品
    for (let i = newInventory.length - 1; i >= 0 && remaining > 0; i--) {
      const item = newInventory[i];
      if (item.name === itemName) {
        if (item.quantity <= remaining) {
          // 物品数量不足或刚好，移除整个物品
          remaining -= item.quantity;
          newInventory.splice(i, 1);
        } else {
          // 物品数量充足，减少数量
          item.quantity -= remaining;
          remaining = 0;
        }
      }
    }
  }

  return newInventory;
}

/**
 * 执行宝石合成
 * @param inventory 背包物品列表
 * @param recipeId 配方ID
 * @returns 合成结果
 */
export function performSynthesis(
  inventory: InventoryItem[],
  recipeId: string
): SynthesisResult {
  // 获取配方
  const recipe = getRecipeById(recipeId);
  if (!recipe) {
    return {
      success: false,
      message: `未知的合成配方：${recipeId}`,
    };
  }

  // 检查材料是否足够
  const { hasEnough, missing } = checkMaterials(inventory, recipe.materials);
  if (!hasEnough) {
    const missingList = Object.entries(missing)
      .map(([name, count]) => `${name} × ${count}`)
      .join('、');

    return {
      success: false,
      message: `材料不足，缺少：${missingList}`,
    };
  }

  // 获取合成结果物品模板
  const resultItemTemplate = findItemByName(recipe.result);
  if (!resultItemTemplate) {
    return {
      success: false,
      message: `合成失败：找不到物品「${recipe.result}」`,
    };
  }

  // 使用 cloneItem 复制物品
  const resultItem = cloneItem(resultItemTemplate);

  return {
    success: true,
    message: `成功合成了${recipe.result}！`,
    resultItem,
  };
}

/**
 * 获取所有合成配方的描述文本
 * 用于NPC对话显示
 * @returns 配方描述文本
 */
export function getAllRecipesDescription(): string {
  let description = '我可以帮你合成以下高级宝石：\n\n';

  for (const recipe of SYNTHESIS_RECIPES) {
    const materialsList = Object.entries(recipe.materials)
      .map(([name, count]) => `${count}个${name}`)
      .join('、');
    description += `【${recipe.result}】需要${materialsList}\n`;
  }

  description += '\n合成成功率均为100%！';

  return description;
}

/**
 * 获取配方的简要描述
 * @param recipeId 配方ID
 * @returns 配方描述
 */
export function getRecipeDescription(recipeId: string): string {
  const recipe = getRecipeById(recipeId);
  if (!recipe) {
    return '未知配方';
  }

  const materialsList = Object.entries(recipe.materials)
    .map(([name, count]) => `${count}个${name}`)
    .join('、');

  return `${recipe.result}：需要${materialsList}`;
}
