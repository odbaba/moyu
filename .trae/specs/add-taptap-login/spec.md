# TapTap 登录集成 Spec

## Why
项目已有 TapTap SDK 初始化和 Capacitor 插件框架，但 Android 原生层的登录实现是占位代码，前端也没有登录界面。需要完整实现 TapTap 登录功能，让用户可以使用 TapTap 账号登录游戏，实现账号数据关联。

## What Changes
- 完善 Android 原生层 `TapTapLoginPlugin.java` 的登录/登出实现
- 扩展前端 `TapTapLogin.ts` 接口，增加登录状态检测和用户信息获取
- 在封面页 `CoverPage.tsx` 添加 TapTap 登录按钮和登录状态显示
- 新增登录状态管理 Hook `useTapTapLogin.ts`
- 更新存档系统，支持与 TapTap 账号关联

## Impact
- Affected specs: 封面页、存档系统
- Affected code:
  - `android/app/src/main/java/com/moyu/nilaizijianghu/TapTapLoginPlugin.java`
  - `src/plugins/TapTapLogin.ts`
  - `src/components/cover/CoverPage.tsx`
  - `src/hooks/useTapTapLogin.ts` (新增)
  - `src/utils/saveUtils.ts`

## ADDED Requirements

### Requirement: TapTap 登录功能
系统应提供完整的 TapTap 登录功能，包括登录、登出、登录状态检测和用户信息获取。

#### Scenario: 用户首次登录
- **WHEN** 用户在封面页点击"TapTap 登录"按钮
- **THEN** 系统调用 TapTap SDK 发起登录流程
- **AND** 登录成功后显示用户昵称和头像
- **AND** 保存登录状态到本地存储

#### Scenario: 用户取消登录
- **WHEN** 用户在 TapTap 登录界面取消登录
- **THEN** 系统返回封面页，显示未登录状态
- **AND** 提示用户"登录已取消"

#### Scenario: 登录失败
- **WHEN** TapTap 登录过程中发生错误
- **THEN** 系统显示错误提示信息
- **AND** 允许用户重试登录

#### Scenario: 已登录用户启动游戏
- **WHEN** 已登录用户启动游戏
- **THEN** 系统自动检测登录状态
- **AND** 显示用户昵称和头像
- **AND** 允许用户直接进入游戏

#### Scenario: 用户登出
- **WHEN** 已登录用户点击"退出登录"按钮
- **THEN** 系统调用 TapTap SDK 登出
- **AND** 清除本地登录状态
- **AND** 返回未登录状态

### Requirement: 存档与账号关联
系统应支持游戏存档与 TapTap 账号关联，确保不同账号的存档数据独立。

#### Scenario: 保存游戏进度
- **WHEN** 用户保存游戏进度
- **THEN** 系统将存档数据与当前 TapTap 用户 ID 关联
- **AND** 存档数据包含用户 ID 标识

#### Scenario: 加载游戏进度
- **WHEN** 已登录用户加载游戏进度
- **THEN** 系统加载与当前用户 ID 关联的存档数据
- **AND** 如果没有关联存档，提示用户开始新游戏

### Requirement: 离线模式支持
系统应支持在未登录 TapTap 账号的情况下进行游戏。

#### Scenario: 未登录用户开始游戏
- **WHEN** 用户未登录 TapTap 账号但点击"开始游戏"
- **THEN** 系统允许用户以游客身份进入游戏
- **AND** 存档数据不与任何账号关联

#### Scenario: 游客用户登录 TapTap
- **WHEN** 游客用户在游戏中登录 TapTap 账号
- **THEN** 系统将当前游戏进度与新登录的账号关联

## MODIFIED Requirements

### Requirement: 封面页界面
封面页需要显示 TapTap 登录状态和登录按钮。

**原有功能**：显示游戏标题、开始游戏按钮、继续游戏按钮

**新增功能**：
- 显示 TapTap 登录状态（已登录显示用户信息，未登录显示登录按钮）
- 已登录时显示用户头像和昵称
- 已登录时提供"退出登录"按钮

## Technical Design

### Android 原生层实现

```java
// TapTapLoginPlugin.java 核心实现
@PluginMethod
public void login(PluginCall call) {
    Activity activity = getActivity();
    if (activity == null) {
        call.reject("Activity is null");
        return;
    }
    
    String[] scopes = new String[]{Scopes.SCOPE_PUBLIC_PROFILE};
    TapTapLogin.loginWithScopes(activity, scopes, new TapTapCallback<TapTapAccount>() {
        @Override
        public void onSuccess(TapTapAccount account) {
            JSObject ret = new JSObject();
            ret.put("accessToken", account.getAccessToken());
            ret.put("userId", account.getUnionId());
            ret.put("name", account.getName());
            ret.put("avatar", account.getAvatar());
            call.resolve(ret);
        }
        
        @Override
        public void onFail(TapTapException exception) {
            call.reject("Login failed: " + exception.getMessage());
        }
        
        @Override
        public void onCancel() {
            call.reject("Login cancelled");
        }
    });
}
```

### 前端接口扩展

```typescript
// TapTapLogin.ts 扩展接口
export interface TapTapLoginPlugin {
  login(): Promise<TapTapUserInfo>;
  logout(): Promise<void>;
  isLoggedIn(): Promise<boolean>;
  getCurrentUser(): Promise<TapTapUserInfo | null>;
}

export interface TapTapUserInfo {
  accessToken: string;
  userId: string;
  name: string;
  avatar: string;
}
```

### 登录状态管理 Hook

```typescript
// useTapTapLogin.ts
export function useTapTapLogin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<TapTapUserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // 登录、登出、状态检测等方法
}
```
