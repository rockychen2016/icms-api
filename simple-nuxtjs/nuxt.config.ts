// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxt/eslint'],
  // 添加别名配置，确保可以找到本地包
  alias: {
    'icms-api': '../src/index.ts',
    '@icms-api/server': '../src/server.ts',
    '@icms-api/router': '../src/router.ts'
  },

  // 添加构建相关配置
  build: {
    transpile: [
      'icms-api',
      '@icms-api/server',
      '@icms-api/router'
    ]
  },

  runtimeConfig: {
    appKey:process.env.API_KEY,
    baseUrl:process.env.BASE_URL,
    userFrom:process.env.USER_FROM
  },

})