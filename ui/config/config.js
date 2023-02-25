import { defineConfig } from 'umi'
import routes from './route.config'
import plugins from '../src/plugins'

export default defineConfig({
  routes: routes,
  locale: {
    // 默认使用 src/locales/zh-CN.ts 作为多语言文件
    // umi4配置locale需要安装@umi/plugins 并在plugins里进行配置
    default: 'zh-CN',
    baseSeparator: '-',
  },
  favicons: ['http://bluerosefantasy.com/map/favicon.ico'], // publicPath只对css, js生效，对 favicon 不生效
  plugins,
  proxy: {
    '/api': {
      // 标识需要进行转换的请求的url
      target: 'http://localhost:5000', // 服务端域名
      changeOrigin: true, // 允许域名进行转换
      pathRewrite: { '^/api': '' }, // 将请求url里的ci去掉
    },
  },
  // mfsu: false,
  mfsu: {
    shared: {
      react: {
        singleton: true,
      },
    },
  },
  base: '/map', // 部署HTML到非根目录
  publicPath: 'http://bluerosefantasy.com/map/',
  title: 'Map Diary',
})
