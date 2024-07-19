export default [
  {
    name: 'realizar-pedido',
    path: '/punto/realizar-pedido',
    file: '@/modulos/pedidos/infraestructura/realizarPedido/realizar-pedido.vue',
  },
  {
    name: 'lista-pedidos',
    path: '/punto/lista-pedidos',
    file: '@/modulos/pedidos/infraestructura/listaPedidos/lista-pedidos.vue',
  },
  {
    name: 'pedido',
    path: '/punto/pedido/:id',
    file: '@/modulos/pedidos/infraestructura/listaPedidos/[id].vue',
  },
];
