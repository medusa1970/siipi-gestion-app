/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/components/**/*.{vue,js}",
    "./src/layouts/**/*.vue",
    "./src/pages/**/*.vue",
    "./nuxt.config.{js,ts}",
    // Añade aquí tus rutas personalizadas
    "./src/modulos/**/*.{vue,js,ts}", // Esto incluye todos los archivos .vue, .js, y .ts en tu directorio personalizado
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F6921E",
        darkgray: "#808080",
      },
    },
  },
  plugins: [],
};
