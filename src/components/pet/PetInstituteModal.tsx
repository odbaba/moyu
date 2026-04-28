/**
 * 幻兽研究所界面组件
 * 提供购买奇异兽、资助魔石等功能
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
  canDonate,
  donate,
  formatTechLevel,
  getVipDiscountDescription,
} from '../../utils/petInstituteUtils';

export interface PetInstituteModalProps {
  isVisible: boolean;
  state: PetInstituteState;
  resources: PlayerResources;
  inventory: InventoryItem[];
  // 当前幻兽背包中的幻兽数量
  petCount: number;
  onClose: () => void;
  onBuyPet: (pet: Pet, price: number) => void;
  // 资助魔石回调：返回消耗的魔石数量、提升的技术等级
  onDonate: (magicStones: number, levelsGained: number) => void;
}

const PetInstituteModal: React.FC<PetInstituteModalProps> = ({
  isVisible,
  state,
  resources,
  inventory: _inventory, // 重命名为 _inventory，表示未使用
  petCount, // 当前幻兽数量
  onClose,
  onBuyPet,
  onDonate,
}) => {
  const [message, setMessage] = useState<string>('');
  // 资助魔石数量输入
  const [donateAmount, setDonateAmount] = useState<string>('100');

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

  // 检查是否可以资助
  const donateCheck = useMemo(() => {
    const amount = parseInt(donateAmount) || 0;

    return canDonate(state, amount);
  }, [state, donateAmount]);

  // 计算资助可提升的等级（每100魔石提升0.01级）
  const donateLevelsPreview = useMemo(() => {
    const amount = parseInt(donateAmount) || 0;

    return (amount / 100 / 100).toFixed(2);
  }, [donateAmount]);

  // 处理购买
  const handleBuy = () => {
    // 检查幻兽背包是否已满（最大100只）
    const MAX_PET_COUNT = 100;
    if (petCount >= MAX_PET_COUNT) {
      setMessage('幻兽背包已满，请先整理幻兽');

      return;
    }

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

  // 处理资助
  const handleDonate = () => {
    const amount = parseInt(donateAmount) || 0;

    if (!donateCheck.canDonate) {
      setMessage(donateCheck.reason);

      return;
    }

    // 检查魔石是否足够
    if (resources.magicStone < amount) {
      setMessage('魔石不足');

      return;
    }

    const result = donate(state, amount);

    if (result.success) {
      onDonate(amount, result.levelsGained);
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
              <span className="info-label">技术等级</span>
              <span className="info-value">{formatTechLevel(state.techLevel)} / {formatTechLevel(state.techLevelMax)}</span>
              <span className="info-label">当前库存</span>
              <span className="info-value">{state.stock}</span>
              <span className="info-label">每日产量</span>
              <span className="info-value">{state.productionRate}</span>
              <span className="info-label">VIP星级</span>
              <span className="info-value">{state.vipLevel} 星（{discount}）</span>
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

          {/* 资助区域 */}
          <div className="donate-section">
            <h3>资助魔石</h3>
            <div className="donate-input-row">
              <input
                type="number"
                value={donateAmount}
                onChange={(e) => setDonateAmount(e.target.value)}
                placeholder="输入魔石数量"
                min="100"
                step="100"
                className="donate-input"
              />
              <button
                className="action-button donate-button"
                onClick={handleDonate}
                disabled={!donateCheck.canDonate || resources.magicStone < (parseInt(donateAmount) || 0)}
              >
                资助
              </button>
            </div>
            <div className="donate-info">
              <p>每 100 魔石提升 0.01 级技术等级</p>
              {parseInt(donateAmount) >= 100 && (
                <p>可提升 {donateLevelsPreview} 级</p>
              )}
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
            {!buyCheck.canBuy && state.techLevel < 20 && (
              <p className="buy-hint">需要研究所达到20级</p>
            )}
          </div>

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
