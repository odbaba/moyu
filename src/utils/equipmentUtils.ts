import type { EquipmentDetail, EquipmentItem, EquipmentSlotType } from '../types';

/**
 * 检查全身6件装备是否都是极品品质
 * 用于触发探险家NPC解锁条件
 * @param equippedItems 装备槽位对象
 * @returns 是否全身极品
 */
export function checkAllEquipmentLegendary(equippedItems: Record<EquipmentSlotType, EquipmentDetail | null>): boolean {
  // 定义6个装备槽位
  const slots: EquipmentSlotType[] = ['weapon', 'helmet', 'clothes', 'shoes', 'bracelet', 'necklace'];

  // 检查是否所有槽位都有装备且品质为极品
  for (const slot of slots) {
    const item = equippedItems[slot];
    // 如果槽位没有装备，返回false
    if (!item) {
      return false;
    }
    // 如果品质不是极品，返回false
    if (item.quality !== '极品') {
      return false;
    }
  }

  // 所有槽位都有极品装备
  return true;
}

/**
 * 检查角色是否可以装备指定装备
 * 角色只能装备使用等级不高于当前角色等级的装备
 * @param equipment 装备物品或装备详情
 * @param characterLevel 角色等级
 * @returns 是否可以装备
 */
export function canEquipEquipment(
  equipment: EquipmentItem | EquipmentDetail,
  characterLevel: number
): boolean {
  // 获取装备的使用等级
  // EquipmentItem 和 EquipmentDetail 都有 useLevel 字段
  const useLevel = equipment.useLevel;
  
  // 角色等级必须大于等于装备使用等级
  return characterLevel >= useLevel;
}

/**
 * 获取装备等级不足的提示信息
 * @param equipment 装备物品或装备详情
 * @param characterLevel 角色等级
 * @returns 提示信息，如果可以装备则返回null
 */
export function getEquipmentLevelRequirementMessage(
  equipment: EquipmentItem | EquipmentDetail,
  characterLevel: number
): string | null {
  const useLevel = equipment.useLevel;
  
  if (characterLevel < useLevel) {
    return `需要等级 ${useLevel} 才能装备此物品（当前等级：${characterLevel}）`;
  }
  
  return null;
}
