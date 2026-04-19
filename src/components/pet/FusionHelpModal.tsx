import './pet.css';

import React from 'react';

/**
 * 幻化帮助弹窗组件属性接口
 * 定义组件接收的参数类型
 */
interface FusionHelpModalProps {
  /** 是否显示弹窗 */
  isVisible: boolean;
  /** 关闭弹窗回调函数 */
  onClose: () => void;
}

/**
 * 幻化帮助弹窗组件
 * 用于显示幻化系统的详细说明和规则
 * 包含幻化条件、效果、评分要求、顿悟机制和注意事项
 */
const FusionHelpModal: React.FC<FusionHelpModalProps> = ({
  isVisible,
  onClose
}) => {
  /**
   * 处理点击遮罩层关闭弹窗
   * @param e 鼠标事件对象
   */
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 如果弹窗不可见，则不渲染
  if (!isVisible) return null;

  return (
    <div
      className="fusion-help-modal-overlay"
      onClick={handleOverlayClick}
    >
      <div className="fusion-help-modal-content">
        {/* 关闭按钮 */}
        <button
          className="fusion-help-close-button"
          onClick={onClose}
          aria-label="关闭"
        >
          ×
        </button>

        {/* 弹窗标题 */}
        <h3 className="fusion-help-title">
          📖 幻化系统说明
        </h3>

        {/* 可滚动的内容区域 */}
        <div className="fusion-help-scroll-content">
          {/* 幻化条件部分 */}
          <div className="fusion-help-section">
            <h4 className="fusion-help-section-title">
              🔮 幻化条件
            </h4>
            <ul className="fusion-help-list">
              <li>主幻兽等级必须达到<span className="highlight">50级</span></li>
              <li>副幻兽类型必须与主幻兽<span className="highlight">相同</span>或为<span className="highlight">奇异兽</span></li>
              <li>副幻兽评分需达到要求（主幻兽评分越高，要求越高）</li>
            </ul>
          </div>

          {/* 幻化效果部分 */}
          <div className="fusion-help-section">
            <h4 className="fusion-help-section-title">
              ✨ 幻化效果
            </h4>
            <ul className="fusion-help-list">
              <li>
                <span className="effect-label">主属性幻化：</span>
                根据幻兽类型获得不同的成长率加成
              </li>
              <li>
                <span className="effect-label">副属性幻化：</span>
                继承副幻兽较高的生命和防御成长率（<span className="highlight">90%</span>）
              </li>
              <li>
                <span className="effect-label">初始属性幻化：</span>
                继承副幻兽较高的初始属性（<span className="highlight">85%</span>）
              </li>
            </ul>
          </div>

          {/* 评分要求部分 */}
          <div className="fusion-help-section">
            <h4 className="fusion-help-section-title">
              📊 评分要求
            </h4>
            <ul className="fusion-help-list">
              <li>
                主幻兽评分 <span className="highlight">&lt; 1500</span>：无要求
              </li>
              <li>
                主幻兽评分 <span className="highlight">≥ 1500</span>：
                要求 = (主幻兽评分 - 500) / 2
              </li>
            </ul>
            <div className="fusion-help-example">
              <span className="example-label">示例：</span>
              主幻兽评分2000时，副幻兽评分需 ≥ (2000-500)/2 = 750
            </div>
          </div>

          {/* 顿悟机制部分 */}
          <div className="fusion-help-section">
            <h4 className="fusion-help-section-title">
              💡 顿悟机制
            </h4>
            <ul className="fusion-help-list">
              <li>幻化后升级到<span className="highlight">50级</span>时有概率触发顿悟</li>
              <li>顿悟可恢复到幻化前的等级</li>
            </ul>
          </div>

          {/* 注意事项部分 */}
          <div className="fusion-help-section warning">
            <h4 className="fusion-help-section-title">
              ⚠️ 注意事项
            </h4>
            <ul className="fusion-help-list">
              <li>副幻兽会被<span className="warning-text">消耗</span>，请谨慎选择</li>
              <li>幻化后主幻兽等级<span className="warning-text">重置为1级</span></li>
            </ul>
          </div>
        </div>

        {/* 底部关闭按钮 */}
        <div className="fusion-help-footer">
          <button
            className="fusion-help-confirm-button"
            onClick={onClose}
          >
            我知道了
          </button>
        </div>
      </div>
    </div>
  );
};

export default FusionHelpModal;
