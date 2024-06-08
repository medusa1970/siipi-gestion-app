import type { Product, Producto } from '~/interfaces/product.interface';

export interface InventarioProps {
  id: string;
  nombre: string;
}
interface ProductState {
  product: Product;
  producto: Producto;
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
      categoria: { _id: '', nombre: '' },
    },
    producto: {
      _id: '',
      nombre: '',
      comentario: '',
      categoria: { _id: '', nombre: '' },
      imagen: '',
      variedades: [],
      empaques: [],
    },
    isEdit: false,
    ListInventario: [],
    ListInventarioPDF: [],
  }),
  persist: true,
});
