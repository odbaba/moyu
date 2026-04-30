package com.moyu.nilaizijianghu;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

/**
 * 应用主 Activity
 * 注册 Capacitor 自定义插件，使其可在 JS 层调用
 */
public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(TapTapLoginPlugin.class);
        registerPlugin(TapTapLeaderboardPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
