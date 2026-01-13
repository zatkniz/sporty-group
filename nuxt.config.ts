// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  modules: ['@nuxt/ui', '@pinia/nuxt', '@vueuse/nuxt'],
  
  css: ['~/assets/css/main.css'],

  ui: {
    icons: ['lucide']
  },

  runtimeConfig: {
    theSportsDbApiKey: process.env.THESPORTSDB_API_KEY || '3',
    public: {
      theSportsDbBaseUrl: 'https://www.thesportsdb.com/api/v1/json',
      theSportsDbApiKey: process.env.THESPORTSDB_API_KEY || '3'
    }
  }
})