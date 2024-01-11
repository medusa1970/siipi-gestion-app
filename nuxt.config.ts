// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
      GQL_HOST: 'http://localhost:3000/graphql', // overwritten by process.env.GQL_HOST
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
});
