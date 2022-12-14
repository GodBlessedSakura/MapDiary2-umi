import { defineConfig } from 'umi'
import routes from './route.config'
import plugins from '../src/plugins'

export default defineConfig({
  routes: routes,
  plugins,
  mfsu: {
    shared: {
      react: {
        singleton: true,
      },
    },
  },
})
