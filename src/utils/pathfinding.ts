import { connections, locations } from '../data/gameData';

// 构建邻接表
function buildAdjacencyList() {
  const adjacencyList: Record<string, string[]> = {};

  // 初始化邻接表
  locations.forEach(loc => {
    adjacencyList[loc.id] = [];
  });

  // 添加连接关系
  connections.forEach(([loc1, loc2]) => {
    adjacencyList[loc1].push(loc2);
    adjacencyList[loc2].push(loc1);
  });

  return adjacencyList;
}

// 寻路算法 - 使用BFS
export function findPath(startId: string, endId: string): string[] {
  if (startId === endId) {
    return [startId];
  }

  const adjacencyList = buildAdjacencyList();
  const visited = new Set<string>();
  const queue: string[][] = [[startId]];

  visited.add(startId);

  while (queue.length > 0) {
    const path = queue.shift()!;
    const current = path[path.length - 1];

    // 检查是否到达目标
    if (current === endId) {
      return path;
    }

    // 探索相邻地点
    const neighbors = adjacencyList[current] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        const newPath = [...path, neighbor];
        queue.push(newPath);
      }
    }
  }

  // 无法到达目标
  return [];
}
