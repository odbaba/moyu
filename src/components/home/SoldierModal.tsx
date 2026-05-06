import React from 'react';

/**
 * 小兵弹窗组件属性接口
 */
interface SoldierModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAttack: () => void;
}

/**
 * 小兵弹窗组件
 * 显示三个小兵的描述，提供攻击和离开按钮
 */
export const SoldierModal: React.FC<SoldierModalProps> = ({
  isVisible,
  onClose,
  onAttack
}) => {
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* 关闭按钮 */}
        <button className="close-modal" onClick={onClose}>×</button>

        {/* 标题 */}
        <h3>巡逻小兵</h3>

        {/* 小兵描述 */}
        <div className="modal-description">
          <p>你看到三个正在巡逻的城卫小兵。</p>
          <p style={{ color: '#ff6b6b', marginTop: '10px', fontWeight: 'bold' }}>
            ⚠️ 他们看起来不太好惹...
          </p>
          <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
            <li>小兵甲：手持长枪，神情警惕</li>
            <li>小兵乙：腰佩短刀，目光锐利</li>
            <li>小兵丙：背负弓箭，身手敏捷</li>
          </ul>
        </div>

        {/* 按钮区域 */}
        <div className="modal-options" style={{ flexDirection: 'row', gap: '10px' }}>
          {/* 攻击按钮 */}
          <button
            className="option-button"
            style={{
              backgroundColor: '#ff4444',
              borderColor: '#ff6b6b',
              flex: 1
            }}
            onClick={() => {
              onAttack();
              onClose();
            }}
          >
            ⚔️ 攻击
          </button>

          {/* 离开按钮 */}
          <button
            className="option-button"
            style={{ flex: 1 }}
            onClick={onClose}
          >
            离开
          </button>
        </div>
      </div>
    </div>
  );
};
