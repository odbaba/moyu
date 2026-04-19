import React, { useMemo, useState } from 'react';

/**
 * 捐献金币弹窗组件属性接口
 * @property isVisible - 是否显示弹窗
 * @property onClose - 关闭弹窗的回调函数
 * @property currentGold - 当前金币数量
 * @property currentMerit - 当前功勋值
 * @property currentNobleRank - 当前爵位等级
 * @property onDonate - 捐献成功的回调函数（返回捐献的金币和获得的功勋）
 */
interface DonationModalProps {
  isVisible: boolean;
  onClose: () => void;
  currentGold: number;
  currentMerit: number;
  currentNobleRank: number;
  onDonate: (donatedGold: number, gainedMerit: number) => void;
}

/**
 * 捐献金币弹窗组件
 * 用于首相NPC的捐献金币功能
 * 兑换比例：每750,000金币 = 1功勋
 * 参考文档：reference/docs/元帅与首相交互逻辑文档.md
 */
const DonationModal: React.FC<DonationModalProps> = ({
  isVisible,
  onClose,
  currentGold,
  currentMerit,
  currentNobleRank: _currentNobleRank,
  onDonate,
}) => {
  // 捐献金额状态
  const [donateAmount, setDonateAmount] = useState<string>('750000');

  // 兑换比例：每750,000金币 = 1功勋
  const EXCHANGE_RATE = 750000;

  // 计算可获得的功勋
  const gainedMerit = useMemo(() => {
    const amount = parseInt(donateAmount) || 0;

    return Math.floor(amount / EXCHANGE_RATE);
  }, [donateAmount]);

  // 实际消耗的金币（向下取整到兑换比例的倍数）
  const actualGoldCost = useMemo(() => {
    return gainedMerit * EXCHANGE_RATE;
  }, [gainedMerit]);

  // 是否可以捐献
  const canDonate = useMemo(() => {
    const amount = parseInt(donateAmount) || 0;

    return amount >= EXCHANGE_RATE && amount <= currentGold;
  }, [donateAmount, currentGold]);

  // 处理捐献
  const handleDonate = () => {
    if (!canDonate || gainedMerit <= 0) return;

    // 调用父组件的捐献回调
    onDonate(actualGoldCost, gainedMerit);

    // 关闭弹窗
    onClose();
  };

  // 快速选择按钮
  const quickSelectAmounts = [
    { label: '75万', value: 750000 },
    { label: '750万', value: 7500000 },
    { label: '7500万', value: 75000000 },
    { label: '全部', value: currentGold },
  ];

  // 如果不可见则返回null
  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* 关闭按钮 */}
        <button className="close-modal" onClick={onClose}>×</button>

        {/* 标题 */}
        <h3>捐献金币</h3>

        {/* 当前状态 */}
        <div className="donation-info">
          <p>当前金币：<span className="highlight">{currentGold.toLocaleString()}</span></p>
          <p>当前功勋：<span className="highlight">{currentMerit.toLocaleString()}</span></p>
          <p>兑换比例：<span className="highlight">750,000 金币 = 1 功勋</span></p>
        </div>

        {/* 快速选择按钮 */}
        <div className="quick-select-buttons">
          {quickSelectAmounts.map((item) => (
            <button
              key={item.value}
              className="quick-select-btn"
              onClick={() => setDonateAmount(item.value.toString())}
              disabled={item.value > currentGold}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* 输入框 */}
        <div className="donation-input-group">
          <label>捐献金额：</label>
          <input
            type="number"
            value={donateAmount}
            onChange={(e) => setDonateAmount(e.target.value)}
            placeholder="输入捐献金额"
            min={EXCHANGE_RATE}
            max={currentGold}
            className="donation-input"
          />
        </div>

        {/* 预览信息 */}
        <div className="donation-preview">
          <p>将消耗：<span className="highlight">{actualGoldCost.toLocaleString()}</span> 金币</p>
          <p>可获得：<span className="highlight merit">{gainedMerit}</span> 功勋</p>
          {gainedMerit > 0 && (
            <p className="donation-hint">
              捐献后功勋：{(currentMerit + gainedMerit).toLocaleString()}
            </p>
          )}
        </div>

        {/* 错误提示 */}
        {parseInt(donateAmount) > currentGold && (
          <p className="error-message">金币不足！</p>
        )}
        {parseInt(donateAmount) < EXCHANGE_RATE && parseInt(donateAmount) > 0 && (
          <p className="error-message">至少需要 750,000 金币才能获得 1 功勋</p>
        )}

        {/* 按钮区域 */}
        <div className="modal-options" style={{ marginTop: '15px' }}>
          <button
            className="option-button"
            onClick={onClose}
            style={{ marginRight: '10px' }}
          >
            取消
          </button>
          <button
            className="option-button"
            onClick={handleDonate}
            disabled={!canDonate || gainedMerit <= 0}
            style={{
              backgroundColor: canDonate && gainedMerit > 0 ? '#4CAF50' : '#ccc',
              color: 'white',
            }}
          >
            确认捐献
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;
