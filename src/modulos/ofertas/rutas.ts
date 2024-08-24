export default [
  {
    name: 'ofertas',
    path: '/cathering/ofertas/:id',
    file: '@/modulos/ofertas/paginas/ofertas/ofertas.vue'
  },
  {
    name: 'oferta',
    path: '/cathering/oferta/:id',
    file: '@/modulos/ofertas/paginas/ofertaDetalle/ofertaDetalle.vue'
  },
  {
    name: 'catalogos',
    path: '/cathering/catalogos',
    file: '@/modulos/ofertas/paginas/catalogos/catalogos.vue'
  },
  {
    name: 'catalogo',
    path: '/cathering/catalogos/:id',
    file: '@/modulos/ofertas/paginas/catalogos/catalogo.vue'
  },
  {
    name: 'hacerPedido',
    path: '/pedido',
    file: '@/modulos/ofertas/paginas/pedido/pedido.vue'
  },
  {
    name: 'pedidoRecibir',
    path: '/pedidoRecibir/:area',
    file: '@/modulos/ofertas/paginas/pedidoRecibir/pedidoRecibir.vue'
  },
  {
    name: 'pedidoDespachar',
    path: '/pedidoDespachar/:area',
    file: '@/modulos/ofertas/paginas/pedidoDespachar/pedidoDespachar.vue'
  }
];
