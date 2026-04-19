/**
 * 存档系统工具函数
 * 用于保存和加载游戏状态到 localStorage
 */

// 存档数据接口
export interface SaveData {
  // 战魂系统开启状态
  warSoulSystemEnabled: boolean;
  // 无名氏击败状态
  wumingshiDefeated: boolean;
  // 可以根据需要添加更多状态字段
}

// 存档键名
const SAVE_KEY = 'moyu_save_data';

/**
 * 保存游戏状态到 localStorage
 * @param data 要保存的游戏状态数据
 * @returns 是否保存成功
 */
export const saveGame = (data: SaveData): boolean => {
  try {
    const jsonData = JSON.stringify(data);
    localStorage.setItem(SAVE_KEY, jsonData);

    return true;
  } catch (error) {
    console.error('保存游戏失败:', error);

    return false;
  }
};

/**
 * 从 localStorage 加载游戏状态
 * @returns 加载的游戏状态数据，如果加载失败则返回 null
 */
export const loadGame = (): SaveData | null => {
  try {
    const jsonData = localStorage.getItem(SAVE_KEY);
    if (!jsonData) {
      return null;
    }
    const data = JSON.parse(jsonData) as SaveData;

    return data;
  } catch (error) {
    console.error('加载游戏失败:', error);

    return null;
  }
};

/**
 * 检查是否存在存档
 * @returns 是否存在存档
 */
export const hasSaveData = (): boolean => {
  return localStorage.getItem(SAVE_KEY) !== null;
};

/**
 * 删除存档
 * @returns 是否删除成功
 */
export const deleteSave = (): boolean => {
  try {
    localStorage.removeItem(SAVE_KEY);

    return true;
  } catch (error) {
    console.error('删除存档失败:', error);

    return false;
  }
};
