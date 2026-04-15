import React from 'react';
import type { PlayerResources } from '../../types';
import { formatNumber } from '../common/utils';
import './inventory.css';

/**
 * 资源信息展示组件属性接口
 * 定义组件接收的参数类型
 */
interface ResourceDisplayProps {
  /**
   * 玩家资源数据对象
   * 包含金币和魔石数量
   */
  resources: PlayerResources;
}

/**
 * 资源信息展示组件
 * 紧凑布局显示玩家的金币和魔石资源
 * 移动端优化：图标+数值的简洁横向展示方式
 * 
 * @param props - 组件属性
 * @param props.resources - 玩家资源数据（金币和魔石）
 */
const ResourceDisplay: React.FC<ResourceDisplayProps> = ({ resources }) => {
  return (
    <div className="player-resources">
      {/* 金币资源项 - 键值对形式展示 */}
      <div className="resource-item">
        {/* 金币标签 */}
        <span className="resource-label" style={{ color: '#ffd700' }}>
          金币:
        </span>
        {/* 金币数值 */}
        <span className="resource-value" style={{ color: '#ffd700' }}>
          {formatNumber(resources.gold)}
        </span>
      </div>

      {/* 魔石资源项 - 键值对形式展示 */}
      <div className="resource-item">
        {/* 魔石标签 */}
        <span className="resource-label" style={{ color: '#4fc3f7' }}>
          魔石:
        </span>
        {/* 魔石数值 */}
        <span className="resource-value" style={{ color: '#4fc3f7' }}>
          {formatNumber(resources.magicStone)}
        </span>
      </div>
    </div>
  );
};

export default ResourceDisplay;
