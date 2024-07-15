import fs from 'node:fs';
import path from 'node:path';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: 'src',
  devtools: {
    enabled: false,
  },
  ssr: false,
  typescript: {
    typeCheck: false,
    strict: false,
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/css/main.scss" as *;`,
        },
      },
    },
    resolve: {
      alias: {
        '@modulos': '/home/leo/Workspace/siipi-gestion-app/src/modulos',
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
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
    // and more...
  },
  quasar: {
    plugins: ['Notify', 'Dialog', 'Loading', 'LocalStorage', 'SessionStorage'],
    extras: { fontIcons: ['bootstrap-icons'] },
    lang: 'es',
  },
  runtimeConfig: {
    public: {
      GQL_HOST: process.env.GRAPH_URI,
      'graphql-client': {
        codegen: {
          silent: false,
          skipTypename: false,
          useTypeImports: true,
          dedupeFragments: true,
          onlyOperationTypes: false,
          avoidOptionals: false,
          disableOnBuild: false,
          maybeValue: 'T | null',
        },
        default: {
          clients: {
            host: process.env.GRAPH_URI,
            schema: 'schema/schema.gql',
          },
        },
      },
    },
  },
  // piniaPersistedstate: {
  //   cookieOptions: {
  //     sameSite: 'strict',
  //   },
  //   storage: 'localStorage',
  // },
  piniaPersistedstate: {
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
      /**
       * new : xxx/rutas.ts
       */
      const modulosPath2 = './src/modulos2/';
      const files2 = await fs.promises.readdir(modulosPath2);
      for (const file2 of files2) {
        const filePath2 = path.join(modulosPath2, file2);
        const stats2 = await fs.promises.stat(filePath2);
        if (stats2.isDirectory()) {
          const fullPath2 = path.join(__dirname, '/', filePath2, '/rutas.ts');
          if (fs.existsSync(fullPath2)) {
            const routes2 = await import(fullPath2);
            for (const route2 of routes2.default || []) {
              // console.log(route.name);
              pages.push(route2);
            }
          }
        }
      }

      /**
       * old : infraesrtructura/rutas.ts
       */
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
            const routes = await import(fullPath);
            for (const route of routes.default || []) {
              // console.log(route.name);
              pages.push(route);
            }
          }
        }
      }
      console.log(
        '\x1b[32m✔ \x1b[33m[Siipiges]\x1b[0m Creando las rutas dinamicas',
      );
    },
  },
});
