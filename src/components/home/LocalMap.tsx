import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';

import { connections, locations } from '../../data/gameData';

interface LocalMapProps {
  currentLocation: string;
  onMove: (location: string) => void;
  isAutoMoving?: boolean;
}

// 计算相邻地点的临时显示坐标（距离超过1个单位时限制在±1范围内）
const calculateDisplayCoord = (currentCoord: number, adjacentCoord: number): number => {
  const diff = adjacentCoord - currentCoord;
  if (diff > 1) return currentCoord + 1;
  if (diff < -1) return currentCoord - 1;

  return adjacentCoord;
};

// 计算两个地点之间的曼哈顿距离
const calculateDistance = (
  loc1: { x: number; y: number },
  loc2: { x: number; y: number }
): number => Math.abs(loc1.x - loc2.x) + Math.abs(loc1.y - loc2.y);

// 计算两点之间的欧几里得距离（用于连接线长度）
const calculateEuclideanDistance = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

// 计算两点之间的角度（度数）
const calculateAngle = (x1: number, y1: number, x2: number, y2: number): number => {
  const radians = Math.atan2(y2 - y1, x2 - x1);

  return radians * (180 / Math.PI);
};

const BASE_ANIMATION_DURATION = 100;

const LocalMap: React.FC<LocalMapProps> = ({ currentLocation, onMove, isAutoMoving }) => {
  // 获取当前地点信息
  const currentLoc = locations.find(loc => loc.id === currentLocation);
  if (!currentLoc) return null;

  // 地图尺寸配置
  const cellWidth = 95; // 地点节点宽度
  const cellHeight = 38; // 地点节点高度（调小15%）
  const cellSpacingX = 25; // 水平间距（从40减小到25，使布局更紧凑，避免边缘遮挡）
  const cellSpacingY = 20; // 垂直间距（从30减小到20，使布局更紧凑，避免边缘遮挡）
  const mapWidth = 3 * (cellWidth + cellSpacingX); // 地图容器宽度
  const mapHeight = 3 * (cellHeight + cellSpacingY); // 地图容器高度

  // 计算地图边界（用于坐标转换）
  const bounds = useMemo(() => {
    const xs = locations.map(loc => loc.x);
    const ys = locations.map(loc => loc.y);

    return { minX: Math.min(...xs), minY: Math.min(...ys) };
  }, []);

  // 视图偏移状态（用于居中当前位置）
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  // 动画状态
  const [isAnimating, setIsAnimating] = useState(false);
  // 动画时长引用
  const animationDurationRef = useRef(0);
  // 上一个地点引用（用于判断是否需要动画）
  const prevLocRef = useRef<string | null>(null);
  // 动画结束定时器引用
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 计算所有相邻地点的临时显示坐标
  const displayCoords = useMemo(() => {
    const coords: { [key: string]: { x: number; y: number } } = {
      [currentLocation]: { x: currentLoc.x, y: currentLoc.y }
    };

    // 为每个相邻地点计算显示坐标
    currentLoc.adjacentLocations.forEach(adjId => {
      const adjLoc = locations.find(loc => loc.id === adjId);
      if (adjLoc) {
        coords[adjId] = {
          x: calculateDisplayCoord(currentLoc.x, adjLoc.x),
          y: calculateDisplayCoord(currentLoc.y, adjLoc.y)
        };
      }
    });

    return coords;
  }, [currentLocation, currentLoc]);

  // 视图偏移动画效果：当地点改变时，平滑移动到新位置
  useLayoutEffect(() => {
    // 清除之前的定时器
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }

    if (!currentLoc) return;

    // 计算当前位置在地图中的像素坐标
    const locX = (currentLoc.x - bounds.minX) * (cellWidth + cellSpacingX) + cellWidth / 2;
    const locY = (currentLoc.y - bounds.minY) * (cellHeight + cellSpacingY) + cellHeight / 2;

    // 计算目标偏移量，使当前位置居中
    const targetOffset = {
      x: mapWidth / 2 - locX,
      y: mapHeight / 2 - locY
    };

    // 如果是地点切换（非首次加载），执行动画
    if (prevLocRef.current !== null && prevLocRef.current !== currentLocation) {
      const prevLoc = locations.find(loc => loc.id === prevLocRef.current);
      const distance = prevLoc ? calculateDistance(prevLoc, currentLoc) : 1;
      const duration = BASE_ANIMATION_DURATION * distance; // 根据距离计算动画时长

      animationDurationRef.current = duration;
      setIsAnimating(true);

      // 动画结束后恢复交互
      animationTimeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
        animationTimeoutRef.current = null;
      }, duration + 50);
    } else {
      // 首次加载，无动画
      animationDurationRef.current = 0;
    }

    setOffset(targetOffset);
    prevLocRef.current = currentLocation;

    // 清理函数：取消定时器
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }
    };
  }, [currentLocation, bounds, cellWidth, cellHeight, cellSpacingX, cellSpacingY, mapWidth, mapHeight, currentLoc]);

  // 计算渲染坐标：将逻辑坐标转换为像素坐标
  const getRenderCoord = (coord: { x: number; y: number }) => ({
    x: (coord.x - bounds.minX) * (cellWidth + cellSpacingX),
    y: (coord.y - bounds.minY) * (cellHeight + cellSpacingY)
  });

  // 点击处理函数：处理地点点击事件
  const handleLocationClick = (locId: string, isCurrent: boolean, isAdjacent: boolean) => {
    // 动画期间禁止交互，当前位置不可点击，非相邻地点不可点击
    if (isAnimating || isCurrent || !isAdjacent) return;
    onMove(locId);
  };

  // 渲染连接线：使用 HTML div 实现线条
  const renderConnections = () =>
    connections.map(([loc1Id, loc2Id], index) => {
      // 判断连接线是否可见（两个地点都在可见范围内）
      const isVisible = (id: string) =>
        id === currentLocation || currentLoc.adjacentLocations.includes(id);

      if (!isVisible(loc1Id) || !isVisible(loc2Id)) return null;

      const coord1 = displayCoords[loc1Id];
      const coord2 = displayCoords[loc2Id];
      if (!coord1 || !coord2) return null;

      // 计算两个地点的中心点位置
      const pos1 = getRenderCoord(coord1);
      const pos2 = getRenderCoord(coord2);
      const x1 = pos1.x + cellWidth / 2;
      const y1 = pos1.y + cellHeight / 2;
      const x2 = pos2.x + cellWidth / 2;
      const y2 = pos2.y + cellHeight / 2;

      // 计算连接线的长度和角度
      const length = calculateEuclideanDistance(x1, y1, x2, y2);
      const angle = calculateAngle(x1, y1, x2, y2);

      return (
        <div
          key={`connection-${index}`}
          style={{
            position: 'absolute',
            left: x1,
            top: y1,
            width: length,
            height: 2,
            backgroundColor: '#717372',
            transformOrigin: '0 50%',
            transform: `rotate(${angle}deg)`,
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
      );
    });

  return (
    <div className="local-map">
      <div className="map-container">
        {/* 地图容器：使用 div 替代 SVG */}
        <div
          className="local-map-html"
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            backgroundColor: '#252935',
            borderRadius: '8px',
            overflow: 'hidden',
            contain: 'layout style'
          }}
        >
          {/* 地图内容层：应用偏移动画 */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: mapWidth,
              height: mapHeight,
              marginLeft: `-${mapWidth / 2}px`,
              marginTop: `-${mapHeight / 2}px`,
              transform: `translate(${offset.x}px, ${offset.y}px)`,
              transition: `transform ${animationDurationRef.current}ms ease`,
              willChange: isAnimating ? 'transform' : 'auto'
            }}
          >
            {/* 渲染连接线 */}
            {renderConnections()}

            {/* 渲染地点节点 */}
            {locations.map((loc) => {
              const isCurrent = currentLocation === loc.id;
              const isAdjacent = currentLoc.adjacentLocations.includes(loc.id);

              // 只显示当前位置和相邻地点
              if (!isCurrent && !isAdjacent) return null;

              const displayCoord = displayCoords[loc.id];
              if (!displayCoord) return null;

              const { x, y } = getRenderCoord(displayCoord);
              const showHighlight = isCurrent && !isAnimating && !isAutoMoving;
              const pointerEvents = isAnimating ? 'none' : 'auto';

              return (
                <div
                  key={loc.id}
                  style={{
                    position: 'absolute',
                    left: x,
                    top: y,
                    width: cellWidth,
                    height: cellHeight,
                    backgroundColor: '#252935',
                    border: showHighlight ? '3px solid #2492D1' : '2px solid #717372',
                    borderRadius: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: isAdjacent && !isCurrent ? 'pointer' : 'default',
                    pointerEvents,
                    zIndex: 1,
                    boxShadow: showHighlight ? '0 0 15px rgba(36, 146, 209, 0.5)' : 'none',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
                  }}
                  className={`map-area ${showHighlight ? 'current' : ''}`}
                  onClick={() => handleLocationClick(loc.id, isCurrent, isAdjacent)}
                >
                  <span
                    style={{
                      color: '#FCFFFF',
                      fontSize: '14px',
                      fontWeight: showHighlight ? 'bold' : 'normal',
                      userSelect: 'none',
                      cursor: isAdjacent && !isCurrent ? 'pointer' : 'default'
                    }}
                  >
                    {loc.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalMap;
