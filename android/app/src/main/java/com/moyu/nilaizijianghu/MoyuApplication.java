package com.moyu.nilaizijianghu;

import android.app.Application;

import com.taptap.sdk.core.BuildConfig;
import com.taptap.sdk.core.TapTapRegion;
import com.taptap.sdk.core.TapTapSdk;
import com.taptap.sdk.core.TapTapSdkOptions;
import com.taptap.sdk.initializer.api.model.ScreenOrientation;

/**
 * 自定义 Application 类
 * 用于在应用启动时初始化 TapTap SDK 等第三方库
 *
 * 使用前需替换：
 * - YOUR_CLIENT_ID：替换为 TapTap 开发者后台获取的 Client ID
 * - YOUR_CLIENT_TOKEN：替换为 TapTap 开发者后台获取的 Client Token
 */
public class MoyuApplication extends Application {

    private static final String TAP_CLIENT_ID = "zqfyd5pvgjcchscnxu";
    private static final String TAP_CLIENT_TOKEN = "UYBlzbATXcNwHTdva8QsUlHq3HSFnumNeGQknAH8";

    @Override
    public void onCreate() {
        super.onCreate();
        initTapTapSdk();
    }

    /**
     * 初始化 TapTap SDK
     * 必须在任何 TapTap 功能（如登录）调用之前完成初始化
     */
    private void initTapTapSdk() {
        TapTapSdkOptions tapSdkOptions = new TapTapSdkOptions(
                TAP_CLIENT_ID, // 开发者中心对应的游戏 Client ID
                TAP_CLIENT_TOKEN, // 开发者中心对应 游戏 Client Token
                TapTapRegion.CN // 游戏可玩区域: [TapTapRegion.CN]=国内 [TapTapRegion.GLOBAL]=海外
        );
        // 设置屏幕方向，ScreenOrientation.LANDSCAPE 或 1 横屏， ScreenOrientation.PORTRAIT 或 0 竖屏
        tapSdkOptions.setScreenOrientation(ScreenOrientation.LANDSCAPE);
        // 是否开启 log，建议 Debug 开启，Release 关闭，默认关闭 log
        tapSdkOptions.setEnableLog(BuildConfig.DEBUG);
        TapTapSdk.init(this, tapSdkOptions);
    }
}
