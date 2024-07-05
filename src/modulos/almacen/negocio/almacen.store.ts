import type { CrearEntidadDto } from '#gql';

interface AlmacenStoreProps {}

export const storeAlmacen = defineStore('almacen', {
  state: (): AlmacenStoreProps => ({}),

  getters: {},

  actions: {},

  persist: {
    paths: [],
  },
});
