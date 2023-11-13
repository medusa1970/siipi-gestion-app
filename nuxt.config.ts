// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-quasar-ui',
    '@nuxt/image',
    'nuxt-graphql-client'
  ],
  tailwindcss: {},
  runtimeConfig: {
    public: {
      GQL_HOST: 'http://localhost:3000/graphql' // overwritten by process.env.GQL_HOST
    }
  }
});
