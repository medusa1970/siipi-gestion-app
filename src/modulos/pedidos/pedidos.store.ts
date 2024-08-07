import type { Producto } from '#gql';

interface PedidoState {
  listaPedido: Producto[];
  pedidosSolicitado: any[];
  pedidosDirecto: any[];
  isDespachar: boolean;
  areaPedidoID: string;

  // NUEVOS
  pedidosAceptados: [];
  pedidosSinAceptar: [];
  pedidosRecibidos: [];
}

export const storePedido = defineStore('pedidos', {
  state: (): PedidoState => ({
    listaPedido: [],
    pedidosSolicitado: [],
    pedidosDirecto: [],
    isDespachar: false,
    areaPedidoID: '',
    pedidosAceptados: [],
    pedidosSinAceptar: [],
    pedidosRecibidos: []
  }),

  getters: {},

  actions: {},

  persist: true

  // persist: {
  //   paths: [],
  // },
});
