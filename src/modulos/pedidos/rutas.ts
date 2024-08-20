export default [
  // PUNTOS
  {
    name: 'realizarPedido',
    path: '/punto/realizarPedido',
    file: '@/modulos/pedidos/paginas/realizarPedido/realizarPedido.vue'
  },
  {
    name: 'misPedidos',
    path: '/punto/misPedidos',
    file: '@/modulos/pedidos/paginas/misPedidos/misPedidos.vue'
  },
  {
    name: 'pedidoID',
    path: '/punto/misPedidos/:id',
    file: '@/modulos/pedidos/paginas/misPedidos/[id]/[id].vue'
  },
  // CATHERING
  {
    name: 'listaPedidos',
    path: '/cathering/listaPedidos',
    file: '@/modulos/pedidos/paginas/listaPedidos/listaPedidos.vue'
  },
  {
    name: 'pedido',
    path: '/cathering/listaPedidos/:id',
    file: '@/modulos/pedidos/paginas/listaPedidos/[id]/[id].vue'
  },
  {
    name: 'recibirPedidos',
    path: '/cathering/recibirPedidos',
    file: '@/modulos/pedidos/paginas/recibirPedidos/recibirPedidos.vue'
  },
  {
    name: 'despacharPedidos',
    path: '/cathering/despacharPedidos',
    file: '@/modulos/pedidos/paginas/despacharPedidos/despacharPedidos.vue'
  }
];
