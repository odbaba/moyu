/**
 * 使用物品选择目标弹窗组件
 * 用于选择物品使用的目标（玩家或幻兽）
 */

import './UseItemTargetModal.css';

import React from 'react';

import type { Pet } from '../../types';
import { getPetAvatar } from '../common/utils';

/**
 * 使用物品目标选择弹窗 Props 接口
 */
interface UseItemTargetModalProps {
  /** 是否显示弹窗 */
  isVisible: boolean;
  /** 关闭弹窗回调 */
  onClose: () => void;
  /** 物品名称 */
  itemName: string;
  /** 幻兽列表 */
  pets: Pet[];
  /** 选择玩家回调 */
  onSelectPlayer: () => void;
  /** 选择幻兽数回调 */
  onSelectPet: (petId: string) => void;
}

/**
 * 使用物品目标选择弹窗组件
 */
const UseItemTargetModal: React.FC<UseItemTargetModalProps> = ({
  isVisible,
  onClose,
  itemName,
  pets,
  onSelectPlayer,
  onSelectPet,
}) => {
  if (!isVisible) return null;

  /**
   * 处理点击遮罩层关闭弹窗
   */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="use-item-modal-overlay" onClick={handleOverlayClick}>
      <div className="use-item-modal-content">
        {/* 标题 */}
        <div className="use-item-modal-header">
          <h3>选择使用目标</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {/* 物品信息 */}
        <div className="use-item-info">
          <span className="item-name">{itemName}</span>
        </div>

        {/* 目标选择列表 */}
        <div className="target-list">
          {/* 玩家选项 */}
          <div className="target-item player-target" onClick={() => {
            onSelectPlayer();
          }}>
            <div className="target-icon">👤</div>
            <div className="target-info">
              <div className="target-name">玩家角色</div>
              <div className="target-description">对玩家使用，增加2700经验</div>
            </div>
            <div className="target-action">使用</div>
          </div>

          {/* 幻兽列表 */}
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="target-item pet-target"
              onClick={() => {
                onSelectPet(pet.id);
              }}
            >
              <div className="target-icon">
                <img src={getPetAvatar(pet.hs_name)} alt={pet.hs_name} className="pet-avatar-img" />
              </div>
              <div className="target-info">
                <div className="target-name">{pet.othername}</div>
                <div className="target-details">
                  <span>Lv.{pet.dj}</span>
                  <span>{pet.qualityTitle}</span>
                  <span>经验: {pet.jy}/{pet.mjy}</span>
                </div>
                <div className="target-description">对幻兽使用，增加27000经验</div>
              </div>
              <div className="target-action">使用</div>
            </div>
          ))}
        </div>

        {/* 提示信息 */}
        <div className="use-item-hint">
          点击选择使用目标
        </div>
      </div>
    </div>
  );
};

export default UseItemTargetModal;
