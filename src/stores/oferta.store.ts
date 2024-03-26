// import type { Product } from '~/interfaces/product.interface';

interface ofertaState {
  isEdit: boolean;
  isEditIngrediente: boolean;
  oferta: {
    _id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    catalogo: string;
    producto: {
      _id: string;
      nombre: string;
      presentacionBasica: string;
      presentaciones: null[];
    };
    cantidad: number;
  };
  catalogoElegido: any;
}

export const ofertaStore = defineStore('oferta', {
  state: (): ofertaState => ({
    isEdit: false,
    isEditIngrediente: false,
    oferta: {
      _id: '',
      nombre: '',
      descripcion: '',
      precio: 0,
      catalogo: '',
      producto: {
        _id: '',
        nombre: '',
        presentacionBasica: '',
        presentaciones: [],
      },
      cantidad: 0,
    },
    catalogoElegido: null,
  }),
  persist: true,
});
