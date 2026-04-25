/**
 * 物品图片映射配置文件
 * 定义所有物品的图片路径映射关系
 */

/**
 * 物品图片路径映射表
 * 键为物品ID，值为图片路径（相对于public目录）
 */
export const ITEM_IMAGE_MAP: Record<string, string> = {
  // ========== 消耗品类 ==========
  consumable_tiliyao: './images/items/consumable/tiliyao.jpg',
  consumable_guozi: './images/items/consumable/guozi.jpg',
  consumable_manjingyanqiu: './images/items/consumable/manjingyanqiu.jpg',
  consumable_kongjingyanqiu: './images/items/consumable/kongjingyanqiu.jpg',
  consumable_dianjiangyaoshui: './images/items/consumable/dianjiangyaoshui.png',
  consumable_shengmingyaoji: './images/items/consumable/tiliyao.jpg', // 使用体力药图片
  consumable_gaojishengmingyaoji: './images/items/consumable/guozi.jpg', // 使用果子图片
  consumable_moliyaoji: './images/items/consumable/tiliyao.jpg', // 使用体力药图片
  consumable_jinglingzhilei: './images/items/consumable/guozi.jpg', // 使用果子图片

  // ========== 技能书类 ==========
  skillbook_xingmojian: './images/items/skillbook/xingmojian.png',
  skillbook_gaojixingmojian: './images/items/skillbook/gaojixingmojian.png',
  skillbook_gaojifengzhan: './images/items/skillbook/gaojifengzhan.png',
  skillbook_feitianlianzhan: './images/items/skillbook/feitianlianzhan.png',
  skillbook_gaojifeitianlianzhan: './images/items/skillbook/gaojifeitianlianzhan.png',
  skillbook_douzhiyiyang: './images/items/skillbook/douzhiyiyang.png',
  skillbook_gaojidouzhiyiyang: './images/items/skillbook/gaojidouzhiyiyang.png',
  skillbook_gaojidiliebaozhan: './images/items/skillbook/gaojidiliebaozhan.png',

  // ========== 宝石类 - 强化宝石 ==========
  gem_mohunjingshi: './images/items/gem/mohunjingshi.png',
  gem_mohunzhixin: './images/items/gem/mohunzhixin.png',
  gem_linghunjingshi: './images/items/gem/linghunjingshi.png',
  gem_linghunwang: './images/items/gem/linghunwang.png',
  gem_huanmojingshi: './images/items/gem/huanmojingshi.png',
  gem_huanmozhixin: './images/items/gem/huanmozhixin.png',
  gem_zhanhunjingshi: './images/items/gem/zhanhunjingshi.png',
  gem_zhanhunzhixin: './images/items/gem/zhanhunzhixin.png',

  // ========== 宝石类 - 镶嵌宝石 ==========
  gem_zhongjizhandoulishi: './images/items/gem/zhongjizhandoulishi.png',
  gem_gaojizhandoulishi: './images/items/gem/gaojizhandoulishi.png',
  gem_zhongjijingyanshi: './images/items/gem/zhongjijingyanshi.png',
  gem_gaojijingyanshi: './images/items/gem/gaojijingyanshi.png',

  // ========== 特殊道具类 ==========
  special_yueguangbaohe: './images/items/special/yueguangbaohe.png',
  special_yueguangbaohezengqiangban: './images/items/special/yueguangbaohezengqiangban.png',
  special_yinkuang: './images/items/special/yinkuang.png',
  special_jinkuang: './images/items/special/jinkuang.png',
  special_baimeigui99: './images/items/special/baineigui99.png',
  special_baimeigui999: './images/items/special/baineigui999.png',

  // ========== 矿石（品质1-10）==========
  'silver-ore-1': './images/items/special/yinkuang.png',
  'silver-ore-2': './images/items/special/yinkuang.png',
  'silver-ore-3': './images/items/special/yinkuang.png',
  'silver-ore-4': './images/items/special/yinkuang.png',
  'silver-ore-5': './images/items/special/yinkuang.png',
  'silver-ore-6': './images/items/special/yinkuang.png',
  'silver-ore-7': './images/items/special/yinkuang.png',
  'silver-ore-8': './images/items/special/yinkuang.png',
  'silver-ore-9': './images/items/special/yinkuang.png',
  'silver-ore-10': './images/items/special/yinkuang.png',
  'gold-ore-1': './images/items/special/jinkuang.png',
  'gold-ore-2': './images/items/special/jinkuang.png',
  'gold-ore-3': './images/items/special/jinkuang.png',
  'gold-ore-4': './images/items/special/jinkuang.png',
  'gold-ore-5': './images/items/special/jinkuang.png',
  'gold-ore-6': './images/items/special/jinkuang.png',
  'gold-ore-7': './images/items/special/jinkuang.png',
  'gold-ore-8': './images/items/special/jinkuang.png',
  'gold-ore-9': './images/items/special/jinkuang.png',
  'gold-ore-10': './images/items/special/jinkuang.png',
};

/**
 * 获取物品图片路径
 * @param itemId 物品ID
 * @returns 图片路径，如果没有映射则返回null
 */
export const getItemImagePath = (itemId: string): string | null => {
  return ITEM_IMAGE_MAP[itemId] || null;
};
