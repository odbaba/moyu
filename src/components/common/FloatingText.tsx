import './FloatingText.css';

import { useEffect, useState } from 'react';

/**
 * 浮动文字组件属性接口
 */
interface FloatingTextProps {
  /** 显示的文字内容 */
  text: string;
  /** 动画持续时间，默认3000ms */
  duration?: number;
  /** 动画完成回调 */
  onComplete?: () => void;
}

/**
 * 浮动文字组件
 * 实现白色文字从屏幕中间上浮并逐渐消失的动画效果
 * 参考战斗页面的伤害数字动画
 */
const FloatingText: React.FC<FloatingTextProps> = ({
  text,
  duration = 3000,
  onComplete
}) => {
  // 动画状态：是否正在显示
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 设置定时器，在动画结束后移除文字
    const timer = setTimeout(() => {
      setIsVisible(false);
      // 调用完成回调
      if (onComplete) {
        onComplete();
      }
    }, duration);

    // 清理定时器
    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  // 如果不可见，不渲染
  if (!isVisible) {
    return null;
  }

  return (
    <div className="floating-text-container">
      <div
        className="floating-text"
        style={{ animationDuration: `${duration}ms` }}
      >
        {text}
      </div>
    </div>
  );
};

export default FloatingText;
