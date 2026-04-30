import type { CapacitorConfig } from '@capacitor/cli';

// Capacitor 配置 - 用于将 Web 应用打包为 Android 原生应用
const config: CapacitorConfig = {
  // 应用唯一标识符，反向域名格式
  appId: 'com.moyu.nilaizijianghu',
  // 应用显示名称
  appName: '魔域',
  // Vite 构建输出目录，Capacitor 会从此目录同步 Web 资源到原生项目
  webDir: 'dist',
  // Android 平台特定配置
  android: {
    // 允许混合内容（HTTP + HTTPS），开发阶段可能需要
    allowMixedContent: true,
  },
  // 服务端配置
  server: {
    // Android 签名包使用 https，调试使用 http
    androidScheme: 'https',
    // live-reload 开发时连接的 Vite 开发服务器地址
    // 使用时通过 --live-reload --host 参数会自动覆盖此配置
    url: 'http://192.168.31.37:5173',
  },
  // 插件配置
  plugins: {},
};

export default config;
