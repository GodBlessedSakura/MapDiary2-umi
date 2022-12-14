import { defineConfig } from 'umi'
import routes from './route.config'

export default defineConfig({
  routes: routes,
  mfsu: {
    shared: {
      react: {
        singleton: true,
      },
    },
  },
})
