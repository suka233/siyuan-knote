import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import minimist from 'minimist'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import livereload from 'rollup-plugin-livereload'
import zipPack from 'vite-plugin-zip-pack'
import fg from 'fast-glob'
import UnoCSS from 'unocss/vite'

const args = minimist(process.argv.slice(2))
const isWatch = args.watch || args.w || false
const devDistDir = './dev'
const distDir = isWatch ? devDistDir : './dist'

console.log('isWatch=>', isWatch)
console.log('distDir=>', distDir)

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    viteStaticCopy({
      targets: [
        { src: './README*.md', dest: './' },
        { src: './icon.png', dest: './' },
        { src: './preview.png', dest: './' },
        { src: './plugin.json', dest: './' },
        { src: './src/i18n/**', dest: './i18n/' },
        { src: './img/**', dest: './img/' }
      ]
    }),
    UnoCSS()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      /**
       * @description 引入xmind解析功能的时候，打包的时候报了一些错误，需要手动添加以下polyfill
       * @see https://stackoverflow.com/questions/69286329/polyfill-node-os-module-with-vite-rollup-js/70666018#70666018
       */
      stream: 'stream-browserify',
      events: 'rollup-plugin-node-polyfills/polyfills/events'
    }
  },

  // https://github.com/vitejs/vite/issues/1930
  // https://vitejs.dev/guide/env-and-mode.html#env-files
  // https://github.com/vitejs/vite/discussions/3058#discussioncomment-2115319
  // 在这里自定义变量
  // 解决在浏览器环境下报错referenceerror: process is not defined的问题
  define: {
    'process.env.NODE_ENV': "'development'"
  },

  build: {
    // 输出路径
    outDir: distDir,
    emptyOutDir: false,

    // 构建后是否生成 source map 文件
    sourcemap: false,

    // 设置为 false 可以禁用最小化混淆
    // 或是用来指定是应用哪种混淆器
    // boolean | 'terser' | 'esbuild'
    // 不压缩，用于调试
    minify: !isWatch,

    lib: {
      entry: 'src/index.ts',
      // the proper extensions will be added
      fileName: 'index',
      formats: ['cjs']
    },
    rollupOptions: {
      plugins: isWatch
        ? [
            livereload(devDistDir),
            {
              //监听静态资源文件
              name: 'watch-external',
              async buildStart() {
                const files = await fg(['src/i18n/*.json', './README*.md', './plugin.json'])
                for (const file of files) {
                  this.addWatchFile(file)
                }
              }
            }
          ]
        : [
            zipPack({
              inDir: './dist',
              outDir: './',
              outFileName: 'package.zip'
            })
          ],
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['siyuan', 'process'],
      // @ts-ignore
      output: {
        entryFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'index.css'
          }
        },
        manualChunks: undefined
      }
    }
  }
})
