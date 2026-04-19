import React from 'react';

/**
 * 信息弹窗组件属性接口
 * @property isVisible - 是否显示弹窗
 * @property onClose - 关闭弹窗的回调函数
 * @property title - 弹窗标题
 * @property content - 弹窗内容（支持换行符）
 * @property onConfirm - 确认按钮的回调函数（可选，如果提供则显示确认/取消按钮）
 * @property confirmText - 确认按钮文本（默认为"确认"）
 * @property cancelText - 取消按钮文本（默认为"取消"）
 */
interface InfoModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  content: string;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

/**
 * 信息弹窗组件
 * 用于显示NPC查询信息的结果
 * 支持多行文本自动换行，适配手机端
 * 支持确认/取消按钮模式
 */
const InfoModal: React.FC<InfoModalProps> = ({
  isVisible,
  onClose,
  title,
  content,
  onConfirm,
  confirmText = '确认',
  cancelText = '取消'
}) => {
  // 如果不可见则返回null，不渲染任何内容
  if (!isVisible) return null;

  // 处理确认按钮点击
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* 关闭按钮 */}
        <button className="close-modal" onClick={onClose}>×</button>

        {/* 标题 */}
        <h3>{title}</h3>

        {/* 内容区域 - 使用 pre-line 样式支持换行符 */}
        <div className="info-modal-content">
          {content}
        </div>

        {/* 按钮区域 */}
        <div className="modal-options" style={{ marginTop: '15px' }}>
          {onConfirm ? (
            // 确认/取消按钮模式
            <>
              <button
                className="option-button"
                onClick={onClose}
                style={{ marginRight: '10px' }}
              >
                {cancelText}
              </button>
              <button
                className="option-button"
                onClick={handleConfirm}
                style={{ backgroundColor: '#4CAF50', color: 'white' }}
              >
                {confirmText}
              </button>
            </>
          ) : (
            // 单个确定按钮模式
            <button
              className="option-button"
              onClick={onClose}
            >
              确定
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
