import React from 'react';

/**
 * 幻化结果弹窗组件属性接口
 * 定义组件接收的参数类型
 */
interface FusionResultModalProps {
  /** 是否显示弹窗 */
  isVisible: boolean;
  /** 关闭弹窗的回调函数 */
  onClose: () => void;
  /** 幻化结果描述文本 */
  result: string;
}

/**
 * 幻化结果弹窗组件
 * 用于显示幻化操作的详细结果信息
 * 包含主属性、副属性、初始属性加分详情以及转世次数提示
 * 移动端友好布局，支持滚动查看详细内容
 */
const FusionResultModal: React.FC<FusionResultModalProps> = ({
  isVisible,
  onClose,
  result
}) => {
  // 如果不可见，不渲染任何内容
  if (!isVisible) return null;

  /**
   * 处理确定按钮点击事件
   * 关闭弹窗
   */
  const handleConfirm = () => {
    onClose();
  };

  /**
   * 处理背景点击事件
   * 点击背景区域关闭弹窗
   * @param event 点击事件对象
   */
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // 只有点击背景层时才关闭，点击内容区域不关闭
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    // 弹窗背景遮罩层
    <div
      className="fusion-result-modal-overlay"
      onClick={handleOverlayClick}
    >
      {/* 弹窗内容容器 */}
      <div className="fusion-result-modal-content">
        {/* 关闭按钮 - 右上角 */}
        <button
          className="fusion-result-modal-close"
          onClick={handleConfirm}
          aria-label="关闭弹窗"
        >
          ×
        </button>

        {/* 弹窗标题 */}
        <h3 className="fusion-result-title">
          ✨ 幻化成功 ✨
        </h3>

        {/* 幻化结果详情区域 - 可滚动 */}
        <div className="fusion-result-details">
          {/* 结果文本内容 */}
          <div className="fusion-result-text">
            {result}
          </div>
        </div>

        {/* 底部确定按钮 */}
        <div className="fusion-result-actions">
          <button
            className="fusion-result-confirm-button"
            onClick={handleConfirm}
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
};

export default FusionResultModal;
