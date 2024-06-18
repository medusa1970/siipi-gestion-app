interface ofertaState {
  isEdit: boolean;
  isEditIngrediente: boolean;
  oferta: {
    _id: string;
    nombre: string;
    abreviacion: string;
    descripcion: string;
    precio: number;
    catalogo: string;
    idIngrediente: string;
    producto: {
      _id: string;
      nombre: string;
      presentacionBasica: string;
      presentaciones: null[];
    };
    cantidad: number;
    imagen: string;
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
      abreviacion: '',
      descripcion: '',
      precio: 0,
      catalogo: '',
      idIngrediente: '',
      producto: {
        _id: '',
        nombre: '',
        presentacionBasica: '',
        presentaciones: [],
      },
      cantidad: 0,
      imagen: '',
    },
    catalogoElegido: null,
  }),
  persist: true,
});
