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
   * 出战幻兽数组（最多2只）
   */
  deployedPets: Pet[];
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
  onDeploy
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
   * 获取第一个出战幻兽
   */
  const getDeployedPet1 = (): Pet | null => {
    return deployedPets.length > 0 ? deployedPets[0] : null;
  };

  /**
   * 获取第二个出战幻兽
   */
  const getDeployedPet2 = (): Pet | null => {
    return deployedPets.length > 1 ? deployedPets[1] : null;
  };

  /**
   * 过滤未出战的幻兽列表
   * 用于显示在幻兽列表中
   */
  const getUndeployedPets = (): Pet[] => {
    const deployedIds = deployedPets.map(p => p.id);

    return pets.filter(p => !deployedIds.includes(p.id));
  };

  /**
   * 判断是否可以出战更多幻兽
   * 最多同时出战2只
   */
  const canDeployMore = deployedPets.length < 2;

  // 如果不可见，不渲染任何内容
  if (!isVisible) return null;

  return (
    <div className="pet-page-overlay" onClick={handleOverlayClick}>
      <div className="pet-page-container">
        {/* 页面顶部关闭按钮 */}
        <div className="pet-page-header">
          <h2 className="pet-page-title">幻兽</h2>
          <button
            className="pet-page-close-button"
            onClick={onClose}
          >
            ✕ 关闭
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
                {deployedPets.length > 0 && (
                  <span className="deployed-count">
                    （出战 {deployedPets.length} 只）
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* 下部：幻兽列表展示区域 */}
          <div className="pet-page-bottom">
            <div className="pet-list-container">
              {/* 出战中的幻兽列表 */}
              {deployedPets.length > 0 && (
                <div className="pet-list-section">
                  <div className="pet-list-section-title">出战中</div>
                  {deployedPets.map(pet => (
                    <PetListItem
                      key={pet.id}
                      pet={pet}
                      onClick={handlePetClick}
                      onDeploy={onDeploy}
                      canDeploy={canDeployMore}
                    />
                  ))}
                </div>
              )}

              {/* 未出战的幻兽列表 */}
              {getUndeployedPets().length > 0 && (
                <div className="pet-list-section">
                  <div className="pet-list-section-title">休息中</div>
                  {getUndeployedPets().map(pet => (
                    <PetListItem
                      key={pet.id}
                      pet={pet}
                      onClick={handlePetClick}
                      onDeploy={onDeploy}
                      canDeploy={canDeployMore}
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
      </div>
    </div>
  );
};

export default PetPage;
