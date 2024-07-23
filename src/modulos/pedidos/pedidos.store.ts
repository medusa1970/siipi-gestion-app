import type { Producto } from '#gql';

interface PedidoState {
  listaPedido: Producto[];
  pedidosSolicitado: any[];
  pedidosDirecto: any[];
  isDespachar: boolean;
  areaPedidoID: string;
}

export const storePedido = defineStore('pedidos', {
  state: (): PedidoState => ({
    listaPedido: [],
    pedidosSolicitado: [],
    pedidosDirecto: [],
    isDespachar: false,
    areaPedidoID: '',
  }),

  getters: {},

  actions: {},

  persist: true,

  // persist: {
  //   paths: [],
  // },
});
