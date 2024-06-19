import fs from 'node:fs';
import path from 'node:path';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'src',
  devtools: { enabled: false },
  // css: ['~/assets/css/main.css'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/css/main.scss" as *;`,
        },
      },
    },
  },
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
      GQL_HOST: process.env.GRAPH_URI,
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
    // host: '0.0.0.0',
    port: Number(process.env.PORT),
  },
  hooks: {
    'pages:extend': async (pages: any) => {
      const modulosPath = './src/modulos/';
      const files = await fs.promises.readdir(modulosPath);
      for (const file of files) {
        const filePath = path.join(modulosPath, file);
        const stats = await fs.promises.stat(filePath);
        if (stats.isDirectory()) {
          const fullPath = path.join(
            __dirname,
            '/',
            filePath,
            '/infraestructura/rutas.ts',
          );
          if (fs.existsSync(fullPath)) {
            console.log('creating routes for module', file);
            const routes = await import(fullPath);
            for (const route of routes.default || []) {
              // console.log(route.name);
              pages.push(route);
            }
          }
        }
      }
    },
  },
});
