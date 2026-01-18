
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-01-19',
  modules: ['@nuxt/eslint'],
  // 添加别名配置，确保可以找到本地包
  alias: {
    'icms-api': '../src/index.ts',
    '@icms-api/server': '../src/server.ts',
  },
  // 添加构建相关配置
  build: {
    transpile: [
      'icms-api',
      '@icms-api/server'
    ]
  },
  vite: {
    define: {
      __dirname: 'import.meta.dirname'
    }
  }
})