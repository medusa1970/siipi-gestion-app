/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './nuxt.config.{js,ts}',
    './src/modulos/**/*.{vue,js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F6921E',
        darkgray: '#808080',
      },
    },
  },
  debug: true, // Habilita la opción de depuración
  plugins: [],
};
