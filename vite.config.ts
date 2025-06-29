
import type { UserConfig, ConfigEnv } from 'vite';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from "path";
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
//https://github.com/element-plus/unplugin-element-plus/blob/HEAD/README.zh-CN.md
import ElementPlus from 'unplugin-element-plus/vite'
export default defineConfig(({ command, mode }: ConfigEnv): UserConfig => {

  // const env = loadEnv(mode, process.cwd(), '')
  console.log(command, mode);
  return {
    plugins: [vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    ElementPlus({
      // useSource: true
    })
    ],
    publicDir: "public",
    base: "./",
    server: {
      host: '0.0.0.0',
      port: 8911,
      open: false,
      strictPort: false,
      proxy: {
        '/aggregate_gpu_utilization': {
          target: 'http://120.220.95.189:8908',
          changeOrigin: true,
          rewrite: (path) => path,
          // 如果需要，可以添加更多配置
          //secure: false, // 如果是https接口，需要配置这个参数
          // ws: true, // 如果要代理websockets
        }
      }
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "./src"),
        "components": resolve(__dirname, "./src/components"),
        "api": resolve(__dirname, "./src/api"),
      },
    },
    css: {
      // css预处理器
      preprocessorOptions: {
        scss: {
          // charset: false,
          additionalData: `@use "./src/assets/css/variable.scss" as *;`,
        },
      },
    },
    build: {
      outDir: 'dist',
    },
  }

})