import './pet.css';

import React, { useState } from 'react';

import type { Pet } from '../../types';
import DeployedPetSlot from './DeployedPetSlot';
import PetDetailModal from './PetDetailModal';
import PetListItem from './PetListItem';

/**
 * 幻兽页面主组件属性接口
 * 定义组件接收的参数类型
 */
interface PetPageProps {
  /**
   * 是否显示页面
   */
  isVisible: boolean;
  /**
   * 关闭页面的回调函数
   */
  onClose: () => void;
  /**
   * 所有幻兽数据数组
   */
  pets: Pet[];
  /**
   * 出战幻兽槽位数组（固定2个元素，空槽位为 null）
   * 槽位0对应位置一，槽位1对应位置二
   */
  deployedPets: (Pet | null)[];
  /**
   * 召回幻兽的回调函数
   * @param petId 要召回的幻兽ID
   */
  onRecall: (petId: string) => void;
  /**
   * 合体幻兽的回调函数
   * @param petId 要合体的幻兽ID
   */
  onMerge: (petId: string) => void;
  /**
   * 解体幻兽的回调函数
   * @param petId 要解体的幻兽ID
   */
  onUnmerge: (petId: string) => void;
  /**
   * 出战幻兽的回调函数
   * @param petId 要出战的幻兽ID
   */
  onDeploy: (petId: string) => void;
  /**
   * 丢弃幻兽的回调函数
   * @param petId 要丢弃的幻兽ID
   */
  onDiscard: (petId: string) => void;
}

/**
 * 幻兽页面主组件
 * 整合出战幻兽栏、幻兽列表和幻兽详情弹窗
 * 作为独立的全屏页面显示
 * 移动端布局：出战幻兽栏 + 物品数量提示 + 幻兽列表
 */
const PetPage: React.FC<PetPageProps> = ({
  isVisible,
  onClose,
  pets,
  deployedPets,
  onRecall,
  onMerge,
  onUnmerge,
  onDeploy,
  onDiscard
}) => {
  /**
   * 幻兽详情弹窗显示状态
   */
  const [showPetDetailModal, setShowPetDetailModal] = useState(false);

  /**
   * 当前选中的幻兽
   */
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  /**
   * 丢弃确认弹窗显示状态
   */
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  /**
   * 待丢弃的幻兽
   */
  const [discardTargetPet, setDiscardTargetPet] = useState<Pet | null>(null);

  /**
   * 处理幻兽点击事件
   * 点击幻兽时打开幻兽详情弹窗
   * @param pet 被点击的幻兽对象
   */
  const handlePetClick = (pet: Pet) => {
    setSelectedPet(pet);
    setShowPetDetailModal(true);
  };

  /**
   * 关闭幻兽详情弹窗
   */
  const handleClosePetDetailModal = () => {
    setShowPetDetailModal(false);
    setSelectedPet(null);
  };

  /**
   * 处理覆盖层点击事件
   * 点击覆盖层（非内容区域）关闭页面
   */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /**
   * 处理丢弃按钮点击事件
   * 弹出确认弹窗
   * @param petId 要丢弃的幻兽ID
   */
  const handleDiscardClick = (petId: string) => {
    const pet = pets.find(p => p.id === petId);
    if (pet) {
      setDiscardTargetPet(pet);
      setShowDiscardConfirm(true);
    }
  };

  /**
   * 确认丢弃幻兽
   */
  const handleConfirmDiscard = () => {
    if (discardTargetPet) {
      onDiscard(discardTargetPet.id);
    }
    setShowDiscardConfirm(false);
    setDiscardTargetPet(null);
  };

  /**
   * 取消丢弃
   */
  const handleCancelDiscard = () => {
    setShowDiscardConfirm(false);
    setDiscardTargetPet(null);
  };

  /**
   * 获取第一个出战幻兽（槽位0）
   */
  const getDeployedPet1 = (): Pet | null => {
    return deployedPets[0] || null;
  };

  /**
   * 获取第二个出战幻兽（槽位1）
   */
  const getDeployedPet2 = (): Pet | null => {
    return deployedPets[1] || null;
  };

  /**
   * 过滤未出战的幻兽列表
   * 用于显示在幻兽列表中（排除已出战槽位中的幻兽）
   */
  const getUndeployedPets = (): Pet[] => {
    const deployedIds = deployedPets
      .filter((p): p is Pet => p !== null)
      .map(p => p.id);

    return pets.filter(p => !deployedIds.includes(p.id));
  };

  /**
   * 判断是否可以出战更多幻兽
   * 检查非空槽位数是否小于2
   */
  const canDeployMore = deployedPets.filter(p => p !== null).length < 2;

  // 如果不可见，不渲染任何内容
  if (!isVisible) return null;

  return (
    <div className="pet-page-overlay" onClick={handleOverlayClick}>
      <div className="pet-page-container">
        {/* 顶部占位框 */}
        <div className="page-top-placeholder"></div>

        {/* 页面顶部关闭按钮 */}
        <div className="pet-page-header">
          <h2 className="pet-page-title">幻兽</h2>
          <button
            className="pet-page-close-button"
            onClick={onClose}
            aria-label="关闭"
          >
            ✕
          </button>
        </div>

        {/* 主要内容区域 - 移动端上下布局 */}
        <div className="pet-page-content">
          {/* 上部：出战幻兽栏区域 */}
          <div className="pet-page-top">
            <div className="deployed-pets-container">
              {/* 第一个出战幻兽栏 */}
              <DeployedPetSlot
                pet={getDeployedPet1()}
                slotIndex={0}
                onRecall={onRecall}
                onMerge={onMerge}
                onUnmerge={onUnmerge}
              />

              {/* 第二个出战幻兽栏 */}
              <DeployedPetSlot
                pet={getDeployedPet2()}
                slotIndex={1}
                onRecall={onRecall}
                onMerge={onMerge}
                onUnmerge={onUnmerge}
              />
            </div>
          </div>

          {/* 中部：物品数量提示 */}
          <div className="pet-page-middle">
            <div className="pet-count-info">
              <span className="pet-count-label">幻兽数量</span>
              <span className="pet-count-value">
                {pets.length} 只
                {deployedPets.some(p => p !== null) && (
                  <span className="deployed-count">
                    （出战 {deployedPets.filter(p => p !== null).length} 只）
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* 下部：幻兽列表展示区域 */}
          <div className="pet-page-bottom">
            <div className="pet-list-container">
              {/* 出战中的幻兽列表 */}
              {deployedPets.some(p => p !== null) && (
                <div className="pet-list-section">
                  <div className="pet-list-section-title">出战中</div>
                  {deployedPets.filter((p): p is Pet => p !== null).map(pet => (
                    <PetListItem
                      key={pet.id}
                      pet={pet}
                      onClick={handlePetClick}
                      onDeploy={onDeploy}
                      onRecall={onRecall}
                      canDeploy={canDeployMore}
                      onDiscard={handleDiscardClick}
                    />
                  ))}
                </div>
              )}

              {/* 未出战的幻兽列表（休息中） */}
              {getUndeployedPets().length > 0 && (
                <div className="pet-list-section">
                  <div className="pet-list-section-title">休息中</div>
                  {getUndeployedPets().map(pet => (
                    <PetListItem
                      key={pet.id}
                      pet={pet}
                      onClick={handlePetClick}
                      onDeploy={onDeploy}
                      onRecall={onRecall}
                      canDeploy={canDeployMore}
                      onDiscard={handleDiscardClick}
                    />
                  ))}
                </div>
              )}

              {/* 空状态提示 */}
              {pets.length === 0 && (
                <div className="pet-list-empty">
                  <div className="pet-empty-icon">🐾</div>
                  <div className="pet-empty-text">暂无幻兽</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 幻兽详情弹窗 */}
        <PetDetailModal
          isVisible={showPetDetailModal}
          onClose={handleClosePetDetailModal}
          pet={selectedPet}
          onDeploy={onDeploy}
          canDeploy={canDeployMore}
        />

        {/* 丢弃确认弹窗 */}
        {showDiscardConfirm && discardTargetPet && (
          <div className="modal-overlay" onClick={handleCancelDiscard}>
            <div className="modal-content pet-discard-confirm" onClick={e => e.stopPropagation()}>
              <div className="close-modal" onClick={handleCancelDiscard}>×</div>
              <h3 className="pet-discard-confirm-title">确认丢弃</h3>
              <p className="pet-discard-confirm-text">
                确定要丢弃 <span style={{ color: '#ffd700' }}>{discardTargetPet.othername}</span> 吗？
              </p>
              <p className="pet-discard-confirm-warning">丢弃后该幻兽将永久消失，不可恢复。</p>
              <div className="modal-options">
                <button className="option-button confirm-button" onClick={handleConfirmDiscard}>
                  确认丢弃
                </button>
                <button className="option-button cancel-button" onClick={handleCancelDiscard}>
                  取消
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetPage;
