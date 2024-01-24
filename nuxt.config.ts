// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'src',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-quasar-ui',
    '@nuxt/image',
    'nuxt-graphql-client',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
  ],
  tailwindcss: {},
  quasar: {
    plugins: ['Notify', 'Dialog', 'Loading', 'LocalStorage', 'SessionStorage'],
    extras: { fontIcons: ['bootstrap-icons'] },
    lang: 'es',
  },
  runtimeConfig: {
    public: {
      GQL_HOST: process.env.GRAPH_SERVER,
    },
  },
  piniaPersistedstate: {
    cookieOptions: {
      sameSite: 'strict',
    },
    storage: 'localStorage',
  },
  router: {
    options: {
      scrollBehaviorType: 'smooth',
    },
  },
  devServer: {
    port: Number(process.env.PORT),
  },
});
