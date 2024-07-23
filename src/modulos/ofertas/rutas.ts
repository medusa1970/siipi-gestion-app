export default [
  {
    name: 'ofertas',
    path: '/cathering/ofertas',
    file: '@/modulos/ofertas/paginas/ofertas/ofertas.vue',
  },
  {
    name: 'oferta',
    path: '/cathering/ofertas/:id',
    file: '@/modulos/ofertas/paginas/ofertaDetalle/ofertaDetalle.vue',
  },
  {
    name: 'catalogos',
    path: '/cathering/catalogos',
    file: '@/modulos/ofertas/paginas/catalogos/catalogos.vue',
  },
  {
    name: 'catalogos-id',
    path: '/cathering/catalogos/:id',
    file: '@/modulos/ofertas/paginas/catalogoDetalle/catalogoDetalle.vue',
  },
];
