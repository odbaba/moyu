/**
 * 商店数据配置文件
 * 定义杂货商和魔石商人的出售物品列表
 * 参考文档：
 * - reference/docs/杂货商交互逻辑文档.md
 * - reference/docs/魔石商人交互逻辑文档.md
 *
 * 注意：物品 ID 必须与 inventoryData.ts 中的物品 ID 一致，才能正确堆叠
 */

import type { ShopConfig, ShopItem, ShopType } from '../types';

// ==================== 杂货商物品列表（金币商店）====================

/**
 * 杂货商出售的物品列表
 * 玩家可以使用金币购买这些物品
 * 物品 ID 与背包物品 ID 保持一致
 */
const groceryMerchantItems: ShopItem[] = [
  {
    id: 'gem_linghunjingshi',
    name: '灵魂晶石',
    type: 'gem',
    priceGold: 1000000,
    priceMagicStone: 0,
    description: '蕴含灵魂之力的晶石，可用于提升装备品质等级。',
    icon: '💎',
    imagePath: './images/items/gem/linghunjingshi.png',
    stackable: true,
    maxStack: 99,
  },
  {
    id: 'gem_mohunjingshi',
    name: '魔魂晶石',
    type: 'gem',
    priceGold: 50000,
    priceMagicStone: 0,
    description: '蕴含魔魂之力的晶石，可用于提升装备魔魂等级。',
    icon: '💠',
    imagePath: './images/items/gem/mohunjingshi.png',
    stackable: true,
    maxStack: 99,
  },
  {
    id: 'gem_huanmojingshi',
    name: '幻魔晶石',
    type: 'gem',
    priceGold: 500000,
    priceMagicStone: 0,
    description: '蕴含幻魔之力的晶石，可用于提升装备使用等级。',
    icon: '🔮',
    imagePath: './images/items/gem/huanmojingshi.png',
    stackable: true,
    maxStack: 99,
  },
  {
    id: 'gem_zhongjizhandoulishi',
    name: '中级战斗力石',
    type: 'gem',
    priceGold: 500000,
    priceMagicStone: 0,
    description: '镶嵌后战斗力+3点，持续永久。',
    icon: '⚔️',
    imagePath: './images/items/gem/zhongjizhandoulishi.png',
    stackable: true,
    maxStack: 99,
  },
  {
    id: 'gem_zhongjijingyanshi',
    name: '中级经验石',
    type: 'gem',
    priceGold: 500000,
    priceMagicStone: 0,
    description: '镶嵌后战斗经验+30%，持续永久。',
    icon: '✨',
    imagePath: './images/items/gem/zhongjijingyanshi.png',
    stackable: true,
    maxStack: 99,
  },
  {
    id: 'consumable_kongjingyanqiu',
    name: '空经验球',
    type: 'consumable',
    priceGold: 10000,
    priceMagicStone: 0,
    description: '可以存储经验的空球，存储满后变成满经验球。',
    icon: '⚪',
    imagePath: './images/items/consumable/kongjingyanqiu.png',
    stackable: true,
    maxStack: 99,
  },
  {
    id: 'consumable_tiliyao',
    name: '体力药',
    type: 'consumable',
    priceGold: 50000,
    priceMagicStone: 0,
    description: '使用后回复大量体力值。',
    icon: '🧪',
    imagePath: './images/items/consumable/tiliyao.png',
    stackable: true,
    maxStack: 99,
  },
  {
    id: 'consumable_guozi',
    name: '果子',
    type: 'consumable',
    priceGold: 100000,
    priceMagicStone: 0,
    description: '使用后回复大量生命值。',
    icon: '🍎',
    imagePath: './images/items/consumable/guozi.png',
    stackable: true,
    maxStack: 99,
  },
  {
    id: 'skillbook_xingmojian',
    name: '星魔剑',
    type: 'skillBook',
    priceGold: 10000000,
    priceMagicStone: 1000,
    description: '学习星魔剑技能，强大的攻击技能。',
    icon: '🗡️',
    imagePath: './images/items/skillbook/xingmojian.png',
    stackable: false,
    maxStack: 1,
  },
  {
    id: 'skillbook_gaojifengzhan',
    name: '高级风斩',
    type: 'skillBook',
    priceGold: 1000,
    priceMagicStone: 0,
    description: '将风斩升级为高级版本，单体攻击造成150%伤害。消耗5点体力。',
    icon: '🌪️',
    imagePath: './images/items/skillbook/gaojifengzhan.png',
    stackable: false,
    maxStack: 1,
  },
  {
    id: 'skillbook_gaojidiliebaozhan',
    name: '高级裂地爆斩',
    type: 'skillBook',
    priceGold: 10000,
    priceMagicStone: 0,
    description: '将裂地爆斩升级为高级版本，群体攻击造成75%伤害。消耗20点体力。',
    icon: '🌋',
    imagePath: './images/items/skillbook/gaojidiliebaozhan.png',
    stackable: false,
    maxStack: 1,
  },
  {
    id: 'random_weapon',
    name: '随机武器',
    type: 'equipment',
    priceGold: 1000,
    priceMagicStone: 0,
    description: '随机获得一件装备，品质和属性随机生成。',
    icon: '❓',
    stackable: false,
    maxStack: 1,
  },
];

// ==================== 魔石商人物品列表（魔石商店）====================

/**
 * 魔石商人出售的物品列表
 * 玩家可以使用魔石购买这些物品
 * 物品 ID 与背包物品 ID 保持一致
 */
const magicStoneMerchantItems: ShopItem[] = [
  // 幻兽类
  {
    id: 'pet_attack_defense',
    name: '攻防型',
    type: 'pet',
    priceGold: 10000,
    priceMagicStone: 1,
    description: '最常见的幻兽，攻击和防御是主属性。',
    icon: '🐾',
    stackable: false,
    maxStack: 1,
  },
  {
    id: 'pet_naughty_cat',
    name: '调皮猫',
    type: 'pet',
    priceGold: 280000,
    priceMagicStone: 28,
    description: '可爱的幻兽，攻击和防御是主属性。',
    icon: '🐱',
    stackable: false,
    maxStack: 1,
  },
  {
    id: 'pet_jilu_pig',
    name: '吉鲁猪',
    type: 'pet',
    priceGold: 400000,
    priceMagicStone: 40,
    description: '天生高星，强攻击型战士。',
    icon: '🐷',
    stackable: false,
    maxStack: 1,
  },
  {
    id: 'pet_strange_beast',
    name: '奇异兽',
    type: 'pet',
    priceGold: 500000,
    priceMagicStone: 50,
    description: '变异幻兽，可作为幻化副幻兽。',
    icon: '🦄',
    stackable: false,
    maxStack: 1,
  },
  {
    id: 'pet_guardian',
    name: '守护',
    type: 'pet',
    priceGold: 12000000,
    priceMagicStone: 1200,
    description: '稀有优秀幻兽，天生极品星级。',
    icon: '🛡️',
    stackable: false,
    maxStack: 1,
  },
  {
    id: 'pet_8star_strange_beast',
    name: '8星奇异兽',
    type: 'pet',
    priceGold: 1500000,
    priceMagicStone: 150,
    description: '天生8星以上，理想的幻化副幻兽。',
    icon: '⭐',
    stackable: false,
    maxStack: 1,
  },
  {
    id: 'pet_12star_strange_beast',
    name: '12星奇异兽',
    type: 'pet',
    priceGold: 4500000,
    priceMagicStone: 450,
    description: '天生12星以上，理想的幻化副幻兽。',
    icon: '🌟',
    stackable: false,
    maxStack: 1,
  },
  // 宝石类
  {
    id: 'gem_mohunzhixin',
    name: '魔魂之心',
    type: 'gem',
    priceGold: 280000,
    priceMagicStone: 128,
    description: '提升装备魔魂等级，100%成功。',
    icon: '💜',
    imagePath: './images/items/gem/mohunzhixin.png',
    stackable: true,
    maxStack: 99,
  },
  {
    id: 'gem_huanmozhixin',
    name: '幻魔之心',
    type: 'gem',
    priceGold: 3000000,
    priceMagicStone: 280,
    description: '提升装备使用等级，100%成功。',
    icon: '💙',
    imagePath: './images/items/gem/huanmozhixin.png',
    stackable: true,
    maxStack: 99,
  },
  {
    id: 'gem_linghunwang',
    name: '灵魂王',
    type: 'gem',
    priceGold: 200000000,
    priceMagicStone: 2000,
    description: '提升装备品质等级，100%成功。',
    icon: '👑',
    imagePath: './images/items/gem/linghunwang.png',
    stackable: true,
    maxStack: 99,
  },
  // 消耗品类
  {
    id: 'gem_gaojijingyanshi',
    name: '高级经验石',
    type: 'gem',
    priceGold: 5000000,
    priceMagicStone: 500,
    description: '镶嵌后战斗经验+50%，持续永久。',
    icon: '💫',
    imagePath: './images/items/gem/gaojijingyanshi.png',
    stackable: true,
    maxStack: 99,
  },
  {
    id: 'gem_gaojizhandoulishi',
    name: '高级战斗力石',
    type: 'gem',
    priceGold: 28000000,
    priceMagicStone: 2800,
    description: '镶嵌后战斗力+5点，持续永久。',
    icon: '⚡',
    imagePath: './images/items/gem/gaojizhandoulishi.png',
    stackable: true,
    maxStack: 99,
  },
  {
    id: 'consumable_dianjiangyaoshui',
    name: '电浆药水',
    type: 'consumable',
    priceGold: 100000000,
    priceMagicStone: 8280,
    description: '使用后幸运值增加到100。',
    icon: '🧬',
    imagePath: './images/items/consumable/dianjiangyaoshui.png',
    stackable: false,
    maxStack: 1,
  },
  {
    id: 'special_baimeigui99',
    name: '99朵白玫瑰',
    type: 'special',
    priceGold: 500000,
    priceMagicStone: 50,
    description: '送给公主提高亲密度。',
    icon: '🌹',
    imagePath: './images/items/special/baineigui99.png',
    stackable: true,
    maxStack: 99,
  },
  // 技能书类
  {
    id: 'skillbook_douzhiyiyang',
    name: '斗志抑扬',
    type: 'skillBook',
    priceGold: 28000000,
    priceMagicStone: 2800,
    description: '学会斗志抑扬技能，战斗力加成。',
    icon: '🔥',
    imagePath: './images/items/skillbook/douzhiyiyang.png',
    stackable: false,
    maxStack: 1,
  },
  // 特殊道具类
  {
    id: 'special_yueguangbaohe',
    name: '月光宝盒',
    type: 'special',
    priceGold: 0,
    priceMagicStone: 2800,
    description: '为装备打造一个洞，可镶嵌宝石。',
    icon: '📦',
    imagePath: './images/items/special/yueguangbaohe.png',
    stackable: true,
    maxStack: 99,
  },
];

// ==================== 商店配置映射表 ====================

/**
 * 商店配置映射表
 * 根据商店类型获取对应的配置
 */
export const shopConfig: Record<ShopType, ShopConfig> = {
  gold: {
    type: 'gold',
    name: '杂货商',
    description: '卡萨诺城的杂货商，出售各种消耗品和材料。',
    items: groceryMerchantItems,
  },
  magicStone: {
    type: 'magicStone',
    name: '魔石商人',
    description: '神秘的魔石商人，出售珍贵的物品和幻兽。',
    items: magicStoneMerchantItems,
  },
};

/**
 * 根据商店类型获取商店配置
 * @param shopType 商店类型
 * @returns 商店配置
 */
export function getShopConfig(shopType: ShopType): ShopConfig {
  return shopConfig[shopType];
}

/**
 * 根据物品ID获取商店物品信息
 * @param itemId 物品ID
 * @returns 商店物品信息，如果不存在则返回undefined
 */
export function getShopItemById(itemId: string): ShopItem | undefined {
  // 在所有商店中查找物品
  for (const shopType in shopConfig) {
    const shop = shopConfig[shopType as ShopType];
    const item = shop.items.find(item => item.id === itemId);
    if (item) {
      return item;
    }
  }

  return undefined;
}

/**
 * 获取商店物品列表
 * @param shopType 商店类型
 * @returns 物品列表
 */
export function getShopItems(shopType: ShopType): ShopItem[] {
  return shopConfig[shopType].items;
}
