// import type { Product } from '~/interfaces/product.interface';
interface Producto {
  id: string;
  nombre: string;
  cantidad: number;
  edit: boolean;
}

interface PedidoState {
  listaPedido: Producto[];
  pedidosSolicitado: any[];
  pedidosDirecto: any[];
  isDespachar: boolean;
  areaPedidoID: string;
}

export const storePedido = defineStore('pedido', {
  state: (): PedidoState => ({
    listaPedido: [],
    pedidosSolicitado: [],
    pedidosDirecto: [],
    isDespachar: false,
    areaPedidoID: '',
  }),
  persist: true,
});
