import React from 'react';

import FloatingText from './FloatingText';

/**
 * 浮动文字项接口
 */
export interface FloatingTextItem {
  /** 唯一标识ID */
  id: number;
  /** 显示的文字内容 */
  text: string;
  /** 动画持续时间，默认3000ms */
  duration?: number;
}

/**
 * 浮动文字管理器属性接口
 */
interface FloatingTextManagerProps {
  /** 浮动文字列表 */
  texts: FloatingTextItem[];
  /** 移除浮动文字的回调函数 */
  onRemove: (id: number) => void;
}

/**
 * 浮动文字管理器组件
 * 管理多个浮动文字的显示队列
 * 支持同时显示多条文字（依次显示，避免重叠）
 */
const FloatingTextManager: React.FC<FloatingTextManagerProps> = ({
  texts,
  onRemove
}) => {
  // 如果没有文字，不渲染
  if (texts.length === 0) {
    return null;
  }

  return (
    <div className="floating-text-manager">
      {texts.map((item, index) => (
        <div
          key={item.id}
          className="floating-text-wrapper"
          style={{
            // 为每条文字添加延迟，避免重叠
            animationDelay: `${index * 500}ms`
          }}
        >
          <FloatingText
            text={item.text}
            duration={item.duration || 3000}
            onComplete={() => onRemove(item.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default FloatingTextManager;
