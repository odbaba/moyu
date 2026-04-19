import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  // 使用相对路径，确保打包后可以在任何静态服务器上正常运行
  base: './',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server: {
    host: true, // 绑定到所有网络接口
    port: 5173 // 可选，指定端口
  }
});
