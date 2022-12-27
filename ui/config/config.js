import { defineConfig } from 'umi'
import routes from './route.config'
import plugins from '../src/plugins'

export default defineConfig({
  routes: routes,
  plugins,
  proxy: {
    '/api': {
      // 标识需要进行转换的请求的url
      target: 'http://localhost:5000', // 服务端域名
      changeOrigin: true, // 允许域名进行转换
      pathRewrite: { '^/api': '' }, // 将请求url里的ci去掉
    },
  },
  mfsu: {
    shared: {
      react: {
        singleton: true,
      },
    },
  },
})
