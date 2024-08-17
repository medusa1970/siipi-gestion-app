import type { Oferta, Producto } from '#gql';

interface PedidoState {
  listaPedido: (Oferta & { cantidad: number })[];
  pedidosSolicitado: any[];
  pedidosDirecto: any[];
  isDespachar: boolean;
  area: {
    _id: string;
    nombre: string;
  };

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
    area: { _id: '', nombre: '' },
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
