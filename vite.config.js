import {defineConfig} from 'vite'

export default defineConfig({
  build: {
    target: 'es2020',
    drop  : ['console', 'debugger']
  },
  resolve: {
    alias: {
      '@'      : '/src',
      '@engine': '/src/lib/engine',
    },
  },
})