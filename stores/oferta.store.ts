// import type { Product } from '~/interfaces/product.interface';

interface ofertaState {
  isEdit: boolean;
  isEditIngrediente: boolean;
  oferta: any;
  catalogoElegido: any;
}

export const ofertaStore = defineStore('oferta', {
  state: (): ofertaState => ({
    isEdit: false,
    isEditIngrediente: false,
    oferta: null,
    catalogoElegido: null,
  }),
  persist: true,
});
