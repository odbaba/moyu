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

const BASE_ANIMATION_DURATION = 250;

const LocalMap: React.FC<LocalMapProps> = ({ currentLocation, onMove, isAutoMoving }) => {
  const currentLoc = locations.find(loc => loc.id === currentLocation);
  if (!currentLoc) return null;

  const cellWidth = 85;
  const cellHeight = 30;
  const cellSpacingX = 20;
  const cellSpacingY = 10;
  const mapWidth = 3 * (cellWidth + cellSpacingX);
  const mapHeight = 3 * (cellHeight + cellSpacingY);

  // 计算地图边界
  const bounds = useMemo(() => {
    const xs = locations.map(loc => loc.x);
    const ys = locations.map(loc => loc.y);
    return { minX: Math.min(...xs), minY: Math.min(...ys) };
  }, []);

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const animationDurationRef = useRef(0);
  const prevLocRef = useRef<string | null>(null);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 计算所有相邻地点的临时显示坐标
  const displayCoords = useMemo(() => {
    const coords: { [key: string]: { x: number; y: number } } = {
      [currentLocation]: { x: currentLoc.x, y: currentLoc.y }
    };

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

  // 视图偏移动画效果
  useLayoutEffect(() => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }

    if (!currentLoc) return;

    const locX = (currentLoc.x - bounds.minX) * (cellWidth + cellSpacingX) + cellWidth / 2;
    const locY = (currentLoc.y - bounds.minY) * (cellHeight + cellSpacingY) + cellHeight / 2;
    const targetOffset = {
      x: mapWidth / 2 - locX,
      y: mapHeight / 2 - locY
    };

    if (prevLocRef.current !== null && prevLocRef.current !== currentLocation) {
      const prevLoc = locations.find(loc => loc.id === prevLocRef.current);
      const distance = prevLoc ? calculateDistance(prevLoc, currentLoc) : 1;
      const duration = BASE_ANIMATION_DURATION * distance;

      animationDurationRef.current = duration;
      setIsAnimating(true);

      animationTimeoutRef.current = setTimeout(() => {
        setIsAnimating(false);
        animationTimeoutRef.current = null;
      }, duration + 50);
    } else {
      animationDurationRef.current = 0;
    }

    setOffset(targetOffset);
    prevLocRef.current = currentLocation;

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }
    };
  }, [currentLocation, bounds, cellWidth, cellHeight, cellSpacingX, cellSpacingY, mapWidth, mapHeight, currentLoc]);

  // 计算渲染坐标
  const getRenderCoord = (coord: { x: number; y: number }) => ({
    x: (coord.x - bounds.minX) * (cellWidth + cellSpacingX),
    y: (coord.y - bounds.minY) * (cellHeight + cellSpacingY)
  });

  // 点击处理函数
  const handleLocationClick = (locId: string, isCurrent: boolean, isAdjacent: boolean) => {
    if (isAnimating || isCurrent || !isAdjacent) return;
    onMove(locId);
  };

  // 渲染连接线
  const renderConnections = () =>
    connections.map(([loc1Id, loc2Id], index) => {
      const isVisible = (id: string) =>
        id === currentLocation || currentLoc.adjacentLocations.includes(id);

      if (!isVisible(loc1Id) || !isVisible(loc2Id)) return null;

      const coord1 = displayCoords[loc1Id];
      const coord2 = displayCoords[loc2Id];
      if (!coord1 || !coord2) return null;

      const pos1 = getRenderCoord(coord1);
      const pos2 = getRenderCoord(coord2);

      return (
        <line
          key={index}
          x1={pos1.x + cellWidth / 2}
          y1={pos1.y + cellHeight / 2}
          x2={pos2.x + cellWidth / 2}
          y2={pos2.y + cellHeight / 2}
          stroke="#555"
          strokeWidth="2"
        />
      );
    });

  return (
    <div className="local-map">
      <div className="map-container">
        <svg width={mapWidth} height={mapHeight} className="local-map-svg">
          <g
            transform={`translate(${offset.x}, ${offset.y})`}
            style={{
              transition: `transform ${animationDurationRef.current}ms ease`,
              willChange: isAnimating ? 'transform' : 'auto'
            }}
          >
            {renderConnections()}

            {locations.map((loc) => {
              const isCurrent = currentLocation === loc.id;
              const isAdjacent = currentLoc.adjacentLocations.includes(loc.id);

              if (!isCurrent && !isAdjacent) return null;

              const displayCoord = displayCoords[loc.id];
              if (!displayCoord) return null;

              const { x, y } = getRenderCoord(displayCoord);
              const showHighlight = isCurrent && !isAnimating && !isAutoMoving;
              const pointerEvents = isAnimating ? 'none' : 'auto';

              return (
                <g key={loc.id}>
                  <rect
                    x={x}
                    y={y}
                    width={cellWidth}
                    height={cellHeight}
                    fill="#252935"
                    stroke={showHighlight ? '#2492D1' : '#6F7072'}
                    strokeWidth={showHighlight ? '2' : '1'}
                    rx="3"
                    ry="3"
                    className={`map-area ${showHighlight ? 'current' : ''}`}
                    style={{ pointerEvents }}
                    onClick={() => handleLocationClick(loc.id, isCurrent, isAdjacent)}
                  />
                  <text
                    x={x + cellWidth / 2}
                    y={y + cellHeight / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#FCFFFF"
                    fontSize="10"
                    fontWeight={showHighlight ? 'bold' : 'normal'}
                    className="map-area-text"
                    style={{ pointerEvents }}
                    onClick={() => handleLocationClick(loc.id, isCurrent, isAdjacent)}
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
  );
};

export default LocalMap;
