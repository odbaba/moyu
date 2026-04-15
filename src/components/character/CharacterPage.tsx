import React, { useState, useMemo } from 'react';
import type { CharacterData, EquipmentDetail, EquipmentSlotType, EquipmentItem, Pet } from '../../types';
import CharacterInfo from './CharacterInfo';
import EquipmentDisplay from './EquipmentDisplay';
import CombatPowerModal from './CombatPowerModal';
import EquipmentModal from './EquipmentModal';
import EquipmentSelectModal from './EquipmentSelectModal';
import InventoryEquipmentModal from './InventoryEquipmentModal';
import { calculateAllEquipmentBonus } from '../../utils/attributeCalculator';
import './character.css';

/**
 * 角色信息主页面组件属性接口
 */
interface CharacterPageProps {
  /**
   * 是否显示页面
   */
  isVisible: boolean;
  /**
   * 角色数据对象
   */
  character: CharacterData;
  /**
   * 装备槽位数据（六个槽位的装备）
   */
  equippedItems: Record<EquipmentSlotType, EquipmentDetail | null>;
  /**
   * 背包中所有装备物品列表
   */
  inventoryEquipments: EquipmentItem[];
  /**
   * 幻兽数组，用于计算幻兽战斗力加成
   */
  pets?: Pet[];
  /**
   * 关闭按钮点击回调
   */
  onClose: () => void;
  /**
   * 装备物品回调
   */
  onEquipItem: (item: EquipmentItem) => void;
  /**
   * 卸下装备回调
   */
  onUnequipItem: (slotType: EquipmentSlotType) => void;
}

/**
 * 角色信息主页面组件
 * 整合角色信息、装备展示、战斗力详情和装备详情等功能
 * 作为独立的全屏页面显示
 * 移动端布局：角色属性1/3高度 + 装备展示2/3高度
 */
const CharacterPage: React.FC<CharacterPageProps> = ({
  isVisible,
  character,
  equippedItems,
  inventoryEquipments,
  pets = [],
  onClose,
  onEquipItem,
  onUnequipItem
}) => {
  // 战斗力详情弹窗状态
  const [showCombatPowerModal, setShowCombatPowerModal] = useState(false);
  
  // 已装备详情弹窗状态
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentDetail | null>(null);
  
  // 装备选择弹窗状态
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [currentSlotType, setCurrentSlotType] = useState<EquipmentSlotType>('weapon');
  
  // 背包装备详情弹窗状态
  const [showInventoryEquipModal, setShowInventoryEquipModal] = useState(false);
  const [selectedInventoryItem, setSelectedInventoryItem] = useState<EquipmentItem | null>(null);

  // 计算带装备加成的角色数据
  const characterWithEquipment = useMemo(() => {
    const equipmentBonus = calculateAllEquipmentBonus(equippedItems);
    return {
      ...character,
      equipment: {
        weapon: equippedItems.weapon,
        helmet: equippedItems.helmet,
        clothes: equippedItems.clothes,
        shoes: equippedItems.shoes,
        bracelet: equippedItems.bracelet,
        necklace: equippedItems.necklace
      },
      equipmentBonus
    };
  }, [character, equippedItems]);

  // 显示战斗力详情弹窗
  const handleShowCombatPowerDetail = () => {
    setShowCombatPowerModal(true);
  };

  // 关闭战斗力详情弹窗
  const handleCloseCombatPowerModal = () => {
    setShowCombatPowerModal(false);
  };

  // 处理已装备栏位点击
  const handleEquipmentClick = (equipment: EquipmentDetail) => {
    setSelectedEquipment(equipment);
    setShowEquipmentModal(true);
  };

  // 关闭已装备详情弹窗
  const handleCloseEquipmentModal = () => {
    setShowEquipmentModal(false);
    setSelectedEquipment(null);
  };

  // 处理空栏位点击
  const handleEmptySlotClick = (slotType: EquipmentSlotType) => {
    setCurrentSlotType(slotType);
    setShowSelectModal(true);
  };

  // 关闭装备选择弹窗
  const handleCloseSelectModal = () => {
    setShowSelectModal(false);
  };

  // 处理选择背包装备（打开详情）
  const handleSelectInventoryEquipment = (item: EquipmentItem) => {
    setSelectedInventoryItem(item);
    setShowInventoryEquipModal(true);
  };

  // 关闭背包装备详情弹窗
  const handleCloseInventoryEquipModal = () => {
    setShowInventoryEquipModal(false);
    setSelectedInventoryItem(null);
  };

  // 处理装备背包装备
  const handleEquipInventoryItem = (item: EquipmentItem) => {
    onEquipItem(item);
    setShowInventoryEquipModal(false);
    setShowSelectModal(false);
    setSelectedInventoryItem(null);
  };

  // 处理卸下装备
  const handleUnequipItem = (slotType: EquipmentSlotType) => {
    onUnequipItem(slotType);
    setShowEquipmentModal(false);
    setSelectedEquipment(null);
  };

  // 处理替换装备（打开装备选择弹窗）
  const handleReplaceEquipment = (slotType: EquipmentSlotType) => {
    setCurrentSlotType(slotType);
    setShowSelectModal(true);
  };

  // 处理覆盖层点击
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 如果不可见，不渲染任何内容
  if (!isVisible) return null;

  return (
    <div className="character-page-overlay" onClick={handleOverlayClick}>
      <div className="character-page-container">
        {/* 页面顶部关闭按钮 */}
        <div className="character-page-header">
          <button
            className="character-page-close-button"
            onClick={onClose}
          >
            ✕ 关闭
          </button>
        </div>

        {/* 主要内容区域 - 移动端上下布局 */}
        <div className="character-page-content">
          {/* 上部：角色信息 (1/3高度) */}
          <div className="character-page-top">
            <CharacterInfo
              character={characterWithEquipment}
              pets={pets}
              onShowDetail={handleShowCombatPowerDetail}
            />
          </div>

          {/* 下部：装备展示 (2/3高度) */}
          <div className="character-page-bottom">
            <EquipmentDisplay
              equippedItems={equippedItems}
              onEquipmentClick={handleEquipmentClick}
              onEmptySlotClick={handleEmptySlotClick}
            />
          </div>
        </div>

        {/* 战斗力详情弹窗 */}
        <CombatPowerModal
          isVisible={showCombatPowerModal}
          onClose={handleCloseCombatPowerModal}
          character={characterWithEquipment}
          pets={pets}
        />

        {/* 已装备详情弹窗 */}
        <EquipmentModal
          isVisible={showEquipmentModal}
          onClose={handleCloseEquipmentModal}
          equipment={selectedEquipment}
          onUnequip={handleUnequipItem}
          onReplace={handleReplaceEquipment}
        />

        {/* 装备选择弹窗 */}
        <EquipmentSelectModal
          isVisible={showSelectModal}
          slotType={currentSlotType}
          inventoryEquipments={inventoryEquipments}
          onClose={handleCloseSelectModal}
          onSelectEquipment={handleSelectInventoryEquipment}
        />

        {/* 背包装备详情弹窗 */}
        <InventoryEquipmentModal
          isVisible={showInventoryEquipModal}
          item={selectedInventoryItem}
          onClose={handleCloseInventoryEquipModal}
          onEquip={handleEquipInventoryItem}
        />
      </div>
    </div>
  );
};

export default CharacterPage;
