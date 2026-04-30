package com.moyu.nilaizijianghu;

import android.app.Activity;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;

import org.json.JSONObject;

// TapTap SDK 导入
import com.taptap.sdk.leaderboard.androidx.TapTapLeaderboard;
import com.taptap.sdk.leaderboard.callback.TapTapLeaderboardResponseCallback;
import com.taptap.sdk.leaderboard.data.request.SubmitScoresRequest;
import com.taptap.sdk.leaderboard.data.response.SubmitScoresResponse;
import com.taptap.sdk.kit.internal.callback.TapTapCallback;
import com.taptap.sdk.kit.internal.exception.TapTapException;

import java.util.ArrayList;
import java.util.List;

/**
 * Capacitor 自定义插件 - TapTap 排行榜桥接
 * 将 TapTap SDK 的排行榜能力暴露给 JavaScript 层调用
 *
 * 前端使用方式：
 * import { TapTapLeaderboard } from 'src/plugins/TapTapLeaderboard';
 * await TapTapLeaderboard.submitScore({ leaderboardId: 'xxx', score: 100 });
 * await TapTapLeaderboard.submitScores({ scores: [{ leaderboardId: 'xxx', score: 100 }, { leaderboardId: 'yyy', score: 200 }] });
 * await TapTapLeaderboard.showLeaderboard({ leaderboardId: 'xxx' });
 */
@CapacitorPlugin(
    name = "TapTapLeaderboard",
    permissions = {}
)
public class TapTapLeaderboardPlugin extends Plugin {

    /**
     * 提交分数到排行榜（单个）
     * 前端通过 Capacitor.registerPlugin('TapTapLeaderboard').submitScore() 调用
     *
     * 前端调用参数：
     * - leaderboardId: 排行榜 ID
     * - score: 分数
     *
     * 返回值：
     * - success: 布尔值，表示是否提交成功
     */
    @PluginMethod
    public void submitScore(PluginCall call) {
        // 获取必填参数：排行榜 ID
        String leaderboardId = call.getString("leaderboardId");
        if (leaderboardId == null || leaderboardId.isEmpty()) {
            call.reject("leaderboardId is required");
            return;
        }

        // 获取分数参数，默认为 0
        int score = call.getInt("score", 0);

        // 构建分数提交请求
        List<SubmitScoresRequest.ScoreItem> scoreItems = new ArrayList<>();
        scoreItems.add(new SubmitScoresRequest.ScoreItem(leaderboardId, score));

        // 调用 TapTap SDK 提交分数
        TapTapLeaderboard.submitScores(scoreItems, new TapTapLeaderboardResponseCallback<SubmitScoresResponse>() {
            @Override
            public void onSuccess(SubmitScoresResponse result) {
                // 提交成功，构建返回数据
                JSObject ret = new JSObject();
                ret.put("success", true);
                call.resolve(ret);
            }

            @Override
            public void onFailure(int code, String message) {
                // 提交失败，返回错误信息
                call.reject("Submit score failed: " + message);
            }
        });
    }

    /**
     * 批量提交分数到多个排行榜
     * 前端通过 Capacitor.registerPlugin('TapTapLeaderboard').submitScores() 调用
     *
     * 前端调用参数：
     * - scores: 分数项数组，每项包含 leaderboardId 和 score
     *
     * 返回值：
     * - success: 布尔值，表示是否提交成功
     */
    @PluginMethod
    public void submitScores(PluginCall call) {
        // 获取必填参数：分数项数组
        JSArray scores = call.getArray("scores");
        if (scores == null || scores.length() == 0) {
            call.reject("scores is required and cannot be empty");
            return;
        }

        // 解析分数项数组，构建 SDK 请求
        List<SubmitScoresRequest.ScoreItem> scoreItems = new ArrayList<>();
        try {
            for (int i = 0; i < scores.length(); i++) {
                // getJSONObject 返回 org.json.JSONObject，不是 com.getcapacitor.JSObject
                JSONObject item = scores.getJSONObject(i);
                String leaderboardId = item.getString("leaderboardId");
                int score = item.getInt("score");
                scoreItems.add(new SubmitScoresRequest.ScoreItem(leaderboardId, score));
            }
        } catch (Exception e) {
            call.reject("Invalid scores format: " + e.getMessage());
            return;
        }

        // 调用 TapTap SDK 批量提交分数
        TapTapLeaderboard.submitScores(scoreItems, new TapTapLeaderboardResponseCallback<SubmitScoresResponse>() {
            @Override
            public void onSuccess(SubmitScoresResponse result) {
                // 提交成功，构建返回数据
                JSObject ret = new JSObject();
                ret.put("success", true);
                call.resolve(ret);
            }

            @Override
            public void onFailure(int code, String message) {
                // 提交失败，返回错误信息
                call.reject("Submit scores failed: " + message);
            }
        });
    }

    /**
     * 展示排行榜 UI
     * 前端通过 Capacitor.registerPlugin('TapTapLeaderboard').showLeaderboard() 调用
     *
     * 前端调用参数：
     * - leaderboardId: 排行榜 ID
     */
    @PluginMethod
    public void showLeaderboard(PluginCall call) {
        // 获取必填参数：排行榜 ID
        String leaderboardId = call.getString("leaderboardId");
        if (leaderboardId == null || leaderboardId.isEmpty()) {
            call.reject("leaderboardId is required");
            return;
        }

        // 获取当前 Activity，用于 SDK 展示排行榜界面
        Activity activity = getActivity();
        if (activity == null) {
            call.reject("Activity is null");
            return;
        }

        // 调用 TapTap SDK 展示排行榜界面
        TapTapLeaderboard.openLeaderboard(activity, leaderboardId, "public");
        call.resolve();
    }
}
