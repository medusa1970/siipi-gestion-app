// import type { Product } from '~/interfaces/product.interface';
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
}

export const pedidoStore = defineStore('pedido', {
  state: (): PedidoState => ({
    listaPedido: [],
  }),
  persist: true,
});
