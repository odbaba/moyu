import './GuideOverlay.css';

import React, { useCallback, useEffect, useState } from 'react';

import type { GuideStep } from '../../data/guideConfig';

/**
 * 引导蒙层组件属性接口
 */
interface GuideOverlayProps {
  /** 是否显示蒙层 */
  isVisible: boolean;
  /** 当前引导步骤配置 */
  currentStep: GuideStep | null;
  /** 当前步骤索引（从0开始） */
  currentStepIndex: number;
  /** 总步骤数 */
  totalSteps: number;
  /** 跳过引导回调 */
  onSkip: () => void;
  /** 完成引导回调 */
  onComplete: () => void;
  /** 点击高亮区域后的回调（用于切换步骤） */
  onHighlightClick?: () => void;
}

/**
 * 高亮区域位置信息接口
 */
interface HighlightPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

/**
 * 引导蒙层组件
 *
 * 用于新手引导功能，显示半透明蒙层覆盖整个游戏界面
 * 高亮指定的目标元素，并显示引导文字
 *
 * 特性：
 * - 使用纯 CSS 实现，不依赖 SVG
 * - 非侵入式设计，不需要修改业务代码
 * - 使用 CSS clip-path 实现镂空效果
 * - 点击高亮区域触发目标元素的点击事件
 */
const GuideOverlay: React.FC<GuideOverlayProps> = ({
  isVisible,
  currentStep,
  onSkip,
  onComplete,
  onHighlightClick
}) => {
  // 高亮区域位置状态
  const [highlightPosition, setHighlightPosition] = useState<HighlightPosition | null>(null);

  /**
   * 计算高亮区域位置
   */
  const calculateHighlightPosition = useCallback(() => {
    if (!currentStep) {
      setHighlightPosition(null);

      return;
    }

    const targetElement = document.querySelector(currentStep.targetSelector);

    if (!targetElement) {
      setHighlightPosition(null);

      return;
    }

    const rect = targetElement.getBoundingClientRect();
    const padding = 6;

    setHighlightPosition({
      top: rect.top - padding,
      left: rect.left - padding,
      width: rect.width + padding * 2,
      height: rect.height + padding * 2
    });
  }, [currentStep]);

  /**
   * 监听变化重新计算位置
   */
  useEffect(() => {
    if (!isVisible) return;

    calculateHighlightPosition();

    const handleResize = () => calculateHighlightPosition();
    window.addEventListener('resize', handleResize);

    const observer = new MutationObserver(() => calculateHighlightPosition());
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true
    });

    const timer = setInterval(calculateHighlightPosition, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      clearInterval(timer);
    };
  }, [isVisible, calculateHighlightPosition]);

  /**
   * 计算引导文字位置
   */
  const calculateTextPosition = useCallback((): { style: React.CSSProperties; position: 'top' | 'bottom' | 'left' | 'right' } => {
    if (!highlightPosition || !currentStep) {
      return { style: {}, position: 'bottom' };
    }

    const gap = 12;
    const textWidth = 200;
    const textHeight = 60;
    const { top, left, width, height } = highlightPosition;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const spaceTop = top;
    const spaceBottom = viewportHeight - (top + height);

    let finalPosition = currentStep.position;
    let style: React.CSSProperties = {};

    if (currentStep.position === 'bottom') {
      if (spaceBottom < textHeight + gap) {
        finalPosition = 'top';
        style = {
          top: top - gap,
          left: Math.min(Math.max(left + width / 2, textWidth / 2 + 10), viewportWidth - textWidth / 2 - 10),
          transform: 'translate(-50%, -100%)'
        };
      } else {
        style = {
          top: top + height + gap,
          left: Math.min(Math.max(left + width / 2, textWidth / 2 + 10), viewportWidth - textWidth / 2 - 10),
          transform: 'translateX(-50%)'
        };
      }
    } else {
      if (spaceTop < textHeight + gap) {
        finalPosition = 'bottom';
        style = {
          top: top + height + gap,
          left: Math.min(Math.max(left + width / 2, textWidth / 2 + 10), viewportWidth - textWidth / 2 - 10),
          transform: 'translateX(-50%)'
        };
      } else {
        style = {
          top: top - gap,
          left: Math.min(Math.max(left + width / 2, textWidth / 2 + 10), viewportWidth - textWidth / 2 - 10),
          transform: 'translate(-50%, -100%)'
        };
      }
    }

    return { style, position: finalPosition };
  }, [highlightPosition, currentStep]);

  /**
   * 处理高亮区域点击
   */
  const handleHighlightClick = () => {
    if (!currentStep) return;

    // noAutoDispatch 模式下仅推进到下一步，不派发点击事件
    if (!currentStep.noAutoDispatch) {
      let targetElement = document.querySelector(currentStep.targetSelector);

      if (targetElement) {
        // 如果目标元素是容器（没有直接的点击处理），查找第一个可交互的子元素
        // 适用于高亮列表容器时，自动点击容器内的第一个项目
        const interactiveSelectors = '.inventory-list-item, button, [data-interactable-id], [data-location-id], .option-button, .map-area, .selection-close';
        if (!targetElement.matches(interactiveSelectors)) {
          const clickableChild = targetElement.querySelector(interactiveSelectors);
          if (clickableChild) {
            targetElement = clickableChild;
          }
        }

        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        });
        targetElement.dispatchEvent(clickEvent);
      }
    }

    // 调用回调切换到下一步
    if (onHighlightClick) {
      onHighlightClick();
    }
  };

  /**
   * 阻止 mousedown 事件冒泡，防止触发其他组件的外部点击关闭逻辑
   * 例如 Menu 组件的 handleClickOutside 监听 document 上的 mousedown 事件
   */
  const handleHighlightMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isVisible || !currentStep || !highlightPosition) {
    return null;
  }

  const { style: textStyle, position: textPosition } = calculateTextPosition();

  // 计算 clip-path：镂空高亮区域
  const { top, left, width, height } = highlightPosition;
  const clipPath = `polygon(
    0 0,
    0 100%,
    ${left}px 100%,
    ${left}px ${top}px,
    ${left + width}px ${top}px,
    ${left + width}px ${top + height}px,
    ${left}px ${top + height}px,
    ${left}px 100%,
    100% 100%,
    100% 0
  )`;

  return (
    <div className="guide-overlay-container">
      {/* 蒙层 - 使用 clip-path 镂空，非高亮区域点击不响应 */}
      <div
        className="guide-overlay-mask"
        style={{ clipPath }}
        onMouseDown={handleHighlightMouseDown}
      />

      {/* 高亮边框 */}
      <div
        className="guide-highlight"
        style={{
          top: highlightPosition.top,
          left: highlightPosition.left,
          width: highlightPosition.width,
          height: highlightPosition.height
        }}
        onMouseDown={handleHighlightMouseDown}
        onClick={handleHighlightClick}
      />

      {/* 引导文字 */}
      <div
        className={`guide-text-container guide-text--${textPosition}`}
        style={textStyle}
      >
        <div className="guide-text">
          {currentStep.text}
        </div>
      </div>

      {/* 跳过按钮 */}
      <button className="guide-skip-btn" onClick={onSkip || onComplete}>
        跳过引导
      </button>
    </div>
  );
};

export default GuideOverlay;
