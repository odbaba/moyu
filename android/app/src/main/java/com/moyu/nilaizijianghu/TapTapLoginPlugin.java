package com.moyu.nilaizijianghu;

import android.app.Activity;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;

// TapTap SDK 导入
import com.taptap.sdk.login.TapTapLogin;
import com.taptap.sdk.login.TapTapAccount;
import com.taptap.sdk.login.Scopes;
import com.taptap.sdk.kit.internal.callback.TapTapCallback;
import com.taptap.sdk.kit.internal.exception.TapTapException;

/**
 * Capacitor 自定义插件 - TapTap 登录桥接
 * 将 TapTap SDK 的登录能力暴露给 JavaScript 层调用
 *
 * 前端使用方式：
 * import { TapTapLogin } from 'src/plugins/TapTapLogin';
 * const result = await TapTapLogin.login();
 * console.log(result.accessToken, result.userId);
 */
@CapacitorPlugin(
    name = "TapTapLogin",
    permissions = {}
)
public class TapTapLoginPlugin extends Plugin {

    /**
     * TapTap 登录方法
     * 前端通过 Capacitor.registerPlugin('TapTapLogin').login() 调用
     *
     * 返回值：
     * - accessToken: TapTap 访问令牌
     * - userId: TapTap 用户 ID (使用 unionId)
     * - name: TapTap 用户昵称
     * - avatar: TapTap 用户头像 URL
     */
    @PluginMethod
    public void login(PluginCall call) {
        // 获取当前 Activity，用于 SDK 登录调用
        Activity activity = getActivity();
        if (activity == null) {
            call.reject("Activity is null");
            return;
        }

        // 设置授权范围：公开资料权限
        String[] scopes = new String[]{Scopes.SCOPE_PUBLIC_PROFILE};

        // 调用 TapTap SDK 登录 API
        TapTapLogin.loginWithScopes(activity, scopes, new TapTapCallback<TapTapAccount>() {
            @Override
            public void onSuccess(TapTapAccount account) {
                // 登录成功，构建返回数据
                JSObject ret = new JSObject();
                ret.put("accessToken", account.getAccessToken());
                ret.put("userId", account.getUnionId());
                ret.put("name", account.getName());
                ret.put("avatar", account.getAvatar());
                call.resolve(ret);
            }

            @Override
            public void onFail(TapTapException exception) {
                // 登录失败，返回错误信息
                call.reject("Login failed: " + exception.getMessage());
            }

            @Override
            public void onCancel() {
                // 用户取消登录
                call.reject("Login cancelled");
            }
        });
    }

    /**
     * TapTap 登出方法
     * 前端通过 Capacitor.registerPlugin('TapTapLogin').logout() 调用
     *
     * 清除当前登录状态，退出 TapTap 账号
     */
    @PluginMethod
    public void logout(PluginCall call) {
        // 调用 TapTap SDK 登出 API
        TapTapLogin.logout();

        // 返回成功结果
        JSObject ret = new JSObject();
        ret.put("success", true);
        call.resolve(ret);
    }

    /**
     * 检测当前是否已登录
     * 前端通过 Capacitor.registerPlugin('TapTapLogin').isLoggedIn() 调用
     *
     * 返回值：
     * - isLoggedIn: 布尔值，表示是否已登录
     */
    @PluginMethod
    public void isLoggedIn(PluginCall call) {
        // 调用 TapTap SDK 获取当前账号，如果不为 null 则表示已登录
        TapTapAccount account = TapTapLogin.getCurrentTapAccount();
        boolean loggedIn = (account != null);

        // 构建返回数据
        JSObject ret = new JSObject();
        ret.put("isLoggedIn", loggedIn);
        call.resolve(ret);
    }

    /**
     * 获取当前登录用户信息
     * 前端通过 Capacitor.registerPlugin('TapTapLogin').getCurrentUser() 调用
     *
     * 返回值：
     * - accessToken: TapTap 访问令牌
     * - userId: TapTap 用户 ID (使用 unionId)
     * - name: TapTap 用户昵称
     * - avatar: TapTap 用户头像 URL
     *
     * 如果未登录，则返回错误
     */
    @PluginMethod
    public void getCurrentUser(PluginCall call) {
        // 获取当前登录的账号信息
        TapTapAccount account = TapTapLogin.getCurrentTapAccount();

        if (account == null) {
            // 未登录，返回错误
            call.reject("No user logged in");
            return;
        }

        // 构建返回数据
        JSObject ret = new JSObject();
        ret.put("accessToken", account.getAccessToken());
        ret.put("userId", account.getUnionId());
        ret.put("name", account.getName());
        ret.put("avatar", account.getAvatar());
        call.resolve(ret);
    }
}
