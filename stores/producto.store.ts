import type { Product } from '~/interfaces/product.interface';

interface ProductState {
  product: Product;
  isEdit: boolean;
}

export const productStore = defineStore('product', {
  state: (): ProductState => ({
    product: {
      _id: '',
      nombre: '',
      descripcion: '',
      tags: [],
      presentacionBasica: '',
      presentaciones: []
    },
    isEdit: false
  }),
  persist: true
});
