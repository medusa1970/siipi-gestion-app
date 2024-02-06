import type { Product } from '~/interfaces/product.interface';

export interface InventarioProps {
  id: string;
  nombre: string;
}
interface ProductState {
  product: Product;
  isEdit: boolean;
  ListInventario: InventarioProps[];
  ListInventarioPDF: Array<Object>;
}

export const productStore = defineStore('product', {
  state: (): ProductState => ({
    product: {
      _id: '',
      nombre: '',
      comentario: '',
      presentacionBasica: '',
      presentaciones: [],
    },
    isEdit: false,
    ListInventario: [],
    ListInventarioPDF: [],
  }),
  persist: true,
});
