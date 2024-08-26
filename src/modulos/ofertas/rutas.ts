export default [
  {
    name: 'ofertas',
    path: '/cathering/ofertas/:area',
    file: '@/modulos/ofertas/paginas/ofertas/ofertas.vue'
  },
  {
    name: 'oferta',
    path: '/cathering/oferta/:id',
    file: '@/modulos/ofertas/paginas/ofertaDetalle/ofertaDetalle.vue'
  },
  {
    name: 'catalogos',
    path: '/cathering/catalogos/:area',
    file: '@/modulos/ofertas/paginas/catalogos/catalogos.vue'
  },
  {
    name: 'hacerPedido',
    path: '/pedido',
    file: '@/modulos/ofertas/paginas/pedido/pedido.vue'
  },
  {
    name: 'pedidoRecibir',
    path: '/recibir/:area',
    file: '@/modulos/ofertas/paginas/pedidoArea/pedidoRecibir.vue'
  },
  {
    name: 'pedidoDespachar',
    path: '/despachar/:area',
    file: '@/modulos/ofertas/paginas/pedidoArea/pedidoDespachar.vue'
  }
];
