interface Producto {
  id: string;
  nombre: string;
  cantidad: number;
  edit: boolean;
}
interface Lista {
  nombre: string;
  productos: Producto[];
}
interface PedidoState {
  listaPedido: Producto[];
  pedidosSolicitado: any[];
  pedidosDirecto: any[];
  isDespachar: boolean;
  areaPedidoID: string;
}

export const pedidoStore = defineStore('pedido', {
  state: (): PedidoState => ({
    listaPedido: [],
    pedidosSolicitado: [],
    pedidosDirecto: [],
    isDespachar: false,
    areaPedidoID: '',
  }),
  persist: true,
});
