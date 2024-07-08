export default [
  {
    name: 'productos',
    path: '/cathering/productos',
    file: '@/modulos/productos/infraestructura/paginas/productos.vue',
  },
  {
    name: 'producto',
    path: '/cathering/productos/:id',
    file: '@/modulos/productos/infraestructura/paginas/detalleProducto.vue',
  },
  {
    name: 'categorias',
    path: '/cathering/productos/categorias',
    file: '@/modulos/productos/infraestructura/paginas/categorias.vue',
  },
];
