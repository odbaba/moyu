import { Capacitor } from '@capacitor/core';
import { useCallback, useEffect, useState } from 'react';

import type { TapTapUserInfo } from '../plugins/TapTapLogin';
import TapTapLogin from '../plugins/TapTapLogin';

/** localStorage 存储键名 */
const STORAGE_KEY = 'taptap_login_state';

/**
 * TapTap 登录状态持久化数据接口
 * 用于存储到 localStorage 的数据结构
 */
interface TapTapLoginState {
  /** 是否已登录 */
  isLoggedIn: boolean;
  /** 用户信息 */
  userInfo: TapTapUserInfo | null;
}

/**
 * useTapTapLogin Hook 返回值接口定义
 */
export interface UseTapTapLoginReturn {
  /** 是否已登录 */
  isLoggedIn: boolean;
  /** 用户信息 */
  userInfo: TapTapUserInfo | null;
  /** 是否正在加载中 */
  isLoading: boolean;
  /** 错误信息 */
  error: string | null;
  /** 发起登录，返回是否成功 */
  login: () => Promise<boolean>;
  /** 登出 */
  logout: () => Promise<void>;
  /** 检测登录状态（初始化时调用） */
  checkLoginStatus: () => Promise<void>;
}

/**
 * 从 localStorage 加载登录状态
 *
 * @returns 存储的登录状态，如果不存在则返回默认值
 */
function loadLoginState(): TapTapLoginState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      return JSON.parse(stored) as TapTapLoginState;
    }
  } catch (error) {
    console.error('加载 TapTap 登录状态失败:', error);
  }

  return {
    isLoggedIn: false,
    userInfo: null,
  };
}

/**
 * 保存登录状态到 localStorage
 *
 * @param state 要保存的登录状态
 */
function saveLoginState(state: TapTapLoginState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('保存 TapTap 登录状态失败:', error);
  }
}

/**
 * 清除 localStorage 中的登录状态
 */
function clearLoginState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('清除 TapTap 登录状态失败:', error);
  }
}

/**
 * TapTap 登录状态管理 Hook
 *
 * 管理 TapTap 登录状态，包含登录、登出、状态检测等功能
 * 支持 Capacitor 原生环境和 Web 环境的差异处理
 * 使用 localStorage 持久化登录状态，页面刷新后能恢复
 *
 * @returns 登录状态和控制方法
 *
 * @example
 * ```tsx
 * const {
 *   isLoggedIn,
 *   userInfo,
 *   isLoading,
 *   error,
 *   login,
 *   logout,
 *   checkLoginStatus
 * } = useTapTapLogin();
 *
 * // 发起登录
 * const success = await login();
 * if (success) {
 *   console.log('登录成功:', userInfo?.name);
 * }
 *
 * // 登出
 * await logout();
 * ```
 */
export function useTapTapLogin(): UseTapTapLoginReturn {
  // 是否已登录
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  // 用户信息
  const [userInfo, setUserInfo] = useState<TapTapUserInfo | null>(null);
  // 是否正在加载中
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // 错误信息
  const [error, setError] = useState<string | null>(null);

  // 检测是否在原生环境
  const isNative = Capacitor.isNativePlatform();

  /**
   * 发起登录
   * 在原生环境下调用 TapTap SDK 登录
   * 在 Web 环境下使用 localStorage 模拟登录状态
   *
   * @returns 是否登录成功
   */
  const login = useCallback(async (): Promise<boolean> => {
    // 重置错误状态
    setError(null);
    setIsLoading(true);

    try {
      if (isNative) {
        // 原生环境：调用 TapTap SDK 登录
        const result = await TapTapLogin.login();

        // 更新状态
        setIsLoggedIn(true);
        setUserInfo(result);

        // 持久化到 localStorage
        saveLoginState({
          isLoggedIn: true,
          userInfo: result,
        });

        return true;
      } else {
        // Web 环境：模拟登录（开发测试用）
        const mockUserInfo: TapTapUserInfo = {
          accessToken: `mock_access_token_${ Date.now()}`,
          userId: `mock_user_id_${ Date.now()}`,
          name: '测试用户',
          avatar: '',
        };

        // 更新状态
        setIsLoggedIn(true);
        setUserInfo(mockUserInfo);

        // 持久化到 localStorage
        saveLoginState({
          isLoggedIn: true,
          userInfo: mockUserInfo,
        });

        return true;
      }
    } catch (err) {
      // 捕获登录错误
      const errorMessage = err instanceof Error ? err.message : '登录失败，请重试';
      console.error('TapTap 登录失败:', err);
      setError(errorMessage);

      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isNative]);

  /**
   * 登出
   * 在原生环境下调用 TapTap SDK 登出
   * 在 Web 环境下清除 localStorage 中的登录状态
   */
  const logout = useCallback(async (): Promise<void> => {
    setError(null);
    setIsLoading(true);

    try {
      if (isNative) {
        // 原生环境：调用 TapTap SDK 登出
        await TapTapLogin.logout();
      }

      // 清除状态
      setIsLoggedIn(false);
      setUserInfo(null);

      // 清除 localStorage
      clearLoginState();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '登出失败，请重试';
      console.error('TapTap 登出失败:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isNative]);

  /**
   * 检测登录状态
   * 初始化时调用，用于恢复登录状态
   * 在原生环境下检查 SDK 登录状态
   * 在 Web 环境下从 localStorage 恢复状态
   */
  const checkLoginStatus = useCallback(async (): Promise<void> => {
    setError(null);
    setIsLoading(true);

    try {
      if (isNative) {
        // 原生环境：检查 SDK 登录状态
        const status = await TapTapLogin.isLoggedIn();

        if (status.isLoggedIn) {
          // 已登录，获取用户信息
          const user = await TapTapLogin.getCurrentUser();

          setIsLoggedIn(true);
          setUserInfo(user);

          // 持久化到 localStorage
          saveLoginState({
            isLoggedIn: true,
            userInfo: user,
          });
        } else {
          // 未登录，尝试从 localStorage 恢复
          const storedState = loadLoginState();

          if (storedState.isLoggedIn && storedState.userInfo) {
            // localStorage 有数据但 SDK 未登录，清除本地数据
            clearLoginState();
          }

          setIsLoggedIn(false);
          setUserInfo(null);
        }
      } else {
        // Web 环境：从 localStorage 恢复状态
        const storedState = loadLoginState();

        setIsLoggedIn(storedState.isLoggedIn);
        setUserInfo(storedState.userInfo);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '检测登录状态失败';
      console.error('检测 TapTap 登录状态失败:', err);
      setError(errorMessage);

      // 出错时清除状态
      setIsLoggedIn(false);
      setUserInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, [isNative]);

  // 初始化时检测登录状态
  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  return {
    isLoggedIn,
    userInfo,
    isLoading,
    error,
    login,
    logout,
    checkLoginStatus,
  };
}
