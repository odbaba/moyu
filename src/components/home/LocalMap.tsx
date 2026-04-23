import React, { useEffect, useMemo, useRef, useState } from 'react';

import { connections, locations } from '../../data/gameData';

interface LocalMapProps {
  currentLocation: string;
  onMove: (location: string) => void;
  isAutoMoving?: boolean;
}

// 计算相邻地点的临时显示坐标
// 当相邻地点的实际坐标距离当前位置超过1个单位时，将其调整到地图边界处显示
const calculateDisplayCoord = (
  currentCoord: number,
  adjacentCoord: number
): number => {
  const diff = adjacentCoord - currentCoord;
  // 如果距离超过1个单位，限制在±1范围内
  if (diff > 1) return currentCoord + 1;
  if (diff < -1) return currentCoord - 1;

  return adjacentCoord;
};

// 计算两个地点之间的曼哈顿距离
const calculateDistance = (
  loc1: { x: number; y: number },
  loc2: { x: number; y: number }
): number => {
  return Math.abs(loc1.x - loc2.x) + Math.abs(loc1.y - loc2.y);
};

// 基础动画时间（毫秒）
const BASE_ANIMATION_DURATION = 200;

const LocalMap: React.FC<LocalMapProps> = ({ currentLocation, onMove, isAutoMoving }) => {
  const currentLoc = locations.find(loc => loc.id === currentLocation);
  if (!currentLoc) return null;

  // 地点按钮尺寸：宽高减小15%
  const cellWidth = 85;
  const cellHeight = 30;
  // 连接线长度：横线增加原按钮宽度的30%，竖线增加原按钮高度的30%
  // 原spacing=5，横向增加30，纵向增加10.5，同时保持地图整体大小不变
  const cellSpacingX = 20;
  const cellSpacingY = 10;
  const mapWidth = 3 * (cellWidth + cellSpacingX);
  const mapHeight = 3 * (cellHeight + cellSpacingY);

  let minX = Infinity, minY = Infinity;
  let maxX = -Infinity, maxY = -Infinity;

  locations.forEach(loc => {
    minX = Math.min(minX, loc.x);
    minY = Math.min(minY, loc.y);
    maxX = Math.max(maxX, loc.x);
    maxY = Math.max(maxY, loc.y);
  });

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  // 使用ref存储动画时间，避免状态更新延迟问题
  const animationDurationRef = useRef(BASE_ANIMATION_DURATION);
  const prevLocRef = useRef<string | null>(null);

  // 计算所有相邻地点的临时显示坐标
  // 使用useMemo缓存计算结果，仅在位置变化时重新计算
  const displayCoords = useMemo(() => {
    const coords: { [key: string]: { x: number; y: number } } = {};

    // 当前位置使用实际坐标
    coords[currentLocation] = { x: currentLoc.x, y: currentLoc.y };

    // 相邻地点使用临时调整后的坐标
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
  // 关键修复：offset基于实际坐标计算，确保位置变化时产生平移动画
  // 动画时间根据实际移动距离动态调整：距离为2时动画时间为2倍，距离为3时为3倍
  useEffect(() => {
    if (currentLoc) {
      // 使用实际坐标计算offset，确保位置变化时offset变化，产生平移动画
      const locX = (currentLoc.x - minX) * (cellWidth + cellSpacingX) + cellWidth / 2;
      const locY = (currentLoc.y - minY) * (cellHeight + cellSpacingY) + cellHeight / 2;

      const targetOffset = {
        x: mapWidth / 2 - locX,
        y: mapHeight / 2 - locY
      };

      if (prevLocRef.current !== null && prevLocRef.current !== currentLocation) {
        // 获取上一个位置的实际坐标
        const prevLoc = locations.find(loc => loc.id === prevLocRef.current);
        let duration = BASE_ANIMATION_DURATION;

        if (prevLoc) {
          // 计算实际移动距离
          const distance = calculateDistance(
            { x: prevLoc.x, y: prevLoc.y },
            { x: currentLoc.x, y: currentLoc.y }
          );
          // 根据距离设置动画时间：距离为1时400ms，距离为2时800ms，距离为3时1200ms
          duration = BASE_ANIMATION_DURATION * distance;
        }

        // 使用ref存储动画时间，确保CSS transition使用正确的值
        animationDurationRef.current = duration;
        setIsAnimating(true);
        // 动画结束后重置状态
        setTimeout(() => setIsAnimating(false), duration);
      }

      setOffset(targetOffset);
      prevLocRef.current = currentLocation;
    }
  }, [currentLocation, minX, minY, cellWidth, cellHeight, cellSpacingX, cellSpacingY, mapWidth, mapHeight]);

  const renderConnections = () => {
    return connections.map(([loc1Id, loc2Id], index) => {
      const isLoc1Visible = loc1Id === currentLocation || currentLoc.adjacentLocations.includes(loc1Id);
      const isLoc2Visible = loc2Id === currentLocation || currentLoc.adjacentLocations.includes(loc2Id);

      if (!isLoc1Visible || !isLoc2Visible) return null;

      // 使用临时显示坐标绘制连接线
      const coord1 = displayCoords[loc1Id];
      const coord2 = displayCoords[loc2Id];

      if (!coord1 || !coord2) return null;

      // 关键修复：连接线使用全局坐标系计算位置（与地点渲染一致）
      const x1 = (coord1.x - minX) * (cellWidth + cellSpacingX) + cellWidth / 2;
      const y1 = (coord1.y - minY) * (cellHeight + cellSpacingY) + cellHeight / 2;
      const x2 = (coord2.x - minX) * (cellWidth + cellSpacingX) + cellWidth / 2;
      const y2 = (coord2.y - minY) * (cellHeight + cellSpacingY) + cellHeight / 2;

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

  return (
    <div className="local-map">
      <div className="map-container">
        <svg width={mapWidth} height={mapHeight} className="local-map-svg">
          <g
            transform={`translate(${offset.x}, ${offset.y})`}
            style={{
              // CSS transition实现平滑动画，动画时间根据移动距离动态调整
              // 使用ref值确保动画时间正确
              transition: isAnimating ? `transform ${animationDurationRef.current}ms ease` : 'none'
            }}
          >
            {renderConnections()}

            {locations.map((loc, index) => {
              const isCurrent = currentLocation === loc.id;
              const isAdjacent = currentLoc.adjacentLocations.includes(loc.id);
              const showHighlight = isCurrent && !isAnimating && !isAutoMoving;

              // 只显示当前地点和一步可以到达的相邻地点
              if (!isCurrent && !isAdjacent) return null;

              // 获取临时显示坐标
              const displayCoord = displayCoords[loc.id];
              if (!displayCoord) return null;

              // 关键修复：使用全局坐标系计算渲染位置（与offset计算一致）
              // 这样当位置变化时，offset会变化，产生平移动画效果
              const x = (displayCoord.x - minX) * (cellWidth + cellSpacingX);
              const y = (displayCoord.y - minY) * (cellHeight + cellSpacingY);

              return (
                <g key={index}>
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
                    style={{ pointerEvents: isAnimating ? 'none' : 'auto' }}
                    onClick={() => {
                      // 动画期间禁止交互，防止重复移动操作
                      if (isAnimating) return;
                      if (!isCurrent && isAdjacent) {
                        onMove(loc.id);
                      }
                    }}
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
                    style={{ pointerEvents: isAnimating ? 'none' : 'auto' }}
                    onClick={() => {
                      // 动画期间禁止交互，防止重复移动操作
                      if (isAnimating) return;
                      if (!isCurrent && isAdjacent) {
                        onMove(loc.id);
                      }
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
  );
};

export default LocalMap;
