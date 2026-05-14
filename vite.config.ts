import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import eslint from 'vite-plugin-eslint'

export default defineConfig({
  plugins: [
    vue(),
    eslint(),
    legacy({
      targets: ['chrome 69'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime']
    })
  ],
  resolve: {
    alias: [{ find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) }]
  },
  server: {
    port: 8080,
    proxy: {
      '/jaxrpc-DBQuest': {
        target: 'http://10.248.62.211:8080',
        changeOrigin: true
      },
      '/excel-proc': {
        target: 'http://10.248.62.211:8080',
        changeOrigin: true
      },
      '/WebUtil': {
        target: 'http://10.248.62.211:8080',
        changeOrigin: true
      },
      '/PFP': {
        target: 'http://10.248.62.211:8080',
        changeOrigin: true
      }
    }
  }
})
