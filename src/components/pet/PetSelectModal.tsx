import './pet.css';

import React, { useMemo } from 'react';

import type { Pet } from '../../types';
import { getPetEmoji, getPetQualityColor } from '../common/utils';

/**
 * 幻兽选择弹窗组件属性接口
 * 定义组件接收的参数类型
 */
interface PetSelectModalProps {
  /**
   * 是否显示弹窗
   */
  isVisible: boolean;
  /**
   * 关闭弹窗的回调函数
   */
  onClose: () => void;
  /**
   * 所有幻兽数组
   */
  pets: Pet[];
  /**
   * 已出战的幻兽ID数组
   */
  deployedPetIds: string[];
  /**
   * 选择幻兽的回调函数
   * @param pet 被选中的幻兽对象
   */
  onSelect: (pet: Pet) => void;
  /**
   * 需要排除的幻兽ID数组（可选）
   * 如已选择的主/副幻兽
   */
  excludePetIds?: string[];
  /**
   * 是否排除出战幻兽（可选）
   * 默认为 true，设为 false 时出战幻兽也可被选择
   */
  excludeDeployed?: boolean;
  /**
   * 弹窗标题（可选）
   * 默认为"选择幻兽"
   */
  title?: string;
}

/**
 * 幻兽选择弹窗组件
 * 用于在幻兽合成、幻化等场景中选择幻兽
 * 显示所有可用幻兽列表，支持排除已出战和指定ID的幻兽
 */
const PetSelectModal: React.FC<PetSelectModalProps> = ({
  isVisible,
  onClose,
  pets,
  deployedPetIds,
  onSelect,
  excludePetIds = [],
  excludeDeployed = true,
  title = '选择幻兽'
}) => {
  /**
   * 过滤出可选择的幻兽列表
   * 根据 excludeDeployed 参数决定是否排除出战幻兽
   */
  const availablePets = useMemo(() => {
    // 创建需要排除的ID集合
    const excludeSet = new Set([...excludePetIds]);

    // 如果需要排除出战幻兽，则添加到排除集合
    if (excludeDeployed) {
      deployedPetIds.forEach(id => excludeSet.add(id));
    }

    // 过滤出可选择的幻兽
    return pets.filter(pet => !excludeSet.has(pet.id));
  }, [pets, deployedPetIds, excludePetIds, excludeDeployed]);

  /**
   * 处理点击遮罩层关闭弹窗
   * 只有点击遮罩层本身才关闭，点击内容区域不关闭
   */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  /**
   * 处理幻兽项点击事件
   * 选择幻兽后调用回调并关闭弹窗
   * @param pet 被选中的幻兽
   */
  const handlePetClick = (pet: Pet) => {
    onSelect(pet);
    onClose();
  };

  // 如果弹窗不可见，则不渲染
  if (!isVisible) return null;

  return (
    <div
      className="pet-select-modal-overlay"
      onClick={handleOverlayClick}
    >
      <div className="pet-select-modal-content">
        {/* 弹窗标题 */}
        <div className="pet-select-modal-header">
          <h3 className="pet-select-modal-title">{title}</h3>
          {/* 关闭按钮 */}
          <button
            className="pet-select-close-button"
            onClick={onClose}
            aria-label="关闭"
          >
            ×
          </button>
        </div>

        {/* 幻兽列表区域 */}
        <div className="pet-select-modal-list">
          {/* 无可用幻兽提示 */}
          {availablePets.length === 0 ? (
            <div className="pet-select-empty">
              <span className="pet-select-empty-icon">🐾</span>
              <span className="pet-select-empty-text">暂无可用幻兽</span>
            </div>
          ) : (
            // 幻兽列表
            availablePets.map(pet => (
              <div
                key={pet.id}
                className="pet-select-item"
                onClick={() => handlePetClick(pet)}
              >
                {/* 幻兽头像 */}
                <div className="pet-select-item-avatar">
                  <span className="pet-select-item-emoji">
                    {getPetEmoji(pet.hs_name)}
                  </span>
                </div>

                {/* 幻兽信息 */}
                <div className="pet-select-item-info">
                  {/* 幻兽名称 */}
                  <div className="pet-select-item-name-row">
                    <span
                      className="pet-select-item-name"
                      style={{ color: getPetQualityColor(pet.qualityTitle) }}
                    >
                      {pet.othername}
                    </span>
                    {/* 品质称号标签 */}
                    <span
                      className="pet-select-item-quality"
                      style={{ backgroundColor: getPetQualityColor(pet.qualityTitle) }}
                    >
                      {pet.qualityTitle}
                    </span>
                  </div>

                  {/* 幻兽属性信息 */}
                  <div className="pet-select-item-meta">
                    {/* 幻兽类型 */}
                    <span className="pet-select-item-type">{pet.hs_name}</span>
                    {/* 等级 */}
                    <span className="pet-select-item-level">Lv.{pet.dj}</span>
                    {/* 评分 */}
                    <span className="pet-select-item-score">评分:{pet.pz}</span>
                  </div>
                </div>

                {/* 选择指示箭头 */}
                <div className="pet-select-item-arrow">›</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PetSelectModal;
