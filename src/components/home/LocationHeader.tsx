import React from 'react';

/**
 * 位置头部组件属性接口
 * 定义组件接收的参数类型
 */
interface LocationHeaderProps {
  /** 当前位置名称 */
  location: string;
  /** 显示角色信息页面的回调函数 */
  onShowCharacter: () => void;
  /** 显示幻兽页面的回调函数 */
  onShowPet: () => void;
}

/**
 * 位置头部组件
 * 显示当前位置名称，并提供角色和幻兽系统入口按钮
 * 移动端布局：左侧角色按钮 + 中间位置名称 + 右侧幻兽按钮
 */
const LocationHeader: React.FC<LocationHeaderProps> = ({ location, onShowCharacter, onShowPet }) => {
  return (
    <div className="location-header">
      {/* 角色按钮 - 位于标题左侧，使用交互按钮样式 */}
      <button
        className="interact-button"
        onClick={onShowCharacter}
        aria-label="打开角色信息页面"
      >
        角色
      </button>
      {/* 当前位置名称 */}
      <h1>{location}</h1>
      {/* 幻兽按钮 - 位于标题右侧，使用交互按钮样式 */}
      <button
        className="interact-button"
        onClick={onShowPet}
        aria-label="打开幻兽页面"
      >
        幻兽
      </button>
    </div>
  );
};

export default LocationHeader;
