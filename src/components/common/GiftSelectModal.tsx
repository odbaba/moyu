import './GiftSelectModal.css';

import React, { useMemo, useState } from 'react';

import type { InventoryItem } from '../../types';

/**
 * 送礼选择模态窗口组件属性接口
 */
interface GiftSelectModalProps {
  /** 是否显示模态窗口 */
  isVisible: boolean;
  /** 关闭模态窗口的回调函数 */
  onClose: () => void;
  /** 背包物品列表 */
  inventoryItems: InventoryItem[];
  /** 确认送礼的回调函数 */
  onConfirmGift: (flowers: Array<{ type: '99朵白玫瑰' | '999朵白玫瑰'; quantity: number }>) => void;
}

/**
 * 送礼选择模态窗口组件
 * 用于选择背包中的玫瑰花送给公主，支持同时选择多种玫瑰
 */
const GiftSelectModal: React.FC<GiftSelectModalProps> = ({
  isVisible,
  onClose,
  inventoryItems,
  onConfirmGift
}) => {
  // 99朵白玫瑰数量
  const [rose99Quantity, setRose99Quantity] = useState(0);
  // 999朵白玫瑰数量
  const [rose999Quantity, setRose999Quantity] = useState(0);
  // 提示消息
  const [message, setMessage] = useState('');

  // 从背包中筛选出玫瑰花
  const roses = useMemo(() => {
    const rose99 = inventoryItems.find(item => item.name === '99朵白玫瑰');
    const rose999 = inventoryItems.find(item => item.name === '999朵白玫瑰');

    return {
      '99朵白玫瑰': rose99 ? rose99.quantity || 0 : 0,
      '999朵白玫瑰': rose999 ? rose999.quantity || 0 : 0,
    };
  }, [inventoryItems]);

  // 计算亲密度增加
  const calculateIntimacyGain = (flowerType: '99朵白玫瑰' | '999朵白玫瑰', quantity: number): number => {
    if (quantity === 0) return 0;

    if (flowerType === '99朵白玫瑰') {
      // 99朵白玫瑰：基础5点 + 每多1朵+1点
      return 5 + (quantity - 1) * 1;
    } else {
      // 999朵白玫瑰：基础25点 + 每多1朵+5点
      return 25 + (quantity - 1) * 5;
    }
  };

  // 计算总亲密度
  const totalIntimacy = useMemo(() => {
    return calculateIntimacyGain('99朵白玫瑰', rose99Quantity) +
           calculateIntimacyGain('999朵白玫瑰', rose999Quantity);
  }, [rose99Quantity, rose999Quantity]);

  // 处理遮罩层点击
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 处理99朵白玫瑰数量变化
  const handleRose99Change = (delta: number) => {
    const maxQuantity = roses['99朵白玫瑰'];
    const newQuantity = Math.max(0, Math.min(maxQuantity, rose99Quantity + delta));
    setRose99Quantity(newQuantity);
    setMessage('');
  };

  // 处理999朵白玫瑰数量变化
  const handleRose999Change = (delta: number) => {
    const maxQuantity = roses['999朵白玫瑰'];
    const newQuantity = Math.max(0, Math.min(maxQuantity, rose999Quantity + delta));
    setRose999Quantity(newQuantity);
    setMessage('');
  };

  // 处理确认送礼
  const handleConfirm = () => {
    if (rose99Quantity === 0 && rose999Quantity === 0) {
      setMessage('请至少选择一种花朵！');
      setTimeout(() => setMessage(''), 2000);

      return;
    }

    // 构建花朵列表
    const flowers: Array<{ type: '99朵白玫瑰' | '999朵白玫瑰'; quantity: number }> = [];

    if (rose99Quantity > 0) {
      flowers.push({ type: '99朵白玫瑰', quantity: rose99Quantity });
    }

    if (rose999Quantity > 0) {
      flowers.push({ type: '999朵白玫瑰', quantity: rose999Quantity });
    }

    // 调用确认送礼回调
    onConfirmGift(flowers);

    // 重置状态并关闭
    setRose99Quantity(0);
    setRose999Quantity(0);
    setMessage('');
    onClose();
  };

  // 如果不可见，不渲染
  if (!isVisible) return null;

  return (
    <div className="gift-select-modal-overlay" onClick={handleOverlayClick}>
      <div className="gift-select-modal">
        {/* 标题 */}
        <div className="gift-select-modal-header">
          <h3>🌹 送礼给公主</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {/* 提示信息 */}
        <div className="gift-select-modal-tip">
          选择背包中的玫瑰花送给公主，增加亲密度（可同时选择多种）
        </div>

        {/* 花朵选择 */}
        <div className="gift-select-flowers">
          {/* 99朵白玫瑰 */}
          <div className={`flower-option ${roses['99朵白玫瑰'] === 0 ? 'disabled' : ''} ${rose99Quantity > 0 ? 'selected' : ''}`}>
            <div className="flower-icon">💐</div>
            <div className="flower-info">
              <div className="flower-name">99朵白玫瑰</div>
              <div className="flower-count">背包: {roses['99朵白玫瑰']} 个</div>
              <div className="flower-effect">亲密度 +5起</div>
            </div>
            <div className="quantity-controls">
              <button
                className="quantity-btn"
                onClick={() => handleRose99Change(-1)}
                disabled={rose99Quantity <= 0}
              >
                -
              </button>
              <span className="quantity-value">{rose99Quantity}</span>
              <button
                className="quantity-btn"
                onClick={() => handleRose99Change(1)}
                disabled={rose99Quantity >= roses['99朵白玫瑰']}
              >
                +
              </button>
            </div>
          </div>

          {/* 999朵白玫瑰 */}
          <div className={`flower-option ${roses['999朵白玫瑰'] === 0 ? 'disabled' : ''} ${rose999Quantity > 0 ? 'selected' : ''}`}>
            <div className="flower-icon">🌹</div>
            <div className="flower-info">
              <div className="flower-name">999朵白玫瑰</div>
              <div className="flower-count">背包: {roses['999朵白玫瑰']} 个</div>
              <div className="flower-effect">亲密度 +25起</div>
            </div>
            <div className="quantity-controls">
              <button
                className="quantity-btn"
                onClick={() => handleRose999Change(-1)}
                disabled={rose999Quantity <= 0}
              >
                -
              </button>
              <span className="quantity-value">{rose999Quantity}</span>
              <button
                className="quantity-btn"
                onClick={() => handleRose999Change(1)}
                disabled={rose999Quantity >= roses['999朵白玫瑰']}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* 总亲密度预览 */}
        <div className="gift-select-total">
          <div className="total-label">预计增加亲密度:</div>
          <div className="total-value">+{totalIntimacy}</div>
        </div>

        {/* 提示消息 */}
        {message && (
          <div className="gift-select-message">
            {message}
          </div>
        )}

        {/* 操作按钮 */}
        <div className="gift-select-actions">
          <button className="cancel-btn" onClick={onClose}>
            取消
          </button>
          <button
            className="confirm-btn"
            onClick={handleConfirm}
            disabled={rose99Quantity === 0 && rose999Quantity === 0}
          >
            确认送礼
          </button>
        </div>
      </div>
    </div>
  );
};

export default GiftSelectModal;
