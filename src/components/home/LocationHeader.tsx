import React from 'react';

/**
 * 位置头部组件属性接口
 * 定义组件接收的参数类型
 */
interface LocationHeaderProps {
  /** 当前位置名称 */
  location: string;
  /** 显示幻兽页面的回调函数 */
  onShowPet: () => void;
}

/**
 * 位置头部组件
 * 显示当前位置名称，并提供幻兽系统入口按钮
 * 移动端布局：左侧幻兽按钮 + 中间位置名称
 */
const LocationHeader: React.FC<LocationHeaderProps> = ({ location, onShowPet }) => {
  return (
    <div className="location-header">
      {/* 幻兽按钮 - 位于标题左侧 */}
      <button
        className="pet-button"
        onClick={onShowPet}
        aria-label="打开幻兽页面"
      >
        🐾 幻兽
      </button>
      {/* 当前位置名称 */}
      <h1>{location}</h1>
    </div>
  );
};

export default LocationHeader;
