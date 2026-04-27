import babel from '@rolldown/plugin-babel';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// 单文件打包配置：将所有 JS/CSS 内联到 HTML 中，可直接双击 index.html 打开
// 使用命令：npm run build:singlefile
export default defineConfig({
  base: './',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    // 将所有资源内联到单个 HTML 文件中
    viteSingleFile()
  ],
  server: {
    host: true,
    port: 5173
  }
});
