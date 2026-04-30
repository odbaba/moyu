import { registerPlugin } from '@capacitor/core';

/**
 * TapTap 用户信息类型定义
 * 包含用户的基本信息和访问令牌
 */
export interface TapTapUserInfo {
  /** 访问令牌，用于后续 API 调用 */
  accessToken: string;
  /** 用户唯一标识 ID */
  userId: string;
  /** 用户昵称 */
  name: string;
  /** 用户头像 URL */
  avatar: string;
}

/**
 * TapTap 登录错误类型定义
 * 用于登录过程中可能出现的错误情况
 */
export interface TapTapLoginError {
  /** 错误代码 */
  code: string;
  /** 错误信息描述 */
  message: string;
}

/**
 * 登录状态检测结果
 */
export interface LoginStatusResult {
  /** 是否已登录 */
  isLoggedIn: boolean;
}

/**
 * TapTap 登录插件接口定义
 * 对应 Android 原生层 TapTapLoginPlugin 提供的方法
 */
export interface TapTapLoginPlugin {
  /**
   * 发起 TapTap 登录
   * 弹出 TapTap 登录界面，用户完成授权后返回用户信息
   * @returns Promise<TapTapUserInfo> 用户信息对象
   * @throws TapTapLoginError 当登录失败或用户取消时抛出错误
   */
  login(): Promise<TapTapUserInfo>;

  /**
   * TapTap 登出
   * 清除当前登录状态，退出登录
   * @returns Promise<void>
   */
  logout(): Promise<void>;

  /**
   * 检测当前是否已登录
   * 用于判断用户是否已经完成 TapTap 登录授权
   * @returns Promise<LoginStatusResult> 包含 isLoggedIn 字段的对象
   */
  isLoggedIn(): Promise<LoginStatusResult>;

  /**
   * 获取当前登录用户信息
   * 在已登录状态下获取用户的详细信息
   * @returns Promise<TapTapUserInfo> 当前登录用户的信息
   * @throws TapTapLoginError 当用户未登录或获取信息失败时抛出错误
   */
  getCurrentUser(): Promise<TapTapUserInfo>;
}

/**
 * TapTap 登录插件实例
 * 使用方式：
 *   import { TapTapLogin } from '../plugins/TapTapLogin';
 *
 *   // 登录
 *   const result = await TapTapLogin.login();
 *   console.log(result.userId, result.name);
 *
 *   // 检查登录状态
 *   const status = await TapTapLogin.isLoggedIn();
 *   if (status.isLoggedIn) {
 *     const user = await TapTapLogin.getCurrentUser();
 *     console.log('当前用户:', user.name);
 *   }
 */
const TapTapLogin = registerPlugin<TapTapLoginPlugin>('TapTapLogin');

export default TapTapLogin;
