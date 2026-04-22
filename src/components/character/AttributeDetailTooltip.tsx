import React from 'react';

/**
 * 属性详情数据接口
 * 定义单个属性的详细来源信息
 */
export interface AttributeDetailData {
  /** 属性名称 */
  name: string;
  /** 基础属性值 */
  base: number;
  /** 装备加成值 */
  equipment: number;
  /** 幻兽加成值 */
  pet: number;
  /** 天魂百分比加成（仅攻击力有） */
  soulPercent?: number;
  /** 总属性值 */
  total: number;
  /** 属性单位（如 '%'） */
  unit?: string;
  /** 是否为范围值（如攻击力最小-最大） */
  isRange?: boolean;
  /** 范围值时的最大值 */
  max?: number;
  /** 范围值时基础最大值 */
  baseMax?: number;
  /** 范围值时装备最大值 */
  equipmentMax?: number;
  /** 范围值时幻兽最大值 */
  petMax?: number;
}

/**
 * 属性详情悬浮框组件属性接口
 */
interface AttributeDetailTooltipProps {
  /** 是否显示悬浮框 */
  isVisible: boolean;
  /** 属性详情数据 */
  data: AttributeDetailData | null;
  /** 悬浮框位置X坐标 */
  positionX: number;
  /** 悬浮框位置Y坐标 */
  positionY: number;
}

/**
 * 属性详情悬浮框组件
 * 显示属性的详细来源：基础属性、装备加成、幻兽加成
 */
const AttributeDetailTooltip: React.FC<AttributeDetailTooltipProps> = ({
  isVisible,
  data,
  positionX,
  positionY
}) => {
  if (!isVisible || !data) return null;

  /**
   * 计算悬浮框位置，确保不超出屏幕
   */
  const tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    left: Math.min(positionX, window.innerWidth - 220),
    top: Math.min(positionY + 10, window.innerHeight - 200),
    zIndex: 3000,
    transform: 'translateY(0)'
  };

  /**
   * 格式化数值显示
   */
  const formatValue = (value: number, unit?: string) => {
    return unit ? `${value}${unit}` : value.toString();
  };

  /**
   * 格式化范围值显示
   */
  const formatRangeValue = (min: number, max: number, unit?: string) => {
    return unit ? `${min}-${max}${unit}` : `${min}-${max}`;
  };

  return (
    <div className="attribute-tooltip" style={tooltipStyle}>
      {/* 标题 */}
      <div className="attribute-tooltip-title">{data.name}</div>

      {/* 总属性 */}
      <div className="attribute-tooltip-total">
        <span className="attribute-tooltip-label">总计</span>
        <span className="attribute-tooltip-value">
          {data.isRange
            ? formatRangeValue(data.total, data.max || data.total, data.unit)
            : formatValue(data.total, data.unit)}
        </span>
      </div>

      {/* 分隔线 */}
      <div className="attribute-tooltip-divider" />

      {/* 基础属性 */}
      <div className="attribute-tooltip-row">
        <span className="attribute-tooltip-label">基础属性</span>
        <span className="attribute-tooltip-value base">
          {data.isRange
            ? formatRangeValue(data.base, data.baseMax || data.base, data.unit)
            : formatValue(data.base, data.unit)}
        </span>
      </div>

      {/* 装备加成 */}
      {data.equipment > 0 && (
        <div className="attribute-tooltip-row">
          <span className="attribute-tooltip-label">装备加成</span>
          <span className="attribute-tooltip-value equipment">
            +{data.isRange
              ? formatRangeValue(data.equipment, data.equipmentMax || data.equipment, data.unit)
              : formatValue(data.equipment, data.unit)}
          </span>
        </div>
      )}

      {/* 幻兽加成 */}
      {data.pet > 0 && (
        <div className="attribute-tooltip-row">
          <span className="attribute-tooltip-label">幻兽加成</span>
          <span className="attribute-tooltip-value pet">
            +{data.isRange
              ? formatRangeValue(data.pet, data.petMax || data.pet, data.unit)
              : formatValue(data.pet, data.unit)}
          </span>
        </div>
      )}

      {/* 天魂百分比加成（仅攻击力显示） */}
      {data.soulPercent !== undefined && data.soulPercent > 0 && (
        <div className="attribute-tooltip-row">
          <span className="attribute-tooltip-label">天魂加成</span>
          <span className="attribute-tooltip-value soul">
            +{Math.round(data.soulPercent * 100)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default AttributeDetailTooltip;
