# TapTap 排行榜集成 Spec

## Why
项目已接入 TapTap 登录 SDK，但缺少排行榜功能。需要集成 TapTap 排行榜 SDK，让玩家可以上传分数和查看排行榜，增加游戏社交竞争性。

## What Changes
- 在 Android `build.gradle` 添加 `tap-leaderboard:4.10.1` 依赖
- 新增 Android 原生层 `TapTapLeaderboardPlugin.java` Capacitor 插件，桥接排行榜 API
- 在 `MainActivity.java` 注册新插件
- 新增前端 `TapTapLeaderboard.ts` 接口定义
- 新增前端 `useTapTapLeaderboard.ts` Hook
- 封面页增加"查看排行榜"按钮（已登录亮起，未登录置灰）
- 结算页增加"上传分数"按钮（已登录时显示）
- 更新 `cover.css` 和 `game-ending.css` 样式

## Impact
- Affected specs: 封面页、结算页
- Affected code:
  - `android/app/build.gradle`
  - `android/app/src/main/java/com/moyu/nilaizijianghu/MainActivity.java`
  - `android/app/src/main/java/com/moyu/nilaizijianghu/TapTapLeaderboardPlugin.java` (新增)
  - `src/plugins/TapTapLeaderboard.ts` (新增)
  - `src/hooks/useTapTapLeaderboard.ts` (新增)
  - `src/components/cover/CoverPage.tsx`
  - `src/components/cover/cover.css`
  - `src/components/game-ending/GameEndingPage.tsx`
  - `src/components/game-ending/game-ending.css`

## ADDED Requirements

### Requirement: 排行榜功能
系统应提供 TapTap 排行榜功能，包括上传分数和查看排行榜。

排行榜 ID 为 `t5b9jle8a16emsex4r`。

#### Scenario: 已登录用户查看排行榜
- **WHEN** 已登录用户在封面页点击"查看排行榜"按钮
- **THEN** 系统调用 TapTap SDK 展示排行榜 UI
- **AND** 显示所有玩家的排名和分数

#### Scenario: 未登录用户查看排行榜
- **WHEN** 未登录用户看到"查看排行榜"按钮
- **THEN** 按钮显示为置灰状态
- **AND** 点击按钮无响应

#### Scenario: 已登录用户上传分数
- **WHEN** 已登录用户在结算页点击"上传分数"按钮
- **THEN** 系统将当前玩家的综合评分上传到 TapTap 排行榜
- **AND** 上传成功后提示"分数上传成功"
- **AND** 上传失败后提示错误信息

#### Scenario: 未登录用户上传分数
- **WHEN** 未登录用户在结算页看到"上传分数"按钮
- **THEN** 按钮不显示（排行榜功能仅在原生平台且已登录时可见）

### Requirement: 排行榜按钮 UI
封面页需要增加"查看排行榜"按钮，根据登录状态控制按钮可用性。

#### Scenario: 已登录状态
- **WHEN** 用户已登录 TapTap 账号
- **THEN** "查看排行榜"按钮亮起，可点击

#### Scenario: 未登录状态
- **WHEN** 用户未登录 TapTap 账号
- **THEN** "查看排行榜"按钮置灰，不可点击

### Requirement: 结算页上传分数
结算页需要增加"上传分数"按钮，允许玩家将综合评分上传到排行榜。

#### Scenario: 上传综合评分
- **WHEN** 玩家在结算页点击"上传分数"
- **THEN** 系统使用 `overall.maxPrice`（获得最高评价的数量）作为分数上传
- **AND** 上传到排行榜 ID 为 `t5b9jle8a16emsex4r` 的排行榜

## Technical Design

### Android 原生层

```java
// TapTapLeaderboardPlugin.java
@PluginMethod
public void submitScore(PluginCall call) {
    String leaderboardId = call.getString("leaderboardId");
    int score = call.getInt("score");
    
    List<SubmitScoresRequest.ScoreItem> scoreItems = new ArrayList<>();
    scoreItems.add(new SubmitScoresRequest.ScoreItem(leaderboardId, score));
    
    TapTapLeaderboard.submitScores(scoreItems, new TapTapCallback<SubmitScoresResult>() {
        @Override
        public void onSuccess(SubmitScoresResult result) {
            JSObject ret = new JSObject();
            ret.put("success", true);
            call.resolve(ret);
        }
        @Override
        public void onFail(TapTapException exception) {
            call.reject("Submit score failed: " + exception.getMessage());
        }
    });
}

@PluginMethod
public void showLeaderboard(PluginCall call) {
    String leaderboardId = call.getString("leaderboardId");
    TapTapLeaderboard.showLeaderboard(getActivity(), leaderboardId);
    call.resolve();
}
```

### 前端接口

```typescript
export interface TapTapLeaderboardPlugin {
  submitScore(options: { leaderboardId: string; score: number }): Promise<{ success: boolean }>;
  showLeaderboard(options: { leaderboardId: string }): Promise<void>;
}
```

### 上传分数说明
游戏结算的 `overall.maxPrice` 表示8个维度中获得最高评价的数量，范围 0-8，适合作为排行榜分数。
