import type { CrearEntidadDto } from '#gql';

export interface InventarioProps {
  id: string;
  nombre: string;
}

interface AlmacenStoreProps {
  ListInventario: InventarioProps[];
  ListInventarioPDF: Array<Object>;
}

export const storeAlmacen = defineStore('almacen', {
  state: (): AlmacenStoreProps => ({
    ListInventario: [],
    ListInventarioPDF: [],
  }),

  getters: {},

  actions: {},

  persist: {
    paths: [],
  },
});
