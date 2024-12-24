import { type UserConfigExport, type ConfigEnv, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default (configEnv: ConfigEnv): UserConfigExport => {
  const viteEnv = loadEnv(configEnv.mode, process.cwd());
  const { VITE_PUBLIC_PATH } = viteEnv;
  return {
    base: VITE_PUBLIC_PATH,
    resolve: {
      // 统一地址前缀
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          silenceDeprecations: ['legacy-js-api']
        }
      }
    },
    server: {
      host: true,
      // 设置端口号
      port: 5173,
      // 允许跨域访问
      cors: true,
      // 不自动打开浏览器
      open: false,
      // 端口被占用时，不直接退出
      strictPort: false,
      // 预热常用文件
      warmup: {
        clientFiles: ['./src/{views,components}/**/*.{vue,ts}']
      }
    },
    plugins: [vue()],
    build: {
      chunkSizeWarningLimit: 2048,
      // 是否将CSS提取成一个单独的文件
      cssCodeSplit: true,
      // 是否压缩代码
      minify: true
    }
  };
};
