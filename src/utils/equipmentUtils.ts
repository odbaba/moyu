import type { EquipmentDetail, EquipmentSlotType } from '../types';

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
