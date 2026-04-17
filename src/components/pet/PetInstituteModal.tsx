/**
 * 幻兽研究所界面组件
 * 提供购买奇异兽、查看信息、提高产量等功能
 * 参考文档：reference/docs/幻兽研究所交互逻辑文档.md
 */

import './PetInstituteModal.css';

import React, { useMemo, useState } from 'react';

import type { InventoryItem, Pet, PetInstituteState, PlayerResources } from '../../types';
import { generateStrangePet } from '../../utils/petGenerator';
import {
  buyPet,
  calculatePetQuality,
  calculatePrice,
  calculateStarLevel,
  canBuyPet,
  canImproveProduction,
  getVipDiscountDescription,
  improveProduction,
} from '../../utils/petInstituteUtils';

export interface PetInstituteModalProps {
  isVisible: boolean;
  state: PetInstituteState;
  resources: PlayerResources;
  inventory: InventoryItem[];
  onClose: () => void;
  onBuyPet: (pet: Pet, price: number) => void;
  onImproveProduction: (expGained: number, vipGained: number, consumedSoulKings: number) => void;
}

const PetInstituteModal: React.FC<PetInstituteModalProps> = ({
  isVisible,
  state,
  resources,
  inventory,
  onClose,
  onBuyPet,
  onImproveProduction,
}) => {
  const [message, setMessage] = useState<string>('');

  // 计算当前品质分和价格
  const qualityScore = useMemo(() => calculatePetQuality(state.techLevel), [state.techLevel]);
  const price = useMemo(() => calculatePrice(qualityScore, state.vipLevel), [qualityScore, state.vipLevel]);
  const starLevel = useMemo(() => calculateStarLevel(qualityScore), [qualityScore]);
  const discount = useMemo(() => getVipDiscountDescription(state.vipLevel), [state.vipLevel]);

  // 检查是否可以购买
  const buyCheck = useMemo(
    () => canBuyPet(state, resources),
    [state, resources]
  );

  // 检查是否可以做提高产量任务
  const productionCheck = useMemo(
    () => canImproveProduction(state, inventory),
    [state, inventory]
  );

  // 处理购买
  const handleBuy = () => {
    if (!buyCheck.canBuy) {
      setMessage(buyCheck.reason);

      return;
    }

    const result = buyPet(state, resources);

    if (result.success) {
      // 生成奇异兽
      const pet = generateStrangePet(result.qualityScore);
      onBuyPet(pet, result.price);
      setMessage(result.message);
    } else {
      setMessage(result.message);
    }
  };

  // 处理提高产量任务
  const handleImproveProduction = () => {
    if (!productionCheck.canImprove) {
      setMessage(productionCheck.reason);

      return;
    }

    const result = improveProduction(state, inventory);

    if (result.success) {
      onImproveProduction(result.expGained, result.vipGained, result.consumedSoulKings);
      setMessage(result.message);
    } else {
      setMessage(result.message);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="pet-institute-overlay">
      <div className="pet-institute-modal">
        <div className="pet-institute-header">
          <h2>🔬 幻兽研究所</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="pet-institute-content">
          {/* 研究所信息 */}
          <div className="institute-info-section">
            <h3>研究所信息</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">技术等级</span>
                <span className="info-value">{state.techLevel} / {state.techLevelMax}</span>
              </div>
              <div className="info-item">
                <span className="info-label">当前库存</span>
                <span className="info-value">{state.stock}</span>
              </div>
              <div className="info-item">
                <span className="info-label">每日产量</span>
                <span className="info-value">{state.productionRate}</span>
              </div>
              <div className="info-item">
                <span className="info-label">VIP星级</span>
                <span className="info-value">{state.vipLevel} 星（{discount}）</span>
              </div>
            </div>
          </div>

          {/* 奇异兽信息 */}
          <div className="pet-info-section">
            <h3>奇异兽品质</h3>
            <div className="pet-quality-info">
              <div className="quality-item">
                <span className="quality-label">品质分</span>
                <span className="quality-value">{qualityScore}</span>
              </div>
              <div className="quality-item">
                <span className="quality-label">星级</span>
                <span className="quality-value">{starLevel} 星</span>
              </div>
              <div className="quality-item">
                <span className="quality-label">价格</span>
                <span className="quality-value price">{price} 魔石</span>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="action-section">
            <button
              className="action-button buy-button"
              onClick={handleBuy}
              disabled={!buyCheck.canBuy}
            >
              购买奇异兽
            </button>

            <button
              className="action-button production-button"
              onClick={handleImproveProduction}
              disabled={!productionCheck.canImprove}
            >
              提高产量任务
            </button>
          </div>

          {/* 提高产量任务提示 */}
          {state.canDoProductionTask && (
            <div className="task-hint">
              <p>📋 提高产量任务已开放！</p>
              <p>所需灵魂王：{productionCheck.requiredSoulKings} 个</p>
              <p>经验奖励：{productionCheck.requiredSoulKings * 105000}</p>
            </div>
          )}

          {/* 消息提示 */}
          {message && (
            <div className="message-section">
              <p>{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetInstituteModal;
