import React, { useEffect, useRef, useState } from 'react';

import { connections, locations } from '../../data/gameData';

interface WorldMapProps {
  isVisible: boolean;
  onClose: () => void;
  currentLocation: string;
  onMove: (location: string) => void;
}

const WorldMap: React.FC<WorldMapProps> = ({ isVisible, onClose, currentLocation, onMove }) => {
  // 地点按钮尺寸：宽高减小15%
  const cellWidth = 85;
  const cellHeight = 30;
  // 连接线长度：横线增加原按钮宽度的30%，竖线增加原按钮高度的30%
  const cellSpacingX = 20;
  const cellSpacingY = 10;
  // SVG 基础尺寸（用于内部坐标计算）
  const baseSvgWidth = 800;
  const baseSvgHeight = 600;

  // 计算地图边界
  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;

  locations.forEach(loc => {
    minX = Math.min(minX, loc.x);
    minY = Math.min(minY, loc.y);
    maxX = Math.max(maxX, loc.x);
    maxY = Math.max(maxY, loc.y);
  });

  // 拖拽状态
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const mapRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // 实际容器尺寸
  const [containerSize, setContainerSize] = useState({ width: baseSvgWidth, height: baseSvgHeight });

  // 监听容器尺寸变化
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    // 初始获取尺寸
    updateSize();

    // 使用 ResizeObserver 监听尺寸变化
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [isVisible]);

  // 当地图打开时，自动定位到当前位置（居中显示）
  useEffect(() => {
    if (isVisible) {
      const currentLoc = locations.find(loc => loc.id === currentLocation);
      if (currentLoc) {
        // 计算当前地点在地图坐标系中的位置
        const locX = (currentLoc.x - minX) * (cellWidth + cellSpacingX) + cellWidth / 2;
        const locY = (currentLoc.y - minY) * (cellHeight + cellSpacingY) + cellHeight / 2;

        // 使用实际容器尺寸计算偏移量，使当前地点居中
        setOffset({
          x: containerSize.width / 2 - locX,
          y: containerSize.height / 2 - locY
        });
      }
    }
  }, [isVisible, currentLocation, minX, minY, containerSize]);

  // 处理拖拽开始
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  // 处理拖拽移动
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  // 处理拖拽结束
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 触摸事件处理 - 支持手机端拖拽
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      e.preventDefault();
      setOffset({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // 绘制连接线
  const renderConnections = () => {
    return connections.map(([loc1Id, loc2Id], index) => {
      const location1 = locations.find(loc => loc.id === loc1Id);
      const location2 = locations.find(loc => loc.id === loc2Id);

      if (!location1 || !location2) return null;

      const x1 = (location1.x - minX) * (cellWidth + cellSpacingX) + cellWidth / 2;
      const y1 = (location1.y - minY) * (cellHeight + cellSpacingY) + cellHeight / 2;
      const x2 = (location2.x - minX) * (cellWidth + cellSpacingX) + cellWidth / 2;
      const y2 = (location2.y - minY) * (cellHeight + cellSpacingY) + cellHeight / 2;

      return (
        <line
          key={index}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#555"
          strokeWidth="2"
        />
      );
    });
  };

  // 如果不可见，返回null（必须在所有hooks之后）
  if (!isVisible) return null;

  return (
    <div className="map-overlay">
      <div className="map-content">
        <button className="close-map" onClick={onClose}>关闭</button>
        <div className="world-map">
          <h2>大地图</h2>
          <div className="map-container" ref={containerRef}>
            <svg
              ref={mapRef}
              width="100%"
              height="100%"
              className="world-map-svg"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <g transform={`translate(${offset.x}, ${offset.y})`}>
                {/* 绘制连接线 */}
                {renderConnections()}

                {/* 绘制所有地点 */}
                {locations.map((loc, index) => {
                  const x = (loc.x - minX) * (cellWidth + cellSpacingX);
                  const y = (loc.y - minY) * (cellHeight + cellSpacingY);
                  const isCurrent = currentLocation === loc.id;

                  return (
                    <g key={index}>
                      <rect
                        x={x}
                        y={y}
                        width={cellWidth}
                        height={cellHeight}
                        fill="#252935"
                        stroke={isCurrent ? '#2492D1' : '#6F7072'}
                        strokeWidth={isCurrent ? '2' : '1'}
                        rx="3"
                        ry="3"
                        className={`map-area ${isCurrent ? 'current' : ''}`}
                        onClick={() => {
                          onMove(loc.id);
                          onClose();
                        }}
                      />
                      <text
                        x={x + cellWidth / 2}
                        y={y + cellHeight / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#FFFFFF"
                        fontSize="10"
                        fontWeight={isCurrent ? 'bold' : 'normal'}
                        className="map-area-text"
                        onClick={() => {
                          onMove(loc.id);
                          onClose();
                        }}
                      >
                        {loc.name}
                      </text>
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
